import { useState } from 'react';
import { C, F, R, S, T, btn, badge, shadows, scrollbarStyle } from '../tokens';
import useToast from '../hooks/useToast';

/* ─── Mock Data ──────────────────────────────────────────── */
const LEADS = [
  { id: 'l1', name: 'Dr. Fatima Al-Rashid', company: 'Kuwait Medical Foundation', score: 91, intent: 'hot', icpMatch: 94, source: 'LinkedIn' },
  { id: 'l2', name: 'James Okafor', company: 'African Health Alliance', score: 87, intent: 'hot', icpMatch: 89, source: 'Enriched' },
  { id: 'l3', name: 'Maria Santos', company: 'LATAM NGO Network', score: 78, intent: 'warm', icpMatch: 86, source: 'Referral' },
  { id: 'l4', name: 'Dr. Yuki Tanaka', company: 'APAC Humanitarian Coalition', score: 74, intent: 'warm', icpMatch: 81, source: 'LinkedIn' },
  { id: 'l5', name: 'Ahmed Hassan', company: 'MENA Healthcare Partners', score: 68, intent: 'warm', icpMatch: 77, source: 'Enriched' },
  { id: 'l6', name: 'Sarah Kimani', company: 'East Africa Medical Society', score: 55, intent: 'cold', icpMatch: 64, source: 'LinkedIn' },
  { id: 'l7', name: 'Rafael Morales', company: 'Cruz Roja LATAM', score: 49, intent: 'cold', icpMatch: 58, source: 'Enriched' },
  { id: 'l8', name: 'Li Wei', company: 'Asia Health Foundation', score: 42, intent: 'cold', icpMatch: 51, source: 'LinkedIn' },
];

const SEQUENCES = [
  {
    id: 'seq1',
    name: 'MENA Healthcare Donor Cold Outreach',
    status: 'active',
    contacts: 47,
    steps: ['Email 1', 'Email 2', 'LinkedIn', 'Email 3'],
    delays: ['3d', '5d', '7d'],
    openRate: '42%',
    active: 28, replied: 12, meetings: 4,
  },
  {
    id: 'seq2',
    name: 'ANZ Donor Re-engagement',
    status: 'pending_approval',
    contacts: 23,
    steps: ['Email 1', 'LinkedIn', 'Email 2', 'LinkedIn', 'Email 3'],
    delays: ['2d', '4d', '3d', '5d'],
    openRate: '—',
    active: 0, replied: 0, meetings: 0,
  },
  {
    id: 'seq3',
    name: 'APAC Board Member Outreach',
    status: 'active',
    contacts: 12,
    steps: ['Email 1', 'LinkedIn'],
    delays: ['5d'],
    openRate: '71%',
    active: 9, replied: 3, meetings: 2,
  },
];

const APPROVALS = [
  { id: 'a1', name: 'MENA Email Sequence', contacts: 47, agent: 'Outreach', preview: "Subject: Urgent: Healthcare at the Front Line\n\n\"As MSF's operations expand into MENA, your partnership can...\"" },
  { id: 'a2', name: 'APAC Follow-up Email', contacts: 12, agent: 'Outreach', preview: "Subject: Quick follow-up — Medglobal's APAC initiative\n\nFollowing up on my earlier message regarding..." },
  { id: 'a3', name: 'ANZ Re-engagement Sequence', contacts: 23, agent: 'Outreach', preview: "Subject: We miss you — and so do the patients we serve\n\nIt's been a while since we connected..." },
];

/* ─── Intent Badge ───────────────────────────────────────── */
function IntentBadge({ intent }) {
  const map = {
    hot: { color: '#EF4444', bg: 'rgba(239,68,68,0.15)', label: 'HOT' },
    warm: { color: C.amber, bg: C.amberDim, label: 'WARM' },
    cold: { color: C.textMuted, bg: C.surface3, label: 'COLD' },
  };
  const s = map[intent] ?? map.cold;
  return (
    <span style={{
      fontFamily: F.mono, fontSize: '10px', fontWeight: 700,
      color: s.color, backgroundColor: s.bg,
      border: `1px solid ${s.color}44`, borderRadius: R.pill,
      padding: `2px 7px`, letterSpacing: '0.04em',
    }}>
      {s.label}
    </span>
  );
}

/* ─── Score Bar ──────────────────────────────────────────── */
function ScoreBar({ score }) {
  const color = score >= 80 ? C.primary : score >= 60 ? C.amber : '#EF4444';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
      <div style={{ flex: 1, height: '4px', borderRadius: '2px', backgroundColor: C.surface3 }}>
        <div style={{ width: `${score}%`, height: '100%', borderRadius: '2px', backgroundColor: color, transition: T.base }} />
      </div>
      <span style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color, minWidth: '28px' }}>{score}</span>
    </div>
  );
}

/* ─── Lead Queue Panel ───────────────────────────────────── */
function LeadQueuePanel({ selectedLeads, onToggleLead }) {
  const toast = useToast();
  const hotLeads = LEADS.filter((l) => l.intent === 'hot');

  return (
    <div style={{
      width: '28%', flexShrink: 0,
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
          Lead Queue
        </div>
        <span style={{
          fontFamily: F.mono, fontSize: '11px', fontWeight: 700,
          color: C.amber, backgroundColor: C.amberDim,
          border: `1px solid ${C.amber}44`, borderRadius: R.pill,
          padding: `2px 8px`,
        }}>
          47 waiting
        </span>
      </div>

      {/* Lead cards */}
      <div style={{ flex: 1, overflowY: 'auto', padding: S[3], display: 'flex', flexDirection: 'column', gap: S[2], ...scrollbarStyle }}>
        {LEADS.map((lead) => {
          const selected = selectedLeads.includes(lead.id);
          return (
            <div
              key={lead.id}
              onClick={() => onToggleLead(lead.id)}
              style={{
                backgroundColor: selected ? `${C.primary}12` : C.surface2,
                border: `1px solid ${selected ? C.primary : C.border}`,
                borderRadius: R.md, padding: S[3],
                cursor: 'pointer', transition: T.base,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: S[2], marginBottom: S[1] }}>
                <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary, lineHeight: 1.3 }}>
                  {lead.name}
                </div>
                <IntentBadge intent={lead.intent} />
              </div>
              <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary, marginBottom: S[2] }}>
                {lead.company}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginBottom: S[2] }}>
                <ScoreBar score={lead.score} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>
                  ICP {lead.icpMatch}% · {lead.source}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); toast.success(`${lead.name} added to sequence.`); }}
                  style={{
                    padding: `2px ${S[2]}`, fontSize: '10px', fontFamily: F.body, fontWeight: 600,
                    color: C.primary, backgroundColor: `${C.primary}15`,
                    border: `1px solid ${C.primary}44`, borderRadius: R.sm,
                    cursor: 'pointer', transition: T.color,
                  }}
                >
                  + Add
                </button>
              </div>
              {selected && (
                <div style={{ marginTop: S[2], fontFamily: F.body, fontSize: '11px', color: C.primary }}>
                  ✓ Will join MENA Healthcare sequence
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer actions */}
      <div style={{ padding: S[3], borderTop: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: S[2] }}>
        <button
          onClick={() => toast.success(`${hotLeads.length} hot leads added to MENA Healthcare sequence.`)}
          style={{
            ...btn.primary, justifyContent: 'center', fontSize: '12px',
            padding: `${S[2]} ${S[3]}`,
          }}
        >
          🔥 Bulk: Add all hot leads to sequence
        </button>
        <button
          onClick={() => toast.info('Prospector agent is finding more leads matching your ICP...')}
          style={{
            ...btn.secondary, justifyContent: 'center', fontSize: '12px',
            padding: `${S[2]} ${S[3]}`,
          }}
        >
          🔍 Run Prospector — Find more leads
        </button>
      </div>
    </div>
  );
}

/* ─── Sequence Step Visualizer ───────────────────────────── */
function SequenceSteps({ steps, delays }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'wrap', rowGap: S[1] }}>
      {steps.map((step, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            padding: `3px ${S[2]}`, borderRadius: R.sm,
            backgroundColor: C.surface3, border: `1px solid ${C.border}`,
            fontFamily: F.mono, fontSize: '10px', fontWeight: 600,
            color: C.textSecondary, whiteSpace: 'nowrap',
          }}>
            {step}
          </div>
          {i < steps.length - 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <div style={{ width: '16px', height: '1px', backgroundColor: C.border }} />
              <span style={{ fontFamily: F.mono, fontSize: '9px', color: C.textMuted, whiteSpace: 'nowrap' }}>
                {delays[i]}
              </span>
              <div style={{ width: '16px', height: '1px', backgroundColor: C.border }} />
              <span style={{ color: C.textMuted, fontSize: '10px' }}>→</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Sequence Card ──────────────────────────────────────── */
function SequenceCard({ seq }) {
  const toast = useToast();
  const isPending = seq.status === 'pending_approval';

  return (
    <div style={{
      backgroundColor: C.surface2,
      border: `1px solid ${isPending ? C.amber : C.border}`,
      borderRadius: R.card, padding: S[4], marginBottom: S[3],
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: S[3], marginBottom: S[3] }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary, marginBottom: S[1] }}>
            {seq.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: S[2], flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: F.mono, fontSize: '10px', fontWeight: 700,
              color: isPending ? C.amber : C.primary,
              backgroundColor: isPending ? C.amberDim : `${C.primary}15`,
              border: `1px solid ${isPending ? C.amber : C.primary}44`,
              borderRadius: R.pill, padding: `2px 7px`,
            }}>
              {isPending ? '⚠ Waiting Approval' : '● Active'}
            </span>
            <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>
              {seq.contacts} contacts · {seq.steps.length} steps
            </span>
            {!isPending && (
              <span style={{ fontFamily: F.mono, fontSize: '12px', fontWeight: 700, color: C.primary }}>
                {seq.openRate} open rate
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Step visualizer */}
      <div style={{ marginBottom: S[3] }}>
        <SequenceSteps steps={seq.steps} delays={seq.delays} />
      </div>

      {/* Approval banner */}
      {isPending && (
        <div style={{
          backgroundColor: C.amberDim, border: `1px solid ${C.amber}44`,
          borderRadius: R.md, padding: `${S[2]} ${S[3]}`, marginBottom: S[3],
          fontFamily: F.body, fontSize: '12px', color: C.amber, lineHeight: 1.45,
        }}>
          Outreach agent built this sequence — awaiting your approval to send
        </div>
      )}

      {/* Stats */}
      {!isPending && (
        <div style={{ display: 'flex', gap: S[4], marginBottom: S[3] }}>
          <div>
            <div style={{ fontFamily: F.mono, fontSize: '16px', fontWeight: 700, color: C.textPrimary }}>{seq.active}</div>
            <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary }}>Active</div>
          </div>
          <div>
            <div style={{ fontFamily: F.mono, fontSize: '16px', fontWeight: 700, color: C.amber }}>{seq.replied}</div>
            <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary }}>Replied</div>
          </div>
          <div>
            <div style={{ fontFamily: F.mono, fontSize: '16px', fontWeight: 700, color: C.primary }}>{seq.meetings}</div>
            <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary }}>Meetings</div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap' }}>
        {isPending ? (
          <>
            <button onClick={() => toast.success(`${seq.name} approved! Sending to ${seq.contacts} contacts.`)} style={{ ...btn.primary, fontSize: '12px', padding: `${S[1]} ${S[3]}` }}>
              Approve &amp; Send
            </button>
            <button onClick={() => toast.info('Opening sequence editor...')} style={{ ...btn.secondary, fontSize: '12px', padding: `${S[1]} ${S[3]}` }}>
              Edit Sequence
            </button>
            <button onClick={() => toast.warning(`${seq.name} rejected.`)} style={{ ...btn.danger, fontSize: '12px', padding: `${S[1]} ${S[3]}` }}>
              Reject
            </button>
          </>
        ) : (
          <>
            <button onClick={() => toast.info(`${seq.name} paused.`)} style={{ ...btn.secondary, fontSize: '12px', padding: `${S[1]} ${S[3]}` }}>
              Pause
            </button>
            <button onClick={() => toast.info('Opening sequence editor...')} style={{ ...btn.secondary, fontSize: '12px', padding: `${S[1]} ${S[3]}` }}>
              Edit
            </button>
            <button onClick={() => toast.info(`Opening contacts for ${seq.name}...`)} style={{ ...btn.ghost, fontSize: '12px', padding: `${S[1]} ${S[3]}` }}>
              View Contacts
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Build New Tab ──────────────────────────────────────── */
function BuildNewTab() {
  const toast = useToast();
  const [audience, setAudience] = useState('');
  const [channel, setChannel] = useState('Email');
  const [tone, setTone] = useState('');
  const [goals, setGoals] = useState('');
  const CHANNELS = ['Email', 'LinkedIn', 'Multi-Channel'];

  return (
    <div style={{ padding: S[4], display: 'flex', flexDirection: 'column', gap: S[4] }}>
      <div>
        <label style={{ display: 'block', fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[1] }}>
          ICP / Target Audience
        </label>
        <textarea
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          placeholder="e.g. Healthcare NGO executive directors in MENA with >$5M budget..."
          rows={3}
          style={{
            width: '100%', boxSizing: 'border-box',
            backgroundColor: C.surface3, color: C.textPrimary,
            border: `1px solid ${C.border}`, borderRadius: R.input,
            padding: `${S[2]} ${S[3]}`, fontFamily: F.body, fontSize: '13px',
            outline: 'none', resize: 'vertical',
          }}
        />
      </div>
      <div>
        <label style={{ display: 'block', fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>
          Channel
        </label>
        <div style={{ display: 'flex', gap: S[2] }}>
          {CHANNELS.map((ch) => (
            <button
              key={ch}
              onClick={() => setChannel(ch)}
              style={{
                padding: `${S[1]} ${S[3]}`, fontSize: '12px', fontFamily: F.body, fontWeight: 500,
                borderRadius: R.sm, border: `1px solid ${channel === ch ? C.primary : C.border}`,
                backgroundColor: channel === ch ? `${C.primary}22` : 'transparent',
                color: channel === ch ? C.primary : C.textSecondary,
                cursor: 'pointer', transition: T.color,
              }}
            >
              {ch}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[3] }}>
        <div>
          <label style={{ display: 'block', fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[1] }}>Tone</label>
          <input
            type="text" value={tone} onChange={(e) => setTone(e.target.value)}
            placeholder="e.g. Empathetic, urgent, professional"
            style={{ width: '100%', boxSizing: 'border-box', backgroundColor: C.surface3, color: C.textPrimary, border: `1px solid ${C.border}`, borderRadius: R.input, padding: `${S[2]} ${S[3]}`, fontFamily: F.body, fontSize: '13px', outline: 'none' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[1] }}>Goals</label>
          <input
            type="text" value={goals} onChange={(e) => setGoals(e.target.value)}
            placeholder="e.g. Book 5 meetings per week"
            style={{ width: '100%', boxSizing: 'border-box', backgroundColor: C.surface3, color: C.textPrimary, border: `1px solid ${C.border}`, borderRadius: R.input, padding: `${S[2]} ${S[3]}`, fontFamily: F.body, fontSize: '13px', outline: 'none' }}
          />
        </div>
      </div>
      <button
        onClick={() => {
          if (!audience.trim()) { toast.warning('Describe your target audience first.'); return; }
          toast.success('Outreach agent is building your sequence — check back in ~2 minutes.');
        }}
        style={{ ...btn.primary, justifyContent: 'center', fontWeight: 700, padding: `${S[3]} ${S[4]}` }}
      >
        📤 Generate sequence with Outreach Agent
      </button>
    </div>
  );
}

/* ─── Center Panel ───────────────────────────────────────── */
function SequencePanel() {
  const [tab, setTab] = useState('active');
  return (
    <div style={{
      flex: 1, minWidth: 0,
      backgroundColor: C.surface, border: `1px solid ${C.border}`,
      borderRadius: R.card, display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}`, padding: `0 ${S[4]}` }}>
        {[['active', 'Active Sequences'], ['build', 'Build New']].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              padding: `${S[3]} ${S[3]}`, fontSize: '13px', fontWeight: 600,
              fontFamily: F.body, cursor: 'pointer', transition: T.color,
              backgroundColor: 'transparent', border: 'none',
              color: tab === id ? C.primary : C.textSecondary,
              borderBottom: `2px solid ${tab === id ? C.primary : 'transparent'}`,
              marginBottom: '-1px', whiteSpace: 'nowrap',
            }}
          >
            {label}
          </button>
        ))}
      </div>
      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: S[4], ...scrollbarStyle }}>
        {tab === 'active' ? (
          SEQUENCES.map((seq) => <SequenceCard key={seq.id} seq={seq} />)
        ) : (
          <BuildNewTab />
        )}
      </div>
    </div>
  );
}

/* ─── Approval Queue Panel ───────────────────────────────── */
function ApprovalQueuePanel() {
  const toast = useToast();
  return (
    <div style={{
      width: '22%', flexShrink: 0,
      backgroundColor: C.surface, border: `1px solid ${C.border}`,
      borderRadius: R.card, display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: `${S[3]} ${S[4]}`, borderBottom: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>
          Needs Approval
        </div>
        <span style={{
          fontFamily: F.mono, fontSize: '11px', fontWeight: 700,
          color: '#EF4444', backgroundColor: 'rgba(239,68,68,0.15)',
          border: `1px solid rgba(239,68,68,0.4)`, borderRadius: R.pill,
          padding: `2px 8px`,
        }}>
          {APPROVALS.length}
        </span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: S[3], display: 'flex', flexDirection: 'column', gap: S[3], ...scrollbarStyle }}>
        {APPROVALS.map((item) => (
          <div key={item.id} style={{
            backgroundColor: C.surface2,
            border: `1px solid ${C.amberDim}`,
            borderRadius: R.md, padding: S[3],
          }}>
            <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary, marginBottom: S[1] }}>
              {item.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginBottom: S[2] }}>
              <span style={{
                fontFamily: F.mono, fontSize: '10px', color: C.textMuted,
                backgroundColor: C.surface3, borderRadius: R.sm,
                padding: `2px 6px`, border: `1px solid ${C.border}`,
              }}>
                {item.contacts} contacts
              </span>
              <span style={{ fontFamily: F.body, fontSize: '11px', color: '#8B5CF6' }}>📤 {item.agent}</span>
            </div>
            {/* Preview */}
            <div style={{
              fontFamily: F.mono, fontSize: '10px', color: C.textMuted,
              backgroundColor: C.surface3, borderRadius: R.sm,
              padding: `${S[2]} ${S[3]}`, marginBottom: S[3],
              whiteSpace: 'pre-line', lineHeight: 1.5,
              maxHeight: '60px', overflow: 'hidden',
            }}>
              {item.preview}
            </div>
            <div style={{ display: 'flex', gap: S[2] }}>
              <button
                onClick={() => toast.success(`${item.name} approved! Sending to ${item.contacts} contacts.`)}
                style={{
                  flex: 1, ...btn.primary, fontSize: '11px',
                  padding: `${S[1]} ${S[2]}`, justifyContent: 'center',
                }}
              >
                Approve
              </button>
              <button
                onClick={() => toast.info(`Opening review for ${item.name}...`)}
                style={{
                  flex: 1, ...btn.secondary, fontSize: '11px',
                  padding: `${S[1]} ${S[2]}`, justifyContent: 'center',
                }}
              >
                Review
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */
export default function Outreach() {
  const toast = useToast();
  const [selectedLeads, setSelectedLeads] = useState([]);

  const toggleLead = (id) => {
    setSelectedLeads((prev) => prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]);
  };

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
            Outreach Command
          </h1>
          <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, marginTop: 4, display: 'flex', alignItems: 'center', gap: S[3] }}>
            <span><span style={{ color: C.primary, fontWeight: 600 }}>82</span> contacts active this week</span>
            <span>·</span>
            <span><span style={{ color: C.amber, fontWeight: 600 }}>3</span> sequences pending approval</span>
            <span>·</span>
            <span><span style={{ color: C.primary, fontWeight: 600 }}>6</span> meetings booked</span>
          </div>
        </div>
        <button
          onClick={() => toast.success('Opening new sequence builder...')}
          style={{ ...btn.primary, fontSize: '13px', fontWeight: 700 }}
        >
          + New Sequence
        </button>
      </div>

      {/* Agent Bar */}
      <div style={{
        backgroundColor: C.surface, border: `1px solid ${C.border}`,
        borderRadius: R.md, padding: `${S[3]} ${S[4]}`,
        display: 'flex', alignItems: 'center', gap: S[3], flexWrap: 'wrap',
      }}>
        <button
          onClick={() => toast.success('Outreach agent activated — building personalized sequences...')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: S[2],
            padding: `${S[2]} ${S[3]}`, fontSize: '12px', fontWeight: 600, fontFamily: F.body,
            borderRadius: R.button, cursor: 'pointer', transition: T.color,
            backgroundColor: `#8B5CF622`, color: '#8B5CF6', border: `1px solid #8B5CF655`,
          }}
        >
          📤 Trigger Outreach Agent
        </button>
        <button
          onClick={() => toast.info('Prospector agent activated — scanning for new leads...')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: S[2],
            padding: `${S[2]} ${S[3]}`, fontSize: '12px', fontWeight: 600, fontFamily: F.body,
            borderRadius: R.button, cursor: 'pointer', transition: T.color,
            backgroundColor: `#F59E0B22`, color: '#F59E0B', border: `1px solid #F59E0B55`,
          }}
        >
          🔍 Trigger Prospector
        </button>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: S[2] }}>
          <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>Overall reply rate:</span>
          <span style={{ fontFamily: F.mono, fontSize: '14px', fontWeight: 700, color: C.primary }}>18.4%</span>
        </div>
      </div>

      {/* Three-panel layout */}
      <div style={{ display: 'flex', gap: S[4], flex: 1, minHeight: '520px' }}>
        <LeadQueuePanel selectedLeads={selectedLeads} onToggleLead={toggleLead} />
        <SequencePanel />
        <ApprovalQueuePanel />
      </div>
    </div>
  );
}
