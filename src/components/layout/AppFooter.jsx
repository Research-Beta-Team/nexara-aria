import { Link } from 'react-router-dom';
import { C, F, S } from '../../tokens';

const FOOTER_HEIGHT_PX = 48;

export default function AppFooter() {
  return (
    <footer
      style={{
        flexShrink: 0,
        height: `${FOOTER_HEIGHT_PX}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `0 ${S[5]}`,
        backgroundColor: C.surface2,
        borderTop: `1px solid ${C.border}`,
        fontFamily: F.body,
        fontSize: '11px',
        color: C.textMuted,
        zIndex: 350,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: S[4] }}>
        <span style={{ fontFamily: F.display, fontWeight: 700, color: C.primary, letterSpacing: '-0.02em' }}>NEXARA</span>
        <span style={{ color: C.border }}>·</span>
        <span>GTM AI OS</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: S[4] }}>
        <Link to="/settings" style={{ color: C.textMuted, textDecoration: 'none' }}>Settings</Link>
        <Link to="/billing/upgrade" style={{ color: C.textMuted, textDecoration: 'none' }}>Billing</Link>
        <span>© {new Date().getFullYear()} NEXARA</span>
      </div>
    </footer>
  );
}
