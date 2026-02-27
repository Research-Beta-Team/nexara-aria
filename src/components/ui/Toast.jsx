import { useEffect, useRef } from 'react';
import useStore from '../../store/useStore';
import { C, F, R, S, Z, shadows } from '../../tokens';

// ── Icons ─────────────────────────────────────
const icons = {
  success: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke={C.primary} strokeWidth="1.5"/>
      <path d="M5 8l2 2 4-4" stroke={C.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  error: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke={C.red} strokeWidth="1.5"/>
      <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke={C.red} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  warning: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2L14.5 13H1.5L8 2Z" stroke={C.amber} strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M8 6v3M8 11v.5" stroke={C.amber} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  info: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke={C.secondary} strokeWidth="1.5"/>
      <path d="M8 7v4M8 5v.5" stroke={C.secondary} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
};

const accentColor = {
  success: C.primary,
  error:   C.red,
  warning: C.amber,
  info:    C.secondary,
};

// ── Single Toast Item ─────────────────────────
function ToastItem({ id, message, type = 'info', duration = 3500 }) {
  const removeToast = useStore((s) => s.removeToast);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => removeToast(id), duration);
    return () => clearTimeout(timerRef.current);
  }, [id, duration, removeToast]);

  const color = accentColor[type] ?? C.secondary;

  const style = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: S[3],
    backgroundColor: C.surface2,
    border: `1px solid ${C.border}`,
    borderLeft: `3px solid ${color}`,
    borderRadius: R.card,
    padding: `${S[3]} ${S[4]}`,
    boxShadow: shadows.modal,
    minWidth: '280px',
    maxWidth: '380px',
    cursor: 'pointer',
    animation: 'toastIn 0.2s ease',
  };

  const textStyle = {
    fontFamily: F.body,
    fontSize: '13px',
    fontWeight: 500,
    color: C.textPrimary,
    lineHeight: '1.4',
    flex: 1,
  };

  const closeStyle = {
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    color: C.textMuted,
    lineHeight: 1,
    flexShrink: 0,
    marginTop: '1px',
  };

  return (
    <div style={style} onClick={() => removeToast(id)}>
      <span style={{ flexShrink: 0, marginTop: '1px' }}>{icons[type]}</span>
      <span style={textStyle}>{message}</span>
      <button style={closeStyle} onClick={(e) => { e.stopPropagation(); removeToast(id); }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 2l8 8M10 2l-8 8" stroke={C.textMuted} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}

// ── Toast Container ───────────────────────────
export default function Toast() {
  const toasts = useStore((s) => s.toasts);

  const containerStyle = {
    position: 'fixed',
    bottom: S[6],
    right: S[6],
    display: 'flex',
    flexDirection: 'column',
    gap: S[2],
    zIndex: Z.toast,
    pointerEvents: 'none',
  };

  const itemWrapStyle = {
    pointerEvents: 'auto',
  };

  return (
    <>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
      <div style={containerStyle}>
        {toasts.map((t) => (
          <div key={t.id} style={itemWrapStyle}>
            <ToastItem {...t} />
          </div>
        ))}
      </div>
    </>
  );
}
