/**
 * ModeBadge — Badge/tag that adapts to current command mode.
 * Manual: outlined, uppercase | Semi: filled, rounded | Agentic: pill, glow
 */
import useCommandModeDesign from '../../hooks/useCommandModeDesign';
import { C } from '../../tokens';

const COLORS = {
  default: { bg: C.surface2, color: C.textSecondary, border: C.border },
  success: { bg: C.greenDim, color: C.green, border: C.green },
  warning: { bg: C.amberDim, color: C.amber, border: C.amber },
  error: { bg: C.redDim, color: C.red, border: C.red },
  info: { bg: 'rgba(14, 165, 233, 0.12)', color: '#0EA5E9', border: '#0EA5E9' },
  purple: { bg: 'rgba(124, 58, 237, 0.12)', color: '#7C3AED', border: '#7C3AED' },
};

export default function ModeBadge({
  children,
  color = 'default',
  icon,
  dot = false,
  pulse = false,
  size = 'md',
  style,
}) {
  const d = useCommandModeDesign();
  const isAgentic = d.id === 'fully_agentic';
  const isManual = d.id === 'manual';
  const c = COLORS[color] || COLORS.default;

  const sizes = {
    sm: { fontSize: '9px', padding: '2px 5px' },
    md: { fontSize: d.badge.fontSize, padding: d.badge.padding },
    lg: { fontSize: '12px', padding: '5px 12px' },
  };

  const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    fontFamily: d.badge.font,
    fontWeight: d.badge.fontWeight,
    textTransform: d.badge.textTransform,
    letterSpacing: d.badge.letterSpacing,
    borderRadius: d.badge.radius,
    backgroundColor: isManual ? 'transparent' : c.bg,
    border: isManual ? `1px solid ${c.border}` : d.badge.border === 'none' ? 'none' : `1px solid ${c.border}`,
    color: c.color,
    boxShadow: isAgentic && color !== 'default' ? `0 2px 8px ${c.bg}` : 'none',
    whiteSpace: 'nowrap',
    ...sizes[size],
    ...style,
  };

  const dotStyle = {
    width: isAgentic ? '8px' : '6px',
    height: isAgentic ? '8px' : '6px',
    borderRadius: '50%',
    backgroundColor: c.color,
    boxShadow: isAgentic && pulse ? `0 0 8px ${c.color}` : 'none',
    animation: pulse && isAgentic ? 'pulse 2s ease-in-out infinite' : 'none',
    flexShrink: 0,
  };

  return (
    <span style={badgeStyle}>
      {dot && <span style={dotStyle} />}
      {icon && <span style={{ display: 'flex', width: 12, height: 12 }}>{icon}</span>}
      {children}
    </span>
  );
}
