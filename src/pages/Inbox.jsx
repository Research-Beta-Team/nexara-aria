import { useState } from 'react';
import { C, F, R, S, T, btn, badge, shadows, scrollbarStyle } from '../tokens';
import useToast from '../hooks/useToast';

/* ─── Mock messages ──────────────────────────────────────── */
const MESSAGES = [
  {
    id: 'm1',
    priority: 'urgent',
    sender: 'Dr. Sarah Chen',
    subject: 'Re: Medglobal Partnership',
    preview: 'Very interested in the Yemen program — can we arrange a more detailed discussion?',
    time: '1h ago',
    agentTag: 'Outreach flagged as HOT lead',
    agentColor: '#EF4444',
    unread: true,
    body: `Hi,\n\nThank you so much for reaching out about the Medglobal Yemen program. I've been following your organization's work closely and I'm genuinely impressed by the scale and impact.\n\nI'd love to learn more about the partnership opportunities — particularly around the medical supply chain and emergency response coordination. Our foundation has been looking for exactly this kind of ground-level healthcare partner in the MENA region.\n\nWould it be possible to arrange a call this week or next? I'm available most afternoons Pacific Time.\n\nBest regards,\nDr. Sarah Chen\nHealthcare Innovation Foundation`,
    leadScore: 94,
    intentLevel: 'High',
    intentNote: 'mentions "partnership" + "Yemen" + "program details"',
    recommendedAction: 'Book a call — high conversion probability',
    icpMatch: 94,
    icpNote: 'Healthcare, >$180k, International focus',
  },
  {
    id: 'm2',
    priority: 'warm',
    sender: 'Ahmed Al-Rashid',
    subject: 'Re: MENA Healthcare Initiative',
    preview: 'Can we schedule a call? I have some questions about the program structure.',
    time: '2h ago',
    agentTag: 'Outreach: follow-up recommended',
    agentColor: C.amber,
    unread: true,
    body: 'Hi,\n\nI reviewed the materials you shared about the MENA Healthcare Initiative and I\'m quite interested.\n\nCan we schedule a call to discuss the details? I have some questions about the program structure and how it would work with our existing partnerships.\n\nBest,\nAhmed',
    leadScore: 79,
    intentLevel: 'Medium',
    intentNote: 'Asks about program structure — qualified interest',
    recommendedAction: 'Schedule exploratory call',
    icpMatch: 81,
    icpNote: 'MENA Healthcare, senior director level',
  },
  {
    id: 'm3',
    priority: 'warm',
    sender: 'Maria Santos',
    subject: 'Re: LATAM NGO Network',
    preview: 'Attended your webinar last week — very impressed with the emergency response model.',
    time: '3h ago',
    agentTag: 'Prospector: ICP match 86%',
    agentColor: C.primary,
    unread: false,
    body: 'Hello,\n\nI attended your webinar on emergency response last Tuesday and was very impressed with the Medglobal model.\n\nWe run a network of NGOs across Latin America and I believe there could be significant collaboration opportunities, especially in disaster response.\n\nWould love to connect further.\n\nMaria Santos\nLATAM NGO Network Director',
    leadScore: 82,
    intentLevel: 'Medium-High',
    intentNote: 'Attended webinar, proactive outreach',
    recommendedAction: 'Add to nurture sequence + schedule intro call',
    icpMatch: 86,
    icpNote: 'NGO director, LATAM, emergency response',
  },
  {
    id: 'm4',
    priority: 'internal',
    sender: 'Copywriter Agent',
    subject: 'Email variant 4 ready for review',
    preview: 'I\'ve completed the 4th email variant for the MENA donor campaign. Open rate prediction: 48%.',
    time: '4h ago',
    agentTag: 'Internal · Content ready',
    agentColor: '#6BA396',
    unread: true,
    body: '',
    leadScore: null,
  },
  {
    id: 'm5',
    priority: 'internal',
    sender: 'Analyst Agent',
    subject: 'CTR anomaly report ready',
    preview: 'Detected unusual CTR drop (6.2% → 2.1%) on the Yemen Emergency ad. Possible audience fatigue.',
    time: '5h ago',
    agentTag: 'Internal · Anomaly detected',
    agentColor: '#3B82F6',
    unread: false,
    body: '',
    leadScore: null,
  },
  {
    id: 'm6',
    priority: 'warm',
    sender: 'James Okafor',
    subject: 'Following up from LinkedIn',
    preview: 'Just wanted to follow up on our conversation about the African health programs.',
    time: '6h ago',
    agentTag: 'Outreach: sequence step 2',
    agentColor: '#8B5CF6',
    unread: false,
    body: 'Hi,\n\nJust following up on our conversation from LinkedIn last week.\n\nI\'m very interested in the African health programs and would like to understand how we might collaborate with our foundation.\n\nBest,\nJames',
    leadScore: 71,
    intentLevel: 'Medium',
    intentNote: 'Follow-up on prior engagement',
    recommendedAction: 'Reply with program overview + schedule call',
    icpMatch: 74,
    icpNote: 'African healthcare sector, director level',
  },
  {
    id: 'm7',
    priority: 'internal',
    sender: 'Guardian Agent',
    subject: '3 content pieces need your review',
    preview: 'CAMP-001-EMAIL-03, CAMP-002-LI-01, and CAMP-004-META-02 are awaiting owner approval.',
    time: '7h ago',
    agentTag: 'Internal · Review needed',
    agentColor: '#6366F1',
    unread: true,
    body: '',
    leadScore: null,
  },
  {
    id: 'm8',
    priority: 'muted',
    sender: 'Newsletter Auto-Archive',
    subject: 'Various newsletters (auto-archived)',
    preview: '12 newsletters auto-archived by Freya · No action needed.',
    time: '8h ago',
    agentTag: null,
    agentColor: null,
    unread: false,
    body: '',
    leadScore: null,
  },
];

const FILTERS = ['All', 'Replies', 'Escalations', 'Agent-Flagged', 'Client Messages'];

/* ─── Priority dot ───────────────────────────────────────── */
function PriorityDot({ priority }) {
  const colors = {
    urgent: '#EF4444',
    warm: C.amber,
    internal: '#3B82F6',
    muted: C.surface3,
  };
  return (
    <div style={{
      width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
      backgroundColor: colors[priority] ?? C.textMuted,
    }} />
  );
}

/* ─── Message List Item ──────────────────────────────────── */
function MessageListItem({ msg, selected, onClick }) {
  const priorityBg = {
    urgent: 'rgba(239,68,68,0.06)',
    warm: 'rgba(251,191,36,0.05)',
    internal: 'rgba(59,130,246,0.05)',
    muted: 'transparent',
  };

  return (
    <div
      onClick={onClick}
      style={{
        padding: `${S[3]} ${S[4]}`,
        borderBottom: `1px solid ${C.border}`,
        backgroundColor: selected ? `${C.primary}12` : priorityBg[msg.priority] ?? 'transparent',
        borderLeft: `3px solid ${selected ? C.primary : 'transparent'}`,
        cursor: 'pointer', transition: T.base,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: S[2] }}>
        <PriorityDot priority={msg.priority} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: S[2], marginBottom: 2 }}>
            <span style={{
              fontFamily: F.body, fontSize: '13px', fontWeight: msg.unread ? 700 : 500,
              color: C.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {msg.sender}
            </span>
            <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, flexShrink: 0 }}>{msg.time}</span>
          </div>
          <div style={{
            fontFamily: F.body, fontSize: '12px', fontWeight: msg.unread ? 600 : 400,
            color: C.textSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            marginBottom: 3,
          }}>
            {msg.subject}
          </div>
          <div style={{
            fontFamily: F.body, fontSize: '11px', color: C.textMuted,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            marginBottom: msg.agentTag ? 4 : 0,
          }}>
            {msg.preview}
          </div>
          {msg.agentTag && (
            <span style={{
              fontFamily: F.body, fontSize: '10px', fontWeight: 600,
              color: msg.agentColor, backgroundColor: `${msg.agentColor}18`,
              border: `1px solid ${msg.agentColor}44`, borderRadius: R.pill,
              padding: `1px 7px`, display: 'inline-block',
            }}>
              {msg.agentTag}
            </span>
          )}
        </div>
        {msg.unread && (
          <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: C.primary, flexShrink: 0, marginTop: 4 }} />
        )}
      </div>
    </div>
  );
}

/* ─── Draft Reply UI ─────────────────────────────────────── */
function DraftReplyPanel({ onClose }) {
  const toast = useToast();
  const [draft, setDraft] = useState(`Hi Dr. Chen,\n\nThank you for your message — it's wonderful to hear your interest in our Yemen program.\n\nI'd love to arrange a call to discuss partnership opportunities in detail. Would any of the following times work for you?\n\n• Tuesday, April 8 at 2pm PT\n• Wednesday, April 9 at 10am PT\n• Thursday, April 10 at 3pm PT\n\nLooking forward to speaking with you.\n\nWarm regards,\nAsif | Medglobal`);

  return (
    <div style={{
      backgroundColor: C.surface2, border: `1px solid ${C.primary}44`,
      borderRadius: R.md, padding: S[4], marginTop: S[4],
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[3] }}>
        <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.primary }}>
          ✍️ Draft Reply — Outreach Agent
        </div>
        <button onClick={onClose} style={{ ...btn.ghost, padding: '2px 6px', fontSize: '12px' }}>✕</button>
      </div>
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={8}
        style={{
          width: '100%', boxSizing: 'border-box',
          backgroundColor: C.surface3, color: C.textPrimary,
          border: `1px solid ${C.border}`, borderRadius: R.input,
          padding: `${S[3]} ${S[3]}`, fontFamily: F.body, fontSize: '13px',
          outline: 'none', resize: 'vertical', lineHeight: 1.6,
          marginBottom: S[3],
        }}
      />
      <div style={{ display: 'flex', gap: S[2] }}>
        <button onClick={() => toast.success('Reply sent to Dr. Sarah Chen!')} style={{ ...btn.primary, fontSize: '12px', padding: `${S[2]} ${S[3]}` }}>
          Send Reply
        </button>
        <button onClick={() => toast.info('Opening full editor...')} style={{ ...btn.secondary, fontSize: '12px', padding: `${S[2]} ${S[3]}` }}>
          Edit
        </button>
        <button onClick={() => toast.info('Regenerating reply draft...')} style={{ ...btn.ghost, fontSize: '12px', padding: `${S[2]} ${S[3]}` }}>
          Regenerate
        </button>
      </div>
    </div>
  );
}

/* ─── Message Detail Panel ───────────────────────────────── */
function MessageDetailPanel({ msg }) {
  const toast = useToast();
  const [showDraft, setShowDraft] = useState(false);

  if (!msg) {
    return (
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: C.textMuted, fontFamily: F.body, fontSize: '14px',
      }}>
        Select a message to view
      </div>
    );
  }

  const isExternal = msg.priority !== 'internal' && msg.priority !== 'muted';

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: S[5], ...scrollbarStyle }}>
      {/* Message header */}
      <div style={{ marginBottom: S[4] }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: S[3], marginBottom: S[2] }}>
          <div>
            <div style={{ fontFamily: F.display, fontSize: '18px', fontWeight: 700, color: C.textPrimary, lineHeight: 1.3 }}>
              {msg.subject}
            </div>
            <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, marginTop: 4 }}>
              From: <span style={{ color: C.textPrimary, fontWeight: 600 }}>{msg.sender}</span> · {msg.time}
            </div>
          </div>
          {msg.priority === 'urgent' && (
            <span style={{
              fontFamily: F.mono, fontSize: '11px', fontWeight: 700,
              color: '#EF4444', backgroundColor: 'rgba(239,68,68,0.15)',
              border: `1px solid rgba(239,68,68,0.4)`, borderRadius: R.pill,
              padding: `3px 10px`, whiteSpace: 'nowrap',
            }}>
              URGENT
            </span>
          )}
        </div>
        {msg.body && (
          <div style={{
            fontFamily: F.body, fontSize: '14px', color: C.textSecondary,
            lineHeight: 1.7, whiteSpace: 'pre-line',
            backgroundColor: C.surface, border: `1px solid ${C.border}`,
            borderRadius: R.md, padding: S[4],
          }}>
            {msg.body}
          </div>
        )}
      </div>

      {/* Freya's Analysis */}
      {isExternal && msg.leadScore !== null && (
        <div style={{
          backgroundColor: `${C.primary}0D`, border: `1px solid ${C.primary}33`,
          borderRadius: R.card, padding: S[4], marginBottom: S[4],
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginBottom: S[3] }}>
            <span style={{ fontSize: '16px' }}>✦</span>
            <span style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.primary }}>
              Freya's Analysis
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[3] }}>
            <div style={{ backgroundColor: C.surface2, borderRadius: R.md, padding: S[3] }}>
              <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[1] }}>
                Lead Score
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                <span style={{ fontFamily: F.mono, fontSize: '22px', fontWeight: 800, color: C.primary }}>
                  {msg.leadScore}
                </span>
                <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>/100</span>
              </div>
            </div>
            <div style={{ backgroundColor: C.surface2, borderRadius: R.md, padding: S[3] }}>
              <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[1] }}>
                ICP Match
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                <span style={{ fontFamily: F.mono, fontSize: '22px', fontWeight: 800, color: C.secondary }}>
                  {msg.icpMatch}%
                </span>
              </div>
              {msg.icpNote && <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>{msg.icpNote}</div>}
            </div>
          </div>
          <div style={{ marginTop: S[3] }}>
            <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[1] }}>Intent Level</div>
            <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary, fontWeight: 600 }}>
              {msg.intentLevel} — {msg.intentNote}
            </div>
          </div>
          <div style={{ marginTop: S[2] }}>
            <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[1] }}>Recommended Action</div>
            <div style={{ fontFamily: F.body, fontSize: '13px', color: C.primary, fontWeight: 600 }}>
              → {msg.recommendedAction}
            </div>
          </div>
        </div>
      )}

      {/* AI Action Bar */}
      {isExternal && (
        <div style={{
          backgroundColor: C.surface, border: `1px solid ${C.border}`,
          borderRadius: R.md, padding: S[3],
          display: 'flex', gap: S[2], flexWrap: 'wrap',
          marginBottom: S[4],
        }}>
          <button
            onClick={() => setShowDraft(true)}
            style={{ ...btn.primary, fontSize: '12px', padding: `${S[2]} ${S[3]}` }}
          >
            ✍️ Draft Reply with Outreach Agent
          </button>
          <button
            onClick={() => toast.success('Opening calendar scheduling for Dr. Sarah Chen...')}
            style={{ ...btn.secondary, fontSize: '12px', padding: `${S[2]} ${S[3]}` }}
          >
            📅 Schedule Call
          </button>
          <button
            onClick={() => toast.success('Lead added to CRM — Sarah Chen, Healthcare Innovation Foundation.')}
            style={{ ...btn.secondary, fontSize: '12px', padding: `${S[2]} ${S[3]}` }}
          >
            🎯 Add to CRM
          </button>
          <button
            onClick={() => toast.info('Opening full lead profile for Dr. Sarah Chen...')}
            style={{ ...btn.ghost, fontSize: '12px', padding: `${S[2]} ${S[3]}` }}
          >
            📊 View Lead Profile
          </button>
        </div>
      )}

      {/* Draft Reply */}
      {showDraft && <DraftReplyPanel onClose={() => setShowDraft(false)} />}

      {/* Internal agent content */}
      {msg.priority === 'internal' && (
        <div style={{
          backgroundColor: C.surface2, border: `1px solid #3B82F633`,
          borderRadius: R.md, padding: S[4],
        }}>
          <div style={{ fontFamily: F.body, fontSize: '14px', color: C.textSecondary, lineHeight: 1.6 }}>
            {msg.preview}
          </div>
          <div style={{ display: 'flex', gap: S[2], marginTop: S[3] }}>
            <button onClick={() => toast.info('Opening agent result...')} style={{ ...btn.primary, fontSize: '12px', padding: `${S[2]} ${S[3]}` }}>
              View Result
            </button>
            <button onClick={() => toast.info('Dismissed.')} style={{ ...btn.secondary, fontSize: '12px', padding: `${S[2]} ${S[3]}` }}>
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */
export default function Inbox() {
  const toast = useToast();
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedMsgId, setSelectedMsgId] = useState('m1');

  const filteredMessages = MESSAGES.filter((msg) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Replies') return msg.priority !== 'internal' && msg.priority !== 'muted';
    if (activeFilter === 'Agent-Flagged') return msg.priority === 'internal';
    if (activeFilter === 'Escalations') return msg.priority === 'urgent';
    if (activeFilter === 'Client Messages') return msg.priority === 'warm' || msg.priority === 'urgent';
    return true;
  });

  const selectedMsg = MESSAGES.find((m) => m.id === selectedMsgId) ?? null;
  const unreadCount = MESSAGES.filter((m) => m.unread).length;

  return (
    <div style={{
      backgroundColor: C.bg, minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      ...scrollbarStyle,
    }}>
      {/* Header */}
      <div style={{
        padding: `${S[5]} ${S[6]} ${S[3]}`,
        borderBottom: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: C.surface, flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
          <h1 style={{ fontFamily: F.display, fontSize: '22px', fontWeight: 800, color: C.textPrimary, margin: 0, letterSpacing: '-0.02em' }}>
            Inbox
          </h1>
          <span style={{
            fontFamily: F.mono, fontSize: '12px', fontWeight: 700,
            color: '#EF4444', backgroundColor: 'rgba(239,68,68,0.15)',
            border: `1px solid rgba(239,68,68,0.4)`, borderRadius: R.pill,
            padding: `3px 10px`,
          }}>
            {unreadCount} unread
          </span>
        </div>
        <button
          onClick={() => toast.success('Freya triage running — sorting and prioritizing your inbox...')}
          style={{ ...btn.primary, fontSize: '13px', fontWeight: 700 }}
        >
          ✦ Triage with Freya
        </button>
      </div>

      {/* Filter bar */}
      <div style={{
        padding: `${S[2]} ${S[6]}`,
        borderBottom: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', gap: S[1],
        backgroundColor: C.surface, flexShrink: 0,
      }}>
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            style={{
              padding: `${S[1]} ${S[3]}`, fontSize: '12px', fontWeight: activeFilter === f ? 600 : 400,
              fontFamily: F.body, cursor: 'pointer', transition: T.color,
              backgroundColor: activeFilter === f ? `${C.primary}18` : 'transparent',
              color: activeFilter === f ? C.primary : C.textSecondary,
              border: `1px solid ${activeFilter === f ? C.primary + '44' : 'transparent'}`,
              borderRadius: R.button, whiteSpace: 'nowrap',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {/* Message list */}
        <div style={{
          width: '38%', flexShrink: 0,
          borderRight: `1px solid ${C.border}`,
          overflowY: 'auto', ...scrollbarStyle,
        }}>
          {filteredMessages.map((msg) => (
            <MessageListItem
              key={msg.id}
              msg={msg}
              selected={msg.id === selectedMsgId}
              onClick={() => setSelectedMsgId(msg.id)}
            />
          ))}
        </div>

        {/* Message detail */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <MessageDetailPanel msg={selectedMsg} />
        </div>
      </div>
    </div>
  );
}
