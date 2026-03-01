import { useState, useRef, useEffect, cloneElement } from 'react';
import { AlertTriangle, Zap, Check, X } from 'lucide-react';
import useCredits from '../../hooks/useCredits';
import usePlan from '../../hooks/usePlan';
import useToast from '../../hooks/useToast';
import { C, F, R, S, Z, shadows, btn, flex } from '../../tokens';
import UpgradeModal from './UpgradeModal';

/**
 * CreditGate — checks credit balance before allowing an action.
 * If enough credits: shows a confirmation popup.
 * If not enough: shows a "buy credits / upgrade" popup.
 *
 * Usage:
 *   <CreditGate creditCost={80} actionLabel="Generate blog post" onConfirm={handleGenerate}>
 *     <button>Generate Post</button>
 *   </CreditGate>
 *
 * Note: children must be a single React element.
 */
export default function CreditGate({ creditCost, actionLabel, onConfirm, children }) {
  const { creditsRemaining, canAffordAction } = useCredits();
  const { planId, upgradePlan }               = usePlan();
  const toast                                 = useToast();

  const [showPopup,   setShowPopup]   = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const popupRef = useRef(null);
  const affordable = canAffordAction(creditCost);

  // Close popup on outside click
  useEffect(() => {
    if (!showPopup) return;
    function handleOutside(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowPopup(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [showPopup]);

  // Intercept the child's click to open our popup
  const trigger = cloneElement(children, {
    onClick: (e) => {
      e.stopPropagation();
      setShowPopup(true);
    },
  });

  const popupStyle = {
    position: 'absolute',
    bottom: 'calc(100% + 10px)',
    left: '50%',
    transform: 'translateX(-50%)',
    minWidth: '280px',
    backgroundColor: C.surface2,
    border: `1px solid ${C.border}`,
    borderRadius: R.card,
    padding: S[4],
    boxShadow: shadows.modal,
    zIndex: Z.dropdown,
    display: 'flex',
    flexDirection: 'column',
    gap: S[3],
  };

  return (
    <>
      <div style={{ position: 'relative', display: 'inline-flex' }}>
        {trigger}

        {showPopup && (
          <div ref={popupRef} style={popupStyle}>
            {affordable ? (
              // ── Confirmation popup ──────────────────────────────────────
              <>
                <div style={{ ...flex.row, gap: S[2] }}>
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '50%',
                    backgroundColor: C.greenDim,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Zap size={13} color={C.primary} />
                  </div>
                  <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary }}>
                    {actionLabel ?? 'Confirm action'}
                  </span>
                  <button
                    style={{ ...btn.icon, marginLeft: 'auto', padding: '2px' }}
                    onClick={() => setShowPopup(false)}
                    aria-label="Close"
                  >
                    <X size={14} />
                  </button>
                </div>

                <p style={{
                  margin: 0, fontFamily: F.body, fontSize: '13px',
                  color: C.textSecondary, lineHeight: 1.5,
                }}>
                  This action costs{' '}
                  <span style={{ color: C.textPrimary, fontWeight: 600 }}>
                    {creditCost.toLocaleString()} credits
                  </span>.{' '}
                  You have{' '}
                  <span style={{ color: C.primary, fontWeight: 600 }}>
                    {creditsRemaining.toLocaleString()}
                  </span>{' '}
                  remaining.
                </p>

                <div style={{ ...flex.row, gap: S[2] }}>
                  <button
                    style={{
                      ...btn.primary,
                      fontSize: '13px',
                      padding: `${S[1]} ${S[3]}`,
                      gap: S[1],
                    }}
                    onClick={() => { onConfirm?.(); setShowPopup(false); }}
                  >
                    <Check size={13} />
                    Confirm · Use {creditCost.toLocaleString()} credits
                  </button>
                  <button
                    style={{ ...btn.ghost, fontSize: '13px', padding: `${S[1]} ${S[2]}` }}
                    onClick={() => setShowPopup(false)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              // ── Not enough credits popup ────────────────────────────────
              <>
                <div style={{ ...flex.row, gap: S[2] }}>
                  <AlertTriangle size={16} color={C.amber} />
                  <span style={{ fontFamily: F.body, fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>
                    Not enough credits
                  </span>
                  <button
                    style={{ ...btn.icon, marginLeft: 'auto', padding: '2px' }}
                    onClick={() => setShowPopup(false)}
                    aria-label="Close"
                  >
                    <X size={14} />
                  </button>
                </div>

                <p style={{
                  margin: 0, fontFamily: F.body, fontSize: '13px',
                  color: C.textSecondary, lineHeight: 1.5,
                }}>
                  This action costs{' '}
                  <span style={{ fontWeight: 600, color: C.textPrimary }}>
                    {creditCost.toLocaleString()} credits
                  </span>{' '}
                  but you only have{' '}
                  <span style={{ fontWeight: 600, color: C.amber }}>
                    {creditsRemaining.toLocaleString()}
                  </span>{' '}
                  remaining.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
                  <button
                    style={{
                      ...btn.secondary,
                      fontSize: '13px',
                      padding: `${S[2]} ${S[3]}`,
                      gap: S[2],
                    }}
                    onClick={() => {
                      toast.info('Processing credits purchase... (mock)');
                      setShowPopup(false);
                    }}
                  >
                    <Zap size={14} />
                    Buy Credits Pack — $99 for 10K credits
                  </button>

                  {upgradePlan && (
                    <button
                      style={{ ...btn.ghost, fontSize: '13px' }}
                      onClick={() => { setShowPopup(false); setShowUpgrade(true); }}
                    >
                      Upgrade Plan for more credits
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Upgrade modal (portaled) */}
      {showUpgrade && upgradePlan && (
        <UpgradeModal
          fromPlan={planId}
          toPlan={upgradePlan.id}
          featureUnlocked={null}
          onClose={() => setShowUpgrade(false)}
        />
      )}
    </>
  );
}
