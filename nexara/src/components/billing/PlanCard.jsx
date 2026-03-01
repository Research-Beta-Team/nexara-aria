import { useState } from 'react';
import useToast from '../../hooks/useToast';
import useStore from '../../store/useStore';
import { PLAN_ORDER } from '../../config/plans';
import { C, F, R, S, T } from '../../tokens';
import { IconWarning, IconMessage } from '../ui/Icons';

// ── Per-plan feature bullet lists ─────────────
const PLAN_FEATURES = {
  starter: [
    '2 active campaigns',
    'Email outreach',
    'Meta Ads monitoring',
    'ICP Builder (basic)',
    'Content Library & Knowledge Base',
    'Escalation queue',
    '3 team seats · 1 workspace',
  ],
  growth: [
    'Unlimited active campaigns',
    'Email + LinkedIn + WhatsApp outreach',
    'ABM Engine — 50 named accounts',
    'Intent Signals — 500 tracked accounts',
    'Full Ads suite (Meta, Google, LinkedIn)',
    'Unified Inbox + Query Manager',
    '10 team seats · 3 workspaces · 3 portals',
  ],
  scale: [
    'Competitive Intelligence',
    'Predictive Forecasting + Pipeline',
    'ARIA Voice AI — 500 min/month',
    'White-Label + API Access (10K calls/mo)',
    '1 Custom Agent build included',
    'Customer Success module',
    '25 team seats · 10 workspaces · 10 portals',
  ],
  agency: [
    'Unlimited seats, workspaces & portals',
    'All 22 agents unlocked',
    'Cross-client analytics & reporting',
    'Sub-billing for clients',
    'Data Warehouse sync (Snowflake / BigQuery)',
    'Outcome-based billing',
    'Named CSM + 30-min SLA + On-demand calls',
  ],
};

const SUPPORT_TEXT = {
  starter: 'Community support',
  growth:  'Email support (4h SLA) + Monthly strategy call',
  scale:   'Dedicated Slack + 1h SLA + Bi-weekly review',
  agency:  'Named CSM + 30-min SLA + On-demand calls',
};

// ── Helpers ───────────────────────────────────
function getSavingsPerYear(plan) {
  return (plan.price.monthly - plan.price.annual) * 12;
}

function getPlanAction(currentPlanId, thisPlanId) {
  if (currentPlanId === thisPlanId) return { type: 'current', label: 'Current Plan' };
  if (thisPlanId === 'agency') return { type: 'agency', label: 'Talk to Sales →' };
  const currentIdx = PLAN_ORDER.indexOf(currentPlanId);
  const thisIdx    = PLAN_ORDER.indexOf(thisPlanId);
  const name = thisPlanId.charAt(0).toUpperCase() + thisPlanId.slice(1);
  return thisIdx > currentIdx
    ? { type: 'upgrade',   label: `Upgrade to ${name}` }
    : { type: 'downgrade', label: `Switch to ${name}` };
}

function formatCredits(n) {
  if (n >= 1_000_000) return `${n / 1_000_000}M`;
  if (n >= 1_000)     return `${(n / 1_000).toLocaleString()}K`;
  return n.toLocaleString();
}

// ── Check icon ────────────────────────────────
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: '2px' }}>
      <circle cx="7" cy="7" r="7" fill="rgba(61,220,132,0.15)"/>
      <path d="M4 7l2 2 4-4" stroke="#3DDC84" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ── PlanCard ──────────────────────────────────
export default function PlanCard({ plan, billing, currentPlanId, recommendedForYou }) {
  const toast         = useToast();
  const openCheckout  = useStore(s => s.openCheckout);
  const [ctaHovered, setCtaHovered] = useState(false);

  const action         = getPlanAction(currentPlanId, plan.id);
  const isHighlighted  = plan.badge === 'Most Popular';
  const isCurrent      = plan.id === currentPlanId;
  const savingsPerYear = getSavingsPerYear(plan);
  const price          = billing === 'annual' ? plan.price.annual : plan.price.monthly;
  const creditDisplay  = formatCredits(plan.credits.included);
  const rolloverText   = plan.credits.rolloverMultiplier
    ? `Rolls over up to ${plan.credits.rolloverMultiplier}×`
    : 'No rollover cap';

  // ── CTA colors ────────────────────────────
  const ctaBg = () => {
    if (action.type === 'current')  return C.surface3;
    if (action.type === 'upgrade')  return ctaHovered ? plan.color + 'cc' : plan.color;
    return 'transparent';
  };
  const ctaColor = () => {
    if (action.type === 'current') return C.textMuted;
    if (action.type === 'upgrade') return ['growth', 'scale'].includes(plan.id) ? '#070D09' : C.textPrimary;
    if (action.type === 'agency')  return plan.color;
    return C.textSecondary;
  };
  const ctaBorder = () => {
    if (action.type === 'current')  return C.border;
    if (action.type === 'upgrade')  return plan.color;
    if (action.type === 'agency')   return plan.color;
    return C.border;
  };

  const handleCta = () => {
    if (action.type === 'current')  return;
    if (action.type === 'agency')   { toast.info('Connecting you with our sales team — opening Calendly...'); return; }
    if (action.type === 'upgrade')  { openCheckout(plan.id); return; }
    if (action.type === 'downgrade'){ toast.warning(`Switching to ${plan.displayName}... (mock)`); return; }
  };

  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: C.surface,
      border: `1px solid ${isHighlighted ? plan.color : C.border}`,
      borderRadius: R.card,
      overflow: 'hidden',
      flex: 1,
      minWidth: 0,
      boxShadow: isHighlighted
        ? `0 0 40px ${plan.color}28, 0 8px 32px rgba(0,0,0,0.45)`
        : '0 2px 12px rgba(0,0,0,0.2)',
      transform: isHighlighted ? 'translateY(-8px)' : 'none',
      transition: T.base,
    }}>
      {/* ── Top accent bar ── */}
      <div style={{ height: '5px', backgroundColor: plan.color, flexShrink: 0 }} />

      {/* ── Card body ── */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: S[6], gap: S[4] }}>

        {/* Badges row */}
        <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap', minHeight: '20px' }}>
          {recommendedForYou && (
            <span style={{
              fontFamily: F.mono, fontSize: '10px', fontWeight: 700,
              color: C.primary, backgroundColor: C.primaryGlow,
              border: `1px solid ${C.primary}`, borderRadius: R.pill,
              padding: `2px ${S[2]}`, letterSpacing: '0.05em',
            }}>
              RECOMMENDED FOR YOU
            </span>
          )}
          {plan.badge && (
            <span style={{
              fontFamily: F.mono, fontSize: '10px', fontWeight: 700,
              color: C.amber, backgroundColor: C.amberDim,
              border: `1px solid ${C.amber}`, borderRadius: R.pill,
              padding: `2px ${S[2]}`, letterSpacing: '0.05em',
            }}>
              ★ {plan.badge.toUpperCase()}
            </span>
          )}
          {isCurrent && (
            <span style={{
              fontFamily: F.mono, fontSize: '10px', fontWeight: 700,
              color: plan.color, backgroundColor: `${plan.color}20`,
              border: `1px solid ${plan.color}50`, borderRadius: R.pill,
              padding: `2px ${S[2]}`, letterSpacing: '0.05em',
            }}>
              CURRENT PLAN
            </span>
          )}
        </div>

        {/* Plan name */}
        <div style={{
          fontFamily: F.display, fontSize: '22px', fontWeight: 800,
          color: plan.color, letterSpacing: '-0.01em', lineHeight: 1,
        }}>
          {plan.displayName}
        </div>

        {/* Price block */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[1] }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ fontFamily: F.mono, fontSize: '38px', fontWeight: 700, color: C.textPrimary, lineHeight: 1 }}>
              ${price.toLocaleString()}
            </span>
            <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textMuted, fontWeight: 500 }}>
              /mo
            </span>
          </div>
          <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>
            {billing === 'annual' ? 'billed annually' : 'billed monthly'}
          </div>
          {billing === 'annual' && (
            <span style={{
              alignSelf: 'flex-start', fontFamily: F.mono, fontSize: '11px', fontWeight: 700,
              color: '#3DDC84', backgroundColor: 'rgba(61,220,132,0.12)',
              border: '1px solid rgba(61,220,132,0.25)', borderRadius: R.pill,
              padding: `2px ${S[2]}`, letterSpacing: '0.03em',
            }}>
              Save ${savingsPerYear.toLocaleString()}/yr
            </span>
          )}
        </div>

        {/* Credits block */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: '3px',
          paddingTop: S[3], borderTop: `1px solid ${C.border}`,
        }}>
          <div style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 700, color: '#3DDC84' }}>
            {creditDisplay} agent credits/month
          </div>
          <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>
            {rolloverText} · ${plan.credits.topUpPricePer1k}/1K top-up
          </div>
        </div>

        {/* Feature checklist — flex: 1 pushes CTA to bottom */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[2], flex: 1 }}>
          {(PLAN_FEATURES[plan.id] ?? []).map((feature, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: S[2] }}>
              <CheckIcon />
              <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, lineHeight: 1.45 }}>
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* Support badge */}
        <div style={{
          padding: `${S[2]} ${S[3]}`,
          backgroundColor: C.surface2,
          borderRadius: R.sm,
          border: `1px solid ${C.border}`,
        }}>
          <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, lineHeight: 1.4, display: 'flex', alignItems: 'center', gap: 6 }}>
            <IconMessage color={C.textSecondary} width={14} height={14} /> {SUPPORT_TEXT[plan.id]}
          </div>
        </div>

        {/* CTA button + note */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <button
            disabled={action.type === 'current'}
            onClick={handleCta}
            onMouseEnter={() => setCtaHovered(true)}
            onMouseLeave={() => setCtaHovered(false)}
            style={{
              width: '100%',
              padding: `${S[3]} ${S[4]}`,
              backgroundColor: ctaBg(),
              color: ctaColor(),
              border: `1px solid ${ctaBorder()}`,
              borderRadius: R.button,
              fontFamily: F.body, fontSize: '14px', fontWeight: 600,
              cursor: action.type === 'current' ? 'default' : 'pointer',
              transition: T.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {action.label}
          </button>
          {action.type === 'upgrade' && (
            <div style={{ textAlign: 'center', fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>
              Prorated credit applied immediately
            </div>
          )}
          {action.type === 'downgrade' && (
            <div style={{ textAlign: 'center', fontFamily: F.body, fontSize: '11px', color: C.amber, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <IconWarning color={C.amber} width={14} height={14} /> Some features will be disabled
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
