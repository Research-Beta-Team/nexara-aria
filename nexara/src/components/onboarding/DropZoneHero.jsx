import { useState, useRef } from 'react';
import { C, F, R, S } from '../../tokens';
import { IconClipboard, IconUsers, IconLightbulb } from '../ui/Icons';

const SUPPORTED_FORMATS = 'PDF · Excel · Word · CSV · PNG · JPG';

export default function DropZoneHero({
  onFileDrop,
  onStartFromBrief,
  onProspectList,
  onStartFromScratch,
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) onFileDrop(file);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e) => {
    const file = e.target?.files?.[0];
    if (file) onFileDrop(file);
    e.target.value = '';
  };

  const boxStyle = {
    width: 480,
    minHeight: 280,
    borderRadius: R.card,
    border: `2px dashed ${isDragOver ? C.primary : C.border}`,
    backgroundColor: isDragOver ? C.primaryGlow : C.surface,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: S[3],
    cursor: 'pointer',
    transition: 'border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease',
    boxShadow: isDragOver ? `0 0 24px rgba(61,220,132,0.2)` : 'none',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: S[5] }}>
      <div
        style={boxStyle}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.xlsx,.xls,.doc,.docx,.csv,.png,.jpg,.jpeg"
          style={{ display: 'none' }}
          onChange={handleInputChange}
        />
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          style={{ color: C.primary, flexShrink: 0 }}
        >
          <path
            d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span
          style={{
            fontFamily: F.body,
            fontSize: 16,
            fontWeight: 600,
            color: isDragOver ? C.primary : C.textPrimary,
          }}
        >
          {isDragOver ? 'Release to let ARIA read this' : 'Drop file here'}
        </span>
        <span style={{ fontFamily: F.body, fontSize: 14, color: C.textSecondary }}>
          or click to browse
        </span>
        <span
          style={{
            fontFamily: F.mono,
            fontSize: 11,
            color: C.textMuted,
            marginTop: S[2],
          }}
        >
          {SUPPORTED_FORMATS}
        </span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[2], justifyContent: 'center' }}>
        <button
          type="button"
          onClick={() => onStartFromBrief?.()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: S[2],
            padding: `${S[2]} ${S[4]}`,
            borderRadius: R.button,
            border: `1px solid ${C.border}`,
            backgroundColor: C.surface2,
            color: C.textSecondary,
            fontFamily: F.body,
            fontSize: 14,
            cursor: 'pointer',
            transition: 'border-color 0.2s, color 0.2s',
          }}
        >
          <IconClipboard color={C.textSecondary} width={18} height={18} />
          Start from a brief
        </button>
        <button
          type="button"
          onClick={() => onProspectList?.()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: S[2],
            padding: `${S[2]} ${S[4]}`,
            borderRadius: R.button,
            border: `1px solid ${C.border}`,
            backgroundColor: C.surface2,
            color: C.textSecondary,
            fontFamily: F.body,
            fontSize: 14,
            cursor: 'pointer',
            transition: 'border-color 0.2s, color 0.2s',
          }}
        >
          <IconUsers color={C.textSecondary} width={18} height={18} />
          I have a prospect list
        </button>
        <button
          type="button"
          onClick={() => onStartFromScratch?.()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: S[2],
            padding: `${S[2]} ${S[4]}`,
            borderRadius: R.button,
            border: `1px solid ${C.secondary}`,
            backgroundColor: 'transparent',
            color: C.secondary,
            fontFamily: F.body,
            fontSize: 14,
            cursor: 'pointer',
            transition: 'border-color 0.2s, color 0.2s',
          }}
        >
          <IconLightbulb color={C.secondary} width={18} height={18} />
          Start from scratch →
        </button>
      </div>
    </div>
  );
}
