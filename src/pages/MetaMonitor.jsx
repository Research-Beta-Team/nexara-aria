import { useState, useMemo } from 'react';
import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
} from 'recharts';
import { C, F, R, S, T, scrollbarStyle, btn } from '../tokens';
import useStore from '../store/useStore';
import useToast from '../hooks/useToast';

/* Product UI palette — Antarious Brand Guidelines v1.1 (Meta Command) */
const UI = {
  navy:       '#0A1628',
  navy2:      '#0F1E35',
  surface:    'rgba(255,255,255,0.04)',
  surface2:   'rgba(255,255,255,0.06)',
  border:     'rgba(255,255,255,0.08)',
  borderHover: 'rgba(255,255,255,0.14)',
  electric:   '#2563EB',
  electric2:  '#1d4ed8',
  electricTint: 'rgba(37,99,235,0.12)',
  electricBorder: 'rgba(37,99,235,0.3)',
  sky:        '#38BDF8',
  text:       '#E2E8F0',
  textMuted:  'rgba(255,255,255,0.5)',
  textDim:    'rgba(255,255,255,0.35)',
};

/* ─── Static data ─────────────────────────────────────────── */
const CAMPAIGNS = [
  { id: 'all',       label: 'All Campaigns'         },
  { id: 'medglobal-cfq2', label: 'Medglobal VN CFO Q2'        },
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
  'medglobal-cfq2': [
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
  { id: 'a1', sev: 'High',   time: '9:12 AM',  date: 'Feb 22', title: 'CTR drop detected \u2014 Medglobal CFQ2 LinkedIn',      desc: 'CTR fell from 3.9% to 2.1% (\u219146%). Freya paused creative rotation and flagged for review.' },
  { id: 'a2', sev: 'Medium', time: '2:45 PM',  date: 'Feb 20', title: 'Frequency warning \u2014 SEA Demand Gen',           desc: 'Average frequency reached 2.67, approaching the 3.0 burnout threshold for this audience.' },
  { id: 'a3', sev: 'High',   time: '11:00 AM', date: 'Feb 18', title: 'CPM spike \u2014 APAC Brand Awareness',             desc: 'CPM increased 24% in 48h. Competitor bid activity detected in the auction landscape.' },
  { id: 'a4', sev: 'Low',    time: '4:30 PM',  date: 'Feb 15', title: 'Creative fatigue \u2014 Email Touch 3',             desc: 'Open rate on Touch-3 emails fell below the 20% alert threshold. Refresh recommended.' },
  { id: 'a5', sev: 'Medium', time: '8:00 AM',  date: 'Feb 12', title: 'Budget pacing ahead \u2014 all campaigns',          desc: 'Combined spend at 78% of monthly budget with 40% of the month remaining.' },
];

const SEV_COLOR = { High: C.red, Medium: C.amber, Low: UI.sky };

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
  Active:  { color: UI.sky, bg: UI.electricTint, border: UI.electricBorder },
  Paused:  { color: C.amber,   bg: C.amberDim,            border: 'rgba(245,200,66,0.25)'  },
  Fatigue: { color: C.red,     bg: C.redDim,              border: 'rgba(255,110,122,0.25)' },
};

const TYPE_COLOR = { Email: UI.sky, 'LinkedIn Ad': '#0A66C2', 'Meta Ad': '#1877F2' };

const AUDIENCES = [
  { segment: 'Vietnam CFO / VP Finance',    reach: 31800, frequency: 2.64, maxFreq: 4, burnout: 0.66, status: 'Healthy'  },
  { segment: 'SEA Corp Decision-Makers',    reach: 28400, frequency: 2.67, maxFreq: 4, burnout: 0.67, status: 'Healthy'  },
  { segment: 'APAC SaaS Leaders',           reach: 17300, frequency: 3.00, maxFreq: 4, burnout: 0.75, status: 'Warning'  },
  { segment: 'Retargeting \u2014 Demo No-Shows', reach: 4200, frequency: 3.80, maxFreq: 4, burnout: 0.95, status: 'Critical' },
  { segment: 'Lookalike \u2014 Closed Won', reach: 9800,  frequency: 1.82, maxFreq: 4, burnout: 0.46, status: 'Healthy'  },
];

const BURNOUT_COLOR = (b) => b >= 0.9 ? C.red : b >= 0.7 ? C.amber : UI.sky;

const META_BUSINESS_URL = 'https://business.facebook.com';

// AI analysis text derived from campaign/alert data (mock)
const AI_ANALYSIS = {
  summary: 'Based on your last 14 days across Medglobal VN CFO Q2, SEA Demand Gen, and APAC Brand Awareness:',
  points: [
    'CTR recovered after the Feb 22 drop; consider A/B testing the creative that was live that day to avoid repeat dips.',
    'SEA Demand Gen frequency is nearing 3.0 — rotate in at least one new creative set to reduce burnout risk.',
    'APAC Brand Awareness CPM spike (Feb 18) aligned with competitor activity; dayparting or audience exclusions could improve efficiency.',
    'Retargeting — Demo No-Shows is at 95% burnout; pause or refresh creative before scaling spend.',
    'CFO Pain Point Video 30s and Finance Automation Carousel are your top performers; allocate more budget to these while testing variants.',
  ],
};

/* ─── MetaConnectionCard ───────────────────────────────────── */
function MetaConnectionCard() {
  const metaConnected = useStore((s) => s.connections?.meta);
  const setConnectionAds = useStore((s) => s.setConnectionAds);
  const toast = useToast();
  const [connecting, setConnecting] = useState(false);

  const handleConnect = () => {
    setConnecting(true);
    setTimeout(() => {
      setConnectionAds('meta', true);
      setConnecting(false);
      toast.success('Meta Business account connected. You can revoke access anytime.');
    }, 1200);
  };

  const handleDisconnect = () => {
    setConnectionAds('meta', false);
    toast.success('Meta Business account disconnected.');
  };

  return (
    <div style={{ backgroundColor: UI.surface, border: `1px solid ${UI.border}`, borderLeft: `4px solid ${UI.electric}`, borderRadius: R.card, padding: S[5], marginBottom: S[5] }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: S[4] }}>
        <div>
          <div style={{ fontFamily: F.body, fontSize: '14px', fontWeight: 700, color: UI.text, marginBottom: S[1] }}>
            Meta Business account
          </div>
          <div style={{ fontFamily: F.body, fontSize: '12px', color: UI.textMuted }}>
            {metaConnected
              ? 'Connected. Antarious can read ad performance and run AI analysis.'
              : 'Connect your Meta Business account and allow access to sync ad accounts and campaigns.'}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[3], flexWrap: 'wrap' }}>
          {metaConnected ? (
            <>
              <a
                href={META_BUSINESS_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  ...btn.ghost,
                  fontSize: '12px',
                  padding: `${S[2]} ${S[4]}`,
                  textDecoration: 'none',
                  color: UI.sky,
                  border: `1px solid ${UI.borderHover}`,
                  borderRadius: R.button,
                }}
              >
                Open Meta Business Suite
              </a>
              <button
                type="button"
                onClick={handleDisconnect}
                style={{
                  ...btn.ghost,
                  fontSize: '12px',
                  padding: `${S[2]} ${S[4]}`,
                  color: C.red,
                  border: `1px solid ${C.red}`,
                  borderRadius: R.button,
                }}
              >
                Remove access
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleConnect}
              disabled={connecting}
              style={{
                fontSize: '13px',
                padding: `${S[2]} ${S[4]}`,
                fontFamily: F.body,
                fontWeight: 700,
                color: '#fff',
                background: `linear-gradient(135deg,${UI.electric},${UI.electric2})`,
                border: 'none',
                borderRadius: R.button,
                cursor: connecting ? 'wait' : 'pointer',
                boxShadow: '0 0 0 1px rgba(37,99,235,0.5), 0 4px 16px rgba(37,99,235,0.3)',
              }}
            >
              {connecting ? 'Connecting…' : 'Connect Meta Business'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Previous ads & Freya: permission to fetch and add to ARIA ─── */
function PaidAdsAriaCard() {
  const metaConnected = useStore((s) => s.connections?.meta);
  const paidAds = useStore((s) => s.paidAdsPermissions);
  const setPaidAdsPermissions = useStore((s) => s.setPaidAdsPermissions);
  const toast = useToast();
  const [fetching, setFetching] = useState(false);

  if (!metaConnected) return null;

  const handleFetchAndAddToAria = () => {
    setFetching(true);
    setTimeout(() => {
      setPaidAdsPermissions({ allowFetch: true, allowAriaLearn: true });
      setFetching(false);
      toast.success('Previous ads fetched and added to Freya. Freya will use this data to learn and generate detailed reports.');
    }, 2000);
  };

  return (
    <div style={{ backgroundColor: UI.surface, border: `1px solid ${UI.border}`, borderRadius: R.card, padding: S[5], marginBottom: S[5] }}>
      <div style={{ fontFamily: F.body, fontSize: '14px', fontWeight: 700, color: UI.text, marginBottom: S[2] }}>
        Previous ads & Freya
      </div>
      <p style={{ fontFamily: F.body, fontSize: '12px', color: UI.textMuted, marginBottom: S[4], lineHeight: 1.5 }}>
        Give permission to fetch your previous ads from Meta and add them to Freya. Freya will learn from this data and give you a detailed report. Below you’ll see your previous campaigns and their analytics from Meta Business Suite.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[3], marginBottom: S[4] }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: S[2], fontFamily: F.body, fontSize: '13px', color: UI.text, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={paidAds?.allowFetch ?? false}
            onChange={(e) => setPaidAdsPermissions({ allowFetch: e.target.checked })}
            style={{ width: 16, height: 16, accentColor: UI.electric }}
          />
          Allow Antarious to fetch your previous ads from Meta
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: S[2], fontFamily: F.body, fontSize: '13px', color: UI.text, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={paidAds?.allowAriaLearn ?? false}
            onChange={(e) => setPaidAdsPermissions({ allowAriaLearn: e.target.checked })}
            style={{ width: 16, height: 16, accentColor: UI.electric }}
          />
          Add ads data to Freya so it can learn and generate detailed reports
        </label>
      </div>
      <button
        type="button"
        onClick={handleFetchAndAddToAria}
        disabled={fetching}
        style={{
          fontSize: '13px',
          padding: `${S[2]} ${S[4]}`,
          fontFamily: F.body,
          fontWeight: 700,
          color: '#fff',
          background: `linear-gradient(135deg,${UI.electric},${UI.electric2})`,
          border: 'none',
          borderRadius: R.button,
          cursor: fetching ? 'wait' : 'pointer',
          opacity: fetching ? 0.8 : 1,
          boxShadow: '0 0 0 1px rgba(37,99,235,0.5), 0 4px 16px rgba(37,99,235,0.3)',
        }}
      >
        {fetching ? 'Fetching & adding to Freya…' : 'Fetch previous ads & add to Freya'}
      </button>
    </div>
  );
}

/* ─── AI Analysis card ────────────────────────────────────── */
function AIAnalysisCard() {
  return (
    <div style={{ backgroundColor: UI.surface, border: `1px solid ${UI.border}`, borderLeft: `4px solid ${UI.electric}`, borderRadius: R.card, padding: S[5], marginBottom: S[5] }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginBottom: S[3] }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ color: UI.sky }}>
          <path d="M10 2a6 6 0 0 1 6 6c0 2.5-1.5 4.6-3.6 5.6L12 18H8l-.4-4.4A6 6 0 0 1 10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: UI.text }}>AI analysis</span>
      </div>
      <p style={{ fontFamily: F.body, fontSize: '12px', color: UI.textMuted, marginBottom: S[3], lineHeight: 1.5 }}>
        {AI_ANALYSIS.summary}
      </p>
      <ul style={{ margin: 0, paddingLeft: '18px', fontFamily: F.body, fontSize: '12px', color: UI.text, lineHeight: 1.7 }}>
        {AI_ANALYSIS.points.map((point, i) => (
          <li key={i} style={{ marginBottom: S[2] }}>{point}</li>
        ))}
      </ul>
    </div>
  );
}

/* ─── Tooltip style ───────────────────────────────────────── */
const TIP = {
  contentStyle: {
    backgroundColor: UI.navy2, border: `1px solid ${UI.border}`,
    borderRadius: R.md, fontFamily: F.mono, fontSize: '11px', color: UI.text,
  },
  labelStyle: { color: UI.textMuted, marginBottom: '4px' },
  itemStyle:  { color: UI.text },
};

/* ─── StatCard ────────────────────────────────────────────── */
function StatCard({ label, value, delta, up, posGood }) {
  const good  = posGood ? up : !up;
  const color = good ? UI.sky : C.red;
  return (
    <div style={{ flex: 1, backgroundColor: UI.surface, border: `1px solid ${UI.border}`, borderRadius: R.card, padding: S[4] }}>
      <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: UI.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: S[2] }}>{label}</div>
      <div style={{ fontFamily: F.mono, fontSize: '22px', fontWeight: 700, color: UI.text, lineHeight: 1, marginBottom: S[1] }}>{value}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          {up
            ? <path d="M5 8.5V1.5M2 4.5l3-3 3 3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            : <path d="M5 1.5v7M2 5.5l3 3 3-3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          }
        </svg>
        <span style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color }}>{delta}</span>
        <span style={{ fontFamily: F.body, fontSize: '10px', color: UI.textMuted }}>vs prev</span>
      </div>
    </div>
  );
}

/* ─── CtrChart ────────────────────────────────────────────── */
function CtrChart() {
  return (
    <div style={{ backgroundColor: UI.surface, border: `1px solid ${UI.border}`, borderRadius: R.card, padding: S[6] }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: S[4] }}>
        <div>
          <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: UI.text }}>CTR — 14-Day Trend</div>
          <div style={{ fontFamily: F.body, fontSize: '11px', color: UI.textMuted, marginTop: '2px' }}>Click-through rate across all active ad sets</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: C.red }}/>
          <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.red }}>Anomaly Feb 22</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={CTR_DATA}>
          <CartesianGrid strokeDasharray="3 3" stroke={UI.border} vertical={false}/>
          <XAxis dataKey="day" tick={{ fill: UI.textMuted, fontFamily: F.mono, fontSize: 10 }} axisLine={false} tickLine={false} interval={1}/>
          <YAxis tick={{ fill: UI.textMuted, fontFamily: F.mono, fontSize: 10 }} axisLine={false} tickLine={false} width={36} domain={[1.5, 4.5]} tickFormatter={(v) => `${v}%`}/>
          <Tooltip {...TIP} formatter={(v) => [`${v}%`, 'CTR']}/>
          <ReferenceLine x="Feb 22" stroke={C.red} strokeDasharray="5 3" strokeWidth={1.5} label={{ value: '\u26a0', fill: C.red, fontSize: 13, position: 'insideTopLeft' }}/>
          <Line dataKey="ctr" stroke={UI.sky} strokeWidth={2} dot={(props) => {
            const { cx, cy, payload } = props;
            const isAnomaly = payload.day === 'Feb 22';
            return isAnomaly
              ? <circle key={cx} cx={cx} cy={cy} r={5} fill={C.red} stroke={UI.navy} strokeWidth={2}/>
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
    <div style={{ backgroundColor: UI.surface, border: `1px solid ${UI.border}`, borderRadius: R.card, padding: S[5], display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: UI.text, marginBottom: S[4], flexShrink: 0 }}>Alert History</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[3], overflowY: 'auto', ...scrollbarStyle }}>
        {ALERTS.map((a) => {
          const col = SEV_COLOR[a.sev] ?? UI.textMuted;
          return (
            <div key={a.id} style={{ borderLeft: `2px solid ${col}`, paddingLeft: S[3], paddingBottom: S[2] }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginBottom: '4px' }}>
                <span style={{ fontFamily: F.mono, fontSize: '9px', fontWeight: 700, color: col, backgroundColor: `${col}18`, border: `1px solid ${col}30`, borderRadius: R.pill, padding: '1px 6px' }}>
                  {a.sev}
                </span>
                <span style={{ fontFamily: F.mono, fontSize: '10px', color: UI.textMuted }}>{a.date} · {a.time}</span>
              </div>
              <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: UI.text, marginBottom: '2px' }}>{a.title}</div>
              <div style={{ fontFamily: F.body, fontSize: '11px', color: UI.textMuted, lineHeight: 1.5 }}>{a.desc}</div>
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
    <div style={{ backgroundColor: UI.surface, border: `1px solid ${UI.border}`, borderRadius: R.card, padding: S[6] }}>
      <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: UI.text, marginBottom: '4px' }}>Creative Performance</div>
      <div style={{ fontFamily: F.body, fontSize: '11px', color: UI.textMuted, marginBottom: S[4] }}>Click any column header to sort</div>
      <div style={{ overflowX: 'auto', ...scrollbarStyle }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {CR_COLS.map((k) => (
                <th key={k} onClick={() => handleSort(k)} style={{
                  padding: `${S[2]} ${S[3]}`, textAlign: k === 'name' ? 'left' : 'right',
                  fontFamily: F.mono, fontSize: '10px', fontWeight: 700,
                  color: sortKey === k ? UI.sky : UI.textMuted,
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  borderBottom: `1px solid ${UI.border}`, userSelect: 'none',
                }}>
                  {CR_LABELS[k]}{sortKey === k ? (sortDir === 'asc' ? ' \u2191' : ' \u2193') : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => {
              const ss = STATUS_STYLE[row.status] ?? STATUS_STYLE.Active;
              const tc = TYPE_COLOR[row.type] ?? UI.textMuted;
              return (
                <tr key={row.id} style={{ backgroundColor: i % 2 === 1 ? UI.surface2 : 'transparent' }}>
                  {CR_COLS.map((k) => (
                    <td key={k} style={{
                      padding: `${S[2]} ${S[3]}`,
                      textAlign: k === 'name' ? 'left' : 'right',
                      borderBottom: `1px solid ${UI.border}`,
                      whiteSpace: k === 'name' ? 'normal' : 'nowrap',
                    }}>
                      {k === 'name' && (
                        <span style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: UI.text }}>{row.name}</span>
                      )}
                      {k === 'type' && (
                        <span style={{ fontFamily: F.mono, fontSize: '10px', color: tc, backgroundColor: `${tc}14`, border: `1px solid ${tc}25`, borderRadius: R.pill, padding: '1px 7px' }}>{row.type}</span>
                      )}
                      {k === 'status' && (
                        <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: ss.color, backgroundColor: ss.bg, border: `1px solid ${ss.border}`, borderRadius: R.pill, padding: '1px 7px' }}>{row.status}</span>
                      )}
                      {k !== 'name' && k !== 'type' && k !== 'status' && (
                        <span style={{ fontFamily: F.mono, fontSize: '12px', color: UI.textMuted }}>{fmt(k, row[k])}</span>
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
  const STATUS_BG  = { Healthy: UI.electricTint, Warning: C.amberDim, Critical: C.redDim };
  const STATUS_COL = { Healthy: UI.sky, Warning: C.amber, Critical: C.red };
  return (
    <div style={{ backgroundColor: UI.surface, border: `1px solid ${seg.status === 'Critical' ? 'rgba(255,110,122,0.3)' : UI.border}`, borderRadius: R.card, padding: S[4], display: 'flex', flexDirection: 'column', gap: S[3] }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: S[2] }}>
        <span style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 700, color: UI.text, lineHeight: 1.4 }}>{seg.segment}</span>
        <span style={{ fontFamily: F.mono, fontSize: '9px', fontWeight: 700, color: STATUS_COL[seg.status], backgroundColor: STATUS_BG[seg.status], borderRadius: R.pill, padding: '2px 7px', whiteSpace: 'nowrap', flexShrink: 0 }}>
          {seg.status}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[2] }}>
        <div>
          <div style={{ fontFamily: F.mono, fontSize: '9px', color: UI.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>Reach</div>
          <div style={{ fontFamily: F.mono, fontSize: '16px', fontWeight: 700, color: UI.text }}>{seg.reach.toLocaleString()}</div>
        </div>
        <div>
          <div style={{ fontFamily: F.mono, fontSize: '9px', color: UI.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>Frequency</div>
          <div style={{ fontFamily: F.mono, fontSize: '16px', fontWeight: 700, color: UI.text }}>{seg.frequency.toFixed(2)}</div>
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span style={{ fontFamily: F.mono, fontSize: '9px', color: UI.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Burnout risk</span>
          <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: bc }}>{Math.round(seg.burnout * 100)}%</span>
        </div>
        <div style={{ height: '5px', backgroundColor: UI.surface2, borderRadius: R.pill, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${seg.burnout * 100}%`, backgroundColor: bc, borderRadius: R.pill, transition: 'width 0.4s ease' }}/>
        </div>
        <div style={{ fontFamily: F.body, fontSize: '10px', color: UI.textMuted, marginTop: '4px' }}>
          {seg.frequency.toFixed(2)} / {seg.maxFreq} threshold
        </div>
      </div>
    </div>
  );
}

/* ─── Previous campaigns & analytics from Meta Business Suite ─ */
function MetaCampaignsSection({ campaign, stats }) {
  const metaConnected = useStore((s) => s.connections?.meta);

  if (!metaConnected) {
    return (
      <div style={{ backgroundColor: UI.navy2, border: `1px dashed ${UI.border}`, borderRadius: R.card, padding: S[8], textAlign: 'center', marginBottom: S[5] }}>
        <p style={{ fontFamily: F.body, fontSize: '14px', color: UI.textMuted, margin: 0 }}>
          Connect your Meta Business account above to see previous campaigns and their analytics from Meta Business Suite. Freya will use this data to learn and give you a detailed report.
        </p>
      </div>
    );
  }

  return (
    <>
      <div style={{ marginBottom: S[4] }}>
        <h2 style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: UI.text, margin: '0 0 4px' }}>
          Previous campaigns & analytics from Meta Business Suite
        </h2>
        <p style={{ fontFamily: F.body, fontSize: '12px', color: UI.textMuted, margin: 0 }}>
          Campaign performance Freya uses to learn and generate detailed reports
        </p>
      </div>

      {/* 5-stat row */}
      <div style={{ display: 'flex', gap: S[3], marginBottom: S[5] }}>
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <AIAnalysisCard />

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
        <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: UI.text, marginBottom: '4px' }}>Audience Breakdown</div>
        <div style={{ fontFamily: F.body, fontSize: '11px', color: UI.textMuted, marginBottom: S[4] }}>Frequency and burnout risk across active audience segments</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: S[4] }}>
          {AUDIENCES.map((a) => <AudienceCard key={a.segment} seg={a}/>)}
        </div>
      </div>
    </>
  );
}

/* ─── MetaMonitor (main) ──────────────────────────────────── */
export default function MetaMonitor() {
  const [campaign, setCampaign] = useState('all');
  const stats = STATS[campaign] ?? STATS.all;

  return (
    <div style={{ height: '100vh', overflowY: 'auto', backgroundColor: UI.navy, ...scrollbarStyle }}>
      <div style={{ padding: `${S[6]} ${S[8]} ${S[10]}` }}>

        {/* Header + campaign filter */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[6], paddingBottom: S[4], borderBottom: `3px solid ${UI.electric}` }}>
          <div>
            <h1 style={{ fontFamily: F.display, fontSize: '22px', fontWeight: 800, color: UI.text, margin: 0, letterSpacing: '-0.03em' }}>Meta Ads Monitor</h1>
            <p style={{ fontFamily: F.body, fontSize: '12px', color: UI.textMuted, margin: `${S[1]} 0 0` }}>Paid media performance — 14-day rolling window</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
            <span style={{ fontFamily: F.mono, fontSize: '11px', color: UI.textMuted }}>Campaign</span>
            <div style={{ position: 'relative' }}>
              <select
                value={campaign}
                onChange={(e) => setCampaign(e.target.value)}
                style={{
                  appearance: 'none',
                  backgroundColor: UI.navy2, color: UI.text,
                  border: `1px solid ${UI.border}`, borderRadius: R.button,
                  padding: `${S[2]} ${S[6]} ${S[2]} ${S[3]}`,
                  fontFamily: F.body, fontSize: '13px', fontWeight: 600,
                  cursor: 'pointer', outline: 'none',
                }}
              >
                {CAMPAIGNS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <path d="M2 3.5l3 3 3-3" stroke={UI.textMuted} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        <MetaConnectionCard />
        <PaidAdsAriaCard />

        {/* Previous campaigns & analytics from Meta Business Suite (when connected) */}
        <MetaCampaignsSection campaign={campaign} stats={stats} />

      </div>
    </div>
  );
}
