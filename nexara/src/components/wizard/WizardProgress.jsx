import { C, F, R, S, T } from '../../tokens';

const STEPS = [
  { n: 1, label: 'Basics'    },
  { n: 2, label: 'ICP'       },
  { n: 3, label: 'Channels'  },
  { n: 4, label: 'Knowledge' },
  { n: 5, label: 'Team'      },
  { n: 6, label: 'Workflow'  },
  { n: 7, label: 'Review'    },
];

export default function WizardProgress({ currentStep }) {
  const pct = Math.round(((currentStep - 1) / (STEPS.length - 1)) * 100);

  return (
    <div style={{
      backgroundColor: C.surface,
      borderBottom: `1px solid ${C.border}`,
      padding: `${S[4]} ${S[6]}`,
      display: 'flex',
      flexDirection: 'column',
      gap: S[3],
    }}>
      {/* Step labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
        {STEPS.map((step) => {
          const done    = step.n < currentStep;
          const active  = step.n === currentStep;
          const pending = step.n > currentStep;

          const dotColor  = done ? C.primary : active ? C.primary : C.surface3;
          const dotBorder = done ? C.primary : active ? C.primary : C.border;
          const dotGlow   = (done || active) ? `0 0 8px ${C.primary}60` : 'none';
          const textColor = active ? C.textPrimary : done ? C.primary : C.textMuted;

          return (
            <div key={step.n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: S[1], flex: 1 }}>
              {/* Dot */}
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                backgroundColor: dotColor,
                border: `2px solid ${dotBorder}`,
                boxShadow: dotGlow,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: T.base, position: 'relative', zIndex: 1,
              }}>
                {done ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke={C.textInverse} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <span style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: active ? C.textInverse : C.textMuted }}>
                    {step.n}
                  </span>
                )}
              </div>
              {/* Label */}
              <span style={{
                fontFamily: F.body,
                fontSize: '11px',
                fontWeight: active ? 600 : 400,
                color: textColor,
                transition: T.color,
                whiteSpace: 'nowrap',
              }}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress track */}
      <div style={{
        height: '3px',
        backgroundColor: C.surface3,
        borderRadius: R.pill,
        overflow: 'hidden',
        marginTop: `-${S[3]}`,
        position: 'relative',
        zIndex: 0,
        // Indent to align with first/last dot centers
        margin: `0 14px`,
      }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          backgroundColor: C.primary,
          borderRadius: R.pill,
          transition: 'width 0.35s ease',
          boxShadow: `0 0 8px ${C.primary}60`,
        }}/>
      </div>
    </div>
  );
}
