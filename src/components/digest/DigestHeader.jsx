/**
 * Week label, prev/next, title, delivery status, actions (Forward, Download, Configure).
 */
import { C, F, R, S, btn } from '../../tokens';

export default function DigestHeader({
  weekLabel,
  onPrevWeek,
  onNextWeek,
  deliveryStatus = 'delivered',
  deliveredAt,
  onForward,
  onDownload,
  onConfigure,
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: S[4],
        padding: S[4],
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: S[4] }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
          <button type="button" onClick={onPrevWeek} style={btn.icon} aria-label="Previous week">
            ‹
          </button>
          <span style={{ fontFamily: F.body, fontSize: '14px', fontWeight: 600, color: C.textPrimary, minWidth: 180 }}>
            {weekLabel}
          </span>
          <button type="button" onClick={onNextWeek} style={btn.icon} aria-label="Next week">
            ›
          </button>
        </div>
        <span
          style={{
            fontFamily: F.mono,
            fontSize: '11px',
            color: deliveryStatus === 'delivered' ? C.primary : C.textMuted,
            padding: `2px ${S[2]}`,
            backgroundColor: deliveryStatus === 'delivered' ? C.primaryGlow : C.surface3,
            borderRadius: R.pill,
          }}
        >
          {deliveryStatus === 'delivered' ? 'Delivered' : deliveryStatus}
        </span>
        {deliveredAt && (
          <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>
            {new Date(deliveredAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
        <button type="button" onClick={onForward} style={btn.ghost}>
          Forward
        </button>
        <button type="button" onClick={onDownload} style={btn.secondary}>
          Download
        </button>
        <button type="button" onClick={onConfigure} style={btn.icon} aria-label="Configure digest">
          ⚙
        </button>
      </div>
    </div>
  );
}
