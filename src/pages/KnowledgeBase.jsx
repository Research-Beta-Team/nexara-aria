import { useState } from 'react';
import { C, F, R, S, T, btn, badge, shadows } from '../tokens';
import useToast from '../hooks/useToast';
import DocPreviewPanel from '../components/knowledge/DocPreviewPanel';
import UploadModal from '../components/knowledge/UploadModal';

/* ─── Mock data ───────────────────────────────────────────── */
const INIT_DOCS = [
  // Workspace
  { id: 'kb1',  folder: 'workspace/brand',    name: 'Brand Guidelines v4.pdf',       type: 'Brand Guidelines',    scope: 'workspace', uploadDate: '2025-01-05', size: '2.1 MB', usedBy: 8, usedByAgents: ['Brand Enforcer', 'Ad Composer', 'Content Strategist'], tags: ['brand', 'tone', 'visual-identity', 'logo'], versions: [{ v: 'v4', date: '2025-01-05', note: 'Added dark-mode palette' }, { v: 'v3', date: '2024-11-10', note: 'Logo refresh' }], preview: `NEXARA BRAND GUIDELINES v4\n\n1. Brand Voice\nConfident. Clear. Human. We communicate with authority without arrogance.\n\n2. Color Palette\nPrimary: #3DDC84 (Nexara Green)\nBackground: #070D09 (Deep Forest)\nText: #DFF0E8 (Mist)\n\n3. Typography\nDisplay: Syne (800 weight for headlines)\nBody: DM Sans (Regular/Medium)\nMono: JetBrains Mono (data, code, metrics)\n\n4. Logo Usage\nMinimum size: 24px height\nClear space: 2× logo height on all sides\nDo not distort, recolor, or add effects.` },
  { id: 'kb2',  folder: 'workspace/brand',    name: 'Tone of Voice Playbook.pdf',    type: 'Messaging Framework', scope: 'workspace', uploadDate: '2025-01-08', size: '890 KB', usedBy: 5, usedByAgents: ['Content Strategist', 'Email Sequencer'], tags: ['tone', 'messaging', 'copywriting'], versions: [{ v: 'v2', date: '2025-01-08', note: 'Revised B2B persona section' }], preview: `TONE OF VOICE PLAYBOOK\n\nWe are:\n• Precise — we say what we mean\n• Empathetic — we understand busy decision-makers\n• Ambitious — we believe in scale and growth\n\nWe are not:\n× Jargon-heavy\n× Overly casual\n× Salesy\n\nKey phrases we use:\n"Built for scale" · "Outcome-driven" · "ARIA handles the work"` },
  { id: 'kb3',  folder: 'workspace/messaging', name: 'GTM Messaging Matrix Q2.docx', type: 'Messaging Framework', scope: 'workspace', uploadDate: '2025-02-01', size: '340 KB', usedBy: 6, usedByAgents: ['Ad Composer', 'Content Strategist', 'Email Sequencer'], tags: ['gtm', 'positioning', 'q2-2025', 'messaging'], versions: [{ v: 'v1', date: '2025-02-01', note: 'Initial Q2 draft' }], preview: `GTM MESSAGING MATRIX — Q2 2025\n\nPrimary Message: Automate your GTM motion. Let ARIA execute.\n\nFor CFOs:\n  Pain: Manual reporting and fragmented outreach\n  Gain: 60% reduction in reporting overhead\n  Proof: Acme reduced close cycle from 8 to 3 days\n\nFor CMOs:\n  Pain: Campaign execution requires too many headcount\n  Gain: 10× campaign velocity with same team\n  Proof: 3x pipeline growth in 90 days` },
  { id: 'kb4',  folder: 'workspace/products',  name: 'ARIA Agent Capabilities v3.pdf', type: 'Product Docs',       scope: 'workspace', uploadDate: '2025-01-20', size: '1.4 MB', usedBy: 12, usedByAgents: ['ICP Analyzer', 'Email Sequencer', 'Ad Composer', 'Content Strategist'], tags: ['aria', 'product', 'capabilities', 'agents'], versions: [{ v: 'v3', date: '2025-01-20', note: 'Added Insight Engine spec' }, { v: 'v2', date: '2024-12-01', note: 'Budget Guardian added' }], preview: `ARIA AGENT CAPABILITIES — v3\n\n12 Specialized Agents:\n\n1. Prospector — LinkedIn + email discovery, 2K prospects/day\n2. Email Sequencer — multi-touch sequences, A/B testing\n3. Ad Composer — LinkedIn/Meta/Google creative generation\n4. Content Strategist — blog, SEO, landing page copy\n5. Bid Optimizer — real-time programmatic bid management\n6. ICP Analyzer — firmographic + behavioral scoring\n...` },
  { id: 'kb5',  folder: 'workspace/products',  name: 'Platform Integration Guide.pdf', type: 'Product Docs',      scope: 'workspace', uploadDate: '2025-01-15', size: '780 KB', usedBy: 3, usedByAgents: ['KB Curator'], tags: ['integrations', 'api', 'crm', 'salesforce'], versions: [{ v: 'v1', date: '2025-01-15', note: 'Initial release' }], preview: `INTEGRATION GUIDE\n\nSupported CRMs: Salesforce, HubSpot, Pipedrive\nSupported MAPs: Marketo, Pardot, ActiveCampaign\nAd Platforms: Google Ads, Meta Ads, LinkedIn\n\nAuthentication: OAuth 2.0 (all platforms)\nWebhooks: Real-time sync on lead creation/update\nAPI Rate Limits: 1,000 calls/hour per integration` },

  // Client: Acme VN
  { id: 'kb6',  folder: 'client/acme-vn',     name: 'Acme VN Company Brief.pdf',     type: 'ICP Profile',         scope: 'client',    uploadDate: '2025-02-05', size: '210 KB', usedBy: 4, usedByAgents: ['Prospector', 'ICP Analyzer', 'Email Sequencer'], tags: ['acme', 'vietnam', 'icp', 'enterprise'], versions: [{ v: 'v1', date: '2025-02-05', note: 'Onboarding brief' }], preview: `ACME VN — CLIENT BRIEF\n\nCompany: Acme Vietnam Ltd.\nIndustry: Manufacturing & Distribution\nRevenue: $120M ARR (FY2024)\nHeadcount: 1,400\nHQ: Ho Chi Minh City, 8 regional offices\n\nPrimary Buyer: CFO (Nguyen Van An)\nPain Points:\n  - Monthly financial close takes 8–10 days\n  - 4 ERPs across entities (SAP, MISA, local)\n  - Manual FX reconciliation for USD/VND\n\nBuying Process: CFO → Finance Director → Procurement` },
  { id: 'kb7',  folder: 'client/acme-vn',     name: 'Acme VN Competitor Analysis.pdf', type: 'Battle Card',       scope: 'client',    uploadDate: '2025-02-08', size: '480 KB', usedBy: 3, usedByAgents: ['Content Strategist', 'Ad Composer'], tags: ['acme', 'competitors', 'battle-card', 'fintech'], versions: [{ v: 'v1', date: '2025-02-08', note: 'Initial analysis' }], preview: `COMPETITOR ANALYSIS — ACME VN CONTEXT\n\nActive in Market:\n• NetSuite — enterprise ERP, limited VND localization\n• MISA — local ERP, no AI/automation layer\n• Zoho — SMB-focused, not enterprise-ready\n\nOur Differentiators vs. Competitors:\n✓ ARIA automation layer — no competitor has this\n✓ Native VND/USD reconciliation\n✓ Vietnam-specific regulatory reporting\n✓ 90-day implementation (vs 12–18 months for SAP)` },
  { id: 'kb8',  folder: 'client/acme-vn',     name: 'CFO Persona Card.pdf',           type: 'ICP Profile',         scope: 'client',    uploadDate: '2025-02-10', size: '150 KB', usedBy: 5, usedByAgents: ['Prospector', 'Email Sequencer', 'ICP Analyzer'], tags: ['cfo', 'persona', 'acme', 'vietnam', 'decision-maker'], versions: [{ v: 'v1', date: '2025-02-10', note: 'Initial persona' }], preview: `CFO PERSONA — ACME VN\n\nName: Nguyen Van An (illustrative)\nAge: 45–55\nEducation: MBA (RMIT Vietnam), CPA\nLinkedIn: Active, 500+ connections\n\nGoals: Reduce close cycle, improve FX visibility, automate management reporting\nFears: ERP migration risk, data migration, vendor lock-in\nTriggers: Board pressure on reporting speed, expansion to new entities\nContent: Consumes: CFO forums, ICAEW updates, LinkedIn thought leadership` },

  // Client: SEA Corp
  { id: 'kb9',  folder: 'client/sea-corp',    name: 'SEA Corp Market Brief.pdf',      type: 'Market Research',     scope: 'client',    uploadDate: '2025-02-15', size: '620 KB', usedBy: 2, usedByAgents: ['ICP Analyzer', 'Content Strategist'], tags: ['sea-corp', 'market-research', 'apac', 'cmr'], versions: [{ v: 'v1', date: '2025-02-15', note: 'Onboarding' }], preview: `SEA CORP — MARKET BRIEF\n\nIndustry: B2B SaaS (HR Tech)\nMarkets: Singapore, Malaysia, Thailand, Philippines\nTarget Buyer: CHRO + VP People\nDeal Size: $80–250K ACV\n\nMarket Dynamics:\n- Remote-first adoption accelerating post-COVID\n- HR budgets up 18% YoY in APAC\n- Key events: HR Summit Asia (March), CXO Forum (May)` },
  { id: 'kb10', folder: 'client/sea-corp',    name: 'SEA Corp Email Templates.docx',  type: 'Email Template',      scope: 'client',    uploadDate: '2025-02-18', size: '90 KB',  usedBy: 3, usedByAgents: ['Email Sequencer'], tags: ['sea-corp', 'email', 'templates', 'chro'], versions: [{ v: 'v1', date: '2025-02-18', note: 'Initial templates' }], preview: `EMAIL TEMPLATES — SEA CORP\n\nTemplate 1: Cold Intro (CHRO)\nSubject: Automate your HR ops across {{country_count}} markets\nBody: Hi {{first_name}}, Managing HR across Southeast Asia means...\n\nTemplate 2: Follow-up (60-day touch)\nSubject: Quick question about {{company}} HR tech stack\nBody: {{first_name}}, following up on my message last month...` },

  // Campaign: Acme VN CFO Q2
  { id: 'kb11', folder: 'campaign/acme-cfq2', name: 'CFO Q2 Campaign Brief.pdf',      type: 'Other',               scope: 'campaign',  uploadDate: '2025-02-10', size: '170 KB', usedBy: 7, usedByAgents: ['Email Sequencer', 'Prospector', 'Content Strategist', 'Ad Composer'], tags: ['acme', 'cfo', 'q2-campaign', 'brief'], versions: [{ v: 'v1', date: '2025-02-10', note: 'Campaign launch brief' }], preview: `CAMPAIGN BRIEF — ACME VN CFO Q2 2025\n\nObjective: Generate 15 qualified CFO leads by May 30\nBudget: $8,500 (LinkedIn $4K · Email $2K · Content $2.5K)\nTimeline: Feb 15 – May 30\n\nTargeting:\n  - CFOs/Finance Directors at Vietnamese enterprises ($50M+ revenue)\n  - Manufacturing, distribution, retail\n  - 500–5,000 employees\n\nKey Messages:\n  - Close cycle reduction (8 → 3 days)\n  - VND/USD automation\n  - 90-day go-live` },
  { id: 'kb12', folder: 'campaign/acme-cfq2', name: 'CFO Pain Point Research.pdf',    type: 'Market Research',     scope: 'campaign',  uploadDate: '2025-02-11', size: '310 KB', usedBy: 3, usedByAgents: ['ICP Analyzer', 'Content Strategist'], tags: ['cfo', 'pain-points', 'research', 'vietnam', 'finance'], versions: [{ v: 'v1', date: '2025-02-11', note: 'ARIA-synthesized research' }], preview: `CFO PAIN POINT RESEARCH — VIETNAM ENTERPRISE\n\nTop 5 Pain Points (survey of 120 CFOs, Q4 2024):\n1. Monthly close takes >7 days (63% of respondents)\n2. Manual FX reconciliation (58%)\n3. Consolidation across entities (52%)\n4. Board reporting preparation (47%)\n5. Audit trail gaps (41%)\n\nBudget Sensitivity: 71% would pay >$100K ARR for proven automation` },

  // Campaign: APAC Brand
  { id: 'kb13', folder: 'campaign/apac-brand', name: 'APAC Brand Campaign Brief.pdf', type: 'Other',               scope: 'campaign',  uploadDate: '2025-02-20', size: '220 KB', usedBy: 4, usedByAgents: ['Ad Composer', 'Content Strategist', 'Brand Enforcer'], tags: ['apac', 'brand', 'awareness', 'campaign-brief'], versions: [{ v: 'v1', date: '2025-02-20', note: 'Initial brief' }], preview: `CAMPAIGN BRIEF — APAC BRAND AWARENESS\n\nObjective: Increase branded search volume 40% in APAC by Q3\nChannels: LinkedIn Thought Leadership · SEO · Display\nBudget: $22,000\n\nKey Markets: Singapore, Malaysia, Hong Kong, Australia\nTarget Audience: C-suite + VP level, B2B SaaS/Tech/Finance\n\nContent Pillars:\n1. AI-powered GTM (LinkedIn article series)\n2. Customer success stories (3 case studies)\n3. ARIA product explainer (video + blog)` },
];

const FOLDERS = [
  {
    id: 'workspace', label: 'Workspace KB', icon: 'workspace',
    children: [
      { id: 'workspace/brand',    label: 'Brand & Tone' },
      { id: 'workspace/messaging', label: 'Messaging' },
      { id: 'workspace/products', label: 'Product Docs' },
    ],
  },
  {
    id: 'client', label: 'Client-specific', icon: 'client',
    children: [
      { id: 'client/acme-vn',   label: 'Acme VN' },
      { id: 'client/sea-corp',  label: 'SEA Corp' },
    ],
  },
  {
    id: 'campaign', label: 'Campaign-specific', icon: 'campaign',
    children: [
      { id: 'campaign/acme-cfq2',  label: 'Acme VN CFO Q2' },
      { id: 'campaign/apac-brand', label: 'APAC Brand' },
    ],
  },
];

const SCOPE_COLORS = {
  workspace: C.primary,
  client:    '#A78BFA',
  campaign:  C.amber,
};

const TYPE_COLORS = {
  'Brand Guidelines':      C.primary,
  'Messaging Framework':   '#A78BFA',
  'Product Docs':          C.secondary,
  'Case Study':            C.amber,
  'ICP Profile':           '#F472B6',
  'Battle Card':           '#FB923C',
  'Email Template':        C.primary,
  'Script':                C.secondary,
  'Market Research':       '#60A5FA',
  'Proposal':              C.amber,
  'Contract':              '#6B7280',
  'Other':                 C.textMuted,
};

/* ─── FolderIcon ─────────────────────────────────────────── */
function FolderIcon({ open }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d={open
        ? 'M1 4a1 1 0 011-1h3l1.5 2H12a1 1 0 011 1v5a1 1 0 01-1 1H2a1 1 0 01-1-1V4z'
        : 'M1 4a1 1 0 011-1h3l1.5 2H12a1 1 0 011 1v5a1 1 0 01-1 1H2a1 1 0 01-1-1V4z'}
        stroke={C.primary} strokeWidth="1.2" fill={open ? C.primaryGlow : 'none'}/>
    </svg>
  );
}

/* ─── DocCard ────────────────────────────────────────────── */
function DocCard({ doc, selected, onClick }) {
  const [hov, setHov] = useState(false);
  const typeColor  = TYPE_COLORS[doc.type]  ?? C.textMuted;
  const scopeColor = SCOPE_COLORS[doc.scope] ?? C.textMuted;

  return (
    <div
      style={{
        backgroundColor: selected ? C.primaryGlow : hov ? C.surface2 : C.surface,
        border: `1px solid ${selected ? 'rgba(61,220,132,0.35)' : hov ? C.borderHover : C.border}`,
        borderRadius: R.card, padding: S[4],
        cursor: 'pointer', transition: T.base,
        display: 'flex', flexDirection: 'column', gap: S[2],
        boxShadow: selected ? `0 0 0 1px rgba(61,220,132,0.2)` : 'none',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
    >
      {/* Icon + name */}
      <div style={{ display: 'flex', gap: S[2], alignItems: 'flex-start' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: R.md, flexShrink: 0,
          backgroundColor: `${typeColor}18`,
          border: `1px solid ${typeColor}28`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 1h7l3 3v9a1 1 0 01-1 1H2a1 1 0 01-1-1V2a1 1 0 011-1z" stroke={typeColor} strokeWidth="1.2"/>
            <path d="M9 1v3h3" stroke={typeColor} strokeWidth="1.2"/>
            <path d="M3 6h8M3 8.5h6M3 11h4" stroke={typeColor} strokeWidth="1" strokeLinecap="round"/>
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 700, color: C.textPrimary, lineHeight: '1.3', wordBreak: 'break-word' }}>
            {doc.name}
          </div>
          <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, marginTop: '2px' }}>
            {doc.uploadDate} · {doc.size}
          </div>
        </div>
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
        <span style={{ fontFamily: F.mono, fontSize: '9px', fontWeight: 700, color: typeColor, backgroundColor: `${typeColor}18`, border: `1px solid ${typeColor}28`, borderRadius: R.pill, padding: '1px 6px' }}>
          {doc.type}
        </span>
        <span style={{ fontFamily: F.mono, fontSize: '9px', fontWeight: 700, color: scopeColor, backgroundColor: `${scopeColor}18`, border: `1px solid ${scopeColor}28`, borderRadius: R.pill, padding: '1px 6px', textTransform: 'capitalize' }}>
          {doc.scope}
        </span>
      </div>

      {/* Used by + tags */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>
          Used by {doc.usedBy} agent{doc.usedBy !== 1 ? 's' : ''}
        </div>
        {doc.tags?.length > 0 && (
          <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>
            {doc.tags.slice(0, 2).join(' · ')}{doc.tags.length > 2 ? ` +${doc.tags.length - 2}` : ''}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── TreeNode ───────────────────────────────────────────── */
function TreeNode({ folder, docs, selected, onSelect }) {
  const [open, setOpen] = useState(true);

  const rootCount = docs.filter((d) => d.folder.startsWith(folder.id + '/')).length;

  return (
    <div>
      {/* Parent */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: S[2], width: '100%',
          background: 'none', border: 'none', cursor: 'pointer',
          padding: `${S[2]} ${S[3]}`,
          borderRadius: R.md,
          transition: T.color,
        }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ transform: open ? 'none' : 'rotate(-90deg)', transition: T.base, flexShrink: 0 }}>
          <path d="M1.5 3.5l3.5 3.5 3.5-3.5" stroke={C.textMuted} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <FolderIcon open={open} />
        <span style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, flex: 1, textAlign: 'left' }}>
          {folder.label}
        </span>
        <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>{rootCount}</span>
      </button>

      {/* Children */}
      {open && folder.children?.map((child) => {
        const childCount = docs.filter((d) => d.folder === child.id).length;
        const isSelected = selected === child.id;
        return (
          <button
            key={child.id}
            onClick={() => onSelect(child.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: S[2], width: '100%',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: `${S[1]} ${S[3]} ${S[1]} 30px`,
              borderRadius: R.md,
              backgroundColor: isSelected ? C.primaryGlow : 'transparent',
              borderLeft: isSelected ? `2px solid ${C.primary}` : '2px solid transparent',
              transition: T.color,
              marginLeft: '1px',
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 2.5h4l1.5 1.5H9a.5.5 0 01.5.5v4a.5.5 0 01-.5.5H1a.5.5 0 01-.5-.5v-5A.5.5 0 011 2.5z" stroke={isSelected ? C.primary : C.textMuted} strokeWidth="1" fill={isSelected ? C.primaryGlow : 'none'}/>
            </svg>
            <span style={{ fontFamily: F.body, fontSize: '12px', color: isSelected ? C.primary : C.textMuted, flex: 1, textAlign: 'left' }}>
              {child.label}
            </span>
            {childCount > 0 && <span style={{ fontFamily: F.mono, fontSize: '10px', color: isSelected ? C.primaryDim : C.textMuted }}>{childCount}</span>}
          </button>
        );
      })}
    </div>
  );
}

/* ─── KnowledgeBase ──────────────────────────────────────── */
export default function KnowledgeBase() {
  const toast = useToast();

  const [docs, setDocs]         = useState(INIT_DOCS);
  const [folder, setFolder]     = useState('workspace/brand');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showUpload, setShowUpload]   = useState(false);
  const [search, setSearch]           = useState('');

  const folderDocs = docs.filter((d) => {
    if (d.folder !== folder) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return d.name.toLowerCase().includes(q) || d.tags.some((t) => t.includes(q)) || d.type.toLowerCase().includes(q);
  });

  const totalDocs = docs.length;
  const totalAgentUses = docs.reduce((sum, d) => sum + d.usedBy, 0);

  const handleDocUpdate = (updated) => {
    setDocs((prev) => prev.map((d) => d.id === updated.id ? updated : d));
    setSelectedDoc(updated);
  };

  const handleDocDelete = (toDelete) => {
    setDocs((prev) => prev.filter((d) => d.id !== toDelete.id));
    setSelectedDoc(null);
  };

  const handleUploaded = ({ file, type, scope, tags }) => {
    const newDoc = {
      id: `kb${Date.now()}`,
      folder,
      name: file.name,
      type, scope, tags,
      uploadDate: new Date().toISOString().slice(0, 10),
      size: `${(file.size / 1024).toFixed(0)} KB`,
      usedBy: 0,
      usedByAgents: [],
      versions: [{ v: 'v1', date: new Date().toISOString().slice(0, 10), note: 'ARIA-processed upload' }],
      preview: '(Document processed by ARIA. Preview will be available shortly.)',
    };
    setDocs((prev) => [...prev, newDoc]);
  };

  // Label for selected folder
  const folderLabel = (() => {
    for (const f of FOLDERS) {
      const child = f.children?.find((c) => c.id === folder);
      if (child) return `${f.label} / ${child.label}`;
    }
    return folder;
  })();

  return (
    <>
      <style>{`
        @keyframes kbFade { from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div style={{ minHeight: '100vh', backgroundColor: C.bg, display: 'flex', flexDirection: 'column' }}>

        {/* ── Page header ── */}
        <div style={{ padding: `${S[6]} ${S[6]} 0`, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: S[4] }}>
            <div>
              <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '24px', fontWeight: 800, color: C.textPrimary, margin: 0, letterSpacing: '-0.03em' }}>
                Knowledge Base
              </h1>
              <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: `${S[1]} 0 0` }}>
                {totalDocs} documents · {totalAgentUses} agent references — ARIA draws from this to power every campaign.
              </p>
            </div>
            <button
              style={{ ...btn.primary, fontSize: '13px' }}
              onClick={() => setShowUpload(true)}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M6.5 1v8M3.5 4.5l3-3 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1 9.5v1.5a1 1 0 001 1h9a1 1 0 001-1V9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              Upload Document
            </button>
          </div>
        </div>

        {/* ── 3-panel body ── */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', padding: `0 ${S[6]} ${S[8]}`, gap: S[4], marginTop: S[4] }}>

          {/* Left: tree nav */}
          <div style={{
            width: '210px', flexShrink: 0,
            backgroundColor: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: R.card,
            padding: `${S[3]} ${S[2]}`,
            overflowY: 'auto',
            scrollbarWidth: 'thin',
            scrollbarColor: `${C.border} transparent`,
          }}>
            <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', padding: `${S[1]} ${S[3]}`, marginBottom: S[2] }}>
              Folders
            </div>
            {FOLDERS.map((f) => (
              <TreeNode key={f.id} folder={f} docs={docs} selected={folder} onSelect={(id) => { setFolder(id); setSelectedDoc(null); }} />
            ))}
          </div>

          {/* Center: doc list */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Subheader */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: S[3], marginBottom: S[3], flexShrink: 0,
            }}>
              <div>
                <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>{folderLabel}</div>
                <div style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>{folderDocs.length} doc{folderDocs.length !== 1 ? 's' : ''}</div>
              </div>
              <div style={{ flex: 1 }} />
              {/* Search */}
              <div style={{ position: 'relative' }}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <circle cx="5.5" cy="5.5" r="4" stroke={C.textMuted} strokeWidth="1.2"/>
                  <path d="M9 9l2.5 2.5" stroke={C.textMuted} strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search folder…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    backgroundColor: C.surface2, color: C.textPrimary,
                    border: `1px solid ${C.border}`, borderRadius: R.input,
                    padding: `${S[2]} ${S[3]} ${S[2]} 28px`,
                    fontFamily: F.body, fontSize: '12px', outline: 'none', width: '180px',
                  }}
                />
              </div>
            </div>

            {/* Doc grid */}
            <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: `${C.border} transparent`, paddingRight: '2px' }}>
              {folderDocs.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', gap: S[3] }}>
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <rect x="4" y="4" width="28" height="28" rx="4" stroke={C.textMuted} strokeWidth="1.5"/>
                    <path d="M10 14h16M10 20h10M10 26h6" stroke={C.textMuted} strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textMuted }}>
                    {search ? 'No documents match your search' : 'No documents in this folder'}
                  </div>
                  {!search && (
                    <button style={{ ...btn.primary, fontSize: '12px' }} onClick={() => setShowUpload(true)}>
                      Upload first document
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: S[3], animation: 'kbFade 0.2s ease' }}>
                  {folderDocs.map((doc) => (
                    <DocCard
                      key={doc.id}
                      doc={doc}
                      selected={selectedDoc?.id === doc.id}
                      onClick={() => setSelectedDoc(selectedDoc?.id === doc.id ? null : doc)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: preview panel */}
          {selectedDoc && (
            <div style={{
              width: '300px', flexShrink: 0,
              backgroundColor: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: R.card,
              overflow: 'hidden',
              display: 'flex', flexDirection: 'column',
            }}>
              <DocPreviewPanel
                doc={selectedDoc}
                onClose={() => setSelectedDoc(null)}
                onUpdate={handleDocUpdate}
                onDelete={handleDocDelete}
              />
            </div>
          )}
        </div>
      </div>

      {/* Upload modal */}
      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onAdded={handleUploaded}
        />
      )}
    </>
  );
}
