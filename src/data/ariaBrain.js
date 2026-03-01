// ─────────────────────────────────────────
//  ARIA Intelligence — mock data
// ─────────────────────────────────────────

export const ARIA_STATS = {
  campaignsAnalysed: 47,
  emailsSent: 12400,
  dealsInfluenced: 89,
  accuracyImprovement: '+23% vs 3 months ago',
  datasetsLearned: 156,
  confidenceLevel: 87,
};

export const LEARNING_ENTRIES = [
  { id: 'e1', date: '2026-03-01', type: 'timing_insight', insight: 'Email sequences sent Tuesday 9-11 AM get 34% higher open rates for CFO persona', confidence: 91, source: '12 closed-won deals', appliedTo: 'All campaigns', recentlyApplied: true },
  { id: 'e2', date: '2026-02-28', type: 'content_learning', insight: "Subject lines mentioning 'compliance cost' outperform 'compliance automation' by 2.8×", confidence: 88, source: 'A/B tests across 8 campaigns', appliedTo: 'CFO Vietnam Q1', recentlyApplied: true },
  { id: 'e3', date: '2026-02-27', type: 'channel_insight', insight: 'Prospects who open email 3+ times but don\'t reply respond better to LinkedIn follow-up', confidence: 79, source: 'Multi-touch attribution', appliedTo: 'All campaigns', recentlyApplied: false },
  { id: 'e4', date: '2026-02-26', type: 'icp_refinement', insight: 'ICP companies with 200-800 employees close 2.4× faster than <200 or >800', confidence: 92, source: 'Pipeline analysis', appliedTo: 'All campaigns', recentlyApplied: true },
  { id: 'e5', date: '2026-02-25', type: 'content_learning', insight: 'First line under 60 characters increases reply rate by 18%', confidence: 85, source: 'Email performance dataset', appliedTo: 'All campaigns', recentlyApplied: false },
  { id: 'e6', date: '2026-02-24', type: 'timing_insight', insight: 'Demo requests spike on Wednesday afternoons (2-4 PM local)', confidence: 87, source: 'Calendar & conversion data', appliedTo: 'SaaS US campaign', recentlyApplied: false },
  { id: 'e7', date: '2026-02-23', type: 'channel_insight', insight: 'LinkedIn InMail after 2 emails outperforms cold LinkedIn alone by 2.1×', confidence: 83, source: 'Channel sequencing', appliedTo: 'All campaigns', recentlyApplied: false },
  { id: 'e8', date: '2026-02-22', type: 'icp_refinement', insight: 'Manufacturing segment: decision-makers with "Operations" in title convert 40% better', confidence: 89, source: 'Closed-won title analysis', appliedTo: 'Manufacturing/APAC', recentlyApplied: true },
  { id: 'e9', date: '2026-02-21', type: 'content_learning', insight: 'Bullet lists (3-5 items) in body get 22% higher click-through than paragraphs', confidence: 76, source: 'Content experiments', appliedTo: 'All campaigns', recentlyApplied: false },
  { id: 'e10', date: '2026-02-20', type: 'timing_insight', insight: 'Week 2 of sequence: Tuesday send beats Monday by 15% open rate', confidence: 82, source: 'Send-time analysis', appliedTo: 'All campaigns', recentlyApplied: false },
  { id: 'e11', date: '2026-02-19', type: 'channel_insight', insight: 'Retargeting ad after email 2 improves demo rate by 28%', confidence: 74, source: 'Cross-channel funnel', appliedTo: 'Paid + email campaigns', recentlyApplied: false },
  { id: 'e12', date: '2026-02-18', type: 'icp_refinement', insight: 'Companies that recently hired CFO (within 90 days) have 3× higher intent score', confidence: 86, source: 'Intent + hiring signals', appliedTo: 'CFO Vietnam Q1', recentlyApplied: false },
];

export const CONTENT_PERFORMANCE = {
  topPerformingAngle: { label: 'EU compliance cost reduction', stat: '4.2% reply rate', vsPrevious: '+0.8% vs prior period' },
  topSubjectLine: { label: 'Question format with specific number', stat: '52% open rate', vsPrevious: '+12% vs prior period' },
  topCTA: { label: 'Calculator/tool offer', stat: '3.8× better than demo ask', vsPrevious: 'Consistently top performer' },
  worstPerforming: { label: 'Generic "quick chat" CTA', stat: '0.9% conversion', note: 'Consider replacing in active sequences' },
};

export const BENCHMARK_DATA = [
  { metric: 'CPL', your: 42, industryAvg: 58, unit: '$', youWin: true },
  { metric: 'Open Rate', your: 48, industryAvg: 52, unit: '%', youWin: false, ariaRecommendation: 'Test 2-3 subject line variants per segment' },
  { metric: 'Reply Rate', your: 4.2, industryAvg: 3.1, unit: '%', youWin: true },
  { metric: 'Demo Rate', your: 1.8, industryAvg: 2.2, unit: '%', youWin: false, ariaRecommendation: 'Add one mid-funnel touch (e.g. case study) before demo ask' },
  { metric: 'CAC', your: 620, industryAvg: 780, unit: '$', youWin: true },
];

export const ACCURACY_TREND_DATA = [
  { month: 'Sep 2025', accuracy: 62 },
  { month: 'Oct 2025', accuracy: 67 },
  { month: 'Nov 2025', accuracy: 71 },
  { month: 'Dec 2025', accuracy: 75 },
  { month: 'Jan 2026', accuracy: 79 },
  { month: 'Feb 2026', accuracy: 84 },
];
