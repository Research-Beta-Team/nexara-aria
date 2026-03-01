/**
 * ARIA tool definitions — Anthropic Messages API format.
 * All 12 tools for the agentic engine.
 */

export const ARIA_TOOLS = [
  {
    name: 'search_prospects',
    description: 'Search for prospects matching specific ICP criteria using Apollo/LinkedIn data',
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query or keywords' },
        filters: {
          type: 'object',
          properties: {
            industry: { type: 'string' },
            company_size: { type: 'string' },
            title: { type: 'string' },
            location: { type: 'string' },
            technology: { type: 'string' },
          },
        },
        limit: { type: 'number', description: 'Max results to return', default: 10 },
      },
      required: ['query'],
    },
  },
  {
    name: 'enrich_contact',
    description: 'Enrich a contact or company with full profile data — LinkedIn, tech stack, news, funding',
    input_schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string' },
        company: { type: 'string' },
        linkedin_url: { type: 'string' },
      },
    },
  },
  {
    name: 'read_document',
    description: 'Read and extract structured data from an uploaded document — PDF, Excel, Word, CSV',
    input_schema: {
      type: 'object',
      properties: {
        document_id: { type: 'string' },
        extract_type: {
          type: 'string',
          enum: ['all', 'tables', 'contacts', 'financials', 'keywords'],
        },
      },
      required: ['document_id', 'extract_type'],
    },
  },
  {
    name: 'extract_from_image',
    description: 'Extract text, data, contacts, or form fields from an uploaded image or screenshot',
    input_schema: {
      type: 'object',
      properties: {
        image_id: { type: 'string' },
        extract_type: {
          type: 'string',
          enum: ['text', 'contacts', 'table', 'form_fields', 'business_card', 'ad_creative'],
        },
      },
      required: ['image_id', 'extract_type'],
    },
  },
  {
    name: 'fill_form',
    description: 'Auto-fill a form in the NEXARA app with extracted or generated data',
    input_schema: {
      type: 'object',
      properties: {
        form_id: { type: 'string' },
        fields: { type: 'object', additionalProperties: true },
      },
      required: ['form_id', 'fields'],
    },
  },
  {
    name: 'query_campaign_data',
    description: 'Query live campaign performance data, prospect lists, or content assets',
    input_schema: {
      type: 'object',
      properties: {
        query_type: {
          type: 'string',
          enum: ['performance', 'prospects', 'content', 'agents', 'pipeline'],
        },
        campaign_id: { type: 'string' },
        date_range: { type: 'string' },
        filters: { type: 'object' },
      },
      required: ['query_type'],
    },
  },
  {
    name: 'update_campaign',
    description: 'Update campaign settings, pause/resume agents, change budgets, update ICP',
    input_schema: {
      type: 'object',
      properties: {
        campaign_id: { type: 'string' },
        action: {
          type: 'string',
          enum: ['pause', 'resume', 'update_budget', 'update_icp', 'add_prospect', 'remove_prospect'],
        },
        payload: { type: 'object' },
      },
      required: ['campaign_id', 'action', 'payload'],
    },
  },
  {
    name: 'create_content',
    description: 'Generate GTM content — email sequences, LinkedIn messages, ad copy, blog posts, strategy briefs',
    input_schema: {
      type: 'object',
      properties: {
        content_type: {
          type: 'string',
          enum: ['email_sequence', 'linkedin_message', 'ad_copy', 'blog_post', 'strategy_brief', 'one_pager'],
        },
        context: { type: 'object' },
        tone: { type: 'string' },
        length: { type: 'string' },
      },
      required: ['content_type', 'context'],
    },
  },
  {
    name: 'send_outreach',
    description: 'Send or schedule outreach messages via email, LinkedIn, or WhatsApp',
    input_schema: {
      type: 'object',
      properties: {
        channel: { type: 'string', enum: ['email', 'linkedin', 'whatsapp'] },
        recipient: { type: 'object' },
        message: { type: 'string' },
        send_at: { type: 'string' },
        campaign_id: { type: 'string' },
      },
      required: ['channel', 'recipient', 'message'],
    },
  },
  {
    name: 'analyze_performance',
    description: 'Analyze campaign performance and generate insights, identify trends, flag anomalies',
    input_schema: {
      type: 'object',
      properties: {
        campaign_id: { type: 'string' },
        metric: { type: 'string' },
        period: { type: 'string' },
        compare_to: { type: 'string' },
      },
    },
  },
  {
    name: 'schedule_action',
    description: 'Schedule a future action — send message, run agent, generate report, pause campaign',
    input_schema: {
      type: 'object',
      properties: {
        action_type: { type: 'string' },
        scheduled_for: { type: 'string' },
        payload: { type: 'object' },
        notify_human: { type: 'boolean' },
      },
      required: ['action_type', 'scheduled_for', 'payload'],
    },
  },
  {
    name: 'escalate_to_human',
    description: 'Create an escalation card for human review when ARIA needs approval or encounters a situation requiring judgment',
    input_schema: {
      type: 'object',
      properties: {
        severity: { type: 'string', enum: ['critical', 'high', 'medium', 'low'] },
        reason: { type: 'string' },
        context: { type: 'object' },
        recommended_action: { type: 'string' },
        options: { type: 'array', items: { type: 'string' } },
      },
      required: ['severity', 'reason', 'recommended_action'],
    },
  },
];
