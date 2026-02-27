import { NavLink, useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import { C, F, R, S, T, shadows } from '../../tokens';

// ── Nav item definitions ──────────────────────
const NAV_ITEMS = [
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
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1.5" y="3.5" width="15" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M1.5 7l7.5 4.5L16.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
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
    label: 'Settings',
    path: '/settings',
    dividerBefore: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M9 2v1.5M9 14.5V16M2 9h1.5M14.5 9H16M3.93 3.93l1.06 1.06M13.01 13.01l1.06 1.06M3.93 14.07l1.06-1.06M13.01 4.99l1.06-1.06" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
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
      {/* Logomark */}
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
          {/* N strokes */}
          <path d="M3 15V3L15 15V3" stroke={C.textInverse} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          {/* Network nodes */}
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

// ── Nav Item ──────────────────────────────────
function NavItem({ item, collapsed }) {
  const isActive = (match) => !!match;

  const baseStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: S[3],
    padding: `${S[2]} ${S[3]}`,
    borderRadius: R.md,
    textDecoration: 'none',
    fontFamily: F.body,
    fontSize: '13px',
    fontWeight: 500,
    transition: T.color,
    position: 'relative',
    margin: `0 ${S[2]}`,
  };

  const badgeStyle = {
    marginLeft: 'auto',
    backgroundColor: C.red,
    color: '#fff',
    borderRadius: R.pill,
    fontSize: '10px',
    fontWeight: 700,
    fontFamily: F.mono,
    padding: '1px 6px',
    lineHeight: '16px',
    minWidth: '18px',
    textAlign: 'center',
  };

  const tooltipStyle = collapsed ? {
    position: 'absolute',
    left: '52px',
    backgroundColor: C.surface3,
    border: `1px solid ${C.border}`,
    borderRadius: R.md,
    padding: `${S[1]} ${S[3]}`,
    fontSize: '12px',
    fontWeight: 500,
    fontFamily: F.body,
    color: C.textPrimary,
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    opacity: 0,
    boxShadow: shadows.dropdown,
    zIndex: 50,
    transition: 'opacity 0.15s ease',
  } : null;

  return (
    <NavLink
      to={item.path}
      end={item.exact}
      style={({ isActive }) => ({
        ...baseStyle,
        backgroundColor: isActive ? C.primaryGlow : 'transparent',
        color: isActive ? C.primary : C.textSecondary,
      })}
      className={collapsed ? 'sidebar-nav-item-collapsed' : ''}
    >
      <span style={{ flexShrink: 0, display: 'flex' }}>{item.icon}</span>
      {!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}
      {!collapsed && item.badge && (
        <span style={badgeStyle}>{item.badge}</span>
      )}
      {collapsed && item.badge && (
        <span style={{
          position: 'absolute',
          top: '4px',
          right: '4px',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: C.red,
        }}/>
      )}
    </NavLink>
  );
}

// ── Sidebar ───────────────────────────────────
export default function Sidebar() {
  const collapsed = useStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useStore((s) => s.toggleSidebar);

  const sidebarStyle = {
    width: collapsed ? '60px' : '220px',
    minWidth: collapsed ? '60px' : '220px',
    height: '100vh',
    backgroundColor: C.surface,
    borderRight: `1px solid ${C.border}`,
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.2s ease, min-width 0.2s ease',
    overflow: 'hidden',
    flexShrink: 0,
    position: 'relative',
  };

  const navStyle = {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: `${S[3]} 0`,
    scrollbarWidth: 'none',
  };

  const collapseButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: `${S[2]} ${S[3]}`,
    padding: S[2],
    borderRadius: R.md,
    backgroundColor: 'transparent',
    border: 'none',
    color: C.textMuted,
    cursor: 'pointer',
    transition: T.color,
  };

  return (
    <aside style={sidebarStyle}>
      {/* Tooltip hover styles for collapsed mode */}
      <style>{`
        .sidebar-nav-item-collapsed:hover .sidebar-tooltip {
          opacity: 1 !important;
          pointer-events: auto !important;
        }
        .sidebar-nav-item-collapsed:hover {
          color: ${C.textPrimary} !important;
        }
      `}</style>

      <Logo collapsed={collapsed} />

      <nav style={navStyle}>
        {NAV_ITEMS.map((item) => (
          <div key={item.path}>
            {item.dividerBefore && (
              <div style={{
                height: '1px',
                backgroundColor: C.border,
                margin: `${S[3]} ${S[4]}`,
              }}/>
            )}
            <NavItem item={item} collapsed={collapsed} />
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: S[2] }}>
        <button
          style={collapseButtonStyle}
          onClick={toggleSidebar}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
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
