// Skeleton.jsx — animated placeholder for loading states
import { C, R, S } from '../../tokens';

export function Skeleton({ width = '100%', height = '16px', radius = '6px', style = {} }) {
  return (
    <div style={{
      width,
      height,
      borderRadius: radius,
      background: `linear-gradient(90deg, ${C.surface2} 25%, ${C.surface3} 50%, ${C.surface2} 75%)`,
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
      flexShrink: 0,
      ...style,
    }} />
  );
}

export function SkeletonCard({ lines = 3, style = {} }) {
  return (
    <div style={{
      padding: S[4],
      borderRadius: R.card,
      border: `1px solid ${C.border}`,
      backgroundColor: C.surface,
      ...style,
    }}>
      <Skeleton height="20px" width="60%" style={{ marginBottom: '12px' }} />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height="14px"
          width={i === lines - 1 ? '40%' : '100%'}
          style={{ marginBottom: '8px' }}
        />
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 4, cols = 4 }) {
  return (
    <div style={{
      border: `1px solid ${C.border}`,
      borderRadius: R.card,
      overflow: 'hidden',
      backgroundColor: C.surface,
    }}>
      {/* Header row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: S[3],
        padding: `${S[3]} ${S[4]}`,
        borderBottom: `1px solid ${C.border}`,
        backgroundColor: C.surface2,
      }}>
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} height="12px" width="70%" />
        ))}
      </div>
      {/* Data rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: S[3],
            padding: `${S[3]} ${S[4]}`,
            borderBottom: rowIdx < rows - 1 ? `1px solid ${C.border}` : 'none',
          }}
        >
          {Array.from({ length: cols }).map((_, colIdx) => (
            <Skeleton key={colIdx} height="14px" width={colIdx === 0 ? '85%' : '60%'} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Skeleton;
