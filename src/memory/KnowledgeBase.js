/**
 * KnowledgeBase — Document-backed knowledge store for Antarious.
 * Ingests documents, extracts facts, and provides keyword-based querying.
 *
 * Persists to localStorage via MemoryLayer's knowledge namespace and
 * its own dedicated keys for document metadata and facts.
 *
 * Singleton — import the default export `knowledgeBase`.
 */

import memoryLayer from './MemoryLayer';

const DOCS_KEY = 'antarious_kb_documents';
const FACTS_KEY = 'antarious_kb_facts';

class KnowledgeBase {
  constructor() {
    this._ensureDefaults();
  }

  // ─── Persistence helpers ───────────────────────────────────────────

  /** @private */
  _loadDocs() {
    try {
      const raw = localStorage.getItem(DOCS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  /** @private */
  _saveDocs(docs) {
    try {
      localStorage.setItem(DOCS_KEY, JSON.stringify(docs));
    } catch {
      // silently degrade
    }
  }

  /** @private */
  _loadFacts() {
    try {
      const raw = localStorage.getItem(FACTS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  /** @private */
  _saveFacts(facts) {
    try {
      localStorage.setItem(FACTS_KEY, JSON.stringify(facts));
    } catch {
      // silently degrade
    }
  }

  // ─── Core API ──────────────────────────────────────────────────────

  /**
   * Ingest a document: extract facts and store them.
   * @param {{name: string, type: string, content: string, source?: string}} document
   * @returns {{docId: string, factCount: number, entities: string[]}}
   */
  ingest(document) {
    const docId = `doc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const now = Date.now();

    // Store document metadata
    const docs = this._loadDocs();
    docs.push({
      docId,
      name: document.name,
      type: document.type || 'text',
      source: document.source || 'upload',
      ingestedAt: now,
      contentLength: (document.content || '').length,
    });
    this._saveDocs(docs);

    // Extract facts (simple sentence splitting for demo)
    const facts = this._extractFacts(document.content || '', docId);
    this.index(facts, docId);

    // Extract entities (simple proper-noun-ish extraction)
    const entities = this._extractEntities(document.content || '');

    // Write summary to memory layer knowledge namespace
    memoryLayer.write('knowledge', `doc_${docId}`, {
      docId,
      name: document.name,
      factCount: facts.length,
      entities,
    }, { source: 'knowledge_base', agent: 'system', confidence: 0.9 });

    return { docId, factCount: facts.length, entities };
  }

  /**
   * Store indexed facts with a document reference.
   * @param {Array<{text: string, confidence?: number}>} facts
   * @param {string} docId
   */
  index(facts, docId) {
    const existing = this._loadFacts();
    const now = Date.now();
    const newFacts = facts.map((f, i) => ({
      id: `fact-${docId}-${i}`,
      docId,
      text: f.text || f,
      confidence: f.confidence ?? 0.85,
      timestamp: now,
    }));
    this._saveFacts([...existing, ...newFacts]);
  }

  /**
   * Query facts by keyword. Returns top 5 matches with confidence and source doc.
   * @param {string} question
   * @returns {Array<{text: string, confidence: number, docId: string, docName: string, score: number}>}
   */
  query(question) {
    const facts = this._loadFacts();
    const docs = this._loadDocs();
    const docMap = {};
    docs.forEach((d) => { docMap[d.docId] = d.name; });

    const q = question.toLowerCase();
    const keywords = q.split(/\s+/).filter((w) => w.length > 2);

    const scored = facts.map((fact) => {
      const text = fact.text.toLowerCase();
      let score = 0;
      keywords.forEach((kw) => {
        if (text.includes(kw)) score += 1;
      });
      // Exact phrase bonus
      if (text.includes(q)) score += 2;
      // Freshness bonus
      const age = Date.now() - (fact.timestamp || 0);
      score += Math.max(0, 1 - age / (90 * 24 * 60 * 60 * 1000));
      return { ...fact, docName: docMap[fact.docId] || 'Unknown', score };
    });

    return scored
      .filter((f) => f.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }

  /**
   * List all ingested documents with metadata.
   * @returns {Array<{docId: string, name: string, type: string, source: string, ingestedAt: number, contentLength: number}>}
   */
  getDocuments() {
    return this._loadDocs();
  }

  /**
   * Remove a document and all its associated facts.
   * @param {string} docId
   */
  removeDocument(docId) {
    const docs = this._loadDocs().filter((d) => d.docId !== docId);
    this._saveDocs(docs);

    const facts = this._loadFacts().filter((f) => f.docId !== docId);
    this._saveFacts(facts);

    // Remove from memory layer too
    const nsData = memoryLayer.getNamespaceData('knowledge');
    if (nsData[`doc_${docId}`]) {
      delete nsData[`doc_${docId}`];
      // Re-save by clearing and rewriting (no direct delete on memoryLayer)
      memoryLayer.clear('knowledge');
      Object.entries(nsData).forEach(([key, entry]) => {
        memoryLayer.write('knowledge', key, entry.value, {
          source: entry.source,
          agent: entry.agent,
          confidence: entry.confidence,
        });
      });
    }
  }

  /**
   * Get aggregate stats for the knowledge base.
   * @returns {{totalDocs: number, totalFacts: number, avgConfidence: number, lastIngested: number|null}}
   */
  getStats() {
    const docs = this._loadDocs();
    const facts = this._loadFacts();
    const avgConfidence = facts.length > 0
      ? facts.reduce((sum, f) => sum + (f.confidence || 0), 0) / facts.length
      : 0;
    const lastIngested = docs.length > 0
      ? Math.max(...docs.map((d) => d.ingestedAt || 0))
      : null;

    return {
      totalDocs: docs.length,
      totalFacts: facts.length,
      avgConfidence: Math.round(avgConfidence * 100) / 100,
      lastIngested,
    };
  }

  // ─── Internal ──────────────────────────────────────────────────────

  /** @private Simple fact extraction — split content into meaningful sentences */
  _extractFacts(content, _docId) {
    if (!content) return [];
    // Split on sentence boundaries
    const sentences = content
      .split(/[.!?]\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 15 && s.length < 300);

    return sentences.map((text) => ({
      text,
      confidence: 0.8 + Math.random() * 0.2, // 0.80–1.00 for demo
    }));
  }

  /** @private Simple entity extraction — words starting with uppercase */
  _extractEntities(content) {
    if (!content) return [];
    const words = content.match(/\b[A-Z][a-z]+(?:\s[A-Z][a-z]+)*/g) || [];
    const unique = [...new Set(words)].filter((w) => w.length > 2);
    return unique.slice(0, 15);
  }

  /** @private Seed demo documents if empty */
  _ensureDefaults() {
    if (this._loadDocs().length > 0) return;

    const demoDocs = [
      {
        name: 'Medglobal Brand Guidelines',
        type: 'pdf',
        source: 'brand_team',
        content:
          'Medglobal is an international humanitarian health NGO founded in 2017. ' +
          'Our mission is delivering emergency healthcare to vulnerable communities worldwide. ' +
          'Brand voice is professional, empathetic, and evidence-based. ' +
          'Primary colors are deep teal and warm gold. ' +
          'All donor communications must lead with impact data. ' +
          'Photography should feature real field workers, never stock imagery. ' +
          'Taglines should emphasize hope and measurable outcomes. ' +
          'Logo usage requires minimum 24px clear space on all sides.',
      },
      {
        name: 'Q1 Campaign Brief',
        type: 'doc',
        source: 'marketing_team',
        content:
          'Q1 2026 campaign focuses on the CFO Vietnam initiative targeting corporate donors. ' +
          'Primary channel is email outreach to 2,400 qualified leads. ' +
          'Secondary channel is LinkedIn sponsored content targeting CSR directors. ' +
          'Budget allocation: 60% email, 25% LinkedIn ads, 15% content creation. ' +
          'KPI targets: 500 MQLs, 50 SQLs, $200K pipeline generated. ' +
          'Campaign duration: January 15 through March 31. ' +
          'Content themes include field impact stories from Vietnam operations and donor impact reports. ' +
          'A/B test subject lines with and without statistics.',
      },
      {
        name: 'Donor ICP Research',
        type: 'doc',
        source: 'research_team',
        content:
          'Ideal donor profile for Medglobal includes corporate CSR departments with $500K+ annual giving budgets. ' +
          'Foundation program officers managing health-focused portfolios are high-value targets. ' +
          'Government health agencies in target regions respond best to evidence-based proposals. ' +
          'Individual major donors typically give $10K-$100K and value transparency in fund allocation. ' +
          'Decision cycle averages 45 days for corporate donors, 90 days for government agencies. ' +
          'Top objection: lack of visibility into how funds are deployed in the field. ' +
          'Webinar attendees convert at 2.5x the rate of cold outreach targets. ' +
          'Donors who receive quarterly impact reports have 78% retention rate.',
      },
    ];

    demoDocs.forEach((doc) => this.ingest(doc));
  }
}

/** Singleton instance */
const knowledgeBase = new KnowledgeBase();
export default knowledgeBase;
export { KnowledgeBase };
