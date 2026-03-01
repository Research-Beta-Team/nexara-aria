import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import usePlan from '../hooks/usePlan';
import useToast from '../hooks/useToast';
import { C, F, R, S, btn, flex, cardStyle } from '../tokens';

// Components
import CampaignHealthCard    from '../components/dashboard/CampaignHealthCard';
import AriaInsightStrip      from '../components/dashboard/AriaInsightStrip';
import MetaPerformanceWidget from '../components/dashboard/MetaPerformanceWidget';
import AgentFeed             from '../components/dashboard/AgentFeed';
import EscalationMini        from '../components/dashboard/EscalationMini';

// Mock data
import {
  campaigns,
  agentFeed,
  escalationsSummary,
  metaStats,
  ariaInsights,
  ctrChartData,
} from '../data/dashboard';

export default function Dashboard() {
  const navigate = useNavigate();
  const toast = useToast();
  const openCheckout = useStore((s) => s.openCheckout);
  const activeCampaignsCount = useStore((s) => s.activeCampaignsCount);
  const { hasFeature, getLimit, isLimitReached } = usePlan();

  const campaignLimit = getLimit('activeCampaigns');
  const atCampaignLimit = campaignLimit !== -1 && isLimitReached('activeCampaigns', activeCampaignsCount);
  const displayCampaigns = campaignLimit === -1 ? campaigns : campaigns.slice(0, campaignLimit);
  const campaignSubtitle = campaignLimit === -1
    ? `${campaigns.length} active campaigns`
    : `${displayCampaigns.length} / ${campaignLimit} campaigns`;

  const pageStyle = {
    padding: S[6],
    display: 'flex',
    flexDirection: 'column',
    gap: S[5],
    minHeight: '100%',
  };

  const pageHeadStyle = {
    ...flex.rowBetween,
    flexWrap: 'wrap',
    gap: S[3],
  };

  const titleGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  };

  // Responsive grid: 3-col on wide, collapse via minmax
  const campaignGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: S[4],
  };

  const bottomRowStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: S[4],
    alignItems: 'start',
  };

  return (
    <div style={pageStyle}>
      {/* ── Page Header ── */}
      <div style={pageHeadStyle}>
        <div style={titleGroupStyle}>
          <h1 style={{
            fontFamily: F.display,
            fontSize: '22px',
            fontWeight: 800,
            color: C.textPrimary,
            margin: 0,
            letterSpacing: '-0.02em',
          }}>
            Dashboard
          </h1>
          <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
            GTM overview · {campaignSubtitle}
          </span>
        </div>

        <div style={{ display: 'flex', gap: S[2], alignItems: 'center' }}>
          <button
            style={{ ...btn.secondary, fontSize: '13px', padding: `${S[1]} ${S[4]}` }}
            onClick={() => toast.info('Export report coming soon')}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v8M4 6l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M1 10v2a1 1 0 001 1h10a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Export
          </button>
          <button
            style={{ ...btn.primary, fontSize: '13px', padding: `${S[1]} ${S[4]}` }}
            onClick={() => navigate('/campaigns/new')}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            New Campaign
          </button>
        </div>
      </div>

      {/* ── ARIA Insight Strip ── */}
      <AriaInsightStrip insights={ariaInsights} />

      {/* ── Campaign Health Cards (3-col grid) ── */}
      <div>
        <h2 style={{
          fontFamily: F.display,
          fontSize: '13px',
          fontWeight: 700,
          color: C.textMuted,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          margin: `0 0 ${S[3]}`,
        }}>
          Campaign Health
        </h2>
        <div style={campaignGridStyle}>
          {displayCampaigns.map((c) => (
            <CampaignHealthCard key={c.id} {...c} />
          ))}
        </div>
      </div>

      {/* ── Bottom Row: Meta | Escalations | Agent Feed (or upgrade card) ── */}
      <div style={bottomRowStyle}>
        {hasFeature('metaAdsMonitoring') ? (
          <MetaPerformanceWidget stats={metaStats} chartData={ctrChartData} />
        ) : (
          <div
            style={{
              ...cardStyle,
              padding: S[5],
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '160px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textMuted, marginBottom: S[2] }}>Meta performance</div>
            <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, margin: `0 0 ${S[3]} 0` }}>Upgrade to unlock Meta Monitor</p>
            <button style={{ ...btn.primary, fontSize: '12px' }} onClick={() => openCheckout('growth', 'dashboard')}>Upgrade to unlock</button>
          </div>
        )}
        <EscalationMini escalations={escalationsSummary} />
        <AgentFeed feed={agentFeed} />
      </div>

      {/* ── Upgrade CTA for Starter (locked features) ── */}
      {!hasFeature('unifiedInbox') && (
        <div
          style={{
            ...cardStyle,
            padding: S[5],
            borderStyle: 'dashed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: S[4],
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary, marginBottom: '4px' }}>Unified Inbox, ABM & more</div>
            <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>Get unlimited campaigns, Intent Signals, and Pipeline views.</div>
          </div>
          <button style={{ ...btn.secondary, fontSize: '13px' }} onClick={() => navigate('/billing/upgrade')}>Upgrade to Growth</button>
        </div>
      )}
    </div>
  );
}
