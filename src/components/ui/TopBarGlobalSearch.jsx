import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import useToast from '../../hooks/useToast';
import { C, F, R, S, T, shadows, Z } from '../../tokens';

const EASE = 'cubic-bezier(0.34, 1.22, 0.64, 1)';

export default function TopBarGlobalSearch({ isMobile = false, open, onToggle, onClose }) {
  const navigate = useNavigate();
  const toast = useToast();
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) return undefined;
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', onDoc);
    return () => {
      cancelAnimationFrame(id);
      document.removeEventListener('mousedown', onDoc);
    };
  }, [open, onClose]);

  const hits = [
    {
      id: 'camp',
      title: 'Campaign — Medglobal Field Health Q2',
      hint: 'Campaigns',
      onPick: () => {
        navigate('/campaigns');
        toast.info('Opened Campaigns');
        onClose();
      },
    },
    {
      id: 'icp',
      title: 'ICP Builder — humanitarian health buyers',
      hint: 'Research',
      onPick: () => {
        navigate('/research/icp');
        toast.info('Opened ICP Builder');
        onClose();
      },
    },
    {
      id: 'set',
      title: 'Settings — Command mode & agents',
      hint: 'Settings',
      onPick: () => {
        navigate('/settings');
        toast.info('Opened Settings');
        onClose();
      },
    },
  ];

  /** Desktop: anchor left under the Search control so the panel does not spill over the mode chip. */
  const panelTransform = open
    ? 'translateY(0) scale(1)'
    : 'translateY(-8px) scale(0.98)';

  const panelStyle = {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    left: 0,
    right: isMobile ? 0 : 'auto',
    transform: panelTransform,
    opacity: open ? 1 : 0,
    visibility: open ? 'visible' : 'hidden',
    pointerEvents: open ? 'auto' : 'none',
    transition: `opacity 0.22s ease, transform 0.28s ${EASE}, visibility 0s linear ${open ? '0s' : '0.24s'}`,
    zIndex: Z.sticky + 20,
    width: isMobile ? '100%' : 'min(360px, calc(100vw - 24px))',
    minWidth: isMobile ? 'min(100%, 260px)' : '280px',
    maxWidth: isMobile ? '100%' : 'min(400px, calc(100vw - 16px))',
    padding: S[3],
    borderRadius: R.md,
    backgroundColor: C.surface,
    border: `1px solid ${C.border}`,
    boxShadow: shadows.dropdown,
  };

  return (
    <div
      ref={rootRef}
      style={{
        position: 'relative',
        flexShrink: 0,
        display: 'inline-flex',
        alignItems: 'center',
        zIndex: open ? 2 : 0,
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls="topbar-global-search-panel"
        title="Global search (⌘K / Ctrl+K)"
        onClick={onToggle}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: S[2],
          padding: `${S[2]} ${S[3]}`,
          borderRadius: R.button,
          border: `1px solid ${C.border}`,
          backgroundColor: C.bg,
          color: C.textSecondary,
          cursor: 'pointer',
          fontFamily: F.mono,
          fontSize: isMobile ? '10px' : '11px',
          fontWeight: 600,
          letterSpacing: '0.04em',
          transition: T.base,
        }}
      >
        <Search size={isMobile ? 14 : 16} strokeWidth={2} aria-hidden />
        {!isMobile && <span>Search</span>}
      </button>

      <div
        id="topbar-global-search-panel"
        role="dialog"
        aria-label="Global search"
        style={panelStyle}
      >
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search campaigns, contacts, content…"
          onKeyDown={(e) => {
            if (e.key === 'Escape') onClose();
          }}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: `${S[2]} ${S[3]}`,
            borderRadius: R.input,
            border: `1px solid ${C.border}`,
            backgroundColor: C.surface2,
            color: C.textPrimary,
            fontFamily: F.body,
            fontSize: '14px',
            outline: 'none',
            marginBottom: S[3],
          }}
        />
        <div
          style={{
            fontFamily: F.mono,
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            color: C.textMuted,
            textTransform: 'uppercase',
            marginBottom: S[2],
          }}
        >
          Quick open
        </div>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: S[1] }}>
          {hits.map((h) => (
            <li key={h.id}>
              <button
                type="button"
                onClick={h.onPick}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: `${S[2]} ${S[3]}`,
                  borderRadius: R.sm,
                  border: '1px solid transparent',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  transition: T.base,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = C.surface2;
                  e.currentTarget.style.borderColor = C.border;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary }}>{h.title}</div>
                <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, marginTop: '2px' }}>{h.hint}</div>
              </button>
            </li>
          ))}
        </ul>
        <div
          style={{
            marginTop: S[3],
            paddingTop: S[2],
            borderTop: `1px solid ${C.border}`,
            fontFamily: F.mono,
            fontSize: '10px',
            color: C.textMuted,
          }}
        >
          {query.trim()
            ? `No indexed matches for “${query.trim()}” yet — use Quick open or browse sidebar.`
            : 'Full search index ships next — results will filter on your query.'}
        </div>
      </div>
    </div>
  );
}
