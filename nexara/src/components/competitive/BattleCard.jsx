import { C, F, R, S, btn, dividerStyle } from '../../tokens';

export default function BattleCard({ competitors, selectedId, onSelect, toast }) {
  const selected = competitors.find((c) => c.id === selectedId) || competitors[0];
  const battle = selected?.battleCard;
  if (!battle) return null;

  const { objectionHandlers, ourAdvantages, theirAdvantages, proofPoints } = battle;

  return (
    <div style={{ display: 'flex', gap: S[6], minHeight: 400 }}>
      {/* Left: competitor list */}
      <div
        style={{
          width: 160,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: S[1],
        }}
      >
        <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>
          Competitor
        </span>
        {competitors.map((c) => {
          const active = c.id === selectedId;
          return (
            <button
              key={c.id}
              onClick={() => onSelect?.(c.id)}
              style={{
                textAlign: 'left',
                padding: `${S[2]} ${S[3]}`,
                borderRadius: R.button,
                border: `1px solid ${active ? C.primary : C.border}`,
                backgroundColor: active ? 'rgba(61,220,132,0.08)' : 'transparent',
                color: active ? C.primary : C.textPrimary,
                fontFamily: F.body,
                fontSize: '13px',
                fontWeight: active ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {c.name}
            </button>
          );
        })}
      </div>

      {/* Right: battle card content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: S[5],
          overflow: 'auto',
        }}
      >
        <h2 style={{ fontFamily: F.display, fontSize: '18px', fontWeight: 700, color: C.textPrimary, margin: 0 }}>
          When prospect mentions {selected.name}…
        </h2>

        <section>
          <h3 style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[3] }}>
            Objection handlers
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
            {(objectionHandlers || []).map((h, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: C.surface2,
                  border: `1px solid ${C.border}`,
                  borderRadius: R.card,
                  padding: S[4],
                  display: 'flex',
                  flexDirection: 'column',
                  gap: S[2],
                }}
              >
                <div>
                  <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, textTransform: 'uppercase' }}>They said:</span>
                  <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: '4px 0 0', fontStyle: 'italic' }}>
                    &quot;{h.prospectSaid}&quot;
                  </p>
                </div>
                <div>
                  <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.primary, textTransform: 'uppercase' }}>You say:</span>
                  <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary, margin: '4px 0 0' }}>
                    {h.youSay}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div style={dividerStyle} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[5] }}>
          <div>
            <h3 style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 700, color: C.primary, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>
              Our advantages
            </h3>
            <ul style={{ margin: 0, paddingLeft: S[4], fontFamily: F.body, fontSize: '13px', color: C.textPrimary, lineHeight: 1.6 }}>
              {(ourAdvantages || []).map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>
              Their advantages
            </h3>
            <ul style={{ margin: 0, paddingLeft: S[4], fontFamily: F.body, fontSize: '13px', color: C.textSecondary, lineHeight: 1.6 }}>
              {(theirAdvantages || []).map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h3 style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>
            Proof points
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
            {(proofPoints || []).map((p, i) => (
              <div
                key={i}
                style={{
                  padding: S[3],
                  backgroundColor: C.surface2,
                  borderLeft: `3px solid ${C.primary}`,
                  borderRadius: R.sm,
                  fontFamily: F.body,
                  fontSize: '13px',
                  color: C.textPrimary,
                  fontStyle: 'italic',
                }}
              >
                &quot;{p.quote}&quot; — {p.company}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap' }}>
          <button style={{ ...btn.primary, fontSize: '13px' }} onClick={() => toast?.success('Battle card copied to clipboard')}>
            Copy Battle Card
          </button>
          <button style={{ ...btn.secondary, fontSize: '13px' }} onClick={() => toast?.info('PDF download coming soon')}>
            Download PDF
          </button>
          <button style={{ ...btn.ghost, fontSize: '13px' }} onClick={() => toast?.info('Edit mode coming soon')}>
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
