import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PLANS } from '../../config/plans';
import useStore from '../../store/useStore';
import useToast from '../../hooks/useToast';
import { C, F, R, S, T } from '../../tokens';
import { FEATURE_ICON_MAP, IconZap, IconCheck } from '../ui/Icons';

// ── Feature descriptions for unlocked cards ───
const FEAT_DESC = {
  competitiveIntel:      { desc: 'Real-time competitor tracking and positioning analysis.' },
  intentSignals:         { desc: 'Person-level intent data from G2, Bombora, and web visits.' },
  abmEngine:             { desc: 'Target named accounts with personalised multi-channel plays.' },
  ariaVoice:             { desc: 'AI-powered voice calls and conversational SDR automation.' },
  predictiveForecasting: { desc: 'Revenue forecasting powered by your pipeline data.' },
  whiteLabel:            { desc: 'Deliver NEXARA under your own brand to clients.' },
  apiAccess:             { desc: 'Programmatic access to all NEXARA data and actions.' },
  customAgents:          { desc: 'Build bespoke AI agents trained on your workflows.' },
  dataWarehouseSync:     { desc: 'Sync your GTM data to Snowflake, BigQuery, or Redshift.' },
  crossClientAnalytics:  { desc: 'Aggregate analytics across your entire client portfolio.' },
  subBilling:            { desc: 'Bill clients directly through NEXARA.' },
  advancedAnalytics:     { desc: 'Deep-dive analytics with cohort analysis and attribution.' },
  unifiedInbox:          { desc: 'All outreach channels in one unified conversation view.' },
  clientPortal:          { desc: 'Branded client portals with live reporting dashboards.' },
  ganttPlan:             { desc: 'Full campaign Gantt view with task dependencies.' },
  pipelineManager:      { desc: 'Visual pipeline management with AI-assisted forecasting.' },
  customerSuccess:       { desc: 'Automated CS workflows for onboarding and retention.' },
  linkedinOutreach:      { desc: 'AI-powered LinkedIn outreach at scale.' },
  whatsappOutreach:      { desc: 'WhatsApp outreach with AI conversation management.' },
  googleAdsManagement:   { desc: 'Automated Google Ads optimisation and reporting.' },
  linkedinAdsManagement: { desc: 'LinkedIn Ads management and performance tracking.' },
  outcomeBilling:        { desc: 'Pay-for-performance billing tied to real GTM outcomes.' },
};

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
  subBilling:            'Sub-Billing',
  advancedAnalytics:     'Advanced Analytics',
  unifiedInbox:          'Unified Inbox',
  clientPortal:          'Client Portals',
  ganttPlan:             'Gantt Timeline',
  pipelineManager:       'Pipeline Manager',
  customerSuccess:       'Customer Success',
  linkedinOutreach:      'LinkedIn Outreach',
  whatsappOutreach:      'WhatsApp Outreach',
  googleAdsManagement:   'Google Ads Management',
  linkedinAdsManagement: 'LinkedIn Ads Management',
  outcomeBilling:        'Outcome Billing',
};

// ── Next steps config ─────────────────────────
const NEXT_STEPS = {
  'starter→growth': [
    'Set up your LinkedIn agent and start warm outreach →',
    'Try ABM Engine — target your top 5 named accounts →',
    'Connect your CRM to unlock pipeline tracking →',
  ],
  'growth→scale': [
    'Try Competitive Intel — see what Apollo and HubSpot are doing →',
    'Set up Predictive Forecasting for Q2 pipeline →',
    'Configure partial white-label for your client portals →',
  ],
  'scale→agency': [
    'Set up your custom domain for white-label →',
    'Configure full white-label branding across client portals →',
    'Invite your first client team members and set roles →',
  ],
};

function getNewFeatures(fromId, toId) {
  const fromF = PLANS[fromId]?.features ?? {};
  const toF   = PLANS[toId]?.features ?? {};
  return Object.keys(toF).filter(k => toF[k] && !fromF[k]);
}

function formatCredits(n) {
  if (n >= 1_000_000) return `${n / 1_000_000}M`;
  if (n >= 1_000)     return `${(n / 1_000).toLocaleString()}K`;
  return n.toLocaleString();
}

// ── Animated checkmark ────────────────────────
function AnimatedCheck({ color }) {
  const [scale, setScale] = useState(0.3);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      setScale(1);
      setOpacity(1);
    }, 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      width: '80px', height: '80px',
      borderRadius: '50%',
      backgroundColor: `${color}20`,
      border: `2px solid ${color}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transform: `scale(${scale})`,
      opacity,
      transition: 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease',
    }}>
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path d="M8 18l7 7 13-13" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

// ── CheckoutStep4 ─────────────────────────────
export default function CheckoutStep4({ fromPlanId, toPlanId, onClose }) {
  const navigate         = useNavigate();
  const toast            = useToast();
  const completeUpgrade  = useStore(s => s.completeUpgrade);

  const toPlan = PLANS[toPlanId] ?? PLANS.growth;
  const newFeatures = getNewFeatures(fromPlanId, toPlanId);
  const unlockedCards = newFeatures.slice(0, 3);
  const nextStepsKey  = `${fromPlanId}→${toPlanId}`;
  const nextSteps     = NEXT_STEPS[nextStepsKey] ?? NEXT_STEPS['starter→growth'];

  // Update store on mount — makes entire app reflect new plan instantly
  useEffect(() => {
    completeUpgrade(toPlanId, toPlan.credits.included);
  }, []); // eslint-disable-line

  const handleDashboard = () => {
    onClose();
    navigate('/');
  };

  const handleInvite = () => {
    onClose();
    navigate('/team');
    toast.info('Opening team management...');
  };

  return (
    <div style={{
      padding: S[8],
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: S[6],
      textAlign: 'center',
    }}>
      {/* Animated checkmark */}
      <AnimatedCheck color={toPlan.color} />

      {/* Heading */}
      <div>
        <div style={{
          fontFamily: F.display, fontSize: '32px', fontWeight: 800,
          color: toPlan.color, letterSpacing: '-0.02em', lineHeight: 1.1,
        }}>
          You're now on {toPlan.displayName}!
        </div>
        <div style={{ display: 'flex', gap: S[3], justifyContent: 'center', marginTop: S[3], flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: F.mono, fontSize: '13px', fontWeight: 700,
            color: '#3DDC84', backgroundColor: 'rgba(61,220,132,0.12)',
            border: '1px solid rgba(61,220,132,0.25)', borderRadius: R.pill,
            padding: `3px ${S[3]}`,
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            <IconZap color="#3DDC84" w={14} /> {formatCredits(toPlan.credits.included)} credits added
          </span>
          <span style={{
            fontFamily: F.body, fontSize: '13px', color: C.textSecondary,
            backgroundColor: C.surface2, border: `1px solid ${C.border}`,
            borderRadius: R.pill, padding: `3px ${S[3]}`,
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><IconCheck color={C.primary} width={16} height={16} /> New features are live immediately</span>
          </span>
        </div>
      </div>

      {/* What's unlocked cards */}
      {unlockedCards.length > 0 && (
        <div style={{ width: '100%', textAlign: 'left' }}>
          <div style={{
            fontFamily: F.mono, fontSize: '11px', fontWeight: 700,
            color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase',
            marginBottom: S[3], textAlign: 'center',
          }}>
            What's Unlocked
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: S[3] }}>
            {unlockedCards.map(key => {
              const meta = FEAT_DESC[key] ?? { desc: 'Full access to this feature.' };
              const IconComp = FEATURE_ICON_MAP[key];
              return (
                <div key={key} style={{
                  backgroundColor: C.surface2,
                  border: `1px solid ${C.border}`,
                  borderRadius: R.card,
                  padding: S[4],
                  display: 'flex', flexDirection: 'column', gap: S[2],
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>{IconComp ? <IconComp color={toPlan.color} w={22} /> : null}</div>
                  <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 700, color: toPlan.color }}>
                    {FEAT_NAMES[key] ?? key}
                  </div>
                  <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, lineHeight: 1.5 }}>
                    {meta.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Next steps */}
      <div style={{
        width: '100%', textAlign: 'left',
        backgroundColor: C.surface2, border: `1px solid ${C.border}`,
        borderRadius: R.card, padding: S[5],
      }}>
        <div style={{
          fontFamily: F.mono, fontSize: '11px', fontWeight: 700,
          color: C.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase',
          marginBottom: S[3],
        }}>
          Suggested Next Steps
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
          {nextSteps.map((step, i) => (
            <button
              key={i}
              onClick={() => toast.info(`Opening: ${step.replace(' →', '')} (mock)`)}
              style={{
                display: 'flex', alignItems: 'center', gap: S[3],
                padding: `${S[2]} ${S[3]}`,
                backgroundColor: 'transparent', border: 'none',
                borderRadius: R.sm, cursor: 'pointer',
                textAlign: 'left', transition: T.color,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                <path d="M3 7h8M8 4l3 3-3 3" stroke={toPlan.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
                {step}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: S[3] }}>
        <button
          onClick={handleDashboard}
          style={{
            width: '100%', padding: `${S[4]} ${S[5]}`,
            backgroundColor: '#3DDC84', color: '#070D09',
            border: 'none', borderRadius: R.button,
            fontFamily: F.body, fontSize: '15px', fontWeight: 700,
            cursor: 'pointer', transition: T.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: S[2],
          }}
        >
          Go to Dashboard →
        </button>
        <button
          onClick={handleInvite}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: F.body, fontSize: '13px', color: C.textSecondary,
            textDecoration: 'underline', textUnderlineOffset: '2px',
          }}
        >
          Invite your team
        </button>
      </div>
    </div>
  );
}
