/**
 * SidebarManual — Manual mode: workbench nav, agents, recent work (SVG icons only).
 */
import { NavLink } from 'react-router-dom';
import useToast from '../../hooks/useToast';
import { C, F, R, S, T, scrollbarStyle } from '../../tokens';
import AgentRoleIcon from '../ui/AgentRoleIcon';
import AntariousLogo from '../ui/AntariousLogo';
import SidebarRailToggle from './SidebarRailToggle';
import {
  IconDashboard,
  IconContent,
  IconClipboard,
  IconKnowledge,
  IconSettings,
} from './sidebarModeIcons';

const AGENTS = [
  { id: 'copywriter', name: 'Copywriter' },
  { id: 'strategist', name: 'Strategist' },
  { id: 'analyst', name: 'Analyst' },
  { id: 'prospector', name: 'Prospector' },
  { id: 'optimizer', name: 'Optimizer' },
  { id: 'outreach', name: 'Outreach' },
  { id: 'revenue', name: 'Revenue' },
  { id: 'guardian', name: 'Guardian' },
];

const RECENT_WORK = [
  { id: 1, title: 'Email subject lines', agent: 'copywriter', status: 'draft' },
  { id: 2, title: 'CTR analysis', agent: 'analyst', status: 'posted' },
  { id: 3, title: 'LinkedIn post', agent: 'outreach', status: 'draft' },
];

const NAV = [
  { label: 'Workbench', path: '/', exact: true, Icon: IconDashboard },
  { label: 'Content library', path: '/content', Icon: IconContent },
  { label: 'Approvals', path: '/campaigns/approvals', Icon: IconClipboard },
  { label: 'Knowledge base', path: '/knowledge', Icon: IconKnowledge },
  { label: 'Settings', path: '/settings', Icon: IconSettings },
];

function navLinkStyle({ isActive }, collapsed) {
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: collapsed ? 'center' : 'flex-start',
    gap: S[2],
    padding: collapsed ? `${S[2]} 0` : `${S[2]} ${S[3]}`,
    margin: `0 ${collapsed ? S[1] : S[2]}`,
    borderRadius: R.md,
    textDecoration: 'none',
    color: isActive ? C.red : C.textSecondary,
    backgroundColor: isActive ? C.redDim : 'transparent',
    border: `1px solid ${isActive ? C.red : 'transparent'}`,
    transition: T.color,
    minHeight: '36px',
  };
}

export default function SidebarManual({ collapsed, isMobile, onCloseMobile, onToggleRail }) {
  const toast = useToast();

  const manualChip = !collapsed && (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: S[2],
        marginTop: S[3],
        padding: `${S[2]} ${S[3]}`,
        backgroundColor: C.redDim,
        border: `1px solid ${C.red}`,
        borderRadius: R.md,
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: C.red,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontFamily: F.mono,
          fontSize: '10px',
          fontWeight: 700,
          color: C.red,
          letterSpacing: '0.08em',
        }}
      >
        MANUAL
      </span>
    </div>
  );

  const manualDot = collapsed && (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: S[2] }} title="Manual mode">
      <span
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: C.red,
        }}
      />
    </div>
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      <div style={{ flexShrink: 0, padding: collapsed ? S[3] : S[4], borderBottom: `1px solid ${C.border}` }}>
        {onToggleRail && collapsed ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: S[2] }}>
              <SidebarRailToggle collapsed={collapsed} onClick={onToggleRail} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AntariousLogo variant="dark" height={26} showWordmark={false} />
            </div>
            {manualDot}
          </>
        ) : onToggleRail && !collapsed ? (
          <>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: S[2] }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <AntariousLogo variant="dark" height={22} showWordmark />
              </div>
              <SidebarRailToggle collapsed={collapsed} onClick={onToggleRail} />
            </div>
            {manualChip}
          </>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start' }}>
              <AntariousLogo variant="dark" height={collapsed ? 26 : 22} showWordmark={!collapsed} />
            </div>
            {manualChip}
            {manualDot}
          </>
        )}
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          ...scrollbarStyle,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {!collapsed && (
          <div style={{ padding: S[3], borderBottom: `1px solid ${C.border}` }}>
            <div
              style={{
                fontFamily: F.mono,
                fontSize: '10px',
                fontWeight: 700,
                color: C.textMuted,
                letterSpacing: '0.08em',
                marginBottom: S[2],
              }}
            >
              AGENTS
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                gap: S[1],
              }}
            >
              {AGENTS.map((agent) => (
                <button
                  key={agent.id}
                  type="button"
                  title={agent.name}
                  onClick={() => toast.info(`${agent.name} — use workbench to run tasks`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    aspectRatio: '1',
                    backgroundColor: C.surface2,
                    border: `1px solid ${C.border}`,
                    borderRadius: R.sm,
                    cursor: 'pointer',
                    transition: T.color,
                  }}
                >
                  <AgentRoleIcon agentId={agent.id} size={16} color={C.textSecondary} />
                </button>
              ))}
            </div>
          </div>
        )}

        {collapsed && (
          <div
            style={{
              padding: `${S[2]} 0`,
              borderBottom: `1px solid ${C.border}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: S[1],
            }}
          >
            {AGENTS.map((agent) => (
              <button
                key={agent.id}
                type="button"
                title={agent.name}
                onClick={() => toast.info(`${agent.name} — use workbench to run tasks`)}
                style={{
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: C.surface2,
                  border: `1px solid ${C.border}`,
                  borderRadius: R.sm,
                  cursor: 'pointer',
                }}
              >
                <AgentRoleIcon agentId={agent.id} size={16} color={C.textSecondary} />
              </button>
            ))}
          </div>
        )}

        {!collapsed && (
          <div style={{ padding: S[3], borderBottom: `1px solid ${C.border}` }}>
            <div
              style={{
                fontFamily: F.mono,
                fontSize: '10px',
                fontWeight: 700,
                color: C.textMuted,
                letterSpacing: '0.08em',
                marginBottom: S[2],
              }}
            >
              RECENT
            </div>
            {RECENT_WORK.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => toast.info(`Open: ${item.title}`)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: S[2],
                  padding: `${S[2]} ${S[1]}`,
                  marginBottom: '2px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: R.sm,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <AgentRoleIcon agentId={item.agent} size={14} color={C.textMuted} />
                <span
                  style={{
                    flex: 1,
                    minWidth: 0,
                    fontFamily: F.body,
                    fontSize: '12px',
                    color: C.textSecondary,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.title}
                </span>
                <span
                  style={{
                    fontFamily: F.mono,
                    fontSize: '9px',
                    fontWeight: 700,
                    color: item.status === 'posted' ? C.green : C.amber,
                    textTransform: 'uppercase',
                    flexShrink: 0,
                  }}
                >
                  {item.status}
                </span>
              </button>
            ))}
          </div>
        )}

        <nav style={{ padding: `${S[3]} 0 ${S[2]}` }}>
          {!collapsed && (
            <div
              style={{
                fontFamily: F.mono,
                fontSize: '10px',
                fontWeight: 700,
                color: C.textMuted,
                letterSpacing: '0.08em',
                margin: `0 ${S[4]} ${S[2]}`,
              }}
            >
              NAVIGATION
            </div>
          )}
          {NAV.map((item) => {
            const Icon = item.Icon;
            return (
              <NavLink
                key={item.path + item.label}
                to={item.path}
                end={item.exact}
                title={collapsed ? item.label : undefined}
                onClick={() => isMobile && onCloseMobile?.()}
                style={(state) => navLinkStyle(state, collapsed)}
              >
                <span style={{ display: 'flex', color: 'inherit', flexShrink: 0 }}>
                  <Icon />
                </span>
                {!collapsed && (
                  <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 500 }}>{item.label}</span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {!collapsed && (
        <div
          style={{
            flexShrink: 0,
            padding: S[3],
            borderTop: `1px solid ${C.border}`,
            backgroundColor: C.surface2,
          }}
        >
          <p
            style={{
              fontFamily: F.body,
              fontSize: '11px',
              lineHeight: 1.45,
              color: C.textMuted,
              margin: 0,
            }}
          >
            <span style={{ color: C.red, fontWeight: 600 }}>Manual:</span> Run agents on demand, edit output, then publish.
          </p>
        </div>
      )}
    </div>
  );
}
