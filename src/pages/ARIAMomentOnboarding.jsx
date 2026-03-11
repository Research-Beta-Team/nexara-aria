import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { C, F, R, S } from '../tokens';
import { MOCK_EXTRACTION_RESULT } from '../data/onboardingMock';
import DropZoneHero from '../components/onboarding/DropZoneHero';
import ARIAReadingAnimation from '../components/onboarding/ARIAReadingAnimation';
import ExtractedPreview from '../components/onboarding/ExtractedPreview';
import CampaignAutoFillDemo from '../components/onboarding/CampaignAutoFillDemo';
import ARIAMomentSuccess from '../components/onboarding/ARIAMomentSuccess';

const STEPS = { WELCOME: 1, READING: 2, EXTRACTED: 3, AUTO_FILL: 4, SUCCESS: 5 };

export default function ARIAMomentOnboarding() {
  const navigate = useNavigate();
  const completeOnboarding = useStore((s) => s.completeOnboarding);
  const setOnboardingExtraction = useStore((s) => s.setOnboardingExtraction);

  const [step, setStep] = useState(STEPS.WELCOME);
  const [droppedFileName, setDroppedFileName] = useState(null);
  const [extraction, setExtraction] = useState(null);

  const handleFileDrop = useCallback((file) => {
    setDroppedFileName(file?.name ?? 'document.pdf');
    setExtraction(MOCK_EXTRACTION_RESULT);
    setOnboardingExtraction(MOCK_EXTRACTION_RESULT);
    setStep(STEPS.READING);
  }, [setOnboardingExtraction]);

  const handleStartFromScratch = useCallback(() => {
    setExtraction(null);
    setOnboardingExtraction(null);
    setStep(STEPS.SUCCESS);
  }, [setOnboardingExtraction]);

  const handleReadingComplete = useCallback(() => setStep(STEPS.EXTRACTED), []);
  const handleExtractedConfirm = useCallback(() => setStep(STEPS.AUTO_FILL), []);
  const handleAutoFillComplete = useCallback(() => setStep(STEPS.SUCCESS), []);

  const handleGoToCampaign = useCallback(() => {
    completeOnboarding();
    navigate('/campaigns/new', { replace: true });
  }, [completeOnboarding, navigate]);

  const handleGoToDashboard = useCallback(() => {
    completeOnboarding();
    navigate('/', { replace: true });
  }, [completeOnboarding, navigate]);

  const handleBackToSetup = useCallback(() => navigate('/onboarding/setup', { replace: true }), [navigate]);
  const handleBackToWelcome = useCallback(() => setStep(STEPS.WELCOME), []);
  const handleBackToReading = useCallback(() => setStep(STEPS.READING), []);
  const handleBackToExtracted = useCallback(() => setStep(STEPS.EXTRACTED), []);

  const handleEdit = useCallback(() => {
    // In prototype, "Let me correct" still advances; could open inline edit later
    setStep(STEPS.AUTO_FILL);
  }, []);

  const screenStyle = {
    minHeight: '100vh',
    width: '100%',
    backgroundColor: C.bg,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: S[6],
    boxSizing: 'border-box',
  };

  // Step 1 — Welcome
  if (step === STEPS.WELCOME) {
    return (
      <div style={screenStyle}>
        <div style={{ position: 'absolute', top: S[6], left: S[6] }}>
          <button
            type="button"
            onClick={handleBackToSetup}
            style={{
              background: 'none',
              border: 'none',
              color: C.textSecondary,
              fontFamily: F.body,
              fontSize: 14,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: S[1],
            }}
          >
            ← Back to setup
          </button>
        </div>
        <style>{`
          @keyframes ariaOrbPulse {
            0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 40px rgba(61,220,132,0.4); }
            50% { opacity: 0.9; transform: scale(1.05); box-shadow: 0 0 60px rgba(61,220,132,0.5); }
          }
        `}</style>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: C.primary,
            marginBottom: S[8],
            animation: 'ariaOrbPulse 2s ease-in-out infinite',
            boxShadow: `0 0 40px rgba(61,220,132,0.4)`,
          }}
        />
        <h1
          style={{
            fontFamily: F.display,
            fontSize: 48,
            fontWeight: 800,
            color: C.textPrimary,
            margin: 0,
            textAlign: 'center',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            maxWidth: 720,
          }}
        >
          Drop your brief. Freya builds your campaign.
        </h1>
        <p
          style={{
            fontFamily: F.body,
            fontSize: 18,
            color: C.textSecondary,
            marginTop: S[4],
            textAlign: 'center',
            maxWidth: 560,
            lineHeight: 1.5,
          }}
        >
          Upload any document — strategy brief, prospect list, competitor research, or
          even a screenshot. Freya reads it, extracts what matters, and builds your
          first GTM campaign automatically.
        </p>
        <div style={{ marginTop: S[8] }}>
          <DropZoneHero
            onFileDrop={handleFileDrop}
            onStartFromBrief={() => handleFileDrop(null)}
            onProspectList={() => handleFileDrop(null)}
            onStartFromScratch={handleStartFromScratch}
          />
        </div>
      </div>
    );
  }

  // Step 2 — Freya reading
  if (step === STEPS.READING) {
    return (
      <ARIAReadingAnimation
        fileName={droppedFileName}
        onComplete={handleReadingComplete}
        onBack={handleBackToWelcome}
      />
    );
  }

  // Step 3 — Extracted preview
  if (step === STEPS.EXTRACTED) {
    return (
      <div style={{ ...screenStyle, justifyContent: 'flex-start', paddingTop: S[8] }}>
        <div style={{ position: 'absolute', top: S[6], left: S[6] }}>
          <button
            type="button"
            onClick={handleBackToReading}
            style={{
              background: 'none',
              border: 'none',
              color: C.textSecondary,
              fontFamily: F.body,
              fontSize: 14,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: S[1],
            }}
          >
            ← Back
          </button>
        </div>
        <ExtractedPreview
          extraction={extraction}
          onConfirm={handleExtractedConfirm}
          onEdit={handleEdit}
        />
      </div>
    );
  }

  // Step 4 — Campaign auto-fill demo
  if (step === STEPS.AUTO_FILL) {
    return (
      <div style={{ ...screenStyle, justifyContent: 'flex-start', paddingTop: S[6] }}>
        <div style={{ position: 'absolute', top: S[6], left: S[6] }}>
          <button
            type="button"
            onClick={handleBackToExtracted}
            style={{
              background: 'none',
              border: 'none',
              color: C.textSecondary,
              fontFamily: F.body,
              fontSize: 14,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: S[1],
            }}
          >
            ← Back
          </button>
        </div>
        <CampaignAutoFillDemo extraction={extraction} onComplete={handleAutoFillComplete} />
      </div>
    );
  }

  // Step 5 — Success
  return (
    <div style={screenStyle}>
      <ARIAMomentSuccess
        extraction={extraction}
        onGoToCampaign={handleGoToCampaign}
        onGoToDashboard={handleGoToDashboard}
      />
    </div>
  );
}
