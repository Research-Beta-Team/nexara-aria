import { C, F, R, S, T } from '../../tokens';

const CHANNELS = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    color: '#0A66C2',
    desc: 'Best for B2B targeting by title, company, and seniority.',
    ariaScore: 95,
    bestFor: 'Quality leads',
    avgCPL: '$180–240',
  },
  {
    id: 'meta',
    name: 'Meta',
    color: '#1877F2',
    desc: 'Broad reach with precise retargeting and lookalike audiences.',
    ariaScore: 82,
    bestFor: 'Volume + retargeting',
    avgCPL: '$90–150',
  },
  {
    id: 'google',
    name: 'Google Ads',
    color: '#4285F4',
    desc: 'Intent-driven. Captures demand already searching for your solution.',
    ariaScore: 74,
    bestFor: 'High-intent search',
    avgCPL: '$120–200',
  },
  {
    id: 'email',
    name: 'Email Outreach',
    color: '#3DDC84',
    desc: 'AI-powered cold outreach sequences via SDR agents.',
    ariaScore: 88,
    bestFor: 'Personalized 1:1 outreach',
    avgCPL: '$40–80',
  },
  {
    id: 'content',
    name: 'Content / SEO',
    color: '#F5C842',
    desc: 'Long-form content, blog posts, and organic search capture.',
    ariaScore: 60,
    bestFor: 'Long-term pipeline',
    avgCPL: '$20–60',
  },
  {
    id: 'display',
    name: 'Display / Programmatic',
    color: '#5EEAD4',
    desc: 'Brand awareness across publisher networks.',
    ariaScore: 55,
    bestFor: 'Awareness at scale',
    avgCPL: '$60–110',
  },
];

function ScoreBar({ score, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
      <div style={{ flex: 1, height: '4px', backgroundColor: C.surface3, borderRadius: R.pill, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${score}%`, backgroundColor: color, borderRadius: R.pill }}/>
      </div>
      <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color, width: '28px' }}>{score}</span>
    </div>
  );
}

export default function WizardStep3({ data, onChange, errors }) {
  const selected = data.channels ?? [];
  const toggle = (id) => {
    onChange('channels', selected.includes(id) ? selected.filter((c) => c !== id) : [...selected, id]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[5] }}>
      <div>
        <h2 style={{ fontFamily: F.display, fontSize: '20px', fontWeight: 800, color: C.textPrimary, margin: `0 0 ${S[1]}`, letterSpacing: '-0.02em' }}>
          Channel Selection
        </h2>
        <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: 0 }}>
          ARIA scores each channel based on your ICP and campaign goal. Select all you want to activate.
        </p>
      </div>

      {errors?.channels && (
        <div style={{ fontFamily: F.body, fontSize: '12px', color: C.red, backgroundColor: C.redDim, border: `1px solid rgba(255,110,122,0.2)`, borderRadius: R.md, padding: `${S[2]} ${S[3]}` }}>
          {errors.channels}
        </div>
      )}

      {/* Channel cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[3] }}>
        {CHANNELS.map((ch) => {
          const active = selected.includes(ch.id);
          return (
            <div
              key={ch.id}
              style={{
                backgroundColor: active ? C.primaryGlow : C.surface2,
                border: `1px solid ${active ? 'rgba(61,220,132,0.4)' : C.border}`,
                borderLeft: `4px solid ${ch.color}`,
                borderRadius: R.md,
                padding: S[4],
                cursor: 'pointer',
                transition: T.base,
                display: 'flex',
                flexDirection: 'column',
                gap: S[2],
                position: 'relative',
              }}
              onClick={() => toggle(ch.id)}
            >
              {/* Channel name + check */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 700, color: ch.color }}>{ch.name}</span>
                <div style={{
                  width: '18px', height: '18px', borderRadius: '50%',
                  backgroundColor: active ? C.primary : C.surface3,
                  border: `2px solid ${active ? C.primary : C.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: T.base,
                }}>
                  {active && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5 3.5-4" stroke={C.textInverse} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              </div>

              <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, margin: 0, lineHeight: '1.4' }}>
                {ch.desc}
              </p>

              {/* Stats row */}
              <div style={{ display: 'flex', gap: S[4] }}>
                <div>
                  <div style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Best For</div>
                  <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary }}>{ch.bestFor}</div>
                </div>
                <div>
                  <div style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg CPL</div>
                  <div style={{ fontFamily: F.mono, fontSize: '11px', color: C.textSecondary }}>{ch.avgCPL}</div>
                </div>
              </div>

              {/* ARIA score */}
              <div>
                <div style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '3px' }}>
                  ARIA Match Score
                </div>
                <ScoreBar score={ch.ariaScore} color={ch.color} />
              </div>
            </div>
          );
        })}
      </div>

      {selected.length > 0 && (
        <div style={{
          backgroundColor: C.surface2,
          border: `1px solid ${C.border}`,
          borderRadius: R.md,
          padding: `${S[2]} ${S[4]}`,
          fontFamily: F.body,
          fontSize: '12px',
          color: C.textSecondary,
        }}>
          Selected: <span style={{ color: C.primary, fontWeight: 600 }}>{selected.map((id) => CHANNELS.find((c) => c.id === id)?.name).filter(Boolean).join(', ')}</span>
        </div>
      )}
    </div>
  );
}
