import { useState, useEffect } from 'react';
import { C, F, R, S } from '../../tokens';
import { IconCheck } from '../ui/Icons';

const CHANNEL_LABELS = { email: 'Email', linkedin: 'LinkedIn', meta: 'Meta Ads' };

const WIZARD_FIELDS = [
  { key: 'name', label: 'Campaign Name', getValue: (e) => e?.extracted_fields?.find((f) => f.id === 'campaign_name')?.value ?? 'CFO Vietnam Q1 — Textile' },
  { key: 'goal', label: 'Goal', getValue: (e) => (e?.extracted_fields?.find((f) => f.id === 'goal')?.value ?? '').replace(/Generate \d+ demos from CFO-level contacts/i, '30 demos/month') },
  { key: 'target_title', label: 'Target Title', getValue: (e) => e?.extracted_fields?.find((f) => f.id === 'target_title')?.value ?? 'CFO, Finance Director' },
  { key: 'geography', label: 'Geography', getValue: (e) => e?.extracted_fields?.find((f) => f.id === 'geography')?.value ?? 'Vietnam, Bangladesh, India' },
  { key: 'budget', label: 'Budget', getValue: (e) => e?.extracted_fields?.find((f) => f.id === 'budget')?.value ?? '$5,000/month' },
  { key: 'channels', label: 'Channels', getValue: (e) => {
    const ch = e?.extracted_fields?.find((f) => f.id === 'channels')?.value;
    return Array.isArray(ch) ? ch.map((c) => CHANNEL_LABELS[c] || c).join(', ') : (ch ?? 'Email, LinkedIn, Meta Ads');
  }},
  { key: 'timeline', label: 'Timeline', getValue: (e) => e?.extracted_fields?.find((f) => f.id === 'timeline')?.value ?? '12 weeks starting Feb 1' },
];

const DELAY_PER_FIELD_MS = 200;

export default function CampaignAutoFillDemo({ extraction, onComplete }) {
  const [filledCount, setFilledCount] = useState(0);
  const [commentaryIndex, setCommentaryIndex] = useState(0);
  const commentary = extraction?.aria_commentary ?? [];

  useEffect(() => {
    if (filledCount < WIZARD_FIELDS.length) {
      const t = setTimeout(() => setFilledCount((c) => c + 1), DELAY_PER_FIELD_MS);
      return () => clearTimeout(t);
    }
    // All fields filled; show commentary catch-up then complete
    const t = setTimeout(() => onComplete?.(), 1200);
    return () => clearTimeout(t);
  }, [filledCount, onComplete]);

  useEffect(() => {
    if (commentaryIndex >= commentary.length) return;
    const t = setTimeout(() => setCommentaryIndex((i) => i + 1), 400);
    return () => clearTimeout(t);
  }, [commentaryIndex, commentary.length]);

  return (
    <div style={{ width: '100%', maxWidth: 1000, display: 'flex', flexDirection: 'column', gap: S[6] }}>
      <style>{`
        @keyframes ariaDots {
          0%, 20% { content: '.'; }
          40% { content: '..'; }
          60%, 100% { content: '...'; }
        }
      `}</style>
      <h2
        style={{
          fontFamily: F.display,
          fontSize: 22,
          fontWeight: 700,
          color: C.textPrimary,
          margin: 0,
        }}
      >
        ARIA is building your campaign
        <span style={{ opacity: 0.7, animation: 'ariaDots 1.5s steps(1) infinite' }}>...</span>
      </h2>

      <div style={{ display: 'flex', gap: S[8], alignItems: 'flex-start' }}>
        {/* Left — wizard preview (60%) */}
        <div style={{ flex: '0 0 60%', maxWidth: 560 }}>
          <div
            style={{
              backgroundColor: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: R.card,
              padding: S[5],
              display: 'flex',
              flexDirection: 'column',
              gap: S[4],
            }}
          >
            {WIZARD_FIELDS.map((field, i) => {
              const isFilled = i < filledCount;
              const value = field.getValue(extraction);
              const isLast = i === filledCount - 1;

              return (
                <div
                  key={field.key}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: S[1],
                    opacity: isFilled ? 1 : 0.5,
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                    <span style={{ fontFamily: F.body, fontSize: 12, color: C.textMuted }}>
                      {field.label}
                    </span>
                    {isFilled && (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          fontFamily: F.mono,
                          fontSize: 10,
                          color: C.primary,
                          backgroundColor: C.primaryGlow,
                          padding: '2px 6px',
                          borderRadius: R.pill,
                        }}
                      >
                        <IconCheck color={C.primary} width={10} height={10} />
                        ARIA
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      fontFamily: F.body,
                      fontSize: 14,
                      color: C.textPrimary,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    {isFilled ? value : ''}
                    {isLast && (
                      <span
                        style={{
                          width: 2,
                          height: 14,
                          backgroundColor: C.primary,
                          animation: 'caret-blink 1s step-end infinite',
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right — ARIA commentary (40%) */}
        <div
          style={{
            flex: '0 0 40%',
            maxWidth: 360,
            display: 'flex',
            flexDirection: 'column',
            gap: S[2],
          }}
        >
          <span
            style={{
              fontFamily: F.body,
              fontSize: 12,
              fontWeight: 600,
              color: C.textMuted,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            ARIA
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
            {commentary.slice(0, commentaryIndex + 1).map((line, i) => (
              <div
                key={i}
                style={{
                  padding: S[3],
                  borderRadius: R.md,
                  backgroundColor: C.surface2,
                  border: `1px solid ${C.border}`,
                  fontFamily: F.body,
                  fontSize: 13,
                  color: C.textSecondary,
                  lineHeight: 1.4,
                  animation: 'fadeIn 0.3s ease',
                }}
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes caret-blink { 50% { opacity: 0; } }
      `}</style>
    </div>
  );
}
