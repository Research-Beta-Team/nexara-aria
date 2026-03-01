import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PLANS, PLAN_ORDER } from '../../config/plans';
import useStore from '../../store/useStore';
import { C, F, R, S, T } from '../../tokens';
import { IconCheck } from '../ui/Icons';

// ── Feature display names ─────────────────────
const FEAT_NAMES = {
  competitiveIntel:      'Competitive Intelligence',
  intentSignals:         'Intent Signals',
  abmEngine:             'ABM Engine',
  ariaVoice:             'ARIA Voice AI',
  predictiveForecasting: 'Predictive Forecasting',
  whiteLabel:            'White-Labeling',
  apiAccess:             'API Access',
  customAgents:          'Custom Agents',
  dataWarehouseSync:     'Data Warehouse Sync',
  crossClientAnalytics:  'Cross-Client Analytics',
  subBilling:            'Sub-Billing for Clients',
  advancedAnalytics:     'Advanced Analytics',
  unifiedInbox:          'Unified Inbox',
  clientPortal:          'Client Portals',
  ganttPlan:             'Gantt Timeline',
  outcomeBilling:        'Outcome-Based Billing',
  pipelineManager:       'Pipeline Manager',
  customerSuccess:       'Customer Success Module',
  linkedinOutreach:      'LinkedIn Outreach',
  whatsappOutreach:      'WhatsApp Outreach',
  googleAdsManagement:   'Google Ads Management',
  linkedinAdsManagement: 'LinkedIn Ads Management',
  metaAdsManagement:     'Meta Ads Management',
  icpScoring:            'ICP Scoring',
  queryManager:          'Query Manager',
  roleBasedAccess:       'Role-Based Access',
};

function featName(key) {
  return FEAT_NAMES[key] ?? key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
}

// New features to → not in from
function getNewFeatures(fromId, toId) {
  const fromF = PLANS[fromId]?.features ?? {};
  const toF   = PLANS[toId]?.features ?? {};
  return Object.keys(toF).filter(k => toF[k] && !fromF[k]);
}

// Proration: mock 30 days remaining in billing month
function calcProration(fromPlanId) {
  const plan = PLANS[fromPlanId];
  if (!plan) return 0;
  const annualCost  = plan.price.annual * 12;
  const dailyRate   = annualCost / 365;
  return Math.round(dailyRate * 30);
}

function formatCredits(n) {
  if (n >= 1_000_000) return `${n / 1_000_000}M`;
  if (n >= 1_000)     return `${(n / 1_000).toLocaleString()}K`;
  return n.toLocaleString();
}

// ── Section heading ───────────────────────────
function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: F.mono, fontSize: '10px', fontWeight: 700,
      color: C.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase',
      marginBottom: S[3],
    }}>
      {children}
    </div>
  );
}

// ── CheckoutStep1 ─────────────────────────────
export default function CheckoutStep1({ fromPlanId, toPlanId, billing, setBilling, goNext, onClose }) {
  const navigate    = useNavigate();
  const addonsActive= useStore(s => s.addonsActive);
  const planRenewsAt= useStore(s => s.planRenewsAt);

  const fromPlan   = PLANS[fromPlanId] ?? PLANS.starter;
  const toPlan     = PLANS[toPlanId]   ?? PLANS.growth;
  const newFeatures = getNewFeatures(fromPlanId, toPlanId).slice(0, 5);
  const proration  = calcProration(fromPlanId);

  const price      = toPlan.price[billing];
  const fullCost   = billing === 'annual' ? price * 12 : price;
  const dueToday   = Math.max(0, fullCost - proration);

  const fromCredits = fromPlan.credits.included;
  const toCredits   = toPlan.credits.included;
  const fromSeats   = fromPlan.limits.teamSeats;
  const toSeats     = toPlan.limits.teamSeats;

  const formatSeats = (n) => n === -1 ? 'Unlimited' : `${n}`;

  // renewal date display
  const renewDate = new Date(planRenewsAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const handleChangeplan = () => {
    onClose();
    navigate('/billing/upgrade');
  };

  return (
    <div style={{ padding: S[8] }}>
      {/* Header */}
      <div style={{ marginBottom: S[6] }}>
        <div style={{ fontFamily: F.display, fontSize: '24px', fontWeight: 800, color: C.textPrimary, letterSpacing: '-0.02em' }}>
          Confirm Your Upgrade
        </div>
        <div style={{ fontFamily: F.body, fontSize: '14px', color: C.textSecondary, marginTop: S[1] }}>
          Review your new plan before continuing.
        </div>
      </div>

      {/* Two-column body */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[6] }}>

        {/* ── LEFT: Order summary ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[5] }}>

          {/* Plan upgrade arrow */}
          <div>
            <SectionLabel>Plan Change</SectionLabel>
            <div style={{
              display: 'flex', alignItems: 'center', gap: S[3],
              backgroundColor: C.surface2, border: `1px solid ${C.border}`,
              borderRadius: R.card, padding: S[4],
            }}>
              {/* From */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1 }}>
                <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, letterSpacing: '0.06em' }}>FROM</div>
                <div style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textMuted }}>
                  {fromPlan.displayName}
                </div>
                <div style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>
                  ${fromPlan.price.annual}/mo
                </div>
              </div>
              {/* Arrow */}
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                backgroundColor: `${toPlan.color}20`, border: `1px solid ${toPlan.color}50`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <ArrowRight size={14} color={toPlan.color} />
              </div>
              {/* To */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1, alignItems: 'flex-end' }}>
                <div style={{ fontFamily: F.mono, fontSize: '10px', color: toPlan.color, letterSpacing: '0.06em' }}>TO</div>
                <div style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: toPlan.color }}>
                  {toPlan.displayName}
                </div>
                <div style={{ fontFamily: F.mono, fontSize: '11px', color: toPlan.color }}>
                  ${toPlan.price.annual}/mo
                </div>
              </div>
            </div>
          </div>

          {/* Credits increase */}
          <div>
            <SectionLabel>What You're Getting</SectionLabel>
            <div style={{
              backgroundColor: C.surface2, border: `1px solid ${C.border}`,
              borderRadius: R.card, padding: S[4],
              display: 'flex', flexDirection: 'column', gap: S[4],
            }}>
              {/* Credits bar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>Agent credits/month</span>
                  <span style={{ fontFamily: F.mono, fontSize: '12px', color: '#3DDC84', fontWeight: 700 }}>
                    {formatCredits(fromCredits)} → {formatCredits(toCredits)}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                    <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, width: '60px' }}>{fromPlan.displayName}</div>
                    <div style={{ flex: 1, height: '5px', borderRadius: R.pill, backgroundColor: C.surface3 }}>
                      <div style={{
                        width: `${Math.round((fromCredits / toCredits) * 100)}%`,
                        height: '100%', borderRadius: R.pill, backgroundColor: C.textMuted,
                      }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                    <div style={{ fontFamily: F.body, fontSize: '11px', color: '#3DDC84', width: '60px' }}>{toPlan.displayName}</div>
                    <div style={{ flex: 1, height: '5px', borderRadius: R.pill, backgroundColor: C.surface3 }}>
                      <div style={{ width: '100%', height: '100%', borderRadius: R.pill, backgroundColor: '#3DDC84' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Seats */}
              {toSeats !== fromSeats && (
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: S[2], borderTop: `1px solid ${C.border}` }}>
                  <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>Team seats</span>
                  <span style={{ fontFamily: F.mono, fontSize: '12px', color: '#3DDC84', fontWeight: 700 }}>
                    {formatSeats(fromSeats)} → {formatSeats(toSeats)}
                  </span>
                </div>
              )}

              {/* New features */}
              {newFeatures.length > 0 && (
                <div style={{ paddingTop: S[2], borderTop: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: S[2] }}>
                  <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, letterSpacing: '0.06em' }}>
                    FEATURES UNLOCKED
                  </div>
                  {newFeatures.map(key => (
                    <div key={key} style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <circle cx="6" cy="6" r="6" fill="rgba(61,220,132,0.15)"/>
                        <path d="M3 6l2 2 4-4" stroke="#3DDC84" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
                        {featName(key)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Pricing breakdown ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
          <SectionLabel>Pricing Breakdown</SectionLabel>

          {/* Billing toggle */}
          <div style={{
            display: 'inline-flex', alignItems: 'center',
            backgroundColor: C.surface2, border: `1px solid ${C.border}`,
            borderRadius: R.pill, padding: '3px', alignSelf: 'flex-start',
          }}>
            {['annual', 'monthly'].map(opt => (
              <button
                key={opt}
                onClick={() => setBilling(opt)}
                style={{
                  padding: `${S[1]} ${S[3]}`,
                  borderRadius: R.pill, border: 'none',
                  fontFamily: F.body, fontSize: '12px', fontWeight: billing === opt ? 600 : 400,
                  color: billing === opt ? (opt === 'annual' ? '#070D09' : C.textPrimary) : C.textSecondary,
                  backgroundColor: billing === opt ? (opt === 'annual' ? '#3DDC84' : C.surface3) : 'transparent',
                  cursor: 'pointer', transition: T.color, whiteSpace: 'nowrap',
                }}
              >
                {opt === 'annual' ? 'Annual' : 'Monthly'}
              </button>
            ))}
          </div>

          {/* Line items */}
          <div style={{
            backgroundColor: C.surface2, border: `1px solid ${C.border}`,
            borderRadius: R.card, overflow: 'hidden',
          }}>
            {/* Plan price */}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: `${S[3]} ${S[4]}`, borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
                {toPlan.displayName} plan
              </span>
              <span style={{ fontFamily: F.mono, fontSize: '13px', color: C.textPrimary }}>
                ${price.toLocaleString()}/mo
              </span>
            </div>
            {/* Billing period */}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: `${S[3]} ${S[4]}`, borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
                Billing: {billing === 'annual' ? `Annual (×12)` : 'Monthly'}
              </span>
              <span style={{ fontFamily: F.mono, fontSize: '13px', color: C.textPrimary }}>
                ${fullCost.toLocaleString()}
              </span>
            </div>
            {/* Proration credit */}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: `${S[3]} ${S[4]}`, borderBottom: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
                  Credit for unused {fromPlan.displayName}
                </span>
                <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>~30 days remaining</span>
              </div>
              <span style={{ fontFamily: F.mono, fontSize: '13px', color: '#3DDC84' }}>
                –${proration.toLocaleString()}
              </span>
            </div>
            {/* Add-ons */}
            {addonsActive.length > 0 && (
              <div style={{ padding: `${S[3]} ${S[4]}`, borderBottom: `1px solid ${C.border}` }}>
                <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, marginBottom: '4px' }}>
                  Add-ons carried over
                </div>
                {addonsActive.map(id => (
                  <div key={id} style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <IconCheck color={C.primary} width={14} height={14} /> {id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                ))}
              </div>
            )}
            {/* Total due */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: `${S[4]} ${S[4]}`,
              backgroundColor: C.surface3,
            }}>
              <span style={{ fontFamily: F.body, fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>
                Total due today
              </span>
              <span style={{ fontFamily: F.mono, fontSize: '20px', fontWeight: 700, color: toPlan.color }}>
                ${dueToday.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Recurring note */}
          <div style={{
            fontFamily: F.body, fontSize: '12px', color: C.textMuted,
            display: 'flex', alignItems: 'center', gap: S[1],
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M6 4v2.5L7.5 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            Then ${price.toLocaleString()}/month starting {renewDate}
          </div>

          {/* CTA */}
          <button
            onClick={goNext}
            style={{
              width: '100%', padding: `${S[4]} ${S[5]}`,
              backgroundColor: '#3DDC84', color: '#070D09',
              border: 'none', borderRadius: R.button,
              fontFamily: F.body, fontSize: '15px', fontWeight: 700,
              cursor: 'pointer', transition: T.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: S[2],
            }}
          >
            Continue
            <ArrowRight size={16} />
          </button>

          {/* Change plan link */}
          <button
            onClick={handleChangeplan}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: F.body, fontSize: '13px', color: C.textMuted,
              textDecoration: 'underline', textUnderlineOffset: '2px',
              padding: 0, alignSelf: 'center',
            }}
          >
            ← Choose a different plan
          </button>
        </div>
      </div>
    </div>
  );
}
