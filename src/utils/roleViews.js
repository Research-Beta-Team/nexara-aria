/**
 * Role view resolver: returns layout config per page for the current role.
 * Used by Dashboard, CampaignDetail, Inbox, Escalations via useRoleView.
 */

import { getRoleConfig, getAssignedClients } from '../config/roleConfig';

// ── Dashboard: which view component to render ──
export function getDashboardViewKey(role) {
  if (role === 'owner' || role === 'founder') return 'owner';
  if (role === 'client') return 'client';
  const key = role;
  const valid = ['owner', 'advisor', 'csm', 'contentStrategist', 'sdr', 'analyst'];
  return valid.includes(key) ? key : 'owner';
}

// ── Campaign Detail: default tab, visible tabs, layout variant ──
const TAB_IDS = ['overview', 'strategy', 'plan', 'content', 'outreach', 'paidads', 'phases', 'analytics', 'calendar'];

export function getCampaignDetailConfig(role) {
  const base = {
    showContextSwitcher: false,
    layout: 'tabs',
    defaultTab: 'overview',
    visibleTabs: TAB_IDS,
  };
  switch (role) {
    case 'owner':
    case 'founder':
    case 'advisor':
    case 'csm':
      return { ...base, showContextSwitcher: role === 'owner' || role === 'advisor' };
    case 'contentStrategist':
      return { ...base, layout: 'content', defaultTab: 'content', visibleTabs: ['content', 'overview'] };
    case 'sdr':
      return { ...base, layout: 'outreach', defaultTab: 'outreach', visibleTabs: ['outreach', 'overview'] };
    case 'analyst':
      return { ...base, layout: 'analytics', defaultTab: 'analytics', visibleTabs: ['analytics', 'overview'] };
    case 'client':
      return {
        ...base,
        layout: 'client',
        defaultTab: 'overview',
        visibleTabs: ['overview', 'content'],
        showContextSwitcher: false,
      };
    default:
      return base;
  }
}

// ── Inbox: filter and layout ──
export function getInboxConfig(role) {
  const access = getRoleConfig(role).access?.inbox !== false;
  if (!access) return { access: false, filter: 'all', layout: 'default' };
  switch (role) {
    case 'sdr':
      return { access: true, filter: 'outreach', layout: 'sdr' };
    case 'csm':
      return { access: true, filter: 'client', layout: 'default' };
    case 'contentStrategist':
      return { access: true, filter: 'content', layout: 'default' };
    case 'client':
      return { access: true, filter: 'client', layout: 'default' };
    default:
      return { access: true, filter: 'all', layout: 'default' };
  }
}

// ── Escalations: access and filter ──
export function getEscalationsConfig(role) {
  if (role === 'client') return { access: false, filter: 'all', readOnly: false };
  const access = getRoleConfig(role).access?.escalations;
  if (access === false) return { access: false, filter: 'all', readOnly: false };
  if (access === 'readonly') return { access: 'readonly', filter: 'all', readOnly: true };
  switch (role) {
    case 'csm':
      return { access: true, filter: 'client', readOnly: false };
    case 'contentStrategist':
      return { access: true, filter: 'content', readOnly: false };
    default:
      return { access: true, filter: 'all', readOnly: false };
  }
}

// ── Filter escalations by role config ──
function isAdsEscalation(e) {
  return e.agentType === 'Budget Guardian' || e.agentType === 'Ad Composer';
}
function isContentEscalation(e) {
  return e.agentType === 'Email Sequencer' || e.agentType === 'Brand Enforcer';
}

export function filterEscalations(escalations, role, config) {
  if (!config || config.filter === 'all') return escalations;
  if (config.filter === 'client') {
    const assigned = getAssignedClients(role);
    if (!assigned.length) return escalations;
    return escalations.filter((e) => {
      const client = (e.client || '').trim();
      return assigned.some((a) => client.includes(a) || a.includes(client));
    });
  }
  if (config.filter === 'ads') return escalations.filter(isAdsEscalation);
  if (config.filter === 'content') return escalations.filter(isContentEscalation);
  return escalations;
}

// ── Filter inbox conversations by role config ──
// Mock: infer type from channel/author. outreach = LinkedIn/Email with prospect; client = from client; content = approval; team = from team
export function filterConversations(conversations, role, config) {
  if (!config || config.filter === 'all') return conversations;
  if (config.filter === 'outreach') {
    return conversations.filter((c) =>
      ['LinkedIn', 'Email'].includes(c.channel) && c.ariaSuggestion
    );
  }
  if (config.filter === 'client') {
    return conversations.filter((c) => c.channel === 'Email' && (c.fromClient || c.contact?.includes('Client')));
  }
  if (config.filter === 'content') {
    return conversations.filter((c) => c.contentApproval);
  }
  if (config.filter === 'team') {
    return conversations.filter((c) => c.fromTeam || c.channel === 'Email');
  }
  return conversations;
}

// ── Content Library: layout, default filter/view, visible filters ──
export function getContentLibraryConfig(role) {
  const full = {
    layout: 'full',
    defaultFilterStatus: 'All',
    defaultView: 'List',
    showAgentFilter: true,
    showCampaignFilter: true,
    showTypeFilter: true,
    showStatusFilter: true,
  };
  switch (role) {
    case 'contentStrategist':
      return {
        ...full,
        defaultFilterStatus: 'pending',
        defaultView: 'By Type',
      };
    case 'csm':
      return {
        ...full,
        defaultFilterStatus: 'All',
        defaultView: 'By Campaign',
        scopeToAssignedClients: true,
      };
    case 'client':
      return {
        ...full,
        defaultFilterStatus: 'pending',
        defaultView: 'List',
        showAgentFilter: false,
        showCampaignFilter: false,
      };
    case 'owner':
    case 'founder':
    case 'advisor':
    case 'sdr':
    case 'analyst':
    default:
      return full;
  }
}

// ── Filter content items by role (client: my approvals; csm: assigned clients) ──
export function filterContentItems(items, role, config) {
  if (!config) return items;
  if (role === 'client') {
    return items.filter((i) => i.status === 'pending' || i.status === 'in_review');
  }
  if (config.layout === 'full' && !config.scopeToAssignedClients) return items;
  if (config.layout === 'client') {
    return items.filter((i) => i.status === 'pending' || i.status === 'in_review');
  }
  if (config.scopeToAssignedClients && role === 'csm') {
    const assigned = getAssignedClients(role);
    if (!assigned.length) return items;
    return items.filter((i) => {
      const name = (i.campaignName || '').toLowerCase();
      return assigned.some((a) => name.includes(a.toLowerCase().split(' ')[0]));
    });
  }
  return items;
}
