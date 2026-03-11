import { useState } from 'react';
import { C, F, R, S, T, btn } from '../../../tokens';
import { getCategoryLabel } from '../../../data/freyaKnowledge';

const FILE_TYPE_COLORS = { pdf: C.red, docx: '#4A90D9', xlsx: C.green, md: C.secondary };
const FILE_ICONS = {
  pdf: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 2h8l4 4v12H4V2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M12 2v4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 10h8M6 14h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  docx: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 2h8l4 4v12H4V2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M12 2v4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 9h8M6 12h6M6 15h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  xlsx: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 2h8l4 4v12H4V2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M12 2v4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 8l2 3-2 3h2l1.5-2 1.5 2h2l-2-3 2-3h-2l-1.5 2L8 8H6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  md: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 4h12v12H4V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M7 7h6M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
};

export default function KnowledgeDocCard({ doc, onViewFacts, onRemove }) {
  const [hover, setHover] = useState(false);
  const color = FILE_TYPE_COLORS[doc.fileType] ?? C.textSecondary;
  const Icon = FILE_ICONS[doc.fileType] ?? FILE_ICONS.pdf;

  return (
    <div
      style={{
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
        padding: S[4],
        transition: T.base,
        position: 'relative',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: S[3] }}>
        <div style={{ color, flexShrink: 0 }}><Icon /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: F.body, fontSize: '14px', fontWeight: 600, color: C.textPrimary }}>
            {doc.fileName}
          </div>
          <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, marginTop: '2px' }}>
            {doc.uploadDate} · {getCategoryLabel(doc.category)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginTop: S[2], flexWrap: 'wrap' }}>
            {doc.status === 'read' ? (
              <span style={{
                fontFamily: F.mono, fontSize: '11px', fontWeight: 600, color: C.primary,
                backgroundColor: C.primaryGlow, border: `1px solid ${C.primary}`,
                borderRadius: R.pill, padding: `2px ${S[2]}`,
              }}>
                Freya has read this
              </span>
            ) : (
              <span style={{
                fontFamily: F.body, fontSize: '11px', color: C.amber,
                display: 'inline-flex', alignItems: 'center', gap: S[1],
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%', backgroundColor: C.amber,
                  animation: 'pulse 1s ease-in-out infinite',
                }} />
                Processing...
              </span>
            )}
            <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>
              {doc.factsCount} facts extracted
            </span>
          </div>
        </div>
      </div>

      {hover && (
        <div style={{ display: 'flex', gap: S[2], marginTop: S[3], paddingTop: S[2], borderTop: `1px solid ${C.border}` }}>
          <button type="button" style={{ ...btn.ghost, fontSize: '12px' }} onClick={() => onViewFacts?.(doc)}>
            View extracted facts
          </button>
          <button type="button" style={{ ...btn.ghost, fontSize: '12px', color: C.red }} onClick={() => onRemove?.(doc)}>
            Remove
          </button>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}
