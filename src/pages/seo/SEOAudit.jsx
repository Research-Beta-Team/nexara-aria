/**
 * SEO Audit — Full site SEO audit powered by Analyst agent.
 * Sections: Technical, On-Page, Content, Overall scores with issues and recommendations.
 */
import { useState } from 'react';
import { C, F, R, S, T, btn, badge, shadows, sectionHeading, sectionSubheading } from '../../tokens';
import useToast from '../../hooks/useToast';
import { useAgent } from '../../hooks/useAgent';
import AgentThinking from '../../components/agents/AgentThinking';
import AgentResultPanel from '../../components/agents/AgentResultPanel';

/* ─── Mock audit data ──────────────────────────────────────── */
const MOCK_AUDIT = {
  overall: 72,
  sections: [
    {
      id: 'technical',
      label: 'Technical SEO',
      score: 68,
      issues: [
        { severity: 'critical', title: 'Missing SSL on 3 subdomains', fix: 'Install SSL certificates on staging.medglobal.org, cdn.medglobal.org, and api.medglobal.org' },
        { severity: 'warning', title: 'Page speed: 4.2s LCP on mobile', fix: 'Optimize hero images, defer non-critical JS, enable compression' },
        { severity: 'warning', title: 'Missing XML sitemap for /blog/', fix: 'Generate and submit XML sitemap for blog section to Google Search Console' },
        { severity: 'info', title: 'robots.txt allows all crawlers', fix: 'Consider blocking staging URLs and admin paths' },
      ],
    },
    {
      id: 'onpage',
      label: 'On-Page SEO',
      score: 74,
      issues: [
        { severity: 'critical', title: '12 pages missing meta descriptions', fix: 'Add unique 150-160 character meta descriptions to all landing pages and blog posts' },
        { severity: 'warning', title: 'Duplicate H1 tags on 5 pages', fix: 'Ensure each page has a unique, keyword-rich H1 heading' },
        { severity: 'warning', title: 'Image alt text missing on 28 images', fix: 'Add descriptive alt attributes including target keywords where relevant' },
        { severity: 'info', title: 'Internal linking could be improved', fix: 'Add 2-3 contextual internal links per page to related content' },
      ],
    },
    {
      id: 'content',
      label: 'Content Quality',
      score: 78,
      issues: [
        { severity: 'warning', title: 'Thin content on 4 landing pages (<300 words)', fix: 'Expand content to 800+ words with value propositions, FAQs, and social proof' },
        { severity: 'info', title: 'Blog publishing cadence: 2 posts/month', fix: 'Increase to 4-6 posts/month targeting long-tail keywords for organic growth' },
        { severity: 'info', title: 'Content freshness: 8 articles older than 12 months', fix: 'Update outdated statistics, add current year references, refresh CTAs' },
      ],
    },
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
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontFamily: F.mono, fontSize: size * 0.28, fontWeight: 700, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontFamily: F.mono, fontSize: size * 0.12, color: C.textMuted, textTransform: 'uppercase' }}>/ 100</span>
      </div>
    </div>
  );
}

/* ─── SectionCard ───────────────────────────────────────────── */
function SectionCard({ section }) {
  const [expanded, setExpanded] = useState(true);
  const critCount = section.issues.filter(i => i.severity === 'critical').length;
  const warnCount = section.issues.filter(i => i.severity === 'warning').length;

  return (
    <div style={{
      backgroundColor: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: R.card,
      overflow: 'hidden',
    }}>
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          display: 'flex', alignItems: 'center', gap: S[3], width: '100%',
          padding: `${S[4]} ${S[5]}`, background: 'none', border: 'none',
          cursor: 'pointer', textAlign: 'left',
        }}
      >
        <ScoreRing score={section.score} size={48} strokeWidth={4} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary }}>
            {section.label}
          </div>
          <div style={{ display: 'flex', gap: S[2], marginTop: '2px' }}>
            {critCount > 0 && <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.red }}>{critCount} critical</span>}
            {warnCount > 0 && <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.amber }}>{warnCount} warnings</span>}
          </div>
        </div>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
          style={{ transform: expanded ? 'rotate(0)' : 'rotate(-90deg)', transition: T.base }}>
          <path d="M2 4l4 4 4-4" stroke={C.textMuted} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {expanded && (
        <div style={{ padding: `0 ${S[5]} ${S[4]}`, display: 'flex', flexDirection: 'column', gap: S[2] }}>
          {section.issues.map((issue, i) => {
            const sev = SEVERITY_COLORS[issue.severity] || SEVERITY_COLORS.info;
            return (
              <div key={i} style={{
                backgroundColor: sev.bg,
                border: `1px solid ${sev.color}25`,
                borderRadius: R.sm,
                padding: `${S[3]} ${S[4]}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginBottom: S[1] }}>
                  <span style={{
                    fontFamily: F.mono, fontSize: '9px', fontWeight: 700, color: sev.color,
                    backgroundColor: `${sev.color}20`, borderRadius: R.pill,
                    padding: '1px 6px', textTransform: 'uppercase',
                  }}>
                    {sev.label}
                  </span>
                  <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary }}>
                    {issue.title}
                  </span>
                </div>
                <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, lineHeight: 1.4, paddingLeft: S[1] }}>
                  Fix: {issue.fix}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── SEOAudit ──────────────────────────────────────────────── */
export default function SEOAudit() {
  const toast = useToast();
  const analyst = useAgent('analyst');
  const [auditData, setAuditData] = useState(null);
  const [thinking, setThinking] = useState(false);
  const [agentResult, setAgentResult] = useState(null);
  const [urlInput, setUrlInput] = useState('https://medglobal.org');

  const handleRunAudit = async () => {
    setThinking(true);
    setAuditData(null);
    setAgentResult(null);
    try {
      await analyst.activate('seo-audit', { skill: 'seo-audit', url: urlInput });
      // Simulate delay for thinking animation
      await new Promise(r => setTimeout(r, 2200));
      setAuditData(MOCK_AUDIT);
      setAgentResult({
        agentId: 'analyst',
        skill: 'seo-audit',
        confidence: 96,
        creditsUsed: 60,
        output: {
          metrics: [
            { label: 'Overall Score', value: `${MOCK_AUDIT.overall}/100` },
            { label: 'Critical Issues', value: MOCK_AUDIT.sections.reduce((s, sec) => s + sec.issues.filter(i => i.severity === 'critical').length, 0).toString() },
            { label: 'Warnings', value: MOCK_AUDIT.sections.reduce((s, sec) => s + sec.issues.filter(i => i.severity === 'warning').length, 0).toString() },
            { label: 'Pages Analyzed', value: '47' },
          ],
        },
      });
      toast.success('SEO audit complete');
    } catch {
      toast.error('Audit failed');
    } finally {
      setThinking(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: C.bg, padding: `${S[6]} ${S[6]} ${S[8]}` }}>
      {/* Header */}
      <div style={{ marginBottom: S[6], maxWidth: '900px' }}>
        <h1 style={{ ...sectionHeading, fontSize: '24px', letterSpacing: '-0.03em', margin: 0 }}>
          SEO Audit
        </h1>
        <p style={{ ...sectionSubheading, marginTop: S[1] }}>
          Comprehensive site audit powered by the Analyst agent. Identifies technical, on-page, and content issues with actionable fix recommendations.
        </p>
      </div>

      {/* URL input + run button */}
      <div style={{
        display: 'flex', gap: S[3], alignItems: 'center',
        backgroundColor: C.surface, border: `1px solid ${C.border}`,
        borderRadius: R.card, padding: `${S[3]} ${S[4]}`,
        marginBottom: S[4], maxWidth: '900px',
      }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6.5" stroke={C.textMuted} strokeWidth="1.3"/>
          <path d="M2 8h12M8 2c2 2.5 2.5 4 2.5 6s-.5 3.5-2.5 6M8 2c-2 2.5-2.5 4-2.5 6s.5 3.5 2.5 6" stroke={C.textMuted} strokeWidth="1.2"/>
        </svg>
        <input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Enter URL to audit..."
          style={{
            flex: 1, backgroundColor: 'transparent', border: 'none',
            fontFamily: F.body, fontSize: '14px', color: C.textPrimary, outline: 'none',
          }}
        />
        <button
          style={{ ...btn.primary, fontSize: '13px', padding: `${S[2]} ${S[5]}` }}
          onClick={handleRunAudit}
          disabled={thinking}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M9.5 9.5l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          {thinking ? 'Auditing...' : 'Run Full Audit'}
        </button>
      </div>

      {/* Agent thinking */}
      {thinking && (
        <div style={{ marginBottom: S[4], maxWidth: '900px' }}>
          <AgentThinking agentId="analyst" task={`Running SEO audit on ${urlInput}...`} />
        </div>
      )}

      {/* Agent result summary */}
      {agentResult && !thinking && (
        <div style={{ marginBottom: S[4], maxWidth: '900px' }}>
          <AgentResultPanel result={agentResult} />
        </div>
      )}

      {/* Audit results */}
      {auditData && !thinking && (
        <div style={{ maxWidth: '900px' }}>
          {/* Overall score */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: S[5],
            backgroundColor: C.surface, border: `1px solid ${C.border}`,
            borderRadius: R.card, padding: S[5], marginBottom: S[4],
          }}>
            <ScoreRing score={auditData.overall} size={100} strokeWidth={7} />
            <div>
              <div style={{ fontFamily: F.display, fontSize: '18px', fontWeight: 700, color: C.textPrimary }}>
                Overall SEO Score
              </div>
              <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, marginTop: S[1] }}>
                {auditData.overall >= 80
                  ? 'Good overall health with minor improvements needed.'
                  : auditData.overall >= 60
                    ? 'Moderate health — address critical and warning issues to improve rankings.'
                    : 'Needs attention — multiple critical issues impacting search visibility.'}
              </div>
            </div>
          </div>

          {/* Section cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
            {auditData.sections.map((section) => (
              <SectionCard key={section.id} section={section} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!auditData && !thinking && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: `${S[16]} 0`, gap: S[3], maxWidth: '900px',
        }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="20" cy="20" r="14" stroke={C.textMuted} strokeWidth="2"/>
            <path d="M30 30l12 12" stroke={C.textMuted} strokeWidth="2" strokeLinecap="round"/>
            <path d="M14 20h12M20 14v12" stroke={C.textMuted} strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <div style={{ fontFamily: F.body, fontSize: '14px', color: C.textMuted, textAlign: 'center' }}>
            Enter a URL and click "Run Full Audit" to start the SEO analysis
          </div>
        </div>
      )}
    </div>
  );
}
