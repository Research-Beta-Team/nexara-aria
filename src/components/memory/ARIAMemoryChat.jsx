/**
 * Test ARIA's Memory — collapsible chat panel with mock reply that references store memory with [📎 From Memory] tags.
 */
import { useState } from 'react';
import { C, F, R, S } from '../../tokens';

function buildMockReply(ariaMemory) {
  const parts = [];
  if (ariaMemory?.brand?.length) {
    const first = ariaMemory.brand[0]?.content || '';
    if (first) parts.push(`Your brand tone is confident and data-driven [📎 From Memory: Brand Memory].`);
    const prohibited = ariaMemory.brand.find((e) => e.content?.includes('Prohibited'));
    if (prohibited) parts.push(`I avoid words like 'revolutionary' or 'game-changing' per your guidelines [📎 From Memory: Brand Memory].`);
  }
  if (ariaMemory?.audience?.length) {
    parts.push(`When writing for your primary ICP — CMOs at Series A-C SaaS companies — I lead with pipeline impact over feature lists [📎 From Memory: ICP Memory].`);
  }
  if (!parts.length) {
    return "I don't have any memory entries yet. Add brand, audience, campaign, or performance memories above so I can reference them here [📎 From Memory: none].";
  }
  return parts.join(' ');
}

export default function ARIAMemoryChat({ ariaMemory }) {
  const [collapsed, setCollapsed] = useState(false);
  const [input, setInput] = useState('');
  const [reply, setReply] = useState(null);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setReply(buildMockReply(ariaMemory));
    setInput('');
  };

  return (
    <div
      style={{
        backgroundColor: C.surface2,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
        overflow: 'hidden',
      }}
    >
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: S[4],
          fontFamily: F.body,
          fontSize: '14px',
          fontWeight: 600,
          color: C.textPrimary,
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span>Test ARIA's Memory</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{ transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {!collapsed && (
        <div style={{ padding: `0 ${S[4]} ${S[4]}`, borderTop: `1px solid ${C.border}` }}>
          <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, margin: `0 0 ${S[3]} 0` }}>
            Ask ARIA something about your brand — it should recall your memory entries.
          </p>
          <div style={{ display: 'flex', gap: S[2], marginBottom: S[3] }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="e.g. What's our brand tone?"
              style={{
                flex: 1,
                padding: `${S[2]} ${S[3]}`,
                fontFamily: F.body,
                fontSize: '14px',
                color: C.textPrimary,
                backgroundColor: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: R.input,
                outline: 'none',
              }}
            />
            <button
              type="button"
              onClick={handleSend}
              style={{
                padding: `${S[2]} ${S[4]}`,
                fontFamily: F.body,
                fontSize: '14px',
                fontWeight: 600,
                color: C.textInverse,
                backgroundColor: C.primary,
                border: 'none',
                borderRadius: R.button,
                cursor: 'pointer',
              }}
            >
              Send
            </button>
          </div>
          {reply && (
            <div
              style={{
                padding: S[3],
                backgroundColor: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: R.md,
                fontFamily: F.body,
                fontSize: '13px',
                color: C.textPrimary,
                lineHeight: 1.6,
              }}
            >
              {reply}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
