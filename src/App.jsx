import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useStore from './store/useStore';

// Layouts
import AppLayout from './components/layout/AppLayout';
import ClientLayout from './layouts/ClientLayout';

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
import Settings              from './pages/Settings';
import ARIABrain             from './pages/ARIABrain';
import NotificationCenter   from './pages/NotificationCenter';
import ICPBuilder           from './pages/research/ICPBuilder';
import IntentSignals        from './pages/research/IntentSignals';
import CompetitiveIntel     from './pages/research/CompetitiveIntel';
import ABMEngine            from './pages/ABMEngine';
import VerticalPlaybooks    from './pages/VerticalPlaybooks';
import PipelineManager      from './pages/revenue/PipelineManager';
import CustomerSuccess      from './pages/revenue/CustomerSuccess';
import ForecastEngine       from './pages/revenue/ForecastEngine';
import ClientPortal         from './pages/ClientPortal';
import WhiteLabelConfig     from './pages/workspace/WhiteLabelConfig';
import RoleSwitcher        from './pages/dev/RoleSwitcher';
import Onboarding     from './pages/Onboarding';
import UpgradePage    from './pages/billing/UpgradePage';
import Login          from './pages/Login';
import Signup         from './pages/Signup';

// Toast for standalone layouts
import Toast from './components/ui/Toast';
import { C } from './tokens';

// ── Client portal layout (no sidebar, light theme) ──
function ClientPortalRoute() {
  return (
    <ClientLayout>
      <ClientPortal />
      <Toast />
    </ClientLayout>
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

// ── Coming soon stub ───────────────────────────
function ComingSoon({ page }) {
  return (
    <div style={{ padding: '64px 48px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      <div style={{
        width: '56px', height: '56px', borderRadius: '14px',
        backgroundColor: 'rgba(61,220,132,0.1)', border: '1px solid rgba(61,220,132,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7l10 5 10-5-10-5ZM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#3DDC84" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', fontWeight: 700, color: '#3DDC84', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        Coming Soon
      </div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: '#6B9478', textAlign: 'center', maxWidth: '320px' }}>
        <strong style={{ color: '#A8C5B5' }}>{page}</strong> is under active development. Check back soon.
      </div>
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
      <Route path="/client-portal" element={<ClientPortalRoute />} />

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
        <Route path="querymanager"         element={<QueryManager />} />
        <Route path="notification-center" element={<NotificationCenter />} />
        <Route path="research/icp"        element={<ICPBuilder />} />
        <Route path="research/intent"    element={<Navigate to="/intent" replace />} />
        <Route path="intent"             element={<IntentSignals />} />
        <Route path="competitive" element={<CompetitiveIntel />} />
        <Route path="abm" element={<ABMEngine />} />
        <Route path="revenue/pipeline" element={<PipelineManager />} />
        <Route path="customer-success" element={<CustomerSuccess />} />
        <Route path="playbooks" element={<VerticalPlaybooks />} />
        {/* Revenue stubs */}
        <Route path="pipeline"        element={<ComingSoon page="Pipeline" />} />
        <Route path="forecast"        element={<ForecastEngine />} />
        {/* Admin stubs */}
        <Route path="team"            element={<ComingSoon page="Team & Workspace" />} />
        <Route path="billing"         element={<Navigate to="/billing/upgrade" replace />} />
        <Route path="billing/upgrade" element={<UpgradePage />} />
        <Route path="settings"            element={<Settings />} />
        <Route path="aria-brain"       element={<ARIABrain />} />
        <Route path="workspace/whitelabel" element={<WhiteLabelConfig />} />
        <Route path="whitelabel"       element={<WhiteLabelConfig />} />
        <Route path="dev/roles"        element={<RoleSwitcher />} />
        <Route path="*"             element={<NotFound />} />
      </Route>
    </Routes>
    </>
  );
}
