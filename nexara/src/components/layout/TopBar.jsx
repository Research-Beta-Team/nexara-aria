import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, X } from 'lucide-react';
import useStore from '../../store/useStore';
import useToast from '../../hooks/useToast';
import useCredits from '../../hooks/useCredits';
import usePlan from '../../hooks/usePlan';
import NotificationDropdown from '../notifications/NotificationDropdown';
import UpgradeModal from '../plan/UpgradeModal';
import { IconWarning } from '../ui/Icons';
import { C, F, R, S, T, shadows } from '../../tokens';

// ── Campaign options (mock) ───────────────────
const CAMPAIGNS = [
  'CFO Vietnam Q1',
  'APAC Brand Awareness',
  'SEA Demand Gen',
  'ANZ Retargeting',
  'Global Partner Enablement',
];

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
  const navigate = useNavigate();

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
      <div style={avatarStyle} onClick={() => navigate('/settings')}>
        NX
      </div>
    </div>
  );
}

// ── Theme toggle button ───────────────────────
function ThemeToggle() {
  const isDarkMode  = useStore((s) => s.isDarkMode);
  const toggleTheme = useStore((s) => s.toggleTheme);

  return (
    <button
      onClick={toggleTheme}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
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
        flexShrink: 0,
      }}
    >
      {isDarkMode ? (
        /* Sun — click to switch to light */
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M3.05 12.95l1.06-1.06M11.89 4.11l1.06-1.06" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ) : (
        /* Moon — click to switch to dark */
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M13.5 10.5A6 6 0 015.5 2.5a6 6 0 108 8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </button>
  );
}

// ── Credit chip ───────────────────────────────
function CreditChip() {
  const {
    creditsRemaining,
    creditsIncluded,
    rolloverBalance,
    usagePercent,
    isLow,
    isCritical,
    estimatedDaysRemaining,
  } = useCredits();
  const navigate   = useNavigate();
  const [hovered, setHovered] = useState(false);

  const chipColor = isCritical ? C.red : isLow ? C.amber : C.primary;
  const chipBg    = isCritical ? C.redDim : isLow ? C.amberDim : C.primaryGlow;
  const totalAvail = creditsIncluded + rolloverBalance;
  const daysLabel  = Number.isFinite(estimatedDaysRemaining)
    ? `~${estimatedDaysRemaining}d remaining`
    : 'unlimited';

  return (
    <div style={{ position: 'relative' }}>
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: S[1],
          height: '28px',
          padding: `0 ${S[2]}`,
          backgroundColor: chipBg,
          border: `1px solid ${chipColor}`,
          borderRadius: R.pill,
          color: chipColor,
          cursor: 'pointer',
          fontFamily: F.mono,
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.02em',
          whiteSpace: 'nowrap',
          transition: T.color,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => navigate('/billing')}
        title="View billing & credits"
      >
        <Zap size={11} />
        {creditsRemaining.toLocaleString()}
      </button>

      {/* Tooltip */}
      {hovered && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          right: 0,
          backgroundColor: C.surface2,
          border: `1px solid ${C.border}`,
          borderRadius: R.card,
          padding: S[3],
          boxShadow: shadows.dropdown,
          zIndex: 200,
          minWidth: '200px',
          display: 'flex',
          flexDirection: 'column',
          gap: S[1],
          pointerEvents: 'none',
        }}>
          <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textPrimary }}>
            Agent Credits
          </div>
          <div style={{ fontFamily: F.mono, fontSize: '11px', color: C.textSecondary }}>
            {creditsRemaining.toLocaleString()} remaining
          </div>
          <div style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>
            {creditsIncluded.toLocaleString()} included
            {rolloverBalance > 0 && ` + ${rolloverBalance.toLocaleString()} rollover`}
          </div>
          <div style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>
            {daysLabel}
          </div>
          {/* Mini bar */}
          <div style={{ height: '3px', borderRadius: R.pill, backgroundColor: C.surface3, marginTop: S[1] }}>
            <div style={{
              width: `${Math.min(100, usagePercent)}%`,
              height: '100%',
              borderRadius: R.pill,
              backgroundColor: chipColor,
            }} />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Low credit banner ─────────────────────────
function LowCreditBanner() {
  const { isLow, creditsRemaining } = useCredits();
  const { planId, upgradePlan }     = usePlan();
  const toast = useToast();

  const [dismissed, setDismissed] = useState(() => {
    const val = localStorage.getItem('nexara_credit_banner_dismissed');
    if (!val) return false;
    return Date.now() - parseInt(val, 10) < 24 * 60 * 60 * 1000;
  });

  const [showUpgrade, setShowUpgrade] = useState(false);

  if (!isLow || dismissed) return null;

  return (
    <>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: S[4],
        backgroundColor: C.amberDim,
        borderBottom: `1px solid ${C.amber}`,
        padding: `${S[2]} ${S[6]}`,
        flexShrink: 0,
      }}>
        <span style={{ fontFamily: F.body, fontSize: '13px', color: C.amber, flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
          <IconWarning color={C.amber} width={16} height={16} />
          Low on credits — {creditsRemaining.toLocaleString()} credits remaining.
        </span>
        <button
          style={{
            fontFamily: F.body,
            fontSize: '12px',
            fontWeight: 600,
            color: C.amber,
            background: 'none',
            border: `1px solid ${C.amber}`,
            borderRadius: R.button,
            padding: `${S[1]} ${S[3]}`,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
          onClick={() => toast.info('Processing credits purchase... (mock)')}
        >
          Buy 10K credits — $99
        </button>
        {upgradePlan && (
          <button
            style={{
              fontFamily: F.body,
              fontSize: '12px',
              fontWeight: 600,
              color: C.amber,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
            }}
            onClick={() => setShowUpgrade(true)}
          >
            Upgrade plan
          </button>
        )}
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: C.amber,
            padding: S[1],
            borderRadius: R.sm,
          }}
          onClick={() => {
            localStorage.setItem('nexara_credit_banner_dismissed', Date.now().toString());
            setDismissed(true);
          }}
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      </div>

      {showUpgrade && upgradePlan && (
        <UpgradeModal
          fromPlan={planId}
          toPlan={upgradePlan.id}
          featureUnlocked={null}
          onClose={() => setShowUpgrade(false)}
        />
      )}
    </>
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
    <>
      <header style={barStyle}>
        {/* Left: campaign selector */}
        <CampaignSelector />

        {/* Right: search, aria, theme, notif, credit chip, divider, avatar */}
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

          {/* Theme toggle */}
          <ThemeToggle />

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
            <NotificationDropdown open={notifOpen} onClose={() => setNotifOpen(false)} />
          </div>

          {/* Credit chip */}
          <CreditChip />

          {/* Divider */}
          <div style={{ width: '1px', height: '20px', backgroundColor: C.border }}/>

          <AvatarButton />
        </div>
      </header>

      <LowCreditBanner />
    </>
  );
}
