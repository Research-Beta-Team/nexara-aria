/**
 * Mock data for Freya Persistent Memory (Session 1).
 * Four namespaces: brand, audience, campaigns, performance.
 * Each entry: { id, content, source, updatedAt }.
 * source: 'Manual' | 'Freya-Detected' | 'Campaign Import' | 'CRM Sync'
 */

const now = new Date().toISOString();
const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

export const MEMORY_NAMESPACES = [
  { id: 'brand', label: 'Brand Memory', icon: 'building-2', color: '#3DDC84' },
  { id: 'audience', label: 'Audience & ICP', icon: 'users', color: '#5EEAD4' },
  { id: 'campaigns', label: 'Campaign Memory', icon: 'zap', color: '#F5C842' },
  { id: 'performance', label: 'Performance Memory', icon: 'bar-chart-3', color: '#A78BFA' },
];

export const memoryMock = {
  brand: [
    { id: 'b1', content: 'Brand Name: Antarious | Product: GTM AI OS for growth teams', source: 'Manual', updatedAt: twoHoursAgo },
    { id: 'b2', content: 'Tone: Confident, data-driven, never salesy. Avoid buzzwords.', source: 'Freya-Detected', updatedAt: twoHoursAgo },
    { id: 'b3', content: 'Value Prop: Replace your entire agency with one AI platform', source: 'Manual', updatedAt: twoHoursAgo },
    { id: 'b4', content: "Prohibited: 'revolutionary', 'game-changing', 'disruptive'", source: 'Manual', updatedAt: twoHoursAgo },
  ],
  audience: [
    { id: 'a1', content: 'Primary ICP: B2B SaaS, 50-500 employees, Series A-C, $5M-50M ARR', source: 'Manual', updatedAt: twoHoursAgo },
    { id: 'a2', content: 'Champion: VP Marketing or CMO, reports to CEO, owns pipeline target', source: 'Freya-Detected', updatedAt: twoHoursAgo },
    { id: 'a3', content: 'Pain: 34h/week wasted on manual marketing tasks', source: 'Manual', updatedAt: twoHoursAgo },
    { id: 'a4', content: 'Trigger: Missed pipeline target → budget for AI tools unlocks', source: 'CRM Sync', updatedAt: twoHoursAgo },
  ],
  campaigns: [
    { id: 'c1', content: 'Q1 LinkedIn campaign: 48% open rate on pain-led subject lines', source: 'Campaign Import', updatedAt: twoHoursAgo },
    { id: 'c2', content: 'Google Search outperforms LinkedIn for mid-funnel (CPL 32% lower)', source: 'Freya-Detected', updatedAt: twoHoursAgo },
    { id: 'c3', content: 'Email send time: Tue/Wed 9-10am performs best for our ICP', source: 'Campaign Import', updatedAt: twoHoursAgo },
    { id: 'c4', content: 'Last 3 approved ad headlines: [stored patterns]', source: 'Manual', updatedAt: twoHoursAgo },
  ],
  performance: [
    { id: 'p1', content: 'Baseline CPL: LinkedIn $180 | Google $95 | Meta $62', source: 'Freya-Detected', updatedAt: twoHoursAgo },
    { id: 'p2', content: 'MQL→SQL conversion: 28% (team average) / 34% (top SDR)', source: 'CRM Sync', updatedAt: twoHoursAgo },
    { id: 'p3', content: 'Q4 is 40% of annual pipeline — scale paid spend from Oct', source: 'Manual', updatedAt: twoHoursAgo },
    { id: 'p4', content: 'CAC target: $2,400 | Current: $2,850 (18% above target)', source: 'Freya-Detected', updatedAt: twoHoursAgo },
  ],
};

/** Default empty structure for store initial state */
export function getInitialFreyaMemory() {
  return {
    brand: [...memoryMock.brand],
    audience: [...memoryMock.audience],
    campaigns: [...memoryMock.campaigns],
    performance: [...memoryMock.performance],
  };
}
