import { useState } from 'react';
import { C, F, R, S, btn, badge } from '../../tokens';

function healthBarColor(score) {
  if (score >= 80) return C.primary;
  if (score >= 60) return C.secondary;
  if (score >= 40) return C.amber;
  return C.red;
}

const STATUS_STYLE = {
  healthy: { ...badge.base, ...badge.green },
  at_risk: { ...badge.base, ...badge.amber },
  churning: { ...badge.base, ...badge.red },
  expanding: { ...badge.base, backgroundColor: 'rgba(94,234,212,0.12)', color: C.secondary, border: `1px solid rgba(94,234,212,0.25)` },
};

function formatMrr(mrr) {
  if (mrr >= 1000) return `$${(mrr / 1000).toFixed(1)}K`;
  return `$${mrr}`;
}

export default function CustomerHealthGrid({ customers, onViewDetail }) {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card, overflow: 'hidden' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 80px 90px 140px 60px 100px 100px 80px 80px',
          gap: S[3],
          padding: `${S[3]} ${S[5]}`,
          borderBottom: `1px solid ${C.border}`,
          backgroundColor: C.surface2,
          fontFamily: F.mono,
          fontSize: '10px',
          fontWeight: 700,
          color: C.textMuted,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        <span>Company</span>
        <span>MRR</span>
        <span>Plan</span>
        <span>Health</span>
        <span>NPS</span>
        <span>Renewal</span>
        <span>Status</span>
        <span>Owner</span>
        <span></span>
      </div>
      {customers.map((c) => {
        const expanded = expandedId === c.id;
        const barColor = healthBarColor(c.healthScore ?? 0);
        const statusStyle = STATUS_STYLE[c.status] || STATUS_STYLE.healthy;
        return (
          <div key={c.id}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 80px 90px 140px 60px 100px 100px 80px 80px',
                gap: S[3],
                padding: `${S[3]} ${S[5]}`,
                alignItems: 'center',
                borderBottom: `1px solid ${C.border}`,
                cursor: 'pointer',
                backgroundColor: expanded ? C.surface2 : 'transparent',
              }}
              onClick={() => setExpandedId(expanded ? null : c.id)}
            >
              <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary }}>{c.name}</span>
              <span style={{ fontFamily: F.mono, fontSize: '12px', color: C.primary }}>{formatMrr(c.mrr)}</span>
              <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>{c.plan}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                <div style={{ flex: 1, height: 6, borderRadius: 999, backgroundColor: C.surface3, overflow: 'hidden' }}>
                  <div style={{ width: `${c.healthScore ?? 0}%`, height: '100%', backgroundColor: barColor, borderRadius: 999 }} />
                </div>
                <span style={{ fontFamily: F.mono, fontSize: '11px', color: barColor }}>{c.healthScore}</span>
              </div>
              <span style={{ fontFamily: F.mono, fontSize: '12px', color: C.textSecondary }}>{c.npsScore ?? '—'}</span>
              <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>{c.renewalDate}</span>
              <span style={{ ...statusStyle, fontSize: '10px' }}>{c.status}</span>
              <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>{c.owner}</span>
              <button
                style={{ ...btn.ghost, fontSize: '11px', padding: S[1] }}
                onClick={(e) => { e.stopPropagation(); onViewDetail?.(c); }}
              >
                View
              </button>
            </div>
            {expanded && (
              <div
                style={{
                  padding: S[5],
                  backgroundColor: C.surface2,
                  borderBottom: `1px solid ${C.border}`,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[5], marginBottom: S[4] }}>
                  <div>
                    <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, marginBottom: S[2] }}>USAGE SIGNALS</div>
                    <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
                      Login: {c.usageSignals?.loginFreq} · Adoption: {c.usageSignals?.featureAdoption} · Team: {c.usageSignals?.teamSize}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, marginBottom: S[2] }}>RECENT TOUCHPOINTS</div>
                    {(c.recentTouchpoints || []).slice(0, 3).map((t, i) => (
                      <div key={i} style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>
                        {t.date} — {t.type}: {t.note}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: S[4] }}>
                  <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>NEXT ACTION </span>
                  <span style={{ fontFamily: F.body, fontSize: '13px', color: C.primary }}>{c.nextAction}</span>
                </div>
                <button
                  style={{ ...btn.primary, fontSize: '12px' }}
                  onClick={() => { onViewDetail?.(c); setExpandedId(null); }}
                >
                  View full detail
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
