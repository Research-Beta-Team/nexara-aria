import { useMemo } from 'react';
import useStore from '../store/useStore';

export function useAgentFeed(limit = 20) {
  const allFeed = useStore(s => s.agents.agentFeed);
  const allHistory = useStore(s => s.agents.messageHistory);
  const feed = useMemo(() => (allFeed || []).slice(0, limit), [allFeed, limit]);
  const messageHistory = useMemo(() => (allHistory || []).slice(-limit), [allHistory, limit]);
  return { feed, messageHistory };
}
