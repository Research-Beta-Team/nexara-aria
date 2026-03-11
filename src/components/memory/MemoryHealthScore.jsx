/**
 * Memory Health Score — gauge 0–100% from namespaces with ≥3 entries each.
 * 0–25 red, 26–50 amber, 51–75 teal, 76–100 mint.
 */
import { C, F, S } from '../../tokens';

const MIN_ENTRIES_PER_NAMESPACE = 3;
const NAMESPACE_KEYS = ['brand', 'audience', 'campaigns', 'performance'];

function getScore(freyaMemory) {
  if (!freyaMemory) return 0;
  let filled = 0;
  for (const key of NAMESPACE_KEYS) {
    const arr = freyaMemory[key];
    if (Array.isArray(arr) && arr.length >= MIN_ENTRIES_PER_NAMESPACE) filled += 1;
  }
  return Math.round((filled / NAMESPACE_KEYS.length) * 100);
}

function getColor(score) {
  if (score <= 25) return '#FF6E7A';
  if (score <= 50) return '#F5C842';
  if (score <= 75) return '#5EEAD4';
  return '#3DDC84';
}

function getSubtext(score) {
  if (score <= 25) return 'Freya is operating blind';
  if (score <= 50) return 'Freya has partial context';
  if (score <= 75) return 'Freya has good context';
  return 'Freya is fully context-aware';
}

export default function MemoryHealthScore({ freyaMemory }) {
  const score = getScore(freyaMemory);
  const color = getColor(score);
  const circumference = 2 * Math.PI * 36;
  const strokeDash = (score / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: S[1] }}>
      <div style={{ position: 'relative', width: 80, height: 80 }}>
        <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke={C.border}
            strokeWidth="8"
          />
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - strokeDash}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
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
            fontSize: '18px',
            fontWeight: 700,
            color: C.textPrimary,
          }}
        >
          {score}%
        </div>
      </div>
      <span style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: C.textSecondary }}>
        Memory Health
      </span>
      <span style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted }}>
        {getSubtext(score)}
      </span>
    </div>
  );
}
