import { C, F, R, S, T, shadows, scrollbarStyle } from '../../tokens';
import { getAgent } from '../../agents/AgentRegistry';
import AgentAvatar from './AgentAvatar';

const STEP_STATUS = {
  pending: { color: C.textMuted, bg: C.surface3 },
  active: { color: C.amber, bg: C.amberDim },
  done: { color: C.green, bg: C.greenDim },
  failed: { color: C.red, bg: C.redDim },
};

function StepOverlay({ status }) {
  if (status === 'done') {
    return (
      <div style={{
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 16,
        height: 16,
        borderRadius: R.full,
        backgroundColor: C.green,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `2px solid ${C.surface}`,
      }}>
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <path d="M1.5 4L3.5 6L6.5 2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    );
  }
  if (status === 'failed') {
    return (
      <div style={{
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 16,
        height: 16,
        borderRadius: R.full,
        backgroundColor: C.red,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `2px solid ${C.surface}`,
      }}>
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <path d="M2 2l4 4M6 2l-4 4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
    );
  }
  return null;
}

function Arrow({ active }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0,
      padding: `0 ${S[1]}`,
    }}>
      <svg width="32" height="16" viewBox="0 0 32 16" fill="none">
        <line x1="0" y1="8" x2="24" y2="8" stroke={active ? C.primary : C.border} strokeWidth="1.5" strokeDasharray={active ? 'none' : '4 3'}/>
        <path d="M22 4l6 4-6 4" stroke={active ? C.primary : C.border} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

export default function AgentWorkflowVisualizer({ workflow }) {
  if (!workflow || !workflow.steps || workflow.steps.length === 0) {
    return (
      <div style={{
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
        padding: S[6],
        textAlign: 'center',
        fontFamily: F.body,
        fontSize: '13px',
        color: C.textMuted,
      }}>
        No workflow active
      </div>
    );
  }

  const containerStyle = {
    backgroundColor: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: R.card,
    padding: S[5],
    boxShadow: shadows.card,
    display: 'flex',
    flexDirection: 'column',
    gap: S[3],
  };

  const titleStyle = {
    fontFamily: F.display,
    fontSize: '14px',
    fontWeight: 700,
    color: C.textPrimary,
  };

  const scrollRowStyle = {
    display: 'flex',
    alignItems: 'center',
    overflowX: 'auto',
    gap: 0,
    paddingBottom: S[2],
    ...scrollbarStyle,
  };

  const stepStyle = (status) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: S[2],
    minWidth: '80px',
    flexShrink: 0,
  });

  const stepNameStyle = (status) => ({
    fontFamily: F.body,
    fontSize: '11px',
    fontWeight: 600,
    color: STEP_STATUS[status]?.color || C.textMuted,
    textAlign: 'center',
    maxWidth: '80px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  });

  const stepStatusStyle = (status) => ({
    fontFamily: F.mono,
    fontSize: '9px',
    fontWeight: 700,
    color: STEP_STATUS[status]?.color || C.textMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  });

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes workflowStepPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(251,191,36,0.3); }
          50% { box-shadow: 0 0 0 6px rgba(251,191,36,0); }
        }
      `}</style>

      {workflow.name && <span style={titleStyle}>{workflow.name}</span>}

      <div style={scrollRowStyle}>
        {workflow.steps.map((step, i) => {
          const agent = getAgent(step.agentId);
          const status = step.status || 'pending';
          const isActive = status === 'active';

          return (
            <div key={step.id || i} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={stepStyle(status)}>
                <div style={{
                  position: 'relative',
                  animation: isActive ? 'workflowStepPulse 2s ease-in-out infinite' : 'none',
                  borderRadius: R.full,
                }}>
                  <AgentAvatar agentId={step.agentId} size={40} showStatus={isActive} />
                  <StepOverlay status={status} />
                </div>
                <span style={stepNameStyle(status)}>{step.name || agent?.name || step.agentId}</span>
                <span style={stepStatusStyle(status)}>{status}</span>
              </div>
              {i < workflow.steps.length - 1 && (
                <Arrow active={status === 'done'} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
