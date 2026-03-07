/**
 * MQL Handoff Center — Session 3.
 * Header metric strip; left 420px MQL feed; right LeadIntelligenceBrief + SDRAssignmentPanel + OutreachDraftPanel; bottom HandoffTimeline.
 */
import { useState } from 'react';
import useStore from '../store/useStore';
import useToast from '../hooks/useToast';
import { handoffMetricsMock, handoffTimelineMock, SDRs } from '../data/handoffMock';
import HandoffMetricStrip from '../components/handoff/HandoffMetricStrip';
import MQLAlertCard from '../components/handoff/MQLAlertCard';
import LeadIntelligenceBrief from '../components/handoff/LeadIntelligenceBrief';
import SDRAssignmentPanel from '../components/handoff/SDRAssignmentPanel';
import OutreachDraftPanel from '../components/handoff/OutreachDraftPanel';
import HandoffTimeline from '../components/handoff/HandoffTimeline';
import { C, F, R, S } from '../tokens';

export default function MQLHandoffCenter() {
  const toast = useToast();
  const mqlQueue = useStore((s) => s.mqlQueue) || [];
  const updateMqlItem = useStore((s) => s.updateMqlItem);
  const appendHandoffHistory = useStore((s) => s.appendHandoffHistory);
  const [selectedId, setSelectedId] = useState(null);

  const selectedLead = mqlQueue.find((m) => m.id === selectedId);
  const unassigned = mqlQueue.filter((m) => !m.assignedSdrId);

  const handleAssign = (mqlId, sdrId) => {
    if (!mqlId || !sdrId) return;
    updateMqlItem(mqlId, { assignedSdrId: sdrId });
    appendHandoffHistory({ mqlId, sdrId, action: 'assigned', by: 'User' });
    toast.success('MQL assigned. SDR alerted.');
  };

  const handleAssignFromCard = (itemOrPayload) => {
    const payload = itemOrPayload?.assignedSdrId ? itemOrPayload : null;
    if (payload?.id && payload.assignedSdrId) {
      handleAssign(payload.id, payload.assignedSdrId);
      return;
    }
    if (itemOrPayload?.id) setSelectedId(itemOrPayload.id);
  };

  return (
    <div
      style={{
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: C.bg,
        padding: S[6],
      }}
    >
      <div style={{ marginBottom: S[4] }}>
        <h1 style={{ fontFamily: F.display, fontSize: '22px', fontWeight: 700, color: C.textPrimary, margin: `0 0 ${S[2]} 0` }}>
          MQL Handoff Center
        </h1>
        <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: 0 }}>
          Eliminate delay between MQL qualification and SDR first contact.
        </p>
      </div>

      <div style={{ marginBottom: S[6] }}>
        <HandoffMetricStrip
          avgHandoffHours={handoffMetricsMock.avgHandoffHours}
          avgHandoffTargetHours={handoffMetricsMock.avgHandoffTargetHours}
          mqlsInQueue={handoffMetricsMock.mqlsInQueue}
          assignedToday={handoffMetricsMock.assignedToday}
          responseRate24h={handoffMetricsMock.responseRate24h}
        />
      </div>

      <div style={{ display: 'flex', flex: 1, gap: S[6], minHeight: 320 }}>
        {/* Left — live MQL feed */}
        <div
          style={{
            width: 420,
            minWidth: 420,
            display: 'flex',
            flexDirection: 'column',
            border: `1px solid ${C.border}`,
            borderRadius: R.card,
            backgroundColor: C.surface,
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: S[4], borderBottom: `1px solid ${C.border}`, fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary }}>
            Live MQL feed
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: S[3] }}>
            {unassigned.length === 0 ? (
              <div
                style={{
                  padding: S[8],
                  textAlign: 'center',
                  fontFamily: F.body,
                  fontSize: '14px',
                  color: C.primary,
                }}
              >
                All MQLs assigned. Zero pipeline leakage.
              </div>
            ) : (
              unassigned.map((item) => (
                <div key={item.id} style={{ marginBottom: S[3] }}>
                  <MQLAlertCard
                    item={item}
                    selected={selectedId === item.id}
                    sdrs={SDRs}
                    onSelect={setSelectedId ? (item) => setSelectedId(item.id) : undefined}
                    onAssign={handleAssignFromCard}
                    onViewBrief={() => setSelectedId(item.id)}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right — brief + assign + draft */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: S[6],
            minWidth: 0,
            overflowY: 'auto',
          }}
        >
          <LeadIntelligenceBrief lead={selectedLead} />
          <SDRAssignmentPanel
            lead={selectedLead}
            sdrs={SDRs}
            onAssign={handleAssign}
            onSuccess={() => toast.success('Assignment saved.')}
          />
          <OutreachDraftPanel lead={selectedLead} />
        </div>
      </div>

      {/* Bottom — timeline */}
      <div
        style={{
          marginTop: S[6],
          padding: S[4],
          backgroundColor: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: R.card,
        }}
      >
        <h3 style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary, margin: `0 0 ${S[4]} 0` }}>
          Handoff timeline
        </h3>
        <HandoffTimeline data={handoffTimelineMock} />
      </div>
    </div>
  );
}
