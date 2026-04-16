/**
 * Multi-Touch Attribution — Session 4.
 * Top bar (title, date range, ModelSelector, Export, Ask Freya); summary metric strip; ChannelRevenueChart; AttributionTable; TouchpointTimeline; Freya attribution insights.
 */
import { useState } from 'react';
import useStore from '../store/useStore';
import useToast from '../hooks/useToast';
import {
  getSummaryMetrics,
  getChannelRevenueData,
  getAttributionTable,
  getPipelineInfluence,
  DEALS_WITH_JOURNEY,
  ARIA_INSIGHTS,
} from '../data/attributionMock';
import ModelSelector from '../components/attribution/ModelSelector';
import ChannelRevenueChart from '../components/attribution/ChannelRevenueChart';
import AttributionTable from '../components/attribution/AttributionTable';
import TouchpointTimeline from '../components/attribution/TouchpointTimeline';
import PipelineInfluenceCard from '../components/attribution/PipelineInfluenceCard';
import ARIAAttributionInsight from '../components/attribution/ARIAAttributionInsight';
import { C, F, R, S, statNumber, statLabel, btn } from '../tokens';
import { useAgent } from '../hooks/useAgent';
import AgentThinking from '../components/agents/AgentThinking';
import AgentResultPanel from '../components/agents/AgentResultPanel';

/* ─── Model explanation data ─────────────────────────────── */
const MODEL_EXPLANATIONS = {
  first_touch: {
    agentId: 'analyst',
    title: 'First Touch Attribution Analysis',
    type: 'model-explanation',
    content: 'First Touch assigns 100% credit to the initial interaction. This model is best when you want to understand which channels drive awareness and top-of-funnel discovery. For Medglobal, this highlights that LinkedIn generates the most first-touch pipeline, but may overvalue channels that attract low-intent visitors.',
    recommendations: [
      { text: 'Best for measuring brand awareness campaigns', priority: 'medium' },
      { text: 'Undervalues nurture channels like email that close deals', priority: 'high' },
    ],
  },
  last_touch: {
    agentId: 'analyst',
    title: 'Last Touch Attribution Analysis',
    type: 'model-explanation',
    content: 'Last Touch assigns 100% credit to the final interaction before conversion. This model highlights closing channels but ignores the full buyer journey. For Medglobal, email dominates last-touch because donors and partners often convert after a direct email CTA.',
    recommendations: [
      { text: 'Best for optimizing conversion-focused campaigns', priority: 'medium' },
      { text: 'Ignores top-of-funnel channels that initiate journeys', priority: 'high' },
    ],
  },
  linear: {
    agentId: 'analyst',
    title: 'Linear Attribution Analysis',
    type: 'model-explanation',
    content: 'Linear distributes credit equally across all touchpoints. This is the fairest model but may dilute the impact of high-value interactions. For Medglobal\'s multi-channel campaigns, linear attribution reveals the collaborative nature of your channel mix.',
    recommendations: [
      { text: 'Good baseline model for balanced channel investment', priority: 'medium' },
      { text: 'May justify maintaining underperforming channels unnecessarily', priority: 'medium' },
    ],
  },
  w_shaped: {
    agentId: 'analyst',
    title: 'W-Shaped Attribution Analysis',
    type: 'model-explanation',
    content: 'W-Shaped assigns 30% each to first touch, lead creation, and opportunity creation, with the remaining 10% distributed across other touchpoints. This is the recommended model for Medglobal because it values both awareness and conversion while acknowledging the full journey.',
    recommendations: [
      { text: 'Best fit for Medglobal\'s complex multi-touch campaigns', priority: 'high' },
      { text: 'Captures the value of mid-funnel engagement events', priority: 'medium' },
    ],
  },
  time_decay: {
    agentId: 'analyst',
    title: 'Time Decay Attribution Analysis',
    type: 'model-explanation',
    content: 'Time Decay gives more credit to touchpoints closer to conversion. This model is ideal for short sales cycles but may undervalue awareness for Medglobal\'s longer donor cultivation journeys. Use this model for event-driven campaigns where recency matters.',
    recommendations: [
      { text: 'Best for campaigns with short decision windows', priority: 'medium' },
      { text: 'Not ideal for Medglobal\'s longer donor cultivation cycles', priority: 'high' },
    ],
  },
};

const DATE_RANGES = ['7d', '30d', '90d', 'YTD'];

export default function MultiTouchAttribution() {
  const toast = useToast();
  const model = useStore((s) => s.attributionModel) || 'w_shaped';
  const setAttributionModel = useStore((s) => s.setAttributionModel);
  const [dateRange, setDateRange] = useState('30d');
  const analyst = useAgent('analyst');

  /* Agent state */
  const [analysisActive, setAnalysisActive] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [modelExplanation, setModelExplanation] = useState(null);

  const summary = getSummaryMetrics(model);
  const channelData = getChannelRevenueData(model);
  const tableData = getAttributionTable(model);
  const pipelineInfluence = getPipelineInfluence(model);

  const handleExport = () => toast.info('Export (mock).');
  const handleAskFreya = () => toast.info('Ask Freya (mock).');

  const handleAnalyzeAttribution = async () => {
    setAnalysisActive(true);
    setAnalysisResult(null);
    toast.info('Analyst agent comparing attribution models...');
    try {
      const res = await analyst.activate('analyze-attribution', { model, dateRange });
      setAnalysisResult(res || {
        agentId: 'analyst',
        title: 'Attribution Model Comparison',
        type: 'attribution-analysis',
        strategy: [
          { title: 'W-Shaped is the Best Fit', body: 'For Medglobal\'s multi-touch donor and partner journeys, W-shaped attribution captures the full value chain. First-touch awareness (LinkedIn), mid-funnel engagement (Events), and final conversion (Email) all receive appropriate credit.' },
          { title: 'Model Comparison Summary', body: 'First-touch overvalues LinkedIn by 34%. Last-touch overvalues email by 28%. Linear dilutes event impact by 42%. W-shaped aligns within 8% of actual closed-won revenue distribution.' },
          { title: 'Budget Reallocation Opportunity', body: 'Based on W-shaped attribution, shifting $3,200/mo from LinkedIn brand awareness to Email nurture sequences would improve overall ROAS by an estimated 18%.' },
        ],
        metrics: [
          { label: 'Model Accuracy', value: '92%' },
          { label: 'Channel Variance', value: '8%' },
          { label: 'Suggested Reallocation', value: '$3.2K' },
          { label: 'Projected ROAS Lift', value: '+18%' },
        ],
        recommendations: [
          { text: 'Adopt W-shaped as the primary attribution model', priority: 'high' },
          { text: 'Reallocate $3,200/mo from LinkedIn brand to Email nurture', priority: 'high' },
          { text: 'Set up monthly model validation against closed-won data', priority: 'medium' },
        ],
      });
    } catch {
      setAnalysisResult({
        agentId: 'analyst',
        title: 'Attribution Model Comparison',
        type: 'attribution-analysis',
        strategy: [
          { title: 'W-Shaped is the Best Fit', body: 'W-shaped attribution best captures Medglobal\'s multi-touch journeys.' },
        ],
        recommendations: [
          { text: 'Adopt W-shaped as the primary attribution model', priority: 'high' },
        ],
      });
    } finally {
      setAnalysisActive(false);
    }
  };

  const handleExplainModel = (modelKey) => {
    const explanation = MODEL_EXPLANATIONS[modelKey];
    if (explanation) {
      setModelExplanation(explanation);
      toast.info(`Freya explaining ${modelKey.replace('_', ' ')} model...`);
    }
  };

  return (
    <div style={{ minHeight: '100%', backgroundColor: C.bg, padding: S[6] }}>
      {/* Top bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: S[4], marginBottom: S[6] }}>
        <div>
          <h1 style={{ fontFamily: F.display, fontSize: '22px', fontWeight: 700, color: C.textPrimary, margin: `0 0 ${S[2]} 0` }}>
            Multi-Touch Attribution
          </h1>
          <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: 0 }}>
            Connect every marketing touchpoint to pipeline and revenue.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[4], flexWrap: 'wrap' }}>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{
              padding: `${S[2]} ${S[3]}`,
              fontFamily: F.body,
              fontSize: '13px',
              color: C.textPrimary,
              backgroundColor: C.surface2,
              border: `1px solid ${C.border}`,
              borderRadius: R.input,
              outline: 'none',
            }}
          >
            {DATE_RANGES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <button type="button" onClick={handleAnalyzeAttribution} disabled={analysisActive} style={{ ...btn.secondary, opacity: analysisActive ? 0.6 : 1 }}>
            Analyze attribution
          </button>
          <button type="button" onClick={handleExport} style={btn.secondary}>
            Export
          </button>
          <button type="button" onClick={handleAskFreya} style={btn.primary}>
            Ask Freya
          </button>
        </div>
      </div>

      {/* Agent thinking */}
      {analysisActive && <div style={{ marginBottom: S[4] }}><AgentThinking agentId="analyst" task="Comparing attribution models and generating insights..." /></div>}

      {/* Agent analysis result */}
      {analysisResult && (
        <div style={{ marginBottom: S[6] }}>
          <AgentResultPanel result={analysisResult} />
        </div>
      )}

      {/* Model selector + explain buttons */}
      <div style={{ marginBottom: S[6] }}>
        <ModelSelector value={model} onChange={setAttributionModel} />
        <div style={{ display: 'flex', gap: S[2], marginTop: S[3], flexWrap: 'wrap' }}>
          {['first_touch', 'last_touch', 'linear', 'w_shaped', 'time_decay'].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => handleExplainModel(m)}
              style={{
                fontFamily: F.mono, fontSize: '11px', fontWeight: 600,
                color: model === m ? C.primary : C.textMuted,
                backgroundColor: model === m ? C.primaryGlow : C.surface2,
                border: `1px solid ${model === m ? C.primary : C.border}`,
                borderRadius: R.button, padding: `${S[1]} ${S[3]}`,
                cursor: 'pointer',
              }}
            >
              Freya, explain {m.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Model explanation card */}
      {modelExplanation && (
        <div style={{
          marginBottom: S[6], padding: S[5],
          backgroundColor: C.surface, border: `1px solid ${C.primary}30`,
          borderRadius: R.card, borderLeft: `3px solid ${C.primary}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginBottom: S[3] }}>
            <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.primary, textTransform: 'uppercase' }}>Analyst Agent</span>
            <span style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>{modelExplanation.title}</span>
          </div>
          <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, lineHeight: 1.6, margin: `0 0 ${S[3]} 0` }}>
            {modelExplanation.content}
          </p>
          {modelExplanation.recommendations && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
              {modelExplanation.recommendations.map((rec, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                  <span style={{
                    fontFamily: F.mono, fontSize: '9px', fontWeight: 700, textTransform: 'uppercase',
                    color: rec.priority === 'high' ? C.red : C.amber,
                    backgroundColor: rec.priority === 'high' ? C.redDim : C.amberDim,
                    padding: `1px ${S[2]}`, borderRadius: R.sm,
                  }}>{rec.priority}</span>
                  <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>{rec.text}</span>
                </div>
              ))}
            </div>
          )}
          <button type="button" onClick={() => setModelExplanation(null)} style={{ ...btn.secondary, fontSize: '11px', padding: `${S[1]} ${S[3]}`, marginTop: S[3] }}>
            Dismiss
          </button>
        </div>
      )}

      {/* Summary metric strip — 4 cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: S[4],
          marginBottom: S[6],
        }}
      >
        <div style={{ padding: S[4], backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card }}>
          <div style={{ ...statLabel, marginBottom: S[1] }}>Total Pipeline</div>
          <div style={statNumber}>{summary.pipelineFormatted}</div>
        </div>
        <div style={{ padding: S[4], backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card }}>
          <div style={{ ...statLabel, marginBottom: S[1] }}>Total Revenue</div>
          <div style={{ ...statNumber, color: C.primary }}>{summary.revenueFormatted}</div>
        </div>
        <div style={{ padding: S[4], backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card }}>
          <div style={{ ...statLabel, marginBottom: S[1] }}>Top Channel</div>
          <div style={statNumber}>{summary.topChannel}</div>
        </div>
        <div style={{ padding: S[4], backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card }}>
          <div style={{ ...statLabel, marginBottom: S[1] }}>Avg CAC</div>
          <div style={statNumber}>${summary.avgCAC}</div>
        </div>
      </div>

      {/* Chart + Pipeline influence */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: S[6], marginBottom: S[6] }}>
        <ChannelRevenueChart data={channelData} />
        <PipelineInfluenceCard data={pipelineInfluence} />
      </div>

      {/* Attribution table */}
      <div style={{ marginBottom: S[6] }}>
        <AttributionTable data={tableData} />
      </div>

      {/* Touchpoint timeline */}
      <div style={{ marginBottom: S[6] }}>
        <TouchpointTimeline deals={DEALS_WITH_JOURNEY} />
      </div>

      {/* Freya attribution insights */}
      <ARIAAttributionInsight insights={ARIA_INSIGHTS} onAction={(insight) => toast.info(insight.actionLabel)} />
    </div>
  );
}
