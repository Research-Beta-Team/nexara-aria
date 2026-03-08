import useWorkspace from '../hooks/useWorkspace';
import useStore from '../store/useStore';
import { getDashboardForClient } from '../data/dashboard';
import { C, F, S } from '../tokens';
import DashboardWelcome from '../components/dashboard/DashboardWelcome';
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

const sectionTitleStyle = {
  fontFamily: F.display,
  fontSize: '11px',
  fontWeight: 700,
  color: C.textMuted,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  margin: 0,
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
  const campaignCount = data.campaigns?.length ?? 0;
  const showMeta = widgetIds.includes('meta_spend') && isModuleVisible('meta-monitoring');
  const showPipeline = widgetIds.includes('pipeline_funnel') && isModuleVisible('pipeline');
  const pipelineInMetaRow = showMeta && showPipeline;

  return (
    <div
      style={{
        padding: S[6],
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        minHeight: '100%',
        maxWidth: '1600px',
        margin: '0 auto',
      }}
    >
      {/* Personalized welcome */}
      <DashboardWelcome
        clientName={profile?.clientName}
        campaignCount={campaignCount}
      />

      {/* Primary actions: New campaign + Start from file */}
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: S[4],
          marginBottom: S[6],
        }}
      >
        <div
          style={{
            flex: '1 1 320px',
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: S[3],
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: S[2] }}>
            <h2 style={{ ...sectionTitleStyle, marginBottom: S[1] }}>Quick start</h2>
            <NewCampaignChoice />
          </div>
          <StartCampaignFromFile />
        </div>
        <div
          style={{
            flex: '0 1 280px',
            display: 'flex',
            alignItems: 'center',
            padding: `0 ${S[4]}`,
          }}
        >
          <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textMuted, margin: 0, lineHeight: 1.5 }}>
            Or use <strong style={{ color: C.textSecondary }}>New campaign</strong> to create manually or with Freya step-by-step.
          </p>
        </div>
      </div>

      {/* KPIs */}
      <section style={{ marginBottom: S[6] }}>
        <h2 style={{ ...sectionTitleStyle, marginBottom: S[3] }}>Key metrics</h2>
        <KPIHeader kpisConfig={getKPIs()} kpiValues={data.kpiValues} />
      </section>

      {/* Widgets grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: colLayout,
          gap: S[5],
          flex: 1,
        }}
      >
        {widgetIds.map((widgetId) => {
          const Widget = WIDGET_MAP[widgetId];
          if (!Widget) return null;
          if (widgetId === 'meta_spend' && !isModuleVisible('meta-monitoring')) return null;
          if (widgetId === 'pipeline_funnel' && !isModuleVisible('pipeline')) return null;

          if (widgetId === 'campaign_health') {
            return (
              <section key={widgetId} style={{ gridColumn: '1 / -1' }}>
                <h2 style={{ ...sectionTitleStyle, marginBottom: S[3] }}>Campaign health</h2>
                <CampaignHealthCards campaigns={data.campaigns ?? []} />
              </section>
            );
          }
          if (widgetId === 'aria_insights') {
            return (
              <section key={widgetId} style={{ gridColumn: '1 / -1' }}>
                <h2 style={{ ...sectionTitleStyle, marginBottom: S[3] }}>Freya insights</h2>
                <AriaInsightStrip
                  insights={(data.ariaInsights ?? []).slice(0, 3)}
                  personaLabel={personaLabel}
                  greeting={ariaConfig.greeting}
                />
              </section>
            );
          }
          if (widgetId === 'meta_spend') {
            return (
              <section key="meta_spend-pipeline_row" style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: pipelineInMetaRow ? '1fr 1fr' : '1fr', gap: S[5], alignItems: 'stretch' }}>
                <MetaPerformanceWidget stats={data.metaStats} chartData={data.chartData} />
                {pipelineInMetaRow && (
                  <PipelineFunnelWidget funnelData={data.pipelineFunnel ?? []} />
                )}
              </section>
            );
          }
          if (widgetId === 'pipeline_funnel') {
            if (pipelineInMetaRow) return null;
            return <PipelineFunnelWidget key={widgetId} funnelData={data.pipelineFunnel ?? []} />;
          }
          if (widgetId === 'agent_activity') {
            return <Widget key={widgetId} feed={data.agentFeed ?? []} />;
          }
          if (widgetId === 'escalation_queue') {
            return <Widget key={widgetId} escalations={(data.escalationsSummary ?? []).slice(0, 3)} />;
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
