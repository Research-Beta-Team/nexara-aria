import { Link } from 'react-router-dom';
import { C, F, S } from '../../tokens';
import AntariousLogo from '../ui/AntariousLogo';

const FOOTER_HEIGHT_PX = 48;

export default function AppFooter({ isMobile = false }) {
  return (
    <footer
      style={{
        flexShrink: 0,
        minHeight: `${FOOTER_HEIGHT_PX}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: isMobile ? 'wrap' : 'nowrap',
        gap: isMobile ? S[3] : S[2],
        padding: isMobile
          ? `${S[3]} max(${S[3]}, env(safe-area-inset-left, 0px)) 12px max(${S[3]}, env(safe-area-inset-right, 0px))`
          : `0 ${S[5]}`,
        paddingBottom: isMobile ? 'max(12px, env(safe-area-inset-bottom, 0px))' : undefined,
        backgroundColor: C.surface2,
        borderTop: `1px solid ${C.border}`,
        fontFamily: F.body,
        fontSize: '11px',
        color: C.textMuted,
        zIndex: 350,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: S[3], flexWrap: 'wrap', minWidth: 0 }}>
        <AntariousLogo variant="dark" height={18} />
        <span style={{ color: C.border }}>·</span>
        <span style={{ color: C.textSecondary, lineHeight: 1.4 }}>
          Your GTM, now <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', color: C.primary }}>autonomous.</em>
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? S[3] : S[4], flexWrap: 'wrap' }}>
        <Link to="/settings" style={{ color: C.textMuted, textDecoration: 'none', padding: isMobile ? '4px 0' : undefined }}>Settings</Link>
        <Link to="/billing/upgrade" style={{ color: C.textMuted, textDecoration: 'none', padding: isMobile ? '4px 0' : undefined }}>Billing</Link>
        <span>© {new Date().getFullYear()} Antarious</span>
      </div>
    </footer>
  );
}
