import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { C, F, R, S, btn } from '../../tokens';
import useStore from '../../store/useStore';

const STEPS = [
  { id: 'company', title: 'Company & product' },
  { id: 'team', title: 'Team size' },
  { id: 'channels', title: 'Channels' },
  { id: 'content', title: 'Content' },
  { id: 'ready', title: "You're ready" },
];

const CHANNEL_OPTIONS = [
  { id: 'email', label: 'Email', sublabel: 'Sequences and nurture' },
  { id: 'linkedin', label: 'LinkedIn', sublabel: 'Outreach and ads' },
  { id: 'meta', label: 'Meta / Facebook', sublabel: 'Ads and reach' },
  { id: 'other', label: 'Other social', sublabel: 'Twitter, etc.' },
];

const CONTENT_OPTIONS = [
  { id: 'upload', label: 'I’ll upload our content', sublabel: 'Use our existing copy and creatives' },
  { id: 'generate', label: 'Generate with AI', sublabel: 'AI drafts; we review and approve' },
  { id: 'both', label: 'Both', sublabel: 'Mix of uploaded and AI-generated' },
];

export default function ForStartupsOnboarding() {
  const navigate = useNavigate();
  const startupFlow = useStore((s) => s.startupFlow);
  const setStartupFlow = useStore((s) => s.setStartupFlow);
  const setSegment = useStore((s) => s.setSegment);

  const [stepIndex, setStepIndex] = useState(0);
  const [companyName, setCompanyName] = useState(startupFlow.companyName || '');
  const [product, setProduct] = useState(startupFlow.product || '');
  const [teamSize, setTeamSize] = useState(startupFlow.teamSize ?? 1);
  const [channels, setChannels] = useState(startupFlow.channels?.length ? startupFlow.channels : []);
  const [contentPreference, setContentPreference] = useState(startupFlow.contentPreference || 'both');

  const stepId = STEPS[stepIndex]?.id;
  const isLast = stepIndex === STEPS.length - 1;
  const isReady = stepId === 'ready';

  const toggleChannel = (id) => {
    setChannels((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  };

  const handleNext = () => {
    if (isReady) {
      setStartupFlow({
        companyName,
        product,
        teamSize,
        channels,
        contentPreference,
        completed: true,
      });
      setSegment('startup');
      navigate('/for_startups/dashboard');
      return;
    }
    if (stepIndex < STEPS.length - 1) setStepIndex(stepIndex + 1);
  };

  const handleBack = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  };

  const canNext = () => {
    if (stepId === 'company') return companyName.trim() && product.trim();
    if (stepId === 'team') return teamSize >= 1 && teamSize <= 10;
    if (stepId === 'channels') return channels.length > 0;
    if (stepId === 'content') return true;
    if (stepId === 'ready') return true;
    return true;
  };

  return (
    <div style={{ padding: `${S[8]} ${S[6]}`, maxWidth: 560, margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: '6px', marginBottom: S[6] }}>
        {STEPS.map((s, i) => (
          <div
            key={s.id}
            style={{
              flex: 1,
              height: '4px',
              borderRadius: R.pill,
              backgroundColor: i <= stepIndex ? C.primary : C.surface3,
              opacity: i <= stepIndex ? 1 : 0.5,
            }}
          />
        ))}
      </div>

      <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card, padding: S[6] }}>
        {stepId === 'company' && (
          <>
            <h2 style={{ fontFamily: F.display, fontSize: '18px', fontWeight: 700, color: C.textPrimary, margin: '0 0 8px 0' }}>Company & product</h2>
            <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, marginBottom: S[4] }}>We’ll use this to personalize your campaigns.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
              <div>
                <label style={{ display: 'block', fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, marginBottom: S[1] }}>Company name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. FabricX AI"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, marginBottom: S[1] }}>Product / what you’re promoting</label>
                <input
                  type="text"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  placeholder="e.g. AI-powered design tool for startups"
                  style={inputStyle}
                />
              </div>
            </div>
          </>
        )}

        {stepId === 'team' && (
          <>
            <h2 style={{ fontFamily: F.display, fontSize: '18px', fontWeight: 700, color: C.textPrimary, margin: '0 0 8px 0' }}>Team size</h2>
            <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, marginBottom: S[4] }}>How many people will monitor and guide the campaign?</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: S[4] }}>
              <input
                type="range"
                min={1}
                max={10}
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                style={{ flex: 1, accentColor: C.primary }}
              />
              <span style={{ fontFamily: F.mono, fontSize: '18px', fontWeight: 700, color: C.primary, minWidth: 32 }}>{teamSize}</span>
            </div>
            <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, marginTop: S[2] }}>
              {teamSize === 1 ? 'Solo founder — one view.' : `${teamSize} people — each can have a role (e.g. content, outreach, strategy).`}
            </p>
          </>
        )}

        {stepId === 'channels' && (
          <>
            <h2 style={{ fontFamily: F.display, fontSize: '18px', fontWeight: 700, color: C.textPrimary, margin: '0 0 8px 0' }}>Channels</h2>
            <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, marginBottom: S[4] }}>Where should we run campaigns? (Pick at least one.)</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
              {CHANNEL_OPTIONS.map((ch) => (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => toggleChannel(ch.id)}
                  style={{
                    textAlign: 'left',
                    padding: S[4],
                    borderRadius: R.md,
                    border: `1px solid ${channels.includes(ch.id) ? C.primary : C.border}`,
                    backgroundColor: channels.includes(ch.id) ? C.primaryGlow : C.surface2,
                    fontFamily: F.body,
                    fontSize: '14px',
                    fontWeight: 600,
                    color: C.textPrimary,
                    cursor: 'pointer',
                  }}
                >
                  <div>{ch.label}</div>
                  <div style={{ fontSize: '12px', fontWeight: 400, color: C.textSecondary, marginTop: '2px' }}>{ch.sublabel}</div>
                </button>
              ))}
            </div>
          </>
        )}

        {stepId === 'content' && (
          <>
            <h2 style={{ fontFamily: F.display, fontSize: '18px', fontWeight: 700, color: C.textPrimary, margin: '0 0 8px 0' }}>Content</h2>
            <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, marginBottom: S[4] }}>How do you want to handle content?</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
              {CONTENT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setContentPreference(opt.id)}
                  style={{
                    textAlign: 'left',
                    padding: S[4],
                    borderRadius: R.md,
                    border: `1px solid ${contentPreference === opt.id ? C.primary : C.border}`,
                    backgroundColor: contentPreference === opt.id ? C.primaryGlow : C.surface2,
                    fontFamily: F.body,
                    fontSize: '14px',
                    fontWeight: 600,
                    color: C.textPrimary,
                    cursor: 'pointer',
                  }}
                >
                  <div>{opt.label}</div>
                  <div style={{ fontSize: '12px', fontWeight: 400, color: C.textSecondary, marginTop: '2px' }}>{opt.sublabel}</div>
                </button>
              ))}
            </div>
          </>
        )}

        {stepId === 'ready' && (
          <>
            <h2 style={{ fontFamily: F.display, fontSize: '18px', fontWeight: 700, color: C.primary, margin: '0 0 8px 0' }}>You’re ready</h2>
            <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, marginBottom: S[4] }}>
              <strong style={{ color: C.textPrimary }}>{companyName || 'Your company'}</strong> · {product || 'Your product'}
              <br />
              {teamSize} {teamSize === 1 ? 'person' : 'people'} · {channels.map((c) => CHANNEL_OPTIONS.find((o) => o.id === c)?.label || c).join(', ')} · Content: {contentPreference}
            </p>
            <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
              Go to your dashboard to set your first campaign direction and let AI handle planning and execution. You’ll get escalations when your input is needed.
            </p>
          </>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: S[6] }}>
          <button type="button" onClick={handleBack} disabled={stepIndex === 0} style={{ ...btn.ghost, opacity: stepIndex === 0 ? 0.5 : 1 }}>
            Back
          </button>
          <button type="button" onClick={handleNext} disabled={!canNext()} style={{ ...btn.primary, opacity: canNext() ? 1 : 0.5, cursor: canNext() ? 'pointer' : 'default' }}>
            {isReady ? 'Go to Dashboard' : 'Next'}
          </button>
        </div>
      </div>

      <p style={{ textAlign: 'center', fontFamily: F.body, fontSize: '12px', color: C.textMuted, marginTop: S[4] }}>
        <button type="button" onClick={() => navigate('/for_startups')} style={{ background: 'none', border: 'none', color: C.primary, cursor: 'pointer', textDecoration: 'underline' }}>
          ← Back to home
        </button>
      </p>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  backgroundColor: C.surface2,
  color: C.textPrimary,
  border: `1px solid ${C.border}`,
  borderRadius: R.input,
  padding: `${S[2]} ${S[3]}`,
  fontFamily: F.body,
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
};
