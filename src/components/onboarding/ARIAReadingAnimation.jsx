import { useState, useEffect } from 'react';
import { C, F, S } from '../../tokens';
import { ARIA_READING_STATES } from '../../data/onboardingMock';

export default function ARIAReadingAnimation({ fileName, onComplete }) {
  const [stateIndex, setStateIndex] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      onComplete?.();
    }, 3000);
    return () => clearTimeout(t);
  }, [onComplete]);

  useEffect(() => {
    const now = () => Date.now();
    const start = now();
    const intervals = ARIA_READING_STATES.map((s, i) =>
      setTimeout(() => setStateIndex(i), s.endMs)
    );
    return () => intervals.forEach(clearTimeout);
  }, []);

  const currentText = ARIA_READING_STATES[stateIndex]?.text ?? ARIA_READING_STATES[0].text;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: C.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes ariaRingRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes ariaOrbGlow {
          0%, 100% { opacity: 1; box-shadow: 0 0 30px rgba(61,220,132,0.4); }
          50% { opacity: 0.85; box-shadow: 0 0 50px rgba(61,220,132,0.5); }
        }
        @keyframes ariaParticleUp {
          from { opacity: 0; transform: translateY(0) scale(0.5); }
          50% { opacity: 0.6; }
          to { opacity: 0; transform: translateY(-80px) scale(0); }
        }
      `}</style>

      {/* Grid background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(${C.border} 1px, transparent 1px),
            linear-gradient(90deg, ${C.border} 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
          opacity: 0.15,
        }}
      />

      {/* File name card — top left */}
      {fileName && (
        <div
          style={{
            position: 'absolute',
            top: S[6],
            left: S[6],
            padding: `${S[2]} ${S[4]}`,
            borderRadius: 8,
            backgroundColor: C.surface,
            border: `1px solid ${C.border}`,
            fontFamily: F.mono,
            fontSize: 13,
            color: C.textSecondary,
          }}
        >
          {fileName}
        </div>
      )}

      {/* Particles */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            bottom: '40%',
            left: `calc(50% - ${20 + i * 16}px)`,
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: C.primary,
            opacity: 0.4,
            animation: `ariaParticleUp 2s ease-out ${i * 0.4}s infinite`,
          }}
        />
      ))}

      {/* Center: orb + ring */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: S[6] }}>
        <div style={{ position: 'relative' }}>
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            style={{
              animation: 'ariaRingRotate 8s linear infinite',
              position: 'absolute',
              top: -10,
              left: -10,
            }}
          >
            <circle
              cx="40"
              cy="40"
              r="38"
              fill="none"
              stroke={C.primary}
              strokeWidth="1.5"
              strokeDasharray="6 4"
              opacity={0.6}
            />
          </svg>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              backgroundColor: C.primary,
              position: 'relative',
              animation: 'ariaOrbGlow 1.5s ease-in-out infinite',
              boxShadow: `0 0 30px rgba(61,220,132,0.4)`,
            }}
          />
        </div>
        <div
          style={{
            fontFamily: F.body,
            fontSize: 16,
            color: C.textSecondary,
            minHeight: 24,
            transition: 'opacity 0.3s ease',
          }}
        >
          {currentText}
        </div>
      </div>
    </div>
  );
}
