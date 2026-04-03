import { useState, useMemo, useCallback } from 'react';
import useToast from '../../hooks/useToast';
import { useAgent } from '../../hooks/useAgent';
import AgentThinking from '../../components/agents/AgentThinking';
import AgentResultPanel from '../../components/agents/AgentResultPanel';
import AgentStatusBar from '../../components/agents/AgentStatusBar';
import { C, F, R, S, btn, sectionHeading } from '../../tokens';
import { PIPELINE_STAGES, DEALS, getPipelineStats } from '../../data/pipeline';
import PipelineStats from '../../components/pipeline/PipelineStats';
import KanbanBoard from '../../components/pipeline/KanbanBoard';
import DealDetailPanel from '../../components/pipeline/DealDetailPanel';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function formatCurrency(value) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

// Hex for Recharts
const COLOR = { mint: '#3DDC84', teal: '#5EEAD4', amber: '#F5C842' };

// Mock month-by-month forecast (Jan–Mar 2026)
const FORECAST_CHART_DATA = [
  { month: 'Jan 2026', closedWon: 85, likely: 120, atRisk: 45 },
  { month: 'Feb 2026', closedWon: 95, likely: 140, atRisk: 38 },
  { month: 'Mar 2026', closedWon: 100, likely: 185, atRisk: 35 },
];

const STAGE_PROBABILITY = {
  IQL: 5, MQL: 15, SQL: 25, 'Demo Booked': 40, 'Proposal Sent': 55,
  Negotiation: 70, 'Closed Won': 100, 'Closed Lost': 0,
};

export default function PipelineManager() {
  const [view, setView] = useState('kanban');
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [deals, setDeals] = useState(() => [...DEALS]);
  const [forecastResult, setForecastResult] = useState(null);
  const [proposalResult, setProposalResult] = useState(null);
  const [forecastDealId, setForecastDealId] = useState(null);
  const [proposalDealId, setProposalDealId] = useState(null);
  const toast = useToast();
  const revenueAgent = useAgent('revenue');

  const stats = useMemo(() => getPipelineStats(deals), [deals]);
  const atRiskDeals = useMemo(() => deals.filter((d) => d.health === 'at_risk'), [deals]);

  const handleDealStageChange = useCallback((dealId, newStage) => {
    setDeals((prev) => {
      const next = prev.map((d) =>
        d.id === dealId
          ? {
              ...d,
              stage: newStage,
              probability: STAGE_PROBABILITY[newStage] ?? d.probability,
              daysInStage: 0,
            }
          : d
      );
      return next;
    });
    const deal = deals.find((d) => d.id === dealId);
    if (deal) {
      setSelectedDeal((s) => (s?.id === dealId ? { ...s, stage: newStage, probability: STAGE_PROBABILITY[newStage] ?? s.probability, daysInStage: 0 } : s));
      toast.success(`${deal.company} moved to ${newStage}`);
    }
  }, [deals, toast]);

  const handleForecastDeal = useCallback(async (deal) => {
    setForecastDealId(deal.id);
    setForecastResult(null);
    try {
      const result = await revenueAgent.activate(
        { description: `Forecast deal: ${deal.company}`, skill: 'revops', input: { pipeline_data: deal, period: 'Q1 2026' } },
        { dealId: deal.id, company: deal.company }
      );
      if (result) {
        setForecastResult({ ...result, confidence: Math.round((result.confidence || 0.8) * 100) });
        toast.success(`Deal forecast complete for ${deal.company}`);
      }
    } catch (err) {
      toast.error('Forecast failed: ' + err.message);
    } finally {
      setForecastDealId(null);
    }
  }, [revenueAgent, toast]);

  const handleGenerateProposal = useCallback(async (deal) => {
    setProposalDealId(deal.id);
    setProposalResult(null);
    try {
      const result = await revenueAgent.activate(
        { description: `Generate proposal for ${deal.company}`, skill: 'sales-enablement', input: { product: 'Antarious GTM OS', icp: deal.company, competitors: [] } },
        { dealId: deal.id, company: deal.company }
      );
      if (result) {
        setProposalResult({ ...result, confidence: Math.round((result.confidence || 0.85) * 100) });
        toast.success(`Proposal generated for ${deal.company}`);
      }
    } catch (err) {
      toast.error('Proposal generation failed: ' + err.message);
    } finally {
      setProposalDealId(null);
    }
  }, [revenueAgent, toast]);

  return (
    <div style={{ padding: S[6], display: 'flex', flexDirection: 'column', gap: S[5], height: '100%', minHeight: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: S[3] }}>
        <h1 style={{ ...sectionHeading, fontSize: '22px', letterSpacing: '-0.02em', margin: 0 }}>
          Pipeline Manager
        </h1>
        <div style={{ display: 'flex', gap: S[2] }}>
          {['kanban', 'list', 'forecast'].map((v) => (
            <button
              key={v}
              style={{
                ...btn.secondary,
                fontSize: '13px',
                backgroundColor: view === v ? 'rgba(61,220,132,0.12)' : undefined,
                borderColor: view === v ? C.primary : undefined,
                color: view === v ? C.primary : undefined,
              }}
              onClick={() => setView(v)}
            >
              {v === 'kanban' ? 'Kanban' : v === 'list' ? 'List' : 'Forecast'}
            </button>
          ))}
        </div>
      </div>

      {/* Revenue Agent Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: S[3], padding: `${S[2]} ${S[3]}`, backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card }}>
        <div style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: revenueAgent.isActive ? C.amber : C.green,
          animation: revenueAgent.isActive ? 'agentStatusPulse 2s ease-in-out infinite' : 'none',
        }} />
        <span style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 600, color: revenueAgent.isActive ? C.amber : C.textSecondary }}>
          Revenue Agent: {revenueAgent.isActive ? 'Working...' : 'Ready'}
        </span>
        {selectedDeal && (
          <div style={{ marginLeft: 'auto', display: 'flex', gap: S[2] }}>
            <button
              style={{ ...btn.primary, fontSize: '12px', opacity: revenueAgent.isActive ? 0.5 : 1 }}
              disabled={revenueAgent.isActive}
              onClick={() => handleForecastDeal(selectedDeal)}
            >
              Forecast this deal
            </button>
            <button
              style={{ ...btn.secondary, fontSize: '12px', opacity: revenueAgent.isActive ? 0.5 : 1 }}
              disabled={revenueAgent.isActive}
              onClick={() => handleGenerateProposal(selectedDeal)}
            >
              Generate proposal
            </button>
          </div>
        )}
      </div>
      <style>{`@keyframes agentStatusPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>

      <PipelineStats stats={stats} />

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {view === 'kanban' && (
          <div style={{ flex: 1, display: 'flex', minWidth: 0 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <KanbanBoard
                stages={PIPELINE_STAGES}
                deals={deals}
                onDealClick={setSelectedDeal}
                onDealStageChange={handleDealStageChange}
              />
            </div>
            {selectedDeal && (
              <DealDetailPanel
                deal={selectedDeal}
                onClose={() => setSelectedDeal(null)}
                toast={toast}
              />
            )}
          </div>
        )}

        {view === 'list' && (
          <div style={{ flex: 1, display: 'flex', minWidth: 0 }}>
            <div style={{ flex: 1, overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: F.body, fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                    {['Company', 'Contact', 'Value', 'Stage', 'Probability', 'Days in Stage', 'Health', 'Owner', 'Next Action'].map((h) => (
                      <th key={h} style={{ textAlign: 'left', padding: S[3], color: C.textMuted, fontWeight: 600 }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {deals.map((d) => (
                    <tr
                      key={d.id}
                      onClick={() => setSelectedDeal(d)}
                      style={{
                        cursor: 'pointer',
                        borderBottom: `1px solid ${C.border}`,
                        borderLeft: d.health === 'at_risk' ? `4px solid ${C.amber}` : d.health === 'stalled' ? `4px solid ${C.red}` : undefined,
                        backgroundColor: selectedDeal?.id === d.id ? 'rgba(61,220,132,0.06)' : undefined,
                      }}
                    >
                      <td style={{ padding: S[3], color: C.textPrimary, fontWeight: 600 }}>{d.company}</td>
                      <td style={{ padding: S[3], color: C.textSecondary }}>{d.contact}</td>
                      <td style={{ padding: S[3], fontFamily: F.mono, color: C.primary }}>{formatCurrency(d.value)}</td>
                      <td style={{ padding: S[3], color: C.textSecondary }}>{d.stage}</td>
                      <td style={{ padding: S[3], color: C.textSecondary }}>{d.probability}%</td>
                      <td style={{ padding: S[3], color: C.textSecondary }}>{d.daysInStage}d</td>
                      <td style={{ padding: S[3] }}>
                        <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: d.health === 'healthy' ? C.primary : d.health === 'at_risk' ? C.amber : C.red }} />
                      </td>
                      <td style={{ padding: S[3], color: C.textSecondary }}>{d.owner}</td>
                      <td style={{ padding: S[3], color: C.textSecondary }}>{d.nextAction}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {selectedDeal && (
              <DealDetailPanel deal={selectedDeal} onClose={() => setSelectedDeal(null)} toast={toast} />
            )}
          </div>
        )}

        {view === 'forecast' && (
          <div style={{ flex: 1, display: 'flex', minWidth: 0 }}>
            <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: S[5] }}>
            <h2 style={{ fontFamily: F.display, fontSize: '18px', fontWeight: 700, color: C.textPrimary, margin: 0 }}>
              Revenue Forecast — Q1 2026
            </h2>
            <div style={{ display: 'flex', gap: S[4], flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 160px', padding: S[5], backgroundColor: C.surface2, border: `1px solid ${C.border}`, borderRadius: R.card }}>
                <div style={{ fontFamily: F.mono, fontSize: '24px', fontWeight: 700, color: C.textPrimary }}>$280K</div>
                <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>Conservative</div>
                <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary, marginTop: 4 }}>Closed-won + 50% of qualified</div>
              </div>
              <div style={{ flex: '1 1 160px', padding: S[5], backgroundColor: C.surface2, border: `1px solid ${C.primary}`, borderRadius: R.card }}>
                <div style={{ fontFamily: F.mono, fontSize: '24px', fontWeight: 700, color: C.primary }}>$380K</div>
                <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>Base</div>
                <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary, marginTop: 4 }}>Weighted pipeline</div>
              </div>
              <div style={{ flex: '1 1 160px', padding: S[5], backgroundColor: C.surface2, border: `1px solid ${C.border}`, borderRadius: R.card }}>
                <div style={{ fontFamily: F.mono, fontSize: '24px', fontWeight: 700, color: C.secondary }}>$520K</div>
                <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>Optimistic</div>
                <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary, marginTop: 4 }}>All open deals</div>
              </div>
            </div>
            <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card, padding: S[5] }}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={FORECAST_CHART_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <XAxis dataKey="month" tick={{ fontFamily: F.body, fontSize: 11, fill: C.textSecondary }} axisLine={{ stroke: C.border }} />
                  <YAxis tick={{ fontFamily: F.mono, fontSize: 10, fill: C.textMuted }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: C.surface2, border: `1px solid ${C.border}`, borderRadius: R.card }}
                    labelStyle={{ color: C.textPrimary }}
                  />
                  <Legend />
                  <Bar dataKey="closedWon" name="Closed Won" fill={COLOR.mint} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="likely" name="Likely" fill={COLOR.teal} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="atRisk" name="At Risk" fill={COLOR.amber} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h3 style={{ fontFamily: F.body, fontSize: '14px', fontWeight: 700, color: C.textPrimary, marginBottom: S[3] }}>
                Deal Risk Table
              </h3>
              <div style={{ border: `1px solid ${C.border}`, borderRadius: R.card, overflow: 'hidden' }}>
                {atRiskDeals.map((d) => (
                  <div
                    key={d.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: S[4],
                      padding: S[4],
                      borderBottom: `1px solid ${C.border}`,
                      backgroundColor: C.surface2,
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: F.body, fontWeight: 600, color: C.textPrimary }}>{d.company}</div>
                      <div style={{ fontFamily: F.mono, fontSize: '12px', color: C.primary }}>{formatCurrency(d.value)}</div>
                    </div>
                    <div style={{ flex: 1, fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
                      {d.aiRiskFlags?.[0] || d.riskFactors?.[0] || '—'}
                    </div>
                    <div style={{ flex: 1, fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
                      {d.recommendedActions?.[0] || '—'}
                    </div>
                    <button
                      style={{ ...btn.primary, fontSize: '12px' }}
                      onClick={() => setSelectedDeal(d)}
                    >
                      Take Action
                    </button>
                  </div>
                ))}
              </div>
            </div>
            </div>
            {selectedDeal && (
              <DealDetailPanel deal={selectedDeal} onClose={() => setSelectedDeal(null)} toast={toast} />
            )}
          </div>
        )}
      </div>

      {/* Agent Thinking Indicator */}
      {forecastDealId && revenueAgent.isActive && (
        <AgentThinking agentId="revenue" task={`Forecasting deal: ${deals.find(d => d.id === forecastDealId)?.company || 'deal'}`} />
      )}
      {proposalDealId && revenueAgent.isActive && (
        <AgentThinking agentId="revenue" task={`Generating proposal for: ${deals.find(d => d.id === proposalDealId)?.company || 'deal'}`} />
      )}

      {/* Agent Results */}
      {forecastResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
          <h3 style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary, margin: 0 }}>
            Deal Forecast Result
          </h3>
          <AgentResultPanel result={forecastResult} />
        </div>
      )}
      {proposalResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
          <h3 style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary, margin: 0 }}>
            Generated Proposal
          </h3>
          <AgentResultPanel result={proposalResult} />
        </div>
      )}
    </div>
  );
}
