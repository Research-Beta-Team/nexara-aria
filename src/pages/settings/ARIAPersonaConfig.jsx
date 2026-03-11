import { useState, useEffect } from 'react';
import useStore from '../../store/useStore';
import useToast from '../../hooks/useToast';
import { C, F, R, S, btn, inputStyle } from '../../tokens';
import { PERSONAS } from '../../data/freyaPersonas';
import PersonaCard from '../../components/freya/PersonaCard';
import RulesOfEngagement from '../../components/freya/RulesOfEngagement';
import PersonaPreviewChat from '../../components/freya/PersonaPreviewChat';

export default function ARIAPersonaConfig() {
  const toast = useToast();
  const {
    freyaPersonaId,
    freyaOperatingRole,
    freyaCustomRoleDescription,
    freyaCompanyBrand,
    freyaIndustry,
    freyaPrimaryMarket,
    freyaCustomRules,
    setFreyaPersona,
    setFreyaCustomRoleDescription,
    setFreyaContext,
    addFreyaRule,
    updateFreyaRule,
    toggleFreyaRule,
    removeFreyaRule,
  } = useStore();

  const [selectedPersonaId, setSelectedPersonaId] = useState(freyaPersonaId);
  const [companyBrand, setCompanyBrand] = useState(freyaCompanyBrand);
  const [industry, setIndustry] = useState(freyaIndustry);
  const [primaryMarket, setPrimaryMarket] = useState(freyaPrimaryMarket);
  const [customRoleDescription, setCustomRoleDescription] = useState(freyaCustomRoleDescription);

  useEffect(() => {
    setSelectedPersonaId(freyaPersonaId);
    setCompanyBrand(freyaCompanyBrand);
    setIndustry(freyaIndustry);
    setPrimaryMarket(freyaPrimaryMarket);
    setCustomRoleDescription(freyaCustomRoleDescription);
  }, [freyaPersonaId, freyaCompanyBrand, freyaIndustry, freyaPrimaryMarket, freyaCustomRoleDescription]);

  const selectedPersona = PERSONAS.find((p) => p.id === selectedPersonaId) || PERSONAS[0];
  const roleLabel = selectedPersonaId === 'custom' && customRoleDescription.trim()
    ? customRoleDescription.trim().slice(0, 50) + (customRoleDescription.trim().length > 50 ? '…' : '')
    : selectedPersona?.label || 'Chief Revenue Officer';

  const handleSave = () => {
    setFreyaPersona(selectedPersonaId, selectedPersonaId === 'custom' ? roleLabel : selectedPersona?.label);
    setFreyaContext({ companyBrand, industry, primaryMarket });
    setFreyaCustomRoleDescription(customRoleDescription);
    toast.success(`Freya will now operate as your ${roleLabel}.`);
  };

  const handleAddRule = () => {
    addFreyaRule({
      text: '',
      enabled: true,
      category: 'TONE',
    });
  };

  return (
    <div style={{ padding: S[6], maxWidth: 960, margin: '0 auto' }}>
      <header style={{ marginBottom: S[6] }}>
        <h1 style={{ fontFamily: F.display, fontSize: '28px', fontWeight: 700, color: C.textPrimary, margin: 0 }}>
          Freya Persona Configuration
        </h1>
        <p style={{ fontFamily: F.body, fontSize: '14px', color: C.textMuted, margin: `${S[2]} 0 0 0` }}>
          Define how Freya thinks and operates. Freya will maintain this role across every campaign, content piece, and recommendation it makes.
        </p>
      </header>

      {/* Section 1 — Choose Freya's operating role */}
      <section style={{ marginBottom: S[8] }}>
        <h2 style={{ fontFamily: F.body, fontSize: '16px', fontWeight: 600, color: C.textPrimary, margin: `0 0 ${S[2]} 0` }}>
          Choose Freya's operating role
        </h2>
        <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: `0 0 ${S[4]} 0` }}>
          Pick the seniority level Freya operates at. This shapes how strategic vs tactical Freya's outputs are.
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

      {/* Section 2 — Freya's operating context */}
      <section style={{ marginBottom: S[8] }}>
        <h2 style={{ fontFamily: F.body, fontSize: '16px', fontWeight: 600, color: C.textPrimary, margin: `0 0 ${S[2]} 0` }}>
          Freya's operating context
        </h2>
        <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: `0 0 ${S[4]} 0` }}>
          Freya uses this context to customize every output for your specific business.
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
          Define specific rules Freya must always follow. These override Freya's defaults.
        </p>
        <RulesOfEngagement
          rules={freyaCustomRules}
          onToggle={toggleFreyaRule}
          onUpdate={updateFreyaRule}
          onRemove={removeFreyaRule}
          onAdd={handleAddRule}
        />
      </section>

      {/* Section 4 — Freya response preview */}
      <section style={{ marginBottom: S[8] }}>
        <h2 style={{ fontFamily: F.body, fontSize: '16px', fontWeight: 600, color: C.textPrimary, margin: `0 0 ${S[2]} 0` }}>
          See how Freya responds with your current persona settings
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
