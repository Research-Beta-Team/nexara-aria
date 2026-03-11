/**
 * Freya narrative per slide; editable; "Regenerate", "Accepted". Teal underline for Freya-generated.
 */
import { useState, useEffect } from 'react';
import { C, F, R, S, btn } from '../../tokens';

export default function NarrativeEditor({ narrative, onRegenerate, onAccepted }) {
  const [edited, setEdited] = useState(narrative || '');
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    setEdited(narrative || '');
    setAccepted(false);
  }, [narrative]);

  const handleAccept = () => {
    setAccepted(true);
    onAccepted?.(edited);
  };

  return (
    <div
      style={{
        padding: S[4],
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
      }}
    >
      <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, marginBottom: S[2] }}>
        Slide narrative
      </div>
      <textarea
        value={edited}
        onChange={(e) => setEdited(e.target.value)}
        rows={4}
        style={{
          width: '100%',
          padding: S[3],
          fontFamily: F.body,
          fontSize: '13px',
          color: C.textPrimary,
          backgroundColor: C.surface2,
          border: `1px solid ${C.border}`,
          borderRadius: R.input,
          outline: 'none',
          resize: 'vertical',
          marginBottom: S[3],
          borderBottom: `2px solid ${C.secondary}`,
        }}
      />
      <div style={{ display: 'flex', gap: S[2] }}>
        <button type="button" onClick={() => onRegenerate?.()} style={{ ...btn.secondary, fontSize: '12px' }}>
          Regenerate
        </button>
        <button
          type="button"
          onClick={handleAccept}
          style={accepted ? { ...btn.primary, opacity: 0.8 } : btn.primary}
        >
          {accepted ? 'Accepted' : 'Accept'}
        </button>
      </div>
    </div>
  );
}
