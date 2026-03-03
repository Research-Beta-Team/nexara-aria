// ─────────────────────────────────────────────
//  ICP Builder & Scoring Engine — Mock Data
// ─────────────────────────────────────────────

// ── ICP Definition ────────────────────────────
export const ICP_DEFINITION = {
  version:     'v3.2',
  lastUpdated: 'Feb 24 2026',
  updatedBy:   'ARIA (from 12 closed-won)',
  icpScore:    87,

  firmographic: {
    industries: [
      { value: 'Manufacturing',     type: 'required' },
      { value: 'Textile & Apparel', type: 'required' },
      { value: 'FMCG',              type: 'preferred' },
      { value: 'Retail',            type: 'preferred' },
    ],
    companySizes: [
      { value: '201–500 employees',  type: 'required' },
      { value: '501–1000 employees', type: 'preferred' },
    ],
    geographies: [
      { value: 'Vietnam',    type: 'required' },
      { value: 'Bangladesh', type: 'required' },
      { value: 'Singapore',  type: 'preferred' },
      { value: 'Thailand',   type: 'preferred' },
    ],
    revenueRange:  '$10M–$200M ARR',
    employeeRange: '200–1,000',
  },

  technographic: {
    mustHave:    ['QuickBooks', 'SAP B1', 'Excel (heavy use)'],
    niceToHave:  ['Salesforce', 'HubSpot', 'NetSuite'],
    dealBreaker: ['SAP S/4HANA (enterprise)', 'Oracle ERP (locked in)'],
  },

  psychographic: {
    keywords:      ['CFO efficiency', 'financial visibility', 'cash flow', 'reporting automation', 'compliance'],
    painPoints:    [
      'Manual month-end close taking 5+ days',
      'Lack of real-time cash visibility',
      'Multiple disconnected spreadsheets',
      'Audit preparation overhead',
    ],
    triggerEvents: [
      'New CFO hire',
      'Series B/C funding',
      'Expansion to new market',
      'Failed audit',
      'Board reporting issues',
    ],
  },

  contactCriteria: {
    titles:      ['CFO', 'VP Finance', 'Head of Finance', 'Financial Controller'],
    seniority:   ['C-Level', 'VP', 'Director'],
    departments: ['Finance', 'Operations', 'Accounting'],
  },

  dimensionScores: {
    firmographic:  91,
    technographic: 78,
    psychographic: 63,
    coverage:      85,
    confidence:    87,
  },

  ariaCommentary: 'Your ICP is strong on firmographic criteria but psychographic signals need enrichment. Adding 3 more trigger events would improve qualification accuracy by ~15%.',
};

// ── Scoring Criteria (weights sum = 100) ────────
export const SCORING_CRITERIA = [
  { id: 'sc1', criterion: 'Industry match',           weight: 25, description: 'Exact industry match → full score; adjacent industry → 50% score. Based on win-rate correlation across 12 deals.' },
  { id: 'sc2', criterion: 'Company size',             weight: 20, description: 'Employee count within ICP range (201–1,000) scores highest. Outside range scores 0–40% based on proximity.' },
  { id: 'sc3', criterion: 'Technology signals',       weight: 15, description: 'Must-have tech detected via Apollo/BuiltWith enrichment. QuickBooks or SAP B1 confirmed → full score.' },
  { id: 'sc4', criterion: 'Contact title & seniority',weight: 15, description: 'CFO or VP Finance title match → 100%. Director-level → 70%. Manager-level → 40%.' },
  { id: 'sc5', criterion: 'Geography',                weight: 10, description: 'Tier-1 geo (Vietnam, Bangladesh) → 100%. Tier-2 (Singapore, Thailand) → 70%. Other APAC → 30%.' },
  { id: 'sc6', criterion: 'Trigger events',           weight: 10, description: 'Recent triggers (new CFO hire, funding round, failed audit) multiply the prospect score by 1.2–1.5×.' },
  { id: 'sc7', criterion: 'Psychographic keywords',   weight:  5, description: 'LinkedIn/website keyword signals for pain points. Detected from job postings and content engagement data.' },
];

// ── Score Distribution (100 prospects) ─────────
// status: 'not_contacted' | 'in_sequence' | 'closed_won'
const DIST_RAW = [
  // 90–100 (9 items)
  ['p001','Bamboo Textile Group',       97,'not_contacted'],
  ['p002','Viet Garment JSC',           94,'in_sequence'  ],
  ['p003','SIA Apparel Ltd',            92,'not_contacted'],
  ['p004','FabricTech Bangladesh',      91,'not_contacted'],
  ['p005','PacRim Consumer Goods',      89,'in_sequence'  ],
  ['p006','IndoRetail Holdings',        88,'not_contacted'],
  ['p007','Hanoi Manufacturing Co.',    86,'not_contacted'],
  ['p008','Southeast Apparel Group',    85,'not_contacted'],
  ['p009','Mekong Trading Corp',        90,'not_contacted'],
  // 80–89 (11 items)
  ['p010','Delta Textile JSC',          84,'not_contacted'],
  ['p011','Pacifica Garments',          82,'in_sequence'  ],
  ['p012','ASEAN Textile Group',        83,'not_contacted'],
  ['p013','Sunrise Manufacturing',      81,'not_contacted'],
  ['p014','VN Holdings Ltd',            80,'in_sequence'  ],
  ['p015','Blue Ocean Retail',          84,'not_contacted'],
  ['p016','Continental Apparel',        87,'not_contacted'],
  ['p017','KL Garment Exports',         83,'not_contacted'],
  ['p018','Asia Pacific Textiles',      81,'not_contacted'],
  ['p019','Crown Manufacturing',        82,'in_sequence'  ],
  ['p020','TrueFit Apparel',            80,'not_contacted'],
  // 70–79 (14 items)
  ['p021','Prime Textiles Co.',         79,'not_contacted'],
  ['p022','Horizon Garments',           77,'in_sequence'  ],
  ['p023','NextGen Manufacturing',      75,'not_contacted'],
  ['p024','Sterling Retail Group',      73,'not_contacted'],
  ['p025','Apex Apparel Ltd',           71,'not_contacted'],
  ['p026','Meridian Textile Corp',      78,'in_sequence'  ],
  ['p027','Pacific Weave Group',        76,'not_contacted'],
  ['p028','GreenLeaf Manufacturing',    74,'not_contacted'],
  ['p029','Summit Fashion JSC',         72,'not_contacted'],
  ['p030','EcoThread Vietnam',          70,'in_sequence'  ],
  ['p031','Royal Garment Works',        79,'not_contacted'],
  ['p032','Zenith Textile Ltd',         77,'not_contacted'],
  ['p033','Atlas Fashion Group',        75,'in_sequence'  ],
  ['p034','Nordic Apparel Asia',        73,'not_contacted'],
  // 60–69 (15 items)
  ['p035','Global Fashion Corp',        69,'in_sequence'  ],
  ['p036','Oceanic Retail Ltd',         67,'not_contacted'],
  ['p037','TechFab Industries',         65,'not_contacted'],
  ['p038','Emerald Manufacturing',      63,'in_sequence'  ],
  ['p039','Pinnacle Textiles',          61,'not_contacted'],
  ['p040','Metro Garments Ltd',         68,'not_contacted'],
  ['p041','Falcon Apparel Group',       66,'in_sequence'  ],
  ['p042','Pioneer Manufacturing',      64,'not_contacted'],
  ['p043','Starlight Textiles',         62,'not_contacted'],
  ['p044','Coastal Fashion Ltd',        60,'in_sequence'  ],
  ['p045','Iron Gate Industries',       69,'not_contacted'],
  ['p046','Sunrise Retail Corp',        67,'not_contacted'],
  ['p047','Momentum Garments',          65,'in_sequence'  ],
  ['p048','Crystal Apparel Group',      63,'not_contacted'],
  ['p049','Venture Textile Co.',        61,'not_contacted'],
  // 50–59 (16 items)
  ['p050','Harbor Manufacturing',       59,'not_contacted'],
  ['p051','EastStar Retail Group',      57,'in_sequence'  ],
  ['p052','Dynamic Fashion Ltd',        55,'not_contacted'],
  ['p053','Cascade Textiles',           53,'in_sequence'  ],
  ['p054','Forest Apparel Corp',        51,'not_contacted'],
  ['p055','Bridge Manufacturing',       58,'not_contacted'],
  ['p056','Capital Garments Ltd',       56,'in_sequence'  ],
  ['p057','Unity Textile Group',        54,'not_contacted'],
  ['p058','Nova Apparel Co.',           52,'not_contacted'],
  ['p059','Stream Fashion JSC',         50,'in_sequence'  ],
  ['p060','Crest Manufacturing',        59,'not_contacted'],
  ['p061','Titan Textile Corp',         57,'not_contacted'],
  ['p062','Anchor Retail Group',        55,'in_sequence'  ],
  ['p063','Keystone Garments',          53,'not_contacted'],
  ['p064','Frontier Apparel Ltd',       51,'not_contacted'],
  ['p065','Summit Retail Corp',         58,'in_sequence'  ],
  // 40–49 (12 items)
  ['p066','Eagle Textile Group',        49,'not_contacted'],
  ['p067','Phoenix Garments Ltd',       47,'in_sequence'  ],
  ['p068','Victory Fashion Corp',       45,'not_contacted'],
  ['p069','Horizon Manufacturing',      43,'not_contacted'],
  ['p070','Maple Apparel JSC',          41,'in_sequence'  ],
  ['p071','Thunder Textile Co.',        48,'not_contacted'],
  ['p072','Arrow Garments Group',       46,'not_contacted'],
  ['p073','Sigma Fashion Ltd',          44,'in_sequence'  ],
  ['p074','Delta Retail Corp',          42,'not_contacted'],
  ['p075','Echo Apparel Group',         40,'not_contacted'],
  ['p076','Prism Manufacturing',        49,'in_sequence'  ],
  ['p077','Vertex Textile Ltd',         47,'not_contacted'],
  // 30–39 (10 items)
  ['p078','Orion Retail JSC',           39,'not_contacted'],
  ['p079','Meteor Apparel Corp',        37,'in_sequence'  ],
  ['p080','Comet Textile Group',        35,'not_contacted'],
  ['p081','Galaxy Garments Ltd',        33,'not_contacted'],
  ['p082','Solar Fashion Co.',          31,'in_sequence'  ],
  ['p083','Lunar Manufacturing',        38,'not_contacted'],
  ['p084','Orbit Apparel Group',        36,'not_contacted'],
  ['p085','Nebula Textile JSC',         34,'in_sequence'  ],
  ['p086','Vega Retail Ltd',            32,'not_contacted'],
  ['p087','Sirius Fashion Corp',        30,'not_contacted'],
  // 20–29 (8 items)
  ['p088','Aquila Garments',            29,'in_sequence'  ],
  ['p089','Lyra Textile Group',         27,'not_contacted'],
  ['p090','Cygnus Apparel Ltd',         25,'not_contacted'],
  ['p091','Draco Fashion Corp',         23,'in_sequence'  ],
  ['p092','Perseus Retail JSC',         21,'not_contacted'],
  ['p093','Hydra Manufacturing',        28,'not_contacted'],
  ['p094','Leo Apparel Group',          26,'in_sequence'  ],
  ['p095','Gemini Textile Co.',         24,'not_contacted'],
  // 5–19 (5 items)
  ['p096','Aries Fashion Ltd',          18,'in_sequence'  ],
  ['p097','Taurus Retail Corp',         15,'not_contacted'],
  ['p098','Capricorn Garments',         12,'not_contacted'],
  ['p099','Scorpio Textile Group',       9,'in_sequence'  ],
  ['p100','Pisces Apparel JSC',          5,'not_contacted'],
];

export const SCORE_DISTRIBUTION = DIST_RAW.map(([id, prospect, score, status]) => ({
  id, prospect, score, status,
}));

// Pre-computed stats for the full 300-prospect pipeline
export const SCORE_STATS = {
  highFit:  23,   // score > 85
  goodFit:  67,   // score 70–85
  poorFit: 210,   // score < 70
  total:   300,
};

// ── Win/Loss Insights ─────────────────────────
export const WIN_LOSS_INSIGHTS = [
  {
    id: 'i1', type: 'win_pattern',
    insight: 'CFOs at 200–800-employee manufacturers close 3× faster when contacted within 5 days of a new CFO hire announcement.',
    confidence: 94, basedOn: 12,
  },
  {
    id: 'i2', type: 'win_pattern',
    insight: 'Companies with QuickBooks + Excel as primary finance tools have a 68% higher conversion rate versus other tech stacks.',
    confidence: 89, basedOn: 9,
  },
  {
    id: 'i3', type: 'loss_pattern',
    insight: 'Prospects using SAP S/4HANA rarely convert — 71% loss rate in deals where SAP is the core ERP system.',
    confidence: 88, basedOn: 11,
  },
  {
    id: 'i4', type: 'loss_pattern',
    insight: 'Deals with no internal champion identified by week 2 have an 82% loss rate. Champion mapping is critical to progression.',
    confidence: 93, basedOn: 8,
  },
  {
    id: 'i5', type: 'win_pattern',
    insight: 'Vietnam and Bangladesh geographies close 40% faster than Singapore with lower average deal size but much higher volume.',
    confidence: 81, basedOn: 7,
  },
  {
    id: 'i6', type: 'recommendation',
    insight: 'Add "Failed audit in last 12 months" as a tier-1 trigger event — it correlates with 3.2× higher urgency and faster close.',
    confidence: 76, basedOn: 5,
  },
  {
    id: 'i7', type: 'loss_pattern',
    insight: 'Deals initiated during Q4 budget freeze (Nov–Dec) have a 65% loss rate. Recommend pausing cold outreach in those months.',
    confidence: 85, basedOn: 10,
  },
  {
    id: 'i8', type: 'recommendation',
    insight: 'Enrich psychographic data with LinkedIn job-posting keywords. Currently missing for 34% of prospects in your active pipeline.',
    confidence: 79, basedOn: 0,
  },
];

// ── Buying Committee ──────────────────────────
export const BUYING_COMMITTEE = [
  {
    id: 'bc1', role: 'Economic Buyer', title: 'CFO',
    involvement: 'Final approval, budget sign-off, and ROI evaluation. Must see a clear payback period under 18 months.',
    coverage: 72, avgDaysToEngage: 18, reachOrder: 1,
  },
  {
    id: 'bc2', role: 'Champion', title: 'Head of Operations / VP Finance',
    involvement: 'Internal advocate, demo coordination, and stakeholder alignment. Drives internal consensus and urgency.',
    coverage: 85, avgDaysToEngage: 7, reachOrder: 2,
  },
  {
    id: 'bc3', role: 'Technical Evaluator', title: 'IT Manager / CTO',
    involvement: 'Security review, integration assessment, technical due diligence, and compatibility checks with existing stack.',
    coverage: 58, avgDaysToEngage: 24, reachOrder: 3,
  },
  {
    id: 'bc4', role: 'Legal / Procurement', title: 'Head of Legal / Procurement Manager',
    involvement: 'Contract negotiation, compliance review, vendor qualification, and approval workflow management.',
    coverage: 41, avgDaysToEngage: 38, reachOrder: 4,
  },
  {
    id: 'bc5', role: 'End User', title: 'Finance Analyst / Accountant',
    involvement: 'Daily product evaluation, adoption advocacy, and feedback on usability and workflow fit.',
    coverage: 63, avgDaysToEngage: 14, reachOrder: 5,
  },
];

// ── Lookalike Companies ────────────────────────
export const TOP_LOOKALIKES = [
  { id:'l1', name:'Bamboo Textile Group',    industry:'Textile & Apparel', size:'320 employees', score:96, reason:'Perfect firmographic match; uses QuickBooks. New CFO hired 3 months ago.', status:'not_contacted' },
  { id:'l2', name:'Viet Garment JSC',        industry:'Manufacturing',     size:'480 employees', score:94, reason:'Series B funded; manual reporting pain confirmed via LinkedIn posts.',     status:'in_sequence'   },
  { id:'l3', name:'SIA Apparel Ltd',         industry:'Textile & Apparel', size:'210 employees', score:91, reason:'Recent failed audit; new CFO announcement 6 weeks ago.',                 status:'not_contacted' },
  { id:'l4', name:'FabricTech Bangladesh',   industry:'Manufacturing',     size:'550 employees', score:89, reason:'Uses Excel + QuickBooks; expanding to Singapore market this quarter.',   status:'not_contacted' },
  { id:'l5', name:'PacRim Consumer Goods',   industry:'FMCG',             size:'380 employees', score:87, reason:'VP Finance active on LinkedIn discussing reporting automation challenges.',status:'in_sequence'   },
  { id:'l6', name:'IndoRetail Holdings',     industry:'Retail',            size:'290 employees', score:84, reason:'Board reporting pressure; no ERP — entire finance team is Excel-heavy.',  status:'not_contacted' },
  { id:'l7', name:'Hanoi Manufacturing Co.', industry:'Manufacturing',     size:'420 employees', score:81, reason:'Revenue in range, Vietnam market; CFO tenure under 1 year.',              status:'not_contacted' },
  { id:'l8', name:'Southeast Apparel Group', industry:'Textile & Apparel', size:'670 employees', score:79, reason:'Strong firmographic match but technographic stack is currently unknown.',  status:'not_contacted' },
];
