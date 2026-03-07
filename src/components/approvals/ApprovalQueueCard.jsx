/**
 * Single item in the approval queue: type icon, title, meta, stage badge, URGENT badge, mini chain tracker.
 */
import { C, F, R, S } from '../../tokens';
import { APPROVAL_STAGES, CONTENT_TYPES } from '../../data/approvalsMock';
import { isUrgent } from '../../data/approvalsMock';
import ApprovalChainTracker from './ApprovalChainTracker';

const STAGE_LABELS = {
  draft: 'Draft',
  legal: 'Legal Review',
  brand: 'Brand Review',
  cmo: 'CMO',
  published: 'Published',
};

const STAGE_STYLE = {
  draft: { bg: C.surface3, color: C.textMuted },
  legal: { bg: C.amberDim, color: C.amber },
  brand: { bg: 'rgba(94,234,212,0.15)', color: C.secondary },
  cmo: { bg: 'rgba(167,139,250,0.2)', color: '#A78BFA' },
  published: { bg: C.greenDim, color: C.primary },
};

function ContentTypeIcon({ type }) {
  const icon = CONTENT_TYPES[type]?.icon || 'file';
  const w = 20;
  const h = 20;
  return (
    <div style={{ width: w, height: h, color: C.textMuted, flexShrink: 0 }}>
      {icon === 'mail' && (
        <svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      )}
      {icon === 'megaphone' && (
        <svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8a4 4 0 0 1 0 8M18 8a8 8 0 0 0-16 0 8 8 0 0 0 16 0" />
          <line x1="6" y1="15" x2="6" y2="22" />
          <line x1="10" y1="15" x2="10" y2="22" />
          <line x1="14" y1="15" x2="14" y2="22" />
        </svg>
      )}
      {icon === 'calendar' && (
        <svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      )}
      {icon === 'file' && (
        <svg width={w} height={h} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      )}
    </div>
  );
}

function timeAgo(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function ApprovalQueueCard({ item, selected, onSelect, selectedIds, onToggleSelect }) {
  const stageLabel = STAGE_LABELS[item.stage] || item.stage;
  const stageStyle = STAGE_STYLE[item.stage] || STAGE_STYLE.draft;
  const urgent = isUrgent(item);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(item)}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(item)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: S[2],
        padding: S[3],
        backgroundColor: selected ? C.surface2 : C.surface,
        border: `1px solid ${selected ? C.primary : C.border}`,
        borderLeftWidth: selected ? 4 : 1,
        borderLeftColor: selected ? C.primary : C.border,
        borderRadius: R.card,
        cursor: 'pointer',
        minHeight: 88,
        transition: 'background-color 0.15s ease, border-color 0.15s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: S[3] }}>
        {onToggleSelect && (
          <input
            type="checkbox"
            checked={selectedIds?.has(item.id) ?? false}
            onChange={(e) => onToggleSelect(e, item)}
            onClick={(e) => e.stopPropagation()}
            style={{ marginTop: 2, flexShrink: 0, cursor: 'pointer' }}
          />
        )}
        <ContentTypeIcon type={item.contentType} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary, marginBottom: 2 }}>
            {item.title}
          </div>
          <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>
            {item.campaignName} · Created by {item.createdBy} · {timeAgo(item.createdAt)}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: S[1] }}>
          <span
            style={{
              fontFamily: F.mono,
              fontSize: '10px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: R.pill,
              backgroundColor: stageStyle.bg,
              color: stageStyle.color,
              border: `1px solid ${stageStyle.color}40`,
            }}
          >
            {stageLabel}
          </span>
          {urgent && (
            <span
              style={{
                fontFamily: F.mono,
                fontSize: '9px',
                fontWeight: 700,
                color: C.red,
                backgroundColor: C.redDim,
                padding: '2px 6px',
                borderRadius: R.pill,
              }}
            >
              URGENT
            </span>
          )}
        </div>
      </div>
      <ApprovalChainTracker currentStage={item.stage} rejected={item.rejected} variant="mini" />
    </div>
  );
}
