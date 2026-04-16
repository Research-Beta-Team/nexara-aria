/**
 * Complete design system per command mode.
 * Manual = technical/precise | Semi-Auto = balanced/collaborative | Agentic = dynamic/alive
 */

import { C, F, R, S } from '../tokens';

// ─────────────────────────────────────────────────────────────
//  MANUAL MODE — Terminal-inspired, precise, operator control
// ─────────────────────────────────────────────────────────────
const MANUAL = {
  id: 'manual',
  label: 'Manual Control',
  
  // Typography — monospace-heavy, technical feel
  typography: {
    headingFont: F.mono,
    bodyFont: F.body,
    dataFont: F.mono,
    headingWeight: 600,
    headingLetterSpacing: '0.02em',
    headingTransform: 'uppercase',
    labelSize: '10px',
    labelWeight: 700,
    labelSpacing: '0.12em',
  },
  
  // Spacing — dense, compact, information-rich
  spacing: {
    cardPadding: S[3],
    sectionGap: S[3],
    itemGap: S[2],
    density: 'compact',
  },
  
  // Surfaces — flat, no gradients, solid borders
  surfaces: {
    cardBg: C.surface,
    cardBorder: `1px solid ${C.border}`,
    cardRadius: '4px',
    cardShadow: 'none',
    hoverBg: C.surface2,
    activeBg: C.redDim,
    stripedBg: `repeating-linear-gradient(0deg, transparent, transparent 28px, ${C.surface2} 28px, ${C.surface2} 56px)`,
  },
  
  // Buttons — sharp, bordered, no fill until active
  button: {
    radius: '3px',
    border: `1px solid ${C.border}`,
    borderActive: `1px solid ${C.red}`,
    bg: 'transparent',
    bgHover: C.surface2,
    bgActive: C.redDim,
    font: F.mono,
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    padding: `${S[1]} ${S[3]}`,
    transition: 'none',
  },
  
  // Primary action button
  buttonPrimary: {
    bg: 'transparent',
    bgHover: C.redDim,
    border: `1px dashed ${C.red}`,
    color: C.red,
  },
  
  // Inputs — terminal style
  input: {
    bg: C.ink,
    border: `1px solid ${C.border}`,
    borderFocus: `1px solid ${C.red}`,
    radius: '2px',
    font: F.mono,
    fontSize: '12px',
    padding: `${S[2]} ${S[3]}`,
    caretColor: C.red,
  },
  
  // Cards — flat, bordered, no depth
  card: {
    bg: C.surface,
    border: `1px solid ${C.border}`,
    borderLeft: `3px solid ${C.red}`,
    radius: '4px',
    shadow: 'none',
    headerBg: C.surface2,
    headerBorder: `1px solid ${C.border}`,
    padding: S[3],
  },
  
  // Tables — dense, grid-like
  table: {
    headerBg: C.surface2,
    headerFont: F.mono,
    headerSize: '10px',
    headerWeight: 700,
    headerSpacing: '0.1em',
    headerTransform: 'uppercase',
    rowBorder: `1px solid ${C.border}`,
    cellPadding: `${S[2]} ${S[3]}`,
    cellFont: F.mono,
    cellSize: '12px',
    stripedBg: C.surface2,
    hoverBg: C.redDim,
  },
  
  // Status indicators — text-based, no animations
  status: {
    dotSize: '6px',
    dotBorder: `1px solid currentColor`,
    animation: 'none',
    successColor: C.green,
    warningColor: C.amber,
    errorColor: C.red,
    pendingStyle: 'dashed',
  },
  
  // Badges — outlined, minimal
  badge: {
    bg: 'transparent',
    border: `1px solid currentColor`,
    radius: '2px',
    font: F.mono,
    fontSize: '9px',
    fontWeight: 700,
    padding: '2px 6px',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
  
  // Icons — monochrome, small
  icon: {
    size: 14,
    strokeWidth: 2,
    color: C.textMuted,
    activeColor: C.red,
  },
  
  // Motion — none, static
  motion: {
    transition: 'none',
    hover: 'none',
    entrance: 'none',
  },
  
  // Data visualization
  chart: {
    gridColor: C.border,
    gridDash: '2,4',
    lineWidth: 1.5,
    dotSize: 3,
    barRadius: 0,
    areaOpacity: 0.1,
    tooltipBg: C.ink,
    tooltipBorder: `1px solid ${C.border}`,
    tooltipFont: F.mono,
  },
  
  // Layout modifiers
  layout: {
    maxWidth: '100%',
    contentPadding: S[4],
    sidebarWidth: '200px',
    headerHeight: '48px',
  },
};

// ─────────────────────────────────────────────────────────────
//  SEMI-AUTO MODE — Balanced, collaborative, review-focused
// ─────────────────────────────────────────────────────────────
const SEMI_AUTO = {
  id: 'semi_auto',
  label: 'Semi-Automatic',
  
  typography: {
    headingFont: F.display,
    bodyFont: F.body,
    dataFont: F.mono,
    headingWeight: 700,
    headingLetterSpacing: '-0.01em',
    headingTransform: 'none',
    labelSize: '11px',
    labelWeight: 600,
    labelSpacing: '0.04em',
  },
  
  spacing: {
    cardPadding: S[4],
    sectionGap: S[4],
    itemGap: S[3],
    density: 'comfortable',
  },
  
  surfaces: {
    cardBg: C.surface,
    cardBorder: `1px solid ${C.border}`,
    cardRadius: R.card,
    cardShadow: `0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)`,
    hoverBg: C.surface2,
    activeBg: C.amberDim,
    stripedBg: `linear-gradient(180deg, ${C.surface} 0%, ${C.surface2} 100%)`,
  },
  
  button: {
    radius: R.button,
    border: `1px solid ${C.border}`,
    borderActive: `1px solid ${C.amber}`,
    bg: C.surface2,
    bgHover: C.surface3,
    bgActive: C.amberDim,
    font: F.body,
    fontSize: '13px',
    fontWeight: 600,
    textTransform: 'none',
    letterSpacing: '0',
    padding: `${S[2]} ${S[4]}`,
    transition: 'all 0.15s ease',
  },
  
  buttonPrimary: {
    bg: C.amber,
    bgHover: '#E5AC22',
    border: 'none',
    color: C.ink,
  },
  
  input: {
    bg: C.surface,
    border: `1px solid ${C.border}`,
    borderFocus: `1px solid ${C.amber}`,
    radius: R.input,
    font: F.body,
    fontSize: '14px',
    padding: `${S[2]} ${S[3]}`,
    caretColor: C.amber,
  },
  
  card: {
    bg: C.surface,
    border: `1px solid ${C.border}`,
    borderLeft: 'none',
    radius: R.card,
    shadow: `0 2px 8px rgba(0,0,0,0.1)`,
    headerBg: `linear-gradient(180deg, ${C.surface2} 0%, ${C.surface} 100%)`,
    headerBorder: `1px solid ${C.border}`,
    padding: S[4],
  },
  
  table: {
    headerBg: C.surface2,
    headerFont: F.body,
    headerSize: '12px',
    headerWeight: 600,
    headerSpacing: '0.02em',
    headerTransform: 'none',
    rowBorder: `1px solid ${C.border}`,
    cellPadding: `${S[3]} ${S[4]}`,
    cellFont: F.body,
    cellSize: '13px',
    stripedBg: `rgba(251, 191, 36, 0.04)`,
    hoverBg: C.amberDim,
  },
  
  status: {
    dotSize: '8px',
    dotBorder: 'none',
    animation: 'none',
    successColor: C.green,
    warningColor: C.amber,
    errorColor: C.red,
    pendingStyle: 'solid',
  },
  
  badge: {
    bg: C.amberDim,
    border: `1px solid ${C.amber}`,
    radius: R.sm,
    font: F.body,
    fontSize: '11px',
    fontWeight: 600,
    padding: '3px 8px',
    textTransform: 'none',
    letterSpacing: '0',
  },
  
  icon: {
    size: 16,
    strokeWidth: 1.75,
    color: C.textSecondary,
    activeColor: C.amber,
  },
  
  motion: {
    transition: 'all 0.15s ease',
    hover: 'transform 0.12s ease',
    entrance: 'fadeIn 0.2s ease',
  },
  
  chart: {
    gridColor: C.border,
    gridDash: '4,4',
    lineWidth: 2,
    dotSize: 4,
    barRadius: 4,
    areaOpacity: 0.2,
    tooltipBg: C.surface,
    tooltipBorder: `1px solid ${C.amber}`,
    tooltipFont: F.body,
  },
  
  layout: {
    maxWidth: '1400px',
    contentPadding: S[5],
    sidebarWidth: '220px',
    headerHeight: '56px',
  },
};

// ─────────────────────────────────────────────────────────────
//  AGENTIC MODE — Dynamic, alive, intelligent, autonomous
// ─────────────────────────────────────────────────────────────
const AGENTIC = {
  id: 'fully_agentic',
  label: 'Fully Agentic',
  
  typography: {
    headingFont: F.display,
    bodyFont: F.body,
    dataFont: F.body,
    headingWeight: 800,
    headingLetterSpacing: '-0.02em',
    headingTransform: 'none',
    labelSize: '12px',
    labelWeight: 600,
    labelSpacing: '0.02em',
  },
  
  spacing: {
    cardPadding: S[5],
    sectionGap: S[5],
    itemGap: S[4],
    density: 'spacious',
  },
  
  surfaces: {
    cardBg: `linear-gradient(145deg, ${C.surface} 0%, ${C.surface2} 100%)`,
    cardBorder: `1px solid color-mix(in srgb, ${C.green} 25%, ${C.border})`,
    cardRadius: '16px',
    cardShadow: `0 4px 20px rgba(16, 185, 129, 0.08), 0 1px 3px rgba(0,0,0,0.1)`,
    hoverBg: C.surface2,
    activeBg: C.greenDim,
    stripedBg: 'none',
  },
  
  button: {
    radius: '12px',
    border: `1px solid color-mix(in srgb, ${C.green} 40%, transparent)`,
    borderActive: `1px solid ${C.green}`,
    bg: `linear-gradient(135deg, ${C.surface2} 0%, ${C.surface} 100%)`,
    bgHover: C.greenDim,
    bgActive: C.green,
    font: F.display,
    fontSize: '14px',
    fontWeight: 700,
    textTransform: 'none',
    letterSpacing: '-0.01em',
    padding: `${S[3]} ${S[5]}`,
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  buttonPrimary: {
    bg: `linear-gradient(135deg, ${C.green} 0%, #059669 100%)`,
    bgHover: `linear-gradient(135deg, #059669 0%, #047857 100%)`,
    border: 'none',
    color: '#fff',
    shadow: `0 4px 14px rgba(16, 185, 129, 0.35)`,
  },
  
  input: {
    bg: `linear-gradient(180deg, ${C.surface} 0%, ${C.surface2} 100%)`,
    border: `1px solid ${C.border}`,
    borderFocus: `1px solid ${C.green}`,
    radius: '12px',
    font: F.body,
    fontSize: '14px',
    padding: `${S[3]} ${S[4]}`,
    caretColor: C.green,
    shadow: `inset 0 1px 2px rgba(0,0,0,0.06)`,
  },
  
  card: {
    bg: `linear-gradient(160deg, ${C.surface} 0%, ${C.surface2} 50%, ${C.surface} 100%)`,
    border: `1px solid color-mix(in srgb, ${C.green} 20%, ${C.border})`,
    borderLeft: 'none',
    radius: '16px',
    shadow: `0 8px 32px rgba(16, 185, 129, 0.1), 0 2px 8px rgba(0,0,0,0.08)`,
    headerBg: 'transparent',
    headerBorder: 'none',
    padding: S[5],
    glow: `0 0 40px rgba(16, 185, 129, 0.12)`,
  },
  
  table: {
    headerBg: 'transparent',
    headerFont: F.display,
    headerSize: '12px',
    headerWeight: 700,
    headerSpacing: '0',
    headerTransform: 'none',
    rowBorder: `1px solid color-mix(in srgb, ${C.green} 15%, ${C.border})`,
    cellPadding: `${S[4]} ${S[4]}`,
    cellFont: F.body,
    cellSize: '14px',
    stripedBg: `rgba(16, 185, 129, 0.03)`,
    hoverBg: C.greenDim,
    rowRadius: '8px',
  },
  
  status: {
    dotSize: '10px',
    dotBorder: 'none',
    animation: 'pulse 2s ease-in-out infinite',
    glow: `0 0 12px currentColor`,
    successColor: C.green,
    warningColor: C.amber,
    errorColor: C.red,
    pendingStyle: 'animated',
  },
  
  badge: {
    bg: C.greenDim,
    border: 'none',
    radius: '20px',
    font: F.display,
    fontSize: '11px',
    fontWeight: 700,
    padding: '4px 12px',
    textTransform: 'none',
    letterSpacing: '0',
    glow: `0 2px 8px rgba(16, 185, 129, 0.25)`,
  },
  
  icon: {
    size: 18,
    strokeWidth: 1.5,
    color: C.textSecondary,
    activeColor: C.green,
    glow: `drop-shadow(0 0 4px ${C.green})`,
  },
  
  motion: {
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    hover: 'transform 0.2s ease, box-shadow 0.2s ease',
    entrance: 'slideUp 0.3s ease',
    float: 'float 3s ease-in-out infinite',
  },
  
  chart: {
    gridColor: `color-mix(in srgb, ${C.green} 15%, ${C.border})`,
    gridDash: 'none',
    lineWidth: 2.5,
    dotSize: 5,
    barRadius: 8,
    areaOpacity: 0.3,
    areaGradient: true,
    tooltipBg: C.surface,
    tooltipBorder: `1px solid ${C.green}`,
    tooltipFont: F.body,
    tooltipShadow: `0 8px 24px rgba(16, 185, 129, 0.2)`,
  },
  
  layout: {
    maxWidth: '1600px',
    contentPadding: S[6],
    sidebarWidth: '240px',
    headerHeight: '64px',
  },
  
  // Agentic-specific: AI presence indicators
  aiPresence: {
    orb: {
      size: '12px',
      color: C.green,
      glow: `0 0 20px ${C.green}`,
      animation: 'orbPulse 2.5s ease-in-out infinite',
    },
    thinking: {
      dots: 3,
      color: C.green,
      animation: 'thinkingDots 1.4s ease-in-out infinite',
    },
    wave: {
      height: '3px',
      color: C.green,
      animation: 'audioWave 1s ease-in-out infinite',
    },
  },
};

// ─────────────────────────────────────────────────────────────
//  Exports
// ─────────────────────────────────────────────────────────────

export const MODE_DESIGNS = {
  manual: MANUAL,
  semi_auto: SEMI_AUTO,
  fully_agentic: AGENTIC,
};

export function getModeDesign(mode) {
  return MODE_DESIGNS[mode] || MODE_DESIGNS.semi_auto;
}

// CSS keyframes for animations (inject once)
export const MODE_KEYFRAMES = `
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.95); }
}

@keyframes orbPulse {
  0%, 100% { box-shadow: 0 0 8px currentColor, 0 0 20px currentColor; transform: scale(1); }
  50% { box-shadow: 0 0 12px currentColor, 0 0 30px currentColor; transform: scale(1.1); }
}

@keyframes thinkingDots {
  0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
  40% { opacity: 1; transform: scale(1); }
}

@keyframes audioWave {
  0%, 100% { transform: scaleY(0.5); }
  50% { transform: scaleY(1); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
`;
