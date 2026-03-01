import { WIN_LOSS_INSIGHTS } from '../../data/icp';
import useToast from '../../hooks/useToast';
import { C, F, R, S, T, btn, badge } from '../../tokens';

// ── Type metadata ──────────────────────────────
const TYPE_META = {
  win_pattern:    { label: 'Win Pattern',    color: '#3DDC84', bg: 'rgba(61,220,132,0.08)',  border: 'rgba(61,220,132,0.25)',  icon: '↑' },
  loss_pattern:   { label: 'Loss Pattern',   color: '#FF6E7A', bg: 'rgba(255,110,122,0.08)', border: 'rgba(255,110,122,0.25)', icon: '↓' },
  recommendation: { label: 'Recommendation', color: '#F5C842', bg: 'rgba(245,200,66,0.08)',  border: 'rgba(245,200,66,0.25)',  icon: '→' },
};

// ── Confidence mini-ring (SVG) ─────────────────
function ConfidenceRing({ pct, color }) {
  const r = 14;
  const circ = 2 * Math.PI * r; // 87.96
  const offset = circ * (1 - pct / 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <svg width="36" height="36" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
        <circle
          cx="18" cy="18" r={r}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 18 18)"
        />
        <text
          x="18" y="18"
          textAnchor="middle" dominantBaseline="central"
          style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', fontWeight: 700, fill: color }}
        >
          {pct}
        </text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, lineHeight: 1 }}>confidence</span>
      </div>
    </div>
  );
}

// ── Insight card ───────────────────────────────
function InsightCard({ item }) {
  const toast = useToast();
  const meta  = TYPE_META[item.type] ?? TYPE_META.recommendation;

  const actionLabel = item.type === 'win_pattern'
    ? 'Apply to ICP'
    : item.type === 'loss_pattern'
    ? 'Add dealbreaker'
    : 'Review data';

  const handleAction = () => {
    if (item.type === 'win_pattern')
      toast.success(`Pattern applied: "${item.insight.slice(0, 40)}…"`);
    else if (item.type === 'loss_pattern')
      toast.warning(`Dealbreaker added to ICP v3.2`);
    else
      toast.info(`Opening data source for review…`);
  };

  return (
    <div style={{
      backgroundColor: C.surface,
      border:          `1px solid ${C.border}`,
      borderRadius:    R.card,
      padding:         S[5],
      display:         'flex',
      flexDirection:   'column',
      gap:             S[3],
      transition:      T.base,
      position:        'relative',
      overflow:        'hidden',
    }}>
      {/* Top accent line */}
      <div style={{
        position:        'absolute',
        top:             0, left: 0, right: 0,
        height:          '2px',
        backgroundColor: meta.color,
      }} />

      {/* Header: type badge + confidence */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          ...badge.base,
          backgroundColor: meta.bg,
          color:           meta.color,
          border:          `1px solid ${meta.border}`,
          gap:             '5px',
        }}>
          <span style={{ fontSize: '11px' }}>{meta.icon}</span>
          {meta.label}
        </span>
        <ConfidenceRing pct={item.confidence} color={meta.color} />
      </div>

      {/* Insight text */}
      <p style={{
        fontFamily:  F.body,
        fontSize:    '13px',
        fontWeight:  600,
        color:       C.textPrimary,
        margin:      0,
        lineHeight:  '1.6',
      }}>
        {item.insight}
      </p>

      {/* Footer: based on + action */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
        <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>
          {item.basedOn > 0
            ? `Based on ${item.basedOn} closed deals`
            : 'ARIA recommendation'}
        </span>
        <button
          style={{
            ...btn.ghost,
            fontSize:        '12px',
            color:           meta.color,
            backgroundColor: meta.bg,
            border:          `1px solid ${meta.border}`,
            borderRadius:    R.pill,
            padding:         `3px ${S[3]}`,
            height:          'auto',
          }}
          onClick={handleAction}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────
export default function WinLossInsights() {
  const toast = useToast();

  const wins    = WIN_LOSS_INSIGHTS.filter((i) => i.type === 'win_pattern');
  const losses  = WIN_LOSS_INSIGHTS.filter((i) => i.type === 'loss_pattern');
  const recs    = WIN_LOSS_INSIGHTS.filter((i) => i.type === 'recommendation');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[5] }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary }}>
            Win/Loss Pattern Analysis
          </span>
          <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>
            ARIA extracted these insights from 12 closed-won and 8 recently lost deals.
          </span>
        </div>
        <button
          style={{ ...btn.secondary, fontSize: '12px' }}
          onClick={() => toast.info('ARIA is analyzing the last 30 days of deal activity…')}
        >
          Refresh insights
        </button>
      </div>

      {/* Stats summary */}
      <div style={{ display: 'flex', gap: S[3] }}>
        {[
          { label: 'Win patterns',    count: wins.length,   color: '#3DDC84' },
          { label: 'Loss patterns',   count: losses.length, color: '#FF6E7A' },
          { label: 'Recommendations', count: recs.length,   color: '#F5C842' },
        ].map((s) => (
          <div key={s.label} style={{
            flex:            1,
            padding:         `${S[3]} ${S[4]}`,
            backgroundColor: C.surface,
            border:          `1px solid ${C.border}`,
            borderRadius:    R.card,
            display:         'flex',
            flexDirection:   'column',
            gap:             '3px',
          }}>
            <span style={{ fontFamily: F.mono, fontSize: '22px', fontWeight: 700, color: s.color, lineHeight: 1 }}>
              {s.count}
            </span>
            <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Cards grid */}
      <div style={{
        display:               'grid',
        gridTemplateColumns:   '1fr 1fr',
        gap:                   S[4],
      }}>
        {WIN_LOSS_INSIGHTS.map((item) => (
          <InsightCard key={item.id} item={item} />
        ))}
      </div>

      {/* Apply all wins CTA */}
      <div style={{
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'space-between',
        padding:         `${S[3]} ${S[5]}`,
        backgroundColor: 'rgba(61,220,132,0.06)',
        border:          `1px solid rgba(61,220,132,0.2)`,
        borderRadius:    R.card,
      }}>
        <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
          Apply all {wins.length} win patterns to your ICP definition at once?
        </span>
        <button
          style={{ ...btn.primary, fontSize: '13px' }}
          onClick={() => toast.success(`${wins.length} win patterns applied — ICP updated to v3.3`)}
        >
          Apply all win patterns
        </button>
      </div>
    </div>
  );
}
