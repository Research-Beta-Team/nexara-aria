import { useState, useRef } from 'react';
import useToast from '../../hooks/useToast';
import TagEditor from '../knowledge/TagEditor';
import { C, F, R, S, T, btn, shadows } from '../../tokens';

const DOC_TYPES = [
  'Brand Guidelines', 'Case Study', 'Battle Card', 'ICP Profile',
  'Messaging Framework', 'Product Docs', 'Market Research', 'Email Template', 'Other',
];

function DropZone({ onFiles }) {
  const [over, setOver] = useState(false);
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    setOver(false);
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
        padding: `${S[6]} ${S[5]}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: S[3],
        cursor: 'pointer',
        transition: T.base,
        backgroundColor: over ? C.primaryGlow : C.surface2,
        userSelect: 'none',
      }}
    >
      <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="16" stroke={over ? C.primary : C.textMuted} strokeWidth="1.5" />
        <path d="M18 24V12" stroke={over ? C.primary : C.textMuted} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 18l6-6 6 6" stroke={over ? C.primary : C.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: over ? C.primary : C.textPrimary }}>
          Drop file here or click to browse
        </div>
        <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, marginTop: '4px' }}>
          PDF, DOCX, CSV, PPTX · max 25 MB
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.txt,.md,.csv,.pptx"
        style={{ display: 'none' }}
        onChange={(e) => { if (e.target.files?.length) onFiles([...e.target.files]); }}
      />
    </div>
  );
}

function ReadingPhase({ filename }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: S[4], padding: `${S[6]} ${S[4]}` }}>
      <style>{`
        @keyframes qcSpin { to { transform: rotate(360deg); } }
        @keyframes qcPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.75)} }
      `}</style>
      <div style={{ position: 'relative' }}>
        <svg width="48" height="48" viewBox="0 0 52 52" fill="none" style={{ animation: 'qcSpin 5s linear infinite', transformOrigin: 'center' }}>
          <circle cx="26" cy="26" r="23" stroke={C.primary} strokeWidth="1.5" strokeDasharray="5 4" opacity="0.5" />
        </svg>
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" style={{ position: 'absolute', top: '10px', left: '10px' }}>
          <circle cx="16" cy="16" r="14" stroke={C.primary} strokeWidth="1.5" />
          <circle cx="16" cy="16" r="6" fill={C.primary} style={{ animation: 'qcPulse 1.2s ease-in-out infinite' }} />
        </svg>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary, marginBottom: S[1] }}>
          ARIA is reading this document
        </div>
        <div style={{ fontFamily: F.mono, fontSize: '12px', color: C.textMuted }}>{filename}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[2], width: '240px' }}>
        {['Extracting structure…', 'Identifying key concepts…', 'Suggesting type & tags…'].map((line, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
            <div style={{
              width: '6px', height: '6px', borderRadius: '50%', backgroundColor: C.primary,
              animation: `qcPulse 0.9s ease-in-out ${i * 0.25}s infinite`, flexShrink: 0,
            }} />
            <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>{line}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConfirmPhase({ file, suggested, onConfirm }) {
  const [docType, setDocType] = useState(suggested.type);
  const [tags, setTags] = useState(suggested.tags);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: S[3],
        padding: S[3], backgroundColor: C.primaryGlow,
        border: `1px solid rgba(61,220,132,0.2)`, borderRadius: R.md,
      }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke={C.primary} strokeWidth="1.3" />
          <path d="M8 5v4" stroke={C.primary} strokeWidth="1.3" strokeLinecap="round" />
          <circle cx="8" cy="11.5" r="0.75" fill={C.primary} />
        </svg>
        <div>
          <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.primary }}>ARIA suggestions ready</div>
          <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textSecondary }}>Review and add to this campaign</div>
        </div>
      </div>

      <div>
        <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Document</div>
        <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary }}>{file.name}</div>
        <div style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted, marginTop: '2px' }}>{(file.size / 1024).toFixed(0)} KB</div>
      </div>

      <div>
        <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Type</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {DOC_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setDocType(t)}
              style={{
                fontFamily: F.body, fontSize: '11px', fontWeight: docType === t ? 700 : 400,
                color: docType === t ? C.textPrimary : C.textMuted,
                backgroundColor: docType === t ? C.surface3 : 'transparent',
                border: `1px solid ${docType === t ? C.border : C.border}`,
                borderRadius: R.pill, padding: '3px 10px', cursor: 'pointer', transition: T.color,
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Tags</div>
        <TagEditor tags={tags} onChange={setTags} />
      </div>

      <button
        type="button"
        style={{ ...btn.primary, width: '100%', justifyContent: 'center', fontSize: '13px', marginTop: S[2] }}
        onClick={() => onConfirm({ type: docType, tags })}
      >
        Add to campaign
      </button>
    </div>
  );
}

export default function QuickContentUploadModal({ onClose, onAdded }) {
  const toast = useToast();
  const [phase, setPhase] = useState('drop');
  const [file, setFile] = useState(null);

  const MOCK_SUGGESTIONS = {
    type: 'Case Study',
    tags: ['campaign', 'content'],
  };

  const handleFiles = (files) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setPhase('reading');
    setTimeout(() => setPhase('confirm'), 2200);
  };

  const handleConfirm = ({ type, tags }) => {
    const id = `qu-${Date.now()}`;
    const size = `${(file.size / 1024).toFixed(0)} KB`;
    toast.success(`"${file.name}" added to campaign content`);
    onAdded?.({ id, name: file.name, type, size, tags });
    onClose();
  };

  return (
    <>
      <style>{`@keyframes qcFade { from{opacity:0} to{opacity:1} } @keyframes qcUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }`}</style>
      <div
        style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(9,11,17,0.88)',
          zIndex: 400,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: S[6],
          animation: 'qcFade 0.15s ease',
        }}
        onClick={phase === 'reading' ? undefined : onClose}
      >
        <div
          style={{
            backgroundColor: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: R.card,
            width: '100%',
            maxWidth: '480px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: shadows.modal,
            animation: 'qcUp 0.2s ease',
            overflow: 'hidden',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: `${S[3]} ${S[4]}`, borderBottom: `1px solid ${C.border}`, flexShrink: 0,
          }}>
            <div>
              <div style={{ fontFamily: F.display, fontSize: '15px', fontWeight: 700, color: C.textPrimary }}>
                {phase === 'drop' ? 'Quick content upload' : phase === 'reading' ? 'Reading document' : 'Confirm details'}
              </div>
              <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, marginTop: '2px' }}>
                {phase === 'drop' ? 'ARIA will extract and tag for this campaign' : phase === 'reading' ? 'ARIA is processing…' : 'Review and add to campaign'}
              </div>
            </div>
            {phase !== 'reading' && (
              <button type="button" style={{ ...btn.icon }} onClick={onClose} aria-label="Close">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: S[5] }}>
            {phase === 'drop' && <DropZone onFiles={handleFiles} />}
            {phase === 'reading' && <ReadingPhase filename={file?.name ?? ''} />}
            {phase === 'confirm' && <ConfirmPhase file={file} suggested={MOCK_SUGGESTIONS} onConfirm={handleConfirm} />}
          </div>
        </div>
      </div>
    </>
  );
}
