import { C, F, R, S, btn } from '../../tokens';
import useToast from '../../hooks/useToast';
import { IconCheck } from '../ui/Icons';

const CHANNEL_LABELS = { email: 'Email', linkedin: 'LinkedIn', meta: 'Meta Ads' };

export default function ARIAMomentSuccess({ extraction, onGoToCampaign, onGoToDashboard }) {
  const toast = useToast();
  const hasExtraction = extraction && extraction.extracted_fields?.length > 0;
  const name = hasExtraction
    ? extraction.extracted_fields.find((f) => f.id === 'campaign_name')?.value
    : 'My first campaign';
  const goal = hasExtraction
    ? extraction.extracted_fields.find((f) => f.id === 'goal')?.value
    : null;
  const budget = hasExtraction
    ? extraction.extracted_fields.find((f) => f.id === 'budget')?.value
    : null;
  const timeline = hasExtraction
    ? extraction.extracted_fields.find((f) => f.id === 'timeline')?.value
    : null;
  const channels = hasExtraction
    ? (extraction.extracted_fields.find((f) => f.id === 'channels')?.value ?? []).map(
        (c) => CHANNEL_LABELS[c] || c
      )
    : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: S[8], width: '100%', maxWidth: 640 }}>
      <h1
        style={{
          fontFamily: F.display,
          fontSize: 42,
          fontWeight: 800,
          color: C.textPrimary,
          margin: 0,
          textAlign: 'center',
        }}
      >
        Your campaign is ready.
      </h1>
      <p
        style={{
          fontFamily: F.body,
          fontSize: 18,
          color: C.textSecondary,
          margin: 0,
          textAlign: 'center',
        }}
      >
        ARIA built this in 8 seconds. A team would take 3 days.
      </p>

      {/* Summary card */}
      <div
        style={{
          width: '100%',
          maxWidth: 560,
          backgroundColor: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: R.card,
          padding: S[6],
          display: 'flex',
          flexDirection: 'column',
          gap: S[4],
        }}
      >
        <div>
          <div style={{ fontFamily: F.mono, fontSize: 11, color: C.textMuted, marginBottom: S[1] }}>
            Campaign
          </div>
          <div style={{ fontFamily: F.display, fontSize: 18, fontWeight: 700, color: C.textPrimary }}>
            {name}
          </div>
        </div>
        {hasExtraction && (
          <>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: S[3],
                fontFamily: F.body,
                fontSize: 13,
                color: C.textSecondary,
              }}
            >
              {goal && <span>Goal: {goal.replace(/Generate \d+ demos from CFO-level contacts/i, '30 demos/month')}</span>}
              {budget && <span>| Budget: {budget}/mo</span>}
              {timeline && <span>| Timeline: {timeline}</span>}
            </div>
            {channels.length > 0 && (
              <div style={{ fontFamily: F.body, fontSize: 13, color: C.textSecondary }}>
                Channels: {channels.join(' + ')}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: S[2], flexWrap: 'wrap' }}>
              Agents ready: <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><IconCheck color={C.primary} width={14} height={14} /> GTM Strategist</span> · <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><IconCheck color={C.primary} width={14} height={14} /> SDR Agent</span> · <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><IconCheck color={C.primary} width={14} height={14} /> Copywriter</span> · <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><IconCheck color={C.primary} width={14} height={14} /> Meta Agent</span>
            </div>
            <div style={{ fontFamily: F.mono, fontSize: 12, color: C.primary }}>
              Estimated first lead: ~7 days after launch
            </div>
          </>
        )}
        {!hasExtraction && (
          <div style={{ fontFamily: F.body, fontSize: 14, color: C.textSecondary }}>
            Start from scratch — add your details in the campaign wizard.
          </div>
        )}

        {/* Next steps row */}
        <div style={{ display: 'flex', gap: S[3], flexWrap: 'wrap', marginTop: S[2] }}>
          <button
            type="button"
            style={{ ...btn.secondary, fontSize: 13 }}
            onClick={() => onGoToCampaign?.()}
          >
            Review campaign details
          </button>
          <button
            type="button"
            style={{ ...btn.secondary, fontSize: 13 }}
            onClick={() => toast.info('Prospect list upload — coming soon')}
          >
            Upload prospect list
          </button>
          <button
            type="button"
            style={{ ...btn.secondary, fontSize: 13 }}
            onClick={() => onGoToDashboard?.()}
          >
            Go to dashboard
          </button>
        </div>

        {/* Primary CTA */}
        <button
          type="button"
          style={{ ...btn.primary, width: '100%', marginTop: S[2] }}
          onClick={() => onGoToCampaign?.()}
        >
          Take me to my campaign →
        </button>
        <button
          type="button"
          style={{
            ...btn.ghost,
            alignSelf: 'center',
            fontFamily: F.body,
            fontSize: 13,
            color: C.textMuted,
          }}
          onClick={() => onGoToDashboard?.()}
        >
          Or skip to dashboard →
        </button>
      </div>
    </div>
  );
}
