/**
 * ARIA Campaign Briefer — Session 6.
 * State machine: Input → Generating (ARIABuildAnimation) → Output (BriefOutputDocument). Footer: Approve / Save draft / Start over.
 */
import { useState } from 'react';
import useToast from '../hooks/useToast';
import {
  BRIEFER_EXAMPLE_CHIPS,
  generateBriefFromGoal,
} from '../data/brieferMock';
import GoalInputPanel from '../components/briefer/GoalInputPanel';
import ARIABuildAnimation from '../components/briefer/ARIABuildAnimation';
import BriefOutputDocument from '../components/briefer/BriefOutputDocument';
import { C, F, S } from '../tokens';

const STATE = { INPUT: 'input', GENERATING: 'generating', OUTPUT: 'output' };

export default function ARIACampaignBriefer() {
  const toast = useToast();
  const [state, setState] = useState(STATE.INPUT);
  const [goal, setGoal] = useState('');
  const [brief, setBrief] = useState(null);

  const handleGenerate = () => {
    setState(STATE.GENERATING);
  };

  const handleAnimationComplete = () => {
    setBrief(generateBriefFromGoal(goal));
    setState(STATE.OUTPUT);
  };

  const handleApprove = () => {
    toast.success('Brief approved.');
  };

  const handleSaveDraft = () => {
    toast.success('Draft saved.');
  };

  const handleStartOver = () => {
    setGoal('');
    setBrief(null);
    setState(STATE.INPUT);
  };

  const handleRecalculateBudget = () => {
    toast.info('Freya Recalculate (mock).');
  };

  const handleChecklistToggle = (itemId) => {
    setBrief((prev) => {
      if (!prev?.contentChecklist) return prev;
      return {
        ...prev,
        contentChecklist: prev.contentChecklist.map((item) =>
          item.id === itemId ? { ...item, done: !item.done } : item
        ),
      };
    });
  };

  const handleChecklistGenerate = (item) => {
    toast.info(`Generate with Freya: ${item?.item}`);
  };

  return (
    <div style={{ minHeight: '100%', backgroundColor: C.bg, padding: S[6] }}>
      <div style={{ marginBottom: S[6] }}>
        <h1 style={{ fontFamily: F.display, fontSize: '22px', fontWeight: 700, color: C.textPrimary, margin: `0 0 ${S[2]} 0` }}>
          Freya Campaign Briefer
        </h1>
        <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: 0 }}>
          Describe your campaign goal. Freya generates the full brief: ICP, channels, budget, KPIs, messaging, and content checklist.
        </p>
      </div>

      {state === STATE.INPUT && (
        <GoalInputPanel
          value={goal}
          onChange={setGoal}
          onSubmit={handleGenerate}
          exampleChips={BRIEFER_EXAMPLE_CHIPS}
        />
      )}

      {state === STATE.GENERATING && (
        <ARIABuildAnimation onComplete={handleAnimationComplete} />
      )}

      {state === STATE.OUTPUT && brief && (
        <BriefOutputDocument
          brief={brief}
          onApprove={handleApprove}
          onSaveDraft={handleSaveDraft}
          onStartOver={handleStartOver}
          onRecalculateBudget={handleRecalculateBudget}
          onChecklistToggle={handleChecklistToggle}
          onChecklistGenerate={handleChecklistGenerate}
        />
      )}
    </div>
  );
}
