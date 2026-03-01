/**
 * ARIA Memory — short-term, session, and long-term context.
 * Feeds into system prompt and persists across sessions where needed.
 */

const MAX_HISTORY = 30;
const SESSION_KEY = 'aria_session';
const LONGTERM_KEY = 'aria_longterm';

export class ARIAMemory {
  constructor() {
    /** @type {{ role: string; content: unknown[] }[]} */
    this.conversationHistory = [];
  }

  // ── Short-term (in-memory) ─────────────────────

  /**
   * @param {string} role
   * @param {unknown[]} content
   */
  add(role, content) {
    this.conversationHistory.push({ role, content });
    if (this.conversationHistory.length > MAX_HISTORY) {
      this.conversationHistory = this.conversationHistory.slice(-MAX_HISTORY);
    }
  }

  getHistory() {
    return [...this.conversationHistory];
  }

  clear() {
    this.conversationHistory = [];
  }

  // ── Session (localStorage) ──────────────────────

  /**
   * @param {Record<string, unknown>} data
   */
  setSession(data) {
    const session = {
      ...this.getSession(),
      ...data,
      lastActiveAt: Date.now(),
    };
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (_) {}
  }

  getSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (_) {
      return {};
    }
  }

  // ── Long-term (localStorage) ────────────────────

  /**
   * @param {string} key
   * @param {unknown} value
   */
  savePreference(key, value) {
    const lt = this._getLongTerm();
    lt.userPreferences = lt.userPreferences || {};
    lt.userPreferences[key] = value;
    this._setLongTerm(lt);
  }

  /**
   * @param {string} key
   */
  getPreference(key) {
    const lt = this._getLongTerm();
    return lt.userPreferences?.[key];
  }

  /**
   * @param {string} decision
   * @param {string} reasoning
   */
  addDecision(decision, reasoning) {
    const lt = this._getLongTerm();
    lt.userPreferences = lt.userPreferences || {};
    lt.userPreferences.decisionHistory = lt.userPreferences.decisionHistory || [];
    lt.userPreferences.decisionHistory.push({
      decision,
      reasoning,
      timestamp: new Date().toISOString(),
    });
    const hist = lt.userPreferences.decisionHistory;
    if (hist.length > 50) lt.userPreferences.decisionHistory = hist.slice(-50);
    this._setLongTerm(lt);
  }

  /**
   * @param {string} clientId
   */
  getClientProfile(clientId) {
    const lt = this._getLongTerm();
    return lt.clientProfiles?.[clientId] || null;
  }

  /**
   * @param {string} clientId
   * @param {Record<string, unknown>} newInfo
   */
  updateClientProfile(clientId, newInfo) {
    const lt = this._getLongTerm();
    lt.clientProfiles = lt.clientProfiles || {};
    lt.clientProfiles[clientId] = { ...(lt.clientProfiles[clientId] || {}), ...newInfo };
    this._setLongTerm(lt);
  }

  /**
   * @param {{ role: string; content: unknown[] }[]} conversationHistory
   */
  extractAndSavePatterns(conversationHistory) {
    const lt = this._getLongTerm();
    lt.learnedPatterns = lt.learnedPatterns || [];
    // Placeholder: in production would run a light analysis
    const recent = conversationHistory.slice(-10);
    const hasPause = recent.some((m) => {
      const str = JSON.stringify(m.content);
      return /pause|stop|hold|wait/.test(str) && /campaign|budget/.test(str);
    });
    if (hasPause && !lt.learnedPatterns.includes('prefers_pause_before_budget_change')) {
      lt.learnedPatterns.push('prefers_pause_before_budget_change');
      this._setLongTerm(lt);
    }
  }

  _getLongTerm() {
    try {
      const raw = localStorage.getItem(LONGTERM_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (_) {
      return {};
    }
  }

  /**
   * @param {Record<string, unknown>} data
   */
  _setLongTerm(data) {
    try {
      localStorage.setItem(LONGTERM_KEY, JSON.stringify(data));
    } catch (_) {}
  }

  // ── Context for system prompt ──────────────────

  buildContextForSystemPrompt() {
    const session = this.getSession();
    const lt = this._getLongTerm();
    const prefs = lt.userPreferences || {};
    const decisions = (prefs.decisionHistory || []).slice(-5);
    return {
      userName: session.userName || 'User',
      role: session.currentRole || 'owner',
      plan: session.currentPlanId || 'growth',
      campaignId: session.currentCampaignId ?? null,
      campaignName: session.currentCampaignName ?? null,
      clientId: session.currentClientId ?? null,
      creditsRemaining: session.creditsRemaining ?? 25000,
      pendingEscalations: session.pendingEscalations ?? 0,
      recentDecisions: decisions,
      preferences: {
        preferredTone: prefs.preferredTone || 'concise',
        preferredChannels: prefs.preferredChannels || [],
        autoApproveThreshold: prefs.autoApproveThreshold ?? 0,
      },
      learnedPatterns: lt.learnedPatterns || [],
      pendingActions: session.pendingActions || [],
    };
  }
}

export const ariaMemory = new ARIAMemory();
