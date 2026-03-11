import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { C, F, R, S, btn, shadows } from '../../tokens';

/**
 * New campaign button that opens a choice: Create manually (wizard), Create with Freya, or Start from file.
 * Use on Dashboard and Campaign list. When atLimit + onUpgrade, shows upgrade CTA instead.
 */
export default function NewCampaignChoice({ atLimit, onUpgrade }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [open]);

  if (atLimit && onUpgrade) {
    return (
      <button type="button" style={{ ...btn.primary, fontSize: '13px' }} onClick={onUpgrade}>
        Upgrade to add more
      </button>
    );
  }

  const go = (path) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        style={{ ...btn.primary, fontSize: '13px', display: 'flex', alignItems: 'center', gap: S[1] }}
        onClick={() => setOpen((o) => !o)}
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        New campaign
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            minWidth: '200px',
            backgroundColor: C.surface2,
            border: `1px solid ${C.border}`,
            borderRadius: R.card,
            boxShadow: shadows.dropdown,
            zIndex: 200,
            overflow: 'hidden',
            padding: S[2],
          }}
        >
          <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', padding: `${S[1]} ${S[3]}`, marginBottom: S[1] }}>
            Create campaign
          </div>
          <button
            type="button"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: S[3],
              width: '100%',
              padding: `${S[3]} ${S[4]}`,
              border: 'none',
              borderRadius: R.md,
              background: 'transparent',
              color: C.textPrimary,
              fontFamily: F.body,
              fontSize: '13px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background 0.15s',
            }}
            onClick={() => go('/campaigns/new')}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.surface3; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <span style={{ width: 28, height: 28, borderRadius: R.md, backgroundColor: C.surface3, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M7 3v8" stroke={C.textSecondary} strokeWidth="1.5" strokeLinecap="round"/></svg>
            </span>
            <div>
              <div style={{ fontWeight: 600 }}>Create manually</div>
              <div style={{ fontSize: '11px', color: C.textMuted }}>Full campaign wizard</div>
            </div>
          </button>
          <button
            type="button"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: S[3],
              width: '100%',
              padding: `${S[3]} ${S[4]}`,
              border: 'none',
              borderRadius: R.md,
              background: 'transparent',
              color: C.textPrimary,
              fontFamily: F.body,
              fontSize: '13px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background 0.15s',
            }}
            onClick={() => go('/campaigns/new/freya')}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.primaryGlow; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <span style={{ width: 28, height: 28, borderRadius: R.md, backgroundColor: C.primaryGlow, border: `1px solid rgba(61,220,132,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M7 1.5L13.2 12.8H0.8L7 1.5z" stroke={C.primary} strokeWidth="1.2" strokeLinejoin="round"/><path d="M3.6 9.2h6.8" stroke={C.primary} strokeWidth="1.2" strokeLinecap="round"/></svg>
            </span>
            <div>
              <div style={{ fontWeight: 600, color: C.primary }}>Create with Freya</div>
              <div style={{ fontSize: '11px', color: C.textMuted }}>Freya guides you step by step</div>
            </div>
          </button>
          <button
            type="button"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: S[3],
              width: '100%',
              padding: `${S[3]} ${S[4]}`,
              border: 'none',
              borderRadius: R.md,
              background: 'transparent',
              color: C.textPrimary,
              fontFamily: F.body,
              fontSize: '13px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background 0.15s',
            }}
            onClick={() => go('/campaigns/new/freya?from=file')}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.surface3; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <span style={{ width: 28, height: 28, borderRadius: R.md, backgroundColor: C.surface3, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 2v8m0 0l3-3m-3 3L5 9" stroke={C.textSecondary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 12h12" stroke={C.textSecondary} strokeWidth="1.5" strokeLinecap="round"/></svg>
            </span>
            <div>
              <div style={{ fontWeight: 600 }}>Start from file</div>
              <div style={{ fontSize: '11px', color: C.textMuted }}>Upload brief or doc → Freya builds campaign</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
