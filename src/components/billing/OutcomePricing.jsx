import useToast from '../../hooks/useToast';
import { C, F, R, S, T } from '../../tokens';

// ── Static data ───────────────────────────────
const OUTCOMES = [
  { label: 'Qualified Lead',          price: '$8–$15',          unit: 'per lead' },
  { label: 'Demo Booked',             price: '$40–$80',         unit: 'per demo' },
  { label: 'Closed Deal Influenced',  price: '2–5%',            unit: 'of deal value' },
  { label: 'Email Reply (Positive)',  price: '$5',              unit: 'per reply' },
  { label: 'Content-Attributed Lead', price: '$12',             unit: 'per lead' },
];

const STEPS = [
  { num: 1, text: 'Keep $99/month base access fee' },
  { num: 2, text: 'Pay per verified outcome only' },
  { num: 3, text: 'Monthly cap = 3× equivalent plan value' },
];

// ── OutcomePricing ────────────────────────────
export default function OutcomePricing() {
  const toast = useToast();

  return (
    <div style={{
      backgroundColor: C.surface,
      border: `1px solid ${C.border}`,
      borderLeft: `4px solid ${C.amber}`,
      borderRadius: R.card,
      padding: S[8],
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Amber ambient glow in top-right */}
      <div style={{
        position: 'absolute',
        top: '-60px', right: '-60px',
        width: '220px', height: '220px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,200,66,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* ── Label chip ── */}
      <div style={{ marginBottom: S[3] }}>
        <span style={{
          fontFamily: F.mono, fontSize: '10px', fontWeight: 700,
          color: C.amber, backgroundColor: C.amberDim,
          border: `1px solid ${C.amber}`, borderRadius: R.pill,
          padding: `2px ${S[2]}`, letterSpacing: '0.08em',
        }}>
          NEW — PAY FOR RESULTS, NOT ACCESS
        </span>
      </div>

      {/* ── Title + description ── */}
      <div style={{ marginBottom: S[6] }}>
        <div style={{
          fontFamily: F.display, fontSize: '22px', fontWeight: 800,
          color: C.textPrimary, letterSpacing: '-0.02em', marginBottom: S[2],
        }}>
          Outcome-Based Pricing
        </div>
        <div style={{ fontFamily: F.body, fontSize: '14px', color: C.textSecondary, lineHeight: 1.6, maxWidth: '580px' }}>
          Available for Growth and Scale clients after 6 months. Pay per verified demo, lead,
          or deal — not for platform access.
        </div>
      </div>

      {/* ── Two-column body ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: S[8],
      }}>
        {/* Left: outcome pricing table */}
        <div>
          <div style={{
            fontFamily: F.mono, fontSize: '11px', fontWeight: 700,
            color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase',
            marginBottom: S[3],
          }}>
            Outcome Pricing
          </div>
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 0,
            border: `1px solid ${C.border}`, borderRadius: R.md, overflow: 'hidden',
          }}>
            {OUTCOMES.map((outcome, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: `${S[3]} ${S[4]}`,
                backgroundColor: i % 2 === 0 ? 'transparent' : C.surface2,
                borderTop: i > 0 ? `1px solid ${C.border}` : 'none',
              }}>
                <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
                  {outcome.label}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', flexShrink: 0 }}>
                  <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 700, color: C.amber }}>
                    {outcome.price}
                  </span>
                  <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>
                    {outcome.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: how it works */}
        <div>
          <div style={{
            fontFamily: F.mono, fontSize: '11px', fontWeight: 700,
            color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase',
            marginBottom: S[3],
          }}>
            How It Works
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
            {STEPS.map(step => (
              <div key={step.num} style={{ display: 'flex', alignItems: 'flex-start', gap: S[3] }}>
                {/* Step number */}
                <div style={{
                  width: '28px', height: '28px', borderRadius: R.full,
                  backgroundColor: C.amberDim,
                  border: `1px solid ${C.amber}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: F.mono, fontSize: '12px', fontWeight: 700, color: C.amber,
                  flexShrink: 0,
                }}>
                  {step.num}
                </div>
                <div style={{
                  fontFamily: F.body, fontSize: '14px', color: C.textSecondary,
                  lineHeight: 1.5, paddingTop: '4px',
                }}>
                  {step.text}
                </div>
              </div>
            ))}

            {/* Requirement note */}
            <div style={{
              marginTop: S[2],
              padding: `${S[3]} ${S[4]}`,
              backgroundColor: C.amberDim,
              border: `1px solid ${C.amber}`,
              borderRadius: R.md,
            }}>
              <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.amber, letterSpacing: '0.06em', marginBottom: '3px' }}>
                ELIGIBILITY
              </div>
              <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, lineHeight: 1.5 }}>
                Requires 6+ months subscription history on Growth or Scale plan.
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => toast.info('Connecting you with our team...')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: S[2],
                padding: `${S[3]} ${S[5]}`,
                backgroundColor: C.amberDim,
                color: C.amber,
                border: `1px solid ${C.amber}`,
                borderRadius: R.button,
                fontFamily: F.body, fontSize: '13px', fontWeight: 600,
                cursor: 'pointer',
                transition: T.color,
                alignSelf: 'flex-start',
              }}
            >
              Learn About Outcome Pricing
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
