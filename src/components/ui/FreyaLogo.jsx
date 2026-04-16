/**
 * Freya — product mark: rounded tile + brain glyph (Freya Intelligence hero),
 * or compact vector mark for inline tables when variant="mark".
 *
 * @param {number} [size=24] — Outer tile edge (px); icon scales to ~50%.
 * @param {string} [color] — Glyph stroke (tile default: text inverse on accent).
 * @param {'tile'|'mark'|'lockup'|'auto'} [variant='tile'] — tile: branded square; mark: line-art only; lockup: tile + word; auto → tile.
 * @param {string} [accentColor] — Tile background (default primary token).
 * @param {boolean} [pulse] — Subtle pulse (hero / emphasis only).
 */
import { C, F, R, shadows, T } from '../../tokens';

const DEFAULT_SIZE = 24;

const MARK_VIEWBOX = '0 0 34 24';
const LOCKUP_VIEWBOX = '0 0 72 24';

/** Hero glyph (matches Freya Intelligence page). */
function FreyaBrainGlyph({ px, stroke }) {
  return (
    <svg width={px} height={px} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-4 4 4 4 0 0 1-4-4V6a4 4 0 0 1 4-4Z"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 14v6M8 18l4 2 4-2M12 14a4 4 0 0 0 4-4h2a6 6 0 0 1-6 6"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FreyaMarkVector({ stroke, accent }) {
  return (
    <g>
      <circle cx="6" cy="12" r="2.85" fill={accent} />
      <circle cx="6" cy="12" r="4.15" stroke={accent} strokeWidth="0.9" fill="none" opacity={0.35} />
      <path
        d="M12.5 5.5V18.5M12.5 5.5H22M12.5 11.25H18"
        stroke={stroke}
        strokeWidth="2.05"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

export default function FreyaLogo({
  size = DEFAULT_SIZE,
  color,
  variant = 'tile',
  accentColor,
  ariaHidden = true,
  pulse = false,
}) {
  const resolvedVariant = variant === 'auto' ? 'tile' : variant;
  const stroke = color ?? 'currentColor';
  const accent = accentColor ?? C.primary;
  const markH = size;
  const markW = (size * 34) / 24;

  if (resolvedVariant === 'mark') {
    return (
      <svg
        width={markW}
        height={markH}
        viewBox={MARK_VIEWBOX}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, display: 'block' }}
        aria-hidden={ariaHidden}
      >
        <FreyaMarkVector stroke={stroke} accent={accent} />
      </svg>
    );
  }

  if (resolvedVariant === 'lockup') {
    const h = size;
    const w = (size * 72) / 24;
    return (
      <svg
        width={w}
        height={h}
        viewBox={LOCKUP_VIEWBOX}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, display: 'block' }}
        aria-hidden={ariaHidden}
      >
        <FreyaMarkVector stroke={stroke} accent={accent} />
        <text
          x="30"
          y="16.35"
          fill={stroke}
          fontFamily={F.display}
          fontSize="13.5"
          fontWeight="600"
          letterSpacing="-0.02em"
        >
          Freya
        </text>
      </svg>
    );
  }

  const tileBg = accentColor ?? C.primary;
  const glyphStroke = color ?? C.textInverse;
  const iconPx = Math.max(10, Math.round(size * 0.5));
  const glow = `0 0 20px color-mix(in srgb, ${tileBg} 34%, transparent)`;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: R.card,
        backgroundColor: tileBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `${shadows.glow}, ${glow}`,
        flexShrink: 0,
        animation: pulse ? 'freyaLogoPulse 2s ease-in-out infinite' : undefined,
        transition: T.base,
      }}
      aria-hidden={ariaHidden}
    >
      <FreyaBrainGlyph px={iconPx} stroke={glyphStroke} />
    </div>
  );
}

export function FreyaLogoSage({ size = DEFAULT_SIZE, ariaHidden = true, pulse = false }) {
  return (
    <FreyaLogo
      size={size}
      variant="tile"
      accentColor={C.primary}
      color={C.textInverse}
      ariaHidden={ariaHidden}
      pulse={pulse}
    />
  );
}
