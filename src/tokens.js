// ─────────────────────────────────────────────
//  NEXARA Design Tokens
//  Single source of truth — import from here,
//  never hardcode values in components.
// ─────────────────────────────────────────────

// ── Colors ───────────────────────────────────
export const C = {
  // Backgrounds
  bg:       '#070D09',
  surface:  '#0C1510',
  surface2: '#111B14',
  surface3: '#162019',

  // Borders
  border:   '#1C2E22',
  borderHover: '#2A4433',

  // Brand accents
  primary:  '#3DDC84',
  primaryDim: '#2AA860',
  primaryGlow: 'rgba(61,220,132,0.15)',
  secondary: '#5EEAD4',
  secondaryDim: '#3DBFAB',

  // Text
  textPrimary:   '#DFF0E8',
  textSecondary: '#6B9478',
  textMuted:     '#3A5242',
  textInverse:   '#070D09',

  // Semantic
  red:    '#FF6E7A',
  redDim: 'rgba(255,110,122,0.15)',
  amber:  '#F5C842',
  amberDim: 'rgba(245,200,66,0.15)',
  green:  '#3DDC84',
  greenDim: 'rgba(61,220,132,0.15)',

  // Overlays
  overlay: 'rgba(7,13,9,0.7)',
  overlayHeavy: 'rgba(7,13,9,0.92)',
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
  card:    '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(28,46,34,0.8)',
  cardHover: '0 4px 16px rgba(0,0,0,0.5), 0 0 0 1px rgba(61,220,132,0.2)',
  glow:    '0 0 20px rgba(61,220,132,0.2)',
  glowSm:  '0 0 8px rgba(61,220,132,0.15)',
  modal:   '0 24px 64px rgba(0,0,0,0.8)',
  dropdown:'0 8px 24px rgba(0,0,0,0.6), 0 0 0 1px rgba(28,46,34,1)',
  inset:   'inset 0 1px 3px rgba(0,0,0,0.4)',
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
    border: `1px solid rgba(61,220,132,0.2)`,
  },
  red: {
    backgroundColor: C.redDim,
    color: C.red,
    border: `1px solid rgba(255,110,122,0.2)`,
  },
  amber: {
    backgroundColor: C.amberDim,
    color: C.amber,
    border: `1px solid rgba(245,200,66,0.2)`,
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
