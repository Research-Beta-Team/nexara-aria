/**
 * Referral Program — marketing page.
 * Program structure builder with agent-powered design via Revenue agent.
 */
import { useState } from 'react';
import useToast from '../../hooks/useToast';
import { useAgent } from '../../hooks/useAgent';
import AgentThinking from '../../components/agents/AgentThinking';
import AgentResultPanel from '../../components/agents/AgentResultPanel';
import { C, F, R, S, btn, shadows } from '../../tokens';

const INCENTIVE_TYPES = [
  { id: 'discount', label: 'Discount', icon: '%' },
  { id: 'credit', label: 'Account Credit', icon: '$' },
  { id: 'gift', label: 'Gift Card', icon: '◇' },
  { id: 'free_month', label: 'Free Month', icon: '∞' },
  { id: 'feature', label: 'Feature Unlock', icon: '★' },
  { id: 'cash', label: 'Cash Reward', icon: '$' },
];

const MOCK_REFERRAL_METRICS = {
  totalReferrals: 147,
  convertedReferrals: 38,
  conversionRate: 25.9,
  avgRewardValue: 85,
  revenueFromReferrals: 42600,
  activeAdvocates: 23,
  topAdvocate: { name: 'Sarah Chen', referrals: 12, converted: 8 },
};

export default function ReferralProgram() {
  const toast = useToast();
  const revenueAgent = useAgent('revenue');
  const [agentResult, setAgentResult] = useState(null);
  const [selectedIncentive, setSelectedIncentive] = useState('credit');
  const [rewardValue, setRewardValue] = useState('50');
  const [referrerReward, setReferrerReward] = useState('50');
  const [refereeReward, setRefereeReward] = useState('25');
  const m = MOCK_REFERRAL_METRICS;

  const handleDesignProgram = async () => {
    toast.info('Revenue agent designing referral program...');
    const result = await revenueAgent.activate('referral-program', {
      task: 'Design a comprehensive referral program with incentives, terms, and tracking strategy',
      incentiveType: selectedIncentive,
      referrerReward,
      refereeReward,
      targetAudience: 'Existing customers in healthcare NGO space',
    });
    setAgentResult(result);
    toast.success('Referral program specification ready.');
  };

  return (
    <div style={{ minHeight: '100%', backgroundColor: C.bg, padding: S[6] }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: S[4], marginBottom: S[6] }}>
        <div>
          <h1 style={{ fontFamily: F.display, fontSize: '22px', fontWeight: 700, color: C.textPrimary, margin: `0 0 ${S[2]} 0` }}>
            Referral Program
          </h1>
          <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: 0 }}>
            Build and manage your referral program. Design incentives, track advocates, and measure referral revenue.
          </p>
        </div>
        <button
          type="button"
          style={{ ...btn.primary, fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: 6 }}
          onClick={handleDesignProgram}
          disabled={revenueAgent.isActive}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
          Design program
        </button>
      </div>

      {/* Analytics section */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: S[4], marginBottom: S[6],
      }}>
        {[
          { label: 'Total Referrals', value: m.totalReferrals, color: C.textPrimary },
          { label: 'Converted', value: m.convertedReferrals, color: C.green },
          { label: 'Conversion Rate', value: `${m.conversionRate}%`, color: C.primary },
          { label: 'Avg Reward', value: `$${m.avgRewardValue}`, color: C.amber },
          { label: 'Referral Revenue', value: `$${m.revenueFromReferrals.toLocaleString()}`, color: C.primary },
          { label: 'Active Advocates', value: m.activeAdvocates, color: C.secondary },
        ].map((metric) => (
          <div key={metric.label} style={{
            backgroundColor: C.surface, border: `1px solid ${C.border}`,
            borderRadius: R.card, padding: S[4], boxShadow: shadows.card,
          }}>
            <div style={{ fontFamily: F.mono, fontSize: '22px', fontWeight: 700, color: metric.color, marginBottom: '2px' }}>
              {metric.value}
            </div>
            <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {metric.label}
            </div>
          </div>
        ))}
      </div>

      {/* Top advocate */}
      <div style={{
        backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card,
        padding: S[5], marginBottom: S[6], display: 'flex', alignItems: 'center', gap: S[4],
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%', backgroundColor: C.primaryGlow,
          border: `2px solid ${C.primary}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: F.mono, fontSize: '14px', fontWeight: 700, color: C.primary,
        }}>
          {m.topAdvocate.name.split(' ').map(w => w[0]).join('')}
        </div>
        <div>
          <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>
            Top Advocate: {m.topAdvocate.name}
          </div>
          <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>
            {m.topAdvocate.referrals} referrals, {m.topAdvocate.converted} converted
          </div>
        </div>
      </div>

      {/* Program structure builder */}
      <div style={{
        backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card,
        padding: S[5], marginBottom: S[6],
      }}>
        <h2 style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary, margin: `0 0 ${S[4]} 0` }}>
          Program Structure
        </h2>

        {/* Incentive type selector */}
        <div style={{ marginBottom: S[5] }}>
          <label style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, display: 'block', marginBottom: S[2] }}>
            Incentive Type
          </label>
          <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap' }}>
            {INCENTIVE_TYPES.map(type => (
              <button
                key={type.id}
                type="button"
                onClick={() => setSelectedIncentive(type.id)}
                style={{
                  padding: `${S[2]} ${S[4]}`, backgroundColor: selectedIncentive === type.id ? C.primaryGlow : C.surface2,
                  color: selectedIncentive === type.id ? C.primary : C.textSecondary,
                  border: `1px solid ${selectedIncentive === type.id ? C.primary : C.border}`,
                  borderRadius: R.button, fontFamily: F.body, fontSize: '13px', cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}
              >
                <span>{type.icon}</span> {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reward values */}
        <div style={{ display: 'flex', gap: S[5], flexWrap: 'wrap', marginBottom: S[4] }}>
          <div>
            <label style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, display: 'block', marginBottom: S[2] }}>
              Referrer Reward ($)
            </label>
            <input
              type="number"
              value={referrerReward}
              onChange={(e) => setReferrerReward(e.target.value)}
              style={{
                width: '140px', padding: `${S[2]} ${S[3]}`, fontFamily: F.body, fontSize: '14px',
                backgroundColor: C.surface2, border: `1px solid ${C.border}`, borderRadius: R.input,
                color: C.textPrimary, outline: 'none',
              }}
            />
          </div>
          <div>
            <label style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, display: 'block', marginBottom: S[2] }}>
              Referee Reward ($)
            </label>
            <input
              type="number"
              value={refereeReward}
              onChange={(e) => setRefereeReward(e.target.value)}
              style={{
                width: '140px', padding: `${S[2]} ${S[3]}`, fontFamily: F.body, fontSize: '14px',
                backgroundColor: C.surface2, border: `1px solid ${C.border}`, borderRadius: R.input,
                color: C.textPrimary, outline: 'none',
              }}
            />
          </div>
        </div>
      </div>

      {/* Agent thinking / result */}
      {revenueAgent.isActive && (
        <div style={{ marginBottom: S[5] }}>
          <AgentThinking agentId="revenue" task="Designing referral program with incentives, terms, and tracking..." />
        </div>
      )}
      {agentResult && !revenueAgent.isActive && (
        <div style={{ marginBottom: S[5] }}>
          <AgentResultPanel result={agentResult} />
        </div>
      )}
    </div>
  );
}
