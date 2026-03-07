/**
 * Sticky bar when 2+ items selected: count, "Approve All", "Request Revision".
 */
import { C, F, R, S, btn } from '../../tokens';

export default function BulkApproveBar({ selectedCount, onApproveAll, onRequestRevision }) {
  if (selectedCount < 2) return null;

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: S[4],
        padding: S[3],
        backgroundColor: C.surface2,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
        marginBottom: S[3],
      }}
    >
      <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary }}>
        {selectedCount} items selected
      </span>
      <div style={{ display: 'flex', gap: S[3] }}>
        <button
          type="button"
          onClick={onRequestRevision}
          style={{
            ...btn.secondary,
            backgroundColor: C.amberDim,
            color: C.amber,
            borderColor: C.amber,
          }}
        >
          Request Revision
        </button>
        <button type="button" onClick={onApproveAll} style={btn.primary}>
          Approve All
        </button>
      </div>
    </div>
  );
}
