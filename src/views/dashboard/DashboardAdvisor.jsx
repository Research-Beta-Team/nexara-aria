import { useNavigate } from 'react-router-dom';
import useToast from '../../hooks/useToast';
import { C, F, R, S, btn, cardStyle } from '../../tokens';

const APPROVAL_QUEUE_MOCK = [
  { id: 'a1', title: 'Q2 ICP Refresh', campaign: 'CFO VN', confidence: 87 },
  { id: 'a2', title: 'New campaign brief', client: 'Apex Corp' },
  { id: 'a3', title: 'Competitive response — CompetitorX move' },
];
const CLIENT_HEALTH_MOCK = [
  { client: 'ACME CORP', icp: 'Strong', positioning: 'Needs update', channelMix: 'Optimal' },
  { client: 'DELTA GARMENTS', icp: 'Needs refinement', positioning: 'Strong', channelMix: 'Optimal' },
];

export default function DashboardAdvisor() {
  const navigate = useNavigate();
  const toast = useToast();

  return (
    <div style={{ padding: S[6], display: 'flex', flexDirection: 'column', gap: S[5], minHeight: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontFamily: F.display, fontSize: '22px', fontWeight: 800, color: C.textPrimary, margin: 0 }}>Dashboard</h1>
          <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>Strategic Advisor · 3 items need your review</span>
        </div>
      </div>
      <div style={{ ...cardStyle, padding: S[5], border: `1px solid ${C.border}` }}>
        <div style={{ fontFamily: F.body, fontSize: '14px', color: C.textPrimary }}>Advisor Brief — 3 items need your strategic review. Assigned clients: Medglobal, Delta Garments, TechVentures BD.</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '40% 1fr', gap: S[5] }}>
        <div>
          <h2 style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', margin: `0 0 ${S[3]}` }}>Approval Queue</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
            {APPROVAL_QUEUE_MOCK.map((item) => (
              <div key={item.id} style={{ ...cardStyle, padding: S[4] }}>
                <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary }}>{item.title}</div>
                <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>{item.campaign || item.client || ''}</div>
                {item.confidence && <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.primary }}>ARIA confidence: {item.confidence}%</span>}
                <div style={{ display: 'flex', gap: S[2], marginTop: S[3] }}>
                  <button style={{ ...btn.primary, fontSize: '12px' }} onClick={() => toast.success('Review')}>Review</button>
                  <button style={{ ...btn.secondary, fontSize: '12px' }} onClick={() => toast.info('Approve')}>Approve</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', margin: `0 0 ${S[3]}` }}>Client Strategy Health</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
            {CLIENT_HEALTH_MOCK.map((c, i) => (
              <div key={i} style={{ ...cardStyle, padding: S[4] }}>
                <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary, marginBottom: S[2] }}>{c.client}</div>
                <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>ICP: {c.icp} · Positioning: {c.positioning} · Channel mix: {c.channelMix}</div>
                <button style={{ ...btn.ghost, fontSize: '12px', marginTop: S[2] }} onClick={() => toast.info('View strategy')}>View strategy →</button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ ...cardStyle, padding: S[4], border: `1px solid ${C.border}` }}>
        <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>Strategy Intel — Market signals relevant to your client strategies. "Textile CFO hiring surge in Vietnam Q1 — opportunity signal."</div>
      </div>
    </div>
  );
}
