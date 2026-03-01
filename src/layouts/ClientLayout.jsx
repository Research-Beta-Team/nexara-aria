import { CP, CLIENT_INFO, CAMPAIGN_OVERVIEW } from '../data/clientPortal';

const fontBody = "'DM Sans', sans-serif";

export default function ClientLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: CP.bg }}>
      {/* Top bar */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          backgroundColor: CP.surface,
          borderBottom: `1px solid ${CP.border}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div
            style={{
              width: 120,
              height: 40,
              backgroundColor: CP.bg,
              border: `1px solid ${CP.border}`,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: fontBody,
              fontSize: 12,
              color: CP.textSecondary,
            }}
          >
            Agency Logo
          </div>
          <span style={{ fontFamily: fontBody, fontSize: 16, fontWeight: 600, color: CP.text }}>
            {CLIENT_INFO.name}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: fontBody, fontSize: 14, color: CP.textSecondary }}>
            {CAMPAIGN_OVERVIEW.name}
          </span>
          <span
            style={{
              padding: '4px 10px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 600,
              fontFamily: fontBody,
              backgroundColor: `${CP.primary}18`,
              color: CP.primary,
              border: `1px solid ${CP.primary}40`,
            }}
          >
            {CAMPAIGN_OVERVIEW.status}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: fontBody, fontSize: 14, color: CP.text }}>{CLIENT_INFO.contactName}</span>
          <span
            style={{
              padding: '4px 8px',
              borderRadius: 6,
              fontSize: 11,
              fontFamily: fontBody,
              color: CP.textSecondary,
              border: `1px solid ${CP.border}`,
            }}
          >
            Secured by NEXARA
          </span>
        </div>
      </header>

      {/* Main content */}
      <main style={{ padding: 32, maxWidth: 1100, margin: '0 auto' }}>
        {children}
      </main>

      {/* Footer */}
      <footer
        style={{
          padding: '16px 24px',
          borderTop: `1px solid ${CP.border}`,
          backgroundColor: CP.surface,
          textAlign: 'center',
          fontFamily: fontBody,
          fontSize: 12,
          color: CP.textSecondary,
        }}
      >
        Powered by NEXARA
        {' · '}
        <a href="#" style={{ color: CP.primary }} onClick={(e) => e.preventDefault()}>
          Privacy policy
        </a>
      </footer>
    </div>
  );
}
