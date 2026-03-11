/**
 * Freya Logo — Co-pilot mark per Antarious Brand Guidelines
 * Stylized "F" (Freya): geometric, sage accent, works at 14–24px.
 * Use in TopBar (Freya button), Sidebar nav, and any Freya entry point.
 */
import { C } from '../../tokens';

const DEFAULT_SIZE = 24;

export default function FreyaLogo({ size = DEFAULT_SIZE, color, ariaHidden = true }) {
  const c = color ?? 'currentColor';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, display: 'block' }}
      aria-hidden={ariaHidden}
    >
      {/* Stylized F: stem + top bar + middle bar (rounded stroke) */}
      <path
        d="M7 6v12M7 6h10M7 12h7"
        stroke={c}
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Sage-colored variant for emphasis (e.g. active state, panels) */
export function FreyaLogoSage({ size = DEFAULT_SIZE, ariaHidden = true }) {
  return <FreyaLogo size={size} color={C.primary} ariaHidden={ariaHidden} />;
}
