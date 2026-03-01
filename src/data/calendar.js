// ─────────────────────────────────────────────
//  Campaign Calendar — Mock Data
//  22 events across March 2026, ≥2 per event type
// ─────────────────────────────────────────────

export const TYPE_COLORS = {
  email_step:   '#3DDC84',  // mint
  ad_launch:    '#5EEAD4',  // teal
  ad_pause:     '#F5C842',  // amber
  blog_publish: '#A78BFA',  // purple
  social_post:  '#60A5FA',  // blue
  demo_booked:  '#34D399',  // green
  review:       '#F5C842',  // amber
  budget_reset: '#F87171',  // red
  client_call:  '#5EEAD4',  // teal
};

export const CALENDAR_EVENTS = [
  // ── email_step (3) ──────────────────────────
  {
    id: 'ev-001',
    date: '2026-03-03',
    time: '09:00',
    type: 'email_step',
    title: 'Sequence A — Step 1 fires (210 prospects)',
    description: 'Initial outreach deploying to 210 qualified prospects in the EU compliance segment. Subject line: "Is your team ready for EU DPP?" Personalised with company name and industry.',
    channel: 'Email',
    status: 'scheduled',
  },
  {
    id: 'ev-002',
    date: '2026-03-10',
    time: '09:00',
    type: 'email_step',
    title: 'Sequence A — Step 3 fires (84 prospects)',
    description: 'Follow-up #2 to non-openers from Step 1. New subject line variant: "Quick question about your DPP roadmap". Includes short case study snippet from Acme Corp.',
    channel: 'Email',
    status: 'scheduled',
  },
  {
    id: 'ev-003',
    date: '2026-03-24',
    time: '10:00',
    type: 'email_step',
    title: 'Sequence B — Re-engagement fires (47 prospects)',
    description: 'Win-back campaign targeting stalled prospects who engaged but went cold. Personalised case study PDF attached. Send window: 10:00–11:30 AM.',
    channel: 'Email',
    status: 'scheduled',
  },

  // ── ad_launch (3) ───────────────────────────
  {
    id: 'ev-004',
    date: '2026-03-04',
    time: '08:00',
    type: 'ad_launch',
    title: 'Meta Ad Set B goes live — CFO angle',
    description: 'New creative batch targeting CFOs and Finance Directors in DACH. Daily budget: €420. Lookalike audience seeded from 180 closed-won accounts. 3 creative variants.',
    channel: 'Meta',
    status: 'scheduled',
  },
  {
    id: 'ev-005',
    date: '2026-03-12',
    time: '08:00',
    type: 'ad_launch',
    title: 'Google Search restarts — brand keywords',
    description: 'Resuming Google Search after creative refresh. Targeting branded + 4 competitor terms. CPC target: €2.80. Quality Score audit completed — all ad groups at 8+.',
    channel: 'Google',
    status: 'scheduled',
  },
  {
    id: 'ev-006',
    date: '2026-03-23',
    time: '09:00',
    type: 'ad_launch',
    title: 'LinkedIn Sponsored Content — new creative batch',
    description: 'Three new ad creatives launching: ROI stats carousel (8 slides), single-image awareness unit, and 45-second video testimonial. Total daily budget: £380.',
    channel: 'LinkedIn',
    status: 'scheduled',
  },

  // ── ad_pause (2) ────────────────────────────
  {
    id: 'ev-007',
    date: '2026-03-09',
    time: '16:00',
    type: 'ad_pause',
    title: 'Creative fatigue pause — Feature Video ad',
    description: 'Frequency cap hit on Feature Video creative (avg. 4.2× per user). Pausing to prevent negative sentiment. Replacement static creative is queued and ready.',
    channel: 'Meta',
    status: 'scheduled',
  },
  {
    id: 'ev-008',
    date: '2026-03-20',
    time: '15:00',
    type: 'ad_pause',
    title: 'Pause underperforming Ad Set C — CTR below threshold',
    description: 'Ad Set C CTR has fallen to 0.4%, below the 0.8% campaign threshold. Pausing and reallocating €180/day to the higher-performing Ad Set B.',
    channel: 'LinkedIn',
    status: 'scheduled',
  },

  // ── blog_publish (2) ────────────────────────
  {
    id: 'ev-009',
    date: '2026-03-05',
    time: '10:00',
    type: 'blog_publish',
    title: 'Blog: EU DPP Compliance Guide publishes',
    description: '3,200-word pillar piece on EU Digital Product Passport compliance. SEO-optimised for "EU DPP software" cluster. Syndicated to newsletter (4,200 subs) + LinkedIn.',
    channel: 'Blog',
    status: 'scheduled',
  },
  {
    id: 'ev-010',
    date: '2026-03-19',
    time: '10:00',
    type: 'blog_publish',
    title: 'Blog: 2026 GTM Benchmark Report goes live',
    description: 'Original research from 340 B2B GTM leaders. Full report gated for lead capture; executive summary public. Promoted via paid social, email, and partner channels.',
    channel: 'Blog',
    status: 'scheduled',
  },

  // ── social_post (3) ─────────────────────────
  {
    id: 'ev-011',
    date: '2026-03-06',
    time: '11:00',
    type: 'social_post',
    title: 'LinkedIn post — CFO pain point angle',
    description: 'Thought leadership post: "3 budget line items your GTM stack is silently wasting." Targeting CFOs. £150 boost spend. Goal: 5,000+ impressions, 80+ comments.',
    channel: 'LinkedIn',
    status: 'scheduled',
  },
  {
    id: 'ev-012',
    date: '2026-03-13',
    time: '11:00',
    type: 'social_post',
    title: 'Twitter thread — AI in outbound sales',
    description: '12-tweet thread: "How AI agents are replacing BDR workflows in 2026." Links to benchmark report. Scheduled via Buffer. Target: 500 retweets, 50 link clicks.',
    channel: 'Twitter',
    status: 'scheduled',
  },
  {
    id: 'ev-013',
    date: '2026-03-27',
    time: '11:00',
    type: 'social_post',
    title: 'LinkedIn carousel — Acme Corp case study',
    description: '8-slide carousel: Acme Corp achieved 340% pipeline increase in 90 days using ARIA agents. Key metrics slide, testimonial quote, and CTA to book a demo.',
    channel: 'LinkedIn',
    status: 'scheduled',
  },

  // ── demo_booked (3) ─────────────────────────
  {
    id: 'ev-014',
    date: '2026-03-11',
    time: '10:00',
    type: 'demo_booked',
    title: 'Demo: Md. Karim Rahman — 10:00 AM',
    description: 'Product demo for Md. Karim Rahman, Head of Revenue at Volta Systems. Inbound via LinkedIn ad. Warm lead: watched full webinar recording and downloaded benchmark report.',
    channel: 'Zoom',
    status: 'scheduled',
  },
  {
    id: 'ev-015',
    date: '2026-03-17',
    time: '14:00',
    type: 'demo_booked',
    title: 'Demo: Sarah Chen, VP Marketing — 2:00 PM',
    description: 'Discovery + demo call. Sarah is evaluating 3 vendors. Key differentiator to emphasise: ARIA agent automation and white-label reporting capability for her team.',
    channel: 'Zoom',
    status: 'scheduled',
  },
  {
    id: 'ev-016',
    date: '2026-03-25',
    time: '11:00',
    type: 'demo_booked',
    title: 'Demo: James Okafor — 11:00 AM',
    description: 'Technical deep-dive for James Okafor (CTO, Meridian Labs). Focus areas: API integration patterns, SOC 2 compliance documentation, and enterprise SSO setup walkthrough.',
    channel: 'Zoom',
    status: 'scheduled',
  },

  // ── review (2) ──────────────────────────────
  {
    id: 'ev-017',
    date: '2026-03-16',
    time: '15:00',
    type: 'review',
    title: 'A/B test conclusion — Winner review',
    description: 'Subject line A/B test (n=1,200): "Is your GTM ready?" vs "Your Q2 pipeline starts here." Reviewing open rates, CTR, reply rates, and meeting booked rates to select winner.',
    channel: 'Email',
    status: 'scheduled',
  },
  {
    id: 'ev-018',
    date: '2026-03-30',
    time: '14:00',
    type: 'review',
    title: 'Q1 campaign performance review',
    description: 'End-of-quarter client review. Presenting: pipeline influenced ($2.1M), leads generated (847), blended CPL, ARIA agent activity log, and proposed Q2 strategy adjustments.',
    channel: 'Internal',
    status: 'scheduled',
  },

  // ── budget_reset (2) ────────────────────────
  {
    id: 'ev-019',
    date: '2026-03-01',
    time: '08:00',
    type: 'budget_reset',
    title: 'Monthly budget resets — $12,400 allocated',
    description: 'March budget reset. Allocation: Meta €4,200 / Google €2,800 / LinkedIn €3,600 / Content production €1,800. Client sign-off required before 9:00 AM.',
    channel: 'Internal',
    status: 'scheduled',
  },
  {
    id: 'ev-020',
    date: '2026-03-31',
    time: '17:00',
    type: 'budget_reset',
    title: 'April budget planning — final sign-off',
    description: 'Submit April budget proposal. Include March performance data justifying proposed 15% increase in LinkedIn spend and 10% reallocation from Meta to Google.',
    channel: 'Internal',
    status: 'scheduled',
  },

  // ── client_call (2) ─────────────────────────
  {
    id: 'ev-021',
    date: '2026-03-12',
    time: '15:00',
    type: 'client_call',
    title: 'Strategy call — Acme Corp — 3:00 PM',
    description: 'Monthly strategy call with Acme Corp marketing team. Agenda: March pipeline review, content calendar sign-off, paid media performance dashboard walkthrough, Q2 planning.',
    channel: 'Zoom',
    status: 'scheduled',
  },
  {
    id: 'ev-022',
    date: '2026-03-26',
    time: '14:00',
    type: 'client_call',
    title: 'Quarterly review — Beta Dynamics — 2:00 PM',
    description: 'Q1 business review with Beta Dynamics leadership. Presenting: KPI scorecard, ARIA agent activity breakdown, campaign ROI by channel, and proposed Q2 growth strategy.',
    channel: 'Zoom',
    status: 'scheduled',
  },
];
