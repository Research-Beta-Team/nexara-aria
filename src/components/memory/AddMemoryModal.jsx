/**
 * Modal to add or edit a memory entry: namespace dropdown, textarea (200 chars), source Manual, "Add to ARIA Memory" / "Save changes".
 */
import { useState, useEffect } from 'react';
import { C, F, R, S, btn } from '../../tokens';
import { MEMORY_NAMESPACES } from '../../data/memoryMock';

const MAX_CHARS = 200;

export default function AddMemoryModal({ open, initialNamespace, editEntry, onClose, onSave, onUpdate }) {
  const [namespace, setNamespace] = useState(initialNamespace || 'brand');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (open && editEntry) {
      setNamespace(editEntry.namespaceKey || 'brand');
      setContent(editEntry.entry?.content || '');
    } else if (open && !editEntry) {
      setNamespace(initialNamespace || 'brand');
      setContent('');
    }
  }, [open, editEntry, initialNamespace]);

  const isEdit = Boolean(editEntry?.entry?.id);

  const handleSave = () => {
    const trimmed = content.trim();
    if (!trimmed) return;
    if (isEdit) {
      onUpdate(namespace, editEntry.entry.id, trimmed);
    } else {
      onSave(namespace, { content: trimmed, source: 'Manual' });
    }
    setContent('');
    setNamespace(initialNamespace || 'brand');
    onClose();
  };

  const handleClose = () => {
    setContent('');
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <div
        onClick={handleClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: C.overlay,
          zIndex: 400,
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-memory-title"
        style={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: 420,
          backgroundColor: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: R.card,
          padding: S[6],
          zIndex: 401,
          boxShadow: 'var(--shadow-modal)',
        }}
      >
        <h2 id="add-memory-title" style={{ fontFamily: F.display, fontSize: '18px', fontWeight: 700, color: C.textPrimary, margin: `0 0 ${S[4]} 0` }}>
          {isEdit ? 'Edit memory' : 'Add to ARIA Memory'}
        </h2>
        <div style={{ marginBottom: S[4] }}>
          <label style={{ display: 'block', fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, marginBottom: S[1] }}>
            Namespace
          </label>
          <select
            value={namespace}
            onChange={(e) => setNamespace(e.target.value)}
            style={{
              width: '100%',
              padding: `${S[2]} ${S[3]}`,
              fontFamily: F.body,
              fontSize: '14px',
              color: C.textPrimary,
              backgroundColor: C.surface2,
              border: `1px solid ${C.border}`,
              borderRadius: R.input,
              outline: 'none',
            }}
          >
            {MEMORY_NAMESPACES.map((ns) => (
              <option key={ns.id} value={ns.id}>
                {ns.label}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: S[4] }}>
          <label style={{ display: 'block', fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, marginBottom: S[1] }}>
            Memory content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, MAX_CHARS))}
            placeholder="What should ARIA remember?"
            rows={4}
            style={{
              width: '100%',
              padding: S[3],
              fontFamily: F.body,
              fontSize: '14px',
              color: C.textPrimary,
              backgroundColor: C.surface2,
              border: `1px solid ${C.border}`,
              borderRadius: R.input,
              outline: 'none',
              resize: 'vertical',
              minHeight: 88,
            }}
          />
          <div style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted, marginTop: S[1] }}>
            {content.length}/{MAX_CHARS}
          </div>
        </div>
        <div style={{ display: 'flex', gap: S[3], justifyContent: 'flex-end' }}>
          <button type="button" onClick={handleClose} style={{ ...btn.ghost }}>
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!content.trim()}
            style={{
              ...btn.primary,
              opacity: content.trim() ? 1 : 0.5,
              cursor: content.trim() ? 'pointer' : 'default',
            }}
          >
            {isEdit ? 'Save changes' : 'Add to ARIA Memory'}
          </button>
        </div>
      </div>
    </>
  );
}
