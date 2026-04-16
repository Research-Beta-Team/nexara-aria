/**
 * CommandModeToggle — 3-button toggle for platform automation level.
 * Props: size ('sm'|'md'), showLabels (bool)
 */
import { useMemo } from 'react';
import useStore from '../../store/useStore';
import { COMMAND_MODE_OPTIONS, getCommandModeToggleButtonStyles } from '../../config/commandModeTheme';
import { C, R, S, T } from '../../tokens';
import CommandModeGlyph from './CommandModeGlyph';

const MODES = COMMAND_MODE_OPTIONS;

export default function CommandModeToggle({ size = 'md', showLabels = true }) {
  const commandMode = useStore((s) => s.commandMode);
  const setCommandMode = useStore((s) => s.setCommandMode);

  const isSm = size === 'sm';

  const containerStyle = useMemo(() => {
    const base = {
      display: 'inline-flex',
      alignItems: 'center',
      backgroundColor: C.surface,
      padding: '2px',
      gap: '2px',
      transition: T.color,
    };
    if (commandMode === 'manual') {
      return {
        ...base,
        border: `1px dashed ${C.border}`,
        borderRadius: R.sm,
        boxShadow: `inset 0 -3px 0 ${C.redDim}`,
      };
    }
    if (commandMode === 'semi_auto') {
      return {
        ...base,
        border: `1px solid ${C.amber}`,
        borderRadius: R.button,
        backgroundColor: C.amberDim,
        boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${C.amber} 18%, transparent)`,
      };
    }
    return {
      ...base,
      border: `1px solid color-mix(in srgb, ${C.green} 45%, ${C.border})`,
      borderRadius: R.md,
      boxShadow: `0 0 0 1px color-mix(in srgb, ${C.green} 22%, transparent), 0 0 20px ${C.greenDim}`,
    };
  }, [commandMode]);

  return (
    <div style={containerStyle} role="group" aria-label="Command mode">
      {MODES.map((mode) => {
        const active = commandMode === mode.id;
        return (
          <button
            key={mode.id}
            type="button"
            title={mode.sublabel}
            onClick={() => setCommandMode(mode.id)}
            style={getCommandModeToggleButtonStyles(mode, active, isSm)}
          >
            <CommandModeGlyph modeId={mode.id} size={isSm ? 12 : 14} color={active ? mode.color : C.textMuted} />
            {showLabels && (
              <span>{mode.label}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
