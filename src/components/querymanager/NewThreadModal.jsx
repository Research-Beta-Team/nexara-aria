import { useState } from 'react';
import { C, F, R, S, btn, shadows } from '../../tokens';

const THREAD_TYPES = ['Campaigns', 'Tasks', 'Clients', 'Agents', 'Announcements'];

export default function NewThreadModal({ onClose, onCreate }) {
  const [name, setName]   = useState('');
  const [type, setType]   = useState('Campaigns');
  const [tags, setTags]   = useState('');
  const [err, setErr]     = useState('');

  const handleCreate = () => {
    if (!name.trim()) { setErr('Thread name is required.'); return; }
    onCreate({
      name: name.trim(),
      type,
      tags: tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean),
    });
    onClose();
  };

  return (
    <>
      <style>{`@keyframes ntFade{from{opacity:0}to{opacity:1}} @keyframes ntUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{
        position: 'fixed', inset: 0, backgroundColor: 'rgba(9,11,17,0.88)', zIndex: 400,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: S[6],
        animation: 'ntFade 0.15s ease',
      }} onClick={onClose}>
        <div style={{
          backgroundColor: C.surface, border: `1px solid ${C.border}`,
          borderRadius: R.card, width: '100%', maxWidth: '440px',
          boxShadow: shadows.modal, animation: 'ntUp 0.2s ease',
          display: 'flex', flexDirection: 'column', gap: 0,
          overflow: 'hidden',
        }} onClick={(e) => e.stopPropagation()}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${S[4]} ${S[5]}`, borderBottom: `1px solid ${C.border}` }}>
            <div style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary }}>New Thread</div>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.textMuted, padding: S[1], display: 'flex' }} onClick={onClose}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: S[5], display: 'flex', flexDirection: 'column', gap: S[4] }}>

            {/* Name */}
            <div>
              <label style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, display: 'block', marginBottom: S[1] }}>Thread Name *</label>
              <input
                autoFocus
                value={name}
                onChange={(e) => { setName(e.target.value); setErr(''); }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); }}
                placeholder="e.g. Acme VN CFO Q2 — Strategy"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  backgroundColor: C.surface2, color: C.textPrimary,
                  border: `1px solid ${err ? '#EF4444' : C.border}`, borderRadius: R.input,
                  padding: `${S[2]} ${S[3]}`, fontFamily: F.body, fontSize: '13px', outline: 'none',
                }}
              />
              {err && <div style={{ fontFamily: F.body, fontSize: '11px', color: '#EF4444', marginTop: '4px' }}>{err}</div>}
            </div>

            {/* Type */}
            <div>
              <label style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, display: 'block', marginBottom: S[2] }}>Type</label>
              <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap' }}>
                {THREAD_TYPES.map((t) => (
                  <button key={t} onClick={() => setType(t)} style={{
                    fontFamily: F.body, fontSize: '12px', fontWeight: type === t ? 700 : 400,
                    color: type === t ? C.textPrimary : C.textMuted,
                    backgroundColor: type === t ? C.surface3 : 'transparent',
                    border: `1px solid ${type === t ? C.borderHover : C.border}`,
                    borderRadius: R.pill, padding: `3px 10px`, cursor: 'pointer',
                  }}>{t}</button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, display: 'block', marginBottom: S[1] }}>Tags (comma-separated)</label>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. acme, q2, budget"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  backgroundColor: C.surface2, color: C.textPrimary,
                  border: `1px solid ${C.border}`, borderRadius: R.input,
                  padding: `${S[2]} ${S[3]}`, fontFamily: F.mono, fontSize: '12px', outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: S[2], padding: `${S[3]} ${S[5]}`, borderTop: `1px solid ${C.border}` }}>
            <button style={{ ...btn.secondary, fontSize: '13px' }} onClick={onClose}>Cancel</button>
            <button style={{ ...btn.primary, fontSize: '13px' }} onClick={handleCreate}>Create Thread</button>
          </div>
        </div>
      </div>
    </>
  );
}
