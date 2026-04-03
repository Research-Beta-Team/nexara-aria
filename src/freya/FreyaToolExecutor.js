/**
 * FreyaToolExecutor.js — Mock execution for all 20 tools.
 * Original 12 tool handlers + 8 new orchestration handlers.
 * In production, replace with real API integrations.
 */

import useStore from '../store/useStore';
import { activateAgent, getAgentStatus, getAllAgentStatuses, approveAction, rejectAction, getPendingActions } from '../agents/AgentRuntime';
import memoryLayer from '../memory/MemoryLayer';
import { WORKFLOWS } from './workflows/registry';

function genId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID().slice(0, 8)
    : `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

/**
 * @param {string} toolName
 * @param {Record<string, unknown>} input
 * @param {{ getState?: () => Record<string, unknown> }} [store]
 * @returns {Promise<Record<string, unknown>>}
 */
export async function execute(toolName, input, store) {
  const state = (store?.getState ? store.getState() : useStore.getState()) || {};

  switch (toolName) {
    // ── Original 12 tools (unchanged) ────────────────────────────

    case 'search_prospects': {
      const q = (input.query || '').toString();
      const filters = input.filters || {};
      const limit = Math.min(Number(input.limit) || 5, 20);
      const industry = (filters.industry || 'healthcare').toString().slice(0, 15);
      const location = (filters.location || 'Global').toString().slice(0, 15);
      const prospects = [];
      for (let i = 0; i < limit; i++) {
        prospects.push({
          id: `p-${genId()}`,
          name: `Contact ${i + 1} ${industry}`,
          title: ['Director of Programs', 'VP Operations', 'Head of Health', 'CSR Director'][i % 4],
          company: `${industry} Org ${i + 1}`,
          email: `contact${i + 1}@${industry.replace(/\s/g, '')}.org`,
          linkedin: `https://linkedin.com/in/sample-${i + 1}`,
          score: 85 - i * 3 + Math.floor(Math.random() * 5),
          reason_matched: `Matched ${location} and ${(filters.title || 'healthcare').toString()}`,
        });
      }
      return { prospects };
    }

    case 'enrich_contact': {
      const name = (input.name || input.company || 'Unknown').toString();
      return {
        full_name: name,
        title: 'Director of Programs',
        company: (input.company || name + ' Foundation').toString(),
        linkedin: (input.linkedin_url || 'https://linkedin.com/in/sample').toString(),
        email: (input.email || `contact@${name.replace(/\s/g, '')}.org`).toString(),
        phone: '+1 202 555 0147',
        location: 'Washington DC, USA',
        company_size: '201-500',
        industry: 'Humanitarian / Healthcare',
        funding_stage: 'Non-profit',
        tech_stack: ['Salesforce', 'HubSpot', 'Microsoft 365'],
        recent_news: 'Organization announced new health programs in MENA.',
        icebreaker_suggestion: 'Reference their recent expansion into MENA healthcare.',
      };
    }

    case 'read_document': {
      const extractType = (input.extract_type || 'all').toString();
      if (extractType === 'tables') {
        return {
          tables: [
            { headers: ['Name', 'Organization', 'Email'], rows: [['John Doe', 'Medglobal', 'john@medglobal.org'], ['Jane Smith', 'IRC', 'jane@irc.org']] },
          ],
        };
      }
      if (extractType === 'contacts') {
        return {
          contacts: [
            { name: 'John Doe', title: 'Director', company: 'Medglobal', email: 'john@medglobal.org' },
            { name: 'Jane Smith', title: 'VP Programs', company: 'IRC', email: 'jane@irc.org' },
          ],
        };
      }
      if (extractType === 'financials') {
        return { revenue: '$12M', headcount: 340, growth: '+18% YoY' };
      }
      return {
        raw_text: 'Sample extracted text from document.',
        tables: [],
        contacts: [{ name: 'Sample', email: 'sample@example.com' }],
        keywords: ['campaign', 'budget', 'healthcare'],
      };
    }

    case 'extract_from_image': {
      const type = (input.extract_type || 'text').toString();
      if (type === 'business_card') {
        return {
          name: 'Dr. Amira Hassan',
          title: 'Director of Health Programs',
          company: 'Medglobal',
          email: 'amira.hassan@medglobal.org',
          phone: '+1 312 555 0198',
          linkedin: 'https://linkedin.com/in/amirahassan',
          website: 'https://medglobal.org',
          address: 'Chicago, IL, USA',
        };
      }
      if (type === 'form_fields') {
        return { fields: [{ field_name: 'Campaign Name', detected_value: 'Year-End Donor Drive' }, { field_name: 'Budget', detected_value: '$15,000' }] };
      }
      if (type === 'table') {
        return { table: [['Metric', 'Value'], ['Donations', '$284K'], ['Donors', '1,240']] };
      }
      if (type === 'ad_creative') {
        return {
          headline: 'Healthcare for those who need it most',
          body_text: 'Your donation saves lives.',
          cta: 'Donate now',
          brand: 'Medglobal',
          detected_channel: 'Social',
        };
      }
      return { text: 'Extracted text from image.' };
    }

    case 'fill_form': {
      const fields = input.fields && typeof input.fields === 'object' ? input.fields : {};
      const filled = Object.keys(fields);
      return { success: true, fields_filled: filled.length, fields_failed: [] };
    }

    case 'query_campaign_data': {
      const queryType = (input.query_type || 'performance').toString();
      const campaignId = input.campaign_id || state.currentCampaign;
      if (queryType === 'performance') {
        return {
          campaign_id: campaignId,
          campaign_name: state.currentCampaign || 'Year-End Donor Drive',
          period: (input.date_range || 'last_7_days').toString(),
          metrics: { spend: 18420, leads: 94, mqls: 28, cpl: 196, demo_booked: 12 },
          status: 'on_track',
        };
      }
      if (queryType === 'prospects') {
        return {
          campaign_id: campaignId,
          total_prospects: 240,
          in_sequence: 180,
          contacted: 156,
          replied: 24,
          demo_scheduled: 12,
        };
      }
      if (queryType === 'pipeline') {
        return {
          stages: ['Lead', 'MQL', 'SQL', 'Demo', 'Proposal', 'Closed Won'],
          deals: [
            { id: 'd1', company: 'Relief International', value: 45000, stage: 'Proposal', days_in_stage: 5 },
            { id: 'd2', company: 'IRC', value: 32000, stage: 'Demo', days_in_stage: 2 },
          ],
        };
      }
      if (queryType === 'agents') {
        return {
          agents: getAllAgentStatuses(),
        };
      }
      return { data: [], summary: 'No content data for this query.' };
    }

    case 'update_campaign': {
      const action = (input.action || '').toString();
      const payload = input.payload || {};
      const budget = Number(payload.budget || payload.monthly_budget) || 0;
      const requiresApproval = budget > 3000 || action === 'pause' || action === 'add_prospect';
      if (state.setCampaign) state.setCampaign(state.currentCampaign);
      return {
        success: true,
        message: `Campaign ${action} executed.`,
        requires_approval: requiresApproval,
      };
    }

    case 'create_content': {
      const contentType = (input.content_type || 'email_sequence').toString();
      const context = input.context || {};
      let content = '';
      let wordCount = 0;
      if (contentType === 'email_sequence') {
        content = `Step 1 - Subject: Healthcare infrastructure in ${(context.region || 'MENA').toString()}\nBody: Hi [First Name], I noticed [Company] is expanding healthcare programs...\n\nStep 2 - Subject: Re: Healthcare partnership\nBody: Quick follow-up — would a 15-min call this week work?...\n\nStep 3-5: [Similar structure]`;
        wordCount = 320;
      } else if (contentType === 'ad_copy') {
        content = 'Variant A — Headline: Healthcare for those who need it most. Body: Your donation saves lives. CTA: Donate now.\n\nVariant B — Headline: Every dollar delivers care. Body: ...\n\nVariant C — Headline: Healthcare without borders. Body: ...';
        wordCount = 180;
      } else if (contentType === 'strategy_brief') {
        content = '# Strategy Brief\n\n## Objective\nDrive donor partnerships for MENA health programs.\n\n## Target ICP\nCSR Directors and Foundation Program Officers.\n\n## Channels\nEmail + LinkedIn.\n\n## Budget & Timeline\n$8K/month, 12-week pilot.\n\n## Success Metrics\nCPL <$200, 20+ partnership meetings.';
        wordCount = 520;
      } else {
        content = `Generated ${contentType} content based on context.`;
        wordCount = 150;
      }
      const creditCost = Math.ceil(wordCount / 50) * 5;
      return { content, word_count: wordCount, credit_cost: creditCost };
    }

    case 'send_outreach': {
      const sendAt = input.send_at;
      const scheduled = !!sendAt && new Date(sendAt) > new Date();
      return {
        sent: !scheduled,
        scheduled,
        message_id: `msg-${genId()}`,
        requires_approval: true,
      };
    }

    case 'analyze_performance': {
      return {
        insights: [
          'CPL is 12% above target — consider pausing underperforming ad set 3.',
          'Reply rate on email sequence A is 28%, above benchmark.',
          'LinkedIn spend pacing ahead; reallocate $800 to Meta for balance.',
        ],
        anomalies: [
          { metric: 'CPL', current: 212, expected: 190, severity: 'medium' },
          { metric: 'Reply rate', current: 0.18, previous_week: 0.24, severity: 'low' },
        ],
        recommendations: [
          { action: 'Pause Ad Set 3', confidence: 0.87, impact: 'Reduce CPL by ~15%' },
          { action: 'Increase email touch 3 send time to 9am local', confidence: 0.72, impact: 'Improve open rate' },
        ],
        data: {
          campaign_id: input.campaign_id || state.currentCampaign,
          period: (input.period || 'last_7_days').toString(),
          metrics: { spend: 18420, leads: 94, cpl: 196 },
        },
      };
    }

    case 'schedule_action': {
      const actionId = `sched-${genId()}`;
      const action = {
        id: actionId,
        action_type: input.action_type,
        scheduled_for: input.scheduled_for,
        payload: input.payload,
        notify_human: !!input.notify_human,
      };
      if (state.addFreyaScheduledAction) state.addFreyaScheduledAction(action);
      return {
        scheduled: true,
        action_id: actionId,
        human_approval_required: !!input.notify_human,
      };
    }

    case 'escalate_to_human': {
      const escalationId = `esc-${genId()}`;
      const escalation = {
        id: escalationId,
        severity: input.severity || 'medium',
        reason: input.reason,
        context: input.context || {},
        recommended_action: input.recommended_action,
        options: input.options || [],
        created_at: new Date().toISOString(),
      };
      if (state.addFreyaEscalation) state.addFreyaEscalation(escalation);
      return {
        escalation_id: escalationId,
        added_to_queue: true,
      };
    }

    // ── New orchestration tools (8) ──────────────────────────────

    case 'delegate_to_agent': {
      const agentId = (input.agentId || '').toString();
      const task = (input.task || '').toString();
      const ctx = input.context || {};

      try {
        const result = await activateAgent(agentId, { description: task, input: ctx }, ctx);
        return {
          success: true,
          agentId,
          task,
          result: result?.output?.data || result?.output || result,
          confidence: result?.confidence || 0.8,
          creditsUsed: result?.creditsUsed || 0,
        };
      } catch (err) {
        return {
          success: false,
          agentId,
          task,
          error: err.message || 'Agent activation failed',
        };
      }
    }

    case 'query_agent_status': {
      const agentId = (input.agentId || '').toString();
      const status = getAgentStatus(agentId);
      return {
        ...status,
        pendingActions: getPendingActions().filter((a) => a.agentId === agentId),
      };
    }

    case 'query_memory': {
      const namespace = input.namespace || null;
      const query = (input.query || '').toString();
      const results = namespace
        ? memoryLayer.search(query, [namespace])
        : memoryLayer.search(query);
      return {
        query,
        namespace: namespace || 'all',
        results: results.slice(0, 10),
        total: results.length,
      };
    }

    case 'write_memory': {
      const namespace = (input.namespace || 'campaigns').toString();
      const key = (input.key || '').toString();
      const value = input.value;
      memoryLayer.write(namespace, key, value, { source: 'freya', agent: 'freya' });
      return {
        success: true,
        namespace,
        key,
        message: `Written to ${namespace}/${key}`,
      };
    }

    case 'trigger_workflow': {
      const workflowId = (input.workflowId || '').toString();
      const workflow = WORKFLOWS[workflowId];
      if (!workflow) {
        return { success: false, error: `Unknown workflow: ${workflowId}` };
      }

      const ctx = input.context || {};
      const stepResults = {};

      // Execute workflow steps sequentially
      for (const stepStr of workflow.steps) {
        const [agentId, skill] = stepStr.split(':');
        try {
          const result = await activateAgent(agentId, { skill, description: `${workflow.name}: ${skill}`, input: ctx }, ctx);
          stepResults[stepStr] = {
            success: true,
            agentId,
            skill,
            result: result?.output?.data || result?.output || 'completed',
            confidence: result?.confidence || 0.8,
          };
        } catch (err) {
          stepResults[stepStr] = {
            success: false,
            agentId,
            skill,
            error: err.message,
          };
        }
      }

      return {
        success: true,
        workflowId,
        name: workflow.name,
        description: workflow.description,
        totalSteps: workflow.steps.length,
        completedSteps: Object.values(stepResults).filter((r) => r.success).length,
        results: stepResults,
      };
    }

    case 'get_agent_recommendations': {
      const agentId = (input.agentId || '').toString();
      const topic = (input.topic || '').toString();

      // Mock recommendations per agent type
      const recoMap = {
        strategist: [
          { recommendation: `Focus on ${topic} with multi-channel approach`, confidence: 0.85, priority: 'high' },
          { recommendation: 'Run competitive analysis first', confidence: 0.72, priority: 'medium' },
          { recommendation: 'Update positioning based on recent wins', confidence: 0.68, priority: 'medium' },
        ],
        copywriter: [
          { recommendation: `Create 3 content variants for ${topic}`, confidence: 0.82, priority: 'high' },
          { recommendation: 'Use case study format for better engagement', confidence: 0.76, priority: 'high' },
          { recommendation: 'Add social proof in touch 2', confidence: 0.71, priority: 'medium' },
        ],
        analyst: [
          { recommendation: `Deep dive into ${topic} metrics from last 30 days`, confidence: 0.88, priority: 'high' },
          { recommendation: 'Set up automated anomaly alerts', confidence: 0.79, priority: 'medium' },
          { recommendation: 'Compare against industry benchmarks', confidence: 0.74, priority: 'medium' },
        ],
        prospector: [
          { recommendation: `Expand search to adjacent segments for ${topic}`, confidence: 0.81, priority: 'high' },
          { recommendation: 'Re-score existing prospects against new ICP', confidence: 0.77, priority: 'high' },
          { recommendation: 'Enrich top 20 with intent data', confidence: 0.73, priority: 'medium' },
        ],
        optimizer: [
          { recommendation: `Run A/B test on ${topic}`, confidence: 0.84, priority: 'high' },
          { recommendation: 'Audit current conversion funnel', confidence: 0.78, priority: 'high' },
          { recommendation: 'Test new CTA variant', confidence: 0.69, priority: 'medium' },
        ],
        outreach: [
          { recommendation: `Schedule follow-ups for ${topic}`, confidence: 0.83, priority: 'high' },
          { recommendation: 'Add LinkedIn touchpoint after email 2', confidence: 0.75, priority: 'medium' },
          { recommendation: 'Increase sequence to 6 touches', confidence: 0.70, priority: 'low' },
        ],
        revenue: [
          { recommendation: `Review pipeline impact of ${topic}`, confidence: 0.86, priority: 'high' },
          { recommendation: 'Update forecast with recent deal data', confidence: 0.80, priority: 'high' },
          { recommendation: 'Flag at-risk accounts for outreach', confidence: 0.74, priority: 'medium' },
        ],
        guardian: [
          { recommendation: `Compliance check for ${topic} content`, confidence: 0.90, priority: 'high' },
          { recommendation: 'Review brand voice consistency', confidence: 0.82, priority: 'medium' },
          { recommendation: 'Verify all claims have sources', confidence: 0.78, priority: 'medium' },
        ],
      };

      return {
        agentId,
        topic,
        recommendations: recoMap[agentId] || [
          { recommendation: `Analyze ${topic}`, confidence: 0.75, priority: 'medium' },
        ],
      };
    }

    case 'approve_agent_action': {
      const actionId = (input.actionId || '').toString();
      const result = approveAction(actionId);
      return result;
    }

    case 'reject_agent_action': {
      const actionId = (input.actionId || '').toString();
      const reason = (input.reason || '').toString();
      const result = rejectAction(actionId, reason);
      return result;
    }

    default:
      return { error: `Unknown tool: ${toolName}` };
  }
}

export default { execute };
