// ─────────────────────────────────────────────
//  ABM Engine — mock data
// ─────────────────────────────────────────────

function touchpoint(date, type, direction, stakeholderName, note, outcome) {
  return { date, type, direction, stakeholderName, note, outcome };
}

function stakeholder(id, name, title, role, lastTouched, sentiment, engagement, channel) {
  return { id, name, title, role, lastTouched, sentiment, engagement, channel };
}

export const NAMED_ACCOUNTS = [
  // ── Tier 1 — Enterprise (3) ─────────────────
  {
    id: 'acc-1',
    name: 'TechCorp Global',
    industry: 'Technology',
    employees: '12,000',
    estimatedDeal: 420000,
    tier: 1,
    healthScore: 88,
    status: 'Active',
    lastActivity: '2 days ago',
    hq: 'San Francisco, CA',
    website: 'https://techcorp.global',
    funding: 'Series E · $1.2B',
    techStack: ['Salesforce', 'HubSpot', 'Snowflake', 'Slack'],
    ariaRecommendation: 'Technical evaluator (Sarah Chen) hasn\'t been touched in 14 days. Send the compliance ROI calculator to re-engage.',
    nextAction: 'Send ROI calculator to Sarah Chen',
    stakeholders: [
      stakeholder('s1', 'James Wu', 'VP Sales', 'champion', '3 days ago', 'positive', 85, 'email'),
      stakeholder('s2', 'Sarah Chen', 'Director of IT', 'technical', '14 days ago', 'neutral', 42, 'linkedin'),
      stakeholder('s3', 'Maria Santos', 'CFO', 'economic_buyer', '5 days ago', 'positive', 72, 'call'),
      stakeholder('s4', 'David Park', 'Legal Counsel', 'legal', '21 days ago', 'unknown', 28, 'email'),
    ],
    touchpoints: [
      touchpoint('2025-02-28', 'email', 'outbound', 'James Wu', 'Sent Q1 case study', 'Opened'),
      touchpoint('2025-02-27', 'call', 'inbound', 'Maria Santos', 'Discovery call', 'Positive'),
      touchpoint('2025-02-25', 'meeting', 'outbound', 'James Wu', 'Product demo', 'Next steps agreed'),
      touchpoint('2025-02-14', 'linkedin', 'outbound', 'Sarah Chen', 'Connection request', 'Accepted'),
      touchpoint('2025-02-07', 'email', 'inbound', 'David Park', 'Security questionnaire', 'Pending'),
    ],
    playbook: {
      phases: [
        {
          name: 'Build awareness',
          weekRange: 'Week 1-2',
          tasks: [
            { id: 't1', assignee: 'Alex', dueDate: '2025-03-05', type: 'Email', description: 'Send one-pager to Sarah Chen', done: true },
            { id: 't2', assignee: 'Jordan', dueDate: '2025-03-06', type: 'Call', description: 'Follow-up with James Wu on demo feedback', done: true },
            { id: 't3', assignee: 'Alex', dueDate: '2025-03-08', type: 'Content', description: 'Share compliance webinar with David Park', done: false },
          ],
        },
        {
          name: 'Establish value',
          weekRange: 'Week 3-4',
          tasks: [
            { id: 't4', assignee: 'Jordan', dueDate: '2025-03-15', type: 'Meeting', description: 'ROI workshop with Maria Santos', done: false },
            { id: 't5', assignee: 'Alex', dueDate: '2025-03-18', type: 'Email', description: 'Send ROI calculator to Sarah Chen', done: false },
          ],
        },
        {
          name: 'Drive decision',
          weekRange: 'Week 5-6',
          tasks: [
            { id: 't6', assignee: 'Jordan', dueDate: '2025-03-25', type: 'Meeting', description: 'Executive summary for James + Maria', done: false },
            { id: 't7', assignee: 'Alex', dueDate: '2025-03-28', type: 'Call', description: 'Legal review with David Park', done: false },
          ],
        },
      ],
    },
    contentAssets: [
      { id: 'c1', name: 'Custom one-pager', type: 'one_pager', useCase: 'Enterprise compliance at scale', companyName: 'TechCorp Global' },
      { id: 'c2', name: 'ROI calculator', type: 'roi_calculator', prefill: '12,000 employees, 3 regions' },
      { id: 'c3', name: 'Reference customer', type: 'reference_customer', story: 'FinServe Inc — similar size, 40% time saved on compliance' },
    ],
  },
  {
    id: 'acc-2',
    name: 'MedScale Solutions',
    industry: 'Healthcare',
    employees: '8,500',
    estimatedDeal: 380000,
    tier: 1,
    healthScore: 72,
    status: 'Active',
    lastActivity: '1 day ago',
    hq: 'Boston, MA',
    website: 'https://medscale.io',
    funding: 'Series D · $480M',
    techStack: ['Microsoft 365', 'Workday', 'Tableau', 'Zendesk'],
    ariaRecommendation: 'Champion (Dr. Lisa Wong) is highly engaged. Schedule exec briefing with economic buyer (COO) in the next 7 days.',
    nextAction: 'Schedule COO briefing',
    stakeholders: [
      stakeholder('s5', 'Dr. Lisa Wong', 'Head of Clinical Ops', 'champion', '1 day ago', 'positive', 90, 'email'),
      stakeholder('s6', 'Michael Torres', 'COO', 'economic_buyer', '8 days ago', 'neutral', 55, 'call'),
      stakeholder('s7', 'Jennifer Lee', 'IT Director', 'technical', '5 days ago', 'positive', 68, 'linkedin'),
    ],
    touchpoints: [
      touchpoint('2025-03-01', 'email', 'outbound', 'Dr. Lisa Wong', 'Sent pilot proposal', 'Opened'),
      touchpoint('2025-02-28', 'call', 'inbound', 'Dr. Lisa Wong', 'Pilot scope discussion', 'Positive'),
      touchpoint('2025-02-22', 'meeting', 'outbound', 'Michael Torres', 'Intro call with COO', 'Neutral'),
      touchpoint('2025-02-20', 'linkedin', 'outbound', 'Jennifer Lee', 'Technical FAQ', 'Replied'),
    ],
    playbook: {
      phases: [
        { name: 'Build awareness', weekRange: 'Week 1-2', tasks: [
          { id: 't8', assignee: 'Sam', dueDate: '2025-03-10', type: 'Email', description: 'Case study to Dr. Wong', done: true },
          { id: 't9', assignee: 'Sam', dueDate: '2025-03-12', type: 'Meeting', description: 'COO briefing', done: false },
        ]},
        { name: 'Establish value', weekRange: 'Week 3-4', tasks: [
          { id: 't10', assignee: 'Jordan', dueDate: '2025-03-20', type: 'Call', description: 'Pilot terms with Lisa', done: false },
        ]},
        { name: 'Drive decision', weekRange: 'Week 5-6', tasks: [
          { id: 't11', assignee: 'Jordan', dueDate: '2025-03-28', type: 'Meeting', description: 'Final sign-off with COO', done: false },
        ]},
      ],
    },
    contentAssets: [
      { id: 'c4', name: 'Custom one-pager', type: 'one_pager', useCase: 'Clinical ops automation', companyName: 'MedScale Solutions' },
      { id: 'c5', name: 'ROI calculator', type: 'roi_calculator', prefill: '8,500 employees, healthcare' },
      { id: 'c6', name: 'Reference customer', type: 'reference_customer', story: 'HealthFirst — 35% faster onboarding' },
    ],
  },
  {
    id: 'acc-3',
    name: 'FinServe Inc',
    industry: 'Financial Services',
    employees: '5,200',
    estimatedDeal: 310000,
    tier: 1,
    healthScore: 65,
    status: 'At Risk',
    lastActivity: '5 days ago',
    hq: 'New York, NY',
    website: 'https://finserve.com',
    funding: 'Public',
    techStack: ['SAP', 'ServiceNow', 'Salesforce', 'DocuSign'],
    ariaRecommendation: 'Momentum has cooled. Re-engage champion with a relevant peer story (similar bank) and propose a short executive call.',
    nextAction: 'Send peer case study + request exec call',
    stakeholders: [
      stakeholder('s8', 'Rachel Kim', 'SVP Operations', 'champion', '5 days ago', 'neutral', 58, 'call'),
      stakeholder('s9', 'Tom Bradley', 'CTO', 'technical', '12 days ago', 'neutral', 45, 'email'),
    ],
    touchpoints: [
      touchpoint('2025-02-25', 'call', 'outbound', 'Rachel Kim', 'Quarterly check-in', 'Neutral'),
      touchpoint('2025-02-18', 'email', 'outbound', 'Tom Bradley', 'Security doc request', 'No reply'),
      touchpoint('2025-02-10', 'meeting', 'inbound', 'Rachel Kim', 'Steering committee', 'Deferred'),
    ],
    playbook: {
      phases: [
        { name: 'Build awareness', weekRange: 'Week 1-2', tasks: [
          { id: 't12', assignee: 'Alex', dueDate: '2025-03-08', type: 'Email', description: 'Peer case study to Rachel', done: false },
          { id: 't13', assignee: 'Jordan', dueDate: '2025-03-10', type: 'Call', description: 'Exec re-engagement call', done: false },
        ]},
        { name: 'Establish value', weekRange: 'Week 3-4', tasks: [] },
        { name: 'Drive decision', weekRange: 'Week 5-6', tasks: [] },
      ],
    },
    contentAssets: [
      { id: 'c7', name: 'Custom one-pager', type: 'one_pager', useCase: 'Financial services compliance', companyName: 'FinServe Inc' },
      { id: 'c8', name: 'ROI calculator', type: 'roi_calculator', prefill: '5,200 employees' },
      { id: 'c9', name: 'Reference customer', type: 'reference_customer', story: 'TechCorp Global — compliance at scale' },
    ],
  },
  // ── Tier 2 — Mid-Market (4) ─────────────────
  {
    id: 'acc-4',
    name: 'CloudNine Software',
    industry: 'Technology',
    employees: '1,200',
    estimatedDeal: 185000,
    tier: 2,
    healthScore: 91,
    status: 'Active',
    lastActivity: '1 day ago',
    hq: 'Austin, TX',
    website: 'https://cloudnine.io',
    funding: 'Series C · $90M',
    techStack: ['HubSpot', 'Stripe', 'Intercom', 'Notion'],
    ariaRecommendation: 'Champion is ready for pricing. Send proposal and schedule contract review with legal.',
    nextAction: 'Send proposal + book legal review',
    stakeholders: [
      stakeholder('s10', 'Chris Adams', 'Head of Sales', 'champion', '1 day ago', 'positive', 92, 'email'),
      stakeholder('s11', 'Emma Davis', 'General Counsel', 'legal', '4 days ago', 'neutral', 60, 'email'),
    ],
    touchpoints: [
      touchpoint('2025-03-01', 'email', 'outbound', 'Chris Adams', 'Proposal draft', 'Opened'),
      touchpoint('2025-02-26', 'meeting', 'inbound', 'Chris Adams', 'Pricing discussion', 'Positive'),
      touchpoint('2025-02-25', 'email', 'outbound', 'Emma Davis', 'Contract draft', 'Pending'),
    ],
    playbook: {
      phases: [
        { name: 'Build awareness', weekRange: 'Week 1-2', tasks: [
          { id: 't14', assignee: 'Sam', dueDate: '2025-03-05', type: 'Email', description: 'Proposal to Chris', done: true },
          { id: 't15', assignee: 'Sam', dueDate: '2025-03-08', type: 'Call', description: 'Legal review with Emma', done: false },
        ]},
        { name: 'Establish value', weekRange: 'Week 3-4', tasks: [] },
        { name: 'Drive decision', weekRange: 'Week 5-6', tasks: [
          { id: 't16', assignee: 'Jordan', dueDate: '2025-03-22', type: 'Meeting', description: 'Contract sign-off', done: false },
        ]},
      ],
    },
    contentAssets: [
      { id: 'c10', name: 'Custom one-pager', type: 'one_pager', useCase: 'Sales enablement', companyName: 'CloudNine Software' },
      { id: 'c11', name: 'ROI calculator', type: 'roi_calculator', prefill: '1,200 employees' },
      { id: 'c12', name: 'Reference customer', type: 'reference_customer', story: 'MedScale — fast implementation' },
    ],
  },
  {
    id: 'acc-5',
    name: 'RetailMax',
    industry: 'Retail',
    employees: '3,400',
    estimatedDeal: 160000,
    tier: 2,
    healthScore: 78,
    status: 'Active',
    lastActivity: '3 days ago',
    hq: 'Chicago, IL',
    website: 'https://retailmax.com',
    funding: 'Private equity',
    techStack: ['Salesforce', 'Oracle', 'SAP', 'Adobe'],
    ariaRecommendation: 'Technical evaluator needs a hands-on trial. Offer a 2-week sandbox and schedule kickoff.',
    nextAction: 'Offer sandbox + kickoff call',
    stakeholders: [
      stakeholder('s12', 'Patricia Moore', 'VP Merchandising', 'champion', '3 days ago', 'positive', 75, 'call'),
      stakeholder('s13', 'Kevin Zhang', 'Director of IT', 'technical', '10 days ago', 'neutral', 50, 'email'),
    ],
    touchpoints: [
      touchpoint('2025-02-27', 'call', 'outbound', 'Patricia Moore', 'Trial discussion', 'Positive'),
      touchpoint('2025-02-17', 'email', 'outbound', 'Kevin Zhang', 'Trial invite', 'Opened'),
    ],
    playbook: {
      phases: [
        { name: 'Build awareness', weekRange: 'Week 1-2', tasks: [
          { id: 't17', assignee: 'Alex', dueDate: '2025-03-12', type: 'Email', description: 'Sandbox invite to Kevin', done: false },
          { id: 't18', assignee: 'Sam', dueDate: '2025-03-14', type: 'Call', description: 'Kickoff with Patricia', done: false },
        ]},
        { name: 'Establish value', weekRange: 'Week 3-4', tasks: [] },
        { name: 'Drive decision', weekRange: 'Week 5-6', tasks: [] },
      ],
    },
    contentAssets: [
      { id: 'c13', name: 'Custom one-pager', type: 'one_pager', useCase: 'Retail operations', companyName: 'RetailMax' },
      { id: 'c14', name: 'ROI calculator', type: 'roi_calculator', prefill: '3,400 employees, retail' },
      { id: 'c15', name: 'Reference customer', type: 'reference_customer', story: 'Similar retailer — 25% efficiency gain' },
    ],
  },
  {
    id: 'acc-6',
    name: 'EduTech Partners',
    industry: 'Education',
    employees: '800',
    estimatedDeal: 125000,
    tier: 2,
    healthScore: 55,
    status: 'Stalled',
    lastActivity: '12 days ago',
    hq: 'Denver, CO',
    website: 'https://edutechpartners.com',
    funding: 'Series B · $35M',
    techStack: ['Google Workspace', 'Canvas', 'Zoom', 'Salesforce'],
    ariaRecommendation: 'No touch in 12 days. Send a short “we’re here when you’re ready” email with one new asset (e.g. product update).',
    nextAction: 'Send check-in email + product update',
    stakeholders: [
      stakeholder('s14', 'Nancy Foster', 'Director of Programs', 'champion', '12 days ago', 'neutral', 48, 'email'),
      stakeholder('s15', 'Robert Hill', 'CFO', 'economic_buyer', '18 days ago', 'unknown', 30, 'call'),
    ],
    touchpoints: [
      touchpoint('2025-02-18', 'email', 'outbound', 'Nancy Foster', 'Proposal follow-up', 'No reply'),
      touchpoint('2025-02-12', 'call', 'outbound', 'Robert Hill', 'Budget timing', 'Deferred'),
    ],
    playbook: {
      phases: [
        { name: 'Build awareness', weekRange: 'Week 1-2', tasks: [
          { id: 't19', assignee: 'Alex', dueDate: '2025-03-15', type: 'Email', description: 'Check-in + product update', done: false },
        ]},
        { name: 'Establish value', weekRange: 'Week 3-4', tasks: [] },
        { name: 'Drive decision', weekRange: 'Week 5-6', tasks: [] },
      ],
    },
    contentAssets: [
      { id: 'c16', name: 'Custom one-pager', type: 'one_pager', useCase: 'Education programs', companyName: 'EduTech Partners' },
      { id: 'c17', name: 'ROI calculator', type: 'roi_calculator', prefill: '800 employees' },
      { id: 'c18', name: 'Reference customer', type: 'reference_customer', story: 'State district — adoption metrics' },
    ],
  },
  {
    id: 'acc-7',
    name: 'LogiFlow Systems',
    industry: 'Logistics',
    employees: '2,100',
    estimatedDeal: 195000,
    tier: 2,
    healthScore: 82,
    status: 'Active',
    lastActivity: '2 days ago',
    hq: 'Atlanta, GA',
    website: 'https://logiflow.com',
    funding: 'Series C · $120M',
    techStack: ['SAP', 'Oracle', 'Twilio', 'Datadog'],
    ariaRecommendation: 'Economic buyer (COO) is in next week. Send one-pager and request 30 min on their calendar.',
    nextAction: 'Send one-pager + request COO meeting',
    stakeholders: [
      stakeholder('s16', 'Susan Wright', 'VP Operations', 'champion', '2 days ago', 'positive', 88, 'email'),
      stakeholder('s17', 'Mark Johnson', 'COO', 'economic_buyer', '7 days ago', 'neutral', 62, 'call'),
    ],
    touchpoints: [
      touchpoint('2025-02-28', 'email', 'outbound', 'Susan Wright', 'One-pager', 'Opened'),
      touchpoint('2025-02-26', 'call', 'inbound', 'Mark Johnson', 'Intro call', 'Positive'),
    ],
    playbook: {
      phases: [
        { name: 'Build awareness', weekRange: 'Week 1-2', tasks: [
          { id: 't20', assignee: 'Jordan', dueDate: '2025-03-08', type: 'Meeting', description: 'COO 30 min', done: false },
        ]},
        { name: 'Establish value', weekRange: 'Week 3-4', tasks: [] },
        { name: 'Drive decision', weekRange: 'Week 5-6', tasks: [] },
      ],
    },
    contentAssets: [
      { id: 'c19', name: 'Custom one-pager', type: 'one_pager', useCase: 'Logistics operations', companyName: 'LogiFlow Systems' },
      { id: 'c20', name: 'ROI calculator', type: 'roi_calculator', prefill: '2,100 employees' },
      { id: 'c21', name: 'Reference customer', type: 'reference_customer', story: 'RetailMax — supply chain gains' },
    ],
  },
  // ── Tier 3 — SMB (5) ────────────────────────
  {
    id: 'acc-8',
    name: 'StartupLabs',
    industry: 'Technology',
    employees: '95',
    estimatedDeal: 45000,
    tier: 3,
    healthScore: 70,
    status: 'Active',
    lastActivity: '4 days ago',
    hq: 'Seattle, WA',
    website: 'https://startuplabs.io',
    funding: 'Seed · $4M',
    techStack: ['Slack', 'Notion', 'Stripe', 'HubSpot'],
    ariaRecommendation: 'Founder is champion; keep momentum with a lightweight demo and simple pricing next step.',
    nextAction: 'Send demo recording + pricing',
    stakeholders: [
      stakeholder('s18', 'Jake Miller', 'Founder & CEO', 'champion', '4 days ago', 'positive', 78, 'email'),
    ],
    touchpoints: [
      touchpoint('2025-02-26', 'email', 'outbound', 'Jake Miller', 'Demo link', 'Clicked'),
      touchpoint('2025-02-24', 'call', 'inbound', 'Jake Miller', 'Discovery', 'Positive'),
    ],
    playbook: {
      phases: [
        { name: 'Build awareness', weekRange: 'Week 1-2', tasks: [
          { id: 't21', assignee: 'Sam', dueDate: '2025-03-10', type: 'Email', description: 'Pricing + next steps', done: false },
        ]},
        { name: 'Establish value', weekRange: 'Week 3-4', tasks: [] },
        { name: 'Drive decision', weekRange: 'Week 5-6', tasks: [] },
      ],
    },
    contentAssets: [
      { id: 'c22', name: 'Custom one-pager', type: 'one_pager', useCase: 'Startup growth', companyName: 'StartupLabs' },
      { id: 'c23', name: 'ROI calculator', type: 'roi_calculator', prefill: '95 employees' },
      { id: 'c24', name: 'Reference customer', type: 'reference_customer', story: 'Similar startup — 3-month payback' },
    ],
  },
  {
    id: 'acc-9',
    name: 'GreenEnergy Co',
    industry: 'Energy',
    employees: '340',
    estimatedDeal: 72000,
    tier: 3,
    healthScore: 58,
    status: 'At Risk',
    lastActivity: '7 days ago',
    hq: 'Portland, OR',
    website: 'https://greenenergy.co',
    funding: 'Series A · $18M',
    techStack: ['Salesforce', 'Microsoft 365', 'Tableau'],
    ariaRecommendation: 'Champion went quiet. Send one relevant piece of content (e.g. sustainability report) and ask for best time to reconnect.',
    nextAction: 'Send sustainability content + ask for reconnect',
    stakeholders: [
      stakeholder('s19', 'Lisa Chen', 'Sustainability Lead', 'champion', '7 days ago', 'neutral', 52, 'email'),
    ],
    touchpoints: [
      touchpoint('2025-02-23', 'email', 'outbound', 'Lisa Chen', 'Proposal', 'Opened'),
      touchpoint('2025-02-18', 'call', 'outbound', 'Lisa Chen', 'Intro', 'Neutral'),
    ],
    playbook: {
      phases: [
        { name: 'Build awareness', weekRange: 'Week 1-2', tasks: [
          { id: 't22', assignee: 'Alex', dueDate: '2025-03-12', type: 'Email', description: 'Sustainability content', done: false },
        ]},
        { name: 'Establish value', weekRange: 'Week 3-4', tasks: [] },
        { name: 'Drive decision', weekRange: 'Week 5-6', tasks: [] },
      ],
    },
    contentAssets: [
      { id: 'c25', name: 'Custom one-pager', type: 'one_pager', useCase: 'Sustainability reporting', companyName: 'GreenEnergy Co' },
      { id: 'c26', name: 'ROI calculator', type: 'roi_calculator', prefill: '340 employees' },
      { id: 'c27', name: 'Reference customer', type: 'reference_customer', story: 'EduTech — green initiatives' },
    ],
  },
  {
    id: 'acc-10',
    name: 'MediaHouse',
    industry: 'Media',
    employees: '220',
    estimatedDeal: 58000,
    tier: 3,
    healthScore: 90,
    status: 'Active',
    lastActivity: '1 day ago',
    hq: 'Los Angeles, CA',
    website: 'https://mediahouse.com',
    funding: 'Bootstrapped',
    techStack: ['Adobe', 'Google Workspace', 'Asana'],
    ariaRecommendation: 'Decision maker is engaged. Send contract and schedule close date.',
    nextAction: 'Send contract + set close date',
    stakeholders: [
      stakeholder('s20', 'David Brown', 'Head of Ops', 'champion', '1 day ago', 'positive', 95, 'email'),
    ],
    touchpoints: [
      touchpoint('2025-03-01', 'email', 'inbound', 'David Brown', 'Ready to move forward', 'Positive'),
      touchpoint('2025-02-28', 'call', 'outbound', 'David Brown', 'Pricing alignment', 'Positive'),
    ],
    playbook: {
      phases: [
        { name: 'Build awareness', weekRange: 'Week 1-2', tasks: [
          { id: 't23', assignee: 'Jordan', dueDate: '2025-03-05', type: 'Email', description: 'Contract to David', done: false },
        ]},
        { name: 'Establish value', weekRange: 'Week 3-4', tasks: [] },
        { name: 'Drive decision', weekRange: 'Week 5-6', tasks: [
          { id: 't24', assignee: 'Jordan', dueDate: '2025-03-15', type: 'Meeting', description: 'Close date', done: false },
        ]},
      ],
    },
    contentAssets: [
      { id: 'c28', name: 'Custom one-pager', type: 'one_pager', useCase: 'Media operations', companyName: 'MediaHouse' },
      { id: 'c29', name: 'ROI calculator', type: 'roi_calculator', prefill: '220 employees' },
      { id: 'c30', name: 'Reference customer', type: 'reference_customer', story: 'Similar media co — fast close' },
    ],
  },
  {
    id: 'acc-11',
    name: 'BuildRight Construction',
    industry: 'Construction',
    employees: '1,800',
    estimatedDeal: 88000,
    tier: 3,
    healthScore: 48,
    status: 'Stalled',
    lastActivity: '15 days ago',
    hq: 'Houston, TX',
    website: 'https://buildright.com',
    funding: 'Private',
    techStack: ['Procore', 'QuickBooks', 'Microsoft 365'],
    ariaRecommendation: 'Account has gone cold. Try one more touch with a “we’re here” message and a new case study from construction.',
    nextAction: 'Send construction case study + one check-in',
    stakeholders: [
      stakeholder('s21', 'Mike Torres', 'VP Operations', 'champion', '15 days ago', 'negative', 35, 'call'),
    ],
    touchpoints: [
      touchpoint('2025-02-15', 'call', 'outbound', 'Mike Torres', 'Follow-up', 'Busy'),
      touchpoint('2025-02-08', 'email', 'outbound', 'Mike Torres', 'Case study', 'Opened'),
    ],
    playbook: {
      phases: [
        { name: 'Build awareness', weekRange: 'Week 1-2', tasks: [
          { id: 't25', assignee: 'Sam', dueDate: '2025-03-18', type: 'Email', description: 'Construction case study', done: false },
        ]},
        { name: 'Establish value', weekRange: 'Week 3-4', tasks: [] },
        { name: 'Drive decision', weekRange: 'Week 5-6', tasks: [] },
      ],
    },
    contentAssets: [
      { id: 'c31', name: 'Custom one-pager', type: 'one_pager', useCase: 'Construction ops', companyName: 'BuildRight Construction' },
      { id: 'c32', name: 'ROI calculator', type: 'roi_calculator', prefill: '1,800 employees' },
      { id: 'c33', name: 'Reference customer', type: 'reference_customer', story: 'LogiFlow — field ops' },
    ],
  },
  {
    id: 'acc-12',
    name: 'DataVault Security',
    industry: 'Technology',
    employees: '150',
    estimatedDeal: 52000,
    tier: 3,
    healthScore: 75,
    status: 'Active',
    lastActivity: '3 days ago',
    hq: 'San Jose, CA',
    website: 'https://datavault.io',
    funding: 'Series A · $12M',
    techStack: ['AWS', 'Okta', 'Datadog', 'Jira'],
    ariaRecommendation: 'Technical buyer requested security review. Send SOC 2 one-pager and schedule technical call.',
    nextAction: 'Send SOC 2 doc + book technical call',
    stakeholders: [
      stakeholder('s22', 'Anna Kumar', 'CISO', 'technical', '3 days ago', 'positive', 70, 'email'),
      stakeholder('s23', 'Paul Green', 'CEO', 'economic_buyer', '6 days ago', 'neutral', 55, 'call'),
    ],
    touchpoints: [
      touchpoint('2025-02-27', 'email', 'inbound', 'Anna Kumar', 'Security questionnaire', 'Pending'),
      touchpoint('2025-02-25', 'call', 'outbound', 'Paul Green', 'Intro', 'Positive'),
    ],
    playbook: {
      phases: [
        { name: 'Build awareness', weekRange: 'Week 1-2', tasks: [
          { id: 't26', assignee: 'Alex', dueDate: '2025-03-08', type: 'Email', description: 'SOC 2 to Anna', done: false },
          { id: 't27', assignee: 'Alex', dueDate: '2025-03-10', type: 'Call', description: 'Technical call', done: false },
        ]},
        { name: 'Establish value', weekRange: 'Week 3-4', tasks: [] },
        { name: 'Drive decision', weekRange: 'Week 5-6', tasks: [] },
      ],
    },
    contentAssets: [
      { id: 'c34', name: 'Custom one-pager', type: 'one_pager', useCase: 'Security & compliance', companyName: 'DataVault Security' },
      { id: 'c35', name: 'ROI calculator', type: 'roi_calculator', prefill: '150 employees' },
      { id: 'c36', name: 'Reference customer', type: 'reference_customer', story: 'TechCorp — security review' },
    ],
  },
];

// Pipeline total (for header)
export const ABM_PIPELINE_TOTAL = NAMED_ACCOUNTS.reduce((sum, a) => sum + (a.estimatedDeal || 0), 0);
