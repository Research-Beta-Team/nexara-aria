import { useState } from 'react';
import { C, F, R, S, T } from '../../tokens';
import { getAgent } from '../../agents/AgentRegistry';
import useStore from '../../store/useStore';
import AgentRoleIcon from '../ui/AgentRoleIcon';

const STATUS_STYLES = {
  idle: {
    boxShadow: (color) => `0 0 0 2px ${color}, 0 0 8px rgba(16,185,129,0.4)`,
    animation: null,
  },
  thinking: {
    boxShadow: (color) => `0 0 0 2px ${color}, 0 0 10px rgba(251,191,36,0.5)`,
    animation: 'agentAvatarPulseAmber',
  },
  executing: {
    boxShadow: (color) => `0 0 0 2px ${color}, 0 0 10px rgba(59,130,246,0.5)`,
    animation: 'agentAvatarSpin',
  },
  error: {
    boxShadow: () => `0 0 0 2px ${C.red}, 0 0 10px rgba(239,68,68,0.5)`,
    animation: null,
  },
};

export default function AgentAvatar({ agentId, size = 36, showStatus = true, onClick }) {
  const [hovered, setHovered] = useState(false);
  const agentStatuses = useStore((s) => s.agents.statuses);
  const agent = getAgent(agentId);

  if (!agent) return null;

  const status = agentStatuses[agentId]?.status || 'idle';
  const statusCfg = STATUS_STYLES[status] || STATUS_STYLES.idle;

  const containerStyle = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: size,
    height: size,
    borderRadius: R.full,
    backgroundColor: C.surface2,
    border: `2px solid ${agent.color}`,
    boxShadow: showStatus ? statusCfg.boxShadow(agent.color) : 'none',
    cursor: onClick ? 'pointer' : 'default',
    transition: T.base,
    animation: showStatus && statusCfg.animation ? `${statusCfg.animation} 1.5s ease-in-out infinite` : 'none',
    flexShrink: 0,
  };

  const glyphWrap = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 0,
    userSelect: 'none',
  };

  const tooltipStyle = {
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    marginBottom: '6px',
    backgroundColor: C.surface3,
    color: C.textPrimary,
    fontFamily: F.body,
    fontSize: '11px',
    fontWeight: 600,
    padding: `2px ${S[2]}`,
    borderRadius: R.sm,
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    opacity: hovered ? 1 : 0,
    transition: T.fast,
    border: `1px solid ${C.border}`,
    zIndex: 10,
  };

  return (
    <>
      <style>{`
        @keyframes agentAvatarPulseAmber {
          0%, 100% { box-shadow: 0 0 0 2px ${C.amber}, 0 0 6px rgba(251,191,36,0.3); }
          50% { box-shadow: 0 0 0 3px ${C.amber}, 0 0 14px rgba(251,191,36,0.6); }
        }
        @keyframes agentAvatarSpin {
          0% { box-shadow: 0 0 0 2px #3B82F6, 0 0 8px rgba(59,130,246,0.4); }
          50% { box-shadow: 0 0 0 3px #3B82F6, 0 0 14px rgba(59,130,246,0.7); }
          100% { box-shadow: 0 0 0 2px #3B82F6, 0 0 8px rgba(59,130,246,0.4); }
        }
      `}</style>
      <div
        style={containerStyle}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span style={glyphWrap}>
          <AgentRoleIcon agentId={agentId} size={Math.round(size * 0.5)} color={agent.color} />
        </span>
        <div style={tooltipStyle}>{agent.displayName || agent.name}</div>
      </div>
    </>
  );
}
