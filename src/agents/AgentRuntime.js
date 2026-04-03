/**
 * AgentRuntime.js
 * Agent execution engine — activates agents, runs skills, tracks status via Zustand store.
 * Integrates with MessageBus for inter-agent communication and SkillLoader for mock execution.
 */

import useStore from '../store/useStore';
import { AGENTS, getAgent } from './AgentRegistry';
import { MessageBus, MESSAGE_TYPES } from './MessageBus';
import { SkillLoader } from './SkillLoader';

// ── Status constants ───────────────────────────────────────────

export const AGENT_STATUS = {
  IDLE: 'idle',
  THINKING: 'thinking',
  EXECUTING: 'executing',
  WAITING_APPROVAL: 'waiting_approval',
  ERROR: 'error',
};

// ── Internal helpers ───────────────────────────────────────────

/** Pick the best skill for a task from the agent's skill list */
function selectSkill(agent, task) {
  // If the task explicitly names a skill, use it
  if (task.skill && agent.skills.includes(task.skill)) {
    return task.skill;
  }
  // If a category is given, pick the first skill in that category
  if (task.category) {
    const match = agent.skills.find((s) => {
      const def = SkillLoader.getSkill(s);
      return def && def.category === task.category;
    });
    if (match) return match;
  }
  // Default: first skill
  return agent.skills[0] || null;
}

/** Read memory context from store for the agent */
function readMemoryContext() {
  const state = useStore.getState();
  return {
    client: state.currentClient || 'Medglobal',
    campaign: state.currentCampaign || null,
    role: state.currentRole || 'owner',
    persistentMemory: state.freyaMemory || null,
  };
}

/** Write an agent result into the store's agent activity log */
function writeResultToStore(result) {
  const state = useStore.getState();
  const log = state.agentActivityLog || [];
  useStore.setState({
    agentActivityLog: [
      {
        id: `activity_${Date.now()}`,
        agentId: result.agentId,
        skill: result.skill,
        summary: typeof result.output?.data === 'object'
          ? (result.output.data.strategy || result.output.data.content || 'Task completed').slice(0, 120)
          : 'Task completed',
        creditsUsed: result.creditsUsed,
        timestamp: result.timestamp,
      },
      ...log,
    ].slice(0, 100),
  });
}

/** Update an agent's status in the store */
function setAgentStatus(agentId, status, taskSummary = null) {
  const state = useStore.getState();
  const statuses = state.agentStatuses || {};
  useStore.setState({
    agentStatuses: {
      ...statuses,
      [agentId]: { status, taskSummary, updatedAt: Date.now() },
    },
  });
}

// ── Active task map (for cancellation) ─────────────────────────

const _activeTasks = new Map(); // agentId -> { cancel: Function, promise: Promise }

// ── Pending actions for approval ───────────────────────────────

const _pendingActions = {};
let _actionCounter = 0;

// ── Suggested follow-up actions (mock) ─────────────────────────

function _suggestActions(agent, skillName) {
  const base = [
    { label: 'View full output', action: 'view_output' },
    { label: 'Save to knowledge base', action: 'save_to_kb' },
  ];
  if (agent.role === 'specialist') {
    base.push({ label: 'Send to Freya for review', action: 'escalate_to_freya' });
  }
  if (agent.canDelegate.length > 0) {
    base.push({ label: `Delegate to ${agent.canDelegate[0]}`, action: `delegate_${agent.canDelegate[0]}` });
  }
  return base;
}

// ── Public API ──────────────────────────────────────────────────

/**
 * Activate an agent on a task.
 * @param {string} agentId
 * @param {{ skill?: string, category?: string, input?: object, description?: string }} task
 * @param {object} [context] - optional additional context
 * @returns {Promise<object>} result object
 */
export function activateAgent(agentId, task = {}, context = {}) {
  const agent = AGENTS[agentId];
  if (!agent) {
    return Promise.reject(new Error(`Agent not found: ${agentId}`));
  }

  let cancelled = false;

  const promise = new Promise(async (resolve, reject) => {
    try {
      // 1. Set status -> thinking
      setAgentStatus(agentId, AGENT_STATUS.THINKING, task.description || 'Analyzing task...');

      // 2. Read memory context
      const memoryCtx = readMemoryContext();
      const mergedContext = { ...memoryCtx, ...context };

      // Small "thinking" delay
      await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
      if (cancelled) return resolve(null);

      // 3. Select skill
      const skillName = selectSkill(agent, task);
      if (!skillName) {
        setAgentStatus(agentId, AGENT_STATUS.ERROR, 'No matching skill found');
        return reject(new Error(`No skill matched for agent ${agentId}`));
      }

      // 4. Set status -> executing
      setAgentStatus(agentId, AGENT_STATUS.EXECUTING, `Running ${skillName}...`);

      // 5. Execute skill (mock, 1.5-3s)
      const skillResult = await SkillLoader.executeSkill(skillName, task.input || {}, mergedContext);
      if (cancelled) return resolve(null);

      // 6. Build result
      const result = {
        agentId,
        skill: skillName,
        output: skillResult,
        confidence: 0.7 + Math.random() * 0.25, // 0.70 - 0.95
        actions: _suggestActions(agent, skillName),
        creditsUsed: skillResult.creditCost || 0,
        timestamp: Date.now(),
      };

      // 7. Write result to store (memory)
      writeResultToStore(result);

      // 8. Send result message via MessageBus
      MessageBus.send({
        from: agentId,
        to: 'freya', // results always go to orchestrator
        type: MESSAGE_TYPES.TASK_RESULT,
        payload: {
          skill: skillName,
          summary: result.output?.data?.strategy || result.output?.data?.content || 'Completed',
          creditsUsed: result.creditsUsed,
          confidence: result.confidence,
        },
      });

      // 9. Set status -> idle
      setAgentStatus(agentId, AGENT_STATUS.IDLE);

      resolve(result);
    } catch (err) {
      setAgentStatus(agentId, AGENT_STATUS.ERROR, err.message);
      reject(err);
    } finally {
      _activeTasks.delete(agentId);
    }
  });

  _activeTasks.set(agentId, {
    cancel: () => { cancelled = true; },
    promise,
  });

  return promise;
}

/**
 * Get an agent's current status from the store.
 */
export function getAgentStatus(agentId) {
  const state = useStore.getState();
  const statuses = state.agentStatuses || {};
  const storeStatus = statuses[agentId];
  const agent = getAgent(agentId);
  return {
    agentId,
    name: agent?.displayName || agentId,
    status: storeStatus?.status || AGENT_STATUS.IDLE,
    taskSummary: storeStatus?.taskSummary || null,
    updatedAt: storeStatus?.updatedAt || null,
  };
}

/**
 * Get status of all agents.
 */
export function getAllAgentStatuses() {
  return Object.keys(AGENTS).map(getAgentStatus);
}

/**
 * Cancel a running agent task.
 */
export function cancelAgent(agentId) {
  const active = _activeTasks.get(agentId);
  if (active) {
    active.cancel();
    _activeTasks.delete(agentId);
    setAgentStatus(agentId, AGENT_STATUS.IDLE, 'Cancelled');
  }
}

/**
 * Check if an agent is currently running a task.
 */
export function isAgentBusy(agentId) {
  return _activeTasks.has(agentId);
}

/**
 * Get all active agent IDs.
 */
export function getActiveAgents() {
  return [..._activeTasks.keys()];
}

/**
 * Create a pending action that requires human approval.
 */
export function createPendingAction(agentId, action, context = {}) {
  const actionId = `action_${++_actionCounter}`;
  _pendingActions[actionId] = {
    id: actionId,
    agentId,
    action,
    context,
    status: 'pending',
    createdAt: Date.now(),
  };

  setAgentStatus(agentId, AGENT_STATUS.WAITING_APPROVAL, `Waiting for approval: ${action}`);

  MessageBus.send({
    from: agentId,
    to: 'freya',
    type: MESSAGE_TYPES.APPROVAL_REQUEST,
    payload: { actionId, action, context },
  });

  return _pendingActions[actionId];
}

/**
 * Approve a pending action.
 */
export function approveAction(actionId) {
  const action = _pendingActions[actionId];
  if (!action) return { success: false, error: 'Action not found' };
  action.status = 'approved';
  action.resolvedAt = Date.now();

  setAgentStatus(action.agentId, AGENT_STATUS.IDLE);

  MessageBus.send({
    from: 'freya',
    to: action.agentId,
    type: MESSAGE_TYPES.APPROVAL_RESPONSE,
    payload: { actionId, approved: true },
  });

  return { success: true, action };
}

/**
 * Reject a pending action.
 */
export function rejectAction(actionId, reason = '') {
  const action = _pendingActions[actionId];
  if (!action) return { success: false, error: 'Action not found' };
  action.status = 'rejected';
  action.reason = reason;
  action.resolvedAt = Date.now();

  setAgentStatus(action.agentId, AGENT_STATUS.IDLE, 'Action rejected');

  MessageBus.send({
    from: 'freya',
    to: action.agentId,
    type: MESSAGE_TYPES.APPROVAL_RESPONSE,
    payload: { actionId, approved: false, reason },
  });

  return { success: true, action };
}

/**
 * Get all pending actions.
 */
export function getPendingActions() {
  return Object.values(_pendingActions).filter((a) => a.status === 'pending');
}

// ── Bundled export ──────────────────────────────────────────────

export const AgentRuntime = {
  activateAgent,
  getAgentStatus,
  getAllAgentStatuses,
  cancelAgent,
  isAgentBusy,
  getActiveAgents,
  createPendingAction,
  approveAction,
  rejectAction,
  getPendingActions,
};

export default AgentRuntime;
