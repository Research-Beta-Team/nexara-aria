import { useState } from 'react';
import { C, F, R, S, T } from '../../tokens';
import UpgradeModal from '../plan/UpgradeModal';
import QuickContentUploadModal from './QuickContentUploadModal';

// Agents relevant to each channel (for step 4)
const CHANNEL_AGENTS = {
  email: ['sdr', 'copywriter'],
  linkedin: ['linkedin_agent'],
  meta: ['meta_ads'],
  google: ['google_ads'],
  linkedin_ads: ['linkedin_ads'],
  whatsapp: ['whatsapp_agent'],
  content: ['seo', 'copywriter'],
  display: ['analytics'],
};

const AGENT_LABELS = {
  copywriter: 'Content Writer',
  sdr: 'SDR / Outreach',
  analytics: 'Analytics',
  meta_monitor: 'Meta Monitor',
  icp_researcher: 'ICP Researcher',
  intent_monitor: 'Intent Monitor',
  competitor_intel: 'Competitor Intel',
  market_analyst: 'Market Analyst',
  seo: 'SEO',
  geo: 'Geo',
  social_media: 'Social Media',
  video_script: 'Video Script',
  brand_guardian: 'Brand Guardian',
  abm_agent: 'ABM Agent',
  linkedin_agent: 'LinkedIn Agent',
  whatsapp_agent: 'WhatsApp Agent',
  meta_ads: 'Meta Ads',
  google_ads: 'Google Ads',
  linkedin_ads: 'LinkedIn Ads',
  creative_intel: 'Creative Intel',
  revops: 'RevOps',
  forecasting: 'Forecasting',
  cs_success: 'Customer Success',
  meeting_intel: 'Meeting Intel',
  aria_cs: 'ARIA CS',
  aria_voice: 'ARIA Voice',
};

// Mock existing KB docs
const KB_DOCS = [
  { id: 'kb1', name: 'Medglobal — Customer Case Study (VinGroup)',      type: 'Case Study',    size: '2.1 MB', tags: ['Vietnam', 'Enterprise'], selected: false },
  { id: 'kb2', name: 'CFO Pain Point Research — SEA Financial Sector',  type: 'Research',      size: '1.4 MB', tags: ['CFO', 'Finance'],       selected: false },
  { id: 'kb3', name: 'Competitive Battle Card — SAP vs Medglobal',       type: 'Battle Card',   size: '0.8 MB', tags: ['SAP', 'Competitive'],   selected: false },
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

export default function WizardStep4({ data, onChange, hasFeature, hasAgent, openCheckout, planId }) {
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showQuickUpload, setShowQuickUpload] = useState(false);

  const channels = data.channels ?? [];
  const selectedAgents = data.selectedAgents ?? [];
  const relevantAgentIds = [...new Set((channels || []).flatMap((ch) => CHANNEL_AGENTS[ch] ?? []))];

  const toggleAgent = (agentId) => {
    if (!(hasAgent?.(agentId) ?? true)) return;
    onChange('selectedAgents', selectedAgents.includes(agentId)
      ? selectedAgents.filter((a) => a !== agentId)
      : [...selectedAgents, agentId]);
  };

  const lockedRelevantCount = relevantAgentIds.filter((id) => !(hasAgent?.(id) ?? true)).length;

  const selected = data.kbDocs ?? [];
  const toggle = (id) => {
    onChange('kbDocs', selected.includes(id) ? selected.filter((d) => d !== id) : [...selected, id]);
  };

  const allToggle = () => {
    onChange('kbDocs', selected.length === KB_DOCS.length ? [] : KB_DOCS.map((d) => d.id));
  };

  const quickUploaded = data.quickUploadedDocs ?? [];
  const removeQuickDoc = (id) => {
    onChange('quickUploadedDocs', quickUploaded.filter((d) => d.id !== id));
  };
  const handleQuickUploadAdded = (doc) => {
    onChange('quickUploadedDocs', [...quickUploaded, { id: doc.id, name: doc.name, type: doc.type, size: doc.size, tags: doc.tags ?? [] }]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[5] }}>
      <div>
        <h2 style={{ fontFamily: F.display, fontSize: '20px', fontWeight: 800, color: C.textPrimary, margin: `0 0 ${S[1]}`, letterSpacing: '-0.02em' }}>
          Agents & Knowledge
        </h2>
        <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: 0 }}>
          Assign agents to your channels and select knowledge base documents for content generation.
        </p>
      </div>

      {/* Agents (relevant to chosen channels) */}
      <div>
        <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>
          Agents for your channels
        </div>
        {relevantAgentIds.length === 0 ? (
          <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, padding: S[4], backgroundColor: C.surface2, borderRadius: R.md }}>
            Select channels in the previous step to see recommended agents.
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[2] }}>
              {relevantAgentIds.map((agentId) => {
                const isLocked = !(hasAgent?.(agentId) ?? true);
                const isSelected = selectedAgents.includes(agentId);
                return (
                  <button
                    key={agentId}
                    type="button"
                    style={{
                      display: 'flex', alignItems: 'center', gap: S[2],
                      padding: `${S[2]} ${S[4]}`, borderRadius: R.md,
                      border: `1px solid ${!isLocked && isSelected ? C.primary : C.border}`,
                      backgroundColor: !isLocked && isSelected ? C.primaryGlow : C.surface2,
                      cursor: isLocked ? 'default' : 'pointer',
                      opacity: isLocked ? 0.75 : 1,
                      transition: T.color,
                    }}
                    onClick={() => toggleAgent(agentId)}
                  >
                    {!isLocked && isSelected && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 7l3 3 7-7" stroke={C.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                    <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 500, color: isLocked ? C.textMuted : C.textPrimary }}>
                      {AGENT_LABELS[agentId] ?? agentId}
                    </span>
                    {isLocked && (
                      <span style={{
                        fontFamily: F.mono, fontSize: '9px', fontWeight: 700, color: C.secondary,
                        backgroundColor: 'rgba(94,234,212,0.15)', border: `1px solid ${C.secondary}`,
                        borderRadius: R.pill, padding: '2px 6px',
                      }}>
                        [SCALE]
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {lockedRelevantCount > 0 && (
              <div style={{
                marginTop: S[2], padding: S[3], backgroundColor: C.amberDim,
                border: `1px solid ${C.amber}`, borderRadius: R.md,
                fontFamily: F.body, fontSize: '12px', color: C.textPrimary,
              }}>
                {lockedRelevantCount} agent{lockedRelevantCount !== 1 ? 's' : ''} require a plan upgrade. You can launch without them or{' '}
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', color: C.amber, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() => setShowUpgrade(true)}
                >
                  upgrade now
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Knowledge Base */}
      <div>
        <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>
          Knowledge Base
        </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[2] }}>
          <span style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Existing Documents
          </span>
          <button
            type="button"
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
              isLast={i === KB_DOCS.length - 1 && !(data.quickUploadedDocs ?? []).length}
            />
          ))}
          {(data.quickUploadedDocs ?? []).map((doc, i) => (
            <KbDocRow
              key={doc.id}
              doc={{ id: doc.id, name: doc.name, type: doc.type, size: doc.size, tags: doc.tags ?? [] }}
              selected={true}
              onToggle={() => removeQuickDoc(doc.id)}
              isLast={i === (data.quickUploadedDocs ?? []).length - 1}
            />
          ))}
        </div>

        <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, marginTop: S[2] }}>
          {selected.length + (data.quickUploadedDocs ?? []).length} document{(selected.length + (data.quickUploadedDocs ?? []).length) !== 1 ? 's' : ''} selected
        </div>
      </div>

      {/* Quick content upload */}
      <div>
        <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>
          Upload content for this campaign
        </div>
        <button
          type="button"
          onClick={() => setShowQuickUpload(true)}
          style={{
            width: '100%',
            border: `2px dashed ${C.border}`,
            borderRadius: R.md,
            padding: S[6],
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: C.surface2,
            transition: T.color,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.backgroundColor = C.primaryGlow; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.backgroundColor = C.surface2; }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ margin: '0 auto', display: 'block', marginBottom: S[2] }}>
            <path d="M14 4v16M7 11l7-7 7 7" stroke={C.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 22h20" stroke={C.textMuted} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
            Quick content upload — ARIA will read and tag
          </div>
          <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, marginTop: '4px' }}>
            PDF, DOCX, CSV, PPTX · max 25 MB
          </div>
        </button>
      </div>

      {/* Content plan preview */}
      {(selected.length > 0 || quickUploaded.length > 0) && (
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
              `5-step email sequence (personalized using ${selected.length + quickUploaded.length} doc${(selected.length + quickUploaded.length) > 1 ? 's' : ''})`,
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

            {showUpgrade && (
        <UpgradeModal
          fromPlan={planId}
          toPlan="scale"
          featureUnlocked="customAgents"
          onClose={() => setShowUpgrade(false)}
        />
      )}
      {showQuickUpload && (
        <QuickContentUploadModal
          onClose={() => setShowQuickUpload(false)}
          onAdded={handleQuickUploadAdded}
        />
      )}
    </div>
  );
}
