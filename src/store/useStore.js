import { create } from 'zustand';
import { clientWorkspaceProfiles as initialWorkspaceProfiles } from '../data/clientWorkspaceProfiles';
import { CONNECTED_ACCOUNTS as initialConnectedAccounts, SOCIAL_CAMPAIGNS_INITIAL } from '../data/social';

const AUTH_STORAGE_KEY = 'nexara_auth';
const ARIA_CHATS_STORAGE_KEY = 'nexara_aria_chats';

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

function readAriaChatsFromStorage() {
  try {
    const raw = localStorage.getItem(ARIA_CHATS_STORAGE_KEY);
    if (!raw) return { ariaFolders: [], ariaChats: [], ariaCurrentChatId: null };
    const data = JSON.parse(raw);
    return {
      ariaFolders: Array.isArray(data.folders) ? data.folders : [],
      ariaChats: Array.isArray(data.chats) ? data.chats : [],
      ariaCurrentChatId: data.currentChatId ?? null,
    };
  } catch {
    return { ariaFolders: [], ariaChats: [], ariaCurrentChatId: null };
  }
}

function writeAriaChatsToStorage(folders, chats, currentChatId) {
  try {
    localStorage.setItem(ARIA_CHATS_STORAGE_KEY, JSON.stringify({
      folders: folders || [],
      chats: chats || [],
      currentChatId: currentChatId ?? null,
    }));
  } catch (_) {}
}

const initialAuth = readAuthFromStorage();

// Valid roles: owner | founder | advisor | csm | mediaBuyer | contentStrategist | sdr | analyst | client

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
  ariaOpen: false,
  sidebarCollapsed: false,
  onboardingComplete: false,
  onboardingSkipped: false,
  onboardingCompanyType: '',
  onboardingSelectedPlanId: '',
  onboardingConnections: { website: '', crm: '', ads: false },
  isOnboarded: initialAuth.isOnboarded,
  ariaMomentCompleted: false,
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

  // ── Previous ads: permission to fetch previous ads and add to ARIA to learn ──
  paidAdsPermissions: {
    allowFetch: false,
    allowAriaLearn: false,
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

  // ── ARIA: escalations & scheduled actions (for tool executor) ──
  ariaEscalations: [],
  ariaScheduledActions: [],

  // ── ARIA Weekly Brief & Priority ─────────────────────────────
  ariaWeeklyPriority: '',
  ariaBriefModalOpen: false,

  // ── Social: connected accounts + campaigns (posts editable/reorderable) ──
  connectedAccounts: initialConnectedAccounts,
  socialCampaigns: SOCIAL_CAMPAIGNS_INITIAL,

  // ── ARIA Persona Configuration ──────────────────────────────
  ariaPersonaId: 'cro',
  ariaOperatingRole: 'Chief Revenue Officer',
  ariaCustomRoleDescription: '',
  ariaCompanyBrand: 'Medglobal',
  ariaIndustry: 'B2B SaaS / GTM Agency',
  ariaPrimaryMarket: 'Bangladesh, South Asia',
  ariaCustomRules: [
    { id: 'r1', text: 'Always be concise — executives don\'t read long paragraphs', enabled: true, category: 'TONE' },
    { id: 'r2', text: 'Lead with data — every recommendation must cite a number', enabled: true, category: 'STRATEGY' },
    { id: 'r3', text: 'Never use buzzwords like \'synergy\', \'leverage\', \'deep dive\'', enabled: true, category: 'TONE' },
    { id: 'r4', text: 'Default to Bengali-English mixed when addressing Bangladeshi clients', enabled: true, category: 'FORMAT' },
    { id: 'r5', text: 'Always include a competitor angle in campaign strategies', enabled: true, category: 'STRATEGY' },
  ],

  // ── ARIA Co-pilot: chat history & project folders ──
  ...readAriaChatsFromStorage(),

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
      ariaMomentCompleted: false,
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
      ariaMomentCompleted: true,
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

  toggleAria: () => set((state) => ({ ariaOpen: !state.ariaOpen })),

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

  addAriaEscalation: (escalation) =>
    set((state) => ({ ariaEscalations: [...state.ariaEscalations, escalation] })),

  addAriaScheduledAction: (action) =>
    set((state) => ({ ariaScheduledActions: [...state.ariaScheduledActions, action] })),

  setAriaWeeklyPriority: (text) => set({ ariaWeeklyPriority: text ?? '' }),

  setAriaBriefModalOpen: (open) => set({ ariaBriefModalOpen: Boolean(open) }),

  setARIAPersona: (personaId, roleName) =>
    set({ ariaPersonaId: personaId, ariaOperatingRole: roleName || '' }),

  setARIACustomRoleDescription: (text) => set({ ariaCustomRoleDescription: text || '' }),

  setARIAContext: (payload) =>
    set((s) => ({
      ariaCompanyBrand: payload.companyBrand !== undefined ? payload.companyBrand : s.ariaCompanyBrand,
      ariaIndustry: payload.industry !== undefined ? payload.industry : s.ariaIndustry,
      ariaPrimaryMarket: payload.primaryMarket !== undefined ? payload.primaryMarket : s.ariaPrimaryMarket,
    })),

  addARIARule: (rule) =>
    set((state) => ({
      ariaCustomRules: [...state.ariaCustomRules, { ...rule, id: rule.id || `r-${Date.now()}` }],
    })),

  updateARIARule: (ruleId, updates) =>
    set((state) => ({
      ariaCustomRules: state.ariaCustomRules.map((r) =>
        r.id === ruleId ? { ...r, ...updates } : r
      ),
    })),

  toggleARIARule: (ruleId) =>
    set((state) => ({
      ariaCustomRules: state.ariaCustomRules.map((r) =>
        r.id === ruleId ? { ...r, enabled: !r.enabled } : r
      ),
    })),

  removeARIARule: (ruleId) =>
    set((state) => ({
      ariaCustomRules: state.ariaCustomRules.filter((r) => r.id !== ruleId),
    })),

  // ── ARIA Co-pilot: chats & folders (persisted) ──
  addAriaFolder: (name) => {
    const id = `folder-${Date.now()}`;
    set((state) => {
      const next = [...(state.ariaFolders || []), { id, name: name || 'New folder' }];
      writeAriaChatsToStorage(next, state.ariaChats, state.ariaCurrentChatId);
      return { ariaFolders: next };
    });
    return id;
  },
  updateAriaFolder: (folderId, name) =>
    set((state) => {
      const next = (state.ariaFolders || []).map((f) => (f.id === folderId ? { ...f, name } : f));
      writeAriaChatsToStorage(next, state.ariaChats, state.ariaCurrentChatId);
      return { ariaFolders: next };
    }),
  removeAriaFolder: (folderId) =>
    set((state) => {
      const nextFolders = (state.ariaFolders || []).filter((f) => f.id !== folderId);
      const nextChats = (state.ariaChats || []).map((c) =>
        c.folderId === folderId ? { ...c, folderId: null } : c
      );
      writeAriaChatsToStorage(nextFolders, nextChats, state.ariaCurrentChatId);
      return { ariaFolders: nextFolders, ariaChats: nextChats };
    }),
  addAriaChat: (opts = {}) => {
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
      const next = [chat, ...(state.ariaChats || [])];
      writeAriaChatsToStorage(state.ariaFolders, next, id);
      return { ariaChats: next, ariaCurrentChatId: id };
    });
    return id;
  },
  updateAriaChat: (chatId, updates) =>
    set((state) => {
      const next = (state.ariaChats || []).map((c) =>
        c.id === chatId ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
      );
      writeAriaChatsToStorage(state.ariaFolders, next, state.ariaCurrentChatId);
      return { ariaChats: next };
    }),
  updateAriaChatMessages: (chatId, messages) =>
    set((state) => {
      const firstUser = messages?.find((m) => m.role === 'user');
      const title = firstUser?.text ? firstUser.text.slice(0, 40) + (firstUser.text.length > 40 ? '…' : '') : 'New chat';
      const next = (state.ariaChats || []).map((c) =>
        c.id === chatId ? { ...c, messages: messages || [], title, updatedAt: new Date().toISOString() } : c
      );
      writeAriaChatsToStorage(state.ariaFolders, next, state.ariaCurrentChatId);
      return { ariaChats: next };
    }),
  removeAriaChat: (chatId) =>
    set((state) => {
      const next = (state.ariaChats || []).filter((c) => c.id !== chatId);
      const nextCurrent = state.ariaCurrentChatId === chatId ? (next[0]?.id ?? null) : state.ariaCurrentChatId;
      writeAriaChatsToStorage(state.ariaFolders, next, nextCurrent);
      return { ariaChats: next, ariaCurrentChatId: nextCurrent };
    }),
  setAriaCurrentChatId: (chatId) =>
    set((state) => {
      writeAriaChatsToStorage(state.ariaFolders, state.ariaChats, chatId);
      return { ariaCurrentChatId: chatId };
    }),
  moveAriaChatToFolder: (chatId, folderId) =>
    set((state) => {
      const next = (state.ariaChats || []).map((c) =>
        c.id === chatId ? { ...c, folderId } : c
      );
      writeAriaChatsToStorage(state.ariaFolders, next, state.ariaCurrentChatId);
      return { ariaChats: next };
    }),

  // ── Content approvals (threaded) ───────────────────────────
  approvals: [],
  openApprovalId: null,

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
