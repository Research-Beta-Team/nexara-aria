// ─────────────────────────────────────────────
//  NEXARA — Campaign Phases (templates + mock)
// ─────────────────────────────────────────────

const CHANNEL_IDS = ['email', 'linkedin', 'meta_ads', 'google_ads', 'whatsapp'];
const CHANNEL_LABELS = {
  email: 'Email',
  linkedin: 'LinkedIn',
  meta_ads: 'Meta Ads',
  google_ads: 'Google Ads',
  whatsapp: 'WhatsApp',
};

function makeChannel(id, active = false, budgetPerMonth = 0, options = {}) {
  return {
    id,
    name: CHANNEL_LABELS[id] || id,
    active,
    budgetPerMonth,
    emailSequence: options.emailSequence ?? 'all',
    linkedinCadence: options.linkedinCadence ?? '2x/week',
    metaAdSets: options.metaAdSets ?? 'all',
    whatsappFrequency: options.whatsappFrequency ?? 'weekly',
  };
}

function makePhase({ id, name, startDate, endDate, goal = '', channels = [], contentSet = 'all', contentIds = [] }) {
  return {
    id: id || `phase-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    startDate,
    endDate,
    goal,
    channels: channels.length ? channels : CHANNEL_IDS.map((cid) => makeChannel(cid)),
    contentSet,
    contentIds: contentIds || [],
  };
}

/** Days between two YYYY-MM-DD strings */
export function daysBetween(startStr, endStr) {
  if (!startStr || !endStr) return 0;
  const a = new Date(startStr);
  const b = new Date(endStr);
  return Math.round((b - a) / 86400000);
}

/** ARIA-suggested phases (e.g. when content was mainly generated with ARIA Intelligence) */
export function getAriaSuggestedPhases(campaignStartStr, campaignEndStr) {
  const start = campaignStartStr || new Date().toISOString().slice(0, 10);
  const end = campaignEndStr || new Date(Date.now() + 45 * 86400000).toISOString().slice(0, 10);
  const totalDays = Math.max(1, daysBetween(start, end));
  const addDays = (dateStr, n) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  };
  const d1 = Math.floor(totalDays * 0.25);
  const d2 = Math.floor(totalDays * 0.55);
  return [
    makePhase({
      id: `aria-phase-1-${Date.now()}`,
      name: 'Awareness (ARIA content)',
      startDate: start,
      endDate: addDays(start, d1 - 1),
      goal: 'Deploy ARIA-generated awareness content',
      channels: [
        makeChannel('email', true, 2500),
        makeChannel('linkedin', true, 5000),
        makeChannel('meta_ads', true, 4000),
        makeChannel('google_ads', false, 0),
        makeChannel('whatsapp', false, 0),
      ],
    }),
    makePhase({
      id: `aria-phase-2-${Date.now()}`,
      name: 'Nurture (ARIA content)',
      startDate: addDays(start, d1),
      endDate: addDays(start, d2 - 1),
      goal: 'Nurture with ARIA-generated sequences',
      channels: [
        makeChannel('email', true, 3500),
        makeChannel('linkedin', true, 6000),
        makeChannel('meta_ads', true, 6000),
        makeChannel('google_ads', true, 2000),
        makeChannel('whatsapp', false, 0),
      ],
    }),
    makePhase({
      id: `aria-phase-3-${Date.now()}`,
      name: 'Convert (ARIA content)',
      startDate: addDays(start, d2),
      endDate: end,
      goal: 'Convert with ARIA-optimized CTAs',
      channels: CHANNEL_IDS.map((c) => makeChannel(c, true, c === 'whatsapp' ? 400 : 4500)),
    }),
  ];
}

/** Default 3 phases: Warmup / Launch / Peak over campaign span */
export function getDefaultPhases(campaignStartStr, campaignEndStr) {
  const start = campaignStartStr || new Date().toISOString().slice(0, 10);
  const end = campaignEndStr || new Date(Date.now() + 45 * 86400000).toISOString().slice(0, 10);
  const totalDays = Math.max(1, daysBetween(start, end));
  const d1 = Math.floor(totalDays * 0.33);
  const d2 = Math.floor(totalDays * 0.66);
  const addDays = (dateStr, n) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  };
  return [
    makePhase({
      id: 'phase-1',
      name: 'Warmup',
      startDate: start,
      endDate: addDays(start, d1 - 1),
      goal: 'Build awareness',
      channels: [
        makeChannel('email', true, 2000),
        makeChannel('linkedin', true, 4000),
        makeChannel('meta_ads', false, 0),
        makeChannel('google_ads', false, 0),
        makeChannel('whatsapp', false, 0),
      ],
    }),
    makePhase({
      id: 'phase-2',
      name: 'Launch',
      startDate: addDays(start, d1),
      endDate: addDays(start, d2 - 1),
      goal: 'Generate leads',
      channels: [
        makeChannel('email', true, 3000),
        makeChannel('linkedin', true, 6000),
        makeChannel('meta_ads', true, 5000),
        makeChannel('google_ads', false, 0),
        makeChannel('whatsapp', false, 0),
      ],
    }),
    makePhase({
      id: 'phase-3',
      name: 'Peak',
      startDate: addDays(start, d2),
      endDate: end,
      goal: 'Convert demos',
      channels: [
        makeChannel('email', true, 2500),
        makeChannel('linkedin', true, 5000),
        makeChannel('meta_ads', true, 8000),
        makeChannel('google_ads', true, 3000),
        makeChannel('whatsapp', true, 500),
      ],
    }),
  ];
}

// ── Phase templates (for selector) ─────────────
export const PHASE_TEMPLATES = {
  ramadan_campaign: {
    id: 'ramadan_campaign',
    label: 'Ramadan Campaign',
    phases: [
      makePhase({
        id: 'r1',
        name: 'Pre-Ramadan Warmup',
        startDate: '',
        endDate: '',
        goal: 'Build awareness',
        channels: [makeChannel('email', true, 2000), makeChannel('linkedin', true, 3000), makeChannel('meta_ads', false, 0), makeChannel('google_ads', false, 0), makeChannel('whatsapp', false, 0)],
      }),
      makePhase({
        id: 'r2',
        name: 'Ramadan Peak',
        startDate: '',
        endDate: '',
        goal: 'Generate leads',
        channels: [makeChannel('email', true, 4000), makeChannel('linkedin', true, 6000), makeChannel('meta_ads', true, 8000), makeChannel('google_ads', true, 2000), makeChannel('whatsapp', true, 500)],
      }),
      makePhase({
        id: 'r3',
        name: 'Post-Ramadan',
        startDate: '',
        endDate: '',
        goal: 'Nurture',
        channels: [makeChannel('email', true, 1500), makeChannel('linkedin', true, 2000), makeChannel('meta_ads', true, 2000), makeChannel('google_ads', false, 0), makeChannel('whatsapp', false, 0)],
      }),
    ],
    defaultDurations: [14, 30, 14],
  },
  product_launch: {
    id: 'product_launch',
    label: 'Product Launch',
    phases: [
      makePhase({ id: 'pl1', name: 'Pre-launch Hype', startDate: '', endDate: '', goal: 'Build awareness', channels: CHANNEL_IDS.map((c) => makeChannel(c, ['email', 'linkedin'].includes(c), ['email', 'linkedin'].includes(c) ? 3000 : 0)) }),
      makePhase({ id: 'pl2', name: 'Launch Week', startDate: '', endDate: '', goal: 'Generate leads', channels: CHANNEL_IDS.map((c) => makeChannel(c, true, 5000)) }),
      makePhase({ id: 'pl3', name: 'Post-Launch Nurture', startDate: '', endDate: '', goal: 'Nurture', channels: CHANNEL_IDS.map((c) => makeChannel(c, ['email', 'linkedin', 'meta_ads'].includes(c), 2000)) }),
    ],
    defaultDurations: [21, 7, 30],
  },
  abm_push: {
    id: 'abm_push',
    label: 'ABM Push',
    phases: [
      makePhase({ id: 'abm1', name: 'Research & Personalize', startDate: '', endDate: '', goal: 'Build awareness', channels: [makeChannel('email', true, 1500), makeChannel('linkedin', true, 5000), makeChannel('meta_ads', false, 0), makeChannel('google_ads', false, 0), makeChannel('whatsapp', false, 0)] }),
      makePhase({ id: 'abm2', name: 'Multi-touch ABM', startDate: '', endDate: '', goal: 'Convert demos', channels: CHANNEL_IDS.map((c) => makeChannel(c, true, c === 'whatsapp' ? 300 : 4000)) }),
    ],
    defaultDurations: [21, 45],
  },
  always_on: {
    id: 'always_on',
    label: 'Always-On',
    phases: [
      makePhase({ id: 'ao1', name: 'Continuous', startDate: '', endDate: null, goal: 'Generate leads', channels: CHANNEL_IDS.map((c) => makeChannel(c, true, 3000)) }),
    ],
    defaultDurations: [],
  },
};

/** Apply template to phases with start date and total span (fills end dates from durations) */
export function applyTemplate(templateId, campaignStartStr, totalDays = 60) {
  const t = PHASE_TEMPLATES[templateId];
  if (!t) return null;
  const start = campaignStartStr || new Date().toISOString().slice(0, 10);
  const durations = t.defaultDurations && t.defaultDurations.length ? t.defaultDurations : t.phases.map(() => Math.floor(totalDays / t.phases.length));
  let cursor = new Date(start);
  return t.phases.map((p, i) => {
    const phaseStart = cursor.toISOString().slice(0, 10);
    let phaseEnd = null;
    if (durations[i] != null && durations[i] > 0) {
      cursor.setDate(cursor.getDate() + durations[i]);
      phaseEnd = cursor.toISOString().slice(0, 10);
    }
    return makePhase({
      ...p,
      id: `${p.id}-${Date.now()}`,
      startDate: phaseStart,
      endDate: phaseEnd,
    });
  });
}

// ── Mock active phases (Campaign Detail) ───────
export const MOCK_ACTIVE_PHASES = [
  makePhase({
    id: 'mock-1',
    name: 'Warmup',
    startDate: '2026-02-01',
    endDate: '2026-02-14',
    goal: 'Build awareness',
    status: 'completed',
    channels: [makeChannel('email', true, 2000), makeChannel('linkedin', true, 4000), makeChannel('meta_ads', false, 0), makeChannel('google_ads', false, 0), makeChannel('whatsapp', false, 0)],
  }),
  makePhase({
    id: 'mock-2',
    name: 'Launch',
    startDate: '2026-02-15',
    endDate: '2026-02-28',
    goal: 'Generate leads',
    status: 'active',
    channels: [makeChannel('email', true, 3000), makeChannel('linkedin', true, 6000), makeChannel('meta_ads', true, 5000), makeChannel('google_ads', false, 0), makeChannel('whatsapp', false, 0)],
  }),
  makePhase({
    id: 'mock-3',
    name: 'Peak',
    startDate: '2026-03-01',
    endDate: '2026-03-31',
    goal: 'Convert demos',
    status: 'upcoming',
    channels: [makeChannel('email', true, 2500), makeChannel('linkedin', true, 5000), makeChannel('meta_ads', true, 8000), makeChannel('google_ads', true, 3000), makeChannel('whatsapp', true, 500)],
  }),
];

export { CHANNEL_IDS, CHANNEL_LABELS, makeChannel, makePhase };
