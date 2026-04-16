import { useCallback } from 'react';
import { TriggerEngine } from '../agents/TriggerEngine';

export function useTrigger(triggerId) {
  const fire = useCallback((context = {}) => {
    TriggerEngine.fire(triggerId, context);
  }, [triggerId]);

  return { fire };
}
