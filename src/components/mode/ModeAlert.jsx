/**
 * ModeAlert — Alert/notification banner that adapts to current command mode.
 * Manual: bordered strip | Semi: card-style | Agentic: glowing
 */
import useCommandModeDesign from '../../hooks/useCommandModeDesign';
import { C } from '../../tokens';

const VARIANTS = {
  info: { color: '#0EA5E9', bg: 'rgba(14, 165, 233, 0.1)' },
  success: { color: C.green, bg: C.greenDim },
  warning: { color: C.amber, bg: C.amberDim },
  error: { color: C.red, bg: C.redDim },
};

export default function ModeAlert({
  children,
  variant = 'info',
  icon,
  title,
  action,
  onDismiss,
  style,
}) {
  const d = useCommandModeDesign();
  const isAgentic = d.id === 'fully_agentic';
  const isManual = d.id === 'manual';
  const v = VARIANTS[variant] || VARIANTS.info;

  const alertStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: d.spacing.itemGap,
    padding: d.spacing.cardPadding,
    backgroundColor: isManual ? 'transparent' : v.bg,
    border: isManual
      ? `1px solid ${v.color}`
      : isAgentic
      ? `1px solid color-mix(in srgb, ${v.color} 40%, transparent)`
      : `1px solid ${v.color}`,
    borderLeft: `3px solid ${v.color}`,
    borderRadius: isAgentic ? '12px' : isManual ? '2px' : d.card.radius,
    boxShadow: isAgentic ? `0 4px 20px ${v.bg}` : 'none',
    ...style,
  };

  const iconStyle = {
    width: isManual ? 14 : 18,
    height: isManual ? 14 : 18,
    color: v.color,
    flexShrink: 0,
    marginTop: '2px',
  };

  const contentStyle = {
    flex: 1,
    minWidth: 0,
  };

  const titleStyle = {
    fontFamily: d.typography.headingFont,
    fontSize: isManual ? '11px' : '13px',
    fontWeight: 700,
    textTransform: isManual ? 'uppercase' : 'none',
    letterSpacing: isManual ? '0.05em' : '0',
    color: v.color,
    marginBottom: children ? '4px' : 0,
  };

  const bodyStyle = {
    fontFamily: d.typography.bodyFont,
    fontSize: isManual ? '11px' : '13px',
    color: C.textSecondary,
    lineHeight: 1.5,
  };

  const dismissStyle = {
    width: 18,
    height: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: C.textMuted,
    opacity: 0.7,
    transition: 'opacity 0.15s ease',
    flexShrink: 0,
  };

  return (
    <div style={alertStyle} role="alert">
      {icon && <span style={iconStyle}>{icon}</span>}
      <div style={contentStyle}>
        {title && <div style={titleStyle}>{title}</div>}
        {children && <div style={bodyStyle}>{children}</div>}
        {action && <div style={{ marginTop: d.spacing.itemGap }}>{action}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          style={{ ...dismissStyle, background: 'none', border: 'none', padding: 0 }}
          aria-label="Dismiss"
        >
          ✕
        </button>
      )}
    </div>
  );
}
