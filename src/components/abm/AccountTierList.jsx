import { C, F, R, S, badge } from '../../tokens';

function healthColor(score) {
  if (score >= 80) return C.primary;
  if (score >= 60) return C.amber;
  return C.red;
}

const STATUS_STYLE = {
  Active: { ...badge.base, ...badge.green },
  'At Risk': { ...badge.base, ...badge.amber },
  Stalled: { ...badge.base, ...badge.red },
  Won: { ...badge.base, backgroundColor: 'rgba(94,234,212,0.12)', color: C.secondary, border: `1px solid rgba(94,234,212,0.25)` },
  Lost: { ...badge.base, ...badge.muted },
};

function formatDeal(value) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

export default function AccountTierList({ accounts, selectedAccountId, onSelectAccount }) {
  return (
    <div
      style={{
        width: 280,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: S[2],
        overflowY: 'auto',
        paddingRight: S[2],
      }}
    >
      {accounts.map((acc) => {
        const selected = acc.id === selectedAccountId;
        const health = healthColor(acc.healthScore);
        const statusStyle = STATUS_STYLE[acc.status] || STATUS_STYLE.Active;
        return (
          <button
            key={acc.id}
            onClick={() => onSelectAccount(acc.id)}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: S[4],
              borderRadius: R.card,
              border: `1px solid ${selected ? C.primary : C.border}`,
              backgroundColor: selected ? 'rgba(61,220,132,0.06)' : C.surface,
              cursor: 'pointer',
              transition: 'border-color 0.15s ease, background-color 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: S[2] }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  flexShrink: 0,
                  marginTop: 6,
                  backgroundColor: health,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary, marginBottom: 4 }}>
                  {acc.name}
                </div>
                <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, marginBottom: 4 }}>
                  {acc.industry}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: S[2], flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.primary }}>
                    {formatDeal(acc.estimatedDeal)}
                  </span>
                  <span style={{ ...statusStyle, fontSize: '10px' }}>{acc.status}</span>
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
