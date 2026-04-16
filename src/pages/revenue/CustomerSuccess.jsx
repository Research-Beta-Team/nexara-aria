import { useState, useMemo, useCallback } from 'react';
import useToast from '../../hooks/useToast';
import { useAgent } from '../../hooks/useAgent';
import AgentThinking from '../../components/agents/AgentThinking';
import AgentResultPanel from '../../components/agents/AgentResultPanel';
import { C, F, R, S, btn, sectionHeading } from '../../tokens';
import { IconClose } from '../../components/ui/Icons';
import { CUSTOMERS, CHURN_RISK_ALERTS, getCustomerStats } from '../../data/customers';
import CustomerHealthGrid from '../../components/cs/CustomerHealthGrid';
import ChurnRiskCard from '../../components/cs/ChurnRiskCard';
import ExpansionOpportunityCard from '../../components/cs/ExpansionOpportunityCard';
import OnboardingTracker from '../../components/cs/OnboardingTracker';

const TABS = [
  { id: 'all', label: 'All Customers' },
  { id: 'at_risk', label: 'At Risk' },
  { id: 'expanding', label: 'Expanding' },
  { id: 'onboarding', label: 'Onboarding' },
];

function formatMrr(mrr) {
  if (mrr >= 1000) return `$${(mrr / 1000).toFixed(1)}K`;
  return `$${mrr}`;
}

// Minimal customer detail panel (slide-in)
function CustomerDetailPanel({ customer, onClose }) {
  if (!customer) return null;
  const { name, mrr, plan, healthScore, champion, renewalDate, nextAction } = customer;
  return (
    <div
      style={{
        width: 380,
        flexShrink: 0,
        backgroundColor: C.surface,
        borderLeft: `1px solid ${C.border}`,
        padding: S[6],
        overflowY: 'auto',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[4] }}>
        <h2 style={{ fontFamily: F.display, fontSize: '18px', fontWeight: 700, color: C.textPrimary, margin: 0 }}>
          {name}
        </h2>
        <button style={{ ...btn.icon }} onClick={onClose} aria-label="Close"><IconClose color={C.textSecondary} width={18} height={18} /></button>
      </div>
      <div style={{ fontFamily: F.mono, fontSize: '20px', fontWeight: 700, color: C.primary, marginBottom: S[4] }}>
        {formatMrr(mrr)} MRR
      </div>
      <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, marginBottom: S[2] }}>Plan: {plan}</div>
      <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, marginBottom: S[2] }}>Health: {healthScore}</div>
      <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, marginBottom: S[4] }}>Renewal: {renewalDate}</div>
      {champion && (
        <div style={{ marginBottom: S[4] }}>
          <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, marginBottom: S[1] }}>CHAMPION</div>
          <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary }}>{champion.name} · {champion.title}</div>
        </div>
      )}
      <div style={{ fontFamily: F.body, fontSize: '13px', color: C.primary }}>Next: {nextAction}</div>
    </div>
  );
}

export default function CustomerSuccess() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [churnResult, setChurnResult] = useState(null);
  const [expansionResult, setExpansionResult] = useState(null);
  const [churnRunning, setChurnRunning] = useState(false);
  const [expansionRunning, setExpansionRunning] = useState(false);
  const toast = useToast();
  const revenueAgent = useAgent('revenue');

  const stats = useMemo(() => getCustomerStats(CUSTOMERS), []);
  const atRiskCustomers = useMemo(() => CUSTOMERS.filter((c) => c.status === 'at_risk' || c.status === 'churning'), []);
  const expandingCustomers = useMemo(() => CUSTOMERS.filter((c) => c.status === 'expanding'), []);
  const onboardingCustomers = useMemo(() => CUSTOMERS.filter((c) => c.onboarding && !c.onboarding.complete), []);

  const handleAnalyzeChurnRisk = useCallback(async () => {
    setChurnRunning(true);
    setChurnResult(null);
    try {
      const result = await revenueAgent.activate(
        { description: 'Analyze churn risk across customer portfolio', skill: 'churn-prevention', input: { churn_signals: atRiskCustomers.map(c => ({ id: c.id, name: c.name, health: c.healthScore })), customer_data: CUSTOMERS, product_usage: [] } },
        { focus: 'intervention-plan' }
      );
      if (result) {
        setChurnResult({ ...result, confidence: Math.round((result.confidence || 0.82) * 100) });
        toast.success('Churn risk analysis complete');
      }
    } catch (err) {
      toast.error('Churn analysis failed: ' + err.message);
    } finally {
      setChurnRunning(false);
    }
  }, [revenueAgent, toast, atRiskCustomers]);

  const handleIdentifyExpansion = useCallback(async () => {
    setExpansionRunning(true);
    setExpansionResult(null);
    try {
      const result = await revenueAgent.activate(
        { description: 'Identify expansion and upsell opportunities', skill: 'revops', input: { pipeline_data: expandingCustomers.map(c => ({ id: c.id, name: c.name, mrr: c.mrr, plan: c.plan })), period: 'Q2 2026', segments: ['expanding'] } },
        { focus: 'upsell-opportunities' }
      );
      if (result) {
        setExpansionResult({ ...result, confidence: Math.round((result.confidence || 0.79) * 100) });
        toast.success('Expansion opportunities identified');
      }
    } catch (err) {
      toast.error('Expansion analysis failed: ' + err.message);
    } finally {
      setExpansionRunning(false);
    }
  }, [revenueAgent, toast, expandingCustomers]);

  return (
    <div
      style={{
        padding: S[6],
        display: 'flex',
        flexDirection: 'column',
        gap: S[5],
        height: '100%',
        minHeight: 0,
        backgroundColor: C.bg,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: S[3] }}>
        <div>
          <h1 style={{ ...sectionHeading, fontSize: '22px', letterSpacing: '-0.02em', margin: 0 }}>
            Customer Success
          </h1>
          <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
            {formatMrr(stats.mrr)} MRR · {CUSTOMERS.length} customers · Churn risk: {stats.churnRiskCount}
          </span>
        </div>
        <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap' }}>
          <button
            style={{ ...btn.primary, fontSize: '13px', opacity: churnRunning ? 0.5 : 1 }}
            disabled={churnRunning}
            onClick={handleAnalyzeChurnRisk}
          >
            {churnRunning ? 'Analyzing...' : 'Analyze churn risk'}
          </button>
          <button
            style={{ ...btn.secondary, fontSize: '13px', opacity: expansionRunning ? 0.5 : 1 }}
            disabled={expansionRunning}
            onClick={handleIdentifyExpansion}
          >
            {expansionRunning ? 'Identifying...' : 'Identify expansion'}
          </button>
          <button style={{ ...btn.secondary, fontSize: '13px' }} onClick={() => toast.info('Running health check...')}>
            Run health check
          </button>
          <button style={{ ...btn.secondary, fontSize: '13px' }} onClick={() => toast.success('Report exported')}>
            Export report
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: S[4], flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 140px', padding: S[4], backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card }}>
          <div style={{ fontFamily: F.mono, fontSize: '20px', fontWeight: 700, color: C.textPrimary }}>{stats.avgHealth}</div>
          <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, textTransform: 'uppercase' }}>Avg health score</div>
        </div>
        <div style={{ flex: '1 1 140px', padding: S[4], backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card }}>
          <div style={{ fontFamily: F.mono, fontSize: '20px', fontWeight: 700, color: C.amber }}>{stats.atRiskCount}</div>
          <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, textTransform: 'uppercase' }}>At risk</div>
        </div>
        <div style={{ flex: '1 1 140px', padding: S[4], backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card }}>
          <div style={{ fontFamily: F.mono, fontSize: '20px', fontWeight: 700, color: C.secondary }}>{stats.expandingCount}</div>
          <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, textTransform: 'uppercase' }}>Expanding</div>
        </div>
        <div style={{ flex: '1 1 140px', padding: S[4], backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card }}>
          <div style={{ fontFamily: F.mono, fontSize: '20px', fontWeight: 700, color: C.textPrimary }}>{stats.avgNps}</div>
          <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, textTransform: 'uppercase' }}>Avg NPS</div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: S[3],
          padding: `${S[3]} ${S[4]}`,
          backgroundColor: 'rgba(255,110,122,0.08)',
          border: '1px solid rgba(255,110,122,0.2)',
          borderLeft: `3px solid ${C.red}`,
          borderRadius: R.card,
        }}
      >
        <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary }}>
          {stats.churnRiskCount} customers need immediate attention. Delta Textiles showing churn signals. Apex Corp champion contact changed. Act now to protect {formatMrr(atRiskCustomers.reduce((s, c) => s + (c.mrr || 0), 0))} MRR.
        </span>
        <button
          style={{ ...btn.primary, fontSize: '12px', flexShrink: 0 }}
          onClick={() => setActiveTab('at_risk')}
        >
          View at-risk
        </button>
      </div>

      <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${C.border}` }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            style={{
              fontFamily: F.body,
              fontSize: '13px',
              fontWeight: activeTab === tab.id ? 600 : 400,
              color: activeTab === tab.id ? C.primary : C.textSecondary,
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.id ? `2px solid ${C.primary}` : '2px solid transparent',
              padding: `${S[3]} ${S[4]}`,
              cursor: 'pointer',
            }}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Revenue Agent Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: S[3], padding: `${S[2]} ${S[3]}`, backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card }}>
        <div style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: revenueAgent.isActive ? C.amber : C.green,
          animation: revenueAgent.isActive ? 'csAgentPulse 2s ease-in-out infinite' : 'none',
        }} />
        <span style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 600, color: revenueAgent.isActive ? C.amber : C.textSecondary }}>
          Revenue Agent: {revenueAgent.isActive ? 'Working...' : 'Ready'}
        </span>
      </div>
      <style>{`@keyframes csAgentPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <div style={{ flex: 1, minWidth: 0, overflow: 'auto' }}>
          {activeTab === 'all' && (
            <CustomerHealthGrid customers={CUSTOMERS} onViewDetail={setSelectedCustomer} />
          )}
          {activeTab === 'at_risk' && (
            <div>
              {atRiskCustomers.map((c) => (
                <ChurnRiskCard key={c.id} customer={c} toast={toast} />
              ))}
            </div>
          )}
          {activeTab === 'expanding' && (
            <div>
              {expandingCustomers.map((c) => (
                <ExpansionOpportunityCard key={c.id} customer={c} toast={toast} />
              ))}
            </div>
          )}
          {activeTab === 'onboarding' && (
            <OnboardingTracker customers={CUSTOMERS} toast={toast} />
          )}
        </div>
        {selectedCustomer && (
          <CustomerDetailPanel customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
        )}
      </div>

      {/* Agent Thinking Indicators */}
      {churnRunning && revenueAgent.isActive && (
        <AgentThinking agentId="revenue" task="Analyzing churn risk and building intervention plan..." />
      )}
      {expansionRunning && revenueAgent.isActive && (
        <AgentThinking agentId="revenue" task="Identifying upsell and expansion opportunities..." />
      )}

      {/* Churn Risk Analysis Result */}
      {churnResult && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
            <h3 style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary, margin: 0 }}>
              Churn Risk Intervention Plan
            </h3>
            <span style={{
              fontFamily: F.mono,
              fontSize: '10px',
              fontWeight: 700,
              color: C.red,
              backgroundColor: 'rgba(239,68,68,0.12)',
              padding: '2px 8px',
              borderRadius: '999px',
            }}>
              Save offers + dunning strategies
            </span>
          </div>
          <AgentResultPanel result={churnResult} />
        </section>
      )}

      {/* Expansion Opportunities Result */}
      {expansionResult && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
            <h3 style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary, margin: 0 }}>
              Expansion Opportunities
            </h3>
            <span style={{
              fontFamily: F.mono,
              fontSize: '10px',
              fontWeight: 700,
              color: C.secondary,
              backgroundColor: 'rgba(94,234,212,0.12)',
              padding: '2px 8px',
              borderRadius: '999px',
            }}>
              Upsell flagged
            </span>
          </div>
          <AgentResultPanel result={expansionResult} />
        </section>
      )}
    </div>
  );
}
