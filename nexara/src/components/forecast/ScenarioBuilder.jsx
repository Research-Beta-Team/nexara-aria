import { useState, useMemo } from 'react';
import { C, F, R, S, btn, badge } from '../../tokens';

function formatCurrency(value) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

export default function ScenarioBuilder({ levers = [], baseValue = 0, onApply }) {
  const [selectedIds, setSelectedIds] = useState(new Set());

  const totalWithLevers = useMemo(() => {
    const add = levers.filter((l) => selectedIds.has(l.id)).reduce((s, l) => s + (l.impactValue || 0), 0);
    return baseValue + add;
  }, [levers, selectedIds, baseValue]);

  const toggle = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[5] }}>
      <div>
        <h3 style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary, margin: '0 0 4px' }}>
          What-if analysis
        </h3>
        <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: 0 }}>
          Toggle levers to model how changes affect your forecast
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
        {levers.map((l) => {
          const on = selectedIds.has(l.id);
          return (
            <div
              key={l.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: S[4],
                padding: S[4],
                backgroundColor: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: R.card,
              }}
            >
              <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary, flex: 1 }}>{l.lever}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
                <span style={{ ...badge.base, ...badge.muted }}>{l.impact}</span>
                <span style={{ ...badge.base, ...badge.amber, fontSize: '10px' }}>{l.confidence}%</span>
                <button
                  style={{
                    width: 40,
                    height: 22,
                    borderRadius: 11,
                    border: 'none',
                    backgroundColor: on ? C.primary : C.surface3,
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                  onClick={() => toggle(l.id)}
                  aria-pressed={on}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: 2,
                      left: on ? 20 : 2,
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      backgroundColor: C.textInverse,
                      transition: 'left 0.2s ease',
                    }}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          padding: S[4],
          backgroundColor: C.surface2,
          border: `1px solid ${C.border}`,
          borderRadius: R.card,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: S[3],
        }}
      >
        <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
          Current forecast: <strong style={{ color: C.textPrimary }}>{formatCurrency(baseValue)}</strong>
          {' → '}
          with selected levers: <strong style={{ color: C.primary }}>{formatCurrency(totalWithLevers)}</strong>
        </span>
        <button style={{ ...btn.primary, fontSize: '13px' }} onClick={() => onApply?.()}>
          Apply to base forecast
        </button>
      </div>
    </div>
  );
}
