/**
 * Site Architecture Analysis — Analyst agent powered page hierarchy and linking analysis.
 */
import { useState } from 'react';
import { C, F, R, S, T, btn, badge, shadows, sectionHeading, sectionSubheading } from '../../tokens';
import useToast from '../../hooks/useToast';
import { useAgent } from '../../hooks/useAgent';
import AgentThinking from '../../components/agents/AgentThinking';
import AgentResultPanel from '../../components/agents/AgentResultPanel';

/* ─── Mock site tree ───────────────────────────────────────── */
const MOCK_TREE = [
  {
    url: '/', label: 'Homepage', depth: 0, links: 24, issues: [],
    children: [
      {
        url: '/about', label: 'About', depth: 1, links: 8, issues: [],
        children: [
          { url: '/about/team', label: 'Team', depth: 2, links: 3, issues: ['Orphaned page — only 1 inbound link'], children: [] },
          { url: '/about/mission', label: 'Mission', depth: 2, links: 5, issues: [], children: [] },
        ],
      },
      {
        url: '/programs', label: 'Programs', depth: 1, links: 15, issues: [],
        children: [
          { url: '/programs/vietnam', label: 'Vietnam', depth: 2, links: 7, issues: [], children: [] },
          { url: '/programs/syria', label: 'Syria', depth: 2, links: 6, issues: [], children: [] },
          { url: '/programs/africa', label: 'Africa', depth: 2, links: 4, issues: ['Thin content — 180 words'], children: [] },
        ],
      },
      {
        url: '/donate', label: 'Donate', depth: 1, links: 12, issues: [],
        children: [
          { url: '/donate/corporate', label: 'Corporate Giving', depth: 2, links: 4, issues: [], children: [] },
          { url: '/donate/individual', label: 'Individual', depth: 2, links: 5, issues: [], children: [] },
        ],
      },
      {
        url: '/blog', label: 'Blog', depth: 1, links: 18, issues: [],
        children: [
          { url: '/blog/category/impact', label: 'Impact Stories', depth: 2, links: 8, issues: [], children: [] },
          { url: '/blog/category/news', label: 'News', depth: 2, links: 6, issues: [], children: [] },
        ],
      },
      {
        url: '/contact', label: 'Contact', depth: 1, links: 3, issues: ['Low internal link count'], children: [],
      },
    ],
  },
];

const MOCK_URL_ANALYSIS = [
  { pattern: '/programs/{region}', count: 8, status: 'good', note: 'Clean, keyword-rich URL structure' },
  { pattern: '/blog/{category}/{slug}', count: 24, status: 'good', note: 'Proper hierarchy with categories' },
  { pattern: '/donate/{type}', count: 3, status: 'good', note: 'Short, clear donation paths' },
  { pattern: '/page?id={num}', count: 2, status: 'warning', note: 'Dynamic URLs — consider rewriting to static paths' },
];

const MOCK_LINKING = [
  { metric: 'Total Internal Links', value: '312', status: 'good' },
  { metric: 'Avg Links per Page', value: '6.8', status: 'good' },
  { metric: 'Orphaned Pages', value: '3', status: 'warning' },
  { metric: 'Broken Internal Links', value: '1', status: 'critical' },
  { metric: 'Max Click Depth', value: '4', status: 'good' },
  { metric: 'Pages > 3 Clicks Deep', value: '7', status: 'warning' },
];

const STATUS_COLORS = {
  good: { bg: C.greenDim, color: C.green },
  warning: { bg: C.amberDim, color: C.amber },
  critical: { bg: C.redDim, color: C.red },
};

/* ─── TreeItem ──────────────────────────────────────────────── */
function TreeItem({ node, depth = 0 }) {
  const [open, setOpen] = useState(depth < 2);
  const hasChildren = node.children && node.children.length > 0;
  const hasIssues = node.issues && node.issues.length > 0;

  return (
    <div style={{ paddingLeft: depth > 0 ? S[4] : 0 }}>
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: S[2],
          padding: `${S[2]} ${S[3]}`,
          borderRadius: R.sm,
          backgroundColor: hasIssues ? C.amberDim : 'transparent',
          borderLeft: depth > 0 ? `2px solid ${hasIssues ? C.amber : C.border}` : 'none',
          marginBottom: '2px',
        }}
      >
        {hasChildren ? (
          <button
            onClick={() => setOpen(o => !o)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
              style={{ transform: open ? 'rotate(0)' : 'rotate(-90deg)', transition: T.base }}>
              <path d="M2 3.5l3 3 3-3" stroke={C.textMuted} strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </button>
        ) : (
          <span style={{ width: '10px' }} />
        )}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <rect x="1" y="1" width="10" height="10" rx="2" stroke={hasIssues ? C.amber : C.primary} strokeWidth="1.2"/>
          <path d="M3 4h6M3 6h4" stroke={hasIssues ? C.amber : C.primary} strokeWidth="0.8" strokeLinecap="round"/>
        </svg>
        <span style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textPrimary, flex: 1 }}>
          {node.label}
        </span>
        <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>{node.url}</span>
        <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textSecondary }}>{node.links} links</span>
      </div>
      {hasIssues && (
        <div style={{ paddingLeft: depth > 0 ? S[6] : S[4], marginBottom: S[1] }}>
          {node.issues.map((issue, i) => (
            <div key={i} style={{ fontFamily: F.body, fontSize: '11px', color: C.amber, display: 'flex', alignItems: 'center', gap: S[1] }}>
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><circle cx="4" cy="4" r="3" fill={C.amber}/></svg>
              {issue}
            </div>
          ))}
        </div>
      )}
      {open && hasChildren && node.children.map((child, i) => (
        <TreeItem key={i} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

/* ─── SiteArchitecture ──────────────────────────────────────── */
export default function SiteArchitecture() {
  const toast = useToast();
  const analyst = useAgent('analyst');
  const [analyzed, setAnalyzed] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [agentResult, setAgentResult] = useState(null);
  const [urlInput, setUrlInput] = useState('https://medglobal.org');

  const handleAnalyze = async () => {
    setThinking(true);
    setAnalyzed(false);
    setAgentResult(null);
    try {
      await analyst.activate('site-architecture', { skill: 'site-architecture', url: urlInput });
      await new Promise(r => setTimeout(r, 2000));
      setAnalyzed(true);
      setAgentResult({
        agentId: 'analyst',
        skill: 'site-architecture',
        confidence: 93,
        creditsUsed: 45,
        output: {
          recommendations: [
            { text: 'Fix 3 orphaned pages by adding contextual internal links from related content', priority: 'high' },
            { text: 'Rewrite 2 dynamic URLs to static, keyword-rich paths', priority: 'medium' },
            { text: 'Add breadcrumb navigation to all pages beyond depth 1', priority: 'medium' },
            { text: 'Create a hub page for /programs/ to improve topical authority', priority: 'high' },
            { text: 'Reduce click depth for 7 pages currently at 4+ clicks from homepage', priority: 'low' },
          ],
        },
      });
      toast.success('Architecture analysis complete');
    } catch {
      toast.error('Analysis failed');
    } finally {
      setThinking(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: C.bg, padding: `${S[6]} ${S[6]} ${S[8]}` }}>
      {/* Header */}
      <div style={{ marginBottom: S[6], maxWidth: '960px' }}>
        <h1 style={{ ...sectionHeading, fontSize: '24px', letterSpacing: '-0.03em', margin: 0 }}>
          Site Architecture Analysis
        </h1>
        <p style={{ ...sectionSubheading, marginTop: S[1] }}>
          Visualize page hierarchy, analyze URL structure, and identify internal linking opportunities powered by the Analyst agent.
        </p>
      </div>

      {/* URL input + analyze button */}
      <div style={{
        display: 'flex', gap: S[3], alignItems: 'center',
        backgroundColor: C.surface, border: `1px solid ${C.border}`,
        borderRadius: R.card, padding: `${S[3]} ${S[4]}`,
        marginBottom: S[4], maxWidth: '960px',
      }}>
        <input
          type="text" value={urlInput} onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Enter site URL..."
          style={{ flex: 1, backgroundColor: 'transparent', border: 'none', fontFamily: F.body, fontSize: '14px', color: C.textPrimary, outline: 'none' }}
        />
        <button style={{ ...btn.primary, fontSize: '13px' }} onClick={handleAnalyze} disabled={thinking}>
          {thinking ? 'Analyzing...' : 'Analyze Architecture'}
        </button>
      </div>

      {thinking && (
        <div style={{ marginBottom: S[4], maxWidth: '960px' }}>
          <AgentThinking agentId="analyst" task={`Crawling and analyzing site architecture for ${urlInput}...`} />
        </div>
      )}

      {agentResult && !thinking && (
        <div style={{ marginBottom: S[4], maxWidth: '960px' }}>
          <AgentResultPanel result={agentResult} />
        </div>
      )}

      {analyzed && !thinking && (
        <div style={{ maxWidth: '960px', display: 'flex', flexDirection: 'column', gap: S[4] }}>
          {/* Page hierarchy tree */}
          <div style={{
            backgroundColor: C.surface, border: `1px solid ${C.border}`,
            borderRadius: R.card, padding: S[5],
          }}>
            <h2 style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary, margin: `0 0 ${S[3]} 0` }}>
              Page Hierarchy
            </h2>
            {MOCK_TREE.map((node, i) => <TreeItem key={i} node={node} />)}
          </div>

          {/* URL structure analysis */}
          <div style={{
            backgroundColor: C.surface, border: `1px solid ${C.border}`,
            borderRadius: R.card, padding: S[5],
          }}>
            <h2 style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary, margin: `0 0 ${S[3]} 0` }}>
              URL Structure Analysis
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
              {MOCK_URL_ANALYSIS.map((item, i) => {
                const sc = STATUS_COLORS[item.status] || STATUS_COLORS.good;
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: S[3],
                    padding: `${S[2]} ${S[3]}`, borderRadius: R.sm,
                    backgroundColor: sc.bg, border: `1px solid ${sc.color}20`,
                  }}>
                    <span style={{ fontFamily: F.mono, fontSize: '12px', fontWeight: 600, color: C.textPrimary, minWidth: '200px' }}>{item.pattern}</span>
                    <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>{item.count} pages</span>
                    <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, flex: 1 }}>{item.note}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Internal linking report */}
          <div style={{
            backgroundColor: C.surface, border: `1px solid ${C.border}`,
            borderRadius: R.card, padding: S[5],
          }}>
            <h2 style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary, margin: `0 0 ${S[3]} 0` }}>
              Internal Linking Report
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: S[3] }}>
              {MOCK_LINKING.map((item, i) => {
                const sc = STATUS_COLORS[item.status] || STATUS_COLORS.good;
                return (
                  <div key={i} style={{
                    backgroundColor: C.surface2, border: `1px solid ${C.border}`,
                    borderRadius: R.sm, padding: S[3],
                    borderLeft: `3px solid ${sc.color}`,
                  }}>
                    <div style={{ fontFamily: F.mono, fontSize: '20px', fontWeight: 700, color: sc.color, lineHeight: 1 }}>{item.value}</div>
                    <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary, marginTop: '4px' }}>{item.metric}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {!analyzed && !thinking && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: `${S[16]} 0`, gap: S[3], maxWidth: '960px',
        }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect x="6" y="6" width="36" height="36" rx="4" stroke={C.textMuted} strokeWidth="2"/>
            <path d="M12 18h24M12 24h18M12 30h12M18 12v24" stroke={C.textMuted} strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <div style={{ fontFamily: F.body, fontSize: '14px', color: C.textMuted, textAlign: 'center' }}>
            Enter a URL to analyze site architecture and internal linking
          </div>
        </div>
      )}
    </div>
  );
}
