import { C, F, R, S, T } from '../../tokens';

// Mock existing KB docs
const KB_DOCS = [
  { id: 'kb1', name: 'Acme ERP — Customer Case Study (VinGroup)',      type: 'Case Study',    size: '2.1 MB', tags: ['Vietnam', 'Enterprise'], selected: false },
  { id: 'kb2', name: 'CFO Pain Point Research — SEA Financial Sector',  type: 'Research',      size: '1.4 MB', tags: ['CFO', 'Finance'],       selected: false },
  { id: 'kb3', name: 'Competitive Battle Card — SAP vs Acme ERP',       type: 'Battle Card',   size: '0.8 MB', tags: ['SAP', 'Competitive'],   selected: false },
  { id: 'kb4', name: 'Email Sequence Templates — Enterprise SaaS',      type: 'Templates',     size: '0.3 MB', tags: ['Email', 'Outreach'],    selected: false },
  { id: 'kb5', name: 'Product One-Pager — Q1 2025',                     type: 'Product',       size: '1.2 MB', tags: ['Product', 'Overview'],  selected: false },
];

const TYPE_COLORS = {
  'Case Study':  C.primary,
  'Research':    C.secondary,
  'Battle Card': C.amber,
  'Templates':   '#5EEAD4',
  'Product':     C.textSecondary,
};

function KbDocRow({ doc, selected, onToggle, isLast }) {
  const color = TYPE_COLORS[doc.type] ?? C.textSecondary;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: S[3],
        padding: `${S[3]} ${S[4]}`,
        borderBottom: isLast ? 'none' : `1px solid ${C.border}`,
        cursor: 'pointer',
        backgroundColor: selected ? C.primaryGlow : 'transparent',
        transition: T.color,
      }}
      onClick={onToggle}
    >
      {/* Checkbox */}
      <div style={{
        width: '18px', height: '18px', borderRadius: R.sm,
        backgroundColor: selected ? C.primary : C.surface3,
        border: `2px solid ${selected ? C.primary : C.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, transition: T.base,
      }}>
        {selected && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5l2.5 2.5 3.5-4" stroke={C.textInverse} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>

      {/* Doc icon */}
      <div style={{ width: '32px', height: '32px', borderRadius: R.sm, backgroundColor: `${color}15`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="2" y="1" width="10" height="12" rx="1.5" stroke={color} strokeWidth="1.3"/>
          <path d="M4 4.5h6M4 7h6M4 9.5h4" stroke={color} strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      </div>

      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {doc.name}
        </div>
        <div style={{ display: 'flex', gap: S[2], marginTop: '2px', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color, backgroundColor: `${color}12`, border: `1px solid ${color}25`, borderRadius: R.pill, padding: `1px ${S[1]}` }}>
            {doc.type}
          </span>
          {doc.tags.map((tag) => (
            <span key={tag} style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>{tag}</span>
          ))}
        </div>
      </div>

      <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted, flexShrink: 0 }}>{doc.size}</span>
    </div>
  );
}

export default function WizardStep4({ data, onChange }) {
  const selected = data.kbDocs ?? [];

  const toggle = (id) => {
    onChange('kbDocs', selected.includes(id) ? selected.filter((d) => d !== id) : [...selected, id]);
  };

  const allToggle = () => {
    onChange('kbDocs', selected.length === KB_DOCS.length ? [] : KB_DOCS.map((d) => d.id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[5] }}>
      <div>
        <h2 style={{ fontFamily: F.display, fontSize: '20px', fontWeight: 800, color: C.textPrimary, margin: `0 0 ${S[1]}`, letterSpacing: '-0.02em' }}>
          Knowledge Base
        </h2>
        <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: 0 }}>
          Select documents for ARIA agents to use when generating content, emails, and ad copy.
        </p>
      </div>

      {/* Existing docs */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[2] }}>
          <span style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Existing Documents
          </span>
          <button
            style={{ fontFamily: F.body, fontSize: '12px', color: C.primary, backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
            onClick={allToggle}
          >
            {selected.length === KB_DOCS.length ? 'Deselect all' : 'Select all'}
          </button>
        </div>

        <div style={{ backgroundColor: C.surface2, border: `1px solid ${C.border}`, borderRadius: R.card, overflow: 'hidden' }}>
          {KB_DOCS.map((doc, i) => (
            <KbDocRow
              key={doc.id}
              doc={doc}
              selected={selected.includes(doc.id)}
              onToggle={() => toggle(doc.id)}
              isLast={i === KB_DOCS.length - 1}
            />
          ))}
        </div>

        <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, marginTop: S[2] }}>
          {selected.length} of {KB_DOCS.length} documents selected
        </div>
      </div>

      {/* Upload new */}
      <div>
        <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>
          Upload New Document
        </div>
        <div style={{
          border: `2px dashed ${C.border}`,
          borderRadius: R.md, padding: S[6],
          textAlign: 'center', cursor: 'pointer', backgroundColor: C.surface2,
          transition: T.color,
        }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ margin: '0 auto', display: 'block', marginBottom: S[2] }}>
            <path d="M14 4v16M7 11l7-7 7 7" stroke={C.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 22h20" stroke={C.textMuted} strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
            Drag files here or <span style={{ color: C.primary, fontWeight: 600 }}>browse</span>
          </div>
          <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, marginTop: '4px' }}>
            PDF, DOCX, CSV, PPTX · max 25 MB
          </div>
        </div>
      </div>

      {/* Content plan preview */}
      {selected.length > 0 && (
        <div style={{
          backgroundColor: C.primaryGlow,
          border: `1px solid rgba(61,220,132,0.2)`,
          borderLeft: `3px solid ${C.primary}`,
          borderRadius: R.card,
          padding: S[4],
        }}>
          <div style={{ fontFamily: F.display, fontSize: '12px', fontWeight: 700, color: C.primary, marginBottom: S[2], textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            ARIA Content Plan Preview
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[1] }}>
            {[
              `5-step email sequence (personalized using ${selected.length} KB doc${selected.length > 1 ? 's' : ''})`,
              'LinkedIn ad copy variants (3 headline options)',
              'Objection handling scripts for SDR agents',
              'Blog post outline based on case study findings',
            ].map((item) => (
              <div key={item} style={{ display: 'flex', gap: S[2], alignItems: 'flex-start' }}>
                <span style={{ color: C.primary, flexShrink: 0 }}>›</span>
                <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
