/**
 * SidebarSemiAuto — Semi-auto: approvals, Freya status (SVG icons only).
 */
import { NavLink } from 'react-router-dom';
import useStore from '../../store/useStore';
import useToast from '../../hooks/useToast';
import { C, F, R, S, T, scrollbarStyle } from '../../tokens';
import AgentRoleIcon from '../ui/AgentRoleIcon';
import AntariousLogo from '../ui/AntariousLogo';
import FreyaLogo from '../ui/FreyaLogo';
import SidebarRailToggle from './SidebarRailToggle';
import {
  IconClipboard,
  IconCheckCircle,
  IconCampaign,
  IconContent,
  IconChart,
  IconAgents,
  IconWorkflow,
  IconKnowledge,
  IconSettings,
} from './sidebarModeIcons';

const PENDING_APPROVALS = [
  { id: 1, title: 'Q2 email draft', agent: 'copywriter', urgency: 'high' },
  { id: 2, title: 'LinkedIn post', agent: 'outreach', urgency: 'normal' },
  { id: 3, title: 'Performance report', agent: 'analyst', urgency: 'low' },
  { id: 4, title: 'A/B test setup', agent: 'optimizer', urgency: 'normal' },
];

const FREYA_STATUS = {
  currentTask: 'Drafting email sequence',
  agent: 'copywriter',
};

const SECTIONS = [
  {
    label: 'Approvals',
    items: [
      { label: 'Review queue', path: '/', exact: true, Icon: IconClipboard, badge: PENDING_APPROVALS.length },
      { label: 'Approval history', path: '/campaigns/approvals', Icon: IconCheckCircle },
    ],
  },
  {
    label: 'Work',
    items: [
      { label: 'Campaigns', path: '/campaigns', Icon: IconCampaign },
      { label: 'Content', path: '/content', Icon: IconContent },
      { label: 'Analytics', path: '/analytics', Icon: IconChart },
    ],
  },
  {
    label: 'Freya',
    items: [
      { label: 'Agents', path: '/agents', Icon: IconAgents },
      { label: 'Workflows', path: '/freya/workflows', Icon: IconWorkflow },
      { label: 'Knowledge', path: '/knowledge', Icon: IconKnowledge },
    ],
  },
  {
    label: 'Account',
    items: [{ label: 'Settings', path: '/settings', Icon: IconSettings }],
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
    color: isActive ? C.sage : C.textSecondary,
    backgroundColor: isActive ? C.sageDim : 'transparent',
    border: `1px solid ${isActive ? `${C.sage}55` : 'transparent'}`,
    transition: T.color,
    minHeight: '36px',
    position: 'relative',
  };
}

export default function SidebarSemiAuto({ collapsed, isMobile, onCloseMobile, onToggleRail }) {
  const toast = useToast();
  const setFreyaOpen = useStore((s) => s.setFreyaOpen);

  const urgencyColor = (u) => {
    if (u === 'high') return C.amber;
    if (u === 'low') return C.textMuted;
    return C.sage;
  };

  const modeChip = !collapsed && (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: S[2],
        marginTop: S[3],
        padding: `${S[2]} ${S[3]}`,
        backgroundColor: C.sageDim,
        border: `1px solid ${C.sage}`,
        borderRadius: R.md,
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: C.sage,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontFamily: F.mono,
          fontSize: '10px',
          fontWeight: 700,
          color: C.sage,
          letterSpacing: '0.08em',
        }}
      >
        SEMI-AUTO
      </span>
    </div>
  );

  const modeDot = collapsed && (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: S[2] }} title="Semi-auto mode">
      <span
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: C.sage,
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
          <button
            type="button"
            onClick={() => setFreyaOpen(true)}
            style={{
              width: `calc(100% - ${S[6]})`,
              margin: S[3],
              padding: S[3],
              backgroundColor: C.surface2,
              border: `1px solid ${C.border}`,
              borderRadius: R.md,
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginBottom: S[2] }}>
              <FreyaLogo size={18} />
              <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.sage }}>Freya</span>
              <span
                style={{
                  marginLeft: 'auto',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: C.sage,
                }}
              />
            </div>
            <p
              style={{
                fontFamily: F.body,
                fontSize: '12px',
                color: C.textSecondary,
                margin: `0 0 ${S[2]} 0`,
                lineHeight: 1.4,
              }}
            >
              {FREYA_STATUS.currentTask}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
              <AgentRoleIcon agentId={FREYA_STATUS.agent} size={12} color={C.textMuted} />
              <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, textTransform: 'capitalize' }}>
                {FREYA_STATUS.agent}
              </span>
            </div>
          </button>
        )}

        {collapsed && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: S[2] }}>
            <button
              type="button"
              onClick={() => setFreyaOpen(true)}
              title="Open Freya"
              style={{
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: C.sageDim,
                border: `1px solid ${C.sage}`,
                borderRadius: R.md,
                cursor: 'pointer',
              }}
            >
              <FreyaLogo size={20} />
            </button>
          </div>
        )}

        {!collapsed && (
          <div style={{ padding: `0 ${S[4]} ${S[3]}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[2] }}>
              <span
                style={{
                  fontFamily: F.mono,
                  fontSize: '10px',
                  fontWeight: 700,
                  color: C.textMuted,
                  letterSpacing: '0.08em',
                }}
              >
                PENDING
              </span>
              <span
                style={{
                  fontFamily: F.mono,
                  fontSize: '10px',
                  fontWeight: 700,
                  color: C.textInverse,
                  backgroundColor: C.sage,
                  padding: `2px ${S[2]}`,
                  borderRadius: R.pill,
                }}
              >
                {PENDING_APPROVALS.length}
              </span>
            </div>
            {PENDING_APPROVALS.slice(0, 3).map((item) => (
              <NavLink
                key={item.id}
                to="/"
                onClick={() => isMobile && onCloseMobile?.()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: S[2],
                  padding: `${S[2]} 0`,
                  borderRadius: R.sm,
                  textDecoration: 'none',
                }}
              >
                <span
                  style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    backgroundColor: urgencyColor(item.urgency),
                    flexShrink: 0,
                  }}
                />
                <AgentRoleIcon agentId={item.agent} size={12} color={C.textMuted} />
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
              </NavLink>
            ))}
            {PENDING_APPROVALS.length > 3 && (
              <button
                type="button"
                onClick={() => toast.info(`${PENDING_APPROVALS.length - 3} more items in queue`)}
                style={{
                  marginTop: S[1],
                  padding: 0,
                  border: 'none',
                  background: 'none',
                  fontFamily: F.mono,
                  fontSize: '10px',
                  fontWeight: 600,
                  color: C.sage,
                  cursor: 'pointer',
                }}
              >
                +{PENDING_APPROVALS.length - 3} more
              </button>
            )}
          </div>
        )}

        {collapsed && (
          <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: S[2] }}>
            <NavLink
              to="/"
              title={`${PENDING_APPROVALS.length} pending`}
              style={{
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: C.surface2,
                border: `1px solid ${C.border}`,
                borderRadius: R.md,
                textDecoration: 'none',
                color: C.textSecondary,
                position: 'relative',
              }}
            >
              <IconClipboard />
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  minWidth: '16px',
                  height: '16px',
                  padding: '0 4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: F.mono,
                  fontSize: '9px',
                  fontWeight: 700,
                  color: C.textInverse,
                  backgroundColor: C.sage,
                  borderRadius: R.pill,
                  border: `2px solid ${C.surface}`,
                }}
              >
                {PENDING_APPROVALS.length}
              </span>
            </NavLink>
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
                  {!collapsed && item.badge != null && (
                    <span
                      style={{
                        fontFamily: F.mono,
                        fontSize: '10px',
                        fontWeight: 700,
                        color: C.textInverse,
                        backgroundColor: C.sage,
                        padding: `1px ${S[2]}`,
                        borderRadius: R.pill,
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                  {collapsed && item.badge != null && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '6px',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: C.sage,
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
            <span style={{ color: C.sage, fontWeight: 600 }}>Semi-auto:</span> Freya proposes work; you approve before it runs.
          </p>
        </div>
      )}
    </div>
  );
}
