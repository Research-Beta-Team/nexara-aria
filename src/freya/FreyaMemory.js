/**
 * FreyaMemory.js — Conversation and session memory for Freya.
 *
 * Short-term: in-memory conversation history (unchanged)
 * Session/Long-term: now backed by the shared MemoryLayer instead of standalone localStorage.
 * All agents share the same memory through MemoryLayer.
 */

import memoryLayer from '../memory/MemoryLayer';

const MAX_HISTORY = 30;
const SESSION_KEY = 'freya_session'; // session data still uses localStorage for transient state

export class FreyaMemory {
  constructor() {
    /** @type {{ role: string; content: unknown[] }[]} */
    this.conversationHistory = [];
  }

  // ── Short-term (in-memory conversation) ───────────────────────

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

  // ── Session (localStorage for transient UI state) ─────────────

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
    } catch (_) { /* ignore */ }
  }

  getSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (_) {
      return {};
    }
  }

  // ── Long-term (backed by MemoryLayer) ─────────────────────────

  /**
   * Save a user preference to shared memory.
   * @param {string} key
   * @param {unknown} value
   */
  savePreference(key, value) {
    memoryLayer.write('brand', `pref_${key}`, value, { source: 'freya', agent: 'freya' });
  }

  /**
   * Get a user preference from shared memory.
   * @param {string} key
   */
  getPreference(key) {
    const entries = memoryLayer.read('brand', `pref_${key}`);
    return entries.length > 0 ? entries[0].value : undefined;
  }

  /**
   * Record a decision to the shared decisions namespace.
   * @param {string} decision
   * @param {string} reasoning
   */
  addDecision(decision, reasoning) {
    const key = `decision_${Date.now()}`;
    memoryLayer.write('decisions', key, { decision, reasoning, timestamp: new Date().toISOString() }, {
      source: 'freya',
      agent: 'freya',
    });
  }

  /**
   * Get recent decisions from shared memory.
   * @param {number} [limit=5]
   * @returns {Array<{ decision: string, reasoning: string, timestamp: string }>}
   */
  getRecentDecisions(limit = 5) {
    const entries = memoryLayer.read('decisions');
    return entries
      .slice(0, limit)
      .map((e) => e.value)
      .filter((v) => v && typeof v === 'object' && 'decision' in v);
  }

  /**
   * Get client profile from shared brand memory.
   * @param {string} clientId
   */
  getClientProfile(clientId) {
    const entries = memoryLayer.read('brand', `client_${clientId}`);
    return entries.length > 0 ? entries[0].value : null;
  }

  /**
   * Update client profile in shared brand memory.
   * @param {string} clientId
   * @param {Record<string, unknown>} newInfo
   */
  updateClientProfile(clientId, newInfo) {
    const existing = this.getClientProfile(clientId) || {};
    memoryLayer.write('brand', `client_${clientId}`, { ...existing, ...newInfo }, {
      source: 'freya',
      agent: 'freya',
    });
  }

  /**
   * Extract and save patterns from conversation history to shared memory.
   * @param {{ role: string; content: unknown[] }[]} conversationHistory
   */
  extractAndSavePatterns(conversationHistory) {
    const recent = conversationHistory.slice(-10);
    const hasPause = recent.some((m) => {
      const str = JSON.stringify(m.content);
      return /pause|stop|hold|wait/.test(str) && /campaign|budget/.test(str);
    });
    if (hasPause) {
      const existing = memoryLayer.read('brand', 'learned_patterns');
      const patterns = existing.length > 0 && Array.isArray(existing[0].value) ? existing[0].value : [];
      if (!patterns.includes('prefers_pause_before_budget_change')) {
        patterns.push('prefers_pause_before_budget_change');
        memoryLayer.write('brand', 'learned_patterns', patterns, { source: 'freya', agent: 'freya' });
      }
    }
  }

  // ── Context for system prompt ─────────────────────────────────

  buildContextForSystemPrompt() {
    const session = this.getSession();
    const recentDecisions = this.getRecentDecisions(5);

    // Pull preferences from memory
    const preferredTone = this.getPreference('preferredTone') || 'concise';
    const preferredChannels = this.getPreference('preferredChannels') || [];

    // Pull learned patterns from memory
    const patternsEntries = memoryLayer.read('brand', 'learned_patterns');
    const learnedPatterns = patternsEntries.length > 0 && Array.isArray(patternsEntries[0].value)
      ? patternsEntries[0].value
      : [];

    return {
      userName: session.userName || 'User',
      role: session.currentRole || 'owner',
      plan: session.currentPlanId || 'growth',
      campaignId: session.currentCampaignId ?? null,
      campaignName: session.currentCampaignName ?? null,
      clientId: session.currentClientId ?? null,
      creditsRemaining: session.creditsRemaining ?? 25000,
      pendingEscalations: session.pendingEscalations ?? 0,
      recentDecisions,
      preferences: {
        preferredTone: preferredTone,
        preferredChannels: preferredChannels,
        autoApproveThreshold: 0,
      },
      learnedPatterns,
      pendingActions: session.pendingActions || [],
    };
  }
}

export const freyaMemory = new FreyaMemory();
