/**
 * ModeInput — Input field that adapts to current command mode.
 * Manual: terminal-style | Semi: standard | Agentic: gradient bg, rounded
 */
import { useState } from 'react';
import useCommandModeDesign from '../../hooks/useCommandModeDesign';
import { C } from '../../tokens';

export default function ModeInput({
  type = 'text',
  value,
  onChange,
  placeholder,
  label,
  error,
  hint,
  icon,
  iconRight,
  disabled = false,
  required = false,
  style,
  inputStyle,
  ...props
}) {
  const d = useCommandModeDesign();
  const [focused, setFocused] = useState(false);
  const isAgentic = d.id === 'fully_agentic';
  const isManual = d.id === 'manual';

  const wrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    ...style,
  };

  const labelStyle = {
    fontFamily: d.typography.bodyFont,
    fontSize: d.typography.labelSize,
    fontWeight: d.typography.labelWeight,
    letterSpacing: d.typography.labelSpacing,
    textTransform: isManual ? 'uppercase' : 'none',
    color: error ? C.red : C.textSecondary,
  };

  const inputWrapperStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  };

  const fieldStyle = {
    width: '100%',
    background: d.input.bg,
    border: error ? `1px solid ${C.red}` : focused ? d.input.borderFocus : d.input.border,
    borderRadius: d.input.radius,
    fontFamily: d.input.font,
    fontSize: d.input.fontSize,
    color: C.textPrimary,
    padding: d.input.padding,
    paddingLeft: icon ? '36px' : undefined,
    paddingRight: iconRight ? '36px' : undefined,
    outline: 'none',
    caretColor: d.input.caretColor,
    transition: isManual ? 'none' : 'border-color 0.15s ease, box-shadow 0.15s ease',
    boxShadow: focused && isAgentic ? `0 0 0 3px rgba(16, 185, 129, 0.15)` : d.input.shadow || 'none',
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? 'not-allowed' : 'text',
    ...inputStyle,
  };

  const iconBaseStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: 16,
    height: 16,
    color: focused ? d.input.caretColor : C.textMuted,
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const hintStyle = {
    fontFamily: d.typography.bodyFont,
    fontSize: '11px',
    color: error ? C.red : C.textMuted,
  };

  return (
    <div style={wrapperStyle}>
      {label && (
        <label style={labelStyle}>
          {label}
          {required && <span style={{ color: C.red, marginLeft: '3px' }}>*</span>}
        </label>
      )}
      <div style={inputWrapperStyle}>
        {icon && <span style={{ ...iconBaseStyle, left: '12px' }}>{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={fieldStyle}
          {...props}
        />
        {iconRight && <span style={{ ...iconBaseStyle, right: '12px' }}>{iconRight}</span>}
      </div>
      {(hint || error) && <span style={hintStyle}>{error || hint}</span>}
    </div>
  );
}
