import { useParams, useNavigate } from 'react-router-dom';
import useToast from '../hooks/useToast';
import { C, F, R, S, T, btn, badge, flex, shadows } from '../tokens';
import { prospects } from '../data/campaigns';

const TOUCHPOINT_ICONS = {
  email_sent:    { icon: '✉', color: C.textSecondary, label: 'Email Sent'     },
  email_opened:  { icon: '◉', color: C.primary,       label: 'Email Opened'   },
  email_clicked: { icon: '↗', color: C.secondary,     label: 'Link Clicked'   },
  email_replied: { icon: '↩', color: C.primary,       label: 'Replied'        },
  linkedin_view: { icon: '⬡', color: '#0A66C2',       label: 'LinkedIn View'  },
  demo_booked:   { icon: '⬤', color: C.amber,         label: 'Demo Booked'    },
};

const INTENT_BADGE = {
  high:   { ...badge.base, ...badge.green  },
  medium: { ...badge.base, ...badge.amber  },
  low:    { ...badge.base, ...badge.muted  },
};

const ARIA_RECS = [
  { color: C.primary,   text: 'Prospect opened email twice — ideal time to send a LinkedIn connection request now.' },
  { color: C.secondary, text: 'Company recently posted about ERP modernization on LinkedIn. Use as personalization hook.' },
  { color: C.amber,     text: 'Reply indicates interest but no specific time given. Send calendar invite directly to reduce friction.' },
];

// ── ICP score ring ─────────────────────────────
function IcpRing({ score }) {
  const color = score >= 90 ? C.primary : score >= 75 ? C.amber : C.red;
  return (
    <div style={{
      width: '52px', height: '52px', borderRadius: '50%',
      border: `3px solid ${color}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: `${color}18`, boxShadow: `0 0 12px ${color}40`,
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: F.mono, fontSize: '16px', fontWeight: 700, color, lineHeight: 1 }}>{score}</div>
        <div style={{ fontFamily: F.body, fontSize: '9px', color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>ICP</div>
      </div>
    </div>
  );
}

// ── Timeline node ─────────────────────────────
function TimelineNode({ touchpoint, isLast }) {
  const meta = TOUCHPOINT_ICONS[touchpoint.type] ?? { icon: '·', color: C.textMuted, label: touchpoint.type };

  return (
    <div style={{ display: 'flex', gap: S[4], alignItems: 'flex-start' }}>
      {/* Spine */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          backgroundColor: `${meta.color}18`,
          border: `2px solid ${meta.color}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '14px', boxShadow: `0 0 8px ${meta.color}30`,
          flexShrink: 0,
        }}>
          {meta.icon}
        </div>
        {!isLast && (
          <div style={{ width: '2px', flex: 1, minHeight: '24px', backgroundColor: C.border, margin: `${S[1]} 0` }}/>
        )}
      </div>

      {/* Content */}
      <div style={{ paddingBottom: isLast ? 0 : S[4], flex: 1 }}>
        <div style={{ ...flex.rowBetween, marginBottom: '2px' }}>
          <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: meta.color }}>{meta.label}</span>
          <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>{touchpoint.date}</span>
        </div>
        <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>{touchpoint.detail}</span>
      </div>
    </div>
  );
}

// ── ARIA panel ────────────────────────────────
function AriaSidebar() {
  const toast = useToast();
  return (
    <div style={{
      backgroundColor: C.surface2,
      border: `1px solid ${C.border}`,
      borderLeft: `3px solid ${C.primary}`,
      borderRadius: R.card,
      overflow: 'hidden',
      position: 'sticky',
      top: S[6],
    }}>
      <div style={{
        ...flex.rowBetween,
        padding: `${S[3]} ${S[4]}`,
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: C.primary, boxShadow: `0 0 6px ${C.primary}`, animation: 'ariaPulse2 2s ease-in-out infinite' }}/>
          <span style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>ARIA Recommendations</span>
        </div>
      </div>
      <style>{`@keyframes ariaPulse2 { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
      <div style={{ padding: S[4], display: 'flex', flexDirection: 'column', gap: S[3] }}>
        {ARIA_RECS.map((rec, i) => (
          <div key={i} style={{
            borderLeft: `3px solid ${rec.color}`,
            paddingLeft: S[3],
          }}>
            <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, lineHeight: '1.5', margin: `0 0 ${S[2]}` }}>{rec.text}</p>
            <button
              style={{
                fontFamily: F.body, fontSize: '11px', fontWeight: 600,
                color: rec.color, backgroundColor: `${rec.color}12`,
                border: `1px solid ${rec.color}30`, borderRadius: '5px',
                padding: `2px ${S[2]}`, cursor: 'pointer',
              }}
              onClick={() => toast.success('Action queued')}
            >
              Take Action →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────
export default function OutreachDetail() {
  const { id, pid } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const prospect = prospects.find((p) => p.id === pid) ?? prospects[0];

  return (
    <div style={{ padding: S[6], display: 'flex', flexDirection: 'column', gap: S[5] }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
        <button style={{ ...btn.ghost, fontSize: '12px', color: C.textMuted, padding: 0 }} onClick={() => navigate('/campaigns')}>
          Campaigns
        </button>
        <span style={{ color: C.textMuted }}>›</span>
        <button style={{ ...btn.ghost, fontSize: '12px', color: C.textMuted, padding: 0 }} onClick={() => navigate(`/campaigns/${id}?tab=outreach`)}>
          Outreach
        </button>
        <span style={{ color: C.textMuted }}>›</span>
        <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>{prospect.name}</span>
      </div>

      {/* Prospect header card */}
      <div style={{
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
        padding: S[5],
        display: 'flex',
        alignItems: 'flex-start',
        gap: S[5],
      }}>
        <IcpRing score={prospect.icpScore} />

        <div style={{ flex: 1 }}>
          <div style={{ ...flex.rowBetween, marginBottom: S[2] }}>
            <div>
              <h1 style={{ fontFamily: F.display, fontSize: '20px', fontWeight: 800, color: C.textPrimary, margin: 0, letterSpacing: '-0.02em' }}>
                {prospect.name}
              </h1>
              <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, marginTop: '2px' }}>
                {prospect.title} · {prospect.company}
              </div>
            </div>
            <span style={INTENT_BADGE[prospect.intent]}>{prospect.intent} intent</span>
          </div>

          <div style={{ display: 'flex', gap: S[4], flexWrap: 'wrap' }}>
            <span style={{ fontFamily: F.mono, fontSize: '12px', color: C.textMuted }}>✉ {prospect.email}</span>
            <span style={{ fontFamily: F.mono, fontSize: '12px', color: C.textMuted }}>⬡ {prospect.linkedin}</span>
            <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>
              Step {prospect.sequenceStep}/5 · Last touch {prospect.lastTouch}
            </span>
            {prospect.replied && (
              <span style={{ ...badge.base, ...badge.green }}>Replied</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: S[2], flexShrink: 0 }}>
          <button style={{ ...btn.ghost, fontSize: '12px' }} onClick={() => toast.info('Logging activity…')}>
            Log Activity
          </button>
          <button style={{ ...btn.secondary, fontSize: '12px' }} onClick={() => toast.info('Opening email composer…')}>
            Send Follow-up
          </button>
          <button style={{ ...btn.secondary, fontSize: '12px' }} onClick={() => toast.info('Updating stage…')}>
            Update Stage
          </button>
          <button style={{ ...btn.primary, fontSize: '12px' }} onClick={() => toast.success('Opening calendar invite…')}>
            Book Demo
          </button>
        </div>
      </div>

      {/* Two-column: timeline + ARIA */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: S[5], alignItems: 'start' }}>
        {/* Timeline */}
        <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card, padding: S[5] }}>
          <h2 style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: `0 0 ${S[5]}` }}>
            Activity Timeline
          </h2>
          {prospect.touchpoints.map((tp, i) => (
            <TimelineNode
              key={tp.id}
              touchpoint={tp}
              isLast={i === prospect.touchpoints.length - 1}
            />
          ))}
        </div>

        {/* ARIA sidebar */}
        <AriaSidebar />
      </div>
    </div>
  );
}
