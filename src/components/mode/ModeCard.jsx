/**
 * ModeCard — Card component that adapts to current command mode.
 * Manual: flat, bordered, left accent | Semi: shadowed, rounded | Agentic: gradient, glow
 */
import useCommandModeDesign from '../../hooks/useCommandModeDesign';
import { C } from '../../tokens';

export default function ModeCard({
  children,
  title,
  subtitle,
  icon,
  accent,
  headerRight,
  noPadding = false,
  onClick,
  className,
  style,
}) {
  const d = useCommandModeDesign();
  const isAgentic = d.id === 'fully_agentic';
  const isManual = d.id === 'manual';

  const cardStyle = {
    background: d.card.bg,
    border: d.card.border,
    borderLeft: accent ? `3px solid ${accent}` : d.card.borderLeft,
    borderRadius: d.card.radius,
    boxShadow: isAgentic ? `${d.card.shadow}, ${d.card.glow || ''}` : d.card.shadow,
    padding: noPadding ? 0 : d.card.padding,
    transition: d.motion.transition,
    cursor: onClick ? 'pointer' : 'default',
    ...style,
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: d.spacing.itemGap,
    marginBottom: title ? d.spacing.itemGap : 0,
    padding: noPadding ? d.card.padding : 0,
    paddingBottom: noPadding ? d.spacing.itemGap : 0,
    borderBottom: title && noPadding ? d.card.headerBorder : 'none',
    background: d.card.headerBg,
  };

  const titleStyle = {
    fontFamily: d.typography.headingFont,
    fontSize: isManual ? '12px' : '14px',
    fontWeight: d.typography.headingWeight,
    letterSpacing: d.typography.headingLetterSpacing,
    textTransform: d.typography.headingTransform,
    color: C.textPrimary,
    margin: 0,
    flex: 1,
  };

  const subtitleStyle = {
    fontFamily: d.typography.bodyFont,
    fontSize: '12px',
    color: C.textMuted,
    marginTop: '2px',
  };

  const iconStyle = {
    width: d.icon.size + 4,
    height: d.icon.size + 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: isAgentic ? '8px' : isManual ? '2px' : '6px',
    backgroundColor: isAgentic ? C.greenDim : isManual ? C.redDim : C.amberDim,
    color: isAgentic ? C.green : isManual ? C.red : C.amber,
    flexShrink: 0,
  };

  return (
    <div style={cardStyle} onClick={onClick} className={className}>
      {(title || icon || headerRight) && (
        <div style={headerStyle}>
          {icon && <div style={iconStyle}>{icon}</div>}
          <div style={{ flex: 1, minWidth: 0 }}>
            {title && <h3 style={titleStyle}>{title}</h3>}
            {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
          </div>
          {headerRight}
        </div>
      )}
      <div style={{ padding: noPadding ? d.card.padding : 0, paddingTop: noPadding && title ? 0 : undefined }}>
        {children}
      </div>
    </div>
  );
}
