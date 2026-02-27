// ─────────────────────────────────────────────
//  NEXARA — Campaign Module Mock Data
// ─────────────────────────────────────────────

// ── Campaign List ─────────────────────────────
export const campaigns = [
  {
    id: 'c1',
    name: 'CFO Vietnam Q1',
    client: 'Acme Corp',
    status: 'active',       // active | paused | draft | completed
    health: 'on_track',
    goal: 120,
    current: 94,
    spend: 18420,
    budget: 25000,
    cpl: 196,
    ctr: 3.8,
    channels: ['LinkedIn', 'Meta'],
    startDate: '2025-01-06',
    endDate: '2025-03-28',
    owner: 'Jamie L.',
    agents: ['SDR-7', 'ContentBot-2', 'BidOptimizer-1'],
    description: 'Targeting CFO-level decision makers in Vietnam for enterprise SaaS adoption.',
  },
  {
    id: 'c2',
    name: 'APAC Brand Awareness',
    client: 'TechVN Ltd',
    status: 'active',
    health: 'ahead',
    goal: 60,
    current: 71,
    spend: 9100,
    budget: 12000,
    cpl: 128,
    ctr: 4.2,
    channels: ['Meta', 'Display'],
    startDate: '2025-01-13',
    endDate: '2025-04-11',
    owner: 'Sara K.',
    agents: ['ContentBot-2', 'Analyst-3'],
    description: 'Brand awareness push across APAC markets via display and social.',
  },
  {
    id: 'c3',
    name: 'SEA Demand Gen',
    client: 'Acme Corp',
    status: 'active',
    health: 'at_risk',
    goal: 80,
    current: 29,
    spend: 14800,
    budget: 20000,
    cpl: 510,
    ctr: 1.9,
    channels: ['LinkedIn'],
    startDate: '2025-01-20',
    endDate: '2025-03-14',
    owner: 'Chris M.',
    agents: ['SDR-7', 'BidOptimizer-1'],
    description: 'Demand generation targeting VP/Director in SEA financial services.',
  },
  {
    id: 'c4',
    name: 'ANZ Retargeting Q4',
    client: 'BlueStar Pty',
    status: 'paused',
    health: 'on_track',
    goal: 45,
    current: 38,
    spend: 5200,
    budget: 8000,
    cpl: 137,
    ctr: 5.1,
    channels: ['Meta', 'Google'],
    startDate: '2024-10-01',
    endDate: '2024-12-31',
    owner: 'Priya N.',
    agents: ['BidOptimizer-1'],
    description: 'Retargeting warm audiences in Australia and New Zealand.',
  },
];

// ── Campaign Detail — KPIs & Funnel (by id) ───
export const campaignDetail = {
  c1: {
    kpis: [
      { label: 'Total Spend',   value: '$18,420', delta: '+8%',  up: true  },
      { label: 'Leads',         value: '94',       delta: '+12%', up: true  },
      { label: 'CPL',           value: '$196',     delta: '-4%',  up: true  },
      { label: 'CTR',           value: '3.8%',     delta: '+0.6', up: true  },
    ],
    funnel: [
      { stage: 'Impressions', count: 482000, color: '#3A5242' },
      { stage: 'Clicks',      count: 18300,  color: '#2AA860' },
      { stage: 'Leads',       count: 94,     color: '#3DDC84' },
      { stage: 'MQLs',        count: 31,     color: '#5EEAD4' },
      { stage: 'SQLs',        count: 11,     color: '#DFF0E8' },
    ],
    channelBreakdown: [
      { channel: 'LinkedIn', spend: 12400, leads: 68, cpl: 182, ctr: '3.2%', share: 67 },
      { channel: 'Meta',     spend: 6020,  leads: 26, cpl: 232, ctr: '5.1%', share: 33 },
    ],
    milestones: [
      { date: 'Jan 6',  label: 'Campaign launch',          done: true  },
      { date: 'Jan 20', label: 'First 25 leads reached',   done: true  },
      { date: 'Feb 3',  label: 'Creative refresh wave 1',  done: true  },
      { date: 'Feb 17', label: 'Mid-campaign review',      done: true  },
      { date: 'Mar 3',  label: '80% goal milestone',       done: false },
      { date: 'Mar 28', label: 'Campaign end / reporting', done: false },
    ],
  },
};

// ── Strategy (shared across campaigns for demo) ─
export const strategyData = {
  brief: {
    objective: "Generate 120 qualified CFO-level leads in Vietnam for Acme's enterprise SaaS.",
    targetRevenue: '$2.4M pipeline',
    timeline: 'Q1 2025 (Jan 6 – Mar 28)',
    budget: '$25,000 total · $18,420 spent',
    keyMessage: 'Reduce financial reporting time by 60% with AI-native ERP.',
  },
  icp: {
    title: 'Chief Financial Officer',
    industry: 'Enterprise / Mid-Market (500+ employees)',
    geography: 'Ho Chi Minh City, Hanoi, Da Nang',
    painPoints: [
      'Manual consolidation of multi-entity reports',
      'Compliance gaps with local tax authority requirements',
      'Lack of real-time cash flow visibility',
    ],
    triggers: ['Audit season', 'Board reporting', 'ERP migration cycle'],
    excludes: ['SMB <50 employees', 'Government sector', 'Non-profits'],
  },
  positioning: [
    { axis: 'Speed',      us: 9, competitor: 5 },
    { axis: 'Local Compliance', us: 8, competitor: 4 },
    { axis: 'AI Native',  us: 10, competitor: 3 },
    { axis: 'Price',      us: 6, competitor: 8 },
    { axis: 'Support',    us: 8, competitor: 7 },
  ],
  competitorIntel: [
    { name: 'SAP',         threat: 'high',   gap: 'Price & local UX', note: '3 deals lost in Q4' },
    { name: 'Oracle NetSuite', threat: 'medium', gap: 'Implementation time', note: 'Avg 14-month deploy' },
    { name: 'MISA',        threat: 'medium', gap: 'Enterprise scalability', note: 'Strong SMB presence' },
  ],
  roadmap: [
    { phase: 'Phase 1', label: 'Awareness & Targeting',    weeks: 'Wk 1–3',  done: true  },
    { phase: 'Phase 2', label: 'Engagement & Nurture',      weeks: 'Wk 4–8',  done: true  },
    { phase: 'Phase 3', label: 'Conversion Push',           weeks: 'Wk 9–11', done: false },
    { phase: 'Phase 4', label: 'Close & Handoff to Sales',  weeks: 'Wk 12',   done: false },
  ],
};

// ── Content Items ─────────────────────────────
export const contentItems = [
  {
    id: 'ct1',
    type: 'Email',
    name: 'Cold Outreach Sequence — Email 1',
    status: 'approved',
    opens: '34%',
    clicks: '8.2%',
    replies: '3.1%',
    body: `Subject: Reducing multi-entity consolidation time for CFOs in Vietnam

Hi {{first_name}},

I noticed Acme Corp recently expanded its Vietnam operations — congratulations on the growth.

Many CFOs I speak with at companies your size are spending 3–4 days per quarter on manual consolidation across entities. With local tax authority compliance on top, the reporting cycle becomes a serious bottleneck.

We built Acme ERP specifically for this: AI-native financial consolidation that cuts reporting time by 60%, with built-in compliance for Vietnam's tax and accounting standards.

Would a 20-minute call this week make sense? I can show you exactly how CFOs at [similar company] cut their Q close from 12 days to 4.

Best,
Jamie
Acme Corp · GTM Team`,
  },
  {
    id: 'ct2',
    type: 'Email',
    name: 'Cold Outreach Sequence — Email 2 (Follow-up)',
    status: 'approved',
    opens: '28%',
    clicks: '5.4%',
    replies: '2.8%',
    body: `Subject: Quick follow-up — Q1 close coming up

Hi {{first_name}},

Just circling back with one thought: Q1 close is in a few weeks.

If your team is still running Excel-based consolidations across entities, I'd love to show you what's possible with one AI-powered workflow.

Happy to do a quick 15-min demo anytime this week.

Jamie`,
  },
  {
    id: 'ct3',
    type: 'LinkedIn Ad',
    name: 'CFO Pain Point — Consolidation',
    status: 'live',
    impressions: '48,200',
    ctr: '3.2%',
    cpl: '$182',
    body: `Headline: CFOs in Vietnam: Close your books 60% faster

Body: Multi-entity consolidation taking weeks? Acme ERP automates financial consolidation with built-in Vietnam tax compliance. See it in action.

CTA: Book a Demo`,
  },
  {
    id: 'ct4',
    type: 'Blog',
    name: '5 Signs Your ERP Is Slowing Down Your Q Close',
    status: 'draft',
    views: '—',
    reads: '—',
    body: `# 5 Signs Your ERP Is Slowing Down Your Q Close

For finance teams managing multi-entity operations in Vietnam, the quarterly close is often the most stressful period of the year. But many of the bottlenecks aren't unavoidable — they're symptoms of an outdated ERP.

Here are 5 signs it's time to upgrade:

**1. Your team is still exporting to Excel**
If your consolidation process involves any manual Excel work, you're adding days to your close cycle...

**2. Compliance prep takes a dedicated team**
Vietnam's tax authority (GDT) requirements change regularly. If your ERP can't auto-apply these rules...`,
  },
  {
    id: 'ct5',
    type: 'Meta Ad',
    name: 'Retargeting — Demo Offer',
    status: 'paused',
    impressions: '12,800',
    ctr: '5.8%',
    cpl: '$94',
    body: `Headline: Still thinking it over?

Body: See exactly how 120+ CFOs in Southeast Asia are closing books 60% faster. Book your personalized demo — 20 minutes, no pressure.

CTA: Book Demo Now`,
  },
];

// ── Prospects / Outreach ──────────────────────
export const prospects = [
  {
    id: 'p1',
    name: 'Nguyen Van Minh',
    title: 'CFO',
    company: 'VinGroup',
    icpScore: 94,
    intent: 'high',
    sequenceStep: 3,
    lastTouch: '2d ago',
    replied: true,
    email: 'nvm@vingroup.vn',
    linkedin: 'linkedin.com/in/nguyenvanminh',
    touchpoints: [
      { id: 't1', type: 'email_sent',      label: 'Email 1 sent',          date: 'Jan 14, 09:02', detail: 'Cold outreach email #1 delivered.' },
      { id: 't2', type: 'email_opened',    label: 'Email 1 opened',        date: 'Jan 14, 11:34', detail: 'Opened on mobile device.' },
      { id: 't3', type: 'email_clicked',   label: 'Link clicked',          date: 'Jan 14, 11:36', detail: 'Clicked case study link.' },
      { id: 't4', type: 'linkedin_view',   label: 'LinkedIn profile view', date: 'Jan 15, 14:20', detail: 'Prospect viewed sender profile.' },
      { id: 't5', type: 'email_sent',      label: 'Email 2 sent',          date: 'Jan 17, 08:55', detail: 'Follow-up email #2 delivered.' },
      { id: 't6', type: 'email_replied',   label: 'Reply received',        date: 'Jan 19, 16:40', detail: '"Interested, can we do Friday 3pm?"' },
    ],
  },
  {
    id: 'p2',
    name: 'Tran Thi Lan',
    title: 'VP Finance',
    company: 'Masan Group',
    icpScore: 87,
    intent: 'medium',
    sequenceStep: 2,
    lastTouch: '5d ago',
    replied: false,
    email: 'ttlan@masan.vn',
    linkedin: 'linkedin.com/in/tranthilan',
    touchpoints: [
      { id: 't1', type: 'email_sent',   label: 'Email 1 sent',    date: 'Jan 15, 09:10', detail: 'Cold outreach email #1 delivered.' },
      { id: 't2', type: 'email_opened', label: 'Email 1 opened',  date: 'Jan 16, 08:22', detail: 'Opened on desktop.' },
      { id: 't3', type: 'email_sent',   label: 'Email 2 sent',    date: 'Jan 19, 09:05', detail: 'Follow-up email #2 delivered.' },
    ],
  },
  {
    id: 'p3',
    name: 'Le Duc Anh',
    title: 'CFO',
    company: 'FPT Corporation',
    icpScore: 91,
    intent: 'high',
    sequenceStep: 1,
    lastTouch: '1d ago',
    replied: false,
    email: 'lda@fpt.com.vn',
    linkedin: 'linkedin.com/in/leducanh',
    touchpoints: [
      { id: 't1', type: 'email_sent',   label: 'Email 1 sent',   date: 'Jan 20, 08:45', detail: 'Cold outreach email #1 delivered.' },
      { id: 't2', type: 'email_opened', label: 'Email 1 opened', date: 'Jan 20, 14:11', detail: 'Opened on mobile. 2 opens total.' },
    ],
  },
  {
    id: 'p4',
    name: 'Pham Quoc Hung',
    title: 'Finance Director',
    company: 'Techcombank',
    icpScore: 78,
    intent: 'low',
    sequenceStep: 1,
    lastTouch: '8d ago',
    replied: false,
    email: 'pqhung@techcombank.com',
    linkedin: 'linkedin.com/in/phamquochung',
    touchpoints: [
      { id: 't1', type: 'email_sent', label: 'Email 1 sent', date: 'Jan 13, 09:30', detail: 'Cold outreach email #1 delivered.' },
    ],
  },
  {
    id: 'p5',
    name: 'Do Thi Bich',
    title: 'CFO',
    company: 'VPBank',
    icpScore: 89,
    intent: 'medium',
    sequenceStep: 2,
    lastTouch: '3d ago',
    replied: false,
    email: 'dtbich@vpbank.com.vn',
    linkedin: 'linkedin.com/in/dothibich',
    touchpoints: [
      { id: 't1', type: 'email_sent',   label: 'Email 1 sent',   date: 'Jan 16, 09:15', detail: 'Cold outreach email #1 delivered.' },
      { id: 't2', type: 'email_opened', label: 'Email 1 opened', date: 'Jan 17, 10:05', detail: 'Opened on desktop.' },
      { id: 't3', type: 'email_sent',   label: 'Email 2 sent',   date: 'Jan 20, 08:50', detail: 'Follow-up email #2 delivered.' },
    ],
  },
];

// ── Paid Ads / Meta ───────────────────────────
export const metaCampaigns = [
  {
    id: 'ma1',
    name: 'CFO VN — Lead Gen (LLA)',
    status: 'active',
    spend: 7800,
    budget: 12000,
    cpl: 168,
    ctr: 3.4,
    frequency: 3.2,
    leads: 46,
    anomaly: null,
  },
  {
    id: 'ma2',
    name: 'CFO VN — Retargeting',
    status: 'active',
    spend: 2840,
    budget: 4000,
    cpl: 94,
    ctr: 5.8,
    frequency: 4.6,
    leads: 30,
    anomaly: 'High frequency — audience fatigue risk',
  },
  {
    id: 'ma3',
    name: 'CFO VN — Cold Prospecting',
    status: 'paused',
    spend: 1780,
    budget: 5000,
    cpl: 593,
    ctr: 1.1,
    frequency: 2.1,
    leads: 3,
    anomaly: 'CPL 48% above target — paused for review',
  },
];

// ── Calendar events ───────────────────────────
export const calendarEvents = [
  { id: 'ev1',  date: '2025-02-03', type: 'email',    label: 'Email seq — step 3 sends',   color: '#3DDC84' },
  { id: 'ev2',  date: '2025-02-05', type: 'ad',       label: 'Meta creative refresh',       color: '#5EEAD4' },
  { id: 'ev3',  date: '2025-02-07', type: 'blog',     label: 'Blog publish: 5 Signs...',    color: '#F5C842' },
  { id: 'ev4',  date: '2025-02-10', type: 'review',   label: 'Bi-weekly campaign review',   color: '#6B9478' },
  { id: 'ev5',  date: '2025-02-12', type: 'email',    label: 'Email seq — step 4 sends',    color: '#3DDC84' },
  { id: 'ev6',  date: '2025-02-14', type: 'demo',     label: 'Demo: Nguyen Van Minh',       color: '#FF6E7A' },
  { id: 'ev7',  date: '2025-02-17', type: 'ad',       label: 'LinkedIn ad rotation',         color: '#5EEAD4' },
  { id: 'ev8',  date: '2025-02-19', type: 'email',    label: 'Email seq — step 5 sends',    color: '#3DDC84' },
  { id: 'ev9',  date: '2025-02-21', type: 'review',   label: 'ARIA weekly insight review',  color: '#6B9478' },
  { id: 'ev10', date: '2025-02-24', type: 'blog',     label: 'Blog publish: Q Close Tips',  color: '#F5C842' },
  { id: 'ev11', date: '2025-02-26', type: 'deadline', label: 'Creative assets due',         color: '#FF6E7A' },
  { id: 'ev12', date: '2025-02-28', type: 'review',   label: 'Month-end performance review',color: '#6B9478' },
];

// ── Plan / Gantt ──────────────────────────────
export const planPhases = [
  {
    id: 'ph1',
    phase: 'Phase 1',
    label: 'Awareness & Targeting',
    start: 'Jan 6',
    end: 'Jan 26',
    progress: 100,
    status: 'done',
    tasks: [
      { id: 'tk1', label: 'Audience build & ICP validation',   owner: 'JL', progress: 100, status: 'done',        start: 0,  width: 20 },
      { id: 'tk2', label: 'LinkedIn campaign setup',           owner: 'CM', progress: 100, status: 'done',        start: 5,  width: 15 },
      { id: 'tk3', label: 'Meta pixel & conversion setup',     owner: 'PN', progress: 100, status: 'done',        start: 5,  width: 15 },
      { id: 'tk4', label: 'Creative brief & asset production', owner: 'SK', progress: 100, status: 'done',        start: 0,  width: 20 },
    ],
  },
  {
    id: 'ph2',
    phase: 'Phase 2',
    label: 'Engagement & Nurture',
    start: 'Jan 27',
    end: 'Feb 23',
    progress: 75,
    status: 'active',
    tasks: [
      { id: 'tk5', label: 'Email sequence launch (5-step)',    owner: 'JL', progress: 100, status: 'done',        start: 20, width: 20 },
      { id: 'tk6', label: 'LinkedIn SDR outreach (50/wk)',     owner: 'SD', progress: 80,  status: 'active',      start: 20, width: 28 },
      { id: 'tk7', label: 'Retargeting campaign live',         owner: 'CM', progress: 60,  status: 'active',      start: 25, width: 23 },
      { id: 'tk8', label: 'Blog content publish (2 articles)', owner: 'SK', progress: 50,  status: 'active',      start: 22, width: 26 },
    ],
  },
  {
    id: 'ph3',
    phase: 'Phase 3',
    label: 'Conversion Push',
    start: 'Feb 24',
    end: 'Mar 17',
    progress: 0,
    status: 'pending',
    tasks: [
      { id: 'tk9',  label: 'Demo sequence activation',         owner: 'JL', progress: 0, status: 'pending',      start: 48, width: 14 },
      { id: 'tk10', label: 'Paid bid scale (+20%)',            owner: 'CM', progress: 0, status: 'pending',      start: 50, width: 12 },
      { id: 'tk11', label: 'Case study email send',            owner: 'SK', progress: 0, status: 'pending',      start: 52, width: 10 },
    ],
  },
  {
    id: 'ph4',
    phase: 'Phase 4',
    label: 'Close & Sales Handoff',
    start: 'Mar 18',
    end: 'Mar 28',
    progress: 0,
    status: 'pending',
    tasks: [
      { id: 'tk12', label: 'SQL handoff to AE team',           owner: 'JL', progress: 0, status: 'pending',      start: 62, width: 9  },
      { id: 'tk13', label: 'Final reporting & debrief',        owner: 'AN', progress: 0, status: 'pending',      start: 65, width: 7  },
    ],
  },
];
