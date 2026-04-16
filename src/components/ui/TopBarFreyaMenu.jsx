import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain,
  ChevronDown,
  Database,
  LayoutList,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import useToast from '../../hooks/useToast';
import FreyaLogo from './FreyaLogo';
import { C, F, R, S, T, shadows, Z } from '../../tokens';

const EASE = 'cubic-bezier(0.34, 1.22, 0.64, 1)';

const ACTIONS = [
  {
    id: 'chat',
    label: 'Ask Freya',
    hint: 'Open co-pilot panel',
    icon: MessageSquare,
    primary: true,
  },
  {
    id: 'workflows',
    label: 'Workflow center',
    hint: 'Multi-agent runs',
    icon: LayoutList,
    path: '/aria/workflows',
  },
  {
    id: 'brain',
    label: 'Freya Intelligence',
    hint: 'Strategy & reasoning hub',
    icon: Brain,
    path: '/aria-brain',
  },
  {
    id: 'memory',
    label: 'Freya Memory',
    hint: 'Brand & campaign context',
    icon: Database,
    path: '/aria/memory',
  },
  {
    id: 'briefer',
    label: 'Campaign briefer',
    hint: 'Goal → brief in one flow',
    icon: Sparkles,
    path: '/campaigns/briefer',
  },
];

export default function TopBarFreyaMenu({ isMobile = false, onFreyaOpen }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const navigate = useNavigate();
  const toast = useToast();

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

  const panelTransform = open
    ? (isMobile ? 'translateY(0) scale(1)' : 'translateX(0) translateY(0) scale(1)')
    : (isMobile ? 'translateY(-8px) scale(0.98)' : 'translateX(8px) translateY(-6px) scale(0.98)');

  const panelStyle = {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    transform: panelTransform,
    opacity: open ? 1 : 0,
    visibility: open ? 'visible' : 'hidden',
    pointerEvents: open ? 'auto' : 'none',
    transition: `opacity 0.22s ease, transform 0.28s ${EASE}, visibility 0s linear ${open ? '0s' : '0.24s'}`,
    zIndex: Z.sticky + 30,
    minWidth: isMobile ? 'min(100vw - 24px, 300px)' : '280px',
    maxWidth: isMobile ? 'calc(100vw - 24px)' : '320px',
    padding: S[3],
    borderRadius: R.card,
    backgroundColor: C.surface,
    border: `1px solid color-mix(in srgb, ${C.primary} 28%, ${C.border})`,
    boxShadow: `${shadows.dropdown}, 0 0 40px color-mix(in srgb, ${C.primary} 12%, transparent)`,
  };

  const handleAction = (action) => {
    if (action.id === 'chat') {
      onFreyaOpen?.();
      toast.info('Freya panel opened');
      setOpen(false);
      return;
    }
    if (action.path) {
      navigate(action.path);
      toast.info(`Opened ${action.label}`);
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        title="Freya — co-pilot & agent tools"
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: S[2],
          minHeight: isMobile ? '40px' : '38px',
          padding: isMobile ? `0 ${S[3]}` : `0 ${S[4]}`,
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${C.primaryGlow} 0%, color-mix(in srgb, ${C.primary} 14%, ${C.surface2}) 100%)`,
          border: `1px solid color-mix(in srgb, ${C.primary} 45%, ${C.border})`,
          borderRadius: R.pill,
          color: C.primary,
          cursor: 'pointer',
          transition: T.base,
          boxShadow: shadows.glowSm,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = shadows.glow;
          e.currentTarget.style.borderColor = `color-mix(in srgb, ${C.primary} 65%, ${C.border})`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = shadows.glowSm;
          e.currentTarget.style.borderColor = `color-mix(in srgb, ${C.primary} 45%, ${C.border})`;
        }}
      >
        <FreyaLogo size={isMobile ? 16 : 15} />
        {!isMobile && (
          <span style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, letterSpacing: '0.02em', color: C.textPrimary }}>
            Freya
          </span>
        )}
        <ChevronDown
          size={16}
          strokeWidth={2}
          aria-hidden
          style={{
            color: C.primary,
            opacity: 0.9,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: `transform 0.25s ${EASE}`,
          }}
        />
      </button>

      <div role="menu" aria-label="Freya shortcuts" style={panelStyle}>
        <div
          style={{
            fontFamily: F.mono,
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: C.textMuted,
            textTransform: 'uppercase',
            marginBottom: S[2],
          }}
        >
          Co-pilot
        </div>
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              type="button"
              role="menuitem"
              onClick={() => handleAction(action)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'flex-start',
                gap: S[3],
                textAlign: 'left',
                padding: `${S[2]} ${S[2]}`,
                marginBottom: S[1],
                borderRadius: R.sm,
                border: action.primary ? `1px solid color-mix(in srgb, ${C.primary} 35%, ${C.border})` : '1px solid transparent',
                backgroundColor: action.primary ? C.primaryGlow : 'transparent',
                cursor: 'pointer',
                transition: T.base,
              }}
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '34px',
                  height: '34px',
                  borderRadius: R.button,
                  backgroundColor: action.primary ? C.surface2 : C.surface3,
                  color: action.primary ? C.primary : C.textSecondary,
                  flexShrink: 0,
                }}
              >
                <Icon size={18} strokeWidth={2} aria-hidden />
              </span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>{action.label}</span>
                <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, lineHeight: 1.35 }}>{action.hint}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
