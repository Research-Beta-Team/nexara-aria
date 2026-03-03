import useWorkspace from '../hooks/useWorkspace';
import useStore from '../store/useStore';
import { getDashboardForClient } from '../data/dashboard';
import { C, F, S } from '../tokens';
import KPIHeader from '../components/dashboard/KPIHeader';
import NewCampaignChoice from '../components/campaign/NewCampaignChoice';
import CampaignHealthCards from '../components/dashboard/CampaignHealthCards';
import AriaInsightStrip from '../components/dashboard/AriaInsightStrip';
import MetaPerformanceWidget from '../components/dashboard/MetaPerformanceWidget';
import AgentActivityFeed from '../components/dashboard/AgentActivityFeed';
import EscalationMini from '../components/dashboard/EscalationMini';
import PipelineFunnelWidget from '../components/dashboard/PipelineFunnelWidget';
import SocialReachWidget from '../components/dashboard/SocialReachWidget';
import DonorPipelineWidget from '../components/dashboard/DonorPipelineWidget';
import ROASTrackerWidget from '../components/dashboard/ROASTrackerWidget';
import StartCampaignFromFile from '../components/dashboard/StartCampaignFromFile';
import StartupDashboard from './for_startups/StartupDashboard';

const PERSONA_LABELS = {
  cro: 'CRO',
  growth_marketer: 'Growth Marketer',
  bd_lead: 'BD Lead',
  campaign_coordinator: 'Campaign Coordinator',
};

const WIDGET_MAP = {
  campaign_health: CampaignHealthCards,
  meta_spend: MetaPerformanceWidget,
  aria_insights: AriaInsightStrip,
  agent_activity: AgentActivityFeed,
  escalation_queue: EscalationMini,
  pipeline_funnel: PipelineFunnelWidget,
  social_reach: SocialReachWidget,
  donor_pipeline: DonorPipelineWidget,
  roas_tracker: ROASTrackerWidget,
};

function WorkspaceDashboardContent() {
  const { profile, getKPIs, getAriaConfig, isModuleVisible } = useWorkspace();
  const activeClientId = useStore((s) => s.activeClientId);
  const data = getDashboardForClient(activeClientId ?? 'medglobal');
  const layout = profile?.layout ?? {};
  const widgetIds = layout.dashboardWidgets ?? ['campaign_health', 'aria_insights', 'agent_activity'];
  const colLayout = layout.dashboardLayout === '3-col' ? '1fr 1fr 1fr' : '1fr 1fr';
  const ariaConfig = getAriaConfig();
  const personaLabel = ariaConfig.persona ? PERSONA_LABELS[ariaConfig.persona] ?? ariaConfig.persona : null;

  return (
    <div style={{ padding: S[6], display: 'flex', flexDirection: 'column', gap: S[5], minHeight: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: S[3] }}>
        <div>
          <h1 style={{ fontFamily: F.display, fontSize: '22px', fontWeight: 800, color: C.textPrimary, margin: 0 }}>
            Dashboard
          </h1>
          <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
            {profile?.clientName ?? 'Dashboard'} · {data.campaigns?.length ?? 0} campaigns
          </span>
        </div>
        <NewCampaignChoice />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[4], alignItems: 'start' }}>
        <StartCampaignFromFile />
        <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textMuted }}>
          Or use <strong style={{ color: C.textSecondary }}>New campaign</strong> above to create manually or with ARIA step-by-step.
        </div>
      </div>

      <KPIHeader kpisConfig={getKPIs()} kpiValues={data.kpiValues} />

      <div style={{ display: 'grid', gridTemplateColumns: colLayout, gap: S[5], flex: 1 }}>
        {widgetIds.map((widgetId) => {
          const Widget = WIDGET_MAP[widgetId];
          if (!Widget) return null;
          if (widgetId === 'meta_spend' && !isModuleVisible('meta-monitoring')) return null;
          if (widgetId === 'pipeline_funnel' && !isModuleVisible('pipeline')) return null;

          if (widgetId === 'campaign_health') {
            return (
              <div key={widgetId} style={{ gridColumn: '1 / -1' }}>
                <CampaignHealthCards campaigns={data.campaigns ?? []} />
              </div>
            );
          }
          if (widgetId === 'aria_insights') {
            return (
              <div key={widgetId} style={{ gridColumn: '1 / -1' }}>
                <AriaInsightStrip
                  insights={(data.ariaInsights ?? []).slice(0, 3)}
                  personaLabel={personaLabel}
                  greeting={ariaConfig.greeting}
                />
              </div>
            );
          }
          if (widgetId === 'meta_spend') {
            return (
              <Widget
                key={widgetId}
                stats={data.metaStats}
                chartData={data.chartData}
              />
            );
          }
          if (widgetId === 'agent_activity') {
            return <Widget key={widgetId} feed={data.agentFeed ?? []} />;
          }
          if (widgetId === 'escalation_queue') {
            return <Widget key={widgetId} escalations={(data.escalationsSummary ?? []).slice(0, 3)} />;
          }
          if (widgetId === 'pipeline_funnel') {
            return <Widget key={widgetId} funnelData={data.pipelineFunnel ?? []} />;
          }
          return <Widget key={widgetId} />;
        })}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const segment = useStore((s) => s.segment);

  if (segment === 'startup') return <StartupDashboard embedded />;
  return <WorkspaceDashboardContent />;
}
