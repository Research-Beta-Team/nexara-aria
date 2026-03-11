/**
 * 3 Freya insight cards with actions (mint border).
 */
import { C, F, R, S, btn } from '../../tokens';

export default function ARIAAttributionInsight({ insights = [], onAction }) {
  return (
    <div
      style={{
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
        padding: S[4],
      }}
    >
      <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary, marginBottom: S[4] }}>
        Freya attribution insights
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
        {insights.map((insight) => (
          <div
            key={insight.id}
            style={{
              padding: S[4],
              backgroundColor: C.surface2,
              border: `1px solid ${C.primaryGlow}`,
              borderRadius: R.card,
            }}
          >
            <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary, marginBottom: S[2] }}>
              {insight.title}
            </div>
            <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, lineHeight: 1.5, margin: `0 0 ${S[3]} 0` }}>
              {insight.body}
            </p>
            <button
              type="button"
              onClick={() => onAction?.(insight) || (insight.actionRoute && (() => {}))}
              style={{ ...btn.secondary, fontSize: '12px', padding: `${S[1]} ${S[3]}` }}
            >
              {insight.actionLabel}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
