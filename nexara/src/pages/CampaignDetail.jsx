import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import useToast from '../hooks/useToast';
import { C, F, R, S, T, btn, badge, flex, shadows } from '../tokens';
import { campaigns, campaignDetail } from '../data/campaigns';

// Tab panels
import OverviewTab  from '../components/campaign/tabs/OverviewTab';
import StrategyTab  from '../components/campaign/tabs/StrategyTab';
import ContentTab   from '../components/campaign/tabs/ContentTab';
import OutreachTab  from '../components/campaign/tabs/OutreachTab';
import PaidAdsTab   from '../components/campaign/tabs/PaidAdsTab';
import AnalyticsTab from '../components/campaign/tabs/AnalyticsTab';
import CalendarTab  from '../components/campaign/tabs/CalendarTab';
import PlanTab      from '../components/campaign/tabs/PlanTab';

const TABS = [
  { id: 'overview',  label: 'Overview'   },
  { id: 'strategy',  label: 'Strategy'   },
  { id: 'content',   label: 'Content'    },
  { id: 'outreach',  label: 'Outreach'   },
  { id: 'paidads',   label: 'Paid Ads'   },
  { id: 'analytics', label: 'Analytics'  },
  { id: 'calendar',  label: 'Calendar'   },
  { id: 'plan',      label: 'Plan'       },
];

const HEALTH_COLOR = { on_track: C.primary, ahead: C.secondary, at_risk: C.red };
const STATUS_BADGE = {
  active:    { ...badge.base, ...badge.green },
  paused:    { ...badge.base, ...badge.amber },
  draft:     { ...badge.base, ...badge.muted },
  completed: { ...badge.base, backgroundColor: 'rgba(94,234,212,0.12)', color: '#5EEAD4', border: '1px solid rgba(94,234,212,0.2)' },
};

// ── KPI Box ───────────────────────────────────
function KpiBox({ label, value, delta, up }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
      padding: `${S[3]} ${S[4]}`,
      backgroundColor: C.surface2,
      border: `1px solid ${C.border}`,
      borderRadius: R.md,
      flex: 1,
    }}>
      <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
      <span style={{ fontFamily: F.mono, fontSize: '20px', fontWeight: 700, color: C.textPrimary, lineHeight: 1 }}>{value}</span>
      {delta && (
        <span style={{ fontFamily: F.mono, fontSize: '11px', color: up ? C.primary : C.red }}>
          {delta} vs last period
        </span>
      )}
    </div>
  );
}

// ── Campaign Header ───────────────────────────
function CampaignHeader({ campaign, detail }) {
  const navigate = useNavigate();
  const toast = useToast();
  const { name, client, status, health, goal, current } = campaign;
  const pct = Math.min(100, Math.round((current / goal) * 100));
  const barColor = HEALTH_COLOR[health] ?? C.primary;

  return (
    <div style={{
      backgroundColor: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: R.card,
      padding: S[5],
      display: 'flex',
      flexDirection: 'column',
      gap: S[4],
    }}>
      {/* Top row */}
      <div style={flex.rowBetween}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
          <button
            style={{ ...btn.ghost, padding: `${S[1]} ${S[2]}`, color: C.textMuted, fontSize: '12px' }}
            onClick={() => navigate('/campaigns')}
          >
            ← Campaigns
          </button>
          <div style={{ width: '1px', height: '16px', backgroundColor: C.border }}/>
          <h1 style={{ fontFamily: F.display, fontSize: '18px', fontWeight: 800, color: C.textPrimary, margin: 0, letterSpacing: '-0.02em' }}>
            {name}
          </h1>
          <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>{client}</span>
          <span style={STATUS_BADGE[status] ?? STATUS_BADGE.draft}>{status}</span>
        </div>
        <div style={{ display: 'flex', gap: S[2] }}>
          <button style={{ ...btn.ghost, fontSize: '13px' }} onClick={() => toast.info('Share campaign coming soon')}>
            Share
          </button>
          <button style={{ ...btn.secondary, fontSize: '13px' }} onClick={() => toast.info('Editing campaign settings')}>
            Settings
          </button>
          <button style={{ ...btn.primary, fontSize: '13px' }} onClick={() => toast.success('Generating ARIA report…')}>
            ARIA Report
          </button>
        </div>
      </div>

      {/* Progress + KPIs */}
      <div style={{ display: 'flex', gap: S[6], alignItems: 'flex-start' }}>
        {/* Goal progress */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[2], minWidth: '180px' }}>
          <div style={flex.rowBetween}>
            <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>Goal Progress</span>
            <span style={{ fontFamily: F.mono, fontSize: '12px', color: C.textPrimary }}>{current} / {goal} leads</span>
          </div>
          <div style={{ height: '8px', borderRadius: R.pill, backgroundColor: C.surface3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, borderRadius: R.pill, backgroundColor: barColor, boxShadow: `0 0 8px ${barColor}40` }}/>
          </div>
          <span style={{ fontFamily: F.mono, fontSize: '12px', color: barColor }}>{pct}% of goal</span>
        </div>

        {/* KPI boxes */}
        <div style={{ display: 'flex', gap: S[3], flex: 1 }}>
          {(detail?.kpis ?? []).map((kpi) => (
            <KpiBox key={kpi.label} {...kpi} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────
export default function CampaignDetail() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const campaign = campaigns.find((c) => c.id === id) ?? campaigns[0];
  const detail   = campaignDetail[campaign?.id];

  const setTab = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  const tabBarStyle = {
    display: 'flex',
    borderBottom: `1px solid ${C.border}`,
    backgroundColor: C.surface,
    borderRadius: `${R.card} ${R.card} 0 0`,
    overflow: 'hidden',
    gap: 0,
  };

  const tabStyle = (active) => ({
    fontFamily: F.body,
    fontSize: '13px',
    fontWeight: active ? 600 : 400,
    color: active ? C.primary : C.textSecondary,
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: active ? `2px solid ${C.primary}` : '2px solid transparent',
    padding: `${S[3]} ${S[4]}`,
    cursor: 'pointer',
    transition: T.color,
    whiteSpace: 'nowrap',
  });

  const tabPanelStyle = {
    backgroundColor: C.surface,
    border: `1px solid ${C.border}`,
    borderTop: 'none',
    borderRadius: `0 0 ${R.card} ${R.card}`,
    minHeight: '500px',
    overflow: 'hidden',
  };

  const tabProps = { campaign, detail };

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':  return <OverviewTab  {...tabProps} />;
      case 'strategy':  return <StrategyTab  {...tabProps} />;
      case 'content':   return <ContentTab   {...tabProps} />;
      case 'outreach':  return <OutreachTab  {...tabProps} />;
      case 'paidads':   return <PaidAdsTab   {...tabProps} />;
      case 'analytics': return <AnalyticsTab {...tabProps} />;
      case 'calendar':  return <CalendarTab  {...tabProps} />;
      case 'plan':      return <PlanTab      {...tabProps} />;
      default:          return <OverviewTab  {...tabProps} />;
    }
  };

  return (
    <div style={{ padding: S[6], display: 'flex', flexDirection: 'column', gap: S[4] }}>
      <CampaignHeader campaign={campaign} detail={detail} />

      {/* Tab bar + panel */}
      <div>
        <div style={tabBarStyle}>
          {TABS.map((t) => (
            <button key={t.id} style={tabStyle(activeTab === t.id)} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
        <div style={tabPanelStyle}>
          {renderTab()}
        </div>
      </div>
    </div>
  );
}
