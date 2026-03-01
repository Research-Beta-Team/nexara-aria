import { useNavigate, useParams } from 'react-router-dom';
import useToast from '../../../hooks/useToast';
import { C, F, R, S, T, badge, flex } from '../../../tokens';
import { prospects } from '../../../data/campaigns';

const INTENT_BADGE = {
  high:   { ...badge.base, ...badge.green  },
  medium: { ...badge.base, ...badge.amber  },
  low:    { ...badge.base, ...badge.muted  },
};

// ICP score ring
function IcpScore({ score }) {
  const color = score >= 90 ? C.primary : score >= 75 ? C.amber : C.red;
  return (
    <div style={{
      width: '36px', height: '36px', borderRadius: '50%',
      border: `2px solid ${color}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
      backgroundColor: `${color}18`,
    }}>
      <span style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color }}>{score}</span>
    </div>
  );
}

// Sequence step dots
function SequenceSteps({ current, total = 5 }) {
  return (
    <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: '8px', height: '8px', borderRadius: '50%',
          backgroundColor: i < current ? C.primary : C.surface3,
          border: `1px solid ${i < current ? C.primary : C.border}`,
        }}/>
      ))}
    </div>
  );
}

// Stat header
function StatBox({ label, value, color }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: '2px',
      padding: `${S[3]} ${S[4]}`,
      backgroundColor: C.surface2, border: `1px solid ${C.border}`, borderRadius: R.md,
      flex: 1,
    }}>
      <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      <span style={{ fontFamily: F.mono, fontSize: '18px', fontWeight: 700, color: color ?? C.textPrimary, lineHeight: 1 }}>{value}</span>
    </div>
  );
}

export default function OutreachTab() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const replied    = prospects.filter((p) => p.replied).length;
  const highIntent = prospects.filter((p) => p.intent === 'high').length;

  return (
    <div style={{ padding: S[5], display: 'flex', flexDirection: 'column', gap: S[5] }}>
      {/* Stats row */}
      <div style={{ display: 'flex', gap: S[3] }}>
        <StatBox label="Prospects"   value={prospects.length} />
        <StatBox label="Replied"     value={replied}    color={C.primary} />
        <StatBox label="High Intent" value={highIntent} color={C.secondary} />
        <StatBox label="Reply Rate"  value={`${Math.round((replied / prospects.length) * 100)}%`} color={C.primary} />
        <StatBox label="Sequence Steps" value="5-step" />
      </div>

      {/* Prospect list header */}
      <div style={{
        backgroundColor: C.surface2, border: `1px solid ${C.border}`,
        borderRadius: R.card, overflow: 'hidden',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '40px 1fr 80px 90px 80px 80px 40px',
          gap: S[3], padding: `${S[2]} ${S[4]}`,
          borderBottom: `1px solid ${C.border}`,
          backgroundColor: C.surface3,
        }}>
          {['ICP', 'Prospect', 'Intent', 'Sequence', 'Last Touch', 'Replied', ''].map((h) => (
            <span key={h} style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
          ))}
        </div>

        {prospects.map((p, i) => (
          <div
            key={p.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '40px 1fr 80px 90px 80px 80px 40px',
              gap: S[3], padding: `${S[3]} ${S[4]}`,
              alignItems: 'center',
              borderBottom: i < prospects.length - 1 ? `1px solid ${C.border}` : 'none',
              cursor: 'pointer',
              transition: T.color,
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = C.surface3}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            onClick={() => navigate(`/campaigns/${id}/prospect/${p.id}`)}
          >
            <IcpScore score={p.icpScore} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', overflow: 'hidden' }}>
              <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
              <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title} · {p.company}</span>
            </div>

            <span style={INTENT_BADGE[p.intent]}>{p.intent}</span>

            <SequenceSteps current={p.sequenceStep} />

            <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>{p.lastTouch}</span>

            <div style={{ display: 'flex', alignItems: 'center', gap: S[1] }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: p.replied ? C.primary : C.surface3, border: `1px solid ${p.replied ? C.primary : C.border}`, boxShadow: p.replied ? `0 0 4px ${C.primary}` : 'none' }}/>
              <span style={{ fontFamily: F.mono, fontSize: '11px', color: p.replied ? C.primary : C.textMuted }}>{p.replied ? 'Yes' : 'No'}</span>
            </div>

            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: C.textMuted }}>
              <path d="M4 7h6M7 4l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}
