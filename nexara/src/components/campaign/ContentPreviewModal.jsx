import { useState } from 'react';
import useToast from '../../hooks/useToast';
import { C, F, R, S, Z, btn, flex, shadows } from '../../tokens';

/* ─── helpers ─────────────────────────────────────────────── */
function getTypeColor(type) {
  const map = {
    'Email':        C.primary,
    'LinkedIn Ad':  '#0A66C2',
    'Meta Ad':      '#1877F2',
    'SEO Article':  C.amber,
    'Blog':         '#A78BFA',
    'Landing Page': '#F472B6',
  };
  return map[type] ?? C.textSecondary;
}

/* ─── ScoreRing ───────────────────────────────────────────── */
function ScoreRing({ score, size = 44 }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = score >= 85 ? C.primary : score >= 70 ? C.amber : '#EF4444';
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.border} strokeWidth="3" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth="3"
        strokeDasharray={`${fill} ${circ - fill}`}
        strokeDashoffset={circ / 4}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
        fill={color} style={{ fontFamily: F.mono, fontSize: size * 0.28 + 'px', fontWeight: 700 }}>
        {score}
      </text>
    </svg>
  );
}

/* ─── VersionHistoryPanel ─────────────────────────────────── */
function VersionHistoryPanel({ versions, activeV, onSelect }) {
  if (!versions?.length) return (
    <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, margin: 0 }}>No version history.</p>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {versions.map((ver, i) => {
        const isActive = ver.v === activeV;
        return (
          <div key={ver.v} style={{ display: 'flex', gap: S[2], alignItems: 'flex-start', cursor: 'pointer' }}
            onClick={() => onSelect(ver.v)}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '3px', flexShrink: 0 }}>
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                backgroundColor: isActive ? C.primary : C.border,
                boxShadow: isActive ? `0 0 6px ${C.primary}` : 'none',
                transition: 'all 0.2s',
              }} />
              {i < versions.length - 1 && (
                <div style={{ width: '1px', height: '18px', backgroundColor: C.border, marginTop: '2px' }} />
              )}
            </div>
            <div style={{ paddingBottom: i < versions.length - 1 ? '10px' : 0 }}>
              <div style={{ display: 'flex', gap: S[2], alignItems: 'center' }}>
                <span style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: isActive ? C.primary : C.textSecondary }}>
                  {ver.v}
                </span>
                <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>{ver.date}</span>
              </div>
              <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, marginTop: '2px' }}>{ver.note}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── PerformanceBlock ────────────────────────────────────── */
function PerformanceBlock({ perf }) {
  if (!perf || !Object.keys(perf).length) return null;
  const LABELS = {
    opens: 'Opens', clicks: 'Clicks', replies: 'Replies',
    conversions: 'Conversions', impressions: 'Impressions',
    ctr: 'CTR', cpm: 'CPM', roas: 'ROAS',
    sessions: 'Sessions', bounceRate: 'Bounce Rate',
    leads: 'Leads', cpl: 'CPL',
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {Object.entries(perf).map(([k, v]) => (
        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>{LABELS[k] ?? k}</span>
          <span style={{ fontFamily: F.mono, fontSize: '12px', fontWeight: 700, color: C.textPrimary }}>{v}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── ContentRenderer ─────────────────────────────────────── */
function ContentRenderer({ item, editMode, editBody, onEditChange }) {
  const body = editMode ? editBody : (item.body ?? '');

  if (editMode) {
    return (
      <textarea
        value={editBody}
        onChange={(e) => onEditChange(e.target.value)}
        style={{
          width: '100%', minHeight: '320px', resize: 'vertical',
          fontFamily: F.body, fontSize: '13px', color: C.textPrimary,
          lineHeight: '1.7', backgroundColor: C.surface2,
          border: `1px solid ${C.primary}`, borderRadius: R.md,
          padding: S[4], boxSizing: 'border-box',
          outline: 'none',
        }}
      />
    );
  }

  if (item.type === 'Email') {
    const lines = body.split('\n');
    const subjectIdx = lines.findIndex((l) => l.toLowerCase().startsWith('subject:'));
    const subject = subjectIdx >= 0 ? lines[subjectIdx].replace(/^subject:\s*/i, '') : null;
    const bodyLines = subjectIdx >= 0 ? lines.filter((_, i) => i !== subjectIdx) : lines;
    return (
      <div style={{ border: `1px solid ${C.border}`, borderRadius: R.md, overflow: 'hidden' }}>
        <div style={{ backgroundColor: C.surface2, borderBottom: `1px solid ${C.border}`, padding: `${S[3]} ${S[4]}` }}>
          <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Subject</div>
          <div style={{ fontFamily: F.body, fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>{subject ?? '(no subject line)'}</div>
        </div>
        <pre style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary, lineHeight: '1.7', whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0, padding: S[4] }}>
          {bodyLines.join('\n').trim()}
        </pre>
      </div>
    );
  }

  if (item.type === 'LinkedIn Ad' || item.type === 'Meta Ad') {
    const platform = item.type === 'LinkedIn Ad' ? 'LinkedIn' : 'Meta';
    const platColor = item.type === 'LinkedIn Ad' ? '#0A66C2' : '#1877F2';
    return (
      <div style={{ border: `1px solid ${C.border}`, borderRadius: R.card, overflow: 'hidden', maxWidth: '400px', margin: '0 auto' }}>
        <div style={{ backgroundColor: C.surface2, padding: `${S[2]} ${S[3]}`, display: 'flex', alignItems: 'center', gap: S[2] }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: platColor }} />
          <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: platColor }}>{platform} Ad Preview</span>
        </div>
        <div style={{ backgroundColor: C.surface3 ?? C.bg, height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>[ Creative ]</span>
        </div>
        <div style={{ padding: S[4] }}>
          <pre style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary, lineHeight: '1.6', whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>
            {body}
          </pre>
        </div>
      </div>
    );
  }

  if (item.type === 'Blog' || item.type === 'SEO Article') {
    const lines = body.split('\n');
    return (
      <div style={{ fontFamily: F.body, fontSize: '14px', color: C.textPrimary, lineHeight: '1.8' }}>
        {lines.map((line, i) => {
          if (line.startsWith('# '))  return <h1 key={i} style={{ fontFamily: F.display, fontSize: '22px', fontWeight: 800, color: C.textPrimary, margin: `${S[4]} 0 ${S[2]}`, letterSpacing: '-0.02em' }}>{line.slice(2)}</h1>;
          if (line.startsWith('## ')) return <h2 key={i} style={{ fontFamily: F.display, fontSize: '17px', fontWeight: 700, color: C.textPrimary, margin: `${S[3]} 0 ${S[2]}` }}>{line.slice(3)}</h2>;
          if (line.startsWith('### ')) return <h3 key={i} style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textSecondary, margin: `${S[2]} 0 ${S[1]}` }}>{line.slice(4)}</h3>;
          if (!line.trim()) return <div key={i} style={{ height: '8px' }} />;
          return <p key={i} style={{ margin: `0 0 ${S[2]}`, color: C.textSecondary }}>{line}</p>;
        })}
      </div>
    );
  }

  // Landing Page or other
  return (
    <pre style={{
      fontFamily: F.body, fontSize: '13px', color: C.textPrimary,
      lineHeight: '1.7', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
      margin: 0, backgroundColor: C.surface2,
      border: `1px solid ${C.border}`, borderRadius: R.md, padding: S[5],
    }}>
      {body}
    </pre>
  );
}

/* ─── Main Modal ──────────────────────────────────────────── */
export default function ContentPreviewModal({ item, onClose }) {
  const toast = useToast();
  const [editMode, setEditMode]     = useState(false);
  const [editBody, setEditBody]     = useState(item.body ?? '');
  const [activeVer, setActiveVer]   = useState(item.versions?.[0]?.v ?? null);
  const [localStatus, setLocalStatus] = useState(item.status ?? 'pending');

  const typeColor = getTypeColor(item.type);

  const statusColors = {
    approved: C.primary,
    pending:  C.amber,
    draft:    C.textMuted,
    archived: '#6B7280',
  };

  const handleApprove = () => {
    setLocalStatus('approved');
    toast.success(`"${item.name}" approved`);
  };

  const handleSaveDraft = () => {
    toast.success('Draft saved');
    setEditMode(false);
  };

  const handleVersionSelect = (v) => {
    setActiveVer(v);
    toast.info(`Viewing ${v}`);
  };

  return (
    <>
      <style>{`
        @keyframes cpFadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes cpSlideUp { from { transform: translateY(14px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
      `}</style>

      <div
        style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(9,11,17,0.88)',
          zIndex: Z.modal,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: S[6],
          animation: 'cpFadeIn 0.15s ease',
        }}
        onClick={onClose}
      >
        <div
          style={{
            backgroundColor: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: R.card,
            width: '100%', maxWidth: '920px',
            maxHeight: '90vh',
            display: 'flex', flexDirection: 'column',
            boxShadow: shadows.modal,
            animation: 'cpSlideUp 0.2s ease',
            overflow: 'hidden',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Header ── */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: `${S[3]} ${S[5]}`,
            borderBottom: `1px solid ${C.border}`,
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
              <span style={{
                fontFamily: F.mono, fontSize: '10px', fontWeight: 700,
                color: typeColor, backgroundColor: `${typeColor}18`,
                border: `1px solid ${typeColor}33`, borderRadius: R.pill,
                padding: `2px ${S[2]}`,
              }}>
                {item.type}
              </span>
              <h2 style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary, margin: 0 }}>
                {item.name}
              </h2>
              <span style={{
                fontFamily: F.mono, fontSize: '10px', fontWeight: 700,
                color: statusColors[localStatus] ?? C.textMuted,
                backgroundColor: `${statusColors[localStatus] ?? C.textMuted}18`,
                border: `1px solid ${statusColors[localStatus] ?? C.textMuted}33`,
                borderRadius: R.pill, padding: `2px ${S[2]}`,
                textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>
                {localStatus}
              </span>
            </div>
            <button style={{ ...btn.icon }} onClick={onClose}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* ── Body: two columns ── */}
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>

            {/* Content area */}
            <div style={{
              flex: 1, overflowY: 'auto', padding: S[5],
              scrollbarWidth: 'thin', scrollbarColor: `${C.border} transparent`,
            }}>
              <ContentRenderer
                item={item}
                editMode={editMode}
                editBody={editBody}
                onEditChange={setEditBody}
              />
            </div>

            {/* Side panel */}
            <div style={{
              width: '252px', flexShrink: 0,
              borderLeft: `1px solid ${C.border}`,
              overflowY: 'auto', padding: S[4],
              display: 'flex', flexDirection: 'column', gap: S[5],
              scrollbarWidth: 'thin', scrollbarColor: `${C.border} transparent`,
            }}>

              {/* Brand Score */}
              {item.brandScore != null && (
                <div>
                  <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>
                    Brand Score
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
                    <ScoreRing score={item.brandScore} size={44} />
                    <div>
                      <div style={{ fontFamily: F.display, fontSize: '20px', fontWeight: 800, color: C.textPrimary }}>{item.brandScore}</div>
                      <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>/ 100</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div>
                <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>
                  Details
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {[
                    ['Campaign',  item.campaignName],
                    ['Agent',     item.agent],
                    ['Channel',   item.channel],
                    ['Created',   item.createdAt],
                    ['Updated',   item.updatedAt],
                  ].filter(([, v]) => v).map(([label, value]) => (
                    <div key={label}>
                      <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, marginBottom: '2px' }}>{label}</div>
                      <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>{value}</div>
                    </div>
                  ))}
                  {item.tags?.length > 0 && (
                    <div>
                      <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, marginBottom: '4px' }}>Tags</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {item.tags.map((t) => (
                          <span key={t} style={{
                            fontFamily: F.mono, fontSize: '10px', color: C.textMuted,
                            backgroundColor: C.surface2, border: `1px solid ${C.border}`,
                            borderRadius: R.pill, padding: `1px 6px`,
                          }}>{t}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Performance */}
              {item.performance && Object.keys(item.performance).length > 0 && (
                <div>
                  <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>
                    Performance
                  </div>
                  <PerformanceBlock perf={item.performance} />
                </div>
              )}

              {/* Version History */}
              {item.versions?.length > 0 && (
                <div>
                  <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>
                    Versions
                  </div>
                  <VersionHistoryPanel versions={item.versions} activeV={activeVer} onSelect={handleVersionSelect} />
                </div>
              )}
            </div>
          </div>

          {/* ── Footer ── */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: `${S[3]} ${S[5]}`,
            borderTop: `1px solid ${C.border}`,
            flexShrink: 0, gap: S[2],
          }}>
            {/* Left actions */}
            <div style={{ display: 'flex', gap: S[2] }}>
              <button style={{ ...btn.ghost, fontSize: '12px' }} onClick={() => toast.info('Exporting PDF…')}>
                PDF
              </button>
              <button style={{ ...btn.ghost, fontSize: '12px' }} onClick={() => toast.info('Exporting DOCX…')}>
                DOCX
              </button>
              <button style={{ ...btn.ghost, fontSize: '12px' }} onClick={() => toast.info(`"${item.name}" cloned`)}>
                Clone
              </button>
              <button
                style={{ ...btn.ghost, fontSize: '12px', color: '#EF4444', borderColor: '#EF444433' }}
                onClick={() => { setLocalStatus('archived'); toast.info(`"${item.name}" archived`); }}
              >
                Archive
              </button>
            </div>

            {/* Right actions */}
            <div style={{ display: 'flex', gap: S[2] }}>
              {editMode ? (
                <>
                  <button
                    style={{ ...btn.secondary, fontSize: '13px' }}
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </button>
                  <button
                    style={{ ...btn.secondary, fontSize: '13px' }}
                    onClick={handleSaveDraft}
                  >
                    Save Draft
                  </button>
                </>
              ) : (
                <button
                  style={{ ...btn.secondary, fontSize: '13px' }}
                  onClick={() => setEditMode(true)}
                >
                  Edit
                </button>
              )}
              {localStatus !== 'approved' && (
                <button
                  style={{ ...btn.primary, fontSize: '13px' }}
                  onClick={handleApprove}
                >
                  Approve
                </button>
              )}
              {localStatus === 'approved' && (
                <span style={{
                  fontFamily: F.mono, fontSize: '12px', fontWeight: 700,
                  color: C.primary, display: 'flex', alignItems: 'center', gap: '4px',
                }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke={C.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Approved
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
