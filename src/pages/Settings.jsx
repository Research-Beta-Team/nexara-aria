import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import useToast from '../hooks/useToast';
import { C, F, R, S, T, shadows, badge } from '../tokens';

// ── Nav sections ──────────────────────────────
const SECTIONS = [
  {
    id: 'profile', label: 'Profile',
    icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="5" r="3" stroke="currentColor" strokeWidth="1.4"/><path d="M1.5 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  },
  {
    id: 'workspace', label: 'Workspace',
    icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1.5" y="2" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M5 13.5h5M7.5 11v2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  },
  {
    id: 'appearance', label: 'Appearance',
    icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="2.5" stroke="currentColor" strokeWidth="1.4"/><path d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14M2.87 2.87l1.06 1.06M11.07 11.07l1.06 1.06M2.87 12.13l1.06-1.06M11.07 3.93l1.06-1.06" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  },
  {
    id: 'notifications', label: 'Notifications',
    icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 1.5a4.5 4.5 0 00-4.5 4.5v2.5l-1 2h11l-1-2V6a4.5 4.5 0 00-4.5-4.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M6 11.5a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  },
  {
    id: 'connections', label: 'Connections',
    icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M5 4.5h1M9 4.5h1M5 7h5M5 9.5h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><rect x="1.5" y="2" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M4 13.5h7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  },
  {
    icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 1L2 3.5V7c0 3.5 2.5 5.5 5.5 6.5C10 12.5 13 10.5 13 7V3.5L7.5 1z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M5 7.5l2 2 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    id: 'danger', label: 'Danger Zone',
    icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 1.5L1 13.5h13L7.5 1.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M7.5 6v3M7.5 11v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
    danger: true,
  },
];

// ── Shared helpers ─────────────────────────────
function SectionHeader({ title, description }) {
  return (
    <div style={{ marginBottom: S[6] }}>
      <div style={{ fontFamily: F.display, fontSize: '18px', fontWeight: 700, color: C.textPrimary, letterSpacing: '-0.02em' }}>{title}</div>
      {description && <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, marginTop: '4px' }}>{description}</div>}
    </div>
  );
}

function Card({ children, style }) {
  return (
    <div style={{ backgroundColor: C.surface2, border: `1px solid ${C.border}`, borderRadius: R.card, overflow: 'hidden', ...style }}>
      {children}
    </div>
  );
}

function CardRow({ label, description, children, last }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: S[4],
      padding: `${S[4]} ${S[5]}`,
      borderBottom: last ? 'none' : `1px solid ${C.border}`,
    }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: F.body, fontSize: '14px', fontWeight: 500, color: C.textPrimary }}>{label}</div>
        {description && <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, marginTop: '2px' }}>{description}</div>}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

function FormField({ label, type = 'text', value, onChange, placeholder, disabled, focus, setFocus, id }) {
  const isFocused = focus === id;
  return (
    <div>
      <label style={{ display: 'block', fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: C.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[1] }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={() => setFocus?.(id)}
        onBlur={() => setFocus?.(null)}
        style={{
          width: '100%', boxSizing: 'border-box',
          backgroundColor: disabled ? C.surface3 : C.bg,
          color: disabled ? C.textMuted : C.textPrimary,
          border: `1px solid ${isFocused ? C.primary : C.border}`,
          borderRadius: R.input, padding: `${S[2]} ${S[3]}`,
          fontFamily: F.body, fontSize: '14px', outline: 'none',
          transition: T.color,
          boxShadow: isFocused ? `0 0 0 2px var(--c-primary-glow)` : 'none',
          cursor: disabled ? 'not-allowed' : 'text',
          opacity: disabled ? 0.6 : 1,
        }}
      />
    </div>
  );
}

function Toggle({ on, onChange }) {
  return (
    <div
      onClick={() => onChange(!on)}
      style={{
        width: '40px', height: '22px', borderRadius: R.pill,
        backgroundColor: on ? C.primary : C.surface3,
        border: `1px solid ${on ? C.primary : C.border}`,
        position: 'relative', cursor: 'pointer',
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
        flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute', top: '2px',
        left: on ? '19px' : '2px',
        width: '16px', height: '16px', borderRadius: '50%',
        backgroundColor: on ? C.textInverse : C.textMuted,
        transition: 'left 0.2s ease, background-color 0.2s ease',
      }}/>
    </div>
  );
}

// ── Profile section ───────────────────────────
function ProfileSection() {
  const currentRole = useStore((s) => s.currentRole);
  const toast = useToast();
  const [name,    setName]    = useState('Alex Nguyen');
  const [email,   setEmail]   = useState('alex@acmecorp.com');
  const [title,   setTitle]   = useState('Head of Growth');
  const [company, setCompany] = useState('Acme Corp');
  const [focus,   setFocus]   = useState(null);

  const initials = name.split(' ').filter(Boolean).map((w) => w[0]).join('').slice(0, 2).toUpperCase() || 'NX';

  return (
    <div>
      <SectionHeader title="Profile" description="Your personal information visible across the platform." />

      {/* Avatar card */}
      <Card style={{ marginBottom: S[5] }}>
        <div style={{ padding: S[5], display: 'flex', alignItems: 'center', gap: S[4] }}>
          {/* Avatar */}
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%', flexShrink: 0,
            backgroundColor: C.primaryGlow, border: `2px solid ${C.primary}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 24px var(--c-primary-glow)`,
          }}>
            <span style={{ fontFamily: F.mono, fontSize: '20px', fontWeight: 700, color: C.primary }}>{initials}</span>
          </div>

          {/* Identity */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: F.display, fontSize: '17px', fontWeight: 700, color: C.textPrimary }}>{name || 'Your Name'}</div>
            <div style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, marginTop: '2px' }}>
              {title}{title && company ? ' · ' : ''}{company}
            </div>
            <div style={{ marginTop: S[2] }}>
              <span style={{ ...badge.base, ...badge.green, fontSize: '10px' }}>{currentRole}</span>
            </div>
          </div>

          {/* Change photo */}
          <button
            onClick={() => toast.info('Avatar upload coming soon.')}
            style={{ padding: `${S[2]} ${S[3]}`, backgroundColor: 'transparent', color: C.textSecondary, border: `1px solid ${C.border}`, borderRadius: R.button, fontFamily: F.body, fontSize: '12px', cursor: 'pointer', transition: T.color, whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            Change Photo
          </button>
        </div>
      </Card>

      {/* Fields */}
      <Card style={{ marginBottom: S[5] }}>
        <div style={{ padding: S[5], display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[4] }}>
          <FormField label="Display Name"   value={name}    onChange={(e) => setName(e.target.value)}    placeholder="Your full name"      focus={focus} setFocus={setFocus} id="name" />
          <FormField label="Email Address"  value={email}   onChange={(e) => setEmail(e.target.value)}   placeholder="you@company.com"     focus={focus} setFocus={setFocus} id="email" type="email" />
          <FormField label="Job Title"      value={title}   onChange={(e) => setTitle(e.target.value)}   placeholder="e.g. Head of Growth" focus={focus} setFocus={setFocus} id="title" />
          <FormField label="Company"        value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Your company name"   focus={focus} setFocus={setFocus} id="company" />
        </div>
        <div style={{ padding: `0 ${S[5]} ${S[5]}` }}>
          <FormField label="Role" value={currentRole} disabled id="role" />
          <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, marginTop: S[1] }}>Role is assigned by your platform admin and cannot be changed here.</div>
        </div>
      </Card>

      <button
        onClick={() => toast.success('Profile saved.')}
        style={{ padding: `${S[2]} ${S[5]}`, backgroundColor: C.primary, color: C.textInverse, border: 'none', borderRadius: R.button, fontFamily: F.body, fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: T.base }}
      >
        Save Changes
      </button>
    </div>
  );
}

// ── Workspace section ─────────────────────────
function WorkspaceSection() {
  const toast = useToast();
  const [orgName,   setOrgName]   = useState('Acme Corp');
  const [timezone,  setTimezone]  = useState('Asia/Ho_Chi_Minh');
  const [currency,  setCurrency]  = useState('USD');
  const [focus,     setFocus]     = useState(null);

  return (
    <div>
      <SectionHeader title="Workspace" description="Organisation-level settings shared across your team." />

      <Card style={{ marginBottom: S[5] }}>
        <div style={{ padding: S[5], display: 'flex', flexDirection: 'column', gap: S[4] }}>
          <FormField label="Organisation Name" value={orgName}  onChange={(e) => setOrgName(e.target.value)}  placeholder="Your org name" focus={focus} setFocus={setFocus} id="org" />
          <FormField label="Default Timezone"  value={timezone} onChange={(e) => setTimezone(e.target.value)} placeholder="e.g. Asia/Ho_Chi_Minh" focus={focus} setFocus={setFocus} id="tz" />
          <FormField label="Reporting Currency" value={currency} onChange={(e) => setCurrency(e.target.value)} placeholder="USD" focus={focus} setFocus={setFocus} id="cur" />
        </div>
      </Card>

      {/* Seats */}
      <Card style={{ marginBottom: S[5] }}>
        <div style={{ padding: `${S[3]} ${S[5]}`, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Plan & Seats</div>
        </div>
        {[
          { label: 'Plan', value: 'Growth', highlight: true },
          { label: 'Active Seats', value: '4 / 10' },
          { label: 'ARIA Agent Limit', value: '12 / 20' },
          { label: 'Renewal Date', value: 'April 1, 2026' },
        ].map(({ label, value, highlight }, i, arr) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `${S[3]} ${S[5]}`, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}>
            <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>{label}</span>
            <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 600, color: highlight ? C.primary : C.textPrimary }}>{value}</span>
          </div>
        ))}
      </Card>

      <button
        onClick={() => toast.success('Workspace settings saved.')}
        style={{ padding: `${S[2]} ${S[5]}`, backgroundColor: C.primary, color: C.textInverse, border: 'none', borderRadius: R.button, fontFamily: F.body, fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: T.base }}
      >
        Save Changes
      </button>
    </div>
  );
}

// ── Appearance section ────────────────────────
function AppearanceSection() {
  const isDarkMode  = useStore((s) => s.isDarkMode);
  const toggleTheme = useStore((s) => s.toggleTheme);
  const toast       = useToast();

  return (
    <div>
      <SectionHeader title="Appearance" description="Customize the look and feel of the Nextara interface." />

      <Card style={{ marginBottom: S[4] }}>
        {/* Theme */}
        <div style={{ padding: S[5], borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontFamily: F.body, fontSize: '14px', fontWeight: 500, color: C.textPrimary, marginBottom: '4px' }}>Interface Theme</div>
          <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, marginBottom: S[4] }}>Choose between dark and light mode.</div>
          <div style={{ display: 'flex', gap: S[3] }}>
            {[
              { id: 'dark',  label: 'Dark',  icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M12 9A6 6 0 014 2a6 6 0 108 7z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg> },
              { id: 'light', label: 'Light', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.4"/><path d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M2.64 2.64l1.06 1.06M10.3 10.3l1.06 1.06M2.64 11.36l1.06-1.06M10.3 3.7l1.06-1.06" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> },
            ].map(({ id, label, icon }) => {
              const active = (id === 'dark') === isDarkMode;
              return (
                <button
                  key={id}
                  onClick={() => { if ((id === 'dark') !== isDarkMode) toggleTheme(); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: S[2],
                    padding: `${S[2]} ${S[4]}`,
                    backgroundColor: active ? C.primaryGlow : C.surface3,
                    color: active ? C.primary : C.textSecondary,
                    border: `1px solid ${active ? C.primary : C.border}`,
                    borderRadius: R.button, fontFamily: F.body, fontSize: '13px', fontWeight: active ? 600 : 400,
                    cursor: 'pointer', transition: T.color,
                  }}
                >
                  {icon}{label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <CardRow label="Collapsed Sidebar by Default" description="Start with the sidebar in compact mode." last>
          <Toggle on={false} onChange={() => toast.info('Saved.')} />
        </CardRow>
      </Card>

      {/* Typography */}
      <Card>
        <div style={{ padding: `${S[3]} ${S[5]}`, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Typography</div>
        </div>
        {[
          { label: 'Syne',          role: 'Display / Headings',      sample: 'NEXARA' },
          { label: 'DM Sans',       role: 'Body / UI Text',          sample: 'Campaign Intelligence' },
          { label: 'JetBrains Mono',role: 'Code / Data / Labels',    sample: '3DDC84 · v1.4 · 94%' },
        ].map(({ label, role, sample }, i, arr) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${S[3]} ${S[5]}`, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}>
            <div>
              <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 500, color: C.textPrimary }}>{label}</div>
              <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>{role}</div>
            </div>
            <div style={{ fontFamily: label === 'JetBrains Mono' ? F.mono : label === 'Syne' ? F.display : F.body, fontSize: '13px', color: C.textSecondary }}>{sample}</div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ── Notifications section ─────────────────────
function NotificationsSection() {
  const toast = useToast();
  const [prefs, setPrefs] = useState({
    escalations:     true,
    agentStatus:     true,
    campaignUpdates: false,
    weeklyDigest:    true,
    approvalRequired:true,
    systemAlerts:    false,
  });

  const toggle = (key) => {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
    toast.info('Notification preference saved.');
  };

  const NOTIF_ROWS = [
    { key: 'escalations',     label: 'Escalation Alerts',        desc: 'ARIA escalates a query or output for your review.' },
    { key: 'approvalRequired',label: 'Approval Required',        desc: 'An output requires your approval before publishing.' },
    { key: 'agentStatus',     label: 'Agent Status Changes',     desc: 'An agent goes active, paused, or encounters an error.' },
    { key: 'campaignUpdates', label: 'Campaign Updates',         desc: 'Milestone reached, budget alert, or strategy changes.' },
    { key: 'weeklyDigest',    label: 'Weekly Performance Digest',desc: 'Summary of campaign metrics every Monday morning.' },
    { key: 'systemAlerts',    label: 'System & Maintenance',     desc: 'Scheduled downtime or platform-wide updates.' },
  ];

  return (
    <div>
      <SectionHeader title="Notifications" description="Choose what events trigger in-app and email alerts." />
      <Card>
        {NOTIF_ROWS.map(({ key, label, desc }, i) => (
          <CardRow key={key} label={label} description={desc} last={i === NOTIF_ROWS.length - 1}>
            <Toggle on={prefs[key]} onChange={() => toggle(key)} />
          </CardRow>
        ))}
      </Card>
    </div>
  );
}

// ── Security section ──────────────────────────
function ConnectionsSection() {
  const connections = useStore((s) => s.connections);
  const setConnectionWebsite = useStore((s) => s.setConnectionWebsite);
  const setConnectionCrm = useStore((s) => s.setConnectionCrm);
  const setConnectionAds = useStore((s) => s.setConnectionAds);
  const toast = useToast();
  const [focus, setFocus] = useState(null);
  const [editingWebsite, setEditingWebsite] = useState(false);
  const [websiteInput, setWebsiteInput] = useState(connections.website || '');

  const saveWebsite = () => {
    setConnectionWebsite(websiteInput.trim() || null);
    setEditingWebsite(false);
    toast.success(websiteInput.trim() ? 'Website saved.' : 'Website disconnected.');
  };

  return (
    <div>
      <SectionHeader
        title="Connections"
        description="Add or remove integrations. Some features use these connections."
      />

      <Card style={{ marginBottom: S[4] }}>
        {/* Company website */}
        <div style={{ padding: S[5], borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontFamily: F.body, fontSize: '14px', fontWeight: 500, color: C.textPrimary, marginBottom: '4px' }}>Company website</div>
          <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, marginBottom: S[3] }}>We use this for ICP and ARIA context.</div>
          {editingWebsite ? (
            <div style={{ display: 'flex', gap: S[2], alignItems: 'center' }}>
              <input
                type="url"
                value={websiteInput}
                onChange={(e) => setWebsiteInput(e.target.value)}
                placeholder="https://..."
                onFocus={() => setFocus('website')}
                onBlur={() => setFocus(null)}
                style={{
                  flex: 1, boxSizing: 'border-box',
                  backgroundColor: C.bg, color: C.textPrimary,
                  border: `1px solid ${focus === 'website' ? C.primary : C.border}`,
                  borderRadius: R.input, padding: `${S[2]} ${S[3]}`,
                  fontFamily: F.body, fontSize: '14px', outline: 'none', transition: T.color,
                }}
              />
              <button onClick={saveWebsite} style={{ padding: `${S[2]} ${S[3]}`, backgroundColor: C.primary, color: C.textInverse, border: 'none', borderRadius: R.button, fontFamily: F.body, fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Save</button>
              <button onClick={() => { setEditingWebsite(false); setWebsiteInput(connections.website || ''); }} style={{ padding: `${S[2]} ${S[3]}`, backgroundColor: 'transparent', color: C.textSecondary, border: `1px solid ${C.border}`, borderRadius: R.button, fontFamily: F.body, fontSize: '12px', cursor: 'pointer' }}>Cancel</button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: S[4] }}>
              <span style={{ fontFamily: F.body, fontSize: '13px', color: connections.website ? C.textPrimary : C.textMuted }}>{connections.website || 'Not connected'}</span>
              <div style={{ display: 'flex', gap: S[2] }}>
                <button onClick={() => { setEditingWebsite(true); setWebsiteInput(connections.website || ''); }} style={{ padding: `${S[1]} ${S[3]}`, backgroundColor: 'transparent', color: C.textSecondary, border: `1px solid ${C.border}`, borderRadius: R.button, fontFamily: F.body, fontSize: '12px', cursor: 'pointer' }}>Edit</button>
                {connections.website && <button onClick={() => { setConnectionWebsite(null); toast.success('Website disconnected.'); }} style={{ padding: `${S[1]} ${S[3]}`, backgroundColor: 'transparent', color: C.red, border: `1px solid ${C.red}`, borderRadius: R.button, fontFamily: F.body, fontSize: '12px', cursor: 'pointer' }}>Disconnect</button>}
              </div>
            </div>
          )}
        </div>

        {/* CRM */}
        <CardRow
          label="CRM"
          description={connections.crm ? `Connected (${connections.crm})` : 'Connect HubSpot, Salesforce, or Pipedrive.'}
          last={false}
        >
          <button onClick={() => toast.info('CRM connection coming soon.')} style={{ padding: `${S[1]} ${S[3]}`, backgroundColor: connections.crm ? C.redDim : 'transparent', color: connections.crm ? C.red : C.textSecondary, border: `1px solid ${connections.crm ? C.red : C.border}`, borderRadius: R.button, fontFamily: F.body, fontSize: '12px', cursor: 'pointer' }}>{connections.crm ? 'Disconnect' : 'Connect'}</button>
        </CardRow>

        {/* Ads */}
        <div style={{ padding: `${S[3]} ${S[5]}`, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Ads & channels</div>
        </div>
        {[
          { key: 'meta', label: 'Meta Ads' },
          { key: 'linkedin', label: 'LinkedIn Ads' },
          { key: 'google', label: 'Google Ads' },
        ].map(({ key, label }, i, arr) => {
          const connected = connections[key];
          return (
            <div
              key={key}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: S[4],
                padding: `${S[4]} ${S[5]}`,
                borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none',
              }}
            >
              <div>
                <div style={{ fontFamily: F.body, fontSize: '14px', fontWeight: 500, color: C.textPrimary }}>{label}</div>
                <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, marginTop: '2px' }}>Coming soon</div>
              </div>
              <button onClick={() => toast.info(`${label} connection coming soon.`)} style={{ padding: `${S[1]} ${S[3]}`, backgroundColor: 'transparent', color: C.textSecondary, border: `1px solid ${C.border}`, borderRadius: R.button, fontFamily: F.body, fontSize: '12px', cursor: 'pointer', opacity: 0.8 }}>Connect</button>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

// ── Security section ──────────────────────────
function SecuritySection() {
  const toast = useToast();

  return (
    <div>
      <SectionHeader title="Security" description="Manage your password, two-factor authentication, and active sessions." />

      <Card style={{ marginBottom: S[4] }}>
        <CardRow label="Password" description="Last changed 30 days ago.">
          <button onClick={() => toast.info('Password change coming soon.')} style={{ padding: `${S[1]} ${S[3]}`, backgroundColor: 'transparent', color: C.textSecondary, border: `1px solid ${C.border}`, borderRadius: R.button, fontFamily: F.body, fontSize: '12px', cursor: 'pointer', transition: T.color }}>Change</button>
        </CardRow>
        <CardRow label="Two-Factor Authentication" description="Add a second layer of verification on login." last>
          <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
            <span style={{ ...badge.base, ...badge.muted, fontSize: '10px' }}>Not set up</span>
            <button onClick={() => toast.info('2FA setup coming soon.')} style={{ padding: `${S[1]} ${S[3]}`, backgroundColor: 'transparent', color: C.textSecondary, border: `1px solid ${C.border}`, borderRadius: R.button, fontFamily: F.body, fontSize: '12px', cursor: 'pointer', transition: T.color }}>Enable</button>
          </div>
        </CardRow>
      </Card>

      <Card>
        <div style={{ padding: `${S[3]} ${S[5]}`, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontFamily: F.body, fontSize: '11px', fontWeight: 600, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Active Sessions</div>
        </div>
        {[
          { device: 'Chrome on macOS', location: 'Ho Chi Minh City, VN', time: 'Now', current: true },
          { device: 'Safari on iPhone', location: 'Ho Chi Minh City, VN', time: '2 hours ago', current: false },
        ].map(({ device, location, time, current }, i, arr) => (
          <div key={device} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: S[4], padding: `${S[3]} ${S[5]}`, borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 500, color: C.textPrimary }}>{device}</span>
                {current && <span style={{ ...badge.base, ...badge.green, fontSize: '10px' }}>Current</span>}
              </div>
              <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, marginTop: '2px' }}>{location} · {time}</div>
            </div>
            {!current && (
              <button onClick={() => toast.info('Session revoked.')} style={{ padding: `${S[1]} ${S[3]}`, backgroundColor: 'transparent', color: C.red, border: `1px solid ${C.red}`, borderRadius: R.button, fontFamily: F.body, fontSize: '12px', cursor: 'pointer', transition: T.color, whiteSpace: 'nowrap' }}>Revoke</button>
            )}
          </div>
        ))}
      </Card>
    </div>
  );
}

// ── Danger Zone section ───────────────────────
function DangerSection() {
  const navigate = useNavigate();
  const logout   = useStore((s) => s.logout);
  const toast    = useToast();

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <SectionHeader title="Danger Zone" description="Irreversible actions that affect your account." />

      <div style={{ border: `1px solid ${C.red}`, borderRadius: R.card, overflow: 'hidden', backgroundColor: C.redDim }}>
        {/* Sign out */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: S[4], padding: `${S[4]} ${S[5]}`, borderBottom: `1px solid rgba(255,110,122,0.2)` }}>
          <div>
            <div style={{ fontFamily: F.body, fontSize: '14px', fontWeight: 600, color: C.textPrimary }}>Sign Out</div>
            <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, marginTop: '2px' }}>End your current session and return to the login screen.</div>
          </div>
          <button
            onClick={handleSignOut}
            style={{ padding: `${S[2]} ${S[4]}`, backgroundColor: 'transparent', color: C.red, border: `1px solid ${C.red}`, borderRadius: R.button, fontFamily: F.body, fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: T.base, whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            Sign Out
          </button>
        </div>

        {/* Delete account */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: S[4], padding: `${S[4]} ${S[5]}` }}>
          <div>
            <div style={{ fontFamily: F.body, fontSize: '14px', fontWeight: 600, color: C.textPrimary }}>Delete Account</div>
            <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, marginTop: '2px' }}>Permanently remove your account and all associated data. This cannot be undone.</div>
          </div>
          <button
            disabled
            onClick={() => toast.warning('Contact support to delete your account.')}
            style={{ padding: `${S[2]} ${S[4]}`, backgroundColor: 'transparent', color: C.textMuted, border: `1px solid ${C.border}`, borderRadius: R.button, fontFamily: F.body, fontSize: '13px', fontWeight: 600, cursor: 'not-allowed', transition: T.base, whiteSpace: 'nowrap', flexShrink: 0, opacity: 0.5 }}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Settings page ────────────────────────
const SECTION_COMPONENTS = {
  profile:       ProfileSection,
  workspace:     WorkspaceSection,
  appearance:    AppearanceSection,
  notifications: NotificationsSection,
  connections:   ConnectionsSection,
  security:      SecuritySection,
  danger:        DangerSection,
};

export default function Settings() {
  const [active, setActive] = useState('profile');
  const ActiveSection = SECTION_COMPONENTS[active];

  return (
    <div style={{ padding: `${S[6]} ${S[6]} ${S[8]}`, minHeight: '100vh', backgroundColor: C.bg }}>

      {/* Page header */}
      <div style={{ marginBottom: S[6] }}>
        <h1 style={{ fontFamily: F.display, fontSize: '24px', fontWeight: 800, color: C.textPrimary, margin: 0, letterSpacing: '-0.02em' }}>Settings</h1>
        <p style={{ fontFamily: F.body, fontSize: '14px', color: C.textSecondary, margin: `${S[1]} 0 0` }}>Manage your account and platform preferences.</p>
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'flex', gap: S[6], alignItems: 'flex-start' }}>

        {/* Left nav */}
        <nav style={{ width: '196px', flexShrink: 0 }}>
          <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card, overflow: 'hidden' }}>
            {SECTIONS.map((s, i) => {
              const isActive = active === s.id;
              const isDanger = s.danger;
              return (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: S[3],
                    padding: `${S[3]} ${S[4]}`,
                    backgroundColor: isActive ? C.primaryGlow : 'transparent',
                    color: isActive ? C.primary : isDanger ? C.red : C.textSecondary,
                    border: 'none',
                    borderBottom: i < SECTIONS.length - 1 ? `1px solid ${C.border}` : 'none',
                    fontFamily: F.body, fontSize: '13px', fontWeight: isActive ? 600 : 400,
                    cursor: 'pointer', transition: T.color, textAlign: 'left',
                  }}
                >
                  <span style={{ display: 'flex', flexShrink: 0 }}>{s.icon}</span>
                  {s.label}
                  {isActive && (
                    <span style={{ marginLeft: 'auto', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: C.primary }}/>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Right content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <ActiveSection />
        </div>
      </div>
    </div>
  );
}
