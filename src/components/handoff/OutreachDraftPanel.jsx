/**
 * Freya draft first-touch email: Copy / Load into Outreach.
 */
import { C, F, R, S, btn } from '../../tokens';
import useToast from '../../hooks/useToast';

export default function OutreachDraftPanel({ lead }) {
  const toast = useToast();
  const draft = lead?.draftEmail;

  const handleCopy = () => {
    if (!draft) return;
    const text = `Subject: ${draft.subject}\n\n${draft.body}`;
    navigator.clipboard?.writeText(text).then(() => toast.success('Copied to clipboard'));
  };

  const handleLoadOutreach = () => {
    toast.info('Load into Outreach (mock).');
  };

  if (!lead) {
    return (
      <div
        style={{
          padding: S[4],
          fontFamily: F.body,
          fontSize: '13px',
          color: C.textMuted,
          backgroundColor: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: R.card,
        }}
      >
        Select an MQL to see Freya draft.
      </div>
    );
  }

  if (!draft) {
    return (
      <div
        style={{
          padding: S[4],
          fontFamily: F.body,
          fontSize: '13px',
          color: C.textMuted,
          backgroundColor: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: R.card,
        }}
      >
        No draft for this lead.
      </div>
    );
  }

  return (
    <div
      style={{
        padding: S[4],
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
      }}
    >
      <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textPrimary, marginBottom: S[3] }}>
        Freya First-Touch Draft
      </div>
      <div style={{ fontFamily: F.mono, fontSize: '12px', color: C.secondary, marginBottom: S[2] }}>
        Re: {draft.subject}
      </div>
      <div
        style={{
          fontFamily: F.body,
          fontSize: '12px',
          color: C.textSecondary,
          lineHeight: 1.5,
          whiteSpace: 'pre-wrap',
          maxHeight: 160,
          overflowY: 'auto',
          padding: S[3],
          backgroundColor: C.surface2,
          borderRadius: R.input,
          marginBottom: S[4],
        }}
      >
        {draft.body}
      </div>
      <div style={{ display: 'flex', gap: S[2] }}>
        <button type="button" onClick={handleCopy} style={btn.secondary}>
          Copy
        </button>
        <button type="button" onClick={handleLoadOutreach} style={btn.primary}>
          Load into Outreach
        </button>
      </div>
    </div>
  );
}
