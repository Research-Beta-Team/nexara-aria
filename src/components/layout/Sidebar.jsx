import { useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { Lock, Brain, GitBranch, UserCog, FilePenLine, Mail, ArrowRightCircle, Database, X } from 'lucide-react';
import useStore from '../../store/useStore';
import { PLANS } from '../../config/plans';
import usePlan from '../../hooks/usePlan';
import useCredits from '../../hooks/useCredits';
import useToast from '../../hooks/useToast';
import useWorkspace from '../../hooks/useWorkspace';
import CreditBar from '../plan/CreditBar';
import PlanBadge from '../plan/PlanBadge';
import UpgradeModal from '../plan/UpgradeModal';
import { getSidebarSectionsForRoleAndPlan } from '../../config/roleConfig';
import { getCommandModeTheme } from '../../config/commandModeTheme';
import { isSidebarNavItemVisibleForPlan } from '../../config/sidebarAccess';
import { getTemplateById } from '../../data/workspaceTemplates';
import AntariousLogo from '../ui/AntariousLogo';
import FreyaLogo from '../ui/FreyaLogo';
import SidebarManual from './SidebarManual';
import SidebarSemiAuto from './SidebarSemiAuto';
import SidebarAgentic from './SidebarAgentic';
import SidebarRailToggle from './SidebarRailToggle';
import { C, F, R, S, T, shadows, Z } from '../../tokens';

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

// ── Startup segment: simplified nav for startup companies ──
const STARTUP_NAV_ITEMS = [
  { label: 'Dashboard', path: '/', exact: true, icon: <IconChart /> },
  { label: 'Campaigns', path: '/campaigns', icon: <IconOutreach /> },
  { label: 'Content', path: '/content', icon: <IconContent /> },
  { label: 'Company Social Inbox', path: '/inbox', icon: <IconOutreach /> },
  { label: 'Escalations', path: '/escalations', icon: <IconTasks /> },
  { label: 'Analytics', path: '/analytics', icon: <IconChart /> },
  { label: 'Founders', path: '/team', icon: <IconTasks /> },
  { label: 'Freya', path: null, icon: <FreyaLogo size={18} />, openFreya: true },
  { label: 'Settings', path: '/settings', icon: <IconTasks /> },
];

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
        gatedFeature: 'abmEngine',
        requiredPlan: 'growth',
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
        gatedFeature: 'verticalPlaybooks',
        description: 'Pre-built GTM playbooks by vertical and use case. Pick a playbook and Freya customises it for your context. Launch campaigns in hours with sequences, content, and channels defined.',
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
    id: 'crm',
    dividerBefore: true,
    label: 'CRM',
    collapsible: true,
    items: [
      {
        label: 'MQL Handoff Center',
        path: '/crm/handoff',
        moduleId: 'crm-handoff',
        icon: <ArrowRightCircle size={18} strokeWidth={1.5} />,
      },
      {
        label: 'Lead Enrichment',
        path: '/crm/enrichment',
        moduleId: 'crm-enrichment',
        icon: <Database size={18} strokeWidth={1.5} />,
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
    id: 'analyticsReports',
    dividerBefore: true,
    label: 'ANALYTICS',
    collapsible: true,
    items: [
      {
        label: 'Attribution',
        path: '/analytics/attribution',
        moduleId: 'attribution',
        minPlan: 'growth',
        icon: <GitBranch size={18} strokeWidth={1.5} />,
      },
      {
        label: 'Executive Digest',
        path: '/reports/digest',
        moduleId: 'digest',
        minPlan: 'growth',
        icon: <Mail size={18} strokeWidth={1.5} />,
      },
      {
        label: 'Board Report',
        path: '/reports/board',
        moduleId: 'board-report',
        minPlan: 'scale',
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="2" y="2" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M2 6h14M6 6v6M10 6v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
      },
    ],
  },

  {
    id: 'freyaIntelligence',
    dividerBefore: true,
    label: 'FREYA INTELLIGENCE',
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
        label: 'Freya Knowledge Base',
        path: '/freya/knowledge',
        icon: <Brain size={18} strokeWidth={1.5} />,
      },
      {
        label: 'Workflow Center',
        path: '/freya/workflows',
        icon: <GitBranch size={18} strokeWidth={1.5} />,
      },
      {
        label: 'Freya Memory',
        path: '/freya/memory',
        icon: <Brain size={18} strokeWidth={1.5} />,
      },
      {
        label: 'Campaign Briefer',
        path: '/campaigns/briefer',
        icon: <FilePenLine size={18} strokeWidth={1.5} />,
      },
      {
        label: 'Persona Config',
        path: '/settings/freya',
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
    id: 'freya',
    dividerBefore: true,
    label: 'Freya',
    collapsible: true,
    items: [
      {
        label: 'Freya Intelligence',
        path: '/freya-brain',
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2a4 4 0 0 1 4 4v2a4 4 0 0 1-4 4 4 4 0 0 1-4-4V6a4 4 0 0 1 4-4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 12v4M6 14l3 2 3-2M9 12a4 4 0 0 0 4-4h1.5a5.5 5.5 0 0 1-5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
      },
    ],
  },

  {
    id: 'devTools',
    dividerBefore: true,
    label: 'DEV TOOLS',
    collapsible: true,
    items: [
      {
        label: 'Role Switcher',
        path: '/dev/roles',
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="5" r="3" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M3 16v-1a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        label: 'Mode Design',
        path: '/dev/modes',
        icon: (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M2 7h14M7 7v9" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        ),
      },
    ],
  },
];

// ── Logo mark ─────────────────────────────────
function Logo({ collapsed, isMobile, onCloseMobile, onToggleRail }) {
  const showWebRailToggle = Boolean(onToggleRail);

  return (
    <div style={{
      display: 'flex',
      gap: S[3],
      padding: collapsed ? `${S[3]} ${S[3]}` : `${S[5]} ${S[5]}`,
      borderBottom: `1px solid ${C.border}`,
      flexShrink: 0,
      flexDirection: collapsed && showWebRailToggle ? 'column' : collapsed ? 'row' : 'column',
      alignItems: collapsed && showWebRailToggle ? 'center' : collapsed ? 'center' : 'flex-start',
      position: 'relative',
    }}>
      {isMobile && (
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%', gap: S[2] }}>
          <AntariousLogo variant="dark" height={26} showWordmark showAiSuffix />
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => {
              onCloseMobile?.();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              flexShrink: 0,
              borderRadius: R.button,
              border: `1px solid ${C.border}`,
              backgroundColor: C.surface2,
              color: C.textSecondary,
              cursor: 'pointer',
            }}
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>
      )}
      {!isMobile && showWebRailToggle && collapsed && (
        <SidebarRailToggle collapsed={collapsed} onClick={onToggleRail} />
      )}
      {!isMobile && (
        showWebRailToggle && !collapsed ? (
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: S[2], width: '100%' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <AntariousLogo variant="dark" height={26} showWordmark showAiSuffix />
              <div style={{
                fontFamily: F.body,
                fontSize: '11px',
                color: C.textSecondary,
                marginTop: '4px',
                lineHeight: 1.3,
              }}>
                Your GTM, now <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', color: C.primary }}>autonomous.</em>
              </div>
            </div>
            <SidebarRailToggle collapsed={collapsed} onClick={onToggleRail} />
          </div>
        ) : showWebRailToggle && collapsed ? (
          <AntariousLogo variant="dark" height={24} showWordmark={false} showAiSuffix={false} />
        ) : (
          <>
            <AntariousLogo variant="dark" height={collapsed ? 28 : 26} showWordmark={!collapsed} showAiSuffix={!collapsed} />
            {!collapsed && (
              <div style={{
                fontFamily: F.body,
                fontSize: '11px',
                color: C.textSecondary,
                marginTop: '4px',
                lineHeight: 1.3,
              }}>
                Your GTM, now <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', color: C.primary }}>autonomous.</em>
              </div>
            )}
          </>
        )
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
function NavItem({ item, collapsed, onNavigate }) {
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
      onClick={() => onNavigate?.()}
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
function ComingSoonNavItem({ item, collapsed, onNavigate }) {
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
      onClick={() => onNavigate?.()}
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
function GatedNavItem({ item, collapsed, onNavigate }) {
  const { hasFeature, planId } = usePlan();
  const [showUpgrade, setShowUpgrade] = useState(false);

  const planBlocksItem = Boolean(item.gatedFeature && !hasFeature(item.gatedFeature));

  // Plan gate runs before “coming soon” so locked tiers still see upgrade path.
  if (planBlocksItem) {
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

  if (item.comingSoon) {
    return <ComingSoonNavItem item={item} collapsed={collapsed} onNavigate={onNavigate} />;
  }

  return <NavItem item={item} collapsed={collapsed} onNavigate={onNavigate} />;
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
export default function Sidebar({ isMobile = false, mobileOpen = false, onCloseMobile }) {
  const collapsed     = useStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useStore((s) => s.toggleSidebar);
  const currentRole   = useStore((s) => s.currentRole);
  const currentPlanId = useStore((s) => s.currentPlanId);
  const commandMode   = useStore((s) => s.commandMode);
  const segment       = useStore((s) => s.segment);
  const isStartup     = segment === 'startup';

  const cmdModeBorder = useMemo(
    () => `1px solid color-mix(in srgb, ${getCommandModeTheme(commandMode).accent} 24%, ${C.border})`,
    [commandMode],
  );

  // For owner/founder roles, use mode-specific sidebars
  const useModeSpecificSidebar = currentRole === 'owner' || currentRole === 'founder';

  const { isModuleVisible, profile } = useWorkspace();
  const sidebarOrder = profile?.layout?.sidebarOrder ?? [];

  const orderIndex = (moduleId) => {
    if (!moduleId) return 999;
    const i = sidebarOrder.indexOf(moduleId);
    return i >= 0 ? i : 999;
  };

  const [openSections, setOpenSections] = useState({ research: true, revenue: true, campaigns: true, abmPlaybooks: true, content: true, teamManagement: true, socialMediaAds: true, analyticsReports: true, crm: true, freya: true, freyaIntelligence: true });

  const toggleSection = (id) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Items visible when: sidebar collapsed (show all) | section not collapsible | section is open
  const isSectionOpen = (section) => {
    if (effectiveCollapsed) return true;
    if (!section.collapsible) return true;
    return openSections[section.id] !== false;
  };

  // Role ∩ subscription plan (sections); items also filtered per plan below.
  const visibleSections = useMemo(() => {
    const ids = getSidebarSectionsForRoleAndPlan(currentRole, currentPlanId);
    return NAV_SECTIONS.filter((s) => ids.includes(s.id));
  }, [currentRole, currentPlanId]);

  const isItemVisibleForRole = (item) => {
    if (!item.hideForRoles) return true;
    return !item.hideForRoles.includes(currentRole);
  };

  const effectiveCollapsed = isMobile ? false : collapsed;

  const modeShellWidth = useModeSpecificSidebar ? (collapsed ? 64 : 260) : null;
  const defaultShellWidth = collapsed ? 60 : 220;

  const sidebarStyle = isMobile
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100dvh',
        maxHeight: '100dvh',
        width: 'min(300px, calc(100vw - 24px))',
        minWidth: 0,
        zIndex: Z.navDrawer,
        backgroundColor: C.surface,
        borderRight: cmdModeBorder,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        flexShrink: 0,
        transform: mobileOpen ? 'translateX(0)' : 'translateX(-108%)',
        transition: 'transform 0.28s cubic-bezier(0.22, 1, 0.36, 1)',
        boxShadow: mobileOpen ? shadows.modal : 'none',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        pointerEvents: mobileOpen ? 'auto' : 'none',
      }
    : {
        width:           useModeSpecificSidebar ? modeShellWidth : defaultShellWidth,
        minWidth:        useModeSpecificSidebar ? modeShellWidth : defaultShellWidth,
        height:          '100dvh',
        maxHeight:       '100dvh',
        backgroundColor: C.surface,
        borderRight:     cmdModeBorder,
        display:         'flex',
        flexDirection:   'column',
        transition:      'width 0.2s ease, min-width 0.2s ease, border-color 0.25s ease',
        overflow:        'hidden',
        flexShrink:      0,
        position:        'relative',
        minHeight:       0,
      };

  const navStyle = {
    flex:           1,
    overflowY:      'auto',
    overflowX:      'hidden',
    padding:        `${S[3]} 0`,
    scrollbarWidth: 'none',
  };

  // Render mode-specific sidebar for owner/founder roles
  const renderModeSpecificSidebar = () => {
    switch (commandMode) {
      case 'manual':
        return (
          <SidebarManual
            collapsed={effectiveCollapsed}
            isMobile={isMobile}
            onCloseMobile={onCloseMobile}
            onToggleRail={!isMobile ? toggleSidebar : undefined}
          />
        );
      case 'semi_auto':
        return (
          <SidebarSemiAuto
            collapsed={effectiveCollapsed}
            isMobile={isMobile}
            onCloseMobile={onCloseMobile}
            onToggleRail={!isMobile ? toggleSidebar : undefined}
          />
        );
      case 'fully_agentic':
        return (
          <SidebarAgentic
            collapsed={effectiveCollapsed}
            isMobile={isMobile}
            onCloseMobile={onCloseMobile}
            onToggleRail={!isMobile ? toggleSidebar : undefined}
          />
        );
      default:
        return (
          <SidebarSemiAuto
            collapsed={effectiveCollapsed}
            isMobile={isMobile}
            onCloseMobile={onCloseMobile}
            onToggleRail={!isMobile ? toggleSidebar : undefined}
          />
        );
    }
  };

  // For owner/founder roles: render mode-specific sidebars
  if (useModeSpecificSidebar) {
    return (
      <aside style={sidebarStyle} aria-hidden={isMobile ? !mobileOpen : undefined}>
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {renderModeSpecificSidebar()}
        </div>

        {profile && (
          <div
            style={{
              borderTop: `1px solid ${C.border}`,
              padding: effectiveCollapsed ? S[2] : S[3],
              flexShrink: 0,
            }}
          >
            <div
              style={{
                fontFamily: F.body,
                fontSize: effectiveCollapsed ? '10px' : '12px',
                fontWeight: 600,
                color: C.textPrimary,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                textAlign: effectiveCollapsed ? 'center' : 'left',
              }}
            >
              {profile.clientName}
            </div>
            {!effectiveCollapsed && (
              <div
                style={{
                  fontFamily: F.mono,
                  fontSize: '9px',
                  fontWeight: 600,
                  color: C.textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginTop: '2px',
                }}
              >
                {getTemplateById(profile.templateBase)?.name ?? profile.templateBase}
              </div>
            )}
          </div>
        )}
        {!isStartup && <PlanStatusSection collapsed={effectiveCollapsed} />}
      </aside>
    );
  }

  // Default sidebar for other roles
  return (
    <aside style={sidebarStyle} aria-hidden={isMobile ? !mobileOpen : undefined}>
      <style>{`
        .sidebar-nav-item-collapsed:hover {
          color: ${C.textPrimary} !important;
          background-color: ${C.surface2} !important;
        }
      `}</style>

      <Logo
        collapsed={effectiveCollapsed}
        isMobile={isMobile}
        onCloseMobile={onCloseMobile}
        onToggleRail={!isMobile ? toggleSidebar : undefined}
      />

      <nav style={navStyle}>
        {visibleSections.map((section) => {
            const filteredItems = section.items
              .filter((item) => isItemVisibleForRole(item))
              .filter((item) => isSidebarNavItemVisibleForPlan(item, currentPlanId))
              .filter((item) => !item.moduleId || isModuleVisible(item.moduleId))
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
            {section.label && !effectiveCollapsed && (
              <SectionHeader
                label={section.label}
                collapsible={section.collapsible}
                isOpen={openSections[section.id] !== false}
                onToggle={() => toggleSection(section.id)}
              />
            )}

            {/* Nav items — filter by role, then GatedNavItem */}
            {isSectionOpen(section) && filteredItems.map((item) => (
              <GatedNavItem
                key={item.path || item.label}
                item={item}
                collapsed={effectiveCollapsed}
                onNavigate={isMobile ? onCloseMobile : undefined}
              />
            ))}
          </div>
        );
        })}
      </nav>

      {/* Plan status panel */}
      {profile && (
        <div style={{
          borderTop: `1px solid ${C.border}`,
          padding: effectiveCollapsed ? S[2] : S[3],
          flexShrink: 0,
        }}>
          <div style={{
            fontFamily: F.body,
            fontSize: effectiveCollapsed ? '10px' : '11px',
            fontWeight: 600,
            color: C.textPrimary,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {profile.clientName}
          </div>
          {!effectiveCollapsed && (
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
      {!isStartup && <PlanStatusSection collapsed={effectiveCollapsed} />}
    </aside>
  );
}
