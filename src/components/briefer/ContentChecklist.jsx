/**
 * Grouped by channel; checkboxes, "Generate with ARIA" per item.
 */
import { C, F, R, S, btn } from '../../tokens';

export default function ContentChecklist({ items = [], onToggle, onGenerate }) {
  const byChannel = items.reduce((acc, item) => {
    const ch = item.channel || 'Other';
    if (!acc[ch]) acc[ch] = [];
    acc[ch].push(item);
    return acc;
  }, {});

  return (
    <div
      style={{
        padding: S[4],
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
      }}
    >
      <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary, marginBottom: S[4] }}>
        Content checklist
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
        {Object.entries(byChannel).map(([channel, list]) => (
          <div key={channel}>
            <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, marginBottom: S[2] }}>
              {channel}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
              {list.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: S[3],
                    padding: S[2],
                    backgroundColor: C.surface2,
                    borderRadius: R.md,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={!!item.done}
                    onChange={() => onToggle?.(item.id)}
                    style={{ flexShrink: 0, cursor: 'pointer' }}
                  />
                  <span style={{ flex: 1, fontFamily: F.body, fontSize: '13px', color: C.textPrimary }}>
                    {item.item}
                  </span>
                  <button
                    type="button"
                    onClick={() => onGenerate?.(item)}
                    style={{ ...btn.secondary, color: C.secondary, borderColor: C.secondary, fontSize: '12px', padding: `${S[1]} ${S[3]}` }}
                  >
                    Generate with Freya
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
