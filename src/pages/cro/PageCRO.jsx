/**
 * Page CRO — Landing page optimizer powered by Optimizer agent.
 * Audits value prop clarity, headline strength, CTA effectiveness,
 * trust signals, objection handling with scores and heatmap.
 */
import { useState } from 'react';
import { C, F, R, S, T, btn, badge, shadows, sectionHeading, sectionSubheading, makeStyles } from '../../tokens';
import useToast from '../../hooks/useToast';
import { useAgent } from '../../hooks/useAgent';
import AgentThinking from '../../components/agents/AgentThinking';
import AgentResultPanel from '../../components/agents/AgentResultPanel';

/* ─── Mock audit result ─────────────────────────────────────── */
const MOCK_PAGE_AUDIT = {
  overall: 64,
  sections: [
    {
      id: 'valueProp',
      label: 'Value Prop Clarity',
      score: 58,
      issues: [
        { severity: 'critical', title: 'Headline doesn\'t communicate the core benefit', fix: 'Rewrite to lead with the primary outcome users achieve, not the product name.' },
        { severity: 'warning', title: 'Subheadline is generic ("We help businesses grow")', fix: 'Replace with a specific, quantified benefit statement (e.g. "Reduce churn by 40%").' },
      ],
      recommendations: [
        { text: 'Add a "How it works" 3-step section below the fold', priority: 'high', impact: 'High', effort: 'Low' },
        { text: 'Include a one-line explainer of who this is for', priority: 'medium', impact: 'Medium', effort: 'Low' },
      ],
    },
    {
      id: 'headline',
      label: 'Headline Strength',
      score: 62,
      issues: [
        { severity: 'warning', title: 'Headline is 14 words (ideal: 6-10)', fix: 'Shorten to a single punchy statement with power words.' },
        { severity: 'info', title: 'No emotional trigger words detected', fix: 'Include words like "effortless", "proven", "instant" to increase emotional resonance.' },
      ],
      recommendations: [
        { text: 'A/B test current headline against a benefit-first variant', priority: 'high', impact: 'High', effort: 'Low' },
        { text: 'Add a supporting stat or social proof line beneath headline', priority: 'medium', impact: 'Medium', effort: 'Low' },
      ],
    },
    {
      id: 'cta',
      label: 'CTA Effectiveness',
      score: 71,
      issues: [
        { severity: 'warning', title: 'Primary CTA uses generic "Get Started" copy', fix: 'Replace with outcome-oriented copy like "Start My Free Trial" or "See It In Action".' },
        { severity: 'info', title: 'Only 1 CTA above the fold', fix: 'Add a secondary CTA (e.g. "Watch Demo") for visitors not ready to commit.' },
      ],
      recommendations: [
        { text: 'Increase CTA button size and add contrasting color', priority: 'high', impact: 'High', effort: 'Low' },
        { text: 'Add micro-copy below CTA ("No credit card required")', priority: 'medium', impact: 'Medium', effort: 'Low' },
      ],
    },
    {
      id: 'trust',
      label: 'Trust Signals',
      score: 55,
      issues: [
        { severity: 'critical', title: 'No customer logos or social proof visible above fold', fix: 'Add a logo bar of 4-6 recognizable client logos directly beneath the hero.' },
        { severity: 'warning', title: 'Testimonials lack names and photos', fix: 'Add real customer names, titles, company names, and headshots to testimonials.' },
      ],
      recommendations: [
        { text: 'Add a "Trusted by X+ organizations" counter', priority: 'high', impact: 'High', effort: 'Low' },
        { text: 'Include security badges and compliance certifications', priority: 'medium', impact: 'Medium', effort: 'Low' },
      ],
    },
    {
      id: 'objections',
      label: 'Objection Handling',
      score: 48,
      issues: [
        { severity: 'critical', title: 'No FAQ section addressing common objections', fix: 'Add an FAQ section covering pricing, setup time, data security, and cancellation.' },
        { severity: 'warning', title: 'No money-back guarantee or risk reversal', fix: 'Add a prominently displayed guarantee or free trial to reduce perceived risk.' },
      ],
      recommendations: [
        { text: 'Add comparison section vs alternatives', priority: 'medium', impact: 'Medium', effort: 'Medium' },
        { text: 'Include a "common concerns" accordion near the bottom', priority: 'high', impact: 'High', effort: 'Low' },
      ],
    },
  ],
};

/* ─── Heatmap mock data (10x6 grid) ─────────────────────────── */
const HEATMAP_ROWS = 10;
const HEATMAP_COLS = 6;
const HEATMAP_DATA = [
  [0.9, 0.95, 0.85, 0.88, 0.92, 0.7],
  [0.8, 0.7, 0.6, 0.65, 0.75, 0.5],
  [0.6, 0.55, 0.45, 0.5, 0.6, 0.4],
  [0.5, 0.4, 0.35, 0.42, 0.5, 0.3],
  [0.4, 0.3, 0.25, 0.35, 0.45, 0.25],
  [0.35, 0.25, 0.2, 0.3, 0.35, 0.2],
  [0.3, 0.2, 0.15, 0.25, 0.3, 0.15],
  [0.25, 0.15, 0.1, 0.2, 0.25, 0.12],
  [0.2, 0.12, 0.08, 0.15, 0.2, 0.1],
  [0.15, 0.1, 0.06, 0.12, 0.15, 0.08],
];

function heatColor(val) {
  if (val >= 0.8) return 'rgba(239,68,68,0.85)';
  if (val >= 0.6) return 'rgba(251,191,36,0.75)';
  if (val >= 0.4) return 'rgba(251,191,36,0.45)';
  if (val >= 0.2) return 'rgba(16,185,129,0.35)';
  return 'rgba(16,185,129,0.15)';
}

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

/* ─── SectionCard ───────────────────────────────────────────── */
function SectionCard({ section }) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card, overflow: 'hidden' }}>
      <button onClick={() => setExpanded(e => !e)} style={{
        display: 'flex', alignItems: 'center', gap: S[3], width: '100%',
        padding: `${S[4]} ${S[5]}`, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
      }}>
        <ScoreRing score={section.score} size={48} strokeWidth={4} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary }}>{section.label}</div>
          <div style={{ display: 'flex', gap: S[2], marginTop: '2px' }}>
            <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>
              {section.issues.length} issue{section.issues.length !== 1 ? 's' : ''} found
            </span>
          </div>
        </div>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: expanded ? 'rotate(0)' : 'rotate(-90deg)', transition: T.base }}>
          <path d="M2 4l4 4 4-4" stroke={C.textMuted} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {expanded && (
        <div style={{ padding: `0 ${S[5]} ${S[4]}`, display: 'flex', flexDirection: 'column', gap: S[3] }}>
          {/* Issues */}
          {section.issues.map((issue, i) => {
            const sev = SEVERITY_COLORS[issue.severity] || SEVERITY_COLORS.info;
            return (
              <div key={i} style={{ backgroundColor: sev.bg, border: `1px solid ${sev.color}25`, borderRadius: R.sm, padding: `${S[3]} ${S[4]}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginBottom: S[1] }}>
                  <span style={{ fontFamily: F.mono, fontSize: '9px', fontWeight: 700, color: sev.color, backgroundColor: `${sev.color}20`, borderRadius: R.pill, padding: '1px 6px', textTransform: 'uppercase' }}>{sev.label}</span>
                  <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary }}>{issue.title}</span>
                </div>
                <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, lineHeight: 1.4, paddingLeft: S[1] }}>Fix: {issue.fix}</div>
              </div>
            );
          })}
          {/* Recommendations */}
          {section.recommendations && section.recommendations.length > 0 && (
            <div style={{ marginTop: S[2] }}>
              <div style={{ fontFamily: F.display, fontSize: '12px', fontWeight: 700, color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>Recommendations</div>
              {section.recommendations.map((rec, i) => {
                const pCfg = PRIORITY_COLORS[rec.priority] || PRIORITY_COLORS.medium;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: S[2], padding: `${S[2]} 0`, borderBottom: i < section.recommendations.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                    <span style={makeStyles(badge.base, { backgroundColor: pCfg.bg, color: pCfg.color, border: 'none' })}>{rec.priority}</span>
                    <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textPrimary, flex: 1 }}>{rec.text}</span>
                    <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>Impact: {rec.impact}</span>
                    <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>Effort: {rec.effort}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── HeatmapGrid ───────────────────────────────────────────── */
function HeatmapGrid() {
  return (
    <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card, padding: S[5] }}>
      <div style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary, marginBottom: S[3] }}>
        Attention Heatmap (Mock)
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: S[3] }}>
        {HEATMAP_DATA.map((row, ri) => (
          <div key={ri} style={{ display: 'flex', gap: '2px' }}>
            {row.map((val, ci) => (
              <div key={ci} style={{ flex: 1, height: 28, borderRadius: '3px', backgroundColor: heatColor(val), transition: T.base }} />
            ))}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
        <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>Cold</span>
        <div style={{ display: 'flex', gap: '2px', flex: 1 }}>
          {['rgba(16,185,129,0.15)', 'rgba(16,185,129,0.35)', 'rgba(251,191,36,0.45)', 'rgba(251,191,36,0.75)', 'rgba(239,68,68,0.85)'].map((c, i) => (
            <div key={i} style={{ flex: 1, height: 8, borderRadius: '3px', backgroundColor: c }} />
          ))}
        </div>
        <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>Hot</span>
      </div>
    </div>
  );
}

/* ─── PageCRO ──────────────────────────────────────────────── */
export default function PageCRO() {
  const toast = useToast();
  const optimizer = useAgent('optimizer');
  const [result, setResult] = useState(null);
  const [thinking, setThinking] = useState(false);
  const [agentResult, setAgentResult] = useState(null);
  const [urlInput, setUrlInput] = useState('https://medglobal.org/donate');

  const handleAudit = async () => {
    if (!urlInput.trim()) { toast.error('Please enter a URL'); return; }
    setThinking(true);
    setResult(null);
    setAgentResult(null);
    try {
      await optimizer.activate('page-cro', { skill: 'page-cro', url: urlInput });
      await new Promise(r => setTimeout(r, 2400));
      setResult(MOCK_PAGE_AUDIT);
      setAgentResult({
        agentId: 'optimizer',
        skill: 'page-cro',
        confidence: 92,
        creditsUsed: 75,
        output: {
          metrics: [
            { label: 'Overall Score', value: `${MOCK_PAGE_AUDIT.overall}/100` },
            { label: 'Critical Issues', value: MOCK_PAGE_AUDIT.sections.reduce((s, sec) => s + sec.issues.filter(i => i.severity === 'critical').length, 0).toString() },
            { label: 'Sections Analyzed', value: MOCK_PAGE_AUDIT.sections.length.toString() },
            { label: 'Recommendations', value: MOCK_PAGE_AUDIT.sections.reduce((s, sec) => s + (sec.recommendations?.length || 0), 0).toString() },
          ],
        },
      });
      toast.success('Page CRO audit complete');
    } catch {
      toast.error('Audit failed');
    } finally {
      setThinking(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: C.bg, padding: `${S[6]} ${S[6]} ${S[8]}` }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: S[6] }}>
          <h1 style={{ ...sectionHeading, fontSize: '28px', letterSpacing: '-0.03em', margin: 0, fontFamily: F.display }}>Landing Page CRO</h1>
          <p style={{ ...sectionSubheading, marginTop: S[1] }}>
            Audit any landing page for conversion optimization. Powered by the Optimizer agent to analyze value prop, headlines, CTAs, trust signals, and objection handling.
          </p>
        </div>

        {/* URL input */}
        <div style={{
          display: 'flex', gap: S[3], alignItems: 'center',
          backgroundColor: C.surface, border: `1px solid ${C.border}`,
          borderRadius: R.card, padding: `${S[3]} ${S[4]}`, marginBottom: S[4],
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6.5" stroke={C.textMuted} strokeWidth="1.3"/>
            <path d="M2 8h12M8 2c2 2.5 2.5 4 2.5 6s-.5 3.5-2.5 6M8 2c-2 2.5-2.5 4-2.5 6s.5 3.5 2.5 6" stroke={C.textMuted} strokeWidth="1.2"/>
          </svg>
          <input type="text" value={urlInput} onChange={e => setUrlInput(e.target.value)}
            placeholder="Enter landing page URL..."
            style={{ flex: 1, backgroundColor: 'transparent', border: 'none', fontFamily: F.body, fontSize: '14px', color: C.textPrimary, outline: 'none' }}
          />
          <button style={{ ...btn.primary, fontSize: '13px', padding: `${S[2]} ${S[5]}` }} onClick={handleAudit} disabled={thinking}>
            {thinking ? 'Auditing...' : 'Audit Page'}
          </button>
        </div>

        {/* Agent thinking */}
        {thinking && <div style={{ marginBottom: S[4] }}><AgentThinking agentId="optimizer" task={`Analyzing landing page: ${urlInput}...`} /></div>}

        {/* Agent result summary */}
        {agentResult && !thinking && <div style={{ marginBottom: S[4] }}><AgentResultPanel result={agentResult} /></div>}

        {/* Results */}
        {result && !thinking && (
          <>
            {/* Overall score + heatmap row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[4], marginBottom: S[4] }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: S[5],
                backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card, padding: S[5],
              }}>
                <ScoreRing score={result.overall} size={100} strokeWidth={7} />
                <div>
                  <div style={{ fontFamily: F.display, fontSize: '18px', fontWeight: 700, color: C.textPrimary }}>Overall CRO Score</div>
                  <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, marginTop: S[1] }}>
                    {result.overall >= 80 ? 'Good conversion optimization.' : result.overall >= 60 ? 'Room for improvement in key areas.' : 'Significant conversion barriers detected.'}
                  </div>
                </div>
              </div>
              <HeatmapGrid />
            </div>

            {/* Section cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
              {result.sections.map(section => <SectionCard key={section.id} section={section} />)}
            </div>
          </>
        )}

        {/* Empty state */}
        {!result && !thinking && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: `${S[16]} 0`, gap: S[3] }}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect x="6" y="6" width="36" height="36" rx="4" stroke={C.textMuted} strokeWidth="2"/>
              <path d="M6 16h36M16 16v26" stroke={C.textMuted} strokeWidth="1.5"/>
              <circle cx="30" cy="30" r="6" stroke={C.textMuted} strokeWidth="1.5"/>
              <path d="M34.5 34.5l4 4" stroke={C.textMuted} strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <div style={{ fontFamily: F.body, fontSize: '14px', color: C.textMuted, textAlign: 'center' }}>
              Enter a landing page URL and click "Audit Page" to run a conversion rate optimization analysis
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
