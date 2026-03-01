// ─────────────────────────────────────────────
//  Campaign Plan — Gantt Mock Data
//  16 tasks · 4 phases · Feb 1 → Apr 1 (60 days)
//  Done:8  In-progress:4  Pending:4  = 50%
// ─────────────────────────────────────────────

export const CAMPAIGN_PLAN = {
  title:     'CFO Vietnam Q1 — Demo Generation',
  start:     '2026-02-01',
  end:       '2026-04-01',
  totalDays: 60,

  phases: [
    // ── Phase 1: Foundation ─────────────────
    {
      id:        'phase-1',
      name:      'Foundation',
      color:     '#5EEAD4',   // teal
      dateRange: 'Feb 1–14',
      startDay:  0,
      endDay:    14,
      tasks: [
        {
          id:           't1',
          name:         'ICP Research',
          owner:        'AR',
          start:        0,
          duration:     5,
          status:       'done',
          dependencies: [],
        },
        {
          id:           't2',
          name:         'Strategy Brief',
          owner:        'MK',
          start:        4,
          duration:     7,
          status:       'done',
          dependencies: ['t1'],
        },
        {
          id:           't3',
          name:         'Brand Voice Extract',
          owner:        'SC',
          start:        6,
          duration:     5,
          status:       'done',
          dependencies: ['t2'],
        },
        {
          id:           't4',
          name:         'Competitor Intel',
          owner:        'AR',
          start:        8,
          duration:     6,
          status:       'done',
          dependencies: ['t1'],
        },
      ],
    },

    // ── Phase 2: Content Build ──────────────
    {
      id:        'phase-2',
      name:      'Content Build',
      color:     '#3DDC84',   // mint
      dateRange: 'Feb 14–28',
      startDay:  14,
      endDay:    28,
      tasks: [
        {
          id:           't5',
          name:         'Email Sequences A+B',
          owner:        'MK',
          start:        14,
          duration:     10,
          status:       'done',
          dependencies: ['t2', 't3'],
        },
        {
          id:           't6',
          name:         'Meta Ad Creative',
          owner:        'SC',
          start:        14,
          duration:     9,
          status:       'done',
          dependencies: ['t3'],
        },
        {
          id:           't7',
          name:         'Landing Page Copy',
          owner:        'AR',
          start:        17,
          duration:     7,
          status:       'done',
          dependencies: ['t2'],
        },
        {
          id:           't8',
          name:         'LinkedIn Ad Copy',
          owner:        'SC',
          start:        22,
          duration:     6,
          status:       'done',
          dependencies: ['t3'],
        },
      ],
    },

    // ── Phase 3: Launch ─────────────────────
    {
      id:        'phase-3',
      name:      'Launch',
      color:     '#F5C842',   // amber
      dateRange: 'Feb 28–Mar 7',
      startDay:  27,
      endDay:    35,
      tasks: [
        {
          id:           't9',
          name:         'Human Approval Gate',
          owner:        'MK',
          start:        27,
          duration:     2,
          status:       'in_progress',
          dependencies: ['t5', 't6', 't7'],
        },
        {
          id:           't10',
          name:         'Meta Campaigns Live',
          owner:        'SC',
          start:        29,
          duration:     6,
          status:       'in_progress',
          dependencies: ['t9'],
        },
        {
          id:           't11',
          name:         'Sequence Enrollment',
          owner:        'MK',
          start:        29,
          duration:     5,
          status:       'in_progress',
          dependencies: ['t9'],
        },
        {
          id:           't12',
          name:         'SDR Outreach Active',
          owner:        'AR',
          start:        32,
          duration:     3,
          status:       'in_progress',
          dependencies: ['t11'],
        },
      ],
    },

    // ── Phase 4: Optimize ───────────────────
    {
      id:        'phase-4',
      name:      'Optimize',
      color:     '#A78BFA',   // purple
      dateRange: 'Mar 7–Apr 1',
      startDay:  35,
      endDay:    60,
      tasks: [
        {
          id:           't13',
          name:         'A/B Test Review',
          owner:        'MK',
          start:        38,
          duration:     5,
          status:       'pending',
          dependencies: ['t11'],
        },
        {
          id:           't14',
          name:         'Mid-Campaign Review',
          owner:        'AR',
          start:        43,
          duration:     4,
          status:       'pending',
          dependencies: ['t13'],
        },
        {
          id:           't15',
          name:         'SEO Blog Posts 2+3',
          owner:        'LN',
          start:        35,
          duration:     14,
          status:       'pending',
          dependencies: ['t5'],
        },
        {
          id:           't16',
          name:         'Final Push Optimization',
          owner:        'SC',
          start:        50,
          duration:     10,
          status:       'pending',
          dependencies: ['t14'],
        },
      ],
    },
  ],
};
