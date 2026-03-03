import { useState, useEffect, useRef } from 'react';
import { C, F, R, S, btn, Z } from '../../tokens';
import useStore from '../../store/useStore';

const DIGEST_STORAGE_KEY = 'aria_digest_shown_date';
const DELAY_MS = 2000;
const AUTO_DISMISS_MS = 15000;

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getDigestShownDate() {
  try {
    return localStorage.getItem(DIGEST_STORAGE_KEY) || null;
  } catch {
    return null;
  }
}

function setDigestShownDate() {
  try {
    localStorage.setItem(DIGEST_STORAGE_KEY, todayKey());
  } catch (_) {}
}

const MOCK_BULLETS = [
  '3 replies waiting in your outreach inbox',
  'Campaign CFO Vietnam is pacing at 72% of demo target — needs attention',
  'ARIA has 2 content pieces ready for your approval',
];

/**
 * Solo founder proactive trigger: "60-second brief" card shown once per day
 * on first app load. Mint border, [Open full brief →] opens ARIAWeeklyBrief modal.
 * Auto-dismiss after 15s.
 */
export default function ARIAProactiveCard() {
  const currentRole = useStore((s) => s.currentRole);
  const setAriaBriefModalOpen = useStore((s) => s.setAriaBriefModalOpen);

  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    if (currentRole !== 'founder') return;

    const shown = getDigestShownDate();
    const today = todayKey();
    if (shown === today) return;

    const t = setTimeout(() => {
      if (!mountedRef.current) return;
      setVisible(true);
      setDigestShownDate();
    }, DELAY_MS);

    return () => {
      mountedRef.current = false;
      clearTimeout(t);
    };
  }, [currentRole]);

  useEffect(() => {
    if (!visible) return;
    timerRef.current = setTimeout(() => {
      setVisible(false);
    }, AUTO_DISMISS_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible]);

  const handleOpenFullBrief = () => {
    setAriaBriefModalOpen(true);
    setVisible(false);
  };

  if (currentRole !== 'founder' || !visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: S[6],
        left: S[6],
        right: S[6],
        maxWidth: '420px',
        backgroundColor: C.surface,
        border: `2px solid ${C.primary}`,
        borderRadius: R.card,
        boxShadow: `0 8px 32px rgba(0,0,0,0.4)`,
        zIndex: Z.overlay,
        padding: S[5],
        animation: 'proactiveSlide 0.3s ease',
      }}
    >
      <style>{`
        @keyframes proactiveSlide {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <h3 style={{
        fontFamily: F.display,
        fontSize: '15px',
        fontWeight: 700,
        color: C.textPrimary,
        margin: `0 0 ${S[3]}`,
      }}>
        Good morning. Here&apos;s your 60-second brief:
      </h3>

      <ul style={{
        margin: `0 0 ${S[4]}`,
        paddingLeft: S[4],
        fontFamily: F.body,
        fontSize: '13px',
        color: C.textSecondary,
        lineHeight: 1.6,
      }}>
        {MOCK_BULLETS.map((bullet, i) => (
          <li key={i} style={{ marginBottom: S[1] }}>{bullet}</li>
        ))}
      </ul>

      <button
        type="button"
        style={{ ...btn.primary, fontSize: '13px' }}
        onClick={handleOpenFullBrief}
      >
        Open full brief →
      </button>
    </div>
  );
}
