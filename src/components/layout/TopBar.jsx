import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Menu } from 'lucide-react';
import useStore from '../../store/useStore';
import useToast from '../../hooks/useToast';
import useCredits from '../../hooks/useCredits';
import usePlan from '../../hooks/usePlan';
import usePlanAlerts from '../../hooks/usePlanAlerts';
import NotificationDropdown from '../notifications/NotificationDropdown';
import UpgradeModal from '../plan/UpgradeModal';
import PlanExpiryWarning from '../plan/PlanExpiryWarning';
import { IconWarning } from '../ui/Icons';
import AntariousLogo from '../ui/AntariousLogo';
import TopBarCommandModeBadge from '../ui/TopBarCommandModeBadge';
import TopBarGlobalSearch from '../ui/TopBarGlobalSearch';
import TopBarFreyaMenu from '../ui/TopBarFreyaMenu';
import TopBarCreditsMenu from '../ui/TopBarCreditsMenu';
import TopBarUserMenu from '../ui/TopBarUserMenu';
import { C, F, R, S, T, shadows, Z } from '../../tokens';

// ── Campaign options (mock) ───────────────────
const CAMPAIGNS = [
  'CFO Vietnam Q1',
  'APAC Brand Awareness',
  'SEA Demand Gen',
  'ANZ Retargeting',
  'Global Partner Enablement',
];

// ── Campaign selector ─────────────────────────
function CampaignSelector({ isCompact = false }) {
  const [open, setOpen] = useState(false);
  const currentCampaign = useStore((s) => s.currentCampaign);
  const setCampaign = useStore((s) => s.setCampaign);
  const toast = useToast();

  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: S[2],
    backgroundColor: C.bg,
    border: `1px solid ${C.border}`,
    borderRadius: R.md,
    padding: `${S[2]} ${S[3]}`,
    cursor: 'pointer',
    transition: T.base,
    color: C.textPrimary,
    boxShadow: shadows.inset,
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
    <div style={{ position: 'relative', minWidth: 0, width: '100%', maxWidth: '100%' }}>
      <button type="button" style={{ ...buttonStyle, maxWidth: '100%', minWidth: 0 }} onClick={() => setOpen((o) => !o)}>
        {/* Campaign icon */}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1 7h12M1 7l3-3M1 7l3 3" stroke={C.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13 3v8" stroke={C.primary} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span style={{
          fontFamily: F.display,
          fontSize: isCompact ? '12px' : '13px',
          fontWeight: 600,
          flex: 1,
          minWidth: 0,
          maxWidth: isCompact ? '120px' : 'min(200px, 22vw)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
        >
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

// ── Theme toggle button ───────────────────────
function ThemeToggle() {
  const isDarkMode  = useStore((s) => s.isDarkMode);
  const toggleTheme = useStore((s) => s.toggleTheme);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
        borderRadius: R.button,
        backgroundColor: C.surface3,
        border: `1px solid ${C.border}`,
        color: C.textSecondary,
        cursor: 'pointer',
        transition: T.base,
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
export default function TopBar({ onFreyaOpen, isMobile = false, onOpenMobileNav }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [centerPanel, setCenterPanel] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setCenterPanel(null);
        return;
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setCenterPanel((p) => (p === 'search' ? null : 'search'));
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);
  const notifications = useStore((s) => s.notifications);
  const inboxUnreadCount = useStore((s) => s.inboxUnreadCount);
  const approvalQueues = useStore((s) => s.approvalQueues);
  const pendingApprovalCount = Object.values(approvalQueues || {}).flat().filter((i) => i.status === 'pending').length;
  const unread = notifications.filter((n) => !n.read).length;
  const toast = useToast();
  const { expiryWarning } = usePlanAlerts();

  const barStyle = {
    position: 'relative',
    zIndex: Z.sticky,
    minHeight: isMobile ? '52px' : '56px',
    backgroundColor: C.surface,
    borderBottom: `1px solid ${C.border}`,
    boxShadow: `inset 0 -1px 0 color-mix(in srgb, ${C.primary} 8%, transparent)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: `max(${S[2]}, env(safe-area-inset-top, 0px))`,
    paddingBottom: S[2],
    paddingLeft: isMobile ? `max(${S[3]}, env(safe-area-inset-left, 0px))` : S[5],
    paddingRight: isMobile ? `max(${S[3]}, env(safe-area-inset-right, 0px))` : S[5],
    flexShrink: 0,
    isolation: 'isolate',
  };

  /**
   * Desktop: single flex row — left (shrinks + truncates) | center (fixed intrinsic) | right (scroll if needed).
   * Avoids grid column overlap when the campaign name or toolbar is wide.
   */
  const rowStyle = isMobile
    ? {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        width: '100%',
        maxWidth: '100%',
        gap: S[4],
      }
    : {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'nowrap',
        gap: S[3],
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        minHeight: '52px',
      };

  const leftRailStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: isMobile ? S[2] : S[3],
    minWidth: 0,
    flex: isMobile ? undefined : '1 1 0',
    overflow: isMobile ? 'visible' : 'hidden',
    justifyContent: isMobile ? 'space-between' : 'flex-start',
    maxWidth: isMobile ? '100%' : '100%',
  };

  const leftContextShellStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    minWidth: 0,
    flex: 1,
    width: '100%',
    maxWidth: '100%',
    padding: isMobile ? 0 : `${S[2]} ${S[3]}`,
    backgroundColor: isMobile ? 'transparent' : C.surface2,
    border: isMobile ? 'none' : `1px solid ${C.border}`,
    borderRadius: isMobile ? 0 : R.md,
    boxShadow: isMobile ? 'none' : shadows.inset,
  };

  const centerZoneStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,
    flex: isMobile ? undefined : '0 0 auto',
    flexShrink: 0,
    width: isMobile ? '100%' : 'auto',
  };

  const centerWellStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: isMobile ? 'wrap' : 'nowrap',
    rowGap: isMobile ? S[2] : S[2],
    columnGap: isMobile ? S[2] : S[4],
    flexShrink: 0,
    minWidth: 0,
    width: isMobile ? '100%' : 'auto',
    maxWidth: isMobile ? '100%' : 'min(520px, 100%)',
    padding: isMobile ? `${S[2]} ${S[3]}` : `${S[2]} ${S[4]}`,
    backgroundColor: C.surface2,
    border: `1px solid ${C.border}`,
    borderRadius: R.md,
    boxShadow: shadows.inset,
    overflow: 'visible',
    position: 'relative',
  };

  const rightZoneStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: isMobile ? 'space-between' : 'flex-end',
    gap: isMobile ? S[2] : S[2],
    minWidth: 0,
    flex: isMobile ? undefined : '0 1 auto',
    maxWidth: '100%',
    overflowX: isMobile ? 'visible' : 'auto',
    overflowY: 'hidden',
    flexWrap: 'nowrap',
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'thin',
  };

  /** One bordered cluster: inbox / notifs / approvals | Freya / theme / credits / account */
  const rightToolbarStyle = {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'nowrap',
    flexShrink: 0,
    gap: isMobile ? S[2] : S[2],
    padding: isMobile ? `${S[1]} ${S[2]}` : `${S[1]} ${S[3]}`,
    backgroundColor: C.surface2,
    border: `1px solid ${C.border}`,
    borderRadius: R.md,
    boxShadow: shadows.inset,
    position: 'relative',
    overflow: 'visible',
  };

  const alertClusterStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 0,
    flexShrink: 0,
    padding: '2px',
    borderRadius: R.sm,
    backgroundColor: C.bg,
    border: `1px solid ${C.border}`,
  };

  const iconButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: isMobile ? '40px' : '34px',
    height: isMobile ? '40px' : '34px',
    borderRadius: R.sm,
    backgroundColor: 'transparent',
    border: 'none',
    color: C.textSecondary,
    cursor: 'pointer',
    transition: T.color,
    position: 'relative',
  };

  const vRule = (h = 22) => (
    <div
      aria-hidden
      style={{
        width: '1px',
        height: `${h}px`,
        backgroundColor: C.border,
        flexShrink: 0,
        alignSelf: 'center',
        opacity: 0.85,
      }}
    />
  );

  return (
    <>
      <header style={barStyle}>
        <div style={rowStyle}>
          {/* Zone A — mobile nav + campaign context */}
          <div style={leftRailStyle}>
            {isMobile && (
              <button
                type="button"
                aria-label="Open navigation"
                onClick={() => {
                  onOpenMobileNav?.();
                }}
                style={{
                  ...iconButtonStyle,
                  border: `1px solid ${C.border}`,
                  backgroundColor: C.surface2,
                  color: C.textPrimary,
                }}
              >
                <Menu size={20} strokeWidth={2} />
              </button>
            )}
            {isMobile && (
              <div style={{ flexShrink: 0, opacity: 0.9 }}>
                <AntariousLogo variant="dark" height={22} />
              </div>
            )}
            <div style={leftContextShellStyle}>
              {!isMobile && (
                <span
                  style={{
                    fontFamily: F.mono,
                    fontSize: '9px',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: C.textMuted,
                    textTransform: 'uppercase',
                  }}
                >
                  Active campaign
                </span>
              )}
              <CampaignSelector isCompact={isMobile} />
            </div>
          </div>

          {/* Zone B — search + command mode */}
          <div style={centerZoneStyle}>
            <div style={centerWellStyle}>
              <TopBarGlobalSearch
                isMobile={isMobile}
                open={centerPanel === 'search'}
                onToggle={() => setCenterPanel((p) => (p === 'search' ? null : 'search'))}
                onClose={() => setCenterPanel((p) => (p === 'search' ? null : p))}
              />
              {vRule(isMobile ? 22 : 28)}
              <TopBarCommandModeBadge
                isMobile={isMobile}
                open={centerPanel === 'mode'}
                onToggle={() => setCenterPanel((p) => (p === 'mode' ? null : 'mode'))}
                onClose={() => setCenterPanel((p) => (p === 'mode' ? null : p))}
              />
            </div>
          </div>

          {/* Zone C — single toolbar row (alerts + co-pilot + account); parent scrolls horizontally if needed */}
          <div style={rightZoneStyle}>
            <div style={rightToolbarStyle}>
              <div style={alertClusterStyle} aria-label="Inbox and alerts">
                <button
                  type="button"
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
                    }}
                    >
                      {inboxUnreadCount > 99 ? '99+' : inboxUnreadCount}
                    </span>
                  )}
                </button>

                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <button
                    type="button"
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
                      }}
                      />
                    )}
                  </button>
                  <NotificationDropdown open={notifOpen} onClose={() => setNotifOpen(false)} />
                </div>

                {pendingApprovalCount > 0 && (
                  <button
                    type="button"
                    style={{
                      ...iconButtonStyle,
                      position: 'relative',
                    }}
                    title={`${pendingApprovalCount} pending approval${pendingApprovalCount !== 1 ? 's' : ''}`}
                    onClick={() => toast.info(`${pendingApprovalCount} pending approval${pendingApprovalCount !== 1 ? 's' : ''} — check the Approval Queue panel on each page`)}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 1L9.8 5.2L14.5 5.6L11 8.7L12.1 13.4L8 10.9L3.9 13.4L5 8.7L1.5 5.6L6.2 5.2L8 1Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
                    </svg>
                    <span style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      minWidth: '14px',
                      height: '14px',
                      padding: '0 3px',
                      borderRadius: '7px',
                      backgroundColor: C.red,
                      border: `1.5px solid ${C.surface}`,
                      fontFamily: F.mono,
                      fontSize: '9px',
                      fontWeight: 700,
                      color: C.textOnDanger,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    >
                      {pendingApprovalCount > 99 ? '99+' : pendingApprovalCount}
                    </span>
                  </button>
                )}
              </div>

              {!isMobile && vRule(24)}

              <TopBarFreyaMenu isMobile={isMobile} onFreyaOpen={onFreyaOpen} />
              <ThemeToggle />
              <TopBarCreditsMenu isMobile={isMobile} />
              {!isMobile && vRule(22)}
              <TopBarUserMenu isMobile={isMobile} />
            </div>
          </div>
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
