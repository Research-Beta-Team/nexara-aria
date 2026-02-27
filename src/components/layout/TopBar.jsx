import { useState } from 'react';
import useStore from '../../store/useStore';
import useToast from '../../hooks/useToast';
import { C, F, R, S, T, shadows } from '../../tokens';

// ── Campaign options (mock) ───────────────────
const CAMPAIGNS = [
  'CFO Vietnam Q1',
  'APAC Brand Awareness',
  'SEA Demand Gen',
  'ANZ Retargeting',
  'Global Partner Enablement',
];

// ── Notification panel ────────────────────────
function NotifPanel({ onClose }) {
  const notifications = useStore((s) => s.notifications);
  const markAllRead = useStore((s) => s.markAllNotificationsRead);

  const panelStyle = {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    width: '320px',
    backgroundColor: C.surface2,
    border: `1px solid ${C.border}`,
    borderRadius: R.card,
    boxShadow: shadows.dropdown,
    zIndex: 100,
    overflow: 'hidden',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${S[3]} ${S[4]}`,
    borderBottom: `1px solid ${C.border}`,
  };

  const emptyStyle = {
    padding: `${S[8]} ${S[4]}`,
    textAlign: 'center',
    color: C.textMuted,
    fontFamily: F.body,
    fontSize: '13px',
  };

  return (
    <div style={panelStyle}>
      <div style={headerStyle}>
        <span style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>
          Notifications
        </span>
        <button
          style={{ background: 'none', border: 'none', color: C.textSecondary, fontSize: '12px', fontFamily: F.body, cursor: 'pointer' }}
          onClick={() => { markAllRead(); onClose(); }}
        >
          Mark all read
        </button>
      </div>

      {notifications.length === 0 ? (
        <div style={emptyStyle}>No notifications</div>
      ) : (
        <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
          {notifications.slice(0, 8).map((n) => (
            <div key={n.id} style={{
              padding: `${S[3]} ${S[4]}`,
              borderBottom: `1px solid ${C.border}`,
              backgroundColor: n.read ? 'transparent' : C.surface3,
              cursor: 'pointer',
            }}>
              <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary }}>{n.title}</div>
              {n.body && <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, marginTop: '2px' }}>{n.body}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Campaign selector ─────────────────────────
function CampaignSelector() {
  const [open, setOpen] = useState(false);
  const currentCampaign = useStore((s) => s.currentCampaign);
  const setCampaign = useStore((s) => s.setCampaign);
  const toast = useToast();

  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: S[2],
    backgroundColor: C.surface2,
    border: `1px solid ${C.border}`,
    borderRadius: R.button,
    padding: `${S[1]} ${S[3]}`,
    cursor: 'pointer',
    transition: T.base,
    color: C.textPrimary,
  };

  const dropdownStyle = {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    left: 0,
    minWidth: '220px',
    backgroundColor: C.surface2,
    border: `1px solid ${C.border}`,
    borderRadius: R.card,
    boxShadow: shadows.dropdown,
    zIndex: 100,
    overflow: 'hidden',
    padding: `${S[1]} 0`,
  };

  const optionStyle = (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: S[3],
    padding: `${S[2]} ${S[4]}`,
    cursor: 'pointer',
    fontFamily: F.body,
    fontSize: '13px',
    color: active ? C.primary : C.textPrimary,
    backgroundColor: active ? C.primaryGlow : 'transparent',
    transition: T.color,
  });

  return (
    <div style={{ position: 'relative' }}>
      <button style={buttonStyle} onClick={() => setOpen((o) => !o)}>
        {/* Campaign icon */}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1 7h12M1 7l3-3M1 7l3 3" stroke={C.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13 3v8" stroke={C.primary} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 500, maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {currentCampaign}
        </span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ color: C.textMuted, transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.15s ease' }}>
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div style={dropdownStyle}>
          {CAMPAIGNS.map((c) => (
            <div
              key={c}
              style={optionStyle(c === currentCampaign)}
              onClick={() => {
                setCampaign(c);
                setOpen(false);
                toast.info(`Switched to ${c}`);
              }}
            >
              {c === currentCampaign && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke={C.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              {c !== currentCampaign && <span style={{ width: '12px' }}/>}
              {c}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Avatar / Role badge ───────────────────────
function AvatarButton() {
  const currentRole = useStore((s) => s.currentRole);
  const toast = useToast();

  const avatarStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: C.surface3,
    border: `2px solid ${C.primary}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontFamily: F.mono,
    fontSize: '11px',
    fontWeight: 700,
    color: C.primary,
    flexShrink: 0,
    transition: T.base,
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
      <span style={{
        fontFamily: F.mono,
        fontSize: '10px',
        fontWeight: 700,
        color: C.textMuted,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        backgroundColor: C.surface3,
        border: `1px solid ${C.border}`,
        borderRadius: R.pill,
        padding: `2px ${S[2]}`,
      }}>
        {currentRole}
      </span>
      <div style={avatarStyle} onClick={() => toast.info('Profile settings coming soon')}>
        NX
      </div>
    </div>
  );
}

// ── TopBar ────────────────────────────────────
export default function TopBar({ onAriaOpen }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const notifications = useStore((s) => s.notifications);
  const unread = notifications.filter((n) => !n.read).length;
  const toast = useToast();

  const barStyle = {
    height: '52px',
    backgroundColor: C.surface,
    borderBottom: `1px solid ${C.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `0 ${S[6]}`,
    flexShrink: 0,
    gap: S[4],
  };

  const rightStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: S[3],
  };

  const iconButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: R.button,
    backgroundColor: 'transparent',
    border: 'none',
    color: C.textSecondary,
    cursor: 'pointer',
    transition: T.color,
    position: 'relative',
  };

  return (
    <header style={barStyle}>
      {/* Left: campaign selector */}
      <CampaignSelector />

      {/* Right: search, notif, aria, avatar */}
      <div style={rightStyle}>
        {/* Search */}
        <button
          style={iconButtonStyle}
          title="Search"
          onClick={() => toast.info('Global search coming soon')}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {/* ARIA AI button */}
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            height: '30px',
            padding: '0 10px',
            backgroundColor: C.primaryGlow,
            border: `1px solid rgba(61,220,132,0.3)`,
            borderRadius: R.pill,
            color: C.primary,
            cursor: 'pointer',
            transition: T.base,
          }}
          title="Ask ARIA"
          onClick={() => onAriaOpen?.()}
        >
          {/* ARIA triangle-A circuit mark */}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1.5L13.2 12.8H0.8L7 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
            <path d="M3.6 9.2h6.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            <circle cx="7"    cy="1.5"  r="1.1" fill="currentColor"/>
            <circle cx="0.8"  cy="12.8" r="1.1" fill="currentColor"/>
            <circle cx="13.2" cy="12.8" r="1.1" fill="currentColor"/>
          </svg>
          <span style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em' }}>ARIA</span>
        </button>

        {/* Notification bell */}
        <div style={{ position: 'relative' }}>
          <button
            style={iconButtonStyle}
            title="Notifications"
            onClick={() => setNotifOpen((o) => !o)}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1.5a5 5 0 00-5 5v2.5l-1 2h12l-1-2V6.5a5 5 0 00-5-5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M6.5 12.5a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {unread > 0 && (
              <span style={{
                position: 'absolute',
                top: '3px',
                right: '3px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: C.red,
                border: `1.5px solid ${C.surface}`,
              }}/>
            )}
          </button>
          {notifOpen && <NotifPanel onClose={() => setNotifOpen(false)} />}
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '20px', backgroundColor: C.border }}/>

        <AvatarButton />
      </div>
    </header>
  );
}
