import { useState } from 'react';
import { C, F, R, S, Z, T, btn, inputStyle } from '../../../tokens';
import { KNOWLEDGE_CATEGORIES } from '../../../data/ariaKnowledge';

export default function AddKnowledgeModal({ open, onClose, onDocumentAdded, onFactAdded }) {
  const [tab, setTab] = useState('upload');
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('brand');
  const [ruleText, setRuleText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const reset = () => {
    setTab('upload');
    setFile(null);
    setCategory('brand');
    setRuleText('');
    setUploading(false);
    setDragOver(false);
  };

  const handleClose = () => {
    reset();
    onClose?.();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer?.files?.[0];
    if (f) setFile(f);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleFileInput = (e) => {
    const f = e.target?.files?.[0];
    if (f) setFile(f);
  };

  const handleUpload = () => {
    if (!file) return;
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      const name = file.name;
      const factsCount = Math.min(9, Math.max(3, Math.floor(Math.random() * 6) + 3));
      onDocumentAdded?.({ fileName: name, category, factsCount, fileType: (name.split('.').pop() || 'pdf').toLowerCase() });
      handleClose();
    }, 2000);
  };

  const handleSaveRule = () => {
    const trimmed = ruleText.trim();
    if (!trimmed) return;
    onFactAdded?.({ text: trimmed, category, sourceType: 'user' });
    handleClose();
  };

  if (!open) return null;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: C.overlay,
          zIndex: Z.modal,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: S[4],
        }}
        onClick={handleClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-knowledge-title"
      />
      <div
        style={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: 560,
          backgroundColor: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: R.card,
          boxShadow: 'var(--shadow-modal)',
          zIndex: Z.modal + 1,
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: S[6], borderBottom: `1px solid ${C.border}` }}>
          <h2 id="add-knowledge-title" style={{ fontFamily: F.display, fontSize: '20px', fontWeight: 700, color: C.textPrimary, margin: 0 }}>
            Add to Freya's Knowledge Base
          </h2>
        </div>

        <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}` }}>
          <button
            type="button"
            onClick={() => setTab('upload')}
            style={{
              ...btn.ghost,
              flex: 1,
              borderRadius: 0,
              borderBottom: tab === 'upload' ? `2px solid ${C.primary}` : '2px solid transparent',
              color: tab === 'upload' ? C.primary : C.textSecondary,
            }}
          >
            Upload Document
          </button>
          <button
            type="button"
            onClick={() => setTab('rule')}
            style={{
              ...btn.ghost,
              flex: 1,
              borderRadius: 0,
              borderBottom: tab === 'rule' ? `2px solid ${C.primary}` : '2px solid transparent',
              color: tab === 'rule' ? C.primary : C.textSecondary,
            }}
          >
            Write a Rule
          </button>
        </div>

        <div style={{ padding: S[6] }}>
          {tab === 'upload' && (
            <>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                style={{
                  height: 300,
                  border: `2px dashed ${dragOver ? C.primary : C.border}`,
                  borderRadius: R.md,
                  backgroundColor: dragOver ? C.primaryGlow : C.surface2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: S[3],
                  transition: T.base,
                }}
              >
                {file ? (
                  <span style={{ fontFamily: F.body, fontSize: '14px', color: C.textPrimary }}>{file.name}</span>
                ) : (
                  <>
                    <span style={{ fontFamily: F.body, fontSize: '14px', color: C.textSecondary }}>
                      Drop a file here or click to browse
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.docx,.xlsx,.md"
                      onChange={handleFileInput}
                      style={{ display: 'none' }}
                      id="aria-knowledge-file"
                    />
                    <label htmlFor="aria-knowledge-file" style={{ ...btn.secondary, cursor: 'pointer' }}>
                      Choose file
                    </label>
                  </>
                )}
              </div>
              <div style={{ marginTop: S[4] }}>
                <label style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, display: 'block', marginBottom: S[1] }}>
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ ...inputStyle, width: '100%' }}
                >
                  {KNOWLEDGE_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                disabled={!file || uploading}
                onClick={handleUpload}
                style={{ ...btn.primary, width: '100%', marginTop: S[4] }}
              >
                {uploading ? "Freya is reading your document..." : "Upload & Train Freya"}
              </button>
            </>
          )}

          {tab === 'rule' && (
            <>
              <label style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, display: 'block', marginBottom: S[1] }}>
                Tell Freya something about your business
              </label>
              <textarea
                value={ruleText}
                onChange={(e) => setRuleText(e.target.value)}
                placeholder="e.g. Always mention our Bangladesh origin story when pitching to South Asian clients"
                style={{
                  ...inputStyle,
                  minHeight: 100,
                  resize: 'vertical',
                  marginBottom: S[4],
                }}
              />
              <label style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, display: 'block', marginBottom: S[1] }}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ ...inputStyle, width: '100%', marginBottom: S[4] }}
              >
                {KNOWLEDGE_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
              <button
                type="button"
                disabled={!ruleText.trim()}
                onClick={handleSaveRule}
                style={{ ...btn.primary, width: '100%' }}
              >
                Save to Freya's Memory
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
