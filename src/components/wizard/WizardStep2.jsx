import { useState } from 'react';
import { C, F, R, S, T, inputStyle, labelStyle } from '../../tokens';
import { IconCheck } from '../ui/Icons';
import UpgradeModal from '../plan/UpgradeModal';

const JOB_TITLE_SUGGESTIONS = ['CFO', 'VP Finance', 'Finance Director', 'Head of Finance', 'CEO', 'COO', 'CTO', 'VP Operations'];
const COMPANY_SIZES = ['1–50', '51–200', '201–500', '501–2,000', '2,001–10,000', '10,000+'];
const INDUSTRIES = ['SaaS / Technology', 'Financial Services', 'Manufacturing', 'Retail & E-commerce', 'Healthcare', 'Professional Services', 'Real Estate', 'Education'];
const GEOGRAPHIES = ['Vietnam', 'Singapore', 'Thailand', 'Malaysia', 'Indonesia', 'Philippines', 'Australia', 'Japan', 'South Korea', 'India'];

function Field({ label, children, error }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[1] }}>
      <label style={labelStyle}>{label}</label>
      {children}
      {error && <span style={{ fontFamily: F.body, fontSize: '11px', color: C.red }}>{error}</span>}
    </div>
  );
}

// Multi-select tag input
function TagSelector({ options, selected, onToggle, placeholder, allowCustom }) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e) => {
    if (!allowCustom) return;
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      onToggle(input.trim());
      setInput('');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
      {/* Suggestions */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[1] }}>
        {options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: S[1],
                fontFamily: F.body, fontSize: '12px', fontWeight: active ? 600 : 400,
                color: active ? C.primary : C.textSecondary,
                backgroundColor: active ? C.primaryGlow : C.surface2,
                border: `1px solid ${active ? 'rgba(61,220,132,0.35)' : C.border}`,
                borderRadius: R.pill,
                padding: `3px ${S[3]}`,
                cursor: 'pointer',
                transition: T.color,
              }}
              onClick={() => onToggle(opt)}
            >
              {active ? <><IconCheck color={C.primary} width={14} height={14} /> </> : ''}{opt}
            </button>
          );
        })}
      </div>
      {/* Custom input */}
      {allowCustom && (
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder ?? 'Type and press Enter…'}
          style={{ ...inputStyle, fontSize: '13px' }}
        />
      )}
      {/* Selected tags */}
      {allowCustom && selected.some((s) => !options.includes(s)) && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[1] }}>
          {selected.filter((s) => !options.includes(s)).map((s) => (
            <span key={s} style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              fontFamily: F.body, fontSize: '12px', color: C.primary,
              backgroundColor: C.primaryGlow, border: `1px solid rgba(61,220,132,0.3)`,
              borderRadius: R.pill, padding: `2px ${S[2]}`,
            }}>
              {s}
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.textMuted, padding: 0, lineHeight: 1 }} onClick={() => onToggle(s)}>×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function WizardStep2({ data, onChange, errors, hasFeature, planId }) {
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [tooltipHover, setTooltipHover] = useState(false);

  const toggle = (field) => (val) => {
    const arr = data[field] ?? [];
    onChange(field, arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  };

  const icpSource = data.icpSource ?? 'existing';
  const hasIcpScoring = hasFeature?.('icpScoring') ?? false;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[5] }}>
      <div>
        <h2 style={{ fontFamily: F.display, fontSize: '20px', fontWeight: 800, color: C.textPrimary, margin: `0 0 ${S[1]}`, letterSpacing: '-0.02em' }}>
          Ideal Customer Profile
        </h2>
        <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: 0 }}>
          Define exactly who you're targeting. Freya uses this for all outreach personalization.
        </p>
      </div>

      {/* ICP source choice */}
      <div>
        <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>
          ICP source
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
          <button
            type="button"
            style={{
              display: 'flex', alignItems: 'center', gap: S[3],
              padding: S[4], borderRadius: R.md,
              border: `1px solid ${icpSource === 'existing' ? C.primary : C.border}`,
              backgroundColor: icpSource === 'existing' ? C.primaryGlow : C.surface2,
              cursor: 'pointer', textAlign: 'left', transition: T.color,
            }}
            onClick={() => onChange('icpSource', 'existing')}
          >
            <div style={{
              width: 20, height: 20, borderRadius: '50%',
              border: `2px solid ${icpSource === 'existing' ? C.primary : C.border}`,
              backgroundColor: icpSource === 'existing' ? C.primary : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {icpSource === 'existing' && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2.5 2.5 3.5-4" stroke={C.textInverse} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <div>
              <div style={{ fontFamily: F.body, fontSize: '14px', fontWeight: 600, color: C.textPrimary }}>Use existing ICP</div>
              <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>Define job titles, company size, and filters below.</div>
            </div>
          </button>

          <div style={{ position: 'relative' }}>
            <button
              type="button"
              style={{
                display: 'flex', alignItems: 'center', gap: S[3],
                padding: S[4], borderRadius: R.md,
                border: `1px solid ${hasIcpScoring && icpSource === 'ai_scoring' ? C.primary : C.border}`,
                backgroundColor: hasIcpScoring && icpSource === 'ai_scoring' ? C.primaryGlow : C.surface2,
                cursor: 'pointer', textAlign: 'left', transition: T.color,
                opacity: hasIcpScoring ? 1 : 0.7,
              }}
              onClick={() => {
                if (hasIcpScoring) onChange('icpSource', 'ai_scoring');
                else setShowUpgrade(true);
              }}
              onMouseEnter={() => setTooltipHover(true)}
              onMouseLeave={() => setTooltipHover(false)}
            >
              <div style={{
                width: 20, height: 20, borderRadius: '50%',
                border: `2px solid ${hasIcpScoring && icpSource === 'ai_scoring' ? C.primary : C.border}`,
                backgroundColor: hasIcpScoring && icpSource === 'ai_scoring' ? C.primary : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {hasIcpScoring && icpSource === 'ai_scoring' && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5 3.5-4" stroke={C.textInverse} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                  <span style={{ fontFamily: F.body, fontSize: '14px', fontWeight: 600, color: hasIcpScoring ? C.textPrimary : C.textMuted }}>
                    Build new ICP with AI scoring
                  </span>
                  {!hasIcpScoring && (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                      fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.amber,
                      backgroundColor: C.amberDim, border: `1px solid ${C.amber}`,
                      borderRadius: R.pill, padding: '2px 6px',
                    }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                      GROWTH
                    </span>
                  )}
                </div>
                <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>
                  Freya analyzes your best customers and suggests an ICP with fit scores.
                </div>
              </div>
            </button>
            {!hasIcpScoring && tooltipHover && (
              <div style={{
                position: 'absolute', left: 0, right: 0, top: '100%', marginTop: S[1],
                backgroundColor: C.surface3, border: `1px solid ${C.border}`,
                borderRadius: R.md, padding: `${S[2]} ${S[3]}`,
                fontFamily: F.body, fontSize: '12px', color: C.textSecondary,
                zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}>
                AI ICP Scoring requires Growth plan
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Manual ICP fields */}
      <Field label="Job Titles (select all that apply)" error={errors?.jobTitles}>
        <TagSelector
          options={JOB_TITLE_SUGGESTIONS}
          selected={data.jobTitles ?? []}
          onToggle={toggle('jobTitles')}
          placeholder="Add custom title…"
          allowCustom
        />
        {(data.jobTitles ?? []).length === 0 && (
          <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>Select at least one title</span>
        )}
      </Field>

      <Field label="Company Size (employees)" error={errors?.companySize}>
        <TagSelector
          options={COMPANY_SIZES}
          selected={data.companySize ?? []}
          onToggle={toggle('companySize')}
        />
      </Field>

      <Field label="Industries" error={errors?.industries}>
        <TagSelector
          options={INDUSTRIES}
          selected={data.industries ?? []}
          onToggle={toggle('industries')}
          placeholder="Add custom industry…"
          allowCustom
        />
      </Field>

      <Field label="Geographies" error={errors?.geographies}>
        <TagSelector
          options={GEOGRAPHIES}
          selected={data.geographies ?? []}
          onToggle={toggle('geographies')}
          placeholder="Add custom geography…"
          allowCustom
        />
      </Field>

      {/* Exclusions */}
      <Field label="Exclusions (optional)">
        <input
          value={data.exclusions ?? ''}
          onChange={(e) => onChange('exclusions', e.target.value)}
          placeholder="e.g. Non-profit, government, <50 employees"
          style={inputStyle}
        />
      </Field>

      {/* Upload persona doc */}
      <div style={{
        border: `2px dashed ${C.border}`,
        borderRadius: R.md,
        padding: S[5],
        textAlign: 'center',
        cursor: 'pointer',
        transition: T.color,
        backgroundColor: C.surface2,
      }}>
        <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
          Drop a persona document or
          <span style={{ color: C.primary, marginLeft: '4px', fontWeight: 600 }}>browse to upload</span>
        </div>
        <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, marginTop: '4px' }}>
          PDF, Word, or CSV · Freya will extract ICP signals automatically
        </div>
      </div>

      {showUpgrade && (
        <UpgradeModal
          fromPlan={planId}
          toPlan="growth"
          featureUnlocked="icpScoring"
          onClose={() => setShowUpgrade(false)}
        />
      )}
    </div>
  );
}
