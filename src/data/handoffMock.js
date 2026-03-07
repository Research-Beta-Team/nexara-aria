/**
 * Mock data for MQL Handoff Center (Session 3).
 * MQL states: raw → enriched → scored → mql → assigned → contacted.
 * Urgency: mint <1h, amber 1–4h, red 4h+, OVERDUE >4h.
 */

const now = new Date();
const hoursAgo = (h) => new Date(now.getTime() - h * 60 * 60 * 1000).toISOString();

export const SDRs = [
  { id: 'sdr1', name: 'James Wilson', availability: 'available', capacity: 12, assigned: 4 },
  { id: 'sdr2', name: 'Maria Santos', availability: 'available', capacity: 12, assigned: 8 },
  { id: 'sdr3', name: 'Tom Chen', availability: 'in_meeting', capacity: 12, assigned: 10 },
];

export const mqlQueueMock = [
  {
    id: 'mql1',
    leadName: 'Jennifer Park',
    company: 'HealthBridge Analytics',
    companyIndustry: 'Healthcare Tech',
    companySize: '51-200',
    score: 87,
    qualifiedAt: hoursAgo(0.5),
    hoursInQueue: 0.5,
    intentSignals: ['Pricing page 3x', 'Demo request', 'Competitor comparison'],
    icpFit: 92,
    assignedSdrId: null,
    brief: {
      companySnapshot: 'Series B healthcare analytics. Recent funding $24M. Expanding into APAC. Uses Salesforce, HubSpot.',
      contactProfile: 'VP Marketing. 12 years experience. Previously at Cerner. Active on LinkedIn (2 posts/week).',
      whyHot: 'Visited pricing 3x in 48h. Filled demo form. G2 review mention of "evaluation" last week.',
      recommendedApproach: 'Lead with ROI for healthcare compliance use case. Reference G2. Offer 15-min discovery call.',
    },
    draftEmail: {
      subject: 'Quick question about HealthBridge’s GTM goals',
      body: 'Hi Jennifer,\n\nI noticed HealthBridge is scaling in APAC and you’ve been evaluating GTM platforms. We help healthcare analytics teams like yours cut pipeline ops from 30+ hours to under 5 per week—with full compliance in mind.\n\nWould a 15-minute discovery call this week make sense? I’d love to hear what you’re optimizing for.\n\nBest,\n[SDR Name]',
    },
  },
  {
    id: 'mql2',
    leadName: 'David Okonkwo',
    company: 'Nexus Logistics',
    companyIndustry: 'Logistics',
    companySize: '201-500',
    score: 79,
    qualifiedAt: hoursAgo(2.2),
    hoursInQueue: 2.2,
    intentSignals: ['Whitepaper download', 'LinkedIn engagement'],
    icpFit: 78,
    assignedSdrId: null,
    brief: {
      companySnapshot: 'Mid-market logistics. HQ Nigeria, offices in UK. Digitizing last-mile delivery.',
      contactProfile: 'Head of Growth. Ex-Amazon. Focus on SMB segment expansion.',
      whyHot: 'Downloaded "SMB GTM Playbook" and engaged with 2 LinkedIn posts in 24h.',
      recommendedApproach: 'Reference the playbook. Offer benchmark data for logistics. Position as growth partner.',
    },
    draftEmail: {
      subject: 'Following up on the SMB GTM Playbook',
      body: 'Hi David,\n\nHope the playbook was useful. We’ve seen logistics teams like Nexus use similar frameworks to 2x pipeline in 6 months.\n\nI’d be happy to share a quick benchmark for your segment and see if there’s a fit. 15 mins?\n\nBest,\n[SDR Name]',
    },
  },
  {
    id: 'mql3',
    leadName: 'Sarah Miller',
    company: 'FinServe Global',
    companyIndustry: 'Fintech',
    companySize: '501-1000',
    score: 94,
    qualifiedAt: hoursAgo(5),
    hoursInQueue: 5,
    intentSignals: ['Pricing 5x', 'Case study', 'Contact form'],
    icpFit: 96,
    assignedSdrId: 'sdr1',
    brief: {
      companySnapshot: 'Enterprise fintech. Regulated. Multi-region. Heavy on compliance and audit trails.',
      contactProfile: 'CMO. 15 years. Board advisor at 2 startups. Key focus: attribution and board reporting.',
      whyHot: 'Pricing page 5x, read case study "FinServe attribution". Submitted contact form with "Board reporting" in notes.',
      recommendedApproach: 'Lead with attribution and board report automation. Offer executive briefing. Avoid hard sell.',
    },
    draftEmail: {
      subject: 'Attribution and board reporting — next steps',
      body: 'Hi Sarah,\n\nThanks for reaching out. Your note on board reporting is exactly where we help FinServe-level teams: one source of truth, audit-ready, in the format your board expects.\n\nI’d love to schedule an executive briefing at your convenience. Would next week work?\n\nBest,\n[SDR Name]',
    },
  },
  {
    id: 'mql4',
    leadName: 'Alex Rivera',
    company: 'CloudNine Software',
    companyIndustry: 'SaaS',
    companySize: '51-200',
    score: 71,
    qualifiedAt: hoursAgo(1.1),
    hoursInQueue: 1.1,
    intentSignals: ['Webinar attended', 'Email open 4x'],
    icpFit: 65,
    assignedSdrId: null,
    brief: {
      companySnapshot: 'B2B SaaS, developer tools. Series A. Growing PLG motion.',
      contactProfile: 'Demand Gen Manager. 4 years. Reports to CMO. Focus on pipeline and MQL quality.',
      whyHot: 'Attended "MQL to SQL" webinar. Opened 4 nurture emails in 7 days.',
      recommendedApproach: 'Tie webinar content to MQL handoff speed. Offer handoff audit or checklist.',
    },
    draftEmail: {
      subject: 'MQL handoff — from the webinar',
      body: 'Hi Alex,\n\nGreat to have you at the MQL to SQL session. Many teams we work with cut first-touch time from 4+ hours to under 1.\n\nIf you’d like a quick handoff audit (no commitment), I can walk you through how we do it. 15 mins?\n\nBest,\n[SDR Name]',
    },
  },
  {
    id: 'mql5',
    leadName: 'Emma Foster',
    company: 'Medglobal',
    companyIndustry: 'Nonprofit / Healthcare',
    companySize: '11-50',
    score: 88,
    qualifiedAt: hoursAgo(0.3),
    hoursInQueue: 0.3,
    intentSignals: ['Donation page', 'Careers page', 'Newsletter signup'],
    icpFit: 90,
    assignedSdrId: null,
    brief: {
      companySnapshot: 'International humanitarian health NGO. Delivers emergency healthcare and health programs. Active in MENA, Africa, Southeast Asia.',
      contactProfile: 'Partnerships Lead. Focus on corporate and foundation partnerships. Previously at UN agencies.',
      whyHot: 'Newsletter signup with "partnerships" interest. Visited careers (hiring for growth).',
      recommendedApproach: 'Position as partnership enablement and storytelling. Offer impact reporting templates.',
    },
    draftEmail: {
      subject: 'Supporting Medglobal’s partnership storytelling',
      body: 'Hi Emma,\n\nMedglobal’s work in emergency health is inspiring. We help NGOs like yours turn partnership and impact data into clear stories for boards and funders—without adding headcount.\n\nWould a short call to explore fit make sense?\n\nBest,\n[SDR Name]',
    },
  },
];

/** Urgency: <1h mint, 1–4h amber, 4h+ red; OVERDUE when >4h */
export function getUrgency(hoursInQueue) {
  if (hoursInQueue >= 4) return { tier: 'overdue', color: 'red', label: 'OVERDUE' };
  if (hoursInQueue >= 1) return { tier: 'warning', color: 'amber', label: `${Math.round(hoursInQueue * 10) / 10}h` };
  return { tier: 'ok', color: 'mint', label: `${Math.round(hoursInQueue * 10) / 10}h` };
}

/** Handoff timeline data for chart: last 7 days, MQLs and avg hours to first touch */
export const handoffTimelineMock = [
  { date: 'Mon', mqls: 12, avgHours: 0.8, overdue: 0 },
  { date: 'Tue', mqls: 18, avgHours: 1.2, overdue: 1 },
  { date: 'Wed', mqls: 14, avgHours: 0.9, overdue: 0 },
  { date: 'Thu', mqls: 22, avgHours: 1.5, overdue: 2 },
  { date: 'Fri', mqls: 16, avgHours: 0.7, overdue: 0 },
  { date: 'Sat', mqls: 6, avgHours: 0.5, overdue: 0 },
  { date: 'Sun', mqls: 8, avgHours: 0.6, overdue: 0 },
];

/** KPIs for metric strip */
export const handoffMetricsMock = {
  avgHandoffHours: 0.9,
  avgHandoffTargetHours: 1,
  mqlsInQueue: 5,
  assignedToday: 12,
  responseRate24h: 94,
};
