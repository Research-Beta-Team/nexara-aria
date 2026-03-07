/**
 * Mock data for Multi-Touch Attribution (Session 4).
 * Models: first_touch, last_touch, linear, w_shaped (default), time_decay.
 * Channel colors: LinkedIn, Google, Email, SEO, Meta, Events.
 */

export const ATTRIBUTION_MODELS = [
  { id: 'first_touch', label: 'First Touch', description: '100% credit to the first touchpoint in the journey.' },
  { id: 'last_touch', label: 'Last Touch', description: '100% credit to the last touchpoint before conversion.' },
  { id: 'linear', label: 'Linear', description: 'Equal credit across all touchpoints.' },
  { id: 'w_shaped', label: 'W-Shaped', description: 'Extra weight on first, middle (lead creation), and last touch.' },
  { id: 'time_decay', label: 'Time Decay', description: 'More credit to touchpoints closer to conversion.' },
];

export const CHANNEL_COLORS = {
  LinkedIn: '#0A66C2',
  Google: '#4285F4',
  Email: '#5EEAD4',
  SEO: '#3DDC84',
  Meta: '#0668E1',
  Events: '#A78BFA',
};

/** Per-model channel rollup: pipeline, revenue, touches, CPL, %. Used for chart and table. */
function buildChannelData(modelId) {
  const base = [
    { channel: 'LinkedIn', touches: 1240, pipeline: 420000, revenue: 98000, cpl: 52, roi: 2.8 },
    { channel: 'Google', touches: 980, pipeline: 310000, revenue: 72000, cpl: 38, roi: 2.6 },
    { channel: 'Email', touches: 2100, pipeline: 580000, revenue: 145000, cpl: 28, roi: 3.2 },
    { channel: 'SEO', touches: 840, pipeline: 190000, revenue: 42000, cpl: 22, roi: 2.4 },
    { channel: 'Meta', touches: 1560, pipeline: 270000, revenue: 61000, cpl: 41, roi: 2.1 },
    { channel: 'Events', touches: 320, pipeline: 180000, revenue: 52000, cpl: 65, roi: 3.5 },
  ];
  const totals = base.reduce((acc, r) => ({ pipeline: acc.pipeline + r.pipeline, revenue: acc.revenue + r.revenue }), { pipeline: 0, revenue: 0 });
  return base.map((row) => ({
    ...row,
    pipelinePct: totals.pipeline ? Math.round((row.pipeline / totals.pipeline) * 100) : 0,
    revenuePct: totals.revenue ? Math.round((row.revenue / totals.revenue) * 100) : 0,
  }));
}

/** Summary KPIs for the selected model (4 cards). */
export function getSummaryMetrics(modelId) {
  const data = buildChannelData(modelId);
  const totalPipeline = data.reduce((s, r) => s + r.pipeline, 0);
  const totalRevenue = data.reduce((s, r) => s + r.revenue, 0);
  const topChannel = data.sort((a, b) => b.revenue - a.revenue)[0];
  const avgCAC = 318;
  return {
    totalPipeline: totalPipeline,
    totalRevenue: totalRevenue,
    topChannel: topChannel?.channel || '—',
    topChannelRevenue: topChannel?.revenue || 0,
    avgCAC,
    pipelineFormatted: `$${(totalPipeline / 1000).toFixed(0)}K`,
    revenueFormatted: `$${(totalRevenue / 1000).toFixed(0)}K`,
  };
}

/** Table rows: campaign × channel (8 campaigns, some channels per campaign). */
export function getAttributionTable(modelId) {
  const campaigns = [
    'Q2 Enterprise MQL',
    'Vietnam CFO Play',
    'APAC Brand',
    'Nurture Re-engagement',
    'Webinar Series',
    'LinkedIn ABM',
    'Google Demand',
    'Events Q2',
  ];
  const channels = Object.keys(CHANNEL_COLORS);
  const rows = [];
  campaigns.forEach((campaign, i) => {
    channels.slice(0, 4).forEach((channel, j) => {
      const touches = 80 + (i * 12) + (j * 20);
      const pipeline = 20000 + (i + j) * 15000;
      const revenue = 4000 + (i + j) * 3000;
      rows.push({
        id: `${campaign}-${channel}`,
        campaign,
        channel,
        touches,
        pipeline,
        revenue,
        roi: (2 + Math.random() * 1.5).toFixed(2),
        cac: 280 + (i + j) * 15,
      });
    });
  });
  return rows;
}

/** Touchpoint types for journey. */
export const TOUCHPOINT_TYPES = {
  email: { label: 'Email', icon: 'mail' },
  ad: { label: 'Ad', icon: 'megaphone' },
  content: { label: 'Content', icon: 'file' },
  website: { label: 'Website', icon: 'globe' },
  sdr: { label: 'SDR', icon: 'user' },
  demo: { label: 'Demo', icon: 'video' },
};

/** 5 deals with full touchpoint journeys (ordered). */
export const DEALS_WITH_JOURNEY = [
  {
    id: 'd1',
    name: 'HealthBridge Analytics',
    value: 42000,
    stage: 'Closed Won',
    touchpoints: [
      { type: 'content', label: 'Whitepaper download', weight: 15, at: 'Day 0' },
      { type: 'email', label: 'Nurture sequence', weight: 20, at: 'Day 3' },
      { type: 'ad', label: 'LinkedIn retarget', weight: 25, at: 'Day 7' },
      { type: 'website', label: 'Pricing page', weight: 15, at: 'Day 10' },
      { type: 'sdr', label: 'First call', weight: 15, at: 'Day 12' },
      { type: 'demo', label: 'Product demo', weight: 10, at: 'Day 18' },
    ],
  },
  {
    id: 'd2',
    name: 'Nexus Logistics',
    value: 28500,
    stage: 'Negotiation',
    touchpoints: [
      { type: 'ad', label: 'Google search', weight: 30, at: 'Day 0' },
      { type: 'email', label: 'Follow-up', weight: 20, at: 'Day 2' },
      { type: 'content', label: 'Case study', weight: 15, at: 'Day 5' },
      { type: 'sdr', label: 'Discovery', weight: 20, at: 'Day 8' },
      { type: 'demo', label: 'Demo', weight: 15, at: 'Day 14' },
    ],
  },
  {
    id: 'd3',
    name: 'FinServe Global',
    value: 95000,
    stage: 'Closed Won',
    touchpoints: [
      { type: 'email', label: 'Webinar invite', weight: 15, at: 'Day 0' },
      { type: 'content', label: 'Webinar', weight: 25, at: 'Day 5' },
      { type: 'email', label: 'Nurture', weight: 15, at: 'Day 8' },
      { type: 'website', label: 'Pricing', weight: 15, at: 'Day 12' },
      { type: 'sdr', label: 'Call', weight: 15, at: 'Day 15' },
      { type: 'demo', label: 'Executive briefing', weight: 15, at: 'Day 22' },
    ],
  },
  {
    id: 'd4',
    name: 'CloudNine Software',
    value: 18000,
    stage: 'Proposal',
    touchpoints: [
      { type: 'website', label: 'Blog', weight: 25, at: 'Day 0' },
      { type: 'email', label: 'Newsletter', weight: 20, at: 'Day 4' },
      { type: 'ad', label: 'LinkedIn', weight: 25, at: 'Day 7' },
      { type: 'sdr', label: 'First touch', weight: 30, at: 'Day 10' },
    ],
  },
  {
    id: 'd5',
    name: 'Medglobal',
    value: 12000,
    stage: 'Discovery',
    touchpoints: [
      { type: 'content', label: 'Partnership page', weight: 30, at: 'Day 0' },
      { type: 'email', label: 'Outreach', weight: 35, at: 'Day 2' },
      { type: 'sdr', label: 'Intro call', weight: 35, at: 'Day 5' },
    ],
  },
];

/** Channel data for chart by model (same structure for all for prototype; real app would vary by model). */
export function getChannelRevenueData(modelId) {
  return buildChannelData(modelId);
}

/** Pipeline influence per campaign (for PipelineInfluenceCard or table). */
export function getPipelineInfluence(modelId) {
  return [
    { campaign: 'Q2 Enterprise MQL', pipeline: 240000, pct: 28 },
    { campaign: 'Email Nurture', pipeline: 180000, pct: 21 },
    { campaign: 'LinkedIn ABM', pipeline: 160000, pct: 19 },
    { campaign: 'Vietnam CFO Play', pipeline: 120000, pct: 14 },
    { campaign: 'Webinar Series', pipeline: 90000, pct: 11 },
    { campaign: 'Others', pipeline: 60000, pct: 7 },
  ];
}

/** ARIA insight cards (3) with action labels. */
export const ARIA_INSIGHTS = [
  { id: 'ar1', title: 'Reallocate budget to Email', body: 'Email drives 29% of revenue at lowest CPL. Consider shifting 10% from Meta to Email for Q3.', actionLabel: 'Reallocate budget', actionRoute: '/analytics' },
  { id: 'ar2', title: 'Improve email performance', body: 'Top converting deals had 2+ email touches in first 7 days. Review nurture sequences.', actionLabel: 'View email performance', actionRoute: '/analytics' },
  { id: 'ar3', title: 'Events ROI highest', body: 'Events show 3.5x ROI with limited volume. Scale field events or virtual events next quarter.', actionLabel: 'View events', actionRoute: '/analytics' },
];
