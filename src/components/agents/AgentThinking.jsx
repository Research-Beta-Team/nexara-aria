import { C, F, R, S, T } from '../../tokens';
import { getAgent } from '../../agents/AgentRegistry';
import AgentAvatar from './AgentAvatar';

export default function AgentThinking({ agentId, task }) {
  const agent = getAgent(agentId);
  if (!agent) return null;

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: S[3],
    backgroundColor: C.surface2,
    border: `1px solid ${C.border}`,
    borderRadius: R.card,
    padding: `${S[3]} ${S[4]}`,
    animation: 'agentThinkingBgPulse 3s ease-in-out infinite',
    position: 'relative',
    overflow: 'hidden',
  };

  const textCol = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    flex: 1,
    minWidth: 0,
  };

  const thinkingTextStyle = {
    fontFamily: F.body,
    fontSize: '13px',
    fontWeight: 600,
    color: C.textPrimary,
    display: 'flex',
    alignItems: 'center',
    gap: S[1],
  };

  const taskStyle = {
    fontFamily: F.body,
    fontSize: '12px',
    color: C.textSecondary,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  const dotsStyle = {
    display: 'inline-flex',
    gap: '3px',
    marginLeft: '2px',
  };

  const dotStyle = (delay) => ({
    width: '4px',
    height: '4px',
    borderRadius: R.full,
    backgroundColor: agent.color,
    animation: `agentThinkingDot 1.2s ease-in-out ${delay}s infinite`,
  });

  return (
    <>
      <style>{`
        @keyframes agentThinkingBgPulse {
          0%, 100% { background-color: ${C.surface2}; }
          50% { background-color: ${C.surface3}; }
        }
        @keyframes agentThinkingDot {
          0%, 100% { opacity: 0.3; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-3px); }
        }
      `}</style>
      <div style={containerStyle}>
        <AgentAvatar agentId={agentId} size={32} showStatus />
        <div style={textCol}>
          <span style={thinkingTextStyle}>
            {agent.displayName || agent.name} is thinking
            <span style={dotsStyle}>
              <span style={dotStyle(0)} />
              <span style={dotStyle(0.2)} />
              <span style={dotStyle(0.4)} />
            </span>
          </span>
          {task && <span style={taskStyle}>{task}</span>}
        </div>
      </div>
    </>
  );
}
