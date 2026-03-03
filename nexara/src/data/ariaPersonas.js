/**
 * ARIA Persona Configuration — persona definitions and preview responses.
 */

export const PERSONAS = [
  {
    id: 'cro',
    label: 'Chief Revenue Officer',
    icon: 'trophy',
    color: 'var(--c-primary)',
    description: 'ARIA thinks at the revenue level. Every decision connects to pipeline and closed deals. Responses are strategic, data-led, executive-facing.',
    tag: 'Best for: Agency owners, solo founders, C-suite teams',
  },
  {
    id: 'gtm_strategist',
    label: 'GTM Strategist',
    icon: 'map',
    color: 'var(--c-secondary)',
    description: 'ARIA thinks in positioning, ICP, channels, and message-market fit. Deep go-to-market frameworks applied to every campaign.',
    tag: 'Best for: Marketing leaders, consultants',
  },
  {
    id: 'campaign_manager',
    label: 'Campaign Manager',
    icon: 'settings',
    color: '#6B9478',
    description: 'ARIA is execution-focused. Tracks tasks, timelines, and deliverables. Flags blockers, optimizes workflows, keeps campaigns on schedule.',
    tag: 'Best for: Marketing managers, ops leads',
  },
  {
    id: 'business_analyst',
    label: 'Business Analyst',
    icon: 'bar-chart',
    color: '#5EEAD4',
    description: 'ARIA leads with data. Every recommendation comes with supporting numbers, confidence scores, and trade-off analysis.',
    tag: 'Best for: Analysts, data-driven founders',
  },
  {
    id: 'cultural_strategist',
    label: 'Cultural Strategist',
    icon: 'globe',
    color: '#B8FF35',
    description: 'ARIA applies cultural and regional context to all outputs. Adapts tone, references, and approach for local markets (Bangladesh, South Asia, Gulf).',
    tag: 'Best for: Regional campaigns, localized GTM',
  },
  {
    id: 'custom',
    label: 'Custom Role',
    icon: 'pencil',
    color: 'var(--c-amber)',
    description: "Define ARIA's exact role yourself. Paste a role description or title.",
    tag: 'For advanced users',
  },
];

const CHANNEL_QUESTION = "What's the best channel to reach CFOs in textile factories in Vietnam?";
const PRICING_QUESTION = "How should we position pricing for a 3-year commitment to manufacturing CFOs?";
const CONTENT_QUESTION = "What angle should we lead with in our next LinkedIn campaign for supply chain directors?";

export const PREVIEW_QUESTIONS = [
  { id: 'channel', label: 'Channel question', text: CHANNEL_QUESTION },
  { id: 'pricing', label: 'Pricing question', text: PRICING_QUESTION },
  { id: 'content', label: 'Content question', text: CONTENT_QUESTION },
];

export function getPreviewResponse(personaId, questionId) {
  const responses = {
    cro: {
      channel: "LinkedIn and email in parallel — but the real lever is pipeline. For Vietnam textile CFOs, aim for 2–3 touches per week with a clear path to demo. Our data shows CFOs in this segment convert at 1.8x when the first touch cites a concrete ROI number (e.g. 'X% reduction in reconciliation time'). I'd lead with LinkedIn to build recognition, then a short email sequence with one case study and a demo CTA. Track by opportunity stage, not just reply rate.",
      pricing: "Position around annual value, not monthly cost. Manufacturing CFOs care about predictability and audit trail. Lead with a 3-year TCO comparison vs status quo (spreadsheet + manual reconciliation). Include an early-exit clause so it doesn't feel like a trap. Our win rate on 3-year deals goes up 40% when we anchor on 'locked-in pricing' and 'no surprise audits.'",
      content: "Lead with a single metric that matters to supply chain directors: e.g. 'On-time delivery improved 23%' or 'Stockouts down 40%.' Avoid generic thought leadership. One clear number in the first line outperforms three paragraphs of positioning. Then CTA: Book a demo. We've seen 2.1x CTR when the hero stat is industry-specific.",
    },
    gtm_strategist: {
      channel: "Channel choice follows ICP and message-market fit. For Vietnam textile CFOs, you're dealing with a concentrated industry — LinkedIn for awareness and credibility, email for sequenced value. Add a localised layer: consider WhatsApp or local events if decision-makers expect relationship-first engagement. Map the buying committee: who signs the cheque vs who runs the evaluation? Channel mix should mirror that.",
      pricing: "Frame 3-year commitment as risk reduction and predictability, not discount. GTM angle: position against the cost of inaction (manual processes, audit risk). Lead with a one-pager that shows TCO and implementation timeline. Optional: offer a 12-month pilot with a rollover clause so it feels like a stepping stone, not a lock-in.",
      content: "Angle should come from your ICP research: what's the #1 pain for supply chain directors in your target segment? If it's visibility, lead with 'Single source of truth for inventory and orders.' If it's supplier risk, lead with compliance and audit readiness. Message-market fit beats generic thought leadership every time.",
    },
    campaign_manager: {
      channel: "Best approach: LinkedIn (connection + 2 follow-ups) then email sequence (5 steps, 3–4 days apart). Track opens and replies in the same CRM view. Set a reminder at day 7 to check reply rate; if under 25%, A/B test the subject line. I'd schedule the first touch for Tuesday or Wednesday 9–11am Vietnam time — we see highest engagement then.",
      pricing: "Create a simple 3-touch sequence: (1) Value overview + case study, (2) Pricing one-pager + TCO, (3) Demo CTA or calendar link. Add a task to follow up on opened-but-no-reply after 5 days. Tag leads by '3-year interest' so we can prioritise them in the pipeline.",
      content: "Recommend: 3 ad variants — one data-led ('X% of supply chain directors say…'), one pain-led ('Stop firefighting stockouts'), one social proof ('How [similar company] reduced…'). Run for 2 weeks, then double down on the winning angle. I'll set a checkpoint to review performance and adjust copy.",
    },
    business_analyst: {
      channel: "Data from similar segments: LinkedIn + email combo yields ~31% reply rate for CFOs in manufacturing; email-only ~18%. For Vietnam specifically, we don't have enough sample yet — recommend a 50/50 split and measure. Key metric: cost per qualified reply. I'd track channel attribution and run a small test (n=100 per channel) before scaling.",
      pricing: "Benchmark: 3-year commitments in B2B SaaS for this segment show 22% higher LTV and 15% lower churn. Position with a TCO model: show 1y vs 3y cost and the implied discount. Include confidence interval: 'Based on 47 similar deals, implementation is typically 4–6 weeks.' Recommend leading with the number that reduces perceived risk.",
      content: "Recommend A/B testing 2 angles: (A) industry benchmark ('Supply chain directors report X% improvement in…') vs (B) pain-first ('The hidden cost of manual reconciliation'). Run for 14 days, min 500 impressions per variant. We can then recommend the winner with a confidence score. I'll pull last quarter's content performance to suggest a baseline.",
    },
    cultural_strategist: {
      channel: "In Vietnam, relationship and trust matter before hard sell. Best channel mix: LinkedIn for professional credibility, then a warm email (or WhatsApp if they've opted in) that references local context — e.g. textile export cycles, regional compliance, or a Vietnam-specific case study. Avoid generic global messaging; tailor references to Vietnamese business culture and the role of the CFO in family-owned or state-linked firms.",
      pricing: "Position 3-year commitment with cultural nuance: emphasise stability and long-term partnership, which align with local expectations. Avoid pressure tactics; offer a clear ROI story and, if possible, a local reference or case study. Consider payment terms that match regional norms (e.g. annual invoicing). Lead with respect for their process and timeline.",
      content: "Lead with an angle that resonates in the region: e.g. supply chain resilience, compliance with local and export standards, or how similar factories in South Asia have adopted the solution. Use a Vietnam or South Asia-specific stat or reference in the first line. Tone: professional, respectful, and locally relevant — not generic global B2B.",
    },
    custom: {
      channel: "Based on your custom role settings, ARIA would tailor channel recommendations to your defined priorities — combining strategic fit, execution steps, and any regional or data constraints you've specified.",
      pricing: "Your custom persona would frame pricing and commitment terms according to the role and rules you've configured, ensuring consistency with how you want ARIA to present recommendations.",
      content: "With a custom role, ARIA would recommend content angles aligned to your stated focus — whether that's data, positioning, execution, or regional nuance — and apply your rules of engagement.",
    },
  };
  return responses[personaId]?.[questionId] || responses.cro[questionId] || '';
}
