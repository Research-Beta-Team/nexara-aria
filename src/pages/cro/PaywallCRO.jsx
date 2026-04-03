/**
 * Paywall CRO — Upgrade/paywall optimizer powered by Optimizer agent.
 * Analyzes feature gates, trial expiry strategy, upgrade flow,
 * and generates testing strategies for paywall variants.
 */
import { useState } from 'react';
import { C, F, R, S, T, btn, badge, shadows, sectionHeading, sectionSubheading, makeStyles, cardStyle, inputStyle } from '../../tokens';
import useToast from '../../hooks/useToast';
import { useAgent } from '../../hooks/useAgent';
import AgentThinking from '../../components/agents/AgentThinking';
import AgentResultPanel from '../../components/agents/AgentResultPanel';

/* ─── Mock paywall audit ────────────────────────────────────── */
const MOCK_PAYWALL = {
  overallScore: 52,
  featureGates: [
    { feature: 'AI Campaign Generation', gate: 'Hard paywall', plan: 'Growth', score: 40, recommendation: 'Show a preview of AI output with blurred details; let users see value before paying' },
    { feature: 'Advanced Analytics', gate: 'Usage limit (3 reports/mo)', plan: 'Growth', score: 65, recommendation: 'Good approach. Consider increasing limit to 5 to show more value' },
    { feature: 'White-Label Reports', gate: 'Hard paywall', plan: 'Scale', score: 35, recommendation: 'Allow 1 branded report free to demonstrate quality' },
    { feature: 'API Access', gate: 'Hard paywall', plan: 'Scale', score: 70, recommendation: 'Current gate is appropriate for technical feature' },
    { feature: 'Team Collaboration', gate: 'Seat limit (1 user)', plan: 'Starter', score: 50, recommendation: 'Allow inviting 1 teammate with viewer access to create sharing habit' },
  ],
  trialStrategy: {
    currentTrialDays: 14,
    recommendedTrialDays: 7,
    currentActivationRate: '22%',
    reasoning: 'Shorter trial creates urgency. 14-day trials see engagement drop after day 5. Recommend 7-day trial with option to extend via completing onboarding tasks.',
    expirySequence: [
      { day: 'Day 1', action: 'Welcome email with 3 quick wins to complete' },
      { day: 'Day 3', action: 'Check-in: "You haven\'t tried X yet" with guided tutorial' },
      { day: 'Day 5', action: 'Value recap email showing usage stats and outcomes' },
      { day: 'Day 6', action: 'Urgency: "1 day left" with limited-time annual discount' },
      { day: 'Day 7', action: 'Trial expired: graceful downgrade with clear comparison of what they lose' },
      { day: 'Day 8', action: 'Win-back: "We miss you" with 48-hour extension offer' },
    ],
  },
  upgradeFlow: {
    currentConversion: '4.2%',
    benchmarkConversion: '8-12%',
    issues: [
      { severity: 'critical', title: 'Pricing page has no social proof', description: 'Add customer logos, testimonial quotes, and "X companies upgraded this month"' },
      { severity: 'critical', title: 'No plan comparison table', description: 'Users can\'t easily compare what they get at each tier' },
      { severity: 'warning', title: 'Annual billing not prominently displayed', description: 'Show annual savings as a percentage badge next to monthly price' },
      { severity: 'warning', title: 'No live chat on pricing page', description: 'Add chatbot or "Talk to Sales" for enterprise prospects' },
      { severity: 'info', title: 'No money-back guarantee', description: 'Add 30-day refund policy to reduce purchase anxiety' },
    ],
  },
  testingStrategies: [
    { name: 'Trial Length Test', hypothesis: '7-day trial converts better than 14-day', variants: ['7-day trial', '14-day trial', '7-day with extension offer'], metric: 'Trial-to-paid conversion rate', duration: '4 weeks', sampleSize: '1,000 per variant' },
    { name: 'Pricing Anchor Test', hypothesis: 'Showing enterprise tier first increases Growth plan conversion', variants: ['Low-to-high (current)', 'High-to-low', 'Recommended plan highlighted'], metric: 'Plan selection + payment completion', duration: '3 weeks', sampleSize: '800 per variant' },
    { name: 'Feature Gate Test', hypothesis: 'Soft paywall (preview + blur) converts better than hard paywall', variants: ['Hard paywall', 'Soft paywall with preview', 'Usage limit (3/month)'], metric: 'Upgrade click-through rate', duration: '4 weeks', sampleSize: '1,200 per variant' },
    { name: 'Urgency Messaging Test', hypothesis: 'Countdown timer increases trial-to-paid conversion', variants: ['No countdown', 'Days remaining badge', 'Full countdown timer + email sequence'], metric: 'Conversion before trial expiry', duration: '6 weeks', sampleSize: '1,500 per variant' },
  ],
};

const SEVERITY_COLORS = {
  critical: { bg: C.redDim, color: C.red, label: 'CRITICAL' },
  warning:  { bg: C.amberDim, color: C.amber, label: 'WARNING' },
  info:     { bg: 'rgba(59,130,246,0.15)', color: '#3B82F6', label: 'INFO' },
};

/* ─── ScoreRing ─────────────────────────────────────────────── */
function ScoreRing({ score, size = 80, strokeWidth = 6 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);
  const color = score >= 80 ? C.green : score >= 60 ? C.amber : C.red;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={C.border} strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: F.mono, fontSize: size * 0.28, fontWeight: 700, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontFamily: F.mono, fontSize: size * 0.12, color: C.textMuted }}>/ 100</span>
      </div>
    </div>
  );
}

/* ─── PaywallCRO ────────────────────────────────────────────── */
export default function PaywallCRO() {
  const toast = useToast();
  const optimizer = useAgent('optimizer');
  const [result, setResult] = useState(null);
  const [thinking, setThinking] = useState(false);
  const [agentResult, setAgentResult] = useState(null);
  const [paywallDesc, setPaywallDesc] = useState('SaaS product with Starter (free), Growth ($49/mo), Scale ($149/mo) tiers. 14-day free trial on Growth. Hard paywall on AI features and analytics.');

  const handleOptimize = async () => {
    if (!paywallDesc.trim()) { toast.error('Please describe your current paywall'); return; }
    setThinking(true);
    setResult(null);
    setAgentResult(null);
    try {
      await optimizer.activate('paywall-upgrade-cro', { skill: 'paywall-upgrade-cro', description: paywallDesc });
      await new Promise(r => setTimeout(r, 2600));
      setResult(MOCK_PAYWALL);
      setAgentResult({
        agentId: 'optimizer',
        skill: 'paywall-upgrade-cro',
        confidence: 87,
        creditsUsed: 80,
        output: {
          metrics: [
            { label: 'Paywall Score', value: `${MOCK_PAYWALL.overallScore}/100` },
            { label: 'Current CVR', value: MOCK_PAYWALL.upgradeFlow.currentConversion },
            { label: 'Benchmark', value: MOCK_PAYWALL.upgradeFlow.benchmarkConversion },
            { label: 'Test Strategies', value: MOCK_PAYWALL.testingStrategies.length.toString() },
          ],
        },
      });
      toast.success('Paywall analysis complete');
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
          <h1 style={{ ...sectionHeading, fontSize: '28px', letterSpacing: '-0.03em', margin: 0, fontFamily: F.display }}>Paywall CRO</h1>
          <p style={{ ...sectionSubheading, marginTop: S[1] }}>
            Optimize your upgrade experience and paywall strategy. Analyzes feature gates, trial flow, and generates A/B testing strategies.
          </p>
        </div>

        {/* Input */}
        <div style={{ ...cardStyle, marginBottom: S[4] }}>
          <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>
            Describe your current paywall / pricing setup
          </div>
          <textarea value={paywallDesc} onChange={e => setPaywallDesc(e.target.value)}
            rows={3} placeholder="Describe your tiers, trial structure, and feature gates..."
            style={{ ...inputStyle, resize: 'vertical', minHeight: '80px', marginBottom: S[3] }}
          />
          <button style={{ ...btn.primary, fontSize: '13px', padding: `${S[2]} ${S[5]}` }} onClick={handleOptimize} disabled={thinking}>
            {thinking ? 'Optimizing...' : 'Optimize Paywall'}
          </button>
        </div>

        {/* Thinking */}
        {thinking && <div style={{ marginBottom: S[4] }}><AgentThinking agentId="optimizer" task="Analyzing paywall and upgrade flow..." /></div>}
        {agentResult && !thinking && <div style={{ marginBottom: S[4] }}><AgentResultPanel result={agentResult} /></div>}

        {/* Results */}
        {result && !thinking && (
          <>
            {/* Feature gates */}
            <div style={{ ...cardStyle, marginBottom: S[4] }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: S[4], marginBottom: S[4] }}>
                <ScoreRing score={result.overallScore} size={72} strokeWidth={5} />
                <div>
                  <div style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary }}>Feature Gate Analysis</div>
                  <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>How well your gates drive upgrades</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
                {result.featureGates.map((fg, i) => {
                  const scoreColor = fg.score >= 70 ? C.green : fg.score >= 50 ? C.amber : C.red;
                  return (
                    <div key={i} style={{ backgroundColor: C.surface2, borderRadius: R.sm, padding: `${S[3]} ${S[4]}`, border: `1px solid ${C.border}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[2] }}>
                        <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary }}>{fg.feature}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                          <span style={makeStyles(badge.base, badge.muted)}>{fg.gate}</span>
                          <span style={makeStyles(badge.base, badge.muted)}>{fg.plan}</span>
                          <span style={{ fontFamily: F.mono, fontSize: '12px', fontWeight: 700, color: scoreColor }}>{fg.score}/100</span>
                        </div>
                      </div>
                      <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, lineHeight: 1.4 }}>{fg.recommendation}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Trial strategy */}
            <div style={{ ...cardStyle, marginBottom: S[4] }}>
              <div style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary, marginBottom: S[3] }}>Trial Expiry Strategy</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: S[3], marginBottom: S[4] }}>
                <div style={{ backgroundColor: C.surface3, borderRadius: R.sm, padding: S[3], textAlign: 'center' }}>
                  <div style={{ fontFamily: F.mono, fontSize: '24px', fontWeight: 700, color: C.amber }}>{result.trialStrategy.currentTrialDays}d</div>
                  <div style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted }}>CURRENT TRIAL</div>
                </div>
                <div style={{ backgroundColor: C.greenDim, borderRadius: R.sm, padding: S[3], textAlign: 'center' }}>
                  <div style={{ fontFamily: F.mono, fontSize: '24px', fontWeight: 700, color: C.green }}>{result.trialStrategy.recommendedTrialDays}d</div>
                  <div style={{ fontFamily: F.body, fontSize: '10px', color: C.green }}>RECOMMENDED</div>
                </div>
                <div style={{ backgroundColor: C.surface3, borderRadius: R.sm, padding: S[3], textAlign: 'center' }}>
                  <div style={{ fontFamily: F.mono, fontSize: '24px', fontWeight: 700, color: C.red }}>{result.trialStrategy.currentActivationRate}</div>
                  <div style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted }}>ACTIVATION RATE</div>
                </div>
              </div>
              <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, lineHeight: 1.5, marginBottom: S[4] }}>
                {result.trialStrategy.reasoning}
              </div>
              <div style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textSecondary, marginBottom: S[2] }}>Expiry Email Sequence</div>
              {result.trialStrategy.expirySequence.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: S[3], padding: `${S[2]} 0`, borderBottom: i < result.trialStrategy.expirySequence.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                  <span style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: C.primary, minWidth: '50px' }}>{item.day}</span>
                  <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textPrimary }}>{item.action}</span>
                </div>
              ))}
            </div>

            {/* Upgrade flow issues */}
            <div style={{ ...cardStyle, marginBottom: S[4] }}>
              <div style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary, marginBottom: S[3] }}>Upgrade Flow Issues</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
                {result.upgradeFlow.issues.map((issue, i) => {
                  const sev = SEVERITY_COLORS[issue.severity] || SEVERITY_COLORS.info;
                  return (
                    <div key={i} style={{ backgroundColor: sev.bg, border: `1px solid ${sev.color}25`, borderRadius: R.sm, padding: `${S[3]} ${S[4]}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginBottom: S[1] }}>
                        <span style={{ fontFamily: F.mono, fontSize: '9px', fontWeight: 700, color: sev.color, backgroundColor: `${sev.color}20`, borderRadius: R.pill, padding: '1px 6px', textTransform: 'uppercase' }}>{sev.label}</span>
                        <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary }}>{issue.title}</span>
                      </div>
                      <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, lineHeight: 1.4 }}>{issue.description}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Testing strategies */}
            <div style={cardStyle}>
              <div style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary, marginBottom: S[3] }}>A/B Testing Strategies</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: S[3] }}>
                {result.testingStrategies.map((test, i) => (
                  <div key={i} style={{ backgroundColor: C.surface2, border: `1px solid ${C.border}`, borderRadius: R.sm, padding: S[4] }}>
                    <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary, marginBottom: S[2] }}>{test.name}</div>
                    <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, lineHeight: 1.4, marginBottom: S[3] }}>
                      <strong>Hypothesis:</strong> {test.hypothesis}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[1], marginBottom: S[2] }}>
                      {test.variants.map((v, vi) => (
                        <span key={vi} style={makeStyles(badge.base, badge.muted)}>{v}</span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: S[3] }}>
                      <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>{test.duration}</span>
                      <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>{test.sampleSize}</span>
                    </div>
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
              <rect x="6" y="10" width="36" height="28" rx="3" stroke={C.textMuted} strokeWidth="2"/>
              <path d="M6 20h36" stroke={C.textMuted} strokeWidth="1.5"/>
              <path d="M16 28h16M16 33h8" stroke={C.textMuted} strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="38" cy="14" r="6" fill={C.bg} stroke={C.textMuted} strokeWidth="1.5"/>
              <path d="M38 12v4M38 18v0" stroke={C.textMuted} strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <div style={{ fontFamily: F.body, fontSize: '14px', color: C.textMuted, textAlign: 'center' }}>
              Describe your paywall setup and click "Optimize Paywall" to get feature gate analysis and testing strategies
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
