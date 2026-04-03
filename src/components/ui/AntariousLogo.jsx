/**
 * Antarious AI — geometric mark + wordmark (Brand Guidelines v1.1)
 * Dot: sage #4A7C6F. Slash form: cream on dark, ink on light. Optional “AI” suffix.
 */
const SAGE = '#4A7C6F';
const INK = '#1C2B27';
const CREAM = '#FAF8F3';

export default function AntariousLogo({
  variant = 'dark',
  height = 28,
  showWordmark = true,
  showAiSuffix = false,
}) {
  const slashColor = variant === 'dark' ? CREAM : INK;
  const wordmarkColor = variant === 'dark' ? 'var(--c-text-primary)' : INK;
  const aiColor = variant === 'dark' ? 'var(--c-secondary)' : SAGE;

  const markHeight = height;
  const markWidth = height * (32 / 24);

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: (height / 24) * 5,
      }}
      aria-label="Antarious AI"
    >
      <svg
        width={markWidth}
        height={markHeight}
        viewBox="0 0 32 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
        aria-hidden
      >
        <circle cx="6" cy="12" r="2.75" fill={SAGE} />
        <path
          d="M12.5 20.5L16.5 3.5L20.5 20.5H18.35L16.5 12.8L14.65 20.5H12.5Z"
          fill={slashColor}
          fillRule="evenodd"
        />
      </svg>
      {showWordmark && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'baseline',
            gap: (height / 24) * 4,
            fontFamily: "'Outfit', sans-serif",
            fontSize: `${height * 0.68}px`,
            fontWeight: 800,
            color: wordmarkColor,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            whiteSpace: 'nowrap',
          }}
        >
          <span>Antarious</span>
          {showAiSuffix && (
            <span
              style={{
                fontSize: `${height * 0.4}px`,
                fontWeight: 700,
                color: aiColor,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}
            >
              AI
            </span>
          )}
        </span>
      )}
    </div>
  );
}
