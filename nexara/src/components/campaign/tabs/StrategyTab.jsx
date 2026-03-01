import useToast from '../../../hooks/useToast';
import { C, F, R, S, T, btn, flex } from '../../../tokens';
import { strategyData } from '../../../data/campaigns';

const { brief, icp, positioning, competitorIntel, roadmap } = strategyData;

const THREAT_BADGE = {
  high:   { color: C.red,    bg: 'rgba(255,110,122,0.12)',  border: 'rgba(255,110,122,0.2)'  },
  medium: { color: C.amber,  bg: 'rgba(245,200,66,0.12)',   border: 'rgba(245,200,66,0.2)'   },
  low:    { color: C.primary, bg: 'rgba(61,220,132,0.12)',  border: 'rgba(61,220,132,0.2)'   },
};

function SectionCard({ title, children, action }) {
  return (
    <div style={{
      backgroundColor: C.surface2,
      border: `1px solid ${C.border}`,
      borderRadius: R.card,
      overflow: 'hidden',
    }}>
      <div style={{
        ...flex.rowBetween,
        padding: `${S[3]} ${S[4]}`,
        borderBottom: `1px solid ${C.border}`,
      }}>
        <span style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>{title}</span>
        {action}
      </div>
      <div style={{ padding: S[4] }}>{children}</div>
    </div>
  );
}

export default function StrategyTab() {
  const toast = useToast();

  const editBtn = (label = 'Edit') => (
    <button style={{ ...btn.ghost, fontSize: '12px', padding: `2px ${S[2]}` }} onClick={() => toast.info(`${label} coming soon`)}>
      {label}
    </button>
  );

  const row = (label, value) => (
    <div style={{ display: 'flex', gap: S[3], padding: `${S[2]} 0`, borderBottom: `1px solid ${C.border}` }}>
      <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, width: '130px', flexShrink: 0 }}>{label}</span>
      <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary, flex: 1 }}>{value}</span>
    </div>
  );

  return (
    <div style={{ padding: S[5], display: 'flex', flexDirection: 'column', gap: S[5] }}>

      {/* Brief + ICP side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[4] }}>
        {/* Strategy Brief */}
        <SectionCard title="Strategy Brief" action={editBtn('Edit')}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {row('Objective',      brief.objective)}
            {row('Target Revenue', brief.targetRevenue)}
            {row('Timeline',       brief.timeline)}
            {row('Budget',         brief.budget)}
            {row('Key Message',    brief.keyMessage)}
          </div>
        </SectionCard>

        {/* ICP */}
        <SectionCard title="Ideal Customer Profile" action={editBtn('Regenerate')}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {row('Title',     icp.title)}
            {row('Segment',   icp.industry)}
            {row('Geography', icp.geography)}
            <div style={{ padding: `${S[2]} 0`, borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, display: 'block', marginBottom: S[1] }}>Pain Points</span>
              {icp.painPoints.map((p) => (
                <div key={p} style={{ display: 'flex', gap: S[2], alignItems: 'flex-start', marginBottom: '3px' }}>
                  <span style={{ color: C.primary, marginTop: '3px', flexShrink: 0 }}>›</span>
                  <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>{p}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: `${S[2]} 0` }}>
              <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, display: 'block', marginBottom: S[1] }}>Buying Triggers</span>
              <div style={{ display: 'flex', gap: S[1], flexWrap: 'wrap' }}>
                {icp.triggers.map((t) => (
                  <span key={t} style={{
                    fontFamily: F.body, fontSize: '11px', color: C.secondary,
                    backgroundColor: 'rgba(94,234,212,0.08)', border: `1px solid rgba(94,234,212,0.2)`,
                    borderRadius: R.pill, padding: `2px ${S[2]}`,
                  }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Positioning */}
      <SectionCard title="Positioning vs. Competitors" action={editBtn('Regenerate')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
          {positioning.map((p) => (
            <div key={p.axis} style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
              <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, width: '130px', flexShrink: 0 }}>{p.axis}</span>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {/* Us */}
                <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                  <div style={{ width: `${p.us * 10}%`, height: '8px', backgroundColor: C.primary, borderRadius: R.pill, transition: 'width 0.5s ease', boxShadow: `0 0 6px ${C.primary}40` }}/>
                  <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.primary }}>{p.us}/10</span>
                </div>
                {/* Competitor */}
                <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                  <div style={{ width: `${p.competitor * 10}%`, height: '8px', backgroundColor: C.surface3, border: `1px solid ${C.border}`, borderRadius: R.pill }}/>
                  <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>{p.competitor}/10</span>
                </div>
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: S[4], marginTop: S[2] }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: S[1] }}>
              <div style={{ width: '12px', height: '4px', backgroundColor: C.primary, borderRadius: R.pill }}/>
              <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>Us</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: S[1] }}>
              <div style={{ width: '12px', height: '4px', backgroundColor: C.surface3, border: `1px solid ${C.border}`, borderRadius: R.pill }}/>
              <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>Competitor avg</span>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Competitor Intel + Roadmap side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[4] }}>
        <SectionCard title="Competitive Intel" action={editBtn('Update')}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
            {competitorIntel.map((ci) => {
              const th = THREAT_BADGE[ci.threat] ?? THREAT_BADGE.low;
              return (
                <div key={ci.name} style={{ padding: S[3], backgroundColor: C.surface3, borderRadius: R.md, display: 'flex', flexDirection: 'column', gap: S[1] }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>{ci.name}</span>
                    <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: th.color, backgroundColor: th.bg, border: `1px solid ${th.border}`, borderRadius: R.pill, padding: `1px ${S[2]}` }}>
                      {ci.threat} threat
                    </span>
                  </div>
                  <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>Gap: {ci.gap}</span>
                  <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>{ci.note}</span>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="90-Day Roadmap" action={editBtn('Edit')}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
            {roadmap.map((phase, i) => (
              <div key={phase.phase} style={{ display: 'flex', gap: S[3], alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    backgroundColor: phase.done ? C.primaryGlow : C.surface3,
                    border: `2px solid ${phase.done ? C.primary : C.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {phase.done
                      ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke={C.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      : <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>{i + 1}</span>
                    }
                  </div>
                  {i < roadmap.length - 1 && <div style={{ width: '2px', height: '28px', backgroundColor: C.border }}/>}
                </div>
                <div>
                  <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: phase.done ? C.textPrimary : C.textSecondary }}>{phase.label}</span>
                  <div style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted, marginTop: '2px' }}>{phase.weeks}</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
