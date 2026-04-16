/**
 * ModePageWrapper — Wraps any existing page content with mode-aware styling.
 * Applies mode-specific background treatment, spacing, and injects CSS variables.
 * Use this to quickly upgrade existing pages without full rewrites.
 */
import { useEffect } from 'react';
import useCommandModeDesign from '../../hooks/useCommandModeDesign';
import { C } from '../../tokens';

export default function ModePageWrapper({ children, className, style }) {
  const d = useCommandModeDesign();
  const isManual = d.id === 'manual';
  const isAgentic = d.id === 'fully_agentic';

  // Inject CSS variables for mode-aware styling in child components
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--mode-card-bg', typeof d.card.bg === 'string' && d.card.bg.includes('gradient') ? d.surfaces.cardBg : d.card.bg);
    root.style.setProperty('--mode-card-border', d.card.border);
    root.style.setProperty('--mode-card-radius', d.card.radius);
    root.style.setProperty('--mode-card-shadow', d.card.shadow || 'none');
    root.style.setProperty('--mode-card-padding', d.card.padding);
    root.style.setProperty('--mode-button-radius', d.button.radius);
    root.style.setProperty('--mode-button-font', d.button.font);
    root.style.setProperty('--mode-heading-font', d.typography.headingFont);
    root.style.setProperty('--mode-spacing-section', d.spacing.sectionGap);
    root.style.setProperty('--mode-spacing-item', d.spacing.itemGap);
    root.style.setProperty('--mode-accent', isAgentic ? C.green : isManual ? C.red : C.amber);
    root.style.setProperty('--mode-accent-dim', isAgentic ? C.greenDim : isManual ? C.redDim : C.amberDim);
    
    return () => {
      root.style.removeProperty('--mode-card-bg');
      root.style.removeProperty('--mode-card-border');
      root.style.removeProperty('--mode-card-radius');
      root.style.removeProperty('--mode-card-shadow');
      root.style.removeProperty('--mode-card-padding');
      root.style.removeProperty('--mode-button-radius');
      root.style.removeProperty('--mode-button-font');
      root.style.removeProperty('--mode-heading-font');
      root.style.removeProperty('--mode-spacing-section');
      root.style.removeProperty('--mode-spacing-item');
      root.style.removeProperty('--mode-accent');
      root.style.removeProperty('--mode-accent-dim');
    };
  }, [d, isManual, isAgentic]);

  const wrapperStyle = {
    width: '100%',
    maxWidth: d.layout.maxWidth,
    margin: '0 auto',
    padding: d.layout.contentPadding,
    animation: isAgentic ? 'slideUp 0.3s ease' : isManual ? 'none' : 'fadeIn 0.2s ease',
    // Mode-specific background treatment
    '--card-bg': d.card.bg,
    '--card-border': d.card.border,
    '--card-radius': d.card.radius,
    '--card-shadow': d.card.shadow,
    ...style,
  };

  return (
    <div style={wrapperStyle} className={className} data-mode={d.id}>
      {children}
    </div>
  );
}
