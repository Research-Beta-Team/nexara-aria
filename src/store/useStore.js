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
  isDarkMode: true,

  // ── Notifications ────────────────────────────
  notifications: [],

  // ── Toasts ──────────────────────────────────
  // Each toast: { id, message, type: 'success'|'error'|'warning'|'info', duration? }
  toasts: [],

  // ── Actions: Identity ────────────────────────
  setRole: (role) => set({ currentRole: role }),

  setClient: (client) => set({ currentClient: client }),

  setCampaign: (campaign) => set({ currentCampaign: campaign }),

  // ── Actions: UI ──────────────────────────────
  // ── Actions: Auth ────────────────────────────
  login:  () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false, onboardingComplete: false }),

  completeOnboarding: () => set({ onboardingComplete: true }),

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

  // ── Derived (getters) ────────────────────────
  get unreadCount() {
    return get().notifications.filter((n) => !n.read).length;
  },
}));

export default useStore;
