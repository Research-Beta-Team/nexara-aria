import { useState } from 'react';
import { PLANS, PLAN_ORDER } from '../../config/plans';
import useStore from '../../store/useStore';
import usePlan from '../../hooks/usePlan';
import PlanCard from '../../components/billing/PlanCard';
import FeatureMatrix from '../../components/billing/FeatureMatrix';
import AddonsShop from '../../components/billing/AddonsShop';
import OutcomePricing from '../../components/billing/OutcomePricing';
import { C, F, R, S, T } from '../../tokens';
import { IconCheck } from '../../components/ui/Icons';

// ── Billing toggle ────────────────────────────
function BillingToggle({ billing, onChange }) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      backgroundColor: C.surface2,
      border: `1px solid ${C.border}`,
      borderRadius: R.pill,
      padding: '4px',
    }}>
      {['monthly', 'annual'].map(opt => {
        const isActive = billing === opt;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            style={{
              padding: `${S[2]} ${S[5]}`,
              borderRadius: R.pill,
              border: 'none',
              fontFamily: F.body,
              fontSize: '14px',
              fontWeight: isActive ? 600 : 500,
              color: isActive
                ? (opt === 'annual' ? '#070D09' : C.textPrimary)
                : C.textSecondary,
              backgroundColor: isActive
                ? (opt === 'annual' ? '#3DDC84' : C.surface3)
                : 'transparent',
              cursor: 'pointer',
              transition: T.color,
              whiteSpace: 'nowrap',
            }}
          >
            {opt === 'monthly' ? 'Monthly' : 'Annual — Save up to 21%'}
          </button>
        );
      })}
    </div>
  );
}

// ── Trust strip ───────────────────────────────
function TrustStrip() {
  const itemStyle = {
    fontFamily: F.body,
    fontSize: '13px',
    color: C.textMuted,
    display: 'flex',
    alignItems: 'center',
    gap: S[2],
  };

  const items1 = ['No contracts', 'Cancel anytime', '14-day money-back guarantee'];
  const items2 = ['Prices in USD', 'All plans include ARIA AI', 'SOC 2 Type II compliant'];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: S[2],
      padding: `${S[8]} 0`,
      borderTop: `1px solid ${C.border}`,
    }}>
      <div style={{ display: 'flex', gap: S[6], flexWrap: 'wrap', justifyContent: 'center' }}>
        {items1.map(item => (
          <span key={item} style={itemStyle}>
            <IconCheck color="#3DDC84" width={16} height={16} /> {item}
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: S[6], flexWrap: 'wrap', justifyContent: 'center' }}>
        {items2.map(item => (
          <span key={item} style={itemStyle}>
            <IconCheck color="#3DDC84" width={16} height={16} /> {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── UpgradePage ───────────────────────────────
export default function UpgradePage() {
  const [billing, setBilling] = useState('annual');
  const { planId: currentPlanId } = usePlan();
  const onboardingSelectedPlanId = useStore((s) => s.onboardingSelectedPlanId);

  return (
    <div style={{
      minHeight: '100%',
      padding: `${S[10]} ${S[8]}`,
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: S[12],
    }}>

      {/* ── Page header ── */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: S[4],
        textAlign: 'center',
      }}>
        {/* Eyebrow */}
        <span style={{
          fontFamily: F.mono, fontSize: '11px', fontWeight: 700,
          color: '#3DDC84', letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          Pricing & Plans
        </span>

        {/* Title */}
        <h1 style={{
          fontFamily: F.display, fontSize: '42px', fontWeight: 800,
          color: C.textPrimary, letterSpacing: '-0.03em',
          lineHeight: 1.1, margin: 0,
        }}>
          Choose Your Plan
        </h1>

        {/* Subtitle */}
        <p style={{
          fontFamily: F.body, fontSize: '16px', color: C.textSecondary,
          lineHeight: 1.65, maxWidth: '520px', margin: 0,
        }}>
          Everything you need to run your GTM engine on autopilot.{' '}
          Change plans anytime. Cancel in 2 clicks.
        </p>

        {/* Billing toggle */}
        <div style={{ marginTop: S[2] }}>
          <BillingToggle billing={billing} onChange={setBilling} />
        </div>
      </div>

      {/* ── Plan cards row ── */}
      <div style={{
        display: 'flex',
        gap: S[4],
        alignItems: 'flex-start',
        paddingBottom: S[3], // extra breathing room for the elevated growth card
      }}>
        {PLAN_ORDER.map(planId => (
          <PlanCard
            key={planId}
            plan={PLANS[planId]}
            billing={billing}
            currentPlanId={currentPlanId}
            recommendedForYou={onboardingSelectedPlanId === planId}
          />
        ))}
      </div>

      {/* ── Outcome-based pricing ── */}
      <OutcomePricing />

      {/* ── Feature matrix ── */}
      <div>
        <div style={{
          fontFamily: F.display, fontSize: '20px', fontWeight: 700,
          color: C.textPrimary, letterSpacing: '-0.01em', marginBottom: S[4],
        }}>
          Feature Comparison
        </div>
        <FeatureMatrix />
      </div>

      {/* ── Add-ons shop ── */}
      <AddonsShop />

      {/* ── Trust strip ── */}
      <TrustStrip />

    </div>
  );
}
