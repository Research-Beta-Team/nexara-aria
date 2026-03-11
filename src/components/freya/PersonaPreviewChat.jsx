import { useState } from 'react';
import { C, F, R, S } from '../../tokens';
import { PREVIEW_QUESTIONS, getPreviewResponse } from '../../data/freyaPersonas';

export default function PersonaPreviewChat({ personaId, companyBrand }) {
  const [activeQuestionId, setActiveQuestionId] = useState(PREVIEW_QUESTIONS[0].id);
  const activeQ = PREVIEW_QUESTIONS.find((q) => q.id === activeQuestionId) || PREVIEW_QUESTIONS[0];
  const responseText = getPreviewResponse(personaId, activeQuestionId);

  return (
    <div style={{ maxWidth: 400 }}>
      <div
        style={{
          backgroundColor: C.surface2,
          border: `1px solid ${C.border}`,
          borderRadius: R.card,
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: S[3], borderBottom: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: S[2] }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: S[2] }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                backgroundColor: C.surface3,
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, marginBottom: 2 }}>User</div>
              <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary }}>{activeQ.text}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: S[2] }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                backgroundColor: C.primaryGlow,
                border: `1px solid ${C.primary}`,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
                color: C.primary,
              }}
            >
              A
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, marginBottom: 2 }}>Freya</div>
              <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                {responseText}
              </div>
            </div>
          </div>
        </div>
        <div style={{ padding: S[2], display: 'flex', gap: S[2], flexWrap: 'wrap' }}>
          {PREVIEW_QUESTIONS.map((q) => (
            <button
              key={q.id}
              type="button"
              onClick={() => setActiveQuestionId(q.id)}
              style={{
                padding: `${S[1]} ${S[2]}`,
                borderRadius: R.button,
                border: `1px solid ${activeQuestionId === q.id ? C.primary : C.border}`,
                backgroundColor: activeQuestionId === q.id ? C.primaryGlow : C.surface3,
                color: activeQuestionId === q.id ? C.primary : C.textSecondary,
                fontFamily: F.body,
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
