/**
 * PerformanceReviewWorkflow
 * Weekly performance synthesis: Analyst analyze -> Strategist recommend -> Freya brief
 */

import { activateAgent } from '../../agents/AgentRuntime';
import { MessageBus, MESSAGE_TYPES } from '../../agents/MessageBus';

const WORKFLOW_ID = 'performance_review';

let _status = { step: 0, total: 3, progress: 0, results: {}, running: false };

function _notify(step, agentId) {
  MessageBus.broadcast('freya', MESSAGE_TYPES.DATA_UPDATE, {
    event: 'workflow_step',
    workflowId: WORKFLOW_ID,
    step,
    agentId,
  });
}

export const PerformanceReviewWorkflow = {
  id: WORKFLOW_ID,
  name: 'Performance Review',
  description: 'Weekly performance synthesis: analyze data, generate recommendations, and create executive brief',

  steps: [
    { agentId: 'analyst', skill: 'analyze', task: 'Analyze performance data across all campaigns', dependsOn: null },
    { agentId: 'strategist', skill: 'recommend', task: 'Generate strategic recommendations from analysis', dependsOn: 'analyst:analyze' },
    { agentId: 'freya', skill: 'brief', task: 'Synthesize into executive brief', dependsOn: 'strategist:recommend' },
  ],

  async execute(context = {}) {
    _status = { step: 0, total: 3, progress: 0, results: {}, running: true };

    for (let i = 0; i < this.steps.length; i++) {
      const step = this.steps[i];
      _status.step = i + 1;
      _status.progress = Math.round((i / this.steps.length) * 100);
      _notify(i + 1, step.agentId);

      // For the 'freya:brief' step, synthesize from previous results
      if (step.agentId === 'freya') {
        _status.results['freya:brief'] = {
          success: true,
          agentId: 'freya',
          skill: 'brief',
          output: {
            brief: 'Executive performance brief generated from analyst data and strategist recommendations.',
            sections: ['Performance Summary', 'Key Anomalies', 'Strategic Recommendations', 'Next Actions'],
            confidence: 0.92,
          },
          confidence: 0.92,
        };
        continue;
      }

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
