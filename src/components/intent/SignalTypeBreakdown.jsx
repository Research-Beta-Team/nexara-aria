import { C, F, R, S } from '../../tokens';
import { SIGNAL_TYPE_LABELS } from '../../data/intentSignals';

export default function SignalTypeBreakdown({ signals }) {
  const counts = (signals || []).reduce((acc, s) => {
    const type = s.signalType || 'other';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const maxCount = Math.max(1, ...Object.values(counts));

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: S[2],
        padding: S[3],
        backgroundColor: C.surface2,
        border: `1px solid ${C.border}`,
        borderRadius: R.sm,
      }}
    >
      <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        By signal type
      </span>
      {entries.map(([type, count]) => (
        <div key={type} style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
          <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, minWidth: 90 }}>
            {SIGNAL_TYPE_LABELS[type] || type.replace(/_/g, ' ')}
          </span>
          <div
            style={{
              flex: 1,
              height: 8,
              backgroundColor: C.surface3,
              borderRadius: R.pill,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${(count / maxCount) * 100}%`,
                height: '100%',
                backgroundColor: C.primary,
                borderRadius: R.pill,
                transition: 'width 0.2s ease',
              }}
            />
          </div>
          <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted, minWidth: 20, textAlign: 'right' }}>
            {count}
          </span>
        </div>
      ))}
    </div>
  );
}
