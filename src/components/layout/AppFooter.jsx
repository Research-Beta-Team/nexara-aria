import { Link } from 'react-router-dom';
import { C, F, S } from '../../tokens';
import AntariousLogo from '../ui/AntariousLogo';

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
      <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
        <AntariousLogo variant="dark" height={18} />
        <span style={{ color: C.border }}>·</span>
        <span style={{ color: C.textSecondary }}>
          Your GTM, now <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', color: C.primary }}>autonomous.</em>
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: S[4] }}>
        <Link to="/settings" style={{ color: C.textMuted, textDecoration: 'none' }}>Settings</Link>
        <Link to="/billing/upgrade" style={{ color: C.textMuted, textDecoration: 'none' }}>Billing</Link>
        <span>© {new Date().getFullYear()} Antarious</span>
      </div>
    </footer>
  );
}
