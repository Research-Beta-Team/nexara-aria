// ─────────────────────────────────────────────
//  NEXARA — Dashboard Mock Data
// ─────────────────────────────────────────────

export const campaigns = [
  {
    id: 'c1',
    name: 'CFO Vietnam Q1',
    goal: 120,
    current: 94,
    health: 'on_track',   // on_track | ahead | at_risk
    spend: 18420,
    cpl: 196,
    channels: 'LinkedIn + Meta',
  },
  {
    id: 'c2',
    name: 'APAC Brand Awareness',
    goal: 60,
    current: 71,
    health: 'ahead',
    spend: 9100,
    cpl: 128,
    channels: 'Meta + Display',
  },
  {
    id: 'c3',
    name: 'SEA Demand Gen',
    goal: 80,
    current: 29,
    health: 'at_risk',
    spend: 14800,
    cpl: 510,
    channels: 'LinkedIn',
  },
];

export const agentFeed = [
  {
    id: 'af1',
    agent: 'SDR-7',
    message: 'Reached out to 12 new CFO prospects via LinkedIn — 3 accepted.',
    time: '2m ago',
    color: '#3DDC84',
  },
  {
    id: 'af2',
    agent: 'ContentBot-2',
    message: 'Generated 4 ad variants for SEA Demand Gen. Awaiting approval.',
    time: '8m ago',
    color: '#5EEAD4',
  },
  {
    id: 'af3',
    agent: 'BidOptimizer-1',
    message: 'Increased LinkedIn bid cap by 12% on CFO Vietnam — CPL improving.',
    time: '15m ago',
    color: '#F5C842',
  },
  {
    id: 'af4',
    agent: 'Analyst-3',
    message: 'Weekly pacing report ready. APAC ahead by 18% on goal.',
    time: '32m ago',
    color: '#3DDC84',
  },
  {
    id: 'af5',
    agent: 'SDR-7',
    message: 'SEA Demand Gen CPL alert: $510 exceeds threshold of $400.',
    time: '1h ago',
    color: '#FF6E7A',
  },
  {
    id: 'af6',
    agent: 'QABot-1',
    message: 'Landing page A/B test concluded: Variant B wins by 22% CVR.',
    time: '2h ago',
    color: '#5EEAD4',
  },
];

export const escalationsSummary = [
  {
    id: 'e1',
    severity: 'critical',   // critical | warning | info
    client: 'Acme Corp',
    title: 'SEA CPL exceeds budget threshold by 27%',
    time: '5m ago',
  },
  {
    id: 'e2',
    severity: 'warning',
    client: 'TechVN Ltd',
    title: 'Meta ad account flagged for review',
    time: '1h ago',
  },
  {
    id: 'e3',
    severity: 'warning',
    client: 'Acme Corp',
    title: 'CFO campaign pacing 6% under weekly goal',
    time: '3h ago',
  },
];

export const metaStats = {
  spend:  18420,
  leads:  94,
  cpl:    196,
  ctr:    3.8,
};

export const ariaInsights = [
  {
    id: 'i1',
    color: '#FF6E7A',
    text: 'SEA Demand Gen CPL is 27% over target. Consider pausing bottom-performing ad sets.',
  },
  {
    id: 'i2',
    color: '#F5C842',
    text: 'CFO Vietnam Q1 pacing is solid but LinkedIn frequency hitting 4.2 — rotate creatives.',
  },
  {
    id: 'i3',
    color: '#3DDC84',
    text: 'APAC Brand Awareness is 18% ahead of goal. Budget reallocation opportunity.',
  },
];

export const ctrChartData = [
  { day: 'Mon', ctr: 2.9 },
  { day: 'Tue', ctr: 3.1 },
  { day: 'Wed', ctr: 3.4 },
  { day: 'Thu', ctr: 3.2 },
  { day: 'Fri', ctr: 3.8 },
  { day: 'Sat', ctr: 3.6 },
  { day: 'Sun', ctr: 4.1 },
];
