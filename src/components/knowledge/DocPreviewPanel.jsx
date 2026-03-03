import { useState } from 'react';
import useToast from '../../hooks/useToast';
import TagEditor from './TagEditor';
import { C, F, R, S, T, btn } from '../../tokens';

const SCOPE_COLORS = {
  workspace: C.primary,
  client:    '#A78BFA',
  campaign:  C.amber,
};

const TYPE_COLORS = {
  'Brand Guidelines':      C.primary,
  'Messaging Framework':   '#A78BFA',
  'Product Docs':          C.secondary,
  'Case Study':            C.amber,
  'ICP Profile':           '#F472B6',
  'Battle Card':           '#FB923C',
  'Email Template':        C.primary,
  'Script':                C.secondary,
  'Market Research':       '#60A5FA',
  'Proposal':              C.amber,
  'Contract':              '#6B7280',
  'Other':                 C.textMuted,
};

/* ─── DocPreviewPanel ─────────────────────────────────────────
   Props:
     doc      object | null   document to preview
     onClose  () => void
     onUpdate (doc) => void   called when tags/doc changes
     onDelete (doc) => void
─────────────────────────────────────────────────────────────── */
export default function DocPreviewPanel({ doc, onClose, onUpdate, onDelete }) {
  const toast = useToast();
  const [editingTags, setEditingTags] = useState(false);
  const [localTags, setLocalTags]     = useState(doc?.tags ?? []);
  const [activeVer, setActiveVer]     = useState(doc?.versions?.[0]?.v ?? null);

  if (!doc) return null;

  const typeColor  = TYPE_COLORS[doc.type]  ?? C.textMuted;
  const scopeColor = SCOPE_COLORS[doc.scope] ?? C.textMuted;

  const handleSaveTags = () => {
    onUpdate?.({ ...doc, tags: localTags });
    toast.success('Tags saved');
    setEditingTags(false);
  };

  const handleDelete = () => {
    onDelete?.(doc);
    toast.info(`"${doc.name}" removed from KB`);
    onClose();
  };

  return (
    <>
      <style>{`
        @keyframes dpSlide { from { opacity: 0; transform: translateX(12px) } to { opacity: 1; transform: translateX(0) } }
      `}</style>

      <div style={{
        display: 'flex', flexDirection: 'column',
        height: '100%', overflow: 'hidden',
        animation: 'dpSlide 0.2s ease',
      }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          padding: `${S[4]} ${S[4]} ${S[3]}`,
          borderBottom: `1px solid ${C.border}`,
          flexShrink: 0,
        }}>
          <div style={{ flex: 1, minWidth: 0, paddingRight: S[2] }}>
            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: S[2] }}>
              <span style={{
                fontFamily: F.mono, fontSize: '10px', fontWeight: 700,
                color: typeColor, backgroundColor: `${typeColor}18`,
                border: `1px solid ${typeColor}33`, borderRadius: R.pill,
                padding: `1px 7px`,
              }}>{doc.type}</span>
              <span style={{
                fontFamily: F.mono, fontSize: '10px', fontWeight: 700,
                color: scopeColor, backgroundColor: `${scopeColor}18`,
                border: `1px solid ${scopeColor}33`, borderRadius: R.pill,
                padding: `1px 7px`, textTransform: 'capitalize',
              }}>{doc.scope}</span>
            </div>
            <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 700, color: C.textPrimary, wordBreak: 'break-word' }}>
              {doc.name}
            </div>
            <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, marginTop: '4px' }}>
              {doc.uploadDate} · {doc.size} · Used by {doc.usedBy} agent{doc.usedBy !== 1 ? 's' : ''}
            </div>
          </div>
          <button style={{ ...btn.icon, flexShrink: 0 }} onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: `${C.border} transparent` }}>

          {/* Tags section */}
          <div style={{ padding: `${S[3]} ${S[4]}`, borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[2] }}>
              <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Tags
              </span>
              {!editingTags ? (
                <button style={{ ...btn.ghost, fontSize: '11px', padding: `1px ${S[2]}` }} onClick={() => setEditingTags(true)}>
                  Edit
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button style={{ ...btn.ghost, fontSize: '11px', padding: `1px ${S[2]}` }} onClick={() => { setLocalTags(doc.tags); setEditingTags(false); }}>
                    Cancel
                  </button>
                  <button style={{ ...btn.primary, fontSize: '11px', padding: `2px ${S[2]}` }} onClick={handleSaveTags}>
                    Save
                  </button>
                </div>
              )}
            </div>
            <TagEditor
              tags={editingTags ? localTags : doc.tags}
              onChange={setLocalTags}
              readOnly={!editingTags}
            />
          </div>

          {/* Content preview */}
          <div style={{ padding: S[4], borderBottom: `1px solid ${C.border}` }}>
            <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>
              Preview
            </div>
            <pre style={{
              fontFamily: F.body, fontSize: '12px', color: C.textSecondary,
              lineHeight: '1.7', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              margin: 0, backgroundColor: C.surface2,
              border: `1px solid ${C.border}`, borderRadius: R.md,
              padding: S[3], maxHeight: '280px', overflowY: 'auto',
              scrollbarWidth: 'thin', scrollbarColor: `${C.border} transparent`,
            }}>
              {doc.preview ?? '(No preview available)'}
            </pre>
          </div>

          {/* Version history */}
          {doc.versions?.length > 0 && (
            <div style={{ padding: S[4], borderBottom: `1px solid ${C.border}` }}>
              <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[3] }}>
                Version History
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {doc.versions.map((ver, i) => {
                  const isActive = ver.v === activeVer;
                  return (
                    <div key={ver.v} style={{ display: 'flex', gap: S[2], alignItems: 'flex-start', cursor: 'pointer' }}
                      onClick={() => setActiveVer(ver.v)}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '3px', flexShrink: 0 }}>
                        <div style={{
                          width: '7px', height: '7px', borderRadius: '50%',
                          backgroundColor: isActive ? C.primary : C.border,
                          boxShadow: isActive ? `0 0 5px ${C.primary}` : 'none',
                          transition: T.base,
                        }} />
                        {i < doc.versions.length - 1 && <div style={{ width: '1px', height: '18px', backgroundColor: C.border, marginTop: '2px' }} />}
                      </div>
                      <div style={{ paddingBottom: i < doc.versions.length - 1 ? '10px' : 0 }}>
                        <div style={{ display: 'flex', gap: S[2] }}>
                          <span style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: isActive ? C.primary : C.textSecondary }}>{ver.v}</span>
                          <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>{ver.date}</span>
                        </div>
                        <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, marginTop: '1px' }}>{ver.note}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Used by */}
          {doc.usedByAgents?.length > 0 && (
            <div style={{ padding: S[4] }}>
              <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>
                Used by Agents
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {doc.usedByAgents.map((a) => (
                  <span key={a} style={{
                    fontFamily: F.body, fontSize: '11px', color: C.textSecondary,
                    backgroundColor: C.surface2, border: `1px solid ${C.border}`,
                    borderRadius: R.pill, padding: `1px 8px`,
                  }}>{a}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer: delete */}
        <div style={{
          padding: `${S[3]} ${S[4]}`,
          borderTop: `1px solid ${C.border}`,
          flexShrink: 0,
        }}>
          <button
            style={{
              ...btn.ghost, fontSize: '12px', color: '#EF4444', width: '100%',
              justifyContent: 'center', border: `1px solid #EF444433`,
              borderRadius: R.button,
            }}
            onClick={handleDelete}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 3h8M5 3V1.5h2V3M3 3l.5 7.5h5L9 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Remove from KB
          </button>
        </div>
      </div>
    </>
  );
}
