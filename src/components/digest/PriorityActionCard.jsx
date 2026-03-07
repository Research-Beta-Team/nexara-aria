/**
 * Numbered card: description, "Do This" / "View Draft" button.
 */
import { C, F, R, S, btn } from '../../tokens';

export default function PriorityActionCard({ number, description, actionLabel, hasDraft, onAction }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: S[4],
        padding: S[4],
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: R.full,
          backgroundColor: C.primaryGlow,
          color: C.primary,
          fontFamily: F.mono,
          fontSize: '14px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {number}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: F.body, fontSize: '14px', color: C.textPrimary, lineHeight: 1.5, margin: `0 0 ${S[3]} 0` }}>
          {description}
        </p>
        <button
          type="button"
          onClick={() => onAction?.()}
          style={hasDraft ? btn.secondary : btn.primary}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
