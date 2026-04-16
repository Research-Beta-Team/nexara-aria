/**
 * ModeStatusDot — Status indicator that adapts to current command mode.
 * Manual: static, bordered | Semi: solid | Agentic: glowing, animated
 */
import useCommandModeDesign from '../../hooks/useCommandModeDesign';
import { C } from '../../tokens';

const STATUS_COLORS = {
  success: C.green,
  warning: C.amber,
  error: C.red,
  info: '#0EA5E9',
  idle: C.textMuted,
  active: C.green,
  pending: C.amber,
};

export default function ModeStatusDot({
  status = 'idle', // 'success' | 'warning' | 'error' | 'info' | 'idle' | 'active' | 'pending'
  size,
  label,
  pulse = false,
  style,
}) {
  const d = useCommandModeDesign();
  const isAgentic = d.id === 'fully_agentic';
  const isManual = d.id === 'manual';
  const color = STATUS_COLORS[status] || STATUS_COLORS.idle;
  const dotSize = size || (isAgentic ? 10 : isManual ? 6 : 8);

  const shouldPulse = pulse || (isAgentic && (status === 'active' || status === 'success'));

  const dotStyle = {
    width: `${dotSize}px`,
    height: `${dotSize}px`,
    borderRadius: '50%',
    backgroundColor: isManual && status === 'pending' ? 'transparent' : color,
    border: isManual ? `1.5px ${status === 'pending' ? 'dashed' : 'solid'} ${color}` : 'none',
    boxShadow: isAgentic && shouldPulse ? `0 0 ${dotSize}px ${color}` : 'none',
    animation: shouldPulse && !isManual ? d.status.animation : 'none',
    flexShrink: 0,
    ...style,
  };

  const wrapperStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  };

  const labelStyle = {
    fontFamily: d.typography.bodyFont,
    fontSize: isManual ? '11px' : '12px',
    fontWeight: isManual ? 600 : 500,
    color: color,
    textTransform: isManual ? 'uppercase' : 'none',
    letterSpacing: isManual ? '0.05em' : '0',
  };

  if (label) {
    return (
      <span style={wrapperStyle}>
        <span style={dotStyle} />
        <span style={labelStyle}>{label}</span>
      </span>
    );
  }

  return <span style={dotStyle} />;
}
