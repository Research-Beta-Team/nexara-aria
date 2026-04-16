/**
 * Antarious AI — full lockup from /public/branding/antarious-main.svg, or when
 * `showWordmark` is false (e.g. collapsed sidebar) the vector “A” mark only — same
 * geometry as public/antarious.svg (accent node + letterform).
 *
 * variant:
 * - "dark" — follow app theme: full raster gets a CSS filter on dark UI; compact mark uses tokens.
 * - "light" — full asset as designed; compact mark uses ink-style letter for light surfaces.
 *
 * `showAiSuffix` — kept for API compatibility (full lockup is one raster asset).
 */
import useStore from '../../store/useStore';
import { C } from '../../tokens';

const LOGO_PATH = 'branding/antarious-main.svg';

/** Invert light-theme raster for dark chrome; hue-shift nudges inverted accent toward teal */
const DARK_MODE_LOGO_FILTER =
  'invert(1) hue-rotate(180deg) saturate(1.2) brightness(1.06) contrast(1.05)';

const MARK_VIEWBOX = '0 0 34 24';

function logoSrc() {
  const base = import.meta.env.BASE_URL || '/';
  const path = LOGO_PATH.replace(/^\/+/, '');
  return base.endsWith('/') ? `${base}${path}` : `${base}/${path}`;
}

/** Stylized “A” + accent — first letter of the Antarious wordmark (favicon-aligned). */
function AntariousLetterMark({ height }) {
  const w = (height * 34) / 24;

  return (
    <svg
      width={w}
      height={height}
      viewBox={MARK_VIEWBOX}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, display: 'block' }}
      aria-hidden
      focusable="false"
    >
      <circle cx="6" cy="12" r="2.85" fill={C.primary} />
      <path
        d="M12.5 20.5L16.5 3.5L20.5 20.5H18.35L16.5 12.8L14.65 20.5H12.5Z"
        fill={C.textPrimary}
        fillRule="evenodd"
      />
    </svg>
  );
}

export default function AntariousLogo({
  variant = 'dark',
  height = 28,
  showWordmark = true,
  showAiSuffix = false,
}) {
  const isDarkMode = useStore((s) => s.isDarkMode);
  const applyDarkTreatment = variant === 'dark' && isDarkMode;

  void showAiSuffix;

  if (!showWordmark) {
    return (
      <span
        className="antarious-logo antarious-logo--mark"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          lineHeight: 0,
        }}
      >
        <AntariousLetterMark height={height} />
      </span>
    );
  }

  return (
    <span
      className="antarious-logo"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        lineHeight: 0,
      }}
    >
      <img
        src={logoSrc()}
        alt="Antarious AI"
        style={{
          height: `${height}px`,
          width: 'auto',
          maxWidth: '100%',
          display: 'block',
          objectFit: 'contain',
          ...(applyDarkTreatment ? { filter: DARK_MODE_LOGO_FILTER } : {}),
        }}
        loading="lazy"
        decoding="async"
      />
    </span>
  );
}
