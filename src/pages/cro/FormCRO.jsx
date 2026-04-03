/**
 * Form CRO — Form optimization powered by Optimizer agent.
 * Analyzes field count, friction points, mobile readiness,
 * before/after comparison, and priority recommendations.
 */
import { useState } from 'react';
import { C, F, R, S, T, btn, badge, shadows, sectionHeading, sectionSubheading, makeStyles, cardStyle } from '../../tokens';
import useToast from '../../hooks/useToast';
import { useAgent } from '../../hooks/useAgent';
import AgentThinking from '../../components/agents/AgentThinking';
import AgentResultPanel from '../../components/agents/AgentResultPanel';

/* ─── Mock form audit data ──────────────────────────────────── */
const MOCK_FORM_AUDIT = {
  overallScore: 56,
  fieldCount: { current: 12, recommended: 6, reduction: '50%' },
  mobileReadiness: 62,
  frictionPoints: [
    { severity: 'critical', title: 'Required phone number field', description: 'Phone number requirement causes 23% form abandonment. Make optional or remove.' },
    { severity: 'critical', title: 'No inline validation', description: 'Users only see errors after submission. Add real-time field validation.' },
    { severity: 'warning', title: 'Company size dropdown has 15 options', description: 'Simplify to 4-5 ranges (1-10, 11-50, 51-200, 201-1000, 1000+).' },
    { severity: 'warning', title: 'Address fields not auto-completing', description: 'Integrate Google Places API for address auto-fill.' },
    { severity: 'info', title: 'Submit button says "Submit"', description: 'Change to benefit-oriented copy like "Get My Free Report".' },
  ],
  currentFields: [
    { name: 'First Name', required: true, keep: true },
    { name: 'Last Name', required: true, keep: true },
    { name: 'Email', required: true, keep: true },
    { name: 'Phone', required: true, keep: false },
    { name: 'Company', required: true, keep: true },
    { name: 'Company Size', required: true, keep: true },
    { name: 'Job Title', required: true, keep: true },
    { name: 'Industry', required: false, keep: false },
    { name: 'Address Line 1', required: false, keep: false },
    { name: 'Address Line 2', required: false, keep: false },
    { name: 'City', required: false, keep: false },
    { name: 'How did you hear about us?', required: false, keep: false },
  ],
  recommendations: [
    { text: 'Remove phone, industry, address, and referral source fields', priority: 'high', impact: 'High', effort: 'Low' },
    { text: 'Add progress indicator for multi-step conversion', priority: 'high', impact: 'High', effort: 'Medium' },
    { text: 'Implement inline validation with green checkmarks', priority: 'high', impact: 'High', effort: 'Medium' },
    { text: 'Add social proof near submit button ("Join 2,400+ organizations")', priority: 'medium', impact: 'Medium', effort: 'Low' },
    { text: 'Enable autofill attributes on all standard fields', priority: 'medium', impact: 'Medium', effort: 'Low' },
    { text: 'Make mobile tap targets at least 48px height', priority: 'medium', impact: 'Medium', effort: 'Low' },
  ],
};

const SEVERITY_COLORS = {
  critical: { bg: C.redDim, color: C.red, label: 'CRITICAL' },
  warning:  { bg: C.amberDim, color: C.amber, label: 'WARNING' },
  info:     { bg: 'rgba(59,130,246,0.15)', color: '#3B82F6', label: 'INFO' },
};

const PRIORITY_COLORS = {
  high:   { bg: C.redDim, color: C.red },
  medium: { bg: C.amberDim, color: C.amber },
  low:    { bg: C.greenDim, color: C.green },
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

/* ─── BeforeAfter comparison ────────────────────────────────── */
function BeforeAfterComparison({ fields }) {
  const keptFields = fields.filter(f => f.keep);
  const removedFields = fields.filter(f => !f.keep);
  const colStyle = { flex: 1, display: 'flex', flexDirection: 'column', gap: S[2] };
  const fieldRow = (field, removed = false) => (
    <div key={field.name} style={{
      display: 'flex', alignItems: 'center', gap: S[2],
      padding: `${S[2]} ${S[3]}`,
      backgroundColor: removed ? C.redDim : C.surface2,
      border: `1px solid ${removed ? C.red + '30' : C.border}`,
      borderRadius: R.sm,
      opacity: removed ? 0.6 : 1,
    }}>
      <span style={{ fontFamily: F.body, fontSize: '12px', color: removed ? C.red : C.textPrimary, flex: 1, textDecoration: removed ? 'line-through' : 'none' }}>
        {field.name}
      </span>
      {field.required && <span style={{ fontFamily: F.mono, fontSize: '9px', color: C.textMuted }}>REQ</span>}
    </div>
  );

  return (
    <div style={{ ...cardStyle, marginBottom: S[4] }}>
      <div style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary, marginBottom: S[4] }}>Before / After Comparison</div>
      <div style={{ display: 'flex', gap: S[5] }}>
        <div style={colStyle}>
          <div style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: C.red, textTransform: 'uppercase', marginBottom: S[1] }}>
            Current ({fields.length} fields)
          </div>
          {fields.map(f => fieldRow(f, !f.keep))}
        </div>
        <div style={{ width: '1px', backgroundColor: C.border, flexShrink: 0 }} />
        <div style={colStyle}>
          <div style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: C.green, textTransform: 'uppercase', marginBottom: S[1] }}>
            Recommended ({keptFields.length} fields)
          </div>
          {keptFields.map(f => fieldRow(f))}
        </div>
      </div>
    </div>
  );
}

/* ─── FormCRO ──────────────────────────────────────────────── */
export default function FormCRO() {
  const toast = useToast();
  const optimizer = useAgent('optimizer');
  const [result, setResult] = useState(null);
  const [thinking, setThinking] = useState(false);
  const [agentResult, setAgentResult] = useState(null);
  const [formInput, setFormInput] = useState('https://medglobal.org/contact');

  const handleOptimize = async () => {
    if (!formInput.trim()) { toast.error('Please enter a form URL or name'); return; }
    setThinking(true);
    setResult(null);
    setAgentResult(null);
    try {
      await optimizer.activate('form-cro', { skill: 'form-cro', url: formInput });
      await new Promise(r => setTimeout(r, 2200));
      setResult(MOCK_FORM_AUDIT);
      setAgentResult({
        agentId: 'optimizer',
        skill: 'form-cro',
        confidence: 89,
        creditsUsed: 55,
        output: {
          metrics: [
            { label: 'Form Score', value: `${MOCK_FORM_AUDIT.overallScore}/100` },
            { label: 'Fields to Remove', value: (MOCK_FORM_AUDIT.fieldCount.current - MOCK_FORM_AUDIT.fieldCount.recommended).toString() },
            { label: 'Mobile Score', value: `${MOCK_FORM_AUDIT.mobileReadiness}/100` },
            { label: 'Friction Points', value: MOCK_FORM_AUDIT.frictionPoints.length.toString() },
          ],
        },
      });
      toast.success('Form optimization complete');
    } catch {
      toast.error('Optimization failed');
    } finally {
      setThinking(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: C.bg, padding: `${S[6]} ${S[6]} ${S[8]}` }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: S[6] }}>
          <h1 style={{ ...sectionHeading, fontSize: '28px', letterSpacing: '-0.03em', margin: 0, fontFamily: F.display }}>Form CRO</h1>
          <p style={{ ...sectionSubheading, marginTop: S[1] }}>
            Optimize any form for maximum completion rate. Analyzes field count, friction points, mobile readiness, and provides a recommended simplified layout.
          </p>
        </div>

        {/* Input */}
        <div style={{
          display: 'flex', gap: S[3], alignItems: 'center',
          backgroundColor: C.surface, border: `1px solid ${C.border}`,
          borderRadius: R.card, padding: `${S[3]} ${S[4]}`, marginBottom: S[4],
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="3" width="12" height="10" rx="1.5" stroke={C.textMuted} strokeWidth="1.3"/>
            <path d="M5 6h6M5 9h4" stroke={C.textMuted} strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <input type="text" value={formInput} onChange={e => setFormInput(e.target.value)}
            placeholder="Enter form URL or form name..."
            style={{ flex: 1, backgroundColor: 'transparent', border: 'none', fontFamily: F.body, fontSize: '14px', color: C.textPrimary, outline: 'none' }}
          />
          <button style={{ ...btn.primary, fontSize: '13px', padding: `${S[2]} ${S[5]}` }} onClick={handleOptimize} disabled={thinking}>
            {thinking ? 'Optimizing...' : 'Optimize Form'}
          </button>
        </div>

        {/* Thinking */}
        {thinking && <div style={{ marginBottom: S[4] }}><AgentThinking agentId="optimizer" task={`Analyzing form: ${formInput}...`} /></div>}

        {/* Agent result */}
        {agentResult && !thinking && <div style={{ marginBottom: S[4] }}><AgentResultPanel result={agentResult} /></div>}

        {/* Results */}
        {result && !thinking && (
          <>
            {/* Score cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: S[4], marginBottom: S[4] }}>
              <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: S[4] }}>
                <ScoreRing score={result.overallScore} size={72} strokeWidth={5} />
                <div>
                  <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>Overall Score</div>
                  <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>Form conversion readiness</div>
                </div>
              </div>
              <div style={{ ...cardStyle }}>
                <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary, marginBottom: S[2] }}>Field Analysis</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: S[2] }}>
                  <span style={{ fontFamily: F.mono, fontSize: '28px', fontWeight: 700, color: C.red }}>{result.fieldCount.current}</span>
                  <span style={{ fontFamily: F.mono, fontSize: '16px', color: C.textMuted }}>→</span>
                  <span style={{ fontFamily: F.mono, fontSize: '28px', fontWeight: 700, color: C.green }}>{result.fieldCount.recommended}</span>
                </div>
                <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>Reduce by {result.fieldCount.reduction}</div>
              </div>
              <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: S[4] }}>
                <ScoreRing score={result.mobileReadiness} size={72} strokeWidth={5} />
                <div>
                  <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>Mobile Readiness</div>
                  <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>Tap targets, layout, speed</div>
                </div>
              </div>
            </div>

            {/* Before/After */}
            <BeforeAfterComparison fields={result.currentFields} />

            {/* Friction Points */}
            <div style={{ ...cardStyle, marginBottom: S[4] }}>
              <div style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary, marginBottom: S[3] }}>Friction Points</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
                {result.frictionPoints.map((fp, i) => {
                  const sev = SEVERITY_COLORS[fp.severity] || SEVERITY_COLORS.info;
                  return (
                    <div key={i} style={{ backgroundColor: sev.bg, border: `1px solid ${sev.color}25`, borderRadius: R.sm, padding: `${S[3]} ${S[4]}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginBottom: S[1] }}>
                        <span style={{ fontFamily: F.mono, fontSize: '9px', fontWeight: 700, color: sev.color, backgroundColor: `${sev.color}20`, borderRadius: R.pill, padding: '1px 6px', textTransform: 'uppercase' }}>{sev.label}</span>
                        <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary }}>{fp.title}</span>
                      </div>
                      <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, lineHeight: 1.4, paddingLeft: S[1] }}>{fp.description}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommendations */}
            <div style={{ ...cardStyle }}>
              <div style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary, marginBottom: S[3] }}>Recommendations</div>
              {result.recommendations.map((rec, i) => {
                const pCfg = PRIORITY_COLORS[rec.priority] || PRIORITY_COLORS.medium;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: S[2], padding: `${S[2]} 0`, borderBottom: i < result.recommendations.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                    <span style={makeStyles(badge.base, { backgroundColor: pCfg.bg, color: pCfg.color, border: 'none' })}>{rec.priority}</span>
                    <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textPrimary, flex: 1 }}>{rec.text}</span>
                    <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>Impact: {rec.impact}</span>
                    <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>Effort: {rec.effort}</span>
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
              <rect x="8" y="6" width="32" height="36" rx="3" stroke={C.textMuted} strokeWidth="2"/>
              <path d="M14 14h20M14 22h20M14 30h12" stroke={C.textMuted} strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <div style={{ fontFamily: F.body, fontSize: '14px', color: C.textMuted, textAlign: 'center' }}>
              Enter a form URL or name and click "Optimize Form" to analyze friction points and get recommendations
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
