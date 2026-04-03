/**
 * CommandModeToggle — 3-button toggle for platform automation level.
 * Props: size ('sm'|'md'), showLabels (bool)
 */
import useStore from '../../store/useStore';
import { C, F, R, S, T } from '../../tokens';
import CommandModeGlyph from './CommandModeGlyph';

const MODES = [
  {
    id: 'manual',
    label: 'Manual',
    sublabel: 'You trigger everything',
    color: C.red,
    dim: C.redDim,
  },
  {
    id: 'semi_auto',
    label: 'Semi-Auto',
    sublabel: 'Agents suggest, you approve',
    color: C.amber,
    dim: C.amberDim,
  },
  {
    id: 'fully_agentic',
    label: 'Agentic',
    sublabel: 'Agents operate autonomously',
    color: C.green,
    dim: C.greenDim,
  },
];

export default function CommandModeToggle({ size = 'md', showLabels = true }) {
  const commandMode = useStore((s) => s.commandMode);
  const setCommandMode = useStore((s) => s.setCommandMode);

  const isSm = size === 'sm';

  const containerStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: R.button,
    padding: '2px',
    gap: '2px',
  };

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
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: isSm ? '4px' : S[2],
              padding: isSm ? `2px ${S[2]}` : `${S[1]} ${S[3]}`,
              borderRadius: '6px',
              border: 'none',
              backgroundColor: active ? mode.dim : 'transparent',
              color: active ? mode.color : C.textMuted,
              fontFamily: F.body,
              fontSize: isSm ? '11px' : '12px',
              fontWeight: active ? 700 : 500,
              cursor: 'pointer',
              transition: T.color,
              whiteSpace: 'nowrap',
              outline: active ? `1.5px solid ${mode.color}` : '1.5px solid transparent',
            }}
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
