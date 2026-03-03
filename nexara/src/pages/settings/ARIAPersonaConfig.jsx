import { useState, useEffect } from 'react';
import useStore from '../../store/useStore';
import useToast from '../../hooks/useToast';
import { C, F, R, S, btn, inputStyle } from '../../tokens';
import { PERSONAS } from '../../data/ariaPersonas';
import PersonaCard from '../../components/aria/PersonaCard';
import RulesOfEngagement from '../../components/aria/RulesOfEngagement';
import PersonaPreviewChat from '../../components/aria/PersonaPreviewChat';

export default function ARIAPersonaConfig() {
  const toast = useToast();
  const {
    ariaPersonaId,
    ariaOperatingRole,
    ariaCustomRoleDescription,
    ariaCompanyBrand,
    ariaIndustry,
    ariaPrimaryMarket,
    ariaCustomRules,
    setARIAPersona,
    setARIACustomRoleDescription,
    setARIAContext,
    addARIARule,
    updateARIARule,
    toggleARIARule,
    removeARIARule,
  } = useStore();

  const [selectedPersonaId, setSelectedPersonaId] = useState(ariaPersonaId);
  const [companyBrand, setCompanyBrand] = useState(ariaCompanyBrand);
  const [industry, setIndustry] = useState(ariaIndustry);
  const [primaryMarket, setPrimaryMarket] = useState(ariaPrimaryMarket);
  const [customRoleDescription, setCustomRoleDescription] = useState(ariaCustomRoleDescription);

  useEffect(() => {
    setSelectedPersonaId(ariaPersonaId);
    setCompanyBrand(ariaCompanyBrand);
    setIndustry(ariaIndustry);
    setPrimaryMarket(ariaPrimaryMarket);
    setCustomRoleDescription(ariaCustomRoleDescription);
  }, [ariaPersonaId, ariaCompanyBrand, ariaIndustry, ariaPrimaryMarket, ariaCustomRoleDescription]);

  const selectedPersona = PERSONAS.find((p) => p.id === selectedPersonaId) || PERSONAS[0];
  const roleLabel = selectedPersonaId === 'custom' && customRoleDescription.trim()
    ? customRoleDescription.trim().slice(0, 50) + (customRoleDescription.trim().length > 50 ? '…' : '')
    : selectedPersona?.label || 'Chief Revenue Officer';

  const handleSave = () => {
    setARIAPersona(selectedPersonaId, selectedPersonaId === 'custom' ? roleLabel : selectedPersona?.label);
    setARIAContext({ companyBrand, industry, primaryMarket });
    setARIACustomRoleDescription(customRoleDescription);
    toast.success(`ARIA will now operate as your ${roleLabel}.`);
  };

  const handleAddRule = () => {
    addARIARule({
      text: '',
      enabled: true,
      category: 'TONE',
    });
  };

  return (
    <div style={{ padding: S[6], maxWidth: 960, margin: '0 auto' }}>
      <header style={{ marginBottom: S[6] }}>
        <h1 style={{ fontFamily: F.display, fontSize: '28px', fontWeight: 700, color: C.textPrimary, margin: 0 }}>
          ARIA Persona Configuration
        </h1>
        <p style={{ fontFamily: F.body, fontSize: '14px', color: C.textMuted, margin: `${S[2]} 0 0 0` }}>
          Define how ARIA thinks and operates. ARIA will maintain this role across every campaign, content piece, and recommendation it makes.
        </p>
      </header>

      {/* Section 1 — Choose ARIA's operating role */}
      <section style={{ marginBottom: S[8] }}>
        <h2 style={{ fontFamily: F.body, fontSize: '16px', fontWeight: 600, color: C.textPrimary, margin: `0 0 ${S[2]} 0` }}>
          Choose ARIA's operating role
        </h2>
        <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: `0 0 ${S[4]} 0` }}>
          Pick the seniority level ARIA operates at. This shapes how strategic vs tactical ARIA's outputs are.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: S[4] }}>
          {PERSONAS.map((persona) => (
            <PersonaCard
              key={persona.id}
              persona={persona}
              selected={selectedPersonaId === persona.id}
              onSelect={setSelectedPersonaId}
              customRoleDescription={customRoleDescription}
              onCustomRoleChange={setCustomRoleDescription}
            />
          ))}
        </div>
      </section>

      {/* Section 2 — ARIA's operating context */}
      <section style={{ marginBottom: S[8] }}>
        <h2 style={{ fontFamily: F.body, fontSize: '16px', fontWeight: 600, color: C.textPrimary, margin: `0 0 ${S[2]} 0` }}>
          ARIA's operating context
        </h2>
        <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: `0 0 ${S[4]} 0` }}>
          ARIA uses this context to customize every output for your specific business.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: S[4] }}>
          <div>
            <label style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, display: 'block', marginBottom: S[1] }}>
              Company / Brand
            </label>
            <input
              type="text"
              value={companyBrand}
              onChange={(e) => setCompanyBrand(e.target.value)}
              style={inputStyle}
              placeholder="Medglobal"
            />
          </div>
          <div>
            <label style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, display: 'block', marginBottom: S[1] }}>
              Industry
            </label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              style={inputStyle}
              placeholder="B2B SaaS / GTM Agency"
            />
          </div>
          <div>
            <label style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, display: 'block', marginBottom: S[1] }}>
              Primary market
            </label>
            <input
              type="text"
              value={primaryMarket}
              onChange={(e) => setPrimaryMarket(e.target.value)}
              style={inputStyle}
              placeholder="Bangladesh, South Asia"
            />
          </div>
        </div>
      </section>

      {/* Section 3 — Rules of engagement */}
      <section style={{ marginBottom: S[8] }}>
        <h2 style={{ fontFamily: F.body, fontSize: '16px', fontWeight: 600, color: C.textPrimary, margin: `0 0 ${S[2]} 0` }}>
          Rules of engagement
        </h2>
        <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: `0 0 ${S[4]} 0` }}>
          Define specific rules ARIA must always follow. These override ARIA's defaults.
        </p>
        <RulesOfEngagement
          rules={ariaCustomRules}
          onToggle={toggleARIARule}
          onUpdate={updateARIARule}
          onRemove={removeARIARule}
          onAdd={handleAddRule}
        />
      </section>

      {/* Section 4 — ARIA response preview */}
      <section style={{ marginBottom: S[8] }}>
        <h2 style={{ fontFamily: F.body, fontSize: '16px', fontWeight: 600, color: C.textPrimary, margin: `0 0 ${S[2]} 0` }}>
          See how ARIA responds with your current persona settings
        </h2>
        <PersonaPreviewChat personaId={selectedPersonaId} companyBrand={companyBrand} />
      </section>

      {/* Save button */}
      <button
        type="button"
        onClick={handleSave}
        style={{
          ...btn.primary,
          width: '100%',
          padding: S[4],
          fontSize: '16px',
        }}
      >
        Save Persona Configuration
      </button>
    </div>
  );
}
