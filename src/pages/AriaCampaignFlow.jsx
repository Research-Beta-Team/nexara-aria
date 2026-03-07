import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { C, F, R, S, T, btn, shadows } from '../tokens';
import useToast from '../hooks/useToast';
import useStore from '../store/useStore';
import { campaigns } from '../data/campaigns';
import ConnectAccountModal from '../components/social/ConnectAccountModal';
import { IconLinkedIn, IconFacebook, IconInstagram, IconWhatsApp } from '../components/ui/Icons';

const CHANNEL_OPTIONS = [
  { id: 'email', label: 'Email', desc: 'Sequences and outreach' },
  { id: 'linkedin', label: 'LinkedIn', desc: 'Organic and ads' },
  { id: 'meta', label: 'Meta', desc: 'Facebook & Instagram ads' },
  { id: 'google', label: 'Google Ads', desc: 'Search and display' },
];

const STEPS = [
  { id: 'goal', title: 'Goal', short: 'Goal' },
  { id: 'learn', title: 'Learn from past', short: 'Past' },
  { id: 'icp', title: 'Who to target', short: 'ICP' },
  { id: 'channels', title: 'Channels', short: 'Channels' },
  { id: 'access', title: 'Content access', short: 'Access' },
  { id: 'fetch', title: 'Fetch content', short: 'Fetch' },
  { id: 'ready', title: 'Ready', short: 'Ready' },
];

function StepIndicator({ currentStep, steps }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
      {steps.map((s, i) => {
        const isActive = i === currentStep;
        const isDone = i < currentStep;
        return (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: F.mono,
              fontSize: 11,
              fontWeight: 700,
              backgroundColor: isActive ? C.primary : isDone ? C.primary : C.surface3,
              color: isActive || isDone ? C.bg : C.textMuted,
              border: `2px solid ${isActive ? C.primary : isDone ? C.primary : C.border}`,
              transition: T.base,
            }}>
              {isDone ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <div style={{
              fontFamily: F.body,
              fontSize: 13,
              fontWeight: isActive ? 700 : 500,
              color: isActive ? C.textPrimary : isDone ? C.textSecondary : C.textMuted,
            }}>
              {s.title}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AriaCampaignFlow() {
  const navigate = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [campaignName, setCampaignName] = useState('');
  const [objective, setObjective] = useState('');
  const [previousCampaignId, setPreviousCampaignId] = useState('');
  const [icpChoice, setIcpChoice] = useState('existing'); // existing | builder | aria
  const [channels, setChannels] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showSkipWarning, setShowSkipWarning] = useState(false);

  const connectedAccounts = useStore((s) => s.connectedAccounts);
  const dashboardCampaignFiles = useStore((s) => s.dashboardCampaignFiles) || [];
  const clearDashboardCampaignFiles = useStore((s) => s.clearDashboardCampaignFiles);

  const stepId = STEPS[step]?.id ?? 'goal';

  useEffect(() => {
    return () => { clearDashboardCampaignFiles(); };
  }, [clearDashboardCampaignFiles]);

  const toggleChannel = (id) => {
    setChannels((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  };

  const canProceed = () => {
    if (stepId === 'goal') return campaignName.trim() && objective.trim();
    if (stepId === 'channels') return channels.length > 0;
    return true;
  };

  const handleNext = () => {
    if (!canProceed() && (stepId === 'goal' || stepId === 'channels')) {
      if (stepId === 'goal') toast.info('Enter campaign name and objective.');
      if (stepId === 'channels') toast.info('Select at least one channel.');
      return;
    }
    if (stepId === 'access' && showSkipWarning) return;
    if (stepId === 'fetch') {
      setFetching(true);
      setTimeout(() => {
        setFetching(false);
        toast.success('Content fetched. Freya will use it for strategy and plan.');
        setStep((s) => Math.min(s + 1, STEPS.length - 1));
      }, 2000);
      return;
    }
    if (step < STEPS.length - 1) setStep((s) => s + 1);
  };

  const handleBack = () => {
    setShowSkipWarning(false);
    setStep((s) => Math.max(0, s - 1));
  };

  const handleContinueToStrategy = () => {
    const campaignId = campaigns[0]?.id ?? 'c1';
    navigate(`/campaigns/${campaignId}?tab=strategy&from_aria=1`);
    toast.success('Add or confirm strategy — then Freya will generate your plan.');
  };

  const handleSkipAccess = () => setShowSkipWarning(true);
  const confirmSkipAccess = () => {
    setShowSkipWarning(false);
    setStep((s) => s + 1);
    toast.info('Skipped. You can connect accounts later from Social Media.');
  };

  const ariaTip = {
    goal: 'A clear goal helps Freya suggest the right channels and messaging.',
    learn: 'Freya uses past campaign performance to improve targeting and copy.',
    icp: 'Define who you’re targeting so Freya can personalize outreach and ads.',
    channels: 'Start with 1–2 channels; add more once the campaign is performing.',
    access: 'Connected accounts let Freya reuse and learn from your best content.',
    fetch: 'Freya will pull creatives and copy to inform the new campaign plan.',
    ready: 'You’ll complete strategy and plan on the campaign page. Freya generates the plan from your inputs.',
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: C.bg,
      padding: S[8],
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <div style={{ width: '100%', maxWidth: 720, display: 'flex', flexDirection: 'column', gap: S[6] }}>
        {/* Header */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            style={{ ...btn.ghost, fontSize: 13, marginBottom: S[3], color: C.textMuted }}
            onClick={() => navigate('/campaigns')}
          >
            ← Back to Campaigns
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: S[3], marginBottom: S[2] }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: R.card,
              backgroundColor: C.primaryGlow,
              border: `1px solid rgba(61,220,132,0.3)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 14 14" fill="none">
                <path d="M7 1.5L13.2 12.8H.8L7 1.5z" stroke={C.primary} strokeWidth="1.3" strokeLinejoin="round" />
                <path d="M3.6 9.2h6.8" stroke={C.primary} strokeWidth="1.3" strokeLinecap="round" />
                <circle cx="7" cy="1.5" r="1.1" fill={C.primary} />
                <circle cx=".8" cy="12.8" r="1.1" fill={C.primary} />
                <circle cx="13.2" cy="12.8" r="1.1" fill={C.primary} />
              </svg>
            </div>
            <div>
              <h1 style={{ fontFamily: F.display, fontSize: 22, fontWeight: 800, color: C.textPrimary, margin: 0, letterSpacing: '-0.02em' }}>
                Create campaign with Freya
              </h1>
              <p style={{ fontFamily: F.body, fontSize: 13, color: C.textSecondary, margin: '4px 0 0' }}>
                Step {step + 1} of {STEPS.length} · {STEPS[step]?.title}
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: S[8], alignItems: 'flex-start' }}>
          {/* Left: step indicator (compact) */}
          <div style={{
            position: 'relative',
            width: 140,
            flexShrink: 0,
            paddingTop: S[1],
          }}>
            <StepIndicator currentStep={step} steps={STEPS} />
          </div>

          {/* Right: content card */}
          <div style={{
            flex: 1,
            minWidth: 0,
            backgroundColor: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: R.card,
            padding: S[6],
            boxShadow: shadows.card,
          }}>
            {/* Freya tip strip */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: S[2],
              padding: S[3],
              marginBottom: S[5],
              backgroundColor: C.primaryGlow,
              border: `1px solid rgba(61,220,132,0.2)`,
              borderRadius: R.md,
              borderLeft: `3px solid ${C.primary}`,
            }}>
              <span style={{ fontFamily: F.mono, fontSize: 10, fontWeight: 700, color: C.primary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Freya</span>
              <p style={{ fontFamily: F.body, fontSize: 12, color: C.textSecondary, margin: 0, lineHeight: 1.45 }}>{ariaTip[stepId]}</p>
            </div>

            {/* Dashboard files banner (when user started from Dashboard file upload) */}
            {stepId === 'goal' && dashboardCampaignFiles.length > 0 && (
              <div
                style={{
                  padding: S[3],
                  backgroundColor: C.primaryGlow,
                  border: `1px solid ${C.primary}`,
                  borderRadius: R.md,
                  marginBottom: S[4],
                }}
              >
                <span style={{ fontFamily: F.mono, fontSize: 11, fontWeight: 700, color: C.primary }}>Using {dashboardCampaignFiles.length} file(s) from Dashboard</span>
                <div style={{ fontFamily: F.body, fontSize: 12, color: C.textSecondary, marginTop: S[1] }}>
                  {dashboardCampaignFiles.map((f, i) => (typeof f === 'string' ? f : f?.name)).filter(Boolean).join(', ')}
                </div>
                <p style={{ fontFamily: F.body, fontSize: 11, color: C.textMuted, margin: `${S[2]} 0 0 0` }}>
                  Freya will use these when building your strategy and plan.
                </p>
              </div>
            )}

            {/* Step content */}
            {stepId === 'goal' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
                <div>
                  <label style={{ display: 'block', fontFamily: F.body, fontSize: 12, fontWeight: 600, color: C.textMuted, marginBottom: S[2] }}>Campaign name</label>
                  <input
                    type="text"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    placeholder="e.g. Medglobal VN CFO Q2"
                    style={{
                      width: '100%',
                      padding: `${S[2]} ${S[3]}`,
                      border: `1px solid ${C.border}`,
                      borderRadius: R.input,
                      backgroundColor: C.surface2,
                      color: C.textPrimary,
                      fontFamily: F.body,
                      fontSize: 14,
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: F.body, fontSize: 12, fontWeight: 600, color: C.textMuted, marginBottom: S[2] }}>One-line objective</label>
                  <input
                    type="text"
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    placeholder="e.g. Generate 120 qualified CFO leads in Vietnam"
                    style={{
                      width: '100%',
                      padding: `${S[2]} ${S[3]}`,
                      border: `1px solid ${C.border}`,
                      borderRadius: R.input,
                      backgroundColor: C.surface2,
                      color: C.textPrimary,
                      fontFamily: F.body,
                      fontSize: 14,
                    }}
                  />
                </div>
              </div>
            )}

            {stepId === 'learn' && (
              <div>
                <label style={{ display: 'block', fontFamily: F.body, fontSize: 12, fontWeight: 600, color: C.textMuted, marginBottom: S[2] }}>
                  Previous campaign (optional)
                </label>
                <select
                  value={previousCampaignId}
                  onChange={(e) => setPreviousCampaignId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: `${S[2]} ${S[3]}`,
                    border: `1px solid ${C.border}`,
                    borderRadius: R.input,
                    backgroundColor: C.surface2,
                    color: C.textPrimary,
                    fontFamily: F.body,
                    fontSize: 13,
                  }}
                >
                  <option value="">None — starting fresh</option>
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} · {c.client}</option>
                  ))}
                </select>
                <p style={{ fontFamily: F.body, fontSize: 12, color: C.textMuted, marginTop: S[2], marginBottom: 0 }}>
                  Freya will use performance and messaging from this campaign to improve the new one.
                </p>
              </div>
            )}

            {stepId === 'icp' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
                {[
                  { value: 'existing', label: 'Use existing ICP', desc: 'Pick from your saved ICPs in ICP Builder' },
                  { value: 'builder', label: 'Build in ICP Builder', desc: 'Define job titles, industries, and filters' },
                  { value: 'aria', label: 'Generate with Freya', desc: 'Freya suggests an ICP from your closed-won deals or CRM' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setIcpChoice(opt.value)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: S[3],
                      padding: S[4],
                      borderRadius: R.md,
                      border: `1px solid ${icpChoice === opt.value ? C.primary : C.border}`,
                      backgroundColor: icpChoice === opt.value ? C.primaryGlow : C.surface2,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: T.color,
                    }}
                  >
                    <div style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      border: `2px solid ${icpChoice === opt.value ? C.primary : C.border}`,
                      backgroundColor: icpChoice === opt.value ? C.primary : 'transparent',
                      flexShrink: 0,
                      marginTop: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {icpChoice === opt.value && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2.5 2.5 3.5-4" stroke={C.bg} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div style={{ fontFamily: F.body, fontSize: 14, fontWeight: 600, color: C.textPrimary }}>{opt.label}</div>
                      <div style={{ fontFamily: F.body, fontSize: 12, color: C.textSecondary, marginTop: 2 }}>{opt.desc}</div>
                    </div>
                  </button>
                ))}
                {(icpChoice === 'builder' || icpChoice === 'aria') && (
                  <button
                    type="button"
                    style={{ ...btn.ghost, fontSize: 12, color: C.primary, marginTop: S[2] }}
                    onClick={() => icpChoice === 'builder' ? navigate('/research/icp') : toast.info('Freya ICP generation — coming soon')}
                  >
                    {icpChoice === 'builder' ? 'Open ICP Builder →' : 'Generate ICP with Freya →'}
                  </button>
                )}
              </div>
            )}

            {stepId === 'channels' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[2] }}>
                {CHANNEL_OPTIONS.map((ch) => {
                  const selected = channels.includes(ch.id);
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => toggleChannel(ch.id)}
                      style={{
                        padding: S[4],
                        borderRadius: R.md,
                        border: `1px solid ${selected ? C.primary : C.border}`,
                        backgroundColor: selected ? C.primaryGlow : C.surface2,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: T.color,
                      }}
                    >
                      <div style={{ fontFamily: F.body, fontSize: 14, fontWeight: 600, color: C.textPrimary }}>{ch.label}</div>
                      <div style={{ fontFamily: F.body, fontSize: 12, color: C.textSecondary, marginTop: 2 }}>{ch.desc}</div>
                    </button>
                  );
                })}
              </div>
            )}

            {stepId === 'access' && (
              <div>
                <p style={{ fontFamily: F.body, fontSize: 13, color: C.textSecondary, marginBottom: S[4] }}>
                  Connect accounts so Freya can fetch and learn from your best content. You can add more later from Social Media.
                </p>
                {connectedAccounts.length > 0 && (
                  <div style={{ marginBottom: S[4] }}>
                    <div style={{ fontFamily: F.mono, fontSize: 10, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>
                      Connected ({connectedAccounts.length})
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 18, fontFamily: F.body, fontSize: 13, color: C.textSecondary, listStyle: 'none' }}>
                      {connectedAccounts.map((a) => (
                        <li key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          {a.platform === 'LinkedIn' && <IconLinkedIn color="#0A66C2" width={16} height={16} />}
                          {(a.platform === 'Meta' || a.platform === 'Facebook') && <IconFacebook color="#1877F2" width={16} height={16} />}
                          {a.platform === 'Instagram' && <IconInstagram color="#E4405F" width={16} height={16} />}
                          {a.platform === 'WhatsApp' && <IconWhatsApp color="#25D366" width={16} height={16} />}
                          <span>{a.name} · {a.platform}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[2] }}>
                  <button type="button" style={{ ...btn.primary, fontSize: 13 }} onClick={() => setShowConnectModal(true)}>
                    Add account
                  </button>
                  <button
                    type="button"
                    style={{ ...btn.ghost, fontSize: 13, color: C.textMuted, border: `1px solid ${C.border}` }}
                    onClick={handleSkipAccess}
                  >
                    Skip
                  </button>
                </div>
                {showConnectModal && <ConnectAccountModal onClose={() => setShowConnectModal(false)} />}
                {showSkipWarning && (
                  <div style={{ marginTop: S[4], padding: S[4], backgroundColor: C.amberDim, border: `1px solid ${C.amber}`, borderRadius: R.card }}>
                    <p style={{ fontFamily: F.body, fontSize: 13, fontWeight: 600, color: C.textPrimary, margin: '0 0 8px' }}>Continue without connecting?</p>
                    <p style={{ fontFamily: F.body, fontSize: 12, color: C.textSecondary, margin: '0 0 12px' }}>
                      Freya won’t fetch content from your channels. You can connect later from Social Media.
                    </p>
                    <div style={{ display: 'flex', gap: S[2] }}>
                      <button type="button" style={{ ...btn.ghost, fontSize: 12 }} onClick={() => setShowSkipWarning(false)}>Go back</button>
                      <button type="button" style={{ ...btn.primary, fontSize: 12 }} onClick={confirmSkipAccess}>Continue anyway</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {stepId === 'fetch' && (
              <div>
                <p style={{ fontFamily: F.body, fontSize: 13, color: C.textSecondary, marginBottom: S[4] }}>
                  {connectedAccounts.length > 0
                    ? 'Freya will fetch content from your connected channels and use it to inform the campaign strategy and plan.'
                    : 'No accounts connected. Skip this step — you can connect and fetch later.'}
                </p>
                {connectedAccounts.length > 0 ? (
                  <button
                    type="button"
                    disabled={fetching}
                    onClick={handleNext}
                    style={{ ...btn.primary, fontSize: 14, padding: `${S[3]} ${S[5]}`, opacity: fetching ? 0.8 : 1 }}
                  >
                    {fetching ? 'Fetching…' : 'Fetch content from channels'}
                  </button>
                ) : (
                  <button type="button" style={{ ...btn.secondary, fontSize: 13 }} onClick={handleNext}>
                    Skip to next step
                  </button>
                )}
              </div>
            )}

            {stepId === 'ready' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: S[5] }}>
                <div style={{
                  padding: S[4],
                  backgroundColor: C.surface2,
                  border: `1px solid ${C.border}`,
                  borderRadius: R.md,
                }}>
                  <div style={{ fontFamily: F.mono, fontSize: 10, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[3] }}>
                    Summary
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: F.body, fontSize: 13 }}>
                      <span style={{ color: C.textMuted }}>Campaign</span>
                      <span style={{ color: C.textPrimary, fontWeight: 600 }}>{campaignName || '—'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: F.body, fontSize: 13 }}>
                      <span style={{ color: C.textMuted }}>Objective</span>
                      <span style={{ color: C.textPrimary }}>{objective || '—'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: F.body, fontSize: 13 }}>
                      <span style={{ color: C.textMuted }}>Channels</span>
                      <span style={{ color: C.textPrimary }}>{channels.length ? channels.map((c) => CHANNEL_OPTIONS.find((o) => o.id === c)?.label).join(', ') : '—'}</span>
                    </div>
                  </div>
                </div>
                <p style={{ fontFamily: F.body, fontSize: 13, color: C.textSecondary, margin: 0 }}>
                  Next you’ll complete <strong style={{ color: C.textPrimary }}>Strategy</strong> (brief, ICP, positioning) and Freya will generate your <strong style={{ color: C.textPrimary }}>Plan</strong>. Then approve content and launch.
                </p>
                <button
                  type="button"
                  style={{
                    ...btn.primary,
                    fontSize: 15,
                    fontWeight: 700,
                    padding: `${S[3]} ${S[6]}`,
                    width: '100%',
                    justifyContent: 'center',
                    boxShadow: `0 0 20px rgba(61,220,132,0.25)`,
                  }}
                  onClick={handleContinueToStrategy}
                >
                  Continue to Strategy & Plan →
                </button>
              </div>
            )}

            {/* Footer nav */}
            {stepId !== 'ready' && stepId !== 'fetch' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: S[6], paddingTop: S[5], borderTop: `1px solid ${C.border}` }}>
                <button
                  type="button"
                  style={{ ...btn.ghost, fontSize: 13 }}
                  onClick={handleBack}
                  disabled={step === 0}
                >
                  Back
                </button>
                <button
                  type="button"
                  style={{ ...btn.primary, fontSize: 13, padding: `${S[2]} ${S[5]}` }}
                  onClick={handleNext}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: S[2] }}>
          <button
            type="button"
            style={{ ...btn.ghost, fontSize: 12, color: C.textMuted }}
            onClick={() => navigate('/campaigns/new')}
          >
            Use full campaign wizard instead
          </button>
        </div>
      </div>
    </div>
  );
}
