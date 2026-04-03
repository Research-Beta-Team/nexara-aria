/**
 * CampaignLaunchWorkflow
 * End-to-end campaign creation: Strategist -> Copywriter -> Guardian -> Outreach
 */

import { activateAgent } from '../../agents/AgentRuntime';
import { MessageBus, MESSAGE_TYPES } from '../../agents/MessageBus';

const WORKFLOW_ID = 'campaign_launch';

let _status = { step: 0, total: 4, progress: 0, results: {}, running: false };

function _notify(step, agentId) {
  MessageBus.broadcast('freya', MESSAGE_TYPES.DATA_UPDATE, {
    event: 'workflow_step',
    workflowId: WORKFLOW_ID,
    step,
    agentId,
  });
}

export const CampaignLaunchWorkflow = {
  id: WORKFLOW_ID,
  name: 'Campaign Launch',
  description: 'End-to-end campaign creation: strategy, content, compliance review, and outreach scheduling',

  steps: [
    { agentId: 'strategist', skill: 'strategy', task: 'Define campaign strategy and positioning', dependsOn: null },
    { agentId: 'copywriter', skill: 'content', task: 'Generate campaign content based on strategy', dependsOn: 'strategist:strategy' },
    { agentId: 'guardian', skill: 'review', task: 'Review content for brand compliance', dependsOn: 'copywriter:content' },
    { agentId: 'outreach', skill: 'schedule', task: 'Schedule approved content for delivery', dependsOn: 'guardian:review' },
  ],

  async execute(context = {}) {
    _status = { step: 0, total: 4, progress: 0, results: {}, running: true };

    const stepDefs = this.steps;

    for (let i = 0; i < stepDefs.length; i++) {
      const step = stepDefs[i];
      _status.step = i + 1;
      _status.progress = Math.round(((i) / stepDefs.length) * 100);

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
