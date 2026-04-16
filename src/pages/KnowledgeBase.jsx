import { useState } from 'react';
import { C, F, R, S, T, btn, badge, shadows, scrollbarStyle } from '../tokens';
import useToast from '../hooks/useToast';
import FreyaLogo from '../components/ui/FreyaLogo';
import {
  IconChart,
  IconCheck,
  IconDocument,
  IconLabel,
  IconMegaphone,
  IconMessage,
  IconRefresh,
  IconUsers,
} from '../components/ui/Icons';

/* ─── Mock data ──────────────────────────────────────────── */
const NAMESPACE_HEALTH = [
  {
    id: 'brand', label: 'Brand', score: 94,
    description: 'Company info, voice, ICP, messaging',
    facts: 12, lastUpdated: '2h ago', canSync: false,
  },
  {
    id: 'audience', label: 'Audience', score: 87,
    description: 'Donor personas, segments, intent signals',
    facts: 34, lastUpdated: '4h ago', canSync: false,
  },
  {
    id: 'campaigns', label: 'Campaigns', score: 91,
    description: 'Active campaigns, strategy, content',
    facts: 89, lastUpdated: '1h ago', canSync: false,
  },
  {
    id: 'performance', label: 'Performance', score: 78,
    description: 'Analytics, benchmarks, attribution',
    facts: 56, lastUpdated: '6h ago', canSync: true,
  },
];

const DOCUMENTS = [
  { id: 'doc1', title: 'Medglobal Brand Guidelines v2.1', category: 'Brand', type: 'PDF', pages: 24, indexed: true, facts: 47, date: 'Jan 5' },
  { id: 'doc2', title: 'Q2 Campaign Brief — Donor Acquisition', category: 'Campaigns', type: 'DOC', pages: 8, indexed: true, facts: 31, date: 'Feb 10' },
  { id: 'doc3', title: 'MENA Donor Research Report 2025', category: 'Research', type: 'PDF', pages: 56, indexed: true, facts: 89, date: 'Feb 8' },
  { id: 'doc4', title: 'Healthcare Sector NGO Landscape', category: 'Research', type: 'PDF', pages: 34, indexed: true, facts: 67, date: 'Jan 20' },
  { id: 'doc5', title: 'Legal: GDPR Donor Data Policy', category: 'Legal', type: 'PDF', pages: 12, indexed: true, facts: 28, date: 'Jan 15' },
];

const CATEGORY_COLORS = {
  Brand: C.secondary,
  Campaigns: C.primary,
  Research: '#8B5CF6',
  Legal: C.amber,
  All: C.textMuted,
};

function NamespaceGlyph({ id }) {
  const c = C.primary;
  const w = 14;
  if (id === 'brand') return <IconLabel color={c} w={w} />;
  if (id === 'audience') return <IconUsers color={c} width={w} height={w} />;
  if (id === 'campaigns') return <IconMegaphone color={c} w={w} />;
  if (id === 'performance') return <IconChart color={c} width={w} height={w} />;
  return <IconDocument color={c} width={w} height={w} />;
}

const MEMORY_FACTS = {
  Brand: ['Medical NGO', 'Founded 2017', 'Emergency healthcare', '95% ops ratio', 'MENA focus', 'UN partner', '+7 more'],
  Audience: ['Donors age 45–60', 'Income $180k+', 'Healthcare professionals', 'Board members', 'Corporate sponsors', '+12 more'],
  'Top Signals': ['Yemen Emergency', 'MENA Healthcare', 'Donor re-engagement', 'Q2 Campaign', 'APAC expansion', '+8 more'],
};

/* ─── Health Score Ring ──────────────────────────────────── */
function HealthRing({ score, size = 44 }) {
  const r = (size - 8) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 85 ? C.primary : score >= 70 ? C.amber : '#EF4444';
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.surface3} strokeWidth={4} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={4}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: T.slow }}
      />
      <text x={size / 2} y={size / 2 + 4} textAnchor="middle" fill={color} fontSize="10" fontWeight="700" fontFamily="JetBrains Mono, monospace">
        {score}
      </text>
    </svg>
  );
}

/* ─── Namespace Health Cards ─────────────────────────────── */
function NamespaceHealthDashboard() {
  const toast = useToast();
  const overallScore = Math.round(NAMESPACE_HEALTH.reduce((s, n) => s + n.score, 0) / NAMESPACE_HEALTH.length);
  const overallColor = overallScore >= 85 ? C.primary : overallScore >= 70 ? C.amber : '#EF4444';

  return (
    <div style={{
      backgroundColor: C.surface, border: `1px solid ${C.border}`,
      borderRadius: R.card, padding: S[5],
    }}>
      {/* Overall health bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[4] }}>
        <div>
          <div style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary }}>
            Memory Health
          </div>
          <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>
            Freya's knowledge quality across all namespaces
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
          <div style={{ width: '160px', height: '8px', borderRadius: '4px', backgroundColor: C.surface3, overflow: 'hidden' }}>
            <div style={{ width: `${overallScore}%`, height: '100%', backgroundColor: overallColor, borderRadius: '4px', transition: T.slow }} />
          </div>
          <span style={{ fontFamily: F.mono, fontSize: '18px', fontWeight: 800, color: overallColor }}>
            {overallScore}%
          </span>
        </div>
      </div>

      {/* 4 namespace cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: S[3] }}>
        {NAMESPACE_HEALTH.map((ns) => {
          const color = ns.score >= 85 ? C.primary : ns.score >= 70 ? C.amber : '#EF4444';
          return (
            <div key={ns.id} style={{
              backgroundColor: C.surface2, border: `1px solid ${C.border}`,
              borderRadius: R.md, padding: S[4],
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginBottom: S[3] }}>
                <HealthRing score={ns.score} size={44} />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: S[1] }}>
                    <span style={{ lineHeight: 0, display: 'inline-flex' }}><NamespaceGlyph id={ns.id} /></span>
                    <span style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>
                      {ns.label}
                    </span>
                  </div>
                  <div style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color }}>
                    {ns.score}% health
                  </div>
                </div>
              </div>
              <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary, marginBottom: S[2], lineHeight: 1.4 }}>
                {ns.description}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[3] }}>
                <span style={{ fontFamily: F.mono, fontSize: '12px', fontWeight: 700, color: C.textPrimary }}>
                  {ns.facts} facts
                </span>
                <span style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted }}>
                  Updated {ns.lastUpdated}
                </span>
              </div>
              <button
                onClick={() => ns.canSync
                  ? toast.info(`Syncing ${ns.label} namespace with latest analytics...`)
                  : toast.info(`Viewing ${ns.label} namespace details...`)}
                style={{
                  width: '100%', padding: `${S[1]} ${S[2]}`,
                  fontSize: '11px', fontFamily: F.body, fontWeight: 600,
                  backgroundColor: ns.canSync ? C.amberDim : `${C.primary}15`,
                  color: ns.canSync ? C.amber : C.primary,
                  border: `1px solid ${ns.canSync ? C.amber : C.primary}44`,
                  borderRadius: R.sm, cursor: 'pointer', transition: T.color,
                }}
              >
                {ns.canSync ? 'View + Sync' : 'View'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Document Library ───────────────────────────────────── */
function DocumentLibrary() {
  const toast = useToast();
  const [activeFilter, setActiveFilter] = useState('All');
  const [isDragOver, setIsDragOver] = useState(false);
  const FILTERS = ['All', 'Brand', 'Campaigns', 'Research', 'Legal'];

  const filtered = activeFilter === 'All' ? DOCUMENTS : DOCUMENTS.filter((d) => d.category === activeFilter);

  return (
    <div style={{
      width: '56%', flexShrink: 0,
      backgroundColor: C.surface, border: `1px solid ${C.border}`,
      borderRadius: R.card, display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: `${S[3]} ${S[4]}`, borderBottom: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>
          Document Library
        </div>
        <div style={{ display: 'flex', gap: S[1] }}>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                padding: `${S[1]} ${S[2]}`, fontSize: '11px', fontFamily: F.body, fontWeight: 500,
                borderRadius: R.sm, border: `1px solid ${activeFilter === f ? (CATEGORY_COLORS[f] ?? C.primary) : 'transparent'}`,
                backgroundColor: activeFilter === f ? `${(CATEGORY_COLORS[f] ?? C.primary)}18` : 'transparent',
                color: activeFilter === f ? (CATEGORY_COLORS[f] ?? C.primary) : C.textMuted,
                cursor: 'pointer', transition: T.color,
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: S[4], display: 'flex', flexDirection: 'column', gap: S[3], ...scrollbarStyle }}>
        {/* Upload area */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragOver(false); toast.success('File uploading and indexing...'); }}
          onClick={() => toast.info('Opening file picker...')}
          style={{
            border: `2px dashed ${isDragOver ? C.primary : C.border}`,
            borderRadius: R.md, padding: S[5],
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: S[2],
            cursor: 'pointer', transition: T.color,
            backgroundColor: isDragOver ? `${C.primary}08` : 'transparent',
          }}
        >
          <IconDocument color={C.textSecondary} width={28} height={28} />
          <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textSecondary }}>
            Drop files here or click to upload
          </div>
          <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>
            PDF, DOC, TXT — Freya indexes and extracts facts automatically
          </div>
        </div>

        {/* Document cards */}
        {filtered.map((doc) => {
          const catColor = CATEGORY_COLORS[doc.category] ?? C.textSecondary;
          return (
            <div key={doc.id} style={{
              backgroundColor: C.surface2, border: `1px solid ${C.border}`,
              borderRadius: R.md, padding: S[3],
              display: 'flex', alignItems: 'flex-start', gap: S[3],
            }}>
              {/* File icon */}
              <div style={{
                width: 36, height: 36, borderRadius: R.sm, flexShrink: 0,
                backgroundColor: `${catColor}18`, border: `1px solid ${catColor}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: catColor,
              }}>
                {doc.type}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary, marginBottom: 2 }}>
                  {doc.title}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: S[2], flexWrap: 'wrap', marginBottom: S[2] }}>
                  <span style={{
                    fontFamily: F.mono, fontSize: '10px', fontWeight: 700,
                    color: catColor, backgroundColor: `${catColor}18`,
                    border: `1px solid ${catColor}44`, borderRadius: R.pill,
                    padding: `1px 7px`,
                  }}>
                    {doc.category}
                  </span>
                  <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>{doc.pages} pages</span>
                  {doc.indexed && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: F.body, fontSize: '11px', color: C.primary }}>
                      <IconCheck color={C.primary} width={12} height={12} />
                      Indexed · {doc.facts} facts extracted
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: S[2] }}>
                  <button
                    onClick={() => toast.info(`Opening chat with "${doc.title}"...`)}
                    style={{ ...btn.ghost, fontSize: '11px', padding: `2px ${S[2]}`, color: C.primary, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    <IconMessage color={C.primary} w={12} />
                    Chat with doc
                  </button>
                  <button
                    onClick={() => toast.info(`Re-indexing "${doc.title}"...`)}
                    style={{ ...btn.ghost, fontSize: '11px', padding: `2px ${S[2]}`, color: C.textMuted, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    <IconRefresh color={C.textMuted} w={12} />
                    Re-index
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Add document */}
        <div
          onClick={() => toast.info('Opening document upload...')}
          style={{
            border: `2px dashed ${C.border}`, borderRadius: R.md,
            padding: S[4], display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: S[2], cursor: 'pointer', transition: T.color, color: C.textMuted,
            fontFamily: F.body, fontSize: '13px', fontWeight: 500,
          }}
        >
          <span style={{ fontSize: '18px' }}>+</span>
          Add Document
        </div>
      </div>
    </div>
  );
}

/* ─── Memory Insights Panel ──────────────────────────────── */
function MemoryInsightsPanel() {
  const toast = useToast();
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleQuery = () => {
    if (!query.trim()) { toast.warning('Enter a question first.'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setResponse({
        question: query,
        answer: `Based on 34 indexed facts in the Audience namespace:\n\n• MENA donors are primarily aged 45–60, with household income above $180k\n• Healthcare professionals (33%) and corporate executives (28%) are the top segments\n• Key motivators: emergency impact (67%), transparency (58%), geographic focus on MENA/Africa\n• Average gift: $2,400/year; major donor threshold: $10k+\n• Re-engagement window: 6–8 months after last donation\n• High-intent signals: Yemen crisis coverage, board member referrals`,
      });
    }, 1400);
  };

  return (
    <div style={{
      flex: 1, minWidth: 0,
      backgroundColor: C.surface, border: `1px solid ${C.border}`,
      borderRadius: R.card, display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: `${S[3]} ${S[4]}`, borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary, marginBottom: 2 }}>
          What Freya knows about Medglobal
        </div>
        <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>
          191 total indexed facts · Memory health 88%
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: S[4], display: 'flex', flexDirection: 'column', gap: S[4], ...scrollbarStyle }}>
        {/* Fact categories */}
        {Object.entries(MEMORY_FACTS).map(([category, facts]) => (
          <div key={category}>
            <div style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>
              {category}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[1] }}>
              {facts.map((fact, i) => {
                const isMore = fact.startsWith('+');
                return (
                  <span
                    key={i}
                    onClick={() => !isMore && toast.info(`Fact: "${fact}"`)}
                    style={{
                      fontFamily: F.body, fontSize: '12px', fontWeight: 500,
                      color: isMore ? C.textMuted : C.textSecondary,
                      backgroundColor: isMore ? 'transparent' : C.surface2,
                      border: `1px solid ${isMore ? 'transparent' : C.border}`,
                      borderRadius: R.pill, padding: `3px ${S[2]}`,
                      cursor: isMore ? 'default' : 'pointer',
                      transition: T.color,
                    }}
                  >
                    {fact}
                  </span>
                );
              })}
            </div>
          </div>
        ))}

        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: S[4] }}>
          <div style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary, marginBottom: S[3] }}>
            Ask the knowledge base
          </div>

          {/* Query input */}
          <div style={{ display: 'flex', gap: S[2], marginBottom: S[3] }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
              placeholder="What do we know about MENA donors?"
              style={{
                flex: 1, backgroundColor: C.surface2, color: C.textPrimary,
                border: `1px solid ${C.border}`, borderRadius: R.input,
                padding: `${S[2]} ${S[3]}`, fontFamily: F.body, fontSize: '13px',
                outline: 'none',
              }}
            />
            <button
              onClick={handleQuery}
              disabled={loading}
              style={{
                ...btn.primary, padding: `${S[2]} ${S[3]}`, fontSize: '12px',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? '...' : 'Ask'}
            </button>
          </div>

          {/* Response */}
          {response && (
            <div style={{
              backgroundColor: `${C.primary}0D`, border: `1px solid ${C.primary}33`,
              borderRadius: R.md, padding: S[4],
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginBottom: S[2] }}>
                <FreyaLogo size={16} color={C.primary} />
                <span style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.primary }}>
                  Freya's answer to: "{response.question}"
                </span>
              </div>
              <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, lineHeight: 1.65, whiteSpace: 'pre-line' }}>
                {response.answer}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */
export default function KnowledgeBase() {
  const toast = useToast();

  return (
    <div style={{
      backgroundColor: C.bg, minHeight: '100vh',
      padding: S[6], display: 'flex', flexDirection: 'column', gap: S[4],
      ...scrollbarStyle,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: S[4] }}>
        <div>
          <h1 style={{ fontFamily: F.display, fontSize: '24px', fontWeight: 800, color: C.textPrimary, margin: 0, letterSpacing: '-0.02em' }}>
            Knowledge Base
          </h1>
          <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, marginTop: 4 }}>
            Memory Health: <span style={{ color: C.primary, fontWeight: 700 }}>88%</span>
            &nbsp;· 191 indexed facts · 5 documents
          </div>
        </div>
        <button
          onClick={() => toast.info('Opening document index panel...')}
          style={{ ...btn.primary, fontSize: '13px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8 }}
        >
          <IconDocument color={C.textInverse} width={16} height={16} />
          Index Documents
        </button>
      </div>

      {/* Memory Health Dashboard */}
      <NamespaceHealthDashboard />

      {/* Two-column: Docs + Insights */}
      <div style={{ display: 'flex', gap: S[4], flex: 1, minHeight: '500px' }}>
        <DocumentLibrary />
        <MemoryInsightsPanel />
      </div>
    </div>
  );
}
