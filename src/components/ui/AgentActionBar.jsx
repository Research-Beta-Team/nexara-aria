/**
 * AgentActionBar — horizontal strip at the top of page content areas,
 * showing relevant agents and quick trigger buttons.
 *
 * Props:
 *   agents: Array<{ agentId, agentName, task, creditCost, estimatedTime }>
 *   pageTitle: string
 *   lastRunAt: string | null (ISO date)
 */
import { useState, useEffect } from 'react';
import useStore from '../../store/useStore';
import { AgentRuntime } from '../../agents/AgentRuntime';
import TriggerButton from './TriggerButton';
import AgentRoleIcon from './AgentRoleIcon';
import { IconClock } from './Icons';
import { C, F, R, S, T, shadows } from '../../tokens';

function StatusDot({ status }) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (status === 'thinking' || status === 'executing') {
      const id = setInterval(() => setPulse((p) => !p), 600);
      return () => clearInterval(id);
    }
    setPulse(false);
  }, [status]);

  const COLOR_MAP = {
    idle: C.textMuted,
    thinking: C.amber,
    executing: C.primary,
    done: C.green,
    error: C.red,
    waiting_approval: C.amber,
  };

  const color = COLOR_MAP[status] || C.textMuted;

  return (
    <span style={{
      display: 'inline-block',
      width: '7px',
      height: '7px',
      borderRadius: '50%',
      backgroundColor: color,
      flexShrink: 0,
      opacity: pulse ? 0.5 : 1,
      transition: 'opacity 0.3s ease',
      boxShadow: (status === 'thinking' || status === 'executing') ? `0 0 6px ${color}` : 'none',
    }} />
  );
}

function AgentPill({ agent }) {
  const agentStatuses = useStore((s) => s.agents.statuses);
  const agentStatus = agentStatuses?.[agent.agentId];
  const status = agentStatus?.status || 'idle';
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: S[1], position: 'relative' }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: S[2],
          padding: `${S[1]} ${S[3]}`,
          backgroundColor: C.surface2,
          border: `1px solid ${C.border}`,
          borderRadius: R.pill,
          fontSize: '12px',
          fontFamily: F.body,
          color: C.textSecondary,
          cursor: 'default',
        }}
      >
        <span style={{ lineHeight: 0 }}><AgentRoleIcon agentId={agent.agentId} size={14} color={C.textSecondary} /></span>
        <span style={{ fontWeight: 500 }}>{agent.agentName}</span>
        <StatusDot status={status} />
      </div>
      <TriggerButton
        agentId={agent.agentId}
        agentName={agent.agentName}
        task={agent.task || {}}
        creditCost={agent.creditCost}
        estimatedTime={agent.estimatedTime}
        variant="ghost"
        size="sm"
        showLabels={false}
      />
    </div>
  );
}

export default function AgentActionBar({ agents = [], pageTitle, lastRunAt }) {
  const agentStatuses = useStore((s) => s.agents.statuses);
  const agentFeed = useStore((s) => s.agents.agentFeed);
  const [outputExpanded, setOutputExpanded] = useState(false);
  const [runningAll, setRunningAll] = useState(false);

  // Find latest output from any of the listed agents
  const listedIds = new Set(agents.map((a) => a.agentId));
  const latestOutput = agentFeed.find((f) => listedIds.has(f.agentId) && f.type === 'result');

  // Check if any of the listed agents just finished
  const anyDone = agents.some((a) => {
    const s = agentStatuses?.[a.agentId];
    return s?.status === 'idle' && s?.lastAction;
  });

  const handleRunAll = async () => {
    if (runningAll) return;
    setRunningAll(true);
    try {
      for (let i = 0; i < agents.length; i++) {
        const a = agents[i];
        AgentRuntime.activateAgent(a.agentId, a.task || {}, {});
        if (i < agents.length - 1) {
          await new Promise((r) => setTimeout(r, 500));
        }
      }
    } finally {
      setTimeout(() => setRunningAll(false), agents.length * 600 + 3000);
    }
  };

  const formatLastRun = (iso) => {
    if (!iso) return null;
    const d = new Date(iso);
    if (isNaN(d)) return null;
    const diff = Date.now() - d.getTime();
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString();
  };
  const lastRunLabel = formatLastRun(lastRunAt);

  return (
    <div style={{
      backgroundColor: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: R.card,
      marginBottom: S[4],
      overflow: 'hidden',
    }}>
      {/* Main row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `${S[2]} ${S[4]}`,
        gap: S[4],
        flexWrap: 'wrap',
      }}>
        {/* Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
          <span style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            AI Agents
          </span>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            backgroundColor: C.primaryGlow,
            fontFamily: F.mono,
            fontSize: '10px',
            fontWeight: 700,
            color: C.primary,
          }}>
            {agents.length}
          </span>
          {lastRunLabel && (
            <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>
              Last run: {lastRunLabel}
            </span>
          )}
        </div>

        {/* Right: agent pills + run all */}
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2], flexWrap: 'wrap' }}>
          {agents.map((a) => (
            <AgentPill key={a.agentId} agent={a} />
          ))}

          {agents.length > 1 && (
            <button
              type="button"
              onClick={handleRunAll}
              disabled={runningAll}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: S[1],
                padding: `${S[1]} ${S[3]}`,
                backgroundColor: runningAll ? C.primaryGlow : C.primary,
                color: C.textInverse,
                border: 'none',
                borderRadius: R.button,
                fontFamily: F.body,
                fontSize: '12px',
                fontWeight: 700,
                cursor: runningAll ? 'not-allowed' : 'pointer',
                transition: T.color,
                opacity: runningAll ? 0.7 : 1,
                whiteSpace: 'nowrap',
              }}
            >
              {runningAll ? <IconClock color={C.textInverse} width={14} height={14} /> : '▶'} Run All
            </button>
          )}
        </div>
      </div>

      {/* Latest output collapsible row */}
      {latestOutput && (
        <div style={{
          borderTop: `1px solid ${C.border}`,
          backgroundColor: anyDone ? `${C.primaryGlow}` : C.amberDim,
        }}>
          <button
            type="button"
            onClick={() => setOutputExpanded((e) => !e)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: `${S[2]} ${S[4]}`,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: C.textSecondary,
              fontFamily: F.body,
              fontSize: '12px',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
              <span style={{ lineHeight: 0 }}><AgentRoleIcon agentId={latestOutput.agentId} size={14} color={C.primary} /></span>
              <span style={{ fontWeight: 600, color: C.textPrimary }}>Latest Output</span>
              <span style={{ color: C.textMuted }}>from {latestOutput.agentId}</span>
            </span>
            <span style={{ transform: outputExpanded ? 'rotate(180deg)' : 'rotate(0)', transition: T.base, display: 'inline-block' }}>
              ▾
            </span>
          </button>

          {outputExpanded && (
            <div style={{
              padding: `0 ${S[4]} ${S[3]}`,
              fontFamily: F.body,
              fontSize: '13px',
              color: C.textSecondary,
              lineHeight: 1.6,
            }}>
              {typeof latestOutput.message === 'string'
                ? latestOutput.message.slice(0, 300)
                : JSON.stringify(latestOutput).slice(0, 300)}
              {(typeof latestOutput.message === 'string' ? latestOutput.message : JSON.stringify(latestOutput)).length > 300 && '…'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
