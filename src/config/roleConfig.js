/**
 * Role-adaptive design: single source of truth for role display, sidebar, Freya (co-pilot), and access.
 * Used by Sidebar, FreyaPanel, useRoleView, and RoleSwitcher.
 */

import { isSidebarSectionVisibleForPlan } from './sidebarAccess';

export const ROLE_IDS = [
  'owner',
  'founder',
  'advisor',
  'csm',
  'contentStrategist',
  'sdr',
  'analyst',
  'client',
];

export const ROLES = {
  owner: {
    id: 'owner',
    displayName: 'Owner/CEO',
    sidebarVariant: 'full',
    freyaOpening: "Ready. What needs your attention first?",
    freyaQuickActions: [
      'Show me what needs a decision',
      'Which campaign is at risk?',
      'Generate weekly brief',
    ],
    access: { escalations: true, inbox: true, team: true },
    assignedClients: null,
  },
  founder: {
    id: 'founder',
    displayName: 'Founder',
    sidebarVariant: 'full',
    freyaOpening: "Ready. What needs your attention first?",
    freyaQuickActions: [
      'Show me what needs a decision',
      'Which campaign is at risk?',
      'Generate weekly brief',
    ],
    access: { escalations: true, inbox: true, team: true },
    assignedClients: null,
  },
  advisor: {
    id: 'advisor',
    displayName: 'Strategic Advisor',
    sidebarVariant: 'full',
    freyaOpening: "I've reviewed all client briefs. 3 need your strategic input.",
    freyaQuickActions: [
      'Review strategy items',
      'Run competitive scan',
      'Draft positioning memo',
    ],
    access: { escalations: true, inbox: true, team: true },
    assignedClients: null,
  },
  csm: {
    id: 'csm',
    displayName: 'Client Success Manager',
    sidebarVariant: 'csm',
    freyaOpening: 'Medglobal call is tomorrow. Want me to prep your brief?',
    freyaQuickActions: [
      'Prepare call brief',
      'Generate client report',
      'Draft check-in email',
    ],
    access: { escalations: true, inbox: true, team: false },
    assignedClients: ['Medglobal', 'Delta Garments', 'BGMEA Member Co', 'Apex Corp'],
  },
  contentStrategist: {
    id: 'contentStrategist',
    displayName: 'Content Strategist',
    sidebarVariant: 'contentStrategist',
    freyaOpening: '3 content pieces are waiting for your review.',
    freyaQuickActions: [
      'Show pending reviews',
      'Check brand consistency',
      'Draft content calendar',
    ],
    access: { escalations: true, inbox: true, team: false },
    assignedClients: null,
  },
  sdr: {
    id: 'sdr',
    displayName: 'SDR / Outreach',
    sidebarVariant: 'sdr',
    freyaOpening: 'You have 3 hot replies. Want me to draft responses?',
    freyaQuickActions: [
      'Draft replies for hot leads',
      'Who should I contact next?',
      'Write a follow-up for Karim',
    ],
    access: { escalations: false, inbox: true },
    assignedClients: null,
  },
  analyst: {
    id: 'analyst',
    displayName: 'Analyst',
    sidebarVariant: 'analyst',
    freyaOpening: "This week's data is ready. CPL improved 18% — want the breakdown?",
    freyaQuickActions: [
      "Explain what's driving performance",
      'Generate weekly report',
      'Find the top channel',
    ],
    access: { escalations: 'readonly', inbox: false },
    assignedClients: null,
  },
  client: {
    id: 'client',
    displayName: 'Client',
    sidebarVariant: 'client',
    freyaOpening: 'Here is a concise snapshot of approvals and content for your review.',
    freyaQuickActions: [
      'Summarize pending approvals',
      'What changed this week?',
      'Draft a message to my team',
    ],
    access: { escalations: false, inbox: true, team: false },
    assignedClients: null,
  },
};

/** App shell: max content width, density, padding — tuned per role */
const SHELL_DEFAULTS = {
  contentMaxWidth: 1536,
  density: 'comfortable',
  /** Horizontal padding inside main on small viewports only */
  mobileMainPadding: '12px',
};

const SHELL_BY_ROLE = {
  owner: { contentMaxWidth: 1680 },
  founder: { contentMaxWidth: 1480 },
  advisor: { contentMaxWidth: 1600 },
  csm: { contentMaxWidth: 1320 },
  contentStrategist: { contentMaxWidth: 1400 },
  sdr: {
    contentMaxWidth: null,
    density: 'compact',
    mobileMainPadding: '10px',
  },
  analyst: { contentMaxWidth: 1760 },
  client: { contentMaxWidth: 720, mobileMainPadding: '16px' },
};

export function getShellLayout(roleId) {
  return { ...SHELL_DEFAULTS, ...(SHELL_BY_ROLE[roleId] || {}) };
}

/**
 * Inline styles for the centered main content rail (desktop + mobile padding).
 */
export function getShellContentStyle(roleId, isMobile) {
  const shell = getShellLayout(roleId);
  const pad = shell.mobileMainPadding;
  const maxW = shell.contentMaxWidth;
  return {
    width: '100%',
    maxWidth: maxW ? `${maxW}px` : '100%',
    marginLeft: maxW ? 'auto' : undefined,
    marginRight: maxW ? 'auto' : undefined,
    paddingLeft: isMobile ? pad : '0px',
    paddingRight: isMobile ? pad : '0px',
    paddingTop: isMobile ? pad : '0px',
    paddingBottom: isMobile ? 'max(12px, env(safe-area-inset-bottom, 0px))' : '0px',
    boxSizing: 'border-box',
  };
}

export function getRoleConfig(roleId) {
  return ROLES[roleId] ?? ROLES.owner;
}

export function getRoleDisplayName(roleId) {
  return getRoleConfig(roleId).displayName;
}

export function getRoleAccess(roleId) {
  return getRoleConfig(roleId).access ?? { escalations: true, inbox: true };
}

export function getAssignedClients(roleId) {
  const config = getRoleConfig(roleId);
  return config.assignedClients ?? [];
}

// ── Sidebar: which section ids to show per role ──
const FULL_SIDEBAR_SECTIONS = ['core', 'ops', 'teamManagement', 'research', 'campaigns', 'abmPlaybooks', 'revenue', 'crm', 'content', 'socialMediaAds', 'analyticsReports', 'freyaIntelligence', 'admin', 'freya', 'devTools'];

export function getSidebarSections(roleId) {
  const role = getRoleConfig(roleId);
  const variant = role.sidebarVariant;
  if (variant === 'full') return FULL_SIDEBAR_SECTIONS;
  const map = {
    sdr: ['core', 'ops', 'teamManagement', 'campaigns', 'crm', 'admin'],
    csm: ['core', 'revenue', 'crm', 'content', 'admin'],
    contentStrategist: ['core', 'content', 'freyaIntelligence', 'admin'],
    analyst: ['core', 'ops', 'teamManagement', 'research', 'revenue', 'analyticsReports', 'admin'],
    client: ['core', 'content', 'admin'],
  };
  return map[variant] ?? FULL_SIDEBAR_SECTIONS;
}

/**
 * Role list ∩ plan capability (sidebar sections).
 */
export function getSidebarSectionsForRoleAndPlan(roleId, planId) {
  return getSidebarSections(roleId).filter((sectionId) =>
    isSidebarSectionVisibleForPlan(sectionId, planId)
  );
}
