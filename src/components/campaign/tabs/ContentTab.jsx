import { useState, useMemo } from 'react';
import useToast from '../../../hooks/useToast';
import { useAgent } from '../../../hooks/useAgent';
import AgentThinking from '../../agents/AgentThinking';
import { C, F, R, S, T, btn, flex, inputStyle } from '../../../tokens';
import { contentItems } from '../../../data/campaigns';
import ContentPreviewModal from '../ContentPreviewModal';
import { AgentNameWithIcon } from '../../ui/AgentRoleIcon';
import { IconClock, IconShield, IconPen } from '../../ui/Icons';

/* ─── Kanban column data ────────────────────────────────────── */
const KANBAN_COLUMNS = [
  { id: 'draft',     label: 'Draft',     color: C.textMuted,   headerBg: C.surface3 },
  { id: 'in_review', label: 'In Review', color: C.amber,       headerBg: 'rgba(251,191,36,0.1)' },
  { id: 'approved',  label: 'Approved',  color: C.green,       headerBg: 'rgba(16,185,129,0.1)' },
  { id: 'live',      label: 'Published', color: '#60A5FA',     headerBg: 'rgba(96,165,250,0.1)' },
];

const CONTENT_MODES = ['Email', 'LinkedIn', 'Meta Ads', 'Landing Page'];

// Extended content data for the kanban view
const KANBAN_ITEMS = [
  // Draft
  { id: 'k1', contentId: 'CAMP-001-EMAIL-05', type: 'Email', channel: 'email', headline: 'Last chance: Match a frontline doctor in Yemen', agent: { agentId: 'copywriter' }, status: 'draft', words: 312, predictedCTR: null, guardianNote: null },
  { id: 'k2', contentId: 'CAMP-001-META-04', type: 'Meta Ad', channel: 'meta', headline: 'Healthcare where it matters most', agent: { agentId: 'copywriter' }, status: 'draft', words: null, predictedCTR: null, guardianNote: null },
  // In Review
  { id: 'k3', contentId: 'CAMP-001-EMAIL-04', type: 'Email', channel: 'email', headline: 'Your gift reaches patients in 72 hours', agent: { agentId: 'copywriter' }, status: 'in_review', words: 287, predictedCTR: '4.2%', guardianNote: 'Minor compliance note: remove urgency language in subject line per GDPR opt-in rules.' },
  { id: 'k4', contentId: 'CAMP-001-LI-03', type: 'LinkedIn Ad', channel: 'linkedin', headline: 'Medglobal expands to 3 new crisis zones in Q2', agent: { agentId: 'copywriter' }, status: 'in_review', words: 150, predictedCTR: '2.8%', guardianNote: null },
  { id: 'k5', contentId: 'CAMP-001-META-03', type: 'Meta Ad', channel: 'meta', headline: 'See exactly where your donation goes', agent: { agentId: 'copywriter' }, status: 'in_review', words: null, predictedCTR: '3.1%', guardianNote: 'Image text coverage is borderline — reduce to under 20%.' },
  // Approved
  { id: 'k6', contentId: 'CAMP-001-EMAIL-03', type: 'Email', channel: 'email', headline: 'We deployed 14 doctors to Yemen last week', agent: { agentId: 'copywriter' }, status: 'approved', words: 341, predictedCTR: '5.1%', guardianNote: null },
  { id: 'k7', contentId: 'CAMP-001-EMAIL-02', type: 'Email', channel: 'email', headline: '4.2 hours of care per dollar — how we do it', agent: { agentId: 'copywriter' }, status: 'approved', words: 298, predictedCTR: '6.3%', guardianNote: null },
  { id: 'k8', contentId: 'CAMP-001-LI-02', type: 'LinkedIn Ad', channel: 'linkedin', headline: 'Impact report: 2,800 patients treated this quarter', agent: { agentId: 'copywriter' }, status: 'approved', words: 120, predictedCTR: '3.8%', guardianNote: null },
  { id: 'k9', contentId: 'CAMP-001-META-02', type: 'Meta Ad', channel: 'meta', headline: 'Frontline healthcare, funded by donors like you', agent: { agentId: 'copywriter' }, status: 'approved', words: null, predictedCTR: '2.9%', guardianNote: null },
  // Published
  { id: 'k10', contentId: 'CAMP-001-EMAIL-01', type: 'Email', channel: 'email', headline: 'Introducing: Medglobal Q2 Donor Campaign', agent: { agentId: 'copywriter' }, status: 'live', words: 265, predictedCTR: '5.8%', guardianNote: null },
  { id: 'k11', contentId: 'CAMP-001-LI-01', type: 'LinkedIn Ad', channel: 'linkedin', headline: 'Healthcare in crisis zones needs your support', agent: { agentId: 'copywriter' }, status: 'live', words: 135, predictedCTR: '3.2%', guardianNote: null },
  { id: 'k12', contentId: 'CAMP-001-META-01', type: 'Meta Ad', channel: 'meta', headline: 'Donate today — 72-hour deployment guaranteed', agent: { agentId: 'copywriter' }, status: 'live', words: null, predictedCTR: '4.1%', guardianNote: null },
];

const CHANNEL_COLORS = {
  email:    C.primary,
  linkedin: '#0A66C2',
  meta:     '#1877F2',
  landing:  C.amber,
};

/* ─── Sub-components ────────────────────────────────────────── */
function AgentActionBar({ copywriter, guardian, onRunCopywriter, onRunGuardian }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: S[3], flexWrap: 'wrap',
      backgroundColor: C.surface2,
      border: `1px solid ${C.border}`,
      borderRadius: R.md,
      padding: `${S[3]} ${S[4]}`,
    }}>
      <span style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Content Agents
      </span>
      <div style={{ width: '1px', height: '20px', backgroundColor: C.border }} />
      <button
        onClick={onRunCopywriter}
        disabled={copywriter.isActive}
        style={{
          ...btn.primary,
          fontSize: '12px', padding: `${S[1]} ${S[3]}`,
          opacity: copywriter.isActive ? 0.7 : 1,
          cursor: copywriter.isActive ? 'wait' : 'pointer',
        }}
      >
        <span>✍️</span>
        {copywriter.isActive ? 'Copywriter Running…' : '▶ Copywriter'}
      </button>
      <button
        onClick={onRunGuardian}
        disabled={guardian.isActive}
        style={{
          ...btn.secondary,
          fontSize: '12px', padding: `${S[1]} ${S[3]}`,
          opacity: guardian.isActive ? 0.7 : 1,
          cursor: guardian.isActive ? 'wait' : 'pointer',
        }}
      >
        <IconShield color={C.secondary} width={16} height={16} />
        {guardian.isActive ? 'Guardian Running…' : '▶ Guardian Review'}
      </button>
      <div style={{ marginLeft: 'auto', fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>
        3 items need review
      </div>
    </div>
  );
}

function ContentModeSelector({ mode, setMode }) {
  return (
    <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap' }}>
      {CONTENT_MODES.map(m => (
        <button
          key={m}
          onClick={() => setMode(m)}
          style={{
            fontFamily: F.body, fontSize: '12px', fontWeight: mode === m ? 600 : 400,
            color: mode === m ? C.textInverse : C.textSecondary,
            backgroundColor: mode === m ? C.primary : 'transparent',
            border: `1px solid ${mode === m ? C.primary : C.border}`,
            borderRadius: R.pill,
            padding: `${S[1]} ${S[4]}`,
            cursor: 'pointer',
            transition: T.color,
          }}
        >
          {m}
        </button>
      ))}
    </div>
  );
}

function KanbanCard({ item, toast, onPreview }) {
  const channelColor = CHANNEL_COLORS[item.channel] || C.textMuted;

  const actionBtn = () => {
    if (item.status === 'draft' || item.status === 'in_review') {
      return (
        <button
          onClick={e => { e.stopPropagation(); toast.info(`Reviewing ${item.contentId}`); }}
          style={{ ...btn.secondary, fontSize: '11px', padding: `2px ${S[2]}` }}
        >
          Review →
        </button>
      );
    }
    if (item.status === 'approved') {
      return (
        <button
          onClick={e => { e.stopPropagation(); toast.success(`${item.contentId} published`); }}
          style={{ ...btn.primary, fontSize: '11px', padding: `2px ${S[2]}` }}
        >
          Publish →
        </button>
      );
    }
    return (
      <button
        onClick={e => { e.stopPropagation(); toast.info(`Viewing ${item.contentId}`); }}
        style={{ ...btn.ghost, fontSize: '11px', padding: `2px ${S[2]}` }}
      >
        View
      </button>
    );
  };

  return (
    <div
      onClick={() => onPreview && onPreview(item)}
      style={{
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: R.md,
        padding: S[3],
        display: 'flex', flexDirection: 'column', gap: S[2],
        cursor: 'pointer',
        transition: T.base,
        borderLeft: `3px solid ${channelColor}`,
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderHover; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.borderLeftColor = channelColor; }}
    >
      {/* Content ID + type */}
      <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
        <span style={{
          fontFamily: F.mono, fontSize: '9px', fontWeight: 700,
          color: channelColor, backgroundColor: `${channelColor}18`,
          border: `1px solid ${channelColor}33`,
          borderRadius: R.pill, padding: '1px 6px', whiteSpace: 'nowrap',
        }}>{item.contentId}</span>
        <span style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted }}>{item.type}</span>
      </div>

      {/* Headline */}
      <div style={{
        fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textPrimary,
        lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {item.headline}
      </div>

      {/* Metrics row */}
      <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap' }}>
        {item.words && (
          <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>{item.words}w</span>
        )}
        {item.predictedCTR && (
          <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.primary }}>CTR est. {item.predictedCTR}</span>
        )}
      </div>

      {/* Guardian note */}
      {item.guardianNote && (
        <div style={{
          display: 'flex', gap: S[1], alignItems: 'flex-start',
          backgroundColor: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)',
          borderRadius: R.sm, padding: `${S[1]} ${S[2]}`,
        }}>
          <span style={{ flexShrink: 0, lineHeight: 0 }}><IconShield color={C.amber} width={12} height={12} /></span>
          <span style={{ fontFamily: F.body, fontSize: '10px', color: C.amber, lineHeight: 1.4 }}>{item.guardianNote}</span>
        </div>
      )}

      {/* Agent + action */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: S[2] }}>
        <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>
          <AgentNameWithIcon agentId={item.agent.agentId} size={11} gap={4} />
        </span>
        {actionBtn()}
      </div>
    </div>
  );
}

function ApprovalQueuePanel({ toast }) {
  const reviewItems = KANBAN_ITEMS.filter(i => i.status === 'in_review');

  return (
    <div style={{
      backgroundColor: C.surface2,
      border: `1px solid rgba(251,191,36,0.35)`,
      borderRadius: R.card,
      overflow: 'hidden',
      position: 'sticky',
      top: S[4],
    }}>
      <div style={{ padding: `${S[3]} ${S[4]}`, borderBottom: `1px solid ${C.border}`, backgroundColor: 'rgba(251,191,36,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
          <IconClock color={C.amber} width={16} height={16} />
          <span style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.amber }}>
            {reviewItems.length} items need your review
          </span>
        </div>
        <button
          onClick={() => toast.success('All clean items bulk-approved')}
          style={{ ...btn.primary, fontSize: '11px', padding: `${S[1]} ${S[3]}`, marginTop: S[2] }}
        >
          Bulk approve all clean
        </button>
      </div>

      <div style={{ padding: S[3], display: 'flex', flexDirection: 'column', gap: S[3] }}>
        {reviewItems.map(item => (
          <div key={item.id} style={{
            backgroundColor: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: R.md,
            padding: S[3],
          }}>
            <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textPrimary, marginBottom: '4px', lineHeight: 1.4 }}>
              {item.headline}
            </div>
            <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, marginBottom: S[2] }}>
              {item.contentId} · <AgentNameWithIcon agentId={item.agent.agentId} size={10} gap={3} />
            </div>
            {item.guardianNote && (
              <div style={{
                backgroundColor: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)',
                borderRadius: R.sm, padding: S[2], marginBottom: S[2],
              }}>
                <div style={{ fontFamily: F.mono, fontSize: '9px', fontWeight: 700, color: C.amber, marginBottom: '3px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <IconShield color={C.amber} width={10} height={10} />
                  Guardian Note
                </div>
                <div style={{ fontFamily: F.body, fontSize: '11px', color: C.amber, lineHeight: 1.5 }}>{item.guardianNote}</div>
              </div>
            )}
            <div style={{ display: 'flex', gap: S[2] }}>
              <button
                onClick={() => toast.success(`${item.contentId} approved`)}
                style={{ ...btn.primary, fontSize: '11px', padding: `2px ${S[2]}`, flex: 1, justifyContent: 'center' }}
              >
                Approve ✓
              </button>
              <button
                onClick={() => toast.warning(`Changes requested on ${item.contentId}`)}
                style={{ ...btn.secondary, fontSize: '11px', padding: `2px ${S[2]}` }}
              >
                Changes
              </button>
              <button
                onClick={() => toast.error(`${item.contentId} rejected`)}
                style={{ ...btn.danger, fontSize: '11px', padding: `2px ${S[2]}` }}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContentGeneratorStrip({ copywriter, onRunCopywriter, toast }) {
  const [genType, setGenType] = useState('Email');
  const [brief, setBrief] = useState('');
  const TYPES = ['Email', 'LinkedIn', 'Meta', 'Landing Page'];
  const CREDIT_COSTS = { Email: 12, LinkedIn: 10, Meta: 8, 'Landing Page': 20 };

  return (
    <div style={{
      backgroundColor: C.surface2,
      border: `1px solid ${C.border}`,
      borderRadius: R.card,
      padding: S[4],
    }}>
      <div style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary, marginBottom: S[3] }}>
        Generate new content
      </div>
      <div style={{ display: 'flex', gap: S[3], flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, marginBottom: S[1] }}>Type</div>
          <div style={{ display: 'flex', gap: S[1] }}>
            {TYPES.map(t => (
              <button
                key={t}
                onClick={() => setGenType(t)}
                style={{
                  fontFamily: F.body, fontSize: '11px',
                  color: genType === t ? C.textInverse : C.textSecondary,
                  backgroundColor: genType === t ? C.primary : C.surface3,
                  border: `1px solid ${genType === t ? C.primary : C.border}`,
                  borderRadius: R.button, padding: `${S[1]} ${S[2]}`,
                  cursor: 'pointer', transition: T.color,
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, marginBottom: S[1] }}>What's the goal?</div>
          <input
            type="text"
            placeholder="e.g. Nurture mid-funnel donors with impact story"
            value={brief}
            onChange={e => setBrief(e.target.value)}
            style={{ ...inputStyle, fontSize: '12px' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
          <span style={{
            fontFamily: F.mono, fontSize: '10px', fontWeight: 700,
            color: C.amber, backgroundColor: 'rgba(251,191,36,0.12)',
            borderRadius: R.pill, padding: '2px 8px',
          }}>
            {CREDIT_COSTS[genType] || 12} credits
          </span>
          <button
            onClick={() => {
              if (!brief.trim()) { toast.warning('Add a brief before generating'); return; }
              onRunCopywriter(genType, brief);
            }}
            disabled={copywriter.isActive}
            style={{
              ...btn.primary, fontSize: '12px', padding: `${S[2]} ${S[4]}`,
              opacity: copywriter.isActive ? 0.7 : 1,
              cursor: copywriter.isActive ? 'wait' : 'pointer',
            }}
          >
            {copywriter.isActive ? 'Running…' : <><IconPen width={12} height={12} color="currentColor" style={{ marginRight: 5, verticalAlign: 'middle' }} /> Run Copywriter</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main component ────────────────────────────────────────── */
export default function ContentTab() {
  const toast = useToast();
  const copywriter = useAgent('copywriter');
  const guardian = useAgent('guardian');
  const [previewItem, setPreviewItem] = useState(null);
  const [contentMode, setContentMode] = useState('Email');

  const handleRunCopywriter = async (type, brief) => {
    toast.info('Copywriter agent activated…');
    await copywriter.activate('Generate campaign content with copywriting skill', {
      contentType: type,
      brief: brief || 'Generate high-converting campaign content',
    });
    toast.success('Content generated — sent to Guardian for review');
  };

  const handleRunGuardian = async () => {
    toast.info('Guardian agent reviewing all in-review content…');
    await guardian.activate('Review content for compliance and brand alignment', {
      itemCount: KANBAN_ITEMS.filter(i => i.status === 'in_review').length,
    });
    toast.success('Guardian review complete — 2 items passed, 1 flagged');
  };

  // Group items by status for kanban
  const byStatus = useMemo(() => {
    const grouped = {};
    KANBAN_COLUMNS.forEach(col => { grouped[col.id] = []; });
    KANBAN_ITEMS.forEach(item => {
      if (grouped[item.status]) grouped[item.status].push(item);
    });
    return grouped;
  }, []);

  return (
    <>
      {previewItem && (
        <ContentPreviewModal item={previewItem} onClose={() => setPreviewItem(null)} />
      )}
      <div style={{ padding: S[5], display: 'flex', flexDirection: 'column', gap: S[4] }}>

        {/* Agent Action Bar */}
        <AgentActionBar
          copywriter={copywriter}
          guardian={guardian}
          onRunCopywriter={() => handleRunCopywriter('Multi-type', '')}
          onRunGuardian={handleRunGuardian}
        />

        {/* Agent thinking */}
        {copywriter.isActive && <AgentThinking agentId="copywriter" task="Generating campaign content with copywriting skill…" />}
        {guardian.isActive && <AgentThinking agentId="guardian" task="Reviewing content for compliance and brand alignment…" />}

        {/* Content Mode Selector */}
        <ContentModeSelector mode={contentMode} setMode={setContentMode} />

        {/* Two-column: Kanban (60%) + Approval Queue (40%) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: S[5], alignItems: 'start' }}>

          {/* Kanban Board */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: S[3] }}>
            {KANBAN_COLUMNS.map(col => {
              const items = byStatus[col.id] || [];
              return (
                <div key={col.id}>
                  {/* Column header */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: S[2],
                    padding: `${S[2]} ${S[3]}`,
                    backgroundColor: col.headerBg,
                    borderRadius: `${R.md} ${R.md} 0 0`,
                    border: `1px solid ${C.border}`,
                    borderBottom: 'none',
                    marginBottom: 0,
                  }}>
                    <span style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 700, color: col.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {col.label}
                    </span>
                    <span style={{ fontFamily: F.mono, fontSize: '10px', color: col.color, backgroundColor: `${col.color}20`, borderRadius: R.pill, padding: '0 6px' }}>
                      {items.length}
                    </span>
                  </div>
                  {/* Cards */}
                  <div style={{
                    backgroundColor: C.surface,
                    border: `1px solid ${C.border}`,
                    borderRadius: `0 0 ${R.md} ${R.md}`,
                    padding: S[2],
                    display: 'flex', flexDirection: 'column', gap: S[2],
                    minHeight: '120px',
                  }}>
                    {items.map(item => (
                      <KanbanCard
                        key={item.id}
                        item={item}
                        toast={toast}
                        onPreview={setPreviewItem}
                      />
                    ))}
                    {items.length === 0 && (
                      <div style={{ padding: S[4], textAlign: 'center', color: C.textMuted, fontFamily: F.body, fontSize: '11px' }}>
                        Empty
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Approval Queue */}
          <ApprovalQueuePanel toast={toast} />
        </div>

        {/* Content Generator strip */}
        <ContentGeneratorStrip
          copywriter={copywriter}
          onRunCopywriter={handleRunCopywriter}
          toast={toast}
        />
      </div>
    </>
  );
}
