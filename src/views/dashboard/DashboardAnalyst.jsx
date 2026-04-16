import { useNavigate } from 'react-router-dom';
import useToast from '../../hooks/useToast';
import { C, F, R, S, btn, cardStyle } from '../../tokens';
import AgentFeed from '../../components/agents/AgentFeed';

const METRICS_MOCK = [
  { label: 'Leads Generated', value: '312', delta: '+18%', vs: '264 last week' },
  { label: 'Demos Booked', value: '47', delta: '+12%', vs: '42 last week' },
  { label: 'Avg CPL', value: '$14.24', delta: '-8%', vs: '$15.48 last week (good)' },
  { label: 'Email Reply Rate', value: '29.7%', delta: '+4pp', vs: '25.8% last week' },
  { label: 'LinkedIn Reply', value: '31.0%', delta: '-2pp', vs: '33.1% last week' },
];

export default function DashboardAnalyst() {
  const navigate = useNavigate();
  const toast = useToast();

  return (
    <div style={{ padding: S[6], display: 'flex', flexDirection: 'column', gap: S[5], minHeight: '100%' }}>
      <div>
        <h1 style={{ fontFamily: F.display, fontSize: '22px', fontWeight: 800, color: C.textPrimary, margin: 0 }}>Performance Intelligence</h1>
        <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>Week of Feb 17–24, 2026</span>
      </div>
      <div>
        <h2 style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', margin: `0 0 ${S[3]}` }}>Key Metrics vs Last Week</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: S[4] }}>
          {METRICS_MOCK.map((m, i) => (
            <div key={i} style={{ ...cardStyle, padding: S[4] }}>
              <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>{m.label}</div>
              <div style={{ fontFamily: F.mono, fontSize: '22px', fontWeight: 700, color: C.textPrimary }}>{m.value}</div>
              <div style={{ fontFamily: F.mono, fontSize: '12px', color: m.delta.startsWith('+') ? C.primary : C.textSecondary }}>{m.delta} vs {m.vs}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[5] }}>
        <div style={{ ...cardStyle, padding: S[4] }}>
          <h2 style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', margin: `0 0 ${S[3]}` }}>Trend Charts</h2>
          <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>Line: CPL over time · Bar: Leads by channel · Area: Demo booking rate (Recharts 7-day view)</div>
          <button style={{ ...btn.ghost, fontSize: '12px', marginTop: S[3] }} onClick={() => navigate('/analytics')}>View Analytics →</button>
        </div>
        <div style={{ ...cardStyle, padding: S[4], border: `1px solid ${C.border}` }}>
          <h2 style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', margin: `0 0 ${S[3]}` }}>Freya Insight</h2>
          <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>"LinkedIn reply rate dipped this week despite consistent volume. Likely cause: subject line fatigue on Step 2. Recommend A/B test."</div>
          <button style={{ ...btn.secondary, fontSize: '12px', marginTop: S[3] }} onClick={() => toast.info('Generate hypothesis')}>Generate A/B hypothesis →</button>
        </div>
      </div>
      <div style={{ display: 'flex', gap: S[3] }}>
        <button style={{ ...btn.primary }} onClick={() => toast.success('Generating report')}>Generate weekly report</button>
        <button style={{ ...btn.secondary }} onClick={() => toast.info('Export PDF')}>Export to PDF</button>
        <button style={{ ...btn.secondary }} onClick={() => toast.info('Share')}>Share with team</button>
      </div>

      {/* Agent Activity Feed (Analyst-relevant) */}
      <div>
        <h2 style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', margin: `0 0 ${S[3]}` }}>Agent Activity</h2>
        <AgentFeed limit={6} />
      </div>
    </div>
  );
}
