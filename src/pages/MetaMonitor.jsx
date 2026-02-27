import { useState, useMemo } from 'react';
import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
} from 'recharts';
import { C, F, R, S, T, scrollbarStyle } from '../tokens';

/* ─── Static data ─────────────────────────────────────────── */
const CAMPAIGNS = [
  { id: 'all',       label: 'All Campaigns'         },
  { id: 'acme-cfq2', label: 'Acme VN CFO Q2'        },
  { id: 'sea-dg',    label: 'SEA Demand Gen'         },
  { id: 'apac-ba',   label: 'APAC Brand Awareness'   },
];

const STATS = {
  all: [
    { label: 'Impressions', value: '248.4K', delta: '+12%',   up: true,  posGood: true  },
    { label: 'Reach',       value: '91.2K',  delta: '+8%',    up: true,  posGood: true  },
    { label: 'CTR',         value: '3.67%',  delta: '+0.4pp', up: true,  posGood: true  },
    { label: 'CPM',         value: '$14.20', delta: '-6%',    up: false, posGood: false },
    { label: 'Frequency',   value: '2.72',   delta: '+0.3',   up: true,  posGood: false },
  ],
  'acme-cfq2': [
    { label: 'Impressions', value: '84.1K',  delta: '+22%',   up: true,  posGood: true  },
    { label: 'Reach',       value: '31.8K',  delta: '+18%',   up: true,  posGood: true  },
    { label: 'CTR',         value: '4.12%',  delta: '+0.8pp', up: true,  posGood: true  },
    { label: 'CPM',         value: '$12.60', delta: '-9%',    up: false, posGood: false },
    { label: 'Frequency',   value: '2.64',   delta: '+0.2',   up: true,  posGood: false },
  ],
  'sea-dg': [
    { label: 'Impressions', value: '112.4K', delta: '+7%',    up: true,  posGood: true  },
    { label: 'Reach',       value: '42.1K',  delta: '+4%',    up: true,  posGood: true  },
    { label: 'CTR',         value: '3.21%',  delta: '-0.2pp', up: false, posGood: true  },
    { label: 'CPM',         value: '$15.80', delta: '+2%',    up: true,  posGood: false },
    { label: 'Frequency',   value: '2.67',   delta: '+0.1',   up: true,  posGood: false },
  ],
  'apac-ba': [
    { label: 'Impressions', value: '51.9K',  delta: '+3%',    up: true,  posGood: true  },
    { label: 'Reach',       value: '17.3K',  delta: '+1%',    up: true,  posGood: true  },
    { label: 'CTR',         value: '2.88%',  delta: '+0.1pp', up: true,  posGood: true  },
    { label: 'CPM',         value: '$16.40', delta: '+4%',    up: true,  posGood: false },
    { label: 'Frequency',   value: '3.00',   delta: '+0.5',   up: true,  posGood: false },
  ],
};

// 14-day CTR with anomaly on Feb 22
const CTR_DATA = [
  { day: 'Feb 15', ctr: 3.42 }, { day: 'Feb 16', ctr: 3.55 },
  { day: 'Feb 17', ctr: 3.61 }, { day: 'Feb 18', ctr: 3.72 },
  { day: 'Feb 19', ctr: 3.68 }, { day: 'Feb 20', ctr: 3.80 },
  { day: 'Feb 21', ctr: 3.91 }, { day: 'Feb 22', ctr: 2.14 },
  { day: 'Feb 23', ctr: 3.65 }, { day: 'Feb 24', ctr: 3.71 },
  { day: 'Feb 25', ctr: 3.82 }, { day: 'Feb 26', ctr: 3.78 },
  { day: 'Feb 27', ctr: 3.88 }, { day: 'Feb 28', ctr: 3.95 },
];

const ALERTS = [
  { id: 'a1', sev: 'High',   time: '9:12 AM',  date: 'Feb 22', title: 'CTR drop detected \u2014 Acme CFQ2 LinkedIn',      desc: 'CTR fell from 3.9% to 2.1% (\u219146%). ARIA paused creative rotation and flagged for review.' },
  { id: 'a2', sev: 'Medium', time: '2:45 PM',  date: 'Feb 20', title: 'Frequency warning \u2014 SEA Demand Gen',           desc: 'Average frequency reached 2.67, approaching the 3.0 burnout threshold for this audience.' },
  { id: 'a3', sev: 'High',   time: '11:00 AM', date: 'Feb 18', title: 'CPM spike \u2014 APAC Brand Awareness',             desc: 'CPM increased 24% in 48h. Competitor bid activity detected in the auction landscape.' },
  { id: 'a4', sev: 'Low',    time: '4:30 PM',  date: 'Feb 15', title: 'Creative fatigue \u2014 Email Touch 3',             desc: 'Open rate on Touch-3 emails fell below the 20% alert threshold. Refresh recommended.' },
  { id: 'a5', sev: 'Medium', time: '8:00 AM',  date: 'Feb 12', title: 'Budget pacing ahead \u2014 all campaigns',          desc: 'Combined spend at 78% of monthly budget with 40% of the month remaining.' },
];

const SEV_COLOR = { High: C.red, Medium: C.amber, Low: C.primary };

const CREATIVES = [
  { id: 'c1', name: 'CFO Q2 \u2014 Cold Intro v2',       type: 'Email',       impressions: 28400, ctr: 4.82, cpc: 2.10, cvr: 3.2, status: 'Active'  },
  { id: 'c2', name: 'Finance Automation Carousel',        type: 'LinkedIn Ad', impressions: 41200, ctr: 2.64, cpc: 4.80, cvr: 1.8, status: 'Active'  },
  { id: 'c3', name: 'CFO Pain Point Video 30s',           type: 'Meta Ad',     impressions: 62400, ctr: 3.44, cpc: 3.20, cvr: 2.1, status: 'Active'  },
  { id: 'c4', name: 'Q2 Webinar Retargeting',             type: 'Meta Ad',     impressions: 18100, ctr: 5.12, cpc: 2.90, cvr: 4.8, status: 'Paused'  },
  { id: 'c5', name: 'Dragon Capital Case Study',          type: 'LinkedIn Ad', impressions: 22800, ctr: 1.88, cpc: 6.40, cvr: 0.9, status: 'Fatigue' },
  { id: 'c6', name: 'SEA Corp ROI Calculator',            type: 'Email',       impressions: 14200, ctr: 3.91, cpc: 1.80, cvr: 2.8, status: 'Active'  },
];

const CR_COLS   = ['name', 'type', 'impressions', 'ctr', 'cpc', 'cvr', 'status'];
const CR_LABELS = { name: 'Creative', type: 'Type', impressions: 'Impressions', ctr: 'CTR %', cpc: 'CPC', cvr: 'Conv %', status: 'Status' };

const STATUS_STYLE = {
  Active:  { color: C.primary, bg: C.primaryGlow,        border: 'rgba(61,220,132,0.25)'  },
  Paused:  { color: C.amber,   bg: C.amberDim,            border: 'rgba(245,200,66,0.25)'  },
  Fatigue: { color: C.red,     bg: C.redDim,              border: 'rgba(255,110,122,0.25)' },
};

const TYPE_COLOR = { Email: C.primary, 'LinkedIn Ad': '#60A5FA', 'Meta Ad': '#A78BFA' };

const AUDIENCES = [
  { segment: 'Vietnam CFO / VP Finance',    reach: 31800, frequency: 2.64, maxFreq: 4, burnout: 0.66, status: 'Healthy'  },
  { segment: 'SEA Corp Decision-Makers',    reach: 28400, frequency: 2.67, maxFreq: 4, burnout: 0.67, status: 'Healthy'  },
  { segment: 'APAC SaaS Leaders',           reach: 17300, frequency: 3.00, maxFreq: 4, burnout: 0.75, status: 'Warning'  },
  { segment: 'Retargeting \u2014 Demo No-Shows', reach: 4200, frequency: 3.80, maxFreq: 4, burnout: 0.95, status: 'Critical' },
  { segment: 'Lookalike \u2014 Closed Won', reach: 9800,  frequency: 1.82, maxFreq: 4, burnout: 0.46, status: 'Healthy'  },
];

const BURNOUT_COLOR = (b) => b >= 0.9 ? C.red : b >= 0.7 ? C.amber : C.primary;

/* ─── Tooltip style ───────────────────────────────────────── */
const TIP = {
  contentStyle: {
    backgroundColor: C.surface2, border: `1px solid ${C.border}`,
    borderRadius: R.md, fontFamily: F.mono, fontSize: '11px', color: C.textPrimary,
  },
  labelStyle: { color: C.textMuted, marginBottom: '4px' },
  itemStyle:  { color: C.textPrimary },
};

/* ─── StatCard ────────────────────────────────────────────── */
function StatCard({ label, value, delta, up, posGood }) {
  const good  = posGood ? up : !up;
  const color = good ? C.primary : C.red;
  return (
    <div style={{ flex: 1, backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card, padding: S[4] }}>
      <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: S[2] }}>{label}</div>
      <div style={{ fontFamily: F.mono, fontSize: '22px', fontWeight: 700, color: C.textPrimary, lineHeight: 1, marginBottom: S[1] }}>{value}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          {up
            ? <path d="M5 8.5V1.5M2 4.5l3-3 3 3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            : <path d="M5 1.5v7M2 5.5l3 3 3-3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          }
        </svg>
        <span style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color }}>{delta}</span>
        <span style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted }}>vs prev</span>
      </div>
    </div>
  );
}

/* ─── CtrChart ────────────────────────────────────────────── */
function CtrChart() {
  return (
    <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card, padding: S[6] }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: S[4] }}>
        <div>
          <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>CTR — 14-Day Trend</div>
          <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, marginTop: '2px' }}>Click-through rate across all active ad sets</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: C.red }}/>
          <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.red }}>Anomaly Feb 22</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={CTR_DATA}>
          <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
          <XAxis dataKey="day" tick={{ fill: C.textMuted, fontFamily: F.mono, fontSize: 10 }} axisLine={false} tickLine={false} interval={1}/>
          <YAxis tick={{ fill: C.textMuted, fontFamily: F.mono, fontSize: 10 }} axisLine={false} tickLine={false} width={36} domain={[1.5, 4.5]} tickFormatter={(v) => `${v}%`}/>
          <Tooltip {...TIP} formatter={(v) => [`${v}%`, 'CTR']}/>
          <ReferenceLine x="Feb 22" stroke={C.red} strokeDasharray="5 3" strokeWidth={1.5} label={{ value: '\u26a0', fill: C.red, fontSize: 13, position: 'insideTopLeft' }}/>
          <Line dataKey="ctr" stroke={C.primary} strokeWidth={2} dot={(props) => {
            const { cx, cy, payload } = props;
            const isAnomaly = payload.day === 'Feb 22';
            return isAnomaly
              ? <circle key={cx} cx={cx} cy={cy} r={5} fill={C.red} stroke={C.surface} strokeWidth={2}/>
              : <circle key={cx} cx={cx} cy={cy} r={0} fill="transparent"/>;
          }}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ─── AlertList ───────────────────────────────────────────── */
function AlertList() {
  return (
    <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card, padding: S[5], display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary, marginBottom: S[4], flexShrink: 0 }}>Alert History</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[3], overflowY: 'auto', ...scrollbarStyle }}>
        {ALERTS.map((a) => {
          const col = SEV_COLOR[a.sev] ?? C.textMuted;
          return (
            <div key={a.id} style={{ borderLeft: `2px solid ${col}`, paddingLeft: S[3], paddingBottom: S[2] }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginBottom: '4px' }}>
                <span style={{ fontFamily: F.mono, fontSize: '9px', fontWeight: 700, color: col, backgroundColor: `${col}18`, border: `1px solid ${col}30`, borderRadius: R.pill, padding: '1px 6px' }}>
                  {a.sev}
                </span>
                <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>{a.date} · {a.time}</span>
              </div>
              <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textPrimary, marginBottom: '2px' }}>{a.title}</div>
              <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary, lineHeight: 1.5 }}>{a.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── CreativeTable ───────────────────────────────────────── */
function CreativeTable() {
  const [sortKey, setSortKey] = useState('ctr');
  const [sortDir, setSortDir] = useState('desc');

  const sorted = useMemo(() => [...CREATIVES].sort((a, b) => {
    const av = a[sortKey], bv = b[sortKey];
    if (typeof av === 'string') return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    return sortDir === 'asc' ? av - bv : bv - av;
  }), [sortKey, sortDir]);

  const handleSort = (k) => {
    if (k === sortKey) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(k); setSortDir('desc'); }
  };

  const fmt = (k, v) => {
    if (k === 'impressions') return Number(v).toLocaleString();
    if (k === 'ctr' || k === 'cvr') return `${v.toFixed(2)}%`;
    if (k === 'cpc') return `$${v.toFixed(2)}`;
    return String(v);
  };

  return (
    <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card, padding: S[6] }}>
      <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary, marginBottom: '4px' }}>Creative Performance</div>
      <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, marginBottom: S[4] }}>Click any column header to sort</div>
      <div style={{ overflowX: 'auto', ...scrollbarStyle }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {CR_COLS.map((k) => (
                <th key={k} onClick={() => handleSort(k)} style={{
                  padding: `${S[2]} ${S[3]}`, textAlign: k === 'name' ? 'left' : 'right',
                  fontFamily: F.mono, fontSize: '10px', fontWeight: 700,
                  color: sortKey === k ? C.primary : C.textMuted,
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  borderBottom: `1px solid ${C.border}`, userSelect: 'none',
                }}>
                  {CR_LABELS[k]}{sortKey === k ? (sortDir === 'asc' ? ' \u2191' : ' \u2193') : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => {
              const ss = STATUS_STYLE[row.status] ?? STATUS_STYLE.Active;
              const tc = TYPE_COLOR[row.type] ?? C.textSecondary;
              return (
                <tr key={row.id} style={{ backgroundColor: i % 2 === 1 ? C.surface2 : 'transparent' }}>
                  {CR_COLS.map((k) => (
                    <td key={k} style={{
                      padding: `${S[2]} ${S[3]}`,
                      textAlign: k === 'name' ? 'left' : 'right',
                      borderBottom: `1px solid ${C.border}`,
                      whiteSpace: k === 'name' ? 'normal' : 'nowrap',
                    }}>
                      {k === 'name' && (
                        <span style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textPrimary }}>{row.name}</span>
                      )}
                      {k === 'type' && (
                        <span style={{ fontFamily: F.mono, fontSize: '10px', color: tc, backgroundColor: `${tc}14`, border: `1px solid ${tc}25`, borderRadius: R.pill, padding: '1px 7px' }}>{row.type}</span>
                      )}
                      {k === 'status' && (
                        <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: ss.color, backgroundColor: ss.bg, border: `1px solid ${ss.border}`, borderRadius: R.pill, padding: '1px 7px' }}>{row.status}</span>
                      )}
                      {k !== 'name' && k !== 'type' && k !== 'status' && (
                        <span style={{ fontFamily: F.mono, fontSize: '12px', color: C.textSecondary }}>{fmt(k, row[k])}</span>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── AudienceCard ────────────────────────────────────────── */
function AudienceCard({ seg }) {
  const bc = BURNOUT_COLOR(seg.burnout);
  const STATUS_BG  = { Healthy: C.primaryGlow, Warning: C.amberDim, Critical: C.redDim };
  const STATUS_COL = { Healthy: C.primary, Warning: C.amber, Critical: C.red };
  return (
    <div style={{ backgroundColor: C.surface, border: `1px solid ${seg.status === 'Critical' ? 'rgba(255,110,122,0.3)' : C.border}`, borderRadius: R.card, padding: S[4], display: 'flex', flexDirection: 'column', gap: S[3] }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: S[2] }}>
        <span style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 700, color: C.textPrimary, lineHeight: 1.4 }}>{seg.segment}</span>
        <span style={{ fontFamily: F.mono, fontSize: '9px', fontWeight: 700, color: STATUS_COL[seg.status], backgroundColor: STATUS_BG[seg.status], borderRadius: R.pill, padding: '2px 7px', whiteSpace: 'nowrap', flexShrink: 0 }}>
          {seg.status}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[2] }}>
        <div>
          <div style={{ fontFamily: F.mono, fontSize: '9px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>Reach</div>
          <div style={{ fontFamily: F.mono, fontSize: '16px', fontWeight: 700, color: C.textPrimary }}>{seg.reach.toLocaleString()}</div>
        </div>
        <div>
          <div style={{ fontFamily: F.mono, fontSize: '9px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>Frequency</div>
          <div style={{ fontFamily: F.mono, fontSize: '16px', fontWeight: 700, color: C.textPrimary }}>{seg.frequency.toFixed(2)}</div>
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span style={{ fontFamily: F.mono, fontSize: '9px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Burnout risk</span>
          <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: bc }}>{Math.round(seg.burnout * 100)}%</span>
        </div>
        <div style={{ height: '5px', backgroundColor: C.surface2, borderRadius: R.pill, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${seg.burnout * 100}%`, backgroundColor: bc, borderRadius: R.pill, transition: 'width 0.4s ease' }}/>
        </div>
        <div style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted, marginTop: '4px' }}>
          {seg.frequency.toFixed(2)} / {seg.maxFreq} threshold
        </div>
      </div>
    </div>
  );
}

/* ─── MetaMonitor (main) ──────────────────────────────────── */
export default function MetaMonitor() {
  const [campaign, setCampaign] = useState('all');
  const stats = STATS[campaign] ?? STATS.all;

  return (
    <div style={{ height: '100vh', overflowY: 'auto', backgroundColor: C.bg, ...scrollbarStyle }}>
      <div style={{ padding: `${S[6]} ${S[8]} ${S[10]}` }}>

        {/* Header + campaign filter */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[6] }}>
          <div>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: 800, color: C.textPrimary, margin: 0, letterSpacing: '-0.03em' }}>Meta Monitor</h1>
            <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, margin: `${S[1]} 0 0` }}>Paid media performance — 14-day rolling window</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
            <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>Campaign</span>
            <div style={{ position: 'relative' }}>
              <select
                value={campaign}
                onChange={(e) => setCampaign(e.target.value)}
                style={{
                  appearance: 'none',
                  backgroundColor: C.surface, color: C.textPrimary,
                  border: `1px solid ${C.border}`, borderRadius: R.button,
                  padding: `${S[2]} ${S[6]} ${S[2]} ${S[3]}`,
                  fontFamily: F.body, fontSize: '13px', fontWeight: 600,
                  cursor: 'pointer', outline: 'none',
                }}
              >
                {CAMPAIGNS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <path d="M2 3.5l3 3 3-3" stroke={C.textMuted} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        {/* 5-stat row */}
        <div style={{ display: 'flex', gap: S[3], marginBottom: S[5] }}>
          {stats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>

        {/* CTR chart + Alert history */}
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: S[5], marginBottom: S[5] }}>
          <CtrChart/>
          <AlertList/>
        </div>

        {/* Creative performance table */}
        <div style={{ marginBottom: S[5] }}>
          <CreativeTable/>
        </div>

        {/* Audience breakdown */}
        <div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '14px', fontWeight: 700, color: C.textPrimary, marginBottom: '4px' }}>Audience Breakdown</div>
          <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, marginBottom: S[4] }}>Frequency and burnout risk across active audience segments</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: S[4] }}>
            {AUDIENCES.map((a) => <AudienceCard key={a.segment} seg={a}/>)}
          </div>
        </div>

      </div>
    </div>
  );
}
