import { useState } from 'react';
import { C, F, R, S, T, btn, badge, shadows, scrollbarStyle } from '../tokens';
import useToast from '../hooks/useToast';
import { IconPen, IconClock } from '../components/ui/Icons';

/* ─── Mock data ──────────────────────────────────────────── */
const DRAFT_ITEMS = [
  { id: 'CAMP-001-EMAIL-04', title: 'The Last Operating Table', channel: 'Email', agent: 'Copywriter', date: 'Apr 2' },
  { id: 'CAMP-002-LI-02', title: 'Field Report: Rafah Hospital', channel: 'LinkedIn', agent: 'Copywriter', date: 'Apr 2' },
  { id: 'CAMP-003-META-01', title: 'Emergency Response Banner', channel: 'Meta Ad', agent: 'Copywriter', date: 'Apr 1' },
  { id: 'CAMP-001-LP-01', title: 'Donor Landing Page v2', channel: 'Landing Page', agent: 'Copywriter', date: 'Mar 31' },
];

const REVIEW_ITEMS = [
  {
    id: 'CAMP-001-EMAIL-03', title: 'The Operating Table in Rafah', channel: 'Email',
    guardianStatus: 'reviewing', guardianNote: 'Emotional but compliant — suggest softening paragraph 3',
  },
  {
    id: 'CAMP-002-LI-01', title: 'Yemen Field Update', channel: 'LinkedIn',
    guardianStatus: 'approved', guardianNote: 'Cleared — strong narrative, ICP-aligned',
  },
  {
    id: 'CAMP-004-META-02', title: 'Humanitarian Aid Impact', channel: 'Meta Ad',
    guardianStatus: 'legal', guardianNote: 'Needs legal review before approval',
  },
];

const APPROVED_ITEMS = [
  { id: 'CAMP-001-EMAIL-02', title: 'Emergency Relief Impact Story', channel: 'Email', approvedBy: 'CMO', date: 'Apr 1' },
  { id: 'CAMP-003-LI-01', title: 'Board Member Engagement Post', channel: 'LinkedIn', approvedBy: 'Owner', date: 'Mar 31' },
  { id: 'CAMP-002-META-01', title: 'Yemen Crisis Awareness Ad', channel: 'Meta Ad', approvedBy: 'CMO', date: 'Mar 30' },
  { id: 'CAMP-005-EMAIL-01', title: 'MENA Donor Stewardship', channel: 'Email', approvedBy: 'Legal', date: 'Mar 29' },
];

const PUBLISHED_ITEMS = [
  { id: 'CAMP-001-EMAIL-01', title: 'Q1 Impact Report Email', channel: 'Email', stat1: '48% open', stat2: '6.2% CTR', date: 'Mar 28' },
  { id: 'CAMP-002-LI-03', title: 'Healthcare Heroes Series', channel: 'LinkedIn', stat1: '4.1% engage', stat2: '312 shares', date: 'Mar 27' },
  { id: 'CAMP-003-META-02', title: 'Urgent: Gaza Medical Aid', channel: 'Meta Ad', stat1: '$1.24 CPC', stat2: '3.8% CTR', date: 'Mar 26' },
  { id: 'CAMP-001-EMAIL-00', title: 'Spring Fundraising Launch', channel: 'Email', stat1: '51% open', stat2: '7.8% CTR', date: 'Mar 25' },
  { id: 'CAMP-004-LI-01', title: 'Partnership Announcement', channel: 'LinkedIn', stat1: '5.3% engage', stat2: '188 shares', date: 'Mar 24' },
  { id: 'CAMP-005-META-01', title: 'MENA Emergency Response', channel: 'Meta Ad', stat1: '$0.98 CPC', stat2: '4.1% CTR', date: 'Mar 23' },
  { id: 'CAMP-002-EMAIL-01', title: 'Donor Thank You Series', channel: 'Email', stat1: '62% open', stat2: '4.9% CTR', date: 'Mar 22' },
  { id: 'CAMP-006-LI-01', title: 'Impact Story: Dr. Amara', channel: 'LinkedIn', stat1: '6.2% engage', stat2: '421 shares', date: 'Mar 21' },
];

const CHANNEL_COLORS = {
  'Email': '#4A7C6F',
  'LinkedIn': '#0077B5',
  'Meta Ad': '#1877F2',
  'Landing Page': '#8B5CF6',
  'Twitter': '#1DA1F2',
  'YouTube': '#FF0000',
};

const CONTENT_TYPES = ['Email', 'LinkedIn', 'Meta Ad', 'Landing Page', 'Twitter', 'YouTube Script'];
const TONES = ['Urgent', 'Inspiring', 'Educational', 'Conversational'];
const CAMPAIGNS = ['CAMP-001 — MENA Healthcare Donor', 'CAMP-002 — Yemen Emergency', 'CAMP-003 — APAC Board Members', 'CAMP-004 — LATAM NGO Network'];

/* ─── Sub-components ─────────────────────────────────────── */
function ChannelChip({ channel }) {
  const color = CHANNEL_COLORS[channel] ?? C.textSecondary;
  return (
    <span style={{
      fontFamily: F.mono, fontSize: '10px', fontWeight: 700,
      color, backgroundColor: `${color}18`, border: `1px solid ${color}44`,
      borderRadius: R.pill, padding: `2px 8px`, letterSpacing: '0.04em', whiteSpace: 'nowrap',
    }}>
      {channel}
    </span>
  );
}

function ContentIDChip({ id }) {
  return (
    <span style={{
      fontFamily: F.mono, fontSize: '10px', fontWeight: 600,
      color: C.textMuted, backgroundColor: C.surface3,
      border: `1px solid ${C.border}`, borderRadius: R.sm,
      padding: `2px 6px`, letterSpacing: '0.02em', whiteSpace: 'nowrap',
    }}>
      {id}
    </span>
  );
}

function GuardianBadge({ status }) {
  if (status === 'reviewing') return (
    <span style={{ fontFamily: F.body, fontSize: '11px', color: C.amber, display: 'flex', alignItems: 'center', gap: 4 }}>
      🛡️ Guardian reviewing
    </span>
  );
  if (status === 'approved') return (
    <span style={{ fontFamily: F.body, fontSize: '11px', color: C.primary, display: 'flex', alignItems: 'center', gap: 4 }}>
      🛡️ Guardian approved ✓
    </span>
  );
  return (
    <span style={{ fontFamily: F.body, fontSize: '11px', color: '#EF4444', display: 'flex', alignItems: 'center', gap: 4 }}>
      🛡️ Needs legal review
    </span>
  );
}

/* ─── Kanban Column ──────────────────────────────────────── */
function KanbanColumn({ title, count, headerColor, children, badge: badgeText }) {
  return (
    <div style={{
      flex: 1, minWidth: 0,
      backgroundColor: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: R.card,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Column header */}
      <div style={{
        padding: `${S[3]} ${S[4]}`,
        borderBottom: `2px solid ${headerColor}`,
        backgroundColor: `${headerColor}12`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
          <span style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: headerColor }}>
            {title}
          </span>
          <span style={{
            fontFamily: F.mono, fontSize: '11px', fontWeight: 700,
            color: headerColor, backgroundColor: `${headerColor}22`,
            border: `1px solid ${headerColor}44`, borderRadius: R.pill,
            padding: `1px 7px`,
          }}>
            {count}
          </span>
        </div>
        {badgeText && (
          <span style={{
            fontFamily: F.body, fontSize: '10px', fontWeight: 600,
            color: C.amber, backgroundColor: C.amberDim,
            border: `1px solid ${C.amber}44`, borderRadius: R.pill,
            padding: `2px 7px`, whiteSpace: 'nowrap',
          }}>
            {badgeText}
          </span>
        )}
      </div>
      {/* Cards */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: S[3],
        display: 'flex', flexDirection: 'column', gap: S[3],
        ...scrollbarStyle,
      }}>
        {children}
      </div>
    </div>
  );
}

/* ─── Draft Card ─────────────────────────────────────────── */
function DraftCard({ item }) {
  const toast = useToast();
  return (
    <div style={{
      backgroundColor: C.surface2, border: `1px solid ${C.border}`,
      borderRadius: R.md, padding: S[3],
      transition: T.base,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: S[2], marginBottom: S[2] }}>
        <ContentIDChip id={item.id} />
        <ChannelChip channel={item.channel} />
      </div>
      <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary, marginBottom: S[1], lineHeight: 1.4 }}>
        {item.title}
      </div>
      <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary, marginBottom: S[3] }}>
        ✍️ {item.agent} · {item.date}
      </div>
      <button
        onClick={() => toast.success(`"${item.title}" sent for Guardian review.`)}
        style={{
          ...btn.primary, fontSize: '11px', padding: `${S[1]} ${S[3]}`,
          width: '100%', justifyContent: 'center',
        }}
      >
        Send for Review
      </button>
    </div>
  );
}

/* ─── Review Card ────────────────────────────────────────── */
function ReviewCard({ item }) {
  const toast = useToast();
  const isLegal = item.guardianStatus === 'legal';
  const isApproved = item.guardianStatus === 'approved';
  return (
    <div style={{
      backgroundColor: C.surface2, border: `1px solid ${C.border}`,
      borderRadius: R.md, padding: S[3],
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: S[2], marginBottom: S[2] }}>
        <ContentIDChip id={item.id} />
        <ChannelChip channel={item.channel} />
      </div>
      <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary, marginBottom: S[1], lineHeight: 1.4 }}>
        {item.title}
      </div>
      <GuardianBadge status={item.guardianStatus} />
      {item.guardianNote && (
        <div style={{
          fontFamily: F.body, fontSize: '11px', color: C.textSecondary,
          backgroundColor: C.surface3, borderRadius: R.sm,
          padding: `${S[1]} ${S[2]}`, marginTop: S[2], marginBottom: S[3],
          borderLeft: `2px solid ${item.guardianStatus === 'approved' ? C.primary : C.amber}`,
          lineHeight: 1.45,
        }}>
          {item.guardianNote}
        </div>
      )}
      <button
        onClick={() => toast.info(isLegal ? `"${item.title}" flagged for legal team.` : isApproved ? `Opening owner approval for "${item.title}".` : `Opening review panel for "${item.title}".`)}
        style={{
          ...(isLegal ? btn.danger : btn.secondary),
          fontSize: '11px', padding: `${S[1]} ${S[3]}`,
          width: '100%', justifyContent: 'center',
        }}
      >
        {isLegal ? 'Flag for Legal' : isApproved ? 'Owner Approve' : 'My Review'}
      </button>
    </div>
  );
}

/* ─── Approved Card ──────────────────────────────────────── */
function ApprovedCard({ item }) {
  const toast = useToast();
  return (
    <div style={{
      backgroundColor: C.surface2,
      border: `1px solid ${C.primary}33`,
      borderRadius: R.md, padding: S[3],
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: S[2], marginBottom: S[2] }}>
        <ContentIDChip id={item.id} />
        <ChannelChip channel={item.channel} />
      </div>
      <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary, marginBottom: S[1], lineHeight: 1.4 }}>
        {item.title}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: S[1], marginBottom: S[3] }}>
        <span style={{ fontSize: '12px' }}>✅</span>
        <span style={{ fontFamily: F.body, fontSize: '11px', color: C.primary }}>
          Approved by {item.approvedBy} · {item.date}
        </span>
      </div>
      <button
        onClick={() => toast.success(`"${item.title}" published successfully!`)}
        style={{
          ...btn.primary, fontSize: '11px', padding: `${S[1]} ${S[3]}`,
          width: '100%', justifyContent: 'center',
        }}
      >
        Publish
      </button>
    </div>
  );
}

/* ─── Published Card ─────────────────────────────────────── */
function PublishedCard({ item }) {
  const toast = useToast();
  return (
    <div style={{
      backgroundColor: C.surface2,
      border: `1px solid #3B82F633`,
      borderRadius: R.md, padding: S[3],
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: S[2], marginBottom: S[2] }}>
        <ContentIDChip id={item.id} />
        <ChannelChip channel={item.channel} />
      </div>
      <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary, marginBottom: S[1], lineHeight: 1.4 }}>
        {item.title}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: S[3], marginBottom: S[2] }}>
        <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.primary, fontWeight: 600 }}>{item.stat1}</span>
        <span style={{ fontFamily: F.mono, fontSize: '11px', color: '#3B82F6', fontWeight: 600 }}>{item.stat2}</span>
      </div>
      <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>Published {item.date}</div>
      <button
        onClick={() => toast.info(`Opening analytics for "${item.title}".`)}
        style={{
          ...btn.ghost, fontSize: '11px', padding: `${S[1]} 0`,
          color: '#3B82F6', marginTop: S[2],
        }}
      >
        View Analytics →
      </button>
    </div>
  );
}

/* ─── Content Generator Panel ────────────────────────────── */
function ContentGenerator() {
  const toast = useToast();
  const [selectedType, setSelectedType] = useState('Email');
  const [selectedCampaign, setSelectedCampaign] = useState(CAMPAIGNS[0]);
  const [goal, setGoal] = useState('');
  const [tone, setTone] = useState('Inspiring');
  const [autoGuardian, setAutoGuardian] = useState(true);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    if (!goal.trim()) { toast.warning('Please describe the goal for this content.'); return; }
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      toast.success('Copywriter agent is drafting your content — check Draft column in ~30s.');
    }, 1800);
  };

  return (
    <div style={{
      backgroundColor: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: R.card,
      padding: S[5],
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: S[3], marginBottom: S[4] }}>
        <div style={{
          width: 28, height: 28, borderRadius: R.md,
          backgroundColor: `${C.primary}22`, border: `1px solid ${C.primary}55`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '14px',
        }}>✍️</div>
        <div>
          <div style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary }}>Content Generator</div>
          <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>Copywriter agent · 12cr per piece</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: S[4] }}>
        {/* Content type */}
        <div>
          <div style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>
            Content Type
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[1] }}>
            {CONTENT_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                style={{
                  padding: `${S[1]} ${S[2]}`,
                  fontSize: '12px', fontFamily: F.body, fontWeight: 500,
                  borderRadius: R.sm, border: `1px solid ${selectedType === t ? C.primary : C.border}`,
                  backgroundColor: selectedType === t ? `${C.primary}22` : 'transparent',
                  color: selectedType === t ? C.primary : C.textSecondary,
                  cursor: 'pointer', transition: T.color, whiteSpace: 'nowrap',
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Campaign + Goal */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
          <div>
            <div style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[1] }}>
              Campaign
            </div>
            <select
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              style={{
                width: '100%', backgroundColor: C.surface2, color: C.textPrimary,
                border: `1px solid ${C.border}`, borderRadius: R.input,
                padding: `${S[2]} ${S[3]}`, fontFamily: F.body, fontSize: '13px',
                outline: 'none', cursor: 'pointer',
              }}
            >
              {CAMPAIGNS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[1] }}>
              Goal
            </div>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="What should this content achieve?"
              style={{
                width: '100%', boxSizing: 'border-box',
                backgroundColor: C.surface2, color: C.textPrimary,
                border: `1px solid ${C.border}`, borderRadius: R.input,
                padding: `${S[2]} ${S[3]}`, fontFamily: F.body, fontSize: '13px', outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Tone + Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
          <div>
            <div style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>
              Tone
            </div>
            <div style={{ display: 'flex', gap: S[1], flexWrap: 'wrap' }}>
              {TONES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  style={{
                    padding: `${S[1]} ${S[2]}`, fontSize: '12px', fontFamily: F.body, fontWeight: 500,
                    borderRadius: R.sm, border: `1px solid ${tone === t ? C.secondary : C.border}`,
                    backgroundColor: tone === t ? `${C.secondary}22` : 'transparent',
                    color: tone === t ? C.secondary : C.textSecondary,
                    cursor: 'pointer', transition: T.color,
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Auto-guardian toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: S[2] }}>
            <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>
              Auto-send to Guardian review
            </span>
            <div
              onClick={() => setAutoGuardian(!autoGuardian)}
              style={{
                width: '36px', height: '20px', borderRadius: '999px',
                backgroundColor: autoGuardian ? C.primary : C.surface3,
                border: `1px solid ${autoGuardian ? C.primary : C.border}`,
                position: 'relative', cursor: 'pointer', transition: 'background-color 0.2s',
                flexShrink: 0,
              }}
            >
              <div style={{
                position: 'absolute', top: '2px',
                left: autoGuardian ? '17px' : '2px',
                width: '14px', height: '14px', borderRadius: '50%',
                backgroundColor: autoGuardian ? C.textInverse : C.textMuted,
                transition: 'left 0.2s',
              }} />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            style={{
              ...btn.primary,
              justifyContent: 'center', width: '100%',
              fontSize: '13px', fontWeight: 700,
              padding: `${S[3]} ${S[4]}`,
              opacity: generating ? 0.7 : 1,
            }}
          >
            {generating ? <><IconClock width={13} height={13} color="currentColor" style={{ marginRight: 5, verticalAlign: 'middle' }} /> Generating...</> : <><IconPen width={13} height={13} color="currentColor" style={{ marginRight: 5, verticalAlign: 'middle' }} /> Run Copywriter · 12cr</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */
export default function ContentLibrary() {
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
            Content Library
          </h1>
          <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, marginTop: 4 }}>
            Copywriter · <span style={{ color: C.primary, fontWeight: 600 }}>31 pieces this week</span>
          </div>
        </div>
        <button
          onClick={() => toast.success('Opening content generator panel...')}
          style={{ ...btn.primary, fontSize: '13px', fontWeight: 700 }}
        >
          ✍️ Generate Content
        </button>
      </div>

      {/* Agent Action Bar */}
      <div style={{
        backgroundColor: C.surface, border: `1px solid ${C.border}`,
        borderRadius: R.md, padding: `${S[3]} ${S[4]}`,
        display: 'flex', alignItems: 'center', gap: S[3], flexWrap: 'wrap',
      }}>
        <button
          onClick={() => toast.success('Copywriter agent triggered — check Draft column.')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: S[2],
            padding: `${S[2]} ${S[3]}`, fontSize: '12px', fontWeight: 600,
            fontFamily: F.body, borderRadius: R.button, cursor: 'pointer', transition: T.color,
            backgroundColor: `${C.primary}22`, color: C.primary,
            border: `1px solid ${C.primary}55`,
          }}
        >
          ✍️ Trigger Copywriter
        </button>
        <button
          onClick={() => toast.info('Guardian reviewing all In Review content...')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: S[2],
            padding: `${S[2]} ${S[3]}`, fontSize: '12px', fontWeight: 600,
            fontFamily: F.body, borderRadius: R.button, cursor: 'pointer', transition: T.color,
            backgroundColor: `#6366F122`, color: '#6366F1',
            border: `1px solid #6366F155`,
          }}
        >
          🛡️ Trigger Guardian Review
        </button>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: S[2] }}>
          <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>
            Pending approvals:
          </span>
          <span style={{
            fontFamily: F.mono, fontSize: '12px', fontWeight: 700,
            color: C.amber, backgroundColor: C.amberDim,
            border: `1px solid ${C.amber}44`, borderRadius: R.pill,
            padding: `2px 10px`,
          }}>
            3 items
          </span>
          <button
            onClick={() => toast.info('Opening content approval workflow...')}
            style={{ ...btn.secondary, fontSize: '12px', padding: `${S[1]} ${S[3]}` }}
          >
            View All
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div style={{ display: 'flex', gap: S[4], flex: 1, minHeight: 0 }}>
        {/* Draft */}
        <KanbanColumn title="Draft" count={DRAFT_ITEMS.length} headerColor={C.textMuted}>
          {DRAFT_ITEMS.map((item) => <DraftCard key={item.id} item={item} />)}
        </KanbanColumn>

        {/* In Review */}
        <KanbanColumn title="In Review" count={REVIEW_ITEMS.length} headerColor={C.amber} badge="Guardian reviewing">
          {REVIEW_ITEMS.map((item) => <ReviewCard key={item.id} item={item} />)}
        </KanbanColumn>

        {/* Approved */}
        <KanbanColumn title="Approved" count={APPROVED_ITEMS.length} headerColor={C.primary}>
          {APPROVED_ITEMS.map((item) => <ApprovedCard key={item.id} item={item} />)}
        </KanbanColumn>

        {/* Published */}
        <KanbanColumn title="Published" count={PUBLISHED_ITEMS.length} headerColor="#3B82F6">
          {PUBLISHED_ITEMS.map((item) => <PublishedCard key={item.id} item={item} />)}
        </KanbanColumn>
      </div>

      {/* Content Generator */}
      <ContentGenerator />
    </div>
  );
}
