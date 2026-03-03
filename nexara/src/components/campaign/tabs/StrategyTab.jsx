import { useState, useCallback } from 'react';
import useToast from '../../../hooks/useToast';
import { C, F, R, S, btn, flex, inputStyle, inputFocusStyle } from '../../../tokens';
import { strategyData } from '../../../data/campaigns';

const THREAT_BADGE = {
  high:   { color: C.red,    bg: 'rgba(255,110,122,0.12)',  border: 'rgba(255,110,122,0.2)'  },
  medium: { color: C.amber,  bg: 'rgba(245,200,66,0.12)',   border: 'rgba(245,200,66,0.2)'   },
  low:    { color: C.primary, bg: 'rgba(61,220,132,0.12)',  border: 'rgba(61,220,132,0.2)'   },
};

const THREAT_OPTIONS = ['high', 'medium', 'low'];

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function SectionCard({ title, children, action, editMode, onSave, onCancel }) {
  return (
    <div style={{
      backgroundColor: C.surface2,
      border: `1px solid ${C.border}`,
      borderRadius: R.card,
      overflow: 'hidden',
    }}>
      <div style={{
        ...flex.rowBetween,
        padding: `${S[3]} ${S[4]}`,
        borderBottom: `1px solid ${C.border}`,
      }}>
        <span style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>{title}</span>
        <div style={{ display: 'flex', gap: S[2], alignItems: 'center' }}>
          {editMode ? (
            <>
              <button style={{ ...btn.ghost, fontSize: '12px', padding: `2px ${S[2]}`, color: C.textMuted }} onClick={onCancel}>Cancel</button>
              <button style={{ ...btn.primary, fontSize: '12px', padding: `2px ${S[2]}` }} onClick={onSave}>Save</button>
            </>
          ) : (
            action
          )}
        </div>
      </div>
      <div style={{ padding: S[4] }}>{children}</div>
    </div>
  );
}

function EditableRow({ label, value, onChange, multiline }) {
  const [focused, setFocused] = useState(false);
  const style = { ...inputStyle, ...(focused ? inputFocusStyle : {}), minHeight: multiline ? 56 : undefined };
  return (
    <div style={{ padding: `${S[2]} 0`, borderBottom: `1px solid ${C.border}` }}>
      <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, display: 'block', marginBottom: 4 }}>{label}</span>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={{ ...style, resize: 'vertical' }} rows={2} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={style} />
      )}
    </div>
  );
}

function ListEditor({ label, items, onChange, placeholder = 'New item' }) {
  const add = () => onChange([...items, '']);
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const set = (i, v) => onChange(items.map((it, idx) => idx === i ? v : it));
  return (
    <div style={{ padding: `${S[2]} 0` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[1] }}>
        <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>{label}</span>
        <button type="button" style={{ ...btn.ghost, fontSize: '11px' }} onClick={add}>+ Add</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[1] }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: S[2], alignItems: 'center' }}>
            <input type="text" value={item} onChange={(e) => set(i, e.target.value)} placeholder={placeholder} style={{ ...inputStyle, flex: 1 }} />
            <button type="button" style={{ ...btn.ghost, fontSize: '11px', color: C.red }} onClick={() => remove(i)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function DisplayRow({ label, value }) {
  return (
    <div style={{ display: 'flex', gap: S[3], padding: `${S[2]} 0`, borderBottom: `1px solid ${C.border}` }}>
      <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, width: '130px', flexShrink: 0 }}>{label}</span>
      <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary, flex: 1 }}>{value}</span>
    </div>
  );
}

export default function StrategyTab({ setTab, fromAria }) {
  const toast = useToast();
  const [strategy, setStrategy] = useState(() => deepClone(strategyData));
  const [editingSection, setEditingSection] = useState(null);
  const [editingDraft, setEditingDraft] = useState(null);

  const startEdit = useCallback((section, data) => {
    setEditingSection(section);
    setEditingDraft(deepClone(data));
  }, []);

  const saveEdit = useCallback(() => {
    if (!editingSection || editingDraft == null) return;
    setStrategy((s) => ({ ...s, [editingSection]: deepClone(editingDraft) }));
    setEditingSection(null);
    setEditingDraft(null);
    toast.success('Strategy updated');
  }, [editingSection, editingDraft, toast]);

  const cancelEdit = useCallback(() => {
    setEditingSection(null);
    setEditingDraft(null);
  }, []);

  const updateDraft = useCallback((key, value) => {
    setEditingDraft((d) => (d && typeof d === 'object' && !Array.isArray(d) ? { ...d, [key]: value } : d));
  }, []);

  const updateDraftArray = useCallback((value) => {
    setEditingDraft(() => deepClone(value));
  }, []);

  const editBtn = (label, section, data) => (
    <button type="button" style={{ ...btn.ghost, fontSize: '12px', padding: `2px ${S[2]}` }} onClick={() => startEdit(section, data)}>
      {label}
    </button>
  );

  const { brief, icp, positioning, competitorIntel, roadmap } = strategy;

  return (
    <div style={{ padding: S[5], display: 'flex', flexDirection: 'column', gap: S[5] }}>

      {fromAria && (
        <div style={{
          padding: S[4],
          backgroundColor: C.primaryGlow,
          border: `1px solid rgba(61,220,132,0.3)`,
          borderRadius: R.card,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: S[3],
        }}>
          <div>
            <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 700, color: C.textPrimary, marginBottom: '2px' }}>Create campaign with ARIA</div>
            <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>Add or confirm your strategy inputs below. When ready, ARIA will generate your campaign plan and take you to the Plan tab.</div>
          </div>
          {typeof setTab === 'function' && (
            <button type="button" style={{ ...btn.primary, fontSize: '13px', padding: `${S[2]} ${S[4]}` }} onClick={() => setTab('plan')}>ARIA, generate plan →</button>
          )}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[4] }}>
        {/* Strategy Brief */}
        <SectionCard
          title="Strategy Brief"
          action={editBtn('Edit', 'brief', brief)}
          editMode={editingSection === 'brief'}
          onSave={saveEdit}
          onCancel={cancelEdit}
        >
          {editingSection === 'brief' && editingDraft ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
              <EditableRow label="Objective" value={editingDraft.objective} onChange={(v) => updateDraft('objective', v)} multiline />
              <EditableRow label="Target Revenue" value={editingDraft.targetRevenue} onChange={(v) => updateDraft('targetRevenue', v)} />
              <EditableRow label="Timeline" value={editingDraft.timeline} onChange={(v) => updateDraft('timeline', v)} />
              <EditableRow label="Budget" value={editingDraft.budget} onChange={(v) => updateDraft('budget', v)} />
              <EditableRow label="Key Message" value={editingDraft.keyMessage} onChange={(v) => updateDraft('keyMessage', v)} multiline />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {[['Objective', brief.objective], ['Target Revenue', brief.targetRevenue], ['Timeline', brief.timeline], ['Budget', brief.budget], ['Key Message', brief.keyMessage]].map(([l, v]) => (
                <DisplayRow key={l} label={l} value={v} />
              ))}
            </div>
          )}
        </SectionCard>

        {/* ICP */}
        <SectionCard
          title="Ideal Customer Profile"
          action={editBtn('Edit', 'icp', icp)}
          editMode={editingSection === 'icp'}
          onSave={saveEdit}
          onCancel={cancelEdit}
        >
          {editingSection === 'icp' && editingDraft ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
              <EditableRow label="Title" value={editingDraft.title} onChange={(v) => updateDraft('title', v)} />
              <EditableRow label="Segment" value={editingDraft.industry} onChange={(v) => updateDraft('industry', v)} />
              <EditableRow label="Geography" value={editingDraft.geography} onChange={(v) => updateDraft('geography', v)} />
              <ListEditor label="Pain Points" items={editingDraft.painPoints || []} onChange={(v) => updateDraft('painPoints', v)} />
              <ListEditor label="Buying Triggers" items={editingDraft.triggers || []} onChange={(v) => updateDraft('triggers', v)} />
              <ListEditor label="Excludes" items={editingDraft.excludes || []} onChange={(v) => updateDraft('excludes', v)} />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <DisplayRow label="Title" value={icp.title} />
              <DisplayRow label="Segment" value={icp.industry} />
              <DisplayRow label="Geography" value={icp.geography} />
              <div style={{ padding: `${S[2]} 0`, borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, display: 'block', marginBottom: S[1] }}>Pain Points</span>
                {(icp.painPoints || []).map((p, i) => (
                  <div key={i} style={{ display: 'flex', gap: S[2], alignItems: 'flex-start', marginBottom: '3px' }}>
                    <span style={{ color: C.primary, marginTop: '3px', flexShrink: 0 }}>›</span>
                    <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>{p}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding: `${S[2]} 0`, borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, display: 'block', marginBottom: S[1] }}>Buying Triggers</span>
                <div style={{ display: 'flex', gap: S[1], flexWrap: 'wrap' }}>
                  {(icp.triggers || []).map((t, i) => (
                    <span key={i} style={{ fontFamily: F.body, fontSize: '11px', color: C.secondary, backgroundColor: 'rgba(94,234,212,0.08)', border: `1px solid rgba(94,234,212,0.2)`, borderRadius: R.pill, padding: `2px ${S[2]}` }}>{t}</span>
                  ))}
                </div>
              </div>
              {(icp.excludes || []).length > 0 && (
                <div style={{ padding: `${S[2]} 0` }}>
                  <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, display: 'block', marginBottom: S[1] }}>Excludes</span>
                  <div style={{ display: 'flex', gap: S[1], flexWrap: 'wrap' }}>
                    {(icp.excludes || []).map((e, i) => (
                      <span key={i} style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>{e}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </SectionCard>
      </div>

      {/* Positioning */}
      <SectionCard
        title="Positioning vs. Competitors"
        action={editBtn('Edit', 'positioning', positioning)}
        editMode={editingSection === 'positioning'}
        onSave={saveEdit}
        onCancel={cancelEdit}
      >
        {editingSection === 'positioning' && Array.isArray(editingDraft) ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
            {editingDraft.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: S[3], flexWrap: 'wrap' }}>
                <input type="text" value={p.axis} onChange={(e) => setEditingDraft((arr) => arr.map((x, j) => j === i ? { ...x, axis: e.target.value } : x))} style={{ ...inputStyle, width: 120 }} />
                <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>Us</span>
                <input type="number" min={0} max={10} value={p.us} onChange={(e) => setEditingDraft((arr) => arr.map((x, j) => j === i ? { ...x, us: Number(e.target.value) || 0 } : x))} style={{ ...inputStyle, width: 48 }} />
                <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>Competitor</span>
                <input type="number" min={0} max={10} value={p.competitor} onChange={(e) => setEditingDraft((arr) => arr.map((x, j) => j === i ? { ...x, competitor: Number(e.target.value) || 0 } : x))} style={{ ...inputStyle, width: 48 }} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
            {positioning.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: S[3] }}>
                <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, width: '130px', flexShrink: 0 }}>{p.axis}</span>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                    <div style={{ width: `${(p.us || 0) * 10}%`, height: '8px', backgroundColor: C.primary, borderRadius: R.pill }} />
                    <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.primary }}>{p.us}/10</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                    <div style={{ width: `${(p.competitor || 0) * 10}%`, height: '8px', backgroundColor: C.surface3, border: `1px solid ${C.border}`, borderRadius: R.pill }} />
                    <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>{p.competitor}/10</span>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: S[4], marginTop: S[2] }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: S[1] }}>
                <div style={{ width: '12px', height: '4px', backgroundColor: C.primary, borderRadius: R.pill }} />
                <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>Us</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: S[1] }}>
                <div style={{ width: '12px', height: '4px', backgroundColor: C.surface3, border: `1px solid ${C.border}`, borderRadius: R.pill }} />
                <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>Competitor avg</span>
              </div>
            </div>
          </div>
        )}
      </SectionCard>

      {/* Competitor Intel + Roadmap */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[4] }}>
        <SectionCard
          title="Competitive Intel"
          action={editBtn('Edit', 'competitorIntel', competitorIntel)}
          editMode={editingSection === 'competitorIntel'}
          onSave={saveEdit}
          onCancel={cancelEdit}
        >
          {editingSection === 'competitorIntel' && Array.isArray(editingDraft) ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
              {editingDraft.map((ci, i) => {
                const th = THREAT_BADGE[ci.threat] ?? THREAT_BADGE.low;
                return (
                  <div key={i} style={{ padding: S[3], backgroundColor: C.surface3, borderRadius: R.md, display: 'flex', flexDirection: 'column', gap: S[2] }}>
                    <div style={{ display: 'flex', gap: S[2], alignItems: 'center', flexWrap: 'wrap' }}>
                      <input type="text" value={ci.name} onChange={(e) => setEditingDraft((arr) => arr.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} style={{ ...inputStyle, flex: 1, minWidth: 100 }} placeholder="Competitor name" />
                      <select value={ci.threat} onChange={(e) => setEditingDraft((arr) => arr.map((x, j) => j === i ? { ...x, threat: e.target.value } : x))} style={{ ...inputStyle, width: 100 }}>
                        {THREAT_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <input type="text" value={ci.gap} onChange={(e) => setEditingDraft((arr) => arr.map((x, j) => j === i ? { ...x, gap: e.target.value } : x))} style={inputStyle} placeholder="Gap" />
                    <input type="text" value={ci.note} onChange={(e) => setEditingDraft((arr) => arr.map((x, j) => j === i ? { ...x, note: e.target.value } : x))} style={inputStyle} placeholder="Note" />
                    <button type="button" style={{ ...btn.ghost, fontSize: '11px', color: C.red, alignSelf: 'flex-start' }} onClick={() => updateDraftArray(editingDraft.filter((_, j) => j !== i))}>Remove</button>
                  </div>
                );
              })}
              <button type="button" style={{ ...btn.secondary, fontSize: '12px' }} onClick={() => updateDraftArray([...editingDraft, { name: '', threat: 'low', gap: '', note: '' }])}>+ Add competitor</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
              {competitorIntel.map((ci, i) => {
                const th = THREAT_BADGE[ci.threat] ?? THREAT_BADGE.low;
                return (
                  <div key={i} style={{ padding: S[3], backgroundColor: C.surface3, borderRadius: R.md, display: 'flex', flexDirection: 'column', gap: S[1] }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>{ci.name}</span>
                      <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: th.color, backgroundColor: th.bg, border: `1px solid ${th.border}`, borderRadius: R.pill, padding: `1px ${S[2]}` }}>{ci.threat} threat</span>
                    </div>
                    <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>Gap: {ci.gap}</span>
                    <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>{ci.note}</span>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="90-Day Roadmap"
          action={editBtn('Edit', 'roadmap', roadmap)}
          editMode={editingSection === 'roadmap'}
          onSave={saveEdit}
          onCancel={cancelEdit}
        >
          {editingSection === 'roadmap' && Array.isArray(editingDraft) ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
              {editingDraft.map((phase, i) => (
                <div key={i} style={{ display: 'flex', gap: S[3], alignItems: 'center', flexWrap: 'wrap' }}>
                  <input type="text" value={phase.phase} onChange={(e) => setEditingDraft((arr) => arr.map((x, j) => j === i ? { ...x, phase: e.target.value } : x))} style={{ ...inputStyle, width: 72 }} placeholder="Phase" />
                  <input type="text" value={phase.label} onChange={(e) => setEditingDraft((arr) => arr.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} style={{ ...inputStyle, flex: 1, minWidth: 140 }} placeholder="Label" />
                  <input type="text" value={phase.weeks} onChange={(e) => setEditingDraft((arr) => arr.map((x, j) => j === i ? { ...x, weeks: e.target.value } : x))} style={{ ...inputStyle, width: 72 }} placeholder="Weeks" />
                  <label style={{ display: 'flex', alignItems: 'center', gap: S[1], fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>
                    <input type="checkbox" checked={!!phase.done} onChange={(e) => setEditingDraft((arr) => arr.map((x, j) => j === i ? { ...x, done: e.target.checked } : x))} />
                    Done
                  </label>
                  <button type="button" style={{ ...btn.ghost, fontSize: '11px', color: C.red }} onClick={() => updateDraftArray(editingDraft.filter((_, j) => j !== i))}>Remove</button>
                </div>
              ))}
              <button type="button" style={{ ...btn.secondary, fontSize: '12px' }} onClick={() => updateDraftArray([...editingDraft, { phase: '', label: '', weeks: '', done: false }])}>+ Add phase</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
              {roadmap.map((phase, i) => (
                <div key={i} style={{ display: 'flex', gap: S[3], alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: phase.done ? C.primaryGlow : C.surface3, border: `2px solid ${phase.done ? C.primary : C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {phase.done ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke={C.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg> : <span style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted }}>{i + 1}</span>}
                    </div>
                    {i < roadmap.length - 1 && <div style={{ width: '2px', height: '28px', backgroundColor: C.border }} />}
                  </div>
                  <div>
                    <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: phase.done ? C.textPrimary : C.textSecondary }}>{phase.label}</span>
                    <div style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted, marginTop: '2px' }}>{phase.weeks}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
