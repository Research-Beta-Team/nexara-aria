import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useStore from './store/useStore';

// Layouts
import AppLayout from './components/layout/AppLayout';

// Pages
import Dashboard      from './pages/Dashboard';
import CampaignList   from './pages/CampaignList';
import CampaignDetail from './pages/CampaignDetail';
import CampaignNew    from './pages/CampaignNew';
import OutreachDetail from './pages/OutreachDetail';
import AgentRoster    from './pages/AgentRoster';
import AgentDetail    from './pages/AgentDetail';
import MetaMonitor    from './pages/MetaMonitor';
import Escalations    from './pages/Escalations';
import Analytics      from './pages/Analytics';
import Inbox          from './pages/Inbox';
import ContentLibrary from './pages/ContentLibrary';
import KnowledgeBase  from './pages/KnowledgeBase';
import QueryManager   from './pages/QueryManager';
import Settings       from './pages/Settings';
import ClientPortal   from './pages/ClientPortal';
import Onboarding     from './pages/Onboarding';
import Login          from './pages/Login';
import Signup         from './pages/Signup';

// Toast for standalone layouts
import Toast from './components/ui/Toast';
import { C } from './tokens';

// ── Client portal layout (no sidebar) ────────
function ClientLayout() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: C.bg }}>
      <ClientPortal />
      <Toast />
    </div>
  );
}

// ── Onboarding layout (no sidebar) ────────────
function OnboardingLayout() {
  return (
    <>
      <Onboarding />
      <Toast />
    </>
  );
}

// ── 404 ───────────────────────────────────────
function NotFound() {
  return (
    <div style={{ padding: '64px', textAlign: 'center', color: '#6B9478', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ fontSize: '48px', fontFamily: "'JetBrains Mono', monospace", color: '#3DDC84' }}>404</div>
      <div style={{ marginTop: '16px' }}>Page not found</div>
    </div>
  );
}

// ── Theme sync ────────────────────────────────
// Keeps document data-theme in sync with store
function ThemeSync() {
  const isDarkMode = useStore((s) => s.isDarkMode);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);
  return null;
}

// ── Onboarding guard (auth required, but not onboarding) ──
function OnboardingGuard() {
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <OnboardingLayout />;
}

// ── Main app guard (auth + onboarding both required) ──────
function ProtectedLayout() {
  const isAuthenticated    = useStore((s) => s.isAuthenticated);
  const onboardingComplete = useStore((s) => s.onboardingComplete);
  if (!isAuthenticated)    return <Navigate to="/login" replace />;
  if (!onboardingComplete) return <Navigate to="/onboarding" replace />;
  return <AppLayout />;
}

// ── Route table ───────────────────────────────
export default function App() {
  return (
    <>
    <ThemeSync />
    <Routes>
      {/* Client portal — standalone layout */}
      <Route path="/client-portal" element={<ClientLayout />} />

      {/* Auth — standalone layouts */}
      <Route path="/login"  element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Onboarding — requires auth, no sidebar */}
      <Route path="/onboarding" element={<OnboardingGuard />} />

      {/* Main app — guarded by onboarding check */}
      <Route element={<ProtectedLayout />}>
        <Route index               element={<Dashboard />} />
        <Route path="campaigns"     element={<CampaignList />} />
        <Route path="campaigns/new" element={<CampaignNew />} />
        <Route path="campaigns/:id"                     element={<CampaignDetail />} />
        <Route path="campaigns/:id/prospect/:pid"      element={<OutreachDetail />} />
        <Route path="agents"        element={<AgentRoster />} />
        <Route path="agents/:id"    element={<AgentDetail />} />
        <Route path="meta"          element={<MetaMonitor />} />
        <Route path="escalations"   element={<Escalations />} />
        <Route path="analytics"     element={<Analytics />} />
        <Route path="inbox"         element={<Inbox />} />
        <Route path="content"       element={<ContentLibrary />} />
        <Route path="knowledge"     element={<KnowledgeBase />} />
        <Route path="querymanager"  element={<QueryManager />} />
        <Route path="settings"      element={<Settings />} />
        <Route path="*"             element={<NotFound />} />
      </Route>
    </Routes>
    </>
  );
}
