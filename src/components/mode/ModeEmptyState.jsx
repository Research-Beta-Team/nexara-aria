/**
 * ModeEmptyState — Empty/zero state that adapts to current command mode.
 * Manual: minimal, text-only | Semi: illustrated | Agentic: animated, inviting
 */
import useCommandModeDesign from '../../hooks/useCommandModeDesign';
import { C } from '../../tokens';
import ModeButton from './ModeButton';

export default function ModeEmptyState({
  icon,
  title,
  description,
  action,
  actionLabel,
  onAction,
  style,
}) {
  const d = useCommandModeDesign();
  const isAgentic = d.id === 'fully_agentic';
  const isManual = d.id === 'manual';

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: isManual ? d.spacing.cardPadding : d.spacing.sectionGap,
    textAlign: 'center',
    ...style,
  };

  const iconWrapStyle = {
    width: isManual ? 32 : isAgentic ? 64 : 48,
    height: isManual ? 32 : isAgentic ? 64 : 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: isAgentic ? '16px' : isManual ? '4px' : '12px',
    backgroundColor: isAgentic ? C.greenDim : isManual ? C.surface2 : C.amberDim,
    color: isAgentic ? C.green : isManual ? C.textMuted : C.amber,
    marginBottom: d.spacing.itemGap,
    boxShadow: isAgentic ? `0 8px 32px ${C.greenDim}` : 'none',
    animation: isAgentic ? 'float 3s ease-in-out infinite' : 'none',
  };

  const titleStyle = {
    fontFamily: d.typography.headingFont,
    fontSize: isManual ? '12px' : isAgentic ? '18px' : '16px',
    fontWeight: d.typography.headingWeight,
    letterSpacing: d.typography.headingLetterSpacing,
    textTransform: d.typography.headingTransform,
    color: C.textPrimary,
    margin: 0,
    marginBottom: '8px',
  };

  const descStyle = {
    fontFamily: d.typography.bodyFont,
    fontSize: isManual ? '11px' : '14px',
    color: C.textMuted,
    maxWidth: '320px',
    lineHeight: 1.5,
    marginBottom: (action || onAction) ? d.spacing.itemGap : 0,
  };

  return (
    <div style={containerStyle}>
      {icon && <div style={iconWrapStyle}>{icon}</div>}
      {title && <h3 style={titleStyle}>{title}</h3>}
      {description && <p style={descStyle}>{description}</p>}
      {action}
      {!action && onAction && actionLabel && (
        <ModeButton variant="primary" onClick={onAction}>
          {actionLabel}
        </ModeButton>
      )}
    </div>
  );
}
