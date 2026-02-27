import { C, F, R, S } from '../../../tokens';
import { planPhases } from '../../../data/campaigns';

const STATUS_STYLE = {
  done:    { bar: C.primary,    text: C.primary,    bg: 'rgba(61,220,132,0.12)',  label: 'Done'        },
  active:  { bar: C.secondary, text: C.secondary,  bg: 'rgba(94,234,212,0.12)',  label: 'In Progress' },
  pending: { bar: C.textMuted, text: C.textMuted,  bg: C.surface3,               label: 'Pending'     },
};

function OwnerBadge({ initials }) {
  return (
    <div style={{
      width: '22px', height: '22px', borderRadius: '50%',
      backgroundColor: C.surface3,
      border: `1px solid ${C.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: F.mono, fontSize: '9px', fontWeight: 700, color: C.textSecondary,
      flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

function TaskRow({ task, isLast }) {
  const st = STATUS_STYLE[task.status] ?? STATUS_STYLE.pending;
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 220px 40px',
      gap: S[4],
      alignItems: 'center',
      padding: `${S[2]} ${S[4]}`,
      borderBottom: isLast ? 'none' : `1px solid ${C.border}`,
    }}>
      {/* Label + owner */}
      <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: st.bar, flexShrink: 0 }}/>
        <span style={{ fontFamily: F.body, fontSize: '12px', color: task.status === 'pending' ? C.textMuted : C.textSecondary }}>{task.label}</span>
      </div>

      {/* Gantt bar */}
      <div style={{ position: 'relative', height: '16px', backgroundColor: C.surface3, borderRadius: R.pill, overflow: 'visible' }}>
        <div style={{
          position: 'absolute',
          left: `${task.start}%`,
          width: `${task.width}%`,
          height: '100%',
          backgroundColor: st.bar,
          borderRadius: R.pill,
          opacity: task.status === 'pending' ? 0.35 : 1,
          overflow: 'hidden',
        }}>
          {task.progress > 0 && (
            <div style={{ height: '100%', width: `${task.progress}%`, backgroundColor: task.status === 'done' ? C.primaryDim : C.secondaryDim, borderRadius: R.pill }}/>
          )}
        </div>
      </div>

      <OwnerBadge initials={task.owner} />
    </div>
  );
}

function PhaseBlock({ phase }) {
  const st = STATUS_STYLE[phase.status] ?? STATUS_STYLE.pending;

  return (
    <div style={{
      backgroundColor: C.surface2,
      border: `1px solid ${C.border}`,
      borderRadius: R.card,
      overflow: 'hidden',
    }}>
      {/* Phase header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 220px 40px',
        gap: S[4],
        alignItems: 'center',
        padding: `${S[3]} ${S[4]}`,
        backgroundColor: C.surface3,
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
          <span style={{
            fontFamily: F.mono, fontSize: '10px', fontWeight: 700,
            color: st.text, backgroundColor: st.bg, borderRadius: R.pill,
            padding: `2px ${S[2]}`,
          }}>
            {st.label}
          </span>
          <span style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>
            {phase.phase}: {phase.label}
          </span>
          <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>
            {phase.start} – {phase.end}
          </span>
        </div>
        {/* Phase progress bar slot */}
        <div style={{ height: '4px', backgroundColor: C.surface, borderRadius: R.pill, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${phase.progress}%`, backgroundColor: st.bar, borderRadius: R.pill }}/>
        </div>
        <span style={{ fontFamily: F.mono, fontSize: '11px', color: st.text, textAlign: 'center' }}>
          {phase.progress}%
        </span>
      </div>

      {/* Tasks */}
      {phase.tasks.map((task, i) => (
        <TaskRow key={task.id} task={task} isLast={i === phase.tasks.length - 1} />
      ))}
    </div>
  );
}

export default function PlanTab() {
  return (
    <div style={{ padding: S[5], display: 'flex', flexDirection: 'column', gap: S[4] }}>
      {/* Header row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 220px 40px',
        gap: S[4],
        padding: `0 ${S[4]}`,
      }}>
        <span style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Task</span>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '2px' }}>
          {['Jan', 'Feb', 'Mar'].map((m) => (
            <span key={m} style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>{m}</span>
          ))}
        </div>
        <span style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Who</span>
      </div>

      {/* Phase blocks */}
      {planPhases.map((ph) => (
        <PhaseBlock key={ph.id} phase={ph} />
      ))}

      {/* Legend */}
      <div style={{ display: 'flex', gap: S[5], paddingLeft: S[4] }}>
        {Object.entries(STATUS_STYLE).map(([key, st]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: S[1] }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: st.bar, opacity: key === 'pending' ? 0.35 : 1 }}/>
            <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>{st.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
