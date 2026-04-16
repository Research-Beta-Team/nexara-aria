/**
 * Programmatic SEO — At-scale page generation powered by Analyst + Copywriter agents.
 * Template builder, page generation, traffic estimation.
 */
import { useState } from 'react';
import { C, F, R, S, T, btn, badge, shadows, sectionHeading, sectionSubheading } from '../../tokens';
import useToast from '../../hooks/useToast';
import { useAgent } from '../../hooks/useAgent';
import AgentThinking from '../../components/agents/AgentThinking';
import AgentResultPanel from '../../components/agents/AgentResultPanel';

/* ─── Mock data ────────────────────────────────────────────── */
const PAGE_TYPES = [
  { id: 'location', label: 'Location Pages', desc: 'City/region landing pages', icon: 'pin' },
  { id: 'comparison', label: 'Comparison Pages', desc: 'Product vs competitor pages', icon: 'compare' },
  { id: 'glossary', label: 'Glossary Pages', desc: 'Term definition pages', icon: 'book' },
  { id: 'use-case', label: 'Use Case Pages', desc: 'Solution by use case', icon: 'target' },
  { id: 'industry', label: 'Industry Pages', desc: 'Vertical-specific landing pages', icon: 'building' },
];

const MOCK_VARIABLES = {
  location: ['city', 'country', 'region', 'population', 'local_org_count'],
  comparison: ['competitor_name', 'feature_1', 'feature_2', 'price_diff', 'rating'],
  glossary: ['term', 'definition', 'related_terms', 'category'],
  'use-case': ['use_case_name', 'pain_point', 'solution', 'benefit_1', 'benefit_2'],
  industry: ['industry_name', 'market_size', 'key_challenges', 'case_study'],
};

const MOCK_PREVIEWS = [
  {
    title: 'Medglobal Healthcare Programs in Ho Chi Minh City',
    url: '/programs/ho-chi-minh-city',
    snippet: 'Medglobal delivers emergency healthcare and health programs to communities in Ho Chi Minh City. Learn about our local impact and how to get involved.',
    estTraffic: '340/mo',
  },
  {
    title: 'Medglobal Healthcare Programs in Hanoi',
    url: '/programs/hanoi',
    snippet: 'Medglobal partners with local health facilities in Hanoi to provide essential medical services to underserved populations.',
    estTraffic: '280/mo',
  },
  {
    title: 'Medglobal Healthcare Programs in Da Nang',
    url: '/programs/da-nang',
    snippet: 'Our Da Nang program focuses on maternal health and emergency care, serving over 15,000 patients annually.',
    estTraffic: '120/mo',
  },
];

/* ─── PageTypeCard ──────────────────────────────────────────── */
function PageTypeCard({ type, selected, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        backgroundColor: selected ? C.primaryGlow : hov ? C.surface2 : C.surface,
        border: `1px solid ${selected ? C.primary : hov ? C.borderHover : C.border}`,
        borderRadius: R.card, padding: S[4],
        cursor: 'pointer', textAlign: 'left',
        transition: T.base, display: 'flex', flexDirection: 'column', gap: S[1],
      }}
    >
      <span style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: selected ? C.primary : C.textPrimary }}>
        {type.label}
      </span>
      <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary }}>{type.desc}</span>
    </button>
  );
}

/* ─── PreviewCard ───────────────────────────────────────────── */
function PreviewCard({ page }) {
  return (
    <div style={{
      backgroundColor: C.surface, border: `1px solid ${C.border}`,
      borderRadius: R.card, padding: S[4],
    }}>
      <div style={{ fontFamily: F.body, fontSize: '14px', fontWeight: 700, color: '#1A0DAB', marginBottom: '2px' }}>
        {page.title}
      </div>
      <div style={{ fontFamily: F.body, fontSize: '12px', color: C.green, marginBottom: S[1] }}>
        medglobal.org{page.url}
      </div>
      <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, lineHeight: 1.4 }}>
        {page.snippet}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginTop: S[2] }}>
        <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.primary, backgroundColor: C.primaryGlow, borderRadius: R.pill, padding: '2px 8px' }}>
          Est. {page.estTraffic}
        </span>
      </div>
    </div>
  );
}

/* ─── ProgrammaticSEO ───────────────────────────────────────── */
export default function ProgrammaticSEO() {
  const toast = useToast();
  const analyst = useAgent('analyst');
  const copywriter = useAgent('copywriter');
  const [selectedType, setSelectedType] = useState(null);
  const [contentPattern, setContentPattern] = useState('');
  const [thinking, setThinking] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [agentResult, setAgentResult] = useState(null);

  const variables = selectedType ? (MOCK_VARIABLES[selectedType] || []) : [];

  const handleGenerate = async () => {
    if (!selectedType) { toast.info('Select a page type first'); return; }
    setThinking(true);
    setGenerated(false);
    setAgentResult(null);
    try {
      await analyst.activate('programmatic-seo', { skill: 'programmatic-seo', pageType: selectedType });
      await new Promise(r => setTimeout(r, 2200));
      setGenerated(true);
      setAgentResult({
        agentId: 'analyst',
        skill: 'programmatic-seo',
        confidence: 89,
        creditsUsed: 80,
        output: {
          metrics: [
            { label: 'Pages Generated', value: '24' },
            { label: 'Est. Monthly Traffic', value: '4,200' },
            { label: 'Avg. Keyword Difficulty', value: '28' },
            { label: 'Content Words', value: '18,400' },
          ],
        },
      });
      toast.success('Programmatic pages generated');
    } catch {
      toast.error('Generation failed');
    } finally {
      setThinking(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: C.bg, padding: `${S[6]} ${S[6]} ${S[8]}` }}>
      {/* Header */}
      <div style={{ marginBottom: S[6], maxWidth: '960px' }}>
        <h1 style={{ ...sectionHeading, fontSize: '24px', letterSpacing: '-0.03em', margin: 0 }}>
          Programmatic SEO
        </h1>
        <p style={{ ...sectionSubheading, marginTop: S[1] }}>
          Generate hundreds of SEO-optimized pages at scale using templates and variables. Powered by Analyst (research) and Copywriter (content) agents.
        </p>
      </div>

      <div style={{ maxWidth: '960px', display: 'flex', flexDirection: 'column', gap: S[5] }}>
        {/* Step 1: Page type selection */}
        <div style={{
          backgroundColor: C.surface, border: `1px solid ${C.border}`,
          borderRadius: R.card, padding: S[5],
        }}>
          <h2 style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary, margin: `0 0 ${S[3]} 0` }}>
            1. Select Page Type
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: S[3] }}>
            {PAGE_TYPES.map((type) => (
              <PageTypeCard key={type.id} type={type} selected={selectedType === type.id} onClick={() => setSelectedType(type.id)} />
            ))}
          </div>
        </div>

        {/* Step 2: Variables */}
        {selectedType && (
          <div style={{
            backgroundColor: C.surface, border: `1px solid ${C.border}`,
            borderRadius: R.card, padding: S[5],
          }}>
            <h2 style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary, margin: `0 0 ${S[3]} 0` }}>
              2. Template Variables
            </h2>
            <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap', marginBottom: S[3] }}>
              {variables.map((v) => (
                <span key={v} style={{
                  fontFamily: F.mono, fontSize: '11px', color: C.primary,
                  backgroundColor: C.primaryGlow, border: `1px solid ${C.primary}30`,
                  borderRadius: R.pill, padding: `2px ${S[2]}`,
                }}>
                  {`{{${v}}}`}
                </span>
              ))}
            </div>
            <textarea
              value={contentPattern}
              onChange={(e) => setContentPattern(e.target.value)}
              placeholder={`Enter content pattern using variables above...\n\nExample: "Medglobal delivers healthcare in {{city}}, {{country}}. Our programs serve over {{population}} people..."`}
              style={{
                width: '100%', minHeight: '100px',
                backgroundColor: C.surface2, color: C.textPrimary,
                border: `1px solid ${C.border}`, borderRadius: R.input,
                padding: S[3], fontFamily: F.body, fontSize: '13px',
                outline: 'none', resize: 'vertical', lineHeight: 1.5,
              }}
            />
          </div>
        )}

        {/* Step 3: Generate */}
        {selectedType && (
          <div style={{ display: 'flex', gap: S[3], alignItems: 'center' }}>
            <button style={{ ...btn.primary, fontSize: '14px' }} onClick={handleGenerate} disabled={thinking}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4l2-4z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
              </svg>
              {thinking ? 'Generating...' : 'Generate Pages'}
            </button>
          </div>
        )}

        {/* Agent thinking */}
        {thinking && (
          <AgentThinking agentId="analyst" task={`Researching keywords and generating ${PAGE_TYPES.find(t => t.id === selectedType)?.label || 'pages'}...`} />
        )}

        {/* Agent result */}
        {agentResult && !thinking && (
          <AgentResultPanel result={agentResult} />
        )}

        {/* Generated page previews */}
        {generated && !thinking && (
          <div style={{
            backgroundColor: C.surface, border: `1px solid ${C.border}`,
            borderRadius: R.card, padding: S[5],
          }}>
            <h2 style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary, margin: `0 0 ${S[1]} 0` }}>
              Preview Generated Pages
            </h2>
            <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, margin: `0 0 ${S[3]} 0` }}>
              Showing 3 of 24 generated pages. Each page is SEO-optimized with unique content.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
              {MOCK_PREVIEWS.map((page, i) => <PreviewCard key={i} page={page} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
