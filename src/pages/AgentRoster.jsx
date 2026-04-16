import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { C, F, R, S, T, badge, shadows, scrollbarStyle } from '../tokens';
import useToast from '../hooks/useToast';
import useStore from '../store/useStore';
import { AGENTS } from '../agents/AgentRegistry';
import { AgentRuntime } from '../agents/AgentRuntime';
import AgentRoleIcon from '../components/ui/AgentRoleIcon';
import { IconCard, IconCheck, IconCircleFilled, IconEye, IconSettings, IconThumbsUp, IconZap } from '../components/ui/Icons';

/* ─── Rich live data for each agent ──────────────────────── */
const AGENT_LIVE = {
  freya: {
    currentTask: 'Orchestrating Q2 Campaign Launch workflow — delegating to Copywriter + Analyst',
    lastOutput: 'Delegated 3 tasks to Copywriter + Analyst. ETA 12 min. Workflow 40% complete.',
    tasks: 34, approvalRate: '—', avgTime: '1.2m', escalations: 2,
    status: 'executing',
  },
  strategist: {
    currentTask: 'Analyzing MENA competitor positioning — IRC, MSF, and Gulf Health Foundation',
    lastOutput: 'Q2 Donor Strategy Brief (2,400w) — approved. Positioning: "We operate where others can\'t."',
    tasks: 24, approvalRate: '96%', avgTime: '4.2m', escalations: 1,
    status: 'executing',
  },
  copywriter: {
    currentTask: 'Drafting email variant 4 for Q2 Donor Acquisition — personalised subject line testing',
    lastOutput: 'Yemen Campaign LinkedIn post (approved). CTR prediction: 4.8% vs 3.2% baseline.',
    tasks: 31, approvalRate: '94%', avgTime: '3.1m', escalations: 0,
    status: 'executing',
  },
  analyst: {
    currentTask: 'Processing 30-day Meta Ads data — detecting CTR trend anomalies across campaigns',
    lastOutput: 'ANZ CTR anomaly report: 23% drop, frequency 4.2×. Recommendation: rotate creatives.',
    tasks: 28, approvalRate: '97%', avgTime: '2.8m', escalations: 1,
    status: 'idle',
  },
  prospector: {
    currentTask: 'Enriching 47 new MENA leads from LinkedIn scrape — matching to healthcare ICP',
    lastOutput: '47 leads scored + ICP matched. Top: Layla Al-Rashidi, score 94/100.',
    tasks: 19, approvalRate: '91%', avgTime: '5.2m', escalations: 0,
    status: 'idle',
  },
  optimizer: {
    currentTask: 'A/B test: donation CTA button copy (n=1,240, day 3 of 7)',
    lastOutput: 'Form abandonment analysis: 64% drop-off at field 4. 3-step form recommended.',
    tasks: 22, approvalRate: '93%', avgTime: '3.4m', escalations: 0,
    status: 'executing',
  },
  outreach: {
    currentTask: 'Scheduling 12 APAC follow-up sequences — send window 9:00–11:00 AM local',
    lastOutput: 'MENA Donor sequence (5 emails) delivered. Open rate 48.2% vs 24% benchmark.',
    tasks: 26, approvalRate: '95%', avgTime: '2.9m', escalations: 0,
    status: 'idle',
  },
  revenue: {
    currentTask: 'Updating Q2 forecast model with 6 new pipeline entries from Prospector',
    lastOutput: 'Pipeline forecast: $2.1M (+$300k). 2 at-risk accounts flagged for churn prevention.',
    tasks: 18, approvalRate: '98%', avgTime: '4.8m', escalations: 0,
    status: 'idle',
  },
  guardian: {
    currentTask: 'Reviewing 3 Yemen ad creatives — checking claims language + crisis imagery policy',
    lastOutput: '8 pieces reviewed, 2 flagged: unverified claim + Sudan imagery (editorial review req).',
    tasks: 12, approvalRate: '100%', avgTime: '6.1m', escalations: 1,
    status: 'idle',
  },
};

/* ─── Team aggregates ─────────────────────────────────────── */
const TEAM_STATS = [
  { label: 'Total Tasks Today', value: '214', color: C.textPrimary, Icon: IconCheck },
  { label: 'Approval Rate', value: '95.4%', color: C.green, Icon: IconThumbsUp },
  { label: 'Avg Task Time', value: '3.4m', color: C.primary, Icon: IconZap },
  { label: 'Agent Uptime', value: '99.2%', color: C.green, Icon: IconCircleFilled },
  { label: 'Credits Today', value: '4,140 / 10,860 left', color: C.amber, Icon: IconCard },
];

/* ─── Helpers ──────────────────────────────────────────────── */
function statusColor(status) {
  if (status === 'thinking')  return C.amber;
  if (status === 'executing') return C.primary;
  if (status === 'done')      return C.green;
  if (status === 'error')     return C.red;
  return C.textMuted;
}

function statusLabel(status) {
  if (status === 'thinking')  return 'Thinking';
  if (status === 'executing') return 'Active';
  if (status === 'done')      return 'Done';
  if (status === 'error')     return 'Error';
  return 'Idle';
}

/* ─── Freya Command Card (full width) ─────────────────────── */
function FreyaCard({ agent, liveData, agentStatuses, onNavigate, onTrigger }) {
  const navigate = useNavigate();
  const toast    = useToast();
  const [askInput, setAskInput] = useState('');
  const isActive = liveData?.status === 'executing' || liveData?.status === 'thinking';
  const dotC = statusColor(liveData?.status || 'idle');

  const specialists = Object.values(AGENTS).filter((a) => a.role !== 'orchestrator');

  const handleAsk = () => {
    if (!askInput.trim()) { toast.warning('Enter a message for Freya'); return; }
    toast.info(`Freya: "${askInput.slice(0, 60)}…"`);
    setAskInput('');
  };

  return (
    <div style={{
      backgroundColor: C.surface, border: `1px solid ${isActive ? C.primary : C.border}`,
      borderRadius: R.card, overflow: 'hidden', marginBottom: S[5],
      boxShadow: isActive ? `0 0 24px rgba(74,124,111,0.15)` : 'none',
    }}>
      {/* Top accent */}
      <div style={{ height: '3px', background: `linear-gradient(90deg, ${C.primary}, ${C.secondary})` }} />

      <div style={{ padding: S[5] }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[5], alignItems: 'start' }}>

          {/* Left: identity + task */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: S[3], marginBottom: S[3] }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  backgroundColor: 'rgba(74,124,111,0.2)', border: `2px solid ${dotC}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  lineHeight: 0,
                  animation: isActive ? 'agentPulseRing 2s ease-in-out infinite' : 'none',
                }}>
                  <AgentRoleIcon agentId={agent.id} size={28} color={agent.color} />
                </div>
                <span style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: '12px', height: '12px', borderRadius: '50%',
                  backgroundColor: dotC, border: `2px solid ${C.surface}`,
                  boxShadow: isActive ? `0 0 8px ${dotC}` : 'none',
                  animation: isActive ? 'agentDotAnim 1.8s ease-in-out infinite' : 'none',
                }} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginBottom: '3px' }}>
                  <span style={{ fontFamily: F.display, fontSize: '18px', fontWeight: 800, color: C.textPrimary }}>
                    {agent.displayName}
                  </span>
                  <span style={{
                    fontFamily: F.mono, fontSize: '9px', fontWeight: 700,
                    color: C.primary, textTransform: 'uppercase', letterSpacing: '0.06em',
                    backgroundColor: 'rgba(74,124,111,0.12)', border: `1px solid rgba(74,124,111,0.3)`,
                    borderRadius: R.pill, padding: '1px 7px',
                  }}>Orchestrator</span>
                  <span style={{
                    fontFamily: F.mono, fontSize: '9px', fontWeight: 700,
                    color: dotC, textTransform: 'uppercase', letterSpacing: '0.04em',
                  }}>{statusLabel(liveData?.status)}</span>
                </div>
                <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>
                  Routes tasks · Resolves conflicts · Maintains global state
                </div>
              </div>
            </div>

            {/* Current task */}
            <div style={{
              fontFamily: F.body, fontSize: '12px', color: isActive ? C.amber : C.textSecondary,
              backgroundColor: isActive ? 'rgba(251,191,36,0.07)' : 'rgba(0,0,0,0.15)',
              border: `1px solid ${isActive ? 'rgba(251,191,36,0.18)' : 'rgba(74,124,111,0.1)'}`,
              borderRadius: R.sm, padding: `${S[2]} ${S[3]}`, lineHeight: 1.5, marginBottom: S[3],
            }}>
              {isActive && <span style={{ fontSize: '8px', marginRight: '5px' }}>●</span>}
              {liveData?.currentTask}
            </div>

            <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary, lineHeight: 1.45, marginBottom: S[3] }}>
              <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, fontWeight: 600 }}>LAST: </span>
              {liveData?.lastOutput}
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: S[4], paddingTop: S[2], borderTop: `1px solid rgba(74,124,111,0.1)`, marginBottom: S[3] }}>
              {[
                { label: 'Tasks', value: liveData?.tasks },
                { label: 'Skills', value: agent.skills.length },
                { label: 'Avg time', value: liveData?.avgTime },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div style={{ fontFamily: F.mono, fontSize: '16px', fontWeight: 700, color: C.textPrimary, lineHeight: 1 }}>{value}</div>
                  <div style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted, marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: S[2] }}>
              <button
                onClick={() => {
                  AgentRuntime.activateAgent(agent.id, { description: 'Manual orchestration' }, {})
                    .then(() => toast.success('Freya completed orchestration'))
                    .catch(() => toast.error('Freya encountered an error'));
                  toast.info('Activating Freya orchestration...');
                }}
                style={{
                  fontFamily: F.body, fontSize: '12px', fontWeight: 600,
                  color: C.textInverse, backgroundColor: C.primary,
                  border: 'none', borderRadius: R.button, padding: `${S[1]} ${S[4]}`,
                  cursor: 'pointer',
                }}
              >
                ▶ Trigger
              </button>
              <button
                onClick={() => navigate(`/agents/${agent.id}`)}
                style={{
                  fontFamily: F.body, fontSize: '12px', fontWeight: 600,
                  color: C.textSecondary, backgroundColor: C.surface3,
                  border: `1px solid ${C.border}`, borderRadius: R.button, padding: `${S[1]} ${S[3]}`,
                  cursor: 'pointer',
                }}
              >
                <IconEye color={C.primary} width={14} height={14} />
                View Outputs
              </button>
              <button
                onClick={() => navigate('/settings/aria')}
                style={{
                  fontFamily: F.body, fontSize: '12px', fontWeight: 600,
                  color: C.textSecondary, backgroundColor: C.surface3,
                  border: `1px solid ${C.border}`, borderRadius: R.button, padding: `${S[1]} ${S[3]}`,
                  cursor: 'pointer',
                }}
              >
                <IconSettings color={C.textSecondary} w={14} />
                Configure
              </button>
            </div>
          </div>

          {/* Right: agent statuses + Ask input */}
          <div>
            {/* Specialist status dots */}
            <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>
              Specialist Fleet
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: S[2], marginBottom: S[4] }}>
              {specialists.map((sp) => {
                const ld = AGENT_LIVE[sp.id];
                const spStatus = ld?.status || 'idle';
                const spDotC = statusColor(spStatus);
                const spActive = spStatus === 'executing' || spStatus === 'thinking';
                return (
                  <div
                    key={sp.id}
                    onClick={() => navigate(`/agents/${sp.id}`)}
                    style={{
                      backgroundColor: spActive ? 'rgba(74,124,111,0.08)' : C.surface2,
                      border: `1px solid ${spActive ? 'rgba(74,124,111,0.3)' : C.border}`,
                      borderRadius: R.md, padding: `${S[2]} ${S[1]}`,
                      textAlign: 'center', cursor: 'pointer',
                    }}
                  >
                    <div style={{ marginBottom: '3px', display: 'flex', justifyContent: 'center' }}>
                      <AgentRoleIcon agentId={sp.id} size={20} color={sp.color} />
                    </div>
                    <div style={{ fontFamily: F.body, fontSize: '9px', color: C.textSecondary, marginBottom: '3px', fontWeight: 600 }}>
                      {sp.displayName.split(' ')[0]}
                    </div>
                    <div style={{
                      width: '6px', height: '6px', borderRadius: '50%',
                      backgroundColor: spDotC, margin: '0 auto',
                      boxShadow: spActive ? `0 0 5px ${spDotC}` : 'none',
                      animation: spActive ? 'agentDotAnim 1.8s ease-in-out infinite' : 'none',
                    }} />
                  </div>
                );
              })}
            </div>

            {/* Ask Freya mini input */}
            <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>
              Ask Freya
            </div>
            <div style={{ display: 'flex', gap: S[2] }}>
              <input
                type="text"
                value={askInput}
                onChange={(e) => setAskInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                placeholder="e.g. Run performance review for Q2..."
                style={{
                  flex: 1, backgroundColor: C.surface2, color: C.textPrimary,
                  border: `1px solid ${C.border}`, borderRadius: R.input,
                  padding: `${S[2]} ${S[3]}`, fontFamily: F.body, fontSize: '12px',
                  outline: 'none',
                }}
              />
              <button
                onClick={handleAsk}
                style={{
                  fontFamily: F.body, fontSize: '12px', fontWeight: 600,
                  color: C.textInverse, backgroundColor: C.primary,
                  border: 'none', borderRadius: R.button, padding: `${S[2]} ${S[3]}`,
                  cursor: 'pointer', flexShrink: 0,
                }}
              >
                Send
              </button>
            </div>

            {/* Active workflow visualization */}
            {isActive && (
              <div style={{ marginTop: S[3], padding: S[2], backgroundColor: 'rgba(74,124,111,0.08)', border: `1px solid rgba(74,124,111,0.2)`, borderRadius: R.sm }}>
                <div style={{ fontFamily: F.mono, fontSize: '9px', color: C.primary, fontWeight: 700, marginBottom: '4px' }}>
                  ACTIVE WORKFLOW
                </div>
                <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary }}>
                  Q2 Campaign Launch: Strategist ✓ → Copywriter ● → Guardian ○ → Outreach ○
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Specialist Agent Card ───────────────────────────────── */
function AgentCard({ agent, liveData, statusObj, onNavigate }) {
  const navigate = useNavigate();
  const toast    = useToast();
  const [hovered, setHovered] = useState(false);

  const resolvedStatus = liveData?.status || statusObj?.status || 'idle';
  const isActive = resolvedStatus === 'executing' || resolvedStatus === 'thinking';
  const dotC = statusColor(resolvedStatus);

  const SKILL_DISPLAY = 3;
  const extraSkills = agent.skills.length - SKILL_DISPLAY;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: C.surface,
        border: `1px solid ${hovered ? C.borderHover : isActive ? C.primary : C.border}`,
        borderRadius: R.card, overflow: 'hidden',
        transition: T.base,
        boxShadow: hovered ? shadows.cardHover : isActive ? `0 0 18px rgba(74,124,111,0.15)` : 'none',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Accent bar */}
      <div style={{
        height: '2px',
        backgroundColor: isActive ? C.primary : C.surface3,
        boxShadow: isActive ? `0 0 8px ${C.primary}` : 'none',
        flexShrink: 0,
      }} />

      <div style={{ padding: S[4], flex: 1, display: 'flex', flexDirection: 'column', gap: S[3] }}>

        {/* Header: avatar + name + status */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: S[3] }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              backgroundColor: isActive ? 'rgba(74,124,111,0.18)' : C.surface2,
              border: `2px solid ${dotC}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              lineHeight: 0,
            }}>
              <AgentRoleIcon agentId={agent.id} size={24} color={agent.color} />
            </div>
            <span style={{
              position: 'absolute', bottom: 0, right: 0,
              width: '10px', height: '10px', borderRadius: '50%',
              backgroundColor: dotC, border: `2px solid ${C.surface}`,
              boxShadow: isActive ? `0 0 6px ${dotC}` : 'none',
              animation: isActive ? 'agentDotAnim 1.8s ease-in-out infinite' : 'none',
            }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginBottom: '3px', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>
                {agent.displayName}
              </span>
              <span style={{
                fontFamily: F.mono, fontSize: '9px', fontWeight: 700,
                color: dotC, letterSpacing: '0.05em', textTransform: 'uppercase',
              }}>
                {statusLabel(resolvedStatus)}
              </span>
            </div>
            <span style={{
              fontFamily: F.mono, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.06em',
              color: C.textMuted, fontWeight: 600,
              backgroundColor: C.surface3, border: `1px solid ${C.border}`,
              borderRadius: R.pill, padding: '1px 6px',
            }}>
              Specialist
            </span>
          </div>
        </div>

        {/* Currently doing */}
        {liveData?.currentTask && (
          <div>
            <div style={{ fontFamily: F.body, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
              Currently
            </div>
            <div style={{
              fontFamily: F.body, fontSize: '11px',
              color: isActive ? C.amber : C.textSecondary,
              backgroundColor: isActive ? 'rgba(251,191,36,0.07)' : 'rgba(0,0,0,0.15)',
              border: `1px solid ${isActive ? 'rgba(251,191,36,0.18)' : 'rgba(74,124,111,0.1)'}`,
              borderRadius: R.sm, padding: `${S[1]} ${S[3]}`,
              lineHeight: 1.4,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {isActive && <span style={{ fontSize: '8px', marginRight: '4px' }}>●</span>}
              {liveData.currentTask}
            </div>
          </div>
        )}

        {/* Last output */}
        {liveData?.lastOutput && (
          <div>
            <div style={{ fontFamily: F.body, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
              Last Output
            </div>
            <p style={{
              fontFamily: F.body, fontSize: '11px', color: C.textSecondary,
              lineHeight: 1.45, margin: 0,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {liveData.lastOutput}
            </p>
          </div>
        )}

        {/* Stats row */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: S[1], padding: `${S[2]} 0`,
          borderTop: `1px solid rgba(74,124,111,0.1)`,
        }}>
          {[
            { label: 'Tasks', value: liveData?.tasks },
            { label: 'Approval', value: liveData?.approvalRate },
            { label: 'Avg', value: liveData?.avgTime },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 700, color: C.textPrimary, lineHeight: 1 }}>{value}</div>
              <div style={{ fontFamily: F.body, fontSize: '9px', color: C.textMuted, marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[1] }}>
            {agent.skills.slice(0, SKILL_DISPLAY).map((sk) => (
              <span key={sk} style={{ ...badge.base, ...badge.muted, fontSize: '9px' }}>{sk}</span>
            ))}
            {extraSkills > 0 && (
              <span style={{ ...badge.base, ...badge.muted, fontSize: '9px', color: C.textMuted }}>+{extraSkills}</span>
            )}
          </div>
        </div>
      </div>

      {/* Footer buttons */}
      <div style={{
        borderTop: `1px solid ${C.border}`, padding: `${S[2]} ${S[3]}`,
        display: 'flex', gap: S[1], backgroundColor: C.surface2,
      }}>
        <button
          onClick={() => navigate(`/agents/${agent.id}`)}
          style={{
            flex: 1, padding: `${S[1]} 0`, fontFamily: F.body, fontSize: '11px', fontWeight: 600,
            color: hovered ? C.primary : C.textSecondary,
            backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
            transition: T.color, textAlign: 'left',
          }}
        >
          ▶ Trigger
        </button>
        <button
          onClick={() => navigate(`/agents/${agent.id}`)}
          style={{
            padding: `${S[1]} ${S[2]}`, fontFamily: F.body, fontSize: '11px', fontWeight: 600,
            color: C.textSecondary, backgroundColor: C.surface3,
            border: `1px solid ${C.border}`, borderRadius: R.button,
            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}
          title="View"
        >
          <IconEye color={C.textSecondary} width={16} height={16} />
        </button>
        <button
          onClick={() => toast.info(`Configure ${agent.displayName} autonomy + notifications`)}
          style={{
            padding: `${S[1]} ${S[2]}`, fontFamily: F.body, fontSize: '11px', fontWeight: 600,
            color: C.textSecondary, backgroundColor: C.surface3,
            border: `1px solid ${C.border}`, borderRadius: R.button,
            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}
          title="Configure"
        >
          <IconSettings color={C.textSecondary} w={16} />
        </button>
        <button
          onClick={() => {
            if (isActive) {
              AgentRuntime.cancelAgent(agent.id);
              toast.info(`${agent.displayName} cancelled`);
            } else {
              AgentRuntime.activateAgent(agent.id, { description: 'Manual activation' }, {})
                .then(() => toast.success(`${agent.displayName} completed`))
                .catch(() => toast.error(`${agent.displayName} error`));
              toast.info(`Activating ${agent.displayName}...`);
            }
          }}
          style={{
            padding: `${S[1]} ${S[2]}`, fontFamily: F.body, fontSize: '11px', fontWeight: 600,
            color: isActive ? C.amber : C.primary,
            backgroundColor: isActive ? 'rgba(251,191,36,0.1)' : 'rgba(74,124,111,0.12)',
            border: `1px solid ${isActive ? 'rgba(251,191,36,0.2)' : 'rgba(74,124,111,0.3)'}`,
            borderRadius: R.button, cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {isActive ? '●' : '▶'}
        </button>
      </div>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────── */
export default function AgentRoster() {
  const navigate  = useNavigate();
  const toast     = useToast();

  const agentStatuses = useStore((s) => s.agents.statuses);
  const allAgents     = Object.values(AGENTS);

  const freyaAgent      = AGENTS['freya'];
  const freyaLive       = AGENT_LIVE['freya'];
  const specialistAgents = allAgents.filter((a) => a.role !== 'orchestrator');

  const activeCount     = allAgents.filter((a) => {
    const ld = AGENT_LIVE[a.id];
    return ld?.status === 'executing' || ld?.status === 'thinking';
  }).length;

  const [commandMode, setCommandMode] = useState(false);

  return (
    <div style={{ padding: `${S[6]} ${S[6]} ${S[8]}`, minHeight: '100vh', backgroundColor: C.bg, animation: 'fadeIn 0.3s ease' }}>

      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: S[5], flexWrap: 'wrap', gap: S[3] }}>
        <div>
          <h1 style={{ fontFamily: F.display, fontSize: '28px', fontWeight: 800, color: C.textPrimary, margin: 0, letterSpacing: '-0.03em' }}>
            AI Team
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: S[3], marginTop: S[2] }}>
            <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
              {allAgents.length} agents
            </span>
            <span style={{ color: C.border }}>·</span>
            <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
              214 tasks today
            </span>
            <span style={{ color: C.border }}>·</span>
            <span style={{ fontFamily: F.body, fontSize: '13px', color: activeCount > 0 ? C.primary : C.textMuted }}>
              {activeCount} running now
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: S[2], alignItems: 'center' }}>
          {/* Command Mode toggle */}
          <div
            onClick={() => setCommandMode(!commandMode)}
            style={{
              display: 'flex', alignItems: 'center', gap: S[2],
              backgroundColor: commandMode ? 'rgba(74,124,111,0.15)' : C.surface2,
              border: `1px solid ${commandMode ? C.primary : C.border}`,
              borderRadius: R.pill, padding: `${S[1]} ${S[3]}`,
              cursor: 'pointer', transition: T.base,
            }}
          >
            <div style={{
              width: '14px', height: '8px', borderRadius: R.pill,
              backgroundColor: commandMode ? C.primary : C.surface3,
              transition: T.base, position: 'relative',
            }}>
              <div style={{
                width: '6px', height: '6px', borderRadius: '50%',
                backgroundColor: 'white', position: 'absolute',
                top: '1px', left: commandMode ? '7px' : '1px',
                transition: T.base,
              }} />
            </div>
            <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: commandMode ? C.primary : C.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Command Mode
            </span>
          </div>
          <button
            onClick={() => {
              allAgents.forEach((a) => {
                if (AGENT_LIVE[a.id]?.status !== 'executing') {
                  AgentRuntime.activateAgent(a.id, { description: 'Run All activation' }, {})
                    .catch(() => {});
                }
              });
              toast.info('All agents activated — processing queued tasks');
            }}
            style={{
              fontFamily: F.body, fontSize: '13px', fontWeight: 600,
              color: C.textInverse, backgroundColor: C.primary,
              border: 'none', borderRadius: R.button, padding: `${S[2]} ${S[5]}`,
              cursor: 'pointer',
            }}
          >
            ⚡ Run All Agents
          </button>
        </div>
      </div>

      {/* ── Freya Command Card ── */}
      <FreyaCard
        agent={freyaAgent}
        liveData={freyaLive}
        agentStatuses={agentStatuses}
        onNavigate={navigate}
        onTrigger={(a) => {
          AgentRuntime.activateAgent(a.id, { description: 'Triggered from roster' }, {});
          toast.info(`Freya activated`);
        }}
      />

      {/* ── Specialist Grid ── */}
      <div style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary, marginBottom: S[4] }}>
        Specialist Agents
        <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted, fontWeight: 400, marginLeft: S[3] }}>
          {specialistAgents.length} agents · {activeCount - (freyaLive?.status === 'executing' ? 1 : 0)} active
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: S[4] }}>
        {specialistAgents.map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            liveData={AGENT_LIVE[agent.id]}
            statusObj={agentStatuses[agent.id]}
            onNavigate={navigate}
          />
        ))}
      </div>

      {/* ── Team Performance Today ── */}
      <div style={{
        marginTop: S[8], backgroundColor: C.surface, border: `1px solid ${C.border}`,
        borderRadius: R.card, padding: S[5],
      }}>
        <div style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary, marginBottom: S[4] }}>
          Team Performance Today
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: S[4] }}>
          {TEAM_STATS.map(({ label, value, color, Icon }) => (
            <div key={label} style={{
              textAlign: 'center', padding: S[4],
              backgroundColor: C.surface2, borderRadius: R.md,
              border: `1px solid ${C.border}`,
            }}>
              <div style={{ marginBottom: S[2], display: 'flex', justifyContent: 'center' }}>
                <Icon color={color} width={22} height={22} w={22} />
              </div>
              <div style={{ fontFamily: F.mono, fontSize: '18px', fontWeight: 700, color, lineHeight: 1, marginBottom: S[1] }}>
                {value}
              </div>
              <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Workflow CTA ── */}
      <div style={{
        marginTop: S[4], padding: S[5],
        backgroundColor: C.surface, border: `1px solid ${C.border}`,
        borderRadius: R.card, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: S[4],
        flexWrap: 'wrap',
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary, marginBottom: '4px' }}>
            Orchestrate multi-agent workflows
          </div>
          <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
            Chain agents into automated pipelines — campaign launch, lead lifecycle, SEO audits, A/B tests.
          </div>
        </div>
        <button
          onClick={() => navigate('/aria/workflows')}
          style={{
            fontFamily: F.body, fontSize: '13px', fontWeight: 600,
            color: C.textInverse, backgroundColor: C.primary, border: 'none',
            borderRadius: R.button, padding: `${S[2]} ${S[5]}`, cursor: 'pointer', whiteSpace: 'nowrap',
          }}
        >
          Workflow Center →
        </button>
      </div>

      <style>{`
        @keyframes agentPulseRing { 0%,100%{box-shadow:0 0 0 0 rgba(74,124,111,0.3)} 50%{box-shadow:0 0 0 6px rgba(74,124,111,0)} }
        @keyframes agentDotAnim   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }
      `}</style>
    </div>
  );
}
