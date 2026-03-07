// ─────────────────────────────────────────────
//  Antarious — Content ID utilities
//  Format: CAMP-{campaignId}-{type}-{seq}
//  e.g. CAMP-001-EMAIL-003, CAMP-001-LI-001
// ─────────────────────────────────────────────

const TYPE_TO_CODE = {
  email:     'EMAIL',
  linkedin:  'LI',
  meta_ad:   'AD',
  whatsapp:  'WA',
  strategy:  'STRAT',
  brief:     'BRIEF',
  script:    'SCRIPT',
  blog:      'BLOG',
  seo:       'SEO',
  landing:   'LP',
};

const CODE_TO_RAW = {};
Object.entries(TYPE_TO_CODE).forEach(([raw, code]) => { CODE_TO_RAW[code] = raw; });

/**
 * Generate a content ID.
 * @param {string} campaignId - Campaign id (e.g. '001', 'c1' — will be normalized to 3-digit)
 * @param {string} type - Raw type: email, linkedin, meta_ad, whatsapp, strategy, brief, script, blog, seo, landing
 * @param {number} seq - Sequence number (1-based)
 * @returns {string} e.g. 'CAMP-001-EMAIL-003'
 */
export function generateContentId(campaignId, type, seq) {
  const normalized = String(campaignId).replace(/^c/, '').padStart(3, '0').slice(0, 3);
  const code = TYPE_TO_CODE[type?.toLowerCase()] || 'STRAT';
  const seqStr = String(Math.max(1, Math.floor(seq))).padStart(3, '0');
  return `CAMP-${normalized}-${code}-${seqStr}`;
}

/**
 * Parse a content ID into parts.
 * @param {string} contentId - e.g. 'CAMP-001-EMAIL-003'
 * @returns {{ campaignId: string, type: string, seq: number, rawType: string } | null}
 */
export function parseContentId(contentId) {
  if (!contentId || typeof contentId !== 'string') return null;
  const match = contentId.match(/^CAMP-(\d{3})-([A-Z]+)-(\d+)$/);
  if (!match) return null;
  const [, campaignId, type, seqStr] = match;
  const rawType = CODE_TO_RAW[type] || type.toLowerCase();
  return {
    campaignId,
    type,
    seq: parseInt(seqStr, 10),
    rawType,
  };
}

/**
 * Color for content type (for chips/badges).
 * @param {string} type - Uppercase code (EMAIL, LI, AD, WA) or raw type
 * @returns {string} CSS color
 */
export function getContentIdColor(type) {
  const code = (type || '').toUpperCase();
  const raw = (type || '').toLowerCase();
  const colors = {
    EMAIL:   'var(--c-primary)',
    LI:      '#0A66C2',
    linkedin:'#0A66C2',
    AD:      '#1877F2',
    meta_ad: '#1877F2',
    WA:      '#25D366',
    whatsapp:'#25D366',
  STRAT:   'var(--c-text-secondary)',
  BRIEF:   'var(--c-text-secondary)',
  SCRIPT:  'var(--c-text-secondary)',
  BLOG:    'var(--c-amber)',
  SEO:     'var(--c-amber)',
  LP:      'var(--c-secondary)',
  LINKEDIN:'#0A66C2',
};
  return colors[code] || colors[raw] || 'var(--c-text-secondary)';
}
