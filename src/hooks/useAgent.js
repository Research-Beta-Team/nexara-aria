import { useMemo } from 'react';
import useStore from '../store/useStore';
import { getAgent } from '../agents/AgentRegistry';
import { AgentRuntime } from '../agents/AgentRuntime';

export function useAgent(agentId) {
  const status = useStore(s => s.agents.statuses[agentId]);
  const agentConfig = getAgent(agentId);
  // Fix: get whole feed array, then derive with useMemo (stable reference)
  const allFeed = useStore(s => s.agents.agentFeed);
  const feed = useMemo(
    () => (allFeed || []).filter(f => f.agentId === agentId).slice(0, 10),
    [allFeed, agentId]
  );

  const activate = async (task, context = {}) => {
    return AgentRuntime.activateAgent(agentId, task, context);
  };
  const cancel = () => AgentRuntime.cancelAgent(agentId);

  return {
    ...agentConfig,
    ...status,
    feed,
    activate,
    cancel,
    isActive: status?.status === 'thinking' || status?.status === 'executing',
    isIdle: !status?.status || status?.status === 'idle',
  };
}
