import { useNavigate } from 'react-router-dom';
import useToast from '../hooks/useToast';
import { C, F, S, btn, flex } from '../tokens';

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
            GTM overview · 3 active campaigns
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
          {campaigns.map((c) => (
            <CampaignHealthCard key={c.id} {...c} />
          ))}
        </div>
      </div>

      {/* ── Bottom Row: Meta | Escalations | Agent Feed ── */}
      <div style={bottomRowStyle}>
        <MetaPerformanceWidget stats={metaStats} chartData={ctrChartData} />
        <EscalationMini escalations={escalationsSummary} />
        <AgentFeed feed={agentFeed} />
      </div>
    </div>
  );
}
