/**
 * Visual system per platform command mode (manual vs semi-auto vs agentic).
 * Used by AppLayout, CommandModeBanner, CommandModeToggle, and optional hooks.
 */

import { C, F, S } from '../tokens';

const IDS = ['manual', 'semi_auto', 'fully_agentic'];

/** Shared list for toggles, top bar menu, and settings pickers */
export const COMMAND_MODE_OPTIONS = [
  {
    id: 'manual',
    label: 'Manual',
    sublabel: 'You trigger everything',
    color: C.red,
    dim: C.redDim,
  },
  {
    id: 'semi_auto',
    label: 'Semi-Auto',
    sublabel: 'Agents suggest, you approve',
    color: C.amber,
    dim: C.amberDim,
  },
  {
    id: 'fully_agentic',
    label: 'Agentic',
    sublabel: 'Agents operate autonomously',
    color: C.green,
    dim: C.greenDim,
  },
];

export function normalizeCommandMode(mode) {
  if (IDS.includes(mode)) return mode;
  return 'semi_auto';
}

/** Banner + main column accents — distinct UX per automation level */
export function getCommandModeTheme(mode) {
  const id = normalizeCommandMode(mode);
  if (id === 'manual') {
    return {
      id,
      accent: C.red,
      accentDim: C.redDim,
      label: 'Manual control',
      subtitle: 'Agents stay idle until you explicitly run them. Suited to audits, training, and strict sign-off.',
      badge: 'Operator',
      bannerStyle: {
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: S[5],
        width: '100%',
        boxSizing: 'border-box',
        minHeight: '56px',
        padding: `${S[4]} ${S[2]}`,
        backgroundColor: C.redDim,
        borderBottom: `1px solid ${C.red}`,
        borderLeft: `4px solid ${C.red}`,
      },
      titleStyle: {
        fontFamily: F.mono,
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: C.red,
      },
      subtitleStyle: {
        fontFamily: F.body,
        fontSize: '12px',
        color: C.textSecondary,
        flex: 1,
        lineHeight: 1.45,
      },
      mainSurroundStyle: {
        borderLeft: `4px solid ${C.red}`,
        backgroundImage: `linear-gradient(90deg, ${C.redDim} 0%, transparent 72px)`,
      },
    };
  }
  if (id === 'semi_auto') {
    return {
      id,
      accent: C.amber,
      accentDim: C.amberDim,
      label: 'Semi-automatic',
      subtitle: 'Freya drafts and proposes; you approve sensitive sends. Best default for most GTM teams.',
      badge: 'Review',
      bannerStyle: {
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: S[5],
        width: '100%',
        boxSizing: 'border-box',
        minHeight: '56px',
        padding: `${S[4]} ${S[2]}`,
        background: `repeating-linear-gradient(-45deg, ${C.amberDim}, ${C.amberDim} 6px, transparent 6px, transparent 12px)`,
        borderBottom: `1px solid ${C.amber}`,
        borderTop: `2px solid ${C.amber}`,
      },
      titleStyle: {
        fontFamily: F.display,
        fontSize: '12px',
        fontWeight: 700,
        letterSpacing: '0.04em',
        color: C.amber,
      },
      subtitleStyle: {
        fontFamily: F.body,
        fontSize: '12px',
        color: C.textSecondary,
        flex: 1,
        lineHeight: 1.45,
      },
      mainSurroundStyle: {
        backgroundImage: `linear-gradient(180deg, ${C.amberDim} 0%, transparent 64px)`,
      },
    };
  }
  // fully_agentic
  return {
    id,
    accent: C.green,
    accentDim: C.greenDim,
    label: 'Fully agentic',
    subtitle: 'Agents coordinate on schedules and triggers; you get digests, alerts, and escalation paths.',
    badge: 'Autopilot',
    bannerStyle: {
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: S[5],
      width: '100%',
      boxSizing: 'border-box',
      minHeight: '56px',
      padding: `${S[4]} ${S[2]}`,
      backgroundColor: C.greenDim,
      borderBottom: `1px solid ${C.green}`,
      boxShadow: `inset 0 0 24px ${C.greenDim}`,
    },
    titleStyle: {
      fontFamily: F.display,
      fontSize: '12px',
      fontWeight: 800,
      letterSpacing: '0.06em',
      color: C.green,
    },
    subtitleStyle: {
      fontFamily: F.body,
      fontSize: '12px',
      color: C.textSecondary,
      flex: 1,
      lineHeight: 1.45,
    },
    mainSurroundStyle: {
      borderLeft: 'none',
      backgroundImage: `radial-gradient(120% 80% at 50% 0%, ${C.greenDim} 0%, transparent 55%)`,
    },
  };
}

/** Per-mode button chrome for CommandModeToggle (inactive + active layers). */
export function getCommandModeToggleButtonStyles(modeDef, active, isSm) {
  const { id, color, dim } = modeDef;
  const padY = isSm ? '3px' : '5px';
  const padX = isSm ? S[2] : S[3];
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: isSm ? '4px' : S[2],
    padding: `${padY} ${padX}`,
    borderRadius: id === 'fully_agentic' ? '10px' : id === 'semi_auto' ? '6px' : '4px',
    fontFamily: F.body,
    fontSize: isSm ? '11px' : '12px',
    fontWeight: active ? 700 : 500,
    cursor: 'pointer',
    transition: 'background-color 0.18s ease, color 0.18s ease, border-color 0.18s ease, box-shadow 0.22s ease',
    whiteSpace: 'nowrap',
  };

  if (id === 'manual') {
    return {
      ...base,
      border: active ? `1px solid ${color}` : `1px dashed ${C.border}`,
      backgroundColor: active ? dim : 'transparent',
      color: active ? color : C.textMuted,
      boxShadow: active ? `inset 0 -2px 0 ${color}` : 'none',
    };
  }
  if (id === 'semi_auto') {
    return {
      ...base,
      border: `1px solid ${active ? color : 'transparent'}`,
      backgroundColor: active ? dim : C.surface2,
      color: active ? color : C.textMuted,
      boxShadow: active ? `0 0 0 1px ${color}` : 'none',
    };
  }
  return {
    ...base,
    border: '1px solid transparent',
    backgroundColor: active ? dim : 'transparent',
    color: active ? color : C.textMuted,
    boxShadow: active
      ? `0 0 0 1px ${color}, 0 0 14px ${dim}`
      : 'none',
  };
}
