import { C, F, R, S, btn } from '../../tokens';

const REVIEWER_STATUS_BORDER = {
  pending: C.border,
  approved: C.primary,
  changes_requested: C.red,
  waiting: C.amber,
};

export default function ReviewerAvatarRow({ reviewers, reviewerList, onAddReviewer }) {
  const list = (reviewers || []).slice(0, 4);
  const getReviewer = (id) => reviewerList?.find((r) => r.id === id) ?? { name: id, initials: id.slice(0, 2).toUpperCase() };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: S[2], flexWrap: 'wrap' }}>
      {list.map((r) => {
        const rev = getReviewer(r.reviewerId);
        const borderColor = REVIEWER_STATUS_BORDER[r.status] ?? C.border;
        return (
          <div
            key={r.reviewerId}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                border: `2px solid ${borderColor}`,
                backgroundColor: C.surface2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: F.mono,
                fontSize: '10px',
                fontWeight: 700,
                color: C.textSecondary,
              }}
            >
              {rev.initials}
            </div>
            <span
              style={{
                fontFamily: F.body,
                fontSize: '10px',
                color: C.textMuted,
                maxWidth: 48,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {rev.name}
            </span>
            <span style={{ fontFamily: F.body, fontSize: '9px', color: C.textMuted }}>
              {r.status === 'approved' && 'Approved'}
              {r.status === 'changes_requested' && 'Changes'}
              {r.status === 'pending' && 'Pending'}
            </span>
          </div>
        );
      })}
      {onAddReviewer && (
        <button
          type="button"
          onClick={onAddReviewer}
          style={{
            ...btn.ghost,
            display: 'flex',
            alignItems: 'center',
            gap: S[1],
            fontSize: '12px',
            color: C.textMuted,
          }}
        >
          <span style={{ width: 28, height: 28, borderRadius: '50%', border: `1px dashed ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>+</span>
          Add reviewer
        </button>
      )}
    </div>
  );
}
