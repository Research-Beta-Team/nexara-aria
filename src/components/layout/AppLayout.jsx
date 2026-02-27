import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Toast from '../ui/Toast';
import AriaPanel from '../aria/AriaPanel';
import { C, scrollbarStyle } from '../../tokens';

export default function AppLayout() {
  const [ariaOpen, setAriaOpen] = useState(false);
  const location = useLocation();

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
      <AriaPanel
        open={ariaOpen}
        onOpen={() => setAriaOpen(true)}
        onClose={() => setAriaOpen(false)}
        page={location.pathname}
      />
    </div>
  );
}
