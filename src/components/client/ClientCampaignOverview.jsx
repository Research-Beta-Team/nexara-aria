import { CP } from '../../data/clientPortal';

const fontBody = "'DM Sans', sans-serif";

export default function ClientCampaignOverview({ overview }) {
  if (!overview) return null;
  const { name, goal, current, deadline, weeksRemaining, status, demosThisWeek, cpl, cplTarget, ctr, ctrTarget } = overview;
  const pct = Math.min(100, Math.round((current / goal) * 100));

  return (
    <section
      style={{
        backgroundColor: CP.surface,
        border: `1px solid ${CP.border}`,
        borderRadius: 12,
        padding: 24,
        marginBottom: 24,
      }}
    >
      <h1 style={{ fontFamily: fontBody, fontSize: 24, fontWeight: 700, color: CP.text, margin: '0 0 16px' }}>
        {name}
      </h1>
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            height: 12,
            borderRadius: 999,
            backgroundColor: CP.bg,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: `${pct}%`,
              height: '100%',
              backgroundColor: CP.primary,
              borderRadius: 999,
              transition: 'width 0.3s ease',
            }}
          />
          {/* Milestone markers at 25%, 50%, 75% */}
          {[25, 50, 75].map((m) => (
            <div
              key={m}
              style={{
                position: 'absolute',
                left: `${m}%`,
                top: -4,
                width: 4,
                height: 20,
                backgroundColor: current / goal >= m / 100 ? CP.primary : CP.border,
                borderRadius: 2,
                transform: 'translateX(-50%)',
              }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: fontBody, fontSize: 14, color: CP.text }}>
            <strong>{current}</strong> / <strong>{goal}</strong> demos
          </span>
          <span style={{ fontFamily: fontBody, fontSize: 14, color: CP.textSecondary }}>
            {weeksRemaining} weeks remaining
          </span>
          <span style={{ fontFamily: fontBody, fontSize: 14, color: CP.primary, fontWeight: 600 }}>
            {status}
          </span>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <div style={{ padding: 16, backgroundColor: CP.bg, borderRadius: 8, border: `1px solid ${CP.border}` }}>
          <div style={{ fontFamily: fontBody, fontSize: 11, color: CP.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
            Demos this week
          </div>
          <div style={{ fontFamily: fontBody, fontSize: 22, fontWeight: 700, color: CP.text }}>{demosThisWeek}</div>
        </div>
        <div style={{ padding: 16, backgroundColor: CP.bg, borderRadius: 8, border: `1px solid ${CP.border}` }}>
          <div style={{ fontFamily: fontBody, fontSize: 11, color: CP.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
            CPL
          </div>
          <div style={{ fontFamily: fontBody, fontSize: 22, fontWeight: 700, color: CP.text }}>
            {cpl} <span style={{ fontSize: 14, fontWeight: 400, color: CP.textSecondary }}>vs {cplTarget} target</span>
          </div>
        </div>
        <div style={{ padding: 16, backgroundColor: CP.bg, borderRadius: 8, border: `1px solid ${CP.border}` }}>
          <div style={{ fontFamily: fontBody, fontSize: 11, color: CP.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
            CTR
          </div>
          <div style={{ fontFamily: fontBody, fontSize: 22, fontWeight: 700, color: CP.text }}>
            {ctr} <span style={{ fontSize: 14, fontWeight: 400, color: CP.textSecondary }}>vs {ctrTarget} target</span>
          </div>
        </div>
      </div>
    </section>
  );
}
