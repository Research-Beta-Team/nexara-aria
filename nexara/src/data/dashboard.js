// ─────────────────────────────────────────────
//  NEXARA — Dashboard Mock Data (client-aware)
//  Keyed by clientId; use getDashboardForClient(activeClientId)
// ─────────────────────────────────────────────

const baseCampaigns = [
  { id: 'c1', name: 'CFO Vietnam Q1', goal: 120, current: 94, health: 'on_track', spend: 18420, cpl: 196, channels: 'LinkedIn + Meta' },
  { id: 'c2', name: 'APAC Brand Awareness', goal: 60, current: 71, health: 'ahead', spend: 9100, cpl: 128, channels: 'Meta + Display' },
  { id: 'c3', name: 'SEA Demand Gen', goal: 80, current: 29, health: 'at_risk', spend: 14800, cpl: 510, channels: 'LinkedIn' },
];

const baseAgentFeed = [
  { id: 'af1', agent: 'SDR-7', message: 'Reached out to 12 new CFO prospects via LinkedIn — 3 accepted.', time: '2m ago', color: '#3DDC84' },
  { id: 'af2', agent: 'ContentBot-2', message: 'Generated 4 ad variants for SEA Demand Gen. Awaiting approval.', time: '8m ago', color: '#5EEAD4' },
  { id: 'af3', agent: 'BidOptimizer-1', message: 'Increased LinkedIn bid cap by 12% on CFO Vietnam — CPL improving.', time: '15m ago', color: '#F5C842' },
  { id: 'af4', agent: 'Analyst-3', message: 'Weekly pacing report ready. APAC ahead by 18% on goal.', time: '32m ago', color: '#3DDC84' },
  { id: 'af5', agent: 'SDR-7', message: 'SEA Demand Gen CPL alert: $510 exceeds threshold of $400.', time: '1h ago', color: '#FF6E7A' },
  { id: 'af6', agent: 'QABot-1', message: 'Landing page A/B test concluded: Variant B wins by 22% CVR.', time: '2h ago', color: '#5EEAD4' },
];

const baseEscalations = [
  { id: 'e1', severity: 'critical', client: 'Medglobal', title: 'SEA CPL exceeds budget threshold by 27%', time: '5m ago' },
  { id: 'e2', severity: 'warning', client: 'Medglobal', title: 'Meta ad account flagged for review', time: '1h ago' },
  { id: 'e3', severity: 'warning', client: 'Medglobal', title: 'CFO campaign pacing 6% under weekly goal', time: '3h ago' },
];

const baseMetaStats = { spend: 18420, leads: 94, cpl: 196, ctr: 3.8 };

const baseAriaInsights = [
  { id: 'i1', color: '#FF6E7A', text: 'SEA Demand Gen CPL is 27% over target. Consider pausing bottom-performing ad sets.' },
  { id: 'i2', color: '#F5C842', text: 'CFO Vietnam Q1 pacing is solid but LinkedIn frequency hitting 4.2 — rotate creatives.' },
  { id: 'i3', color: '#3DDC84', text: 'APAC Brand Awareness is 18% ahead of goal. Budget reallocation opportunity.' },
];

const baseChartData = [
  { day: 'Mon', ctr: 2.9 }, { day: 'Tue', ctr: 3.1 }, { day: 'Wed', ctr: 3.4 },
  { day: 'Thu', ctr: 3.2 }, { day: 'Fri', ctr: 3.8 }, { day: 'Sat', ctr: 3.6 }, { day: 'Sun', ctr: 4.1 },
];

// KPI current values per client (metric id → value)
const baseKpiValues = {
  demos_booked: 42,
  cpl: 31,
  pipeline_value: 185000,
};
const basePipelineFunnel = [
  { stage: 'IQL', count: 120 },
  { stage: 'MQL', count: 68 },
  { stage: 'SQL', count: 42 },
  { stage: 'Demo Booked', count: 28 },
  { stage: 'Proposal', count: 12 },
  { stage: 'Won', count: 8 },
];

// Per-client overrides (optional)
const clientOverrides = {
  'glowup-cosmetics': {
    campaigns: [
      { id: 'gc1', name: 'Spring Launch — Meta', goal: 80, current: 62, health: 'on_track', spend: 12400, cpl: 42, channels: 'Meta + Reels' },
      { id: 'gc2', name: 'Retargeting Q1', goal: 120, current: 98, health: 'ahead', spend: 8200, cpl: 38, channels: 'Meta' },
    ],
    ariaInsights: [
      { id: 'i1', color: '#F5C842', text: 'Reels CTR 2.1x feed. Consider shifting 20% budget to Reels.' },
      { id: 'i2', color: '#3DDC84', text: 'ROAS at 4.2x — above target. Scale winning creatives.' },
    ],
  },
  'techbridge-consulting': {
    campaigns: [
      { id: 'tb1', name: 'Referral Pipeline Q1', goal: 20, current: 14, health: 'on_track', spend: 0, cpl: 0, channels: 'LinkedIn + Email' },
      { id: 'tb2', name: 'Proposal Follow-ups', goal: 8, current: 5, health: 'at_risk', spend: 0, cpl: 0, channels: 'Email' },
    ],
  },
  'grameen-impact-fund': {
    campaigns: [
      { id: 'gf1', name: 'Q1 Donor Campaign', goal: 50000, current: 32000, health: 'on_track', spend: 4200, cpl: 0, channels: 'Meta + Email' },
      { id: 'gf2', name: 'Social Reach — Impact', goal: 100000, current: 78000, health: 'on_track', spend: 1200, cpl: 0, channels: 'Meta + Social' },
    ],
    ariaInsights: [
      { id: 'i1', color: '#3DDC84', text: 'Email open rate at 38% — above target. Donor pipeline on track.' },
    ],
  },
};

export const dashboardByClient = {
  'medglobal': {
    campaigns: baseCampaigns,
    agentFeed: baseAgentFeed,
    escalationsSummary: baseEscalations,
    metaStats: baseMetaStats,
    ariaInsights: baseAriaInsights,
    chartData: baseChartData,
    kpiValues: baseKpiValues,
    pipelineFunnel: basePipelineFunnel,
  },
  'glowup-cosmetics': {
    campaigns: clientOverrides['glowup-cosmetics'].campaigns,
    agentFeed: baseAgentFeed.slice(0, 4),
    escalationsSummary: baseEscalations.slice(0, 2),
    metaStats: { ...baseMetaStats, spend: 12400, leads: 62, cpl: 42 },
    ariaInsights: clientOverrides['glowup-cosmetics'].ariaInsights,
    chartData: baseChartData,
    kpiValues: { roas: 4.2, aov: 62, meta_spend_efficiency: 1.15 },
    pipelineFunnel: null,
  },
  'techbridge-consulting': {
    campaigns: clientOverrides['techbridge-consulting'].campaigns,
    agentFeed: baseAgentFeed.filter((a) => ['SDR-7', 'ContentBot-2', 'Analyst-3'].includes(a.agent)),
    escalationsSummary: [],
    metaStats: null,
    ariaInsights: baseAriaInsights.slice(0, 2),
    chartData: baseChartData,
    kpiValues: { qualified_meetings: 14, proposals_sent: 5, win_rate: 28 },
    pipelineFunnel: [{ stage: 'Lead', count: 45 }, { stage: 'Meeting', count: 14 }, { stage: 'Proposal', count: 5 }, { stage: 'Won', count: 2 }],
  },
  'grameen-impact-fund': {
    campaigns: clientOverrides['grameen-impact-fund'].campaigns,
    agentFeed: baseAgentFeed.slice(0, 3),
    escalationsSummary: baseEscalations.slice(0, 1),
    metaStats: { spend: 4200, leads: 0, cpl: 0, ctr: 2.1 },
    ariaInsights: clientOverrides['grameen-impact-fund'].ariaInsights,
    chartData: baseChartData,
    kpiValues: { donations: 32000, email_open_rate: 38, social_reach: 78000 },
    pipelineFunnel: null,
  },
};

export function getDashboardForClient(clientId) {
  return dashboardByClient[clientId] || dashboardByClient['medglobal'];
}

// Legacy flat exports (default to medglobal for backward compatibility)
export const campaigns = baseCampaigns;
export const agentFeed = baseAgentFeed;
export const escalationsSummary = baseEscalations;
export const metaStats = baseMetaStats;
export const ariaInsights = baseAriaInsights;
export const ctrChartData = baseChartData;
