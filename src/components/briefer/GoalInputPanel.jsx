/**
 * Large textarea, char count, example chips, primary button (disabled until 10+ chars).
 */
import { C, F, R, S, btn, labelStyle } from '../../tokens';

const MIN_CHARS = 10;

export default function GoalInputPanel({ value, onChange, onSubmit, exampleChips = [] }) {
  const len = (value || '').length;
  const canSubmit = len >= MIN_CHARS;

  return (
    <div
      style={{
        padding: S[6],
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
      }}
    >
      <label style={labelStyle}>Campaign goal (one sentence or more)</label>
      <textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder="e.g. Launch Q2 enterprise ABM targeting CFOs in Vietnam; generate 40 MQLs and $800K pipeline in 90 days."
        rows={4}
        style={{
          width: '100%',
          padding: S[4],
          fontFamily: F.body,
          fontSize: '15px',
          color: C.textPrimary,
          backgroundColor: C.surface2,
          border: `1px solid ${C.border}`,
          borderRadius: R.input,
          outline: 'none',
          resize: 'vertical',
          marginBottom: S[2],
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: S[3], marginBottom: S[4] }}>
        <span style={{ fontFamily: F.mono, fontSize: '12px', color: len >= MIN_CHARS ? C.primary : C.textMuted }}>
          {len} / {MIN_CHARS}+ characters
        </span>
      </div>
      {exampleChips.length > 0 && (
        <div style={{ marginBottom: S[4] }}>
          <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, marginBottom: S[2] }}>
            Example goals
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[2] }}>
            {exampleChips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => onChange?.(chip)}
                style={{
                  padding: `${S[2]} ${S[3]}`,
                  fontFamily: F.body,
                  fontSize: '12px',
                  color: C.textSecondary,
                  backgroundColor: C.surface3,
                  border: `1px solid ${C.border}`,
                  borderRadius: R.pill,
                  cursor: 'pointer',
                }}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => canSubmit && onSubmit?.()}
        disabled={!canSubmit}
        style={{ ...btn.primary, opacity: canSubmit ? 1 : 0.5, cursor: canSubmit ? 'pointer' : 'not-allowed' }}
      >
        Generate Full Campaign Brief
      </button>
    </div>
  );
}
