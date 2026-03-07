/**
 * Threaded approval system — mock data for approvable content and reviewers.
 */

export const MOCK_REVIEWERS = [
  { id: 'rev1', name: 'Asif', initials: 'AS' },
  { id: 'rev2', name: 'Badhon', initials: 'BD' },
  { id: 'rev3', name: 'Dhrubo', initials: 'DH' },
  { id: 'rev4', name: 'Nishi', initials: 'NI' },
];

export const APPROVABLE_CONTENT = [
  {
    id: 'ap1',
    contentId: 'CAMP-001-EMAIL-003',
    type: 'Email',
    title: 'CFO Q2 — Touch 3: Break-up',
    body: 'Subject: Closing the loop, {{first_name}}\n\nHi {{first_name}},\n\nI\'ve reached out a couple of times — I know inboxes are brutal, so I\'ll keep this short.\n\nIf automating your finance reporting isn\'t a priority right now, I completely understand. Happy to reconnect when the timing is better.',
    campaign: 'c1',
    campaignName: 'Medglobal VN CFO Q2',
    status: 'in_review',
    statusUpdatedAt: '2026-02-11',
    reviewers: [
      { reviewerId: 'rev1', status: 'approved' },
      { reviewerId: 'rev2', status: 'pending' },
    ],
    comments: [
      { id: 'c1', authorId: 'rev2', body: 'The opening line is too generic. Can Freya make it more specific to Vietnam textile industry?', timestamp: '2026-02-12T10:00:00', actionTag: 'changes_requested' },
      { id: 'c2', authorId: 'aria', body: 'Revised first line to: "Vietnam\'s textile export sector grew 8% last quarter — and your Q1 pricing decisions will determine if that translates to margin." Does this work?', timestamp: '2026-02-12T10:15:00', actionTag: 'replied_to_aria', ariaReply: true },
      { id: 'c3', authorId: 'rev2', body: 'Much better. Approve this version.', timestamp: '2026-02-12T11:00:00', actionTag: 'approved' },
      { id: 'c4', authorId: 'rev1', body: 'Approved ✓', timestamp: '2026-02-12T11:30:00', actionTag: 'approved' },
    ],
    createdAt: '2026-02-10',
    submittedAt: '2026-02-11',
    generatedBy: 'Copywriter Agent',
    generatedAt: '2026-02-10',
  },
  {
    id: 'ap2',
    contentId: 'CAMP-001-LINKEDIN-001',
    type: 'LinkedIn',
    title: 'LinkedIn outreach — CFO Vietnam',
    body: 'Hi {{first_name}}, I noticed {{company}} is scaling in Vietnam. We help CFOs automate month-end close across entities. Would a 15-min call make sense?',
    campaign: 'c1',
    campaignName: 'Medglobal VN CFO Q2',
    status: 'revision_requested',
    statusUpdatedAt: '2026-02-12',
    reviewers: [{ reviewerId: 'rev2', status: 'changes_requested' }],
    comments: [
      { id: 'c5', authorId: 'rev2', body: 'Tone feels too salesy. Ask Freya to soften and add one Vietnam-specific stat.', timestamp: '2026-02-12T09:00:00', actionTag: 'changes_requested' },
    ],
    createdAt: '2026-02-11',
    submittedAt: '2026-02-11',
    generatedBy: 'Copywriter Agent',
    generatedAt: '2026-02-11',
  },
  {
    id: 'ap3',
    contentId: 'CAMP-001-META-B',
    type: 'Meta Ad',
    title: 'Meta ad copy variant B',
    body: 'Headline: Close in 3 days, not 3 weeks.\nBody: Finance teams at Vietnam\'s fastest-growing companies are automating what used to take weeks.\nCTA: See How →',
    campaign: 'c1',
    campaignName: 'Medglobal VN CFO Q2',
    status: 'approved',
    statusUpdatedAt: '2026-02-11',
    reviewers: [
      { reviewerId: 'rev1', status: 'approved' },
      { reviewerId: 'rev2', status: 'approved' },
    ],
    comments: [],
    createdAt: '2026-02-09',
    submittedAt: '2026-02-10',
    generatedBy: 'Ad Composer',
    generatedAt: '2026-02-09',
  },
  {
    id: 'ap4',
    contentId: 'CAMP-002-BRIEF-001',
    type: 'Strategy',
    title: 'Strategy brief — APAC Brand',
    body: 'Positioning and ICP summary for APAC Brand Awareness campaign. Key messages, channels, and success metrics.',
    campaign: 'c2',
    campaignName: 'APAC Brand Awareness',
    status: 'draft',
    statusUpdatedAt: '2026-02-13',
    reviewers: [],
    comments: [],
    createdAt: '2026-02-13',
    submittedAt: null,
    generatedBy: 'Content Strategist',
    generatedAt: '2026-02-13',
  },
  {
    id: 'ap5',
    contentId: 'CAMP-001-EMAIL-SUBJ',
    type: 'Email',
    title: 'Email subject line A/B test',
    body: 'Subject A: Finance automation for Vietnam-scale CFOs\nSubject B: How {{company}} CFOs cut reporting time by 60%',
    campaign: 'c1',
    campaignName: 'Medglobal VN CFO Q2',
    status: 'in_review',
    statusUpdatedAt: '2026-02-10',
    reviewers: [{ reviewerId: 'rev3', status: 'pending' }],
    comments: [],
    createdAt: '2026-02-10',
    submittedAt: '2026-02-10',
    generatedBy: 'Copywriter Agent',
    generatedAt: '2026-02-10',
  },
  {
    id: 'ap6',
    contentId: 'CAMP-002-FB-CREATIVE',
    type: 'Meta Ad',
    title: 'Facebook ad creative brief',
    body: 'Creative brief for Q1 brand awareness. Single image, 1080×1080. CTA: Learn More.',
    campaign: 'c2',
    campaignName: 'APAC Brand Awareness',
    status: 'published',
    statusUpdatedAt: '2026-02-09',
    reviewers: [
      { reviewerId: 'rev1', status: 'approved' },
      { reviewerId: 'rev4', status: 'approved' },
    ],
    comments: [],
    createdAt: '2026-02-05',
    submittedAt: '2026-02-06',
    generatedBy: 'Ad Composer',
    generatedAt: '2026-02-05',
    publishedAt: '2026-02-09',
  },
  {
    id: 'ap7',
    contentId: 'CAMP-003-SDR-SCRIPT',
    type: 'Script',
    title: 'SDR call script — SEA Demand Gen',
    body: 'Opening: "Hi {{first_name}}, this is [name] from [company]. I saw you requested the ROI report — wanted to see if you had 10 minutes to walk through the results."',
    campaign: 'c3',
    campaignName: 'SEA Demand Gen',
    status: 'in_review',
    statusUpdatedAt: '2026-02-12',
    reviewers: [{ reviewerId: 'rev4', status: 'pending' }],
    comments: [],
    createdAt: '2026-02-11',
    submittedAt: '2026-02-12',
    generatedBy: 'SDR Agent',
    generatedAt: '2026-02-11',
  },
  {
    id: 'ap8',
    contentId: 'CAMP-001-WA-TEMPLATE',
    type: 'WhatsApp',
    title: 'WhatsApp template — follow-up',
    body: 'Hi {{first_name}}, following up on our last message. Would a quick call this week work to discuss finance automation for {{company}}?',
    campaign: 'c1',
    campaignName: 'Medglobal VN CFO Q2',
    status: 'revision_requested',
    statusUpdatedAt: '2026-02-11',
    reviewers: [{ reviewerId: 'rev1', status: 'changes_requested' }],
    comments: [
      { id: 'c6', authorId: 'rev1', body: 'Add opt-out line per compliance.', timestamp: '2026-02-11T14:00:00', actionTag: 'changes_requested' },
    ],
    createdAt: '2026-02-10',
    submittedAt: '2026-02-10',
    generatedBy: 'Copywriter Agent',
    generatedAt: '2026-02-10',
  },
];

/** Days in current status (for queue display) */
export function daysInStatus(statusUpdatedAt) {
  if (!statusUpdatedAt) return 0;
  const d = new Date(statusUpdatedAt);
  const now = new Date();
  return Math.floor((now - d) / (24 * 60 * 60 * 1000));
}

/** Is approved in last 7 days */
export function isRecentlyApproved(item) {
  if (item.status !== 'approved') return false;
  return daysInStatus(item.statusUpdatedAt) <= 7;
}
