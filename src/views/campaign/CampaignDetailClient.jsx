import { useNavigate } from 'react-router-dom';
import useToast from '../../hooks/useToast';
import { C, F, R, S, btn, cardStyle } from '../../tokens';
import { IconMail, IconImage, IconArrowLeft, IconArrowRight, IconCheck } from '../../components/ui/Icons';

export default function CampaignDetailClient({ campaign, detail }) {
  const navigate = useNavigate();
  const toast = useToast();
  const { name, client, goal, current, health } = campaign || {};
  const pct = goal ? Math.min(100, Math.round((current / goal) * 100)) : 0;

  return (
    <div style={{ padding: S[6], display: 'flex', flexDirection: 'column', gap: S[5] }}>
      <div>
        <button style={{ ...btn.ghost, fontSize: '12px', color: C.textMuted, marginBottom: S[2], display: 'inline-flex', alignItems: 'center', gap: S[1] }} onClick={() => navigate('/campaigns')}>
          <IconArrowLeft width={14} height={14} color={C.textMuted} /> Campaigns
        </button>
        <h1 style={{ fontFamily: F.display, fontSize: '22px', fontWeight: 800, color: C.textPrimary, margin: 0 }}>Your Campaign — {name}</h1>
        <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>Week 8 of 12 · Managed by your GTM Team</span>
      </div>
      <div>
        <h2 style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', margin: `0 0 ${S[3]}` }}>Results at a Glance</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: S[4] }}>
          {[
            { label: 'Leads', value: current ?? 312 },
            { label: 'Demos', value: 47 },
            { label: 'Cost per lead', value: '$14.24' },
            { label: 'Status', value: health === 'on_track' ? 'On track' : health, showCheck: health === 'on_track' },
          ].map((m, i) => (
            <div key={i} style={{ ...cardStyle, padding: S[5], textAlign: 'center' }}>
              <div style={{ fontFamily: F.mono, fontSize: '24px', fontWeight: 700, color: C.textPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: S[1] }}>
                {m.showCheck && <IconCheck color={C.green} width={18} height={18} />}
                {m.value}
              </div>
              <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[5] }}>
        <div style={{ ...cardStyle, padding: S[5] }}>
          <h2 style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', margin: `0 0 ${S[3]}` }}>What's Happening Now</h2>
          <p style={{ fontFamily: F.body, fontSize: '14px', color: C.textPrimary, lineHeight: 1.6, margin: 0 }}>
            This week your team ran outreach to 47 textile CFOs in Vietnam. 31% replied — that's excellent. 3 demos are now booked.
          </p>
        </div>
        <div style={{ ...cardStyle, padding: S[5] }}>
          <h2 style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', margin: `0 0 ${S[3]}` }}>Your Approvals Needed</h2>
          <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>2 items waiting for you:</div>
          <div style={{ marginTop: S[3] }}>
            <div style={{ ...cardStyle, padding: S[3], marginBottom: S[2], display: 'flex', alignItems: 'center', gap: S[2] }}>
              <IconMail color={C.textSecondary} width={18} height={18} />
              Email message for CFOs — <button style={{ ...btn.ghost, fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: S[1] }} onClick={() => toast.info('Preview')}>Preview <IconArrowRight width={12} height={12} /> Approve / Request Changes</button>
            </div>
            <div style={{ ...cardStyle, padding: S[3], display: 'flex', alignItems: 'center', gap: S[2] }}>
              <IconImage color={C.textSecondary} width={18} height={18} />
              LinkedIn ad image — <button style={{ ...btn.ghost, fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: S[1] }} onClick={() => toast.info('Preview')}>Preview <IconArrowRight width={12} height={12} /> Approve / Request Changes</button>
            </div>
          </div>
        </div>
      </div>
      <div style={{ ...cardStyle, padding: S[5], border: `1px solid ${C.border}` }}>
        <h2 style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', margin: `0 0 ${S[3]}` }}>Coming Up Next Week</h2>
        <p style={{ fontFamily: F.body, fontSize: '14px', color: C.textPrimary, margin: 0 }}>
          We'll be sending the next email sequence step to 47 prospects and launching the Facebook retargeting campaign.
        </p>
        <button style={{ ...btn.ghost, fontSize: '12px', marginTop: S[3], display: 'inline-flex', alignItems: 'center', gap: S[1] }} onClick={() => toast.info('Message your team')}>Any questions? Message your team <IconArrowRight width={12} height={12} /></button>
      </div>
    </div>
  );
}
