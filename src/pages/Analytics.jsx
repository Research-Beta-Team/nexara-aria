import { useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { C, F, R, S, T, btn, scrollbarStyle, shadows } from '../tokens';
import { useAgent } from '../hooks/useAgent';
import useCommandModeDesign from '../hooks/useCommandModeDesign';
import AgentThinking from '../components/agents/AgentThinking';
import AgentResultPanel from '../components/agents/AgentResultPanel';
import useToast from '../hooks/useToast';
import AgentRoleIcon from '../components/ui/AgentRoleIcon';
import { IconChart, IconZap } from '../components/ui/Icons';
import { ModePageWrapper, ModeCard, ModeButton, ModeBadge } from '../components/mode';

/* ─── KPI data ─────────────────────────────────────────────── */
const KPI_CARDS = [
  {
    label: 'Total Leads',
    value: '342',
    delta: '+28',
    period: 'WoW',
    up: true,
    posGood: true,
    note: 'vs 314 last week',
    sparkline: [180, 210, 195, 240, 260, 290, 315, 342],
  },
  {
    label: 'Pipeline Value',
    value: '$2.4M',
    delta: '+$180k',
    period: 'WoW',
    up: true,
    posGood: true,
    note: '112% of Q2 target',
    sparkline: [1.8, 1.9, 2.0, 2.1, 2.2, 2.25, 2.32, 2.4],
  },
  {
    label: 'Blended CAC',
    value: '$144',
    delta: '-$6',
    period: 'WoW',
    up: false,
    posGood: false,
    note: 'lower is better',
    sparkline: [162, 158, 155, 152, 150, 148, 146, 144],
  },
  {
    label: 'ROAS',
    value: '3.2×',
    delta: '+0.4',
    period: 'WoW',
    up: true,
    posGood: true,
    note: 'target 3.0×',
    sparkline: [2.1, 2.3, 2.5, 2.6, 2.8, 2.9, 3.0, 3.2],
  },
];

/* ─── Agent intelligence feed ──────────────────────────────── */
const INTEL_FEED = [
  {
    id: 'i1',
    severity: 'Critical',
    severityColor: C.red,
    severityBg: 'rgba(239,68,68,0.1)',
    severityBorder: 'rgba(239,68,68,0.25)',
    agentId: 'analyst',
    agentName: 'Analyst',
    finding: 'CTR down 23% on Yemen campaign post Feb 22',
    recommendation: 'Rotate ad creatives — audience fatigue confirmed at 4.2× frequency',
    action: 'Rotate Creatives',
    timestamp: '9:14 AM',
    actionFn: (toast) => toast.warning('Copywriter agent briefed to generate 3 new creative variants'),
  },
  {
    id: 'i2',
    severity: 'Warning',
    severityColor: C.amber,
    severityBg: 'rgba(251,191,36,0.08)',
    severityBorder: 'rgba(251,191,36,0.25)',
    agentId: 'analyst',
    agentName: 'Analyst',
    finding: 'ANZ audience overlap at 94% — lookalike seed too narrow',
    recommendation: 'Expand lookalike to 3% seed — projected -$18 CPL',
    action: 'Apply Fix',
    timestamp: '8:48 AM',
    actionFn: (toast) => toast.info('Optimizer agent queued lookalike expansion — requires Meta Ads approval'),
  },
  {
    id: 'i3',
    severity: 'Opportunity',
    severityColor: C.green,
    severityBg: 'rgba(16,185,129,0.08)',
    severityBorder: 'rgba(16,185,129,0.25)',
    agentId: 'analyst',
    agentName: 'Analyst',
    finding: 'LinkedIn CPL $62 vs Meta $89 — 28% cheaper per lead',
    recommendation: 'Shift 15% budget to LinkedIn for healthcare donor persona',
    action: 'Reallocate Budget',
    timestamp: '8:32 AM',
    actionFn: (toast) => toast.info('Strategist agent preparing budget reallocation plan'),
  },
  {
    id: 'i4',
    severity: 'Info',
    severityColor: '#60A5FA',
    severityBg: 'rgba(96,165,250,0.08)',
    severityBorder: 'rgba(96,165,250,0.25)',
    agentId: 'analyst',
    agentName: 'Analyst',
    finding: 'MENA email open rate 47% vs industry avg 24%',
    recommendation: 'Scale email sends by 20% — high-ROI window open',
    action: 'Scale Up',
    timestamp: '7:59 AM',
    actionFn: (toast) => toast.success('Outreach agent scaling MENA email sends by 20%'),
  },
  {
    id: 'i5',
    severity: 'Warning',
    severityColor: C.amber,
    severityBg: 'rgba(251,191,36,0.08)',
    severityBorder: 'rgba(251,191,36,0.25)',
    agentId: 'optimizer',
    agentName: 'Optimizer',
    finding: 'Form abandonment up 18% on donation page',
    recommendation: 'Run CRO analysis — 7-field form causing friction at field 4',
    action: 'Run Optimizer',
    timestamp: 'Yesterday',
    actionFn: (toast) => toast.info('Optimizer agent running CRO analysis on donation page'),
  },
  {
    id: 'i6',
    severity: 'Opportunity',
    severityColor: C.green,
    severityBg: 'rgba(16,185,129,0.08)',
    severityBorder: 'rgba(16,185,129,0.25)',
    agentId: 'revenue',
    agentName: 'Revenue',
    finding: '3 donors showing re-engagement signals after 90-day gap',
    recommendation: 'Trigger re-engagement sequence with impact stories',
    action: 'Activate Outreach',
    timestamp: 'Yesterday',
    actionFn: (toast) => toast.success('Outreach agent triggered re-engagement sequence for 3 donors'),
  },
];

/* ─── Action queue ──────────────────────────────────────────── */
const ACTION_QUEUE = [
  { id: 'a1', title: 'Rotate Yemen ad creatives', urgency: 'Critical', urgencyColor: C.red, urgencyBg: 'rgba(239,68,68,0.1)', actionFn: (toast) => toast.warning('Opening creative rotation task — Copywriter notified') },
  { id: 'a2', title: 'Approve ANZ lookalike expansion', urgency: 'High', urgencyColor: C.amber, urgencyBg: 'rgba(251,191,36,0.1)', actionFn: (toast) => toast.info('Meta Ads lookalike expansion ready for approval') },
  { id: 'a3', title: 'Confirm LinkedIn budget shift', urgency: 'Medium', urgencyColor: '#60A5FA', urgencyBg: 'rgba(96,165,250,0.1)', actionFn: (toast) => toast.info('Budget shift plan ready — awaiting confirmation') },
  { id: 'a4', title: 'Review donation form CRO report', urgency: 'Medium', urgencyColor: C.amber, urgencyBg: 'rgba(251,191,36,0.1)', actionFn: (toast) => toast.info('Optimizer CRO report ready for review') },
];

/* ─── Channel performance data ─────────────────────────────── */
const CHANNEL_ROWS = [
  { channel: 'Meta Ads',    spend: '$14,200', leads: 124, cac: '$114', roas: '3.8×', cacNum: 114, trend: +12, trendUp: true,  agentAction: 'Copywriter refreshing creatives' },
  { channel: 'LinkedIn',    spend: '$11,800', leads: 89,  cac: '$132', roas: '2.9×', cacNum: 132, trend: +8,  trendUp: true,  agentAction: 'Prospector scoring new MQLs' },
  { channel: 'Email',       spend: '$4,800',  leads: 98,  cac: '$49',  roas: '6.1×', cacNum: 49,  trend: +34, trendUp: true,  agentAction: 'Outreach scaling MENA sequences' },
  { channel: 'Outreach',    spend: '$3,200',  leads: 21,  cac: '$152', roas: '2.1×', cacNum: 152, trend: -4,  trendUp: false, agentAction: 'Outreach reviewing reply rates' },
  { channel: 'Organic SEO', spend: '$1,200',  leads: 10,  cac: '$120', roas: '2.6×', cacNum: 120, trend: +6,  trendUp: true,  agentAction: 'Analyst monitoring keyword rankings' },
];

/* ─── Attribution model data ───────────────────────────────── */
const ATTRIBUTION_MODELS = [
  { label: 'W-Shaped',    pct: 31, color: C.primary   },
  { label: 'First Touch', pct: 24, color: '#60A5FA'   },
  { label: 'Time Decay',  pct: 19, color: C.secondary },
  { label: 'Linear',      pct: 18, color: C.amber      },
  { label: 'Last Touch',  pct: 8,  color: C.textMuted  },
];

/* ─── Chart data ────────────────────────────────────────────── */
const SPEND_DATA = [
  { week: 'W1 Mar', Meta: 3200, LinkedIn: 2800, Email: 900, Outreach: 700 },
  { week: 'W2 Mar', Meta: 3400, LinkedIn: 3100, Email: 1000, Outreach: 750 },
  { week: 'W3 Mar', Meta: 3800, LinkedIn: 2900, Email: 1200, Outreach: 800 },
  { week: 'W4 Mar', Meta: 3820, LinkedIn: 2900, Email: 1700, Outreach: 950 },
];

const LEAD_TREND = [
  { day: 'Mar 3', spend: 28000, leads: 38 },
  { day: 'Mar 6', spend: 29100, leads: 44 },
  { day: 'Mar 9', spend: 30200, leads: 41 },
  { day: 'Mar 12', spend: 31400, leads: 52 },
  { day: 'Mar 15', spend: 32100, leads: 48 },
  { day: 'Mar 18', spend: 33000, leads: 61 },
  { day: 'Mar 21', spend: 33800, leads: 58 },
  { day: 'Mar 24', spend: 34200, leads: 67 },
  { day: 'Mar 27', spend: 34800, leads: 71 },
  { day: 'Mar 30', spend: 35000, leads: 68 },
];

const CH_COLORS = { Meta: C.primary, LinkedIn: '#60A5FA', Email: C.secondary, Outreach: C.amber };

const TIP = {
  contentStyle: {
    backgroundColor: C.surface2, border: `1px solid ${C.border}`,
    borderRadius: R.md, fontFamily: F.mono, fontSize: '11px', color: C.textPrimary,
  },
  labelStyle: { color: C.textMuted, marginBottom: '4px' },
  itemStyle:  { color: C.textPrimary },
};

/* ─── Mini sparkline ─────────────────────────────────────────── */
function Sparkline({ data, color }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 56;
    const y = 20 - ((v - min) / range) * 18;
    return `${x},${y}`;
  }).join(' ');
  const lastY = 20 - ((data[data.length - 1] - min) / range) * 18;
  return (
    <svg width="58" height="22" viewBox="0 0 58 22" fill="none" style={{ opacity: 0.85 }}>
      <polyline points={pts} stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={56} cy={lastY} r="2" fill={color} />
    </svg>
  );
}

/* ─── KPI Card ───────────────────────────────────────────────── */
function KpiCard({ label, value, delta, period, up, posGood, note, sparkline }) {
  const good = posGood ? up : !up;
  const trendColor = good ? C.green : C.red;
  return (
    <div style={{
      flex: 1, backgroundColor: C.surface, border: `1px solid ${C.border}`,
      borderRadius: R.card, padding: S[5], display: 'flex', flexDirection: 'column', gap: S[3],
      borderTop: `3px solid ${trendColor}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          {label}
        </span>
        <Sparkline data={sparkline} color={trendColor} />
      </div>
      <div style={{ fontFamily: F.mono, fontSize: '30px', fontWeight: 800, color: C.textPrimary, lineHeight: 1 }}>{value}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
        <span style={{
          fontFamily: F.mono, fontSize: '12px', fontWeight: 700, color: trendColor,
          backgroundColor: good ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
          borderRadius: R.pill, padding: '1px 7px',
        }}>
          {up ? '↑' : '↓'} {delta}
        </span>
        <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>{period}</span>
        {note && <span style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted, fontStyle: 'italic' }}>· {note}</span>}
      </div>
    </div>
  );
}

/* ─── Intel Feed Item ─────────────────────────────────────────── */
function IntelItem({ item, onAction }) {
  return (
    <div style={{
      backgroundColor: item.severityBg,
      border: `1px solid ${item.severityBorder}`,
      borderLeft: `3px solid ${item.severityColor}`,
      borderRadius: R.md,
      padding: S[3],
      display: 'flex', flexDirection: 'column', gap: S[2],
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
        <span style={{
          fontFamily: F.mono, fontSize: '9px', fontWeight: 700, textTransform: 'uppercase',
          color: item.severityColor,
          backgroundColor: item.severityBg,
          border: `1px solid ${item.severityBorder}`,
          borderRadius: R.pill, padding: '1px 6px',
        }}>
          {item.severity}
        </span>
        <AgentRoleIcon agentId={item.agentId} size={14} color={C.textSecondary} />
        <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, fontWeight: 600 }}>{item.agentName}</span>
        <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, marginLeft: 'auto' }}>{item.timestamp}</span>
      </div>
      <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textPrimary, lineHeight: 1.4 }}>
        {item.finding}
      </div>
      <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary, lineHeight: 1.45 }}>
        {item.recommendation}
      </div>
      <button
        onClick={() => onAction(item)}
        style={{
          alignSelf: 'flex-start',
          fontFamily: F.body, fontSize: '11px', fontWeight: 600,
          color: item.severityColor,
          backgroundColor: item.severityBg,
          border: `1px solid ${item.severityBorder}`,
          borderRadius: R.button, padding: `3px ${S[3]}`,
          cursor: 'pointer',
        }}
      >
        {item.action} →
      </button>
    </div>
  );
}

/* ─── Main ────────────────────────────────────────────────────── */
export default function Analytics() {
  const toast = useToast();
  const design = useCommandModeDesign();
  const analyst = useAgent('analyst');
  const [analysisActive, setAnalysisActive] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [activeModel, setActiveModel] = useState('W-Shaped');

  const isManual = design.id === 'manual';
  const isAgentic = design.id === 'fully_agentic';
  const accentColor = isAgentic ? C.green : isManual ? C.red : C.primary;

  const handleRunAnalysis = async () => {
    setAnalysisActive(true);
    setAnalysisResult(null);
    toast.info('Analyst agent running full intelligence sweep...');
    try {
      const res = await analyst.activate('run-analysis', { window: '30d' });
      setAnalysisResult(res || {
        agentId: 'analyst',
        title: 'Intelligence Report — 30-day Window',
        type: 'anomaly-detection',
        issues: [
          { title: 'CTR anomaly on Yemen campaign — rotate creatives', severity: 'critical' },
          { title: 'ANZ audience burnout — expand lookalike seed', severity: 'warning' },
          { title: 'MENA email outperforming — scale sends', severity: 'info' },
        ],
        recommendations: [
          { text: 'Shift 15% Meta budget to LinkedIn for healthcare donor persona', priority: 'high' },
          { text: 'Scale MENA email sends by additional 20%', priority: 'medium' },
        ],
      });
    } catch {
      setAnalysisResult({
        agentId: 'analyst',
        title: 'Analysis Complete',
        type: 'anomaly-detection',
        issues: [
          { title: 'CTR anomaly on Yemen campaign', severity: 'critical' },
          { title: 'ANZ audience burnout at 94%', severity: 'warning' },
        ],
        recommendations: [
          { text: 'Rotate Yemen creatives immediately', priority: 'high' },
        ],
      });
    } finally {
      setAnalysisActive(false);
    }
  };

  return (
    <ModePageWrapper style={{ height: '100vh', overflowY: 'auto', ...scrollbarStyle }}>
        {/* ── Header ─────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: design.spacing.sectionGap }}>
          <div>
            <h1 style={{
              fontFamily: design.typography.headingFont,
              fontSize: isManual ? '16px' : isAgentic ? '32px' : '28px',
              fontWeight: design.typography.headingWeight,
              letterSpacing: design.typography.headingLetterSpacing,
              textTransform: design.typography.headingTransform,
              color: C.textPrimary,
              margin: 0,
            }}>
              {isManual ? 'INTELLIGENCE HUB' : 'Intelligence Hub'}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: S[3], marginTop: S[2] }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: S[2],
                backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
                borderRadius: R.pill, padding: `3px ${S[3]}`,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: C.green, boxShadow: `0 0 6px ${C.green}` }} />
                <span style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: C.green }}>LIVE</span>
              </div>
              <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <IconChart color={C.textMuted} width={14} height={14} />
                Analyst · Last sync 4m ago
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: S[3], alignItems: 'center' }}>
            <button
              onClick={() => toast.info('Attribution analysis running — results in 2 minutes')}
              style={{ ...btn.secondary, fontSize: '13px' }}
            >
              Run Attribution Analysis
            </button>
            <button
              onClick={handleRunAnalysis}
              disabled={analysisActive}
              style={{ ...btn.primary, opacity: analysisActive ? 0.6 : 1, display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <IconChart color={C.textInverse} width={16} height={16} />
              {analysisActive ? 'Analysing...' : 'Run Full Analysis'}
            </button>
          </div>
        </div>

        {/* ── Agent result ──────────────────────────────── */}
        {analysisActive && (
          <div style={{ marginBottom: S[5] }}>
            <AgentThinking agentId="analyst" task="Running 30-day intelligence sweep across all channels and campaigns..." />
          </div>
        )}
        {analysisResult && (
          <div style={{ marginBottom: S[5] }}>
            <AgentResultPanel result={analysisResult} />
          </div>
        )}

        {/* ── KPI Row ───────────────────────────────────── */}
        <div style={{ display: 'flex', gap: S[4], marginBottom: S[6] }}>
          {KPI_CARDS.map((k) => <KpiCard key={k.label} {...k} />)}
        </div>

        {/* ── 3-panel layout ────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '30% 50% 20%', gap: S[4], alignItems: 'start' }}>

          {/* ── LEFT: Agent Intelligence Feed ─────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>
                  Agent Intelligence Feed
                </div>
                <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, marginTop: '2px' }}>
                  6 findings · 2 actions required
                </div>
              </div>
              <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: C.green, boxShadow: `0 0 6px ${C.green}` }} />
            </div>

            <div style={{
              display: 'flex', flexDirection: 'column', gap: S[2],
              maxHeight: '680px', overflowY: 'auto', ...scrollbarStyle,
            }}>
              {INTEL_FEED.map((item) => (
                <IntelItem key={item.id} item={item} onAction={(i) => i.actionFn(toast)} />
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: S[2], marginTop: S[1] }}>
              <button
                onClick={() => toast.info('Analyst agent activated — processing all channel data')}
                style={{ ...btn.primary, width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <IconZap color={C.textInverse} w={14} />
                Trigger Analyst
              </button>
              <button
                onClick={() => toast.info('Attribution analysis queued — W-Shaped model processing')}
                style={{ ...btn.secondary, width: '100%', justifyContent: 'center' }}
              >
                Run Attribution Analysis
              </button>
            </div>
          </div>

          {/* ── CENTER: Live Charts + Data ─────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>

            {/* Spend vs Leads chart */}
            <div style={{
              backgroundColor: C.surface, border: `1px solid ${C.border}`,
              borderRadius: R.card, padding: S[5],
            }}>
              <div style={{ marginBottom: S[4] }}>
                <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>
                  Spend vs Leads — 30 Days
                </div>
                <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, marginTop: '2px' }}>
                  $35,000 total spend · 342 total leads
                </div>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={LEAD_TREND}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: C.textMuted, fontFamily: F.mono, fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="spend" orientation="left" tick={{ fill: C.textMuted, fontFamily: F.mono, fontSize: 9 }} axisLine={false} tickLine={false} width={45} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <YAxis yAxisId="leads" orientation="right" tick={{ fill: C.textMuted, fontFamily: F.mono, fontSize: 9 }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip {...TIP} formatter={(v, n) => [n === 'spend' ? `$${v.toLocaleString()}` : v, n === 'spend' ? 'Spend' : 'Leads']} />
                  <Line yAxisId="spend" dataKey="spend" stroke={C.secondary} strokeWidth={2} dot={false} />
                  <Line yAxisId="leads" dataKey="leads" stroke={C.green} strokeWidth={2.5} dot={{ fill: C.green, r: 2 }} activeDot={{ r: 4 }} />
                  <Legend wrapperStyle={{ fontFamily: F.mono, fontSize: '10px', paddingTop: '6px' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Channel Performance Table */}
            <div style={{
              backgroundColor: C.surface, border: `1px solid ${C.border}`,
              borderRadius: R.card, padding: S[5],
            }}>
              <div style={{ marginBottom: S[4] }}>
                <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>
                  Channel Performance
                </div>
                <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, marginTop: '2px' }}>
                  7-day window · All active campaigns
                </div>
              </div>
              <div style={{ overflowX: 'auto', ...scrollbarStyle }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                      {['Channel', 'Spend', 'Leads', 'CAC', 'ROAS', 'Trend', 'Agent Action'].map((col) => (
                        <th key={col} style={{
                          padding: `${S[2]} ${S[2]}`, textAlign: col === 'Channel' ? 'left' : 'right',
                          fontFamily: F.mono, fontSize: '9px', fontWeight: 700,
                          color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em',
                          whiteSpace: 'nowrap', paddingBottom: S[2],
                        }}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {CHANNEL_ROWS.map((row, i) => {
                      const cacGood = row.cacNum < 150;
                      const cacBad = row.cacNum > 160;
                      const cacColor = cacGood ? C.green : cacBad ? C.red : C.amber;
                      return (
                        <tr key={row.channel} style={{ backgroundColor: i % 2 === 1 ? 'rgba(54,74,68,0.2)' : 'transparent' }}>
                          <td style={{ padding: `${S[2]} ${S[2]}`, fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textPrimary, whiteSpace: 'nowrap' }}>
                            {row.channel}
                          </td>
                          <td style={{ padding: `${S[2]} ${S[2]}`, textAlign: 'right', fontFamily: F.mono, fontSize: '11px', color: C.textSecondary }}>{row.spend}</td>
                          <td style={{ padding: `${S[2]} ${S[2]}`, textAlign: 'right', fontFamily: F.mono, fontSize: '11px', color: C.textPrimary, fontWeight: 700 }}>{row.leads}</td>
                          <td style={{ padding: `${S[2]} ${S[2]}`, textAlign: 'right', fontFamily: F.mono, fontSize: '11px', color: cacColor, fontWeight: 700 }}>{row.cac}</td>
                          <td style={{ padding: `${S[2]} ${S[2]}`, textAlign: 'right', fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: parseFloat(row.roas) >= 3 ? C.green : C.amber }}>
                            {row.roas}
                          </td>
                          <td style={{ padding: `${S[2]} ${S[2]}`, textAlign: 'right' }}>
                            <span style={{
                              fontFamily: F.mono, fontSize: '10px', fontWeight: 700,
                              color: row.trendUp ? C.green : C.red,
                            }}>
                              {row.trendUp ? '↑' : '↓'} {Math.abs(row.trend)}%
                            </span>
                          </td>
                          <td style={{ padding: `${S[2]} ${S[2]}`, textAlign: 'right' }}>
                            <span
                              onClick={() => toast.info(`${row.channel}: ${row.agentAction}`)}
                              style={{
                                fontFamily: F.body, fontSize: '10px', color: C.secondary,
                                fontStyle: 'italic', cursor: 'pointer',
                                textDecoration: 'underline', textDecorationStyle: 'dotted',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {row.agentAction}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Attribution Model Comparison */}
            <div style={{
              backgroundColor: C.surface, border: `1px solid ${C.border}`,
              borderRadius: R.card, padding: S[5],
            }}>
              {/* Model tabs */}
              <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginBottom: S[4], flexWrap: 'wrap' }}>
                <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: S[1] }}>Switch model:</span>
                {ATTRIBUTION_MODELS.map((m) => {
                  const isActive = activeModel === m.label;
                  return (
                    <button
                      key={m.label}
                      onClick={() => { setActiveModel(m.label); toast.info(`Attribution model: ${m.label}`); }}
                      style={{
                        fontFamily: F.mono, fontSize: '10px', fontWeight: isActive ? 700 : 500,
                        color: isActive ? C.textInverse : C.textSecondary,
                        backgroundColor: isActive ? m.color : 'transparent',
                        border: `1px solid ${isActive ? m.color : C.border}`,
                        borderRadius: R.pill, padding: '3px 8px',
                        cursor: 'pointer',
                      }}
                    >
                      {m.label}
                    </button>
                  );
                })}
              </div>

              <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary, marginBottom: S[3] }}>
                Attribution Model Comparison
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
                {ATTRIBUTION_MODELS.map((m) => {
                  const isActive = activeModel === m.label;
                  return (
                    <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                      <span style={{
                        fontFamily: F.body, fontSize: '11px', fontWeight: isActive ? 700 : 500,
                        color: isActive ? C.textPrimary : C.textSecondary,
                        width: '88px', flexShrink: 0,
                      }}>
                        {m.label}
                      </span>
                      <div style={{ flex: 1, height: '18px', backgroundColor: C.surface3, borderRadius: R.sm, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', width: `${m.pct * 3}%`,
                          backgroundColor: isActive ? m.color : `${m.color}55`,
                          borderRadius: R.sm, transition: 'all 0.3s ease',
                          display: 'flex', alignItems: 'center', paddingLeft: '6px',
                        }}>
                          {m.pct > 14 && (
                            <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: isActive ? C.textInverse : 'rgba(250,248,243,0.7)' }}>
                              {m.pct}%
                            </span>
                          )}
                        </div>
                      </div>
                      <span style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: isActive ? m.color : C.textMuted, width: '28px', textAlign: 'right' }}>
                        {m.pct}%
                      </span>
                      {isActive && <span style={{ fontFamily: F.mono, fontSize: '9px', color: m.color, backgroundColor: `${m.color}20`, border: `1px solid ${m.color}44`, borderRadius: R.pill, padding: '1px 5px', whiteSpace: 'nowrap' }}>ACTIVE</span>}
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: S[4], padding: `${S[2]} ${S[3]}`, backgroundColor: C.surface2, borderRadius: R.sm }}>
                <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.secondary }}>✦ ANALYST </span>
                <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary }}>
                  W-Shaped best fits Medglobal's 3-touch donor journey — accounts for awareness (Yemen, MENA) and conversion (email, landing page).
                </span>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Action Queue ────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
            <div>
              <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>
                Action Queue
              </div>
              <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.amber, marginTop: '2px' }}>
                4 items need attention
              </div>
            </div>

            {ACTION_QUEUE.map((item) => (
              <div key={item.id} style={{
                backgroundColor: C.surface, border: `1px solid ${C.border}`,
                borderRadius: R.md, padding: S[3],
                display: 'flex', flexDirection: 'column', gap: S[2],
              }}>
                <div style={{
                  display: 'inline-flex', alignSelf: 'flex-start',
                  fontFamily: F.mono, fontSize: '9px', fontWeight: 700,
                  color: item.urgencyColor,
                  backgroundColor: item.urgencyBg,
                  border: `1px solid ${item.urgencyColor}40`,
                  borderRadius: R.pill, padding: '1px 6px',
                }}>
                  {item.urgency}
                </div>
                <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textPrimary, lineHeight: 1.4 }}>
                  {item.title}
                </div>
                <button
                  onClick={() => item.actionFn(toast)}
                  style={{
                    fontFamily: F.body, fontSize: '11px', fontWeight: 600,
                    color: C.textInverse, backgroundColor: C.primary,
                    border: 'none', borderRadius: R.button, padding: `${S[1]} ${S[3]}`,
                    cursor: 'pointer', alignSelf: 'flex-start',
                  }}
                >
                  Act →
                </button>
              </div>
            ))}

            {/* Run Analyst trigger */}
            <div style={{ marginTop: S[2] }}>
              <button
                onClick={() => {
                  handleRunAnalysis();
                }}
                style={{
                  width: '100%', fontFamily: F.body, fontSize: '13px', fontWeight: 700,
                  color: C.textInverse, backgroundColor: C.primary,
                  border: 'none', borderRadius: R.button, padding: `${S[3]} ${S[3]}`,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: S[2],
                }}
              >
                <IconChart color={C.textInverse} width={16} height={16} />
                Run Analyst Now
              </button>
            </div>

            {/* Spend by channel mini chart */}
            <div style={{
              backgroundColor: C.surface, border: `1px solid ${C.border}`,
              borderRadius: R.card, padding: S[3], marginTop: S[1],
            }}>
              <div style={{ fontFamily: F.display, fontSize: '12px', fontWeight: 700, color: C.textPrimary, marginBottom: S[3] }}>
                Spend by Channel
              </div>
              <ResponsiveContainer width="100%" height={110}>
                <BarChart data={SPEND_DATA} barGap={1} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="2 2" stroke={C.border} vertical={false} />
                  <XAxis dataKey="week" tick={{ fill: C.textMuted, fontFamily: F.mono, fontSize: 8 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip {...TIP} formatter={(v, name) => [`$${v.toLocaleString()}`, name]} />
                  {Object.entries(CH_COLORS).map(([key, fill]) => (
                    <Bar key={key} dataKey={key} fill={fill} radius={[2, 2, 0, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
    </ModePageWrapper>
  );
}
