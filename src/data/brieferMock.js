/**
 * Mock data for Freya Campaign Briefer (Session 6).
 * One full brief template: goal, channels, budget, KPIs, messaging, checklist.
 */

export const BRIEFER_EXAMPLE_CHIPS = [
  'Launch Q2 enterprise ABM in Vietnam',
  'Re-engage dormant leads with email',
  'Scale LinkedIn demand gen for SMB',
  'Drive demo requests from webinar',
];

export const BRIEF_TEMPLATE = {
  goal: 'Launch Q2 enterprise ABM targeting CFOs in Vietnam; generate 40 MQLs and $800K pipeline in 90 days.',
  title: 'Q2 Vietnam CFO ABM Brief',
  createdAt: new Date().toISOString(),
  status: 'draft',
  strategicOverview: 'Target CFOs and finance leaders at mid-market companies in Vietnam. Use LinkedIn and email with account-based creative; support with one virtual event and intent-based retargeting. Position Antarious as the GTM operating system that cuts pipeline ops from 30+ hours to under 5 per week.',
  channels: [
    { id: 'ch1', name: 'LinkedIn', budget: 12000, pct: 40, targetCpl: 45, projectedMqls: 22, rationale: 'Primary channel for CFO audience; ABM targeting by job title and company size.' },
    { id: 'ch2', name: 'Email', budget: 6000, pct: 20, targetCpl: 28, projectedMqls: 18, rationale: 'Nurture and re-engagement; sequences aligned to intent signals.' },
    { id: 'ch3', name: 'Meta', budget: 4500, pct: 15, targetCpl: 38, projectedMqls: 10, rationale: 'Retargeting website and webinar attendees; lookalike from CRM.' },
    { id: 'ch4', name: 'Events', budget: 6000, pct: 20, targetCpl: 65, projectedMqls: 9, rationale: 'One virtual roundtable; invite top-fit accounts from ICP.' },
    { id: 'ch5', name: 'Content / SEO', budget: 1500, pct: 5, targetCpl: 22, projectedMqls: 6, rationale: 'Gated playbooks and landing pages; SEO for long-tail.' },
  ],
  kpiProjections: {
    mqls: 42,
    pipeline: 840000,
    cac: 310,
    confidencePct: 78,
    basis: 'Based on Q1 Vietnam pilot (18 MQLs, $360K pipeline) and current CPL benchmarks. Confidence reflects audience overlap and creative refresh.',
  },
  messagingFramework: {
    headline: 'From 30+ hours to under 5 — pipeline ops that scale.',
    valueProps: [
      'Single source of truth for pipeline and attribution',
      'Freya-powered briefs and content so you ship faster',
      'Board-ready reports without the manual lift',
    ],
    proofPoints: ['Used by 50+ B2B teams', '94% response rate within 24h', 'Average 2.1x pipeline in 6 months'],
    cta: 'Book a 15-min discovery call',
  },
  contentChecklist: [
    { id: 'cc1', channel: 'LinkedIn', item: 'Carousel: 5 slides on pipeline efficiency', done: false },
    { id: 'cc2', channel: 'LinkedIn', item: 'Single image ad: CFO testimonial', done: false },
    { id: 'cc3', channel: 'Email', item: 'Sequence 1: Intro + ROI stat', done: false },
    { id: 'cc4', channel: 'Email', item: 'Sequence 2: Case study link', done: false },
    { id: 'cc5', channel: 'Events', item: 'Roundtable invite + landing page', done: false },
    { id: 'cc6', channel: 'Content', item: 'Gated playbook: Vietnam GTM checklist', done: false },
  ],
};

/** Default empty brief for "Start over". */
export function getEmptyBrief() {
  return {
    goal: '',
    title: 'Untitled Brief',
    createdAt: new Date().toISOString(),
    status: 'draft',
    strategicOverview: '',
    channels: [],
    kpiProjections: { mqls: 0, pipeline: 0, cac: 0, confidencePct: 0, basis: '' },
    messagingFramework: { headline: '', valueProps: [], proofPoints: [], cta: '' },
    contentChecklist: [],
  };
}

/** Generate brief from goal string (mock: returns template with goal substituted). */
export function generateBriefFromGoal(goal) {
  return {
    ...BRIEF_TEMPLATE,
    goal: goal || BRIEF_TEMPLATE.goal,
    title: goal ? `${goal.slice(0, 40)}${goal.length > 40 ? '…' : ''}` : BRIEF_TEMPLATE.title,
    createdAt: new Date().toISOString(),
  };
}
