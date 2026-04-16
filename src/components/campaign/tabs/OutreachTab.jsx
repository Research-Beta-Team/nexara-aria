import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useToast from '../../../hooks/useToast';
import { useAgent } from '../../../hooks/useAgent';
import AgentThinking from '../../agents/AgentThinking';
import { C, F, R, S, T, btn, inputStyle } from '../../../tokens';
import { IconSend } from '../../ui/Icons';
import { prospects } from '../../../data/campaigns';

/* ─── Mock sequence data ───────────────────────────────────── */
const SEQUENCES = [
  {
    id: 'seq-1',
    name: 'MENA Healthcare Donor Cold Outreach',
    status: 'active',
    contacts: 47,
    steps: 7,
    openRate: 42,
    replyRate: 8,
    steps_def: ['Email 1', 'Wait 3d', 'Email 2', 'Wait 5d', 'LinkedIn', 'Wait 7d', 'Email 3'],
  },
  {
    id: 'seq-2',
    name: 'Yemen Emergency — Major Donor Nurture',
    status: 'waiting_approval',
    contacts: 24,
    steps: 5,
    openRate: 0,
    replyRate: 0,
    steps_def: ['Email 1', 'Wait 2d', 'LinkedIn', 'Wait 4d', 'Email 2'],
  },
  {
    id: 'seq-3',
    name: 'ANZ Re-engagement Warm Leads',
    status: 'paused',
    contacts: 31,
    steps: 4,
    openRate: 38,
    replyRate: 5,
    steps_def: ['Email 1', 'Wait 3d', 'Email 2', 'Wait 5d'],
  },
];

const PROSPECTOR_LEADS = [
  { id: 'pl1', initials: 'SR', name: 'Sarah Rahman', company: 'Global Health Partners', icpScore: 94, status: 'ready' },
  { id: 'pl2', initials: 'MK', name: 'Michael Kowalski', company: 'MedRelief Foundation', icpScore: 88, status: 'ready' },
  { id: 'pl3', initials: 'AZ', name: 'Aysha Zamani', company: 'Healthcare Without Borders', icpScore: 85, status: 'ready' },
  { id: 'pl4', initials: 'TN', name: 'Thomas Nguyen', company: 'Asia Pacific Medical Trust', icpScore: 79, status: 'ready' },
  { id: 'pl5', initials: 'JL', name: 'Julia Larson', company: 'Nordic Health Initiative', icpScore: 76, status: 'ready' },
  { id: 'pl6', initials: 'RP', name: 'Ravi Patel', company: 'South Asia Health Fund', icpScore: 72, status: 'ready' },
];

const OVERVIEW_STATS = [
  { label: 'Sequences',  value: '3',    color: C.primary },
  { label: 'Contacts',   value: '102',  color: C.textPrimary },
  { label: 'Open Rate',  value: '42%',  color: C.secondary },
  { label: 'Reply Rate', value: '8%',   color: C.green },
  { label: 'Meetings',   value: '4',    color: C.amber },
];

/* ─── Sub-components ───────────────────────────────────────── */
function AgentActionBar({ outreachAgent, prospectorAgent, onRunOutreach, onRunProspector }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: S[3], flexWrap: 'wrap',
      backgroundColor: C.surface2,
      border: `1px solid ${C.border}`,
      borderRadius: R.md,
      padding: `${S[3]} ${S[4]}`,
    }}>
      <span style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Outreach Agents
      </span>
      <div style={{ width: '1px', height: '20px', backgroundColor: C.border }} />
      <button
        onClick={onRunOutreach}
        disabled={outreachAgent.isActive}
        style={{
          ...btn.primary, fontSize: '12px', padding: `${S[1]} ${S[3]}`,
          opacity: outreachAgent.isActive ? 0.7 : 1,
          cursor: outreachAgent.isActive ? 'wait' : 'pointer',
        }}
      >
        <span>📬</span>
        {outreachAgent.isActive ? 'Outreach Running…' : '▶ Outreach'}
      </button>
      <button
        onClick={onRunProspector}
        disabled={prospectorAgent.isActive}
        style={{
          ...btn.secondary, fontSize: '12px', padding: `${S[1]} ${S[3]}`,
          opacity: prospectorAgent.isActive ? 0.7 : 1,
          cursor: prospectorAgent.isActive ? 'wait' : 'pointer',
        }}
      >
        <span>🔍</span>
        {prospectorAgent.isActive ? 'Prospector Running…' : '▶ Prospector'}
      </button>
      <div style={{ marginLeft: 'auto', fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>
        47 leads in queue
      </div>
    </div>
  );
}

function StatBox({ label, value, color }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: '2px',
      padding: `${S[3]} ${S[4]}`,
      backgroundColor: C.surface2, border: `1px solid ${C.border}`, borderRadius: R.md,
      flex: 1, minWidth: '80px',
    }}>
      <span style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{label}</span>
      <span style={{ fontFamily: F.mono, fontSize: '20px', fontWeight: 700, color: color ?? C.textPrimary, lineHeight: 1 }}>{value}</span>
    </div>
  );
}

function StepVisualizer({ steps }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flexWrap: 'wrap' }}>
      {steps.map((step, i) => {
        const isWait = step.startsWith('Wait');
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <span style={{
              fontFamily: F.mono, fontSize: '9px', fontWeight: isWait ? 400 : 700,
              color: isWait ? C.textMuted : C.secondary,
              backgroundColor: isWait ? 'transparent' : 'rgba(107,163,150,0.12)',
              border: isWait ? 'none' : `1px solid rgba(107,163,150,0.3)`,
              borderRadius: R.sm,
              padding: isWait ? '0 2px' : '1px 5px',
              whiteSpace: 'nowrap',
            }}>
              {step}
            </span>
            {i < steps.length - 1 && !isWait && !steps[i + 1]?.startsWith('Wait') && (
              <span style={{ color: C.border, fontSize: '9px' }}>→</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SequenceCard({ seq, toast }) {
  const [expanded, setExpanded] = useState(false);
  const statusColor = seq.status === 'active' ? C.green : seq.status === 'waiting_approval' ? C.amber : C.textMuted;
  const statusLabel = seq.status === 'active' ? 'Active' : seq.status === 'waiting_approval' ? 'Waiting Approval' : 'Paused';

  return (
    <div style={{
      backgroundColor: C.surface2,
      border: `1px solid ${seq.status === 'waiting_approval' ? 'rgba(251,191,36,0.4)' : C.border}`,
      borderRadius: R.card,
      overflow: 'hidden',
    }}>
      {/* Approval banner */}
      {seq.status === 'waiting_approval' && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: `${S[2]} ${S[4]}`,
          backgroundColor: 'rgba(251,191,36,0.1)',
          borderBottom: `1px solid rgba(251,191,36,0.25)`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
            <span style={{ fontSize: '12px' }}>⏳</span>
            <span style={{ fontFamily: F.body, fontSize: '12px', color: C.amber, fontWeight: 600 }}>
              Awaiting your approval to send
            </span>
          </div>
          <button
            onClick={() => toast.success(`"${seq.name}" approved — Outreach agent will begin sending`)}
            style={{ ...btn.primary, fontSize: '12px', padding: `${S[1]} ${S[3]}` }}
          >
            Approve to Send ✓
          </button>
        </div>
      )}

      <div style={{ padding: S[4] }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: S[3], marginBottom: S[3] }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: F.body, fontSize: '14px', fontWeight: 700, color: C.textPrimary, marginBottom: '4px' }}>
              {seq.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: statusColor }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: statusColor, display: 'inline-block', boxShadow: seq.status === 'active' ? `0 0 5px ${statusColor}` : 'none' }} />
                {statusLabel}
              </span>
              <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>{seq.contacts} contacts · {seq.steps} steps</span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        {seq.status !== 'waiting_approval' && (
          <div style={{ display: 'flex', gap: S[3], marginBottom: S[3] }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted }}>Open Rate</span>
              <span style={{ fontFamily: F.mono, fontSize: '14px', fontWeight: 700, color: C.primary }}>{seq.openRate}%</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted }}>Reply Rate</span>
              <span style={{ fontFamily: F.mono, fontSize: '14px', fontWeight: 700, color: C.secondary }}>{seq.replyRate}%</span>
            </div>
          </div>
        )}

        {/* Step visualizer */}
        <div style={{ marginBottom: S[3] }}>
          <StepVisualizer steps={seq.steps_def} />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap' }}>
          <button onClick={() => toast.info(`Viewing contacts for "${seq.name}"`)} style={{ ...btn.secondary, fontSize: '11px', padding: `${S[1]} ${S[3]}` }}>
            View Contacts
          </button>
          {seq.status === 'active' && (
            <button onClick={() => toast.warning(`"${seq.name}" paused`)} style={{ ...btn.ghost, fontSize: '11px', padding: `${S[1]} ${S[3]}`, color: C.amber }}>
              Pause
            </button>
          )}
          {seq.status === 'paused' && (
            <button onClick={() => toast.success(`"${seq.name}" resumed`)} style={{ ...btn.primary, fontSize: '11px', padding: `${S[1]} ${S[3]}` }}>
              Resume
            </button>
          )}
          <button onClick={() => toast.info(`Editing sequence "${seq.name}"`)} style={{ ...btn.ghost, fontSize: '11px', padding: `${S[1]} ${S[3]}` }}>
            Edit Sequence
          </button>
        </div>
      </div>
    </div>
  );
}

function LeadQueuePanel({ toast }) {
  const [assigned, setAssigned] = useState({});

  return (
    <div style={{
      backgroundColor: C.surface2,
      border: `1px solid ${C.border}`,
      borderRadius: R.card,
      overflow: 'hidden',
      position: 'sticky',
      top: S[4],
    }}>
      <div style={{ padding: `${S[3]} ${S[4]}`, borderBottom: `1px solid ${C.border}`, backgroundColor: 'rgba(74,124,111,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[2] }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
            <span style={{ fontSize: '14px' }}>🔍</span>
            <span style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>
              Prospector found {PROSPECTOR_LEADS.length} new leads
            </span>
          </div>
        </div>
        <button
          onClick={() => toast.success('All leads approved for outreach — assigned to MENA sequence')}
          style={{ ...btn.primary, fontSize: '11px', padding: `${S[1]} ${S[4]}`, width: '100%', justifyContent: 'center' }}
        >
          Approve all for outreach ✓
        </button>
      </div>

      {/* Lead list */}
      <div style={{ maxHeight: '400px', overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: `${C.border} transparent` }}>
        {PROSPECTOR_LEADS.map((lead, i) => {
          const scoreColor = lead.icpScore >= 90 ? C.green : lead.icpScore >= 80 ? C.primary : lead.icpScore >= 70 ? C.amber : C.red;
          const isAssigned = assigned[lead.id];
          return (
            <div key={lead.id} style={{
              display: 'flex', alignItems: 'center', gap: S[3],
              padding: `${S[3]} ${S[4]}`,
              borderBottom: i < PROSPECTOR_LEADS.length - 1 ? `1px solid ${C.border}` : 'none',
            }}>
              {/* Initials avatar */}
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                backgroundColor: 'rgba(74,124,111,0.2)', border: `1px solid rgba(74,124,111,0.4)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: C.primary,
                flexShrink: 0,
              }}>
                {lead.initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {lead.name}
                </div>
                <div style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {lead.company}
                </div>
                {/* ICP score bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: S[1], marginTop: '3px' }}>
                  <div style={{ flex: 1, height: '3px', borderRadius: R.pill, backgroundColor: C.surface3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${lead.icpScore}%`, backgroundColor: scoreColor, borderRadius: R.pill }} />
                  </div>
                  <span style={{ fontFamily: F.mono, fontSize: '9px', fontWeight: 700, color: scoreColor }}>{lead.icpScore}</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px', flexShrink: 0 }}>
                {isAssigned ? (
                  <span style={{ fontFamily: F.mono, fontSize: '9px', fontWeight: 700, color: C.green, backgroundColor: 'rgba(16,185,129,0.12)', borderRadius: R.pill, padding: '1px 6px' }}>
                    ✓ Assigned
                  </span>
                ) : (
                  <span style={{ fontFamily: F.mono, fontSize: '9px', color: C.primary, backgroundColor: 'rgba(74,124,111,0.1)', borderRadius: R.pill, padding: '1px 6px' }}>
                    Ready
                  </span>
                )}
                <button
                  onClick={() => { setAssigned(a => ({ ...a, [lead.id]: true })); toast.success(`${lead.name} assigned to MENA sequence`); }}
                  style={{ ...btn.ghost, fontSize: '9px', padding: '1px 5px', color: isAssigned ? C.textMuted : C.secondary }}
                >
                  {isAssigned ? 'Assigned' : 'Assign →'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OutreachGeneratorStrip({ outreachAgent, toast }) {
  const { id } = useParams();
  const [icp, setIcp] = useState('MENA Healthcare Donors');
  const [channel, setChannel] = useState('Multi-channel');
  const CHANNELS = ['Email', 'LinkedIn', 'Multi-channel'];

  return (
    <div style={{
      backgroundColor: C.surface2,
      border: `1px solid ${C.border}`,
      borderRadius: R.card,
      padding: S[4],
    }}>
      <div style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary, marginBottom: S[3] }}>
        Generate new sequence for this campaign
      </div>
      <div style={{ display: 'flex', gap: S[3], flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: 1, minWidth: '180px' }}>
          <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, marginBottom: S[1] }}>ICP / Segment</div>
          <input
            type="text"
            value={icp}
            onChange={e => setIcp(e.target.value)}
            placeholder="ICP or audience segment"
            style={{ ...inputStyle, fontSize: '12px' }}
          />
        </div>
        <div>
          <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, marginBottom: S[1] }}>Channel</div>
          <div style={{ display: 'flex', gap: S[1] }}>
            {CHANNELS.map(c => (
              <button
                key={c}
                onClick={() => setChannel(c)}
                style={{
                  fontFamily: F.body, fontSize: '11px',
                  color: channel === c ? C.textInverse : C.textSecondary,
                  backgroundColor: channel === c ? C.primary : C.surface3,
                  border: `1px solid ${channel === c ? C.primary : C.border}`,
                  borderRadius: R.button,
                  padding: `${S[1]} ${S[2]}`,
                  cursor: 'pointer',
                  transition: T.color,
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => {
            if (!icp.trim()) { toast.warning('Select an ICP before generating'); return; }
            toast.info(`Outreach agent generating ${channel} sequence for "${icp}"…`);
          }}
          disabled={outreachAgent.isActive}
          style={{
            ...btn.primary, fontSize: '12px', padding: `${S[2]} ${S[4]}`,
            opacity: outreachAgent.isActive ? 0.7 : 1,
            cursor: outreachAgent.isActive ? 'wait' : 'pointer',
          }}
        >
          {outreachAgent.isActive ? 'Running…' : <><IconSend width={12} height={12} color="currentColor" style={{ marginRight: 5, verticalAlign: 'middle' }} /> Run Outreach Agent</>}
        </button>
      </div>
    </div>
  );
}

/* ─── Main component ────────────────────────────────────────── */
export default function OutreachTab() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const outreachAgent = useAgent('outreach');
  const prospectorAgent = useAgent('prospector');

  const handleRunOutreach = async () => {
    toast.info('Outreach agent generating sequences…');
    await outreachAgent.activate('Generate email outreach sequence with email-sequence skill', {
      campaignId: id,
      prospectCount: prospects.length,
    });
    toast.success('New sequence generated — pending approval');
  };

  const handleRunProspector = async () => {
    toast.info('Prospector agent finding new leads…');
    await prospectorAgent.activate('Find new prospects with customer-research skill', {
      campaignId: id,
      target: 'MENA Healthcare Donors',
    });
    toast.success('Prospector found 23 new leads matching ICP');
  };

  return (
    <div style={{ padding: S[5], display: 'flex', flexDirection: 'column', gap: S[4] }}>

      {/* Agent Action Bar */}
      <AgentActionBar
        outreachAgent={outreachAgent}
        prospectorAgent={prospectorAgent}
        onRunOutreach={handleRunOutreach}
        onRunProspector={handleRunProspector}
      />

      {/* Agent thinking */}
      {outreachAgent.isActive && <AgentThinking agentId="outreach" task="Generating email outreach sequence with cold-email and email-sequence skills…" />}
      {prospectorAgent.isActive && <AgentThinking agentId="prospector" task="Finding new leads matching MENA Healthcare Donor ICP…" />}

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: S[3], flexWrap: 'wrap' }}>
        {OVERVIEW_STATS.map(stat => (
          <StatBox key={stat.label} label={stat.label} value={stat.value} color={stat.color} />
        ))}
      </div>

      {/* Two-column: Sequences | Lead Queue */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: S[5], alignItems: 'start' }}>

        {/* Sequence List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary }}>Active Sequences</span>
            <button onClick={() => toast.info('Creating new sequence...')} style={{ ...btn.secondary, fontSize: '12px', padding: `${S[1]} ${S[3]}` }}>
              + New Sequence
            </button>
          </div>
          {SEQUENCES.map(seq => (
            <SequenceCard key={seq.id} seq={seq} toast={toast} />
          ))}
        </div>

        {/* Lead Queue */}
        <LeadQueuePanel toast={toast} />
      </div>

      {/* Prospect table (existing data) */}
      <div style={{
        backgroundColor: C.surface2,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
        overflow: 'hidden',
      }}>
        <div style={{ padding: `${S[3]} ${S[4]}`, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>All Prospects</span>
          <button onClick={() => toast.info('Exporting prospect list')} style={{ ...btn.ghost, fontSize: '12px', color: C.textMuted }}>Export CSV</button>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '40px 1fr 80px 100px 80px 80px 40px',
          gap: S[3], padding: `${S[2]} ${S[4]}`,
          borderBottom: `1px solid ${C.border}`,
          backgroundColor: C.surface3,
        }}>
          {['ICP', 'Prospect', 'Intent', 'Sequence', 'Last Touch', 'Replied', ''].map((h) => (
            <span key={h} style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
          ))}
        </div>
        {prospects.map((p, i) => {
          const scoreColor = p.icpScore >= 90 ? C.primary : p.icpScore >= 75 ? C.amber : C.red;
          const intentBg = p.intent === 'high' ? 'rgba(16,185,129,0.12)' : p.intent === 'medium' ? 'rgba(251,191,36,0.12)' : C.surface3;
          const intentColor = p.intent === 'high' ? C.green : p.intent === 'medium' ? C.amber : C.textMuted;
          return (
            <div
              key={p.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '40px 1fr 80px 100px 80px 80px 40px',
                gap: S[3], padding: `${S[3]} ${S[4]}`,
                alignItems: 'center',
                borderBottom: i < prospects.length - 1 ? `1px solid ${C.border}` : 'none',
                cursor: 'pointer',
                transition: T.color,
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = C.surface3}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              onClick={() => navigate(`/campaigns/${id}/prospect/${p.id}`)}
            >
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                border: `2px solid ${scoreColor}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: `${scoreColor}18`,
              }}>
                <span style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: scoreColor }}>{p.icpScore}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', overflow: 'hidden' }}>
                <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
                <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title} · {p.company}</span>
              </div>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                backgroundColor: intentBg, color: intentColor,
                border: `1px solid ${intentBg}`,
                borderRadius: R.pill, padding: '2px 8px',
                fontFamily: F.mono, fontSize: '10px', fontWeight: 700,
              }}>{p.intent}</span>
              <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <div key={idx} style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    backgroundColor: idx < p.sequenceStep ? C.primary : C.surface3,
                    border: `1px solid ${idx < p.sequenceStep ? C.primary : C.border}`,
                  }} />
                ))}
              </div>
              <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>{p.lastTouch}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: S[1] }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: p.replied ? C.primary : C.surface3, border: `1px solid ${p.replied ? C.primary : C.border}`, boxShadow: p.replied ? `0 0 4px ${C.primary}` : 'none' }} />
                <span style={{ fontFamily: F.mono, fontSize: '11px', color: p.replied ? C.primary : C.textMuted }}>{p.replied ? 'Yes' : 'No'}</span>
              </div>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: C.textMuted }}>
                <path d="M4 7h6M7 4l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          );
        })}
      </div>

      {/* Generator strip */}
      <OutreachGeneratorStrip outreachAgent={outreachAgent} toast={toast} />
    </div>
  );
}
