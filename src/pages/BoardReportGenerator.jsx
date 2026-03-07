/**
 * Board Report Generator — Session 8.
 * States: Configure (ReportConfigPanel + outline) → Generating (ARIAGenerateAnimation) → Preview (slide nav, ReportPreview, NarrativeEditor, ExportPanel).
 */
import { useState } from 'react';
import useToast from '../hooks/useToast';
import {
  DEFAULT_CONFIG,
  SLIDE_TYPES,
  BOARD_REPORT_SLIDES,
} from '../data/boardReportMock';
import ReportConfigPanel from '../components/board/ReportConfigPanel';
import ARIAGenerateAnimation from '../components/board/ARIAGenerateAnimation';
import ReportPreview from '../components/board/ReportPreview';
import NarrativeEditor from '../components/board/NarrativeEditor';
import ExportPanel from '../components/board/ExportPanel';
import { C, F, R, S } from '../tokens';

const STATE = { CONFIGURE: 'configure', GENERATING: 'generating', PREVIEW: 'preview' };

export default function BoardReportGenerator() {
  const toast = useToast();
  const [state, setState] = useState(STATE.CONFIGURE);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [slides] = useState(BOARD_REPORT_SLIDES);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const activeSlide = slides[activeSlideIndex] || slides[0];

  const handleGenerate = () => setState(STATE.GENERATING);
  const handleGenerationComplete = () => setState(STATE.PREVIEW);
  const handleRegenerate = () => toast.info('Regenerate narrative (mock).');
  const handleAccepted = () => toast.success('Narrative accepted.');
  const handleExportPdf = () => toast.success('Downloading PDF.');
  const handleExportPptx = () => toast.success('Downloading PPTX.');
  const handleShareLink = () => toast.info('Share link (mock).');
  const handleEmail = () => toast.info('Email report (mock).');

  return (
    <div style={{ minHeight: '100%', backgroundColor: C.bg, padding: S[6] }}>
      <div style={{ marginBottom: S[6] }}>
        <h1 style={{ fontFamily: F.display, fontSize: '22px', fontWeight: 700, color: C.textPrimary, margin: `0 0 ${S[2]} 0` }}>
          Board Report Generator
        </h1>
        <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: 0 }}>
          Freya auto-generates a quarterly board-ready marketing report. Export to PDF and PPTX.
        </p>
      </div>

      {state === STATE.CONFIGURE && (
        <div style={{ display: 'flex', gap: S[6] }}>
          <div style={{ width: 380, flexShrink: 0 }}>
            <ReportConfigPanel config={config} onChange={setConfig} onGenerate={handleGenerate} />
          </div>
          <div
            style={{
              flex: 1,
              padding: S[6],
              backgroundColor: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: R.card,
            }}
          >
            <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary, marginBottom: S[4] }}>
              Report outline
            </div>
            <ol style={{ margin: 0, paddingLeft: S[6], fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
              {(config.sections || []).map((id) => {
                const slide = SLIDE_TYPES.find((s) => s.id === id);
                return <li key={id}>{slide?.label || id}</li>;
              })}
            </ol>
          </div>
        </div>
      )}

      {state === STATE.GENERATING && (
        <ARIAGenerateAnimation onComplete={handleGenerationComplete} />
      )}

      {state === STATE.PREVIEW && (
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 320px', gap: S[6] }}>
          <div
            style={{
              padding: S[4],
              backgroundColor: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: R.card,
              height: 'fit-content',
            }}
          >
            <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, marginBottom: S[3] }}>
              Slides
            </div>
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveSlideIndex(i)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: S[2],
                  marginBottom: S[1],
                  fontFamily: F.body,
                  fontSize: '12px',
                  color: activeSlideIndex === i ? C.primary : C.textSecondary,
                  backgroundColor: activeSlideIndex === i ? C.primaryGlow : 'transparent',
                  border: 'none',
                  borderRadius: R.button,
                  cursor: 'pointer',
                }}
              >
                {i + 1}. {slide.title}
              </button>
            ))}
          </div>
          <div>
            <ReportPreview slide={activeSlide} />
            <div style={{ marginTop: S[4] }}>
              <NarrativeEditor
                narrative={activeSlide?.narrative}
                onRegenerate={handleRegenerate}
                onAccepted={handleAccepted}
              />
            </div>
          </div>
          <div>
            <ExportPanel
              onExportPdf={handleExportPdf}
              onExportPptx={handleExportPptx}
              onShareLink={handleShareLink}
              onEmail={handleEmail}
            />
          </div>
        </div>
      )}
    </div>
  );
}
