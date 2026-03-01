import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { C, F, R, S, btn } from '../tokens';
import useToast from '../hooks/useToast';
import WizardProgress from '../components/wizard/WizardProgress';
import WizardAriaSidebar from '../components/wizard/WizardAriaSidebar';
import WizardStep1 from '../components/wizard/WizardStep1';
import WizardStep2 from '../components/wizard/WizardStep2';
import WizardStep3 from '../components/wizard/WizardStep3';
import WizardStep4 from '../components/wizard/WizardStep4';
import WizardStep5 from '../components/wizard/WizardStep5';
import WizardStep6 from '../components/wizard/WizardStep6';
import WizardStep7 from '../components/wizard/WizardStep7';

const TOTAL_STEPS = 7;
const STEP_LABELS = ['Basics', 'ICP', 'Channels', 'Knowledge', 'Team', 'Workflow', 'Review'];

const DEFAULT_DATA = {
  name: '', type: 'demand_gen', goalMetric: 'leads', target: '', budget: '', deadline: '', client: '',
  jobTitles: [], companySize: [], industries: [], geographies: [], exclusions: '',
  channels: ['linkedin'],
  kbDocs: [],
  team: {},
  approvalGates: { contentApproval: false, budgetChanges: true, escalationAlerts: true, weeklyReport: true, prospectReplies: true },
  escalationRouting: 'owner',
  reportingCadence: 'weekly',
};

function validate(step, data) {
  const errors = {};
  if (step === 1) {
    if (!data.name?.trim())       errors.name     = 'Campaign name is required.';
    if (!data.type)               errors.type     = 'Select a campaign type.';
    if (!data.target)             errors.target   = 'Enter a target number.';
    if (!data.budget)             errors.budget   = 'Enter a budget.';
    if (!data.client?.trim())     errors.client   = 'Client name is required.';
  }
  if (step === 2) {
    if (!data.jobTitles?.length)  errors.jobTitles = 'Add at least one job title.';
  }
  if (step === 3) {
    if (!data.channels?.length)   errors.channels  = 'Select at least one channel.';
  }
  if (step === 5) {
    if (!data.team?.owner)        errors.owner     = 'Campaign Owner is required.';
  }
  return errors;
}

function DeployAnimation({ campaignName, onDone }) {
  const [phase, setPhase] = useState(0);

  useState(() => {
    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 1400);
    const t3 = setTimeout(() => setPhase(3), 2200);
    const t4 = setTimeout(() => onDone(), 3100);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  });

  const LINES = [
    'Briefing ARIA agents…',
    'Loading ICP and KB docs…',
    'Activating channel pipelines…',
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      backgroundColor: 'rgba(9,11,17,0.97)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: S[4],
    }}>
      <div style={{ position: 'relative' }}>
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
          <circle cx="28" cy="28" r="26" stroke={C.primary} strokeWidth="1.5" strokeDasharray="4 3"
            style={{ animation: 'wzSpin 8s linear infinite', transformOrigin: 'center' }}/>
          <circle cx="28" cy="28" r="16" stroke={C.primary} strokeWidth="1.5"/>
          <circle cx="28" cy="28" r="6"  stroke={C.primary} strokeWidth="1.5"/>
          <circle cx="28" cy="28" r="2.5" fill={C.primary}/>
        </svg>
        <div style={{
          position: 'absolute', top: '-4px', right: '-4px',
          width: '12px', height: '12px', borderRadius: '50%',
          backgroundColor: C.primary, boxShadow: `0 0 12px ${C.primary}`,
          animation: 'wzPulse 1s ease-in-out infinite',
        }}/>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: F.display, fontSize: '20px', fontWeight: 800, color: C.textPrimary, letterSpacing: '-0.02em' }}>
          Deploying Agents
        </div>
        <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, marginTop: S[1] }}>
          {campaignName}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: S[2], marginTop: S[2], width: '280px' }}>
        {LINES.map((label, i) => {
          const active = phase === i + 1;
          const done   = phase > i + 1;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
              <div style={{
                width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                border: `1.5px solid ${done || active ? C.primary : C.border}`,
                backgroundColor: done ? C.primary : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.3s ease',
                boxShadow: active ? `0 0 8px ${C.primary}` : 'none',
              }}>
                {done && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5 3.5-4" stroke={C.bg} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span style={{
                fontFamily: F.body, fontSize: '13px', transition: 'color 0.3s ease',
                color: done ? C.textPrimary : active ? C.primary : C.textMuted,
              }}>
                {label}
              </span>
              {active && (
                <div style={{ display: 'flex', gap: '3px', marginLeft: 'auto' }}>
                  {[0, 1, 2].map((d) => (
                    <div key={d} style={{
                      width: '4px', height: '4px', borderRadius: '50%', backgroundColor: C.primary,
                      animation: `wzDot 0.9s ease-in-out ${d * 0.2}s infinite`,
                    }}/>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes wzSpin    { to { transform: rotate(360deg); } }
        @keyframes wzPulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.75)} }
        @keyframes wzDot     { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1)} }
      `}</style>
    </div>
  );
}

export default function CampaignWizard() {
  const navigate  = useNavigate();
  const toast     = useToast();

  const [step, setStep]         = useState(1);
  const [data, setData]         = useState(DEFAULT_DATA);
  const [errors, setErrors]     = useState({});
  const [deploying, setDeploying] = useState(false);

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const e = { ...prev }; delete e[field]; return e; });
  };

  const handleNext = () => {
    const errs = validate(step, data);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLaunch = () => {
    setDeploying(true);
  };

  const handleDeployDone = () => {
    toast.success(`Campaign "${data.name || 'New Campaign'}" launched! ARIA agents are live.`);
    navigate('/campaigns');
  };

  const STEP_COMPONENTS = {
    1: <WizardStep1 data={data} onChange={handleChange} errors={errors} />,
    2: <WizardStep2 data={data} onChange={handleChange} errors={errors} />,
    3: <WizardStep3 data={data} onChange={handleChange} errors={errors} />,
    4: <WizardStep4 data={data} onChange={handleChange} errors={errors} />,
    5: <WizardStep5 data={data} onChange={handleChange} errors={errors} />,
    6: <WizardStep6 data={data} onChange={handleChange} errors={errors} />,
    7: <WizardStep7 data={data} />,
  };

  const isLastStep = step === TOTAL_STEPS;

  return (
    <>
      {deploying && <DeployAnimation campaignName={data.name || 'New Campaign'} onDone={handleDeployDone} />}

      <div style={{ minHeight: '100vh', backgroundColor: C.bg, padding: `${S[6]} ${S[6]} ${S[8]}` }}>

        {/* Page header */}
        <div style={{ marginBottom: S[6] }}>
          <button
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: F.body, fontSize: '12px', color: C.textMuted,
              marginBottom: S[3], display: 'flex', alignItems: 'center', gap: S[1],
              padding: 0,
            }}
            onClick={() => navigate('/campaigns')}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Campaigns
          </button>
          <h1 style={{ fontFamily: F.display, fontSize: '24px', fontWeight: 800, color: C.textPrimary, margin: 0, letterSpacing: '-0.03em' }}>
            New Campaign
          </h1>
          <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: `${S[1]} 0 0` }}>
            Configure your campaign and deploy ARIA agents to execute it autonomously.
          </p>
        </div>

        {/* Progress */}
        <WizardProgress currentStep={step} totalSteps={TOTAL_STEPS} labels={STEP_LABELS} />

        {/* Content row */}
        <div style={{ display: 'flex', gap: S[6], alignItems: 'flex-start', marginTop: S[6] }}>

          {/* Form card */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              backgroundColor: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: R.card,
              padding: S[6],
            }}>
              {STEP_COMPONENTS[step]}
            </div>

            {/* Navigation row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: S[4] }}>
              <button
                style={{
                  fontFamily: F.body, fontSize: '13px', fontWeight: 600,
                  color: C.textSecondary, backgroundColor: C.surface2,
                  border: `1px solid ${C.border}`, borderRadius: R.button,
                  padding: `${S[2]} ${S[4]}`, cursor: 'pointer',
                  visibility: step === 1 ? 'hidden' : 'visible',
                }}
                onClick={handleBack}
              >
                ← Back
              </button>

              <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>
                Step {step} / {TOTAL_STEPS}
              </span>

              {isLastStep ? (
                <button
                  style={{
                    fontFamily: F.body, fontSize: '14px', fontWeight: 700,
                    color: C.bg, backgroundColor: C.primary,
                    border: 'none', borderRadius: R.button,
                    padding: `${S[2]} ${S[6]}`, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: S[2],
                    boxShadow: `0 0 16px rgba(61,220,132,0.4)`,
                  }}
                  onClick={handleLaunch}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1l1.8 3.7 4.2.6-3 3 .7 4.1L7 10.5l-3.7 1.9.7-4.1L1 5.3l4.2-.6L7 1z" fill="currentColor"/>
                  </svg>
                  Launch Campaign
                </button>
              ) : (
                <button
                  style={{
                    fontFamily: F.body, fontSize: '13px', fontWeight: 600,
                    color: C.bg, backgroundColor: C.primary,
                    border: 'none', borderRadius: R.button,
                    padding: `${S[2]} ${S[5]}`, cursor: 'pointer',
                  }}
                  onClick={handleNext}
                >
                  Next →
                </button>
              )}
            </div>
          </div>

          {/* ARIA sidebar */}
          <WizardAriaSidebar step={step} />
        </div>
      </div>
    </>
  );
}
