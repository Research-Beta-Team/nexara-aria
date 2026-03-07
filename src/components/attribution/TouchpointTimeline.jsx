/**
 * Deal selector + horizontal timeline of touchpoints (email, ad, content, website, SDR, demo) with weights and labels.
 */
import { useState } from 'react';
import { C, F, R, S } from '../../tokens';
import { DEALS_WITH_JOURNEY, TOUCHPOINT_TYPES } from '../../data/attributionMock';

const TYPE_COLORS = {
  email: C.secondary,
  ad: '#4285F4',
  content: C.primary,
  website: C.amber,
  sdr: '#A78BFA',
  demo: C.primary,
};

export default function TouchpointTimeline({ deals = DEALS_WITH_JOURNEY }) {
  const [selectedDealId, setSelectedDealId] = useState(deals[0]?.id);
  const deal = deals.find((d) => d.id === selectedDealId) || deals[0];
  const touchpoints = deal?.touchpoints || [];

  return (
    <div
      style={{
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
        padding: S[4],
      }}
    >
      <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary, marginBottom: S[3] }}>
        Deal journey
      </div>
      <select
        value={selectedDealId}
        onChange={(e) => setSelectedDealId(e.target.value)}
        style={{
          width: '100%',
          maxWidth: 320,
          padding: `${S[2]} ${S[3]}`,
          fontFamily: F.body,
          fontSize: '13px',
          color: C.textPrimary,
          backgroundColor: C.surface2,
          border: `1px solid ${C.border}`,
          borderRadius: R.input,
          outline: 'none',
          marginBottom: S[4],
        }}
      >
        {deals.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name} — ${(d.value / 1000).toFixed(0)}K · {d.stage}
          </option>
        ))}
      </select>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 0,
          overflowX: 'auto',
          paddingBottom: S[2],
          ...{ scrollbarWidth: 'thin' },
        }}
      >
        {touchpoints.map((tp, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: 100,
                padding: S[2],
                backgroundColor: C.surface2,
                border: `1px solid ${C.border}`,
                borderRadius: R.md,
                marginRight: i < touchpoints.length - 1 ? S[2] : 0,
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: R.full,
                  backgroundColor: TYPE_COLORS[tp.type] || C.textMuted,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: F.mono,
                  fontSize: '10px',
                  fontWeight: 700,
                  color: C.textInverse,
                  marginBottom: S[1],
                }}
              >
                {tp.weight}%
              </span>
              <span style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: C.textPrimary }}>
                {TOUCHPOINT_TYPES[tp.type]?.label || tp.type}
              </span>
              <span style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted, textAlign: 'center' }}>
                {tp.label}
              </span>
              <span style={{ fontFamily: F.mono, fontSize: '9px', color: C.textMuted }}>{tp.at}</span>
            </div>
            {i < touchpoints.length - 1 && (
              <div
                style={{
                  width: 16,
                  height: 2,
                  backgroundColor: C.border,
                  flexShrink: 0,
                  marginRight: S[2],
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
