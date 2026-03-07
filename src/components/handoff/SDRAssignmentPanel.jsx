/**
 * SDR assignment: status, SDR dropdown with availability, "Assign & Alert SDR", success state.
 */
import { useState, useEffect } from 'react';
import { C, F, R, S, btn } from '../../tokens';

export default function SDRAssignmentPanel({ lead, sdrs = [], onAssign, onSuccess }) {
  const [selectedSdrId, setSelectedSdrId] = useState(lead?.assignedSdrId || '');
  const [success, setSuccess] = useState(false);
  const assignedSdr = sdrs.find((s) => s.id === (lead?.assignedSdrId || selectedSdrId));

  useEffect(() => {
    setSelectedSdrId(lead?.assignedSdrId || '');
    setSuccess(false);
  }, [lead?.id]);

  const handleAssign = () => {
    if (!lead || !selectedSdrId) return;
    onAssign?.(lead.id, selectedSdrId);
    setSuccess(true);
    onSuccess?.();
  };

  if (!lead) {
    return (
      <div
        style={{
          padding: S[4],
          fontFamily: F.body,
          fontSize: '13px',
          color: C.textMuted,
          backgroundColor: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: R.card,
        }}
      >
        Select an MQL to assign.
      </div>
    );
  }

  if (success || lead.assignedSdrId) {
    return (
      <div
        style={{
          padding: S[4],
          backgroundColor: C.greenDim,
          border: `1px solid ${C.primaryGlow}`,
          borderRadius: R.card,
        }}
      >
        <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.primary, marginBottom: S[2] }}>
          Assigned to {assignedSdr?.name || 'SDR'}
        </div>
        <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary }}>
          SDR has been alerted. First touch in progress.
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: S[4],
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
      }}
    >
      <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textPrimary, marginBottom: S[3] }}>
        Assign SDR
      </div>
      <select
        value={selectedSdrId}
        onChange={(e) => setSelectedSdrId(e.target.value)}
        style={{
          width: '100%',
          padding: `${S[2]} ${S[3]}`,
          fontFamily: F.body,
          fontSize: '13px',
          color: C.textPrimary,
          backgroundColor: C.surface2,
          border: `1px solid ${C.border}`,
          borderRadius: R.input,
          outline: 'none',
          marginBottom: S[3],
        }}
      >
        <option value="">Choose SDR...</option>
        {sdrs.map((sdr) => (
          <option key={sdr.id} value={sdr.id}>
            {sdr.name} — {sdr.availability === 'available' ? 'Available' : sdr.availability} ({sdr.assigned}/{sdr.capacity})
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={handleAssign}
        disabled={!selectedSdrId}
        style={{ ...btn.primary, width: '100%', opacity: selectedSdrId ? 1 : 0.5 }}
      >
        Assign & Alert SDR
      </button>
    </div>
  );
}
