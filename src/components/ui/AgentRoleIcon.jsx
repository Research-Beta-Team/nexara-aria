/**
 * SVG glyph per agent id — replaces emoji avatars (Antarious sage / ink theme).
 */
import { getAgent } from '../../agents/AgentRegistry';
import { C } from '../../tokens';
import FreyaLogo from './FreyaLogo';
import {
  IconChart,
  IconCoins,
  IconPen,
  IconRobot,
  IconSearch,
  IconSend,
  IconShield,
  IconTarget,
  IconZap,
} from './Icons';

export default function AgentRoleIcon({ agentId, size = 18, color = 'currentColor', ariaHidden = true }) {
  if (!agentId) return null;
  if (agentId === 'freya') {
    return <FreyaLogo size={Math.round(size * 1.05)} color={color} ariaHidden={ariaHidden} />;
  }
  const common = { color, width: size, height: size };
  switch (agentId) {
    case 'strategist':
      return <IconTarget {...common} />;
    case 'copywriter':
      return <IconPen {...common} />;
    case 'analyst':
      return <IconChart {...common} />;
    case 'prospector':
      return <IconSearch {...common} />;
    case 'optimizer':
      return <IconZap {...common} />;
    case 'outreach':
      return <IconSend {...common} />;
    case 'revenue':
      return <IconCoins {...common} />;
    case 'guardian':
      return <IconShield {...common} />;
    default:
      return <IconRobot {...common} />;
  }
}

/** Resolve agent id from display name (mock rows that only store name). */
export function agentIdFromName(name) {
  if (!name || typeof name !== 'string') return null;
  const n = name.toLowerCase();
  if (n.includes('freya')) return 'freya';
  if (n.includes('strategist') || n.includes('strategy')) return 'strategist';
  if (n.includes('copywriter') || n.includes('content agent')) return 'copywriter';
  if (n.includes('analyst') || n.includes('insights')) return 'analyst';
  if (n.includes('prospector') || n.includes('lead agent')) return 'prospector';
  if (n.includes('optimizer') || n.includes('cro')) return 'optimizer';
  if (n.includes('outreach')) return 'outreach';
  if (n.includes('revenue')) return 'revenue';
  if (n.includes('guardian') || n.includes('compliance')) return 'guardian';
  return null;
}

/**
 * Inline icon + label; pass agentId or agentName (fallback lookup).
 */
export function AgentNameWithIcon({
  agentId,
  agentName,
  name,
  size = 12,
  gap = 5,
  color,
  style,
}) {
  const id = agentId || agentIdFromName(agentName || name);
  const agent = id ? getAgent(id) : null;
  const label = name ?? agent?.displayName ?? agentName ?? agent?.name ?? id ?? '';
  const c = color ?? C.textSecondary;
  if (!id) {
    return <span style={style}>{label}</span>;
  }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap, ...style }}>
      <AgentRoleIcon agentId={id} size={size} color={c} />
      <span>{label}</span>
    </span>
  );
}
