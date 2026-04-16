/**
 * FreyaEngine.js — Orchestrator brain for Antarious GTM AI OS.
 *
 * Freya is no longer just a chatbot; she is the multi-agent orchestrator.
 * When a user asks something she decides:
 *   1. Can I handle directly?       -> Execute with own tools
 *   2. Should I delegate?           -> Send TASK_REQUEST to specialist via MessageBus
 *   3. Need multiple agents?        -> Start a workflow (chain of agents)
 *   4. Need human input?            -> ESCALATION
 *
 * Keeps the same public chat() API so existing UI works unchanged.
 */

import { FREYA_TOOLS } from './FreyaTools';
import { execute } from './FreyaToolExecutor';
import { freyaMemory } from './FreyaMemory';
import { buildSystemPrompt } from './FreyaSystemPrompt';
import { AgentRuntime } from '../agents/AgentRuntime';
import { MessageBus, MESSAGE_TYPES } from '../agents/MessageBus';
import memoryLayer from '../memory/MemoryLayer';
import { AGENTS } from '../agents/AgentRegistry';

const MODEL = 'claude-sonnet-4-20250514';
const MAX_TOKENS = 4096;
const API_BASE = 'https://api.anthropic.com/v1';

// ── Demo mode responses (enhanced with agent delegation) ────────────

const DEMO_RESPONSES = {
  'what needs attention': {
    thinking: [
      'Checking campaign performance data...',
      'Asking Analyst for anomaly scan...',
      'Consulting Revenue agent on pipeline health...',
      'Preparing brief...',
    ],
    delegations: [
      { agentId: 'analyst', skill: 'performance_scan', label: 'Analyst scanning for anomalies' },
      { agentId: 'revenue', skill: 'pipeline_check', label: 'Revenue checking pipeline health' },
    ],
    toolCalls: [
      { name: 'query_campaign_data', input: { query_type: 'performance' } },
      { name: 'delegate_to_agent', input: { agentId: 'analyst', task: 'Scan for anomalies in last 7 days', context: {} } },
    ],
    finalText: '**Daily Brief — 3 items need attention**\n\n1. **CFO Vietnam Q1** — CPL at $196 (target $250). On track. 12 demos booked.\n2. **APAC Brand** — The Analyst flagged reply rate dropped 18% WoW. Recommends A/B test on subject lines.\n3. **1 escalation** — Meta budget pacing alert. The Revenue agent sees pipeline value at $284K, 2 deals stalled.\n\n**Freya recommends:** Let the Optimizer run an A/B test on subject lines (78% confidence). Approve?',
  },
  'what needs my attention': null,
  'find cfo prospects in vietnam': {
    thinking: [
      'Delegating to Prospector — searching for CFOs in Vietnam...',
      'Prospector enriching top matches...',
    ],
    delegations: [
      { agentId: 'prospector', skill: 'lead_search', label: 'Prospector searching Apollo/LinkedIn' },
    ],
    toolCalls: [
      { name: 'delegate_to_agent', input: { agentId: 'prospector', task: 'Find CFO prospects in Vietnam', context: { location: 'Vietnam', title: 'CFO' } } },
    ],
    finalText: '**Prospector found 47 CFO prospects in Vietnam** (top 3 shown)\n\n| Name | Company | Score |\n|------|---------|-------|\n| Dr. Sarah Chen | Relief International | 89 |\n| Ahmed Hassan | IRC | 84 |\n| Maria Santos | MSF | 81 |\n\nThe Prospector enriched all 3 with LinkedIn + Clearbit data. Want me to ask the Copywriter to draft outreach for the top 3?',
  },
  'generate email sequence': {
    thinking: [
      'Asking Strategist for positioning guidance...',
      'Delegating to Copywriter for email sequence...',
      'Guardian will review before sending...',
    ],
    delegations: [
      { agentId: 'strategist', skill: 'positioning', label: 'Strategist providing positioning' },
      { agentId: 'copywriter', skill: 'email_sequence', label: 'Copywriter generating sequence' },
      { agentId: 'guardian', skill: 'review', label: 'Guardian reviewing compliance' },
    ],
    toolCalls: [
      { name: 'delegate_to_agent', input: { agentId: 'copywriter', task: 'Generate 5-step email sequence', context: { persona: 'CFO', industry: 'textiles' } } },
    ],
    finalText: '**Email sequence (5 steps)** — 325 words, ~35 credits.\n\nThe Copywriter generated this with input from the Strategist. The Guardian reviewed and scored it 92/100 for brand compliance.\n\nStep 1 — Subject: Healthcare infrastructure in MENA\nBody: Hi [First Name], I noticed [Company] is expanding healthcare programs...\n\nStep 2–5: [Full sequence generated]\n\n**Brand score:** 92/100 | **Compliance:** Passed\n**Recommendation:** Load into Sequence A and A/B test subject line (87% confidence).',
  },
  'how is our meta performing': {
    thinking: [
      'Delegating to Analyst for Meta performance analysis...',
      'Analyst running anomaly detection...',
    ],
    delegations: [
      { agentId: 'analyst', skill: 'analyze_performance', label: 'Analyst pulling Meta data' },
    ],
    toolCalls: [
      { name: 'delegate_to_agent', input: { agentId: 'analyst', task: 'Analyze Meta campaign performance', context: { channel: 'meta' } } },
    ],
    finalText: '**Meta performance** (from Analyst)\n\nSpend: $18,420 | Leads: 94 | CPL: $196 (target $250)\n\n**Analyst insights:**\n- CPL 12% above target on Ad Set 3\n- Reply rate 28% on sequence A (above benchmark)\n\n**Analyst recommendation:** Pause Ad Set 3 (87% confidence → reduce CPL by ~15%).\n\nWant me to ask the Optimizer to redesign Ad Set 3 creative?',
  },
  'pause the worst performing ad set': {
    thinking: [
      'Analyst identifying worst ad set...',
      'Creating approval request...',
    ],
    delegations: [
      { agentId: 'analyst', skill: 'identify_worst', label: 'Analyst identifying worst performer' },
    ],
    toolCalls: [
      { name: 'approve_agent_action', input: { actionId: 'pause_as3' } },
    ],
    finalText: '**Pause requested.** The Analyst confirmed Ad Set 3 is the worst performer (CPL $340 vs $200 target). This requires your approval — approve in the card below to pause Ad Set 3.',
  },
  'launch a campaign': {
    thinking: [
      'Starting Campaign Launch workflow...',
      'Step 1: Strategist building strategy...',
      'Step 2: Copywriter generating content...',
      'Step 3: Guardian reviewing compliance...',
      'Step 4: Outreach scheduling messages...',
    ],
    delegations: [
      { agentId: 'strategist', skill: 'strategy', label: 'Strategist building campaign strategy' },
      { agentId: 'copywriter', skill: 'content', label: 'Copywriter generating content' },
      { agentId: 'guardian', skill: 'review', label: 'Guardian reviewing for compliance' },
      { agentId: 'outreach', skill: 'schedule', label: 'Outreach scheduling messages' },
    ],
    toolCalls: [
      { name: 'trigger_workflow', input: { workflowId: 'campaign_launch', context: { name: 'New Campaign' } } },
    ],
    finalText: '**Campaign Launch workflow initiated** (4 steps)\n\n| Step | Agent | Status |\n|------|-------|--------|\n| 1. Strategy | Strategist | Complete |\n| 2. Content | Copywriter | Complete |\n| 3. Review | Guardian | Complete (score: 94/100) |\n| 4. Schedule | Outreach | Awaiting approval |\n\n**Summary:** The Strategist defined positioning for MENA region. The Copywriter created a 5-touch email sequence. The Guardian approved with minor tone suggestion. 6 messages queued for approval.\n\nApprove outreach schedule?',
  },
  'update icp from our last wins': {
    thinking: [
      'Asking Analyst to pull closed deals...',
      'Prospector extracting ICP patterns...',
      'Writing updated ICP to shared memory...',
    ],
    delegations: [
      { agentId: 'analyst', skill: 'win_analysis', label: 'Analyst analyzing closed deals' },
      { agentId: 'prospector', skill: 'icp_update', label: 'Prospector updating ICP' },
    ],
    toolCalls: [
      { name: 'delegate_to_agent', input: { agentId: 'analyst', task: 'Analyze last 10 wins', context: {} } },
      { name: 'write_memory', input: { namespace: 'audience', key: 'icp_updated', value: 'Updated from win analysis' } },
    ],
    finalText: '**ICP refresh from last 10 wins** (Analyst + Prospector collaboration)\n\nPatterns found: 80% in Textiles/Manufacturing, 200-500 employees.\nThe Prospector updated ICP Builder with new criteria and wrote results to shared memory.\n\n**Recommendation:** Re-score all 240 prospects against new ICP (95% confidence). Shall I delegate this to the Prospector?',
  },
  'send linkedin follow-ups': {
    thinking: [
      'Prospector identifying engaged prospects...',
      'Copywriter drafting personalized messages...',
      'Guardian reviewing outreach compliance...',
      'Outreach queuing messages for approval...',
    ],
    delegations: [
      { agentId: 'prospector', skill: 'engagement_filter', label: 'Prospector filtering engaged leads' },
      { agentId: 'copywriter', skill: 'linkedin_messages', label: 'Copywriter drafting messages' },
      { agentId: 'guardian', skill: 'review', label: 'Guardian reviewing compliance' },
      { agentId: 'outreach', skill: 'queue', label: 'Outreach queuing for approval' },
    ],
    toolCalls: [
      { name: 'trigger_workflow', input: { workflowId: 'content_creation', context: { channel: 'linkedin' } } },
    ],
    finalText: '**LinkedIn follow-ups prepared** (4-agent workflow)\n\n- Prospector found 6 prospects who opened 3+ times\n- Copywriter drafted personalized messages for each\n- Guardian approved all 6 (brand score: 91/100)\n- Outreach queued all 6 — **approval required before sending**\n\nReview and approve in the approval card.',
  },
  'daily brief': {
    thinking: [
      'Querying all 7 specialist agents...',
      'Analyst: performance summary...',
      'Revenue: pipeline update...',
      'Prospector: lead status...',
      'Outreach: sequence metrics...',
      'Synthesizing daily brief...',
    ],
    delegations: [
      { agentId: 'analyst', skill: 'daily_metrics', label: 'Analyst pulling metrics' },
      { agentId: 'revenue', skill: 'pipeline_summary', label: 'Revenue summarizing pipeline' },
      { agentId: 'prospector', skill: 'lead_status', label: 'Prospector checking lead queue' },
      { agentId: 'outreach', skill: 'sequence_metrics', label: 'Outreach reporting on sequences' },
    ],
    toolCalls: [
      { name: 'delegate_to_agent', input: { agentId: 'analyst', task: 'Generate daily metrics summary', context: {} } },
    ],
    finalText: '**Freya Daily Brief — April 2, 2026**\n\n**Pipeline:** $284K total | $142K weighted | 18 deals\n**Leads:** 47 new prospects | 28 MQLs | 12 demos booked\n**Content:** 3 pieces in review | 1 approved | 0 blocked\n**Outreach:** 12 sent today | 3 replies | 28% open rate\n**Anomalies:** Reply rate down 18% WoW on Sequence A\n\n**Top 3 priorities:**\n1. A/B test subject lines (Analyst recommendation, 78% confidence)\n2. Follow up on 2 stalled deals (Revenue flag)\n3. Review 3 pending content approvals (Guardian queue)\n\nWhich should I tackle first?',
  },
};

function normalizeDemoKey(text) {
  return (text || '').toLowerCase().replace(/\s+/g, ' ').trim().slice(0, 80);
}

function findDemoScript(userMessage) {
  const key = normalizeDemoKey(userMessage);
  if (DEMO_RESPONSES[key]) return DEMO_RESPONSES[key];
  const lower = key.toLowerCase();
  if (lower.includes('attention') || lower.includes('brief') || lower.includes('status')) return DEMO_RESPONSES['daily brief'];
  if (lower.includes('prospect') && (lower.includes('vietnam') || lower.includes('cfo') || lower.includes('find'))) return DEMO_RESPONSES['find cfo prospects in vietnam'];
  if (lower.includes('email sequence') || lower.includes('generate email')) return DEMO_RESPONSES['generate email sequence'];
  if (lower.includes('meta') && (lower.includes('perform') || lower.includes('how'))) return DEMO_RESPONSES['how is our meta performing'];
  if (lower.includes('pause') && (lower.includes('ad') || lower.includes('worst'))) return DEMO_RESPONSES['pause the worst performing ad set'];
  if (lower.includes('launch') && lower.includes('campaign')) return DEMO_RESPONSES['launch a campaign'];
  if (lower.includes('icp') && (lower.includes('win') || lower.includes('refresh'))) return DEMO_RESPONSES['update icp from our last wins'];
  if (lower.includes('linkedin') && (lower.includes('follow') || lower.includes('send'))) return DEMO_RESPONSES['send linkedin follow-ups'];
  if (lower.includes('daily') || lower.includes('morning') || lower.includes('summary')) return DEMO_RESPONSES['daily brief'];
  return null;
}

// ── Routing intelligence (used in both demo and live modes) ─────────

const ROUTING_MAP = {
  strategy: 'strategist',
  positioning: 'strategist',
  pricing: 'strategist',
  campaign_plan: 'strategist',
  content: 'copywriter',
  email: 'copywriter',
  copy: 'copywriter',
  write: 'copywriter',
  ad_creative: 'copywriter',
  blog: 'copywriter',
  analytics: 'analyst',
  metrics: 'analyst',
  performance: 'analyst',
  anomaly: 'analyst',
  seo: 'analyst',
  audit: 'analyst',
  prospects: 'prospector',
  leads: 'prospector',
  enrich: 'prospector',
  icp: 'prospector',
  qualify: 'prospector',
  optimize: 'optimizer',
  cro: 'optimizer',
  ab_test: 'optimizer',
  conversion: 'optimizer',
  outreach: 'outreach',
  sequence: 'outreach',
  follow_up: 'outreach',
  send: 'outreach',
  pipeline: 'revenue',
  forecast: 'revenue',
  deal: 'revenue',
  churn: 'revenue',
  revenue: 'revenue',
  review: 'guardian',
  compliance: 'guardian',
  approve: 'guardian',
  brand_check: 'guardian',
};

/**
 * Determine which agent(s) should handle a task based on keywords.
 * @param {string} text
 * @returns {{ primary: string|null, secondary: string[] }}
 */
function routeToAgent(text) {
  const lower = (text || '').toLowerCase();
  const scores = {};
  for (const [keyword, agentId] of Object.entries(ROUTING_MAP)) {
    if (lower.includes(keyword)) {
      scores[agentId] = (scores[agentId] || 0) + 1;
    }
  }
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return {
    primary: sorted.length > 0 ? sorted[0][0] : null,
    secondary: sorted.slice(1, 3).map(([id]) => id),
  };
}

// ── Main engine class ──────────────────────────────────────────────

export class FreyaEngine {
  /**
   * @param {(text: string) => void} [onStreamChunk]
   * @param {(steps: string[]) => void} [onThinkingUpdate]
   * @param {(toolName: string, input: Record<string, unknown>) => void} [onToolCall]
   * @param {(toolName: string, result: Record<string, unknown>) => void} [onToolResult]
   */
  constructor(onStreamChunk, onThinkingUpdate, onToolCall, onToolResult) {
    this.onStreamChunk = onStreamChunk || (() => {});
    this.onThinkingUpdate = onThinkingUpdate || (() => {});
    this.onToolCall = onToolCall || (() => {});
    this.onToolResult = onToolResult || (() => {});
    /** @type {{ campaignId?: string; clientId?: string; role?: string }} */
    this._context = {};
    /** @type {Array<{ id: string; time: string; action: string; toolName?: string; result?: string; creditsUsed?: number }>} */
    this._actionLog = [];
    /** @type {{ content?: string; name?: string; type?: string }[]} */
    this._injectedDocuments = [];
    /** @type {Function|null} */
    this._busUnsubscribe = null;
    /** @type {Array<Object>} Recent agent messages Freya has observed */
    this._agentMessages = [];

    // Subscribe Freya to all agent messages for situation awareness
    this._busUnsubscribe = MessageBus.subscribe('freya', (msg) => {
      this._agentMessages.push(msg);
      if (this._agentMessages.length > 50) {
        this._agentMessages = this._agentMessages.slice(-50);
      }
    });
  }

  // ── Public API (unchanged interface) ──────────────────────────────

  /**
   * Main chat method — routes to demo or live mode.
   * @param {string} userMessage
   * @param {Record<string, unknown>} [context]
   * @returns {Promise<void>}
   */
  async chat(userMessage, context = {}) {
    const apiKey = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ANTHROPIC_API_KEY;
    if (!apiKey) {
      return this._runDemoMode(userMessage);
    }
    return this._runLiveMode(userMessage, context);
  }

  /**
   * Delegate a task to a specialist agent.
   * @param {string} agentId
   * @param {string} task
   * @param {object} [context]
   * @returns {Promise<object>} result from the agent
   */
  async delegate(agentId, task, context = {}) {
    // Notify bus
    MessageBus.send({
      from: 'freya',
      to: agentId,
      type: MESSAGE_TYPES.TASK_REQUEST,
      payload: { task, context },
    });

    // Activate the agent
    const result = await AgentRuntime.activateAgent(agentId, task, context);

    // Write key results to memory
    if (result.success && result.result) {
      memoryLayer.write('campaigns', `last_${agentId}_result`, result.result, {
        source: 'agent_delegation',
        agent: agentId,
      });
    }

    return result;
  }

  /**
   * Orchestrate a multi-agent workflow.
   * @param {object} workflow — workflow definition with steps[]
   * @param {object} [context]
   * @returns {Promise<object>} aggregated results
   */
  async orchestrate(workflow, context = {}) {
    const results = {};
    const steps = workflow.steps || [];

    for (const step of steps) {
      const [agentId, skill] = typeof step === 'string' ? step.split(':') : [step.agentId, step.skill];
      const stepContext = { ...context, previousResults: results };

      // Check dependencies
      if (step.dependsOn) {
        const deps = Array.isArray(step.dependsOn) ? step.dependsOn : [step.dependsOn];
        for (const dep of deps) {
          if (!results[dep]) {
            results[`${agentId}:${skill}`] = { skipped: true, reason: `Dependency ${dep} not met` };
            continue;
          }
        }
      }

      const result = await this.delegate(agentId, skill, stepContext);
      results[`${agentId}:${skill}`] = result;
    }

    return {
      workflowId: workflow.id,
      name: workflow.name,
      steps: steps.length,
      completedSteps: Object.keys(results).length,
      results,
    };
  }

  /**
   * Generate a daily brief by querying all agents and memory.
   * @returns {Promise<object>}
   */
  async generateDailyBrief() {
    const agentSummaries = {};
    const specialistIds = ['analyst', 'revenue', 'prospector', 'outreach', 'copywriter', 'optimizer', 'guardian'];

    for (const id of specialistIds) {
      const status = AgentRuntime.getAgentStatus(id);
      agentSummaries[id] = status;
    }

    // Pull key memory
    const brandContext = memoryLayer.read('brand');
    const performanceContext = memoryLayer.read('performance');
    const campaignContext = memoryLayer.read('campaigns');

    return {
      timestamp: Date.now(),
      agents: agentSummaries,
      memory: {
        brand: brandContext.slice(0, 5),
        performance: performanceContext.slice(0, 5),
        campaigns: campaignContext.slice(0, 5),
      },
      pendingActions: AgentRuntime.getPendingActions(),
    };
  }

  // ── Demo mode ─────────────────────────────────────────────────────

  async _runDemoMode(userMessage) {
    const script = findDemoScript(userMessage);
    const steps = script?.thinking || ['Analyzing request...', 'Routing to specialist agents...', 'Preparing response...'];

    this.onThinkingUpdate(steps);
    await this._delay(600);

    // Show thinking steps progressively
    for (let i = 0; i < steps.length; i++) {
      this.onThinkingUpdate(steps.slice(0, i + 1));
      await this._delay(500);
    }

    // Simulate agent delegations
    if (script?.delegations) {
      for (const del of script.delegations) {
        this.onToolCall('delegate_to_agent', { agentId: del.agentId, task: del.label });
        await this._delay(300);

        // Actually activate agents (sends MessageBus events, updates state)
        const result = await AgentRuntime.activateAgent(del.agentId, del.skill, {});
        this.onToolResult('delegate_to_agent', { agentId: del.agentId, success: true, summary: del.label });
        this._logAction('delegate_to_agent', { agentId: del.agentId, skill: del.skill }, result);
        await this._delay(200);
      }
    }

    // Execute tool calls
    if (script?.toolCalls) {
      for (const tc of script.toolCalls) {
        this.onToolCall(tc.name, tc.input || {});
        await this._delay(300);
        const result = await execute(tc.name, tc.input || {}, undefined);
        this.onToolResult(tc.name, result);
        this._logAction(tc.name, tc.input, result);
        await this._delay(200);
      }
    }

    // Stream final text
    const finalText = script?.finalText || this._generateFallbackResponse(userMessage);
    for (let i = 0; i <= finalText.length; i += 2) {
      this.onStreamChunk(finalText.slice(i, i + 2));
      await this._delay(15);
    }

    this.onThinkingUpdate([]);
    freyaMemory.add('user', [{ type: 'text', text: userMessage }]);
    freyaMemory.add('assistant', [{ type: 'text', text: finalText }]);
  }

  /**
   * Fallback response with agent awareness for unmatched demo queries.
   */
  _generateFallbackResponse(userMessage) {
    const routing = routeToAgent(userMessage);
    if (routing.primary) {
      const agent = AGENTS[routing.primary];
      return `**Routing to ${agent?.displayName || routing.primary}**\n\nI've analyzed your request and delegated it to the ${agent?.displayName || routing.primary}. ${agent?.description || ''}\n\nThe agent is working on this now. Configure VITE_ANTHROPIC_API_KEY for full multi-agent orchestration with live API calls.`;
    }
    return `**Request received:** "${userMessage.slice(0, 60)}..."\n\nI can route this to one of my 7 specialist agents:\n- **Strategist** — strategy, positioning, pricing\n- **Copywriter** — content, emails, ad copy\n- **Analyst** — metrics, audits, anomalies\n- **Prospector** — leads, enrichment, ICP\n- **Optimizer** — CRO, A/B tests, conversions\n- **Outreach** — sequences, follow-ups, scheduling\n- **Revenue** — pipeline, forecasting, churn\n- **Guardian** — compliance, brand review\n\nConfigure VITE_ANTHROPIC_API_KEY for full orchestration.`;
  }

  // ── Live mode (API) ───────────────────────────────────────────────

  async _runLiveMode(userMessage, context) {
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    freyaMemory.setSession({
      ...this._context,
      ...context,
      creditsRemaining: context.creditsRemaining ?? 25000,
    });

    // Build enriched context with agent statuses and memory
    const baseContext = freyaMemory.buildContextForSystemPrompt();
    const agentStatuses = AgentRuntime.getAllAgentStatuses();
    const recentAgentMessages = this._agentMessages.slice(-10);
    const memoryHealth = memoryLayer.getHealth();

    const fullContext = {
      ...baseContext,
      persistentMemory: context?.persistentMemory,
      agentStatuses,
      recentAgentMessages,
      memoryHealth,
    };

    const systemPrompt = buildSystemPrompt(fullContext);
    const history = freyaMemory.getHistory();
    const messages = history.map((m) => ({
      role: m.role,
      content: Array.isArray(m.content) ? m.content : [{ type: 'text', text: String(m.content) }],
    }));
    messages.push({
      role: 'user',
      content: this._injectedDocuments.length
        ? [
            ...this._injectedDocuments.map((d) =>
              d.type === 'image' && d.content
                ? { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: d.content } }
                : { type: 'text', text: `[Document: ${d.name || 'uploaded'}]\n${(d.content || '').toString().slice(0, 2000)}` }
            ),
            { type: 'text', text: userMessage },
          ]
        : [{ type: 'text', text: userMessage }],
    });
    this._injectedDocuments = [];

    let currentMessages = [...messages];
    let maxIterations = 10;
    let fullAssistantText = '';

    while (maxIterations--) {
      const response = await this._callAnthropic(apiKey, systemPrompt, currentMessages);
      if (!response) {
        this.onStreamChunk('\n\n*API error. Check key and network.*');
        break;
      }
      const toolUses = (response.content || []).filter((b) => b.type === 'tool_use');
      const textBlocks = (response.content || []).filter((b) => b.type === 'text');
      const text = textBlocks.map((b) => b.text).join('');
      if (text) {
        fullAssistantText += text;
        for (let i = 0; i < text.length; i += 3) {
          this.onStreamChunk(text.slice(i, i + 3));
          await this._delay(15);
        }
      }
      if (toolUses.length === 0) break;

      const toolResults = [];
      for (const use of toolUses) {
        this.onToolCall(use.name, use.input || {});
        const result = await execute(use.name, use.input || {}, undefined);
        this.onToolResult(use.name, result);
        this._logAction(use.name, use.input, result);
        toolResults.push({
          type: 'tool_result',
          tool_use_id: use.id,
          content: JSON.stringify(result),
        });
      }
      currentMessages = [
        ...currentMessages,
        { role: 'assistant', content: response.content },
        { role: 'user', content: toolResults },
      ];
    }

    freyaMemory.add('user', [{ type: 'text', text: userMessage }]);
    freyaMemory.add('assistant', [{ type: 'text', text: fullAssistantText || '(No text response)' }]);
    this.onThinkingUpdate([]);
  }

  /**
   * Call the Anthropic Messages API.
   */
  async _callAnthropic(apiKey, systemPrompt, messages) {
    const body = {
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      tools: FREYA_TOOLS,
    };
    try {
      const res = await fetch(`${API_BASE}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.text();
        console.error('Anthropic API error', res.status, err);
        return null;
      }
      return await res.json();
    } catch (e) {
      console.error('Anthropic fetch error', e);
      return null;
    }
  }

  // ── Utilities ─────────────────────────────────────────────────────

  _delay(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  _logAction(toolName, input, result) {
    this._actionLog.push({
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      time: new Date().toISOString(),
      action: `${toolName} executed`,
      toolName,
      result: typeof result === 'object' ? JSON.stringify(result).slice(0, 200) : String(result),
      creditsUsed: result && typeof result === 'object' && 'credit_cost' in result ? result.credit_cost : undefined,
    });
  }

  clearHistory() {
    freyaMemory.clear();
    this._agentMessages = [];
  }

  setContext(campaignId, clientId, role) {
    this._context = { campaignId, clientId, role };
    freyaMemory.setSession({
      currentCampaignId: campaignId,
      currentClientId: clientId,
      currentRole: role,
    });
  }

  injectDocument(documentContent, documentName, documentType) {
    this._injectedDocuments.push({
      content: documentContent,
      name: documentName,
      type: documentType,
    });
  }

  getActionLog() {
    return [...this._actionLog];
  }

  /**
   * Get the agent routing suggestion for a message (for UI display).
   */
  getRouting(text) {
    return routeToAgent(text);
  }

  /**
   * Get recent agent messages Freya has observed.
   */
  getAgentMessages() {
    return [...this._agentMessages];
  }

  /**
   * Clean up subscriptions.
   */
  destroy() {
    if (this._busUnsubscribe) {
      this._busUnsubscribe();
      this._busUnsubscribe = null;
    }
  }
}

const noop = () => {};
export const freya = new FreyaEngine(noop, noop, noop, noop);

export default FreyaEngine;
