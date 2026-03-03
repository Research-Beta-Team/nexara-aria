import useStore from '../../store/useStore';
import { C, F, R, S, T } from '../../tokens';

/**
 * Toggle between Founder Mode (collapsed sidebar) and Full Team View.
 * Renders at bottom of Sidebar above collapse toggle.
 */
export default function FounderModeToggle() {
  const currentRole = useStore((s) => s.currentRole);
  const setRole = useStore((s) => s.setRole);
  const isFounder = currentRole === 'founder';

  const handleToggle = () => {
    setRole(isFounder ? 'owner' : 'founder');
  };

  return (
    <div
      style={{
        borderTop: `1px solid ${C.border}`,
        padding: S[2],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: S[2],
      }}
    >
      <span
        style={{
          fontFamily: F.body,
          fontSize: '12px',
          color: C.textSecondary,
          flex: 1,
        }}
      >
        {isFounder ? 'Founder Mode' : 'Full Team View'}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={isFounder}
        aria-label={isFounder ? 'Switch to full team view' : 'Switch to founder mode'}
        onClick={handleToggle}
        style={{
          width: '36px',
          height: '20px',
          borderRadius: R.pill,
          border: 'none',
          backgroundColor: isFounder ? C.primary : C.surface3,
          cursor: 'pointer',
          position: 'relative',
          transition: T.color,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: '2px',
            left: isFounder ? '18px' : '2px',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: C.textInverse,
            transition: 'left 0.2s ease',
          }}
        />
      </button>
    </div>
  );
}
