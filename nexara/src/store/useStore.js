import { create } from 'zustand';

// Valid roles: owner | advisor | csm | mediaBuyer | contentStrategist | sdr | analyst | client

const useStore = create((set, get) => ({
  // ── Identity / Context ──────────────────────
  currentRole: 'owner',
  currentClient: 'Acme Corp',
  currentCampaign: 'CFO Vietnam Q1',

  // ── Auth ────────────────────────────────────
  isAuthenticated: false,

  // ── UI State ────────────────────────────────
  ariaOpen: false,
  sidebarCollapsed: false,
  onboardingComplete: false,
  onboardingSkipped: false,
  onboardingCompanyType: '',
  onboardingSelectedPlanId: '',
  onboardingConnections: { website: '', crm: '', ads: false },
  isDarkMode: true,

  // ── Connections (used by onboarding + Settings) ──
  connections: {
    website: null,
    crm: null,
    meta: false,
    linkedin: false,
    google: false,
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

  // ── Actions: Identity ────────────────────────
  setRole: (role) => set({ currentRole: role }),

  setClient: (client) => set({ currentClient: client }),

  setCampaign: (campaign) => set({ currentCampaign: campaign }),

  // ── Actions: UI ──────────────────────────────
  // ── Actions: Auth ────────────────────────────
  login:  () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false, onboardingComplete: false }),

  completeOnboarding: () => set({ onboardingComplete: true }),

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

  toggleTheme: () => set((s) => ({ isDarkMode: !s.isDarkMode })),

  toggleAria: () => set((state) => ({ ariaOpen: !state.ariaOpen })),

  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

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
