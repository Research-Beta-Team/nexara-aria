/**
 * Overlay with ARIA orb, streaming lines, progress bar. Runs ~2–3s then onComplete().
 */
import { useEffect, useState } from 'react';
import { C, F, R, S } from '../../tokens';
import { Z } from '../../tokens';

const DURATION_MS = 2500;
const LINES = [
  'Analyzing goal and ICP…',
  'Mapping channels and budget…',
  'Building KPI projections…',
  'Drafting messaging framework…',
  'Generating content checklist…',
  'Brief ready.',
];

export default function ARIABuildAnimation({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [activeLine, setActiveLine] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(100, (elapsed / DURATION_MS) * 100);
      setProgress(p);
      const lineIndex = Math.min(Math.floor((p / 100) * LINES.length), LINES.length - 1);
      setActiveLine(lineIndex);
      if (p >= 100) {
        clearInterval(interval);
        onComplete?.();
      }
    }, 80);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: C.overlayHeavy,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: Z.modal,
        padding: S[6],
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          backgroundColor: C.primaryGlow,
          border: `3px solid ${C.primary}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: F.display,
          fontSize: '32px',
          fontWeight: 700,
          color: C.primary,
          marginBottom: S[6],
          animation: 'ariaBrieferPulse 1.2s ease-in-out infinite',
        }}
      >
        A
      </div>
      <style>{`@keyframes ariaBrieferPulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.85; transform: scale(0.98); } }`}</style>
      <div style={{ marginBottom: S[4], minHeight: 24 }}>
        {LINES.slice(0, activeLine + 1).map((line, i) => (
          <div
            key={i}
            style={{
              fontFamily: F.body,
              fontSize: '14px',
              color: i === activeLine ? C.primary : C.textSecondary,
              marginBottom: S[1],
            }}
          >
            {i === activeLine ? '▸ ' : '✓ '}{line}
          </div>
        ))}
      </div>
      <div
        style={{
          width: '100%',
          maxWidth: 320,
          height: 6,
          backgroundColor: C.surface3,
          borderRadius: R.pill,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            backgroundColor: C.primary,
            borderRadius: R.pill,
            transition: 'width 0.1s ease',
          }}
        />
      </div>
    </div>
  );
}
