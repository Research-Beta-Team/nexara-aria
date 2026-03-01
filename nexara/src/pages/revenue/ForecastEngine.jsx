import { useState } from 'react';
import useToast from '../../hooks/useToast';
import { C, F, R, S, btn, sectionHeading } from '../../tokens';
import {
  FORECAST_SCENARIOS,
  MONTHLY_FORECAST,
  SCENARIO_LEVERS,
  COHORT_DATA,
  FORECAST_RISKS,
} from '../../data/forecast';
import RevenueWaterfall from '../../components/forecast/RevenueWaterfall';
import ScenarioBuilder from '../../components/forecast/ScenarioBuilder';
import CohortAnalysis from '../../components/forecast/CohortAnalysis';
import ForecastInsights from '../../components/forecast/ForecastInsights';

const COHORT_INSIGHT =
  'Manufacturing/APAC segment has 3× better LTV:CAC than E-commerce. Consider shifting 30% of budget to this segment.';

function formatCurrency(value) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

export default function ForecastEngine() {
  const [activeScenarioId, setActiveScenarioId] = useState('base');
  const toast = useToast();

  return (
    <div
      style={{
        padding: S[6],
        display: 'flex',
        flexDirection: 'column',
        gap: S[6],
        height: '100%',
        minHeight: 0,
        backgroundColor: C.bg,
        overflowY: 'auto',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: S[3] }}>
        <div>
          <h1 style={{ ...sectionHeading, fontSize: '22px', letterSpacing: '-0.02em', margin: 0 }}>
            Revenue Forecast — Q1 2026
          </h1>
          <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
            ARIA confidence: 72% · Based on 18 open deals + historical data
          </span>
        </div>
        <div style={{ display: 'flex', gap: S[2] }}>
          <button style={{ ...btn.secondary, fontSize: '13px' }} onClick={() => toast.success('Forecast exported')}>
            Export forecast
          </button>
          <button style={{ ...btn.secondary, fontSize: '13px' }} onClick={() => toast.info('Share link copied')}>
            Share with advisor
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: S[4], flexWrap: 'wrap' }}>
        {FORECAST_SCENARIOS.map((s) => {
          const active = activeScenarioId === s.id;
          const borderStyle =
            s.id === 'conservative'
              ? { border: `2px solid ${C.border}` }
              : s.id === 'base'
                ? { border: `2px solid ${C.secondary}` }
                : { border: `2px dashed ${C.border}` };
          return (
            <button
              key={s.id}
              type="button"
              style={{
                flex: '1 1 160px',
                padding: S[5],
                backgroundColor: active ? C.surface2 : C.surface,
                ...borderStyle,
                borderRadius: R.card,
                cursor: 'pointer',
                textAlign: 'left',
                position: 'relative',
              }}
              onClick={() => setActiveScenarioId(s.id)}
            >
              {s.recommended && (
                <span
                  style={{
                    position: 'absolute',
                    top: S[2],
                    right: S[2],
                    fontFamily: F.mono,
                    fontSize: '10px',
                    fontWeight: 700,
                    color: C.secondary,
                    backgroundColor: 'rgba(94,234,212,0.12)',
                    padding: '2px 6px',
                    borderRadius: R.pill,
                  }}
                >
                  ARIA Recommended
                </span>
              )}
              <div style={{ fontFamily: F.mono, fontSize: '24px', fontWeight: 700, color: C.textPrimary, marginBottom: 4 }}>
                {formatCurrency(s.value)}
              </div>
              <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontFamily: F.mono, fontSize: '11px', color: C.textSecondary }}>{s.confidence}% confidence</div>
              <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, marginTop: S[2] }}>{s.basis}</div>
            </button>
          );
        })}
      </div>

      <section>
        <RevenueWaterfall data={MONTHLY_FORECAST} />
        <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, marginTop: S[3], marginBottom: 0 }}>
          On track to hit base scenario if 3 at-risk deals progress
        </p>
      </section>

      <section style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card, padding: S[6] }}>
        <ScenarioBuilder
          levers={SCENARIO_LEVERS}
          baseValue={380000}
          onApply={() => toast.info('Levers applied to base forecast')}
        />
      </section>

      <section>
        <CohortAnalysis cohorts={COHORT_DATA} insight={COHORT_INSIGHT} />
      </section>

      <section>
        <ForecastInsights risks={FORECAST_RISKS} toast={toast} />
      </section>
    </div>
  );
}
