import { C, F, R, S, T, shadows } from '../../tokens';
import { getSpecialistAgents } from '../../agents/AgentRegistry';
import useStore from '../../store/useStore';
import AgentAvatar from './AgentAvatar';

const STATUS_LABELS = {
  idle: 'Idle',
  thinking: 'Thinking',
  executing: 'Executing',
  error: 'Error',
};

const STATUS_COLORS = {
  idle: C.green,
  thinking: C.amber,
  executing: '#3B82F6',
  error: C.red,
};

export default function AgentStatusBar({ onClick }) {
  const agentStatuses = useStore((s) => s.agents.statuses);
  const specialists = getSpecialistAgents();

  const barStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: S[4],
    backgroundColor: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: R.card,
    padding: `${S[4]} ${S[5]}`,
    overflowX: 'auto',
    boxShadow: shadows.card,
  };

  const agentSlotStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: S[1],
    minWidth: '64px',
    cursor: onClick ? 'pointer' : 'default',
    transition: T.base,
  };

  const nameStyle = {
    fontFamily: F.mono,
    fontSize: '10px',
    fontWeight: 600,
    color: C.textSecondary,
    textAlign: 'center',
    lineHeight: 1.2,
    maxWidth: '64px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  return (
    <div style={barStyle}>
      {specialists.map((agent) => {
        const status = agentStatuses[agent.id]?.status || 'idle';
        const statusColor = STATUS_COLORS[status] || C.textMuted;
        const isActive = status === 'thinking' || status === 'executing';

        return (
          <div
            key={agent.id}
            style={agentSlotStyle}
            onClick={() => onClick && onClick(agent.id)}
          >
            <AgentAvatar agentId={agent.id} size={36} showStatus />
            <span style={nameStyle}>{agent.name}</span>
            <span
              style={{
                fontFamily: F.mono,
                fontSize: '9px',
                fontWeight: 700,
                color: statusColor,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                opacity: isActive ? 1 : 0.7,
                animation: isActive ? 'agentStatusPulse 2s ease-in-out infinite' : 'none',
              }}
            >
              {STATUS_LABELS[status] || status}
            </span>
          </div>
        );
      })}
      <style>{`
        @keyframes agentStatusPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
