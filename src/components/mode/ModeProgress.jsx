/**
 * ModeProgress — Progress bar that adapts to current command mode.
 * Manual: thin, sharp | Semi: standard | Agentic: thick, glowing, animated
 */
import useCommandModeDesign from '../../hooks/useCommandModeDesign';
import { C } from '../../tokens';

export default function ModeProgress({
  value = 0,       // 0-100
  max = 100,
  label,
  showValue = true,
  color,
  size = 'md',     // 'sm' | 'md' | 'lg'
  animated = false,
  style,
}) {
  const d = useCommandModeDesign();
  const isAgentic = d.id === 'fully_agentic';
  const isManual = d.id === 'manual';
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  const sizes = {
    sm: { height: isManual ? '3px' : isAgentic ? '6px' : '4px' },
    md: { height: isManual ? '4px' : isAgentic ? '10px' : '6px' },
    lg: { height: isManual ? '6px' : isAgentic ? '14px' : '8px' },
  };

  const accentColor = color || (isAgentic ? C.green : isManual ? C.red : C.amber);

  const wrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    ...style,
  };

  const labelRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const labelStyle = {
    fontFamily: d.typography.bodyFont,
    fontSize: isManual ? '10px' : '12px',
    fontWeight: isManual ? 600 : 500,
    textTransform: isManual ? 'uppercase' : 'none',
    letterSpacing: isManual ? '0.05em' : '0',
    color: C.textSecondary,
  };

  const valueStyle = {
    fontFamily: isManual ? d.typography.dataFont : d.typography.bodyFont,
    fontSize: isManual ? '10px' : '12px',
    fontWeight: 600,
    color: accentColor,
  };

  const trackStyle = {
    width: '100%',
    height: sizes[size].height,
    borderRadius: isAgentic ? '10px' : isManual ? '0' : '4px',
    backgroundColor: C.surface2,
    border: isManual ? `1px solid ${C.border}` : 'none',
    overflow: 'hidden',
    position: 'relative',
  };

  const fillStyle = {
    width: `${percent}%`,
    height: '100%',
    background: isAgentic
      ? `linear-gradient(90deg, ${accentColor} 0%, color-mix(in srgb, ${accentColor} 70%, white) 100%)`
      : accentColor,
    borderRadius: 'inherit',
    transition: isManual ? 'none' : 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: isAgentic ? `0 0 12px ${accentColor}` : 'none',
    position: 'relative',
  };

  const shimmerStyle = animated && isAgentic ? {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s ease-in-out infinite',
  } : null;

  return (
    <div style={wrapperStyle}>
      {(label || showValue) && (
        <div style={labelRowStyle}>
          {label && <span style={labelStyle}>{label}</span>}
          {showValue && <span style={valueStyle}>{Math.round(percent)}%</span>}
        </div>
      )}
      <div style={trackStyle}>
        <div style={fillStyle}>
          {shimmerStyle && <div style={shimmerStyle} />}
        </div>
      </div>
    </div>
  );
}
