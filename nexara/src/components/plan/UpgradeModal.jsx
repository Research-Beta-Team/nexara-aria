import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, Zap, ArrowRight } from 'lucide-react';
import { PLANS, PLAN_ORDER } from '../../config/plans';
import { C, F, R, S, Z, T, shadows, btn, flex, dividerStyle } from '../../tokens';
import useToast from '../../hooks/useToast';
import useStore from '../../store/useStore';
import PlanBadge from './PlanBadge';

// ── Helpers ──────────────────────────────────────────────────────────────────

const DISPLAY_NAME_OVERRIDES = {
  abmEngine:            'ABM Engine',
  icpBuilder:           'ICP Builder',
  icpScoring:           'ICP Scoring',
  apiAccess:            'API Access',
  ariaVoice:            'ARIA Voice',
  dataWarehouseSync:    'Data Warehouse Sync',
  crossClientAnalytics: 'Cross-Client Analytics',
  roleBasedAccess:      'Role-Based Access',
  subBilling:           'Sub-Billing',
  metaAdsManagement:    'Meta Ads Management',
  metaAdsMonitoring:    'Meta Ads Monitoring',
  googleAdsManagement:  'Google Ads Management',
  linkedinAdsManagement:'LinkedIn Ads Management',
  linkedinOutreach:     'LinkedIn Outreach',
  whatsappOutreach:     'WhatsApp Outreach',
  emailOutreach:        'Email Outreach',
  unifiedInbox:         'Unified Inbox',
  intentSignals:        'Intent Signals',
  competitiveIntel:     'Competitive Intel',
  predictiveForecasting:'Predictive Forecasting',
  pipelineManager:      'Pipeline Manager',
  customerSuccess:      'Customer Success',
  queryManager:         'Query Manager',
  calendarView:         'Calendar View',
  ganttPlan:            'Gantt Plan',
  clientPortal:         'Client Portal',
  whiteLabel:           'White-Label',
  customAgents:         'Custom Agents',
  verticalPlaybooks:    'Vertical Playbooks',
  outcomeBilling:       'Outcome Billing',
  basicAnalytics:       'Basic Analytics',
  advancedAnalytics:    'Advanced Analytics',
};

function toDisplayName(key) {
  if (!key) return '';
  if (DISPLAY_NAME_OVERRIDES[key]) return DISPLAY_NAME_OVERRIDES[key];
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()).trim();
}

// Features that open up with each plan — short descriptions for the "unlocking" panel
const FEATURE_DESC = {
  competitiveIntel:     'Real-time competitor tracking and positioning analysis.',
  intentSignals:        'Person-level intent data from G2, Bombora, and web visits.',
  abmEngine:            'Target named accounts with personalised multi-channel plays.',
  ariaVoice:            'AI-powered voice calls and conversational SDR automation.',
  predictiveForecasting:'Revenue forecasting powered by your pipeline data.',
  whiteLabel:           'Deliver NEXARA under your own brand to clients.',
  apiAccess:            'Programmatic access to all NEXARA data and actions.',
  customAgents:         'Build bespoke AI agents trained on your workflows.',
  dataWarehouseSync:    'Sync your GTM data to Snowflake, BigQuery, or Redshift.',
  crossClientAnalytics: 'Aggregate analytics across your entire client portfolio.',
  subBilling:           'Bill clients directly through NEXARA.',
  advancedAnalytics:    'Deep-dive analytics with cohort analysis and attribution.',
  unifiedInbox:         'All outreach channels in one unified conversation view.',
  clientPortal:         'Branded client portals with live reporting dashboards.',
  ganttPlan:            'Full campaign Gantt view with task dependencies.',
  outcomeBilling:       'Pay-for-performance billing tied to real GTM outcomes.',
  pipelineManager:      'Visual pipeline management with AI-assisted forecasting.',
  customerSuccess:      'Automated CS workflows for onboarding and retention.',
};

function getFeatureDesc(key) {
  return FEATURE_DESC[key] ?? 'Full access to this feature.';
}

// Get features toPlan has that fromPlan does not
function getNewFeatures(fromPlanId, toPlanId) {
  const fromF = PLANS[fromPlanId]?.features ?? {};
  const toF   = PLANS[toPlanId]?.features   ?? {};
  return Object.keys(toF).filter(k => toF[k] && !fromF[k]);
}

// Upgrade button needs dark text on mint/teal backgrounds
function getButtonTextColor(planId) {
  return ['growth', 'scale'].includes(planId) ? '#070D09' : C.textPrimary;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function BillingToggle({ value, onChange, savings }) {
  const pill = (id, label) => (
    <button
      key={id}
      style={{
        ...btn.ghost,
        fontSize: '12px',
        fontWeight: 600,
        padding: `${S[1]} ${S[3]}`,
        borderRadius: R.pill,
        color: value === id ? C.textInverse : C.textSecondary,
        backgroundColor: value === id ? C.primary : 'transparent',
        transition: T.color,
      }}
      onClick={() => onChange(id)}
    >
      {label}
    </button>
  );
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: S[1],
      backgroundColor: C.surface3,
      borderRadius: R.pill,
      padding: '3px',
      border: `1px solid ${C.border}`,
    }}>
      {pill('annual',  'Annual')}
      {pill('monthly', 'Monthly')}
      {savings > 0 && (
        <span style={{
          fontSize: '10px', fontFamily: F.mono, fontWeight: 700,
          color: C.primary, paddingRight: S[2],
        }}>
          Save {savings}%
        </span>
      )}
    </div>
  );
}

function CreditComparisonRow({ label, credits, maxCredits, color }) {
  const pct = maxCredits > 0 ? Math.min(100, (credits / maxCredits) * 100) : 100;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ ...flex.rowBetween }}>
        <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>{label}</span>
        <span style={{ fontFamily: F.mono, fontSize: '12px', color: C.textPrimary }}>
          {credits.toLocaleString()}/mo
        </span>
      </div>
      <div style={{ height: '6px', borderRadius: R.pill, backgroundColor: C.surface3 }}>
        <div style={{
          width: `${pct}%`, height: '100%',
          borderRadius: R.pill, backgroundColor: color,
          transition: T.slow,
        }} />
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function UpgradeModal({ fromPlan, toPlan, featureUnlocked, onClose }) {
  const [billing, setBilling] = useState('annual');
  const toast        = useToast();
  const openCheckout = useStore(s => s.openCheckout);

  const fromPlanObj = PLANS[fromPlan] ?? PLANS.starter;
  const toPlanObj   = PLANS[toPlan]   ?? PLANS.growth;
  const newFeatures = getNewFeatures(fromPlan, toPlan);
  const highlights  = newFeatures.slice(0, 5);
  const rightFeats  = newFeatures.slice(0, 3);

  const price    = toPlanObj.price[billing];
  const savings  = Math.round((1 - toPlanObj.price.annual / toPlanObj.price.monthly) * 100);
  const btnColor = toPlanObj.color;
  const btnText  = getButtonTextColor(toPlan);

  // Close on Escape
  useEffect(() => {
    function handleKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const modal = (
    <div
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(7,13,9,0.82)',
        zIndex: Z.modal,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: S[4],
      }}
      onClick={onClose}
    >
      {/* Modal box */}
      <div
        style={{
          width: '680px', maxWidth: '100%',
          maxHeight: '90vh', overflow: 'hidden',
          display: 'flex',
          backgroundColor: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: R.card,
          boxShadow: shadows.modal,
          position: 'relative',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Close button ── */}
        <button
          style={{
            ...btn.icon,
            position: 'absolute', top: S[3], right: S[3],
            zIndex: 1,
          }}
          onClick={onClose}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* ── Left panel ── */}
        <div style={{
          width: '260px', flexShrink: 0,
          backgroundColor: C.surface2,
          borderRight: `1px solid ${C.border}`,
          padding: S[6],
          overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: S[4],
          scrollbarWidth: 'thin', scrollbarColor: `${C.border} transparent`,
        }}>
          {/* Current plan */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
            <span style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 600,
              color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Your current plan
            </span>
            <PlanBadge planId={fromPlan} size="md" showIcon />
          </div>

          <div style={dividerStyle} />

          {/* Feature being unlocked */}
          {featureUnlocked && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
                <span style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 600,
                  color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  You're unlocking
                </span>
                <div style={{
                  backgroundColor: C.surface3, border: `1px solid ${C.border}`,
                  borderRadius: R.md, padding: S[3],
                  display: 'flex', flexDirection: 'column', gap: S[1],
                }}>
                  <span style={{ fontFamily: F.body, fontSize: '14px', fontWeight: 700, color: toPlanObj.color }}>
                    {toDisplayName(featureUnlocked)}
                  </span>
                  <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, lineHeight: 1.5 }}>
                    {getFeatureDesc(featureUnlocked)}
                  </span>
                </div>
              </div>

              {highlights.length > 0 && <div style={dividerStyle} />}
            </>
          )}

          {/* Other unlocked features */}
          {highlights.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
              <span style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 600,
                color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Plus everything in {toPlanObj.displayName}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
                {highlights.map(key => (
                  <div key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: S[2] }}>
                    <div style={{
                      width: '16px', height: '16px', borderRadius: R.full, flexShrink: 0,
                      backgroundColor: C.greenDim, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginTop: '1px',
                    }}>
                      <Check size={10} color={C.primary} />
                    </div>
                    <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, lineHeight: 1.4 }}>
                      {toDisplayName(key)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right panel ── */}
        <div style={{
          flex: 1, padding: S[6],
          overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: S[5],
          scrollbarWidth: 'thin', scrollbarColor: `${C.border} transparent`,
        }}>
          {/* Plan name */}
          <div>
            <div style={{
              fontFamily: F.display, fontSize: '28px', fontWeight: 800,
              color: toPlanObj.color, lineHeight: 1,
            }}>
              {toPlanObj.displayName}
            </div>
            {toPlanObj.badge && (
              <span style={{
                display: 'inline-block', marginTop: S[1],
                fontFamily: F.mono, fontSize: '10px', fontWeight: 700,
                color: toPlanObj.color, backgroundColor: C.surface3,
                border: `1px solid ${toPlanObj.color}`,
                borderRadius: R.pill, padding: `2px ${S[2]}`,
              }}>
                {toPlanObj.badge}
              </span>
            )}
          </div>

          {/* Billing toggle */}
          <BillingToggle value={billing} onChange={setBilling} savings={savings} />

          {/* Price */}
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: S[1] }}>
              <span style={{ fontFamily: F.mono, fontSize: '36px', fontWeight: 700, color: C.textPrimary }}>
                ${price}
              </span>
              <span style={{ fontFamily: F.body, fontSize: '14px', color: C.textSecondary }}>/month</span>
            </div>
            <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>
              {billing === 'annual'
                ? `Billed annually ($${(price * 12).toLocaleString()}/year)`
                : 'Billed monthly'}
            </span>
          </div>

          {/* 3 feature highlights */}
          {rightFeats.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
              {rightFeats.map(key => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                  <Check size={15} color={C.primary} />
                  <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
                    {toDisplayName(key)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Credit comparison */}
          <div style={{
            backgroundColor: C.surface2, border: `1px solid ${C.border}`,
            borderRadius: R.md, padding: S[4],
            display: 'flex', flexDirection: 'column', gap: S[3],
          }}>
            <span style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600,
              color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Agent Credits
            </span>
            <CreditComparisonRow
              label="Your plan"
              credits={fromPlanObj.credits.included}
              maxCredits={toPlanObj.credits.included}
              color={C.primary}
            />
            <CreditComparisonRow
              label={`${toPlanObj.displayName} plan`}
              credits={toPlanObj.credits.included}
              maxCredits={toPlanObj.credits.included}
              color={C.secondary}
            />
          </div>

          {/* Upgrade CTA */}
          <button
            style={{
              ...btn.primary,
              backgroundColor: btnColor,
              color: btnText,
              width: '100%',
              justifyContent: 'center',
              fontSize: '15px',
              fontWeight: 700,
              padding: `${S[3]} ${S[5]}`,
              borderRadius: R.button,
              gap: S[2],
            }}
            onClick={() => {
              onClose();
              openCheckout(toPlan, featureUnlocked);
            }}
          >
            Upgrade to {toPlanObj.displayName} — ${price}/month
            <ArrowRight size={16} />
          </button>

          {/* Talk to us */}
          <div style={{ textAlign: 'center' }}>
            <button
              style={{ ...btn.ghost, fontSize: '13px', color: C.textSecondary }}
              onClick={() => toast.info('Opening Calendly... (mock)')}
            >
              Talk to us first
            </button>
          </div>

          {/* Trust strip */}
          <div style={{
            textAlign: 'center',
            fontFamily: F.body, fontSize: '11px',
            color: C.textMuted,
            borderTop: `1px solid ${C.border}`,
            paddingTop: S[3],
          }}>
            No contracts · Cancel anytime · 14-day money-back guarantee
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
