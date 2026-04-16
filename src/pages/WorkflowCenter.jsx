import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { C, F, R, S, T, btn, badge, shadows, scrollbarStyle } from '../tokens';
import useToast from '../hooks/useToast';
import useStore from '../store/useStore';
import { AGENTS } from '../agents/AgentRegistry';
import { WORKFLOWS } from '../freya/workflows/registry';
import { AgentRuntime } from '../agents/AgentRuntime';
import AgentRoleIcon from '../components/ui/AgentRoleIcon';
import { IconClock, IconZap } from '../components/ui/Icons';

/* ─── Workflow outputs metadata ───────────────────────────── */
const WORKFLOW_META = {
  'campaign-launch': {
    outputs: ['Strategy brief (8-12 pages)', '5 email drafts', '2 ad creative variants', 'Outreach sequence (3 steps)', 'Guardian compliance review'],
    lastRun: '4 days ago',
    lastOutcome: 'Generated 3 email variants, 2 LinkedIn ad creatives — 87% Guardian approval rate',
    successRate: '94%',
    avgTime: '9m 34s',
  },
  'content-creation': {
    outputs: ['Content calendar (4 weeks)', '8 content pieces', 'Guardian brand review', 'Channel distribution plan'],
    lastRun: '8 days ago',
    lastOutcome: '8 pieces for Yemen: 3 LinkedIn posts, 2 emails, 2 donation page edits, 1 case study',
    successRate: '96%',
    avgTime: '6m 48s',
  },
  'lead-to-customer': {
    outputs: ['50 enriched & scored leads', 'ICP match report', 'Personalized outreach sequences', 'Revenue forecast delta'],
    lastRun: '10 days ago',
    lastOutcome: '47 leads enriched from MENA scrape. 12 marked warm, 5 fast-tracked to SDR',
    successRate: '88%',
    avgTime: '13m 47s',
  },
  'performance-review': {
    outputs: ['Channel performance audit', 'Anomaly report', 'Revised strategy recommendations', 'Executive summary'],
    lastRun: '7 days ago',
    lastOutcome: 'Identified 23% CTR drop (ANZ), $800 reallocation recommendation, 3 new strategy priorities',
    successRate: '98%',
    avgTime: '6m 12s',
  },
  'seo-audit': {
    outputs: ['SEO health score', 'Priority fix list (ranked)', 'Schema markup changes', 'Content gap analysis', 'Programmatic SEO opportunities'],
    lastRun: '13 days ago',
    lastOutcome: 'medglobal.org: 34 issues found, top 5 fixes estimated +28% organic traffic in 60 days',
    successRate: '82%',
    avgTime: '10m 08s',
  },
  'ab-test': {
    outputs: ['Test hypothesis doc', 'Variant copy/creative', 'Statistical analysis plan', 'Results dashboard setup'],
    lastRun: '3 days ago',
    lastOutcome: '"Save a Life" vs "Donate Now" — variant B +18% CTR at 95% confidence after day 14',
    successRate: '91%',
    avgTime: '7m 22s',
  },
};

/* ─── Past workflow runs ───────────────────────────────────── */
const PAST_RUNS = [
  {
    id: 'r1', workflowName: 'Campaign Launch', date: 'Mar 28, 2026', duration: '9m 34s',
    status: 'completed', outputCount: '3 email drafts, 2 ad creatives, 1 outreach sequence',
    creditsUsed: 118, agents: ['Strategist', 'Copywriter', 'Guardian', 'Outreach'],
  },
  {
    id: 'r2', workflowName: 'Performance Review', date: 'Mar 25, 2026', duration: '6m 12s',
    status: 'completed', outputCount: '1 audit report, 3 recommendations, 1 exec summary',
    creditsUsed: 62, agents: ['Analyst', 'Strategist', 'Freya'],
  },
  {
    id: 'r3', workflowName: 'Lead to Customer', date: 'Mar 22, 2026', duration: '13m 47s',
    status: 'completed', outputCount: '32 leads enriched, 8 sequences drafted, pipeline updated',
    creditsUsed: 98, agents: ['Prospector', 'Analyst', 'Outreach', 'Revenue'],
  },
  {
    id: 'r4', workflowName: 'SEO Audit', date: 'Mar 19, 2026', duration: '10m 08s',
    status: 'failed', outputCount: '18 of 34 issues identified before Copywriter step failed',
    creditsUsed: 45, agents: ['Analyst', 'Copywriter', 'Optimizer'],
  },
  {
    id: 'r5', workflowName: 'A/B Test', date: 'Mar 14, 2026', duration: '7m 22s',
    status: 'completed', outputCount: '2 variants, 1 analysis plan, 1 results dashboard',
    creditsUsed: 71, agents: ['Optimizer', 'Copywriter', 'Analyst'],
  },
];

/* ─── Helpers ──────────────────────────────────────────────── */
function parseStep(stepStr) {
  const [agentId, skill] = stepStr.split(':');
  const agentDef = AGENTS[agentId];
  return { agentId, label: agentDef ? agentDef.displayName : agentId, skill: skill || '' };
}

/* ─── Active Workflow Monitor ─────────────────────────────── */
function ActiveWorkflowMonitor({ activeWorkflow, onPause, onCancel }) {
  if (!activeWorkflow) return null;
  const wf = WORKFLOWS[activeWorkflow.id];
  if (!wf) return null;
  const steps = wf.steps.map(parseStep);
  const currentStep = activeWorkflow.currentStep || 0;
  const elapsed = activeWorkflow.startedAt ? Math.floor((Date.now() - activeWorkflow.startedAt) / 1000) : 0;
  const elapsedStr = elapsed < 60 ? `${elapsed}s` : `${Math.floor(elapsed / 60)}m ${elapsed % 60}s`;
  const progress = Math.round((currentStep / steps.length) * 100);
  const currentAgent = steps[currentStep];

  return (
    <div style={{
      backgroundColor: 'rgba(251,191,36,0.05)', border: `1px solid rgba(251,191,36,0.3)`,
      borderRadius: R.card, padding: S[5], marginBottom: S[5],
      position: 'relative', overflow: 'hidden',
      boxShadow: '0 0 32px rgba(251,191,36,0.08)',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${C.amber}, ${C.primary})` }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: S[4], flexWrap: 'wrap', gap: S[3] }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginBottom: '4px' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: C.amber, animation: 'wcPulse 1.5s ease-in-out infinite' }} />
            <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.amber, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              RUNNING · {elapsedStr} elapsed
            </span>
          </div>
          <div style={{ fontFamily: F.display, fontSize: '20px', fontWeight: 700, color: C.textPrimary, marginBottom: '2px' }}>
            {wf.name}
          </div>
          {currentAgent && (
            <div style={{ fontFamily: F.body, fontSize: '13px', color: C.amber, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <AgentRoleIcon agentId={currentAgent.agentId} size={16} color={C.amber} />
                {currentAgent.label}
              </span>
              <span>— {currentAgent.skill || 'executing'}{currentStep === 1 ? ' — generating email variant 3/5' : ''}</span>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: S[2], flexShrink: 0 }}>
          <button
            onClick={onPause}
            style={{
              fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.amber,
              backgroundColor: 'rgba(251,191,36,0.1)', border: `1px solid rgba(251,191,36,0.3)`,
              borderRadius: R.button, padding: `${S[1]} ${S[3]}`, cursor: 'pointer',
            }}
          >
            ⏸ Pause
          </button>
          <button
            onClick={onCancel}
            style={{
              fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.red,
              backgroundColor: 'rgba(239,68,68,0.1)', border: `1px solid rgba(239,68,68,0.2)`,
              borderRadius: R.button, padding: `${S[1]} ${S[3]}`, cursor: 'pointer',
            }}
          >
            ✕ Cancel
          </button>
        </div>
      </div>

      {/* Step progress bar */}
      <div style={{ marginBottom: S[4] }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>Step {currentStep + 1} of {steps.length}</span>
          <span style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: C.amber }}>{progress}%</span>
        </div>
        <div style={{ height: '5px', backgroundColor: C.surface3, borderRadius: R.pill, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${progress}%`,
            background: `linear-gradient(90deg, ${C.amber}, ${C.primary})`,
            borderRadius: R.pill, transition: 'width 0.5s ease',
          }} />
        </div>
      </div>

      {/* Step chain */}
      <div style={{ display: 'flex', alignItems: 'center', gap: S[1], flexWrap: 'wrap' }}>
        {steps.map((step, i) => {
          const done = i < currentStep;
          const running = i === currentStep;
          const stepC = done ? C.green : running ? C.amber : C.textMuted;
          return (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: S[1] }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '5px 10px',
                backgroundColor: done ? 'rgba(16,185,129,0.1)' : running ? 'rgba(251,191,36,0.1)' : C.surface3,
                border: `1px solid ${done ? 'rgba(16,185,129,0.3)' : running ? 'rgba(251,191,36,0.3)' : C.border}`,
                borderRadius: R.pill,
                fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: stepC,
              }}>
                <AgentRoleIcon agentId={step.agentId} size={14} color={stepC} />
                {step.label}
                {done && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5L8 2.5" stroke={C.green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {running && (
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', border: `1.5px solid ${C.amber}`, borderTopColor: 'transparent', animation: 'wcSpin 0.8s linear infinite' }} />
                )}
              </div>
              {i < steps.length - 1 && (
                <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
                  <path d="M0 4h12M9 1l3 3-3 3" stroke={done ? C.green : C.textMuted} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Workflow Canvas ─────────────────────────────────────── */
function WorkflowCanvas({ selectedWorkflow, runningId }) {
  if (!selectedWorkflow) {
    return (
      <div style={{
        backgroundColor: C.surface, border: `1px dashed ${C.border}`,
        borderRadius: R.card, padding: S[8],
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: '320px', gap: S[4], textAlign: 'center',
      }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: R.card,
          backgroundColor: 'rgba(74,124,111,0.1)', border: `1px solid rgba(74,124,111,0.2)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <IconZap color={C.primary} w={28} />
        </div>
        <div>
          <div style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary, marginBottom: '6px' }}>
            Select a workflow to visualize it
          </div>
          <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
            Click any workflow in the library to see the agent pipeline and expected outputs
          </div>
        </div>
      </div>
    );
  }

  const steps = selectedWorkflow.steps.map(parseStep);
  const isRunning = runningId === selectedWorkflow.id;
  const meta = WORKFLOW_META[selectedWorkflow.id] || {};
  const dataFlows = [
    'Campaign Brief', 'Content Strategy', 'Draft Content', 'Compliance Check',
    'Approved Copy', 'Launch Sequence',
  ];

  return (
    <div style={{
      backgroundColor: C.surface, border: `1px solid ${C.border}`,
      borderRadius: R.card, padding: S[5],
    }}>
      {/* Canvas header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[5] }}>
        <div>
          <div style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary, marginBottom: '2px' }}>
            {selectedWorkflow.name}
          </div>
          <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>
            {selectedWorkflow.description}
          </div>
        </div>
        <div style={{ display: 'flex', gap: S[2], alignItems: 'center' }}>
          <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, backgroundColor: C.surface3, border: `1px solid ${C.border}`, borderRadius: R.pill, padding: '3px 8px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <IconClock color={C.textMuted} width={12} height={12} />
            {selectedWorkflow.estimatedTime}
          </span>
          <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.amber, backgroundColor: 'rgba(251,191,36,0.1)', border: `1px solid rgba(251,191,36,0.2)`, borderRadius: R.pill, padding: '3px 8px' }}>
            {selectedWorkflow.creditCost} credits
          </span>
        </div>
      </div>

      {/* Step boxes */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: S[2], overflowX: 'auto', ...scrollbarStyle, paddingBottom: S[2] }}>
        {steps.map((step, i) => {
          const running = isRunning && i === 0;
          const stepBg = running ? 'rgba(251,191,36,0.1)' : 'rgba(74,124,111,0.08)';
          const stepBorder = running ? 'rgba(251,191,36,0.4)' : 'rgba(74,124,111,0.25)';
          const flow = dataFlows[i] || '';
          const nextFlow = dataFlows[i + 1] || '';
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: S[2], flexShrink: 0 }}>
              <div style={{
                backgroundColor: stepBg, border: `1px solid ${stepBorder}`,
                borderRadius: R.md, padding: S[3],
                minWidth: '110px', textAlign: 'center',
                position: 'relative',
              }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  backgroundColor: running ? 'rgba(251,191,36,0.15)' : C.surface2,
                  border: `2px solid ${running ? C.amber : C.primary}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  lineHeight: 0, margin: '0 auto', marginBottom: S[2],
                  animation: running ? 'wcPulse 1.5s ease-in-out infinite' : 'none',
                }}>
                  <AgentRoleIcon agentId={step.agentId} size={22} color={running ? C.amber : C.primary} />
                </div>
                <div style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 700, color: C.textPrimary, marginBottom: '2px' }}>
                  {step.label}
                </div>
                <div style={{ fontFamily: F.mono, fontSize: '9px', color: running ? C.amber : C.textMuted }}>
                  {step.skill || 'executing'}
                </div>
                {running && (
                  <div style={{ marginTop: S[1], fontFamily: F.mono, fontSize: '9px', color: C.amber, fontWeight: 700 }}>
                    RUNNING
                  </div>
                )}
              </div>
              {i < steps.length - 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
                  <div style={{ fontFamily: F.mono, fontSize: '8px', color: C.textMuted, whiteSpace: 'nowrap', marginBottom: '2px' }}>
                    {flow}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <div style={{ width: '24px', height: '1px', backgroundColor: C.primary }} />
                    <svg width="6" height="8" viewBox="0 0 6 8" fill="none">
                      <path d="M0 0l6 4-6 4V0z" fill={C.primary} />
                    </svg>
                  </div>
                  {nextFlow && (
                    <div style={{ fontFamily: F.mono, fontSize: '8px', color: C.primary, whiteSpace: 'nowrap', marginTop: '2px' }}>
                      {nextFlow}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Output summary */}
      {meta.outputs && (
        <div style={{ marginTop: S[5], borderTop: `1px solid ${C.border}`, paddingTop: S[4] }}>
          <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[3] }}>
            Output Summary
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: S[2] }}>
            {meta.outputs.map((o, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                <span style={{ color: C.green, fontSize: '10px', flexShrink: 0 }}>✓</span>
                <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary }}>{o}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Last run */}
      {meta.lastOutcome && (
        <div style={{ marginTop: S[3], padding: `${S[2]} ${S[3]}`, backgroundColor: C.surface2, borderRadius: R.sm }}>
          <span style={{ fontFamily: F.mono, fontSize: '9px', color: C.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>Last run: </span>
          <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary }}>{meta.lastOutcome}</span>
        </div>
      )}
    </div>
  );
}

/* ─── Workflow Library Item ───────────────────────────────── */
function WorkflowLibraryItem({ workflow, isSelected, onSelect, onRun, runningId }) {
  const steps = workflow.steps.map(parseStep);
  const isRunning = runningId === workflow.id;
  const meta = WORKFLOW_META[workflow.id] || {};

  return (
    <div
      onClick={() => onSelect(workflow)}
      style={{
        backgroundColor: isSelected ? 'rgba(74,124,111,0.1)' : C.surface,
        border: `1px solid ${isSelected ? C.primary : C.border}`,
        borderRadius: R.md, padding: S[3],
        cursor: 'pointer', transition: T.base,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: S[2] }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary, marginBottom: '2px' }}>
            {workflow.name}
          </div>
          <div style={{ display: 'flex', gap: S[1], marginBottom: S[2], flexWrap: 'wrap' }}>
            {steps.map((step, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                <span style={{ fontFamily: F.mono, fontSize: '9px', color: C.textMuted, backgroundColor: C.surface3, border: `1px solid ${C.border}`, borderRadius: R.pill, padding: '1px 5px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <AgentRoleIcon agentId={step.agentId} size={11} color={C.textMuted} />
                  {step.label}
                </span>
                {i < steps.length - 1 && <span style={{ color: C.textMuted, fontSize: '9px' }}>→</span>}
              </span>
            ))}
          </div>
          {meta.lastRun && (
            <div style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted }}>
              Last run: {meta.lastRun} · {meta.successRate} success
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: S[1], flexShrink: 0, marginLeft: S[2] }}>
          <span style={{ fontFamily: F.mono, fontSize: '9px', color: C.amber, backgroundColor: 'rgba(251,191,36,0.1)', border: `1px solid rgba(251,191,36,0.2)`, borderRadius: R.pill, padding: '2px 6px' }}>
            {workflow.creditCost}cr
          </span>
        </div>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onRun(workflow); }}
        style={{
          fontFamily: F.body, fontSize: '11px', fontWeight: 600,
          color: isRunning ? C.textMuted : C.textInverse,
          backgroundColor: isRunning ? C.surface3 : C.primary,
          border: `1px solid ${isRunning ? C.border : C.primary}`,
          borderRadius: R.button, padding: `3px ${S[3]}`,
          cursor: isRunning ? 'not-allowed' : 'pointer', width: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: S[1],
        }}
        disabled={isRunning}
      >
        {isRunning ? (
          <>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', border: `1.5px solid ${C.textMuted}`, borderTopColor: 'transparent', animation: 'wcSpin 0.8s linear infinite' }} />
            Running…
          </>
        ) : '▶ Run →'}
      </button>
    </div>
  );
}

/* ─── Past Run Row ────────────────────────────────────────── */
function PastRunRow({ run, onView }) {
  const statusMap = {
    completed: { color: C.green, bg: 'rgba(16,185,129,0.1)', label: 'Completed' },
    failed:    { color: C.red, bg: 'rgba(239,68,68,0.1)', label: 'Failed' },
    partial:   { color: C.amber, bg: 'rgba(251,191,36,0.1)', label: 'Partial' },
  };
  const s = statusMap[run.status] || statusMap.completed;

  return (
    <div style={{
      backgroundColor: C.surface, border: `1px solid ${C.border}`,
      borderRadius: R.md, padding: `${S[3]} ${S[4]}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>{run.workflowName}</span>
        <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: s.color, backgroundColor: s.bg, borderRadius: R.pill, padding: '2px 7px' }}>
          {s.label}
        </span>
      </div>
      <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary, marginBottom: S[2] }}>
        {run.outputCount}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: S[2] }}>
        <div style={{ display: 'flex', gap: S[3] }}>
          <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>{run.date}</span>
          <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>{run.duration}</span>
          <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.amber }}>{run.creditsUsed} cr</span>
        </div>
        <button
          onClick={() => onView(run)}
          style={{
            fontFamily: F.body, fontSize: '10px', fontWeight: 600, color: C.primary,
            backgroundColor: 'transparent', border: `1px solid rgba(74,124,111,0.3)`,
            borderRadius: R.sm, padding: `2px ${S[2]}`, cursor: 'pointer',
          }}
        >
          View outputs
        </button>
      </div>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────── */
export default function WorkflowCenter() {
  const navigate  = useNavigate();
  const toast     = useToast();

  const agentStatuses    = useStore((s) => s.agents.statuses);
  const activeWorkflow   = useStore((s) => s.agents.activeWorkflow);
  const setActiveWorkflow = useStore((s) => s.setActiveWorkflow);

  const [runningId, setRunningId]           = useState(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [runDropdownOpen, setRunDropdownOpen]   = useState(false);

  const allWorkflows = Object.values(WORKFLOWS);
  const readyCount   = Object.values(AGENTS).length;

  const activeAgentCount = Object.values(agentStatuses).filter(
    (s) => s?.status === 'thinking' || s?.status === 'executing'
  ).length;

  const handleRunWorkflow = (workflow) => {
    if (runningId) { toast.warning('A workflow is already running.'); return; }
    setRunningId(workflow.id);
    setSelectedWorkflow(workflow);
    if (setActiveWorkflow) setActiveWorkflow({ id: workflow.id, currentStep: 0, startedAt: Date.now() });
    toast.info(`Starting ${workflow.name} workflow…`);
    const firstAgentId = workflow.steps[0]?.split(':')[0] || 'freya';
    AgentRuntime.activateAgent(firstAgentId, { description: `${workflow.name} — step 1`, category: workflow.steps[0]?.split(':')[1] }, {})
      .then(() => {
        toast.success(`${workflow.name} completed`);
        setRunningId(null);
        if (setActiveWorkflow) setActiveWorkflow(null);
      })
      .catch(() => {
        toast.error(`${workflow.name} encountered an error`);
        setRunningId(null);
        if (setActiveWorkflow) setActiveWorkflow(null);
      });
  };

  const handlePause = () => {
    toast.info('Workflow paused — agents will finish their current task before stopping.');
    setRunningId(null);
    if (setActiveWorkflow) setActiveWorkflow(null);
  };

  const handleCancel = () => {
    toast.warning('Workflow cancelled.');
    setRunningId(null);
    if (setActiveWorkflow) setActiveWorkflow(null);
  };

  return (
    <div style={{ padding: `${S[6]} ${S[6]} ${S[8]}`, minHeight: '100vh', backgroundColor: C.bg, animation: 'fadeIn 0.3s ease' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: S[5], flexWrap: 'wrap', gap: S[3] }}>
        <div>
          <h1 style={{ fontFamily: F.display, fontSize: '28px', fontWeight: 800, color: C.textPrimary, margin: 0, letterSpacing: '-0.03em' }}>
            Workflow Center
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: S[3], marginTop: S[2] }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: S[2], backgroundColor: 'rgba(74,124,111,0.1)', border: `1px solid rgba(74,124,111,0.25)`, borderRadius: R.pill, padding: `3px ${S[3]}` }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: C.primary, boxShadow: `0 0 5px ${C.primary}`, animation: 'wcPulse 2s ease-in-out infinite' }} />
              <span style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: C.primary }}>
                {readyCount} agents ready
              </span>
            </div>
            {activeAgentCount > 0 && (
              <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.amber }}>
                {activeAgentCount} active now
              </span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: S[2], alignItems: 'center' }}>
          <button
            onClick={() => navigate('/agents')}
            style={{ ...btn.secondary, fontSize: '13px' }}
          >
            Agent Roster →
          </button>
          {/* Run Workflow dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setRunDropdownOpen(!runDropdownOpen)}
              style={{ ...btn.primary, fontSize: '13px', gap: S[2] }}
            >
              ▶ Run Workflow
              <span style={{ fontSize: '10px' }}>▾</span>
            </button>
            {runDropdownOpen && (
              <div style={{
                position: 'absolute', top: '100%', right: 0, marginTop: '4px',
                backgroundColor: C.surface, border: `1px solid ${C.border}`,
                borderRadius: R.md, boxShadow: shadows.dropdown,
                zIndex: 100, minWidth: '200px',
                padding: S[1],
              }}>
                {allWorkflows.map((wf) => (
                  <button
                    key={wf.id}
                    onClick={() => { setRunDropdownOpen(false); handleRunWorkflow(wf); }}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      fontFamily: F.body, fontSize: '13px', fontWeight: 500,
                      color: C.textPrimary, backgroundColor: 'transparent', border: 'none',
                      borderRadius: R.sm, padding: `${S[2]} ${S[3]}`,
                      cursor: 'pointer',
                    }}
                  >
                    {wf.name}
                    <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, marginLeft: S[2] }}>
                      {wf.creditCost}cr
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Active Workflow Monitor (full width if running) ── */}
      {(activeWorkflow || runningId) && (
        <ActiveWorkflowMonitor
          activeWorkflow={activeWorkflow || (runningId ? { id: runningId, currentStep: 0, startedAt: Date.now() } : null)}
          onPause={handlePause}
          onCancel={handleCancel}
        />
      )}

      {/* ── 3-column grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 280px', gap: S[4], alignItems: 'start' }}>

        {/* ── LEFT: Workflow Library ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
          <div>
            <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary, marginBottom: '2px' }}>
              Workflow Library
            </div>
            <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>
              {allWorkflows.length} pre-built pipelines
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[2], maxHeight: '70vh', overflowY: 'auto', ...scrollbarStyle }}>
            {allWorkflows.map((wf) => (
              <WorkflowLibraryItem
                key={wf.id}
                workflow={wf}
                isSelected={selectedWorkflow?.id === wf.id}
                onSelect={setSelectedWorkflow}
                onRun={handleRunWorkflow}
                runningId={runningId}
              />
            ))}
          </div>
          <button
            onClick={() => toast.info('Custom workflow builder coming soon.')}
            style={{ ...btn.secondary, fontSize: '12px', width: '100%', justifyContent: 'center' }}
          >
            + New Workflow
          </button>
        </div>

        {/* ── CENTER: Workflow Canvas ── */}
        <div>
          <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary, marginBottom: S[3] }}>
            Workflow Canvas
          </div>
          <WorkflowCanvas selectedWorkflow={selectedWorkflow} runningId={runningId} />
        </div>

        {/* ── RIGHT: History + Outputs ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
          {/* Metrics */}
          <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card, padding: S[4] }}>
            <div style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary, marginBottom: S[3] }}>
              Team Metrics
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[3] }}>
              {[
                { label: 'Success Rate', value: '92%', color: C.green },
                { label: 'Avg Duration', value: '9.2m', color: C.primary },
                { label: 'Total Runs', value: '48', color: C.textPrimary },
                { label: 'Credits Used', value: '4,820', color: C.amber },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ textAlign: 'center', padding: S[2], backgroundColor: C.surface2, borderRadius: R.sm }}>
                  <div style={{ fontFamily: F.mono, fontSize: '18px', fontWeight: 700, color, lineHeight: 1, marginBottom: '2px' }}>{value}</div>
                  <div style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* History */}
          <div>
            <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary, marginBottom: S[3] }}>
              Recent Runs
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[2], maxHeight: '50vh', overflowY: 'auto', ...scrollbarStyle }}>
              {PAST_RUNS.map((run) => (
                <PastRunRow
                  key={run.id}
                  run={run}
                  onView={(r) => toast.info(`Viewing outputs for ${r.workflowName} — ${r.date}`)}
                />
              ))}
            </div>
          </div>

          {/* Memory link */}
          <button
            onClick={() => navigate('/aria/memory')}
            style={{ ...btn.secondary, fontSize: '12px', width: '100%', justifyContent: 'center' }}
          >
            View Memory Engine →
          </button>
        </div>
      </div>

      <style>{`
        @keyframes wcPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.75)} }
        @keyframes wcSpin  { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
