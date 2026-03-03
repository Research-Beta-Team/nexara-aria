// ─────────────────────────────────────────────
//  NEXARA — Default layout (enterprise & startup, same design)
//  No workspace concept: one unified module list and sidebar order.
//  Role-based visibility is still applied via roleConfig.
// ─────────────────────────────────────────────

export const DEFAULT_VISIBLE_MODULES = [
  'dashboard',
  'campaigns',
  'outreach',
  'content',
  'knowledge',
  'calendar',
  'analytics',
  'inbox',
  'pipeline',
  'forecast',
  'customer-success',
  'crm',
  'research/icp',
  'research/intent',
  'research/competitive',
  'abm',
  'playbooks',
  'querymanager',
  'meta-monitoring',
  'social',
  'escalations',
];

export const DEFAULT_SIDEBAR_ORDER = [
  'dashboard',
  'campaigns',
  'outreach',
  'content',
  'knowledge',
  'calendar',
  'analytics',
  'inbox',
  'pipeline',
  'forecast',
  'customer-success',
  'crm',
  'research/icp',
  'research/intent',
  'research/competitive',
  'abm',
  'playbooks',
  'querymanager',
  'meta-monitoring',
  'social',
  'escalations',
];

export const defaultLayout = {
  visibleModules: DEFAULT_VISIBLE_MODULES,
  sidebarOrder: DEFAULT_SIDEBAR_ORDER,
};
