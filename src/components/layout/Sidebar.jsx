import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Lock } from 'lucide-react';
import useStore from '../../store/useStore';
import { PLANS } from '../../config/plans';
import usePlan from '../../hooks/usePlan';
import useCredits from '../../hooks/useCredits';
import useToast from '../../hooks/useToast';
import CreditBar from '../plan/CreditBar';
import PlanBadge from '../plan/PlanBadge';
import UpgradeModal from '../plan/UpgradeModal';
import { C, F, R, S, T, shadows } from '../../tokens';

// ── Nav section / item definitions ────────────
const NAV_SECTIONS = [
  {
    id: 'core',
    items: [
      {
        label: 'Dashboard',
        path: '/',
        exact: true,
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="1.5" y="1.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="10.5" y="1.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="1.5" y="10.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="10.5" y="10.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        ),
      },
      {
        label: 'Campaigns',
        path: '/campaigns',
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 9h14M2 9l4-4M2 9l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 4v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        label: 'Agents',
        path: '/agents',
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M2.5 15.5c0-3.314 2.91-6 6.5-6s6.5 2.686 6.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="14" cy="5" r="1.5" fill="currentColor"/>
          </svg>
        ),
      },
      {
        label: 'Escalations',
        path: '/escalations',
        badge: 3,
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2L16 14H2L9 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M9 7v3M9 12v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        label: 'Analytics',
        path: '/analytics',
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 14h14M5 14V9m4 5V6m4 8V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        label: 'Inbox',
        path: '/inbox',
        gatedFeature: 'unifiedInbox',
        requiredPlan: 'growth',
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="1.5" y="3.5" width="15" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M1.5 7l7.5 4.5L16.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
      },
    ],
  },

  {
    id: 'ops',
    dividerBefore: true,
    items: [
      {
        label: 'Meta Monitor',
        path: '/meta',
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 13l4-5 3 3 3-4 4 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="1.5" y="1.5" width="15" height="15" rx="2" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        ),
      },
      {
        label: 'Query Manager',
        path: '/querymanager',
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="1.5" y="4.5" width="15" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M5 9l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 8h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M12 10h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        label: 'Notifications',
        path: '/notification-center',
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2a5 5 0 0 1 5 5v3l1.5 2.5H2.5L4 10V7a5 5 0 0 1 5-5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M7 14.5a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        ),
      },
    ],
  },

  {
    id: 'research',
    dividerBefore: true,
    label: 'RESEARCH',
    collapsible: true,
    items: [
      {
        label: 'ICP Builder',
        path: '/research/icp',
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M9 2.5V4.5M9 13.5V15.5M2.5 9H4.5M13.5 9H15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        label: 'Intent Signals',
        path: '/intent',
        gatedFeature: 'intentSignals',
        requiredPlan: 'growth',
        liveBadge: true,
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M5.5 13.5A6 6 0 0 1 5.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M12.5 4.5A6 6 0 0 1 12.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M3 16A9 9 0 0 1 3 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            <path d="M15 2A9 9 0 0 1 15 16" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        label: 'Competitive Intel',
        path: '/competitive',
        gatedFeature: 'competitiveIntel',
        requiredPlan: 'scale',
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2L15.5 5V9.5C15.5 13 12.5 15.8 9 16.5C5.5 15.8 2.5 13 2.5 9.5V5L9 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M6.5 9l1.5 1.5 3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
      },
    ],
  },

  {
    id: 'campaigns',
    dividerBefore: true,
    label: 'CAMPAIGNS',
    collapsible: true,
    items: [
      {
        label: 'ABM Engine',
        path: '/abm',
        gatedFeature: 'abmEngine',
        requiredPlan: 'growth',
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="3" cy="4" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
            <circle cx="15" cy="4" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
            <circle cx="3" cy="14" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
            <circle cx="15" cy="14" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M4.5 4.8L7.5 7.5M10.5 7.5L13.5 4.8M4.5 13.2L7.5 10.5M10.5 10.5L13.5 13.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        label: 'Playbooks',
        path: '/playbooks',
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="3" y="2" width="12" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M6 6.5l1.5 1.5 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 10.5h6M6 13h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        ),
      },
    ],
  },

  {
    id: 'revenue',
    dividerBefore: true,
    label: 'REVENUE',
    collapsible: true,
    items: [
      {
        label: 'Pipeline',
        path: '/revenue/pipeline',
        gatedFeature: 'pipelineManager',
        requiredPlan: 'growth',
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 3.5h14l-5 6v5l-4-2V9.5L2 3.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
      },
      {
        label: 'Forecasting',
        path: '/forecast',
        gatedFeature: 'predictiveForecasting',
        requiredPlan: 'scale',
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 14l4-5 3 2 5-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 4h4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
      },
      {
        label: 'Customer Success',
        path: '/customer-success',
        gatedFeature: 'customerSuccess',
        requiredPlan: 'scale',
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 15.5S2 11.5 2 6.5A4 4 0 0 1 9 4a4 4 0 0 1 7 2.5C16 11.5 9 15.5 9 15.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
        ),
      },
    ],
  },

  {
    id: 'content',
    dividerBefore: true,
    items: [
      {
        label: 'Content',
        path: '/content',
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="3" y="1.5" width="12" height="15" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M6 6h6M6 9h6M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        label: 'Knowledge Base',
        path: '/knowledge',
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2c-3 0-5.5 1.5-5.5 4.5 0 2 1.5 3.5 3.5 4v3l2-1.5 2 1.5v-3c2-.5 3.5-2 3.5-4C14.5 3.5 12 2 9 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M7 7.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        ),
      },
    ],
  },

  {
    id: 'admin',
    dividerBefore: true,
    label: 'WORKSPACE',
    collapsible: true,
    items: [
      {
        label: 'Team',
        path: '/team',
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="7" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M1.5 15c0-2.761 2.462-5 5.5-5s5.5 2.239 5.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="13" cy="5.5" r="2" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M16.5 14c0-2.209-1.567-4-3.5-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        label: 'Client Portals',
        path: '/portals',
        gatedFeature: 'clientPortal',
        requiredPlan: 'growth',
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="1.5" y="3.5" width="10" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M11.5 6.5H15a1.5 1.5 0 0 1 1.5 1.5v5A1.5 1.5 0 0 1 15 14.5h-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M8.5 9H14M12 7l2 2-2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
      },
      {
        label: 'White-Label',
        path: '/whitelabel',
        gatedFeature: 'whiteLabel',
        requiredPlan: 'scale',
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M9 2v2M9 14v2M2 9h2M14 9h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M4.1 4.1l1.4 1.4M12.5 12.5l1.4 1.4M4.1 13.9l1.4-1.4M12.5 5.5l1.4-1.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        label: 'Billing',
        path: '/billing',
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="1.5" y="4.5" width="15" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M1.5 7.5h15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M4.5 11.5h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        label: 'Settings',
        path: '/settings',
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M9 2v1.5M9 14.5V16M2 9h1.5M14.5 9H16M3.93 3.93l1.06 1.06M13.01 13.01l1.06 1.06M3.93 14.07l1.06-1.06M13.01 4.99l1.06-1.06" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        ),
      },
    ],
  },

  {
    id: 'aria',
    dividerBefore: true,
    label: 'ARIA',
    collapsible: true,
    items: [
      {
        label: 'ARIA Intelligence',
        path: '/aria-brain',
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2a4 4 0 0 1 4 4v2a4 4 0 0 1-4 4 4 4 0 0 1-4-4V6a4 4 0 0 1 4-4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 12v4M6 14l3 2 3-2M9 12a4 4 0 0 0 4-4h1.5a5.5 5.5 0 0 1-5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
      },
    ],
  },
];

// ── Logo mark ─────────────────────────────────
function Logo({ collapsed }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: S[3],
      padding: `${S[5]} ${S[5]}`,
      borderBottom: `1px solid ${C.border}`,
      flexShrink: 0,
    }}>
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: R.md,
        backgroundColor: C.primary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: `0 0 14px rgba(61,220,132,0.35)`,
      }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M3 15V3L15 15V3" stroke={C.textInverse} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="3"  cy="3"  r="1.6" fill={C.textInverse}/>
          <circle cx="3"  cy="15" r="1.6" fill={C.textInverse}/>
          <circle cx="15" cy="3"  r="1.6" fill={C.textInverse}/>
          <circle cx="15" cy="15" r="1.6" fill={C.textInverse}/>
        </svg>
      </div>
      {!collapsed && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{
            fontFamily: F.display,
            fontSize: '16px',
            fontWeight: 800,
            color: C.textPrimary,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>
            nexara
          </span>
          <span style={{
            fontFamily: F.mono,
            fontSize: '9px',
            fontWeight: 700,
            color: C.textMuted,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginTop: '2px',
          }}>
            AI Platform
          </span>
        </div>
      )}
    </div>
  );
}

// ── Section header (expanded sidebar only) ────
function SectionHeader({ label, collapsible, isOpen, onToggle }) {
  return (
    <div
      onClick={collapsible ? onToggle : undefined}
      style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        padding:        `${S[1]} ${S[4]} ${S[1]}`,
        cursor:         collapsible ? 'pointer' : 'default',
        userSelect:     'none',
        marginTop:      S[1],
      }}
    >
      <span style={{
        fontFamily:    F.mono,
        fontSize:      '10px',
        fontWeight:    700,
        color:         C.textMuted,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      }}>
        {label}
      </span>
      {collapsible && (
        <svg
          width="10" height="10" viewBox="0 0 10 10" fill="none"
          style={{
            transform:  isOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
            transition: 'transform 0.15s ease',
            color:      C.textMuted,
            flexShrink: 0,
          }}
        >
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </div>
  );
}

// ── Nav Item (unlocked) ────────────────────────
function NavItem({ item, collapsed }) {
  const baseStyle = {
    display:        'flex',
    alignItems:     'center',
    gap:            S[3],
    padding:        `${S[2]} ${S[3]}`,
    borderRadius:   R.md,
    textDecoration: 'none',
    fontFamily:     F.body,
    fontSize:       '13px',
    fontWeight:     500,
    transition:     T.color,
    position:       'relative',
    margin:         `0 ${S[2]}`,
  };

  const badgeStyle = {
    marginLeft:      'auto',
    backgroundColor: C.red,
    color:           '#fff',
    borderRadius:    R.pill,
    fontSize:        '10px',
    fontWeight:      700,
    fontFamily:      F.mono,
    padding:         '1px 6px',
    lineHeight:      '16px',
    minWidth:        '18px',
    textAlign:       'center',
  };

  return (
    <NavLink
      to={item.path}
      end={item.exact}
      style={({ isActive }) => ({
        ...baseStyle,
        backgroundColor: isActive ? C.primaryGlow : 'transparent',
        color:           isActive ? C.primary : C.textSecondary,
      })}
      className={collapsed ? 'sidebar-nav-item-collapsed' : ''}
      title={collapsed ? item.label : undefined}
    >
      <span style={{ flexShrink: 0, display: 'flex' }}>{item.icon}</span>
      {!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}
      {!collapsed && item.liveBadge && (
        <span style={{
          fontFamily: F.mono,
          fontSize: '9px',
          fontWeight: 700,
          color: C.primary,
          backgroundColor: C.primaryGlow,
          padding: '2px 6px',
          borderRadius: R.pill,
          letterSpacing: '0.04em',
        }}>
          LIVE
        </span>
      )}
      {!collapsed && item.badge && (
        <span style={badgeStyle}>{item.badge}</span>
      )}
      {collapsed && item.badge && (
        <span style={{
          position:        'absolute',
          top:             '4px',
          right:           '4px',
          width:           '8px',
          height:          '8px',
          borderRadius:    '50%',
          backgroundColor: C.red,
        }}/>
      )}
      {collapsed && item.liveBadge && (
        <span style={{
          position:        'absolute',
          top:             '4px',
          right:           '4px',
          width:           '6px',
          height:          '6px',
          borderRadius:    '50%',
          backgroundColor: C.primary,
        }}/>
      )}
    </NavLink>
  );
}

// ── Gated Nav Item ─────────────────────────────
// Self-contained: checks plan access and renders either a normal NavItem or a
// locked placeholder that opens UpgradeModal on click.
function GatedNavItem({ item, collapsed }) {
  const { hasFeature, planId } = usePlan();
  const [showUpgrade, setShowUpgrade] = useState(false);

  // No gate defined, or user has access → regular nav item
  if (!item.gatedFeature || hasFeature(item.gatedFeature)) {
    return <NavItem item={item} collapsed={collapsed} />;
  }

  // Plan access denied → locked appearance
  const requiredPlanObj = PLANS[item.requiredPlan] ?? PLANS.growth;
  const tooltip = collapsed
    ? `${item.label} — Requires ${requiredPlanObj.displayName}`
    : `Requires ${requiredPlanObj.displayName} · Click to upgrade`;

  return (
    <>
      <div
        role="button"
        title={tooltip}
        onClick={() => setShowUpgrade(true)}
        style={{
          display:     'flex',
          alignItems:  'center',
          gap:         S[3],
          padding:     `${S[2]} ${S[3]}`,
          borderRadius: R.md,
          fontFamily:  F.body,
          fontSize:    '13px',
          fontWeight:  500,
          transition:  T.color,
          position:    'relative',
          margin:      `0 ${S[2]}`,
          opacity:     0.45,
          cursor:      'default',
          color:       C.textSecondary,
          userSelect:  'none',
        }}
      >
        <span style={{ flexShrink: 0, display: 'flex' }}>{item.icon}</span>
        {!collapsed && (
          <>
            <span style={{ flex: 1 }}>{item.label}</span>
            <Lock size={12} color={C.textMuted} />
          </>
        )}
      </div>

      {showUpgrade && (
        <UpgradeModal
          fromPlan={planId}
          toPlan={item.requiredPlan}
          featureUnlocked={item.gatedFeature}
          onClose={() => setShowUpgrade(false)}
        />
      )}
    </>
  );
}

// ── Plan Status Section ────────────────────────
// Compact credit + plan info panel above the collapse toggle.
function PlanStatusSection({ collapsed }) {
  const { planId, canUpgrade, upgradePlan } = usePlan();
  const { isLow }                           = useCredits();
  const toast                               = useToast();
  const [showUpgrade, setShowUpgrade]       = useState(false);

  return (
    <>
      <div style={{
        borderTop:     `1px solid ${C.border}`,
        padding:       collapsed ? `${S[2]} ${S[2]}` : `${S[3]} ${S[4]}`,
        display:       'flex',
        flexDirection: 'column',
        gap:           S[2],
        flexShrink:    0,
      }}>
        {/* Plan badge row — expanded sidebar only */}
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <PlanBadge planId={planId} size="sm" showIcon />
            <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>
              plan
            </span>
          </div>
        )}

        {/* Compact credit bar — always visible */}
        <CreditBar size="compact" />

        {/* Low-credit warning — expanded only */}
        {!collapsed && isLow && (
          <div style={{ display: 'flex', alignItems: 'center', gap: S[1] }}>
            <span style={{ fontFamily: F.body, fontSize: '11px', color: C.amber, flex: 1 }}>
              Running low
            </span>
            <button
              style={{
                fontFamily:          F.body,
                fontSize:            '11px',
                fontWeight:          600,
                color:               C.amber,
                background:          'none',
                border:              'none',
                cursor:              'pointer',
                padding:             0,
                textDecoration:      'underline',
                textUnderlineOffset: '2px',
              }}
              onClick={() => toast.info('Processing credits purchase... (mock)')}
            >
              Buy Credits
            </button>
          </div>
        )}

        {/* Upgrade nudge — expanded only, hidden on Agency */}
        {!collapsed && canUpgrade && upgradePlan && (
          <button
            style={{
              fontFamily: F.body,
              fontSize:   '11px',
              fontWeight: 500,
              color:      C.textMuted,
              background: 'none',
              border:     'none',
              cursor:     'pointer',
              padding:    0,
              textAlign:  'left',
              display:    'flex',
              alignItems: 'center',
              gap:        S[1],
            }}
            onClick={() => setShowUpgrade(true)}
          >
            Upgrade to {upgradePlan.displayName} →
          </button>
        )}
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

// ── Sidebar ───────────────────────────────────
export default function Sidebar() {
  const collapsed     = useStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useStore((s) => s.toggleSidebar);

  const [openSections, setOpenSections] = useState({ research: true, revenue: true, campaigns: true, aria: true });

  const toggleSection = (id) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Items visible when: sidebar collapsed (show all) | section not collapsible | section is open
  const isSectionOpen = (section) => {
    if (collapsed) return true;
    if (!section.collapsible) return true;
    return openSections[section.id] !== false;
  };

  const sidebarStyle = {
    width:           collapsed ? '60px' : '220px',
    minWidth:        collapsed ? '60px' : '220px',
    height:          '100vh',
    backgroundColor: C.surface,
    borderRight:     `1px solid ${C.border}`,
    display:         'flex',
    flexDirection:   'column',
    transition:      'width 0.2s ease, min-width 0.2s ease',
    overflow:        'hidden',
    flexShrink:      0,
    position:        'relative',
  };

  const navStyle = {
    flex:           1,
    overflowY:      'auto',
    overflowX:      'hidden',
    padding:        `${S[3]} 0`,
    scrollbarWidth: 'none',
  };

  const collapseButtonStyle = {
    display:         'flex',
    alignItems:      'center',
    justifyContent:  'center',
    margin:          `${S[2]} ${S[3]}`,
    padding:         S[2],
    borderRadius:    R.md,
    backgroundColor: 'transparent',
    border:          'none',
    color:           C.textMuted,
    cursor:          'pointer',
    transition:      T.color,
  };

  return (
    <aside style={sidebarStyle}>
      <style>{`
        .sidebar-nav-item-collapsed:hover {
          color: ${C.textPrimary} !important;
          background-color: ${C.surface2} !important;
        }
      `}</style>

      <Logo collapsed={collapsed} />

      <nav style={navStyle}>
        {NAV_SECTIONS.map((section) => (
          <div key={section.id}>
            {/* Divider */}
            {section.dividerBefore && (
              <div style={{
                height:          '1px',
                backgroundColor: C.border,
                margin:          `${S[3]} ${S[4]}`,
              }}/>
            )}

            {/* Section header — expanded sidebar only */}
            {section.label && !collapsed && (
              <SectionHeader
                label={section.label}
                collapsible={section.collapsible}
                isOpen={openSections[section.id] !== false}
                onToggle={() => toggleSection(section.id)}
              />
            )}

            {/* Nav items — all routed through GatedNavItem */}
            {isSectionOpen(section) && section.items.map((item) => (
              <GatedNavItem key={item.path} item={item} collapsed={collapsed} />
            ))}
          </div>
        ))}
      </nav>

      {/* Plan status panel — above the collapse toggle */}
      <PlanStatusSection collapsed={collapsed} />

      {/* Dev: Role Switcher — only in development */}
      {typeof import.meta !== 'undefined' && import.meta.env?.DEV && (
        <div style={{ borderTop: `1px solid ${C.border}`, padding: S[2] }}>
          <NavLink
            to="/dev/roles"
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: S[2],
              padding: S[2],
              borderRadius: R.md,
              fontFamily: F.body,
              fontSize: '11px',
              color: C.textMuted,
              textDecoration: 'none',
              backgroundColor: isActive ? C.surface2 : 'transparent',
            })}
          >
            <span style={{ opacity: 0.8 }}>Dev:</span> Switch Role
          </NavLink>
        </div>
      )}

      {/* Collapse toggle */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: S[2] }}>
        <button
          style={collapseButtonStyle}
          onClick={toggleSidebar}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg
            width="16" height="16" viewBox="0 0 16 16" fill="none"
            style={{ transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
          >
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {!collapsed && (
            <span style={{ marginLeft: S[2], fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>
              Collapse
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
