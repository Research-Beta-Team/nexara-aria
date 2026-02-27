import { useState } from 'react';
import { C, F, R, S, T, btn, shadows } from '../../tokens';

const SEV_COLORS = {
  High:   { color: '#EF4444', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.25)' },
  Medium: { color: C.amber,  bg: 'rgba(245,200,66,0.12)',   border: 'rgba(245,200,66,0.25)' },
  Low:    { color: C.primary, bg: 'rgba(61,220,132,0.10)', border: 'rgba(61,220,132,0.25)' },
};

/* ─── ConfidenceRing ─────────────────────────────────────── */
function ConfidenceRing({ score }) {
  const r = 16;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = score >= 80 ? C.primary : score >= 60 ? C.amber : '#EF4444';
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" style={{ flexShrink: 0 }}>
      <circle cx="20" cy="20" r={r} fill="none" stroke={C.border} strokeWidth="2.5"/>
      <circle cx="20" cy="20" r={r} fill="none"
        stroke={color} strokeWidth="2.5"
        strokeDasharray={`${fill} ${circ - fill}`}
        strokeDashoffset={circ / 4}
        strokeLinecap="round"
      />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
        fill={color} style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700 }}>
        {score}%
      </text>
    </svg>
  );
}

/* ─── EscalationCard ─────────────────────────────────────── */
export default function EscalationCard({ escalation, selected, onSelect, onApprove, onDeny, onSendAdvisor, resolved }) {
  const [expanded, setExpanded]   = useState(false);
  const [animState, setAnimState] = useState(null); // 'approving' | 'denying' | null

  const sev = SEV_COLORS[escalation.severity] ?? SEV_COLORS.Low;

  const handleApprove = () => {
    setAnimState('approving');
    setTimeout(() => { onApprove(escalation.id); }, 1100);
  };

  const handleDeny = () => {
    setAnimState('denying');
    setTimeout(() => { onDeny(escalation.id); }, 1100);
  };

  const borderColor = animState === 'approving'
    ? C.primary
    : animState === 'denying'
    ? '#EF4444'
    : selected
    ? C.borderHover
    : C.border;

  const bgColor = animState === 'approving'
    ? 'rgba(61,220,132,0.08)'
    : animState === 'denying'
    ? 'rgba(239,68,68,0.08)'
    : C.surface;

  return (
    <>
      <style>{`
        @keyframes ecApprove { 0%{opacity:1;transform:scale(1)} 60%{opacity:1;transform:scale(1.01)} 100%{opacity:0;transform:scale(0.97)} }
        @keyframes ecDeny    { 0%{opacity:1;transform:scale(1)} 60%{opacity:1;transform:scale(1.01)} 100%{opacity:0;transform:scale(0.97)} }
        @keyframes ecCheckIn { from{transform:scale(0.5);opacity:0} to{transform:scale(1);opacity:1} }
      `}</style>

      <div style={{
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: R.card,
        overflow: 'hidden',
        transition: 'background-color 0.3s ease, border-color 0.3s ease',
        boxShadow: selected ? shadows.cardHover : 'none',
        animation: animState === 'approving' ? 'ecApprove 1.1s ease forwards'
                 : animState === 'denying'   ? 'ecDeny 1.1s ease forwards'
                 : 'none',
        position: 'relative',
      }}>
        {/* Approval overlay */}
        {animState && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 2,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: animState === 'approving' ? 'rgba(61,220,132,0.18)' : 'rgba(239,68,68,0.18)',
            borderRadius: R.card,
            animation: 'ecCheckIn 0.3s ease',
          }}>
            {animState === 'approving' ? (
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="16" fill={C.primaryGlow} stroke={C.primary} strokeWidth="1.5"/>
                <path d="M10 18l5 5 10-10" stroke={C.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="16" fill="rgba(239,68,68,0.12)" stroke="#EF4444" strokeWidth="1.5"/>
                <path d="M12 12l12 12M24 12L12 24" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </div>
        )}

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: S[3], padding: `${S[4]} ${S[4]} ${S[3]}` }}>
          {/* Checkbox */}
          <div
            style={{
              width: '16px', height: '16px', borderRadius: '4px', flexShrink: 0, marginTop: '2px',
              border: `1.5px solid ${selected ? C.primary : C.border}`,
              backgroundColor: selected ? C.primary : 'transparent',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: T.color,
            }}
            onClick={(e) => { e.stopPropagation(); onSelect(escalation.id); }}
          >
            {selected && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5l2.5 2.5 3.5-4" stroke={C.bg} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>

          {/* Severity badge */}
          <span style={{
            fontFamily: F.mono, fontSize: '10px', fontWeight: 700,
            color: sev.color, backgroundColor: sev.bg, border: `1px solid ${sev.border}`,
            borderRadius: R.pill, padding: `1px 8px`, whiteSpace: 'nowrap', flexShrink: 0,
          }}>
            {escalation.severity.toUpperCase()}
          </span>

          {/* Title + agent */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: F.body, fontSize: '14px', fontWeight: 700, color: C.textPrimary, lineHeight: '1.3' }}>
              {escalation.title}
            </div>
            <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, marginTop: '3px' }}>
              {escalation.agentType} · {escalation.campaign} · {escalation.timing}
            </div>
          </div>

          {/* Confidence ring */}
          <ConfidenceRing score={escalation.confidence} />
        </div>

        {/* Situation + Recommendation */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[3], padding: `0 ${S[4]}` }}>
          <div style={{ backgroundColor: C.surface2, borderRadius: R.md, padding: S[3] }}>
            <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>
              Situation
            </div>
            <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, margin: 0, lineHeight: '1.6' }}>
              {escalation.situation}
            </p>
          </div>
          <div style={{ backgroundColor: `${sev.color}0A`, border: `1px solid ${sev.border}`, borderRadius: R.md, padding: S[3] }}>
            <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: sev.color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>
              ARIA Recommendation
            </div>
            <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textPrimary, margin: 0, lineHeight: '1.6', fontWeight: 500 }}>
              {escalation.recommendation}
            </p>
          </div>
        </div>

        {/* Reasoning (expandable) */}
        {escalation.reasoning && (
          <div style={{ padding: `${S[2]} ${S[4]}` }}>
            <button
              onClick={() => setExpanded((e) => !e)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: S[2],
                padding: `${S[1]} 0`,
              }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                style={{ transform: expanded ? 'none' : 'rotate(-90deg)', transition: T.base }}>
                <path d="M1.5 3.5l3.5 3.5 3.5-3.5" stroke={C.textMuted} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                ARIA Reasoning
              </span>
            </button>
            {expanded && (
              <div style={{
                backgroundColor: C.bg, border: `1px solid ${C.border}`, borderRadius: R.md,
                padding: S[3], marginTop: S[2],
              }}>
                <p style={{ fontFamily: F.mono, fontSize: '11px', color: C.textSecondary, margin: 0, lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                  {escalation.reasoning}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action footer */}
        {!resolved && (
          <div style={{
            display: 'flex', justifyContent: 'flex-end', gap: S[2], alignItems: 'center',
            padding: `${S[3]} ${S[4]}`,
            borderTop: `1px solid ${C.border}`,
            marginTop: S[2],
          }}>
            <button
              style={{ ...btn.ghost, fontSize: '12px', color: C.textMuted }}
              onClick={(e) => { e.stopPropagation(); onSendAdvisor(escalation); }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M6 3.5v3M6 8v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              Send to Advisor
            </button>
            <button
              style={{
                ...btn.secondary, fontSize: '12px',
                color: '#EF4444', borderColor: '#EF444440',
              }}
              onClick={(e) => { e.stopPropagation(); handleDeny(); }}
              disabled={!!animState}
            >
              Deny
            </button>
            <button
              style={{ ...btn.primary, fontSize: '12px' }}
              onClick={(e) => { e.stopPropagation(); handleApprove(); }}
              disabled={!!animState}
            >
              Approve
            </button>
          </div>
        )}

        {/* Resolved badge */}
        {resolved && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: S[2],
            padding: `${S[3]} ${S[4]}`, borderTop: `1px solid ${C.border}`, marginTop: S[2],
          }}>
            <span style={{
              fontFamily: F.mono, fontSize: '11px', fontWeight: 700,
              color: escalation.status === 'approved' ? C.primary : '#EF4444',
              display: 'flex', alignItems: 'center', gap: '5px',
            }}>
              {escalation.status === 'approved' ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke={C.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Approved · {escalation.resolvedAt}
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 2l8 8M10 2L2 10" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Denied · {escalation.resolvedAt}
                </>
              )}
            </span>
          </div>
        )}
      </div>
    </>
  );
}
