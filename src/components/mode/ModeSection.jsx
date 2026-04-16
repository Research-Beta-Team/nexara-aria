/**
 * ModeSection — Page section wrapper that adapts to current command mode.
 * Controls spacing, typography hierarchy, and visual grouping.
 */
import useCommandModeDesign from '../../hooks/useCommandModeDesign';
import { C } from '../../tokens';

export default function ModeSection({
  children,
  title,
  subtitle,
  action,
  collapsible = false,
  defaultOpen = true,
  style,
}) {
  const d = useCommandModeDesign();
  const isAgentic = d.id === 'fully_agentic';
  const isManual = d.id === 'manual';

  const sectionStyle = {
    marginBottom: d.spacing.sectionGap,
    ...style,
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: d.spacing.itemGap,
    marginBottom: d.spacing.itemGap,
    paddingBottom: isManual ? d.spacing.itemGap : '0',
    borderBottom: isManual ? `1px solid ${C.border}` : 'none',
  };

  const titleStyle = {
    fontFamily: d.typography.headingFont,
    fontSize: isManual ? '11px' : isAgentic ? '18px' : '16px',
    fontWeight: d.typography.headingWeight,
    letterSpacing: d.typography.headingLetterSpacing,
    textTransform: d.typography.headingTransform,
    color: C.textPrimary,
    margin: 0,
  };

  const subtitleStyle = {
    fontFamily: d.typography.bodyFont,
    fontSize: isManual ? '11px' : '13px',
    color: C.textMuted,
    marginTop: '4px',
  };

  const contentStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: d.spacing.itemGap,
  };

  return (
    <section style={sectionStyle}>
      {(title || action) && (
        <div style={headerStyle}>
          <div>
            {title && <h2 style={titleStyle}>{title}</h2>}
            {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div style={contentStyle}>{children}</div>
    </section>
  );
}
