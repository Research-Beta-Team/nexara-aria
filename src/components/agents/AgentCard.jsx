import { useState } from 'react';
import { C, F, R, S, T, shadows, badge, makeStyles } from '../../tokens';
import { getAgent } from '../../agents/AgentRegistry';
import useStore from '../../store/useStore';
import AgentAvatar from './AgentAvatar';

const STATUS_BADGE = {
  idle: { bg: C.greenDim, color: C.green, label: 'Idle' },
  thinking: { bg: C.amberDim, color: C.amber, label: 'Thinking' },
  executing: { bg: 'rgba(59,130,246,0.15)', color: '#3B82F6', label: 'Executing' },
  error: { bg: C.redDim, color: C.red, label: 'Error' },
};

function timeAgo(isoStr) {
  if (!isoStr) return 'Never';
  const diff = Date.now() - new Date(isoStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AgentCard({ agentId, onClick }) {
  const [hovered, setHovered] = useState(false);
  const agentStatuses = useStore((s) => s.agents.statuses);
  const agent = getAgent(agentId);

  if (!agent) return null;

  const agentState = agentStatuses[agentId] || { status: 'idle', lastAction: null };
  const status = agentState.status;
  const statusCfg = STATUS_BADGE[status] || STATUS_BADGE.idle;
  const isThinking = status === 'thinking';
  const isActive = status === 'thinking' || status === 'executing';

  const cardStyle = {
    backgroundColor: C.surface2,
    border: `1px solid ${C.border}`,
    borderRadius: R.card,
    padding: S[5],
    cursor: onClick ? 'pointer' : 'default',
    transition: T.base,
    transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
    boxShadow: isActive ? `0 0 0 1px ${C.primary}, 0 4px 20px rgba(74,124,111,0.2)` : hovered ? shadows.cardHover : shadows.card,
    borderColor: hovered ? C.borderHover : isActive ? C.primary : C.border,
    animation: isThinking ? 'agentCardPulse 2s ease-in-out infinite' : 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: S[3],
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: S[3],
  };

  const nameStyle = {
    fontFamily: F.display,
    fontSize: '15px',
    fontWeight: 700,
    color: C.textPrimary,
    lineHeight: 1.2,
  };

  const descStyle = {
    fontFamily: F.body,
    fontSize: '12px',
    color: C.textSecondary,
    lineHeight: 1.4,
  };

  const statusBadgeStyle = {
    ...badge.base,
    backgroundColor: statusCfg.bg,
    color: statusCfg.color,
    border: `1px solid ${statusCfg.color}30`,
  };

  const skillChipStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: C.surface3,
    color: C.textMuted,
    fontFamily: F.mono,
    fontSize: '10px',
    fontWeight: 600,
    padding: `1px ${S[2]}`,
    borderRadius: R.pill,
    border: `1px solid ${C.border}`,
    letterSpacing: '0.02em',
  };

  const footerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
    paddingTop: S[2],
    borderTop: `1px solid ${C.border}`,
  };

  const metaStyle = {
    fontFamily: F.mono,
    fontSize: '10px',
    color: C.textMuted,
  };

  return (
    <>
      <style>{`
        @keyframes agentCardPulse {
          0%, 100% { border-color: ${C.border}; }
          50% { border-color: ${C.amber}40; }
        }
      `}</style>
      <div
        style={cardStyle}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Header */}
        <div style={headerStyle}>
          <AgentAvatar agentId={agentId} size={40} showStatus />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
              <span style={nameStyle}>{agent.displayName || agent.name}</span>
              <span style={statusBadgeStyle}>{statusCfg.label}</span>
            </div>
            <span style={{ fontFamily: F.mono, fontSize: '10px', color: agent.color, fontWeight: 600 }}>
              {agent.role}
            </span>
          </div>
        </div>

        {/* Description */}
        <p style={descStyle}>{agent.description}</p>

        {/* Skills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {agent.skills.slice(0, 5).map((skill) => (
            <span key={skill} style={skillChipStyle}>{skill}</span>
          ))}
          {agent.skills.length > 5 && (
            <span style={makeStyles(skillChipStyle, { color: C.primary })}>
              +{agent.skills.length - 5}
            </span>
          )}
        </div>

        {/* Footer */}
        <div style={footerStyle}>
          <span style={makeStyles(badge.base, badge.muted)}>
            {agent.skills.length} skills
          </span>
          <span style={metaStyle}>
            Last active: {timeAgo(agentState.lastAction)}
          </span>
        </div>
      </div>
    </>
  );
}
