/**
 * Hook to access command-mode-aware design tokens.
 * Usage: const design = useCommandModeDesign();
 */
import { useMemo } from 'react';
import useStore from '../store/useStore';
import { getModeDesign } from '../config/commandModeDesign';

export default function useCommandModeDesign() {
  const commandMode = useStore((s) => s.commandMode);
  return useMemo(() => getModeDesign(commandMode), [commandMode]);
}

export function useCommandMode() {
  const commandMode = useStore((s) => s.commandMode);
  const setCommandMode = useStore((s) => s.setCommandMode);
  const design = useMemo(() => getModeDesign(commandMode), [commandMode]);
  return { mode: commandMode, setMode: setCommandMode, design };
}
