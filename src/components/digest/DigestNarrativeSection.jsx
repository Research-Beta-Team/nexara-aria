/**
 * Freya avatar + written summary paragraph. Narrative is the hero.
 */
import { C, F, R, S } from '../../tokens';

export default function DigestNarrativeSection({ narrative }) {
  return (
    <div
      style={{
        padding: S[6],
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: S[4], marginBottom: S[4] }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: C.primaryGlow,
            border: `2px solid ${C.primary}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: F.display,
            fontSize: '20px',
            fontWeight: 700,
            color: C.primary,
            flexShrink: 0,
          }}
        >
          A
        </div>
        <div>
          <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, marginBottom: S[1] }}>
            Freya summary
          </div>
          <p
            style={{
              fontFamily: F.body,
              fontSize: '15px',
              lineHeight: 1.6,
              color: C.textPrimary,
              margin: 0,
            }}
          >
            {narrative}
          </p>
        </div>
      </div>
    </div>
  );
}
