/**
 * Steps with checkmarks; progress bar; "6+ hours manually" line. Runs then onComplete().
 */
import { useEffect, useState } from 'react';
import { C, F, R, S } from '../../tokens';
import { Z } from '../../tokens';
import { GENERATION_STEPS } from '../../data/boardReportMock';

const DURATION_MS = 6000;

export default function ARIAGenerateAnimation({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(100, (elapsed / DURATION_MS) * 100);
      setProgress(p);
      const step = Math.min(Math.floor((p / 100) * GENERATION_STEPS.length), GENERATION_STEPS.length - 1);
      setCurrentStep(step);
      if (p >= 100) {
        clearInterval(interval);
        onComplete?.();
      }
    }, 100);
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
      <div style={{ fontFamily: F.display, fontSize: '20px', fontWeight: 700, color: C.textPrimary, marginBottom: S[2] }}>
        Generating board report
      </div>
      <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textMuted, marginBottom: S[6] }}>
        Typically 6+ hours manually — Freya does it in under a minute.
      </div>
      <div style={{ width: '100%', maxWidth: 400, marginBottom: S[6] }}>
        {GENERATION_STEPS.map((step, i) => (
          <div
            key={step.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: S[3],
              padding: S[2],
              color: i <= currentStep ? C.primary : C.textMuted,
              fontFamily: F.body,
              fontSize: '14px',
            }}
          >
            <span style={{ width: 24, textAlign: 'center' }}>{i < currentStep ? '✓' : i === currentStep ? '…' : '○'}</span>
            {step.label}
          </div>
        ))}
      </div>
      <div style={{ width: '100%', maxWidth: 400, height: 8, backgroundColor: C.surface3, borderRadius: R.pill, overflow: 'hidden' }}>
        <div style={{ width: `${progress}%`, height: '100%', backgroundColor: C.primary, borderRadius: R.pill, transition: 'width 0.1s ease' }} />
      </div>
    </div>
  );
}
