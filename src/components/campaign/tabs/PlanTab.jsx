import { useState } from 'react';
import useToast from '../../../hooks/useToast';
import { C, F, R, S, T, Z, btn, inputStyle } from '../../../tokens';
import { CAMPAIGN_PLAN } from '../../../data/campaignPlan';

// ── Layout constants ──────────────────────────
const TASK_H = 40; // px — each task row

// ── Status palette ────────────────────────────
const STATUS = {
  done:        { label: 'Done',        color: '#3DDC84', bg: 'rgba(61,220,132,0.12)',  border: 'rgba(61,220,132,0.25)'  },
  in_progress: { label: 'In Progress', color: '#5EEAD4', bg: 'rgba(94,234,212,0.12)',  border: 'rgba(94,234,212,0.25)'  },
  pending:     { label: 'Pending',     color: '#3A5242', bg: 'rgba(58,82,66,0.18)',     border: 'rgba(58,82,66,0.35)'    },
};

const thStyle = {
  fontFamily: F.body, fontSize: '11px', fontWeight: 700, color: C.textMuted,
  textTransform: 'uppercase', letterSpacing: '0.06em', padding: `${S[2]} ${S[3]}`,
};
const tdStyle = {
  padding: `${S[2]} ${S[3]}`, fontSize: '12px', verticalAlign: 'middle',
};

// ── Date helpers ──────────────────────────────
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function addDays(dateStr, n) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return d;
}
function fmtShort(d) {
  return `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}`;
}
function fmtFull(d) {
  return `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

// ── Table helpers ─────────────────────────────
function getAllTasks(phases) {
  return phases.flatMap(p => p.tasks);
}

// ── OwnerAvatar ───────────────────────────────
function OwnerAvatar({ initials, color }) {
  return (
    <div style={{
      width: '24px', height: '24px', borderRadius: '50%',
      backgroundColor: `${color}1E`,
      border: `1px solid ${color}44`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: F.mono, fontSize: '9px', fontWeight: 700,
      color, flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

// ── StatusBadge ───────────────────────────────
function StatusBadge({ status }) {
  const st = STATUS[status] ?? STATUS.pending;
  return (
    <span style={{
      backgroundColor: st.bg, color: st.color,
      border: `1px solid ${st.border}`,
      borderRadius: R.pill, padding: '1px 6px',
      fontFamily: F.mono, fontSize: '9px', fontWeight: 700,
      letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap',
    }}>
      {st.label}
    </span>
  );
}

// ── TaskDetailPanel ───────────────────────────
function TaskDetailPanel({ task, phases, statuses, notes, onStatusChange, onNotesChange, onClose }) {
  const toast    = useToast();
  const isOpen   = !!task;
  const status   = task ? (statuses[task.id] ?? task.status) : 'pending';
  const noteVal  = task ? (notes[task.id]    ?? '')          : '';
  const phase    = task ? phases.find(p => p.tasks.some(t => t.id === task.id)) : null;
  const color    = phase?.color ?? '#6B9478';
  const startDt  = task ? addDays(CAMPAIGN_PLAN.start, task.start) : null;
  const endDt    = task ? addDays(CAMPAIGN_PLAN.start, task.start + task.duration - 1) : null;
  const allTasks = getAllTasks(phases);

  return (
    <>
      {/* Dim overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(7,13,9,0.52)',
          zIndex: Z.overlay,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
        }}
      />

      {/* Slide-in panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: '320px',
        backgroundColor: C.surface,
        borderLeft: `1px solid ${task ? color + '55' : C.border}`,
        zIndex: Z.modal,
        display: 'flex', flexDirection: 'column',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.25s ease, border-color 0.25s ease',
        boxShadow: isOpen ? '-16px 0 48px rgba(0,0,0,0.42)' : 'none',
      }}>
        {task && (
          <>
            {/* Panel header */}
            <div style={{
              padding: `${S[5]} ${S[5]} ${S[4]}`,
              borderBottom: `1px solid ${C.border}`,
              display: 'flex', flexDirection: 'column', gap: S[3],
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  backgroundColor: `${color}1E`, color,
                  border: `1px solid ${color}40`,
                  borderRadius: R.pill, padding: `2px ${S[2]}`,
                  fontFamily: F.mono, fontSize: '10px', fontWeight: 700, letterSpacing: '0.07em',
                }}>
                  {phase?.name ?? 'Task'}
                </span>
                <button
                  style={{ ...btn.icon, padding: '4px', color: C.textMuted }}
                  onClick={onClose}
                >
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path d="M11.5 3.5l-8 8M3.5 3.5l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              <h3 style={{
                fontFamily: F.display, fontSize: '17px', fontWeight: 800,
                color: C.textPrimary, margin: 0, lineHeight: 1.3, letterSpacing: '-0.01em',
              }}>
                {task.name}
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                <OwnerAvatar initials={task.owner} color={color} />
                <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>
                  {task.owner}
                </span>
                <StatusBadge status={status} />
              </div>
            </div>

            {/* Panel body */}
            <div style={{
              flex: 1, overflowY: 'auto', padding: S[5],
              display: 'flex', flexDirection: 'column', gap: S[4],
              scrollbarWidth: 'thin', scrollbarColor: `${C.border} transparent`,
            }}>
              {/* Start / End dates */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[3] }}>
                {[
                  { label: 'Start Date', value: startDt ? fmtFull(startDt) : '—' },
                  { label: 'End Date',   value: endDt   ? fmtFull(endDt)   : '—' },
                ].map(f => (
                  <div key={f.label}>
                    <div style={{
                      fontFamily: F.body, fontSize: '10px', fontWeight: 700,
                      color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em',
                      marginBottom: S[1],
                    }}>
                      {f.label}
                    </div>
                    <div style={{ fontFamily: F.mono, fontSize: '12px', color: C.textPrimary }}>
                      {f.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Duration */}
              <div>
                <div style={{
                  fontFamily: F.body, fontSize: '10px', fontWeight: 700,
                  color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em',
                  marginBottom: S[1],
                }}>
                  Duration
                </div>
                <div style={{ fontFamily: F.mono, fontSize: '12px', color: C.textPrimary }}>
                  {task.duration} day{task.duration !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Status dropdown */}
              <div>
                <div style={{
                  fontFamily: F.body, fontSize: '10px', fontWeight: 700,
                  color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em',
                  marginBottom: S[1],
                }}>
                  Status
                </div>
                <select
                  value={status}
                  onChange={e => onStatusChange(task.id, e.target.value)}
                  style={{
                    ...inputStyle,
                    fontSize: '13px', cursor: 'pointer',
                    appearance: 'none', WebkitAppearance: 'none',
                  }}
                >
                  <option value="done">Done</option>
                  <option value="in_progress">In Progress</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              {/* Notes textarea */}
              <div>
                <div style={{
                  fontFamily: F.body, fontSize: '10px', fontWeight: 700,
                  color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em',
                  marginBottom: S[1],
                }}>
                  Notes
                </div>
                <textarea
                  value={noteVal}
                  onChange={e => onNotesChange(task.id, e.target.value)}
                  placeholder="Add notes about this task…"
                  rows={4}
                  style={{
                    ...inputStyle, resize: 'vertical',
                    lineHeight: 1.6, fontSize: '13px',
                    fontFamily: F.body, boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Dependencies */}
              {task.dependencies.length > 0 && (
                <div>
                  <div style={{
                    fontFamily: F.body, fontSize: '10px', fontWeight: 700,
                    color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em',
                    marginBottom: S[1],
                  }}>
                    Depends on
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[1] }}>
                    {task.dependencies.map(depId => {
                      const dep = allTasks.find(t => t.id === depId);
                      return dep ? (
                        <span key={depId} style={{
                          backgroundColor: 'rgba(245,200,66,0.1)', color: '#F5C842',
                          border: '1px solid rgba(245,200,66,0.25)',
                          borderRadius: R.pill, padding: `2px ${S[2]}`,
                          fontFamily: F.body, fontSize: '11px',
                        }}>
                          {dep.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Panel footer */}
            <div style={{ padding: S[5], borderTop: `1px solid ${C.border}` }}>
              <button
                style={{ ...btn.primary, width: '100%', justifyContent: 'center', fontSize: '13px' }}
                onClick={() => { toast.success(`"${task.name}" updated`); onClose(); }}
              >
                Update Task
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

// ── SummaryBar ────────────────────────────────
function SummaryBar({ phases, taskStatuses }) {
  const all     = getAllTasks(phases);
  const total   = all.length;
  const done    = all.filter(t => (taskStatuses[t.id] ?? t.status) === 'done').length;
  const inProg  = all.filter(t => (taskStatuses[t.id] ?? t.status) === 'in_progress').length;
  const pending = all.filter(t => (taskStatuses[t.id] ?? t.status) === 'pending').length;
  const pct     = Math.round((done / total) * 100);

  const endDate  = new Date(CAMPAIGN_PLAN.end);
  const today    = new Date();
  const daysRem  = Math.max(0, Math.ceil((endDate - today) / 86400000));

  const chip = (label, value, color) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
      <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>{label}</span>
      <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 700, color: color ?? C.textPrimary }}>
        {value}
      </span>
    </div>
  );

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: S[4], flexWrap: 'wrap',
      padding: `${S[3]} ${S[5]}`,
      borderTop: `1px solid ${C.border}`,
      backgroundColor: C.surface2,
    }}>
      {chip('Total tasks', total)}
      <div style={{ width: '1px', height: '14px', backgroundColor: C.border }} />
      {chip('Done', done, '#3DDC84')}
      {chip('In progress', inProg, '#5EEAD4')}
      {chip('Pending', pending, C.textMuted)}

      <div style={{ flex: 1 }} />

      {/* Overall progress bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
        <div style={{
          width: '140px', height: '6px', borderRadius: R.pill,
          backgroundColor: C.surface3, overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', width: `${pct}%`,
            backgroundColor: '#3DDC84', borderRadius: R.pill,
            boxShadow: '0 0 8px rgba(61,220,132,0.45)',
            transition: 'width 0.4s ease',
          }} />
        </div>
        <span style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: '#3DDC84', minWidth: '30px' }}>
          {pct}%
        </span>
      </div>

      <div style={{ width: '1px', height: '14px', backgroundColor: C.border }} />

      <div style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted, whiteSpace: 'nowrap' }}>
        Days remaining:{' '}
        <span style={{ color: C.textPrimary, fontWeight: 700 }}>{daysRem}</span>
      </div>
    </div>
  );
}

const PLAN_TYPES = [
  { id: 'phased', label: 'Phased campaign', description: 'Multiple phases with clear milestones' },
  { id: 'single', label: 'Single phase', description: 'One continuous execution block' },
  { id: 'always_on', label: 'Always-on', description: 'Ongoing with no fixed end date' },
];

// ── PlanTab ───────────────────────────────────
export default function PlanTab({ setTab }) {
  const toast = useToast();
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskStatuses, setTaskStatuses] = useState({});
  const [taskNotes, setTaskNotes] = useState({});
  const [planType, setPlanType] = useState('phased');
  const [ariaModifying, setAriaModifying] = useState(false);
  const [approved, setApproved] = useState(false);

  const { phases, totalDays, start: planStart, title } = CAMPAIGN_PLAN;

  const getStatus = (task) => taskStatuses[task.id] ?? task.status;

  const handlePlanTypeChange = (typeId) => {
    if (typeId === planType) return;
    setAriaModifying(true);
    setTimeout(() => {
      setPlanType(typeId);
      setAriaModifying(false);
      toast.success('Freya has updated the plan.');
    }, 1200);
  };

  const handleApproveAndGenerate = () => {
    setApproved(true);
    toast.success('Plan approved. Generating content…');
    if (typeof setTab === 'function') setTab('content');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <TaskDetailPanel
        task={selectedTask}
        phases={phases}
        statuses={taskStatuses}
        notes={taskNotes}
        onStatusChange={(id, val) => setTaskStatuses(p => ({ ...p, [id]: val }))}
        onNotesChange={(id, val)  => setTaskNotes(p    => ({ ...p, [id]: val }))}
        onClose={() => setSelectedTask(null)}
      />

      {/* ── AI-generated plan header + type + approve ───────── */}
      <div style={{
        padding: S[5],
        backgroundColor: C.surface2,
        borderBottom: `1px solid ${C.border}`,
        display: 'flex',
        flexDirection: 'column',
        gap: S[4],
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: S[4] }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginBottom: S[1] }}>
              <span style={{
                fontFamily: F.mono,
                fontSize: '10px',
                fontWeight: 700,
                color: C.primary,
                backgroundColor: C.primaryGlow,
                padding: '2px 8px',
                borderRadius: R.pill,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}>
                AI-generated campaign plan
              </span>
            </div>
            <h2 style={{ fontFamily: F.display, fontSize: '18px', fontWeight: 800, color: C.textPrimary, margin: '0 0 4px', letterSpacing: '-0.02em' }}>
              {title}
            </h2>
            <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: 0 }}>
              {totalDays} days · {phases.length} phases · {CAMPAIGN_PLAN.start} → {CAMPAIGN_PLAN.end}
            </p>
          </div>
          <button
            type="button"
            onClick={handleApproveAndGenerate}
            disabled={approved}
            style={{
              ...btn.primary,
              fontSize: '14px',
              padding: `${S[3]} ${S[5]}`,
              opacity: approved ? 0.7 : 1,
            }}
          >
            {approved ? 'Approved — go to Content' : 'Approve & generate content'}
          </button>
        </div>

        <div>
          <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, marginBottom: S[2] }}>
            Plan type — modify and Freya will update the plan
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[2] }}>
            {PLAN_TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handlePlanTypeChange(t.id)}
                disabled={ariaModifying}
                style={{
                  padding: `${S[2]} ${S[4]}`,
                  fontFamily: F.body,
                  fontSize: '13px',
                  fontWeight: planType === t.id ? 600 : 500,
                  color: planType === t.id ? C.primary : C.textSecondary,
                  backgroundColor: planType === t.id ? C.primaryGlow : C.surface3,
                  border: `1px solid ${planType === t.id ? C.primary : C.border}`,
                  borderRadius: R.button,
                  cursor: ariaModifying ? 'wait' : 'pointer',
                  opacity: ariaModifying ? 0.8 : 1,
                  textAlign: 'left',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
          {ariaModifying && (
            <p style={{ fontFamily: F.body, fontSize: '12px', color: C.primary, marginTop: S[2], marginBottom: 0 }}>
              Freya is updating the plan…
            </p>
          )}
        </div>
      </div>

      {/* ── Phases table ───────────────────────── */}
      <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: F.body }}>
          <thead>
            <tr style={{ backgroundColor: C.surface3, borderBottom: `2px solid ${C.border}` }}>
              <th style={{ ...thStyle, position: 'sticky', top: 0, zIndex: 1, backgroundColor: C.surface3, width: '14%', minWidth: 120, textAlign: 'left', paddingLeft: S[4] }}>Phase</th>
              <th style={{ ...thStyle, position: 'sticky', top: 0, zIndex: 1, backgroundColor: C.surface3, width: '12%', minWidth: 100 }}>Date range</th>
              <th style={{ ...thStyle, position: 'sticky', top: 0, zIndex: 1, backgroundColor: C.surface3, width: '22%', minWidth: 160, textAlign: 'left' }}>Task</th>
              <th style={{ ...thStyle, position: 'sticky', top: 0, zIndex: 1, backgroundColor: C.surface3, width: '8%', minWidth: 56 }}>Owner</th>
              <th style={{ ...thStyle, position: 'sticky', top: 0, zIndex: 1, backgroundColor: C.surface3, width: '12%', minWidth: 90 }}>Start</th>
              <th style={{ ...thStyle, position: 'sticky', top: 0, zIndex: 1, backgroundColor: C.surface3, width: '12%', minWidth: 90 }}>End</th>
              <th style={{ ...thStyle, position: 'sticky', top: 0, zIndex: 1, backgroundColor: C.surface3, width: '8%', minWidth: 64 }}>Duration</th>
              <th style={{ ...thStyle, position: 'sticky', top: 0, zIndex: 1, backgroundColor: C.surface3, width: '12%', minWidth: 90 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {phases.map((phase) =>
              phase.tasks.map((task, taskIndex) => {
                const status = getStatus(task);
                const startDate = addDays(planStart, task.start);
                const endDate = addDays(planStart, task.start + task.duration - 1);
                const isFirstTaskInPhase = taskIndex === 0;
                return (
                  <tr
                    key={task.id}
                    style={{
                      height: TASK_H,
                      backgroundColor: isFirstTaskInPhase ? `${phase.color}0C` : 'transparent',
                      borderBottom: `1px solid ${C.border}`,
                      cursor: 'pointer',
                      transition: T.color,
                    }}
                    onClick={() => setSelectedTask(task)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = C.surface2;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isFirstTaskInPhase ? `${phase.color}0C` : 'transparent';
                    }}
                  >
                    <td style={{ ...tdStyle, paddingLeft: S[4], borderLeft: `4px solid ${phase.color}` }}>
                      {isFirstTaskInPhase ? (
                        <span style={{ fontFamily: F.display, fontWeight: 700, fontSize: '13px', color: C.textPrimary }}>
                          {phase.name}
                        </span>
                      ) : (
                        <span style={{ color: C.textMuted, fontSize: '12px' }}>↳</span>
                      )}
                    </td>
                    <td style={tdStyle}>
                      {isFirstTaskInPhase ? (
                        <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textSecondary }}>{phase.dateRange}</span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td style={{ ...tdStyle, fontFamily: F.body, fontSize: '13px', color: C.textPrimary }}>{task.name}</td>
                    <td style={tdStyle}>
                      <OwnerAvatar initials={task.owner} color={phase.color} />
                    </td>
                    <td style={{ ...tdStyle, fontFamily: F.mono, fontSize: '11px', color: C.textSecondary }}>{fmtShort(startDate)}</td>
                    <td style={{ ...tdStyle, fontFamily: F.mono, fontSize: '11px', color: C.textSecondary }}>{fmtShort(endDate)}</td>
                    <td style={tdStyle}>
                      <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>{task.duration}d</span>
                    </td>
                    <td style={tdStyle}>
                      <StatusBadge status={status} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Summary bar ──────────────────────── */}
      <SummaryBar phases={phases} taskStatuses={taskStatuses} />
    </div>
  );
}
