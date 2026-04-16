/**
 * ModeButton — Button that adapts to current command mode.
 * Manual: sharp, outlined, monospace | Semi: filled, rounded | Agentic: gradient, glow
 */
import { useState } from 'react';
import useCommandModeDesign from '../../hooks/useCommandModeDesign';
import { C } from '../../tokens';

export default function ModeButton({
  children,
  variant = 'secondary', // 'primary' | 'secondary' | 'ghost' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon,
  iconRight,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  style,
  ...props
}) {
  const d = useCommandModeDesign();
  const [hovered, setHovered] = useState(false);
  const isAgentic = d.id === 'fully_agentic';
  const isManual = d.id === 'manual';

  const sizes = {
    sm: { padding: `4px ${isManual ? '8px' : '12px'}`, fontSize: isManual ? '10px' : '12px' },
    md: { padding: d.button.padding, fontSize: d.button.fontSize },
    lg: { padding: `12px ${isManual ? '16px' : '24px'}`, fontSize: isManual ? '12px' : '15px' },
  };

  const getVariantStyles = () => {
    if (variant === 'primary') {
      return {
        background: hovered && !disabled ? d.buttonPrimary.bgHover : d.buttonPrimary.bg,
        border: d.buttonPrimary.border,
        color: d.buttonPrimary.color,
        boxShadow: isAgentic ? d.buttonPrimary.shadow : 'none',
      };
    }
    if (variant === 'danger') {
      return {
        background: hovered && !disabled ? C.redDim : 'transparent',
        border: `1px solid ${C.red}`,
        color: C.red,
      };
    }
    if (variant === 'ghost') {
      return {
        background: hovered && !disabled ? d.button.bgHover : 'transparent',
        border: '1px solid transparent',
        color: C.textSecondary,
      };
    }
    // secondary
    return {
      background: hovered && !disabled ? d.button.bgHover : d.button.bg,
      border: hovered && !disabled ? d.button.borderActive : d.button.border,
      color: C.textPrimary,
    };
  };

  const variantStyles = getVariantStyles();

  const buttonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: isManual ? '6px' : '8px',
    borderRadius: d.button.radius,
    fontFamily: d.button.font,
    fontWeight: d.button.fontWeight,
    textTransform: d.button.textTransform,
    letterSpacing: d.button.letterSpacing,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: d.button.transition,
    outline: 'none',
    whiteSpace: 'nowrap',
    ...sizes[size],
    ...variantStyles,
    transform: hovered && !disabled && isAgentic ? 'translateY(-1px)' : 'none',
    ...style,
  };

  const iconSize = size === 'sm' ? 12 : size === 'lg' ? 18 : 14;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={buttonStyle}
      {...props}
    >
      {loading ? (
        <LoadingSpinner size={iconSize} mode={d.id} />
      ) : (
        <>
          {icon && <span style={{ display: 'flex', width: iconSize, height: iconSize }}>{icon}</span>}
          {children}
          {iconRight && <span style={{ display: 'flex', width: iconSize, height: iconSize }}>{iconRight}</span>}
        </>
      )}
    </button>
  );
}

function LoadingSpinner({ size, mode }) {
  const color = mode === 'manual' ? C.red : mode === 'fully_agentic' ? C.green : C.amber;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ animation: 'spin 1s linear infinite' }}
    >
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" opacity="0.25" />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}
