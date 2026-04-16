/**
 * TriggerButton — manually activate a specific agent for a specific task.
 * Props: agentId, agentName, task, creditCost, estimatedTime,
 *        onTrigger, variant ('primary'|'secondary'|'ghost'), size ('sm'|'md'|'lg'), disabled
 */
import { useState, useEffect } from 'react';
import { useAgent } from '../../hooks/useAgent';
import { AgentRuntime } from '../../agents/AgentRuntime';
import { C, F, R, S, T } from '../../tokens';
import AgentRoleIcon from './AgentRoleIcon';
import { IconZap } from './Icons';

const SIZES = {
  sm: { padding: `${S[1]} ${S[3]}`, fontSize: '12px', iconSize: '14px', gap: S[1] },
  md: { padding: `${S[2]} ${S[4]}`, fontSize: '13px', iconSize: '16px', gap: S[2] },
  lg: { padding: `${S[3]} ${S[5]}`, fontSize: '14px', iconSize: '18px', gap: S[2] },
};

const VARIANT_BASE = {
  primary: {
    backgroundColor: C.primary,
    color: C.textInverse,
    border: 'none',
  },
  secondary: {
    backgroundColor: 'transparent',
    color: C.textPrimary,
    border: `1px solid ${C.border}`,
  },
  ghost: {
    backgroundColor: 'transparent',
    color: C.textSecondary,
    border: 'none',
  },
};

function Spinner({ size = 14 }) {
  const [deg, setDeg] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setDeg((d) => d + 10), 30);
    return () => clearInterval(id);
  }, []);
  return (
    <span style={{
      display: 'inline-block',
      width: size,
      height: size,
      border: `2px solid rgba(255,255,255,0.3)`,
      borderTopColor: 'currentColor',
      borderRadius: '50%',
      transform: `rotate(${deg}deg)`,
      flexShrink: 0,
    }} />
  );
}

export default function TriggerButton({
  agentId,
  agentName = 'Agent',
  task = {},
  creditCost,
  estimatedTime,
  onTrigger,
  variant = 'secondary',
  size = 'md',
  disabled = false,
}) {
  const agent = useAgent(agentId);
  const [hovered, setHovered] = useState(false);
  const [doneFlash, setDoneFlash] = useState(false);
  const [errorFlash, setErrorFlash] = useState(false);
  const [prevStatus, setPrevStatus] = useState('idle');

  const status = agent?.status || 'idle';
  const isRunning = status === 'thinking' || status === 'executing';

  // Watch for transitions to done / error
  useEffect(() => {
    if (prevStatus === 'executing' && status === 'idle') {
      setDoneFlash(true);
      const t = setTimeout(() => setDoneFlash(false), 2000);
      return () => clearTimeout(t);
    }
    if (status === 'error') {
      setErrorFlash(true);
    } else {
      setErrorFlash(false);
    }
    setPrevStatus(status);
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  const sz = SIZES[size] || SIZES.md;

  const handleClick = async () => {
    if (disabled || isRunning) return;
    if (doneFlash) return;
    try {
      if (onTrigger) await onTrigger();
      await AgentRuntime.activateAgent(agentId, task, {});
    } catch (_) {
      // error state handled by agent runtime
    }
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    AgentRuntime.cancelAgent(agentId);
  };

  // Determine button visual state
  let bg = VARIANT_BASE[variant]?.backgroundColor;
  let color = VARIANT_BASE[variant]?.color;
  let border = VARIANT_BASE[variant]?.border;

  if (doneFlash) {
    bg = C.greenDim;
    color = C.green;
    border = `1px solid ${C.green}`;
  } else if (errorFlash) {
    bg = C.redDim;
    color = C.red;
    border = `1px solid ${C.red}`;
  } else if (isRunning) {
    bg = C.primaryGlow;
    color = C.primary;
    border = `1px solid ${C.primary}`;
  }

  const isDisabled = disabled || (isRunning && false); // running is allowed for cancel

  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        type="button"
        disabled={isDisabled}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handleClick}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: sz.gap,
          padding: sz.padding,
          fontSize: sz.fontSize,
          fontFamily: F.body,
          fontWeight: 600,
          borderRadius: R.button,
          backgroundColor: bg,
          color: color,
          border: border || 'none',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          opacity: isDisabled ? 0.5 : 1,
          transition: T.color,
          whiteSpace: 'nowrap',
          position: 'relative',
        }}
      >
        {isRunning ? (
          <Spinner size={parseInt(sz.iconSize)} />
        ) : doneFlash ? (
          <span style={{ fontSize: sz.iconSize }}>✓</span>
        ) : errorFlash ? (
          <span style={{ fontSize: sz.iconSize }}>✕</span>
        ) : (
          <span style={{ lineHeight: 0 }}><AgentRoleIcon agentId={agentId} size={parseInt(sz.iconSize, 10) || 16} color={color} /></span>
        )}
        <span>
          {isRunning
            ? 'Running…'
            : doneFlash
            ? 'Done'
            : errorFlash
            ? 'Retry'
            : `Run ${agentName}`}
        </span>
        {isRunning && (
          <button
            type="button"
            onClick={handleCancel}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: S[1],
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.15)',
              border: 'none',
              color: 'currentColor',
              cursor: 'pointer',
              fontSize: '10px',
              lineHeight: 1,
              padding: 0,
            }}
            title="Cancel"
          >
            ✕
          </button>
        )}
      </button>

      {/* Hover tooltip: credit cost + estimated time */}
      {hovered && !isRunning && !doneFlash && (creditCost || estimatedTime) && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 6px)',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: S[2],
          backgroundColor: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: R.sm,
          padding: `${S[1]} ${S[2]}`,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 100,
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }}>
          {creditCost && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: F.mono, fontSize: '11px', color: C.amber, fontWeight: 700 }}>
              <IconZap color={C.amber} w={12} />
              {creditCost} cr
            </span>
          )}
          {estimatedTime && (
            <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>
              ~{estimatedTime}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
