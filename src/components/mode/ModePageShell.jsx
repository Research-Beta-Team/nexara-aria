/**
 * ModePageShell — Page-level wrapper that adapts layout/padding to command mode.
 * Use this as the outermost wrapper inside page components.
 */
import useCommandModeDesign from '../../hooks/useCommandModeDesign';
import { C } from '../../tokens';

export default function ModePageShell({
  children,
  title,
  subtitle,
  actions,
  maxWidth,
  noPadding = false,
  style,
}) {
  const d = useCommandModeDesign();
  const isAgentic = d.id === 'fully_agentic';
  const isManual = d.id === 'manual';

  const shellStyle = {
    width: '100%',
    maxWidth: maxWidth || d.layout.maxWidth,
    margin: '0 auto',
    padding: noPadding ? 0 : d.layout.contentPadding,
    animation: isAgentic ? 'slideUp 0.3s ease' : isManual ? 'none' : 'fadeIn 0.2s ease',
    ...style,
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: d.spacing.itemGap,
    marginBottom: d.spacing.sectionGap,
    paddingBottom: isManual ? d.spacing.itemGap : 0,
    borderBottom: isManual ? `1px solid ${C.border}` : 'none',
    flexWrap: 'wrap',
  };

  const titleStyle = {
    fontFamily: d.typography.headingFont,
    fontSize: isManual ? '14px' : isAgentic ? '28px' : '24px',
    fontWeight: d.typography.headingWeight,
    letterSpacing: d.typography.headingLetterSpacing,
    textTransform: d.typography.headingTransform,
    color: C.textPrimary,
    margin: 0,
    lineHeight: 1.2,
  };

  const subtitleStyle = {
    fontFamily: d.typography.bodyFont,
    fontSize: isManual ? '11px' : '14px',
    color: C.textMuted,
    marginTop: isManual ? '4px' : '6px',
    maxWidth: '600px',
    lineHeight: 1.5,
  };

  const actionsStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: d.spacing.itemGap,
    flexShrink: 0,
  };

  return (
    <div style={shellStyle}>
      {(title || actions) && (
        <header style={headerStyle}>
          <div>
            {title && <h1 style={titleStyle}>{title}</h1>}
            {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
          </div>
          {actions && <div style={actionsStyle}>{actions}</div>}
        </header>
      )}
      {children}
    </div>
  );
}
