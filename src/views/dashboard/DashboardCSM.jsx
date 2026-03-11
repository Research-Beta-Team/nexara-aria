import { useNavigate } from 'react-router-dom';
import useToast from '../../hooks/useToast';
import { C, F, R, S, btn, cardStyle } from '../../tokens';

const CLIENT_PORTFOLIO_MOCK = [
  { name: 'Apex Corp', health: 82, demos: '8/12', status: 'On track', lastTouch: '2 days ago', tip: 'Share win from LinkedIn' },
  { name: 'BGMEA Member Co', health: 61, demos: '3/10', status: 'Behind', lastTouch: '5 days ago', tip: 'Freya has a recovery plan', atRisk: true },
  { name: 'Delta Garments', health: 94, demos: '11/10', status: 'Exceeding', lastTouch: 'Yesterday', tip: 'Great for upsell conversation' },
];
const UPCOMING_CALLS = [
  { client: 'Medglobal', when: 'Tomorrow 2pm' },
  { client: 'BGMEA', when: 'Thu 11am' },
];

export default function DashboardCSM() {
  const navigate = useNavigate();
  const toast = useToast();

  return (
    <div style={{ padding: S[6], display: 'flex', flexDirection: 'column', gap: S[5], minHeight: '100%' }}>
      <div>
        <h1 style={{ fontFamily: F.display, fontSize: '22px', fontWeight: 800, color: C.textPrimary, margin: 0 }}>My Client Portfolio</h1>
        <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>5 active clients · Next call: Medglobal · Tomorrow 2pm</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
        {CLIENT_PORTFOLIO_MOCK.map((c, i) => (
          <div
            key={i}
            style={{
              ...cardStyle,
              padding: S[5],
              border: `1px solid ${c.atRisk ? C.amber : C.border}`,
              borderLeft: c.atRisk ? `4px solid ${C.amber}` : undefined,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary }}>{c.name}</span>
                <span style={{ marginLeft: S[3], fontFamily: F.mono, fontSize: '12px', color: C.textSecondary }}>Health: {c.health}/100</span>
              </div>
              <button style={{ ...btn.secondary, fontSize: '12px' }} onClick={() => toast.info('Call prep')}>Call prep →</button>
            </div>
            <div style={{ display: 'flex', gap: S[5], marginTop: S[2], fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>
              <span>Demos this month: {c.demos}</span>
              <span>Status: {c.status}</span>
              <span>Last touchpoint: {c.lastTouch}</span>
            </div>
            <div style={{ fontFamily: F.body, fontSize: '12px', color: C.primary, marginTop: S[2] }}>"{c.tip}"</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[5] }}>
        <div>
          <h2 style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', margin: `0 0 ${S[3]}` }}>Upcoming Calls</h2>
          {UPCOMING_CALLS.map((call, i) => (
            <div key={i} style={{ ...cardStyle, padding: S[3], marginBottom: S[2] }}>
              {call.when}: {call.client}
            </div>
          ))}
          <button style={{ ...btn.secondary, fontSize: '12px', marginTop: S[2] }} onClick={() => toast.info('Prepare all briefs')}>Prepare all briefs →</button>
        </div>
        <div>
          <h2 style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', margin: `0 0 ${S[3]}` }}>Pending Client Approvals</h2>
          <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>Medglobal: Email seq step 3 · Delta: LinkedIn ad creative</div>
          <button style={{ ...btn.primary, fontSize: '12px', marginTop: S[3] }} onClick={() => toast.info('Review + approve')}>Review + approve →</button>
        </div>
      </div>
    </div>
  );
}
