import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, CreditCard, PieChart, TrendingUp, Zap } from 'lucide-react';
import useCredits from '../../hooks/useCredits';
import usePlan from '../../hooks/usePlan';
import useToast from '../../hooks/useToast';
import { C, F, R, S, T, shadows, Z } from '../../tokens';

const EASE = 'cubic-bezier(0.34, 1.22, 0.64, 1)';

export default function TopBarCreditsMenu({ isMobile = false }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const navigate = useNavigate();
  const toast = useToast();
  const { plan, planId } = usePlan();
  const {
    creditsRemaining,
    creditsIncluded,
    creditsUsed,
    rolloverBalance,
    usagePercent,
    isLow,
    isCritical,
    estimatedDaysRemaining,
  } = useCredits();

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const chipColor = isCritical ? C.red : isLow ? C.amber : C.primary;
  const chipBg = isCritical ? C.redDim : isLow ? C.amberDim : C.primaryGlow;
  const daysLabel = Number.isFinite(estimatedDaysRemaining)
    ? `~${estimatedDaysRemaining}d at current burn`
    : 'No burn limit (demo)';

  const panelTransform = open
    ? (isMobile ? 'translateY(0) scale(1)' : 'translateX(0) translateY(0) scale(1)')
    : (isMobile ? 'translateY(-8px) scale(0.98)' : 'translateX(8px) translateY(-6px) scale(0.98)');

  const panelStyle = {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    transform: panelTransform,
    opacity: open ? 1 : 0,
    visibility: open ? 'visible' : 'hidden',
    pointerEvents: open ? 'auto' : 'none',
    transition: `opacity 0.22s ease, transform 0.28s ${EASE}, visibility 0s linear ${open ? '0s' : '0.24s'}`,
    zIndex: Z.sticky + 30,
    minWidth: isMobile ? 'min(100vw - 24px, 300px)' : '300px',
    maxWidth: isMobile ? 'calc(100vw - 24px)' : '340px',
    padding: S[3],
    borderRadius: R.card,
    backgroundColor: C.surface,
    border: `1px solid ${C.border}`,
    boxShadow: shadows.dropdown,
  };

  return (
    <div ref={rootRef} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        title="Credits & billing"
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: S[2],
          minHeight: isMobile ? '36px' : '34px',
          padding: `0 ${isMobile ? S[2] : S[3]}`,
          backgroundColor: chipBg,
          border: `1px solid ${chipColor}`,
          borderRadius: R.pill,
          color: chipColor,
          cursor: 'pointer',
          fontFamily: F.mono,
          fontSize: isMobile ? '11px' : '12px',
          fontWeight: 700,
          letterSpacing: '0.04em',
          transition: T.base,
          boxShadow: isLow ? `0 0 0 1px color-mix(in srgb, ${chipColor} 25%, transparent)` : 'none',
        }}
      >
        <Zap size={14} strokeWidth={2.25} aria-hidden />
        {creditsRemaining.toLocaleString()}
        <ChevronDown
          size={14}
          strokeWidth={2}
          aria-hidden
          style={{
            opacity: 0.85,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: `transform 0.25s ${EASE}`,
          }}
        />
      </button>

      <div role="dialog" aria-label="Credits overview" style={panelStyle}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: S[3], marginBottom: S[3] }}>
          <div>
            <div style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary }}>
              {creditsRemaining.toLocaleString()}
              <span style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 500, color: C.textMuted }}> credits left</span>
            </div>
            <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, marginTop: '4px', letterSpacing: '0.04em' }}>
              {plan?.displayName ?? planId} plan · {daysLabel}
            </div>
          </div>
          <span
            style={{
              fontFamily: F.mono,
              fontSize: '10px',
              fontWeight: 700,
              padding: `${S[1]} ${S[2]}`,
              borderRadius: R.pill,
              backgroundColor: chipBg,
              color: chipColor,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            {isCritical ? 'Critical' : isLow ? 'Low' : 'Healthy'}
          </span>
        </div>

        <div style={{ height: '6px', borderRadius: R.pill, backgroundColor: C.surface3, overflow: 'hidden', marginBottom: S[3] }}>
          <div
            style={{
              width: `${Math.min(100, usagePercent)}%`,
              height: '100%',
              borderRadius: R.pill,
              backgroundColor: chipColor,
              transition: 'width 0.35s ease',
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[2], marginBottom: S[3] }}>
          <div style={{ padding: S[2], borderRadius: R.sm, backgroundColor: C.surface2, border: `1px solid ${C.border}` }}>
            <div style={{ fontFamily: F.mono, fontSize: '9px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Used</div>
            <div style={{ fontFamily: F.mono, fontSize: '14px', fontWeight: 700, color: C.textPrimary, marginTop: '2px' }}>{creditsUsed.toLocaleString()}</div>
          </div>
          <div style={{ padding: S[2], borderRadius: R.sm, backgroundColor: C.surface2, border: `1px solid ${C.border}` }}>
            <div style={{ fontFamily: F.mono, fontSize: '9px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Pool</div>
            <div style={{ fontFamily: F.mono, fontSize: '14px', fontWeight: 700, color: C.textPrimary, marginTop: '2px' }}>
              {(creditsIncluded + rolloverBalance).toLocaleString()}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: S[1] }}>
          <button
            type="button"
            onClick={() => {
              navigate('/billing/upgrade');
              toast.info('Billing & plans');
              setOpen(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: S[3],
              width: '100%',
              padding: `${S[2]} ${S[3]}`,
              borderRadius: R.sm,
              border: `1px solid ${C.border}`,
              backgroundColor: C.surface2,
              color: C.textPrimary,
              fontFamily: F.body,
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
              transition: T.base,
            }}
          >
            <CreditCard size={16} strokeWidth={2} color={C.primary} aria-hidden />
            Billing & plans
          </button>
          <button
            type="button"
            onClick={() => {
              toast.info('Usage breakdown export (mock) — CSV in a future sprint');
              setOpen(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: S[3],
              width: '100%',
              padding: `${S[2]} ${S[3]}`,
              borderRadius: R.sm,
              border: `1px solid ${C.border}`,
              backgroundColor: 'transparent',
              color: C.textSecondary,
              fontFamily: F.body,
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
              transition: T.base,
            }}
          >
            <PieChart size={16} strokeWidth={2} aria-hidden />
            Usage report
          </button>
          <button
            type="button"
            onClick={() => {
              toast.info('Credit top-up queued (mock)');
              setOpen(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: S[3],
              width: '100%',
              padding: `${S[2]} ${S[3]}`,
              borderRadius: R.sm,
              border: `1px dashed color-mix(in srgb, ${C.primary} 40%, ${C.border})`,
              backgroundColor: C.primaryGlow,
              color: C.primary,
              fontFamily: F.body,
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
              transition: T.base,
            }}
          >
            <TrendingUp size={16} strokeWidth={2} aria-hidden />
            Add credits
          </button>
        </div>
      </div>
    </div>
  );
}
