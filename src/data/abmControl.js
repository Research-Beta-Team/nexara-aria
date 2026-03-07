// ─────────────────────────────────────────────
//  ABM Intelligence Layer — Control Architecture
//  T1 Human Led | T2 Human Supervised | T3 AI Automated
// ─────────────────────────────────────────────

export const CONTROL_SUMMARY = {
  t1: { count: 12, label: 'T1 — Human Led, AI Assisted', description: 'Full detail, account by account. All decisions made by VP.' },
  t2: { count: 47, label: 'T2 — Human Supervised, AI Semi-Automated', description: 'Cluster view, exception-based. AI execution summary; accounts needing attention flagged.' },
  t3: { count: 218, label: 'T3 — AI Fully Automated', description: 'Program view, metrics only. Sequence performance, qualification pipeline, exceptions for human review.' },
};

// T2 clusters (segment/industry) — human supervisor sees these
export const T2_CLUSTERS = [
  { id: 'tech', name: 'Technology', accountCount: 14, supervisor: 'Jordan', playbook: 'Enterprise ABM Program', executionThisWeek: 23, attentionCount: 2 },
  { id: 'healthcare', name: 'Healthcare', accountCount: 9, supervisor: 'Sam', playbook: 'Healthcare Pilot', executionThisWeek: 12, attentionCount: 1 },
  { id: 'retail', name: 'Retail', accountCount: 8, supervisor: 'Alex', playbook: 'Retail Ops', executionThisWeek: 15, attentionCount: 0 },
  { id: 'education', name: 'Education', accountCount: 7, supervisor: 'Sam', playbook: 'Education Programs', executionThisWeek: 8, attentionCount: 2 },
  { id: 'logistics', name: 'Logistics', accountCount: 9, supervisor: 'Jordan', playbook: 'Logistics Ops', executionThisWeek: 18, attentionCount: 1 },
];

// T2 execution summary (this week)
export const T2_EXECUTION_SUMMARY = {
  emailsSent: 76,
  linkedInTouches: 34,
  contentDelivered: 42,
  accountsMoved: 5,
  awaitingApproval: 3, // C-suite outreach pending
};

// T2 accounts needing attention (elevated intent or exception)
export const T2_ATTENTION_ACCOUNTS = [
  { id: 'acc-4', name: 'CloudNine Software', cluster: 'Technology', reason: 'Champion ready for pricing — proposal sent', intentScore: 92 },
  { id: 'acc-6', name: 'EduTech Partners', cluster: 'Education', reason: 'No touch in 12 days — check-in recommended', intentScore: 48 },
  { id: 'acc-7', name: 'LogiFlow Systems', cluster: 'Logistics', reason: 'COO meeting requested — confirm time', intentScore: 88 },
];

// T2 promotion candidates (AI recommends T1, VP approves)
export const T2_PROMOTION_CANDIDATES = [
  { id: 'acc-4', name: 'CloudNine Software', industry: 'Technology', estimatedDeal: 185000, intentScore: 92, signals: 'Champion identified, pricing discussion complete, contract in review' },
  { id: 'acc-7', name: 'LogiFlow Systems', industry: 'Logistics', estimatedDeal: 195000, intentScore: 88, signals: 'COO engaged, champion highly active, exec briefing scheduled' },
];

// T3 program metrics
export const T3_PROGRAM_METRICS = {
  totalAccounts: 218,
  inSequence: 189,
  qualifiedThisMonth: 12,
  meetingsBooked: 8,
  avgSequenceLength: 4.2,
  openRate: 0.42,
  replyRate: 0.18,
};

// T3 qualification pipeline (recent)
export const T3_QUALIFICATION_PIPELINE = [
  { company: 'DataVault Security', score: 78, stage: 'Meeting booked', recommendedAction: 'Hand off to T2' },
  { company: 'MediaHouse', score: 95, stage: 'Contract sent', recommendedAction: 'Hand off to AE' },
  { company: 'StartupLabs', score: 70, stage: 'Demo completed', recommendedAction: 'Continue nurture' },
  { company: 'GreenEnergy Co', score: 52, stage: 'Nurture', recommendedAction: 'Monitor' },
];

// T3 exceptions — trigger human review
export const T3_EXCEPTIONS = [
  { id: 'ex1', type: 'qualification_threshold', company: 'MediaHouse', message: 'Reached close-ready. Recommend T1 handoff.', severity: 'high', createdAt: '2025-03-02' },
  { id: 'ex2', type: 'outside_parameters', company: 'BuildRight Construction', message: 'Prospect response outside handling — negative sentiment. Sequence paused.', severity: 'high', createdAt: '2025-03-01' },
  { id: 'ex3', type: 'high_value_engagement', company: 'DataVault Security', message: 'CISO engaged; security review requested. VP alert regardless of tier.', severity: 'medium', createdAt: '2025-02-28' },
  { id: 'ex4', type: 'playbook_performance', message: 'SMB Tech sequence reply rate dropped below 15%. Review content and timing.', severity: 'low', createdAt: '2025-02-27' },
];

// T1 AI-prepared items (for account reality report / call brief)
export function getT1AccountRealityReport(account) {
  if (!account) return null;
  const stakeholders = account.stakeholders || [];
  const moved = stakeholders.filter((s) => s.engagement >= 70);
  const stalled = stakeholders.filter((s) => s.engagement < 50 && s.lastTouched);
  return {
    summary: `Engagement: ${moved.length} stakeholders active, ${stalled.length} need re-engagement.`,
    sentimentShifts: stalled.length ? `${stalled.map((s) => s.name).join(', ')} — engagement down; consider personal touch.` : 'No major shifts.',
    dataVsRep: account.ariaRecommendation || 'No discrepancy flagged.',
    lastUpdated: 'This morning',
  };
}

export function getT1CallBrief(account) {
  if (!account) return null;
  return {
    accountName: account.name,
    objective: account.nextAction || 'Review account strategy',
    attendees: (account.stakeholders || []).slice(0, 2).map((s) => `${s.name} (${s.title})`),
    talkingPoints: [
      account.ariaRecommendation,
      `Deal size: ${account.estimatedDeal ? `$${account.estimatedDeal / 1000}K` : 'TBD'}`,
      `Last activity: ${account.lastActivity}`,
    ].filter(Boolean),
    personalContextNote: 'Add your notes here — AI did not send any communication.',
    generatedAt: 'Before meeting',
  };
}
