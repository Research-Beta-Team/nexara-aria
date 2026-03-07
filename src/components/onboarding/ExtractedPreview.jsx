import { useState } from 'react';
import { C, F, R, S, btn } from '../../tokens';
import { IconWarning } from '../ui/Icons';

const CHANNEL_LABELS = { email: 'Email', linkedin: 'LinkedIn', meta: 'Meta Ads' };

function FieldChip({ field, onEdit }) {
  const isLowConfidence = field.confidence < 70;
  const displayValue = Array.isArray(field.value)
    ? field.value.map((v) => CHANNEL_LABELS[v] || v).join(', ')
    : String(field.value);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: S[3],
        padding: S[3],
        borderRadius: R.md,
        backgroundColor: C.surface2,
        border: `1px solid ${C.border}`,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2], flexWrap: 'wrap' }}>
          <span style={{ fontFamily: F.body, fontSize: 12, color: C.textMuted }}>
            {field.label}
          </span>
          {isLowConfidence && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: S[1],
                fontFamily: F.mono,
                fontSize: 10,
                color: C.amber,
                backgroundColor: C.amberDim,
                padding: '2px 6px',
                borderRadius: R.pill,
              }}
            >
              <IconWarning color={C.amber} width={12} height={12} />
              Low confidence
            </span>
          )}
        </div>
        <div style={{ fontFamily: F.body, fontSize: 14, color: C.textPrimary, marginTop: S[1] }}>
          {displayValue}
        </div>
      </div>
      <button
        type="button"
        onClick={() => onEdit?.(field)}
        style={{
          ...btn.ghost,
          padding: S[1],
          flexShrink: 0,
        }}
        title="Edit"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ color: C.textMuted }}>
          <path
            d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

export default function ExtractedPreview({ extraction, onConfirm, onEdit }) {
  const [unknownExpanded, setUnknownExpanded] = useState(false);

  if (!extraction) return null;

  const { confidence, processing_time, extracted_fields, unknown_fields } = extraction;

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 900,
        display: 'grid',
        gridTemplateColumns: '1fr 280px',
        gap: S[8],
        alignItems: 'start',
      }}
    >
      {/* Left column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
        <h2
          style={{
            fontFamily: F.display,
            fontSize: 22,
            fontWeight: 700,
            color: C.textPrimary,
            margin: 0,
          }}
        >
          Freya extracted this from your document
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
          <span
            style={{
              fontFamily: F.mono,
              fontSize: 12,
              fontWeight: 600,
              color: C.primary,
              backgroundColor: C.primaryGlow,
              padding: `${S[1]} ${S[3]}`,
              borderRadius: R.pill,
            }}
          >
            {confidence}% confidence · {processing_time} seconds
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
          {extracted_fields.map((field) => (
            <FieldChip key={field.id} field={field} onEdit={onEdit} />
          ))}
        </div>

        {/* Unknown fields expandable */}
        {unknown_fields?.length > 0 && (
          <div
            style={{
              border: `1px solid ${C.border}`,
              borderRadius: R.md,
              overflow: 'hidden',
              backgroundColor: C.surface2,
            }}
          >
            <button
              type="button"
              onClick={() => setUnknownExpanded((e) => !e)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: S[3],
                background: 'none',
                border: 'none',
                color: C.textSecondary,
                fontFamily: F.body,
                fontSize: 13,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span>
                {unknown_fields.length} items Freya couldn&apos;t determine
              </span>
              <span style={{ transform: unknownExpanded ? 'rotate(180deg)' : 'rotate(0)' }}>
                ▼
              </span>
            </button>
            {unknownExpanded && (
              <div style={{ padding: S[3], paddingTop: 0, borderTop: `1px solid ${C.border}` }}>
                {unknown_fields.map((u) => (
                  <div
                    key={u.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: S[2],
                      fontFamily: F.body,
                      fontSize: 13,
                      color: C.textSecondary,
                    }}
                  >
                    <span>{u.label}</span>
                    <span style={{ fontFamily: F.mono, fontSize: 11, color: C.textMuted }}>
                      Freya will use defaults
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bottom actions */}
        <div style={{ display: 'flex', gap: S[3], marginTop: S[4] }}>
          <button type="button" style={btn.primary} onClick={() => onConfirm?.()}>
            These look right — build my campaign →
          </button>
          <button type="button" style={btn.secondary} onClick={() => onEdit?.()}>
            Let me correct some details
          </button>
        </div>
      </div>

      {/* Right column — confidence meter + citations */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[5] }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: S[2] }}>
          <div
            style={{
              position: 'relative',
              width: 140,
              height: 140,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx="70"
                cy="70"
                r="60"
                fill="none"
                stroke={C.border}
                strokeWidth="10"
              />
              <circle
                cx="70"
                cy="70"
                r="60"
                fill="none"
                stroke={C.primary}
                strokeWidth="10"
                strokeDasharray={`${(confidence / 100) * 377} 377`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 0.5s ease' }}
              />
            </svg>
            <span
              style={{
                position: 'absolute',
                fontFamily: F.mono,
                fontSize: 28,
                fontWeight: 700,
                color: C.textPrimary,
              }}
            >
              {confidence}%
            </span>
          </div>
          <span style={{ fontFamily: F.body, fontSize: 12, color: C.textMuted }}>
            Overall confidence
          </span>
        </div>
        <div>
          <h3
            style={{
              fontFamily: F.body,
              fontSize: 12,
              fontWeight: 600,
              color: C.textMuted,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              margin: 0,
              marginBottom: S[2],
            }}
          >
            Source citations
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
            {extracted_fields.slice(0, 3).map((f) => (
              <div
                key={f.id}
                style={{
                  padding: S[2],
                  borderRadius: R.sm,
                  backgroundColor: C.surface3,
                  fontFamily: F.body,
                  fontSize: 11,
                  color: C.textSecondary,
                }}
              >
                {f.source}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
