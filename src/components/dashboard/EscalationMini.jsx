import { useNavigate } from 'react-router-dom';
import { C, F, R, S, T, badge } from '../../tokens';

const SEVERITY = {
  critical: { ...badge.base, ...badge.red,   label: 'Critical' },
  warning:  { ...badge.base, ...badge.amber, label: 'Warning'  },
  info:     { ...badge.base, ...badge.muted, label: 'Info'     },
};

export default function EscalationMini({ escalations = [] }) {
  const navigate = useNavigate();

  const cardStyle = {
    backgroundColor: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: R.card,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${S[3]} ${S[4]}`,
    borderBottom: `1px solid ${C.border}`,
  };

  return (
    <div style={cardStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1.5L13 12H1L7 1.5Z" stroke={C.red} strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M7 5.5v3M7 10v.4" stroke={C.red} strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>
            Escalations
          </span>
          {escalations.length > 0 && (
            <span style={{
              fontFamily: F.mono,
              fontSize: '10px',
              fontWeight: 700,
              color: C.red,
              backgroundColor: 'rgba(255,110,122,0.12)',
              border: `1px solid rgba(255,110,122,0.2)`,
              borderRadius: '4px',
              padding: '1px 6px',
            }}>
              {escalations.length}
            </span>
          )}
        </div>
        <button
          style={{
            background: 'none',
            border: 'none',
            fontFamily: F.body,
            fontSize: '12px',
            color: C.textSecondary,
            cursor: 'pointer',
            transition: T.color,
            padding: 0,
          }}
          onClick={() => navigate('/escalations')}
        >
          View all →
        </button>
      </div>

      {/* List */}
      <div>
        {escalations.map((esc, i) => {
          const sev = SEVERITY[esc.severity] ?? SEVERITY.info;
          return (
            <div
              key={esc.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: S[1],
                padding: `${S[3]} ${S[4]}`,
                borderBottom: i < escalations.length - 1 ? `1px solid ${C.border}` : 'none',
                cursor: 'pointer',
                transition: T.color,
              }}
              onClick={() => navigate('/escalations')}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: S[2] }}>
                <span style={sev}>{sev.label}</span>
                <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>{esc.time}</span>
              </div>
              <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary, lineHeight: '1.4' }}>
                {esc.title}
              </span>
              <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>
                {esc.client}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
