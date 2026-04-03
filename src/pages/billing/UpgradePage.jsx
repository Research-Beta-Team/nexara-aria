import { useState } from 'react';
import { PLANS, PLAN_ORDER } from '../../config/plans';
import useStore from '../../store/useStore';
import usePlan from '../../hooks/usePlan';
import usePlanAlerts from '../../hooks/usePlanAlerts';
import useToast from '../../hooks/useToast';
import PlanCard from '../../components/billing/PlanCard';
import FeatureMatrix from '../../components/billing/FeatureMatrix';
import AddonsShop from '../../components/billing/AddonsShop';
import OutcomePricing from '../../components/billing/OutcomePricing';
import PlanExpiryWarning from '../../components/plan/PlanExpiryWarning';
import { C, F, R, S, T } from '../../tokens';
import { IconCheck } from '../../components/ui/Icons';
import { AGENTS } from '../../agents/AgentRegistry';

// ── Agent access per tier ─────────────────────
const TIER_AGENTS = {
  starter: {
    agentIds: ['freya', 'copywriter', 'analyst'],
    skillCount: 10,
    workflowCount: 0,
    workflowNote: 'No workflows',
    extras: [],
  },
  growth: {
    agentIds: ['freya', 'copywriter', 'analyst', 'strategist', 'prospector', 'outreach'],
    skillCount: 22,
    workflowCount: 3,
    workflowNote: '3 workflows',
    extras: [],
  },
  scale: {
    agentIds: ['freya', 'copywriter', 'analyst', 'strategist', 'prospector', 'outreach', 'optimizer', 'revenue'],
    skillCount: 34,
    workflowCount: 6,
    workflowNote: 'All 6 workflows',
    extras: ['Custom triggers'],
  },
  agency: {
    agentIds: ['freya', 'copywriter', 'analyst', 'strategist', 'prospector', 'outreach', 'optimizer', 'revenue'],
    skillCount: 34,
    workflowCount: 6,
    workflowNote: 'All 6 workflows',
    extras: ['Custom agents', 'White-label'],
  },
};

const PLAN_COLORS = {
  starter: '#8B9E98',
  growth:  '#4A7C6F',
  scale:   '#3DDC84',
  agency:  '#F59E0B',
};

function AgentAccessRow() {
  const toast = useToast();
  return (
    <div>
      <div style={{
        fontFamily: F.display, fontSize: '20px', fontWeight: 700,
        color: C.textPrimary, letterSpacing: '-0.01em', marginBottom: S[2],
      }}>
        Agents Included Per Plan
      </div>
      <p style={{ fontFamily: F.body, fontSize: '14px', color: C.textSecondary, marginBottom: S[5], margin: `0 0 ${S[5]} 0` }}>
        Each plan unlocks more specialist agents, skills, and workflow automations.
      </p>
      <div style={{ display: 'flex', gap: S[4], flexWrap: 'wrap' }}>
        {PLAN_ORDER.map((planId) => {
          const tier = TIER_AGENTS[planId];
          if (!tier) return null;
          const planColor = PLAN_COLORS[planId] || C.primary;
          const planDisplayName = PLANS[planId]?.displayName ?? planId;
          return (
            <div
              key={planId}
              style={{
                flex: '1 1 200px',
                backgroundColor: C.surface,
                border: `1px solid ${C.border}`,
                borderTop: `3px solid ${planColor}`,
                borderRadius: R.card,
                padding: S[4],
                display: 'flex',
                flexDirection: 'column',
                gap: S[3],
              }}
            >
              {/* Plan name */}
              <div style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: planColor }}>
                {planDisplayName}
              </div>

              {/* Agent avatar chips */}
              <div>
                <div style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>
                  Agents ({tier.agentIds.length})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[1] }}>
                  {tier.agentIds.map((agentId) => {
                    const agent = AGENTS[agentId];
                    if (!agent) return null;
                    return (
                      <div
                        key={agentId}
                        title={agent.displayName}
                        onClick={() => toast.info(`${agent.displayName}: ${agent.description}`)}
                        style={{
                          width: '32px', height: '32px', borderRadius: R.sm,
                          backgroundColor: `${agent.color}22`, border: `1px solid ${agent.color}44`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '15px', cursor: 'pointer', transition: T.color,
                          flexShrink: 0,
                        }}
                      >
                        {agent.avatar}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Skills & workflows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: planColor, flexShrink: 0, display: 'inline-block' }} />
                  <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>
                    {tier.skillCount} skills enabled
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: planColor, flexShrink: 0, display: 'inline-block' }} />
                  <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>
                    {tier.workflowNote}
                  </span>
                </div>
                {tier.extras.map((extra) => (
                  <div key={extra} style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: planColor, flexShrink: 0, display: 'inline-block' }} />
                    <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>
                      {extra}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

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
  const items2 = ['Prices in USD', 'All plans include Freya AI', 'SOC 2 Type II compliant'];

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
  const toast = useToast();
  const { planId: currentPlanId } = usePlan();
  const { expiryWarning } = usePlanAlerts();
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

      {/* ── Expiry / renewal warning ── */}
      {expiryWarning && (
        <PlanExpiryWarning
          kind={expiryWarning.kind}
          renewDate={expiryWarning.renewDate}
          amount={expiryWarning.amount}
          cardLast4={expiryWarning.cardLast4}
          daysLeft={expiryWarning.daysLeft}
          onReviewPlan={() => {}}
          onUpdatePayment={() => toast.info('Update payment method (mock)')}
        />
      )}

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

      {/* ── Agent access per tier ── */}
      <AgentAccessRow />

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
