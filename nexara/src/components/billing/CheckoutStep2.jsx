import { ArrowRight, ArrowLeft } from 'lucide-react';
import { C, F, R, S, T } from '../../tokens';

const COUNTRIES = [
  { code: 'BD', name: 'Bangladesh' },
  { code: 'AU', name: 'Australia' },
  { code: 'CA', name: 'Canada' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'IN', name: 'India' },
  { code: 'JP', name: 'Japan' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'PH', name: 'Philippines' },
  { code: 'SG', name: 'Singapore' },
  { code: 'US', name: 'United States' },
  { code: 'VN', name: 'Vietnam' },
];

// ── Reusable field wrapper ────────────────────
function Field({ label, required, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[1] }}>
      <label style={{
        fontFamily: F.body, fontSize: '12px', fontWeight: 600,
        color: C.textSecondary,
        display: 'flex', gap: '3px',
      }}>
        {label}
        {required && <span style={{ color: C.red }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  backgroundColor: C.surface2,
  color: C.textPrimary,
  border: `1px solid ${C.border}`,
  borderRadius: R.input,
  padding: `${S[2]} ${S[3]}`,
  fontFamily: F.body,
  fontSize: '14px',
  width: '100%',
  outline: 'none',
  boxSizing: 'border-box',
};

// ── CheckoutStep2 ─────────────────────────────
export default function CheckoutStep2({ billingInfo, updateBillingInfo, goNext, goBack }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    goNext();
  };

  return (
    <div style={{ padding: S[8] }}>
      {/* Header */}
      <div style={{ marginBottom: S[6] }}>
        <div style={{ fontFamily: F.display, fontSize: '24px', fontWeight: 800, color: C.textPrimary, letterSpacing: '-0.02em' }}>
          Billing Information
        </div>
        <div style={{ fontFamily: F.body, fontSize: '14px', color: C.textSecondary, marginTop: S[1] }}>
          Used for invoicing only. Never shared with third parties.
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>

        {/* Row 1: Company + Email */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[4] }}>
          <Field label="Company Name" required>
            <input
              required
              value={billingInfo.company}
              onChange={e => updateBillingInfo('company', e.target.value)}
              placeholder="Acme Corp"
              style={inputStyle}
            />
          </Field>
          <Field label="Billing Email" required>
            <input
              required
              type="email"
              value={billingInfo.email}
              onChange={e => updateBillingInfo('email', e.target.value)}
              placeholder="billing@acme.com"
              style={inputStyle}
            />
          </Field>
        </div>

        {/* Row 2: Country + Tax ID */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[4] }}>
          <Field label="Country" required>
            <select
              required
              value={billingInfo.country}
              onChange={e => updateBillingInfo('country', e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              {COUNTRIES.map(c => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Tax ID (Optional)">
            <input
              value={billingInfo.taxId}
              onChange={e => updateBillingInfo('taxId', e.target.value)}
              placeholder="VAT / GST number"
              style={inputStyle}
            />
          </Field>
        </div>

        {/* Address line 1 */}
        <Field label="Address Line 1">
          <input
            value={billingInfo.address1}
            onChange={e => updateBillingInfo('address1', e.target.value)}
            placeholder="Street address, P.O. box"
            style={inputStyle}
          />
        </Field>

        {/* Address line 2 */}
        <Field label="Address Line 2">
          <input
            value={billingInfo.address2}
            onChange={e => updateBillingInfo('address2', e.target.value)}
            placeholder="Apartment, suite, unit, building (optional)"
            style={inputStyle}
          />
        </Field>

        {/* Row: City / State / ZIP */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: S[4] }}>
          <Field label="City">
            <input
              value={billingInfo.city}
              onChange={e => updateBillingInfo('city', e.target.value)}
              placeholder="Dhaka"
              style={inputStyle}
            />
          </Field>
          <Field label="State / Province">
            <input
              value={billingInfo.state}
              onChange={e => updateBillingInfo('state', e.target.value)}
              placeholder="Dhaka"
              style={inputStyle}
            />
          </Field>
          <Field label="ZIP / Postal">
            <input
              value={billingInfo.zip}
              onChange={e => updateBillingInfo('zip', e.target.value)}
              placeholder="1000"
              style={inputStyle}
            />
          </Field>
        </div>

        {/* Info note */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: S[2],
          padding: `${S[3]} ${S[4]}`,
          backgroundColor: C.surface2, borderRadius: R.md,
          border: `1px solid ${C.border}`,
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: '1px' }}>
            <circle cx="7" cy="7" r="6" stroke={C.textMuted} strokeWidth="1.2"/>
            <path d="M7 6v4M7 4.5v.5" stroke={C.textMuted} strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, lineHeight: 1.5 }}>
            Your billing information is used for invoicing only. It appears on your receipts and tax documents.
          </span>
        </div>

        {/* Button row */}
        <div style={{ display: 'flex', gap: S[3], marginTop: S[2] }}>
          <button
            type="button"
            onClick={goBack}
            style={{
              display: 'flex', alignItems: 'center', gap: S[2],
              padding: `${S[3]} ${S[4]}`,
              backgroundColor: 'transparent', color: C.textSecondary,
              border: `1px solid ${C.border}`, borderRadius: R.button,
              fontFamily: F.body, fontSize: '14px', fontWeight: 500,
              cursor: 'pointer', transition: T.color,
            }}
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <button
            type="submit"
            style={{
              flex: 1, padding: `${S[3]} ${S[5]}`,
              backgroundColor: '#3DDC84', color: '#070D09',
              border: 'none', borderRadius: R.button,
              fontFamily: F.body, fontSize: '15px', fontWeight: 700,
              cursor: 'pointer', transition: T.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: S[2],
            }}
          >
            Continue to Payment
            <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
