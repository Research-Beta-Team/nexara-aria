import { C, F, R, S, btn, badge } from '../../tokens';

export default function AdIntelGallery({ competitors, selectedCompetitorId, onFilterChange, toast }) {
  const allAds = competitors.flatMap((c) =>
    (c.adCreatives || []).map((ad) => ({ ...ad, competitorName: c.name, competitorId: c.id }))
  );
  const filtered = selectedCompetitorId
    ? allAds.filter((a) => a.competitorId === selectedCompetitorId)
    : allAds;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[5] }}>
      {/* ARIA insight strip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: S[3],
          padding: `${S[3]} ${S[4]}`,
          backgroundColor: 'rgba(61,220,132,0.06)',
          border: '1px solid rgba(61,220,132,0.2)',
          borderLeft: `3px solid ${C.primary}`,
          borderRadius: R.card,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
          <path d="M7 1.5L13.2 12.8H.8L7 1.5z" stroke={C.primary} strokeWidth="1.3" strokeLinejoin="round"/>
          <path d="M3.6 9.2h6.8" stroke={C.primary} strokeWidth="1.3" strokeLinecap="round"/>
          <circle cx="7" cy="1.5" r="1.1" fill={C.primary}/>
          <circle cx=".8" cy="12.8" r="1.1" fill={C.primary}/>
          <circle cx="13.2" cy="12.8" r="1.1" fill={C.primary}/>
        </svg>
        <div style={{ flex: 1 }}>
          <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary }}>
            Apollo is heavily pushing &quot;free plan&quot; messaging this week. Consider a response ad emphasizing our ROI vs their feature limitations.
          </span>
        </div>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: S[2], flexWrap: 'wrap' }}>
        <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted, textTransform: 'uppercase' }}>Filter:</span>
        <button
          style={{
            ...badge.base,
            padding: `${S[1]} ${S[3]}`,
            borderRadius: R.button,
            border: `1px solid ${!selectedCompetitorId ? C.primary : C.border}`,
            backgroundColor: !selectedCompetitorId ? 'rgba(61,220,132,0.1)' : C.surface2,
            color: !selectedCompetitorId ? C.primary : C.textSecondary,
            fontFamily: F.body,
            fontSize: '12px',
            cursor: 'pointer',
          }}
          onClick={() => onFilterChange?.(null)}
        >
          All
        </button>
        {competitors.map((c) => {
          const active = selectedCompetitorId === c.id;
          return (
            <button
              key={c.id}
              style={{
                ...badge.base,
                padding: `${S[1]} ${S[3]}`,
                borderRadius: R.button,
                border: `1px solid ${active ? C.primary : C.border}`,
                backgroundColor: active ? 'rgba(61,220,132,0.1)' : C.surface2,
                color: active ? C.primary : C.textSecondary,
                fontFamily: F.body,
                fontSize: '12px',
                cursor: 'pointer',
              }}
              onClick={() => onFilterChange?.(c.id)}
            >
              {c.name}
            </button>
          );
        })}
      </div>

      {/* 2-col grid of ad cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: S[4],
        }}
      >
        {filtered.map((ad) => (
          <div
            key={ad.id}
            style={{
              backgroundColor: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: R.card,
              padding: S[5],
              display: 'flex',
              flexDirection: 'column',
              gap: S[3],
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: S[2] }}>
              <span style={{ ...badge.base, ...badge.muted, fontSize: '10px' }}>{ad.competitorName}</span>
              <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>{ad.format}</span>
            </div>
            <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>
              First seen {ad.firstSeen}
            </span>
            <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary, lineHeight: 1.5, margin: 0, flex: 1 }}>
              {ad.copy}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: S[2], flexWrap: 'wrap' }}>
              <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textSecondary }}>
                CTR (est.): {ad.ctrRange}
              </span>
              <span style={{ ...badge.base, ...badge.green, fontSize: '10px' }}>{ad.angle}</span>
            </div>
            <button
              style={{ ...btn.ghost, fontSize: '12px', alignSelf: 'flex-start' }}
              onClick={() => toast?.success('Saved to knowledge base')}
            >
              Save as Reference
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
