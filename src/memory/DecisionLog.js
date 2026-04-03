/**
 * DecisionLog — Agent decision audit trail for Antarious.
 * Records every significant agent decision with reasoning, context, and outcome.
 * Capped at 500 entries (FIFO eviction).
 *
 * Persists to localStorage under `antarious_decisions`.
 *
 * Singleton — import the default export `decisionLog`.
 */

const STORAGE_KEY = 'antarious_decisions';
const MAX_ENTRIES = 500;

class DecisionLog {
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
  _save(entries) {
    try {
      // FIFO: keep only the last MAX_ENTRIES
      const trimmed = entries.length > MAX_ENTRIES ? entries.slice(-MAX_ENTRIES) : entries;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch {
      // silently degrade
    }
  }

  // ─── Core API ──────────────────────────────────────────────────────

  /**
   * Log an agent decision.
   * @param {string} agentId — e.g. 'content_agent', 'ads_agent', 'strategist'
   * @param {string} decision — what was decided
   * @param {string} reasoning — why this decision was made
   * @param {Object} [context] — relevant context at time of decision
   * @param {string} [outcome] — 'success' | 'partial' | 'failed' | 'pending'
   * @returns {{id: string, timestamp: number}}
   */
  log(agentId, decision, reasoning, context = {}, outcome = 'pending') {
    const entries = this._load();
    const id = `dec-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const entry = {
      id,
      agentId,
      decision,
      reasoning,
      context,
      outcome,
      confidence: context.confidence ?? 0.8,
      timestamp: Date.now(),
    };
    entries.push(entry);
    this._save(entries);
    return { id, timestamp: entry.timestamp };
  }

  /**
   * Get filtered log entries.
   * @param {{agentId?: string, type?: string, dateRange?: {start: number, end: number}, outcome?: string}} [filters]
   * @returns {Array}
   */
  getLog(filters = {}) {
    let entries = this._load();

    if (filters.agentId) {
      entries = entries.filter((e) => e.agentId === filters.agentId);
    }
    if (filters.type) {
      entries = entries.filter((e) => (e.decision || '').toLowerCase().includes(filters.type.toLowerCase()));
    }
    if (filters.outcome) {
      entries = entries.filter((e) => e.outcome === filters.outcome);
    }
    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      entries = entries.filter((e) => e.timestamp >= start && e.timestamp <= end);
    }

    return entries.sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Get the last N decisions for a specific agent.
   * @param {string} agentId
   * @param {number} [limit=20]
   * @returns {Array}
   */
  getAgentHistory(agentId, limit = 20) {
    return this._load()
      .filter((e) => e.agentId === agentId)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  /**
   * Get the most recent decisions across all agents.
   * @param {number} [limit=10]
   * @returns {Array}
   */
  getRecentDecisions(limit = 10) {
    return this._load()
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  /**
   * Get aggregate decision statistics.
   * @returns {{totalDecisions: number, byAgent: Object, byOutcome: Object, avgConfidence: number}}
   */
  getDecisionStats() {
    const entries = this._load();
    const byAgent = {};
    const byOutcome = {};
    let totalConfidence = 0;

    entries.forEach((e) => {
      byAgent[e.agentId] = (byAgent[e.agentId] || 0) + 1;
      byOutcome[e.outcome] = (byOutcome[e.outcome] || 0) + 1;
      totalConfidence += e.confidence || 0;
    });

    return {
      totalDecisions: entries.length,
      byAgent,
      byOutcome,
      avgConfidence: entries.length > 0 ? Math.round((totalConfidence / entries.length) * 100) / 100 : 0,
    };
  }

  /**
   * Update the outcome of a previously logged decision.
   * @param {string} decisionId
   * @param {string} outcome — 'success' | 'partial' | 'failed'
   * @returns {boolean}
   */
  updateOutcome(decisionId, outcome) {
    const entries = this._load();
    const entry = entries.find((e) => e.id === decisionId);
    if (!entry) return false;
    entry.outcome = outcome;
    this._save(entries);
    return true;
  }

  // ─── Internal ──────────────────────────────────────────────────────

  /** @private Seed demo decisions if empty */
  _ensureDefaults() {
    if (this._load().length > 0) return;

    const now = Date.now();
    const hour = 60 * 60 * 1000;
    const day = 24 * hour;

    const demoDecisions = [
      {
        id: 'dec-demo-001',
        agentId: 'strategist',
        decision: 'Prioritize LinkedIn channel over Facebook for Q1 corporate donor outreach',
        reasoning: 'LinkedIn audience overlap with ICP is 3.2x higher than Facebook. Corporate CSR directors are 78% more active on LinkedIn. Historical campaign data shows 2.1x higher conversion rate.',
        context: { campaign: 'camp-001', icp: 'corporate_donors' },
        outcome: 'success',
        confidence: 0.91,
        timestamp: now - 5 * day,
      },
      {
        id: 'dec-demo-002',
        agentId: 'content_agent',
        decision: 'Generate email sequence with patient story narrative instead of statistics-first approach',
        reasoning: 'Pattern store shows patient stories outperform data-only content 3:1. Brand guidelines emphasize empathetic storytelling. Last 3 email campaigns with story leads had 34% higher click-through.',
        context: { campaign: 'camp-001', contentType: 'email_sequence' },
        outcome: 'success',
        confidence: 0.88,
        timestamp: now - 4 * day,
      },
      {
        id: 'dec-demo-003',
        agentId: 'ads_agent',
        decision: 'Shift 30% of Meta budget to LinkedIn Sponsored Content',
        reasoning: 'Meta CPM increased 22% this month while LinkedIn CPM stable. LinkedIn engagement rate 3.8% vs Meta 1.2% for healthcare audience. ROI projection favors LinkedIn by 1.8x.',
        context: { campaign: 'camp-001', budgetShift: { from: 'meta', to: 'linkedin', amount: '30%' } },
        outcome: 'success',
        confidence: 0.82,
        timestamp: now - 3 * day,
      },
      {
        id: 'dec-demo-004',
        agentId: 'sdr_agent',
        decision: 'Fast-track 12 webinar registrants to MQL status',
        reasoning: 'Webinar leads convert 2.5x faster. These 12 registrants match ICP scoring threshold (>75). Average time-to-MQL for webinar leads is 18 days vs 45 for cold.',
        context: { leadCount: 12, source: 'webinar', avgScore: 82 },
        outcome: 'success',
        confidence: 0.90,
        timestamp: now - 2 * day,
      },
      {
        id: 'dec-demo-005',
        agentId: 'analyst',
        decision: 'Flag anomaly: email open rate dropped 15% week-over-week',
        reasoning: 'Open rate fell from 28.5% to 24.2%. Exceeds 2-sigma threshold. Possible causes: subject line fatigue, deliverability issue, or list quality degradation. Recommended investigation.',
        context: { metric: 'email_open_rate', previous: '28.5%', current: '24.2%', threshold: '2-sigma' },
        outcome: 'pending',
        confidence: 0.85,
        timestamp: now - 1 * day,
      },
      {
        id: 'dec-demo-006',
        agentId: 'content_agent',
        decision: 'Approve auto-generated donor impact report for review queue',
        reasoning: 'Report meets all brand guidelines. Data accuracy verified against source. Readability score 72 (target: 65+). Contains 4 field photos (all cleared for use).',
        context: { contentId: 'CAMP-001-RPT-003', readabilityScore: 72 },
        outcome: 'success',
        confidence: 0.87,
        timestamp: now - 18 * hour,
      },
      {
        id: 'dec-demo-007',
        agentId: 'enrichment_agent',
        decision: 'Merge 3 duplicate lead records for Johnson Foundation',
        reasoning: 'Detected 3 records with >92% field overlap. Primary record has most complete data. Merge preserves all unique touchpoints and activity history.',
        context: { duplicateCount: 3, matchScore: 0.92, primaryRecord: 'lead-445' },
        outcome: 'success',
        confidence: 0.94,
        timestamp: now - 12 * hour,
      },
      {
        id: 'dec-demo-008',
        agentId: 'strategist',
        decision: 'Recommend extending campaign duration by 2 weeks',
        reasoning: 'Pipeline velocity slower than projected. Current trajectory misses $200K target by $45K. Two additional weeks of nurturing projected to close gap based on historical conversion timing.',
        context: { campaign: 'camp-001', gapToTarget: '$45K', recommendedExtension: '2 weeks' },
        outcome: 'pending',
        confidence: 0.76,
        timestamp: now - 6 * hour,
      },
    ];

    this._save(demoDecisions);
  }
}

/** Singleton instance */
const decisionLog = new DecisionLog();
export default decisionLog;
export { DecisionLog };
