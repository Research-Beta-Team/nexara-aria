import { C, F, R, S, T } from '../../tokens';
import useToast from '../../hooks/useToast';

// Per-step ARIA context
const ARIA_CONTENT = {
  1: {
    headline: 'Campaign Setup Tips',
    insights: [
      { color: C.primary,   text: 'CFO-level campaigns in Vietnam typically yield 80–120 leads over a 12-week period with a $20–25k budget.' },
      { color: C.secondary, text: 'Demand Gen campaigns targeting VP/Director+ titles perform 34% better when deadline is 10+ weeks.' },
      { color: C.amber,     text: 'Budget below $12k limits multi-channel execution. Consider a focused single-channel approach instead.' },
    ],
    tip: 'Name your campaign with client + market + quarter for easy tracking (e.g., "Acme VN CFO Q2").',
  },
  2: {
    headline: 'ICP Optimization',
    insights: [
      { color: C.primary,   text: 'Adding "VP Finance" alongside "CFO" typically expands your addressable market by 40% in SEA.' },
      { color: C.secondary, text: 'Company size 200–2000 employees outperforms enterprise (5000+) for SaaS adoption in Vietnam.' },
      { color: C.amber,     text: 'Excluding non-profit and government sectors improves your reply rate by ~18% on average.' },
    ],
    tip: 'A tightly defined ICP (3–4 titles, 2–3 industries) outperforms broad targeting by 2.3x in qualified lead rate.',
  },
  3: {
    headline: 'Channel Strategy',
    insights: [
      { color: C.primary,   text: 'LinkedIn + Meta is the highest-performing combo for your ICP. LinkedIn drives quality, Meta drives volume.' },
      { color: C.secondary, text: 'For CFO-level targeting in Vietnam, LinkedIn accounts for ~68% of qualified leads on average.' },
      { color: C.amber,     text: 'Running 3+ channels simultaneously without a $20k+ budget leads to underperformance across all.' },
    ],
    tip: 'Start with LinkedIn as your primary channel. Add Meta retargeting in week 3 once your pixel has 500+ events.',
  },
  4: {
    headline: 'Knowledge Base',
    insights: [
      { color: C.primary,   text: 'Campaigns with 3+ KB docs (case studies, battle cards) generate 28% more personalized outreach.' },
      { color: C.secondary, text: 'AI agents use your KB to generate email copy, ad headlines, and objection handling scripts.' },
      { color: C.amber,     text: 'Out-of-date case studies (12+ months) reduce AI content quality. Upload recent wins.' },
    ],
    tip: 'Upload at least one customer case study from a similar industry. This single asset drives the most personalization.',
  },
  5: {
    headline: 'Team Assignment',
    insights: [
      { color: C.primary,   text: 'Assigning a dedicated Media Buyer reduces average CPL by 22% vs. shared resource models.' },
      { color: C.secondary, text: 'Campaigns with a named Content Strategist produce creative 40% faster than unassigned campaigns.' },
      { color: C.amber,     text: 'If an SDR is not assigned, AI agents will handle outreach autonomously at lower reply rates.' },
    ],
    tip: 'Assign an Analyst even if part-time — weekly pacing reports catch budget overruns before they become critical.',
  },
  6: {
    headline: 'Workflow Settings',
    insights: [
      { color: C.primary,   text: 'Enabling content approval gates reduces off-brand content by 91% but adds 1–2 days per creative cycle.' },
      { color: C.secondary, text: 'Budget change alerts at 15% threshold give you early warning before overspend occurs.' },
      { color: C.amber,     text: 'Weekly reports are recommended for new campaigns. Switch to bi-weekly after 4 weeks of stable data.' },
    ],
    tip: 'For high-budget campaigns (>$20k), enable all approval gates. For lean sprints, disable content approval to move faster.',
  },
  7: {
    headline: 'Launch Checklist',
    insights: [
      { color: C.primary,   text: 'All agents will be briefed with your ICP, KB docs, and channel strategy before going live.' },
      { color: C.secondary, text: 'First results typically appear within 48–72 hours of launch for paid channels.' },
      { color: C.amber,     text: 'Review your first ARIA insights 5 days after launch — early signals help optimize week 2 spend.' },
    ],
    tip: 'After launch, visit your Campaign Detail → Outreach tab daily for the first week to review prospect engagement.',
  },
};

export default function WizardAriaSidebar({ step }) {
  const toast = useToast();
  const content = ARIA_CONTENT[step] ?? ARIA_CONTENT[1];

  const sidebarStyle = {
    width: '300px',
    minWidth: '300px',
    display: 'flex',
    flexDirection: 'column',
    gap: S[4],
    position: 'sticky',
    top: S[6],
    alignSelf: 'flex-start',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: S[2],
    marginBottom: S[1],
  };

  const insightStyle = (color) => ({
    borderLeft: `3px solid ${color}`,
    paddingLeft: S[3],
    marginBottom: S[3],
  });

  const tipBoxStyle = {
    backgroundColor: C.surface3,
    border: `1px solid ${C.border}`,
    borderRadius: R.md,
    padding: S[3],
    marginTop: S[1],
  };

  return (
    <div style={sidebarStyle}>
      {/* ARIA header card */}
      <div style={{
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
        borderLeft: `3px solid ${C.primary}`,
        borderRadius: R.card,
        padding: S[4],
        overflow: 'hidden',
      }}>
        <div style={headerStyle}>
          {/* ARIA icon + pulse */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke={C.primary} strokeWidth="1.5"/>
              <circle cx="10" cy="10" r="4" stroke={C.primary} strokeWidth="1.5"/>
              <circle cx="10" cy="10" r="1.5" fill={C.primary}/>
              <path d="M10 1v2.5M10 16.5V19M1 10h2.5M16.5 10H19" stroke={C.primary} strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <div style={{
              position: 'absolute', top: '-2px', right: '-2px',
              width: '7px', height: '7px', borderRadius: '50%',
              backgroundColor: C.primary,
              boxShadow: `0 0 5px ${C.primary}`,
              animation: 'ariaSidebarPulse 2s ease-in-out infinite',
            }}/>
          </div>
          <div>
            <div style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>
              ARIA
            </div>
            <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary }}>
              {content.headline}
            </div>
          </div>
        </div>

        <style>{`@keyframes ariaSidebarPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }`}</style>

        {/* Insights */}
        <div style={{ marginTop: S[4] }}>
          {content.insights.map((ins, i) => (
            <div key={i} style={insightStyle(ins.color)}>
              <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, lineHeight: '1.5', margin: 0 }}>
                {ins.text}
              </p>
            </div>
          ))}
        </div>

        {/* Ask ARIA button */}
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: S[1],
            fontFamily: F.body,
            fontSize: '12px',
            fontWeight: 600,
            color: C.primary,
            backgroundColor: C.primaryGlow,
            border: `1px solid rgba(61,220,132,0.25)`,
            borderRadius: R.button,
            padding: `${S[1]} ${S[3]}`,
            cursor: 'pointer',
            marginTop: S[3],
            transition: T.color,
          }}
          onClick={() => toast.info('ARIA AI chat coming soon')}
        >
          Ask ARIA a question
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5h6M5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Pro tip box */}
      <div style={{
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
        padding: S[4],
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginBottom: S[2] }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <circle cx="6.5" cy="6.5" r="5.5" stroke={C.amber} strokeWidth="1.3"/>
            <path d="M6.5 5v3M6.5 3v.5" stroke={C.amber} strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.amber, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Pro Tip
          </span>
        </div>
        <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, lineHeight: '1.5', margin: 0 }}>
          {content.tip}
        </p>
      </div>
    </div>
  );
}
