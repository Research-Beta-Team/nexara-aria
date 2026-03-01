import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer,
} from 'recharts';
import { SCORE_DISTRIBUTION, SCORE_STATS } from '../../data/icp';
import useToast from '../../hooks/useToast';
import { C, F, R, S, T, btn, badge } from '../../tokens';

// Hex values for recharts (CSS vars don't resolve in SVG in all envs)
const COLOR = {
  mint:  '#3DDC84',
  teal:  '#5EEAD4',
  amber: '#F5C842',
  red:   '#FF6E7A',
  muted: '#3A5242',
};

const BUCKETS = [
  { label: '0–9',   min: 0,  max: 9   },
  { label: '10–19', min: 10, max: 19  },
  { label: '20–29', min: 20, max: 29  },
  { label: '30–39', min: 30, max: 39  },
  { label: '40–49', min: 40, max: 49  },
  { label: '50–59', min: 50, max: 59  },
  { label: '60–69', min: 60, max: 69  },
  { label: '70–79', min: 70, max: 79  },
  { label: '80–89', min: 80, max: 89  },
  { label: '90–100',min: 90, max: 100 },
];

function bucketColor(min) {
  if (min >= 85) return COLOR.mint;
  if (min >= 70) return COLOR.teal;
  if (min >= 50) return COLOR.amber;
  return COLOR.red;
}

// ── Custom Tooltip ─────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const count = payload[0].value;
  return (
    <div style={{
      backgroundColor: C.surface2,
      border:          `1px solid ${C.border}`,
      borderRadius:    R.card,
      padding:         `${S[2]} ${S[3]}`,
      boxShadow:       '0 8px 24px rgba(0,0,0,0.4)',
    }}>
      <div style={{ fontFamily: F.mono, fontSize: '12px', fontWeight: 700, color: C.textPrimary }}>
        Score {label}
      </div>
      <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, marginTop: '2px' }}>
        {count} prospects in this range
      </div>
    </div>
  );
}

// ── Status badge ───────────────────────────────
function StatusBadge({ status }) {
  const meta = {
    not_contacted: { label: 'Not contacted', color: '#6B9478',  bg: 'rgba(107,148,120,0.1)',  border: 'rgba(107,148,120,0.2)' },
    in_sequence:   { label: 'In sequence',   color: '#5EEAD4',  bg: 'rgba(94,234,212,0.1)',  border: 'rgba(94,234,212,0.25)' },
    closed_won:    { label: 'Closed won',    color: '#3DDC84',  bg: 'rgba(61,220,132,0.12)', border: 'rgba(61,220,132,0.3)'  },
  };
  const m = meta[status] ?? meta.not_contacted;
  return (
    <span style={{
      ...badge.base,
      backgroundColor: m.bg, color: m.color,
      border: `1px solid ${m.border}`,
    }}>
      {m.label}
    </span>
  );
}

// ── Main ───────────────────────────────────────
export default function ProspectScoreDistribution() {
  const toast = useToast();

  const buckets = useMemo(() =>
    BUCKETS.map((b) => ({
      ...b,
      count: SCORE_DISTRIBUTION.filter((p) => p.score >= b.min && p.score <= b.max).length,
    })),
  []);

  const top10 = useMemo(() =>
    SCORE_DISTRIBUTION
      .filter((p) => p.status === 'not_contacted')
      .sort((a, b) => b.score - a.score)
      .slice(0, 10),
  []);

  const statCards = [
    { label: 'High Fit  >85',   value: SCORE_STATS.highFit, color: COLOR.mint,  sublabel: 'prospects' },
    { label: 'Good Fit  70–85', value: SCORE_STATS.goodFit, color: COLOR.teal,  sublabel: 'prospects' },
    { label: 'Poor Fit  <70',   value: SCORE_STATS.poorFit, color: COLOR.muted, sublabel: 'prospects' },
    { label: 'Total pipeline',  value: SCORE_STATS.total,   color: C.textPrimary, sublabel: 'all prospects' },
  ];

  const scoreColor = (score) =>
    score >= 85 ? COLOR.mint : score >= 70 ? COLOR.teal : score >= 50 ? COLOR.amber : COLOR.red;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[5] }}>

      {/* ── Stats row ────────────────────────────── */}
      <div style={{ display: 'flex', gap: S[3] }}>
        {statCards.map((s) => (
          <div
            key={s.label}
            style={{
              flex:            1,
              backgroundColor: C.surface,
              border:          `1px solid ${C.border}`,
              borderRadius:    R.card,
              padding:         `${S[3]} ${S[4]}`,
              display:         'flex',
              flexDirection:   'column',
              gap:             '4px',
            }}
          >
            <span style={{ fontFamily: F.mono, fontSize: '26px', fontWeight: 700, color: s.color, lineHeight: 1 }}>
              {s.value}
            </span>
            <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* ── Histogram ────────────────────────────── */}
      <div style={{
        backgroundColor: C.surface,
        border:          `1px solid ${C.border}`,
        borderRadius:    '12px',
        padding:         S[5],
      }}>
        <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 700, color: C.textPrimary, marginBottom: S[4] }}>
          Score Distribution — {SCORE_DISTRIBUTION.length} prospects sampled
        </div>

        {/* Color legend */}
        <div style={{ display: 'flex', gap: S[4], marginBottom: S[4] }}>
          {[
            { label: 'Poor fit (<50)',    color: COLOR.red   },
            { label: 'Borderline (50–69)',color: COLOR.amber },
            { label: 'Good fit (70–84)', color: COLOR.teal  },
            { label: 'High fit (85+)',   color: COLOR.mint  },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: item.color }} />
              <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary }}>{item.label}</span>
            </div>
          ))}
        </div>

        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={buckets} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="label"
              tick={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fill: '#6B9478' }}
              axisLine={{ stroke: '#1C2E22' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fill: '#6B9478' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(61,220,132,0.05)' }} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {buckets.map((b) => (
                <Cell key={b.label} fill={bucketColor(b.min)} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Top 10 uncontacted table ──────────────── */}
      <div style={{
        backgroundColor: C.surface,
        border:          `1px solid ${C.border}`,
        borderRadius:    '12px',
        overflow:        'hidden',
      }}>
        <div style={{
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'space-between',
          padding:         `${S[3]} ${S[5]}`,
          borderBottom:    `1px solid ${C.border}`,
          backgroundColor: C.surface,
        }}>
          <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>
            Top 10 Uncontacted Prospects
          </span>
          <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>
            Highest ICP score · not yet in a sequence
          </span>
        </div>

        {/* Table header */}
        <div style={{
          display:      'grid',
          gridTemplateColumns: '32px 1fr 80px 120px 120px',
          gap:          S[3],
          padding:      `${S[2]} ${S[5]}`,
          borderBottom: `1px solid ${C.border}`,
          backgroundColor: C.surface2,
        }}>
          {['#','Company','Score','Status',''].map((h) => (
            <span key={h} style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {h}
            </span>
          ))}
        </div>

        {top10.map((p, idx) => (
          <div
            key={p.id}
            style={{
              display:         'grid',
              gridTemplateColumns: '32px 1fr 80px 120px 120px',
              gap:             S[3],
              padding:         `${S[3]} ${S[5]}`,
              borderBottom:    idx < top10.length - 1 ? `1px solid ${C.border}` : 'none',
              alignItems:      'center',
              transition:      T.color,
            }}
          >
            <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>{idx + 1}</span>
            <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary, fontWeight: 500 }}>{p.prospect}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 700, color: scoreColor(p.score) }}>{p.score}</span>
              <div style={{ flex: 1, height: '3px', backgroundColor: C.surface3, borderRadius: R.pill, overflow: 'hidden', minWidth: '24px' }}>
                <div style={{ width: `${p.score}%`, height: '100%', backgroundColor: scoreColor(p.score) }} />
              </div>
            </div>
            <StatusBadge status={p.status} />
            <button
              style={{ ...btn.ghost, fontSize: '11px', padding: `${S[1]} ${S[2]}`, color: C.primary, justifyContent: 'flex-start' }}
              onClick={() => toast.success(`${p.prospect} added to outreach sequence`)}
            >
              Add to sequence →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
