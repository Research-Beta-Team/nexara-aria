import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import usePlan from '../../hooks/usePlan';
import usePlanAlerts from '../../hooks/usePlanAlerts';
import useToast from '../../hooks/useToast';
import { C, F, R, S, Z, btn, flex, cardStyle } from '../../tokens';
import CampaignHealthCard from '../../components/dashboard/CampaignHealthCard';
import FounderDailyBrief from '../../components/dashboard/FounderDailyBrief';
import PlanWelcomeBanner from '../../components/plan/PlanWelcomeBanner';
import MetaPerformanceWidget from '../../components/dashboard/MetaPerformanceWidget';
import AgentFeed from '../../components/dashboard/AgentFeed';
import EscalationMini from '../../components/dashboard/EscalationMini';
import ARIAWeeklyBrief from '../../components/freya/ARIAWeeklyBrief';
import ARIAProactiveCard from '../../components/freya/ARIAProactiveCard';
import DualApprovalCard from '../../components/approvals/DualApprovalCard';
import {
  campaigns,
  agentFeed,
  escalationsSummary,
  metaStats,
  ctrChartData,
} from '../../data/dashboard';
import { MOCK_WEEKLY_BRIEF } from '../../data/weeklyBrief';
import { shouldShowWeeklyBrief } from '../../components/freya/ARIAWeeklyBrief';

const DECISIONS_MOCK = [
  { id: 'd1', title: 'Budget approval $800 Meta reallocation', campaign: 'APAC Brand', actions: ['Approve', 'Review'] },
  { id: 'd2', title: 'Strategy sign-off: Q2 ICP refresh', campaign: 'CFO Vietnam', actions: ['Review Brief'] },
  { id: 'd3', title: 'Client report due: Apex Corp, today', actions: ['Generate Report'] },
];

export default function DashboardOwner() {
  const navigate = useNavigate();
  const toast = useToast();
  const openCheckout = useStore((s) => s.openCheckout);
  const activeCampaignsCount = useStore((s) => s.activeCampaignsCount);
  const currentPlanId = useStore((s) => s.currentPlanId);
  const freyaBriefModalOpen = useStore((s) => s.freyaBriefModalOpen);
  const setFreyaBriefModalOpen = useStore((s) => s.setFreyaBriefModalOpen);
  const [briefRefreshKey, setBriefRefreshKey] = useState(0);
  const [executingRec, setExecutingRec] = useState(null);
  const [syntheticEscalation, setSyntheticEscalation] = useState(null);
  const showBrief = shouldShowWeeklyBrief();
  const { hasFeature, getLimit, isLimitReached } = usePlan();
  const { showWelcomeBanner, dismissWelcomeBanner } = usePlanAlerts();
  const campaignLimit = getLimit('activeCampaigns');
  const atCampaignLimit = campaignLimit !== -1 && isLimitReached('activeCampaigns', activeCampaignsCount);
  const displayCampaigns = campaignLimit === -1 ? campaigns : campaigns.slice(0, campaignLimit);

  const handleActionRequired = (item) => {
    if (item.actionPath) navigate(item.actionPath);
    else useStore.getState().toggleFreya();
  };
  const handleExecuteRecommendation = (rec) => {
    if (rec.executionType === 'dual_approval') {
      setExecutingRec(rec);
      setSyntheticEscalation({
        id: `brief-${rec.id}`,
        title: rec.text,
        severity: 'Medium',
        agentType: 'Budget Guardian',
        campaign: rec.payload?.campaign ?? 'APAC Brand Awareness',
        budgetApprovalRequired: true,
        budgetAmount: rec.payload?.budgetAmount ?? 800,
        strategyApprovalStatus: 'pending',
        budgetApprovalStatus: 'pending',
        strategyApprovedBy: null,
        budgetApprovedBy: null,
        budgetContext: {
          campaignBudget: 4000,
          changeAmount: rec.payload?.budgetAmount ?? 800,
          changeLabel: `+$${(rec.payload?.budgetAmount ?? 800).toLocaleString()} to LinkedIn`,
          newTotal: (rec.payload?.budgetAmount ?? 800) + 4000,
        },
        ariaRecommendation: rec.text,
      });
    } else {
      toast.success('Freya generating…');
      useStore.getState().toggleFreya();
    }
  };
  const handleDualStrategyApprove = () => setSyntheticEscalation((e) => e ? { ...e, strategyApprovalStatus: 'approved', strategyApprovedBy: { name: 'You', timestamp: 'Just now' } } : null);
  const handleDualBudgetApprove = () => setSyntheticEscalation((e) => e ? { ...e, budgetApprovalStatus: 'approved', budgetApprovedBy: { name: 'You', timestamp: 'Just now' } } : null);
  const handleDualDecline = () => { setExecutingRec(null); setSyntheticEscalation(null); toast.info('Declined'); };
  const handleDualExecute = () => { toast.success('Action executed'); setExecutingRec(null); setSyntheticEscalation(null); };

  return (
    <div style={{ padding: S[6], display: 'flex', flexDirection: 'column', gap: S[5], minHeight: '100%' }}>
      {showBrief && (
        <ARIAWeeklyBrief
          key={briefRefreshKey}
          brief={MOCK_WEEKLY_BRIEF}
          onDismiss={() => setBriefRefreshKey((k) => k + 1)}
          onActionRequired={handleActionRequired}
          onExecuteRecommendation={handleExecuteRecommendation}
          variant="inline"
        />
      )}
      <div style={flex.rowBetween}>
        <div>
          <h1 style={{ fontFamily: F.display, fontSize: '22px', fontWeight: 800, color: C.textPrimary, margin: 0 }}>Dashboard</h1>
          <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>Command center · {displayCampaigns.length} campaigns</span>
        </div>
        <div style={{ display: 'flex', gap: S[2] }}>
          <button style={{ ...btn.secondary, fontSize: '13px' }} onClick={() => toast.info('Export coming soon')}>Export</button>
          <button style={{ ...btn.primary, fontSize: '13px' }} onClick={() => navigate('/campaigns/new')}>New Campaign</button>
        </div>
      </div>
      {showWelcomeBanner ? (
        <PlanWelcomeBanner planId={currentPlanId} onDismiss={dismissWelcomeBanner} />
      ) : (
        <FounderDailyBrief />
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '35% 1fr', gap: S[5] }}>
        <div>
          <h2 style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', margin: `0 0 ${S[3]}` }}>Decisions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
            {DECISIONS_MOCK.map((d) => (
              <div key={d.id} style={{ ...cardStyle, padding: S[4] }}>
                <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary, marginBottom: S[1] }}>{d.title}</div>
                {d.campaign && <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>{d.campaign}</span>}
                <div style={{ display: 'flex', gap: S[2], marginTop: S[3] }}>
                  {d.actions.map((a) => (
                    <button key={a} style={{ ...btn[a === 'Approve' ? 'primary' : 'secondary'], fontSize: '12px' }} onClick={() => toast.info(a)}>{a}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', margin: `0 0 ${S[3]}` }}>Campaign Health</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: S[4] }}>
            {displayCampaigns.map((c) => (
              <CampaignHealthCard key={c.id} {...c} />
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: S[4] }}>
        {hasFeature('metaAdsMonitoring') ? (
          <MetaPerformanceWidget stats={metaStats} chartData={ctrChartData} />
        ) : (
          <div style={{ ...cardStyle, padding: S[5], textAlign: 'center' }}>
            <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textMuted }}>Meta performance</div>
            <button style={{ ...btn.primary, fontSize: '12px', marginTop: S[2] }} onClick={() => openCheckout('growth', 'dashboard')}>Upgrade</button>
          </div>
        )}
        <EscalationMini escalations={escalationsSummary} />
        <AgentFeed feed={agentFeed} />
      </div>
      {freyaBriefModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(7,13,9,0.7)', zIndex: Z.modal, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: S[4] }} onClick={() => setFreyaBriefModalOpen(false)}>
          <div style={{ maxWidth: '900px', width: '100%' }} onClick={(e) => e.stopPropagation()}>
            <ARIAWeeklyBrief brief={MOCK_WEEKLY_BRIEF} onDismiss={() => setFreyaBriefModalOpen(false)} onActionRequired={handleActionRequired} onExecuteRecommendation={handleExecuteRecommendation} variant="modal" />
          </div>
        </div>
      )}
      {executingRec && syntheticEscalation && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(7,13,9,0.7)', zIndex: Z.modal, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: S[4] }} onClick={handleDualDecline}>
          <div style={{ maxWidth: '640px', width: '100%' }} onClick={(e) => e.stopPropagation()}>
            <DualApprovalCard escalation={syntheticEscalation} onStrategyApprove={handleDualStrategyApprove} onBudgetApprove={handleDualBudgetApprove} onDecline={handleDualDecline} onExecute={handleDualExecute} resolved={false} />
          </div>
        </div>
      )}
      <ARIAProactiveCard />
    </div>
  );
}
