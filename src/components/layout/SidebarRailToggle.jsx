import { PanelLeft, PanelLeftClose } from 'lucide-react';
import { C, R, T } from '../../tokens';

/**
 * Toggles sidebar between expanded (labels) and collapsed (icon rail).
 * Web/desktop only — parent should not render on mobile drawer.
 */
export default function SidebarRailToggle({ collapsed, onClick }) {
  const label = collapsed ? 'Expand sidebar' : 'Collapse sidebar';

  return (
    <button
      type="button"
      aria-expanded={!collapsed}
      aria-label={label}
      title={label}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        width: '34px',
        height: '34px',
        padding: 0,
        borderRadius: R.button,
        border: `1px solid ${C.border}`,
        backgroundColor: C.surface2,
        color: C.textSecondary,
        cursor: 'pointer',
        transition: T.color,
      }}
    >
      {collapsed ? (
        <PanelLeft size={18} strokeWidth={2} aria-hidden />
      ) : (
        <PanelLeftClose size={18} strokeWidth={2} aria-hidden />
      )}
    </button>
  );
}
