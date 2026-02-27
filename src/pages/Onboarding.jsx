import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { C, F, R, S, T, shadows } from '../tokens';
import useStore from '../store/useStore';

// ── Onboarding questions ──────────────────────
const QUESTIONS = [
  { key: 'company',   text: "Let's start with your company. What's the name of your organization?" },
  { key: 'objective', text: "Great! What's the primary objective for your campaign? (e.g. generate leads, drive demos, grow brand)" },
  { key: 'audience',  text: "Who is your target audience? (e.g. CFOs at Series B SaaS, mid-market HR directors)" },
  { key: 'budget',    text: "What's your estimated monthly budget for this campaign? (e.g. $10K, $50K)" },
  { key: 'timeline',  text: "Last one — what's your campaign timeline? (e.g. 3 months, Q2 2026)" },
];

const CHANNELS = ['Email Sequences', 'LinkedIn Outreach', 'Meta Retargeting'];

const AGENTS = [
  { name: 'Email Sequencer',  desc: 'Personalizes and sends outbound email sequences' },
  { name: 'ICP Scorer',       desc: 'Scores prospects against your ideal customer profile' },
  { name: 'Budget Guardian',  desc: 'Monitors spend pacing and flags anomalies' },
];

const ANALYZING_STEPS = [
  'Parsing campaign objectives',
  'Mapping to ideal customer profile',
  'Selecting optimal channel mix',
  'Configuring ARIA agents',
  'Generating campaign brief',
];

// ── Typing dots ───────────────────────────────
function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: '5px', padding: '12px 16px', backgroundColor: C.surface2, borderRadius: `${R.card} ${R.card} ${R.card} ${R.sm}`, border: `1px solid ${C.border}`, alignSelf: 'flex-start', width: 'fit-content' }}>
      <style>{`@keyframes onbTyping{0%,80%,100%{opacity:.3;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}`}</style>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: C.primary, animation: 'onbTyping 1.2s ease-in-out infinite', animationDelay: `${i * 0.2}s` }}/>
      ))}
    </div>
  );
}

// ── ARIA message bubble ───────────────────────
function AriaBubble({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <div style={{ alignSelf: 'flex-start', maxWidth: '80%', padding: '12px 16px', backgroundColor: C.surface2, border: `1px solid ${C.border}`, borderRadius: `${R.card} ${R.card} ${R.card} ${R.sm}`, fontFamily: F.body, fontSize: '14px', color: C.textPrimary, lineHeight: 1.6 }}>
      <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.primary, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>ARIA</div>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**')
          ? <strong key={i} style={{ color: C.primary, fontWeight: 700 }}>{p.slice(2, -2)}</strong>
          : p
      )}
    </div>
  );
}

// ── User message bubble ───────────────────────
function UserBubble({ text }) {
  return (
    <div style={{ alignSelf: 'flex-end', maxWidth: '75%', padding: '10px 14px', backgroundColor: C.primaryDim, border: `1px solid rgba(61,220,132,0.3)`, borderRadius: `${R.card} ${R.card} ${R.sm} ${R.card}`, fontFamily: F.body, fontSize: '14px', color: C.textPrimary, lineHeight: 1.5 }}>
      {text}
    </div>
  );
}

// ── Analyzing step row ────────────────────────
function AnalyzingStep({ label, done, active }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0' }}>
      <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: done || active ? C.primaryGlow : C.surface3, border: `1.5px solid ${done || active ? C.primary : C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: T.base }}>
        {done ? (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5l2.5 2.5 4-4" stroke={C.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : active ? (
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: C.primary, animation: 'onbPulse 1s ease-in-out infinite' }}/>
        ) : null}
      </div>
      <div style={{ fontFamily: F.body, fontSize: '13px', color: done ? C.primary : active ? C.textPrimary : C.textMuted, transition: T.color }}>{label}</div>
    </div>
  );
}

// ── Campaign brief card ───────────────────────
function CampaignBrief({ answers }) {
  return (
    <div style={{ width: '100%', marginTop: '12px', borderRadius: R.card, overflow: 'hidden', border: `1px solid ${C.border}` }}>
      {/* Header */}
      <div style={{ padding: '14px 16px', backgroundColor: C.surface2, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.primary, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Campaign Brief</div>
        <div style={{ fontFamily: F.display, fontSize: '18px', fontWeight: 700, color: C.textPrimary }}>{answers.company}</div>
        <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, marginTop: '4px' }}>{answers.objective}</div>
      </div>

      {/* Details grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', backgroundColor: C.border }}>
        {[
          { label: 'Target Audience', value: answers.audience },
          { label: 'Monthly Budget',  value: answers.budget   },
          { label: 'Timeline',        value: answers.timeline },
          { label: 'ARIA Status',     value: 'Ready to launch', highlight: true },
        ].map((item) => (
          <div key={item.label} style={{ padding: '10px 14px', backgroundColor: C.surface }}>
            <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>{item.label}</div>
            <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 500, color: item.highlight ? C.primary : C.textPrimary }}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* Recommended channels */}
      <div style={{ padding: '12px 16px', backgroundColor: C.surface, borderTop: `1px solid ${C.border}` }}>
        <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Recommended Channels</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {CHANNELS.map((ch) => (
            <div key={ch} style={{ padding: '4px 12px', backgroundColor: C.primaryGlow, color: C.primary, border: `1px solid rgba(61,220,132,0.2)`, borderRadius: R.pill, fontFamily: F.body, fontSize: '12px', fontWeight: 600 }}>{ch}</div>
          ))}
        </div>
      </div>

      {/* ARIA agents */}
      <div style={{ padding: '12px 16px', backgroundColor: C.surface, borderTop: `1px solid ${C.border}` }}>
        <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>ARIA Agents Assigned</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {AGENTS.map((ag) => (
            <div key={ag.name} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: C.primary, flexShrink: 0, marginTop: '3px' }}/>
              <div>
                <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary }}>{ag.name}</span>
                <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, marginLeft: '6px' }}>{ag.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Onboarding component ─────────────────
export default function Onboarding() {
  const navigate = useNavigate();
  const completeOnboarding = useStore((s) => s.completeOnboarding);
  const [messages,    setMessages]    = useState([]);
  const [phase,       setPhase]       = useState('starting');
  const [qIndex,      setQIndex]      = useState(0);
  const [answers,     setAnswers]     = useState({});
  const [input,       setInput]       = useState('');
  const [typing,      setTyping]      = useState(false);
  const [analyzeStep, setAnalyzeStep] = useState(-1);
  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  // Scroll to bottom on new content
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing, analyzeStep]);

  // Focus input when it becomes active
  useEffect(() => {
    if (phase === 'asking') inputRef.current?.focus();
  }, [phase, qIndex]);

  // Kick off greeting sequence on mount
  useEffect(() => {
    setTyping(true);
    const t1 = setTimeout(() => {
      setTyping(false);
      setMessages([{ id: 1, role: 'aria', text: "Welcome to **Nextara**. I'm ARIA — your AI campaign co-pilot. I'll help you set up your first campaign in under 2 minutes." }]);
    }, 900);
    const t2 = setTimeout(() => setTyping(true), 1400);
    const t3 = setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { id: 2, role: 'aria', text: QUESTIONS[0].text }]);
      setPhase('asking');
    }, 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  // Analyzing step animation
  useEffect(() => {
    if (phase !== 'analyzing') return;
    setAnalyzeStep(0);
    const iv = setInterval(() => {
      setAnalyzeStep((s) => {
        const next = s + 1;
        if (next >= ANALYZING_STEPS.length) {
          clearInterval(iv);
          setTimeout(() => {
            setPhase('complete');
            setMessages((m) => [...m, {
              id: Date.now(),
              role: 'aria',
              text: "Done! Here's your personalized campaign brief. Everything is configured and ready to go.",
              type: 'brief',
            }]);
          }, 600);
        }
        return next;
      });
    }, 550);
    return () => clearInterval(iv);
  }, [phase]);

  const submitAnswer = () => {
    if (!input.trim() || phase !== 'asking') return;
    const answer = input.trim();
    setInput('');
    const q = QUESTIONS[qIndex];
    setAnswers((a) => ({ ...a, [q.key]: answer }));
    setMessages((m) => [...m, { id: Date.now(), role: 'user', text: answer }]);
    setPhase('processing');

    if (qIndex < QUESTIONS.length - 1) {
      setTimeout(() => setTyping(true), 400);
      setTimeout(() => {
        setTyping(false);
        setMessages((m) => [...m, { id: Date.now() + 1, role: 'aria', text: QUESTIONS[qIndex + 1].text }]);
        setQIndex((i) => i + 1);
        setPhase('asking');
      }, 1300);
    } else {
      // All questions answered
      setTimeout(() => setTyping(true), 400);
      setTimeout(() => {
        setTyping(false);
        setMessages((m) => [...m, { id: Date.now() + 1, role: 'aria', text: "Perfect! Analyzing your inputs and building your personalized campaign brief..." }]);
        setPhase('analyzing');
      }, 1300);
    }
  };

  const currentStep = Math.min(qIndex, QUESTIONS.length - 1);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: `${S[6]} ${S[4]}` }}>
      <style>{`@keyframes onbPulse{0%,100%{opacity:.5;transform:scale(.9)}50%{opacity:1;transform:scale(1.1)}}`}</style>
      <div style={{ width: '100%', maxWidth: '680px', display: 'flex', flexDirection: 'column', gap: S[5] }}>

        {/* Brand header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ flex: 1 }}/>
          <div style={{ textAlign: 'center', flex: 2 }}>
            <div style={{ fontFamily: F.display, fontSize: '30px', fontWeight: 800, color: C.primary, letterSpacing: '-0.03em' }}>NEXTARA</div>
            <div style={{ fontFamily: F.body, fontSize: '14px', color: C.textSecondary, marginTop: '4px' }}>AI-Powered B2B Campaign Intelligence</div>
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', paddingTop: '6px' }}>
            {phase !== 'complete' && (
              <button
                onClick={() => { completeOnboarding(); navigate('/'); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: F.body, fontSize: '12px', color: C.textMuted, padding: `${S[1]} ${S[2]}`, borderRadius: R.md, transition: T.color }}
                onMouseEnter={(e) => { e.currentTarget.style.color = C.textSecondary; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = C.textMuted; }}
              >
                Skip to Dashboard →
              </button>
            )}
          </div>
        </div>

        {/* Progress indicator */}
        {phase !== 'complete' && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
            {QUESTIONS.map((_, i) => (
              <div
                key={i}
                style={{
                  width: (i === currentStep && phase === 'asking') ? '24px' : '8px',
                  height: '8px',
                  borderRadius: R.pill,
                  backgroundColor: i < qIndex ? C.primary : i === currentStep ? C.primary : C.surface3,
                  border: `1px solid ${i <= currentStep ? C.primary : C.border}`,
                  transition: T.base,
                  opacity: i > currentStep ? 0.5 : 1,
                }}
              />
            ))}
          </div>
        )}

        {/* Chat window */}
        <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card, overflow: 'hidden', boxShadow: shadows.modal }}>
          {/* Messages area */}
          <div style={{ minHeight: '320px', maxHeight: '460px', overflowY: 'auto', padding: S[5], display: 'flex', flexDirection: 'column', gap: '12px', scrollbarWidth: 'thin', scrollbarColor: `${C.border} transparent` }}>
            {messages.map((msg) => (
              <div key={msg.id}>
                {msg.role === 'aria' ? (
                  <AriaBubble text={msg.text}/>
                ) : (
                  <UserBubble text={msg.text}/>
                )}
                {msg.type === 'brief' && phase === 'complete' && (
                  <CampaignBrief answers={answers}/>
                )}
              </div>
            ))}

            {/* Analyzing steps card */}
            {phase === 'analyzing' && (
              <div style={{ alignSelf: 'flex-start', width: '85%', padding: '12px 16px', backgroundColor: C.surface2, border: `1px solid ${C.border}`, borderRadius: R.card }}>
                <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.primary, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>ARIA · Analyzing</div>
                {ANALYZING_STEPS.map((step, i) => (
                  <AnalyzingStep
                    key={i}
                    label={step}
                    done={i < analyzeStep}
                    active={i === analyzeStep}
                  />
                ))}
              </div>
            )}

            {typing && <TypingDots/>}
            <div ref={messagesEndRef}/>
          </div>

          {/* Input area */}
          {(phase === 'asking' || phase === 'processing') && (
            <div style={{ padding: `${S[3]} ${S[4]}`, borderTop: `1px solid ${C.border}`, backgroundColor: C.surface2, display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') submitAnswer(); }}
                placeholder="Type your answer..."
                disabled={phase === 'processing'}
                style={{ flex: 1, backgroundColor: C.bg, color: C.textPrimary, border: `1px solid ${C.border}`, borderRadius: R.input, padding: `${S[2]} ${S[3]}`, fontFamily: F.body, fontSize: '14px', outline: 'none', transition: T.color, opacity: phase === 'processing' ? 0.5 : 1 }}
              />
              <button
                onClick={submitAnswer}
                disabled={!input.trim() || phase === 'processing'}
                style={{ width: '40px', height: '40px', backgroundColor: input.trim() && phase === 'asking' ? C.primary : C.surface3, color: input.trim() && phase === 'asking' ? C.textInverse : C.textMuted, border: 'none', borderRadius: R.button, cursor: input.trim() && phase === 'asking' ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: T.color }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M1 8h14M9 2l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}

          {/* Complete — launch actions */}
          {phase === 'complete' && (
            <div style={{ padding: S[4], borderTop: `1px solid ${C.border}`, backgroundColor: C.surface2, display: 'flex', gap: S[3] }}>
              <button
                onClick={() => { completeOnboarding(); navigate('/campaigns/new'); }}
                style={{ flex: 1, padding: `${S[3]} ${S[4]}`, backgroundColor: C.primary, color: C.textInverse, border: 'none', borderRadius: R.button, fontFamily: F.body, fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: S[2], transition: T.base }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Launch Campaign
              </button>
              <button
                onClick={() => { completeOnboarding(); navigate('/'); }}
                style={{ flex: 1, padding: `${S[3]} ${S[4]}`, backgroundColor: 'transparent', color: C.textSecondary, border: `1px solid ${C.border}`, borderRadius: R.button, fontFamily: F.body, fontSize: '14px', fontWeight: 500, cursor: 'pointer', transition: T.base }}
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>
          Powered by ARIA · Nextara AI Platform · All data simulated
        </div>
      </div>
    </div>
  );
}
