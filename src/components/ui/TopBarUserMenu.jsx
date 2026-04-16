import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, Settings, UserCircle, Users } from 'lucide-react';
import useStore from '../../store/useStore';
import useToast from '../../hooks/useToast';
import { C, F, R, S, T, shadows, Z } from '../../tokens';

const EASE = 'cubic-bezier(0.34, 1.22, 0.64, 1)';

const MOCK_ACCOUNTS = [
  { id: 'main', label: 'Medglobal workspace', email: 'owner@medglobal.org', current: true },
  { id: 'work', label: 'Antarious agency', email: 'team@antarious.demo', current: false },
  { id: 'personal', label: 'Sandbox', email: 'sandbox@nexara.demo', current: false },
];

export default function TopBarUserMenu({ isMobile = false }) {
  const logout = useStore((s) => s.logout);
  const navigate = useNavigate();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const dropdownStyle = {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    minWidth: isMobile ? 'min(100vw - 24px, 280px)' : '280px',
    maxWidth: isMobile ? 'calc(100vw - 24px)' : '320px',
    backgroundColor: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: R.card,
    boxShadow: shadows.dropdown,
    zIndex: Z.sticky + 30,
    overflow: 'hidden',
    padding: `${S[2]} 0`,
    opacity: open ? 1 : 0,
    transform: open ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.98)',
    visibility: open ? 'visible' : 'hidden',
    pointerEvents: open ? 'auto' : 'none',
    transition: `opacity 0.2s ease, transform 0.26s ${EASE}, visibility 0s linear ${open ? '0s' : '0.22s'}`,
  };

  const itemStyle = (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: S[3],
    width: '100%',
    padding: `${S[2]} ${S[4]}`,
    border: 'none',
    background: active ? C.primaryGlow : 'transparent',
    color: active ? C.primary : C.textPrimary,
    fontFamily: F.body,
    fontSize: '13px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: T.color,
  });

  const sectionLabelStyle = {
    padding: `${S[2]} ${S[4]} ${S[1]}`,
    fontFamily: F.mono,
    fontSize: '9px',
    fontWeight: 700,
    color: C.textMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  };

  return (
    <div ref={rootRef} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: S[2], flexShrink: 0, minWidth: 0 }}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: S[3],
          padding: `${S[1]} ${S[2]} ${S[1]} ${S[1]}`,
          borderRadius: R.md,
          border: `1px solid ${open ? C.primary : C.border}`,
          backgroundColor: open ? C.primaryGlow : C.surface3,
          cursor: 'pointer',
          transition: T.base,
          minHeight: isMobile ? '40px' : '38px',
          maxWidth: isMobile ? '100%' : 'min(280px, 36vw)',
          minWidth: 0,
        }}
      >
        <span
          style={{
            width: isMobile ? '30px' : '34px',
            height: isMobile ? '30px' : '34px',
            borderRadius: R.full,
            backgroundColor: C.surface2,
            border: `2px solid color-mix(in srgb, ${C.primary} 45%, ${C.border})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: F.mono,
            fontSize: '11px',
            fontWeight: 700,
            color: C.primary,
            flexShrink: 0,
          }}
        >
          AK
        </span>
        {!isMobile && (
          <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1px', minWidth: 0, flex: 1, textAlign: 'left', overflow: 'hidden' }}>
            <span style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary, lineHeight: 1.15, width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Asif Khan
            </span>
            <span style={{ fontFamily: F.mono, fontSize: '9px', fontWeight: 600, color: C.textMuted, letterSpacing: '0.04em', textTransform: 'uppercase', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Medglobal · CEO
            </span>
          </span>
        )}
        <ChevronDown
          size={16}
          strokeWidth={2}
          color={C.textMuted}
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: `transform 0.22s ${EASE}`, flexShrink: 0 }}
          aria-hidden
        />
      </button>

      <div style={dropdownStyle} role="menu" aria-label="Account menu">
        <div style={{ padding: `${S[3]} ${S[4]}`, borderBottom: `1px solid ${C.border}`, backgroundColor: C.surface2 }}>
          <div style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary }}>Asif Khan</div>
          <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, marginTop: '2px' }}>owner@medglobal.org</div>
          <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, marginTop: S[2], letterSpacing: '0.06em' }}>
            Active org · Medglobal
          </div>
        </div>

        <div style={sectionLabelStyle}>Workspaces</div>
        {MOCK_ACCOUNTS.map((acc) => (
          <button
            key={acc.id}
            type="button"
            role="menuitem"
            style={itemStyle(acc.current)}
            onClick={() => {
              if (!acc.current) toast.info(`Switch to ${acc.label} (mock)`);
              setOpen(false);
            }}
          >
            <span
              style={{
                width: '28px',
                height: '28px',
                borderRadius: R.full,
                backgroundColor: acc.current ? C.primary : C.surface3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: F.mono,
                fontSize: '10px',
                color: acc.current ? C.textInverse : C.textMuted,
              }}
            >
              {acc.label.slice(0, 1)}
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontWeight: 600, display: 'block' }}>{acc.label}{acc.current ? ' · current' : ''}</span>
              <span style={{ fontSize: '11px', color: C.textMuted, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{acc.email}</span>
            </span>
          </button>
        ))}

        <div style={{ height: 1, backgroundColor: C.border, margin: `${S[2]} 0` }} />

        <button
          type="button"
          role="menuitem"
          style={itemStyle()}
          onClick={() => {
            navigate('/settings');
            setOpen(false);
          }}
        >
          <Settings size={16} strokeWidth={2} aria-hidden />
          Settings
        </button>
        <button
          type="button"
          role="menuitem"
          style={itemStyle()}
          onClick={() => {
            toast.info('Team directory (mock)');
            setOpen(false);
          }}
        >
          <Users size={16} strokeWidth={2} aria-hidden />
          Team & seats
        </button>
        <button
          type="button"
          role="menuitem"
          style={itemStyle()}
          onClick={() => {
            toast.info('Account center (mock)');
            setOpen(false);
          }}
        >
          <UserCircle size={16} strokeWidth={2} aria-hidden />
          Account center
        </button>

        <div style={{ height: 1, backgroundColor: C.border, margin: `${S[2]} 0` }} />

        <button
          type="button"
          role="menuitem"
          style={{ ...itemStyle(), color: C.red }}
          onClick={() => {
            setOpen(false);
            logout();
            navigate('/login');
          }}
        >
          <LogOut size={16} strokeWidth={2} aria-hidden />
          Sign out
        </button>
      </div>
    </div>
  );
}
