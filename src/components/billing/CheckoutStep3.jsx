import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { PLANS } from '../../config/plans';
import { C, F, R, S, T } from '../../tokens';
import { IconLock, IconCheck, IconRefresh } from '../ui/Icons';

// ── Proration helper (matches Step1) ──────────
function calcProration(fromPlanId) {
  const plan = PLANS[fromPlanId];
  if (!plan) return 0;
  return Math.round((plan.price.annual * 12 / 365) * 30);
}

function formatCredits(n) {
  if (n >= 1_000_000) return `${n / 1_000_000}M`;
  if (n >= 1_000)     return `${(n / 1_000).toLocaleString()}K`;
  return n.toLocaleString();
}

// ── Payment method tabs ───────────────────────
const PAYMENT_TABS = [
  { id: 'card',  label: '💳 Card' },
  { id: 'wire',  label: '🏦 Wire Transfer' },
  { id: 'crypto',label: '₿ Crypto', soon: true },
];

// ── Card form ─────────────────────────────────
function CardForm({ cardNumber, setCardNumber }) {
  const [expiry,       setExpiry]       = useState('');
  const [cvv,          setCvv]          = useState('');
  const [cardHolder,   setCardHolder]   = useState('');

  const formatCardNumber = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const inputSt = {
    backgroundColor: C.surface2,
    color: C.textPrimary,
    border: `1px solid ${C.border}`,
    borderRadius: R.input,
    padding: `${S[3]} ${S[4]}`,
    fontFamily: F.mono,
    fontSize: '14px',
    width: '100%',
    outline: 'none',
    boxSizing: 'border-box',
    letterSpacing: '0.05em',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
      {/* Card number */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[1] }}>
        <label style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary }}>
          Card Number
        </label>
        <input
          value={cardNumber}
          onChange={e => setCardNumber(formatCardNumber(e.target.value))}
          placeholder="•••• •••• •••• ••••"
          maxLength={19}
          style={inputSt}
        />
      </div>

      {/* Expiry + CVV */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[3] }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[1] }}>
          <label style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary }}>
            Expiry Date
          </label>
          <input
            value={expiry}
            onChange={e => setExpiry(formatExpiry(e.target.value))}
            placeholder="MM/YY"
            maxLength={5}
            style={inputSt}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[1] }}>
          <label style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary }}>
            CVV
          </label>
          <input
            value={cvv}
            onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="•••"
            maxLength={4}
            style={inputSt}
          />
        </div>
      </div>

      {/* Cardholder name */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: S[1] }}>
        <label style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary }}>
          Cardholder Name
        </label>
        <input
          value={cardHolder}
          onChange={e => setCardHolder(e.target.value)}
          placeholder="Jane Smith"
          style={{ ...inputSt, fontFamily: F.body, letterSpacing: 'normal' }}
        />
      </div>

      {/* Stripe badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginTop: S[1] }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="1" y="3" width="12" height="8" rx="1.5" stroke={C.textMuted} strokeWidth="1.2"/>
          <path d="M1 6h12" stroke={C.textMuted} strokeWidth="1.2"/>
        </svg>
        <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>
          🔒 Secured by Stripe — PCI DSS Level 1 compliant
        </span>
      </div>
    </div>
  );
}

// ── Wire transfer info ────────────────────────
function WireInfo() {
  return (
    <div style={{
      backgroundColor: C.surface2, border: `1px solid ${C.border}`,
      borderRadius: R.card, padding: S[5],
      display: 'flex', flexDirection: 'column', gap: S[3],
    }}>
      <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, lineHeight: 1.6 }}>
        Wire transfer instructions will be emailed to your billing address after you confirm.
        Upgrades activate within <strong style={{ color: C.textPrimary }}>1–2 business days</strong> of payment receipt.
      </div>
      {[
        ['Bank', 'DBS Bank Singapore'],
        ['Account Name', 'Nexara Pte. Ltd.'],
        ['Account No.', '0123-4567-8901'],
        ['SWIFT', 'DBSSSGSG'],
        ['Reference', 'NEXARA-UPGRADE-XXXXX'],
      ].map(([label, val]) => (
        <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>{label}</span>
          <span style={{ fontFamily: F.mono, fontSize: '12px', color: C.textPrimary }}>{val}</span>
        </div>
      ))}
    </div>
  );
}

// ── Order summary sidebar ─────────────────────
function OrderSummary({ toPlan, billing, dueToday }) {
  const renewDate = new Date('2027-03-01').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div style={{
      backgroundColor: C.surface2,
      border: `1px solid ${C.border}`,
      borderRadius: R.card,
      overflow: 'hidden',
      position: 'sticky',
      top: 0,
    }}>
      {/* Plan header */}
      <div style={{
        backgroundColor: `${toPlan.color}18`,
        borderBottom: `1px solid ${C.border}`,
        padding: S[4],
      }}>
        <div style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: toPlan.color }}>
          {toPlan.displayName}
        </div>
        <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, marginTop: '2px' }}>
          {billing === 'annual' ? 'Annual billing' : 'Monthly billing'}
        </div>
      </div>

      {/* Line items */}
      <div style={{ padding: S[4], display: 'flex', flexDirection: 'column', gap: S[3] }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
            {billing === 'annual' ? `$${toPlan.price.annual}/mo × 12` : `Monthly`}
          </span>
          <span style={{ fontFamily: F.mono, fontSize: '13px', color: C.textPrimary }}>
            ${(billing === 'annual' ? toPlan.price.annual * 12 : toPlan.price.monthly).toLocaleString()}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>Proration credit</span>
          <span style={{ fontFamily: F.mono, fontSize: '13px', color: '#3DDC84' }}>–included</span>
        </div>

        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: S[3] }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>Due today</span>
            <span style={{ fontFamily: F.mono, fontSize: '18px', fontWeight: 700, color: toPlan.color }}>
              ${dueToday.toLocaleString()}
            </span>
          </div>
        </div>

        <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, lineHeight: 1.5 }}>
          Then ${toPlan.price[billing].toLocaleString()}/month from {renewDate}
        </div>
      </div>

      {/* Trust badges */}
      <div style={{
        borderTop: `1px solid ${C.border}`,
        padding: S[4],
        display: 'flex', flexDirection: 'column', gap: S[2],
      }}>
        {[
          { Icon: IconLock,   text: 'SSL Encrypted' },
          { Icon: IconCheck,  text: 'Stripe Secured' },
          { Icon: IconRefresh, text: '14-day money-back guarantee' },
        ].map(({ Icon, text }) => (
          <div key={text} style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
            <Icon color={C.textMuted} width={16} height={16} />
            <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── CheckoutStep3 ─────────────────────────────
export default function CheckoutStep3({ fromPlanId, toPlanId, billing, isProcessing, startPayment, goBack }) {
  const [activeTab,  setActiveTab]  = useState('card');
  const [cardNumber, setCardNumber] = useState('');

  const toPlan   = PLANS[toPlanId] ?? PLANS.growth;
  const proration = calcProration(fromPlanId);
  const fullCost  = billing === 'annual' ? toPlan.price.annual * 12 : toPlan.price.monthly;
  const dueToday  = Math.max(0, fullCost - proration);

  const btnColor    = toPlan.color;
  const btnTextColor = ['growth', 'scale'].includes(toPlanId) ? '#070D09' : C.textPrimary;

  return (
    <div style={{ padding: S[8] }}>
      {/* Header */}
      <div style={{ marginBottom: S[6] }}>
        <div style={{ fontFamily: F.display, fontSize: '24px', fontWeight: 800, color: C.textPrimary, letterSpacing: '-0.02em' }}>
          Payment
        </div>
        <div style={{ fontFamily: F.body, fontSize: '14px', color: C.textSecondary, marginTop: S[1] }}>
          Your card is charged only after you confirm below.
        </div>
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: S[6] }}>

        {/* Left: payment form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[5] }}>

          {/* Payment method tabs */}
          <div style={{
            display: 'flex', gap: S[2],
            borderBottom: `1px solid ${C.border}`,
            paddingBottom: S[3],
          }}>
            {PAYMENT_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => !tab.soon && setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: S[1],
                  padding: `${S[2]} ${S[3]}`,
                  backgroundColor: activeTab === tab.id ? C.surface2 : 'transparent',
                  border: `1px solid ${activeTab === tab.id ? C.border : 'transparent'}`,
                  borderRadius: R.button,
                  fontFamily: F.body, fontSize: '13px', fontWeight: activeTab === tab.id ? 600 : 400,
                  color: tab.soon ? C.textMuted : activeTab === tab.id ? C.textPrimary : C.textSecondary,
                  cursor: tab.soon ? 'default' : 'pointer',
                  transition: T.color,
                }}
              >
                {tab.label}
                {tab.soon && (
                  <span style={{
                    fontFamily: F.mono, fontSize: '9px', fontWeight: 700,
                    color: C.textMuted, backgroundColor: C.surface3,
                    borderRadius: R.pill, padding: `1px ${S[1]}`,
                  }}>
                    SOON
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === 'card' && (
            <CardForm cardNumber={cardNumber} setCardNumber={setCardNumber} />
          )}
          {activeTab === 'wire' && <WireInfo />}

          {/* CTA button */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[3], marginTop: S[2] }}>
            <div style={{ display: 'flex', gap: S[3] }}>
              <button
                onClick={goBack}
                style={{
                  display: 'flex', alignItems: 'center', gap: S[1],
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
                onClick={activeTab === 'wire' ? startPayment : startPayment}
                disabled={isProcessing}
                style={{
                  flex: 1,
                  padding: `${S[3]} ${S[5]}`,
                  backgroundColor: isProcessing ? `${btnColor}80` : btnColor,
                  color: btnTextColor,
                  border: 'none', borderRadius: R.button,
                  fontFamily: F.body, fontSize: '15px', fontWeight: 700,
                  cursor: isProcessing ? 'default' : 'pointer',
                  transition: T.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: S[2],
                }}
              >
                {isProcessing ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="20 8" strokeLinecap="round"/>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    {activeTab === 'wire' ? 'Confirm & Get Wire Details' : `Complete Upgrade — Pay $${dueToday.toLocaleString()}`}
                  </>
                )}
              </button>
            </div>

            {/* Legal text */}
            <div style={{ textAlign: 'center', fontFamily: F.body, fontSize: '11px', color: C.textMuted, lineHeight: 1.5 }}>
              By continuing you agree to our{' '}
              <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Terms of Service</span>
              {' '}and{' '}
              <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Privacy Policy</span>.
              Annual plans are billed upfront and non-refundable after 14 days.
            </div>
          </div>
        </div>

        {/* Right: order summary */}
        <OrderSummary toPlan={toPlan} billing={billing} dueToday={dueToday} />
      </div>
    </div>
  );
}
