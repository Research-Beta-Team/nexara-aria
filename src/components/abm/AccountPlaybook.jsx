import { useState } from 'react';
import { C, F, R, S, btn } from '../../tokens';

export default function AccountPlaybook({ account, toast }) {
  const [tasksDone, setTasksDone] = useState({});
  const playbook = account?.playbook || { phases: [] };

  const allTasks = playbook.phases.flatMap((p) => p.tasks);
  const doneCount = allTasks.filter((t) => t.done || tasksDone[t.id]).length;
  const totalCount = allTasks.length;

  const toggleDone = (taskId) => {
    setTasksDone((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
    toast?.success('Task updated');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[5] }}>
      <div
        style={{
          padding: S[4],
          backgroundColor: C.surface2,
          border: `1px solid ${C.border}`,
          borderRadius: R.card,
          fontFamily: F.body,
          fontSize: '14px',
          color: C.textPrimary,
        }}
      >
        <strong style={{ color: C.primary }}>{doneCount}</strong> of <strong>{totalCount}</strong> tasks complete
      </div>

      {playbook.phases.map((phase, idx) => (
        <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
          <h3 style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary, margin: 0 }}>
            Phase {idx + 1}: {phase.name} <span style={{ fontFamily: F.body, fontWeight: 400, color: C.textMuted }}>({phase.weekRange})</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
            {(phase.tasks || []).map((task) => {
              const isDone = task.done || tasksDone[task.id];
              return (
                <div
                  key={task.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: S[4],
                    padding: S[4],
                    backgroundColor: C.surface2,
                    border: `1px solid ${C.border}`,
                    borderRadius: R.card,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: isDone ? C.primary : C.surface3,
                      color: isDone ? C.textInverse : C.textMuted,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: F.mono,
                      fontSize: '12px',
                      fontWeight: 700,
                    }}
                  >
                    {task.assignee.slice(0, 2)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary }}>{task.description}</div>
                    <div style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted, marginTop: 4 }}>
                      {task.type} · Due {task.dueDate}
                    </div>
                  </div>
                  <button
                    style={{
                      ...btn.secondary,
                      fontSize: '12px',
                      opacity: isDone ? 0.7 : 1,
                    }}
                    onClick={() => toggleDone(task.id)}
                  >
                    {isDone ? 'Undo' : 'Mark Done'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
