/**
 * Popup CRO — Popup strategy designer powered by Optimizer agent.
 * Popup type selector, trigger config, copy formula, frequency capping,
 * compliance notes, and popup preview mockup.
 */
import { useState } from 'react';
import { C, F, R, S, T, btn, badge, shadows, sectionHeading, sectionSubheading, makeStyles, cardStyle, inputStyle } from '../../tokens';
import useToast from '../../hooks/useToast';
import { useAgent } from '../../hooks/useAgent';
import AgentThinking from '../../components/agents/AgentThinking';
import AgentResultPanel from '../../components/agents/AgentResultPanel';

/* ─── Popup types ───────────────────────────────────────────── */
const POPUP_TYPES = [
  { id: 'exit_intent', label: 'Exit Intent', icon: '↗', description: 'Triggers when cursor moves toward browser close/back' },
  { id: 'scroll', label: 'Scroll-Triggered', icon: '↓', description: 'Appears after user scrolls to a specific depth' },
  { id: 'timed', label: 'Timed Delay', icon: '⏱', description: 'Appears after a set time on the page' },
  { id: 'click', label: 'Click-Triggered', icon: '◉', description: 'Appears when user clicks a specific element' },
];

/* ─── Mock popup result ─────────────────────────────────────── */
const MOCK_RESULTS = {
  exit_intent: {
    trigger: { type: 'Exit Intent', delay: '0s', condition: 'Mouse leaves viewport toward top' },
    copy: {
      headline: 'Wait — before you go!',
      subheadline: 'Get the 2024 GTM Playbook (free)',
      body: 'Our data from 500+ campaigns shows the exact strategies that drive 3x pipeline growth.',
      cta: 'Send Me the Playbook',
      dismiss: 'No thanks, I have enough pipeline',
    },
    frequencyCapping: { perSession: 1, perUser: 3, cooldownDays: 7 },
    compliance: [
      'Must include visible close button (min 44x44px tap target)',
      'Must not block content on mobile (Google Interstitial penalty)',
      'Include privacy notice if collecting email',
      'GDPR: Cannot pre-check consent checkbox',
    ],
    expectedConversion: '3.5-5.2%',
    bestTimeToShow: 'After 30+ seconds on page',
  },
  scroll: {
    trigger: { type: 'Scroll Depth', delay: '50% scroll', condition: 'User has scrolled past midpoint' },
    copy: {
      headline: 'You seem interested!',
      subheadline: 'Get weekly GTM insights delivered',
      body: 'Join 2,400+ marketing leaders who get our weekly analysis of what works in B2B GTM.',
      cta: 'Subscribe Free',
      dismiss: 'Maybe later',
    },
    frequencyCapping: { perSession: 1, perUser: 2, cooldownDays: 14 },
    compliance: [
      'Must include visible close button',
      'Must not obstruct content on mobile',
      'Include unsubscribe info in follow-up emails',
    ],
    expectedConversion: '2.8-4.1%',
    bestTimeToShow: 'At 50-65% scroll depth',
  },
  timed: {
    trigger: { type: 'Time Delay', delay: '45 seconds', condition: 'User has been on page 45+ seconds' },
    copy: {
      headline: 'See it in action',
      subheadline: 'Book a 15-min demo',
      body: 'See how Medglobal increased donor engagement by 40% with our platform.',
      cta: 'Book My Demo',
      dismiss: 'Not now',
    },
    frequencyCapping: { perSession: 1, perUser: 2, cooldownDays: 30 },
    compliance: [
      'Must include visible close button',
      'Consider mobile-friendly slide-in instead of overlay',
      'Respect Do Not Disturb hours for returning visitors',
    ],
    expectedConversion: '2.1-3.4%',
    bestTimeToShow: 'After 30-60 seconds of engagement',
  },
  click: {
    trigger: { type: 'Click Trigger', delay: '0s', condition: 'User clicks designated CTA or link' },
    copy: {
      headline: 'Almost there!',
      subheadline: 'Complete your request',
      body: 'Fill in your details and we will have the report in your inbox within 5 minutes.',
      cta: 'Get My Report',
      dismiss: 'Cancel',
    },
    frequencyCapping: { perSession: 'unlimited', perUser: 'unlimited', cooldownDays: 0 },
    compliance: [
      'User-initiated, so no mobile interstitial concerns',
      'Still must include close/cancel option',
      'Include privacy notice if collecting personal data',
    ],
    expectedConversion: '12-18%',
    bestTimeToShow: 'Immediately on click',
  },
};

/* ─── PopupPreview ──────────────────────────────────────────── */
function PopupPreview({ copy }) {
  return (
    <div style={{
      backgroundColor: '#FFFFFF', borderRadius: R.card, padding: S[6],
      maxWidth: '380px', margin: '0 auto', boxShadow: shadows.modal,
      border: `1px solid #E5E7EB`, position: 'relative',
    }}>
      {/* Close button */}
      <div style={{
        position: 'absolute', top: S[3], right: S[3], width: 28, height: 28,
        borderRadius: R.full, backgroundColor: '#F3F4F6', display: 'flex',
        alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        fontFamily: F.body, fontSize: '14px', color: '#6B7280',
      }}>X</div>
      <div style={{ fontFamily: F.display, fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: S[2], lineHeight: 1.2 }}>
        {copy.headline}
      </div>
      <div style={{ fontFamily: F.body, fontSize: '14px', fontWeight: 600, color: '#4B5563', marginBottom: S[3] }}>
        {copy.subheadline}
      </div>
      <div style={{ fontFamily: F.body, fontSize: '13px', color: '#6B7280', lineHeight: 1.5, marginBottom: S[4] }}>
        {copy.body}
      </div>
      <div style={{
        backgroundColor: '#4A7C6F', color: '#FFFFFF', borderRadius: R.button, padding: `${S[3]} ${S[5]}`,
        fontFamily: F.body, fontSize: '14px', fontWeight: 600, textAlign: 'center', cursor: 'pointer',
        marginBottom: S[2],
      }}>
        {copy.cta}
      </div>
      <div style={{ fontFamily: F.body, fontSize: '12px', color: '#9CA3AF', textAlign: 'center', cursor: 'pointer' }}>
        {copy.dismiss}
      </div>
    </div>
  );
}

/* ─── PopupCRO ──────────────────────────────────────────────── */
export default function PopupCRO() {
  const toast = useToast();
  const optimizer = useAgent('optimizer');
  const [selectedType, setSelectedType] = useState('exit_intent');
  const [result, setResult] = useState(null);
  const [thinking, setThinking] = useState(false);
  const [agentResult, setAgentResult] = useState(null);

  const handleDesign = async () => {
    setThinking(true);
    setResult(null);
    setAgentResult(null);
    try {
      await optimizer.activate('popup-cro', { skill: 'popup-cro', popupType: selectedType });
      await new Promise(r => setTimeout(r, 2200));
      const mockResult = MOCK_RESULTS[selectedType];
      setResult(mockResult);
      setAgentResult({
        agentId: 'optimizer',
        skill: 'popup-cro',
        confidence: 90,
        creditsUsed: 50,
        output: {
          metrics: [
            { label: 'Expected CVR', value: mockResult.expectedConversion },
            { label: 'Trigger', value: mockResult.trigger.type },
            { label: 'Frequency Cap', value: `${mockResult.frequencyCapping.perSession}/session` },
            { label: 'Compliance Items', value: mockResult.compliance.length.toString() },
          ],
        },
      });
      toast.success('Popup strategy designed');
    } catch {
      toast.error('Design failed');
    } finally {
      setThinking(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: C.bg, padding: `${S[6]} ${S[6]} ${S[8]}` }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: S[6] }}>
          <h1 style={{ ...sectionHeading, fontSize: '28px', letterSpacing: '-0.03em', margin: 0, fontFamily: F.display }}>Popup CRO</h1>
          <p style={{ ...sectionSubheading, marginTop: S[1] }}>
            Design high-converting popup strategies. Select a trigger type and let the Optimizer agent generate copy, frequency rules, and compliance notes.
          </p>
        </div>

        {/* Type selector */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: S[3], marginBottom: S[4] }}>
          {POPUP_TYPES.map(pt => (
            <button key={pt.id} onClick={() => setSelectedType(pt.id)} style={{
              ...cardStyle, cursor: 'pointer', textAlign: 'left',
              borderColor: selectedType === pt.id ? C.primary : C.border,
              backgroundColor: selectedType === pt.id ? C.primaryDim : C.surface,
            }}>
              <div style={{ fontSize: '24px', marginBottom: S[2] }}>{pt.icon}</div>
              <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>{pt.label}</div>
              <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary, marginTop: S[1] }}>{pt.description}</div>
            </button>
          ))}
        </div>

        {/* Action */}
        <div style={{ display: 'flex', gap: S[3], marginBottom: S[4] }}>
          <button style={{ ...btn.primary, fontSize: '14px', padding: `${S[3]} ${S[6]}` }} onClick={handleDesign} disabled={thinking}>
            {thinking ? 'Designing...' : 'Design Popup'}
          </button>
        </div>

        {/* Thinking */}
        {thinking && <div style={{ marginBottom: S[4] }}><AgentThinking agentId="optimizer" task={`Designing ${POPUP_TYPES.find(t => t.id === selectedType)?.label} popup...`} /></div>}
        {agentResult && !thinking && <div style={{ marginBottom: S[4] }}><AgentResultPanel result={agentResult} /></div>}

        {/* Results */}
        {result && !thinking && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[4] }}>
            {/* Left: specs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
              {/* Trigger config */}
              <div style={cardStyle}>
                <div style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary, marginBottom: S[3] }}>Trigger Configuration</div>
                {Object.entries(result.trigger).map(([key, val]) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: `${S[1]} 0`, borderBottom: `1px solid ${C.border}` }}>
                    <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, textTransform: 'capitalize' }}>{key}</span>
                    <span style={{ fontFamily: F.mono, fontSize: '12px', color: C.textPrimary }}>{val}</span>
                  </div>
                ))}
              </div>

              {/* Copy formula */}
              <div style={cardStyle}>
                <div style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary, marginBottom: S[3] }}>Copy Formula</div>
                {Object.entries(result.copy).map(([key, val]) => (
                  <div key={key} style={{ marginBottom: S[2] }}>
                    <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{key}</div>
                    <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary }}>{val}</div>
                  </div>
                ))}
              </div>

              {/* Frequency capping */}
              <div style={cardStyle}>
                <div style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary, marginBottom: S[3] }}>Frequency Capping</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: S[3] }}>
                  <div style={{ backgroundColor: C.surface3, borderRadius: R.sm, padding: S[3], textAlign: 'center' }}>
                    <div style={{ fontFamily: F.mono, fontSize: '18px', fontWeight: 700, color: C.textPrimary }}>{result.frequencyCapping.perSession}</div>
                    <div style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted }}>PER SESSION</div>
                  </div>
                  <div style={{ backgroundColor: C.surface3, borderRadius: R.sm, padding: S[3], textAlign: 'center' }}>
                    <div style={{ fontFamily: F.mono, fontSize: '18px', fontWeight: 700, color: C.textPrimary }}>{result.frequencyCapping.perUser}</div>
                    <div style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted }}>PER USER</div>
                  </div>
                  <div style={{ backgroundColor: C.surface3, borderRadius: R.sm, padding: S[3], textAlign: 'center' }}>
                    <div style={{ fontFamily: F.mono, fontSize: '18px', fontWeight: 700, color: C.textPrimary }}>{result.frequencyCapping.cooldownDays}d</div>
                    <div style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted }}>COOLDOWN</div>
                  </div>
                </div>
              </div>

              {/* Compliance */}
              <div style={cardStyle}>
                <div style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary, marginBottom: S[3] }}>Compliance Notes</div>
                {result.compliance.map((note, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: S[2], padding: `${S[1]} 0` }}>
                    <span style={{ color: C.amber, flexShrink: 0, fontFamily: F.mono, fontSize: '12px' }}>!</span>
                    <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, lineHeight: 1.4 }}>{note}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: preview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
              <div style={cardStyle}>
                <div style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary, marginBottom: S[4] }}>Popup Preview</div>
                <div style={{ backgroundColor: C.surface3, borderRadius: R.sm, padding: S[6], display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                  <PopupPreview copy={result.copy} />
                </div>
              </div>
              <div style={cardStyle}>
                <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary, marginBottom: S[2] }}>Performance Estimate</div>
                <div style={{ display: 'flex', gap: S[4] }}>
                  <div>
                    <div style={{ fontFamily: F.mono, fontSize: '22px', fontWeight: 700, color: C.green }}>{result.expectedConversion}</div>
                    <div style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted }}>EXPECTED CVR</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>{result.bestTimeToShow}</div>
                    <div style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted }}>BEST TIMING</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!result && !thinking && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: `${S[16]} 0`, gap: S[3] }}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect x="8" y="12" width="32" height="24" rx="3" stroke={C.textMuted} strokeWidth="2"/>
              <path d="M8 18h32" stroke={C.textMuted} strokeWidth="1.5"/>
              <circle cx="36" cy="15" r="2" fill={C.textMuted}/>
              <path d="M16 24h16M16 30h10" stroke={C.textMuted} strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <div style={{ fontFamily: F.body, fontSize: '14px', color: C.textMuted, textAlign: 'center' }}>
              Select a popup type and click "Design Popup" to generate a conversion-optimized popup strategy
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
