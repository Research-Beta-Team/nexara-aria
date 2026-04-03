/**
 * FreyaTools.js — Tool definitions for Freya orchestrator.
 * Anthropic Messages API format.
 *
 * Original 12 tools + 8 new orchestration tools = 20 total.
 */

export const FREYA_TOOLS = [
  // ── Original 12 tools ──────────────────────────────────────────

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
    description: 'Auto-fill a form in the Antarious app with extracted or generated data',
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
    description: 'Create an escalation card for human review when Freya needs approval or encounters a situation requiring judgment',
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

  // ── New orchestration tools (8 tools) ──────────────────────────

  {
    name: 'delegate_to_agent',
    description: 'Delegate a task to a specialist agent. Freya sends a task to one of 7 specialists (strategist, copywriter, analyst, prospector, optimizer, outreach, revenue, guardian) and receives their result. Use this when a task falls within an agent specialty.',
    input_schema: {
      type: 'object',
      properties: {
        agentId: {
          type: 'string',
          enum: ['strategist', 'copywriter', 'analyst', 'prospector', 'optimizer', 'outreach', 'revenue', 'guardian'],
          description: 'The specialist agent to delegate to',
        },
        task: { type: 'string', description: 'Description of the task for the agent' },
        context: {
          type: 'object',
          description: 'Additional context the agent needs (ICP, campaign data, etc.)',
        },
      },
      required: ['agentId', 'task'],
    },
  },
  {
    name: 'query_agent_status',
    description: 'Check the current status and recent activity of a specialist agent. Use to understand agent workload before delegating.',
    input_schema: {
      type: 'object',
      properties: {
        agentId: {
          type: 'string',
          enum: ['strategist', 'copywriter', 'analyst', 'prospector', 'optimizer', 'outreach', 'revenue', 'guardian'],
          description: 'The agent to query',
        },
      },
      required: ['agentId'],
    },
  },
  {
    name: 'query_memory',
    description: 'Search the shared memory layer for knowledge across namespaces: brand, audience, campaigns, performance, knowledge, decisions. Returns matching entries ranked by relevance.',
    input_schema: {
      type: 'object',
      properties: {
        namespace: {
          type: 'string',
          enum: ['brand', 'audience', 'campaigns', 'performance', 'knowledge', 'decisions'],
          description: 'Namespace to search in, or omit to search all',
        },
        query: { type: 'string', description: 'Search query' },
      },
      required: ['query'],
    },
  },
  {
    name: 'write_memory',
    description: 'Write a fact, insight, or decision to shared memory so all agents can access it. Use to persist learnings, ICP updates, brand voice rules, or campaign decisions.',
    input_schema: {
      type: 'object',
      properties: {
        namespace: {
          type: 'string',
          enum: ['brand', 'audience', 'campaigns', 'performance', 'knowledge', 'decisions'],
          description: 'Which namespace to write to',
        },
        key: { type: 'string', description: 'Unique key for this memory entry' },
        value: { description: 'The value to store (string, number, object, or array)' },
      },
      required: ['namespace', 'key', 'value'],
    },
  },
  {
    name: 'trigger_workflow',
    description: 'Start a pre-built multi-agent workflow. Available workflows: campaign_launch (strategy->content->review->schedule), content_creation (brief->generate->approve), lead_to_customer (enrich->score->contact->track), performance_review (analyze->recommend->brief), seo_audit (audit->fix->test), ab_test (design->variants->evaluate).',
    input_schema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          enum: ['campaign_launch', 'content_creation', 'lead_to_customer', 'performance_review', 'seo_audit', 'ab_test'],
          description: 'The workflow to trigger',
        },
        context: {
          type: 'object',
          description: 'Context for the workflow (campaign name, ICP, channel, etc.)',
        },
      },
      required: ['workflowId'],
    },
  },
  {
    name: 'get_agent_recommendations',
    description: 'Ask a specialist agent for recommendations on a topic without executing a full task. Returns suggestions with confidence scores.',
    input_schema: {
      type: 'object',
      properties: {
        agentId: {
          type: 'string',
          enum: ['strategist', 'copywriter', 'analyst', 'prospector', 'optimizer', 'outreach', 'revenue', 'guardian'],
          description: 'The agent to ask',
        },
        topic: { type: 'string', description: 'What to get recommendations about' },
      },
      required: ['agentId', 'topic'],
    },
  },
  {
    name: 'approve_agent_action',
    description: 'Approve a pending action from an agent (e.g., sending outreach, changing budget, publishing content)',
    input_schema: {
      type: 'object',
      properties: {
        actionId: { type: 'string', description: 'The ID of the pending action to approve' },
      },
      required: ['actionId'],
    },
  },
  {
    name: 'reject_agent_action',
    description: 'Reject a pending action from an agent with feedback so it can revise',
    input_schema: {
      type: 'object',
      properties: {
        actionId: { type: 'string', description: 'The ID of the pending action to reject' },
        reason: { type: 'string', description: 'Why the action was rejected — feedback for the agent' },
      },
      required: ['actionId', 'reason'],
    },
  },
];
