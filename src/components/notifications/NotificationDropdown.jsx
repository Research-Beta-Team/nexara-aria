import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import useToast from '../../hooks/useToast';
import { NOTIFICATIONS } from '../../data/notifications';
import NotificationItem from './NotificationItem';
import { C, F, R, S, T, Z, shadows } from '../../tokens';

const TABS = ['All', 'Unread', 'Critical'];

// ── NotificationDropdown ───────────────────────
export default function NotificationDropdown({ open, onClose }) {
  const [activeTab, setActiveTab] = useState('All');

  const navigate = useNavigate();
  const toast = useToast();

  const notifications      = useStore((s) => s.notifications);
  const markAllRead        = useStore((s) => s.markAllNotificationsRead);
  const seedNotifications  = useStore((s) => s.seedNotifications);

  // Seed store with mock data on first mount (if store is empty)
  useEffect(() => {
    if (notifications.length === 0) {
      seedNotifications(NOTIFICATIONS);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close on outside click
  const dropdownRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onClose]);

  const filtered = useMemo(() => {
    if (activeTab === 'Unread')   return notifications.filter((n) => !n.read);
    if (activeTab === 'Critical') return notifications.filter((n) => n.severity === 'critical');
    return notifications;
  }, [notifications, activeTab]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const criticalCount = notifications.filter((n) => n.severity === 'critical' && !n.read).length;

  const handleMarkAll = () => {
    markAllRead();
    toast.success('All notifications marked as read');
  };

  if (!open) return null;

  return (
    <div
      ref={dropdownRef}
      style={{
        position:        'absolute',
        top:             'calc(100% + 8px)',
        right:           0,
        width:           '400px',
        backgroundColor: C.surface2,
        border:          `1px solid ${C.border}`,
        borderRadius:    R.card,
        boxShadow:       shadows.modal,
        zIndex:          Z.dropdown,
        display:         'flex',
        flexDirection:   'column',
        overflow:        'hidden',
      }}
    >
      {/* ── Header ──────────────────────────────── */}
      <div style={{
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'space-between',
        padding:         `${S[3]} ${S[4]}`,
        borderBottom:    `1px solid ${C.border}`,
        backgroundColor: C.surface,
        flexShrink:      0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
          <span style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary }}>
            Notifications
          </span>
          {unreadCount > 0 && (
            <span style={{
              fontFamily:      F.mono,
              fontSize:        '10px',
              fontWeight:      700,
              color:           C.textInverse,
              backgroundColor: C.red,
              borderRadius:    R.pill,
              padding:         `1px 6px`,
              lineHeight:      '16px',
            }}>
              {unreadCount}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
          {unreadCount > 0 && (
            <button
              style={{
                background: 'none',
                border:     'none',
                fontFamily: F.body,
                fontSize:   '12px',
                fontWeight: 500,
                color:      C.primary,
                cursor:     'pointer',
                padding:    0,
                transition: T.color,
              }}
              onClick={handleMarkAll}
            >
              Mark all read
            </button>
          )}
          <button
            style={{
              background: 'none',
              border:     'none',
              color:      C.textMuted,
              cursor:     'pointer',
              padding:    '2px',
              display:    'flex',
              alignItems: 'center',
              transition: T.color,
            }}
            onClick={onClose}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Tabs ────────────────────────────────── */}
      <div style={{
        display:         'flex',
        gap:             0,
        borderBottom:    `1px solid ${C.border}`,
        backgroundColor: C.surface,
        flexShrink:      0,
        padding:         `0 ${S[2]}`,
      }}>
        {TABS.map((tab) => {
          const active = activeTab === tab;
          const count = tab === 'Unread' ? unreadCount : tab === 'Critical' ? criticalCount : null;
          return (
            <button
              key={tab}
              style={{
                fontFamily:       F.body,
                fontSize:         '12px',
                fontWeight:       active ? 600 : 400,
                color:            active ? C.primary : C.textSecondary,
                backgroundColor:  'transparent',
                border:           'none',
                borderBottom:     active ? `2px solid ${C.primary}` : '2px solid transparent',
                padding:          `${S[2]} ${S[3]}`,
                cursor:           'pointer',
                transition:       T.color,
                display:          'flex',
                alignItems:       'center',
                gap:              S[1],
              }}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              {count !== null && count > 0 && (
                <span style={{
                  fontFamily:      F.mono,
                  fontSize:        '10px',
                  fontWeight:      700,
                  color:           tab === 'Critical' ? C.red : C.primary,
                  backgroundColor: tab === 'Critical' ? 'rgba(248,113,113,0.12)' : C.primaryGlow,
                  borderRadius:    R.pill,
                  padding:         `0 5px`,
                  lineHeight:      '14px',
                }}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Notification list ───────────────────── */}
      <div style={{
        overflowY:    'auto',
        maxHeight:    '400px',
        scrollbarWidth: 'thin',
        scrollbarColor: `${C.border} transparent`,
      }}>
        {filtered.length === 0 ? (
          <div style={{
            padding:    `${S[10]} ${S[6]}`,
            textAlign:  'center',
            color:      C.textMuted,
            fontFamily: F.body,
            fontSize:   '13px',
          }}>
            <div style={{ fontSize: '24px', marginBottom: S[2] }}>🔔</div>
            {activeTab === 'Unread'
              ? 'All caught up! No unread notifications.'
              : activeTab === 'Critical'
              ? 'No critical notifications right now.'
              : 'No notifications yet.'}
          </div>
        ) : (
          filtered.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              compact={true}
              onClose={onClose}
            />
          ))
        )}
      </div>

      {/* ── Footer ──────────────────────────────── */}
      <div style={{
        borderTop:       `1px solid ${C.border}`,
        backgroundColor: C.surface,
        padding:         `${S[3]} ${S[4]}`,
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'space-between',
        flexShrink:      0,
      }}>
        <button
          style={{
            background:  'none',
            border:      'none',
            fontFamily:  F.body,
            fontSize:    '12px',
            fontWeight:  600,
            color:       C.primary,
            cursor:      'pointer',
            padding:     0,
            transition:  T.color,
          }}
          onClick={() => { navigate('/notification-center'); onClose(); }}
        >
          View all notifications →
        </button>
        <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>
          {notifications.length} total
        </span>
      </div>
    </div>
  );
}
