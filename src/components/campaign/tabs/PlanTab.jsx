import { useState } from 'react';
import useToast from '../../../hooks/useToast';
import { C, F, R, S, T, Z, btn, inputStyle } from '../../../tokens';
import { IconCheck } from '../../ui/Icons';
import { CAMPAIGN_PLAN } from '../../../data/campaignPlan';

// ── Layout constants ──────────────────────────
const PANEL_W   = 280;  // px — left label column
const RULER_H   = 52;   // px — date ruler height
const PHASE_H   = 38;   // px — phase header row
const TASK_H    = 38;   // px — each task row

const ZOOM_LEVELS = [8, 14, 22, 32]; // px per day

// ── Status palette ────────────────────────────
const STATUS = {
  done:        { label: 'Done',        color: '#3DDC84', bg: 'rgba(61,220,132,0.12)',  border: 'rgba(61,220,132,0.25)'  },
  in_progress: { label: 'In Progress', color: '#5EEAD4', bg: 'rgba(94,234,212,0.12)',  border: 'rgba(94,234,212,0.25)'  },
  pending:     { label: 'Pending',     color: '#3A5242', bg: 'rgba(58,82,66,0.18)',     border: 'rgba(58,82,66,0.35)'    },
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
function getWeekTicks(startDateStr, totalDays) {
  const ticks = [];
  for (let day = 0; day < totalDays; day += 7) {
    ticks.push({ day, date: addDays(startDateStr, day) });
  }
  return ticks;
}
function getMonthBoundaries(startDateStr, totalDays) {
  const labels = [];
  const origin = new Date(startDateStr);
  let cursor   = new Date(origin);
  while (true) {
    const dayOffset = Math.round((cursor - origin) / 86400000);
    if (dayOffset >= totalDays) break;
    labels.push({ day: dayOffset, label: MONTHS_SHORT[cursor.getMonth()] });
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
  }
  return labels;
}

// ── Gantt position helpers ────────────────────
function getAllTasks(phases) {
  return phases.flatMap(p => p.tasks);
}

// Y center of a task measured from top of phases area (below ruler)
function getTaskSvgY(taskId, phases, collapsed) {
  let y = 0;
  for (const phase of phases) {
    y += PHASE_H;
    if (!collapsed.has(phase.id)) {
      for (let i = 0; i < phase.tasks.length; i++) {
        if (phase.tasks[i].id === taskId) return y + i * TASK_H + TASK_H / 2;
      }
      y += phase.tasks.length * TASK_H;
    }
  }
  return null;
}

function totalPhasesH(phases, collapsed) {
  return phases.reduce((acc, ph) => {
    return acc + PHASE_H + (collapsed.has(ph.id) ? 0 : ph.tasks.length * TASK_H);
  }, 0);
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

// ── GanttBar ──────────────────────────────────
function GanttBar({ task, dayPx, status }) {
  const st        = STATUS[status] ?? STATUS.pending;
  const isDone    = status === 'done';
  const isInProg  = status === 'in_progress';
  const isPending = status === 'pending';
  const left  = task.start * dayPx;
  const width = Math.max(task.duration * dayPx, 6);

  return (
    <div style={{
      position: 'absolute',
      left,
      top: '9px',
      width,
      height: TASK_H - 18,
      borderRadius: R.pill,
      backgroundColor: isPending ? '#0C1510' : st.color,
      border: isPending ? `1.5px dashed ${C.border}` : 'none',
      boxShadow: isDone ? `0 0 8px ${st.color}50` : 'none',
      overflow: 'hidden',
    }}>
      {/* Animated shimmer stripe for in_progress */}
      {isInProg && (
        <div
          className="plan-shimmer"
          style={{
            position: 'absolute',
            top: 0, bottom: 0,
            width: '45%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)',
            transform: 'skewX(-18deg)',
          }}
        />
      )}
      {/* Checkmark for done */}
      {isDone && (
        <span style={{
          position: 'absolute', right: '5px', top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <IconCheck color="#070D09" width={12} height={12} />
        </span>
      )}
    </div>
  );
}

// ── DependencyArrows (SVG overlay) ───────────
function DependencyArrows({ phases, collapsed, dayPx, totalH }) {
  const allTasks = getAllTasks(phases);
  const taskMap  = Object.fromEntries(allTasks.map(t => [t.id, t]));
  const arrows   = [];

  for (const phase of phases) {
    if (collapsed.has(phase.id)) continue;
    for (const task of phase.tasks) {
      for (const depId of task.dependencies) {
        const dep      = taskMap[depId];
        if (!dep) continue;
        const depPhase = phases.find(p => p.tasks.some(t => t.id === depId));
        if (depPhase && collapsed.has(depPhase.id)) continue;

        const x1 = (dep.start + dep.duration) * dayPx;
        const y1 = getTaskSvgY(depId, phases, collapsed);
        const x2 = task.start * dayPx;
        const y2 = getTaskSvgY(task.id, phases, collapsed);

        if (y1 === null || y2 === null) continue;

        // Cubic bezier S-curve
        const mx   = x1 + Math.max((x2 - x1) * 0.5, 16);
        const path = `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
        arrows.push({ id: `${depId}→${task.id}`, path });
      }
    }
  }

  return (
    <svg
      style={{
        position: 'absolute',
        top: RULER_H,
        left: 0,
        width: '100%',
        height: totalH,
        pointerEvents: 'none',
        overflow: 'visible',
        zIndex: 2,
      }}
    >
      {arrows.map(a => (
        <path
          key={a.id}
          d={a.path}
          stroke="#F5C842"
          strokeWidth="1.5"
          strokeOpacity="0.55"
          fill="none"
          strokeDasharray="4 3"
        />
      ))}
    </svg>
  );
}

// ── DateRuler ─────────────────────────────────
function DateRuler({ dayPx, totalDays, startDate }) {
  const weeks  = getWeekTicks(startDate, totalDays);
  const months = getMonthBoundaries(startDate, totalDays);
  const half   = RULER_H / 2;

  return (
    <div style={{
      height: RULER_H,
      position: 'relative',
      backgroundColor: C.surface2,
      borderBottom: `1px solid ${C.border}`,
      overflow: 'hidden',
    }}>
      {/* Month labels — upper half */}
      {months.map(m => (
        <div
          key={m.day}
          style={{
            position: 'absolute',
            left: m.day * dayPx,
            top: 0, height: half,
            display: 'flex', alignItems: 'center',
            paddingLeft: '8px',
            fontFamily: F.mono, fontSize: '11px', fontWeight: 700,
            color: C.textMuted,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            borderLeft: `1px solid ${C.border}`,
            whiteSpace: 'nowrap', pointerEvents: 'none',
          }}
        >
          {m.label}
        </div>
      ))}

      {/* Week ticks — lower half */}
      {weeks.map(w => (
        <div
          key={w.day}
          style={{
            position: 'absolute',
            left: w.day * dayPx,
            top: half, height: half,
            display: 'flex', alignItems: 'center',
            paddingLeft: '5px',
            fontFamily: F.mono, fontSize: '9px',
            color: C.textMuted,
            borderLeft: `1px solid ${C.border}`,
            whiteSpace: 'nowrap', pointerEvents: 'none',
          }}
        >
          {fmtShort(w.date)}
        </div>
      ))}
    </div>
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

// ── PlanTab ───────────────────────────────────
export default function PlanTab() {
  const [zoomIdx,      setZoomIdx]      = useState(1);
  const [collapsed,    setCollapsed]    = useState(new Set());
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskStatuses, setTaskStatuses] = useState({});
  const [taskNotes,    setTaskNotes]    = useState({});

  const { phases, totalDays, start: planStart } = CAMPAIGN_PLAN;
  const dayPx     = ZOOM_LEVELS[zoomIdx];
  const timelineW = totalDays * dayPx;
  const phasesH   = totalPhasesH(phases, collapsed);

  // Today line position
  const originDate  = new Date(planStart);
  const todayOffset = Math.floor((new Date() - originDate) / 86400000);
  const showToday   = todayOffset >= 0 && todayOffset <= totalDays;

  const weekTicks = getWeekTicks(planStart, totalDays);

  const getStatus = (task) => taskStatuses[task.id] ?? task.status;

  const togglePhase = (phaseId) => {
    setCollapsed(prev => {
      const next = new Set(prev);
      next.has(phaseId) ? next.delete(phaseId) : next.add(phaseId);
      return next;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Shimmer animation */}
      <style>{`
        @keyframes planShimmer {
          0%   { left: -60%; }
          100% { left: 130%; }
        }
        .plan-shimmer { animation: planShimmer 2s linear infinite; }
      `}</style>

      {/* Task detail slide-in panel */}
      <TaskDetailPanel
        task={selectedTask}
        phases={phases}
        statuses={taskStatuses}
        notes={taskNotes}
        onStatusChange={(id, val) => setTaskStatuses(p => ({ ...p, [id]: val }))}
        onNotesChange={(id, val)  => setTaskNotes(p    => ({ ...p, [id]: val }))}
        onClose={() => setSelectedTask(null)}
      />

      {/* ── Toolbar ─────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: `${S[3]} ${S[5]}`,
        borderBottom: `1px solid ${C.border}`,
        backgroundColor: C.surface2,
        flexWrap: 'wrap', gap: S[3],
      }}>
        {/* Plan title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
          <span style={{
            fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary,
          }}>
            {CAMPAIGN_PLAN.title}
          </span>
          <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>
            {CAMPAIGN_PLAN.start} → {CAMPAIGN_PLAN.end}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: S[4] }}>
          {/* Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: S[4] }}>
            {Object.entries(STATUS).map(([key, st]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{
                  width: '10px', height: '10px', borderRadius: '3px',
                  backgroundColor: key === 'pending' ? '#0C1510' : st.color,
                  border: key === 'pending' ? `1.5px dashed ${C.border}` : 'none',
                  boxShadow: key === 'done' ? `0 0 5px ${st.color}60` : 'none',
                }} />
                <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>
                  {st.label}
                </span>
              </div>
            ))}
          </div>

          {/* Zoom controls */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '2px',
            backgroundColor: C.surface, border: `1px solid ${C.border}`,
            borderRadius: R.md, padding: '2px',
          }}>
            <button
              style={{ ...btn.icon, padding: '2px 9px', fontSize: '16px', lineHeight: 1, opacity: zoomIdx <= 0 ? 0.35 : 1 }}
              onClick={() => setZoomIdx(i => Math.max(0, i - 1))}
              disabled={zoomIdx <= 0}
            >
              −
            </button>
            <span style={{
              fontFamily: F.mono, fontSize: '10px', color: C.textMuted,
              padding: '0 4px', minWidth: '44px', textAlign: 'center',
            }}>
              {dayPx}px/d
            </span>
            <button
              style={{ ...btn.icon, padding: '2px 9px', fontSize: '16px', lineHeight: 1, opacity: zoomIdx >= ZOOM_LEVELS.length - 1 ? 0.35 : 1 }}
              onClick={() => setZoomIdx(i => Math.min(ZOOM_LEVELS.length - 1, i + 1))}
              disabled={zoomIdx >= ZOOM_LEVELS.length - 1}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Gantt (two-panel) ───────────── */}
      <div style={{ display: 'flex', overflow: 'hidden' }}>

        {/* Left label panel (no horizontal scroll) */}
        <div style={{
          width: PANEL_W, minWidth: PANEL_W, flexShrink: 0,
          borderRight: `1px solid ${C.border}`,
          backgroundColor: C.surface,
        }}>
          {/* Ruler placeholder */}
          <div style={{
            height: RULER_H,
            display: 'flex', alignItems: 'flex-end',
            padding: `0 ${S[4]} ${S[2]}`,
            backgroundColor: C.surface2,
            borderBottom: `1px solid ${C.border}`,
          }}>
            <span style={{
              fontFamily: F.body, fontSize: '10px', fontWeight: 700,
              color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>
              Phase / Task
            </span>
          </div>

          {/* Phase + task cells */}
          {phases.map(phase => (
            <div key={phase.id}>
              {/* Phase header cell */}
              <div
                style={{
                  height: PHASE_H,
                  display: 'flex', alignItems: 'center', gap: S[2],
                  padding: `0 ${S[3]}`,
                  backgroundColor: C.surface3,
                  borderBottom: `1px solid ${C.border}`,
                  borderLeft: `4px solid ${phase.color}`,
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
                onClick={() => togglePhase(phase.id)}
              >
                {/* Chevron */}
                <svg
                  width="11" height="11" viewBox="0 0 11 11" fill="none"
                  style={{
                    transform: collapsed.has(phase.id) ? 'rotate(-90deg)' : 'rotate(0deg)',
                    transition: T.fast, flexShrink: 0,
                  }}
                >
                  <path d="M2 4l3.5 3.5L9 4" stroke={phase.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>

                <span style={{
                  fontFamily: F.display, fontSize: '12px', fontWeight: 700,
                  color: C.textPrimary, flex: 1,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {phase.name}
                </span>

                {/* Completion chip */}
                {(() => {
                  const doneCt = phase.tasks.filter(t => getStatus(t) === 'done').length;
                  const pct    = Math.round((doneCt / phase.tasks.length) * 100);
                  return (
                    <span style={{
                      fontFamily: F.mono, fontSize: '10px', fontWeight: 700,
                      color: phase.color, backgroundColor: `${phase.color}18`,
                      borderRadius: R.pill, padding: '1px 6px', flexShrink: 0,
                    }}>
                      {pct}%
                    </span>
                  );
                })()}
              </div>

              {/* Task label cells */}
              {!collapsed.has(phase.id) && phase.tasks.map(task => {
                const status = getStatus(task);
                const st     = STATUS[status] ?? STATUS.pending;
                return (
                  <div
                    key={task.id}
                    style={{
                      height: TASK_H,
                      display: 'flex', alignItems: 'center', gap: S[2],
                      padding: `0 ${S[3]}`,
                      borderBottom: `1px solid ${C.border}`,
                      cursor: 'pointer', transition: T.color,
                    }}
                    onClick={() => setSelectedTask(task)}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.surface2; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <div style={{
                      width: '3px', height: '18px', borderRadius: '2px',
                      backgroundColor: st.color, flexShrink: 0,
                    }} />
                    <span style={{
                      fontFamily: F.body, fontSize: '12px',
                      color: status === 'pending' ? C.textMuted : C.textSecondary,
                      flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {task.name}
                    </span>
                    <OwnerAvatar initials={task.owner} color={phase.color} />
                    <StatusBadge status={status} />
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Right Gantt area (scrolls horizontally) */}
        <div style={{
          flex: 1, overflowX: 'auto', overflowY: 'hidden',
          position: 'relative',
          scrollbarWidth: 'thin', scrollbarColor: `${C.border} transparent`,
        }}>
          {/* Inner content — fixed min-width drives scroll */}
          <div style={{ minWidth: timelineW, position: 'relative' }}>

            {/* Date ruler */}
            <DateRuler dayPx={dayPx} totalDays={totalDays} startDate={planStart} />

            {/* Vertical week grid lines */}
            {weekTicks.map(w => (
              <div key={w.day} style={{
                position: 'absolute',
                left: w.day * dayPx,
                top: RULER_H, bottom: 0,
                width: '1px',
                backgroundColor: C.border,
                opacity: 0.3, pointerEvents: 'none', zIndex: 0,
              }} />
            ))}

            {/* Today vertical line */}
            {showToday && (
              <div style={{
                position: 'absolute',
                left: todayOffset * dayPx,
                top: RULER_H, bottom: 0,
                width: '2px',
                backgroundColor: '#F5C842',
                opacity: 0.6,
                zIndex: 1,
                pointerEvents: 'none',
              }} />
            )}

            {/* Phase + task Gantt rows */}
            {phases.map(phase => (
              <div key={phase.id}>
                {/* Phase span row */}
                <div
                  style={{
                    height: PHASE_H, position: 'relative',
                    backgroundColor: `${phase.color}09`,
                    borderBottom: `1px solid ${C.border}`,
                    cursor: 'pointer',
                  }}
                  onClick={() => togglePhase(phase.id)}
                >
                  {/* Phase accent strip */}
                  <div style={{
                    position: 'absolute',
                    left: phase.startDay * dayPx,
                    top: '50%', marginTop: '6px',
                    width: (phase.endDay - phase.startDay) * dayPx,
                    height: '3px',
                    backgroundColor: `${phase.color}40`,
                    borderRadius: R.pill,
                  }} />
                  {/* Phase label on bar */}
                  <div style={{
                    position: 'absolute',
                    left: phase.startDay * dayPx + 6,
                    top: '50%', transform: 'translateY(-50%)',
                    marginTop: '-4px',
                    fontFamily: F.mono, fontSize: '10px',
                    color: `${phase.color}BB`, whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                  }}>
                    {phase.dateRange}
                  </div>
                </div>

                {/* Task Gantt bar rows */}
                {!collapsed.has(phase.id) && phase.tasks.map(task => (
                  <div
                    key={task.id}
                    style={{
                      height: TASK_H, position: 'relative',
                      borderBottom: `1px solid ${C.border}`,
                      cursor: 'pointer',
                    }}
                    onClick={() => setSelectedTask(task)}
                  >
                    <GanttBar task={task} dayPx={dayPx} status={getStatus(task)} />
                  </div>
                ))}
              </div>
            ))}

            {/* SVG dependency arrows */}
            <DependencyArrows
              phases={phases}
              collapsed={collapsed}
              dayPx={dayPx}
              totalH={phasesH}
            />
          </div>
        </div>
      </div>

      {/* ── Summary bar ──────────────────────── */}
      <SummaryBar phases={phases} taskStatuses={taskStatuses} />
    </div>
  );
}
