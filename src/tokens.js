// ─────────────────────────────────────────────
//  NEXARA Design Tokens
//  All color values resolve from CSS variables
//  defined in index.css. Switching data-theme
//  on <html> swaps the full palette instantly.
// ─────────────────────────────────────────────

// ── Colors ───────────────────────────────────
export const C = {
  // Backgrounds
  bg:       'var(--c-bg)',
  surface:  'var(--c-surface)',
  surface2: 'var(--c-surface2)',
  surface3: 'var(--c-surface3)',

  // Borders
  border:      'var(--c-border)',
  borderHover: 'var(--c-border-hover)',

  // Brand accents
  primary:      'var(--c-primary)',
  primaryDim:   'var(--c-primary-dim)',
  primaryGlow:  'var(--c-primary-glow)',
  secondary:    'var(--c-secondary)',
  secondaryDim: 'var(--c-secondary-dim)',

  // Text
  textPrimary:   'var(--c-text-primary)',
  textSecondary: 'var(--c-text-secondary)',
  textMuted:     'var(--c-text-muted)',
  textInverse:   'var(--c-text-inverse)',

  // Semantic
  red:      'var(--c-red)',
  redDim:   'var(--c-red-dim)',
  amber:    'var(--c-amber)',
  amberDim: 'var(--c-amber-dim)',
  green:    'var(--c-green)',
  greenDim: 'var(--c-green-dim)',

  // Overlays
  overlay:      'var(--c-overlay)',
  overlayHeavy: 'var(--c-overlay-heavy)',
};

// ── Typography ────────────────────────────────
export const F = {
  display: "'Syne', sans-serif",
  body:    "'DM Sans', sans-serif",
  mono:    "'JetBrains Mono', monospace",
};

// ── Border Radius ─────────────────────────────
export const R = {
  sm:     '6px',
  md:     '8px',
  card:   '12px',
  button: '7px',
  input:  '8px',
  pill:   '999px',
  full:   '50%',
};

// ── Spacing (4px base unit) ───────────────────
export const S = {
  1:  '4px',
  2:  '8px',
  3:  '12px',
  4:  '16px',
  5:  '20px',
  6:  '24px',
  7:  '28px',
  8:  '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
};

// ── Shadows ───────────────────────────────────
export const shadows = {
  card:      'var(--shadow-card)',
  cardHover: 'var(--shadow-card-hover)',
  glow:      'var(--shadow-glow)',
  glowSm:    'var(--shadow-glow-sm)',
  modal:     'var(--shadow-modal)',
  dropdown:  'var(--shadow-dropdown)',
  inset:     'var(--shadow-inset)',
};

// ── Z-index scale ─────────────────────────────
export const Z = {
  base:    0,
  raised:  10,
  dropdown:100,
  sticky:  200,
  overlay: 300,
  modal:   400,
  toast:   500,
};

// ── Transitions ───────────────────────────────
export const T = {
  fast:   'all 0.12s ease',
  base:   'all 0.2s ease',
  slow:   'all 0.35s ease',
  color:  'color 0.15s ease, background-color 0.15s ease, border-color 0.15s ease',
};

// ─────────────────────────────────────────────
//  makeStyles — merge style objects cleanly
//  Usage: style={makeStyles(base, conditional && extra)}
// ─────────────────────────────────────────────
export const makeStyles = (...styles) =>
  Object.assign({}, ...styles.filter(Boolean));

// ─────────────────────────────────────────────
//  Common style objects
// ─────────────────────────────────────────────

// ── Card ──────────────────────────────────────
export const cardStyle = {
  backgroundColor: C.surface,
  border: `1px solid ${C.border}`,
  borderRadius: R.card,
  padding: S[6],
};

export const cardHoverStyle = {
  ...cardStyle,
  boxShadow: shadows.cardHover,
  borderColor: C.borderHover,
};

// ── Buttons ───────────────────────────────────
export const btn = {
  primary: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: S[2],
    backgroundColor: C.primary,
    color: C.textInverse,
    border: 'none',
    borderRadius: R.button,
    padding: `${S[2]} ${S[5]}`,
    fontFamily: F.body,
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: T.color,
    whiteSpace: 'nowrap',
  },
  secondary: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: S[2],
    backgroundColor: 'transparent',
    color: C.textPrimary,
    border: `1px solid ${C.border}`,
    borderRadius: R.button,
    padding: `${S[2]} ${S[5]}`,
    fontFamily: F.body,
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: T.base,
    whiteSpace: 'nowrap',
  },
  ghost: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: S[2],
    backgroundColor: 'transparent',
    color: C.textSecondary,
    border: 'none',
    borderRadius: R.button,
    padding: `${S[2]} ${S[3]}`,
    fontFamily: F.body,
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: T.color,
    whiteSpace: 'nowrap',
  },
  danger: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: S[2],
    backgroundColor: C.redDim,
    color: C.red,
    border: `1px solid ${C.red}`,
    borderRadius: R.button,
    padding: `${S[2]} ${S[5]}`,
    fontFamily: F.body,
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: T.color,
    whiteSpace: 'nowrap',
  },
  icon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    color: C.textSecondary,
    border: 'none',
    borderRadius: R.button,
    padding: S[2],
    cursor: 'pointer',
    transition: T.color,
    flexShrink: 0,
  },
};

// ── Input / Textarea ──────────────────────────
export const inputStyle = {
  backgroundColor: C.surface2,
  color: C.textPrimary,
  border: `1px solid ${C.border}`,
  borderRadius: R.input,
  padding: `${S[2]} ${S[3]}`,
  fontFamily: F.body,
  fontSize: '14px',
  width: '100%',
  outline: 'none',
  transition: T.color,
};

export const inputFocusStyle = {
  ...inputStyle,
  borderColor: C.primary,
  boxShadow: `0 0 0 2px ${C.primaryGlow}`,
};

// ── Label ─────────────────────────────────────
export const labelStyle = {
  display: 'block',
  fontFamily: F.body,
  fontSize: '12px',
  fontWeight: 600,
  color: C.textSecondary,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: S[1],
};

// ── Badge ─────────────────────────────────────
export const badge = {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: S[1],
    borderRadius: R.pill,
    padding: `2px ${S[2]}`,
    fontFamily: F.mono,
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.04em',
    whiteSpace: 'nowrap',
  },
  green: {
    backgroundColor: C.greenDim,
    color: C.primary,
    border: `1px solid ${C.primaryGlow}`,
  },
  red: {
    backgroundColor: C.redDim,
    color: C.red,
    border: `1px solid ${C.redDim}`,
  },
  amber: {
    backgroundColor: C.amberDim,
    color: C.amber,
    border: `1px solid ${C.amberDim}`,
  },
  muted: {
    backgroundColor: C.surface3,
    color: C.textSecondary,
    border: `1px solid ${C.border}`,
  },
};

// ── Flex utilities ────────────────────────────
export const flex = {
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowEnd: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
  },
  colCenter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrap: {
    display: 'flex',
    flexWrap: 'wrap',
  },
};

// ── Divider ───────────────────────────────────
export const dividerStyle = {
  borderTop: `1px solid ${C.border}`,
  margin: `${S[4]} 0`,
};

// ── Scrollbar (apply to overflow containers) ──
export const scrollbarStyle = {
  scrollbarWidth: 'thin',
  scrollbarColor: `${C.border} transparent`,
};

// ── Section heading ───────────────────────────
export const sectionHeading = {
  fontFamily: F.display,
  fontSize: '18px',
  fontWeight: 700,
  color: C.textPrimary,
  margin: 0,
};

export const sectionSubheading = {
  fontFamily: F.body,
  fontSize: '13px',
  fontWeight: 400,
  color: C.textSecondary,
  margin: 0,
};

// ── Stat number ───────────────────────────────
export const statNumber = {
  fontFamily: F.mono,
  fontSize: '28px',
  fontWeight: 700,
  color: C.textPrimary,
  lineHeight: 1,
};

export const statLabel = {
  fontFamily: F.body,
  fontSize: '12px',
  fontWeight: 500,
  color: C.textSecondary,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
};
