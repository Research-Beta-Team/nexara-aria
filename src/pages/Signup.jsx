import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { R, S, T, shadows, ANTARIOUS_AUTH } from '../tokens';
import useStore from '../store/useStore';
import AntariousLogo from '../components/ui/AntariousLogo';

const N = ANTARIOUS_AUTH;

// ── Shared field component (Antarious palette) ────────────────────
function Field({ label, type, value, onChange, placeholder, focusField, setFocusField, id }) {
  const isFocused = focusField === id;
  return (
    <div>
      <label style={{ display: 'block', fontFamily: N.fontBody, fontSize: '12px', fontWeight: 600, color: N.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[1] }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocusField(id)}
        onBlur={() => setFocusField(null)}
        placeholder={placeholder}
        style={{
          width: '100%',
          backgroundColor: N.surface2,
          color: N.textPrimary,
          border: `1px solid ${isFocused ? N.primary : N.border}`,
          borderRadius: N.radiusInput,
          padding: `${S[2]} ${S[3]}`,
          fontFamily: N.fontBody,
          fontSize: '14px',
          outline: 'none',
          boxSizing: 'border-box',
          transition: T.color,
          boxShadow: isFocused ? `0 0 0 2px ${N.primaryGlow}` : 'none',
        }}
      />
    </div>
  );
}

// ── Signup page (company / admin–owner) ───────
export default function Signup() {
  const navigate  = useNavigate();
  const login     = useStore((s) => s.login);
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const isOnboarded = useStore((s) => s.isOnboarded);
  const [companyName, setCompanyName] = useState('');
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [error,    setError]    = useState('');
  const [focus,    setFocus]    = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(isOnboarded ? '/' : '/onboarding/setup', { replace: true });
    }
  }, [isAuthenticated, isOnboarded, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!companyName.trim() || !name.trim() || !email.trim() || !password.trim() || !confirm.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    login();
    navigate('/onboarding/setup', { replace: true });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: N.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: `${S[6]} ${S[4]}` }}>
      <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: S[5] }}>

        {/* Brand */}
        <div style={{ textAlign: 'center' }}>
          <AntariousLogo variant="dark" height={32} />
          <div style={{ fontFamily: N.fontBody, fontSize: '15px', color: N.textSecondary, marginTop: '6px' }}>
            Your GTM, now <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', color: N.primary }}>autonomous.</em>
          </div>
        </div>

        {/* Card */}
        <div style={{ backgroundColor: N.surface, border: `1px solid ${N.border}`, borderRadius: N.radiusCard, boxShadow: shadows.modal, overflow: 'hidden' }}>

          {/* Header */}
          <div style={{ padding: `${S[5]} ${S[5]} ${S[4]}`, borderBottom: `1px solid ${N.border}` }}>
            <div style={{ fontFamily: N.fontDisplay, fontSize: '20px', fontWeight: 700, color: N.textPrimary }}>Sign up as company</div>
            <div style={{ fontFamily: N.fontBody, fontSize: '13px', color: N.textSecondary, marginTop: '4px' }}>Create your account as admin/owner to get started</div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ padding: S[5], display: 'flex', flexDirection: 'column', gap: S[4] }}>
            <Field label="Company name" type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Acme Inc." focusField={focus} setFocusField={setFocus} id="company" />
            <Field label="Your full name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Smith" focusField={focus} setFocusField={setFocus} id="name" />
            <Field label="Work Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" focusField={focus} setFocusField={setFocus} id="email" />
            <Field label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" focusField={focus} setFocusField={setFocus} id="password" />
            <Field label="Confirm Password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" focusField={focus} setFocusField={setFocus} id="confirm" />

            {error && (
              <div style={{ fontFamily: N.fontBody, fontSize: '13px', color: N.red, backgroundColor: N.redDim, border: `1px solid ${N.red}40`, borderRadius: R.md, padding: `${S[2]} ${S[3]}` }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              style={{ width: '100%', padding: `${S[3]} ${S[4]}`, backgroundColor: N.primary, color: N.textInverse, border: 'none', borderRadius: N.radiusButton, fontFamily: N.fontBody, fontSize: '14px', fontWeight: 700, cursor: 'pointer', transition: T.base }}
            >
              Create Account
            </button>

            {/* Terms note */}
            <div style={{ textAlign: 'center', fontFamily: N.fontBody, fontSize: '11px', color: N.textMuted, lineHeight: 1.5 }}>
              By creating an account you agree to our Terms of Service and Privacy Policy.
            </div>
          </form>
        </div>

        {/* Log in link */}
        <div style={{ textAlign: 'center', fontFamily: N.fontBody, fontSize: '13px', color: N.textSecondary }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: N.primary, fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', fontFamily: N.fontBody, fontSize: '12px', color: N.textMuted }}>
          Powered by Freya · Antarious · All data simulated
        </div>
      </div>
    </div>
  );
}
