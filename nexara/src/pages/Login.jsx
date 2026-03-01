import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { C, F, R, S, T, shadows } from '../tokens';
import useStore from '../store/useStore';

// ── Shared field component ────────────────────
function Field({ label, type, value, onChange, placeholder, focusField, setFocusField, id }) {
  const isFocused = focusField === id;
  return (
    <div>
      <label style={{ display: 'block', fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[1] }}>
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
          backgroundColor: C.surface2,
          color: C.textPrimary,
          border: `1px solid ${isFocused ? C.primary : C.border}`,
          borderRadius: R.input,
          padding: `${S[2]} ${S[3]}`,
          fontFamily: F.body,
          fontSize: '14px',
          outline: 'none',
          boxSizing: 'border-box',
          transition: T.color,
          boxShadow: isFocused ? `0 0 0 2px ${C.primaryGlow}` : 'none',
        }}
      />
    </div>
  );
}

// ── Login page ────────────────────────────────
export default function Login() {
  const navigate  = useNavigate();
  const login     = useStore((s) => s.login);
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [focus,    setFocus]    = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    login();
    navigate('/onboarding');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: `${S[6]} ${S[4]}` }}>
      <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: S[5] }}>

        {/* Brand */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: F.display, fontSize: '30px', fontWeight: 800, color: C.primary, letterSpacing: '-0.03em' }}>NEXTARA</div>
          <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, marginTop: '4px' }}>AI-Powered B2B Campaign Intelligence</div>
        </div>

        {/* Card */}
        <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card, boxShadow: shadows.modal, overflow: 'hidden' }}>

          {/* Header */}
          <div style={{ padding: `${S[5]} ${S[5]} ${S[4]}`, borderBottom: `1px solid ${C.border}` }}>
            <div style={{ fontFamily: F.display, fontSize: '20px', fontWeight: 700, color: C.textPrimary }}>Welcome back</div>
            <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, marginTop: '4px' }}>Sign in to your Nextara account</div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ padding: S[5], display: 'flex', flexDirection: 'column', gap: S[4] }}>
            <Field label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" focusField={focus} setFocusField={setFocus} id="email" />
            <Field label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" focusField={focus} setFocusField={setFocus} id="password" />

            {error && (
              <div style={{ fontFamily: F.body, fontSize: '13px', color: C.red, backgroundColor: C.redDim, border: `1px solid rgba(255,110,122,0.2)`, borderRadius: R.md, padding: `${S[2]} ${S[3]}` }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              style={{ width: '100%', padding: `${S[3]} ${S[4]}`, backgroundColor: C.primary, color: C.textInverse, border: 'none', borderRadius: R.button, fontFamily: F.body, fontSize: '14px', fontWeight: 700, cursor: 'pointer', transition: T.base }}
            >
              Sign In
            </button>
          </form>
        </div>

        {/* Sign up link */}
        <div style={{ textAlign: 'center', fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: C.primary, fontWeight: 600, textDecoration: 'none' }}>Create one</Link>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>
          Powered by ARIA · Nextara AI Platform · All data simulated
        </div>
      </div>
    </div>
  );
}
