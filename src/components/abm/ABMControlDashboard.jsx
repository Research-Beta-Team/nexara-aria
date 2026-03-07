import { C, F, R, S, btn } from '../../tokens';
import { CONTROL_SUMMARY } from '../../data/abmControl';

export default function ABMControlDashboard({ onSelectTier }) {
  const tiers = [
    { key: 't1', ...CONTROL_SUMMARY.t1, color: C.primary },
    { key: 't2', ...CONTROL_SUMMARY.t2, color: C.secondary },
    { key: 't3', ...CONTROL_SUMMARY.t3, color: C.textSecondary },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[6], padding: S[6] }}>
      <div>
        <h1 style={{ fontFamily: F.display, fontSize: '22px', fontWeight: 700, color: C.textPrimary, margin: '0 0 4px' }}>
          ABM Intelligence — Control Dashboard
        </h1>
        <p style={{ fontFamily: F.body, fontSize: '14px', color: C.textSecondary, margin: 0 }}>
          VP/CMO view: 80% time on T1, 15% on T2 exceptions, 5% on T3 program health.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: S[5] }}>
        {tiers.map((t) => (
          <button
            key={t.key}
            onClick={() => onSelectTier(t.key)}
            style={{
              textAlign: 'left',
              padding: S[6],
              backgroundColor: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: R.card,
              cursor: 'pointer',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = t.color;
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = C.border;
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div
              style={{
                width: 40,
                height: 4,
                borderRadius: 2,
                backgroundColor: t.color,
                marginBottom: S[4],
              }}
            />
            <div style={{ fontFamily: F.mono, fontSize: '28px', fontWeight: 700, color: t.color, marginBottom: S[2] }}>
              {t.count}
            </div>
            <div style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary, marginBottom: S[2] }}>
              {t.label.split(' — ')[0]}
            </div>
            <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, marginBottom: S[4] }}>
              {t.label.split(' — ')[1]}
            </div>
            <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: 0, lineHeight: 1.45 }}>
              {t.description}
            </p>
            <span style={{ fontFamily: F.body, fontSize: '12px', color: t.color, fontWeight: 600, marginTop: S[3], display: 'inline-block' }}>
              Open →
            </span>
          </button>
        ))}
      </div>

      <div
        style={{
          padding: S[5],
          backgroundColor: 'rgba(61,220,132,0.06)',
          border: '1px solid rgba(61,220,132,0.2)',
          borderLeft: `4px solid ${C.primary}`,
          borderRadius: R.card,
        }}
      >
        <div style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: C.primary, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: S[2] }}>
          Governing principle
        </div>
        <p style={{ fontFamily: F.body, fontSize: '14px', color: C.textPrimary, margin: 0, lineHeight: 1.5 }}>
          <strong>T1</strong> — Human Led, AI Assisted · <strong>T2</strong> — Human Supervised, AI Semi-Automated · <strong>T3</strong> — AI Fully Automated, Human Reviews Exceptions
        </p>
      </div>
    </div>
  );
}
