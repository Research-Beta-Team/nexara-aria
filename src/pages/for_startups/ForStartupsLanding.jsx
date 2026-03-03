import { useNavigate } from 'react-router-dom';
import { C, F, R, S, btn } from '../../tokens';

export default function ForStartupsLanding() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: `${S[12]} ${S[6]}`, maxWidth: 900, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: S[10] }}>
        <h1 style={{ fontFamily: F.display, fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 800, color: C.textPrimary, margin: 0, letterSpacing: '-0.03em', lineHeight: 1.2 }}>
          Run your product GTM with AI.
          <br />
          <span style={{ color: C.primary }}>You guide. We execute.</span>
        </h1>
        <p style={{ fontFamily: F.body, fontSize: '16px', color: C.textSecondary, marginTop: S[4], lineHeight: 1.6, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
          Add your team to monitor campaigns, set direction, and approve content. AI handles planning, replanning, sending, and tracking. You stay in control.
        </p>
        <div style={{ display: 'flex', gap: S[4], justifyContent: 'center', flexWrap: 'wrap', marginTop: S[6] }}>
          <button type="button" onClick={() => navigate('/for_startups/onboarding')} style={{ ...btn.primary, padding: `${S[3]} ${S[6]}`, fontSize: '15px' }}>
            Get started
          </button>
          <button type="button" onClick={() => navigate('/for_startups/dashboard')} style={{ ...btn.secondary, padding: `${S[3]} ${S[6]}`, fontSize: '15px' }}>
            See dashboard
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: S[6], marginTop: S[10] }}>
        {[
          { title: 'You guide', body: 'Set strategy, approve content, handle escalations. Your team can upload content or generate with AI.' },
          { title: 'AI executes', body: 'Planning, re-evaluation, replanning, sending across email and social. AI keeps you updated on progress.' },
          { title: 'Adapts to you', body: 'Solo founder or 2–5 person team. Different channels and content preferences per campaign.' },
        ].map((card) => (
          <div
            key={card.title}
            style={{
              backgroundColor: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: R.card,
              padding: S[5],
            }}
          >
            <h3 style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.primary, margin: '0 0 8px 0' }}>{card.title}</h3>
            <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: 0, lineHeight: 1.5 }}>{card.body}</p>
          </div>
        ))}
      </div>

      <p style={{ textAlign: 'center', fontFamily: F.body, fontSize: '12px', color: C.textMuted, marginTop: S[10] }}>
        NEXARA · GTM AI OS · For Startups
      </p>
    </div>
  );
}
