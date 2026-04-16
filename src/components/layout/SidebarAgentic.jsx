/**
 * SidebarAgentic — Agentic: system snapshot + command nav (SVG icons only).
 */
import { NavLink } from 'react-router-dom';
import { C, F, R, S, T, scrollbarStyle } from '../../tokens';
import AgentRoleIcon from '../ui/AgentRoleIcon';
import AntariousLogo from '../ui/AntariousLogo';
import SidebarRailToggle from './SidebarRailToggle';
import {
  IconDashboard,
  IconBrain,
  IconEscalation,
  IconCampaign,
  IconWorkflow,
  IconChart,
  IconContent,
  IconKnowledge,
  IconReport,
  IconAgents,
  IconSettings,
} from './sidebarModeIcons';

const SYSTEM_STATUS = {
  activeAgents: 3,
  tasksCompleted: 47,
  activeWorkflows: 2,
  escalations: 1,
};

const ACTIVE_WORKFLOWS = [
  { id: 1, name: 'Q2 campaign launch', progress: 72 },
  { id: 2, name: 'Lead enrichment', progress: 35 },
];

const AGENT_FLEET = [
  { id: 'freya', status: 'executing' },
  { id: 'copywriter', status: 'executing' },
  { id: 'analyst', status: 'idle' },
  { id: 'optimizer', status: 'executing' },
  { id: 'guardian', status: 'verifying' },
  { id: 'prospector', status: 'idle' },
  { id: 'outreach', status: 'queued' },
  { id: 'revenue', status: 'idle' },
];

const SECTIONS = [
  {
    label: 'Command',
    items: [
      { label: 'Dashboard', path: '/', exact: true, Icon: IconDashboard },
      { label: 'Intelligence', path: '/freya-brain', Icon: IconBrain },
      { label: 'Escalations', path: '/escalations', Icon: IconEscalation, badge: SYSTEM_STATUS.escalations },
    ],
  },
  {
    label: 'Operations',
    items: [
      { label: 'Campaigns', path: '/campaigns', Icon: IconCampaign },
      { label: 'Workflows', path: '/freya/workflows', Icon: IconWorkflow },
      { label: 'Analytics', path: '/analytics', Icon: IconChart },
    ],
  },
  {
    label: 'Library',
    items: [
      { label: 'Content', path: '/content', Icon: IconContent },
      { label: 'Knowledge', path: '/knowledge', Icon: IconKnowledge },
      { label: 'Reports', path: '/reports/digest', Icon: IconReport },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Agents', path: '/agents', Icon: IconAgents },
      { label: 'Settings', path: '/settings', Icon: IconSettings },
    ],
  },
];

function linkStyle({ isActive }, collapsed) {
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: collapsed ? 'center' : 'flex-start',
    gap: S[2],
    padding: collapsed ? `${S[2]} 0` : `${S[2]} ${S[3]}`,
    margin: `0 ${collapsed ? S[1] : S[2]}`,
    borderRadius: R.md,
    textDecoration: 'none',
    color: isActive ? C.cyan : C.textSecondary,
    backgroundColor: isActive ? C.cyanDim : 'transparent',
    border: `1px solid ${isActive ? `${C.cyan}55` : 'transparent'}`,
    transition: T.color,
    minHeight: '36px',
    position: 'relative',
  };
}

function statusColor(status) {
  switch (status) {
    case 'executing':
      return C.cyan;
    case 'verifying':
      return C.amber;
    case 'queued':
      return C.sage;
    default:
      return C.textMuted;
  }
}

export default function SidebarAgentic({ collapsed, isMobile, onCloseMobile, onToggleRail }) {
  const modeChip = !collapsed && (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: S[2],
        marginTop: S[3],
        padding: `${S[2]} ${S[3]}`,
        backgroundColor: C.cyanDim,
        border: `1px solid ${C.cyan}`,
        borderRadius: R.md,
      }}
    >
      <span
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: C.cyan,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontFamily: F.mono,
          fontSize: '10px',
          fontWeight: 700,
          color: C.cyan,
          letterSpacing: '0.06em',
        }}
      >
        AGENTIC
      </span>
    </div>
  );

  const modeDot = collapsed && (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: S[2] }} title="Agentic mode">
      <span
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: C.cyan,
          boxShadow: `0 0 6px ${C.cyan}`,
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
            {modeDot}
          </>
        ) : onToggleRail && !collapsed ? (
          <>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: S[2] }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <AntariousLogo variant="dark" height={22} showWordmark />
              </div>
              <SidebarRailToggle collapsed={collapsed} onClick={onToggleRail} />
            </div>
            {modeChip}
          </>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start' }}>
              <AntariousLogo variant="dark" height={collapsed ? 26 : 22} showWordmark={!collapsed} />
            </div>
            {modeChip}
            {modeDot}
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
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: '1px',
              backgroundColor: C.border,
              margin: S[3],
              borderRadius: R.md,
              overflow: 'hidden',
            }}
          >
            {[
              { v: SYSTEM_STATUS.activeAgents, l: 'Active', c: C.cyan },
              { v: SYSTEM_STATUS.tasksCompleted, l: 'Done', c: C.green },
              { v: SYSTEM_STATUS.activeWorkflows, l: 'Flows', c: C.sage },
              {
                v: SYSTEM_STATUS.escalations,
                l: 'Escal.',
                c: SYSTEM_STATUS.escalations > 0 ? C.amber : C.textMuted,
              },
            ].map((cell) => (
              <div key={cell.l} style={{ padding: S[2], backgroundColor: C.surface2, textAlign: 'center' }}>
                <div style={{ fontFamily: F.mono, fontSize: '15px', fontWeight: 700, color: cell.c }}>{cell.v}</div>
                <div style={{ fontFamily: F.mono, fontSize: '9px', color: C.textMuted, letterSpacing: '0.04em' }}>
                  {cell.l}
                </div>
              </div>
            ))}
          </div>
        )}

        {collapsed && (
          <div style={{ padding: S[2], display: 'flex', flexDirection: 'column', alignItems: 'center', gap: S[2] }}>
            <div
              title="Active agents"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: R.md,
                backgroundColor: C.cyanDim,
                border: `1px solid ${C.cyan}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 700, color: C.cyan }}>
                {SYSTEM_STATUS.activeAgents}
              </span>
            </div>
            {SYSTEM_STATUS.escalations > 0 && (
              <NavLink
                to="/escalations"
                title="Escalations"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: R.md,
                  backgroundColor: C.amberDim,
                  border: `1px solid ${C.amber}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  fontFamily: F.mono,
                  fontSize: '13px',
                  fontWeight: 700,
                  color: C.amber,
                }}
              >
                {SYSTEM_STATUS.escalations}
              </NavLink>
            )}
          </div>
        )}

        {!collapsed && (
          <div style={{ padding: `0 ${S[4]} ${S[2]}` }}>
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
              AGENT STATUS
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[1] }}>
              {AGENT_FLEET.map((agent) => (
                <div
                  key={agent.id}
                  title={`${agent.id} · ${agent.status}`}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: agent.status === 'executing' ? `${C.cyan}18` : C.surface2,
                    border: `2px solid ${statusColor(agent.status)}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <AgentRoleIcon agentId={agent.id} size={12} color={statusColor(agent.status)} />
                  {agent.status === 'executing' && (
                    <span
                      style={{
                        position: 'absolute',
                        inset: -3,
                        border: `2px solid ${C.cyan}`,
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'sidebarAgentSpin 1.2s linear infinite',
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {!collapsed && ACTIVE_WORKFLOWS.length > 0 && (
          <div style={{ padding: `0 ${S[4]} ${S[3]}` }}>
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
              WORKFLOWS
            </div>
            {ACTIVE_WORKFLOWS.map((wf) => (
              <div
                key={wf.id}
                style={{
                  padding: S[2],
                  marginBottom: S[1],
                  backgroundColor: C.surface2,
                  border: `1px solid ${C.border}`,
                  borderRadius: R.md,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[1] }}>
                  <span style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: C.textPrimary }}>
                    {wf.name}
                  </span>
                  <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.cyan }}>{wf.progress}%</span>
                </div>
                <div style={{ height: '3px', backgroundColor: C.surface3, borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${wf.progress}%`, backgroundColor: C.cyan }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {SECTIONS.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <div
                style={{
                  fontFamily: F.mono,
                  fontSize: '10px',
                  fontWeight: 700,
                  color: C.textMuted,
                  letterSpacing: '0.08em',
                  margin: `${S[3]} ${S[4]} ${S[1]}`,
                }}
              >
                {section.label.toUpperCase()}
              </div>
            )}
            {collapsed && section.label !== SECTIONS[0].label && (
              <div style={{ height: '1px', backgroundColor: C.border, margin: `${S[2]} ${S[3]}` }} />
            )}
            {section.items.map((item) => {
              const Icon = item.Icon;
              return (
                <NavLink
                  key={`${section.label}-${item.path}-${item.label}`}
                  to={item.path}
                  end={item.exact}
                  title={collapsed ? item.label : undefined}
                  onClick={() => isMobile && onCloseMobile?.()}
                  style={(state) => linkStyle(state, collapsed)}
                >
                  <span style={{ display: 'flex', color: 'inherit', flexShrink: 0 }}>
                    <Icon />
                  </span>
                  {!collapsed && (
                    <span style={{ flex: 1, fontFamily: F.body, fontSize: '13px', fontWeight: 500 }}>{item.label}</span>
                  )}
                  {!collapsed && item.badge != null && item.badge > 0 && (
                    <span
                      style={{
                        fontFamily: F.mono,
                        fontSize: '10px',
                        fontWeight: 700,
                        color: C.textInverse,
                        backgroundColor: C.amber,
                        padding: `1px ${S[2]}`,
                        borderRadius: R.pill,
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                  {collapsed && item.badge != null && item.badge > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '6px',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: C.amber,
                      }}
                    />
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
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
          <p style={{ fontFamily: F.body, fontSize: '11px', lineHeight: 1.45, color: C.textMuted, margin: 0 }}>
            <span style={{ color: C.cyan, fontWeight: 600 }}>Agentic:</span> Freya runs end-to-end; you step in for escalations.
          </p>
        </div>
      )}

      <style>{`
        @keyframes sidebarAgentSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
