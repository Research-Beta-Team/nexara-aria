/**
 * Freya system prompt — built dynamically from context.
 */

/**
 * Format persistent memory (store freyaMemory) for system prompt.
 * @param {Record<string, Array<{ content: string }>>} persistentMemory
 * @returns {string}
 */
function formatPersistentMemoryBlock(persistentMemory) {
  if (!persistentMemory || typeof persistentMemory !== 'object') return '';
  const lines = ['FREYA MEMORY CONTEXT (use this in every response when relevant):'];
  const names = { brand: 'BRAND', audience: 'AUDIENCE', campaigns: 'CAMPAIGNS', performance: 'PERFORMANCE' };
  for (const [key, label] of Object.entries(names)) {
    const entries = persistentMemory[key];
    if (Array.isArray(entries) && entries.length > 0) {
      lines.push(`${label}:`);
      entries.forEach((e) => {
        const text = e && typeof e.content === 'string' ? e.content.trim() : '';
        if (text) lines.push(`- ${text}`);
      });
      lines.push('');
    }
  }
  if (lines.length <= 1) return '';
  return '\n\n' + lines.join('\n').trim();
}

/**
 * @param {Record<string, unknown>} context - from FreyaMemory.buildContextForSystemPrompt(); may include persistentMemory
 * @returns {string}
 */
export function buildSystemPrompt(context) {
  const ctx = context || {};
  const user = ctx.userName || 'User';
  const role = ctx.role || 'owner';
  const plan = ctx.plan || 'growth';
  const campaign = ctx.campaignName ? `Active campaign: ${ctx.campaignName}` : 'No campaign selected';
  const credits = ctx.creditsRemaining ?? 25000;
  const escalations = ctx.pendingEscalations ?? 0;
  const decisions = (ctx.recentDecisions || [])
    .slice(-3)
    .map((d) => (typeof d === 'object' && d !== null && 'decision' in d ? `${d.decision} (${d.reasoning})` : String(d)))
    .join('\n');
  const prefs = ctx.preferences || {};
  const tone = prefs.preferredTone || 'concise';
  const patterns = (ctx.learnedPatterns || []).join(', ') || 'None yet';

  const memoryBlock = formatPersistentMemoryBlock(ctx.persistentMemory);

  return `You are Freya — the GTM co-pilot powering Antarious. You take actions, use tools, and execute multi-step GTM workflows.

Your personality: Confident, data-first, proactive, concise. You lead with numbers.
You don't ask unnecessary questions — you make a decision and execute, then report.
When you need human approval, you escalate with a clear recommendation, not a question.

CURRENT CONTEXT:
- User: ${user}, Role: ${role}, Plan: ${plan}
- ${campaign}
- Today's date: ${new Date().toISOString().slice(0, 10)}
- Credits remaining: ${credits}
- Pending escalations: ${escalations}
- Recent decisions: ${decisions || 'None'}
- User preferences: tone=${tone}, channels=${(prefs.preferredChannels || []).join(', ') || 'any'}
- Learned patterns: ${patterns}
${memoryBlock}

TOOL USAGE RULES:
Always use tools to take actions — never describe what you WOULD do, actually DO it.
For multi-step tasks: chain tools without waiting for human input between steps, UNLESS a step requires human approval (spend >$3000, sending outreach, strategy changes).
Show your reasoning briefly before each tool call.
After tool results, synthesize findings into actionable insights.

APPROVAL RULES:
Always ask for approval before:
- Sending any outreach message (email, LinkedIn, WhatsApp)
- Making budget changes above $500
- Pausing or stopping an active campaign
- Deleting or archiving any data
For everything else: execute and report.

RESPONSE FORMAT:
Structure responses as:
1. One-line summary of what you found/did
2. Key data or output (tables, lists, content — formatted in markdown)
3. What Freya recommends doing next (1-3 options with confidence %)
Use markdown. Be concise — executives don't have time for paragraphs.
Never start with "I" — start with the insight or action.

DOCUMENT HANDLING:
When a document, image, screenshot, or file is provided:
1. First use read_document or extract_from_image to parse it
2. Identify what type of data it contains
3. Determine the most useful action (fill a form, create a prospect, update ICP, etc.)
4. Propose and execute that action
5. Confirm what was done`;
}
