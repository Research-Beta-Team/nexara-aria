/**
 * Role-adaptive design: single source of truth for role display, sidebar, Freya (co-pilot), and access.
 * Used by Sidebar, AriaPanel, useRoleView, and RoleSwitcher.
 */

export const ROLE_IDS = [
  'owner',
  'founder',
  'advisor',
  'csm',
  'mediaBuyer',
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
    ariaOpening: "Ready. What needs your attention first?",
    ariaQuickActions: [
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
    ariaOpening: "Ready. What needs your attention first?",
    ariaQuickActions: [
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
    ariaOpening: "I've reviewed all client briefs. 3 need your strategic input.",
    ariaQuickActions: [
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
    ariaOpening: 'Medglobal call is tomorrow. Want me to prep your brief?',
    ariaQuickActions: [
      'Prepare call brief',
      'Generate client report',
      'Draft check-in email',
    ],
    access: { escalations: true, inbox: true, team: false },
    assignedClients: ['Medglobal', 'Delta Garments', 'BGMEA Member Co', 'Apex Corp'],
  },
  mediaBuyer: {
    id: 'mediaBuyer',
    displayName: 'Media Buyer',
    sidebarVariant: 'mediaBuyer',
    ariaOpening: 'Meta is performing. One audience showing burnout — want to fix it?',
    ariaQuickActions: [
      'Optimize ad spend',
      'Refresh audience',
      'Pull performance report',
    ],
    access: { escalations: true, inbox: false },
    assignedClients: null,
  },
  contentStrategist: {
    id: 'contentStrategist',
    displayName: 'Content Strategist',
    sidebarVariant: 'contentStrategist',
    ariaOpening: '3 content pieces are waiting for your review.',
    ariaQuickActions: [
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
    ariaOpening: 'You have 3 hot replies. Want me to draft responses?',
    ariaQuickActions: [
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
    ariaOpening: "This week's data is ready. CPL improved 18% — want the breakdown?",
    ariaQuickActions: [
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
    ariaOpening: "Hi! Your campaign is on track — 312 leads so far this month.",
    ariaQuickActions: [
      'How are my results?',
      'When will I hit my goal?',
      'What happens next week?',
    ],
    access: { escalations: false, inbox: true },
    assignedClients: null,
  },
};

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
const FULL_SIDEBAR_SECTIONS = ['core', 'ops', 'teamManagement', 'research', 'campaigns', 'abmPlaybooks', 'revenue', 'crm', 'content', 'socialMediaAds', 'analyticsReports', 'ariaIntelligence', 'admin', 'aria'];

export function getSidebarSections(roleId) {
  const role = getRoleConfig(roleId);
  const variant = role.sidebarVariant;
  if (variant === 'full') return FULL_SIDEBAR_SECTIONS;
  const map = {
    client: ['core', 'content', 'admin'],
    sdr: ['core', 'ops', 'teamManagement', 'campaigns', 'crm', 'admin'],
    csm: ['core', 'revenue', 'crm', 'content', 'admin'],
    mediaBuyer: ['core', 'ops', 'teamManagement', 'revenue', 'content', 'socialMediaAds', 'admin'],
    contentStrategist: ['core', 'content', 'ariaIntelligence', 'admin'],
    analyst: ['core', 'ops', 'teamManagement', 'research', 'revenue', 'analyticsReports', 'admin'],
  };
  return map[variant] ?? FULL_SIDEBAR_SECTIONS;
}
