import { useState } from 'react';
import useToast from '../../hooks/useToast';
import { CP } from '../../data/clientPortal';

const fontBody = "'DM Sans', sans-serif";

export default function ClientMessaging({ messages: initialMessages }) {
  const toast = useToast();
  const [messages, setMessages] = useState(initialMessages || []);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: 'new-' + Date.now(), from: 'client', text: input.trim(), time: 'Just now', read: true },
    ]);
    setInput('');
    toast.success('Message sent');
  };

  return (
    <section
      style={{
        backgroundColor: CP.surface,
        border: `1px solid ${CP.border}`,
        borderRadius: 12,
        padding: 24,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h2 style={{ fontFamily: fontBody, fontSize: 16, fontWeight: 700, color: CP.text, margin: '0 0 16px' }}>
        Message your CSM
      </h2>
      <div
        style={{
          flex: 1,
          minHeight: 200,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          marginBottom: 16,
        }}
      >
        {messages.slice(-5).map((m) => (
          <div
            key={m.id}
            style={{
              alignSelf: m.from === 'client' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              padding: 12,
              borderRadius: 8,
              backgroundColor: m.from === 'client' ? `${CP.primary}14` : CP.bg,
              border: `1px solid ${m.from === 'client' ? `${CP.primary}30` : CP.border}`,
            }}
          >
            <div style={{ fontFamily: fontBody, fontSize: 13, color: CP.text }}>{m.text}</div>
            <div style={{ fontFamily: fontBody, fontSize: 11, color: CP.textSecondary, marginTop: 4 }}>{m.time}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          placeholder="Type a message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: 8,
            border: `1px solid ${CP.border}`,
            fontFamily: fontBody,
            fontSize: 14,
            color: CP.text,
            outline: 'none',
          }}
        />
        <button
          style={{
            padding: '10px 20px',
            borderRadius: 7,
            border: 'none',
            backgroundColor: CP.primary,
            color: '#fff',
            fontFamily: fontBody,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </section>
  );
}
