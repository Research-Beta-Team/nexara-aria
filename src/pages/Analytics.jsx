import { useState, useMemo } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { C, F, R, S, T, btn, scrollbarStyle } from '../tokens';

/* ─── Static data ─────────────────────────────────────────── */
const RANGES = ['7d', '30d', '90d', 'YTD'];

const KPI_DATA = {
  '7d': [
    { label: 'Total Spend',    value: '$7,820',  delta: '+8%',  up: true,  posGood: false },
    { label: 'MQLs Generated', value: '24',      delta: '+60%', up: true,  posGood: true  },
    { label: 'Avg CAC',        value: '$325',    delta: '-6%',  up: false, posGood: false },
    { label: 'Pipeline Value', value: '$1.4M',   delta: '+23%', up: true,  posGood: true  },
  ],
  '30d': [
    { label: 'Total Spend',    value: '$28,400', delta: '+11%', up: true,  posGood: false },
    { label: 'MQLs Generated', value: '89',      delta: '+47%', up: true,  posGood: true  },
    { label: 'Avg CAC',        value: '$319',    delta: '-9%',  up: false, posGood: false },
    { label: 'Pipeline Value', value: '$4.2M',   delta: '+31%', up: true,  posGood: true  },
  ],
  '90d': [
    { label: 'Total Spend',    value: '$82,100', delta: '+5%',  up: true,  posGood: false },
    { label: 'MQLs Generated', value: '234',     delta: '+38%', up: true,  posGood: true  },
    { label: 'Avg CAC',        value: '$351',    delta: '+3%',  up: true,  posGood: false },
    { label: 'Pipeline Value', value: '$11.8M',  delta: '+27%', up: true,  posGood: true  },
  ],
  YTD: [
    { label: 'Total Spend',    value: '$112.5K', delta: '+9%',  up: true,  posGood: false },
    { label: 'MQLs Generated', value: '312',     delta: '+42%', up: true,  posGood: true  },
    { label: 'Avg CAC',        value: '$361',    delta: '+5%',  up: true,  posGood: false },
    { label: 'Pipeline Value', value: '$16.2M',  delta: '+33%', up: true,  posGood: true  },
  ],
};

const SPEND_DATA = [
  { month: 'Oct', Email: 3200, LinkedIn: 4800, Meta: 5200, Events: 1500 },
  { month: 'Nov', Email: 4100, LinkedIn: 5200, Meta: 4800, Events: 0    },
  { month: 'Dec', Email: 3800, LinkedIn: 4600, Meta: 5600, Events: 2200 },
  { month: 'Jan', Email: 5200, LinkedIn: 6100, Meta: 6200, Events: 0    },
  { month: 'Feb', Email: 6800, LinkedIn: 7200, Meta: 7100, Events: 1800 },
];

const CAC_DATA = [
  { week: 'W1', Email: 410, LinkedIn: 520, Meta: 380 },
  { week: 'W2', Email: 395, LinkedIn: 498, Meta: 362 },
  { week: 'W3', Email: 380, LinkedIn: 475, Meta: 344 },
  { week: 'W4', Email: 355, LinkedIn: 451, Meta: 330 },
  { week: 'W5', Email: 340, LinkedIn: 440, Meta: 318 },
  { week: 'W6', Email: 325, LinkedIn: 428, Meta: 302 },
  { week: 'W7', Email: 310, LinkedIn: 415, Meta: 288 },
  { week: 'W8', Email: 298, LinkedIn: 402, Meta: 275 },
];

const FUNNEL_DATA = [
  { stage: 'Impressions', value: 248400, convRate: null    },
  { stage: 'Clicks',      value: 9120,   convRate: '3.7%'  },
  { stage: 'Leads',       value: 1840,   convRate: '20.2%' },
  { stage: 'MQLs',        value: 312,    convRate: '17.0%' },
  { stage: 'SQLs',        value: 148,    convRate: '47.4%' },
  { stage: 'Demos',       value: 62,     convRate: '41.9%' },
  { stage: 'Closed Won',  value: 18,     convRate: '29.0%' },
];

const ARIA_INSIGHTS = [
  'Email channel outperforming LinkedIn on CPL by 18% \u2014 recommend increasing email budget by $2,000/mo.',
  'CAC trending down across all channels. Sequence optimisation is driving compounding efficiency gains.',
  'Funnel drop-off between Leads and MQLs (17%) is the highest-leverage stage to optimise.',
  'Vietnam market delivers 63% of MQLs on 40% of spend \u2014 consider reallocating from APAC Brand.',
];

const CHANNEL_DATA = [
  { channel: 'Email',    spend: 22400, impressions: 84200,  clicks: 4210, ctr: 5.0,  leads: 840, mqls: 142, cac: 158, cpl: 27 },
  { channel: 'LinkedIn', spend: 31200, impressions: 112000, clicks: 2800, ctr: 2.5,  leads: 560, mqls: 98,  cac: 319, cpl: 56 },
  { channel: 'Meta',     spend: 28100, impressions: 198000, clicks: 5940, ctr: 3.0,  leads: 890, mqls: 124, cac: 227, cpl: 32 },
  { channel: 'Events',   spend: 5800,  impressions: 4200,   clicks: 4200, ctr: null, leads: 220, mqls: 48,  cac: 121, cpl: 26 },
];

const COL_KEYS   = ['channel', 'spend', 'impressions', 'clicks', 'ctr', 'leads', 'mqls', 'cac', 'cpl'];
const COL_LABELS = {
  channel: 'Channel', spend: 'Spend', impressions: 'Impressions', clicks: 'Clicks',
  ctr: 'CTR', leads: 'Leads', mqls: 'MQLs', cac: 'CAC', cpl: 'CPL',
};

/* ─── Chart helpers ───────────────────────────────────────── */
const CH_COLORS = { Email: C.primary, LinkedIn: '#60A5FA', Meta: '#A78BFA', Events: C.amber };

const TIP = {
  contentStyle: {
    backgroundColor: C.surface2, border: `1px solid ${C.border}`,
    borderRadius: R.md, fontFamily: F.mono, fontSize: '11px', color: C.textPrimary,
  },
  labelStyle: { color: C.textMuted, marginBottom: '4px' },
  itemStyle:  { color: C.textPrimary },
};

/* ─── KpiCard ─────────────────────────────────────────────── */
function KpiCard({ label, value, delta, up, posGood }) {
  const good  = posGood ? up : !up;
  const color = good ? C.primary : C.red;
  return (
    <div style={{ flex: 1, backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card, padding: S[5] }}>
      <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: S[2] }}>{label}</div>
      <div style={{ fontFamily: F.mono, fontSize: '26px', fontWeight: 700, color: C.textPrimary, lineHeight: 1, marginBottom: S[2] }}>{value}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          {up
            ? <path d="M5.5 9V2M2 5.5l3.5-3.5 3.5 3.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            : <path d="M5.5 2v7M2 5.5l3.5 3.5 3.5-3.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          }
        </svg>
        <span style={{ fontFamily: F.mono, fontSize: '12px', fontWeight: 700, color }}>{delta}</span>
        <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>vs prev period</span>
      </div>
    </div>
  );
}

/* ─── SectionHeader ───────────────────────────────────────── */
function SectionHeader({ title, sub }) {
  return (
    <div style={{ marginBottom: S[4] }}>
      <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>{title}</div>
      {sub && <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, marginTop: '2px' }}>{sub}</div>}
    </div>
  );
}

/* ─── FunnelViz ───────────────────────────────────────────── */
function FunnelViz() {
  const max = FUNNEL_DATA[0].value;
  return (
    <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card, padding: S[6] }}>
      <SectionHeader title="Conversion Funnel" sub="Full-funnel view across all active campaigns — 90-day window" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {FUNNEL_DATA.map((row, i) => {
          const pct = (row.value / max) * 100;
          const op  = 1 - i * 0.09;
          const showInside = pct > 14;
          return (
            <div key={row.stage} style={{ display: 'grid', gridTemplateColumns: '110px 1fr 80px 88px', gap: S[3], alignItems: 'center' }}>
              <span style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, textAlign: 'right' }}>{row.stage}</span>
              <div style={{ height: '22px', backgroundColor: C.surface2, borderRadius: R.sm, overflow: 'hidden', position: 'relative' }}>
                <div style={{ height: '100%', width: `${pct}%`, backgroundColor: C.primary, opacity: op, borderRadius: R.sm, display: 'flex', alignItems: 'center', paddingLeft: '8px', boxSizing: 'border-box' }}>
                  {showInside && (
                    <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textInverse, fontWeight: 700, whiteSpace: 'nowrap' }}>
                      {row.value.toLocaleString()}
                    </span>
                  )}
                </div>
                {!showInside && (
                  <span style={{ position: 'absolute', left: `${Math.max(pct + 1, 1)}%`, top: '50%', transform: 'translateY(-50%)', fontFamily: F.mono, fontSize: '11px', color: C.textSecondary, whiteSpace: 'nowrap' }}>
                    {row.value.toLocaleString()}
                  </span>
                )}
              </div>
              <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, textAlign: 'right' }}>
                {pct >= 1 ? `${pct.toFixed(1)}%` : `${(pct * 100).toFixed(1)}bps`}
              </span>
              <span style={{ fontFamily: F.mono, fontSize: '10px', color: row.convRate ? C.amber : C.textMuted, textAlign: 'right' }}>
                {row.convRate ? `\u2192 ${row.convRate}` : 'top of funnel'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── AriaReportCard ──────────────────────────────────────── */
function AriaReportCard() {
  const [dl, setDl] = useState(false);
  const download = () => { setDl(true); setTimeout(() => setDl(false), 2000); };
  return (
    <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card, padding: S[6] }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: S[4] }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginBottom: '4px' }}>
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: C.primaryGlow, border: `1.5px solid rgba(61,220,132,0.4)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <circle cx="4.5" cy="4.5" r="3.5" stroke={C.primary} strokeWidth="1" strokeDasharray="2 1.2"/>
                <circle cx="4.5" cy="4.5" r="1.2" fill={C.primary}/>
              </svg>
            </div>
            <span style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>ARIA Report</span>
          </div>
          <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>Generated Feb 28, 2025 · 90-day data</span>
        </div>
        <button onClick={download} style={{ ...btn.secondary, fontSize: '12px', padding: `${S[1]} ${S[3]}`, gap: '6px' }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
            style={dl ? { animation: 'anSpin 0.9s linear infinite', transformOrigin: 'center' } : {}}>
            {dl
              ? <circle cx="6" cy="6" r="4" stroke={C.primary} strokeWidth="1.5" strokeDasharray="8 4"/>
              : <><path d="M6 1v7M3 6l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M1 10h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></>
            }
          </svg>
          {dl ? 'Generating\u2026' : 'Download PDF'}
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
        {ARIA_INSIGHTS.map((ins, i) => (
          <div key={i} style={{ display: 'flex', gap: S[2], alignItems: 'flex-start' }}>
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: C.primary, flexShrink: 0, marginTop: '7px' }}/>
            <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, lineHeight: 1.65 }}>{ins}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── ChannelTable ────────────────────────────────────────── */
function ChannelTable() {
  const [sortKey, setSortKey] = useState('spend');
  const [sortDir, setSortDir] = useState('desc');

  const sorted = useMemo(() => [...CHANNEL_DATA].sort((a, b) => {
    const av = a[sortKey] ?? -Infinity, bv = b[sortKey] ?? -Infinity;
    if (typeof av === 'string') return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    return sortDir === 'asc' ? av - bv : bv - av;
  }), [sortKey, sortDir]);

  const handleSort = (k) => {
    if (k === sortKey) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(k); setSortDir('desc'); }
  };

  const fmt = (k, v) => {
    if (v == null) return '\u2014';
    if (k === 'spend' || k === 'cac' || k === 'cpl') return `$${v.toLocaleString()}`;
    if (k === 'ctr') return `${v}%`;
    if (k === 'impressions' || k === 'clicks') return v.toLocaleString();
    return String(v);
  };

  return (
    <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card, padding: S[6] }}>
      <SectionHeader title="Channel Comparison" sub="Click any column header to sort" />
      <div style={{ overflowX: 'auto', ...scrollbarStyle }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {COL_KEYS.map((k) => (
                <th key={k} onClick={() => handleSort(k)} style={{
                  padding: `${S[2]} ${S[3]}`, textAlign: k === 'channel' ? 'left' : 'right',
                  fontFamily: F.mono, fontSize: '10px', fontWeight: 700,
                  color: sortKey === k ? C.primary : C.textMuted,
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  borderBottom: `1px solid ${C.border}`, userSelect: 'none',
                }}>
                  {COL_LABELS[k]}{sortKey === k ? (sortDir === 'asc' ? ' \u2191' : ' \u2193') : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <tr key={row.channel} style={{ backgroundColor: i % 2 === 1 ? C.surface2 : 'transparent' }}>
                {COL_KEYS.map((k) => (
                  <td key={k} style={{
                    padding: `${S[2]} ${S[3]}`, textAlign: k === 'channel' ? 'left' : 'right',
                    fontFamily: k === 'channel' ? F.body : F.mono, fontSize: '12px',
                    fontWeight: k === 'channel' ? 600 : 400,
                    color: k === 'channel' ? C.textPrimary : C.textSecondary,
                    borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap',
                  }}>
                    {fmt(k, row[k])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Analytics (main) ────────────────────────────────────── */
export default function Analytics() {
  const [range, setRange] = useState('30d');
  const kpis = KPI_DATA[range];

  return (
    <div style={{ height: '100vh', overflowY: 'auto', backgroundColor: C.bg, ...scrollbarStyle }}>
      <style>{`@keyframes anSpin { to { transform: rotate(360deg) } }`}</style>
      <div style={{ padding: `${S[6]} ${S[8]} ${S[10]}` }}>

        {/* Header + range tabs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[6] }}>
          <div>
            <h1 style={{ fontFamily: F.display, fontSize: '22px', fontWeight: 800, color: C.textPrimary, margin: 0, letterSpacing: '-0.03em' }}>Analytics</h1>
            <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, margin: `${S[1]} 0 0` }}>Cross-campaign performance — all channels</p>
          </div>
          <div style={{ display: 'flex', gap: '2px', backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.button, padding: '3px' }}>
            {RANGES.map((r) => (
              <button key={r} onClick={() => setRange(r)} style={{
                fontFamily: F.mono, fontSize: '12px', fontWeight: 700,
                color: range === r ? C.textInverse : C.textMuted,
                backgroundColor: range === r ? C.primary : 'transparent',
                border: 'none', borderRadius: R.sm,
                padding: `${S[1]} ${S[3]}`, cursor: 'pointer', transition: T.color,
              }}>{r}</button>
            ))}
          </div>
        </div>

        {/* KPI row */}
        <div style={{ display: 'flex', gap: S[4], marginBottom: S[5] }}>
          {kpis.map((k) => <KpiCard key={k.label} {...k} />)}
        </div>

        {/* Charts row: Spend + CAC */}
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: S[5], marginBottom: S[5] }}>
          <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card, padding: S[6] }}>
            <SectionHeader title="Spend by Channel" sub="Monthly budget allocation — Email, LinkedIn, Meta, Events" />
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={SPEND_DATA} barGap={2} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
                <XAxis dataKey="month" tick={{ fill: C.textMuted, fontFamily: F.mono, fontSize: 10 }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fill: C.textMuted, fontFamily: F.mono, fontSize: 10 }} axisLine={false} tickLine={false} width={38} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}/>
                <Tooltip {...TIP} formatter={(v, name) => [`$${v.toLocaleString()}`, name]}/>
                <Legend wrapperStyle={{ fontFamily: F.mono, fontSize: '10px', paddingTop: '8px' }}/>
                {Object.entries(CH_COLORS).map(([key, fill]) => (
                  <Bar key={key} dataKey={key} fill={fill} radius={[3, 3, 0, 0]}/>
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card, padding: S[6] }}>
            <SectionHeader title="CAC Trend" sub="Cost per acquisition by channel — last 8 weeks"/>
            <ResponsiveContainer width="100%" height={230}>
              <LineChart data={CAC_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
                <XAxis dataKey="week" tick={{ fill: C.textMuted, fontFamily: F.mono, fontSize: 10 }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fill: C.textMuted, fontFamily: F.mono, fontSize: 10 }} axisLine={false} tickLine={false} width={42} domain={['auto', 'auto']} tickFormatter={(v) => `$${v}`}/>
                <Tooltip {...TIP} formatter={(v, name) => [`$${v}`, name]}/>
                <Legend wrapperStyle={{ fontFamily: F.mono, fontSize: '10px', paddingTop: '8px' }}/>
                {['Email', 'LinkedIn', 'Meta'].map((key) => (
                  <Line key={key} dataKey={key} stroke={CH_COLORS[key]} strokeWidth={2} dot={false}/>
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Full funnel */}
        <div style={{ marginBottom: S[5] }}>
          <FunnelViz/>
        </div>

        {/* ARIA report + Channel table */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: S[5] }}>
          <AriaReportCard/>
          <ChannelTable/>
        </div>

      </div>
    </div>
  );
}
