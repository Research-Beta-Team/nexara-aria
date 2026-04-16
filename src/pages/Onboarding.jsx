import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { R, S, T, shadows, ANTARIOUS_AUTH } from '../tokens';
import useStore from '../store/useStore';
import { PLANS } from '../config/plans';
import AntariousLogo from '../components/ui/AntariousLogo';
import OnboardingFreyaPanel from '../components/onboarding/OnboardingFreyaPanel';
import AgentThinking from '../components/agents/AgentThinking';
import { AGENTS } from '../agents/AgentRegistry';
import {
  COMPANY_TYPES,
  getRecommendedPlan,
  getPlanForOnboarding,
  getAllPlansForPicker,
} from '../data/onboardingTiers';

const N = ANTARIOUS_AUTH;

const btnPrimary = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: S[2],
  backgroundColor: N.primary,
  color: N.textInverse,
  border: 'none',
  borderRadius: N.radiusButton,
  padding: `${S[2]} ${S[5]}`,
  fontFamily: N.fontBody,
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: T.color,
  whiteSpace: 'nowrap',
};
const btnSecondary = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: S[2],
  backgroundColor: 'transparent',
  color: N.textPrimary,
  border: `1px solid ${N.border}`,
  borderRadius: N.radiusButton,
  padding: `${S[2]} ${S[5]}`,
  fontFamily: N.fontBody,
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
  transition: T.base,
  whiteSpace: 'nowrap',
};
const btnGhost = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: S[2],
  backgroundColor: 'transparent',
  color: N.textSecondary,
  border: 'none',
  borderRadius: N.radiusButton,
  padding: `${S[2]} ${S[3]}`,
  fontFamily: N.fontBody,
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
  transition: T.color,
  whiteSpace: 'nowrap',
};
const cardStyleN = {
  backgroundColor: N.surface,
  border: `1px solid ${N.border}`,
  borderRadius: N.radiusCard,
  padding: S[6],
};
const inputStyleN = {
  backgroundColor: N.surface2,
  color: N.textPrimary,
  border: `1px solid ${N.border}`,
  borderRadius: N.radiusInput,
  padding: `${S[2]} ${S[3]}`,
  fontFamily: N.fontBody,
  fontSize: '14px',
  width: '100%',
  outline: 'none',
  transition: T.color,
};
const labelStyleN = {
  display: 'block',
  fontFamily: N.fontBody,
  fontSize: '12px',
  fontWeight: 600,
  color: N.textSecondary,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: S[1],
};

const STEPS = [
  { id: 'welcome', title: 'Welcome' },
  { id: 'company', title: 'Company type' },
  { id: 'tier', title: 'Your plan' },
  { id: 'agents', title: 'Your AI team' },
  { id: 'connections', title: 'Connections' },
  { id: 'done', title: "You're set" },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const completeOnboarding = useStore((s) => s.completeOnboarding);
  const setOnboardingSkipped = useStore((s) => s.setOnboardingSkipped);
  const setOnboardingCompanyType = useStore((s) => s.setOnboardingCompanyType);
  const setOnboardingSelectedPlanId = useStore((s) => s.setOnboardingSelectedPlanId);
  const setOnboardingConnections = useStore((s) => s.setOnboardingConnections);
  const setPlan = useStore((s) => s.setPlan);
  const setCreditsIncluded = useStore((s) => s.setCreditsIncluded);
  const setConnectionWebsite = useStore((s) => s.setConnectionWebsite);
  const setConnectionCrm = useStore((s) => s.setConnectionCrm);
  const setConnectionAds = useStore((s) => s.setConnectionAds);

  const [stepIndex, setStepIndex] = useState(0);
  const [companyType, setCompanyType] = useState('');
  const [showAllPlans, setShowAllPlans] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [connWebsite, setConnWebsite] = useState('');
  const [connCrm, setConnCrm] = useState('');
  const [connMeta, setConnMeta] = useState(false);
  const [connLinkedIn, setConnLinkedIn] = useState(false);
  const [connGoogle, setConnGoogle] = useState(false);

  const stepId = STEPS[stepIndex]?.id ?? 'welcome';
  const recommendation = companyType ? getRecommendedPlan(companyType) : null;
  const recommendedPlan = recommendation ? getPlanForOnboarding(recommendation.planId) : null;
  const allPlans = getAllPlansForPicker();

  const handleSkipToDashboard = () => {
    setOnboardingSkipped(true);
    completeOnboarding();
    navigate('/');
  };

  const handleCompanyNext = () => {
    if (companyType) {
      setOnboardingCompanyType(companyType);
      setSelectedPlanId(recommendation?.planId ?? 'starter');
      setStepIndex(2);
    }
  };

  const handleConfirmPlan = (planId) => {
    const plan = PLANS[planId];
    if (plan) {
      setPlan(planId);
      setCreditsIncluded(plan.credits?.included ?? 5000);
      setOnboardingSelectedPlanId(planId);
      setSelectedPlanId(planId);
      setShowAllPlans(false);
      // Step index 3 = agents intro (inserted before connections)
      setStepIndex(3);
    }
  };

  const handleConnectionsFinish = () => {
    setOnboardingConnections({
      website: connWebsite || undefined,
      crm: connCrm || undefined,
      ads: connMeta || connLinkedIn || connGoogle,
    });
    setConnectionWebsite(connWebsite || null);
    setConnectionCrm(connCrm || null);
    setConnectionAds('meta', connMeta);
    setConnectionAds('linkedin', connLinkedIn);
    setConnectionAds('google', connGoogle);
    setStepIndex(5);
  };

  const handleSkipConnections = () => {
    completeOnboarding();
    navigate('/');
  };

  const handleDoneDashboard = () => {
    completeOnboarding();
    navigate('/');
  };

  const handleDoneCreateCampaign = () => {
    navigate('/first-onboarding/freya');
  };

  const handleBack = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  };

  const handleFreyaChip = (chipId) => {
    switch (chipId) {
      case 'get_started':
        setStepIndex(1);
        break;
      case 'skip':
        handleSkipToDashboard();
        break;
      case 'solo':
      case 'startup':
      case 'agency':
      case 'enterprise':
        setCompanyType(chipId);
        break;
      case 'choose_recommended':
        handleConfirmPlan(recommendedPlan?.id ?? 'starter');
        break;
      case 'see_all':
        setShowAllPlans(true);
        break;
      case 'meet_agents':
        setStepIndex(4); // move to connections step
        break;
      case 'finish':
        handleConnectionsFinish();
        break;
      case 'skip_all':
        handleSkipConnections();
        break;
      case 'dashboard':
        handleDoneDashboard();
        break;
      case 'first_campaign':
        handleDoneCreateCampaign();
        break;
      default:
        break;
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: N.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `${S[6]} ${S[4]}`,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '960px',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          gap: S[8],
        }}
      >
        {/* Left: step content */}
        <div style={{ flex: '1 1 480px', minWidth: 280, minHeight: 0 }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[5] }}>
            <div style={{ minWidth: 100 }}>
              {stepIndex > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  style={{ ...btnGhost, fontSize: '13px', color: N.textSecondary }}
                >
                  ← Back
                </button>
              )}
            </div>
            <AntariousLogo variant="dark" height={28} />
            <div style={{ minWidth: 100, display: 'flex', justifyContent: 'flex-end' }}>
              {stepId !== 'welcome' && stepId !== 'done' && (
                <button
                  type="button"
                  onClick={handleSkipToDashboard}
                  style={{ ...btnGhost, fontSize: '12px', color: N.textMuted }}
                >
                  Skip to Dashboard →
                </button>
              )}
            </div>
          </div>

          {/* Progress */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: S[5] }}>
            {STEPS.map((s, i) => (
              <div
                key={s.id}
                style={{
                  flex: 1,
                  height: '4px',
                  borderRadius: R.pill,
                  backgroundColor: i <= stepIndex ? N.primary : N.surface3,
                  opacity: i <= stepIndex ? 1 : 0.5,
                  transition: T.base,
                }}
              />
            ))}
          </div>

          {/* Card */}
          <div
            style={{
              ...cardStyleN,
              padding: S[6],
              boxShadow: shadows.modal,
            }}
          >
          {/* Step: Welcome */}
          {stepId === 'welcome' && (
            <>
              <h1 style={{ fontFamily: N.fontDisplay, fontSize: '22px', fontWeight: 700, color: N.textPrimary, margin: `0 0 ${S[2]} 0` }}>
                Let's set up Antarious for you
              </h1>
              <p style={{ fontFamily: N.fontBody, fontSize: '14px', color: N.textSecondary, margin: `0 0 ${S[5]} 0`, lineHeight: 1.5 }}>
                Takes about 2 minutes. You can skip and configure later.
              </p>
              <div style={{ display: 'flex', gap: S[3] }}>
                <button
                  type="button"
                  onClick={() => setStepIndex(1)}
                  style={{ ...btnPrimary, flex: 1 }}
                >
                  Get started
                </button>
                <button
                  type="button"
                  onClick={handleSkipToDashboard}
                  style={{ ...btnSecondary, flex: 1 }}
                >
                  Skip to Dashboard
                </button>
              </div>
              <p style={{ fontFamily: N.fontBody, fontSize: '12px', color: N.textMuted, marginTop: S[4], textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => navigate('/first-onboarding/freya')}
                  style={{ background: 'none', border: 'none', color: N.primary, cursor: 'pointer', fontWeight: 600, padding: 0, textDecoration: 'underline', textUnderlineOffset: 2 }}
                >
                  Or let Freya build your first campaign →
                </button>
              </p>
            </>
          )}

          {/* Step: Company type */}
          {stepId === 'company' && (
            <>
              <h2 style={{ fontFamily: N.fontDisplay, fontSize: '18px', fontWeight: 700, color: N.textPrimary, margin: `0 0 ${S[2]} 0` }}>
                What best describes you?
              </h2>
              <p style={{ fontFamily: N.fontBody, fontSize: '13px', color: N.textSecondary, margin: `0 0 ${S[4]} 0` }}>
                We'll recommend a plan that fits.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: S[2], marginBottom: S[5] }}>
                {COMPANY_TYPES.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setCompanyType(opt.id)}
                    style={{
                      textAlign: 'left',
                      padding: S[4],
                      borderRadius: R.md,
                      border: `1px solid ${companyType === opt.id ? N.primary : N.border}`,
                      backgroundColor: companyType === opt.id ? N.primaryGlow : N.surface2,
                      fontFamily: N.fontBody,
                      fontSize: '14px',
                      fontWeight: 600,
                      color: N.textPrimary,
                      cursor: 'pointer',
                      transition: T.base,
                    }}
                  >
                    <div>{opt.label}</div>
                    <div style={{ fontSize: '12px', fontWeight: 400, color: N.textSecondary, marginTop: '2px' }}>{opt.sublabel}</div>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={handleCompanyNext}
                disabled={!companyType}
                style={{ ...btnPrimary, width: '100%', opacity: companyType ? 1 : 0.5, cursor: companyType ? 'pointer' : 'default' }}
              >
                Next
              </button>
            </>
          )}

          {/* Step: Tier recommendation */}
          {stepId === 'tier' && (
            <>
              <h2 style={{ fontFamily: N.fontDisplay, fontSize: '18px', fontWeight: 700, color: N.textPrimary, margin: `0 0 ${S[2]} 0` }}>
                We recommend {recommendedPlan?.displayName ?? 'Starter'} for you
              </h2>
              {recommendation?.reasons?.length > 0 && (
                <ul style={{ margin: `0 0 ${S[4]} 0`, paddingLeft: '20px', fontFamily: N.fontBody, fontSize: '13px', color: N.textSecondary, lineHeight: 1.6 }}>
                  {recommendation.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              )}
              {!showAllPlans ? (
                <>
                  <div
                    style={{
                      padding: S[4],
                      borderRadius: R.md,
                      border: `1px solid ${N.border}`,
                      backgroundColor: N.surface2,
                      marginBottom: S[4],
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[2] }}>
                      <span style={{ fontFamily: N.fontDisplay, fontWeight: 700, color: recommendedPlan?.color ?? N.primary }}>{recommendedPlan?.displayName}</span>
                      <span style={{ fontFamily: N.fontMono, fontSize: '13px', color: N.textSecondary }}>
                        ${recommendedPlan?.price?.annual ?? 0}/mo
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: N.textMuted }}>Billed annually</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
                    <button
                      type="button"
                      onClick={() => handleConfirmPlan(recommendedPlan?.id ?? 'starter')}
                      style={{ ...btnPrimary, width: '100%' }}
                    >
                      Choose {recommendedPlan?.displayName ?? 'Starter'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAllPlans(true)}
                      style={{ ...btnSecondary, width: '100%' }}
                    >
                      See other plans
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: S[2], marginBottom: S[4] }}>
                    {allPlans.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleConfirmPlan(p.id)}
                        style={{
                          textAlign: 'left',
                          padding: S[4],
                          borderRadius: R.md,
                          border: `1px solid ${selectedPlanId === p.id ? N.primary : N.border}`,
                          backgroundColor: selectedPlanId === p.id ? N.primaryGlow : N.surface2,
                          fontFamily: N.fontBody,
                          fontSize: '14px',
                          fontWeight: 600,
                          color: N.textPrimary,
                          cursor: 'pointer',
                          transition: T.base,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span style={{ color: p.color }}>{p.displayName}</span>
                        <span style={{ fontFamily: N.fontMono, fontSize: '12px', color: N.textSecondary }}>${p.price?.annual ?? 0}/mo</span>
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAllPlans(false)}
                    style={{ ...btnGhost, width: '100%' }}
                  >
                    ← Back to recommendation
                  </button>
                </>
              )}
            </>
          )}

          {/* Step: Agent team intro */}
          {stepId === 'agents' && (
            <>
              <h2 style={{ fontFamily: N.fontDisplay, fontSize: '18px', fontWeight: 700, color: N.textPrimary, margin: `0 0 ${S[1]} 0` }}>
                Your AI team is ready
              </h2>
              <p style={{ fontFamily: N.fontBody, fontSize: '13px', color: N.textSecondary, margin: `0 0 ${S[4]} 0`, lineHeight: 1.5 }}>
                Freya leads 8 specialist agents — each one an expert in their domain, working together on your GTM engine.
              </p>

              {/* Freya thinking animation */}
              <div style={{ marginBottom: S[4] }}>
                <AgentThinking agentId="freya" task="Briefing your specialist agents…" />
              </div>

              {/* Agent cards grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[2], marginBottom: S[5] }}>
                {Object.values(AGENTS).map((agent) => (
                  <div
                    key={agent.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: S[2],
                      padding: S[3],
                      borderRadius: N.radiusButton,
                      backgroundColor: N.surface2,
                      border: `1px solid ${N.border}`,
                    }}
                  >
                    <div style={{
                      width: '34px', height: '34px', borderRadius: N.radiusButton, flexShrink: 0,
                      backgroundColor: `${agent.color}22`, border: `1px solid ${agent.color}44`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '16px',
                    }}>
                      {agent.avatar}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: N.fontBody, fontSize: '13px', fontWeight: 600, color: N.textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {agent.displayName}
                      </div>
                      <div style={{ fontFamily: N.fontBody, fontSize: '11px', color: N.textMuted, textTransform: 'capitalize' }}>
                        {agent.role}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setStepIndex(4)}
                style={{ ...btnPrimary, width: '100%' }}
              >
                Let's connect your tools →
              </button>
            </>
          )}

          {/* Step: Connections */}
          {stepId === 'connections' && (
            <>
              <h2 style={{ fontFamily: N.fontDisplay, fontSize: '18px', fontWeight: 700, color: N.textPrimary, margin: `0 0 ${S[2]} 0` }}>
                Connect your tools (optional)
              </h2>
              <p style={{ fontFamily: N.fontBody, fontSize: '13px', color: N.textSecondary, margin: `0 0 ${S[4]} 0` }}>
                You can skip and add these anytime from Settings.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: S[4], marginBottom: S[5] }}>
                <div>
                  <label style={labelStyleN}>Company website</label>
                  <input
                    type="url"
                    value={connWebsite}
                    onChange={(e) => setConnWebsite(e.target.value)}
                    placeholder="https://..."
                    style={inputStyleN}
                  />
                </div>
                <div>
                  <label style={labelStyleN}>CRM</label>
                  <input
                    type="text"
                    value={connCrm}
                    onChange={(e) => setConnCrm(e.target.value)}
                    placeholder="HubSpot, Salesforce, Pipedrive — Coming soon"
                    style={{ ...inputStyleN, opacity: 0.8 }}
                    disabled
                  />
                  <div style={{ fontSize: '11px', color: N.textMuted, marginTop: S[1] }}>Coming soon</div>
                </div>
                <div>
                  <div style={labelStyleN}>Ads & channels</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
                    {['meta', 'linkedin', 'google'].map((platform) => {
                      const label = platform === 'meta' ? 'Meta' : platform === 'linkedin' ? 'LinkedIn' : 'Google Ads';
                      const checked = platform === 'meta' ? connMeta : platform === 'linkedin' ? connLinkedIn : connGoogle;
                      const setChecked = platform === 'meta' ? setConnMeta : platform === 'linkedin' ? setConnLinkedIn : setConnGoogle;
                      return (
                        <label
                          key={platform}
                          style={{ display: 'flex', alignItems: 'center', gap: S[2], fontFamily: N.fontBody, fontSize: '13px', color: N.textSecondary, cursor: 'default' }}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => setChecked(e.target.checked)}
                            style={{ accentColor: N.primary }}
                          />
                          {label} (placeholder)
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: S[3] }}>
                <button type="button" onClick={handleConnectionsFinish} style={{ ...btnPrimary, flex: 1 }}>
                  Finish setup
                </button>
                <button type="button" onClick={handleSkipConnections} style={{ ...btnSecondary, flex: 1 }}>
                  Skip all
                </button>
              </div>
            </>
          )}

          {/* Step: Done */}
          {stepId === 'done' && (
            <>
              <h2 style={{ fontFamily: N.fontDisplay, fontSize: '18px', fontWeight: 700, color: N.textPrimary, margin: `0 0 ${S[2]} 0` }}>
                You're all set
              </h2>
              <p style={{ fontFamily: N.fontBody, fontSize: '13px', color: N.textSecondary, margin: `0 0 ${S[5]} 0` }}>
                You're on {allPlans.find((p) => p.id === selectedPlanId)?.displayName ?? 'your plan'}. Add connections anytime in Settings.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
                <button type="button" onClick={handleDoneDashboard} style={{ ...btnPrimary, width: '100%' }}>
                  Go to Dashboard
                </button>
                <button type="button" onClick={handleDoneCreateCampaign} style={{ ...btnSecondary, width: '100%' }}>
                  Create your first campaign with Freya
                </button>
              </div>
            </>
          )}
        </div>

        <p style={{ textAlign: 'center', fontFamily: N.fontBody, fontSize: '12px', color: N.textMuted, marginTop: S[4] }}>
          Antarious · GTM AI OS
        </p>
        </div>

        {/* Right: Freya assistant */}
        <div
          style={{
            flex: '0 0 320px',
            minWidth: 280,
            position: 'sticky',
            top: S[6],
          }}
        >
          <OnboardingFreyaPanel stepId={stepId} onChipClick={handleFreyaChip} />
        </div>
      </div>
    </div>
  );
}
