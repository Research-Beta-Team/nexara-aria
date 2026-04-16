import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import CommandModeBanner from './CommandModeBanner';
import AppFooter from './AppFooter';
import Toast from '../ui/Toast';
import FreyaPanel from '../freya/AriaPanel';
import CheckoutFlow from '../billing/CheckoutFlow';
import usePlanAlerts from '../../hooks/usePlanAlerts';
import PlanChangeToast from '../plan/PlanChangeToast';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { getShellLayout, getShellContentStyle } from '../../config/roleConfig';
import { C, F, R, S, scrollbarStyle, Z } from '../../tokens';
import { getCommandModeTheme } from '../../config/commandModeTheme';
import { getModeDesign, MODE_KEYFRAMES } from '../../config/commandModeDesign';

export default function AppLayout({ children }) {
  const freyaOpen = useStore((s) => s.freyaOpen);
  const setFreyaOpen = useStore((s) => s.setFreyaOpen);
  const location = useLocation();
  const navigate = useNavigate();
  const previousClientIdBeforePreview = useStore((s) => s.previousClientIdBeforePreview);
  const activeClientId = useStore((s) => s.activeClientId);
  const currentClient = useStore((s) => s.currentClient);
  const exitPreview = useStore((s) => s.exitPreview);
  const isPreviewMode = previousClientIdBeforePreview != null;
  const currentRole = useStore((s) => s.currentRole);
  const commandMode = useStore((s) => s.commandMode);
  const modeTheme = useMemo(() => getCommandModeTheme(commandMode), [commandMode]);
  const modeDesign = useMemo(() => getModeDesign(commandMode), [commandMode]);

  const { isMobile } = useBreakpoint();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Close drawer after navigation (deferred to satisfy react-hooks/set-state-in-effect)
  useEffect(() => {
    const id = requestAnimationFrame(() => setMobileNavOpen(false));
    return () => cancelAnimationFrame(id);
  }, [location.pathname]);

  useEffect(() => {
    const shell = getShellLayout(currentRole);
    document.documentElement.setAttribute('data-shell-density', shell.density);
    document.documentElement.setAttribute('data-role', currentRole);
    return () => {
      document.documentElement.removeAttribute('data-shell-density');
      document.documentElement.removeAttribute('data-role');
    };
  }, [currentRole]);

  useEffect(() => {
    document.documentElement.setAttribute('data-command-mode', commandMode);
    // Inject mode keyframes once
    let styleEl = document.getElementById('mode-keyframes');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'mode-keyframes';
      styleEl.textContent = MODE_KEYFRAMES;
      document.head.appendChild(styleEl);
    }
    return () => document.documentElement.removeAttribute('data-command-mode');
  }, [commandMode]);

  const {
    planChangeToast,
    dismissPlanChangeToast,
    creditToast,
    dismissCreditToast,
  } = usePlanAlerts();

  const activeToast = planChangeToast || (creditToast
    ? { type: creditToast.level === 'critical' ? 'credit_critical' : 'credit_low', payload: { creditsRemaining: creditToast.creditsRemaining } }
    : null);
  const dismissToast = planChangeToast ? dismissPlanChangeToast : dismissCreditToast;

  const shellStyle = {
    display: 'flex',
    minHeight: '100dvh',
    height: '100dvh',
    width: '100%',
    maxWidth: '100vw',
    overflow: 'hidden',
    backgroundColor: C.bg,
    paddingTop: 'env(safe-area-inset-top, 0px)',
    boxSizing: 'border-box',
  };

  const mainColStyle = {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden',
    minWidth: 0,
    width: '100%',
  };

  const contentStyle = {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    overflowX: 'hidden',
    backgroundColor: C.bg,
    transition: commandMode === 'manual' ? 'none' : 'background 0.3s ease',
    ...scrollbarStyle,
  };

  // Mode-specific content styling
  const modeContentStyle = {
    padding: modeDesign.layout.contentPadding,
    ...modeTheme.mainSurroundStyle,
  };

  const contentRailStyle = getShellContentStyle(currentRole, isMobile);

  return (
    <div style={shellStyle}>
      {isMobile && mobileNavOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileNavOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: Z.navScrim,
            border: 'none',
            margin: 0,
            padding: 0,
            backgroundColor: C.overlay,
            cursor: 'pointer',
          }}
        />
      )}

      <Sidebar
        isMobile={isMobile}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      <div style={mainColStyle}>
        {isPreviewMode && (
          <div
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: S[4],
              padding: `${S[2]} ${S[4]}`,
              backgroundColor: C.amberDim,
              borderBottom: `1px solid ${C.amber}`,
              fontFamily: F.body,
              fontSize: '13px',
              color: C.textPrimary,
              flexWrap: 'wrap',
            }}
          >
            <span style={{ fontWeight: 600 }}>
              PREVIEW MODE — Viewing as: {currentClient}
            </span>
            <button
              type="button"
              onClick={() => {
                const previewedId = activeClientId;
                exitPreview();
                navigate(`/admin/clients/${previewedId}/workspace`);
              }}
              style={{
                padding: '6px 12px',
                borderRadius: R.button,
                border: `1px solid ${C.amber}`,
                backgroundColor: C.amber,
                color: C.textOnLightAccent,
                fontFamily: F.body,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Exit Preview
            </button>
          </div>
        )}
        <TopBar
          onFreyaOpen={() => setFreyaOpen(true)}
          isMobile={isMobile}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />
        <CommandModeBanner mode={commandMode} isMobile={isMobile} />
        <main style={{ ...contentStyle, ...modeContentStyle }}>
          <div style={contentRailStyle}>{children}</div>
        </main>
        <AppFooter isMobile={isMobile} />
      </div>
      <Toast />
      {activeToast && (
        <PlanChangeToast
          type={activeToast.type}
          payload={activeToast.payload}
          onDismiss={dismissToast}
          onViewWhatsNew={activeToast.type === 'upgrade' ? () => { dismissToast(); navigate('/'); } : undefined}
          onBuyCredits={() => { dismissToast(); navigate('/billing'); } }
          onUpgradePlan={() => { dismissToast(); navigate('/billing'); } }
        />
      )}
      <FreyaPanel
        open={freyaOpen}
        onOpen={() => setFreyaOpen(true)}
        onClose={() => setFreyaOpen(false)}
        page={location.pathname}
      />
      <CheckoutFlow />
    </div>
  );
}
