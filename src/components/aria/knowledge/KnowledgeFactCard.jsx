import { useState } from 'react';
import { C, F, R, S, T, btn, inputStyle } from '../../../tokens';
import { IconPen, IconTrash } from '../../ui/Icons';

export default function KnowledgeFactCard({ fact, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(fact.text);

  const handleSave = () => {
    onEdit?.({ ...fact, text: editValue });
    setEditing(false);
  };

  const handleCancel = () => {
    setEditValue(fact.text);
    setEditing(false);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: S[2],
        padding: S[3],
        borderRadius: R.md,
        backgroundColor: C.surface2,
        border: `1px solid ${C.border}`,
        transition: T.base,
      }}
      className="knowledge-fact-card"
    >
      <div style={{ flexShrink: 0, width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: 6, height: 6, borderRadius: '50%', backgroundColor: C.primary,
        }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {editing ? (
          <>
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              style={{
                ...inputStyle,
                minHeight: 60,
                resize: 'vertical',
                marginBottom: S[2],
              }}
              placeholder="Fact text..."
            />
            <div style={{ display: 'flex', gap: S[2] }}>
              <button type="button" style={{ ...btn.primary, fontSize: '12px' }} onClick={handleSave}>
                Save
              </button>
              <button type="button" style={{ ...btn.ghost, fontSize: '12px' }} onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <p style={{ fontFamily: F.body, fontSize: '14px', color: C.textPrimary, margin: 0, lineHeight: 1.5 }}>
              {fact.text}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginTop: S[1], flexWrap: 'wrap' }}>
              <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>
                {fact.sourceType === 'user' ? 'Written by you' : `Extracted from ${fact.source}`}
              </span>
              <span style={{
                fontFamily: F.mono, fontSize: '10px', fontWeight: 600,
                color: fact.sourceType === 'user' ? C.secondary : C.primary,
                backgroundColor: fact.sourceType === 'user' ? C.secondaryDim : C.primaryGlow,
                padding: `1px ${S[1]}`,
                borderRadius: R.pill,
              }}>
                {fact.sourceType === 'user' ? 'You wrote this' : 'ARIA learned this'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: S[2], marginTop: S[2], opacity: 0, transition: T.base }} className="fact-actions">
              <button type="button" style={{ ...btn.ghost, fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: 4 }} onClick={() => setEditing(true)}>
                <IconPen color={C.textMuted} width={14} height={14} />
                Edit
              </button>
              <button type="button" style={{ ...btn.ghost, fontSize: '12px', color: C.red, display: 'inline-flex', alignItems: 'center', gap: 4 }} onClick={() => onDelete?.(fact)}>
                <IconTrash color={C.red} width={14} height={14} />
                Delete
              </button>
            </div>
            <style>{`.knowledge-fact-card:hover .fact-actions { opacity: 1; }`}</style>
          </>
        )}
      </div>
    </div>
  );
}
