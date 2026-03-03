import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import useToast from '../../hooks/useToast';
import { C, F, R, S, btn, cardStyle } from '../../tokens';

export default function DashboardClient() {
  const navigate = useNavigate();
  const toast = useToast();
  const currentClient = useStore((s) => s.currentClient);
  const currentCampaign = useStore((s) => s.currentCampaign);

  return (
    <div style={{ padding: S[6], display: 'flex', flexDirection: 'column', gap: S[5], minHeight: '100%' }}>
      <div>
        <h1 style={{ fontFamily: F.display, fontSize: '22px', fontWeight: 800, color: C.textPrimary, margin: 0 }}>{currentClient} — Campaign Results</h1>
        <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>{currentCampaign} · Week 8 of 12</span>
      </div>
      <div>
        <h2 style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', margin: `0 0 ${S[3]}` }}>Your Results This Month</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: S[4] }}>
          {[
            { label: 'Leads Generated', value: '312', goal: '78% of monthly goal' },
            { label: 'Demo Meetings Booked', value: '47', goal: '94% of monthly goal' },
            { label: 'Cost Per Lead', value: '$14.24', goal: '18% better than target' },
            { label: 'Invested This Month', value: '$2,140', goal: 'Remaining budget: $1,860' },
          ].map((m, i) => (
            <div key={i} style={{ ...cardStyle, padding: S[5], textAlign: 'center' }}>
              <div style={{ fontFamily: F.mono, fontSize: '24px', fontWeight: 700, color: C.textPrimary }}>{m.value}</div>
              <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>{m.label}</div>
              <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>{m.goal}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ ...cardStyle, padding: S[5], border: `1px solid ${C.border}` }}>
        <h2 style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', margin: `0 0 ${S[3]}` }}>What's Happening</h2>
        <p style={{ fontFamily: F.body, fontSize: '14px', color: C.textPrimary, lineHeight: 1.5, margin: 0 }}>
          Your LinkedIn outreach is getting a 31% reply rate — 3x the industry average. We're pacing to hit your demo goal by Feb 28, 6 days ahead of schedule.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[5] }}>
        <div>
          <h2 style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', margin: `0 0 ${S[3]}` }}>Content For Your Review</h2>
          <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>2 items need your approval</div>
          <button style={{ ...btn.primary, fontSize: '12px', marginTop: S[3] }} onClick={() => toast.info('Review')}>Email step 3 — review →</button>
          <button style={{ ...btn.secondary, fontSize: '12px', marginTop: S[2], marginLeft: S[2] }} onClick={() => toast.info('Review')}>LinkedIn ad creative →</button>
        </div>
        <div>
          <h2 style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', margin: `0 0 ${S[3]}` }}>Recent Wins</h2>
          <div style={{ fontFamily: F.body, fontSize: '12px', color: C.primary }}>"Booked demo with CFO of Apex Garments"</div>
          <div style={{ fontFamily: F.body, fontSize: '12px', color: C.primary }}>"31% reply rate ↑"</div>
        </div>
      </div>
    </div>
  );
}
