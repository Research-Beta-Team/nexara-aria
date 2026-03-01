import { C, F, R, S, btn, badge } from '../../tokens';
import { PLAYBOOK_ICON_MAP, IconClipboard } from '../ui/Icons';

const COLOR_MAP = {
  teal: C.secondary,
  mint: C.primary,
};

const CHANNEL_LABELS = {
  Email: 'Email',
  LinkedIn: 'in',
  'Meta Ads': 'Meta',
  WhatsApp: 'WA',
};

export default function PlaybookCard({ playbook, onPreview, onLaunch }) {
  if (!playbook) return null;
  const {
    name,
    target,
    icp,
    benchmarks,
    channels = [],
    agentsDeployed = [],
    color,
    icon,
  } = playbook;
  const accent = COLOR_MAP[color] || C.primary;
  const IconComponent = PLAYBOOK_ICON_MAP[icon] || IconClipboard;

  return (
    <div
      style={{
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          padding: `${S[4]} ${S[5]}`,
          backgroundColor: `${accent}22`,
          borderBottom: `2px solid ${accent}`,
          display: 'flex',
          alignItems: 'center',
          gap: S[3],
        }}
      >
        <IconComponent color={accent} w={24} />
        <h3 style={{ fontFamily: F.display, fontSize: '18px', fontWeight: 700, color: C.textPrimary, margin: 0 }}>
          {name}
        </h3>
      </div>
      <div style={{ padding: S[5], display: 'flex', flexDirection: 'column', gap: S[3], flex: 1 }}>
        <span style={{ ...badge.base, ...badge.muted, alignSelf: 'flex-start' }}>{target}</span>
        <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: 0 }}>
          {icp}
        </p>
        <div style={{ display: 'flex', gap: S[4], flexWrap: 'wrap', fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>
          <span>CPL {benchmarks?.cpl}</span>
          <span>Close {benchmarks?.demoToClose}</span>
          <span>First result {benchmarks?.timeToFirstDemo}</span>
        </div>
        <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap' }}>
          {channels.map((ch) => (
            <span key={ch} style={{ ...badge.base, ...badge.muted, fontSize: '10px' }}>
              {CHANNEL_LABELS[ch] ?? ch}
            </span>
          ))}
        </div>
        <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>
          {agentsDeployed.length} agents deployed
        </span>
        <div style={{ display: 'flex', gap: S[2], marginTop: 'auto', flexWrap: 'wrap' }}>
          <button
            style={{ ...btn.secondary, fontSize: '13px' }}
            onClick={() => onPreview?.(playbook)}
          >
            Preview Playbook
          </button>
          <button
            style={{ ...btn.primary, fontSize: '13px' }}
            onClick={() => onLaunch?.(playbook)}
          >
            Launch This →
          </button>
        </div>
      </div>
    </div>
  );
}
