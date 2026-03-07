/**
 * 4 cards: Data Quality Score ring, Auto-Enriched Today, Duplicates Pending, Missing Data Alerts.
 */
import { C, F, R, S } from '../../tokens';

function ScoreRing({ score, size = 64 }) {
  const r = (size - 8) / 2;
  const circumference = 2 * Math.PI * r;
  const stroke = (score / 100) * circumference;
  const color = score >= 75 ? C.primary : score >= 50 ? C.amber : C.red;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.surface3} strokeWidth="6" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={`${stroke} ${circumference - stroke}`}
          strokeLinecap="round"
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: F.mono,
          fontSize: '14px',
          fontWeight: 700,
          color: C.textPrimary,
        }}
      >
        {score}%
      </div>
    </div>
  );
}

export default function EnrichmentHealthDash({
  dataQualityScore = 0,
  autoEnrichedToday = 0,
  duplicatesPending = 0,
  missingDataAlerts = 0,
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: S[4],
        marginBottom: S[6],
      }}
    >
      <div
        style={{
          padding: S[4],
          backgroundColor: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: R.card,
          display: 'flex',
          alignItems: 'center',
          gap: S[4],
        }}
      >
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <ScoreRing score={dataQualityScore} />
        </div>
        <div>
          <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, textTransform: 'uppercase' }}>
            Data Quality Score
          </div>
          <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>Enrichment coverage</div>
        </div>
      </div>
      <div style={{ padding: S[4], backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card }}>
        <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, textTransform: 'uppercase', marginBottom: S[2] }}>
          Auto-Enriched Today
        </div>
        <div style={{ fontFamily: F.mono, fontSize: '28px', fontWeight: 700, color: C.primary }}>{autoEnrichedToday}</div>
      </div>
      <div style={{ padding: S[4], backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card }}>
        <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, textTransform: 'uppercase', marginBottom: S[2] }}>
          Duplicates Pending
        </div>
        <div style={{ fontFamily: F.mono, fontSize: '28px', fontWeight: 700, color: C.amber }}>{duplicatesPending}</div>
      </div>
      <div style={{ padding: S[4], backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card }}>
        <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, textTransform: 'uppercase', marginBottom: S[2] }}>
          Missing Data Alerts
        </div>
        <div style={{ fontFamily: F.mono, fontSize: '28px', fontWeight: 700, color: duplicatesPending ? C.red : C.textPrimary }}>{missingDataAlerts}</div>
      </div>
    </div>
  );
}
