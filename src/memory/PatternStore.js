/**
 * PatternStore — Learned pattern storage for Antarious.
 * Agents record observations; patterns accumulate evidence over time.
 * Patterns with high evidence counts surface as reliable insights.
 *
 * Persists to localStorage under `antarious_patterns`.
 *
 * Singleton — import the default export `patternStore`.
 */

const STORAGE_KEY = 'antarious_patterns';

class PatternStore {
  constructor() {
    this._ensureDefaults();
  }

  // ─── Persistence helpers ───────────────────────────────────────────

  /** @private */
  _load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  /** @private */
  _save(patterns) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(patterns));
    } catch {
      // silently degrade
    }
  }

  // ─── Core API ──────────────────────────────────────────────────────

  /**
   * Learn from an observation. Creates a new pattern or reinforces an existing one.
   * @param {{domain: string, observation: string, evidence?: string, sourceAgent?: string}} observation
   * @returns {{patternId: string, isNew: boolean, evidenceCount: number}}
   */
  learn(observation) {
    const patterns = this._load();
    const { domain, observation: obs, evidence, sourceAgent } = observation;

    // Check for existing similar pattern in the same domain
    const existing = patterns.find(
      (p) => p.domain === domain && this._similarity(p.observation, obs) > 0.6
    );

    if (existing) {
      existing.evidenceCount += 1;
      existing.lastSeen = Date.now();
      existing.evidenceSources.push({
        text: evidence || obs,
        agent: sourceAgent || 'unknown',
        timestamp: Date.now(),
      });
      // Keep only last 10 evidence sources
      if (existing.evidenceSources.length > 10) {
        existing.evidenceSources = existing.evidenceSources.slice(-10);
      }
      this._save(patterns);
      return { patternId: existing.id, isNew: false, evidenceCount: existing.evidenceCount };
    }

    // Create new pattern
    const id = `pat-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newPattern = {
      id,
      domain,
      observation: obs,
      evidenceCount: 1,
      confidence: 0.5,
      firstSeen: Date.now(),
      lastSeen: Date.now(),
      sourceAgent: sourceAgent || 'unknown',
      evidenceSources: [
        {
          text: evidence || obs,
          agent: sourceAgent || 'unknown',
          timestamp: Date.now(),
        },
      ],
    };
    patterns.push(newPattern);
    this._save(patterns);
    return { patternId: id, isNew: true, evidenceCount: 1 };
  }

  /**
   * Get all patterns for a given domain.
   * @param {string} domain — e.g. 'email', 'ads', 'content', 'leads', 'social'
   * @returns {Array} patterns sorted by evidence count descending
   */
  getPatterns(domain) {
    return this._load()
      .filter((p) => p.domain === domain)
      .sort((a, b) => b.evidenceCount - a.evidenceCount);
  }

  /**
   * Get all patterns across all domains.
   * @returns {Array} patterns sorted by evidence count descending
   */
  getAllPatterns() {
    return this._load().sort((a, b) => b.evidenceCount - a.evidenceCount);
  }

  /**
   * Validate a pattern — increment its evidence count (confirmed by new data).
   * @param {string} patternId
   * @returns {boolean} success
   */
  validatePattern(patternId) {
    const patterns = this._load();
    const pattern = patterns.find((p) => p.id === patternId);
    if (!pattern) return false;
    pattern.evidenceCount += 1;
    pattern.lastSeen = Date.now();
    pattern.confidence = Math.min(1, pattern.confidence + 0.05);
    this._save(patterns);
    return true;
  }

  /**
   * Invalidate a pattern — decrement its evidence count (disproven by new data).
   * @param {string} patternId
   * @returns {boolean} success
   */
  invalidatePattern(patternId) {
    const patterns = this._load();
    const pattern = patterns.find((p) => p.id === patternId);
    if (!pattern) return false;
    pattern.evidenceCount = Math.max(0, pattern.evidenceCount - 1);
    pattern.confidence = Math.max(0, pattern.confidence - 0.1);
    pattern.lastSeen = Date.now();
    this._save(patterns);
    return true;
  }

  /**
   * Get a single pattern by ID.
   * @param {string} patternId
   * @returns {Object|null}
   */
  getPattern(patternId) {
    return this._load().find((p) => p.id === patternId) || null;
  }

  /**
   * Get unique domain names from all stored patterns.
   * @returns {string[]}
   */
  getDomains() {
    const patterns = this._load();
    return [...new Set(patterns.map((p) => p.domain))];
  }

  // ─── Internal ──────────────────────────────────────────────────────

  /** @private Simple word-overlap similarity (0–1) */
  _similarity(a, b) {
    const wordsA = new Set(a.toLowerCase().split(/\s+/));
    const wordsB = new Set(b.toLowerCase().split(/\s+/));
    const intersection = [...wordsA].filter((w) => wordsB.has(w));
    const union = new Set([...wordsA, ...wordsB]);
    return union.size > 0 ? intersection.length / union.size : 0;
  }

  /** @private Seed demo patterns if empty */
  _ensureDefaults() {
    if (this._load().length > 0) return;

    const now = Date.now();
    const demoPatterns = [
      {
        id: 'pat-demo-001',
        domain: 'email',
        observation: 'Subject lines with numbers get 40% higher open rates for Medglobal donor emails',
        evidenceCount: 14,
        confidence: 0.92,
        firstSeen: now - 30 * 24 * 60 * 60 * 1000,
        lastSeen: now - 2 * 24 * 60 * 60 * 1000,
        sourceAgent: 'content_agent',
        evidenceSources: [
          { text: 'A/B test batch 12: numeric subjects 41% open rate vs 29%', agent: 'analyst', timestamp: now - 5 * 24 * 60 * 60 * 1000 },
          { text: 'Q4 campaign retrospective confirmed numeric lift', agent: 'strategist', timestamp: now - 15 * 24 * 60 * 60 * 1000 },
        ],
      },
      {
        id: 'pat-demo-002',
        domain: 'content',
        observation: 'Case studies with patient stories outperform data-only content 3:1',
        evidenceCount: 9,
        confidence: 0.88,
        firstSeen: now - 45 * 24 * 60 * 60 * 1000,
        lastSeen: now - 3 * 24 * 60 * 60 * 1000,
        sourceAgent: 'content_agent',
        evidenceSources: [
          { text: 'Blog post engagement: story-led 340 shares vs data-led 112', agent: 'analyst', timestamp: now - 10 * 24 * 60 * 60 * 1000 },
          { text: 'Donor survey: 73% prefer narrative format', agent: 'research_agent', timestamp: now - 20 * 24 * 60 * 60 * 1000 },
        ],
      },
      {
        id: 'pat-demo-003',
        domain: 'ads',
        observation: 'LinkedIn ads targeting healthcare professionals convert best on Tuesday mornings',
        evidenceCount: 7,
        confidence: 0.78,
        firstSeen: now - 60 * 24 * 60 * 60 * 1000,
        lastSeen: now - 7 * 24 * 60 * 60 * 1000,
        sourceAgent: 'ads_agent',
        evidenceSources: [
          { text: 'Tues 9-11AM CTR 2.8% vs weekly avg 1.4%', agent: 'ads_agent', timestamp: now - 14 * 24 * 60 * 60 * 1000 },
        ],
      },
      {
        id: 'pat-demo-004',
        domain: 'leads',
        observation: 'Leads from webinar registrations convert 2.5x faster than cold outreach',
        evidenceCount: 11,
        confidence: 0.91,
        firstSeen: now - 50 * 24 * 60 * 60 * 1000,
        lastSeen: now - 1 * 24 * 60 * 60 * 1000,
        sourceAgent: 'sdr_agent',
        evidenceSources: [
          { text: 'Webinar leads avg 18 days to close vs cold 45 days', agent: 'analyst', timestamp: now - 5 * 24 * 60 * 60 * 1000 },
          { text: 'March pipeline review: webinar attribution 34% of SQLs', agent: 'strategist', timestamp: now - 12 * 24 * 60 * 60 * 1000 },
        ],
      },
      {
        id: 'pat-demo-005',
        domain: 'social',
        observation: 'Posts with field photos get 4x engagement vs stock imagery',
        evidenceCount: 16,
        confidence: 0.95,
        firstSeen: now - 70 * 24 * 60 * 60 * 1000,
        lastSeen: now - 1 * 24 * 60 * 60 * 1000,
        sourceAgent: 'social_agent',
        evidenceSources: [
          { text: 'Instagram field photos avg 1,240 likes vs stock 310', agent: 'social_agent', timestamp: now - 3 * 24 * 60 * 60 * 1000 },
          { text: 'LinkedIn: real imagery 4.2% engagement vs 1.1% stock', agent: 'analyst', timestamp: now - 8 * 24 * 60 * 60 * 1000 },
        ],
      },
    ];

    this._save(demoPatterns);
  }
}

/** Singleton instance */
const patternStore = new PatternStore();
export default patternStore;
export { PatternStore };
