import { C, F, R, S, btn, Z } from '../../tokens';
import { PLAYBOOK_ICON_MAP, IconClipboard, IconDocument } from '../ui/Icons';

const COLOR_MAP = {
  teal: C.secondary,
  mint: C.primary,
};

export default function PlaybookDetailModal({ playbook, onClose, onLaunch }) {
  if (!playbook) return null;

  const {
    name,
    description,
    steps = [],
    contentIncluded = [],
    benchmarks,
    agentsDeployed = [],
    color,
    icon,
  } = playbook;
  const accent = COLOR_MAP[color] || C.primary;
  const IconComponent = PLAYBOOK_ICON_MAP[icon] || IconClipboard;

  const contentItems = contentIncluded.map((c) => (typeof c === 'string' ? { name: c, agent: 'ARIA' } : c));

  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: C.overlayHeavy,
          zIndex: Z.modal,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: S[6],
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: Z.modal + 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: S[6],
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            pointerEvents: 'auto',
            width: '100%',
            maxWidth: 920,
            maxHeight: '90vh',
            backgroundColor: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: R.card,
            boxShadow: 'var(--shadow-modal)',
            display: 'flex',
            flexDirection: 'row',
            overflow: 'hidden',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              flex: '2 1 66%',
              overflowY: 'auto',
              padding: S[6],
              borderRight: `1px solid ${C.border}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: S[4] }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
                <IconComponent color={accent} w={28} />
                <h2 style={{ fontFamily: F.display, fontSize: '22px', fontWeight: 700, color: C.textPrimary, margin: 0 }}>
                  {name}
                </h2>
              </div>
              <button style={{ ...btn.icon }} onClick={onClose} aria-label="Close">✕</button>
            </div>
            <p style={{ fontFamily: F.body, fontSize: '14px', color: C.textSecondary, lineHeight: 1.6, marginBottom: S[6] }}>
              {description}
            </p>

            <h3 style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[3] }}>
              Steps
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[4], marginBottom: S[6] }}>
              {steps.map((step, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: S[4],
                    padding: S[4],
                    backgroundColor: C.surface2,
                    borderRadius: R.sm,
                    borderLeft: `3px solid ${accent}`,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      backgroundColor: accent,
                      color: C.textInverse,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: F.mono,
                      fontSize: '12px',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <div style={{ fontFamily: F.body, fontSize: '14px', fontWeight: 600, color: C.textPrimary, marginBottom: 4 }}>
                      {step.title}
                    </div>
                    <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: '0 0 6px', lineHeight: 1.5 }}>
                      {step.description}
                    </p>
                    {step.ariaNote && (
                      <div style={{ fontFamily: F.body, fontSize: '12px', color: accent, fontStyle: 'italic' }}>
                        What ARIA does: {step.ariaNote}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <h3 style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[3] }}>
              Content Included
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
              {contentItems.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: S[3],
                    padding: S[3],
                    backgroundColor: C.surface2,
                    borderRadius: R.sm,
                    fontFamily: F.body,
                    fontSize: '13px',
                    color: C.textPrimary,
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', color: accent }}><IconDocument color={accent} width={16} height={16} /></span>
                  <span>{item.name}</span>
                  <span style={{ color: C.textMuted, marginLeft: 'auto' }}>Generated by {item.agent}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              flex: '1 1 33%',
              padding: S[6],
              display: 'flex',
              flexDirection: 'column',
              gap: S[5],
              backgroundColor: C.surface2,
            }}
          >
            <h3 style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Benchmarks
            </h3>
            <div
              style={{
                padding: S[4],
                backgroundColor: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: R.card,
              }}
            >
              <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, marginBottom: 4 }}>CPL</div>
              <div style={{ fontFamily: F.mono, fontSize: '18px', fontWeight: 700, color: C.textPrimary }}>{benchmarks?.cpl ?? '—'}</div>
              <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, marginTop: S[3] }}>Demo to close</div>
              <div style={{ fontFamily: F.mono, fontSize: '18px', fontWeight: 700, color: C.textPrimary }}>{benchmarks?.demoToClose ?? '—'}</div>
              <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, marginTop: S[3] }}>Time to first demo</div>
              <div style={{ fontFamily: F.mono, fontSize: '18px', fontWeight: 700, color: C.textPrimary }}>{benchmarks?.timeToFirstDemo ?? '—'}</div>
            </div>

            <h3 style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Agents Deployed
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
              {agentsDeployed.map((agent, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: S[2], fontFamily: F.body, fontSize: '13px', color: C.textPrimary }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: C.primary }} />
                  <span>{agent}</span>
                  <span style={{ color: C.textMuted, fontSize: '11px' }}>Ready</span>
                </div>
              ))}
            </div>

            <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
              Estimated time to first lead: <strong style={{ color: C.textPrimary }}>{benchmarks?.timeToFirstDemo ?? '—'}</strong>
            </div>

            <button
              style={{ ...btn.primary, width: '100%', marginTop: 'auto', fontSize: '15px', padding: S[4] }}
              onClick={() => onLaunch?.(playbook)}
            >
              Launch This Playbook →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
