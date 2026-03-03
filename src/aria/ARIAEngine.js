/**
 * ARIA Engine — core agentic brain.
 * Manages conversation loop, tool use, streaming, and demo mode.
 */

import { ARIA_TOOLS } from './ARIATools.js';
import { execute } from './ARIAToolExecutor.js';
import { ariaMemory } from './ARIAMemory.js';
import { buildSystemPrompt } from './ARIASystemPrompt.js';

const MODEL = 'claude-sonnet-4-20250514';
const MAX_TOKENS = 4096;
const API_BASE = 'https://api.anthropic.com/v1';

/**
 * Demo mode: pre-scripted responses when no API key.
 * Keys are normalized to lowercase for matching.
 */
const DEMO_RESPONSES = {
  'what needs attention': {
    thinking: ['Checking campaign performance data...', 'Identifying items needing action...', 'Preparing brief...'],
    toolCalls: [
      { name: 'query_campaign_data', input: { query_type: 'performance' } },
      { name: 'analyze_performance', input: {} },
    ],
    finalText: '**What needs your attention**\n\n• **CFO Vietnam Q1** — CPL at $196 (target $250). On track. 12 demos booked.\n• **APAC Brand** — Reply rate dropped 18% WoW. Recommend A/B test on subject lines.\n• **1 escalation** — Meta budget pacing alert. Review?',
  },
  'what needs my attention': null, // alias resolved in findDemoScript
  'find cfo prospects in vietnam': {
    thinking: ['Searching Apollo/LinkedIn for CFOs in Vietnam...', 'Applying ICP filters...'],
    toolCalls: [{ name: 'search_prospects', input: { query: 'CFO Vietnam', filters: { location: 'Vietnam', title: 'CFO' }, limit: 5 } }],
    finalText: '**5 CFO prospects in Vietnam**\n\n| Name | Company | Score |\n|------|---------|-------|\n| Contact 1 manufacturing | manufacturing Co 1 | 87 |\n| Contact 2 manufacturing | manufacturing Co 2 | 84 |\n| ... | ... | ... |\n\nTop match: manufacturing Co 1 — CFO, matched Vietnam and finance. Want me to draft outreach for the top 3?',
  },
  'generate email sequence': {
    thinking: ['Generating 5-step email sequence for textile CFOs...'],
    toolCalls: [{ name: 'create_content', input: { content_type: 'email_sequence', context: { persona: 'CFO', industry: 'textiles' } } }],
    finalText: '**Email sequence (5 steps)** — 320 words, ~32 credits.\n\nStep 1 — Subject: Finance automation for CFO\nBody: Hi [First Name], I came across [Company] while researching high-growth Vietnamese enterprises...\n\nStep 2–5: [Full sequence in context]\n\n**Recommendation:** Load into Sequence A and A/B test subject line (87% confidence).',
  },
  'how is our meta performing': {
    thinking: ['Pulling Meta campaign data...', 'Analyzing performance...'],
    toolCalls: [{ name: 'query_campaign_data', input: { query_type: 'performance' } }, { name: 'analyze_performance', input: { metric: 'cpl' } }],
    finalText: '**Meta performance**\n\nSpend: $18,420 · Leads: 94 · CPL: $196 (target $250 ✓)\n\n**Insights:** CPL 12% above target on Ad Set 3. Reply rate 28% on sequence A. **Recommendation:** Pause Ad Set 3 (87% confidence).',
  },
  'pause the worst performing ad set': {
    thinking: ['Identifying worst-performing ad set...', 'Preparing pause action...'],
    toolCalls: [{ name: 'update_campaign', input: { campaign_id: 'c1', action: 'pause', payload: { ad_set_id: 'as3' } } }],
    finalText: '**Pause requested.** This requires your approval — approve in the card below to pause Ad Set 3.',
  },
  'update icp from our last wins': {
    thinking: ['Pulling closed deals...', 'Extracting patterns...', 'Updating ICP Builder...'],
    toolCalls: [
      { name: 'query_campaign_data', input: { query_type: 'pipeline' } },
      { name: 'analyze_performance', input: {} },
      { name: 'fill_form', input: { form_id: 'icp_builder', fields: { target_industries: ['Textiles', 'Manufacturing'], company_size_min: 200 } } },
    ],
    finalText: '**ICP refresh from last 10 wins**\n\nPatterns: 80% in Textiles/Manufacturing, 200–500 employees. Updated ICP Builder with new criteria. **Recommendation:** Re-score prospects (95% confidence).',
  },
  'send linkedin follow-ups': {
    thinking: ['Finding prospects who opened 3+ times...', 'Drafting messages...'],
    toolCalls: [{ name: 'send_outreach', input: { channel: 'linkedin', recipient: {}, message: '...' } }],
    finalText: '**Outreach queued.** 6 messages ready — approval required before sending. Review in the approval card.',
  },
};

// Normalize user message for demo lookup
function normalizeDemoKey(text) {
  return (text || '').toLowerCase().replace(/\s+/g, ' ').trim().slice(0, 80);
}

function findDemoScript(userMessage) {
  const key = normalizeDemoKey(userMessage);
  if (DEMO_RESPONSES[key]) return DEMO_RESPONSES[key];
  const lower = key.toLowerCase();
  if (lower.includes('attention')) return DEMO_RESPONSES['what needs attention'];
  if (lower.includes('prospect') && (lower.includes('vietnam') || lower.includes('cfo'))) return DEMO_RESPONSES['find cfo prospects in vietnam'];
  if (lower.includes('email sequence') || lower.includes('generate email')) return DEMO_RESPONSES['generate email sequence'];
  if (lower.includes('meta') && (lower.includes('perform') || lower.includes('how'))) return DEMO_RESPONSES['how is our meta performing'];
  if (lower.includes('pause') && (lower.includes('ad') || lower.includes('worst'))) return DEMO_RESPONSES['pause the worst performing ad set'];
  if (lower.includes('icp') && (lower.includes('win') || lower.includes('refresh'))) return DEMO_RESPONSES['update icp from our last wins'];
  if (lower.includes('linkedin') && (lower.includes('follow') || lower.includes('send'))) return DEMO_RESPONSES['send linkedin follow-ups'];
  return null;
}

export class ARIAEngine {
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
  }

  /**
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
   * @param {string} userMessage
   */
  async _runDemoMode(userMessage) {
    const script = findDemoScript(userMessage);
    const steps = script?.thinking || ['Analyzing request...', 'Preparing response...'];
    this.onThinkingUpdate(steps);
    await this._delay(800);
    for (let i = 0; i < steps.length; i++) {
      this.onThinkingUpdate(steps.slice(0, i + 1));
      await this._delay(600);
    }
    if (script?.toolCalls) {
      for (const tc of script.toolCalls) {
        this.onToolCall(tc.name, tc.input || {});
        await this._delay(400);
        const result = await execute(tc.name, tc.input || {}, undefined);
        this.onToolResult(tc.name, result);
        this._logAction(tc.name, tc.input, result);
        await this._delay(300);
      }
    }
    const finalText = script?.finalText || `Request received: "${userMessage.slice(0, 50)}...". Configure VITE_ANTHROPIC_API_KEY for full ARIA.`;
    for (let i = 0; i <= finalText.length; i += 2) {
      this.onStreamChunk(finalText.slice(i, i + 2));
      await this._delay(20);
    }
    this.onThinkingUpdate([]);
    ariaMemory.add('user', [{ type: 'text', text: userMessage }]);
    ariaMemory.add('assistant', [{ type: 'text', text: finalText }]);
  }

  /**
   * @param {string} userMessage
   * @param {Record<string, unknown>} context
   */
  async _runLiveMode(userMessage, context) {
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    ariaMemory.setSession({
      ...this._context,
      ...context,
      creditsRemaining: context.creditsRemaining ?? 25000,
    });
    const systemPrompt = buildSystemPrompt(ariaMemory.buildContextForSystemPrompt());
    const history = ariaMemory.getHistory();
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

    ariaMemory.add('user', [{ type: 'text', text: userMessage }]);
    ariaMemory.add('assistant', [{ type: 'text', text: fullAssistantText || '(No text response)' }]);
    this.onThinkingUpdate([]);
  }

  /**
   * @param {string} apiKey
   * @param {string} systemPrompt
   * @param {Array<{ role: string; content: unknown[] }>} messages
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
      tools: ARIA_TOOLS,
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
      const data = await res.json();
      return data;
    } catch (e) {
      console.error('Anthropic fetch error', e);
      return null;
    }
  }

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
    ariaMemory.clear();
  }

  /**
   * @param {string} [campaignId]
   * @param {string} [clientId]
   * @param {string} [role]
   */
  setContext(campaignId, clientId, role) {
    this._context = { campaignId, clientId, role };
    ariaMemory.setSession({
      currentCampaignId: campaignId,
      currentClientId: clientId,
      currentRole: role,
    });
  }

  /**
   * @param {string} documentContent
   * @param {string} documentName
   * @param {string} documentType
   */
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
}

const noop = () => {};
export const aria = new ARIAEngine(noop, noop, noop, noop);

export default ARIAEngine;
