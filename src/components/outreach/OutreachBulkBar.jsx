import { C, F, R, S, btn } from '../../tokens';

export default function OutreachBulkBar({
  selectedCount,
  onSelectAll,
  onClearSelection,
  onPauseSequence,
  onMarkReplied,
  onAssignSDR,
  onExportSelected,
  canEdit,
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: S[2],
        padding: `${S[2]} ${S[4]}`,
        backgroundColor: C.primaryGlow,
        border: `1px solid ${C.primary}`,
        borderRadius: R.md,
        marginBottom: S[3],
      }}
    >
      <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.primary }}>
        {selectedCount} selected
      </span>
      <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap' }}>
        <button type="button" style={{ ...btn.ghost, fontSize: '12px' }} onClick={onSelectAll}>
          Select all
        </button>
        <button type="button" style={{ ...btn.ghost, fontSize: '12px' }} onClick={onClearSelection}>
          Clear
        </button>
        <span style={{ width: '1px', height: '16px', backgroundColor: C.border }} />
        {canEdit && (
          <>
            <button type="button" style={{ ...btn.secondary, fontSize: '12px' }} onClick={onPauseSequence}>
              Pause sequence
            </button>
            <button type="button" style={{ ...btn.secondary, fontSize: '12px' }} onClick={onMarkReplied}>
              Mark replied
            </button>
            <button type="button" style={{ ...btn.secondary, fontSize: '12px' }} onClick={onAssignSDR}>
              Assign to SDR
            </button>
          </>
        )}
        <button type="button" style={{ ...btn.secondary, fontSize: '12px' }} onClick={onExportSelected}>
          Export selected
        </button>
      </div>
    </div>
  );
}
