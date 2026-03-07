import { useEffect } from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import useStore from './store/useStore';

// Layouts
import AppLayout from './components/layout/AppLayout';
import ClientLayout from './layouts/ClientLayout';
import ForStartupsLayout from './layouts/ForStartupsLayout';

// Pages
import Dashboard      from './pages/Dashboard';
import CampaignList   from './pages/CampaignList';
import CampaignDetail from './pages/CampaignDetail';
import CampaignNew    from './pages/CampaignNew';
import AriaCampaignFlow from './pages/AriaCampaignFlow';
import OutreachDetail from './pages/OutreachDetail';
import Outreach from './pages/Outreach';
import AgentRoster    from './pages/AgentRoster';
import AgentDetail    from './pages/AgentDetail';
import MetaMonitor    from './pages/MetaMonitor';
import Escalations    from './pages/Escalations';
import Analytics      from './pages/Analytics';
import Inbox          from './pages/Inbox';
import ContentLibrary from './pages/ContentLibrary';
import CentralCalendar from './pages/CentralCalendar';
import KnowledgeBase  from './pages/KnowledgeBase';
import QueryManager   from './pages/QueryManager';
import Settings              from './pages/Settings';
import ARIABrain             from './pages/ARIABrain';
import NotificationCenter   from './pages/NotificationCenter';
import ICPBuilder           from './pages/research/ICPBuilder';
import IntentSignals        from './pages/research/IntentSignals';
import CompetitiveIntel     from './pages/research/CompetitiveIntel';
import ABMEngine from './pages/ABMEngine';
import SocialMedia          from './pages/SocialMedia';
import SocialCampaignDetail from './pages/SocialCampaignDetail';
import PipelineManager      from './pages/revenue/PipelineManager';
import CustomerSuccess      from './pages/revenue/CustomerSuccess';
import CRM                  from './pages/CRM';
import ForecastEngine       from './pages/revenue/ForecastEngine';
import Team                 from './pages/Team';
import ClientPortal         from './pages/ClientPortal';
import ForStartupsLanding  from './pages/for_startups/ForStartupsLanding';
import ForStartupsOnboarding from './pages/for_startups/ForStartupsOnboarding';
import StartupDashboard    from './pages/for_startups/StartupDashboard';
import WhiteLabelConfig     from './pages/workspace/WhiteLabelConfig';
import RoleSwitcher        from './pages/dev/RoleSwitcher';
import Onboarding     from './pages/Onboarding';
import ARIAMomentOnboarding from './pages/ARIAMomentOnboarding';
import ARIAKnowledge  from './pages/ARIAKnowledge';
import WorkflowCenter from './pages/WorkflowCenter';
import ARIAPersonaConfig from './pages/settings/ARIAPersonaConfig';
import UpgradePage    from './pages/billing/UpgradePage';
import Login          from './pages/Login';
import Signup         from './pages/Signup';
import WorkspaceTemplates from './pages/admin/WorkspaceTemplates';
import ClientWorkspaces from './pages/admin/ClientWorkspaces';
import CSMWorkspaceConfigurator from './pages/admin/CSMWorkspaceConfigurator';
import WorkspacePreview from './pages/admin/WorkspacePreview';
import ComingSoonPage from './components/layout/ComingSoonPage';
import ARIAMemoryEngine from './pages/ARIAMemoryEngine';
import ContentApprovalWorkflow from './pages/ContentApprovalWorkflow';
import MQLHandoffCenter from './pages/MQLHandoffCenter';
import MultiTouchAttribution from './pages/MultiTouchAttribution';
import WeeklyExecutiveDigest from './pages/WeeklyExecutiveDigest';
import ARIACampaignBriefer from './pages/ARIACampaignBriefer';
import LeadEnrichmentCenter from './pages/LeadEnrichmentCenter';
import BoardReportGenerator from './pages/BoardReportGenerator';

// Toast for standalone layouts
import Toast from './components/ui/Toast';
import { C, F, S, btn } from './tokens';
import { WorkspaceProvider } from './context/WorkspaceContext';
import usePlan from './hooks/usePlan';
import { PLANS } from './config/plans';

// ── Client portal layout (no sidebar, light theme) ──
function ClientPortalRoute() {
  return (
    <ClientLayout>
      <ClientPortal />
      <Toast />
    </ClientLayout>
  );
}

// ── Guard: Client portal only on Agency plan ──
function ClientPortalGuard() {
  const { hasFeature } = usePlan();
  const openCheckout = useStore((s) => s.openCheckout);

  if (hasFeature('clientPortal')) return <ClientPortalRoute />;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: S[6],
      backgroundColor: C.surface,
      fontFamily: F.body,
    }}>
      <div style={{ textAlign: 'center', maxWidth: '400px' }}>
        <p style={{ fontSize: '18px', fontWeight: 700, color: C.textPrimary, margin: '0 0 8px' }}>
          Client portal is only available on the Agency plan
        </p>
        <p style={{ fontSize: '14px', color: C.textSecondary, marginBottom: S[5] }}>
          Upgrade to Agency to give your clients branded portals with live reporting and approvals.
        </p>
        <button
          style={{ ...btn.primary }}
          onClick={() => openCheckout('agency', 'client-portal')}
        >
          Upgrade to Agency
        </button>
      </div>
      <Toast />
    </div>
  );
}

// ── Onboarding layouts (no sidebar) ───────────
function OnboardingLayout() {
  return (
    <>
      <Onboarding />
      <Toast />
    </>
  );
}

function OnboardingAriaLayout() {
  return (
    <>
      <ARIAMomentOnboarding />
      <Toast />
    </>
  );
}

// ── 404 ───────────────────────────────────────
function NotFound() {
  return (
    <div style={{ padding: '64px', textAlign: 'center', color: C.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ fontSize: '48px', fontFamily: "'JetBrains Mono', monospace", color: C.primary }}>404</div>
      <div style={{ marginTop: '16px', color: C.textSecondary }}>Page not found</div>
    </div>
  );
}

// ── Coming soon stub ───────────────────────────
function ComingSoon({ page }) {
  return (
    <div style={{ padding: '64px 48px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      <div style={{
        width: '56px', height: '56px', borderRadius: '14px',
        backgroundColor: C.primaryDim, border: `1px solid ${C.primaryGlow}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: C.primary }}>
          <path d="M12 2L2 7l10 5 10-5-10-5ZM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', fontWeight: 700, color: C.primary, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        Coming Soon
      </div>
      <div style={{ fontFamily: F.body, fontSize: '14px', color: C.textMuted, textAlign: 'center', maxWidth: '320px' }}>
        <strong style={{ color: C.textSecondary }}>{page}</strong> is under active development. Check back soon.
      </div>
    </div>
  );
}

// ── Coming soon with details (for ABM & Playbooks sidebar section) ──
// ComingSoonPage imported above from components/layout/ComingSoonPage.jsx

// ── Theme sync ────────────────────────────────
// Keeps document data-theme in sync with store
function ThemeSync() {
  const isDarkMode = useStore((s) => s.isDarkMode);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);
  return null;
}

// ── Onboarding guard (auth required) ───────────
function OnboardingGuard() {
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const location = useLocation();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  // Tier-based flow (company type, plan, connections)
  if (location.pathname === '/onboarding/setup') return <OnboardingLayout />;
  // ARIA Moment (file upload, create first campaign) at /onboarding, /onboarding/aria, /first-onboarding/aria
  return <OnboardingAriaLayout />;
}

// ── Main app guard (auth + onboarding both required) ──────
function ProtectedLayout() {
  const isAuthenticated    = useStore((s) => s.isAuthenticated);
  const isOnboarded        = useStore((s) => s.isOnboarded);
  if (!isAuthenticated)    return <Navigate to="/login" replace />;
  if (!isOnboarded)       return <Navigate to="/onboarding/setup" replace />;
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

// ── Route table ───────────────────────────────
export default function App() {
  return (
    <WorkspaceProvider>
    <>
    <ThemeSync />
    <Routes>
      {/* Client portal — standalone layout */}
      <Route path="/client-portal" element={<ClientPortalGuard />} />

      {/* For Startups — standalone flow (no auth required for prototype) */}
      <Route path="/for_startups" element={<ForStartupsLayout />}>
        <Route index element={<ForStartupsLanding />} />
        <Route path="onboarding" element={<ForStartupsOnboarding />} />
        <Route path="dashboard" element={<StartupDashboard />} />
      </Route>

      {/* Auth — standalone layouts */}
      <Route path="/login"  element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Onboarding — requires auth; tier flow at /onboarding/setup, ARIA (file upload) at /onboarding, /first-onboarding/aria */}
      <Route path="/onboarding" element={<OnboardingGuard />} />
      <Route path="/onboarding/aria" element={<Navigate to="/first-onboarding/aria" replace />} />
      <Route path="/onboarding/setup" element={<OnboardingGuard />} />
      <Route path="/first-onboarding/aria" element={<OnboardingGuard />} />

      {/* Main app — guarded by auth + onboarding; explicit path so /campaigns/new etc. match */}
      <Route path="/" element={<ProtectedLayout />}>
        <Route index               element={<Dashboard />} />
        <Route path="dashboard"    element={<Navigate to="/" replace />} />
        <Route path="campaigns"     element={<CampaignList />} />
        <Route path="campaigns/new/aria" element={<AriaCampaignFlow />} />
        <Route path="campaigns/new" element={<CampaignNew />} />
        <Route path="campaigns/approvals" element={<ContentApprovalWorkflow />} />
        <Route path="campaigns/briefer"   element={<ARIACampaignBriefer />} />
        <Route path="campaigns/:id"                     element={<CampaignDetail />} />
        <Route path="campaigns/:id/prospect/:pid"      element={<OutreachDetail />} />
        <Route path="outreach" element={<Outreach />} />
        <Route path="outreach/:id"  element={<OutreachDetail />} />
        <Route path="agents"        element={<AgentRoster />} />
        <Route path="agents/:id"    element={<AgentDetail />} />
        <Route path="meta"          element={<MetaMonitor />} />
        <Route path="analytics/meta" element={<MetaMonitor />} />
        <Route path="escalations"   element={<Escalations />} />
        <Route path="analytics"     element={<Analytics />} />
        <Route path="inbox"         element={<Inbox />} />
        <Route path="content"       element={<ContentLibrary />} />
        <Route path="calendar"      element={<CentralCalendar />} />
        <Route path="knowledge"     element={<KnowledgeBase />} />
        <Route path="querymanager"         element={<QueryManager />} />
        <Route path="notification-center" element={<NotificationCenter />} />
        <Route path="research/icp"        element={<ICPBuilder />} />
        <Route path="research/intent"    element={<IntentSignals />} />
        <Route path="intent"             element={<Navigate to="/research/intent" replace />} />
        <Route path="research/competitive" element={<CompetitiveIntel />} />
        <Route path="abm" element={<ABMEngine />} />
        <Route path="revenue/pipeline" element={<PipelineManager />} />
        <Route path="revenue/forecast" element={<ForecastEngine />} />
        <Route path="revenue/customers" element={<CustomerSuccess />} />
        <Route path="revenue/crm" element={<CRM />} />
        <Route path="crm" element={<Navigate to="/revenue/crm" replace />} />
        <Route path="customer-success" element={<Navigate to="/revenue/customers" replace />} />
        <Route path="playbooks" element={<ComingSoonPage page="Playbooks" description="Pre-built GTM playbooks by vertical and use case. Pick a playbook (e.g. SaaS Demo Gen, Product Launch, ABM Program) and Freya customises it for your context. Launch campaigns in hours with sequences, content, and channels already defined." />} />
        <Route path="social" element={<SocialMedia />} />
        <Route path="social/campaigns/:campaignId" element={<SocialCampaignDetail />} />
        {/* Revenue stubs */}
        <Route path="pipeline"        element={<Navigate to="/revenue/pipeline" replace />} />
        <Route path="forecast"        element={<Navigate to="/revenue/forecast" replace />} />
        {/* Admin stubs */}
        <Route path="tasks"             element={<ComingSoon page="Today's Tasks" />} />
        <Route path="team"            element={<Team />} />
        <Route path="workspace/team"  element={<Team />} />
        <Route path="billing"         element={<Navigate to="/billing/upgrade" replace />} />
        <Route path="billing/upgrade" element={<UpgradePage />} />
        <Route path="settings"            element={<Settings />} />
        <Route path="settings/workspace-preferences" element={<ComingSoon page="Organization Preferences" />} />
        <Route path="settings/aria"        element={<ARIAPersonaConfig />} />
        <Route path="aria-brain"       element={<ARIABrain />} />
        <Route path="aria/knowledge"   element={<ARIAKnowledge />} />
        <Route path="aria/workflows"   element={<WorkflowCenter />} />
        <Route path="aria/memory"      element={<ARIAMemoryEngine />} />
        <Route path="crm/handoff"      element={<MQLHandoffCenter />} />
        <Route path="crm/enrichment"   element={<LeadEnrichmentCenter />} />
        <Route path="analytics/attribution" element={<MultiTouchAttribution />} />
        <Route path="reports/digest"   element={<WeeklyExecutiveDigest />} />
        <Route path="reports/board"    element={<BoardReportGenerator />} />
        <Route path="workspace/whitelabel" element={<WhiteLabelConfig />} />
        <Route path="whitelabel"       element={<WhiteLabelConfig />} />
        <Route path="admin/workspace-templates" element={<WorkspaceTemplates />} />
        <Route path="admin/clients" element={<ClientWorkspaces />} />
        <Route path="admin/clients/:clientId/workspace" element={<CSMWorkspaceConfigurator />} />
        <Route path="admin/clients/:clientId/preview" element={<WorkspacePreview />} />
        <Route path="dev/roles"        element={<RoleSwitcher />} />
        <Route path="*"             element={<NotFound />} />
      </Route>
    </Routes>
    </>
    </WorkspaceProvider>
  );
}
