import { useState } from 'react';
import useToast from '../../../hooks/useToast';
import { useAgent } from '../../../hooks/useAgent';
import AgentThinking from '../../agents/AgentThinking';
import { C, F, R, S, T, Z, btn, inputStyle } from '../../../tokens';
import { CAMPAIGN_PLAN } from '../../../data/campaignPlan';
import { AgentNameWithIcon } from '../../ui/AgentRoleIcon';
import FreyaLogo from '../../ui/FreyaLogo';
import { IconTarget } from '../../ui/Icons';

/* ─── Phase data (command center version) ──────────────────── */
const PHASES = [
  {
    id: 'phase-1',
    name: 'Strategy & ICP',
    dateRange: 'Week 1–2',
    status: 'completed',
    agents: [
      { agentId: 'strategist', name: 'Strategist' },
      { agentId: 'analyst', name: 'Analyst' },
    ],
    tasks: [
      { id: 't1', name: 'Define campaign objective and KPIs', done: true,  agentGenerated: false },
      { id: 't2', name: 'Build MENA Healthcare Donor ICP', done: true,  agentGenerated: true,  agent: { agentId: 'strategist', name: 'Strategist' } },
      { id: 't3', name: 'Competitive analysis: MENA NGOs', done: true,  agentGenerated: true,  agent: { agentId: 'analyst', name: 'Analyst' } },
      { id: 't4', name: 'Positioning brief approved', done: true,  agentGenerated: false },
    ],
  },
  {
    id: 'phase-2',
    name: 'Content Production',
    dateRange: 'Week 3–4',
    status: 'in_progress',
    agents: [
      { agentId: 'copywriter', name: 'Copywriter' },
      { agentId: 'guardian', name: 'Guardian' },
    ],
    tasks: [
      { id: 't5', name: 'Email sequence (5-email nurture)', done: true,  agentGenerated: true,  agent: { agentId: 'copywriter', name: 'Copywriter' } },
      { id: 't6', name: 'LinkedIn ad copy (4 variants)', done: true,  agentGenerated: true,  agent: { agentId: 'copywriter', name: 'Copywriter' } },
      { id: 't7', name: 'Meta ad creative (video + carousel)', done: false, agentGenerated: true,  agent: { agentId: 'copywriter', name: 'Copywriter' } },
      { id: 't8', name: 'Guardian compliance review', done: false, agentGenerated: false },
    ],
  },
  {
    id: 'phase-3',
    name: 'Launch & Outreach',
    dateRange: 'Week 5–6',
    status: 'upcoming',
    agents: [
      { agentId: 'outreach', name: 'Outreach' },
      { agentId: 'freya', name: 'Freya' },
    ],
    tasks: [
      { id: 't9',  name: 'Outreach sequences configured', done: false, agentGenerated: false },
      { id: 't10', name: 'LinkedIn connection campaign live', done: false, agentGenerated: false },
      { id: 't11', name: 'Meta & Google ads go live', done: false, agentGenerated: false },
      { id: 't12', name: 'Freya orchestration briefing', done: false, agentGenerated: true, agent: { agentId: 'freya', name: 'Freya' } },
    ],
  },
  {
    id: 'phase-4',
    name: 'Optimize & Scale',
    dateRange: 'Week 7–8',
    status: 'upcoming',
    agents: [
      { agentId: 'optimizer', name: 'Optimizer' },
      { agentId: 'analyst', name: 'Analyst' },
    ],
    tasks: [
      { id: 't13', name: 'A/B test review: email subject lines', done: false, agentGenerated: false },
      { id: 't14', name: 'Optimizer recommendation: budget shift', done: false, agentGenerated: true, agent: { agentId: 'optimizer', name: 'Optimizer' } },
      { id: 't15', name: 'Scale winning ad creatives', done: false, agentGenerated: false },
      { id: 't16', name: 'Analyst: month-end performance review', done: false, agentGenerated: true, agent: { agentId: 'analyst', name: 'Analyst' } },
    ],
  },
];

const STATUS_CONFIG = {
  completed:   { label: 'Completed',   color: C.green,    bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)',  icon: '✓' },
  in_progress: { label: 'In Progress', color: C.primary,  bg: 'rgba(74,124,111,0.12)', border: 'rgba(74,124,111,0.3)',  icon: '▶' },
  upcoming:    { label: 'Upcoming',    color: C.textMuted, bg: C.surface3,              border: C.border,                icon: '○' },
};

const PLAN_TYPES = [
  { id: 'phased',    label: 'Phased',    desc: 'Multiple phases with milestones' },
  { id: 'single',    label: 'Single',    desc: 'One continuous block' },
  { id: 'always_on', label: 'Always-on', desc: 'Ongoing, no fixed end' },
];

/* ─── Sub-components ────────────────────────────────────────── */
function AgentActionBar({ strategist, onRunStrategist }) {
  const toast = useToast();
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: S[3], flexWrap: 'wrap',
      backgroundColor: C.surface2,
      border: `1px solid ${C.border}`,
      borderRadius: R.md,
      padding: `${S[3]} ${S[4]}`,
    }}>
      <span style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Plan Agents
      </span>
      <div style={{ width: '1px', height: '20px', backgroundColor: C.border }} />
      <button
        onClick={onRunStrategist}
        disabled={strategist.isActive}
        style={{
          ...btn.primary, fontSize: '12px', padding: `${S[1]} ${S[3]}`,
          opacity: strategist.isActive ? 0.7 : 1,
          cursor: strategist.isActive ? 'wait' : 'pointer',
        }}
      >
        <IconTarget color={C.textInverse} width={14} height={14} />
        {strategist.isActive ? 'Generating Plan…' : '▶ Generate Plan'}
      </button>
      <button
        onClick={() => toast.info('Update plan with Freya — opening chat…')}
        style={{ ...btn.secondary, fontSize: '12px', padding: `${S[1]} ${S[3]}` }}
      >
        <FreyaLogo size={16} />
        Update with Freya
      </button>
    </div>
  );
}

function PhaseCard({ phase, taskStatuses, onToggleTask, onGenerateTasks, toast }) {
  const cfg = STATUS_CONFIG[phase.status] || STATUS_CONFIG.upcoming;
  const tasks = phase.tasks;
  const doneCount = tasks.filter(t => (taskStatuses[t.id] !== undefined ? taskStatuses[t.id] : t.done)).length;
  const pct = Math.round((doneCount / tasks.length) * 100);

  return (
    <div style={{
      backgroundColor: C.surface2,
      border: `1px solid ${phase.status === 'in_progress' ? C.primary + '66' : C.border}`,
      borderRadius: R.card,
      overflow: 'hidden',
      boxShadow: phase.status === 'in_progress' ? `0 0 0 1px ${C.primary}22` : 'none',
    }}>
      {/* Phase header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: S[3],
        padding: `${S[3]} ${S[4]}`,
        borderBottom: `1px solid ${C.border}`,
        backgroundColor: phase.status === 'in_progress' ? 'rgba(74,124,111,0.08)' : 'transparent',
      }}>
        {/* Status circle */}
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
          backgroundColor: cfg.bg,
          border: `2px solid ${cfg.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 700, color: cfg.color }}>{cfg.icon}</span>
        </div>

        {/* Phase info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: S[2], flexWrap: 'wrap' }}>
            <span style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary }}>{phase.name}</span>
            <span style={{
              fontFamily: F.mono, fontSize: '10px', fontWeight: 700,
              color: cfg.color, backgroundColor: cfg.bg,
              border: `1px solid ${cfg.border}`,
              borderRadius: R.pill, padding: '1px 8px',
            }}>{cfg.label}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: S[3], marginTop: '3px', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>{phase.dateRange}</span>
            <div style={{ display: 'flex', gap: S[1] }}>
              {phase.agents.map(a => (
                <span key={a.name} style={{ fontFamily: F.mono, fontSize: '10px', color: C.secondary, backgroundColor: 'rgba(107,163,150,0.1)', borderRadius: R.pill, padding: '1px 6px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <AgentNameWithIcon agentId={a.agentId} name={a.name} size={10} gap={3} />
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
          <span style={{ fontFamily: F.mono, fontSize: '12px', fontWeight: 700, color: cfg.color }}>{doneCount}/{tasks.length}</span>
          <div style={{ width: '80px', height: '4px', borderRadius: R.pill, backgroundColor: C.surface3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, backgroundColor: cfg.color, borderRadius: R.pill }} />
          </div>
        </div>
      </div>

      {/* Task list */}
      <div style={{ padding: `${S[2]} ${S[4]}` }}>
        {tasks.map((task, i) => {
          const isDone = taskStatuses[task.id] !== undefined ? taskStatuses[task.id] : task.done;
          return (
            <div key={task.id} style={{
              display: 'flex', alignItems: 'center', gap: S[3],
              padding: `${S[2]} 0`,
              borderBottom: i < tasks.length - 1 ? `1px solid ${C.border}` : 'none',
            }}>
              {/* Checkbox */}
              <div
                onClick={() => onToggleTask(task.id, !isDone)}
                style={{
                  width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0,
                  backgroundColor: isDone ? C.primary : 'transparent',
                  border: `2px solid ${isDone ? C.primary : C.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: T.color,
                }}
              >
                {isDone && <span style={{ color: C.textInverse, fontSize: '11px', fontWeight: 700, lineHeight: 1 }}>✓</span>}
              </div>

              {/* Task name */}
              <span style={{
                fontFamily: F.body, fontSize: '13px',
                color: isDone ? C.textMuted : C.textPrimary,
                textDecoration: isDone ? 'line-through' : 'none',
                flex: 1,
              }}>
                {task.name}
              </span>

              {/* Agent chip */}
              {task.agentGenerated && task.agent && (
                <span style={{ fontFamily: F.mono, fontSize: '9px', fontWeight: 700, color: C.secondary, backgroundColor: 'rgba(107,163,150,0.1)', borderRadius: R.pill, padding: '1px 6px', whiteSpace: 'nowrap', flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <AgentNameWithIcon agentId={task.agent.agentId} name={task.agent.name} size={10} gap={3} />
                </span>
              )}
            </div>
          );
        })}

        {/* Generate tasks CTA */}
        <div style={{ paddingTop: S[2] }}>
          <button
            onClick={() => onGenerateTasks(phase.id)}
            style={{ ...btn.ghost, fontSize: '11px', color: C.secondary, padding: `${S[1]} 0` }}
          >
            + Generate tasks for this phase →
          </button>
        </div>
      </div>
    </div>
  );
}

function FreyaPlanSummary({ approved, onApprove, setTab, planHealth, toast }) {
  const healthColor = planHealth === 'On Track' ? C.green : planHealth === 'At Risk' ? C.amber : C.red;

  return (
    <div style={{
      backgroundColor: C.surface2,
      border: `1px solid rgba(74,124,111,0.4)`,
      borderRadius: R.card,
      overflow: 'hidden',
      position: 'sticky',
      top: S[4],
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: S[2],
        padding: `${S[3]} ${S[4]}`,
        borderBottom: `1px solid ${C.border}`,
        backgroundColor: 'rgba(74,124,111,0.08)',
      }}>
        <span style={{ fontSize: '16px' }}>✦</span>
        <span style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>Freya Plan Summary</span>
      </div>

      <div style={{ padding: S[4], display: 'flex', flexDirection: 'column', gap: S[3] }}>
        {/* Health */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>Plan Health</span>
          <span style={{
            fontFamily: F.mono, fontSize: '13px', fontWeight: 700, color: healthColor,
            backgroundColor: `${healthColor}18`, borderRadius: R.pill, padding: '2px 10px',
          }}>
            {planHealth === 'On Track' ? '✓ ' : planHealth === 'At Risk' ? '⚠ ' : '✗ '}{planHealth}
          </span>
        </div>

        {/* Next action */}
        <div style={{
          backgroundColor: C.surface3, border: `1px solid ${C.border}`,
          borderRadius: R.md, padding: S[3],
        }}>
          <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
            Next Action Needed
          </div>
          <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textPrimary, lineHeight: 1.5 }}>
            Complete Guardian review of Meta ad creative (Phase 2) to unblock campaign launch by Apr 14.
          </div>
        </div>

        {/* Projected completion */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>Projected Completion</span>
          <span style={{ fontFamily: F.mono, fontSize: '12px', fontWeight: 700, color: C.textPrimary }}>May 17, 2026</span>
        </div>

        {/* Phase progress bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
          {PHASES.map(phase => {
            const done = phase.tasks.filter(t => t.done).length;
            const pct = Math.round((done / phase.tasks.length) * 100);
            const cfg = STATUS_CONFIG[phase.status];
            return (
              <div key={phase.id} style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                <span style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted, width: '90px', flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {phase.name}
                </span>
                <div style={{ flex: 1, height: '4px', borderRadius: R.pill, backgroundColor: C.surface3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, backgroundColor: cfg.color, borderRadius: R.pill }} />
                </div>
                <span style={{ fontFamily: F.mono, fontSize: '9px', fontWeight: 700, color: cfg.color, width: '28px', textAlign: 'right' }}>{pct}%</span>
              </div>
            );
          })}
        </div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: C.border }} />

        {/* Approve button */}
        <button
          onClick={onApprove}
          disabled={approved}
          style={{
            ...btn.primary,
            width: '100%', justifyContent: 'center',
            fontSize: '13px',
            opacity: approved ? 0.7 : 1,
          }}
        >
          {approved ? '✓ Plan Approved' : 'Approve & Generate Content →'}
        </button>

        <button
          onClick={() => toast.info('Update plan with Freya — opening chat…')}
          style={{ ...btn.secondary, width: '100%', justifyContent: 'center', fontSize: '12px' }}
        >
          ✦ Update plan with Freya
        </button>
      </div>
    </div>
  );
}

/* ─── TaskDetailPanel (preserved from original) ─────────────── */
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function addDays(dateStr, n) { const d = new Date(dateStr); d.setDate(d.getDate() + n); return d; }
function fmtFull(d) { return `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`; }

/* ─── Main component ────────────────────────────────────────── */
export default function PlanTab({ setTab }) {
  const toast = useToast();
  const strategist = useAgent('strategist');
  const [taskStatuses, setTaskStatuses] = useState({});
  const [planType, setPlanType] = useState('phased');
  const [ariaModifying, setAriaModifying] = useState(false);
  const [approved, setApproved] = useState(false);

  const { phases: originalPhases, totalDays, start: planStart, title } = CAMPAIGN_PLAN;

  const handleGeneratePlan = async () => {
    toast.info('Strategist agent generating plan…');
    await strategist.activate('Generate phased campaign plan with launch-strategy skill', {
      campaignName: title,
      planType,
      totalDays,
    });
    toast.success('Plan generated by Strategist agent');
  };

  const handleToggleTask = (taskId, newValue) => {
    setTaskStatuses(s => ({ ...s, [taskId]: newValue }));
    toast.success(newValue ? 'Task marked complete' : 'Task marked incomplete');
  };

  const handleGenerateTasksForPhase = (phaseId) => {
    toast.info(`Strategist generating tasks for phase…`);
    setTimeout(() => toast.success('3 new tasks added to phase'), 1200);
  };

  const handleApprove = () => {
    setApproved(true);
    toast.success('Plan approved — generating content…');
    if (typeof setTab === 'function') setTab('content');
  };

  const handlePlanTypeChange = (typeId) => {
    if (typeId === planType) return;
    setAriaModifying(true);
    setTimeout(() => {
      setPlanType(typeId);
      setAriaModifying(false);
      toast.success('Freya has updated the plan');
    }, 1200);
  };

  // Calculate overall health
  const totalTasks = PHASES.flatMap(p => p.tasks).length;
  const doneTasks = PHASES.flatMap(p => p.tasks).filter(t => taskStatuses[t.id] !== undefined ? taskStatuses[t.id] : t.done).length;
  const planPct = Math.round((doneTasks / totalTasks) * 100);
  const planHealth = planPct >= 60 ? 'On Track' : planPct >= 40 ? 'At Risk' : 'Behind';

  return (
    <div style={{ padding: S[5], display: 'flex', flexDirection: 'column', gap: S[4] }}>

      {/* Agent Action Bar */}
      <AgentActionBar strategist={strategist} onRunStrategist={handleGeneratePlan} />

      {/* Agent thinking */}
      {strategist.isActive && <AgentThinking agentId="strategist" task="Generating phased campaign plan with launch-strategy skill…" />}

      {/* Plan type + header */}
      <div style={{
        backgroundColor: C.surface2,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
        padding: S[4],
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: S[4], flexWrap: 'wrap',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginBottom: S[1] }}>
            <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.primary, backgroundColor: 'rgba(74,124,111,0.15)', borderRadius: R.pill, padding: '1px 8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              AI-Generated Plan
            </span>
          </div>
          <h2 style={{ fontFamily: F.display, fontSize: '18px', fontWeight: 800, color: C.textPrimary, margin: '0 0 4px', letterSpacing: '-0.02em' }}>{title}</h2>
          <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: `0 0 ${S[3]}` }}>
            {totalDays} days · {originalPhases.length} phases · {CAMPAIGN_PLAN.start} → {CAMPAIGN_PLAN.end}
          </p>
          <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>Plan type:</span>
            {PLAN_TYPES.map(t => (
              <button
                key={t.id}
                onClick={() => handlePlanTypeChange(t.id)}
                disabled={ariaModifying}
                title={t.desc}
                style={{
                  fontFamily: F.body, fontSize: '12px', fontWeight: planType === t.id ? 600 : 400,
                  color: planType === t.id ? C.textInverse : C.textSecondary,
                  backgroundColor: planType === t.id ? C.primary : 'transparent',
                  border: `1px solid ${planType === t.id ? C.primary : C.border}`,
                  borderRadius: R.button,
                  padding: `${S[1]} ${S[3]}`,
                  cursor: ariaModifying ? 'wait' : 'pointer',
                  opacity: ariaModifying ? 0.8 : 1,
                  transition: T.color,
                }}
              >
                {t.label}
              </button>
            ))}
            {ariaModifying && (
              <span style={{ fontFamily: F.body, fontSize: '12px', color: C.primary, fontStyle: 'italic' }}>
                Freya updating plan…
              </span>
            )}
          </div>
        </div>

        {/* Progress summary */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: S[2] }}>
          <span style={{ fontFamily: F.mono, fontSize: '24px', fontWeight: 800, color: C.textPrimary }}>{planPct}%</span>
          <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>overall complete</span>
          <div style={{ width: '120px', height: '6px', borderRadius: R.pill, backgroundColor: C.surface3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${planPct}%`, backgroundColor: C.primary, borderRadius: R.pill, transition: 'width 0.4s ease' }} />
          </div>
        </div>
      </div>

      {/* Two-column: Phase timeline | Freya Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: S[5], alignItems: 'start' }}>

        {/* Phase cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {PHASES.map((phase, i) => (
            <div key={phase.id} style={{ display: 'flex', gap: S[4] }}>
              {/* Timeline connector */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, paddingTop: '16px' }}>
                <div style={{
                  width: '12px', height: '12px', borderRadius: '50%', flexShrink: 0,
                  backgroundColor: STATUS_CONFIG[phase.status].color,
                  border: `2px solid ${STATUS_CONFIG[phase.status].color}`,
                  boxShadow: phase.status === 'in_progress' ? `0 0 8px ${STATUS_CONFIG[phase.status].color}` : 'none',
                }} />
                {i < PHASES.length - 1 && (
                  <div style={{ width: '2px', flex: 1, minHeight: '32px', backgroundColor: i < 1 ? C.primary : C.border, marginTop: '4px' }} />
                )}
              </div>

              {/* Phase card */}
              <div style={{ flex: 1, marginBottom: S[4] }}>
                <PhaseCard
                  phase={phase}
                  taskStatuses={taskStatuses}
                  onToggleTask={handleToggleTask}
                  onGenerateTasks={handleGenerateTasksForPhase}
                  toast={toast}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Freya Plan Summary */}
        <FreyaPlanSummary
          approved={approved}
          onApprove={handleApprove}
          setTab={setTab}
          planHealth={planHealth}
          toast={toast}
        />
      </div>
    </div>
  );
}
