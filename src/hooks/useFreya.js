import { useMemo, useCallback } from 'react';
import useStore from '../store/useStore';
import { freya } from '../freya/FreyaEngine';

export function useFreya() {
  const isOpen = useStore(s => s.freyaOpen);
  const toggleFreya = useStore(s => s.toggleFreya);
  const agentStatuses = useStore(s => s.agents.statuses);
  const allFeed = useStore(s => s.agents.agentFeed);
  const feed = useMemo(() => (allFeed || []).slice(0, 20), [allFeed]);
  const pendingApprovals = useStore(s => s.agents.pendingApprovals);
  const activeWorkflow = useStore(s => s.agents.activeWorkflow);

  const chat = useCallback(async (message, context = {}) => {
    return freya.chat(message, context);
  }, []);

  const delegate = useCallback(async (agentId, task, context = {}) => {
    return freya.delegate(agentId, task, context);
  }, []);

  return { isOpen, toggleFreya, chat, delegate, agentStatuses, feed, pendingApprovals, activeWorkflow };
}
