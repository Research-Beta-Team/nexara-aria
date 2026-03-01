// ─────────────────────────────────────────
//  Forecast Engine — mock data
// ─────────────────────────────────────────

export const FORECAST_SCENARIOS = [
  {
    id: 'conservative',
    label: 'Conservative',
    value: 280000,
    confidence: 85,
    basis: 'Closed-won + 40% of qualified pipeline',
  },
  {
    id: 'base',
    label: 'Base',
    value: 380000,
    confidence: 72,
    basis: 'Weighted pipeline + historical win rate',
    recommended: true,
  },
  {
    id: 'optimistic',
    label: 'Optimistic',
    value: 520000,
    confidence: 45,
    basis: 'Full pipeline if all deals close',
  },
];

export const MONTHLY_FORECAST = [
  { month: 'Jan 2026', closedWon: 72, likely: 45, atRisk: 28, target: 120 },
  { month: 'Feb 2026', closedWon: 85, likely: 52, atRisk: 35, target: 125 },
  { month: 'Mar 2026', closedWon: 95, likely: 68, atRisk: 42, target: 135 },
  { month: 'Apr 2026', closedWon: 88, likely: 78, atRisk: 38, target: 140 },
  { month: 'May 2026', closedWon: 92, likely: 82, atRisk: 30, target: 145 },
  { month: 'Jun 2026', closedWon: 98, likely: 90, atRisk: 25, target: 150 },
];

export const SCENARIO_LEVERS = [
  { id: 'l1', lever: 'Increase Meta budget by $2K/month', impact: '+$28K pipeline', impactValue: 28000, confidence: 71 },
  { id: 'l2', lever: 'Add 1 SDR', impact: '+$45K pipeline in 90 days', impactValue: 45000, confidence: 64 },
  { id: 'l3', lever: 'Improve demo-to-close from 15% to 20%', impact: '+$38K revenue', impactValue: 38000, confidence: 80 },
  { id: 'l4', lever: 'Launch LinkedIn Ads channel', impact: '+$22K pipeline', impactValue: 22000, confidence: 58 },
];

export const COHORT_DATA = [
  { segment: 'Manufacturing/APAC', deals: 12, avgDealSize: 4200, avgSalesCycle: 42, winRate: 28, cac: 420, ltvCac: 8.2 },
  { segment: 'SaaS/US', deals: 18, avgDealSize: 5800, avgSalesCycle: 38, winRate: 22, cac: 680, ltvCac: 5.1 },
  { segment: 'Professional Services', deals: 8, avgDealSize: 3500, avgSalesCycle: 55, winRate: 18, cac: 520, ltvCac: 3.8 },
  { segment: 'E-commerce', deals: 6, avgDealSize: 2400, avgSalesCycle: 28, winRate: 12, cac: 890, ltvCac: 2.6 },
];

export const FORECAST_RISKS = [
  { id: 'r1', description: '4 deals stalled >14 days — worth $92K', to: '/revenue/pipeline' },
  { id: 'r2', description: 'LinkedIn budget depleting Mar 15 — no renewal approved', to: '/campaigns' },
  { id: 'r3', description: 'Champion at Delta Corp left — deal at risk', to: '/customer-success' },
];
