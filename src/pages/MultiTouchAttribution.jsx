/**
 * Multi-Touch Attribution — Session 4.
 * Top bar (title, date range, ModelSelector, Export, Ask ARIA); summary metric strip; ChannelRevenueChart; AttributionTable; TouchpointTimeline; ARIAAttributionInsight.
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

const DATE_RANGES = ['7d', '30d', '90d', 'YTD'];

export default function MultiTouchAttribution() {
  const toast = useToast();
  const model = useStore((s) => s.attributionModel) || 'w_shaped';
  const setAttributionModel = useStore((s) => s.setAttributionModel);
  const [dateRange, setDateRange] = useState('30d');

  const summary = getSummaryMetrics(model);
  const channelData = getChannelRevenueData(model);
  const tableData = getAttributionTable(model);
  const pipelineInfluence = getPipelineInfluence(model);

  const handleExport = () => toast.info('Export (mock).');
  const handleAskFreya = () => toast.info('Ask Freya (mock).');

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
          <button type="button" onClick={handleExport} style={btn.secondary}>
            Export
          </button>
          <button type="button" onClick={handleAskFreya} style={btn.primary}>
            Ask Freya
          </button>
        </div>
      </div>

      {/* Model selector */}
      <div style={{ marginBottom: S[6] }}>
        <ModelSelector value={model} onChange={setAttributionModel} />
      </div>

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

      {/* ARIA insights */}
      <ARIAAttributionInsight insights={ARIA_INSIGHTS} onAction={(insight) => toast.info(insight.actionLabel)} />
    </div>
  );
}
