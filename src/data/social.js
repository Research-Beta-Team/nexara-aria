// ─────────────────────────────────────────────
//  Antarious — Social Media (mock data)
//  Used by Social Media page and dashboard SocialReachWidget
// ─────────────────────────────────────────────

export const CONNECTED_ACCOUNTS = [
  { id: 'li1', name: 'Medglobal', platform: 'LinkedIn', type: 'Company', status: 'connected', followers: 12400 },
  { id: 'meta1', name: 'Medglobal', platform: 'Meta', type: 'Page', status: 'connected', followers: 28500 },
  { id: 'ig1', name: '@medglobal.official', platform: 'Instagram', type: 'Business', status: 'connected', followers: 18200 },
  { id: 'wa1', name: 'Medglobal', platform: 'WhatsApp', type: 'Business', status: 'connected', followers: null },
];

export const SOCIAL_METRICS = {
  reach: { value: 78200, prev: 68100, change: 14.8, unit: 'impressions' },
  engagement: { value: 4.2, prev: 3.8, change: 10.5, unit: '%' },
  postsCount: { value: 24, prev: 22, change: 9, unit: 'posts' },
  topPostReach: { value: 12400, label: 'Top post reach' },
};

export const ENGAGEMENT_BY_DAY = [
  { day: 'Mon', reach: 9200, likes: 412, comments: 58 },
  { day: 'Tue', reach: 11200, likes: 520, comments: 72 },
  { day: 'Wed', reach: 9800, likes: 445, comments: 61 },
  { day: 'Thu', reach: 13500, likes: 680, comments: 89 },
  { day: 'Fri', reach: 11800, likes: 534, comments: 76 },
  { day: 'Sat', reach: 8200, likes: 298, comments: 41 },
  { day: 'Sun', reach: 6700, likes: 245, comments: 32 },
];

export const CHANNEL_BREAKDOWN = [
  { channel: 'LinkedIn', reach: 28400, engagement: 4.8, posts: 8 },
  { channel: 'Meta', reach: 31200, engagement: 3.6, posts: 10 },
  { channel: 'Instagram', reach: 18600, engagement: 4.5, posts: 6 },
];

export const RECENT_POSTS = [
  { id: 'p1', channel: 'LinkedIn', text: 'How we cut CPL by 22% with better audience targeting — key takeaways from Q1.', time: '2h ago', reach: 4200, likes: 186, comments: 24, status: 'published' },
  { id: 'p2', channel: 'Meta', text: 'New product drop next week. Stay tuned for early access.', time: '5h ago', reach: 8100, likes: 412, comments: 56, status: 'published' },
  { id: 'p3', channel: 'Instagram', text: 'Behind the scenes at our APAC team offsite.', time: '1d ago', reach: 6200, likes: 298, comments: 18, status: 'published' },
  { id: 'p4', channel: 'LinkedIn', text: 'We\'re hiring: Senior Demand Gen Manager. Link in comments.', time: '2d ago', reach: 3400, likes: 142, comments: 31, status: 'published' },
  { id: 'p5', channel: 'Meta', text: 'Flash poll: What\'s your biggest marketing challenge this quarter?', time: '3d ago', reach: 5200, likes: 234, comments: 89, status: 'published' },
];

export const RANGES = ['7d', '30d', '90d'];

// ── Social campaigns (each has ordered posts; editable/reorderable) ──
export const SOCIAL_CAMPAIGNS_INITIAL = [
  {
    id: 'sc1',
    name: 'Q1 Thought Leadership',
    status: 'active',
    channel: 'LinkedIn',
    posts: [
      { id: 'sp1', channel: 'LinkedIn', text: 'How we cut CPL by 22% with better audience targeting — key takeaways from Q1.', order: 0, status: 'published', scheduledAt: '2025-03-01T09:00:00', reach: 4200, likes: 186, comments: 24 },
      { id: 'sp2', channel: 'LinkedIn', text: 'We\'re hiring: Senior Demand Gen Manager. Link in comments.', order: 1, status: 'published', scheduledAt: '2025-03-03T10:00:00', reach: 3400, likes: 142, comments: 31 },
      { id: 'sp3', channel: 'LinkedIn', text: '5 lessons from scaling B2B demand gen in APAC.', order: 2, status: 'scheduled', scheduledAt: '2025-03-10T09:00:00' },
    ],
  },
  {
    id: 'sc2',
    name: 'Product Launch — Meta & Instagram',
    status: 'active',
    channel: 'Meta',
    posts: [
      { id: 'sp4', channel: 'Meta', text: 'New product drop next week. Stay tuned for early access.', order: 0, status: 'published', scheduledAt: '2025-03-02T14:00:00', reach: 8100, likes: 412, comments: 56 },
      { id: 'sp5', channel: 'Meta', text: 'Flash poll: What\'s your biggest marketing challenge this quarter?', order: 1, status: 'published', scheduledAt: '2025-03-04T11:00:00', reach: 5200, likes: 234, comments: 89 },
      { id: 'sp6', channel: 'Instagram', text: 'Behind the scenes at our APAC team offsite.', order: 2, status: 'published', scheduledAt: '2025-03-05T12:00:00', reach: 6200, likes: 298, comments: 18 },
    ],
  },
];

export function getSocialCampaignById(campaigns, id) {
  return campaigns.find((c) => c.id === id) ?? null;
}

export const AVAILABLE_PLATFORMS = [
  { id: 'LinkedIn', name: 'LinkedIn', description: 'Company page and personal profiles' },
  { id: 'Meta', name: 'Meta (Facebook)', description: 'Pages and ad accounts' },
  { id: 'Instagram', name: 'Instagram', description: 'Business accounts' },
  { id: 'WhatsApp', name: 'WhatsApp', description: 'Business chat and campaigns' },
];
