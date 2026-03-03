import { useNavigate } from 'react-router-dom';
import { C, F, R, S, btn } from '../../tokens';
import useStore from '../../store/useStore';

// Mock for startup dashboard
const MOCK_CAMPAIGN = {
  name: 'Product launch — Q1',
  goal: 50,
  current: 23,
  status: 'On track',
  channels: 'Email + LinkedIn',
  nextMilestone: '30 demos by Mar 15',
};

const MOCK_NEEDS_INPUT = [
  { id: 1, type: 'Content', title: 'LinkedIn ad copy — 3 variants', age: '1 day ago' },
  { id: 2, type: 'Approval', title: 'Email sequence 2 — subject line', age: '2 hours ago' },
];

const MOCK_AI_STATUS = [
  { agent: 'Planner', status: 'Re-evaluating audience — done in ~5m', color: C.primary },
  { agent: 'Sender', status: 'Sent 12 emails today; 4 opens', color: C.secondary },
  { agent: 'Tracker', status: '3 new replies in Company Social Inbox', color: C.amber },
];

const MOCK_ESCALATIONS = [
  { id: 1, title: 'Budget alert: LinkedIn spend above target', severity: 'high' },
];

export default function StartupDashboard({ embedded }) {
  const navigate = useNavigate();
  const startupFlow = useStore((s) => s.startupFlow);
  const toggleAria = useStore((s) => s.toggleAria);
  const setSegment = useStore((s) => s.setSegment);

  const companyName = startupFlow.companyName || 'Your company';

  return (
    <div style={{ padding: S[6], maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ marginBottom: S[6] }}>
        <h1 style={{ fontFamily: F.display, fontSize: '22px', fontWeight: 800, color: C.textPrimary, margin: 0 }}>
          {companyName} · Startup dashboard
        </h1>
        <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: `${S[1]} 0 0` }}>
          You guide. AI executes. Here’s what needs your attention and what AI is doing.
        </p>
      </div>

      {/* Your campaign */}
      <section style={{ marginBottom: S[6] }}>
        <h2 style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: S[3] }}>
          Your campaign
        </h2>
        <div
          style={{
            backgroundColor: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: R.card,
            padding: S[5],
            display: 'grid',
            gridTemplateColumns: '1fr auto auto',
            gap: S[4],
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary }}>{MOCK_CAMPAIGN.name}</div>
            <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, marginTop: '4px' }}>{MOCK_CAMPAIGN.channels}</div>
            <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, marginTop: '4px' }}>Next: {MOCK_CAMPAIGN.nextMilestone}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: F.mono, fontSize: '24px', fontWeight: 800, color: C.primary }}>{MOCK_CAMPAIGN.current}</div>
            <div style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>of {MOCK_CAMPAIGN.goal} goal</div>
          </div>
          <div>
            <span
              style={{
                padding: '4px 10px',
                borderRadius: R.pill,
                fontSize: '12px',
                fontWeight: 600,
                fontFamily: F.body,
                backgroundColor: C.primaryGlow,
                color: C.primary,
                border: `1px solid ${C.primary}40`,
              }}
            >
              {MOCK_CAMPAIGN.status}
            </span>
          </div>
        </div>
        <button type="button" onClick={() => navigate('/campaigns')} style={{ ...btn.ghost, fontSize: '12px', marginTop: S[2] }}>
          Open full campaign →
        </button>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: S[6] }}>
        {/* Needs your input */}
        <section>
          <h2 style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: S[3] }}>
            Needs your input
          </h2>
          <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card, overflow: 'hidden' }}>
            {MOCK_NEEDS_INPUT.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: S[3],
                  borderBottom: `1px solid ${C.border}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary }}>{item.title}</div>
                  <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>{item.type} · {item.age}</div>
                </div>
                <button type="button" onClick={() => {}} style={{ ...btn.primary, fontSize: '11px', padding: '4px 10px' }}>
                  Review
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* AI status */}
        <section>
          <h2 style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: S[3] }}>
            AI status
          </h2>
          <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card, padding: S[3] }}>
            {MOCK_AI_STATUS.map((item) => (
              <div key={item.agent} style={{ padding: `${S[2]} 0`, borderBottom: `1px solid ${C.border}` }}>
                <div style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: item.color }}>{item.agent}</div>
                <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>{item.status}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Escalations */}
        <section>
          <h2 style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: S[3] }}>
            Escalations
          </h2>
          <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card, padding: S[3] }}>
            {MOCK_ESCALATIONS.length === 0 ? (
              <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textMuted }}>None right now.</div>
            ) : (
              MOCK_ESCALATIONS.map((e) => (
                <div key={e.id} style={{ padding: `${S[2]} 0`, borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary }}>{e.title}</div>
                  <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.amber }}>{e.severity}</span>
                  <button type="button" onClick={() => navigate('/escalations')} style={{ ...btn.ghost, fontSize: '11px', display: 'block', marginTop: S[1] }}>
                    Handle →
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Chat with ARIA */}
      <section style={{ marginTop: S[6] }}>
        <div
          style={{
            backgroundColor: C.surface2,
            border: `1px solid ${C.border}`,
            borderRadius: R.card,
            padding: S[5],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: S[4],
          }}
        >
          <div>
            <h2 style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary, margin: '0 0 4px 0' }}>Guide the AI</h2>
            <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: 0 }}>
              Chat with ARIA to set strategy, change direction, or ask for a replan. Your team can do the same from the main app.
            </p>
          </div>
          <button type="button" onClick={() => { toggleAria(); navigate('/'); }} style={{ ...btn.primary }}>
            Open ARIA
          </button>
        </div>
      </section>

      <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, marginTop: S[6] }}>
        {embedded ? (
          <button
            type="button"
            onClick={() => setSegment(null)}
            style={{ background: 'none', border: 'none', color: C.primary, cursor: 'pointer', textDecoration: 'underline' }}
          >
            Use full NEXARA app →
          </button>
        ) : (
          <button
            type="button"
            onClick={() => { setSegment('startup'); navigate('/'); }}
            style={{ background: 'none', border: 'none', color: C.primary, cursor: 'pointer', textDecoration: 'underline' }}
          >
            Use full NEXARA app for startups →
          </button>
        )}
      </p>
    </div>
  );
}
