/**
 * Pills: First Touch, Last Touch, Linear, W-Shaped (default), Time Decay; one-line description under selection.
 */
import { C, F, R, S } from '../../tokens';
import { ATTRIBUTION_MODELS } from '../../data/attributionMock';

export default function ModelSelector({ value, onChange }) {
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[2], marginBottom: S[2] }}>
        {ATTRIBUTION_MODELS.map((model) => (
          <button
            key={model.id}
            type="button"
            onClick={() => onChange?.(model.id)}
            style={{
              padding: `${S[2]} ${S[4]}`,
              fontFamily: F.body,
              fontSize: '13px',
              fontWeight: 600,
              color: value === model.id ? C.textInverse : C.textSecondary,
              backgroundColor: value === model.id ? C.primary : 'transparent',
              border: `1px solid ${value === model.id ? C.primary : C.border}`,
              borderRadius: R.pill,
              cursor: 'pointer',
              transition: 'color 0.15s ease, background-color 0.15s ease, border-color 0.15s ease',
            }}
          >
            {model.label}
          </button>
        ))}
      </div>
      {value && (
        <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, margin: 0 }}>
          {ATTRIBUTION_MODELS.find((m) => m.id === value)?.description}
        </p>
      )}
    </div>
  );
}
