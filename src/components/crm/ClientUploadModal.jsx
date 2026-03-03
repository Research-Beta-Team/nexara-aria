import { useState, useRef } from 'react';
import { C, F, R, S, btn } from '../../tokens';
import useToast from '../../hooks/useToast';
import { CRM_CLIENT_FIELDS, TEAMS, RELATIONSHIP_MANAGERS } from '../../data/crm';

const EMPTY_CLIENT = { name: '', company: '', email: '', phone: '' };

function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (c === ',' && !inQuotes) {
      values.push(current.replace(/^"|"$/g, '').trim());
      current = '';
    } else {
      current += c;
    }
  }
  values.push(current.replace(/^"|"$/g, '').trim());
  return values;
}

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (!lines.length) return { headers: [], rows: [] };
  const headers = parseCSVLine(lines[0]);
  const rows = lines.slice(1).map(parseCSVLine);
  return { headers, rows };
}

export default function ClientUploadModal({ onClose, onBulkImport, onAddIndividual }) {
  const [tab, setTab] = useState('bulk'); // 'bulk' | 'individual'
  const [file, setFile] = useState(null);
  const [csvPreview, setCsvPreview] = useState(null); // { headers, rows }
  const [columnMap, setColumnMap] = useState({}); // fieldKey -> header index
  const [individual, setIndividual] = useState(EMPTY_CLIENT);
  const [defaultTeamId, setDefaultTeamId] = useState(TEAMS[0]?.id ?? '');
  const [defaultRmId, setDefaultRmId] = useState(RELATIONSHIP_MANAGERS[0]?.id ?? '');
  const fileInputRef = useRef(null);
  const toast = useToast();

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (/\.(xlsx|xls)$/i.test(f.name)) {
      toast.info('Please save your Excel file as CSV (Save As → CSV) for bulk import.');
      setFile(null);
      setCsvPreview(null);
      e.target.value = '';
      return;
    }
    if (!/\.(csv|txt)$/i.test(f.name)) {
      setFile(null);
      setCsvPreview(null);
      return;
    }
    setFile(f);
    const reader = new FileReader();
    reader.onload = () => {
      const { headers, rows } = parseCSV(reader.result);
      setCsvPreview({ headers, rows: rows.slice(0, 10) });
      setColumnMap({});
    };
    reader.readAsText(f);
  };

  const handleBulkImport = () => {
    if (!file || !csvPreview) return;
    const reader = new FileReader();
    reader.onload = () => {
      const { headers, rows } = parseCSV(reader.result);
      const mapped = rows.map((row) => {
        const obj = { name: '', company: '', email: '', phone: '' };
        CRM_CLIENT_FIELDS.forEach(({ key }) => {
          const idx = columnMap[key];
          if (typeof idx === 'number' && headers[idx] !== undefined) {
            obj[key] = (row[idx] ?? '').trim();
          }
        });
        return obj;
      }).filter((r) => r.email || r.name || r.company);
      onBulkImport(mapped, { defaultTeamId, defaultRmId });
      onClose();
    };
    reader.readAsText(file);
  };

  const handleAddIndividual = () => {
    if (!individual.email || !individual.name || !individual.company) return;
    onAddIndividual({
      ...individual,
      teamId: defaultTeamId || undefined,
      relationshipManagerId: defaultRmId || undefined,
    });
    setIndividual(EMPTY_CLIENT);
    onClose();
  };

  const bulkValid = file && csvPreview && CRM_CLIENT_FIELDS.filter((f) => f.required).every((f) => columnMap[f.key] !== undefined && columnMap[f.key] !== '');
  const individualValid = individual.email && individual.name && individual.company;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: C.overlay,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          backgroundColor: C.surface,
          borderRadius: R.card,
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          maxWidth: 560,
          width: '100%',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: S[5], borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: F.display, fontSize: '18px', fontWeight: 700, color: C.textPrimary, margin: 0 }}>
            Import clients
          </h2>
          <button type="button" style={{ ...btn.icon }} onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4l12 12M16 4L4 16" /></svg>
          </button>
        </div>

        <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}` }}>
          {['bulk', 'individual'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              style={{
                ...btn.ghost,
                padding: `${S[3]} ${S[5]}`,
                fontFamily: F.body,
                fontSize: '13px',
                fontWeight: 600,
                color: tab === t ? C.primary : C.textSecondary,
                borderBottom: tab === t ? `2px solid ${C.primary}` : '2px solid transparent',
                borderRadius: 0,
              }}
            >
              {t === 'bulk' ? 'Bulk (CSV)' : 'Add individual'}
            </button>
          ))}
        </div>

        <div style={{ padding: S[5], overflowY: 'auto', flex: 1 }}>
          {tab === 'bulk' && (
            <>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${C.border}`,
                  borderRadius: R.card,
                  padding: S[6],
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: C.surface2,
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.txt,.xlsx,.xls"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                {file ? (
                  <span style={{ fontFamily: F.body, fontSize: '13px', color: C.primary }}>{file.name}</span>
                ) : (
                  <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>Drop CSV or click to browse (Excel: save as CSV)</span>
                )}
              </div>
              {csvPreview && (
                <>
                  <div style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted, marginTop: S[4], marginBottom: S[2] }}>
                    Map columns to fields
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
                    {CRM_CLIENT_FIELDS.map(({ key, label, required }) => (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
                        <label style={{ width: 120, fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>
                          {label} {required && '*'}
                        </label>
                        <select
                          value={columnMap[key] ?? ''}
                          onChange={(e) => setColumnMap((m) => ({ ...m, [key]: e.target.value === '' ? undefined : Number(e.target.value) }))}
                          style={{
                            flex: 1,
                            padding: `${S[1]} ${S[2]}`,
                            border: `1px solid ${C.border}`,
                            borderRadius: R.input,
                            backgroundColor: C.surface2,
                            color: C.textPrimary,
                            fontFamily: F.body,
                            fontSize: '12px',
                          }}
                        >
                          <option value="">—</option>
                          {csvPreview.headers.map((h, i) => (
                            <option key={i} value={i}>{h}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: S[4], display: 'flex', gap: S[3] }}>
                    <label style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>Default team</label>
                    <select
                      value={defaultTeamId}
                      onChange={(e) => setDefaultTeamId(e.target.value)}
                      style={{ padding: `${S[1]} ${S[2]}`, border: `1px solid ${C.border}`, borderRadius: R.input, backgroundColor: C.surface2, color: C.textPrimary, fontSize: '12px' }}
                    >
                      {TEAMS.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                    <label style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>Default RM</label>
                    <select
                      value={defaultRmId}
                      onChange={(e) => setDefaultRmId(e.target.value)}
                      style={{ padding: `${S[1]} ${S[2]}`, border: `1px solid ${C.border}`, borderRadius: R.input, backgroundColor: C.surface2, color: C.textPrimary, fontSize: '12px' }}
                    >
                      {RELATIONSHIP_MANAGERS.map((r) => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </>
          )}

          {tab === 'individual' && (
            <>
              {CRM_CLIENT_FIELDS.map(({ key, label, required }) => (
                <div key={key} style={{ marginBottom: S[3] }}>
                  <label style={{ display: 'block', fontFamily: F.body, fontSize: '12px', color: C.textSecondary, marginBottom: S[1] }}>
                    {label} {required && '*'}
                  </label>
                  <input
                    type={key === 'email' ? 'email' : 'text'}
                    value={individual[key]}
                    onChange={(e) => setIndividual((s) => ({ ...s, [key]: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: `${S[2]} ${S[3]}`,
                      border: `1px solid ${C.border}`,
                      borderRadius: R.input,
                      backgroundColor: C.surface2,
                      color: C.textPrimary,
                      fontFamily: F.body,
                      fontSize: '13px',
                    }}
                  />
                </div>
              ))}
              <div style={{ display: 'flex', gap: S[4], marginTop: S[4] }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontFamily: F.body, fontSize: '12px', color: C.textSecondary, marginBottom: S[1] }}>Team</label>
                  <select
                    value={defaultTeamId}
                    onChange={(e) => setDefaultTeamId(e.target.value)}
                    style={{ width: '100%', padding: `${S[2]} ${S[3]}`, border: `1px solid ${C.border}`, borderRadius: R.input, backgroundColor: C.surface2, color: C.textPrimary, fontSize: '12px' }}
                  >
                    {TEAMS.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontFamily: F.body, fontSize: '12px', color: C.textSecondary, marginBottom: S[1] }}>Relationship manager</label>
                  <select
                    value={defaultRmId}
                    onChange={(e) => setDefaultRmId(e.target.value)}
                    style={{ width: '100%', padding: `${S[2]} ${S[3]}`, border: `1px solid ${C.border}`, borderRadius: R.input, backgroundColor: C.surface2, color: C.textPrimary, fontSize: '12px' }}
                  >
                    {RELATIONSHIP_MANAGERS.map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}
        </div>

        <div style={{ padding: S[5], borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'flex-end', gap: S[2] }}>
          <button type="button" style={{ ...btn.ghost }} onClick={onClose}>Cancel</button>
          {tab === 'bulk' && (
            <button type="button" style={{ ...btn.primary }} onClick={handleBulkImport} disabled={!bulkValid}>
              Import from CSV
            </button>
          )}
          {tab === 'individual' && (
            <button type="button" style={{ ...btn.primary }} onClick={handleAddIndividual} disabled={!individualValid}>
              Add client
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
