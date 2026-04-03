/**
 * Schema Markup Generator — Structured data generation powered by Analyst agent.
 * Generates JSON-LD schema for various page types with validation.
 */
import { useState } from 'react';
import { C, F, R, S, T, btn, badge, shadows, sectionHeading, sectionSubheading } from '../../tokens';
import useToast from '../../hooks/useToast';
import { useAgent } from '../../hooks/useAgent';
import AgentThinking from '../../components/agents/AgentThinking';
import AgentResultPanel from '../../components/agents/AgentResultPanel';

/* ─── Page type options ────────────────────────────────────── */
const SCHEMA_TYPES = [
  { id: 'organization', label: 'Organization', desc: 'Company/NGO schema' },
  { id: 'article', label: 'Article', desc: 'Blog post or news article' },
  { id: 'faq', label: 'FAQ Page', desc: 'Frequently asked questions' },
  { id: 'event', label: 'Event', desc: 'Upcoming events' },
  { id: 'product', label: 'Product / Service', desc: 'Product or service offering' },
  { id: 'breadcrumb', label: 'Breadcrumb', desc: 'Navigation breadcrumbs' },
  { id: 'local-business', label: 'Local Business', desc: 'Location-based business' },
  { id: 'how-to', label: 'How-To', desc: 'Step-by-step guide' },
];

/* ─── Mock schema outputs ──────────────────────────────────── */
const MOCK_SCHEMAS = {
  organization: `{
  "@context": "https://schema.org",
  "@type": "NGO",
  "name": "Medglobal",
  "url": "https://medglobal.org",
  "logo": "https://medglobal.org/logo.png",
  "description": "International humanitarian health NGO delivering emergency healthcare to vulnerable communities worldwide.",
  "foundingDate": "2017",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "US"
  },
  "sameAs": [
    "https://linkedin.com/company/medglobal",
    "https://twitter.com/medglobal"
  ],
  "areaServed": ["North America", "Latin America", "Africa", "MENA", "Europe", "Southeast Asia"]
}`,
  article: `{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How Medglobal Reduced Close Cycle from 8 to 3 Days",
  "author": {
    "@type": "Organization",
    "name": "Medglobal"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Medglobal",
    "logo": {
      "@type": "ImageObject",
      "url": "https://medglobal.org/logo.png"
    }
  },
  "datePublished": "2026-03-15",
  "dateModified": "2026-03-28",
  "description": "Learn how Medglobal automated financial operations to reduce monthly close cycle.",
  "mainEntityOfPage": "https://medglobal.org/blog/close-cycle-improvement"
}`,
  faq: `{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What does Medglobal do?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Medglobal is an international humanitarian health NGO that delivers emergency healthcare and health programs to vulnerable communities worldwide."
      }
    },
    {
      "@type": "Question",
      "name": "Where does Medglobal operate?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Medglobal operates in North America, Latin America, Africa, MENA, Europe, and Southeast Asia."
      }
    },
    {
      "@type": "Question",
      "name": "How can I donate to Medglobal?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Visit medglobal.org/donate to make a one-time or recurring donation supporting global health programs."
      }
    }
  ]
}`,
  event: `{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "Medglobal Annual Health Summit 2026",
  "startDate": "2026-06-15T09:00:00-05:00",
  "endDate": "2026-06-17T17:00:00-05:00",
  "location": {
    "@type": "Place",
    "name": "Chicago Convention Center",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Chicago",
      "addressRegion": "IL"
    }
  },
  "organizer": {
    "@type": "Organization",
    "name": "Medglobal"
  }
}`,
  product: `{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Medglobal Emergency Healthcare Program",
  "description": "Rapid-deployment emergency healthcare services for vulnerable communities.",
  "provider": {
    "@type": "Organization",
    "name": "Medglobal"
  },
  "areaServed": "Worldwide",
  "serviceType": "Healthcare"
}`,
  breadcrumb: `{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://medglobal.org" },
    { "@type": "ListItem", "position": 2, "name": "Programs", "item": "https://medglobal.org/programs" },
    { "@type": "ListItem", "position": 3, "name": "Vietnam", "item": "https://medglobal.org/programs/vietnam" }
  ]
}`,
  'local-business': `{
  "@context": "https://schema.org",
  "@type": "MedicalOrganization",
  "name": "Medglobal Vietnam Office",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Le Loi Boulevard",
    "addressLocality": "Ho Chi Minh City",
    "addressCountry": "VN"
  },
  "telephone": "+84-28-1234-5678",
  "url": "https://medglobal.org/programs/vietnam"
}`,
  'how-to': `{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Support Medglobal's Mission",
  "step": [
    { "@type": "HowToStep", "name": "Learn", "text": "Visit medglobal.org to learn about our programs and impact." },
    { "@type": "HowToStep", "name": "Choose", "text": "Select a program or region you want to support." },
    { "@type": "HowToStep", "name": "Donate", "text": "Make a one-time or recurring donation through our secure portal." },
    { "@type": "HowToStep", "name": "Share", "text": "Spread the word about Medglobal on social media." }
  ]
}`,
};

const VALIDATION_RESULTS = {
  organization: { valid: true, warnings: 0, errors: 0, info: 'All required properties present' },
  article: { valid: true, warnings: 1, errors: 0, info: 'Consider adding "image" property for rich results' },
  faq: { valid: true, warnings: 0, errors: 0, info: 'Eligible for FAQ rich results in search' },
  event: { valid: true, warnings: 1, errors: 0, info: 'Consider adding "image" and "offers" for enhanced display' },
  product: { valid: true, warnings: 0, errors: 0, info: 'Valid service schema' },
  breadcrumb: { valid: true, warnings: 0, errors: 0, info: 'Valid breadcrumb navigation markup' },
  'local-business': { valid: true, warnings: 1, errors: 0, info: 'Consider adding "openingHours" for local search' },
  'how-to': { valid: true, warnings: 0, errors: 0, info: 'Eligible for How-To rich results in search' },
};

/* ─── SchemaTypeCard ────────────────────────────────────────── */
function SchemaTypeCard({ type, selected, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        backgroundColor: selected ? C.primaryGlow : hov ? C.surface2 : C.surface,
        border: `1px solid ${selected ? C.primary : hov ? C.borderHover : C.border}`,
        borderRadius: R.sm, padding: `${S[2]} ${S[3]}`,
        cursor: 'pointer', textAlign: 'left', transition: T.base,
        display: 'flex', flexDirection: 'column', gap: '2px',
      }}
    >
      <span style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: selected ? C.primary : C.textPrimary }}>
        {type.label}
      </span>
      <span style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted }}>{type.desc}</span>
    </button>
  );
}

/* ─── SchemaMarkup ──────────────────────────────────────────── */
export default function SchemaMarkup() {
  const toast = useToast();
  const analyst = useAgent('analyst');
  const [selectedType, setSelectedType] = useState(null);
  const [urlInput, setUrlInput] = useState('https://medglobal.org');
  const [thinking, setThinking] = useState(false);
  const [schemaOutput, setSchemaOutput] = useState(null);
  const [validation, setValidation] = useState(null);
  const [agentResult, setAgentResult] = useState(null);

  const handleGenerate = async () => {
    if (!selectedType) { toast.info('Select a schema type first'); return; }
    setThinking(true);
    setSchemaOutput(null);
    setValidation(null);
    setAgentResult(null);
    try {
      await analyst.activate('schema-markup', { skill: 'schema-markup', type: selectedType, url: urlInput });
      await new Promise(r => setTimeout(r, 1800));
      setSchemaOutput(MOCK_SCHEMAS[selectedType] || '{}');
      setValidation(VALIDATION_RESULTS[selectedType] || { valid: true, warnings: 0, errors: 0, info: '' });
      setAgentResult({
        agentId: 'analyst',
        skill: 'schema-markup',
        confidence: 97,
        creditsUsed: 15,
        output: {
          metrics: [
            { label: 'Schema Type', value: SCHEMA_TYPES.find(t => t.id === selectedType)?.label || selectedType },
            { label: 'Properties', value: (MOCK_SCHEMAS[selectedType] || '').split('\n').filter(l => l.includes(':')).length.toString() },
            { label: 'Validation', value: 'Passed' },
            { label: 'Rich Result', value: 'Eligible' },
          ],
        },
      });
      toast.success('Schema markup generated');
    } catch {
      toast.error('Generation failed');
    } finally {
      setThinking(false);
    }
  };

  const handleCopy = () => {
    if (!schemaOutput) return;
    const wrapped = `<script type="application/ld+json">\n${schemaOutput}\n</script>`;
    navigator.clipboard.writeText(wrapped).then(() => toast.success('Copied to clipboard')).catch(() => toast.error('Copy failed'));
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: C.bg, padding: `${S[6]} ${S[6]} ${S[8]}` }}>
      {/* Header */}
      <div style={{ marginBottom: S[6], maxWidth: '960px' }}>
        <h1 style={{ ...sectionHeading, fontSize: '24px', letterSpacing: '-0.03em', margin: 0 }}>
          Schema Markup Generator
        </h1>
        <p style={{ ...sectionSubheading, marginTop: S[1] }}>
          Generate JSON-LD structured data for rich search results. Powered by the Analyst agent with automatic validation.
        </p>
      </div>

      <div style={{ maxWidth: '960px', display: 'flex', flexDirection: 'column', gap: S[4] }}>
        {/* URL input */}
        <div style={{
          display: 'flex', gap: S[3], alignItems: 'center',
          backgroundColor: C.surface, border: `1px solid ${C.border}`,
          borderRadius: R.card, padding: `${S[3]} ${S[4]}`,
        }}>
          <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>URL:</span>
          <input
            type="text" value={urlInput} onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Enter page URL..."
            style={{ flex: 1, backgroundColor: 'transparent', border: 'none', fontFamily: F.body, fontSize: '13px', color: C.textPrimary, outline: 'none' }}
          />
        </div>

        {/* Schema type grid */}
        <div style={{
          backgroundColor: C.surface, border: `1px solid ${C.border}`,
          borderRadius: R.card, padding: S[5],
        }}>
          <h2 style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary, margin: `0 0 ${S[3]} 0` }}>
            Select Schema Type
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: S[2] }}>
            {SCHEMA_TYPES.map((type) => (
              <SchemaTypeCard key={type.id} type={type} selected={selectedType === type.id} onClick={() => setSelectedType(type.id)} />
            ))}
          </div>
        </div>

        {/* Generate button */}
        <button style={{ ...btn.primary, fontSize: '14px', alignSelf: 'flex-start' }} onClick={handleGenerate} disabled={thinking || !selectedType}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 2h4l1 2h5v8H2V2z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
            <path d="M5 8h4M7 6v4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
          </svg>
          {thinking ? 'Generating...' : 'Generate Schema'}
        </button>

        {/* Agent thinking */}
        {thinking && <AgentThinking agentId="analyst" task={`Generating ${SCHEMA_TYPES.find(t => t.id === selectedType)?.label || ''} schema for ${urlInput}...`} />}

        {/* Agent result summary */}
        {agentResult && !thinking && <AgentResultPanel result={agentResult} />}

        {/* Schema output */}
        {schemaOutput && !thinking && (
          <div style={{
            backgroundColor: C.surface, border: `1px solid ${C.border}`,
            borderRadius: R.card, overflow: 'hidden',
          }}>
            {/* Validation status */}
            {validation && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: S[3],
                padding: `${S[3]} ${S[5]}`,
                backgroundColor: validation.valid ? C.greenDim : C.redDim,
                borderBottom: `1px solid ${C.border}`,
              }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  {validation.valid ? (
                    <path d="M4 8l3 3 5-6" stroke={C.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  ) : (
                    <path d="M4 4l8 8M12 4l-8 8" stroke={C.red} strokeWidth="2" strokeLinecap="round"/>
                  )}
                </svg>
                <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: validation.valid ? C.green : C.red }}>
                  {validation.valid ? 'Valid Schema' : 'Invalid Schema'}
                </span>
                {validation.warnings > 0 && (
                  <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.amber }}>
                    {validation.warnings} warning{validation.warnings !== 1 ? 's' : ''}
                  </span>
                )}
                <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, flex: 1 }}>
                  {validation.info}
                </span>
                <button style={{ ...btn.primary, fontSize: '11px', padding: `${S[1]} ${S[3]}` }} onClick={handleCopy}>
                  Copy Code
                </button>
              </div>
            )}

            {/* Code block */}
            <div style={{ padding: S[4], backgroundColor: '#0D1B16', overflowX: 'auto' }}>
              <pre style={{
                fontFamily: F.mono, fontSize: '12px', color: '#A8D8C8',
                lineHeight: 1.6, margin: 0, whiteSpace: 'pre',
              }}>
                <span style={{ color: C.textMuted }}>{'<script type="application/ld+json">'}</span>
                {'\n'}{schemaOutput}{'\n'}
                <span style={{ color: C.textMuted }}>{'</script>'}</span>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
