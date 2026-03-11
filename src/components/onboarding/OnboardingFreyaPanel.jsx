/**
 * Freya assistant panel for tier-based onboarding.
 * Shows step-specific message and quick-action chips.
 */

import { R, S, ANTARIOUS_AUTH } from '../../tokens';
import { getFreyaMessage } from '../../data/onboardingFreyaMessages';

const N = ANTARIOUS_AUTH;

const avatarStyle = {
  width: 44,
  height: 44,
  borderRadius: R.md,
  background: 'linear-gradient(135deg, #0891B2, #38BDF8)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: N.fontDisplay,
  fontSize: '18px',
  fontWeight: 800,
  color: '#fff',
  flexShrink: 0,
};

const bubbleStyle = {
  backgroundColor: N.surface2,
  border: `1px solid ${N.border}`,
  borderRadius: '12px',
  padding: S[4],
  fontFamily: N.fontBody,
  fontSize: '14px',
  lineHeight: 1.55,
  color: N.textPrimary,
};

const chipStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: `${S[1]} ${S[3]}`,
  borderRadius: R.pill,
  border: `1px solid ${N.border}`,
  backgroundColor: N.surface3,
  fontFamily: N.fontBody,
  fontSize: '12px',
  fontWeight: 600,
  color: N.textSecondary,
  cursor: 'pointer',
  transition: 'all 0.18s ease',
};

export default function OnboardingFreyaPanel({ stepId, onChipClick }) {
  const { message, chips } = getFreyaMessage(stepId);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: S[4],
        minWidth: 0,
        flex: '0 0 320px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: S[3] }}>
        <div style={avatarStyle} aria-hidden>
          F
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ ...bubbleStyle, borderTopLeftRadius: 4 }}>
            {message}
          </div>
          {chips && chips.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: S[2],
                marginTop: S[3],
              }}
            >
              {chips.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => onChipClick && onChipClick(chip.id)}
                  style={chipStyle}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = N.primary;
                    e.currentTarget.style.backgroundColor = N.primaryGlow;
                    e.currentTarget.style.color = N.textPrimary;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = N.border;
                    e.currentTarget.style.backgroundColor = N.surface3;
                    e.currentTarget.style.color = N.textSecondary;
                  }}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div
        style={{
          fontFamily: N.fontBody,
          fontSize: '11px',
          color: N.textMuted,
          display: 'flex',
          alignItems: 'center',
          gap: S[1],
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: '#10B981',
          }}
        />
        Freya · your GTM assistant
      </div>
    </div>
  );
}
