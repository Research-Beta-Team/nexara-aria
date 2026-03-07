/**
 * Severity icon, title, description, View button, "Action Ready" mint pill.
 */
import { C, F, R, S, btn } from '../../tokens';

export default function AnomalyAlertRow({ anomaly, onView }) {
  const isHigh = anomaly.severity === 'high';
  const iconColor = isHigh ? C.red : C.amber;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: S[4],
        padding: S[4],
        backgroundColor: C.surface,
        border: `1px solid ${isHigh ? C.red : C.amber}`,
        borderLeftWidth: 4,
        borderRadius: R.card,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: R.full,
          backgroundColor: isHigh ? C.redDim : C.amberDim,
          color: iconColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        !
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginBottom: S[1] }}>
          <span style={{ fontFamily: F.body, fontSize: '14px', fontWeight: 600, color: C.textPrimary }}>
            {anomaly.title}
          </span>
          {anomaly.actionReady && (
            <span
              style={{
                fontFamily: F.mono,
                fontSize: '10px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: R.pill,
                backgroundColor: C.primaryGlow,
                color: C.primary,
              }}
            >
              Action Ready
            </span>
          )}
        </div>
        <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, lineHeight: 1.5, margin: `0 0 ${S[3]} 0` }}>
          {anomaly.description}
        </p>
        <button type="button" onClick={() => onView?.(anomaly)} style={btn.ghost}>
          View
        </button>
      </div>
    </div>
  );
}
