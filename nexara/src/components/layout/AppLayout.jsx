import { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import useStore from '../../store/useStore';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Toast from '../ui/Toast';
import AriaPanel from '../aria/AriaPanel';
import CheckoutFlow from '../billing/CheckoutFlow';
import { C, scrollbarStyle } from '../../tokens';

const DEV_ROLE_LABELS = {
  owner: 'Owner/CEO',
  advisor: 'Strategic Advisor',
  csm: 'Client Success Manager',
  mediaBuyer: 'Media Buyer',
  contentStrategist: 'Content Strategist',
  sdr: 'SDR / Outreach',
  analyst: 'Analyst',
  client: 'Client (Read-Only)',
};

export default function AppLayout() {
  const [ariaOpen, setAriaOpen] = useState(false);
  const location = useLocation();
  const currentRole = useStore((s) => s.currentRole);
  const isDev = typeof import.meta !== 'undefined' && import.meta.env?.DEV;

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
      <Sidebar />
      <div style={mainColStyle}>
        <TopBar onAriaOpen={() => setAriaOpen(true)} />
        <main style={contentStyle}>
          <Outlet />
        </main>
      </div>
      <Toast />
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
