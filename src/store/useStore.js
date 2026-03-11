import { create } from 'zustand';
import { clientWorkspaceProfiles as initialWorkspaceProfiles } from '../data/clientWorkspaceProfiles';
import { CONNECTED_ACCOUNTS as initialConnectedAccounts, SOCIAL_CAMPAIGNS_INITIAL } from '../data/social';
import { getInitialFreyaMemory } from '../data/memoryMock';
import { approvalsMock } from '../data/approvalsMock';
import { mqlQueueMock } from '../data/handoffMock';

const AUTH_STORAGE_KEY = 'nexara_auth';
const FREYA_CHATS_STORAGE_KEY = 'nexara_freya_chats';

function readAuthFromStorage() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return { isAuthenticated: false, isOnboarded: false };
    const data = JSON.parse(raw);
    return {
      isAuthenticated: Boolean(data.isAuthenticated),
      isOnboarded: Boolean(data.isOnboarded),
    };
  } catch {
    return { isAuthenticated: false, isOnboarded: false };
  }
}

function writeAuthToStorage(isAuthenticated, isOnboarded) {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ isAuthenticated, isOnboarded }));
  } catch (_) {}
}

function readFreyaChatsFromStorage() {
  try {
    const raw = localStorage.getItem(FREYA_CHATS_STORAGE_KEY);
    if (!raw) return { freyaFolders: [], freyaChats: [], freyaCurrentChatId: null };
    const data = JSON.parse(raw);
    return {
      freyaFolders: Array.isArray(data.folders) ? data.folders : [],
      freyaChats: Array.isArray(data.chats) ? data.chats : [],
      freyaCurrentChatId: data.currentChatId ?? null,
    };
  } catch {
    return { freyaFolders: [], freyaChats: [], freyaCurrentChatId: null };
  }
}

function writeFreyaChatsToStorage(folders, chats, currentChatId) {
  try {
    localStorage.setItem(FREYA_CHATS_STORAGE_KEY, JSON.stringify({
      folders: folders || [],
      chats: chats || [],
      currentChatId: currentChatId ?? null,
    }));
  } catch (_) {}
}

const initialAuth = readAuthFromStorage();

// Valid roles: owner | founder | advisor | csm | contentStrategist | sdr | analyst

const useStore = create((set, get) => ({
  // ── Identity / Context ──────────────────────
  currentRole: 'owner',
  activeClientId: 'medglobal',
  workspaceProfiles: initialWorkspaceProfiles,
  currentClient: 'Medglobal',
  currentCampaign: 'CFO Vietnam Q1',
  userFirstName: 'Asif',

  // ── Workspace Preview (admin "view as client") ──
  previousClientIdBeforePreview: null,

  // ── Team (members + current user id for "you" badge) ──
  currentUserId: 'u1',
  teamMembers: [
    { id: 'u1', name: 'Asif', email: 'asif@nexara.demo', roleId: 'owner', status: 'active', joinedAt: '2024-01-15' },
    { id: 'u2', name: 'Sarah Chen', email: 'sarah@nexara.demo', roleId: 'csm', status: 'active', joinedAt: '2024-02-01' },
    { id: 'u3', name: 'James Wilson', email: 'james@nexara.demo', roleId: 'sdr', status: 'active', joinedAt: '2024-02-10' },
    { id: 'u4', name: 'Priya Patel', email: 'priya@nexara.demo', roleId: 'contentStrategist', status: 'active', joinedAt: '2024-02-15' },
    { id: 'u5', name: 'Alex Kim', email: 'alex@nexara.demo', roleId: 'analyst', status: 'invited', invitedAt: '2025-03-01' },
  ],

  // ── Auth (rehydrated from localStorage so routing works after refresh) ──
  isAuthenticated: initialAuth.isAuthenticated,

  // ── UI State ────────────────────────────────
  freyaOpen: false,
  sidebarCollapsed: false,
  onboardingComplete: false,
  onboardingSkipped: false,
  onboardingCompanyType: '',
  onboardingSelectedPlanId: '',
  onboardingConnections: { website: '', crm: '', ads: false },
  isOnboarded: initialAuth.isOnboarded,
    freyaMomentCompleted: false,
  onboardingExtraction: null,
  isDarkMode: true,

  // ── Segment: 'startup' | 'agency' | null (personalizes app for startup vs agency) ──
  segment: null,

  // ── Startup flow (/for_startups) ──
  startupFlow: {
    completed: false,
    companyName: '',
    product: '',
    teamSize: 1,
    channels: [],
    contentPreference: 'both',
  },

  // ── Connections (used by onboarding + Settings) ──
  connections: {
    website: null,
    crm: null,
    meta: false,
    linkedin: false,
    google: false,
  },

  // ── Previous ads: permission to fetch previous ads and add to Freya to learn ──
  paidAdsPermissions: {
    allowFetch: false,
    allowFreyaLearn: false,
  },

  // ── Notifications ────────────────────────────
  notifications: [],

  // ── Toasts ──────────────────────────────────
  // Each toast: { id, message, type: 'success'|'error'|'warning'|'info', duration? }
  toasts: [],

  // ── Checkout State ───────────────────────────
  checkoutOpen: false,
  checkoutTargetPlan: null,      // planId string e.g. 'scale'
  checkoutSourceFeature: null,   // featureKey that triggered upgrade, or null

  // ── Plan State ───────────────────────────────
  currentPlanId: 'growth',
  billingCycle: 'annual',
  planRenewsAt: '2027-03-01',
  seatsUsed: 7,
  workspacesUsed: 2,
  activeCampaignsCount: 8,
  addonsActive: ['intent_data_boost'],

  // ── Credit State ─────────────────────────────
  creditsIncluded: 25000,
  creditsUsed: 18340,
  rolloverBalance: 4200,
  creditBurnRatePerDay: 612,

  // ── Freya: escalations & scheduled actions (for tool executor) ──
  freyaEscalations: [],
  freyaScheduledActions: [],

  // ── Freya Weekly Brief & Priority ─────────────────────────────
  freyaWeeklyPriority: '',
  freyaBriefModalOpen: false,

  // ── Social: connected accounts + campaigns (posts editable/reorderable) ──
  connectedAccounts: initialConnectedAccounts,
  socialCampaigns: SOCIAL_CAMPAIGNS_INITIAL,

  // ── Inbox: unread count (set by UnifiedInbox) + platform assignments (who handles each channel; Freya can assist) ──
  inboxUnreadCount: 0,
  inboxPlatformAssignments: {
    LinkedIn:  { assignedTo: 'u3', freyaHandles: true },  // u3 = James (SDR)
    Meta:     { assignedTo: 'freya', freyaHandles: true },
    Facebook: { assignedTo: 'freya', freyaHandles: true },
    Instagram: { assignedTo: 'freya', freyaHandles: true },
    WhatsApp: { assignedTo: 'u3', freyaHandles: true },
    Email:    { assignedTo: 'u4', freyaHandles: true },   // u4 = Priya (Content)
  },

  // ── Freya Persona Configuration ──────────────────────────────
  freyaPersonaId: 'cro',
  freyaOperatingRole: 'Chief Revenue Officer',
  freyaCustomRoleDescription: '',
  freyaCompanyBrand: 'Medglobal',
  freyaIndustry: 'B2B SaaS / GTM Agency',
  freyaPrimaryMarket: 'Bangladesh, South Asia',
  freyaCustomRules: [
    { id: 'r1', text: 'Always be concise — executives don\'t read long paragraphs', enabled: true, category: 'TONE' },
    { id: 'r2', text: 'Lead with data — every recommendation must cite a number', enabled: true, category: 'STRATEGY' },
    { id: 'r3', text: 'Never use buzzwords like \'synergy\', \'leverage\', \'deep dive\'', enabled: true, category: 'TONE' },
    { id: 'r4', text: 'Default to Bengali-English mixed when addressing Bangladeshi clients', enabled: true, category: 'FORMAT' },
    { id: 'r5', text: 'Always include a competitor angle in campaign strategies', enabled: true, category: 'STRATEGY' },
  ],

  // ── Freya Co-pilot: chat history & project folders ──
  ...readFreyaChatsFromStorage(),

  // ── Freya Persistent Memory (Session 1 — brand, audience, campaigns, performance) ──
  freyaMemory: getInitialFreyaMemory(),

  // ── Actions: Identity ────────────────────────
  setRole: (role) => set({ currentRole: role }),

  setActiveClient: (clientId) => {
    const profiles = get().workspaceProfiles;
    const profile = profiles[clientId];
    const currentClient = profile ? profile.clientName : (get().currentClient || '');
    set({ activeClientId: clientId, currentClient });
  },

  setClient: (client) => set({ currentClient: client }),

  setPreviewAsClient: (clientId) =>
    set((state) => {
      const profile = state.workspaceProfiles[clientId];
      const currentClient = profile ? profile.clientName : state.currentClient;
      return {
        previousClientIdBeforePreview: state.activeClientId,
        activeClientId: clientId,
        currentClient,
      };
    }),

  exitPreview: () =>
    set((state) => {
      const prev = state.previousClientIdBeforePreview;
      if (prev == null) return state;
      const profile = state.workspaceProfiles[prev];
      const currentClient = profile ? profile.clientName : state.currentClient;
      return {
        activeClientId: prev,
        currentClient,
        previousClientIdBeforePreview: null,
      };
    }),

  updateClientPreference: (clientId, key, value) =>
    set((state) => {
      const profile = state.workspaceProfiles[clientId];
      if (!profile || !profile.clientPreferences) return state;
      const next = { ...state.workspaceProfiles };
      next[clientId] = {
        ...profile,
        clientPreferences: { ...profile.clientPreferences, [key]: value },
      };
      return { workspaceProfiles: next };
    }),

  updateWorkspaceConfig: (clientId, config) =>
    set((state) => {
      const profile = state.workspaceProfiles[clientId];
      if (!profile) return state;
      const next = { ...state.workspaceProfiles };
      next[clientId] = { ...profile, ...config };
      return { workspaceProfiles: next };
    }),

  setCampaign: (campaign) => set({ currentCampaign: campaign }),

  setStartupFlow: (updates) =>
    set((state) => ({
      startupFlow: { ...state.startupFlow, ...updates },
    })),

  setSegment: (segment) => set({ segment: segment ?? null }),

  // ── Actions: Team ─────────────────────────────
  setCurrentUserId: (id) => set({ currentUserId: id ?? null }),

  addTeamMember: (member) => {
    const id = member.id || `u-${Date.now()}`;
    set((state) => ({
      teamMembers: [...state.teamMembers, { ...member, id, status: member.status || 'invited', invitedAt: member.invitedAt || new Date().toISOString().slice(0, 10) }],
    }));
    return id;
  },

  updateTeamMember: (id, updates) =>
    set((state) => ({
      teamMembers: state.teamMembers.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    })),

  removeTeamMember: (id) =>
    set((state) => ({
      teamMembers: state.teamMembers.filter((m) => m.id !== id),
    })),

  // ── Actions: Social (connected accounts + campaign posts) ─────
  addConnectedAccount: (account) =>
    set((state) => ({
      connectedAccounts: [...state.connectedAccounts, { ...account, status: 'connected' }],
    })),
  removeConnectedAccount: (accountId) =>
    set((state) => ({
      connectedAccounts: state.connectedAccounts.filter((a) => a.id !== accountId),
    })),

  setInboxUnreadCount: (count) => set({ inboxUnreadCount: Math.max(0, count) }),

  setInboxPlatformAssignment: (platform, payload) =>
    set((state) => ({
      inboxPlatformAssignments: {
        ...state.inboxPlatformAssignments,
        [platform]: {
          assignedTo: payload.assignedTo ?? state.inboxPlatformAssignments[platform]?.assignedTo,
          freyaHandles: payload.freyaHandles ?? state.inboxPlatformAssignments[platform]?.freyaHandles ?? true,
        },
      },
    })),

  setSocialCampaignPosts: (campaignId, posts) =>
    set((state) => ({
      socialCampaigns: state.socialCampaigns.map((c) =>
        c.id === campaignId ? { ...c, posts: posts.map((p, i) => ({ ...p, order: i })) } : c
      ),
    })),
  updateSocialPost: (campaignId, postId, updates) =>
    set((state) => ({
      socialCampaigns: state.socialCampaigns.map((c) =>
        c.id === campaignId
          ? { ...c, posts: c.posts.map((p) => (p.id === postId ? { ...p, ...updates } : p)) }
          : c
      ),
    })),

  // ── Actions: UI ──────────────────────────────
  // ── Actions: Auth ────────────────────────────
  login: () => {
    set({
      isAuthenticated: true,
      isOnboarded: false,
      onboardingComplete: false,
      freyaMomentCompleted: false,
    });
    writeAuthToStorage(true, false);
    if (import.meta.env.DEV) {
      try {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k?.startsWith('nexara_welcome_banner_dismissed_') || k === 'nexara_credit_banner_dismissed') keysToRemove.push(k);
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k));
      } catch (_) {}
      try {
        sessionStorage.removeItem('nexara_credit_toast_last');
      } catch (_) {}
    }
  },
  logout: () => {
    set({
      isAuthenticated: false,
      onboardingComplete: false,
      isOnboarded: false,
    });
    writeAuthToStorage(false, false);
  },

  completeOnboarding: () => {
    set({
      onboardingComplete: true,
      isOnboarded: true,
      freyaMomentCompleted: true,
    });
    writeAuthToStorage(get().isAuthenticated, true);
  },

  setOnboardingExtraction: (data) => set({ onboardingExtraction: data }),

  setOnboardingSkipped: (skipped) => set({ onboardingSkipped: skipped }),
  setOnboardingCompanyType: (v) => set({ onboardingCompanyType: v }),
  setOnboardingSelectedPlanId: (v) => set({ onboardingSelectedPlanId: v }),
  setOnboardingConnections: (v) => set((s) => ({ onboardingConnections: { ...s.onboardingConnections, ...v } })),

  setConnectionWebsite: (url) => set((s) => ({ connections: { ...s.connections, website: url || null } })),
  setConnectionCrm: (name) => set((s) => ({ connections: { ...s.connections, crm: name || null } })),
  setConnectionAds: (platform, connected) =>
    set((s) => ({
      connections: {
        ...s.connections,
        [platform]: connected,
      },
    })),

  setPaidAdsPermissions: (patch) =>
    set((s) => ({
      paidAdsPermissions: { ...s.paidAdsPermissions, ...patch },
    })),

  toggleTheme: () => set((s) => ({ isDarkMode: !s.isDarkMode })),

  toggleFreya: () => set((state) => ({ freyaOpen: !state.freyaOpen })),

  setFreyaOpen: (open) => set({ freyaOpen: Boolean(open) }),

  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  // ── Dashboard → Campaign: files uploaded on dashboard to start a campaign ──
  dashboardCampaignFiles: [],
  setDashboardCampaignFiles: (files) => set({ dashboardCampaignFiles: Array.isArray(files) ? files : [] }),
  clearDashboardCampaignFiles: () => set({ dashboardCampaignFiles: [] }),

  // ── Actions: Toasts ──────────────────────────
  addToast: ({ message, type = 'info', duration = 3500 }) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, duration }],
    }));
    return id;
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  clearToasts: () => set({ toasts: [] }),

  // ── Actions: Notifications ───────────────────
  // Seed with a pre-built array (preserves id, read, severity, time, etc.)
  seedNotifications: (arr) => set({ notifications: arr }),

  addNotification: ({ title, body, type = 'info', link = null }) => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const notification = {
      id,
      title,
      body,
      type,
      link,
      read: false,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      notifications: [notification, ...state.notifications],
    }));
    return id;
  },

  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  markAllNotificationsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearNotifications: () => set({ notifications: [] }),

  // ── Actions: Checkout ────────────────────────
  openCheckout: (planId, sourceFeature = null) =>
    set({ checkoutOpen: true, checkoutTargetPlan: planId, checkoutSourceFeature: sourceFeature }),

  closeCheckout: () =>
    set({ checkoutOpen: false, checkoutTargetPlan: null, checkoutSourceFeature: null }),

  completeUpgrade: (planId, creditsIncluded) =>
    set({ currentPlanId: planId, creditsIncluded, checkoutOpen: false, checkoutTargetPlan: null, checkoutSourceFeature: null }),

  // ── Actions: Plan & Credits ──────────────────
  setPlan: (planId) => set({ currentPlanId: planId }),

  setCreditsIncluded: (n) => set({ creditsIncluded: n }),

  setCreditsUsed: (n) => set({ creditsUsed: n }),

  consumeCredits: (amount) =>
    set((state) => ({ creditsUsed: state.creditsUsed + amount })),

  addFreyaEscalation: (escalation) =>
    set((state) => ({ freyaEscalations: [...state.freyaEscalations, escalation] })),

  addFreyaScheduledAction: (action) =>
    set((state) => ({ freyaScheduledActions: [...state.freyaScheduledActions, action] })),

  setFreyaWeeklyPriority: (text) => set({ freyaWeeklyPriority: text ?? '' }),

  setFreyaBriefModalOpen: (open) => set({ freyaBriefModalOpen: Boolean(open) }),

  setFreyaPersona: (personaId, roleName) =>
    set({ freyaPersonaId: personaId, freyaOperatingRole: roleName || '' }),

  setFreyaCustomRoleDescription: (text) => set({ freyaCustomRoleDescription: text || '' }),

  setFreyaContext: (payload) =>
    set((s) => ({
      freyaCompanyBrand: payload.companyBrand !== undefined ? payload.companyBrand : s.freyaCompanyBrand,
      freyaIndustry: payload.industry !== undefined ? payload.industry : s.freyaIndustry,
      freyaPrimaryMarket: payload.primaryMarket !== undefined ? payload.primaryMarket : s.freyaPrimaryMarket,
    })),

  addFreyaRule: (rule) =>
    set((state) => ({
      freyaCustomRules: [...state.freyaCustomRules, { ...rule, id: rule.id || `r-${Date.now()}` }],
    })),

  updateFreyaRule: (ruleId, updates) =>
    set((state) => ({
      freyaCustomRules: state.freyaCustomRules.map((r) =>
        r.id === ruleId ? { ...r, ...updates } : r
      ),
    })),

  toggleFreyaRule: (ruleId) =>
    set((state) => ({
      freyaCustomRules: state.freyaCustomRules.map((r) =>
        r.id === ruleId ? { ...r, enabled: !r.enabled } : r
      ),
    })),

  removeFreyaRule: (ruleId) =>
    set((state) => ({
      freyaCustomRules: state.freyaCustomRules.filter((r) => r.id !== ruleId),
    })),

  // ── Freya Co-pilot: chats & folders (persisted) ──
  addFreyaFolder: (name) => {
    const id = `folder-${Date.now()}`;
    set((state) => {
      const next = [...(state.freyaFolders || []), { id, name: name || 'New folder' }];
      writeFreyaChatsToStorage(next, state.freyaChats, state.freyaCurrentChatId);
      return { freyaFolders: next };
    });
    return id;
  },
  updateFreyaFolder: (folderId, name) =>
    set((state) => {
      const next = (state.freyaFolders || []).map((f) => (f.id === folderId ? { ...f, name } : f));
      writeFreyaChatsToStorage(next, state.freyaChats, state.freyaCurrentChatId);
      return { freyaFolders: next };
    }),
  removeFreyaFolder: (folderId) =>
    set((state) => {
      const nextFolders = (state.freyaFolders || []).filter((f) => f.id !== folderId);
      const nextChats = (state.freyaChats || []).map((c) =>
        c.folderId === folderId ? { ...c, folderId: null } : c
      );
      writeFreyaChatsToStorage(nextFolders, nextChats, state.freyaCurrentChatId);
      return { freyaFolders: nextFolders, freyaChats: nextChats };
    }),
  addFreyaChat: (opts = {}) => {
    const id = `chat-${Date.now()}`;
    const now = new Date().toISOString();
    const chat = {
      id,
      folderId: opts.folderId ?? null,
      title: opts.title ?? 'New chat',
      createdAt: now,
      updatedAt: now,
      messages: opts.messages ?? [],
    };
    set((state) => {
      const next = [chat, ...(state.freyaChats || [])];
      writeFreyaChatsToStorage(state.freyaFolders, next, id);
      return { freyaChats: next, freyaCurrentChatId: id };
    });
    return id;
  },
  updateFreyaChat: (chatId, updates) =>
    set((state) => {
      const next = (state.freyaChats || []).map((c) =>
        c.id === chatId ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
      );
      writeFreyaChatsToStorage(state.freyaFolders, next, state.freyaCurrentChatId);
      return { freyaChats: next };
    }),
  updateFreyaChatMessages: (chatId, messages) =>
    set((state) => {
      const firstUser = messages?.find((m) => m.role === 'user');
      const title = firstUser?.text ? firstUser.text.slice(0, 40) + (firstUser.text.length > 40 ? '…' : '') : 'New chat';
      const next = (state.freyaChats || []).map((c) =>
        c.id === chatId ? { ...c, messages: messages || [], title, updatedAt: new Date().toISOString() } : c
      );
      writeFreyaChatsToStorage(state.freyaFolders, next, state.freyaCurrentChatId);
      return { freyaChats: next };
    }),
  removeFreyaChat: (chatId) =>
    set((state) => {
      const next = (state.freyaChats || []).filter((c) => c.id !== chatId);
      const nextCurrent = state.freyaCurrentChatId === chatId ? (next[0]?.id ?? null) : state.freyaCurrentChatId;
      writeFreyaChatsToStorage(state.freyaFolders, next, nextCurrent);
      return { freyaChats: next, freyaCurrentChatId: nextCurrent };
    }),
  setFreyaCurrentChatId: (chatId) =>
    set((state) => {
      writeFreyaChatsToStorage(state.freyaFolders, state.freyaChats, chatId);
      return { freyaCurrentChatId: chatId };
    }),
  moveFreyaChatToFolder: (chatId, folderId) =>
    set((state) => {
      const next = (state.freyaChats || []).map((c) =>
        c.id === chatId ? { ...c, folderId } : c
      );
      writeFreyaChatsToStorage(state.freyaFolders, next, state.freyaCurrentChatId);
      return { freyaChats: next };
    }),

  // ── Freya Persistent Memory actions ───────────────────────────
  addMemoryEntry: (namespace, entry) =>
    set((state) => {
      const key = namespace;
      if (!state.freyaMemory || !state.freyaMemory[key]) return state;
      const id = entry.id || `mem-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const withTimestamp = { ...entry, id, updatedAt: entry.updatedAt || new Date().toISOString(), source: entry.source || 'Manual' };
      return {
        freyaMemory: {
          ...state.freyaMemory,
          [key]: [...state.freyaMemory[key], withTimestamp],
        },
      };
    }),
  deleteMemoryEntry: (namespace, id) =>
    set((state) => {
      const key = namespace;
      if (!state.freyaMemory || !state.freyaMemory[key]) return state;
      return {
        freyaMemory: {
          ...state.freyaMemory,
          [key]: state.freyaMemory[key].filter((e) => e.id !== id),
        },
      };
    }),
  updateMemoryEntry: (namespace, id, content) =>
    set((state) => {
      const key = namespace;
      if (!state.freyaMemory || !state.freyaMemory[key]) return state;
      return {
        freyaMemory: {
          ...state.freyaMemory,
          [key]: state.freyaMemory[key].map((e) =>
            e.id === id ? { ...e, content, updatedAt: new Date().toISOString() } : e
          ),
        },
      };
    }),

  // ── Content approvals (threaded) ───────────────────────────
  approvals: [],
  openApprovalId: null,

  // ── Content Approval Workflow (Session 2 — queue + history) ──
  approvalQueue: approvalsMock,
  approvalHistory: [],

  seedApprovals: (items) => set({ approvals: items || [] }),

  setOpenApproval: (contentId) => set({ openApprovalId: contentId ?? null }),

  updateApprovalStatus: (contentId, newStatus) =>
    set((state) => ({
      approvals: state.approvals.map((a) =>
        a.contentId === contentId
          ? { ...a, status: newStatus, statusUpdatedAt: new Date().toISOString().slice(0, 10) }
          : a
      ),
    })),

  addApprovalComment: (contentId, comment) =>
    set((state) => ({
      approvals: state.approvals.map((a) =>
        a.contentId === contentId
          ? { ...a, comments: [...(a.comments || []), { ...comment, id: `c-${Date.now()}` }] }
          : a
      ),
    })),

  // ── Content Approval Workflow actions ───────────────────────
  updateApprovalItem: (itemId, updates) =>
    set((state) => ({
      approvalQueue: (state.approvalQueue || []).map((item) =>
        item.id === itemId ? { ...item, ...updates } : item
      ),
    })),
  addApprovalItemComment: (itemId, comment) =>
    set((state) => ({
      approvalQueue: (state.approvalQueue || []).map((item) =>
        item.id === itemId
          ? { ...item, comments: [...(item.comments || []), { ...comment, id: `c-${Date.now()}`, createdAt: new Date().toISOString() }] }
          : item
      ),
    })),
  appendApprovalHistory: (entry) =>
    set((state) => ({
      approvalHistory: [...(state.approvalHistory || []), { ...entry, at: entry.at || new Date().toISOString() }],
    })),

  // ── MQL Handoff (Session 3) ─────────────────────────────────────
  mqlQueue: mqlQueueMock,
  handoffHistory: [],
  updateMqlItem: (mqlId, updates) =>
    set((state) => ({
      mqlQueue: (state.mqlQueue || []).map((item) =>
        item.id === mqlId ? { ...item, ...updates } : item
      ),
    })),
  appendHandoffHistory: (entry) =>
    set((state) => ({
      handoffHistory: [...(state.handoffHistory || []), { ...entry, at: entry.at || new Date().toISOString() }],
    })),

  // ── Multi-Touch Attribution (Session 4) ───────────────────────
  attributionModel: 'w_shaped',
  setAttributionModel: (modelId) => set({ attributionModel: modelId }),

  activateAddon: (addonId) =>
    set((state) => ({ addonsActive: [...state.addonsActive, addonId] })),

  deactivateAddon: (addonId) =>
    set((state) => ({ addonsActive: state.addonsActive.filter((a) => a !== addonId) })),

  // ── Derived (getters) ────────────────────────
  get unreadCount() {
    return get().notifications.filter((n) => !n.read).length;
  },
}));

export default useStore;
