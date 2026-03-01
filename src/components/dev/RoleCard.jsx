import { C, F, R, S, btn } from '../../tokens';
import {
  IconCrown,
  IconCompass,
  IconHandshake,
  IconTarget,
  IconPen,
  IconSend,
  IconChart,
  IconEye,
} from '../ui/Icons';

const ICON_MAP = {
  crown: IconCrown,
  compass: IconCompass,
  handshake: IconHandshake,
  target: IconTarget,
  pen: IconPen,
  send: IconSend,
  chart: IconChart,
  eye: IconEye,
};

export default function RoleCard({ role, isActive, onSwitch }) {
  const { id, name, description, color, icon, permissions, dashboardVariant } = role;
  const IconComponent = ICON_MAP[icon] || IconCrown;

  return (
    <div
      style={{
        padding: S[5],
        backgroundColor: isActive ? `${color}18` : C.surface,
        border: `1px solid ${C.border}`,
        borderLeft: `4px solid ${color}`,
        borderRadius: R.card,
        display: 'flex',
        flexDirection: 'column',
        gap: S[3],
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
        <IconComponent color={color} width={20} height={20} />
        <h3 style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary, margin: 0 }}>
          {name}
        </h3>
      </div>
      <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: 0, lineHeight: 1.4 }}>
        {description}
      </p>
      <div>
        <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, textTransform: 'uppercase', marginBottom: S[1] }}>
          Permissions preview
        </div>
        <ul style={{ margin: 0, paddingLeft: S[5], fontFamily: F.body, fontSize: '12px', color: C.textSecondary, lineHeight: 1.6 }}>
          {(permissions || []).slice(0, 3).map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </div>
      <div
        style={{
          fontFamily: F.mono,
          fontSize: '11px',
          color: C.textMuted,
          backgroundColor: C.surface2,
          padding: `${S[1]} ${S[2]}`,
          borderRadius: R.sm,
          alignSelf: 'flex-start',
        }}
      >
        Dashboard: {dashboardVariant}
      </div>
      <button
        style={{
          ...btn.primary,
          fontSize: '13px',
          marginTop: 'auto',
          backgroundColor: isActive ? C.primary : color,
          borderColor: isActive ? C.primary : color,
        }}
        onClick={() => !isActive && onSwitch(id)}
      >
        {isActive ? 'Current role' : 'Switch to this role'}
      </button>
    </div>
  );
}
