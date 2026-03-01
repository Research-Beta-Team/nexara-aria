import { C, F, R, S, btn, badge } from '../../tokens';

function scoreColor(score) {
  if (score >= 80) return C.primary;
  if (score >= 60) return C.amber;
  return C.textMuted;
}

export default function AccountIntentCard({ account, onOutreach, onViewInCrm, toast }) {
  if (!account) return null;
  const { account: name, score, signals, topSignalType, lastActivity, inCRM } = account;
  const color = scoreColor(score);
  const typeLabel = topSignalType ? topSignalType.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) : '—';

  return (
    <div
      style={{
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
        padding: S[4],
        display: 'flex',
        flexDirection: 'column',
        gap: S[3],
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: S[2] }}>
        <span style={{ fontFamily: F.body, fontSize: '14px', fontWeight: 700, color: C.textPrimary, flex: 1, minWidth: 0 }}>
          {name}
        </span>
        <span
          style={{
            ...badge.base,
            ...(inCRM ? badge.green : badge.muted),
            fontSize: '10px',
          }}
        >
          {inCRM ? 'In CRM' : 'Not in CRM'}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            border: `3px solid ${color}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            backgroundColor: `${color}18`,
          }}
        >
          <span style={{ fontFamily: F.mono, fontSize: '16px', fontWeight: 700, color }}>{score}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>
            {signals} signal{signals !== 1 ? 's' : ''} · {typeLabel}
          </div>
          <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary }}>{lastActivity}</div>
        </div>
      </div>
      {inCRM ? (
        <button
          style={{ ...btn.secondary, width: '100%', fontSize: '12px' }}
          onClick={() => {
            onViewInCrm?.(account);
            toast?.info('Opening in CRM');
          }}
        >
          View in CRM
        </button>
      ) : (
        <button
          style={{ ...btn.primary, width: '100%', fontSize: '12px' }}
          onClick={() => {
            onOutreach?.(account);
            toast?.info(`Starting outreach to ${name}`);
          }}
        >
          Outreach
        </button>
      )}
    </div>
  );
}
