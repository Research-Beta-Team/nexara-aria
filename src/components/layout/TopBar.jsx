import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Zap, X } from 'lucide-react';
import useStore from '../../store/useStore';
import useToast from '../../hooks/useToast';
import useCredits from '../../hooks/useCredits';
import usePlan from '../../hooks/usePlan';
import usePlanAlerts from '../../hooks/usePlanAlerts';
import NotificationDropdown from '../notifications/NotificationDropdown';
import UpgradeModal from '../plan/UpgradeModal';
import PlanExpiryWarning from '../plan/PlanExpiryWarning';
import { getRoleDisplayName, ROLE_IDS } from '../../config/roleConfig';
import { IconWarning } from '../ui/Icons';
import AntariousLogo from '../ui/AntariousLogo';
import { C, F, R, S, T, shadows } from '../../tokens';

// ── Campaign options (mock) ───────────────────
const CAMPAIGNS = [
  'CFO Vietnam Q1',
  'APAC Brand Awareness',
  'SEA Demand Gen',
  'ANZ Retargeting',
  'Global Partner Enablement',
];

// ── Breadcrumb from pathname ───────────────────
function Breadcrumb() {
  const location = useLocation();
  const path = location.pathname.replace(/^\//, '') || 'dashboard';
  const segments = path.split('/').filter(Boolean);
  const labels = {
    '': 'Dashboard',
    campaigns: 'Campaigns',
    agents: 'Agents',
    content: 'Content',
    knowledge: 'Knowledge base',
    inbox: 'Company Social Inbox',
    analytics: 'Analytics',
    meta: 'Meta Ads Monitor',
    escalations: 'Escalations',
    querymanager: 'Team Query',
    'notification-center': 'Notifications',
    research: 'Research',
    icp: 'ICP Builder',
    intent: 'Intent Signals',
    competitive: 'Competitive Intel',
    abm: 'ABM Engine',
    playbooks: 'Playbooks',
    revenue: 'Revenue',
    pipeline: 'Pipeline',
    forecast: 'Forecast',
    customers: 'Customer Success',
    'customer-success': 'Customer Success',
    settings: 'Settings',
    aria: 'Freya',
    billing: 'Billing',
    team: 'Team',
    whitelabel: 'White-Label',
    dev: 'Dev',
    roles: 'Role Switcher',
    new: 'New',
    upgrade: 'Upgrade',
  };
  const title = segments.length > 0
    ? (labels[segments[segments.length - 1]] ?? segments[segments.length - 1])
    : 'Dashboard';
  return (
    <span style={{
      fontFamily: F.body,
      fontSize: '13px',
      fontWeight: 500,
      color: C.textSecondary,
      textTransform: 'capitalize',
    }}>
      {title}
    </span>
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

// ── Mock user accounts (switch account) ───────
const MOCK_ACCOUNTS = [
  { id: 'main', label: 'Asif', email: 'asif@nexara.demo', current: true },
  { id: 'work', label: 'Work account', email: 'asif.work@company.com', current: false },
  { id: 'personal', label: 'Personal', email: 'asif.personal@gmail.com', current: false },
];

// ── Avatar / Account dropdown ─────────────────
function AvatarButton() {
  const currentRole = useStore((s) => s.currentRole);
  const setRole = useStore((s) => s.setRole);
  const logout = useStore((s) => s.logout);
  const navigate = useNavigate();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const isDev = typeof import.meta !== 'undefined' && import.meta.env?.DEV === true;

  const avatarStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: C.surface3,
    border: `2px solid ${open ? C.primary : C.border}`,
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

  const dropdownStyle = {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    minWidth: '240px',
    backgroundColor: C.surface2,
    border: `1px solid ${C.border}`,
    borderRadius: R.card,
    boxShadow: shadows.dropdown,
    zIndex: 200,
    overflow: 'hidden',
    padding: `${S[2]} 0`,
  };

  const itemStyle = (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: S[3],
    width: '100%',
    padding: `${S[2]} ${S[4]}`,
    border: 'none',
    background: active ? C.primaryGlow : 'transparent',
    color: active ? C.primary : C.textPrimary,
    fontFamily: F.body,
    fontSize: '13px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: T.color,
  });

  const sectionLabelStyle = {
    padding: `${S[1]} ${S[4]} ${S[1]}`,
    fontFamily: F.mono,
    fontSize: '10px',
    fontWeight: 700,
    color: C.textMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  };

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: S[2] }}>
      {/* Role pill — in dev mode click opens role switcher dropdown */}
      {isDev ? (
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setRoleDropdownOpen((o) => !o)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: S[1],
              padding: `2px ${S[2]}`,
              fontFamily: F.mono,
              fontSize: '10px',
              fontWeight: 700,
              color: C.textMuted,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              backgroundColor: C.surface3,
              border: `1px solid ${roleDropdownOpen ? C.primary : C.border}`,
              borderRadius: R.pill,
              cursor: 'pointer',
              transition: T.color,
            }}
          >
            {getRoleDisplayName(currentRole)}
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ transform: roleDropdownOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.15s ease' }}>
              <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {roleDropdownOpen && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 198 }} onClick={() => setRoleDropdownOpen(false)} aria-hidden="true" />
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: 0,
                  minWidth: '200px',
                  backgroundColor: C.surface2,
                  border: `1px solid ${C.border}`,
                  borderRadius: R.card,
                  boxShadow: shadows.dropdown,
                  zIndex: 200,
                  overflow: 'hidden',
                  padding: `${S[1]} 0`,
                }}
              >
                {ROLE_IDS.map((roleId) => (
                  <button
                    key={roleId}
                    type="button"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      padding: `${S[2]} ${S[4]}`,
                      border: 'none',
                      background: currentRole === roleId ? C.primaryGlow : 'transparent',
                      color: currentRole === roleId ? C.primary : C.textPrimary,
                      fontFamily: F.body,
                      fontSize: '13px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: T.color,
                    }}
                    onClick={() => {
                      setRole(roleId);
                      toast.success(`Now viewing as ${getRoleDisplayName(roleId)}`);
                      setRoleDropdownOpen(false);
                    }}
                  >
                    {getRoleDisplayName(roleId)}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
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
          {getRoleDisplayName(currentRole)}
        </span>
      )}
      <div
        role="button"
        tabIndex={0}
        style={avatarStyle}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen((o) => !o); } }}
        aria-haspopup="true"
        aria-expanded={open}
      >
        NX
      </div>

      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 199 }} onClick={() => setOpen(false)} aria-hidden="true" />
          <div style={dropdownStyle}>
            {/* Accounts list */}
            <div style={sectionLabelStyle}>Accounts</div>
            {MOCK_ACCOUNTS.map((acc) => (
              <button
                key={acc.id}
                type="button"
                style={itemStyle(acc.current)}
                onClick={() => {
                  if (!acc.current) toast.info(`Switch to ${acc.label} (mock)`);
                  setOpen(false);
                }}
              >
                <span style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: acc.current ? C.primary : C.surface3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.mono, fontSize: '10px', color: acc.current ? C.textInverse : C.textMuted }}>
                  {acc.label.slice(0, 1)}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600 }}>{acc.label}{acc.current ? ' (current)' : ''}</div>
                  <div style={{ fontSize: '11px', color: C.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{acc.email}</div>
                </div>
              </button>
            ))}

            <div style={{ height: 1, backgroundColor: C.border, margin: `${S[2]} 0` }} />

            <button type="button" style={itemStyle()} onClick={() => { navigate('/settings'); setOpen(false); }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 8.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M2.5 2.5l1 1M10.5 10.5l1 1M2.5 11.5l1-1M10.5 3.5l1-1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
              Settings
            </button>
            <button type="button" style={itemStyle()} onClick={() => { toast.info('Accounts (mock)'); setOpen(false); }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="4" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 12c0-2.5 2-4 6-4s6 1.5 6 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
              Accounts
            </button>
            <button type="button" style={itemStyle()} onClick={() => { navigate('/settings'); setOpen(false); }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="2" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M5 6h4M5 8h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
              Manage accounts
            </button>

            <div style={{ height: 1, backgroundColor: C.border, margin: `${S[2]} 0` }} />
            <button
              type="button"
              style={{ ...itemStyle(), color: C.red }}
              onClick={() => {
                setOpen(false);
                logout();
                navigate('/login');
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 12H3a1 1 0 01-1-1V3a1 1 0 011-1h2M9 10l3-3-3-3M6 7h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Sign out
            </button>
          </div>
        </>
      )}
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
          boxSizing: 'content-box',
          fontFamily: F.body,
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
  const navigate = useNavigate();
  const notifications = useStore((s) => s.notifications);
  const inboxUnreadCount = useStore((s) => s.inboxUnreadCount);
  const currentRole = useStore((s) => s.currentRole);
  const unread = notifications.filter((n) => !n.read).length;
  const toast = useToast();
  const { expiryWarning } = usePlanAlerts();
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

  const leftStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: S[4],
    minWidth: 0,
  };

  const centerStyle = {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    minWidth: 0,
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
        {/* Left: logo + client switcher (owner/csm) or campaign selector */}
        <div style={leftStyle}>
          <AntariousLogo variant="dark" height={24} />
          <CampaignSelector />
        </div>

        {/* Center: breadcrumb */}
        <div style={centerStyle}>
          <Breadcrumb />
        </div>

        {/* Right: search, Freya, theme, notif, credit chip, divider, avatar */}
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

          {/* Inbox — pending messages */}
          <button
            style={iconButtonStyle}
            title="Company Social Inbox"
            onClick={() => navigate('/inbox')}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h12v8H2V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M2 4l6 4 6-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {inboxUnreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                minWidth: '14px',
                height: '14px',
                padding: '0 4px',
                borderRadius: '7px',
                backgroundColor: C.red,
                border: `1.5px solid ${C.surface}`,
                fontFamily: F.mono,
                fontSize: '10px',
                fontWeight: 700,
                color: C.textOnDanger,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {inboxUnreadCount > 99 ? '99+' : inboxUnreadCount}
              </span>
            )}
          </button>

          {/* Freya button */}
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              height: '30px',
              padding: '0 10px',
              backgroundColor: C.primaryGlow,
              border: `1px solid ${C.primary}`,
              borderRadius: R.pill,
              color: C.primary,
              cursor: 'pointer',
              transition: T.base,
            }}
            title="Ask Freya"
            onClick={() => onAriaOpen?.()}
          >
            {/* Freya mark */}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1.5L13.2 12.8H0.8L7 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
              <path d="M3.6 9.2h6.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              <circle cx="7"    cy="1.5"  r="1.1" fill="currentColor"/>
              <circle cx="0.8"  cy="12.8" r="1.1" fill="currentColor"/>
              <circle cx="13.2" cy="12.8" r="1.1" fill="currentColor"/>
            </svg>
            <span style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em' }}>Freya</span>
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

      {expiryWarning && (
        <div style={{ padding: `0 ${S[6]}`, flexShrink: 0 }}>
          <PlanExpiryWarning
            kind={expiryWarning.kind}
            renewDate={expiryWarning.renewDate}
            amount={expiryWarning.amount}
            cardLast4={expiryWarning.cardLast4}
            daysLeft={expiryWarning.daysLeft}
            compact
            onReviewPlan={() => navigate('/billing')}
            onUpdatePayment={() => toast.info('Update payment method (mock)')}
          />
        </div>
      )}

      <LowCreditBanner />
    </>
  );
}
