import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { C, F, R, S, T, btn, cardStyle, inputStyle, labelStyle, shadows } from '../tokens';
import useStore from '../store/useStore';
import { PLANS } from '../config/plans';
import {
  COMPANY_TYPES,
  getRecommendedPlan,
  getPlanForOnboarding,
  getAllPlansForPicker,
} from '../data/onboardingTiers';

const STEPS = [
  { id: 'welcome', title: 'Welcome' },
  { id: 'company', title: 'Company type' },
  { id: 'tier', title: 'Your plan' },
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
    setStepIndex(4);
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
    completeOnboarding();
    navigate('/campaigns/new');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: C.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `${S[6]} ${S[4]}`,
      }}
    >
      <div style={{ width: '100%', maxWidth: '560px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[5] }}>
          <div style={{ fontFamily: F.display, fontSize: '24px', fontWeight: 800, color: C.primary, letterSpacing: '-0.02em' }}>
            NEXARA
          </div>
          {stepId !== 'welcome' && stepId !== 'done' && (
            <button
              type="button"
              onClick={handleSkipToDashboard}
              style={{ ...btn.ghost, fontSize: '12px', color: C.textMuted }}
            >
              Skip to Dashboard →
            </button>
          )}
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
                backgroundColor: i <= stepIndex ? C.primary : C.surface3,
                opacity: i <= stepIndex ? 1 : 0.5,
                transition: T.base,
              }}
            />
          ))}
        </div>

        {/* Card */}
        <div
          style={{
            ...cardStyle,
            padding: S[6],
            boxShadow: shadows.modal,
          }}
        >
          {/* Step: Welcome */}
          {stepId === 'welcome' && (
            <>
              <h1 style={{ fontFamily: F.display, fontSize: '22px', fontWeight: 700, color: C.textPrimary, margin: `0 0 ${S[2]} 0` }}>
                Let's set up NEXARA for you
              </h1>
              <p style={{ fontFamily: F.body, fontSize: '14px', color: C.textSecondary, margin: `0 0 ${S[5]} 0`, lineHeight: 1.5 }}>
                Takes about 2 minutes. You can skip and configure later.
              </p>
              <div style={{ display: 'flex', gap: S[3] }}>
                <button
                  type="button"
                  onClick={() => setStepIndex(1)}
                  style={{ ...btn.primary, flex: 1 }}
                >
                  Get started
                </button>
                <button
                  type="button"
                  onClick={handleSkipToDashboard}
                  style={{ ...btn.secondary, flex: 1 }}
                >
                  Skip to Dashboard
                </button>
              </div>
            </>
          )}

          {/* Step: Company type */}
          {stepId === 'company' && (
            <>
              <h2 style={{ fontFamily: F.display, fontSize: '18px', fontWeight: 700, color: C.textPrimary, margin: `0 0 ${S[2]} 0` }}>
                What best describes you?
              </h2>
              <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: `0 0 ${S[4]} 0` }}>
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
                      border: `1px solid ${companyType === opt.id ? C.primary : C.border}`,
                      backgroundColor: companyType === opt.id ? C.primaryGlow : C.surface2,
                      fontFamily: F.body,
                      fontSize: '14px',
                      fontWeight: 600,
                      color: C.textPrimary,
                      cursor: 'pointer',
                      transition: T.base,
                    }}
                  >
                    <div>{opt.label}</div>
                    <div style={{ fontSize: '12px', fontWeight: 400, color: C.textSecondary, marginTop: '2px' }}>{opt.sublabel}</div>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={handleCompanyNext}
                disabled={!companyType}
                style={{ ...btn.primary, width: '100%', opacity: companyType ? 1 : 0.5, cursor: companyType ? 'pointer' : 'default' }}
              >
                Next
              </button>
            </>
          )}

          {/* Step: Tier recommendation */}
          {stepId === 'tier' && (
            <>
              <h2 style={{ fontFamily: F.display, fontSize: '18px', fontWeight: 700, color: C.textPrimary, margin: `0 0 ${S[2]} 0` }}>
                We recommend {recommendedPlan?.displayName ?? 'Starter'} for you
              </h2>
              {recommendation?.reasons?.length > 0 && (
                <ul style={{ margin: `0 0 ${S[4]} 0`, paddingLeft: '20px', fontFamily: F.body, fontSize: '13px', color: C.textSecondary, lineHeight: 1.6 }}>
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
                      border: `1px solid ${C.border}`,
                      backgroundColor: C.surface2,
                      marginBottom: S[4],
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[2] }}>
                      <span style={{ fontFamily: F.display, fontWeight: 700, color: recommendedPlan?.color ?? C.primary }}>{recommendedPlan?.displayName}</span>
                      <span style={{ fontFamily: F.mono, fontSize: '13px', color: C.textSecondary }}>
                        ${recommendedPlan?.price?.annual ?? 0}/mo
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: C.textMuted }}>Billed annually</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
                    <button
                      type="button"
                      onClick={() => handleConfirmPlan(recommendedPlan?.id ?? 'starter')}
                      style={{ ...btn.primary, width: '100%' }}
                    >
                      Choose {recommendedPlan?.displayName ?? 'Starter'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAllPlans(true)}
                      style={{ ...btn.secondary, width: '100%' }}
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
                          border: `1px solid ${selectedPlanId === p.id ? C.primary : C.border}`,
                          backgroundColor: selectedPlanId === p.id ? C.primaryGlow : C.surface2,
                          fontFamily: F.body,
                          fontSize: '14px',
                          fontWeight: 600,
                          color: C.textPrimary,
                          cursor: 'pointer',
                          transition: T.base,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span style={{ color: p.color }}>{p.displayName}</span>
                        <span style={{ fontFamily: F.mono, fontSize: '12px', color: C.textSecondary }}>${p.price?.annual ?? 0}/mo</span>
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAllPlans(false)}
                    style={{ ...btn.ghost, width: '100%' }}
                  >
                    ← Back to recommendation
                  </button>
                </>
              )}
            </>
          )}

          {/* Step: Connections */}
          {stepId === 'connections' && (
            <>
              <h2 style={{ fontFamily: F.display, fontSize: '18px', fontWeight: 700, color: C.textPrimary, margin: `0 0 ${S[2]} 0` }}>
                Connect your tools (optional)
              </h2>
              <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: `0 0 ${S[4]} 0` }}>
                You can skip and add these anytime from Settings.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: S[4], marginBottom: S[5] }}>
                <div>
                  <label style={labelStyle}>Company website</label>
                  <input
                    type="url"
                    value={connWebsite}
                    onChange={(e) => setConnWebsite(e.target.value)}
                    placeholder="https://..."
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>CRM</label>
                  <input
                    type="text"
                    value={connCrm}
                    onChange={(e) => setConnCrm(e.target.value)}
                    placeholder="HubSpot, Salesforce, Pipedrive — Coming soon"
                    style={{ ...inputStyle, opacity: 0.8 }}
                    disabled
                  />
                  <div style={{ fontSize: '11px', color: C.textMuted, marginTop: S[1] }}>Coming soon</div>
                </div>
                <div>
                  <div style={labelStyle}>Ads & channels</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
                    {['meta', 'linkedin', 'google'].map((platform) => {
                      const label = platform === 'meta' ? 'Meta' : platform === 'linkedin' ? 'LinkedIn' : 'Google Ads';
                      const checked = platform === 'meta' ? connMeta : platform === 'linkedin' ? connLinkedIn : connGoogle;
                      const setChecked = platform === 'meta' ? setConnMeta : platform === 'linkedin' ? setConnLinkedIn : setConnGoogle;
                      return (
                        <label
                          key={platform}
                          style={{ display: 'flex', alignItems: 'center', gap: S[2], fontFamily: F.body, fontSize: '13px', color: C.textSecondary, cursor: 'default' }}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => setChecked(e.target.checked)}
                            style={{ accentColor: C.primary }}
                          />
                          {label} (placeholder)
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: S[3] }}>
                <button type="button" onClick={handleConnectionsFinish} style={{ ...btn.primary, flex: 1 }}>
                  Finish setup
                </button>
                <button type="button" onClick={handleSkipConnections} style={{ ...btn.secondary, flex: 1 }}>
                  Skip all
                </button>
              </div>
            </>
          )}

          {/* Step: Done */}
          {stepId === 'done' && (
            <>
              <h2 style={{ fontFamily: F.display, fontSize: '18px', fontWeight: 700, color: C.textPrimary, margin: `0 0 ${S[2]} 0` }}>
                You're all set
              </h2>
              <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: `0 0 ${S[5]} 0` }}>
                You're on {allPlans.find((p) => p.id === selectedPlanId)?.displayName ?? 'your plan'}. Add connections anytime in Settings.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
                <button type="button" onClick={handleDoneDashboard} style={{ ...btn.primary, width: '100%' }}>
                  Go to Dashboard
                </button>
                <button type="button" onClick={handleDoneCreateCampaign} style={{ ...btn.secondary, width: '100%' }}>
                  Create first campaign
                </button>
              </div>
            </>
          )}
        </div>

        <p style={{ textAlign: 'center', fontFamily: F.body, fontSize: '12px', color: C.textMuted, marginTop: S[4] }}>
          NEXARA · GTM AI OS
        </p>
      </div>
    </div>
  );
}
