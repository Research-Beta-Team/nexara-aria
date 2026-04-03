/**
 * MemoryLayer — Central shared memory system for Antarious GTM AI OS.
 * Provides 6 namespaces with localStorage persistence, subscription,
 * TTL-based pruning, and agent-context building.
 *
 * Singleton — import the default export `memoryLayer`.
 */

const NAMESPACES = ['brand', 'audience', 'campaigns', 'performance', 'knowledge', 'decisions'];
const STORAGE_PREFIX = 'antarious_memory_';
const DEFAULT_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

/** Agent skill-domain mapping for context building */
const AGENT_DOMAINS = {
  strategist: ['brand', 'audience', 'campaigns'],
  content: ['brand', 'audience', 'knowledge'],
  ads: ['audience', 'campaigns', 'performance'],
  sdr: ['audience', 'campaigns', 'performance'],
  analyst: ['performance', 'campaigns', 'decisions'],
  enrichment: ['audience', 'knowledge', 'performance'],
  csm: ['brand', 'campaigns', 'performance'],
  default: ['brand', 'audience', 'campaigns', 'performance'],
};

class MemoryLayer {
  constructor() {
    this._subscribers = {}; // { namespace: [{ pattern, callback }] }
    NAMESPACES.forEach((ns) => {
      this._subscribers[ns] = [];
    });
    this._ensureDefaults();
  }

  // ─── Persistence helpers ───────────────────────────────────────────

  /** @private */
  _storageKey(namespace) {
    return `${STORAGE_PREFIX}${namespace}`;
  }

  /** @private Load namespace data from localStorage */
  _load(namespace) {
    try {
      const raw = localStorage.getItem(this._storageKey(namespace));
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  /** @private Save namespace data to localStorage */
  _save(namespace, data) {
    try {
      localStorage.setItem(this._storageKey(namespace), JSON.stringify(data));
    } catch {
      // localStorage full or unavailable — silently degrade
    }
  }

  // ─── Core API ──────────────────────────────────────────────────────

  /**
   * Read entries from a namespace, optionally filtering by query string.
   * @param {string} namespace
   * @param {string} [query] — case-insensitive substring match on key or value
   * @returns {Array<{key: string, value: *, source: string, agent: string, confidence: number, timestamp: number, ttl: number}>}
   */
  read(namespace, query) {
    if (!NAMESPACES.includes(namespace)) return [];
    const data = this._load(namespace);
    let entries = Object.entries(data).map(([key, entry]) => ({ key, ...entry }));

    if (query) {
      const q = query.toLowerCase();
      entries = entries.filter((e) => {
        const valStr = typeof e.value === 'string' ? e.value : JSON.stringify(e.value);
        return e.key.toLowerCase().includes(q) || valStr.toLowerCase().includes(q);
      });
    }

    // Sort by recency (newest first)
    entries.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    return entries;
  }

  /**
   * Write an entry to a namespace.
   * @param {string} namespace
   * @param {string} key
   * @param {*} value
   * @param {{source?: string, agent?: string, confidence?: number, ttl?: number}} [metadata]
   */
  write(namespace, key, value, metadata = {}) {
    if (!NAMESPACES.includes(namespace)) return;
    const data = this._load(namespace);
    const entry = {
      value,
      source: metadata.source || 'system',
      agent: metadata.agent || 'system',
      confidence: metadata.confidence ?? 1,
      timestamp: Date.now(),
      ttl: metadata.ttl ?? DEFAULT_TTL,
    };
    data[key] = entry;
    this._save(namespace, data);
    this._notify(namespace, key, entry);
  }

  /**
   * Search across one or more namespaces by keyword.
   * @param {string} query
   * @param {string[]|null} [namespaces] — defaults to all
   * @returns {Array<{namespace: string, key: string, value: *, score: number, timestamp: number}>}
   */
  search(query, namespaces = null) {
    const targets = namespaces || NAMESPACES;
    const q = query.toLowerCase();
    const results = [];

    targets.forEach((ns) => {
      if (!NAMESPACES.includes(ns)) return;
      const data = this._load(ns);
      Object.entries(data).forEach(([key, entry]) => {
        const valStr = typeof entry.value === 'string' ? entry.value : JSON.stringify(entry.value);
        const keyMatch = key.toLowerCase().includes(q);
        const valMatch = valStr.toLowerCase().includes(q);
        if (keyMatch || valMatch) {
          // Simple scoring: key match = 2, value match = 1, freshness bonus
          const freshness = Math.max(0, 1 - (Date.now() - (entry.timestamp || 0)) / (30 * 24 * 60 * 60 * 1000));
          const score = (keyMatch ? 2 : 0) + (valMatch ? 1 : 0) + freshness;
          results.push({
            namespace: ns,
            key,
            value: entry.value,
            source: entry.source,
            agent: entry.agent,
            confidence: entry.confidence,
            score,
            timestamp: entry.timestamp,
          });
        }
      });
    });

    results.sort((a, b) => b.score - a.score);
    return results;
  }

  /**
   * Subscribe to writes in a namespace matching a pattern.
   * @param {string} namespace
   * @param {string|RegExp} pattern — string is treated as substring match on key
   * @param {function} callback — called with (key, entry)
   * @returns {function} unsubscribe
   */
  subscribe(namespace, pattern, callback) {
    if (!NAMESPACES.includes(namespace)) return () => {};
    const sub = { pattern, callback };
    this._subscribers[namespace].push(sub);
    return () => {
      this._subscribers[namespace] = this._subscribers[namespace].filter((s) => s !== sub);
    };
  }

  /**
   * Build a context object tailored to a specific agent's skill domains.
   * @param {string} agentId — e.g. 'strategist', 'content', 'ads'
   * @returns {Object} — { [namespace]: entries[] }
   */
  getContext(agentId) {
    const domains = AGENT_DOMAINS[agentId] || AGENT_DOMAINS.default;
    const context = {};
    domains.forEach((ns) => {
      context[ns] = this.read(ns);
    });
    return context;
  }

  /**
   * Returns health metrics for each namespace.
   * @returns {Object} — { [namespace]: { entryCount, freshEntries, staleEntries, completeness } }
   */
  getHealth() {
    const now = Date.now();
    const health = {};
    NAMESPACES.forEach((ns) => {
      const data = this._load(ns);
      const entries = Object.values(data);
      const total = entries.length;
      const fresh = entries.filter((e) => now - (e.timestamp || 0) < (e.ttl || DEFAULT_TTL)).length;
      const stale = total - fresh;
      // Completeness heuristic: at least 3 entries per namespace is "complete"
      const completeness = Math.min(1, total / 3);
      health[ns] = { entryCount: total, freshEntries: fresh, staleEntries: stale, completeness };
    });
    return health;
  }

  /**
   * Remove entries that have exceeded their TTL.
   * @returns {number} — count of pruned entries
   */
  prune() {
    const now = Date.now();
    let pruned = 0;
    NAMESPACES.forEach((ns) => {
      const data = this._load(ns);
      const cleaned = {};
      Object.entries(data).forEach(([key, entry]) => {
        if (now - (entry.timestamp || 0) < (entry.ttl || DEFAULT_TTL)) {
          cleaned[key] = entry;
        } else {
          pruned++;
        }
      });
      this._save(ns, cleaned);
    });
    return pruned;
  }

  /**
   * Get all entries in a namespace.
   * @param {string} namespace
   * @returns {Object} — raw key→entry map
   */
  getNamespaceData(namespace) {
    if (!NAMESPACES.includes(namespace)) return {};
    return this._load(namespace);
  }

  /**
   * Clear all entries in a namespace.
   * @param {string} namespace
   */
  clear(namespace) {
    if (!NAMESPACES.includes(namespace)) return;
    this._save(namespace, {});
  }

  /**
   * Get the list of valid namespace names.
   * @returns {string[]}
   */
  getNamespaces() {
    return [...NAMESPACES];
  }

  // ─── Internal ──────────────────────────────────────────────────────

  /** @private Notify subscribers */
  _notify(namespace, key, entry) {
    this._subscribers[namespace].forEach(({ pattern, callback }) => {
      const matches =
        pattern instanceof RegExp
          ? pattern.test(key)
          : key.toLowerCase().includes(String(pattern).toLowerCase());
      if (matches) {
        try {
          callback(key, entry);
        } catch {
          // subscriber error — ignore
        }
      }
    });
  }

  /** @private Seed demo data if namespaces are empty */
  _ensureDefaults() {
    const now = Date.now();
    const meta = { source: 'demo', agent: 'system', confidence: 1, ttl: 90 * 24 * 60 * 60 * 1000 };

    // Brand namespace
    if (Object.keys(this._load('brand')).length === 0) {
      const brandData = {
        company_name: { value: 'Medglobal', ...meta, timestamp: now },
        voice: { value: 'Professional, empathetic, evidence-based', ...meta, timestamp: now - 1000 },
        mission: { value: 'Delivering emergency healthcare to vulnerable communities', ...meta, timestamp: now - 2000 },
        values: { value: ['humanitarian', 'evidence-based', 'inclusive'], ...meta, timestamp: now - 3000 },
        positioning: { value: 'International humanitarian health NGO', ...meta, timestamp: now - 4000 },
        tagline: { value: 'Healthcare without borders, compassion without limits', ...meta, timestamp: now - 5000 },
        founded: { value: '2017', ...meta, timestamp: now - 6000 },
        regions: { value: ['North America', 'Latin America', 'Africa', 'MENA', 'Europe', 'Southeast Asia'], ...meta, timestamp: now - 7000 },
      };
      this._save('brand', brandData);
    }

    // Audience namespace
    if (Object.keys(this._load('audience')).length === 0) {
      const audienceData = {
        primary_icp: { value: 'Healthcare donors and institutional funders', ...meta, timestamp: now },
        segments: {
          value: ['individual_donors', 'corporate_partners', 'government_agencies', 'foundations'],
          ...meta,
          timestamp: now - 1000,
        },
        pain_points: {
          value: ['donation transparency', 'impact measurement', 'program reach'],
          ...meta,
          timestamp: now - 2000,
        },
        decision_makers: {
          value: ['CSR Directors', 'Foundation Program Officers', 'Government Health Officials'],
          ...meta,
          timestamp: now - 3000,
        },
        avg_deal_cycle: { value: '45 days', ...meta, timestamp: now - 4000 },
      };
      this._save('audience', audienceData);
    }

    // Campaigns namespace
    if (Object.keys(this._load('campaigns')).length === 0) {
      const campaignData = {
        active_campaigns: {
          value: [
            { id: 'camp-001', name: 'CFO Vietnam Q1', status: 'active', channels: ['email', 'linkedin'] },
            { id: 'camp-002', name: 'Year-End Donor Drive', status: 'active', channels: ['email', 'social'] },
            { id: 'camp-003', name: 'Corporate Partnerships Outreach', status: 'planning', channels: ['linkedin', 'email'] },
          ],
          ...meta,
          timestamp: now,
        },
        total_campaigns_ytd: { value: 12, ...meta, timestamp: now - 1000 },
        best_performing: { value: 'camp-001', ...meta, timestamp: now - 2000 },
        campaign_templates: {
          value: ['donor-acquisition', 'awareness', 'event-promotion', 'annual-report'],
          ...meta,
          timestamp: now - 3000,
        },
      };
      this._save('campaigns', campaignData);
    }

    // Performance namespace
    if (Object.keys(this._load('performance')).length === 0) {
      const perfData = {
        pipeline_value: { value: '$2.4M', ...meta, timestamp: now },
        conversion_rate: { value: '4.2%', ...meta, timestamp: now - 1000 },
        avg_deal_size: { value: '$45K', ...meta, timestamp: now - 2000 },
        mql_count: { value: 127, ...meta, timestamp: now - 3000 },
        email_open_rate: { value: '28.5%', ...meta, timestamp: now - 4000 },
        linkedin_engagement: { value: '3.8%', ...meta, timestamp: now - 5000 },
        cost_per_mql: { value: '$32', ...meta, timestamp: now - 6000 },
        monthly_website_visits: { value: 14200, ...meta, timestamp: now - 7000 },
      };
      this._save('performance', perfData);
    }

    // Knowledge and decisions are seeded by KnowledgeBase and DecisionLog respectively
  }
}

/** Singleton instance */
const memoryLayer = new MemoryLayer();
export default memoryLayer;
export { MemoryLayer, NAMESPACES };
