/**
 * Onboarding CRO — Post-signup activation optimizer powered by Optimizer agent.
 * Activation funnel: Signup -> First Action -> Aha Moment -> Retained.
 * Analyzes aha moment definition, activation metrics, onboarding steps.
 */
import { useState } from 'react';
import { C, F, R, S, T, btn, badge, shadows, sectionHeading, sectionSubheading, makeStyles, cardStyle } from '../../tokens';
import useToast from '../../hooks/useToast';
import { useAgent } from '../../hooks/useAgent';
import AgentThinking from '../../components/agents/AgentThinking';
import AgentResultPanel from '../../components/agents/AgentResultPanel';

/* ─── Mock data ─────────────────────────────────────────────── */
const MOCK_ONBOARDING = {
  funnel: [
    { stage: 'Signup', users: 1000, percentage: 100, color: C.primary },
    { stage: 'First Action', users: 680, percentage: 68, color: C.secondary },
    { stage: 'Aha Moment', users: 340, percentage: 34, color: C.amber },
    { stage: 'Retained (Day 7)', users: 190, percentage: 19, color: C.green },
  ],
  ahaMoment: {
    definition: 'User creates their first campaign and sees the AI-generated strategy within 3 days of signup',
    currentRate: '34%',
    benchmarkRate: '55%',
    medianTimeToAha: '4.2 days',
    targetTimeToAha: '< 24 hours',
  },
  activationMetrics: [
    { label: 'Day 1 Activation', value: '42%', target: '60%', status: 'below' },
    { label: 'Day 3 Activation', value: '34%', target: '50%', status: 'below' },
    { label: 'Day 7 Retention', value: '19%', target: '35%', status: 'critical' },
    { label: 'Time to First Value', value: '4.2 days', target: '< 1 day', status: 'critical' },
    { label: 'Onboarding Completion', value: '28%', target: '65%', status: 'below' },
    { label: 'Feature Adoption (core)', value: '22%', target: '45%', status: 'critical' },
  ],
  onboardingSteps: [
    { step: 'Welcome Screen', completionRate: 95, dropoff: 5, recommendation: 'Add personalization based on signup source' },
    { step: 'Profile Setup', completionRate: 78, dropoff: 17, recommendation: 'Reduce required fields to name + role only' },
    { step: 'Connect Integrations', completionRate: 45, dropoff: 33, recommendation: 'Make optional; offer a "skip for now" with reminder' },
    { step: 'First Campaign', completionRate: 31, dropoff: 14, recommendation: 'Add a 1-click template campaign to reduce friction' },
    { step: 'Review AI Output', completionRate: 28, dropoff: 3, recommendation: 'Auto-generate a sample output to show value immediately' },
  ],
  recommendations: [
    { text: 'Implement a guided product tour with 3 key actions', priority: 'high' },
    { text: 'Add empty-state CTAs that lead to the aha moment', priority: 'high' },
    { text: 'Send a "quick win" email within 1 hour of signup', priority: 'high' },
    { text: 'Create a sample workspace with pre-populated data', priority: 'medium' },
    { text: 'Add a progress bar showing steps to first value', priority: 'medium' },
    { text: 'Implement lifecycle email drip: Day 0, 1, 3, 7', priority: 'medium' },
    { text: 'Offer live onboarding call for accounts > 5 users', priority: 'low' },
  ],
};

const STATUS_COLORS = {
  critical: { bg: C.redDim, color: C.red },
  below:    { bg: C.amberDim, color: C.amber },
  on_track: { bg: C.greenDim, color: C.green },
};

const PRIORITY_COLORS = {
  high:   { bg: C.redDim, color: C.red },
  medium: { bg: C.amberDim, color: C.amber },
  low:    { bg: C.greenDim, color: C.green },
};

/* ─── FunnelBar ─────────────────────────────────────────────── */
function FunnelBar({ funnel }) {
  return (
    <div style={{ ...cardStyle, marginBottom: S[4] }}>
      <div style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary, marginBottom: S[4] }}>Activation Funnel</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
        {funnel.map((stage, i) => (
          <div key={i}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[1] }}>
              <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary }}>{stage.stage}</span>
              <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 700, color: stage.color }}>{stage.users.toLocaleString()} ({stage.percentage}%)</span>
            </div>
            <div style={{ height: 24, backgroundColor: C.surface3, borderRadius: R.sm, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${stage.percentage}%`,
                backgroundColor: stage.color, borderRadius: R.sm,
                transition: 'width 0.8s ease',
              }} />
            </div>
            {i < funnel.length - 1 && (
              <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.red, textAlign: 'right', marginTop: '2px' }}>
                -{funnel[i].percentage - funnel[i + 1].percentage}% drop-off
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── OnboardingCRO ─────────────────────────────────────────── */
export default function OnboardingCRO() {
  const toast = useToast();
  const optimizer = useAgent('optimizer');
  const [result, setResult] = useState(null);
  const [thinking, setThinking] = useState(false);
  const [agentResult, setAgentResult] = useState(null);

  const handleOptimize = async () => {
    setThinking(true);
    setResult(null);
    setAgentResult(null);
    try {
      await optimizer.activate('onboarding-cro', { skill: 'onboarding-cro' });
      await new Promise(r => setTimeout(r, 2400));
      setResult(MOCK_ONBOARDING);
      setAgentResult({
        agentId: 'optimizer',
        skill: 'onboarding-cro',
        confidence: 88,
        creditsUsed: 70,
        output: {
          metrics: [
            { label: 'Aha Moment Rate', value: MOCK_ONBOARDING.ahaMoment.currentRate },
            { label: 'Day 7 Retention', value: '19%' },
            { label: 'Median Time-to-Aha', value: MOCK_ONBOARDING.ahaMoment.medianTimeToAha },
            { label: 'Onboarding Completion', value: '28%' },
          ],
        },
      });
      toast.success('Onboarding analysis complete');
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
          <h1 style={{ ...sectionHeading, fontSize: '28px', letterSpacing: '-0.03em', margin: 0, fontFamily: F.display }}>Onboarding CRO</h1>
          <p style={{ ...sectionSubheading, marginTop: S[1] }}>
            Optimize post-signup activation to get users to their aha moment faster. Analyzes your activation funnel, onboarding steps, and retention metrics.
          </p>
        </div>

        {/* Action */}
        <div style={{ display: 'flex', gap: S[3], marginBottom: S[4] }}>
          <button style={{ ...btn.primary, fontSize: '14px', padding: `${S[3]} ${S[6]}` }} onClick={handleOptimize} disabled={thinking}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v12M2 8l3-3M2 8l3 3M14 8l-3-3M14 8l-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {thinking ? 'Analyzing...' : 'Optimize Onboarding'}
          </button>
        </div>

        {/* Thinking */}
        {thinking && <div style={{ marginBottom: S[4] }}><AgentThinking agentId="optimizer" task="Analyzing activation funnel and onboarding steps..." /></div>}
        {agentResult && !thinking && <div style={{ marginBottom: S[4] }}><AgentResultPanel result={agentResult} /></div>}

        {/* Results */}
        {result && !thinking && (
          <>
            {/* Funnel */}
            <FunnelBar funnel={result.funnel} />

            {/* Aha moment card */}
            <div style={{ ...cardStyle, marginBottom: S[4] }}>
              <div style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary, marginBottom: S[3] }}>Aha Moment Definition</div>
              <div style={{
                backgroundColor: C.surface2, border: `1px solid ${C.border}`, borderRadius: R.sm,
                padding: S[4], fontFamily: F.body, fontSize: '14px', color: C.textPrimary,
                lineHeight: 1.5, fontStyle: 'italic', marginBottom: S[4],
              }}>
                "{result.ahaMoment.definition}"
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: S[3] }}>
                {[
                  { label: 'Current Rate', value: result.ahaMoment.currentRate, color: C.amber },
                  { label: 'Benchmark', value: result.ahaMoment.benchmarkRate, color: C.green },
                  { label: 'Median Time', value: result.ahaMoment.medianTimeToAha, color: C.red },
                  { label: 'Target Time', value: result.ahaMoment.targetTimeToAha, color: C.green },
                ].map((m, i) => (
                  <div key={i} style={{ backgroundColor: C.surface3, borderRadius: R.sm, padding: S[3], textAlign: 'center' }}>
                    <div style={{ fontFamily: F.mono, fontSize: '20px', fontWeight: 700, color: m.color }}>{m.value}</div>
                    <div style={{ fontFamily: F.body, fontSize: '10px', color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activation metrics */}
            <div style={{ ...cardStyle, marginBottom: S[4] }}>
              <div style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary, marginBottom: S[3] }}>Activation Metrics</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: S[3] }}>
                {result.activationMetrics.map((m, i) => {
                  const st = STATUS_COLORS[m.status] || STATUS_COLORS.below;
                  return (
                    <div key={i} style={{ backgroundColor: st.bg, border: `1px solid ${st.color}20`, borderRadius: R.sm, padding: S[3] }}>
                      <div style={{ fontFamily: F.mono, fontSize: '20px', fontWeight: 700, color: st.color }}>{m.value}</div>
                      <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textPrimary, fontWeight: 600, marginTop: S[1] }}>{m.label}</div>
                      <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, marginTop: '2px' }}>Target: {m.target}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Onboarding steps */}
            <div style={{ ...cardStyle, marginBottom: S[4] }}>
              <div style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary, marginBottom: S[3] }}>Onboarding Step Analysis</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
                {result.onboardingSteps.map((step, i) => {
                  const barColor = step.completionRate >= 70 ? C.green : step.completionRate >= 40 ? C.amber : C.red;
                  return (
                    <div key={i} style={{ backgroundColor: C.surface2, borderRadius: R.sm, padding: `${S[3]} ${S[4]}`, border: `1px solid ${C.border}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: S[2] }}>
                        <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary }}>{step.step}</span>
                        <div style={{ display: 'flex', gap: S[3] }}>
                          <span style={{ fontFamily: F.mono, fontSize: '12px', fontWeight: 700, color: barColor }}>{step.completionRate}%</span>
                          <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.red }}>-{step.dropoff}% drop</span>
                        </div>
                      </div>
                      <div style={{ height: 6, backgroundColor: C.surface3, borderRadius: R.pill, marginBottom: S[2] }}>
                        <div style={{ height: '100%', width: `${step.completionRate}%`, backgroundColor: barColor, borderRadius: R.pill, transition: 'width 0.6s ease' }} />
                      </div>
                      <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary }}>
                        Recommendation: {step.recommendation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommendations */}
            <div style={cardStyle}>
              <div style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary, marginBottom: S[3] }}>Recommendations</div>
              {result.recommendations.map((rec, i) => {
                const pCfg = PRIORITY_COLORS[rec.priority] || PRIORITY_COLORS.medium;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: S[2], padding: `${S[2]} 0`, borderBottom: i < result.recommendations.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                    <span style={makeStyles(badge.base, { backgroundColor: pCfg.bg, color: pCfg.color, border: 'none' })}>{rec.priority}</span>
                    <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textPrimary }}>{rec.text}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Empty state */}
        {!result && !thinking && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: `${S[16]} 0`, gap: S[3] }}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path d="M12 36V20M20 36V16M28 36V24M36 36V12" stroke={C.textMuted} strokeWidth="2" strokeLinecap="round"/>
              <path d="M8 40h32" stroke={C.textMuted} strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <div style={{ fontFamily: F.body, fontSize: '14px', color: C.textMuted, textAlign: 'center' }}>
              Click "Optimize Onboarding" to analyze your activation funnel and get recommendations for improving retention
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
