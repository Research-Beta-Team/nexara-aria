/**
 * ModeMetric — Stat/KPI display that adapts to current command mode.
 * Manual: compact, monospace value | Semi: standard card | Agentic: prominent, glowing
 */
import useCommandModeDesign from '../../hooks/useCommandModeDesign';
import { C } from '../../tokens';

export default function ModeMetric({
  label,
  value,
  change,        // { value: '+12%', positive: true }
  icon,
  trend,         // 'up' | 'down' | 'flat'
  color,         // accent color override
  size = 'md',   // 'sm' | 'md' | 'lg'
  style,
}) {
  const d = useCommandModeDesign();
  const isAgentic = d.id === 'fully_agentic';
  const isManual = d.id === 'manual';

  const sizes = {
    sm: { value: isManual ? '16px' : '20px', label: '10px' },
    md: { value: isManual ? '20px' : isAgentic ? '32px' : '28px', label: '11px' },
    lg: { value: isManual ? '24px' : isAgentic ? '42px' : '36px', label: '12px' },
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: isManual ? '4px' : '8px',
    padding: d.spacing.cardPadding,
    background: d.card.bg,
    border: d.card.border,
    borderRadius: d.card.radius,
    boxShadow: d.card.shadow,
    ...style,
  };

  const labelStyle = {
    fontFamily: d.typography.bodyFont,
    fontSize: sizes[size].label,
    fontWeight: d.typography.labelWeight,
    letterSpacing: d.typography.labelSpacing,
    textTransform: isManual ? 'uppercase' : 'none',
    color: C.textMuted,
  };

  const valueRowStyle = {
    display: 'flex',
    alignItems: 'baseline',
    gap: isManual ? '6px' : '10px',
  };

  const valueStyle = {
    fontFamily: isManual ? d.typography.dataFont : d.typography.headingFont,
    fontSize: sizes[size].value,
    fontWeight: isAgentic ? 800 : 700,
    color: color || C.textPrimary,
    letterSpacing: isManual ? '0' : '-0.02em',
    lineHeight: 1,
  };

  const changeStyle = {
    fontFamily: d.typography.bodyFont,
    fontSize: isManual ? '10px' : '12px',
    fontWeight: 600,
    color: change?.positive ? C.green : change?.positive === false ? C.red : C.textMuted,
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
  };

  const iconStyle = {
    width: isManual ? 14 : isAgentic ? 20 : 16,
    height: isManual ? 14 : isAgentic ? 20 : 16,
    color: color || (isAgentic ? C.green : isManual ? C.red : C.amber),
    flexShrink: 0,
  };

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {icon && <span style={iconStyle}>{icon}</span>}
        <span style={labelStyle}>{label}</span>
      </div>
      <div style={valueRowStyle}>
        <span style={valueStyle}>{value}</span>
        {change && (
          <span style={changeStyle}>
            {trend === 'up' && '↑'}
            {trend === 'down' && '↓'}
            {change.value}
          </span>
        )}
      </div>
    </div>
  );
}
