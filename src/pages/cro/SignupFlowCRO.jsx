/**
 * Signup Flow CRO — Signup flow optimizer powered by Optimizer agent.
 * Visualizes current flow as connected nodes with drop-off %,
 * analyzes step-by-step, identifies hotspots, recommends simplified flow.
 */
import { useState } from 'react';
import { C, F, R, S, T, btn, badge, shadows, sectionHeading, sectionSubheading, makeStyles, cardStyle } from '../../tokens';
import useToast from '../../hooks/useToast';
import { useAgent } from '../../hooks/useAgent';
import AgentThinking from '../../components/agents/AgentThinking';
import AgentResultPanel from '../../components/agents/AgentResultPanel';

/* ─── Mock signup flow data ─────────────────────────────────── */
const MOCK_FLOW = {
  predictedImprovement: '+34%',
  currentConversionRate: '12.4%',
  predictedConversionRate: '16.6%',
  steps: [
    { id: 1, label: 'Landing Page', visitors: 10000, dropoff: 35, issues: ['Unclear CTA copy', 'No social proof above fold'], isHotspot: false },
    { id: 2, label: 'Email Entry', visitors: 6500, dropoff: 22, issues: ['Asking for phone number too early'], isHotspot: false },
    { id: 3, label: 'Account Details', visitors: 5070, dropoff: 48, issues: ['15-field form', 'No progress indicator', 'Required company address'], isHotspot: true },
    { id: 4, label: 'Email Verification', visitors: 2636, dropoff: 18, issues: ['Verification email delayed 2-5min'], isHotspot: false },
    { id: 5, label: 'Plan Selection', visitors: 2161, dropoff: 28, issues: ['Too many plan options (5)', 'No default selection'], isHotspot: true },
    { id: 6, label: 'Payment', visitors: 1556, dropoff: 20, issues: ['Only credit card accepted', 'No trial option visible'], isHotspot: false },
    { id: 7, label: 'Onboarding', visitors: 1245, dropoff: 0, issues: [], isHotspot: false },
  ],
  recommendedFlow: [
    { id: 1, label: 'Landing + Email', description: 'Single-field email capture with social proof' },
    { id: 2, label: 'Magic Link / OAuth', description: 'Passwordless entry via email link or Google/GitHub SSO' },
    { id: 3, label: 'Core Info (3 fields)', description: 'Name, company, role only' },
    { id: 4, label: 'Plan + Trial', description: 'Pre-selected recommended plan with prominent 14-day trial' },
    { id: 5, label: 'Guided Onboarding', description: 'Interactive setup wizard with quick wins' },
  ],
};

/* ─── FlowNode ──────────────────────────────────────────────── */
function FlowNode({ step, isLast }) {
  const dropColor = step.dropoff >= 40 ? C.red : step.dropoff >= 20 ? C.amber : C.green;
  const bgColor = step.isHotspot ? C.redDim : C.surface2;
  const borderColor = step.isHotspot ? C.red + '40' : C.border;

  return (
    <div style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}>
      {/* Node */}
      <div style={{
        backgroundColor: bgColor, border: `1px solid ${borderColor}`, borderRadius: R.card,
        padding: S[4], minWidth: '180px', flex: 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginBottom: S[2] }}>
          <span style={{
            width: 24, height: 24, borderRadius: R.full, backgroundColor: step.isHotspot ? C.redDim : C.surface3,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: step.isHotspot ? C.red : C.textSecondary,
          }}>{step.id}</span>
          <span style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>{step.label}</span>
          {step.isHotspot && <span style={makeStyles(badge.base, badge.red)}>HOTSPOT</span>}
        </div>
        <div style={{ fontFamily: F.mono, fontSize: '18px', fontWeight: 700, color: C.textPrimary, marginBottom: S[1] }}>
          {step.visitors.toLocaleString()} <span style={{ fontSize: '11px', color: C.textMuted }}>visitors</span>
        </div>
        {step.issues.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: S[2] }}>
            {step.issues.map((issue, i) => (
              <div key={i} style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary, display: 'flex', alignItems: 'flex-start', gap: S[1] }}>
                <span style={{ color: C.amber, flexShrink: 0 }}>-</span>
                <span>{issue}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Arrow + drop-off */}
      {!isLast && step.dropoff > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '80px', flexShrink: 0 }}>
          <div style={{ fontFamily: F.mono, fontSize: '12px', fontWeight: 700, color: dropColor }}>
            -{step.dropoff}%
          </div>
          <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
            <path d="M0 10h35M30 5l5 5-5 5" stroke={dropColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div style={{ fontFamily: F.body, fontSize: '9px', color: C.textMuted }}>drop-off</div>
        </div>
      )}
    </div>
  );
}

/* ─── SignupFlowCRO ─────────────────────────────────────────── */
export default function SignupFlowCRO() {
  const toast = useToast();
  const optimizer = useAgent('optimizer');
  const [result, setResult] = useState(null);
  const [thinking, setThinking] = useState(false);
  const [agentResult, setAgentResult] = useState(null);

  const handleAnalyze = async () => {
    setThinking(true);
    setResult(null);
    setAgentResult(null);
    try {
      await optimizer.activate('signup-flow-cro', { skill: 'signup-flow-cro' });
      await new Promise(r => setTimeout(r, 2400));
      setResult(MOCK_FLOW);
      setAgentResult({
        agentId: 'optimizer',
        skill: 'signup-flow-cro',
        confidence: 91,
        creditsUsed: 65,
        output: {
          metrics: [
            { label: 'Current Rate', value: MOCK_FLOW.currentConversionRate },
            { label: 'Predicted Rate', value: MOCK_FLOW.predictedConversionRate },
            { label: 'Improvement', value: MOCK_FLOW.predictedImprovement },
            { label: 'Steps Analyzed', value: MOCK_FLOW.steps.length.toString() },
          ],
        },
      });
      toast.success('Signup flow analysis complete');
    } catch {
      toast.error('Analysis failed');
    } finally {
      setThinking(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: C.bg, padding: `${S[6]} ${S[6]} ${S[8]}` }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: S[6] }}>
          <h1 style={{ ...sectionHeading, fontSize: '28px', letterSpacing: '-0.03em', margin: 0, fontFamily: F.display }}>Signup Flow CRO</h1>
          <p style={{ ...sectionSubheading, marginTop: S[1] }}>
            Analyze your signup funnel step-by-step. Identifies drop-off hotspots and recommends a simplified flow for higher conversion.
          </p>
        </div>

        {/* Action button */}
        <div style={{ display: 'flex', gap: S[3], marginBottom: S[4] }}>
          <button style={{ ...btn.primary, fontSize: '14px', padding: `${S[3]} ${S[6]}` }} onClick={handleAnalyze} disabled={thinking}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8h3l2-4 2 8 2-4h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {thinking ? 'Analyzing...' : 'Analyze Signup Flow'}
          </button>
        </div>

        {/* Thinking */}
        {thinking && <div style={{ marginBottom: S[4] }}><AgentThinking agentId="optimizer" task="Analyzing signup flow steps and drop-off rates..." /></div>}

        {/* Agent result */}
        {agentResult && !thinking && <div style={{ marginBottom: S[4] }}><AgentResultPanel result={agentResult} /></div>}

        {/* Results */}
        {result && !thinking && (
          <>
            {/* Predicted improvement banner */}
            <div style={{
              ...cardStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: S[4], background: `linear-gradient(135deg, ${C.greenDim}, ${C.surface})`,
            }}>
              <div>
                <div style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary }}>Predicted Improvement</div>
                <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>If all recommendations are implemented</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: S[3] }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: F.mono, fontSize: '24px', fontWeight: 700, color: C.textMuted }}>{result.currentConversionRate}</div>
                  <div style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted }}>CURRENT</div>
                </div>
                <span style={{ fontFamily: F.mono, fontSize: '20px', color: C.textMuted }}>→</span>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: F.mono, fontSize: '24px', fontWeight: 700, color: C.green }}>{result.predictedConversionRate}</div>
                  <div style={{ fontFamily: F.body, fontSize: '10px', color: C.green }}>PREDICTED</div>
                </div>
                <span style={makeStyles(badge.base, badge.green, { fontSize: '14px', padding: `${S[1]} ${S[3]}` })}>
                  {result.predictedImprovement}
                </span>
              </div>
            </div>

            {/* Current flow visualization */}
            <div style={{ ...cardStyle, marginBottom: S[4] }}>
              <div style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary, marginBottom: S[4] }}>Current Signup Flow</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
                {result.steps.map((step, i) => (
                  <FlowNode key={step.id} step={step} isLast={i === result.steps.length - 1} />
                ))}
              </div>
            </div>

            {/* Recommended flow */}
            <div style={{ ...cardStyle }}>
              <div style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary, marginBottom: S[4] }}>Recommended Simplified Flow</div>
              <div style={{ display: 'flex', gap: S[3], flexWrap: 'wrap' }}>
                {result.recommendedFlow.map((step, i) => (
                  <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                    <div style={{
                      backgroundColor: C.greenDim, border: `1px solid ${C.green}30`, borderRadius: R.card,
                      padding: `${S[3]} ${S[4]}`, minWidth: '160px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginBottom: S[1] }}>
                        <span style={{
                          width: 20, height: 20, borderRadius: R.full, backgroundColor: C.green + '30',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.green,
                        }}>{step.id}</span>
                        <span style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>{step.label}</span>
                      </div>
                      <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary }}>{step.description}</div>
                    </div>
                    {i < result.recommendedFlow.length - 1 && (
                      <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
                        <path d="M0 6h15M12 2l4 4-4 4" stroke={C.green} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Empty state */}
        {!result && !thinking && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: `${S[16]} 0`, gap: S[3] }}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="12" cy="24" r="5" stroke={C.textMuted} strokeWidth="2"/>
              <circle cx="24" cy="24" r="5" stroke={C.textMuted} strokeWidth="2"/>
              <circle cx="36" cy="24" r="5" stroke={C.textMuted} strokeWidth="2"/>
              <path d="M17 24h2M29 24h2" stroke={C.textMuted} strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <div style={{ fontFamily: F.body, fontSize: '14px', color: C.textMuted, textAlign: 'center' }}>
              Click "Analyze Signup Flow" to visualize your funnel and identify conversion drop-off hotspots
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
