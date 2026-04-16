/**
 * TriggerEngine.js
 * Trigger system — registers conditions, evaluates state changes, fires agent tasks.
 */

import useStore from '../store/useStore';
import { AGENTS } from './AgentRegistry';
import { AgentRuntime } from './AgentRuntime';
import { MessageBus, MESSAGE_TYPES } from './MessageBus';

// ── Trigger type constants ──────────────────────────────────────

export const TRIGGER_TYPES = {
  USER_ACTION: 'USER_ACTION',
  DATA_CHANGE: 'DATA_CHANGE',
  SCHEDULE: 'SCHEDULE',
  AGENT_MESSAGE: 'AGENT_MESSAGE',
};

// ── Internal state ──────────────────────────────────────────────

let _triggerId = 0;
const _triggers = new Map(); // triggerId -> trigger config
let _storeUnsub = null;
let _busUnsub = null;

// ── Public API ──────────────────────────────────────────────────

export const TriggerEngine = {
  /**
   * Register a new trigger.
   * @param {string} triggerId — a human-readable id (or auto-generated)
   * @param {{ type?: string, condition?: Function, agentId: string, taskTemplate: object, priority?: number }} config
   * @returns {Function} unsubscribe — call to deregister the trigger
   */
  registerTrigger(triggerId, config) {
    const id = triggerId || `trigger_${++_triggerId}`;
    _triggers.set(id, {
      id,
      type: config.type || TRIGGER_TYPES.USER_ACTION,
      condition: config.condition || (() => true),
      agentId: config.agentId,
      taskTemplate: config.taskTemplate || {},
      priority: config.priority ?? 2,
      enabled: true,
      firedCount: 0,
    });

    return () => _triggers.delete(id);
  },

  /**
   * Manually fire a trigger by id.
   * @param {string} triggerId
   * @param {object} context — extra context merged into the task
   * @returns {Promise|null}
   */
  fire(triggerId, context = {}) {
    const trigger = _triggers.get(triggerId);
    if (!trigger || !trigger.enabled) return null;

    trigger.firedCount++;

    const task = {
      ...trigger.taskTemplate,
      input: { ...trigger.taskTemplate.input, ...context },
      description: trigger.taskTemplate.description || `Trigger: ${triggerId}`,
    };

    // Send a trigger message on the bus
    MessageBus.send({
      from: 'trigger_engine',
      to: trigger.agentId,
      type: MESSAGE_TYPES.TRIGGER,
      payload: { triggerId, context },
      priority: trigger.priority,
    });

    return AgentRuntime.activateAgent(trigger.agentId, task, context);
  },

  /**
   * Evaluate all DATA_CHANGE triggers against current store state.
   * Call this when state changes to see if any triggers should fire.
   * @param {object} storeState — Zustand state snapshot
   */
  evaluate(storeState) {
    for (const [id, trigger] of _triggers) {
      if (!trigger.enabled) continue;
      if (trigger.type !== TRIGGER_TYPES.DATA_CHANGE) continue;

      try {
        if (trigger.condition(storeState)) {
          // Debounce — don't re-fire if agent is already busy
          if (!AgentRuntime.isAgentBusy(trigger.agentId)) {
            this.fire(id, { triggeredBy: 'data_change' });
          }
        }
      } catch (_) {
        // Condition threw — skip silently
      }
    }
  },

  /**
   * Initialize default triggers for all agents based on their trigger arrays.
   * Should be called once at app startup.
   */
  initializeDefaults() {
    Object.values(AGENTS).forEach((agent) => {
      agent.triggers.forEach((triggerName) => {
        const type = _classifyTrigger(triggerName);
        this.registerTrigger(`${agent.id}_${triggerName}`, {
          type,
          agentId: agent.id,
          taskTemplate: {
            description: `Auto-trigger: ${triggerName} for ${agent.displayName}`,
            category: _inferCategory(agent),
          },
          condition: _buildDefaultCondition(triggerName),
          priority: agent.role === 'orchestrator' ? 4 : 2,
        });
      });
    });
  },

  /**
   * Start listening to Zustand store changes and MessageBus for auto-triggers.
   * @returns {Function} cleanup — call to stop listening
   */
  startListening() {
    // Subscribe to store changes for DATA_CHANGE triggers
    _storeUnsub = useStore.subscribe((state) => {
      this.evaluate(state);
    });

    // Subscribe to MessageBus for AGENT_MESSAGE triggers
    _busUnsub = MessageBus.onMessage((msg) => {
      for (const [id, trigger] of _triggers) {
        if (!trigger.enabled) continue;
        if (trigger.type !== TRIGGER_TYPES.AGENT_MESSAGE) continue;
        if (trigger.condition(msg)) {
          if (!AgentRuntime.isAgentBusy(trigger.agentId)) {
            this.fire(id, { triggeredBy: 'agent_message', message: msg });
          }
        }
      }
    });

    return () => {
      if (_storeUnsub) _storeUnsub();
      if (_busUnsub) _busUnsub();
      _storeUnsub = null;
      _busUnsub = null;
    };
  },

  /**
   * Get all registered triggers.
   */
  getAllTriggers() {
    return [..._triggers.values()];
  },

  /**
   * Enable / disable a trigger.
   */
  setEnabled(triggerId, enabled) {
    const trigger = _triggers.get(triggerId);
    if (trigger) trigger.enabled = enabled;
  },

  /**
   * Remove all triggers (useful for reset / cleanup).
   */
  clearAll() {
    _triggers.clear();
    if (_storeUnsub) _storeUnsub();
    if (_busUnsub) _busUnsub();
    _storeUnsub = null;
    _busUnsub = null;
  },
};

// ── Internal helpers ────────────────────────────────────────────

/** Classify a trigger name string into a TRIGGER_TYPE */
function _classifyTrigger(name) {
  if (['user_chat', 'at_mention'].includes(name)) return TRIGGER_TYPES.USER_ACTION;
  if (['scheduled_brief', 'scheduled_report'].includes(name)) return TRIGGER_TYPES.SCHEDULE;
  if (['escalation', 'reply_received'].includes(name)) return TRIGGER_TYPES.AGENT_MESSAGE;
  // Most triggers are data-change based
  return TRIGGER_TYPES.DATA_CHANGE;
}

/** Infer a skill category from an agent definition */
function _inferCategory(agent) {
  const first = agent.skills[0];
  if (!first) return 'strategy';
  const skillCategories = {
    'content-strategy': 'strategy', 'launch-strategy': 'strategy',
    'copywriting': 'content', 'copy-editing': 'content', 'ad-creative': 'content',
    'analytics-tracking': 'analytics', 'seo-audit': 'seo',
    'customer-research': 'analytics', 'cold-email': 'outreach',
    'page-cro': 'cro', 'revops': 'revenue',
  };
  return skillCategories[first] || 'strategy';
}

/** Build a default condition function for common trigger names */
function _buildDefaultCondition(triggerName) {
  switch (triggerName) {
    case 'data_anomaly':
      return (state) => {
        // Mock: would check for anomaly flags in analytics state
        return false; // Only fire when explicitly triggered
      };
    case 'mql_threshold':
      return (state) => {
        // Mock: check if any leads crossed MQL score threshold
        return false;
      };
    case 'churn_signal':
      return (state) => {
        // Mock: check customer health scores
        return false;
      };
    case 'conversion_drop':
      return (state) => {
        // Mock: detect sudden conversion rate drops
        return false;
      };
    default:
      // Most triggers only fire when explicitly called via fire()
      return () => false;
  }
}
