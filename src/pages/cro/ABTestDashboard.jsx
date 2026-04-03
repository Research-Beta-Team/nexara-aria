/**
 * A/B Test Dashboard — A/B test control center powered by Optimizer agent.
 * Active tests list, new test setup, completed test results with
 * conversion charts, significance indicators, and winner badges.
 */
import { useState } from 'react';
import { C, F, R, S, T, btn, badge, shadows, sectionHeading, sectionSubheading, makeStyles, cardStyle, inputStyle } from '../../tokens';
import useToast from '../../hooks/useToast';
import { useAgent } from '../../hooks/useAgent';
import AgentThinking from '../../components/agents/AgentThinking';
import AgentResultPanel from '../../components/agents/AgentResultPanel';

/* ─── Mock test data ────────────────────────────────────────── */
const MOCK_TESTS = [
  {
    id: 'test-1', name: 'Hero Headline Copy', status: 'running', daysRunning: 12,
    sampleSize: { current: 4820, target: 6000 }, confidence: 87,
    variants: [
      { name: 'Control', conversion: 3.2, visitors: 2410 },
      { name: 'Benefit-First', conversion: 4.1, visitors: 2410 },
    ],
    metric: 'Signup conversion rate',
  },
  {
    id: 'test-2', name: 'CTA Button Color', status: 'running', daysRunning: 8,
    sampleSize: { current: 3200, target: 5000 }, confidence: 72,
    variants: [
      { name: 'Green (Control)', conversion: 2.8, visitors: 1600 },
      { name: 'Orange', conversion: 3.1, visitors: 1600 },
    ],
    metric: 'Click-through rate',
  },
  {
    id: 'test-3', name: 'Pricing Page Layout', status: 'running', daysRunning: 5,
    sampleSize: { current: 1800, target: 4000 }, confidence: 54,
    variants: [
      { name: 'Horizontal (Control)', conversion: 5.1, visitors: 900 },
      { name: 'Vertical Cards', conversion: 5.4, visitors: 900 },
    ],
    metric: 'Plan selection rate',
  },
  {
    id: 'test-4', name: 'Exit Intent Popup Copy', status: 'completed', daysRunning: 21,
    sampleSize: { current: 8400, target: 8000 }, confidence: 96,
    variants: [
      { name: 'Discount Offer', conversion: 4.8, visitors: 4200 },
      { name: 'Content Lead Magnet', conversion: 6.2, visitors: 4200, winner: true },
    ],
    metric: 'Email capture rate',
    winner: 'Content Lead Magnet',
    lift: '+29.2%',
  },
  {
    id: 'test-5', name: 'Signup Form Length', status: 'completed', daysRunning: 28,
    sampleSize: { current: 12000, target: 10000 }, confidence: 99,
    variants: [
      { name: '8 Fields (Control)', conversion: 12.4, visitors: 4000 },
      { name: '5 Fields', conversion: 18.1, visitors: 4000, winner: true },
      { name: '3 Fields + Progressive', conversion: 16.8, visitors: 4000 },
    ],
    metric: 'Form completion rate',
    winner: '5 Fields',
    lift: '+46.0%',
  },
];

const MOCK_NEW_TEST = {
  name: 'Social Proof Placement',
  hypothesis: 'Moving customer logos above the fold increases trust and signup conversion',
  variants: [
    { name: 'Control', description: 'Logos below the fold in dedicated section' },
    { name: 'Above Fold', description: 'Logo bar directly under hero headline' },
    { name: 'Inline Testimonials', description: 'Customer quotes interspersed with feature sections' },
  ],
  primaryMetric: 'Signup conversion rate',
  secondaryMetric: 'Time on page',
  sampleSizePerVariant: 2000,
  estimatedDuration: '3-4 weeks',
  minimumDetectableEffect: '15%',
  trafficAllocation: '33% / 33% / 34%',
};

const STATUS_CONFIG = {
  running:   { bg: C.greenDim, color: C.green, label: 'RUNNING' },
  completed: { bg: 'rgba(59,130,246,0.15)', color: '#3B82F6', label: 'COMPLETED' },
  draft:     { bg: C.surface3, color: C.textMuted, label: 'DRAFT' },
};

/* ─── ConversionBar ─────────────────────────────────────────── */
function ConversionBar({ variants, maxConversion }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
      {variants.map((v, i) => {
        const width = maxConversion > 0 ? (v.conversion / maxConversion) * 100 : 0;
        const barColor = v.winner ? C.green : i === 0 ? C.primary : C.secondary;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
            <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textPrimary, minWidth: '140px', display: 'flex', alignItems: 'center', gap: S[2] }}>
              {v.name}
              {v.winner && <span style={makeStyles(badge.base, badge.green)}>WINNER</span>}
            </div>
            <div style={{ flex: 1, height: 20, backgroundColor: C.surface3, borderRadius: R.sm, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${width}%`, backgroundColor: barColor,
                borderRadius: R.sm, transition: 'width 0.6s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: S[2],
              }}>
                <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textInverse }}>
                  {v.conversion}%
                </span>
              </div>
            </div>
            <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, minWidth: '60px', textAlign: 'right' }}>
              n={v.visitors.toLocaleString()}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── TestCard ──────────────────────────────────────────────── */
function TestCard({ test }) {
  const st = STATUS_CONFIG[test.status] || STATUS_CONFIG.draft;
  const maxConversion = Math.max(...test.variants.map(v => v.conversion));
  const progressPct = Math.min(100, (test.sampleSize.current / test.sampleSize.target) * 100);
  const confColor = test.confidence >= 95 ? C.green : test.confidence >= 80 ? C.amber : C.textMuted;

  return (
    <div style={{ ...cardStyle, marginBottom: S[3] }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[3] }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
          <span style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary }}>{test.name}</span>
          <span style={makeStyles(badge.base, { backgroundColor: st.bg, color: st.color, border: 'none' })}>{st.label}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
          {test.lift && <span style={makeStyles(badge.base, badge.green)}>{test.lift} lift</span>}
          <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>{test.daysRunning}d running</span>
        </div>
      </div>

      {/* Conversion bars */}
      <ConversionBar variants={test.variants} maxConversion={maxConversion} />

      {/* Footer stats */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: S[3], paddingTop: S[3], borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', gap: S[4] }}>
          <div>
            <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>METRIC</div>
            <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textPrimary }}>{test.metric}</div>
          </div>
          <div>
            <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>CONFIDENCE</div>
            <div style={{ fontFamily: F.mono, fontSize: '14px', fontWeight: 700, color: confColor }}>{test.confidence}%</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
          <div style={{ width: 120, height: 6, backgroundColor: C.surface3, borderRadius: R.pill }}>
            <div style={{ height: '100%', width: `${progressPct}%`, backgroundColor: progressPct >= 100 ? C.green : C.primary, borderRadius: R.pill }} />
          </div>
          <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>
            {test.sampleSize.current.toLocaleString()}/{test.sampleSize.target.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── ABTestDashboard ───────────────────────────────────────── */
export default function ABTestDashboard() {
  const toast = useToast();
  const optimizer = useAgent('optimizer');
  const [tests] = useState(MOCK_TESTS);
  const [showNewTest, setShowNewTest] = useState(false);
  const [newTestResult, setNewTestResult] = useState(null);
  const [thinking, setThinking] = useState(false);
  const [agentResult, setAgentResult] = useState(null);
  const [tab, setTab] = useState('active');

  const activeTests = tests.filter(t => t.status === 'running');
  const completedTests = tests.filter(t => t.status === 'completed');

  const handleSetupTest = async () => {
    setThinking(true);
    setNewTestResult(null);
    setAgentResult(null);
    try {
      await optimizer.activate('ab-test-setup', { skill: 'ab-test-setup' });
      await new Promise(r => setTimeout(r, 2200));
      setNewTestResult(MOCK_NEW_TEST);
      setAgentResult({
        agentId: 'optimizer',
        skill: 'ab-test-setup',
        confidence: 93,
        creditsUsed: 45,
        output: {
          metrics: [
            { label: 'Variants', value: MOCK_NEW_TEST.variants.length.toString() },
            { label: 'Sample/Variant', value: MOCK_NEW_TEST.sampleSizePerVariant.toLocaleString() },
            { label: 'Duration', value: MOCK_NEW_TEST.estimatedDuration },
            { label: 'MDE', value: MOCK_NEW_TEST.minimumDetectableEffect },
          ],
        },
      });
      toast.success('Test configuration generated');
    } catch {
      toast.error('Setup failed');
    } finally {
      setThinking(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: C.bg, padding: `${S[6]} ${S[6]} ${S[8]}` }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[6] }}>
          <div>
            <h1 style={{ ...sectionHeading, fontSize: '28px', letterSpacing: '-0.03em', margin: 0, fontFamily: F.display }}>A/B Test Dashboard</h1>
            <p style={{ ...sectionSubheading, marginTop: S[1] }}>
              Manage and monitor all your conversion experiments. Setup new tests with AI-powered hypothesis generation.
            </p>
          </div>
          <button style={{ ...btn.primary, fontSize: '14px', padding: `${S[3]} ${S[6]}` }} onClick={() => { setShowNewTest(true); handleSetupTest(); }}>
            + Setup New Test
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: S[1], marginBottom: S[4], backgroundColor: C.surface, borderRadius: R.button, padding: '3px', width: 'fit-content' }}>
          {[
            { id: 'active', label: `Active (${activeTests.length})` },
            { id: 'completed', label: `Completed (${completedTests.length})` },
          ].map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setShowNewTest(false); }} style={{
              ...btn.ghost, backgroundColor: tab === t.id ? C.surface3 : 'transparent',
              color: tab === t.id ? C.textPrimary : C.textSecondary,
              fontWeight: tab === t.id ? 600 : 500,
              padding: `${S[2]} ${S[4]}`, borderRadius: R.button,
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* New test setup */}
        {showNewTest && (
          <div style={{ marginBottom: S[4] }}>
            {thinking && <div style={{ marginBottom: S[4] }}><AgentThinking agentId="optimizer" task="Generating A/B test configuration..." /></div>}
            {agentResult && !thinking && <div style={{ marginBottom: S[4] }}><AgentResultPanel result={agentResult} /></div>}
            {newTestResult && !thinking && (
              <div style={{ ...cardStyle, border: `1px solid ${C.primary}40` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[4] }}>
                  <div style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary }}>
                    New Test: {newTestResult.name}
                  </div>
                  <button style={{ ...btn.primary, fontSize: '12px', padding: `${S[1]} ${S[4]}` }} onClick={() => { toast.success('Test launched (mock)'); setShowNewTest(false); }}>
                    Launch Test
                  </button>
                </div>

                <div style={{ backgroundColor: C.surface2, borderRadius: R.sm, padding: S[4], marginBottom: S[4] }}>
                  <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, textTransform: 'uppercase', marginBottom: S[1] }}>HYPOTHESIS</div>
                  <div style={{ fontFamily: F.body, fontSize: '14px', color: C.textPrimary, lineHeight: 1.4 }}>{newTestResult.hypothesis}</div>
                </div>

                <div style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textSecondary, marginBottom: S[2] }}>Variants</div>
                <div style={{ display: 'flex', gap: S[3], marginBottom: S[4] }}>
                  {newTestResult.variants.map((v, i) => (
                    <div key={i} style={{ flex: 1, backgroundColor: C.surface2, borderRadius: R.sm, padding: S[3], border: `1px solid ${C.border}` }}>
                      <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary, marginBottom: S[1] }}>
                        {v.name}
                      </div>
                      <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary }}>{v.description}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: S[3] }}>
                  {[
                    { label: 'Primary Metric', value: newTestResult.primaryMetric },
                    { label: 'Sample/Variant', value: newTestResult.sampleSizePerVariant.toLocaleString() },
                    { label: 'Est. Duration', value: newTestResult.estimatedDuration },
                    { label: 'Traffic Split', value: newTestResult.trafficAllocation },
                  ].map((m, i) => (
                    <div key={i} style={{ backgroundColor: C.surface3, borderRadius: R.sm, padding: S[3] }}>
                      <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, textTransform: 'uppercase' }}>{m.label}</div>
                      <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary, marginTop: '2px' }}>{m.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Active tests */}
        {tab === 'active' && !showNewTest && (
          <div>
            {activeTests.length === 0 ? (
              <div style={{ ...cardStyle, textAlign: 'center', padding: S[8] }}>
                <div style={{ fontFamily: F.body, fontSize: '14px', color: C.textMuted }}>No active tests. Click "Setup New Test" to create one.</div>
              </div>
            ) : (
              activeTests.map(test => <TestCard key={test.id} test={test} />)
            )}
          </div>
        )}

        {/* Completed tests */}
        {tab === 'completed' && !showNewTest && (
          <div>
            {completedTests.length === 0 ? (
              <div style={{ ...cardStyle, textAlign: 'center', padding: S[8] }}>
                <div style={{ fontFamily: F.body, fontSize: '14px', color: C.textMuted }}>No completed tests yet.</div>
              </div>
            ) : (
              completedTests.map(test => <TestCard key={test.id} test={test} />)
            )}
          </div>
        )}
      </div>
    </div>
  );
}
