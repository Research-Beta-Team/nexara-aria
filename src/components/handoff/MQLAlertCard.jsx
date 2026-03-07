/**
 * MQL card: lead name, company, score badge, time badge (mint/amber/red, OVERDUE >4h), intent chips, ICP fit, View Lead Brief, Assign Now, SDR dropdown.
 */
import { C, F, R, S, btn } from '../../tokens';
import { getUrgency } from '../../data/handoffMock';

export default function MQLAlertCard({
  item,
  selected,
  sdrs = [],
  onSelect,
  onAssign,
  onViewBrief,
}) {
  const urgency = getUrgency(item.hoursInQueue || 0);
  const urgencyStyles = {
    mint: { bg: C.greenDim, color: C.primary, border: C.primaryGlow },
    amber: { bg: C.amberDim, color: C.amber, border: C.amberDim },
    red: { bg: C.redDim, color: C.red, border: C.red },
  };
  const style = urgencyStyles[urgency.color] || urgencyStyles.mint;
  const isOverdue = urgency.tier === 'overdue';

  return (
    <>
      {isOverdue && (
        <style>{`@keyframes handoffOverduePulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.85; } }`}</style>
      )}
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect?.(item)}
      onKeyDown={(e) => e.key === 'Enter' && onSelect?.(item)}
      style={{
        padding: S[4],
        backgroundColor: selected ? C.surface2 : C.surface,
        border: `1px solid ${selected ? C.primary : C.border}`,
        borderLeftWidth: selected ? 4 : 1,
        borderLeftColor: selected ? C.primary : isOverdue ? C.red : C.border,
        borderRadius: R.card,
        cursor: onSelect ? 'pointer' : 'default',
        animation: isOverdue ? 'handoffOverduePulse 2s ease-in-out infinite' : undefined,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: S[3], marginBottom: S[2] }}>
        <div>
          <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>
            {item.leadName}
          </div>
          <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>
            {item.company}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
          <span
            style={{
              fontFamily: F.mono,
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: R.pill,
              backgroundColor: C.primaryGlow,
              color: C.primary,
            }}
          >
            {item.score}
          </span>
          <span
            style={{
              fontFamily: F.mono,
              fontSize: '10px',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: R.pill,
              backgroundColor: style.bg,
              color: style.color,
              border: `1px solid ${style.border}`,
            }}
          >
            {urgency.label}
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[1], marginBottom: S[3] }}>
        {(item.intentSignals || []).map((signal, i) => (
          <span
            key={i}
            style={{
              fontFamily: F.body,
              fontSize: '10px',
              color: C.textSecondary,
              backgroundColor: C.surface3,
              padding: '2px 6px',
              borderRadius: R.pill,
            }}
          >
            {signal}
          </span>
        ))}
      </div>
      <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, marginBottom: S[3] }}>
        ICP fit {item.icpFit}%
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[2], alignItems: 'center' }}>
        <button type="button" onClick={(e) => { e.stopPropagation(); onViewBrief?.(item); }} style={btn.ghost}>
          View Lead Brief
        </button>
        <button type="button" onClick={(e) => { e.stopPropagation(); onAssign?.(item); }} style={btn.primary}>
          Assign Now
        </button>
        {sdrs.length > 0 && (
          <select
            defaultValue=""
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              const sdrId = e.target.value;
              if (sdrId) onAssign?.({ ...item, assignedSdrId: sdrId });
            }}
            style={{
              padding: `${S[1]} ${S[2]}`,
              fontFamily: F.body,
              fontSize: '12px',
              color: C.textPrimary,
              backgroundColor: C.surface2,
              border: `1px solid ${C.border}`,
              borderRadius: R.input,
              outline: 'none',
            }}
          >
            <option value="">SDR...</option>
            {sdrs.map((sdr) => (
              <option key={sdr.id} value={sdr.id}>
                {sdr.name} {sdr.availability === 'available' ? '✓' : ''}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
    </>
  );
}
