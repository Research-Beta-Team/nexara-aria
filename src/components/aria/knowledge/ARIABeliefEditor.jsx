import { useState } from 'react';
import { C, F, R, S, btn, inputStyle } from '../../../tokens';

/**
 * Inline editor for adding a new fact/rule for ARIA.
 * Used by "+ Add a rule for ARIA to follow" in each category.
 */
export default function ARIABeliefEditor({ categoryLabel, onSave, onCancel }) {
  const [text, setText] = useState('');

  const handleSave = () => {
    const trimmed = text.trim();
    if (trimmed) {
      onSave?.(trimmed);
      setText('');
    }
    onCancel?.();
  };

  return (
    <div style={{
      padding: S[3],
      borderRadius: R.md,
      backgroundColor: C.surface2,
      border: `1px dashed ${C.border}`,
      marginTop: S[2],
    }}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`Tell ARIA something about ${categoryLabel}...`}
        style={{
          ...inputStyle,
          minHeight: 56,
          resize: 'vertical',
          marginBottom: S[2],
        }}
        autoFocus
      />
      <div style={{ display: 'flex', gap: S[2] }}>
        <button type="button" style={{ ...btn.primary, fontSize: '12px' }} onClick={handleSave}>
          Save
        </button>
        <button type="button" style={{ ...btn.ghost, fontSize: '12px' }} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
