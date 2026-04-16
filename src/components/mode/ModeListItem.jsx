/**
 * ModeListItem — List row that adapts to current command mode.
 * Manual: dense, grid-line borders | Semi: card-like | Agentic: floating, rounded
 */
import { useState } from 'react';
import useCommandModeDesign from '../../hooks/useCommandModeDesign';
import { C } from '../../tokens';

export default function ModeListItem({
  children,
  icon,
  title,
  subtitle,
  meta,
  actions,
  status,
  onClick,
  selected = false,
  style,
}) {
  const d = useCommandModeDesign();
  const [hovered, setHovered] = useState(false);
  const isAgentic = d.id === 'fully_agentic';
  const isManual = d.id === 'manual';

  const itemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: d.spacing.itemGap,
    padding: isManual ? `${d.spacing.itemGap} ${d.spacing.cardPadding}` : d.spacing.cardPadding,
    background: selected
      ? (isAgentic ? C.greenDim : isManual ? C.redDim : C.amberDim)
      : hovered
      ? d.surfaces.hoverBg
      : isAgentic
      ? d.surfaces.cardBg
      : 'transparent',
    border: isAgentic
      ? selected
        ? `1px solid ${C.green}`
        : d.surfaces.cardBorder
      : isManual
      ? 'none'
      : 'none',
    borderBottom: isManual ? `1px solid ${C.border}` : isAgentic ? 'none' : `1px solid ${C.border}`,
    borderRadius: isAgentic ? d.surfaces.cardRadius : '0',
    marginBottom: isAgentic ? '6px' : '0',
    cursor: onClick ? 'pointer' : 'default',
    transition: d.motion.transition,
    transform: hovered && isAgentic ? 'translateX(4px)' : 'none',
    boxShadow: isAgentic && hovered ? d.surfaces.cardShadow : 'none',
    ...style,
  };

  const iconWrapStyle = {
    width: isManual ? 28 : isAgentic ? 40 : 36,
    height: isManual ? 28 : isAgentic ? 40 : 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: isAgentic ? '10px' : isManual ? '3px' : '8px',
    backgroundColor: isAgentic ? C.greenDim : isManual ? C.surface2 : C.surface2,
    color: isAgentic ? C.green : isManual ? C.textSecondary : C.textSecondary,
    flexShrink: 0,
  };

  const contentStyle = {
    flex: 1,
    minWidth: 0,
  };

  const titleStyle = {
    fontFamily: d.typography.bodyFont,
    fontSize: isManual ? '12px' : '14px',
    fontWeight: 600,
    color: C.textPrimary,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const subtitleStyle = {
    fontFamily: d.typography.bodyFont,
    fontSize: isManual ? '10px' : '12px',
    color: C.textMuted,
    marginTop: '2px',
  };

  const metaStyle = {
    fontFamily: isManual ? d.typography.dataFont : d.typography.bodyFont,
    fontSize: isManual ? '10px' : '12px',
    color: C.textMuted,
    whiteSpace: 'nowrap',
  };

  return (
    <div
      style={itemStyle}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {icon && <div style={iconWrapStyle}>{icon}</div>}
      {children || (
        <>
          <div style={contentStyle}>
            {title && <div style={titleStyle}>{title}</div>}
            {subtitle && <div style={subtitleStyle}>{subtitle}</div>}
          </div>
          {meta && <div style={metaStyle}>{meta}</div>}
          {status}
          {actions && <div style={{ display: 'flex', gap: '6px' }}>{actions}</div>}
        </>
      )}
    </div>
  );
}
