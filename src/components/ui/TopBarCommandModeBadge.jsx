import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import useStore from '../../store/useStore';
import useToast from '../../hooks/useToast';
import CommandModeGlyph from './CommandModeGlyph';
import {
  COMMAND_MODE_OPTIONS,
  getCommandModeTheme,
  normalizeCommandMode,
} from '../../config/commandModeTheme';
import { C, F, R, S, T, shadows, Z } from '../../tokens';

const EASE = 'cubic-bezier(0.34, 1.22, 0.64, 1)';

/** Short label on the trigger chip */
const SHORT_LABEL = {
  manual: 'Manual',
  semi_auto: 'Semi-Auto',
  fully_agentic: 'Agentic',
};

export default function TopBarCommandModeBadge({ isMobile = false, open, onToggle, onClose }) {
  const commandMode = useStore((s) => s.commandMode);
  const setCommandMode = useStore((s) => s.setCommandMode);
  const navigate = useNavigate();
  const toast = useToast();
  const rootRef = useRef(null);
  const mode = normalizeCommandMode(commandMode);
  const t = getCommandModeTheme(mode);
  const short = SHORT_LABEL[mode] ?? 'Semi-Auto';

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open, onClose]);

  /** Desktop: anchor right under the mode chip so the menu does not spill over Search. */
  const panelTransform = open
    ? 'translateY(0) scale(1)'
    : 'translateY(-8px) scale(0.98)';

  const panelStyle = {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    left: isMobile ? 0 : 'auto',
    right: 0,
    transform: panelTransform,
    opacity: open ? 1 : 0,
    visibility: open ? 'visible' : 'hidden',
    pointerEvents: open ? 'auto' : 'none',
    transition: `opacity 0.22s ease, transform 0.28s ${EASE}, visibility 0s linear ${open ? '0s' : '0.24s'}`,
    zIndex: Z.sticky + 20,
    minWidth: isMobile ? 'min(100%, 260px)' : '260px',
    maxWidth: isMobile ? '100%' : '320px',
    padding: S[2],
    borderRadius: R.md,
    backgroundColor: C.surface,
    border: `1px solid ${C.border}`,
    boxShadow: shadows.dropdown,
    display: 'flex',
    flexDirection: 'column',
    gap: S[1],
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
        aria-haspopup="listbox"
        aria-controls="topbar-command-mode-panel"
        title={`${t.label} — change automation level`}
        onClick={onToggle}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: S[3],
          padding: `${S[2]} ${S[3]}`,
          borderRadius: R.pill,
          border: `1px solid color-mix(in srgb, ${t.accent} 50%, ${C.border})`,
          backgroundColor: t.accentDim,
          color: t.accent,
          cursor: 'pointer',
          fontFamily: F.mono,
          fontSize: isMobile ? '10px' : '11px',
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          flexShrink: 0,
          transition: T.color,
        }}
      >
        <CommandModeGlyph modeId={mode} size={isMobile ? 12 : 14} color={t.accent} />
        <span>{short}</span>
        <ChevronDown
          size={14}
          strokeWidth={2}
          aria-hidden
          style={{
            opacity: 0.85,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: `transform 0.25s ${EASE}`,
          }}
        />
      </button>

      <div
        id="topbar-command-mode-panel"
        role="listbox"
        aria-label="Command mode"
        style={panelStyle}
      >
        {COMMAND_MODE_OPTIONS.map((opt) => {
          const active = commandMode === opt.id;
          const theme = getCommandModeTheme(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              role="option"
              aria-selected={active}
              title={opt.sublabel}
              onClick={() => {
                setCommandMode(opt.id);
                toast.info(`Command mode: ${opt.label}`);
                onClose();
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'flex-start',
                gap: S[3],
                textAlign: 'left',
                padding: `${S[2]} ${S[3]}`,
                borderRadius: R.sm,
                border: active ? `1px solid ${theme.accent}` : `1px solid transparent`,
                backgroundColor: active ? theme.accentDim : 'transparent',
                cursor: 'pointer',
                transition: T.base,
              }}
            >
              <CommandModeGlyph modeId={opt.id} size={18} color={active ? theme.accent : C.textMuted} />
              <span style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 700, color: active ? theme.accent : C.textPrimary }}>
                  {opt.label}
                </span>
                <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, lineHeight: 1.35 }}>
                  {opt.sublabel}
                </span>
              </span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => {
            navigate('/settings#settings-command-mode');
            toast.info('Agents section — Command Mode card');
            onClose();
          }}
          style={{
            width: '100%',
            padding: `${S[2]} ${S[3]}`,
            borderRadius: R.sm,
            border: `1px dashed ${C.border}`,
            backgroundColor: C.surface2,
            color: C.textSecondary,
            fontFamily: F.mono,
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          Advanced in Settings
        </button>
      </div>
    </div>
  );
}
