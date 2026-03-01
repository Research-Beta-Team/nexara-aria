import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import useStore from '../../store/useStore';
import useCheckout from '../../hooks/useCheckout';
import CheckoutStep1 from './CheckoutStep1';
import CheckoutStep2 from './CheckoutStep2';
import CheckoutStep3 from './CheckoutStep3';
import CheckoutStep4 from './CheckoutStep4';
import { C, F, R, S, T } from '../../tokens';

// ── Progress dots ─────────────────────────────
const STEP_LABELS = ['Confirm', 'Billing', 'Payment', 'Done'];

function ProgressBar({ step }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: `${S[5]} ${S[8]}`,
      borderBottom: `1px solid ${C.border}`,
      gap: 0,
    }}>
      {STEP_LABELS.map((label, i) => {
        const n         = i + 1;
        const isDone    = n < step;
        const isActive  = n === step;
        const isFuture  = n > step;
        const isLast    = i === STEP_LABELS.length - 1;

        const dotBg = isDone || isActive ? '#3DDC84' : C.surface3;
        const dotBorder = isFuture ? `1px solid ${C.border}` : `1px solid #3DDC84`;

        return (
          <div key={n} style={{ display: 'flex', alignItems: 'center', flex: isLast ? 0 : 1 }}>
            {/* Dot */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
              <div style={{
                width: '28px', height: '28px',
                borderRadius: '50%',
                backgroundColor: dotBg,
                border: dotBorder,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: T.base,
                flexShrink: 0,
              }}>
                {isDone ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="#070D09" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <span style={{
                    fontFamily: F.mono, fontSize: '11px', fontWeight: 700,
                    color: isActive ? '#070D09' : C.textMuted,
                  }}>
                    {n}
                  </span>
                )}
              </div>
              <span style={{
                fontFamily: F.body, fontSize: '11px', fontWeight: isActive ? 600 : 400,
                color: isActive ? '#3DDC84' : isDone ? C.textSecondary : C.textMuted,
                whiteSpace: 'nowrap',
              }}>
                {label}
              </span>
            </div>
            {/* Connector line */}
            {!isLast && (
              <div style={{
                flex: 1,
                height: '1px',
                backgroundColor: isDone ? '#3DDC84' : C.border,
                margin: `0 ${S[2]}`,
                marginBottom: '18px', // offset to sit on dot center
                transition: T.base,
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Close confirm mini-dialog ─────────────────
function CloseConfirm({ onConfirm, onCancel }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      backgroundColor: 'rgba(7,13,9,0.9)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 10, borderRadius: R.card,
    }}>
      <div style={{
        backgroundColor: C.surface2,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
        padding: S[8],
        width: '340px',
        display: 'flex', flexDirection: 'column', gap: S[4],
        textAlign: 'center',
      }}>
        <div style={{ fontFamily: F.display, fontSize: '18px', fontWeight: 700, color: C.textPrimary }}>
          Leave checkout?
        </div>
        <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, lineHeight: 1.6 }}>
          Your progress will be lost. You can always start the upgrade again.
        </div>
        <div style={{ display: 'flex', gap: S[3] }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: `${S[3]} ${S[4]}`,
              backgroundColor: 'transparent', color: C.textSecondary,
              border: `1px solid ${C.border}`, borderRadius: R.button,
              fontFamily: F.body, fontSize: '14px', fontWeight: 500, cursor: 'pointer',
            }}
          >
            Stay
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: `${S[3]} ${S[4]}`,
              backgroundColor: C.surface3, color: C.textPrimary,
              border: `1px solid ${C.border}`, borderRadius: R.button,
              fontFamily: F.body, fontSize: '14px', fontWeight: 600, cursor: 'pointer',
            }}
          >
            Leave
          </button>
        </div>
      </div>
    </div>
  );
}

// ── CheckoutFlow ──────────────────────────────
export default function CheckoutFlow() {
  const checkoutOpen        = useStore(s => s.checkoutOpen);
  const checkoutTargetPlan  = useStore(s => s.checkoutTargetPlan);
  const checkoutSourceFeature = useStore(s => s.checkoutSourceFeature);
  const currentPlanId       = useStore(s => s.currentPlanId);
  const closeCheckout       = useStore(s => s.closeCheckout);

  const checkout = useCheckout();
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  // Reset step + billing info when checkout opens
  useEffect(() => {
    if (checkoutOpen) checkout.reset();
  }, [checkoutOpen]); // eslint-disable-line

  // Escape key
  useEffect(() => {
    if (!checkoutOpen) return;
    const handler = (e) => {
      if (e.key === 'Escape') handleCloseRequest();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [checkoutOpen, checkout.step]); // eslint-disable-line

  if (!checkoutOpen || !checkoutTargetPlan) return null;

  const handleCloseRequest = () => {
    if (checkout.step === 1 || checkout.step === 4) {
      closeCheckout();
    } else {
      setShowCloseConfirm(true);
    }
  };

  const handleConfirmClose = () => {
    setShowCloseConfirm(false);
    closeCheckout();
  };

  const stepProps = {
    fromPlanId:    currentPlanId,
    toPlanId:      checkoutTargetPlan,
    sourceFeature: checkoutSourceFeature,
    billing:       checkout.billing,
    setBilling:    checkout.setBilling,
    billingInfo:   checkout.billingInfo,
    updateBillingInfo: checkout.updateBillingInfo,
    isProcessing:  checkout.isProcessing,
    goNext:        checkout.goNext,
    goBack:        checkout.goBack,
    startPayment:  checkout.startPayment,
    onClose:       closeCheckout,
  };

  const overlay = (
    <div
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(7,13,9,0.95)',
        zIndex: 9000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: S[4],
        overflowY: 'auto',
      }}
      onClick={handleCloseRequest}
    >
      {/* Modal container */}
      <div
        style={{
          position: 'relative',
          width: '780px', maxWidth: '100%',
          backgroundColor: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: R.card,
          boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close X */}
        {checkout.step !== 4 && (
          <button
            onClick={handleCloseRequest}
            style={{
              position: 'absolute', top: S[3], right: S[3], zIndex: 20,
              width: '32px', height: '32px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: C.surface2, border: `1px solid ${C.border}`,
              borderRadius: R.button, color: C.textSecondary, cursor: 'pointer',
            }}
            aria-label="Close checkout"
          >
            <X size={16} />
          </button>
        )}

        {/* Progress bar */}
        <ProgressBar step={checkout.step} />

        {/* Step content */}
        <div style={{ overflowY: 'auto', flex: 1, scrollbarWidth: 'thin', scrollbarColor: `${C.border} transparent` }}>
          {checkout.step === 1 && <CheckoutStep1 {...stepProps} />}
          {checkout.step === 2 && <CheckoutStep2 {...stepProps} />}
          {checkout.step === 3 && <CheckoutStep3 {...stepProps} />}
          {checkout.step === 4 && <CheckoutStep4 {...stepProps} />}
        </div>

        {/* Close confirm overlay */}
        {showCloseConfirm && (
          <CloseConfirm
            onConfirm={handleConfirmClose}
            onCancel={() => setShowCloseConfirm(false)}
          />
        )}
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}
