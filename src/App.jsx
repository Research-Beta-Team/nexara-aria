import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import useStore from './store/useStore';

// Layouts (not lazy — needed immediately for shell rendering)
import AppLayout from './components/layout/AppLayout';
import ClientLayout from './layouts/ClientLayout';
import ForStartupsLayout from './layouts/ForStartupsLayout';

// Toast for standalone layouts
import Toast from './components/ui/Toast';
import { C, F, S, btn } from './tokens';
import { WorkspaceProvider } from './context/WorkspaceContext';
import usePlan from './hooks/usePlan';
import { PLANS } from './config/plans';

// ── Page-level loader shown while chunks download ──
function PageLoader() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', backgroundColor: '#1C2B27',
      flexDirection: 'column', gap: '16px',
    }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: '50%',
        border: '3px solid rgba(74,124,111,0.3)',
        borderTop: '3px solid #4A7C6F',
        animation: 'spin 1s linear infinite',
      }} />
      <span style={{ color: '#8B9E98', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px' }}>
        Loading...
      </span>
    </div>
  );
}

// ── Lazy page imports ──────────────────────────
const Dashboard           = lazy(() => import('./pages/Dashboard'));
const CampaignList        = lazy(() => import('./pages/CampaignList'));
const CampaignDetail      = lazy(() => import('./pages/CampaignDetail'));
const CampaignNew         = lazy(() => import('./pages/CampaignNew'));
const AriaCampaignFlow    = lazy(() => import('./pages/AriaCampaignFlow'));
const OutreachDetail      = lazy(() => import('./pages/OutreachDetail'));
const Outreach            = lazy(() => import('./pages/Outreach'));
const AgentRoster         = lazy(() => import('./pages/AgentRoster'));
const AgentDetail         = lazy(() => import('./pages/AgentDetail'));
const MetaMonitor         = lazy(() => import('./pages/MetaMonitor'));
const Escalations         = lazy(() => import('./pages/Escalations'));
const Analytics           = lazy(() => import('./pages/Analytics'));
const Inbox               = lazy(() => import('./pages/Inbox'));
const ContentLibrary      = lazy(() => import('./pages/ContentLibrary'));
const CentralCalendar     = lazy(() => import('./pages/CentralCalendar'));
const KnowledgeBase       = lazy(() => import('./pages/KnowledgeBase'));
const QueryManager        = lazy(() => import('./pages/QueryManager'));
const Settings            = lazy(() => import('./pages/Settings'));
const ARIABrain           = lazy(() => import('./pages/ARIABrain'));
const NotificationCenter  = lazy(() => import('./pages/NotificationCenter'));
const ICPBuilder          = lazy(() => import('./pages/research/ICPBuilder'));
const IntentSignals       = lazy(() => import('./pages/research/IntentSignals'));
const CompetitiveIntel    = lazy(() => import('./pages/research/CompetitiveIntel'));
const ABMEngine           = lazy(() => import('./pages/ABMEngine'));
const SocialMedia         = lazy(() => import('./pages/SocialMedia'));
const SocialCampaignDetail = lazy(() => import('./pages/SocialCampaignDetail'));
const PipelineManager     = lazy(() => import('./pages/revenue/PipelineManager'));
const CustomerSuccess     = lazy(() => import('./pages/revenue/CustomerSuccess'));
const CRM                 = lazy(() => import('./pages/CRM'));
const ForecastEngine      = lazy(() => import('./pages/revenue/ForecastEngine'));
const Team                = lazy(() => import('./pages/Team'));
const ClientPortal        = lazy(() => import('./pages/ClientPortal'));
const ForStartupsLanding  = lazy(() => import('./pages/for_startups/ForStartupsLanding'));
const ForStartupsOnboarding = lazy(() => import('./pages/for_startups/ForStartupsOnboarding'));
const StartupDashboard    = lazy(() => import('./pages/for_startups/StartupDashboard'));
const WhiteLabelConfig    = lazy(() => import('./pages/workspace/WhiteLabelConfig'));
const RoleSwitcher        = lazy(() => import('./pages/dev/RoleSwitcher'));
const Onboarding          = lazy(() => import('./pages/Onboarding'));
const ARIAMomentOnboarding = lazy(() => import('./pages/ARIAMomentOnboarding'));
const ARIAKnowledge       = lazy(() => import('./pages/ARIAKnowledge'));
const WorkflowCenter      = lazy(() => import('./pages/WorkflowCenter'));
const ARIAPersonaConfig   = lazy(() => import('./pages/settings/ARIAPersonaConfig'));
const UpgradePage         = lazy(() => import('./pages/billing/UpgradePage'));
const Login               = lazy(() => import('./pages/Login'));
const Signup              = lazy(() => import('./pages/Signup'));
const WorkspaceTemplates  = lazy(() => import('./pages/admin/WorkspaceTemplates'));
const ClientWorkspaces    = lazy(() => import('./pages/admin/ClientWorkspaces'));
const CSMWorkspaceConfigurator = lazy(() => import('./pages/admin/CSMWorkspaceConfigurator'));
const WorkspacePreview    = lazy(() => import('./pages/admin/WorkspacePreview'));
const ARIAMemoryEngine    = lazy(() => import('./pages/ARIAMemoryEngine'));
const ContentApprovalWorkflow = lazy(() => import('./pages/ContentApprovalWorkflow'));
const MQLHandoffCenter    = lazy(() => import('./pages/MQLHandoffCenter'));
const MultiTouchAttribution = lazy(() => import('./pages/MultiTouchAttribution'));
const WeeklyExecutiveDigest = lazy(() => import('./pages/WeeklyExecutiveDigest'));
const ARIACampaignBriefer = lazy(() => import('./pages/ARIACampaignBriefer'));
const LeadEnrichmentCenter = lazy(() => import('./pages/LeadEnrichmentCenter'));
const BoardReportGenerator = lazy(() => import('./pages/BoardReportGenerator'));
const SEOAudit            = lazy(() => import('./pages/seo/SEOAudit'));
const SiteArchitecture    = lazy(() => import('./pages/seo/SiteArchitecture'));
const ProgrammaticSEO     = lazy(() => import('./pages/seo/ProgrammaticSEO'));
const SchemaMarkup        = lazy(() => import('./pages/seo/SchemaMarkup'));
const PageCRO             = lazy(() => import('./pages/cro/PageCRO'));
const FormCRO             = lazy(() => import('./pages/cro/FormCRO'));
const SignupFlowCRO       = lazy(() => import('./pages/cro/SignupFlowCRO'));
const OnboardingCRO       = lazy(() => import('./pages/cro/OnboardingCRO'));
const PopupCRO            = lazy(() => import('./pages/cro/PopupCRO'));
const PaywallCRO          = lazy(() => import('./pages/cro/PaywallCRO'));
const ABTestDashboard     = lazy(() => import('./pages/cro/ABTestDashboard'));
const LeadMagnets         = lazy(() => import('./pages/marketing/LeadMagnets'));
const ReferralProgram     = lazy(() => import('./pages/marketing/ReferralProgram'));
const FreeToolStrategy    = lazy(() => import('./pages/marketing/FreeToolStrategy'));

// ComingSoonPage — shared layout component, not a page; kept static
import ComingSoonPage from './components/layout/ComingSoonPage';

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
  // Freya Moment (file upload, create first campaign) at /onboarding, /onboarding/aria, /first-onboarding/aria
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
    <Suspense fallback={<PageLoader />}>
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

      {/* Onboarding — requires auth; tier flow at /onboarding/setup, Freya (file upload) at /onboarding, /first-onboarding/freya */}
      <Route path="/onboarding" element={<OnboardingGuard />} />
      <Route path="/onboarding/aria" element={<Navigate to="/first-onboarding/freya" replace />} />
      <Route path="/onboarding/setup" element={<OnboardingGuard />} />
      <Route path="/first-onboarding/aria" element={<Navigate to="/first-onboarding/freya" replace />} />
      <Route path="/first-onboarding/freya" element={<OnboardingGuard />} />

      {/* Main app — guarded by auth + onboarding; explicit path so /campaigns/new etc. match */}
      <Route path="/" element={<ProtectedLayout />}>
        <Route index               element={<Dashboard />} />
        <Route path="dashboard"    element={<Navigate to="/" replace />} />
        <Route path="campaigns"     element={<CampaignList />} />
        <Route path="campaigns/new/freya" element={<AriaCampaignFlow />} />
        <Route path="campaigns/new/aria" element={<Navigate to="/campaigns/new/freya" replace />} />
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
        <Route path="settings/freya"        element={<ARIAPersonaConfig />} />
        <Route path="settings/aria"        element={<Navigate to="/settings/freya" replace />} />
        <Route path="freya-brain"       element={<ARIABrain />} />
        <Route path="aria-brain"        element={<Navigate to="/freya-brain" replace />} />
        <Route path="freya/knowledge"   element={<ARIAKnowledge />} />
        <Route path="aria/knowledge"    element={<Navigate to="/freya/knowledge" replace />} />
        <Route path="freya/workflows"   element={<WorkflowCenter />} />
        <Route path="aria/workflows"    element={<Navigate to="/freya/workflows" replace />} />
        <Route path="freya/memory"      element={<ARIAMemoryEngine />} />
        <Route path="aria/memory"       element={<Navigate to="/freya/memory" replace />} />
        <Route path="crm/handoff"      element={<MQLHandoffCenter />} />
        <Route path="crm/enrichment"   element={<LeadEnrichmentCenter />} />
        <Route path="analytics/attribution" element={<MultiTouchAttribution />} />
        <Route path="reports/digest"   element={<WeeklyExecutiveDigest />} />
        <Route path="reports/board"    element={<BoardReportGenerator />} />
        <Route path="seo/audit"        element={<SEOAudit />} />
        <Route path="seo/architecture" element={<SiteArchitecture />} />
        <Route path="seo/programmatic" element={<ProgrammaticSEO />} />
        <Route path="seo/schema"       element={<SchemaMarkup />} />
        <Route path="cro/page"         element={<PageCRO />} />
        <Route path="cro/forms"        element={<FormCRO />} />
        <Route path="cro/signup"       element={<SignupFlowCRO />} />
        <Route path="cro/onboarding"   element={<OnboardingCRO />} />
        <Route path="cro/popups"       element={<PopupCRO />} />
        <Route path="cro/paywall"      element={<PaywallCRO />} />
        <Route path="cro/ab-tests"     element={<ABTestDashboard />} />
        <Route path="marketing/lead-magnets" element={<LeadMagnets />} />
        <Route path="marketing/referral"     element={<ReferralProgram />} />
        <Route path="marketing/free-tools"   element={<FreeToolStrategy />} />
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
    </Suspense>
    </>
    </WorkspaceProvider>
  );
}
