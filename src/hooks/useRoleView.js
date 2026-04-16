/**
 * Hook: returns role-driven view config for the given page.
 * Reads currentRole from store and resolves via roleViews.js.
 */

import useStore from '../store/useStore';
import { getRoleConfig, getShellLayout } from '../config/roleConfig';
import {
  getDashboardViewKey,
  getCampaignDetailConfig,
  getInboxConfig,
  getEscalationsConfig,
  getContentLibraryConfig,
} from '../utils/roleViews';

const PAGE_KEYS = ['dashboard', 'campaign-detail', 'inbox', 'escalations', 'content-library'];

/**
 * @param {'dashboard'|'campaign-detail'|'inbox'|'escalations'|'content-library'} pageKey
 * @returns {object} Config for that page (viewKey, defaultTab, visibleTabs, access, etc.)
 */
export function useRoleView(pageKey) {
  const currentRole = useStore((s) => s.currentRole);
  if (!PAGE_KEYS.includes(pageKey)) {
    return { role: currentRole };
  }
  switch (pageKey) {
    case 'dashboard':
      return { role: currentRole, viewKey: getDashboardViewKey(currentRole) };
    case 'campaign-detail':
      return { role: currentRole, ...getCampaignDetailConfig(currentRole) };
    case 'inbox':
      return { role: currentRole, ...getInboxConfig(currentRole) };
    case 'escalations':
      return { role: currentRole, ...getEscalationsConfig(currentRole) };
    case 'content-library':
      return { role: currentRole, ...getContentLibraryConfig(currentRole) };
    default:
      return { role: currentRole };
  }
}

/**
 * Convenience: currentRole, setRole, and full config for current role.
 */
export function useRole() {
  const currentRole = useStore((s) => s.currentRole);
  const setRole = useStore((s) => s.setRole);
  const config = getRoleConfig(currentRole);
  const shell = getShellLayout(currentRole);
  return {
    currentRole,
    setRole,
    shell,
    ...config,
  };
}
