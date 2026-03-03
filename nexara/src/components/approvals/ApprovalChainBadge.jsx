import { C, F, R, S } from '../../tokens';

const STATUS_COLOR = {
  pending: C.amber,
  approved: C.primary,
  declined: C.red,
};

/**
 * Two-dot badge: left = strategy, right = budget.
 * Label shows "2/2" | "1/2" | "0/2". Tooltip: "Strategy: Approved · Budget: Pending".
 */
export default function ApprovalChainBadge({ strategyStatus, budgetStatus, title }) {
  const s = strategyStatus ?? 'pending';
  const b = budgetStatus ?? 'pending';
  const approved = (s === 'approved' ? 1 : 0) + (b === 'approved' ? 1 : 0);
  const label = `${approved}/2`;
  const tooltip = title ?? `Strategy: ${s === 'approved' ? 'Approved' : s === 'declined' ? 'Declined' : 'Pending'} · Budget: ${b === 'approved' ? 'Approved' : b === 'declined' ? 'Declined' : 'Pending'}`;

  return (
    <span
      title={tooltip}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: S[1],
        fontFamily: F.mono,
        fontSize: '10px',
        fontWeight: 700,
        color: C.textSecondary,
        backgroundColor: C.surface3,
        border: `1px solid ${C.border}`,
        borderRadius: R.pill,
        padding: '2px 6px 2px 4px',
        whiteSpace: 'nowrap',
        cursor: 'default',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: STATUS_COLOR[s],
            flexShrink: 0,
          }}
        />
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: STATUS_COLOR[b],
            flexShrink: 0,
          }}
        />
      </span>
      {label}
    </span>
  );
}
