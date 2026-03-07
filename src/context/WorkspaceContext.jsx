// ─────────────────────────────────────────────
//  Antarious — App context (unified for enterprise & startup)
//  No workspace concept: one default layout. Role-based switching unchanged.
// ─────────────────────────────────────────────

import { createContext, useContext, useMemo } from 'react';
import useStore from '../store/useStore';
import { defaultLayout } from '../config/defaultLayout';

const WorkspaceContext = createContext(null);

export function WorkspaceProvider({ children }) {
  const activeClientId = useStore((s) => s.activeClientId);
  const workspaceProfiles = useStore((s) => s.workspaceProfiles);
  const updateClientPreference = useStore((s) => s.updateClientPreference);

  const value = useMemo(() => {
    const profile = workspaceProfiles[activeClientId] || null;
    const visibleModules = defaultLayout.visibleModules;
    const sidebarOrder = defaultLayout.sidebarOrder;

    const layout = profile?.layout ? { ...profile.layout, visibleModules, sidebarOrder } : { ...defaultLayout };
    const mergedProfile = profile ? { ...profile, layout } : { layout: defaultLayout };

    if (!profile) {
      return {
        profile: mergedProfile,
        activeClientId,
        isModuleVisible: (moduleId) => visibleModules.includes(moduleId),
        isAgentActive: () => false,
        getAriaConfig: () => ({}),
        getKPIs: () => ({}),
        getApprovalChain: () => [],
        canClientEdit: () => false,
        getClientPreference: () => undefined,
        setClientPreference: () => {},
      };
    }

    const agents = profile.agents || {};
    const aria = profile.aria || {};
    const workflows = profile.workflows || {};
    const kpis = profile.kpis || {};
    const activeAgents = agents.active || [];
    const disabledAgents = agents.disabled || [];
    const clientEditableFields = profile.clientEditableFields || [];
    const clientPreferences = profile.clientPreferences || {};

    return {
      profile: mergedProfile,
      activeClientId,
      isModuleVisible: (moduleId) => visibleModules.includes(moduleId),
      isAgentActive: (agentId) => activeAgents.includes(agentId),
      isAgentDisabled: (agentId) => disabledAgents.includes(agentId),
      getPrimaryAgent: () => agents.primaryAgent || null,
      getAriaConfig: () => aria,
      getKPIs: () => kpis,
      getApprovalChain: () => workflows.approvalChain || [],
      canClientEdit: (field) => clientEditableFields.includes(field),
      getClientPreference: (key) => clientPreferences[key],
      setClientPreference: (key, value) => updateClientPreference(activeClientId, key, value),
    };
  }, [activeClientId, workspaceProfiles, updateClientPreference]);

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspaceContext() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) {
    throw new Error('useWorkspaceContext must be used within WorkspaceProvider');
  }
  return ctx;
}

export default WorkspaceContext;
