import { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import AppFooter from './AppFooter';
import Toast from '../ui/Toast';
import AriaPanel from '../aria/AriaPanel';
import CheckoutFlow from '../billing/CheckoutFlow';
import usePlanAlerts from '../../hooks/usePlanAlerts';
import PlanChangeToast from '../plan/PlanChangeToast';
import { C, F, R, S, scrollbarStyle } from '../../tokens';

const DEV_ROLE_LABELS = {
  owner: 'Owner/CEO',
  founder: 'Founder',
  advisor: 'Strategic Advisor',
  csm: 'Client Success Manager',
  mediaBuyer: 'Media Buyer',
  contentStrategist: 'Content Strategist',
  sdr: 'SDR / Outreach',
  analyst: 'Analyst',
  client: 'Client (Read-Only)',
};

export default function AppLayout({ children }) {
  const [ariaOpen, setAriaOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const currentRole = useStore((s) => s.currentRole);
  const isDev = typeof import.meta !== 'undefined' && import.meta.env?.DEV;
  const previousClientIdBeforePreview = useStore((s) => s.previousClientIdBeforePreview);
  const activeClientId = useStore((s) => s.activeClientId);
  const currentClient = useStore((s) => s.currentClient);
  const exitPreview = useStore((s) => s.exitPreview);
  const isPreviewMode = previousClientIdBeforePreview != null;

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
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    backgroundColor: C.bg,
  };

  const mainColStyle = {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden',
    minWidth: 0,
  };

  const contentStyle = {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    overflowX: 'hidden',
    backgroundColor: C.bg,
    ...scrollbarStyle,
  };

  return (
    <div style={shellStyle}>
      <Sidebar onOpenAria={() => setAriaOpen(true)} />
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
                color: '#081A0F',
                fontFamily: F.body,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Exit Preview
            </button>
          </div>
        )}
        <TopBar onAriaOpen={() => setAriaOpen(true)} />
        <main style={contentStyle}>
          {children}
        </main>
        <AppFooter />
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
      {isDev && (
        <div
          style={{
            position: 'fixed',
            bottom: 12,
            left: 12,
            zIndex: 400,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 10px',
            backgroundColor: 'rgba(245,200,66,0.2)',
            border: '1px solid rgba(245,200,66,0.5)',
            borderRadius: 8,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '11px',
            color: '#081A0F',
          }}
        >
          <span>DEV MODE: Viewing as {DEV_ROLE_LABELS[currentRole] ?? currentRole}</span>
          <Link
            to="/dev/roles"
            style={{ color: '#1A9B5F', fontWeight: 600, textDecoration: 'none' }}
          >
            Change Role
          </Link>
        </div>
      )}
      <AriaPanel
        open={ariaOpen}
        onOpen={() => setAriaOpen(true)}
        onClose={() => setAriaOpen(false)}
        page={location.pathname}
      />
      <CheckoutFlow />
    </div>
  );
}
