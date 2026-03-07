/**
 * Slide-over: Day, time, timezone, recipients, format; Save.
 */
import { useState } from 'react';
import { C, F, R, S, btn, labelStyle, inputStyle } from '../../tokens';
import { Z } from '../../tokens';

export default function DigestScheduleConfig({ initial, open, onClose, onSave }) {
  const [day, setDay] = useState(initial?.day ?? 'Monday');
  const [time, setTime] = useState(initial?.time ?? '08:00');
  const [timezone, setTimezone] = useState(initial?.timezone ?? 'America/Los_Angeles');
  const [recipientsText, setRecipientsText] = useState(
    Array.isArray(initial?.recipients) ? initial.recipients.join(', ') : ''
  );
  const [format, setFormat] = useState(initial?.format ?? 'email');

  const handleSave = () => {
    const recipients = recipientsText.split(/[\s,]+/).filter(Boolean);
    onSave?.({ day, time, timezone, recipients, format });
    onClose?.();
  };

  if (!open) return null;

  return (
    <>
      <div
        role="presentation"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: C.overlay,
          zIndex: Z.overlay,
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: 420,
          backgroundColor: C.surface,
          borderLeft: `1px solid ${C.border}`,
          boxShadow: '-4px 0 24px rgba(0,0,0,0.3)',
          zIndex: Z.modal,
          padding: S[6],
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: S[6] }}>
          <h2 style={{ fontFamily: F.display, fontSize: '18px', fontWeight: 700, color: C.textPrimary, margin: 0 }}>
            Digest schedule
          </h2>
          <button type="button" onClick={onClose} style={{ ...btn.icon, fontSize: '18px' }} aria-label="Close">
            ×
          </button>
        </div>
        <div style={{ marginBottom: S[4] }}>
          <label style={labelStyle}>Day</label>
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            style={{ ...inputStyle, width: '100%' }}
          >
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: S[4] }}>
          <label style={labelStyle}>Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: S[4] }}>
          <label style={labelStyle}>Timezone</label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            style={{ ...inputStyle, width: '100%' }}
          >
            <option value="America/Los_Angeles">America/Los_Angeles</option>
            <option value="America/New_York">America/New_York</option>
            <option value="Europe/London">Europe/London</option>
            <option value="UTC">UTC</option>
          </select>
        </div>
        <div style={{ marginBottom: S[4] }}>
          <label style={labelStyle}>Recipients (comma or space separated)</label>
          <textarea
            value={recipientsText}
            onChange={(e) => setRecipientsText(e.target.value)}
            rows={3}
            placeholder="email@example.com, other@example.com"
            style={{ ...inputStyle, width: '100%', resize: 'vertical' }}
          />
        </div>
        <div style={{ marginBottom: S[6] }}>
          <label style={labelStyle}>Format</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            style={{ ...inputStyle, width: '100%' }}
          >
            <option value="email">Email</option>
            <option value="pdf">PDF attachment</option>
            <option value="in_app">In-app only</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: S[3] }}>
          <button type="button" onClick={onClose} style={btn.secondary}>
            Cancel
          </button>
          <button type="button" onClick={handleSave} style={btn.primary}>
            Save
          </button>
        </div>
      </div>
    </>
  );
}
