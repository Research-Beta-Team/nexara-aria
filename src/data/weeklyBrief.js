/**
 * Mock data for ARIA Weekly Brief (Monday Morning Briefing).
 */

export const MOCK_WEEKLY_BRIEF = {
  compiled_at: 'Monday Feb 24, 2026 · 8:00 AM',
  campaigns_analyzed: 6,
  action_required: [
    {
      id: 'ar1',
      text: 'Meta budget: 78% spent with 12 days remaining — Campaign CFO Vietnam',
      actionLabel: 'Review budget',
      actionPath: '/campaigns',
    },
    {
      id: 'ar2',
      text: 'Reply rate on Email Seq B dropped 40% vs last week — needs investigation',
      actionLabel: 'Analyze with ARIA',
      actionPath: null,
    },
  ],
  watch: [
    {
      id: 'w1',
      text: 'CompetitorX launched new landing page targeting textile CFOs yesterday',
    },
    {
      id: 'w2',
      text: 'Intent score for Apex Garments rose from 54 to 82 — prime outreach window',
    },
    {
      id: 'w3',
      text: 'LinkedIn Ad frequency hitting 3.1 — approaching creative fatigue threshold',
    },
  ],
  wins: [
    {
      id: 'win1',
      text: 'LinkedIn outreach to Supply Chain Managers: 31% reply rate (industry avg: 12%)',
    },
    {
      id: 'win2',
      text: "Blog post ranking #4 on Google for 'textile CFO Vietnam' — 340 impressions",
    },
  ],
  recommendations: [
    {
      id: 'rec1',
      text: 'Reallocate $800 from Meta Set 3 → LinkedIn',
      confidence: 87,
      executionType: 'dual_approval',
      payload: { budgetAmount: 800, campaign: 'APAC Brand Awareness' },
    },
    {
      id: 'rec2',
      text: 'A/B test new subject line on Email Seq A — Copywriter Agent standing by',
      confidence: null,
      executionType: 'generate_variant',
      payload: { campaignId: 'seq-a' },
    },
    {
      id: 'rec3',
      text: 'Schedule a re-engagement sequence for 8 prospects who opened 3+ emails',
      confidence: null,
      executionType: 'build_sequence',
      payload: { count: 8 },
    },
  ],
};

export const ARIA_PRIORITY_SUGGESTIONS = [
  { id: 'p1', label: 'Close more demos', emoji: '🎯' },
  { id: 'p2', label: 'Grow LinkedIn reach', emoji: '📣' },
  { id: 'p3', label: 'Fix Meta performance', emoji: '🔧' },
];
