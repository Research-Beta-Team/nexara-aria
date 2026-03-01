import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import useToast from '../../hooks/useToast';
import { NOTIF_TYPES, NOTIF_SEVERITY_COLORS } from '../../data/notifications';
import { C, F, R, S, T, btn } from '../../tokens';

// ── Type icon SVGs ─────────────────────────────
function TypeIcon({ type, color }) {
  const iconStyle = {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: `${color}18`,
    border: `1px solid ${color}30`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };

  const icons = {
    escalation: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 1L13.5 12H.5L7 1z" stroke={color} strokeWidth="1.3" strokeLinejoin="round"/>
        <path d="M7 5.5v3" stroke={color} strokeWidth="1.3" strokeLinecap="round"/>
        <circle cx="7" cy="10" r="0.8" fill={color}/>
      </svg>
    ),
    intent_alert: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M5 1.5L8.5 7H2L5 1.5z" stroke={color} strokeWidth="1.3" strokeLinejoin="round"/>
        <path d="M8 7.5l2.5 4.5H5.5L8 7.5z" stroke={color} strokeWidth="1.3" strokeLinejoin="round"/>
        <path d="M10.5 3l1 1M11.5 3l-1 1" stroke={color} strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
    agent_complete: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="5.5" stroke={color} strokeWidth="1.3"/>
        <path d="M4.5 7l2 2 3.5-3.5" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    reply_received: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M1.5 2h11a.5.5 0 01.5.5v7a.5.5 0 01-.5.5h-9L1 12V2.5a.5.5 0 01.5-.5z" stroke={color} strokeWidth="1.3" strokeLinejoin="round"/>
        <path d="M4 5.5h6M4 7.5h4" stroke={color} strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
    approval_due: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="5.5" stroke={color} strokeWidth="1.3"/>
        <path d="M7 3.5V7l2 2" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    demo_booked: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="1.5" y="2.5" width="11" height="10" rx="1" stroke={color} strokeWidth="1.3"/>
        <path d="M4.5 1v3M9.5 1v3M1.5 6h11" stroke={color} strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M4.5 8.5h.5M6.75 8.5h.5M9 8.5h.5" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    report_ready: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M3 1.5h5.5L11 4v8.5H3V1.5z" stroke={color} strokeWidth="1.3" strokeLinejoin="round"/>
        <path d="M8.5 1.5V4H11" stroke={color} strokeWidth="1.3" strokeLinejoin="round"/>
        <path d="M5 6.5h4M5 8.5h3" stroke={color} strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
    budget_alert: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="5.5" stroke={color} strokeWidth="1.3"/>
        <path d="M7 3.5v1M7 9.5v1" stroke={color} strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M5 6c0-.8.9-1.5 2-1.5s2 .7 2 1.5c0 .8-.9 1.5-2 1.5S5 6.8 5 6z" stroke={color} strokeWidth="1.3"/>
        <path d="M5.5 7.5c.2.7 1 1.5 2.5.5" stroke={color} strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  };

  return <div style={iconStyle}>{icons[type] ?? icons.report_ready}</div>;
}

// ── NotificationItem ───────────────────────────
export default function NotificationItem({ notification, compact = false, onClose }) {
  const { id, type, severity, title, body, time, read, link, actionLabel } = notification;
  const navigate = useNavigate();
  const toast = useToast();
  const markRead = useStore((s) => s.markNotificationRead);
  const removeNotif = useStore((s) => s.removeNotification);

  const typeInfo = NOTIF_TYPES[type] ?? NOTIF_TYPES.report_ready;
  const severityColor = NOTIF_SEVERITY_COLORS[severity] ?? NOTIF_SEVERITY_COLORS.low;

  const handleClick = () => {
    if (!read) markRead(id);
    if (link) {
      navigate(link);
      onClose?.();
    }
  };

  const handleAction = (e) => {
    e.stopPropagation();
    if (!read) markRead(id);
    toast.info(`${actionLabel}: ${title}`);
    if (link) {
      navigate(link);
      onClose?.();
    }
  };

  const handleDismiss = (e) => {
    e.stopPropagation();
    removeNotif(id);
    toast.info('Notification dismissed');
  };

  const rowStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: S[3],
    padding: compact ? `${S[3]} ${S[4]}` : `${S[4]} ${S[5]}`,
    borderBottom: `1px solid ${C.border}`,
    backgroundColor: read ? 'transparent' : 'rgba(61,220,132,0.04)',
    cursor: 'pointer',
    transition: T.color,
    position: 'relative',
  };

  return (
    <div style={rowStyle} onClick={handleClick}>
      {/* Severity dot */}
      <div style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: read ? C.border : severityColor,
        flexShrink: 0,
        marginTop: '11px',
        boxShadow: read ? 'none' : `0 0 4px ${severityColor}60`,
        transition: T.base,
      }}/>

      {/* Type icon */}
      <TypeIcon type={type} color={typeInfo.color} />

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2], justifyContent: 'space-between' }}>
          <span style={{
            fontFamily: F.body,
            fontSize: '13px',
            fontWeight: read ? 500 : 700,
            color: C.textPrimary,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
          }}>
            {title}
          </span>
          <span style={{
            fontFamily: F.mono,
            fontSize: '11px',
            color: C.textMuted,
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}>
            {time}
          </span>
        </div>

        <span style={{
          fontFamily: F.body,
          fontSize: '12px',
          color: C.textSecondary,
          display: '-webkit-box',
          WebkitLineClamp: compact ? 1 : 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: '1.5',
        }}>
          {body}
        </span>

        {/* Type tag + action row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginTop: '3px' }}>
          <span style={{
            fontFamily: F.mono,
            fontSize: '10px',
            fontWeight: 600,
            color: typeInfo.color,
            backgroundColor: `${typeInfo.color}15`,
            border: `1px solid ${typeInfo.color}25`,
            borderRadius: R.pill,
            padding: `1px ${S[2]}`,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}>
            {typeInfo.label}
          </span>

          {actionLabel && (
            <button
              style={{
                ...btn.ghost,
                fontSize: '11px',
                padding: `1px ${S[2]}`,
                color: typeInfo.color,
                height: 'auto',
              }}
              onClick={handleAction}
            >
              {actionLabel} →
            </button>
          )}

          {!compact && (
            <button
              style={{
                ...btn.ghost,
                fontSize: '11px',
                padding: `1px ${S[2]}`,
                color: C.textMuted,
                marginLeft: 'auto',
                height: 'auto',
              }}
              onClick={handleDismiss}
            >
              Dismiss
            </button>
          )}
        </div>
      </div>

      {/* Unread dot (right side) */}
      {!read && (
        <div style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          backgroundColor: C.primary,
          flexShrink: 0,
          marginTop: '8px',
        }}/>
      )}
    </div>
  );
}
