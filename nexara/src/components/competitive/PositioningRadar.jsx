import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useMemo } from 'react';
import { C, F, R, S } from '../../tokens';
import { POSITIONING_DIMENSIONS, POSITIONING_KEYS, POSITIONING_SCORES } from '../../data/competitors';

// Hex for Recharts SVG (CSS vars don't resolve in all envs)
const COLORS = {
  nexara: '#3DDC84',
  apollo: '#5EEAD4',
  hubspot: '#8B7CF6',
  clay: '#F5C842',
  instantly: '#FF9F7A',
};
const BORDER = '#1C2E22';
const TEXT_SECONDARY = '#6B9478';
const TEXT_MUTED = '#3A5242';

const RADAR_COLORS = [
  COLORS.nexara,
  COLORS.apollo,
  COLORS.hubspot,
  COLORS.clay,
  COLORS.instantly,
];

export default function PositioningRadar({ dimensions, scores, insight }) {
  const dims = dimensions || POSITIONING_DIMENSIONS;
  const keys = ['dataQuality', 'easeOfUse', 'aiCapability', 'priceValue', 'support', 'integrations'];
  const scoreMap = scores || POSITIONING_SCORES;

  const chartData = useMemo(() => {
    return dims.map((label, i) => {
      const point = { subject: label, fullMark: 10 };
      Object.keys(scoreMap).forEach((id) => {
        const s = scoreMap[id];
        if (s && keys[i]) point[id] = s[keys[i]] ?? 0;
      });
      return point;
    });
  }, [dims, scoreMap, keys]);

  const series = useMemo(() => {
    return Object.keys(scoreMap).map((id) => ({
      id,
      name: scoreMap[id]?.name || id,
      color: COLORS[id] || RADAR_COLORS[Object.keys(scoreMap).indexOf(id) % RADAR_COLORS.length],
    }));
  }, [scoreMap]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[5] }}>
      <div
        style={{
          backgroundColor: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: R.card,
          padding: S[6],
        }}
      >
        <ResponsiveContainer width="100%" height={380}>
          <RadarChart data={chartData} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
            <PolarGrid stroke={BORDER} />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fontFamily: F.body, fontSize: 11, fill: TEXT_SECONDARY }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 10]}
              tick={{ fontFamily: F.mono, fontSize: 10, fill: TEXT_MUTED }}
            />
            {series.map((s) => (
              <Radar
                key={s.id}
                name={s.name}
                dataKey={s.id}
                stroke={s.color}
                fill={s.color}
                fillOpacity={0.15}
                strokeWidth={2}
              />
            ))}
            <Legend
              wrapperStyle={{ paddingTop: S[4] }}
              formatter={(value) => <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textPrimary }}>{value}</span>}
              iconType="circle"
              iconSize={8}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {insight && (
        <div
          style={{
            padding: `${S[3]} ${S[4]}`,
            backgroundColor: 'rgba(61,220,132,0.06)',
            border: `1px solid rgba(61,220,132,0.2)`,
            borderLeft: `3px solid ${C.primary}`,
            borderRadius: R.card,
            fontFamily: F.body,
            fontSize: '13px',
            color: C.textPrimary,
          }}
        >
          {insight}
        </div>
      )}
      {!insight && (
        <div
          style={{
            padding: `${S[3]} ${S[4]}`,
            backgroundColor: 'rgba(61,220,132,0.06)',
            border: `1px solid rgba(61,220,132,0.2)`,
            borderLeft: `3px solid ${C.primary}`,
            borderRadius: R.card,
            fontFamily: F.body,
            fontSize: '13px',
            color: C.textPrimary,
          }}
        >
          NEXARA leads on AI Capability and Integration depth. We&apos;re at parity on Ease of Use — this is where to invest product effort.
        </div>
      )}
    </div>
  );
}
