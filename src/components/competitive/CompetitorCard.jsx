import { C, F, R, S, btn, badge } from '../../tokens';

// ── Icons ─────────────────────────────────────
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M11.5 3.5L5 10L2.5 7.5" stroke={C.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 3l8 8M11 3l-8 8" stroke={C.red} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export default function CompetitorCard({ competitor, onViewBattleCard, onViewAds }) {
  const {
    name,
    website,
    lastChecked,
    ourWinRate,
    pricingModel,
    g2Rating,
    strengths,
    weaknesses,
    recentChanges,
  } = competitor;
  const topStrengths = (strengths || []).slice(0, 2);
  const topWeaknesses = (weaknesses || []).slice(0, 2);
  const changes = (recentChanges || []).slice(0, 3);

  const stars = [];
  const full = Math.floor(g2Rating);
  const half = g2Rating - full >= 0.5;
  for (let i = 0; i < full; i++) stars.push('full');
  if (half) stars.push('half');

  return (
    <div
      style={{
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
        padding: S[5],
        display: 'flex',
        flexDirection: 'column',
        gap: S[4],
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: S[3] }}>
        <div>
          <h3 style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary, margin: 0 }}>
            {name}
          </h3>
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontFamily: F.body, fontSize: '12px', color: C.secondary, textDecoration: 'none' }}
          >
            {website.replace(/^https?:\/\//, '')}
          </a>
        </div>
        <span style={{ ...badge.base, ...badge.muted, fontSize: '10px' }}>
          Checked {lastChecked}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: S[2] }}>
        <span style={{ fontFamily: F.mono, fontSize: '32px', fontWeight: 700, color: C.primary, lineHeight: 1 }}>
          {ourWinRate}%
        </span>
        <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>
          win rate vs them
        </span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[2] }}>
        <span style={{ ...badge.base, ...badge.muted, fontSize: '10px' }}>{pricingModel}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          {stars.map((s, i) => (
            <span key={i} style={{ color: C.amber, fontSize: '12px' }}>★</span>
          ))}
          <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textSecondary, marginLeft: '2px' }}>
            {g2Rating} G2
          </span>
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
        {topStrengths.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: S[2] }}>
            <span style={{ flexShrink: 0, marginTop: '2px' }}><CheckIcon /></span>
            <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textPrimary }}>{s}</span>
          </div>
        ))}
        {topWeaknesses.map((w, i) => (
          <div key={`w-${i}`} style={{ display: 'flex', alignItems: 'flex-start', gap: S[2] }}>
            <span style={{ flexShrink: 0, marginTop: '2px' }}><XIcon /></span>
            <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>{w}</span>
          </div>
        ))}
      </div>

      {changes.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[1] }}>
          <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Recent changes
          </span>
          {changes.map((c, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: S[2],
                padding: `${S[1]} ${S[2]}`,
                backgroundColor: 'rgba(245,200,66,0.08)',
                border: `1px solid rgba(245,200,66,0.2)`,
                borderRadius: R.sm,
                fontFamily: F.body,
                fontSize: '11px',
                color: C.textPrimary,
              }}
            >
              <span style={{ color: C.amber }}>◆</span>
              {c.text} {c.daysAgo != null && <span style={{ color: C.textMuted }}> · {c.daysAgo} days ago</span>}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: S[2], marginTop: 'auto' }}>
        <button
          style={{ ...btn.secondary, flex: 1, fontSize: '12px' }}
          onClick={() => onViewBattleCard?.(competitor.id)}
        >
          View Battle Card
        </button>
        <button
          style={{ ...btn.ghost, fontSize: '12px' }}
          onClick={() => onViewAds?.(competitor.id)}
        >
          View Ads
        </button>
      </div>
    </div>
  );
}
