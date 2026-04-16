/**
 * MessageBus.js
 * Singleton inter-agent communication bus.
 * Agents send typed, prioritised messages; subscribers are notified instantly.
 */

let _msgCounter = 0;

/** Message type constants */
export const MESSAGE_TYPES = {
  TASK_REQUEST: 'TASK_REQUEST',
  TASK_RESULT: 'TASK_RESULT',
  DATA_UPDATE: 'DATA_UPDATE',
  TRIGGER: 'TRIGGER',
  APPROVAL_REQUEST: 'APPROVAL_REQUEST',
  APPROVAL_RESPONSE: 'APPROVAL_RESPONSE',
  ESCALATION: 'ESCALATION',
  INSIGHT: 'INSIGHT',
};

/** Priority ordering — higher number = higher priority */
const PRIORITY_MAP = {
  [MESSAGE_TYPES.ESCALATION]: 5,
  [MESSAGE_TYPES.APPROVAL_REQUEST]: 4,
  [MESSAGE_TYPES.APPROVAL_RESPONSE]: 4,
  [MESSAGE_TYPES.TRIGGER]: 3,
  [MESSAGE_TYPES.TASK_REQUEST]: 2,
  [MESSAGE_TYPES.TASK_RESULT]: 2,
  [MESSAGE_TYPES.DATA_UPDATE]: 1,
  [MESSAGE_TYPES.INSIGHT]: 0,
};

class _MessageBus {
  constructor() {
    /** @type {Array<Object>} ring-buffer of last 200 messages */
    this._history = [];
    /** @type {number} max messages retained */
    this._maxHistory = 200;
    /** @type {Map<string, Set<Function>>} agentId -> Set of callbacks */
    this._subscribers = new Map();
    /** @type {Set<Function>} UI-level subscribers (agent feed, etc.) */
    this._uiSubscribers = new Set();
  }

  // ── Public API ────────────────────────────────────────────────

  /**
   * Send a message from one agent to another (or broadcast).
   * @param {{ from: string, to: string|'*', type: string, payload: any, priority?: number }} msg
   * @returns {Object} the stored message with id/timestamp
   */
  send({ from, to, type, payload, priority }) {
    const message = {
      id: `msg_${++_msgCounter}`,
      from,
      to,
      type,
      payload,
      priority: priority ?? PRIORITY_MAP[type] ?? 1,
      timestamp: Date.now(),
    };

    this._push(message);

    // Deliver to subscribers
    if (to === '*') {
      this._subscribers.forEach((cbs) => cbs.forEach((cb) => cb(message)));
    } else {
      const subs = this._subscribers.get(to);
      if (subs) subs.forEach((cb) => cb(message));
    }

    // Notify UI subscribers
    this._uiSubscribers.forEach((cb) => cb(message));

    return message;
  }

  /**
   * Subscribe an agent (or any listener) to messages addressed to `agentId`.
   * @returns {Function} unsubscribe
   */
  subscribe(agentId, callback) {
    if (!this._subscribers.has(agentId)) {
      this._subscribers.set(agentId, new Set());
    }
    this._subscribers.get(agentId).add(callback);
    return () => this._subscribers.get(agentId)?.delete(callback);
  }

  /**
   * Broadcast a message to every agent.
   */
  broadcast(from, type, payload) {
    return this.send({ from, to: '*', type, payload });
  }

  /**
   * Subscribe to all messages for UI display (agent feed, notification center).
   * @returns {Function} unsubscribe
   */
  onMessage(callback) {
    this._uiSubscribers.add(callback);
    return () => this._uiSubscribers.delete(callback);
  }

  /**
   * Get recent message history, newest first.
   * @param {number} limit
   */
  getHistory(limit = 50) {
    return this._history.slice(-limit).reverse();
  }

  /**
   * Get all messages addressed to a specific agent (most recent first).
   */
  getMessagesFor(agentId) {
    return this._history
      .filter((m) => m.to === agentId || m.to === '*')
      .reverse();
  }

  /**
   * Get all messages sent by a specific agent (most recent first).
   */
  getMessagesFrom(agentId) {
    return this._history.filter((m) => m.from === agentId).reverse();
  }

  /**
   * Clear history (useful for tests / reset).
   */
  clear() {
    this._history = [];
    _msgCounter = 0;
  }

  // ── Internal ──────────────────────────────────────────────────

  _push(message) {
    this._history.push(message);
    if (this._history.length > this._maxHistory) {
      this._history = this._history.slice(-this._maxHistory);
    }
  }
}

/** Singleton instance */
export const MessageBus = new _MessageBus();
