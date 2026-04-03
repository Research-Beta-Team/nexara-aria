import { IconHandControl, IconRobot, IconZap } from './Icons';

/** Normalizes store keys (semi_auto) and settings keys (semi). */
export default function CommandModeGlyph({ modeId, size = 16, color = 'currentColor' }) {
  const id = modeId === 'semi_auto' ? 'semi' : modeId === 'fully_agentic' ? 'agentic' : modeId;
  if (id === 'manual') return <IconHandControl color={color} width={size} height={size} />;
  if (id === 'semi') return <IconZap color={color} w={size} />;
  if (id === 'agentic') return <IconRobot color={color} w={size} />;
  return <IconZap color={color} w={size} />;
}
