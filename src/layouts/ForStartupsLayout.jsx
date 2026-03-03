import { Outlet, useNavigate } from 'react-router-dom';
import { C, F, R, S } from '../tokens';
import Toast from '../components/ui/Toast';

export default function ForStartupsLayout() {
  const navigate = useNavigate();

  return (
    <>
      <div style={{ minHeight: '100vh', backgroundColor: C.bg, display: 'flex', flexDirection: 'column' }}>
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `${S[3]} ${S[6]}`,
            backgroundColor: C.surface,
            borderBottom: `1px solid ${C.border}`,
          }}
        >
        <button
          type="button"
          onClick={() => navigate('/for_startups')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: S[2],
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: F.display,
            fontSize: '18px',
            fontWeight: 800,
            color: C.primary,
            letterSpacing: '-0.02em',
          }}
        >
          NEXARA
          <span style={{ fontFamily: F.body, fontWeight: 600, color: C.textSecondary, fontSize: '14px' }}>for Startups</span>
        </button>
        <nav style={{ display: 'flex', alignItems: 'center', gap: S[4] }}>
          <button
            type="button"
            onClick={() => navigate('/for_startups')}
            style={{ ...linkStyle }}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => navigate('/for_startups/dashboard')}
            style={{ ...linkStyle }}
          >
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => navigate('/login')}
            style={{ ...linkStyle, color: C.textMuted }}
          >
            Sign in
          </button>
        </nav>
      </header>
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
    <Toast />
    </>
  );
}

const linkStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontFamily: F.body,
  fontSize: '13px',
  fontWeight: 500,
  color: C.textSecondary,
};
