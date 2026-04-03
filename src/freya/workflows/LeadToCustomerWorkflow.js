/**
 * LeadToCustomerWorkflow
 * Full lead lifecycle: Prospector enrich -> Analyst score -> Outreach contact -> Revenue track
 */

import { activateAgent } from '../../agents/AgentRuntime';
import { MessageBus, MESSAGE_TYPES } from '../../agents/MessageBus';

const WORKFLOW_ID = 'lead_to_customer';

let _status = { step: 0, total: 4, progress: 0, results: {}, running: false };

function _notify(step, agentId) {
  MessageBus.broadcast('freya', MESSAGE_TYPES.DATA_UPDATE, {
    event: 'workflow_step',
    workflowId: WORKFLOW_ID,
    step,
    agentId,
  });
}

export const LeadToCustomerWorkflow = {
  id: WORKFLOW_ID,
  name: 'Lead to Customer',
  description: 'Full lead lifecycle: enrich, score, contact, and revenue tracking',

  steps: [
    { agentId: 'prospector', skill: 'enrich', task: 'Enrich lead data from multiple sources', dependsOn: null },
    { agentId: 'analyst', skill: 'score', task: 'Score and qualify lead based on ICP', dependsOn: 'prospector:enrich' },
    { agentId: 'outreach', skill: 'contact', task: 'Initiate personalized outreach sequence', dependsOn: 'analyst:score' },
    { agentId: 'revenue', skill: 'track', task: 'Add to pipeline and track progression', dependsOn: 'outreach:contact' },
  ],

  async execute(context = {}) {
    _status = { step: 0, total: 4, progress: 0, results: {}, running: true };

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
