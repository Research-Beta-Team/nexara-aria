import { C, F, R, S, btn } from '../../../tokens';
import { IconCheck, IconWarning } from '../../ui/Icons';
import { KNOWLEDGE_CATEGORIES, KNOWLEDGE_HEALTH, getMissingCategories } from '../../../data/ariaKnowledge';

export default function KnowledgeHealthBar({ onAddMissing }) {
  const missing = getMissingCategories();
  const missingText = missing.length > 0
    ? `Missing: ${missing.join(' and ')}. Add these to improve ARIA's recommendations by ~35%.`
    : "ARIA's knowledge is in good shape.";

  return (
    <div style={{
      backgroundColor: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: R.card,
      padding: S[6],
      marginBottom: S[6],
    }}>
      <div style={{ fontFamily: F.body, fontSize: '14px', fontWeight: 600, color: C.textPrimary, marginBottom: S[2] }}>
        ARIA Knowledge Completeness: {KNOWLEDGE_HEALTH.overallScore}%
      </div>
      <div style={{
        height: '10px',
        borderRadius: R.pill,
        backgroundColor: C.surface3,
        overflow: 'hidden',
        marginBottom: S[5],
      }}>
        <div style={{
          width: `${KNOWLEDGE_HEALTH.overallScore}%`,
          height: '100%',
          backgroundColor: C.primary,
          borderRadius: R.pill,
          transition: 'width 0.3s ease',
        }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
        {KNOWLEDGE_CATEGORIES.map((cat) => {
          const h = KNOWLEDGE_HEALTH[cat.id] ?? { score: 0, docCount: 0, status: 'missing' };
          const isMissing = h.status === 'missing';
          const hasDocs = h.docCount > 0;
          const isWritten = cat.id === 'communication';
          const docLabel = hasDocs ? `${h.docCount} docs uploaded` : (isWritten ? 'Written directly' : 'Missing');
          return (
            <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: S[4], flexWrap: 'wrap' }}>
              <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary, minWidth: '160px' }}>
                {cat.label}:
              </span>
              <div style={{
                flex: 1,
                minWidth: '120px',
                height: '6px',
                borderRadius: R.pill,
                backgroundColor: C.surface3,
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${h.score}%`,
                  height: '100%',
                  backgroundColor: isMissing ? C.amber : C.primary,
                  borderRadius: R.pill,
                  transition: 'width 0.3s ease',
                }} />
              </div>
              <span style={{ fontFamily: F.mono, fontSize: '12px', color: C.textSecondary, width: '36px' }}>
                {h.score}%
              </span>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontFamily: F.body,
                fontSize: '12px',
                color: isMissing ? C.amber : C.textSecondary,
              }}>
                {isMissing ? <IconWarning color={C.amber} width={12} height={12} /> : <IconCheck color={C.primary} width={12} height={12} />}
                {docLabel}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: S[4], paddingTop: S[4], borderTop: `1px solid ${C.border}` }}>
        <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: `0 0 ${S[3]} 0` }}>
          {missingText}
        </p>
        {missing.length > 0 && (
          <button
            type="button"
            onClick={onAddMissing}
            style={{
              ...btn.secondary,
              backgroundColor: C.amberDim,
              borderColor: C.amber,
              color: C.amber,
              fontSize: '13px',
            }}
          >
            Add Missing Knowledge →
          </button>
        )}
      </div>
    </div>
  );
}
