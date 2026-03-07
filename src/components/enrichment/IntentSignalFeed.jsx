/**
 * Live feed of intent activity; optional "Surge detected" banner.
 */
import { C, F, R, S } from '../../tokens';

function timeAgo(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(diff / 3600000)}h ago`;
}

export default function IntentSignalFeed({ items = [], surgeDetected = false }) {
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
        Intent signal feed
      </div>
      {surgeDetected && (
        <div
          style={{
            padding: S[3],
            backgroundColor: C.primaryGlow,
            border: `1px solid ${C.primary}`,
            borderRadius: R.card,
            marginBottom: S[4],
            fontFamily: F.body,
            fontSize: '13px',
            fontWeight: 600,
            color: C.primary,
          }}
        >
          Surge detected — intent activity up 2x in last hour
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
        {items.length === 0 ? (
          <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textMuted }}>No recent intent activity.</div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              style={{
                padding: S[3],
                backgroundColor: C.surface2,
                border: `1px solid ${C.border}`,
                borderRadius: R.md,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary }}>{item.leadName}</span>
                  <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted }}> · {item.company}</span>
                </div>
                <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.primary }}>{item.score}</span>
              </div>
              <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, marginTop: S[1] }}>
                {item.signal}
              </div>
              <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, marginTop: S[1] }}>
                {timeAgo(item.at)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
