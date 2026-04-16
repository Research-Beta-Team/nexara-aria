/**
 * MQL Handoff Center — Session 3.
 * Header metric strip; left 420px MQL feed; right LeadIntelligenceBrief + SDRAssignmentPanel + OutreachDraftPanel; bottom HandoffTimeline.
 */
import { useState } from 'react';
import useStore from '../store/useStore';
import useToast from '../hooks/useToast';
import { useAgent } from '../hooks/useAgent';
import AgentThinking from '../components/agents/AgentThinking';
import AgentResultPanel from '../components/agents/AgentResultPanel';
import { handoffMetricsMock, handoffTimelineMock, SDRs } from '../data/handoffMock';
import HandoffMetricStrip from '../components/handoff/HandoffMetricStrip';
import MQLAlertCard from '../components/handoff/MQLAlertCard';
import LeadIntelligenceBrief from '../components/handoff/LeadIntelligenceBrief';
import SDRAssignmentPanel from '../components/handoff/SDRAssignmentPanel';
import OutreachDraftPanel from '../components/handoff/OutreachDraftPanel';
import HandoffTimeline from '../components/handoff/HandoffTimeline';
import { C, F, R, S, btn } from '../tokens';

export default function MQLHandoffCenter() {
  const toast = useToast();
  const outreachAgent = useAgent('outreach');
  const prospectorAgent = useAgent('prospector');
  const [draftResult, setDraftResult] = useState(null);
  const [autoAssignResult, setAutoAssignResult] = useState(null);
  const mqlQueue = useStore((s) => s.mqlQueue) || [];
  const updateMqlItem = useStore((s) => s.updateMqlItem);
  const appendHandoffHistory = useStore((s) => s.appendHandoffHistory);
  const [selectedId, setSelectedId] = useState(null);

  const handleDraftOutreach = async (mqlItem) => {
    if (!mqlItem) { toast.info('Select an MQL first.'); return; }
    toast.info('Outreach agent drafting personalized first-touch...');
    const result = await outreachAgent.activate('cold-email', {
      task: `Draft personalized first-touch email for ${mqlItem.leadName} at ${mqlItem.company}`,
      lead: { name: mqlItem.leadName, company: mqlItem.company, title: mqlItem.title, urgency: mqlItem.urgency },
    });
    setDraftResult(result);
    appendHandoffHistory({ mqlId: mqlItem.id, action: 'outreach_drafted', by: 'Outreach Agent' });
    toast.success('First-touch draft ready.');
  };

  const handleAutoAssignSDR = async () => {
    toast.info('Prospector agent auto-assigning SDRs by workload...');
    const result = await prospectorAgent.activate('revops', {
      task: 'Auto-assign unassigned MQLs to SDRs based on workload, territory, and urgency',
      unassignedCount: unassigned.length,
      sdrs: SDRs.map(s => ({ id: s.id, name: s.name })),
    });
    setAutoAssignResult(result);
    // Mock: assign first unassigned to first available SDR
    unassigned.forEach((item, i) => {
      const sdr = SDRs[i % SDRs.length];
      if (sdr) {
        updateMqlItem(item.id, { assignedSdrId: sdr.id });
        appendHandoffHistory({ mqlId: item.id, sdrId: sdr.id, action: 'auto_assigned', by: 'Prospector Agent' });
      }
    });
    toast.success('SDRs auto-assigned based on workload.');
  };

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
        <div style={{ display: 'flex', gap: S[2], marginTop: S[3] }}>
          <button
            type="button"
            style={{ ...btn.primary, fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: 6 }}
            onClick={() => handleDraftOutreach(selectedLead)}
            disabled={outreachAgent.isActive || !selectedLead}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 3h10M2 7h6M2 11h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
            Draft outreach
          </button>
          <button
            type="button"
            style={{ ...btn.secondary, fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: 6 }}
            onClick={handleAutoAssignSDR}
            disabled={prospectorAgent.isActive || unassigned.length === 0}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="5" cy="5" r="3" stroke="currentColor" strokeWidth="1.1"/><circle cx="10" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.1"/><path d="M8 7l2 2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>
            Auto-assign SDR
          </button>
        </div>
      </div>

      {/* Agent thinking indicators */}
      {(outreachAgent.isActive || prospectorAgent.isActive) && (
        <div style={{ marginBottom: S[4] }}>
          <AgentThinking
            agentId={outreachAgent.isActive ? 'outreach' : 'prospector'}
            task={outreachAgent.isActive ? 'Drafting personalized first-touch email...' : 'Auto-assigning SDRs by workload and territory...'}
          />
        </div>
      )}

      {/* Agent results */}
      {draftResult && !outreachAgent.isActive && (
        <div style={{ marginBottom: S[4] }}>
          <AgentResultPanel result={draftResult} />
        </div>
      )}
      {autoAssignResult && !prospectorAgent.isActive && (
        <div style={{ marginBottom: S[4] }}>
          <AgentResultPanel result={autoAssignResult} />
        </div>
      )}

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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[4] }}>
          <h3 style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary, margin: 0 }}>
            Handoff timeline
          </h3>
          {/* Urgency-based escalation indicator */}
          {mqlQueue.some(m => m.urgency === 'red' || m.urgency === 'overdue') && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: S[2],
              padding: `${S[1]} ${S[3]}`, backgroundColor: C.redDim,
              border: `1px solid ${C.red}30`, borderRadius: R.button,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: C.red, animation: 'urgencyPulse 1s ease-in-out infinite' }} />
              <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.red }}>
                Urgent MQLs escalated for priority processing
              </span>
            </div>
          )}
        </div>
        <style>{`@keyframes urgencyPulse{0%,100%{opacity:.6}50%{opacity:1}}`}</style>
        {/* Agent actions shown in timeline */}
        <div style={{ display: 'flex', gap: S[2], marginBottom: S[3], flexWrap: 'wrap' }}>
          {[
            { label: 'Lead scored by Prospector', color: C.primary },
            { label: 'Outreach drafted by Outreach Agent', color: C.secondary },
            { label: 'SDR assigned by Revenue Agent', color: C.amber },
          ].map((action) => (
            <div key={action.label} style={{
              display: 'inline-flex', alignItems: 'center', gap: S[1],
              padding: `2px ${S[2]}`, backgroundColor: `${action.color}15`,
              border: `1px solid ${action.color}30`, borderRadius: R.sm,
            }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: action.color }} />
              <span style={{ fontFamily: F.body, fontSize: '10px', color: action.color }}>{action.label}</span>
            </div>
          ))}
        </div>
        <HandoffTimeline data={handoffTimelineMock} />
      </div>
    </div>
  );
}
