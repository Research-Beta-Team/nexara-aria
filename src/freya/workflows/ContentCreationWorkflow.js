/**
 * ContentCreationWorkflow
 * Content with compliance: Strategist brief -> Copywriter generate -> Guardian approve
 */

import { activateAgent } from '../../agents/AgentRuntime';
import { MessageBus, MESSAGE_TYPES } from '../../agents/MessageBus';

const WORKFLOW_ID = 'content_creation';

let _status = { step: 0, total: 3, progress: 0, results: {}, running: false };

function _notify(step, agentId) {
  MessageBus.broadcast('freya', MESSAGE_TYPES.DATA_UPDATE, {
    event: 'workflow_step',
    workflowId: WORKFLOW_ID,
    step,
    agentId,
  });
}

export const ContentCreationWorkflow = {
  id: WORKFLOW_ID,
  name: 'Content Creation',
  description: 'Content with compliance: strategic brief, content generation, and guardian approval',

  steps: [
    { agentId: 'strategist', skill: 'brief', task: 'Create strategic content brief', dependsOn: null },
    { agentId: 'copywriter', skill: 'generate', task: 'Generate content from brief', dependsOn: 'strategist:brief' },
    { agentId: 'guardian', skill: 'approve', task: 'Review and approve content', dependsOn: 'copywriter:generate' },
  ],

  async execute(context = {}) {
    _status = { step: 0, total: 3, progress: 0, results: {}, running: true };

    for (let i = 0; i < this.steps.length; i++) {
      const step = this.steps[i];
      _status.step = i + 1;
      _status.progress = Math.round((i / this.steps.length) * 100);
      _notify(i + 1, step.agentId);

      try {
        const mergedContext = { ...context, previousResults: _status.results };
        const result = await activateAgent(step.agentId, {
          skill: step.skill,
          description: step.task,
          input: mergedContext,
        }, mergedContext);

        _status.results[`${step.agentId}:${step.skill}`] = {
          success: true,
          agentId: step.agentId,
          skill: step.skill,
          output: result?.output || result,
          confidence: result?.confidence || 0.8,
        };
      } catch (err) {
        _status.results[`${step.agentId}:${step.skill}`] = {
          success: false,
          agentId: step.agentId,
          skill: step.skill,
          error: err.message,
        };
      }
    }

    _status.progress = 100;
    _status.running = false;

    MessageBus.broadcast('freya', MESSAGE_TYPES.DATA_UPDATE, {
      event: 'workflow_complete',
      workflowId: WORKFLOW_ID,
      results: _status.results,
    });

    return {
      workflowId: WORKFLOW_ID,
      success: Object.values(_status.results).every((r) => r.success),
      results: _status.results,
    };
  },

  getStatus() {
    return { ..._status };
  },
};
