/**
 * Freya — co-pilot mark: geometric F + sage neural node (Antarious brand)
 * Use in TopBar, sidebar, agent avatars, and chat entry points.
 */
import { C } from '../../tokens';

const SAGE = '#4A7C6F';

const DEFAULT_SIZE = 24;

export default function FreyaLogo({ size = DEFAULT_SIZE, color, ariaHidden = true }) {
  const stroke = color ?? 'currentColor';
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
      <circle cx="8.5" cy="9" r="2.4" fill={SAGE} opacity={0.95} />
      <circle cx="8.5" cy="9" r="3.6" stroke={SAGE} strokeWidth="0.85" opacity={0.35} />
      <path
        d="M6.25 5.5V18.5M6.25 5.5H16.25M6.25 11.25H13.25"
        stroke={stroke}
        strokeWidth="2.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FreyaLogoSage({ size = DEFAULT_SIZE, ariaHidden = true }) {
  return <FreyaLogo size={size} color={C.primary} ariaHidden={ariaHidden} />;
}
