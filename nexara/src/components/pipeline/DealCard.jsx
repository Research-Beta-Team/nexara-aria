import { C, F, R, S, badge } from '../../tokens';
import { IconWarning } from '../ui/Icons';

function formatCurrency(value) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

function daysInStageColor(days) {
  if (days < 7) return C.primary;
  if (days <= 14) return C.amber;
  return C.red;
}

function healthColor(health) {
  switch (health) {
    case 'healthy': return C.primary;
    case 'at_risk': return C.amber;
    case 'stalled': return C.red;
    default: return C.textMuted;
  }
}

export default function DealCard({ deal, onClick }) {
  if (!deal) return null;
  const {
    company,
    contact,
    value,
    probability,
    daysInStage,
    lastActivity,
    health,
    aiRiskFlags = [],
    ariaNextAction,
  } = deal;

  const riskFlag = aiRiskFlags[0];
  const daysColor = daysInStageColor(daysInStage);
  const healthDot = healthColor(health);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(deal)}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.(deal)}
      style={{
        padding: S[4],
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
        cursor: 'pointer',
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: S[2], marginBottom: S[2] }}>
        <span style={{ color: C.textMuted, cursor: 'grab', flexShrink: 0 }} title="Drag">⋮⋮</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>
            {company}
          </div>
          <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>{contact}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: S[2], marginBottom: S[2] }}>
        <span style={{ fontFamily: F.mono, fontSize: '18px', fontWeight: 700, color: C.primary }}>
          {formatCurrency(value)}
        </span>
        {probability != null && (
          <span style={{ ...badge.base, ...badge.muted, fontSize: '10px' }}>{probability}%</span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: S[2], flexWrap: 'wrap', marginBottom: riskFlag ? S[2] : 0 }}>
        <span style={{ fontFamily: F.mono, fontSize: '11px', color: daysColor }}>
          {daysInStage}d in stage
        </span>
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: healthDot,
          }}
        />
        <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>{lastActivity}</span>
      </div>
      {riskFlag && (
        <div
          style={{
            padding: `${S[1]} ${S[2]}`,
            backgroundColor: 'rgba(245,200,66,0.12)',
            border: `1px solid rgba(245,200,66,0.25)`,
            borderRadius: R.sm,
            fontFamily: F.body,
            fontSize: '11px',
            color: C.amber,
            marginBottom: S[2],
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <IconWarning color={C.amber} width={12} height={12} /> {riskFlag}
        </span>
        </div>
      )}
      {ariaNextAction && (
        <p style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary, fontStyle: 'italic', margin: 0 }}>
          {ariaNextAction}
        </p>
      )}
    </div>
  );
}
