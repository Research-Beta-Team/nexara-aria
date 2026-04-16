// EmptyState.jsx — consistent empty state component
import { C, F, R, S } from '../../tokens';

export default function EmptyState({ icon, title, description, action, actionLabel, style = {} }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: `${S[10]} ${S[6]}`,
      textAlign: 'center',
      ...style,
    }}>
      {/* Icon circle */}
      {icon && (
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: C.surface2,
          border: `1px solid ${C.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: S[4],
          fontSize: '22px',
          color: C.textMuted,
          flexShrink: 0,
        }}>
          {icon}
        </div>
      )}

      {/* Title */}
      {title && (
        <div style={{
          fontFamily: F.display,
          fontSize: '15px',
          fontWeight: 700,
          color: C.textPrimary,
          marginBottom: S[2],
        }}>
          {title}
        </div>
      )}

      {/* Description */}
      {description && (
        <div style={{
          fontFamily: F.body,
          fontSize: '13px',
          color: C.textMuted,
          lineHeight: '1.5',
          maxWidth: '320px',
          marginBottom: action && actionLabel ? S[5] : 0,
        }}>
          {description}
        </div>
      )}

      {/* Action button */}
      {action && actionLabel && (
        <button
          onClick={action}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: S[2],
            backgroundColor: C.primary,
            color: C.textInverse,
            border: 'none',
            borderRadius: R.button,
            padding: `${S[2]} ${S[5]}`,
            fontFamily: F.body,
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
