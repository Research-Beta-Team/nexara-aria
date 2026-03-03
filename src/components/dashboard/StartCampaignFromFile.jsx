import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { C, F, R, S, T } from '../../tokens';
import useStore from '../../store/useStore';

/**
 * Compact card on Dashboard: upload file(s) to start a campaign with ARIA.
 * Sets dashboardCampaignFiles in store and navigates to /campaigns/new/aria.
 */
export default function StartCampaignFromFile() {
  const navigate = useNavigate();
  const setDashboardCampaignFiles = useStore((s) => s.setDashboardCampaignFiles);
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState([]);
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
    const list = e.dataTransfer?.files ? Array.from(e.dataTransfer.files) : [];
    if (list.length) setFiles((prev) => [...prev, ...list]);
  };

  const handleFileSelect = (e) => {
    const list = e.target?.files ? Array.from(e.target.files) : [];
    if (list.length) setFiles((prev) => [...prev, ...list]);
    e.target.value = '';
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleStartCampaign = () => {
    if (files.length === 0) return;
    setDashboardCampaignFiles(files);
    navigate('/campaigns/new/aria');
  };

  return (
    <div
      style={{
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
        padding: S[4],
        display: 'flex',
        flexDirection: 'column',
        gap: S[3],
      }}
    >
      <div style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>
        Start campaign from file
      </div>
      <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, margin: 0 }}>
        Upload a brief, prospect list, or doc — ARIA will use it when creating your campaign.
      </p>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${isDragOver ? C.primary : C.border}`,
          borderRadius: R.md,
          padding: S[4],
          backgroundColor: isDragOver ? C.primaryGlow : C.surface2,
          cursor: 'pointer',
          transition: T.base,
          textAlign: 'center',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.xlsx,.xls,.doc,.docx,.csv,.png,.jpg,.jpeg,.txt"
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />
        <span style={{ fontFamily: F.body, fontSize: '13px', color: isDragOver ? C.primary : C.textSecondary }}>
          {isDragOver ? 'Drop files here' : 'Drop files or click to browse'}
        </span>
      </div>
      {files.length > 0 && (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[1] }}>
            {files.map((f, i) => (
              <span
                key={`${f.name}-${i}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: S[1],
                  padding: '4px 8px',
                  backgroundColor: C.bg,
                  border: `1px solid ${C.border}`,
                  borderRadius: R.pill,
                  fontFamily: F.mono,
                  fontSize: '11px',
                  color: C.textSecondary,
                }}
              >
                {f.name}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                  style={{ padding: 0, border: 'none', background: 'none', color: C.textMuted, cursor: 'pointer', display: 'flex' }}
                  aria-label="Remove"
                >
                  <svg width="12" height="12" viewBox="0 0 14 14"><path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5"/></svg>
                </button>
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={handleStartCampaign}
            style={{
              padding: `${S[2]} ${S[4]}`,
              backgroundColor: C.primary,
              color: C.textInverse,
              border: 'none',
              borderRadius: R.button,
              fontFamily: F.body,
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              alignSelf: 'flex-start',
            }}
          >
            Start campaign with ARIA →
          </button>
        </>
      )}
    </div>
  );
}
