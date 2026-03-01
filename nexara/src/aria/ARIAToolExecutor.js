/**
 * ARIA Tool Executor — mock execution for all 12 tools.
 * In production, replace with real API integrations.
 */

import useStore from '../store/useStore';

function genId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID().slice(0, 8)
    : `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

/**
 * @param {string} toolName
 * @param {Record<string, unknown>} input
 * @param {{ getState?: () => Record<string, unknown> }} [store] - optional Zustand store (defaults to useStore)
 * @returns {Promise<Record<string, unknown>>}
 */
export async function execute(toolName, input, store) {
  const state = (store?.getState ? store.getState() : useStore.getState()) || {};

  switch (toolName) {
    case 'search_prospects': {
      const q = (input.query || '').toString();
      const filters = (input.filters || {});
      const limit = Math.min(Number(input.limit) || 5, 20);
      const industry = (filters.industry || 'manufacturing').toString().slice(0, 12);
      const location = (filters.location || 'Vietnam').toString().slice(0, 15);
      const prospects = [];
      for (let i = 0; i < limit; i++) {
        prospects.push({
          id: `p-${genId()}`,
          name: `Contact ${i + 1} ${industry}`,
          title: ['CFO', 'VP Finance', 'Finance Director', 'Head of Operations'][i % 4],
          company: `${industry} Co ${i + 1}`,
          email: `contact${i + 1}@${industry.replace(/\s/g, '')}.com`,
          linkedin: `https://linkedin.com/in/sample-${i + 1}`,
          score: 85 - i * 3 + Math.floor(Math.random() * 5),
          reason_matched: `Matched ${location} and ${(filters.title || 'finance').toString()}`,
        });
      }
      return { prospects };
    }

    case 'enrich_contact': {
      const name = (input.name || input.company || 'Unknown').toString();
      return {
        full_name: name,
        title: 'CFO',
        company: (input.company || name + ' Corp').toString(),
        linkedin: (input.linkedin_url || 'https://linkedin.com/in/sample').toString(),
        email: (input.email || `contact@${name.replace(/\s/g, '')}.com`).toString(),
        phone: '+84 28 3822 1234',
        location: 'Ho Chi Minh City, Vietnam',
        company_size: '201-500',
        industry: 'Textiles & Apparel',
        funding_stage: 'Series B',
        tech_stack: ['SAP', 'Oracle', 'Microsoft 365'],
        recent_news: 'Company announced expansion into EU markets.',
        linkedin_posts_recent: 'Posted about DPP compliance challenges 2 days ago.',
        icebreaker_suggestion: 'Reference their recent post on EU DPP when reaching out.',
      };
    }

    case 'read_document': {
      const extractType = (input.extract_type || 'all').toString();
      if (extractType === 'tables') {
        return {
          tables: [
            { headers: ['Name', 'Company', 'Email'], rows: [['John Doe', 'Acme', 'john@acme.com'], ['Jane Smith', 'Beta', 'jane@beta.com']] },
          ],
        };
      }
      if (extractType === 'contacts') {
        return {
          contacts: [
            { name: 'John Doe', title: 'CFO', company: 'Acme Corp', email: 'john@acme.com' },
            { name: 'Jane Smith', title: 'VP Finance', company: 'Beta Inc', email: 'jane@beta.com' },
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
        keywords: ['campaign', 'budget', 'CFO'],
      };
    }

    case 'extract_from_image': {
      const type = (input.extract_type || 'text').toString();
      if (type === 'business_card') {
        return {
          name: 'Nguyen Van Minh',
          title: 'CFO',
          company: 'Apex Garments',
          email: 'minh.nguyen@apexgarments.vn',
          phone: '+84 28 3910 1234',
          linkedin: 'https://linkedin.com/in/nguyenvanminh',
          website: 'https://apexgarments.vn',
          address: 'Ho Chi Minh City, Vietnam',
        };
      }
      if (type === 'form_fields') {
        return { fields: [{ field_name: 'Campaign Name', detected_value: 'Q2 Vietnam CFO' }, { field_name: 'Budget', detected_value: '$5,000' }] };
      }
      if (type === 'table') {
        return { table: [['Metric', 'Value'], ['CPL', '$32'], ['Leads', '120']] };
      }
      if (type === 'ad_creative') {
        return {
          headline: 'Finance automation for Vietnam-scale CFOs',
          body_text: 'Close in 3 days, not 3 weeks.',
          cta: 'Book a demo',
          brand: 'NEXARA',
          detected_channel: 'LinkedIn',
        };
      }
      return { text: 'Extracted text from image.' };
    }

    case 'fill_form': {
      const formId = (input.form_id || '').toString();
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
          campaign_name: state.currentCampaign || 'CFO Vietnam Q1',
          period: (input.date_range || 'last_7_days').toString(),
          metrics: {
            spend: 18420,
            leads: 94,
            mqls: 28,
            cpl: 196,
            demo_booked: 12,
          },
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
            { id: 'd1', company: 'Apex Garments', value: 45000, stage: 'Proposal', days_in_stage: 5 },
            { id: 'd2', company: 'Delta Textiles', value: 32000, stage: 'Demo', days_in_stage: 2 },
          ],
        };
      }
      return { data: [], summary: 'No content or agents data for this query.' };
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
        content = `Step 1 - Subject: Finance automation for ${(context.persona || 'CFO').toString()}\nBody: Hi [First Name], I came across [Company] while researching high-growth Vietnamese enterprises...\n\nStep 2 - Subject: Re: Finance automation\nBody: Quick follow-up — would a 15-min call this week work?...\n\nStep 3–5: [Similar structure]`;
        wordCount = 320;
      } else if (contentType === 'ad_copy') {
        content = 'Variant A — Headline: Close in 3 days, not 3 weeks. Body: Automate consolidation and reporting. CTA: Book a demo.\n\nVariant B — Headline: What\'s your CFO time worth? Body: ...\n\nVariant C — Headline: Finance automation for Vietnam-scale CFOs. Body: ...';
        wordCount = 180;
      } else if (contentType === 'strategy_brief') {
        content = '# Strategy Brief\n\n## Objective\nDrive demos from Vietnam CFO segment.\n\n## Target ICP\nCFO/VP Finance at manufacturing companies 200–500 employees.\n\n## Channels\nEmail + LinkedIn.\n\n## Budget & Timeline\n$5K/month, 12-week pilot.\n\n## Success Metrics\nCPL <$250, 15+ demos.';
        wordCount = 520;
      } else {
        content = `Generated ${contentType} content based on context.`;
        wordCount = 150;
      }
      const creditCost = Math.ceil(wordCount / 50) * 5;
      return { content, word_count: wordCount, credit_cost: creditCost };
    }

    case 'send_outreach': {
      const channel = (input.channel || 'email').toString();
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
      const campaignId = input.campaign_id || state.currentCampaign;
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
          campaign_id: campaignId,
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
      if (state.addAriaScheduledAction) state.addAriaScheduledAction(action);
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
      if (state.addAriaEscalation) state.addAriaEscalation(escalation);
      return {
        escalation_id: escalationId,
        added_to_queue: true,
      };
    }

    default:
      return { error: `Unknown tool: ${toolName}` };
  }
}

export default { execute };
