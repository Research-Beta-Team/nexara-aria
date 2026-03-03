import { useEffect, useRef } from 'react';
import { X, Sparkles, AlertTriangle, CreditCard, ArrowRight } from 'lucide-react';
import { C, F, R, S, Z, shadows, btn } from '../../tokens';

const AUTO_DISMISS_MS = 8000;

const variantStyles = {
  upgrade: {
    borderLeft: `4px solid ${C.primary}`,
    accent: C.primary,
  },
  downgrade_scheduled: {
    borderLeft: `4px solid ${C.amber}`,
    accent: C.amber,
  },
  credit_low: {
    borderLeft: `4px solid ${C.amber}`,
    accent: C.amber,
  },
  credit_critical: {
    borderLeft: `4px solid ${C.red}`,
    accent: C.red,
  },
};

/**
 * PlanChangeToast — rich toast for plan/credit alerts.
 * Renders center-top, 600px wide, 8s auto-dismiss.
 * Variants: upgrade, downgrade_scheduled, credit_low, credit_critical.
 */
export default function PlanChangeToast({
  type,
  payload = {},
  onDismiss,
  onViewWhatsNew,
  onUndo,
  onBuyCredits,
  onUpgradePlan,
}) {
  const timerRef = useRef(null);
  const style = variantStyles[type] ?? variantStyles.upgrade;

  useEffect(() => {
    timerRef.current = setTimeout(() => onDismiss?.(), AUTO_DISMISS_MS);
    return () => clearTimeout(timerRef.current);
  }, [onDismiss]);

  const wrap = {
    position: 'fixed',
    top: S[6],
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: '600px',
    zIndex: Z.toast,
    padding: `0 ${S[4]}`,
    animation: 'planToastIn 0.25s ease',
  };

  const box = {
    display: 'flex',
    flexDirection: 'column',
    gap: S[3],
    backgroundColor: C.surface2,
    border: `1px solid ${C.border}`,
    borderLeft: style.borderLeft,
    borderRadius: R.card,
    padding: S[5],
    boxShadow: shadows.modal,
  };

  const headerRow = {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: S[3],
  };

  const closeBtn = {
    ...btn.icon,
    flexShrink: 0,
    marginTop: '-2px',
  };

  // ── Upgrade ──
  if (type === 'upgrade') {
    const { planDisplayName, creditsAdded, agentsUnlockedCount } = payload;
    return (
      <>
        <style>{`
          @keyframes planToastIn {
            from { opacity: 0; transform: translate(-50%, -12px); }
            to   { opacity: 1; transform: translate(-50%, 0); }
          }
        `}</style>
        <div style={wrap}>
          <div style={box}>
            <div style={headerRow}>
              <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                <div style={{
                  width: 36, height: 36, borderRadius: R.full,
                  backgroundColor: `${C.primary}22`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Sparkles size={18} color={C.primary} />
                </div>
                <div>
                  <div style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary }}>
                    Welcome to {planDisplayName || 'your new plan'}!
                  </div>
                  <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, marginTop: '2px' }}>
                    {creditsAdded > 0 && `${creditsAdded.toLocaleString()} credits added`}
                    {creditsAdded > 0 && agentsUnlockedCount > 0 && ' · '}
                    {agentsUnlockedCount > 0 && `${agentsUnlockedCount} new agents unlocked`}
                  </div>
                </div>
              </div>
              <button style={closeBtn} onClick={onDismiss} aria-label="Dismiss">
                <X size={18} />
              </button>
            </div>
            {onViewWhatsNew && (
              <button
                style={{
                  ...btn.secondary,
                  alignSelf: 'flex-start',
                  fontSize: '13px',
                  borderColor: style.accent,
                  color: style.accent,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: S[1],
                }}
                onClick={() => { onDismiss?.(); onViewWhatsNew(); }}
              >
                View what's new
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </>
    );
  }

  // ── Downgrade scheduled ──
  if (type === 'downgrade_scheduled') {
    return (
      <>
        <style>{`@keyframes planToastIn { from { opacity: 0; transform: translate(-50%, -12px); } to { opacity: 1; transform: translate(-50%, 0); } }`}</style>
        <div style={wrap}>
          <div style={box}>
            <div style={headerRow}>
              <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                <div style={{
                  width: 36, height: 36, borderRadius: R.full,
                  backgroundColor: `${C.amber}22`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <AlertTriangle size={18} color={C.amber} />
                </div>
                <div>
                  <div style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary }}>
                    Downgrade scheduled
                  </div>
                  <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, marginTop: '2px' }}>
                    Your plan will change at the end of the billing period.
                  </div>
                </div>
              </div>
              <button style={closeBtn} onClick={onDismiss} aria-label="Dismiss">
                <X size={18} />
              </button>
            </div>
            {onUndo && (
              <button
                style={{ ...btn.secondary, alignSelf: 'flex-start', fontSize: '13px' }}
                onClick={() => { onDismiss?.(); onUndo(); }}
              >
                Undo
              </button>
            )}
          </div>
        </div>
      </>
    );
  }

  // ── Credit low ──
  if (type === 'credit_low') {
    const { creditsRemaining } = payload;
    return (
      <>
        <style>{`@keyframes planToastIn { from { opacity: 0; transform: translate(-50%, -12px); } to { opacity: 1; transform: translate(-50%, 0); } }`}</style>
        <div style={wrap}>
          <div style={box}>
            <div style={headerRow}>
              <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                <div style={{
                  width: 36, height: 36, borderRadius: R.full,
                  backgroundColor: `${C.amber}22`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <CreditCard size={18} color={C.amber} />
                </div>
                <div>
                  <div style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary }}>
                    Credits running low
                  </div>
                  <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, marginTop: '2px' }}>
                    {creditsRemaining != null && `${creditsRemaining.toLocaleString()} credits remaining.`} Top up to keep campaigns running.
                  </div>
                </div>
              </div>
              <button style={closeBtn} onClick={onDismiss} aria-label="Dismiss">
                <X size={18} />
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[2] }}>
              {onBuyCredits && (
                <button style={{ ...btn.primary, fontSize: '13px' }} onClick={() => { onDismiss?.(); onBuyCredits(); }}>
                  Buy credits
                </button>
              )}
              {onUpgradePlan && (
                <button style={{ ...btn.secondary, fontSize: '13px' }} onClick={() => { onDismiss?.(); onUpgradePlan(); }}>
                  Upgrade plan
                </button>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── Credit critical ──
  if (type === 'credit_critical') {
    const { creditsRemaining } = payload;
    return (
      <>
        <style>{`@keyframes planToastIn { from { opacity: 0; transform: translate(-50%, -12px); } to { opacity: 1; transform: translate(-50%, 0); } }`}</style>
        <div style={wrap}>
          <div style={box}>
            <div style={headerRow}>
              <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                <div style={{
                  width: 36, height: 36, borderRadius: R.full,
                  backgroundColor: `${C.red}22`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <AlertTriangle size={18} color={C.red} />
                </div>
                <div>
                  <div style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary }}>
                    Credits almost depleted
                  </div>
                  <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, marginTop: '2px' }}>
                    {creditsRemaining != null && `${creditsRemaining.toLocaleString()} credits left.`} Add credits now to avoid service interruption.
                  </div>
                </div>
              </div>
              <button style={closeBtn} onClick={onDismiss} aria-label="Dismiss">
                <X size={18} />
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[2] }}>
              {onBuyCredits && (
                <button style={{ ...btn.danger, fontSize: '13px' }} onClick={() => { onDismiss?.(); onBuyCredits(); }}>
                  Buy 10K credits — $99
                </button>
              )}
              {onUpgradePlan && (
                <button style={{ ...btn.secondary, fontSize: '13px' }} onClick={() => { onDismiss?.(); onUpgradePlan(); }}>
                  Upgrade plan
                </button>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  return null;
}
