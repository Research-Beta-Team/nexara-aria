/**
 * Threaded comments on content: avatar initials, author, timestamp, text.
 */
import { C, F, R, S } from '../../tokens';

function initials(name) {
  if (!name) return '?';
  return name
    .split(/\s+/)
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function timeAgo(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins} min ago`;
  if (hours < 24) return `${hours} hours ago`;
  return `${days} days ago`;
}

export default function ReviewCommentThread({ comments }) {
  const list = Array.isArray(comments) ? comments : [];

  if (list.length === 0) {
    return (
      <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, margin: 0 }}>
        No review comments yet.
      </p>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
      {list.map((c) => (
        <div
          key={c.id}
          style={{
            display: 'flex',
            gap: S[3],
            paddingLeft: S[3],
            borderLeft: `2px solid ${C.border}`,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              backgroundColor: C.surface3,
              color: C.textSecondary,
              fontFamily: F.mono,
              fontSize: '10px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {initials(c.author)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginBottom: 2 }}>
              <span style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textPrimary }}>
                {c.author}
              </span>
              {c.role && (
                <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>
                  {c.role}
                </span>
              )}
              <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>
                {timeAgo(c.createdAt)}
              </span>
            </div>
            <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: 0, lineHeight: 1.5 }}>
              {c.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
