import { useState, useRef } from 'react';
import useToast from '../../hooks/useToast';
import TagEditor from './TagEditor';
import { C, F, R, S, T, btn, shadows } from '../../tokens';

const SUGGESTED_TYPES = [
  'Brand Guidelines', 'Messaging Framework', 'Product Docs',
  'Case Study', 'ICP Profile', 'Battle Card', 'Email Template',
  'Script', 'Market Research', 'Proposal', 'Contract', 'Other',
];

const SCOPE_OPTIONS = [
  { value: 'workspace', label: 'Workspace', desc: 'Available to all campaigns' },
  { value: 'client',    label: 'Client',    desc: 'Scoped to a specific client' },
  { value: 'campaign',  label: 'Campaign',  desc: 'Used only in this campaign' },
];

/* ─── Phase: drop → reading → tagging ─────────────────────── */
function DropZone({ onFiles }) {
  const [over, setOver] = useState(false);
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault(); setOver(false);
    const files = [...e.dataTransfer.files];
    if (files.length) onFiles(files);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      style={{
        border: `2px dashed ${over ? C.primary : C.border}`,
        borderRadius: R.card,
        padding: `${S[8]} ${S[6]}`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: S[3],
        cursor: 'pointer', transition: T.base,
        backgroundColor: over ? C.primaryGlow : C.surface2,
        userSelect: 'none',
      }}
    >
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="16" stroke={over ? C.primary : C.textMuted} strokeWidth="1.5"/>
        <path d="M18 24V12" stroke={over ? C.primary : C.textMuted} strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12 18l6-6 6 6" stroke={over ? C.primary : C.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: F.body, fontSize: '14px', fontWeight: 600, color: over ? C.primary : C.textPrimary }}>
          Drop files here or click to browse
        </div>
        <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, marginTop: '4px' }}>
          PDF, DOCX, TXT, MD — up to 20 MB each
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.docx,.txt,.md"
        style={{ display: 'none' }}
        onChange={(e) => { if (e.target.files.length) onFiles([...e.target.files]); }}
      />
    </div>
  );
}

/* ─── Phase: ARIA reading ─────────────────────────────────── */
function ReadingPhase({ filename }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: S[4], padding: `${S[8]} ${S[4]}` }}>
      <style>{`
        @keyframes umSpin  { to { transform: rotate(360deg) } }
        @keyframes umPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.75)} }
      `}</style>

      <div style={{ position: 'relative' }}>
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none" style={{ animation: 'umSpin 5s linear infinite', transformOrigin: 'center' }}>
          <circle cx="26" cy="26" r="23" stroke={C.primary} strokeWidth="1.5" strokeDasharray="5 4" opacity="0.5"/>
        </svg>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ position: 'absolute', top: '10px', left: '10px' }}>
          <circle cx="16" cy="16" r="14" stroke={C.primary} strokeWidth="1.5"/>
          <circle cx="16" cy="16" r="6" fill={C.primary} style={{ animation: 'umPulse 1.2s ease-in-out infinite' }}/>
        </svg>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary, marginBottom: S[1] }}>
          ARIA is reading this document
        </div>
        <div style={{ fontFamily: F.mono, fontSize: '12px', color: C.textMuted }}>
          {filename}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: S[2], width: '260px', marginTop: S[2] }}>
        {['Extracting structure…', 'Identifying key concepts…', 'Generating tag suggestions…'].map((line, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
            <div style={{
              width: '6px', height: '6px', borderRadius: '50%', backgroundColor: C.primary,
              animation: `umPulse 0.9s ease-in-out ${i * 0.25}s infinite`, flexShrink: 0,
            }} />
            <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>{line}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Phase: Tag confirmation ────────────────────────────────*/
function TagConfirmPhase({ file, suggested, onConfirm }) {
  const [docType, setDocType]   = useState(suggested.type);
  const [scope, setScope]       = useState(suggested.scope);
  const [tags, setTags]         = useState(suggested.tags);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: S[3],
        padding: S[3], backgroundColor: C.primaryGlow,
        border: `1px solid rgba(61,220,132,0.2)`, borderRadius: R.md,
      }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke={C.primary} strokeWidth="1.3"/>
          <path d="M8 5v4" stroke={C.primary} strokeWidth="1.3" strokeLinecap="round"/>
          <circle cx="8" cy="11.5" r="0.75" fill={C.primary}/>
        </svg>
        <div>
          <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.primary }}>ARIA suggestions ready</div>
          <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary }}>Review and confirm before adding to KB</div>
        </div>
      </div>

      {/* Filename */}
      <div>
        <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Document</div>
        <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary }}>{file.name}</div>
        <div style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted, marginTop: '2px' }}>{(file.size / 1024).toFixed(0)} KB</div>
      </div>

      {/* Type */}
      <div>
        <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Document Type</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {SUGGESTED_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setDocType(t)}
              style={{
                fontFamily: F.body, fontSize: '11px', fontWeight: docType === t ? 700 : 400,
                color: docType === t ? C.textPrimary : C.textMuted,
                backgroundColor: docType === t ? C.surface3 : 'transparent',
                border: `1px solid ${docType === t ? C.borderHover : C.border}`,
                borderRadius: R.pill, padding: `3px 10px`, cursor: 'pointer', transition: T.color,
              }}
            >{t}</button>
          ))}
        </div>
      </div>

      {/* Scope */}
      <div>
        <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Scope</div>
        <div style={{ display: 'flex', gap: S[2] }}>
          {SCOPE_OPTIONS.map((s) => (
            <button
              key={s.value}
              onClick={() => setScope(s.value)}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'flex-start',
                padding: S[3], cursor: 'pointer', transition: T.base,
                backgroundColor: scope === s.value ? C.primaryGlow : C.surface2,
                border: `1px solid ${scope === s.value ? 'rgba(61,220,132,0.3)' : C.border}`,
                borderRadius: R.md,
              }}
            >
              <span style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 700, color: scope === s.value ? C.primary : C.textPrimary }}>{s.label}</span>
              <span style={{ fontFamily: F.body, fontSize: '10px', color: C.textMuted, textAlign: 'left' }}>{s.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Tags</div>
        <TagEditor tags={tags} onChange={setTags} />
        <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, marginTop: '4px' }}>Press Enter or comma to add a tag</div>
      </div>

      <button
        style={{ ...btn.primary, width: '100%', justifyContent: 'center', fontSize: '14px', marginTop: S[2] }}
        onClick={() => onConfirm({ type: docType, scope, tags })}
      >
        Add to Knowledge Base
      </button>
    </div>
  );
}

/* ─── UploadModal (main) ──────────────────────────────────── */
export default function UploadModal({ onClose, onAdded }) {
  const toast = useToast();
  const [phase, setPhase] = useState('drop');   // drop | reading | tagging | done
  const [file, setFile]   = useState(null);

  // Mock ARIA suggestions
  const MOCK_SUGGESTIONS = {
    type: 'Brand Guidelines',
    scope: 'workspace',
    tags: ['brand', 'tone-of-voice', 'visual-identity'],
  };

  const handleFiles = (files) => {
    const f = files[0];
    setFile(f);
    setPhase('reading');
    setTimeout(() => setPhase('tagging'), 2800);
  };

  const handleConfirm = ({ type, scope, tags }) => {
    toast.success(`"${file.name}" added to Knowledge Base`);
    onAdded?.({ file, type, scope, tags });
    onClose();
  };

  return (
    <>
      <style>{`@keyframes umFade { from{opacity:0}to{opacity:1} } @keyframes umUp { from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)} }`}</style>

      <div
        style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(9,11,17,0.88)',
          zIndex: 400,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: S[6],
          animation: 'umFade 0.15s ease',
        }}
        onClick={phase === 'reading' ? undefined : onClose}
      >
        <div
          style={{
            backgroundColor: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: R.card,
            width: '100%', maxWidth: '540px',
            maxHeight: '90vh',
            display: 'flex', flexDirection: 'column',
            boxShadow: shadows.modal,
            animation: 'umUp 0.2s ease',
            overflow: 'hidden',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: `${S[3]} ${S[4]}`, borderBottom: `1px solid ${C.border}`, flexShrink: 0,
          }}>
            <div>
              <div style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary }}>
                {phase === 'drop' ? 'Upload to Knowledge Base' : phase === 'reading' ? 'Reading Document' : 'Confirm Document Details'}
              </div>
              <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, marginTop: '2px' }}>
                {phase === 'drop' ? 'ARIA will extract and tag your content automatically' : phase === 'reading' ? 'ARIA is processing\u2026' : "Review ARIA\u2019s suggestions before saving"}
              </div>
            </div>
            {phase !== 'reading' && (
              <button style={{ ...btn.icon }} onClick={onClose}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </div>

          {/* Body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: S[5], scrollbarWidth: 'thin', scrollbarColor: `${C.border} transparent` }}>
            {phase === 'drop'    && <DropZone onFiles={handleFiles} />}
            {phase === 'reading' && <ReadingPhase filename={file?.name ?? ''} />}
            {phase === 'tagging' && <TagConfirmPhase file={file} suggested={MOCK_SUGGESTIONS} onConfirm={handleConfirm} />}
          </div>
        </div>
      </div>
    </>
  );
}
