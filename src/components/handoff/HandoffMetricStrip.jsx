/**
 * 4 KPIs: Avg Handoff Time (current vs target <1h), MQLs in Queue, Assigned Today, Response Rate 24h.
 */
import { C, F, R, S, statNumber, statLabel } from '../../tokens';

export default function HandoffMetricStrip({
  avgHandoffHours = 0,
  avgHandoffTargetHours = 1,
  mqlsInQueue = 0,
  assignedToday = 0,
  responseRate24h = 0,
}) {
  const underTarget = avgHandoffHours <= avgHandoffTargetHours;
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: S[4],
        padding: S[4],
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
      }}
    >
      <div>
        <div style={{ ...statLabel, marginBottom: S[1] }}>Avg Handoff Time</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: S[2] }}>
          <span style={{ ...statNumber, fontSize: '22px', color: underTarget ? C.primary : C.amber }}>
            {avgHandoffHours.toFixed(1)}h
          </span>
          <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>
            target &lt;{avgHandoffTargetHours}h
          </span>
        </div>
      </div>
      <div>
        <div style={{ ...statLabel, marginBottom: S[1] }}>MQLs in Queue</div>
        <div style={statNumber}>{mqlsInQueue}</div>
      </div>
      <div>
        <div style={{ ...statLabel, marginBottom: S[1] }}>Assigned Today</div>
        <div style={statNumber}>{assignedToday}</div>
      </div>
      <div>
        <div style={{ ...statLabel, marginBottom: S[1] }}>Response Rate 24h</div>
        <div style={{ ...statNumber, color: C.primary }}>{responseRate24h}%</div>
      </div>
    </div>
  );
}
