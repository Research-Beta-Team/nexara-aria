import { Routes, Route } from 'react-router-dom';

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

// ── Route table ───────────────────────────────
export default function App() {
  return (
    <Routes>
      {/* Client portal — standalone layout */}
      <Route path="/client-portal" element={<ClientLayout />} />

      {/* Onboarding — standalone layout */}
      <Route path="/onboarding" element={<OnboardingLayout />} />

      {/* Main app — AppLayout wraps all routes */}
      <Route element={<AppLayout />}>
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
  );
}
