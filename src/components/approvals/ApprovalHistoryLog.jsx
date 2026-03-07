/**
 * Timeline of approval decisions: who did what, when. Expandable to show comments.
 */
import { C, F, R, S } from '../../tokens';

function initials(name) {
  if (!name) return '?';
  return name.split(/\s+/).map((s) => s[0]).slice(0, 2).join('').toUpperCase();
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
  if (days < 7) return `${days} days ago`;
  return d.toLocaleDateString();
}

export default function ApprovalHistoryLog({ history }) {
  const list = Array.isArray(history) ? history : [];

  if (list.length === 0) {
    return (
      <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, margin: 0 }}>
        No approval history yet.
      </p>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {list.map((entry, i) => (
        <div
          key={entry.at || i}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: S[3],
            padding: `${S[2]} 0`,
            borderBottom: i < list.length - 1 ? `1px solid ${C.border}` : 'none',
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              backgroundColor: C.surface3,
              color: C.textSecondary,
              fontFamily: F.mono,
              fontSize: '9px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {initials(entry.by)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textPrimary }}>
              {entry.by}
            </span>
            <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>
              {' '}{entry.action}
            </span>
            <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, marginLeft: S[2] }}>
              {timeAgo(entry.at)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
