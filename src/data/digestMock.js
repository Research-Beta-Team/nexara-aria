/**
 * Mock data for Weekly Executive Digest (Session 5).
 * One week KPIs, anomalies, priority actions, delivery meta.
 */

export const DIGEST_WEEK = {
  label: 'Week of Mar 3–9, 2025',
  start: '2025-03-03',
  end: '2025-03-09',
};

export const DIGEST_KPIS = [
  { id: 'k1', name: 'Pipeline Created', value: '$1.24M', vsLastWeek: '+12%', vsTarget: '98%', trend: 'up' },
  { id: 'k2', name: 'MQLs', value: '42', vsLastWeek: '+8%', vsTarget: '105%', trend: 'up' },
  { id: 'k3', name: 'CAC', value: '$312', vsLastWeek: '-5%', vsTarget: '94%', trend: 'down' },
  { id: 'k4', name: 'Response Rate 24h', value: '94%', vsLastWeek: '+2pp', vsTarget: '100%', trend: 'up' },
  { id: 'k5', name: 'Content Approved', value: '18', vsLastWeek: '+28%', vsTarget: '90%', trend: 'up' },
  { id: 'k6', name: 'Attribution (W-Shaped)', value: 'Email 29%', vsLastWeek: '—', vsTarget: '—', trend: 'neutral' },
];

export const DIGEST_NARRATIVE = `This week pipeline creation was strong (+12% WoW), with MQLs ahead of target. Email continues to lead attribution at 29% under W-Shaped model. One anomaly: Vietnam campaign CPL spiked 40% — recommend reviewing creative and audience overlap. Top priority: approve the three pending legal items to unblock the Q2 launch.`;

export const DIGEST_ANOMALIES = [
  {
    id: 'a1',
    severity: 'high',
    title: 'Vietnam campaign CPL spike',
    description: 'CPL increased 40% WoW. Possible audience overlap with APAC Brand or creative fatigue.',
    viewRoute: '/campaigns',
    actionReady: true,
  },
  {
    id: 'a2',
    severity: 'medium',
    title: 'Lead-to-MQL conversion dip',
    description: 'Conversion dropped to 16% from 19% last week. Check scoring and nurture timing.',
    viewRoute: '/analytics',
    actionReady: false,
  },
];

export const DIGEST_PRIORITY_ACTIONS = [
  {
    id: 'p1',
    number: 1,
    description: 'Approve 3 items in Legal review to unblock Q2 Enterprise launch.',
    actionLabel: 'Do This',
    actionRoute: '/campaigns/approvals',
    hasDraft: false,
  },
  {
    id: 'p2',
    number: 2,
    description: 'Review Vietnam campaign audience and creative; consider pause or refresh.',
    actionLabel: 'View Draft',
    actionRoute: '/campaigns',
    hasDraft: true,
  },
  {
    id: 'p3',
    number: 3,
    description: 'Reallocate 10% Meta budget to Email (Freya recommendation).',
    actionLabel: 'Do This',
    actionRoute: '/analytics/attribution',
    hasDraft: false,
  },
];

export const DIGEST_DELIVERY = {
  status: 'delivered',
  deliveredAt: '2025-03-10T08:00:00Z',
  recipients: 3,
  format: 'email',
};

/** Mini-chart data for performance sparklines (e.g. last 7 days). */
export const DIGEST_MINI_CHARTS = [
  { metric: 'Pipeline', dataKey: 'value', values: [120, 145, 138, 162, 155, 168, 180] },
  { metric: 'MQLs', dataKey: 'value', values: [4, 6, 5, 8, 6, 7, 8] },
  { metric: 'CAC', dataKey: 'value', values: [340, 328, 318, 315, 312, 310, 312] },
];

/** Default schedule for DigestScheduleConfig. */
export const DIGEST_SCHEDULE_DEFAULT = {
  day: 'Monday',
  time: '08:00',
  timezone: 'America/Los_Angeles',
  recipients: ['exec@medglobal.org', 'cmo@medglobal.org', 'asif@nexara.demo'],
  format: 'email',
};
