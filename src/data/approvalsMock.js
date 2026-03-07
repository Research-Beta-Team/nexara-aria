/**
 * Mock data for Content Approval Workflow (Session 2).
 * Stages: draft → legal → brand → cmo → published.
 * Types: email, ad, social, landing_page.
 */

const now = new Date();
const hoursAgo = (h) => new Date(now.getTime() - h * 60 * 60 * 1000).toISOString();

export const APPROVAL_STAGES = [
  { id: 'draft', label: 'Draft', color: 'muted' },
  { id: 'legal', label: 'Legal Review', color: 'amber' },
  { id: 'brand', label: 'Brand Review', color: 'teal' },
  { id: 'cmo', label: 'CMO', color: 'violet' },
  { id: 'published', label: 'Published', color: 'mint' },
];

export const CONTENT_TYPES = {
  email: { label: 'Email', icon: 'mail' },
  ad: { label: 'Ad', icon: 'megaphone' },
  social: { label: 'Social', icon: 'calendar' },
  landing_page: { label: 'Landing Page', icon: 'file' },
};

export const approvalsMock = [
  {
    id: 'ap1',
    title: 'LinkedIn Ad — CFO Persona Variant 2',
    campaignName: 'Q2 Enterprise MQL',
    contentType: 'ad',
    stage: 'legal',
    rejected: false,
    createdAt: hoursAgo(52),
    createdBy: 'Freya',
    complianceScore: 78,
    contentPreview: { subject: null, headline: 'Cut revenue ops from 34h to 4h/week', body: 'See how B2B teams use Antarious to hit pipeline targets without adding headcount.', cta: 'Book a demo' },
    comments: [{ id: 'c1', author: 'Sarah Chen', role: 'Legal Reviewer', text: 'Claims need sourcing.', createdAt: hoursAgo(2) }],
    history: [{ action: 'Submitted to Legal', by: 'Freya', at: hoursAgo(52) }],
  },
  {
    id: 'ap2',
    title: 'Email sequence step 2 — Re-engagement',
    campaignName: 'Q2 Enterprise MQL',
    contentType: 'email',
    stage: 'legal',
    rejected: false,
    createdAt: hoursAgo(72),
    createdBy: 'Freya',
    complianceScore: 92,
    contentPreview: { subject: 'Quick question about your pipeline', body: 'Hi [First Name], we noticed your team is scaling...', headline: null, cta: null },
    comments: [],
    history: [{ action: 'Submitted to Legal', by: 'Freya', at: hoursAgo(72) }],
  },
  {
    id: 'ap3',
    title: 'Landing page hero — CFO angle',
    campaignName: 'Q2 Enterprise MQL',
    contentType: 'landing_page',
    stage: 'legal',
    rejected: false,
    createdAt: hoursAgo(24),
    createdBy: 'Freya',
    complianceScore: 85,
    contentPreview: { subject: null, headline: 'Pipeline without the overhead', body: 'ROI-focused GTM for finance leaders.', cta: 'See the numbers' },
    comments: [],
    history: [{ action: 'Submitted to Legal', by: 'Freya', at: hoursAgo(24) }],
  },
  {
    id: 'ap4',
    title: 'LinkedIn Ad — Pain-led headline A',
    campaignName: 'APAC Brand',
    contentType: 'ad',
    stage: 'brand',
    rejected: false,
    createdAt: hoursAgo(96),
    createdBy: 'Freya',
    complianceScore: 88,
    contentPreview: { subject: null, headline: '34 hours a week on manual marketing?', body: 'Antarious automates what your team shouldn\'t do.', cta: 'Learn more' },
    comments: [{ id: 'c2', author: 'Emma Chen', role: 'Legal Reviewer', text: 'Approved from Legal.', createdAt: hoursAgo(48) }],
    history: [{ action: 'Approved at Legal', by: 'Emma Chen', at: hoursAgo(48) }, { action: 'Submitted to Legal', by: 'Freya', at: hoursAgo(96) }],
  },
  {
    id: 'ap5',
    title: 'Social post — Product launch tease',
    campaignName: 'APAC Brand',
    contentType: 'social',
    stage: 'brand',
    rejected: false,
    createdAt: hoursAgo(120),
    createdBy: 'Freya',
    complianceScore: 91,
    contentPreview: { subject: null, headline: null, body: 'Something big is coming for GTM teams. Next week we\'re announcing a new way to run pipeline.', cta: 'Follow for updates' },
    comments: [],
    history: [{ action: 'Approved at Legal', by: 'Sarah Chen', at: hoursAgo(72) }, { action: 'Submitted to Legal', by: 'Freya', at: hoursAgo(120) }],
  },
  {
    id: 'ap6',
    title: 'Email — CMO invite to webinar',
    campaignName: 'Q2 Enterprise MQL',
    contentType: 'email',
    stage: 'cmo',
    rejected: false,
    createdAt: hoursAgo(168),
    createdBy: 'Freya',
    complianceScore: 94,
    contentPreview: { subject: 'You\'re invited: Pipeline mastery roundtable', body: 'Join 50 CMOs on March 15 to discuss...', headline: null, cta: null },
    comments: [
      { id: 'c3', author: 'Emma Chen', role: 'Legal Reviewer', text: 'Approved.', createdAt: hoursAgo(96) },
      { id: 'c4', author: 'Priya Patel', role: 'Brand Manager', text: 'Brand tone looks good.', createdAt: hoursAgo(24) },
    ],
    history: [
      { action: 'Approved at Brand', by: 'Priya Patel', at: hoursAgo(24) },
      { action: 'Approved at Legal', by: 'Emma Chen', at: hoursAgo(96) },
      { action: 'Submitted to Legal', by: 'Freya', at: hoursAgo(168) },
    ],
  },
  {
    id: 'ap7',
    title: 'LinkedIn Ad — Social proof',
    campaignName: 'Q2 Enterprise MQL',
    contentType: 'ad',
    stage: 'published',
    rejected: false,
    createdAt: hoursAgo(240),
    createdBy: 'Freya',
    complianceScore: 96,
    contentPreview: { subject: null, headline: 'Join 200+ teams running pipeline on Antarious', body: 'See why CMOs are switching.', cta: 'Get a demo' },
    comments: [],
    history: [
      { action: 'Published', by: 'Freya', at: hoursAgo(48) },
      { action: 'Approved at CMO', by: 'You', at: hoursAgo(72) },
      { action: 'Approved at Brand', by: 'Priya Patel', at: hoursAgo(120) },
      { action: 'Approved at Legal', by: 'Sarah Chen', at: hoursAgo(168) },
      { action: 'Submitted to Legal', by: 'Freya', at: hoursAgo(240) },
    ],
  },
  {
    id: 'ap8',
    title: 'Landing page — Pricing',
    campaignName: 'APAC Brand',
    contentType: 'landing_page',
    stage: 'published',
    rejected: false,
    createdAt: hoursAgo(336),
    createdBy: 'Freya',
    complianceScore: 89,
    contentPreview: { subject: null, headline: 'Simple pricing for growth teams', body: 'Plans that scale with your pipeline.', cta: 'Start free trial' },
    comments: [],
    history: [
      { action: 'Published', by: 'Freya', at: hoursAgo(96) },
      { action: 'Approved at CMO', by: 'You', at: hoursAgo(120) },
      { action: 'Approved at Brand', by: 'Emma Chen', at: hoursAgo(168) },
      { action: 'Approved at Legal', by: 'Sarah Chen', at: hoursAgo(200) },
      { action: 'Submitted to Legal', by: 'Freya', at: hoursAgo(336) },
    ],
  },
];

/** Urgent threshold: >48h in queue (createdAt older than 48h and stage not published) */
export function isUrgent(item) {
  if (!item?.createdAt || item.stage === 'published') return false;
  const created = new Date(item.createdAt).getTime();
  return Date.now() - created > 48 * 60 * 60 * 1000;
}
