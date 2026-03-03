import { useState, useEffect } from 'react';
import useToast from '../../hooks/useToast';
import { C, F, R, S, Z, cardStyle, btn, labelStyle, inputStyle } from '../../tokens';

const CHANNELS = ['LinkedIn', 'Meta', 'Instagram'];

export default function EditPostModal({ post, onSave, onClose }) {
  const toast = useToast();
  const [text, setText] = useState('');
  const [channel, setChannel] = useState('LinkedIn');

  useEffect(() => {
    if (post) {
      setText(post.text ?? '');
      setChannel(post.channel ?? 'LinkedIn');
    }
  }, [post]);

  if (!post) return null;

  const handleSave = () => {
    onSave({ ...post, text, channel });
    toast.success('Post updated');
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: C.overlayHeavy,
        zIndex: Z.modal,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: S[4],
      }}
      onClick={onClose}
    >
      <div
        style={{
          ...cardStyle,
          maxWidth: '480px',
          width: '100%',
          padding: S[6],
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[4] }}>
          <h2 style={{ fontFamily: F.display, fontSize: '18px', fontWeight: 700, color: C.textPrimary, margin: 0 }}>
            Edit post
          </h2>
          <button style={{ ...btn.icon }} onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 2l12 12M14 2L2 14" />
            </svg>
          </button>
        </div>
        <label style={labelStyle}>Channel</label>
        <select
          style={{ ...inputStyle, marginBottom: S[4] }}
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
        >
          {CHANNELS.map((ch) => (
            <option key={ch} value={ch}>{ch}</option>
          ))}
        </select>
        <label style={labelStyle}>Content</label>
        <textarea
          style={{ ...inputStyle, minHeight: '120px', resize: 'vertical', marginBottom: S[5] }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your post..."
        />
        <div style={{ display: 'flex', gap: S[2], justifyContent: 'flex-end' }}>
          <button style={btn.secondary} onClick={onClose}>Cancel</button>
          <button style={btn.primary} onClick={handleSave}>Save changes</button>
        </div>
      </div>
    </div>
  );
}
