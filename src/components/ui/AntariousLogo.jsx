/**
 * Antarious Logo — Logo & Mark per Brand Guidelines v1.1
 * - Dot: Sage #4A7C6F (the only brand colour in the mark)
 * - Slash form: Ink #1C2B27 on light bg, white on dark bg
 * - Wordmark: Outfit 800 (closest match to custom geometric rounded)
 */
const SAGE = '#4A7C6F';
const INK = '#1C2B27';

export default function AntariousLogo({ variant = 'dark', height = 28, showWordmark = true }) {
  const slashColor = variant === 'dark' ? '#FFFFFF' : INK;
  const wordmarkColor = variant === 'dark' ? 'var(--c-primary)' : INK;
  const slashFill = showWordmark && variant === 'dark' ? 'currentColor' : slashColor;

  const markHeight = height;
  const markWidth = height * (32 / 24);
  const dotR = (height / 24) * 2.5;
  const dotCx = (height / 24) * 5;
  const dotCy = height / 2;

  const svgStyle = {
    flexShrink: 0,
    ...(variant === 'dark' && { backgroundColor: 'var(--c-border-hover)' }),
    ...(showWordmark && variant === 'dark' && {
      backgroundClip: 'unset',
      WebkitBackgroundClip: 'unset',
      color: 'rgba(74, 124, 111, 1)',
    }),
  };

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: (height / 24) * 4 }}>
      {/* Geometric mark: dot + slash A */}
      <svg
        width={markWidth}
        height={markHeight}
        viewBox="0 0 32 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={svgStyle}
        aria-hidden
      >
        {/* The Dot — Sage #4A7C6F */}
        <circle cx="5" cy="12" r="2.5" fill={SAGE} />
        {/* The Slash Form — diagonal A with notch (Ink on light, white on dark) */}
        <path
          d="M12 21 L16 3 L20 21 L18 21 L16 13 L14 21 Z"
          fill={slashFill}
          fillRule="evenodd"
        />
      </svg>
      {showWordmark && (
        <span
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: `${height * 0.7}px`,
            fontWeight: 800,
            color: wordmarkColor,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            whiteSpace: 'nowrap',
          }}
        >
          Antarious
        </span>
      )}
    </div>
  );
}
