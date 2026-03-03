import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Lock, Brain, GitBranch, UserCog } from 'lucide-react';
import useStore from '../../store/useStore';
import { PLANS } from '../../config/plans';
import usePlan from '../../hooks/usePlan';
import useCredits from '../../hooks/useCredits';
import useToast from '../../hooks/useToast';
import useWorkspace from '../../hooks/useWorkspace';
import CreditBar from '../plan/CreditBar';
import PlanBadge from '../plan/PlanBadge';
import UpgradeModal from '../plan/UpgradeModal';
import FounderModeToggle from './FounderModeToggle';
import { getSidebarSections } from '../../config/roleConfig';
import { getTemplateById } from '../../data/workspaceTemplates';
import { C, F, R, S, T, shadows } from '../../tokens';

// ── Founder nav SVG icons (theme: currentColor) ──
const IconTasks = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="2" y="3" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M6 7.5h6M6 10.5h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M5 7.5l.5.5 1.5-1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);
const IconContent = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="3" y="1.5" width="12" height="15" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M6 6h6M6 9h6M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconOutreach = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="1.5" y="3.5" width="15" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M1.5 7l7.5 4.5L16.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconChart = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M2 14h14M5 14V9m4 5V6m4 8V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconAria = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M9 2v2M9 14v2M2 9h2M14 9h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// ── Founder mode: 5 items only ─────────────────
const FOUNDER_NAV_ITEMS = [
  { label: "Today's Tasks", path: '/tasks', icon: <IconTasks />, stub: true },
  { label: 'Content Queue', path: '/content', icon: <IconContent /> },
  { label: 'Outreach Pipeline', path: '/campaigns', icon: <IconOutreach /> },
  { label: 'Campaign Health', path: '/analytics', icon: <IconChart /> },
  { label: 'ARIA', path: null, icon: <IconAria />, openAria: true },
];

// ── Startup segment: simplified nav for startup companies ──
const STARTUP_NAV_ITEMS = [
  { label: 'Dashboard', path: '/', exact: true, icon: <IconChart /> },
  { label: 'Campaigns', path: '/campaigns', icon: <IconOutreach /> },
  { label: 'Content', path: '/content', icon: <IconContent /> },
  { label: 'Company Social Inbox', path: '/inbox', icon: <IconOutreach /> },
  { label: 'Escalations', path: '/escalations', icon: <IconTasks /> },
  { label: 'Analytics', path: '/analytics', icon: <IconChart /> },
  { label: 'Founders', path: '/team', icon: <IconTasks /> },
  { label: 'ARIA', path: null, icon: <IconAria />, openAria: true },
  { label: 'Settings', path: '/settings', icon: <IconTasks /> },
];

function FounderNavItem({ item, onOpenAria }) {
  const baseStyle = {
    display:        'flex',
    alignItems:     'center',
    gap:            S[3],
    padding:        `${S[2]} ${S[3]}`,
    borderRadius:   R.md,
    fontFamily:     F.body,
    fontSize:       '13px',
    fontWeight:     500,
    transition:     T.color,
    margin:         `0 ${S[2]}`,
    textDecoration: 'none',
    color:          C.textSecondary,
    backgroundColor: 'transparent',
    border:         'none',
    width:          '100%',
    textAlign:      'left',
    cursor:         'pointer',
  };

  if (item.openAria) {
    return (
      <button
        type="button"
        style={baseStyle}
        onClick={() => onOpenAria?.()}
        onMouseEnter={(e) => { e.currentTarget.style.color = C.primary; e.currentTarget.style.backgroundColor = C.primaryGlow; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = C.textSecondary; e.currentTarget.style.backgroundColor = 'transparent'; }}
      >
        <span style={{ flexShrink: 0, display: 'flex', color: 'inherit' }}>{item.icon}</span>
        <span style={{ flex: 1 }}>{item.label}</span>
      </button>
    );
  }

  return (
    <NavLink
      to={item.path}
      end={item.exact}
      style={({ isActive }) => ({
        ...baseStyle,
        color: isActive ? C.primary : C.textSecondary,
        backgroundColor: isActive ? C.primaryGlow : 'transparent',
      })}
    >
      <span style={{ flexShrink: 0, display: 'flex', color: 'inherit' }}>{item.icon}</span>
      <span style={{ flex: 1 }}>{item.label}</span>
    </NavLink>
  );
}

// ── Nav section / item definitions ────────────
const NAV_SECTIONS = [
  {
    id: 'core',
    items: [
      {
        label: 'Dashboard',
        path: '/',
        exact: true,
        moduleId: 'dashboard',
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
        hideForRoles: ['client'],
        moduleId: 'campaigns',
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 9h14M2 9l4-4M2 9l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 4v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        label: 'Outreach',
        path: '/outreach',
        hideForRoles: ['client'],
        moduleId: 'outreach',
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="1.5" y="3.5" width="15" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M1.5 7l7.5 4.5L16.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
      },
      {
        label: 'Escalations',
        path: '/escalations',
        badge: 3,
        hideForRoles: ['sdr', 'client'],
        moduleId: 'escalations',
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
        hideForRoles: ['client'],
        moduleId: 'analytics',
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 14h14M5 14V9m4 5V6m4 8V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        label: 'Company Social Inbox',
        path: '/inbox',
        gatedFeature: 'unifiedInbox',
        requiredPlan: 'growth',
        moduleId: 'inbox',
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
    id: 'teamManagement',
    dividerBefore: true,
    label: 'TEAM MANAGEMENT',
    collapsible: true,
    items: [
      {
        label: 'Team Query',
        path: '/querymanager',
        moduleId: 'querymanager',
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="1.5" y="4.5" width="15" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M5 9l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 8h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M12 10h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
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
        gatedFeature: 'icpBuilder',
        requiredPlan: 'growth',
        moduleId: 'research/icp',
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
        path: '/research/intent',
        gatedFeature: 'intentSignals',
        requiredPlan: 'growth',
        liveBadge: true,
        moduleId: 'research/intent',
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
        path: '/research/competitive',
        gatedFeature: 'competitiveIntel',
        requiredPlan: 'scale',
        moduleId: 'research/competitive',
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
    items: [],
  },

  {
    id: 'abmPlaybooks',
    dividerBefore: true,
    label: 'ABM & PLAYBOOKS',
    collapsible: true,
    items: [
      {
        label: 'ABM Engine',
        path: '/abm',
        comingSoon: true,
        description: 'Named-account targeting, tier management, and buying committee timelines. Run ABM campaigns with account playbooks, stakeholder maps, and pipeline visibility.',
        moduleId: 'abm',
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
        comingSoon: true,
        description: 'Pre-built GTM playbooks by vertical and use case. Pick a playbook and ARIA customises it for your context. Launch campaigns in hours with sequences, content, and channels defined.',
        moduleId: 'playbooks',
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
    label: 'Revenue',
    collapsible: true,
    items: [
      {
        label: 'Pipeline',
        path: '/revenue/pipeline',
        gatedFeature: 'pipelineManager',
        requiredPlan: 'growth',
        moduleId: 'pipeline',
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 3.5h14l-5 6v5l-4-2V9.5L2 3.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
      },
      {
        label: 'Forecasting',
        path: '/revenue/forecast',
        gatedFeature: 'predictiveForecasting',
        requiredPlan: 'scale',
        moduleId: 'forecast',
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 14l4-5 3 2 5-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 4h4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
      },
      {
        label: 'Customer Success',
        path: '/revenue/customers',
        gatedFeature: 'customerSuccess',
        requiredPlan: 'scale',
        moduleId: 'customer-success',
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 15.5S2 11.5 2 6.5A4 4 0 0 1 9 4a4 4 0 0 1 7 2.5C16 11.5 9 15.5 9 15.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
        ),
      },
      {
        label: 'CRM',
        path: '/revenue/crm',
        moduleId: 'crm',
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="2" y="3" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M2 8h14M6 8v7M12 8v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        ),
      },
    ],
  },

  {
    id: 'content',
    dividerBefore: true,
    label: 'Content',
    collapsible: true,
    items: [
      {
        label: 'Content',
        path: '/content',
        moduleId: 'content',
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="3" y="1.5" width="12" height="15" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M6 6h6M6 9h6M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        label: 'Knowledge base',
        path: '/knowledge',
        moduleId: 'knowledge',
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2c-3 0-5.5 1.5-5.5 4.5 0 2 1.5 3.5 3.5 4v3l2-1.5 2 1.5v-3c2-.5 3.5-2 3.5-4C14.5 3.5 12 2 9 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M7 7.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        label: 'Calendar',
        path: '/calendar',
        moduleId: 'calendar',
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="2" y="3" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M2 7h14M6 1v4M12 1v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        ),
      },
    ],
  },

  {
    id: 'socialMediaAds',
    dividerBefore: true,
    label: 'SOCIAL MEDIA ADS',
    collapsible: true,
    items: [
      {
        label: 'Social Media',
        path: '/social',
        moduleId: 'social',
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M12 2h4a2 2 0 0 1 2 2v4M6 16H2a2 2 0 0 1-2-2v-4M14 6l4-4M4 18l-4-4M18 2l-4 4M2 14l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
      },
      {
        label: 'Meta Ads Monitor',
        path: '/analytics/meta',
        moduleId: 'meta-monitoring',
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 13l4-5 3 3 3-4 4 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="1.5" y="1.5" width="15" height="15" rx="2" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        ),
      },
    ],
  },

  {
    id: 'ariaIntelligence',
    dividerBefore: true,
    label: 'ARIA INTELLIGENCE',
    collapsible: true,
    items: [
      {
        label: 'Agents',
        path: '/agents',
        hideForRoles: ['client'],
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M2.5 15.5c0-3.314 2.91-6 6.5-6s6.5 2.686 6.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="14" cy="5" r="1.5" fill="currentColor"/>
          </svg>
        ),
      },
      {
        label: 'ARIA Knowledge Base',
        path: '/aria/knowledge',
        icon: <Brain size={18} strokeWidth={1.5} />,
      },
      {
        label: 'Workflow Center',
        path: '/aria/workflows',
        icon: <GitBranch size={18} strokeWidth={1.5} />,
      },
      {
        label: 'Persona Config',
        path: '/settings/aria',
        icon: <UserCog size={18} strokeWidth={1.5} />,
      },
    ],
  },

  {
    id: 'admin',
    dividerBefore: true,
    label: 'ADMIN',
    collapsible: true,
    items: [
      {
        label: 'Templates',
        path: '/admin/workspace-templates',
        hideForRoles: ['client'],
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="2" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="10" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="2" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="10" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        ),
      },
      {
        label: 'Clients',
        path: '/admin/clients',
        hideForRoles: ['client'],
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M2 16c0-3.5 3.13-6 7-6s7 2.5 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        label: 'Team',
        path: '/workspace/team',
        hideForRoles: ['client'],
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
        requiredPlan: 'agency',
        hideForRoles: ['client'],
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
        hideForRoles: ['client'],
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
        hideForRoles: ['client'],
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

// ── Coming Soon Nav Item ───────────────────────
// Shows label, "Coming soon" badge, and description (tooltip). Links to coming-soon page.
function ComingSoonNavItem({ item, collapsed }) {
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
    margin:         `0 ${S[2]}`,
    color:          C.textSecondary,
    opacity:        0.85,
    cursor:         'pointer',
  };

  return (
    <NavLink
      to={item.path}
      end={item.exact}
      style={({ isActive }) => ({
        ...baseStyle,
        backgroundColor: isActive ? C.surface2 : 'transparent',
        color: isActive ? C.textPrimary : C.textSecondary,
      })}
      className={collapsed ? 'sidebar-nav-item-collapsed' : ''}
      title={item.description}
    >
      <span style={{ flexShrink: 0, display: 'flex' }}>{item.icon}</span>
      {!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}
      {!collapsed && (
        <span style={{
          fontFamily: F.mono,
          fontSize: '9px',
          fontWeight: 700,
          color: C.textMuted,
          backgroundColor: C.surface3,
          padding: '2px 6px',
          borderRadius: R.pill,
          letterSpacing: '0.04em',
          border: `1px solid ${C.border}`,
        }}>
          Soon
        </span>
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

  if (item.comingSoon) {
    return <ComingSoonNavItem item={item} collapsed={collapsed} />;
  }

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
export default function Sidebar({ onOpenAria }) {
  const collapsed     = useStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useStore((s) => s.toggleSidebar);
  const currentRole   = useStore((s) => s.currentRole);
  const setRole       = useStore((s) => s.setRole);
  const segment       = useStore((s) => s.segment);
  const toast         = useToast();
  const isFounder     = currentRole === 'founder';
  const isStartup     = segment === 'startup';

  const { isModuleVisible, profile } = useWorkspace();
  const sidebarOrder = profile?.layout?.sidebarOrder ?? [];

  const orderIndex = (moduleId) => {
    if (!moduleId) return 999;
    const i = sidebarOrder.indexOf(moduleId);
    return i >= 0 ? i : 999;
  };

  const [openSections, setOpenSections] = useState({ research: true, revenue: true, campaigns: true, abmPlaybooks: true, content: true, teamManagement: true, socialMediaAds: true, aria: true, ariaIntelligence: true });

  const toggleSection = (id) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Items visible when: sidebar collapsed (show all) | section not collapsible | section is open
  const isSectionOpen = (section) => {
    if (collapsed) return true;
    if (!section.collapsible) return true;
    return openSections[section.id] !== false;
  };

  // Role-based section visibility (same design for enterprise & startup)
  const visibleSections = (() => {
    const sections = getSidebarSections(currentRole);
    if (sections === 'founder') return [];
    return NAV_SECTIONS.filter((s) => sections.includes(s.id));
  })();

  const isItemVisibleForRole = (item) => {
    if (!item.hideForRoles) return true;
    return !item.hideForRoles.includes(currentRole);
  };

  const sidebarStyle = {
    width:           isFounder ? '220px' : (collapsed ? '60px' : '220px'),
    minWidth:        isFounder ? '220px' : (collapsed ? '60px' : '220px'),
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
        {isFounder ? (
          <>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: S[2],
              padding: `${S[2]} ${S[4]}`,
              marginBottom: S[1],
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: C.textMuted, flexShrink: 0 }}>
                <circle cx="7" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M1.5 12.5c0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <span style={{
                fontFamily: F.body,
                fontSize: '12px',
                fontWeight: 500,
                color: C.textMuted,
              }}>
                Founder Mode
              </span>
            </div>
            {FOUNDER_NAV_ITEMS.map((item) => (
              <FounderNavItem key={item.label} item={item} onOpenAria={onOpenAria} />
            ))}
          </>
        ) : (
          visibleSections.map((section) => {
            const filteredItems = section.items
              .filter((item) => isItemVisibleForRole(item) && (!item.moduleId || isModuleVisible(item.moduleId)))
              .sort((a, b) => orderIndex(a.moduleId) - orderIndex(b.moduleId));
            if (filteredItems.length === 0) return null;
            return (
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

            {/* Nav items — filter by role, then GatedNavItem */}
            {isSectionOpen(section) && filteredItems.map((item) => (
              <GatedNavItem key={item.path || item.label} item={item} collapsed={collapsed} />
            ))}
          </div>
        );
          })
        )}
      </nav>

      {isFounder && (
        <div style={{ borderTop: `1px solid ${C.border}`, padding: S[2] }}>
          <button
            type="button"
            onClick={() => { setRole('owner'); toast.info('Switched to Full Team View'); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: S[2],
              width: '100%',
              padding: `${S[2]} ${S[3]}`,
              fontFamily: F.body,
              fontSize: '12px',
              fontWeight: 500,
              color: C.textMuted,
              backgroundColor: 'transparent',
              border: `1px solid ${C.border}`,
              borderRadius: R.md,
              cursor: 'pointer',
              transition: T.color,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 3L4 7l5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            ← Full Mode
          </button>
        </div>
      )}

      {/* Plan status panel — above the collapse toggle (hidden in founder mode) */}
      {!isFounder && profile && (
        <div style={{
          borderTop: `1px solid ${C.border}`,
          padding: collapsed ? S[2] : S[3],
          flexShrink: 0,
        }}>
          <div style={{
            fontFamily: F.body,
            fontSize: collapsed ? '10px' : '11px',
            fontWeight: 600,
            color: C.textPrimary,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {profile.clientName}
          </div>
          {!collapsed && (
            <div style={{
              fontFamily: F.mono,
              fontSize: '9px',
              fontWeight: 600,
              color: C.textMuted,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginTop: '2px',
            }}>
              {getTemplateById(profile.templateBase)?.name ?? profile.templateBase}
            </div>
          )}
        </div>
      )}
      {!isFounder && !isStartup && <PlanStatusSection collapsed={collapsed} />}

      {/* Founder mode toggle — when not in founder mode, so user can switch */}
      {!isFounder && !isStartup && <FounderModeToggle />}

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
