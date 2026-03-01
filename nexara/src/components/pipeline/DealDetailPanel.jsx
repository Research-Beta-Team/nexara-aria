import { C, F, R, S, btn, badge, dividerStyle } from '../../tokens';

function formatCurrency(value) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

function healthColor(health) {
  switch (health) {
    case 'healthy': return C.primary;
    case 'at_risk': return C.amber;
    case 'stalled': return C.red;
    default: return C.textMuted;
  }
}

const STATUS_STYLE = {
  healthy: { ...badge.base, ...badge.green },
  at_risk: { ...badge.base, ...badge.amber },
  stalled: { ...badge.base, ...badge.red },
};

export default function DealDetailPanel({ deal, onClose, toast }) {
  if (!deal) return null;

  const {
    company,
    contact,
    title,
    value,
    stage,
    health,
    riskScore,
    riskFactors = [],
    recommendedActions = [],
    touchpoints = [],
    ariaNextAction,
    notes,
  } = deal;

  const healthC = healthColor(health);
  const riskColor = riskScore >= 60 ? C.red : riskScore >= 35 ? C.amber : C.primary;

  return (
    <div
      style={{
        width: 380,
        flexShrink: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: C.surface,
        borderLeft: `1px solid ${C.border}`,
        overflowY: 'auto',
      }}
    >
      <div style={{ padding: S[5], borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: S[3] }}>
          <h2 style={{ fontFamily: F.display, fontSize: '18px', fontWeight: 700, color: C.textPrimary, margin: 0 }}>
            {company}
          </h2>
          <button style={{ ...btn.icon }} onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div style={{ fontFamily: F.body, fontSize: '14px', color: C.textSecondary }}>{contact} · {title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginTop: S[3], flexWrap: 'wrap' }}>
          <span style={{ fontFamily: F.mono, fontSize: '20px', fontWeight: 700, color: C.primary }}>{formatCurrency(value)}</span>
          <span style={{ ...badge.base, ...badge.muted }}>{stage}</span>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: `2px solid ${healthC}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: F.mono,
              fontSize: '11px',
              fontWeight: 700,
              color: healthC,
            }}
          >
            {riskScore ?? '—'}
          </div>
        </div>
      </div>

      <div style={{ padding: S[5], display: 'flex', flexDirection: 'column', gap: S[5] }}>
        <section>
          <h3 style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>
            ARIA Risk Assessment
          </h3>
          <div style={{ padding: S[3], backgroundColor: C.surface2, border: `1px solid ${C.border}`, borderRadius: R.sm }}>
            <div style={{ fontFamily: F.mono, fontSize: '24px', fontWeight: 700, color: riskColor, marginBottom: S[2] }}>
              {riskScore ?? 0}/100
            </div>
            {riskFactors.length > 0 && (
              <ul style={{ margin: '0 0 8px', paddingLeft: S[4], fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>
                {riskFactors.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            )}
            {recommendedActions.length > 0 && (
              <div style={{ fontFamily: F.body, fontSize: '12px', color: C.primary }}>
                Recommended: {recommendedActions.join('; ')}
              </div>
            )}
          </div>
        </section>

        <section>
          <h3 style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>
            Touchpoint History
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[1] }}>
            {(touchpoints.slice(0, 5)).map((t, i) => (
              <div
                key={i}
                style={{
                  padding: S[2],
                  backgroundColor: C.surface2,
                  borderRadius: R.sm,
                  fontFamily: F.body,
                  fontSize: '12px',
                  color: C.textPrimary,
                }}
              >
                {t.type} · {t.date} — {t.outcome} ({t.person})
              </div>
            ))}
          </div>
        </section>

        {ariaNextAction && (
          <section>
            <h3 style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.primary, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>
              Next Best Action
            </h3>
            <div
              style={{
                padding: S[4],
                backgroundColor: 'rgba(61,220,132,0.08)',
                border: `1px solid rgba(61,220,132,0.2)`,
                borderRadius: R.card,
              }}
            >
              <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary, margin: '0 0 12px' }}>
                {ariaNextAction}
              </p>
              <button style={{ ...btn.primary, fontSize: '12px' }} onClick={() => toast?.success('Action executed')}>
                Execute
              </button>
            </div>
          </section>
        )}

        <div style={dividerStyle} />

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[2] }}>
          <button style={{ ...btn.secondary, fontSize: '12px' }} onClick={() => toast?.info('Log activity coming soon')}>Log Activity</button>
          <button style={{ ...btn.secondary, fontSize: '12px' }} onClick={() => toast?.info('Update stage coming soon')}>Update Stage</button>
          <button style={{ ...btn.secondary, fontSize: '12px' }} onClick={() => toast?.success('Content sent')}>Send Content</button>
          <button style={{ ...btn.secondary, fontSize: '12px' }} onClick={() => toast?.info('Schedule call coming soon')}>Schedule Call</button>
          <button style={{ ...btn.ghost, fontSize: '12px' }} onClick={() => toast?.info('Opening CRM…')}>View in CRM</button>
        </div>

        <section>
          <h3 style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>
            Notes
          </h3>
          <textarea
            defaultValue={notes}
            placeholder="Add notes…"
            rows={3}
            style={{
              width: '100%',
              padding: S[3],
              backgroundColor: C.surface2,
              border: `1px solid ${C.border}`,
              borderRadius: R.input,
              fontFamily: F.body,
              fontSize: '13px',
              color: C.textPrimary,
              resize: 'vertical',
            }}
          />
          <button
            style={{ ...btn.primary, marginTop: S[2], fontSize: '12px' }}
            onClick={() => toast?.success('Notes saved')}
          >
            Save notes
          </button>
        </section>
      </div>
    </div>
  );
}
