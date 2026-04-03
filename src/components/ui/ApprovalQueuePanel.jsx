/**
 * ApprovalQueuePanel — sidebar/panel showing pending approvals for the current page context.
 *
 * Props:
 *   context: string (key into approvalQueues)
 *   title: string
 */
import { useState } from 'react';
import useStore from '../../store/useStore';
import useToast from '../../hooks/useToast';
import { C, F, R, S, T, shadows } from '../../tokens';
import AgentRoleIcon, { agentIdFromName } from './AgentRoleIcon';

function formatAge(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

function ApprovalItemCard({ item, context, onResolve }) {
  const resolveApprovalItem = useStore((s) => s.resolveApprovalItem);
  const toast = useToast();

  const handleApprove = () => {
    resolveApprovalItem(context, item.id, 'approved');
    toast.success(`Approved: ${item.title || 'Item'}`);
    onResolve?.();
  };

  const handleReject = () => {
    resolveApprovalItem(context, item.id, 'rejected');
    toast.error(`Rejected: ${item.title || 'Item'}`);
    onResolve?.();
  };

  const agentLabel = item.producedBy || item.agentId || 'Agent';
  const agentIconId = item.agentId || agentIdFromName(agentLabel);

  return (
    <div style={{
      backgroundColor: C.surface2,
      border: `1px solid ${C.border}`,
      borderRadius: R.md,
      padding: S[3],
      display: 'flex',
      flexDirection: 'column',
      gap: S[2],
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: S[2] }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontFamily: F.body,
            fontSize: '13px',
            fontWeight: 600,
            color: C.textPrimary,
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {item.title || 'Approval required'}
          </p>
          <p style={{
            fontFamily: F.mono,
            fontSize: '11px',
            color: C.textMuted,
            margin: `${S[1]} 0 0`,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            {agentIconId ? <AgentRoleIcon agentId={agentIconId} size={12} color={C.textMuted} /> : null}
            <span>{agentLabel} · {formatAge(item.createdAt)}</span>
          </p>
        </div>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '2px 6px',
          borderRadius: '999px',
          backgroundColor: C.amberDim,
          border: `1px solid ${C.amber}`,
          fontFamily: F.mono,
          fontSize: '10px',
          fontWeight: 700,
          color: C.amber,
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}>
          PENDING
        </span>
      </div>

      {item.description && (
        <p style={{
          fontFamily: F.body,
          fontSize: '12px',
          color: C.textMuted,
          margin: 0,
          lineHeight: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {item.description}
        </p>
      )}

      <div style={{ display: 'flex', gap: S[2] }}>
        <button
          type="button"
          onClick={handleApprove}
          style={{
            flex: 1,
            padding: `${S[1]} 0`,
            backgroundColor: C.primary,
            color: C.textInverse,
            border: 'none',
            borderRadius: R.button,
            fontFamily: F.body,
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: T.color,
          }}
        >
          ✓ Approve
        </button>
        <button
          type="button"
          onClick={handleReject}
          style={{
            flex: 1,
            padding: `${S[1]} 0`,
            backgroundColor: 'transparent',
            color: C.red,
            border: `1px solid ${C.red}`,
            borderRadius: R.button,
            fontFamily: F.body,
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: T.color,
          }}
        >
          ✕ Reject
        </button>
      </div>
    </div>
  );
}

export default function ApprovalQueuePanel({ context, title = 'Approvals' }) {
  const queue = useStore((s) => s.approvalQueues?.[context] || []);
  const resolveApprovalItem = useStore((s) => s.resolveApprovalItem);
  const toast = useToast();

  const pending = queue.filter((i) => i.status === 'pending');
  const defaultOpen = pending.length > 0;
  const [open, setOpen] = useState(defaultOpen);

  const handleApproveAll = () => {
    pending.forEach((item) => resolveApprovalItem(context, item.id, 'approved'));
    toast.success(`Approved ${pending.length} item${pending.length !== 1 ? 's' : ''}`);
  };

  return (
    <div style={{
      backgroundColor: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: R.card,
      overflow: 'hidden',
      boxShadow: shadows.card,
    }}>
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: `${S[3]} ${S[4]}`,
          background: 'none',
          border: 'none',
          borderBottom: open ? `1px solid ${C.border}` : 'none',
          cursor: 'pointer',
          gap: S[3],
          textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
          <span style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>
            {title}
          </span>
          {pending.length > 0 && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '20px',
              height: '20px',
              padding: '0 5px',
              borderRadius: '999px',
              backgroundColor: C.red,
              fontFamily: F.mono,
              fontSize: '11px',
              fontWeight: 700,
              color: '#fff',
            }}>
              {pending.length}
            </span>
          )}
        </div>
        <span style={{
          color: C.textMuted,
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: '0.2s ease',
          display: 'inline-block',
          flexShrink: 0,
        }}>
          ▾
        </span>
      </button>

      {open && (
        <div style={{ padding: S[3], display: 'flex', flexDirection: 'column', gap: S[2] }}>
          {pending.length === 0 ? (
            /* Empty state */
            <div style={{
              padding: `${S[6]} ${S[4]}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: S[2],
            }}>
              <span style={{ fontSize: '28px' }}>✓</span>
              <p style={{
                fontFamily: F.body,
                fontSize: '13px',
                color: C.textMuted,
                textAlign: 'center',
                margin: 0,
              }}>
                All clear — no pending approvals
              </p>
            </div>
          ) : (
            <>
              {/* Approve All */}
              <button
                type="button"
                onClick={handleApproveAll}
                style={{
                  width: '100%',
                  padding: `${S[2]} 0`,
                  backgroundColor: C.greenDim,
                  color: C.green,
                  border: `1px solid ${C.green}`,
                  borderRadius: R.button,
                  fontFamily: F.body,
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: T.color,
                  marginBottom: S[1],
                }}
              >
                ✓ Approve All ({pending.length})
              </button>

              {/* Items */}
              {pending.map((item) => (
                <ApprovalItemCard key={item.id} item={item} context={context} />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
