import { useState } from 'react';
import useStore from '../../store/useStore';
import useToast from '../../hooks/useToast';
import { C, F, R, S, btn, sectionHeading, labelStyle, inputStyle } from '../../tokens';
import { PLANS } from '../../config/plans';
import { WHITELABEL_CONFIG } from '../../data/whiteLabelConfig';
import usePlan from '../../hooks/usePlan';

export default function WhiteLabelConfig() {
  const toast = useToast();
  const { planId, plan, isAgency } = usePlan();
  const openCheckout = useStore((s) => s.openCheckout);

  const [config, setConfig] = useState(() => ({ ...WHITELABEL_CONFIG }));
  const [dnsExpanded, setDnsExpanded] = useState(false);
  const [domainStatus, setDomainStatus] = useState(config.domainVerified ? 'Verified' : 'Not verified');

  const update = (key, value) => setConfig((c) => ({ ...c, [key]: value }));
  const updateNested = (parent, key, value) => setConfig((c) => ({ ...c, [parent]: { ...c[parent], [key]: value } }));

  const planDisplayName = PLANS[planId]?.displayName ?? planId;
  const isGated = !isAgency;

  return (
    <div
      style={{
        padding: S[6],
        display: 'flex',
        flexDirection: 'column',
        gap: S[5],
        height: '100%',
        minHeight: 0,
        backgroundColor: C.bg,
        overflowY: 'auto',
        position: 'relative',
      }}
    >
      {isGated && (
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: S[3],
            padding: S[4],
            backgroundColor: 'rgba(245,200,66,0.15)',
            border: `1px solid ${C.amber}`,
            borderRadius: R.card,
            marginBottom: S[2],
            pointerEvents: 'auto',
          }}
        >
          <span style={{ fontFamily: F.body, fontSize: '14px', color: C.textPrimary }}>
            White-label is an Agency plan feature. You're on <strong>{planDisplayName.toUpperCase()}</strong>. Upgrade to access.
          </span>
          <button style={{ ...btn.primary, fontSize: '13px' }} onClick={() => openCheckout('agency')}>
            Upgrade plan
          </button>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          gap: S[6],
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          opacity: isGated ? 0.7 : 1,
          pointerEvents: isGated ? 'none' : 'auto',
        }}
      >
        <div style={{ flex: '1 1 480px', minWidth: 0 }}>
          <h1 style={{ ...sectionHeading, fontSize: '22px', letterSpacing: '-0.02em', margin: '0 0 4px' }}>
            White-Label Configuration
          </h1>
          <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: 0 }}>
            Rebrand NEXARA as your own platform. Your logo, your domain, your AI assistant name.
          </p>

          <div style={{ marginTop: S[6], display: 'flex', flexDirection: 'column', gap: S[6] }}>
            {/* Section 1: Branding */}
            <section>
              <h2 style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>Branding</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
                <div>
                  <label style={labelStyle}>Platform name</label>
                  <input
                    type="text"
                    value={config.brandName}
                    onChange={(e) => update('brandName', e.target.value)}
                    placeholder="e.g. GTM OS by YourAgency"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>ARIA name (AI assistant)</label>
                  <input
                    type="text"
                    value={config.ariaName}
                    onChange={(e) => update('ariaName', e.target.value)}
                    placeholder="e.g. NOVA"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Logo</label>
                  <div
                    style={{
                      border: `2px dashed ${C.border}`,
                      borderRadius: R.input,
                      padding: S[8],
                      textAlign: 'center',
                      backgroundColor: C.surface2,
                      color: C.textMuted,
                      fontFamily: F.body,
                      fontSize: '13px',
                    }}
                  >
                    Drag and drop or click to upload. {config.logoUrl ? 'Logo set.' : 'No logo.'}
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Favicon</label>
                  <div
                    style={{
                      border: `2px dashed ${C.border}`,
                      borderRadius: R.input,
                      padding: S[4],
                      textAlign: 'center',
                      backgroundColor: C.surface2,
                      color: C.textMuted,
                      fontFamily: F.body,
                      fontSize: '12px',
                    }}
                  >
                    Upload favicon (optional)
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Primary brand color</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: S[2] }}>
                    <input
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => update('primaryColor', e.target.value)}
                      style={{ width: 40, height: 36, border: `1px solid ${C.border}`, borderRadius: R.input, cursor: 'pointer' }}
                    />
                    <input
                      type="text"
                      value={config.primaryColor}
                      onChange={(e) => update('primaryColor', e.target.value)}
                      style={{ ...inputStyle, width: 120, fontFamily: F.mono }}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Domain */}
            <section>
              <h2 style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>Domain</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
                <div style={{ display: 'flex', gap: S[2], alignItems: 'center', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    value={config.domain}
                    onChange={(e) => update('domain', e.target.value)}
                    placeholder="gtmos.youragency.com"
                    style={{ ...inputStyle, flex: 1, minWidth: 200 }}
                  />
                  <button style={{ ...btn.secondary, fontSize: '13px' }} onClick={() => { setDomainStatus('Checking...'); setTimeout(() => setDomainStatus('Not verified'), 2000); }}>
                    Verify domain
                  </button>
                  <span
                    style={{
                      fontFamily: F.mono,
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: R.pill,
                      backgroundColor: domainStatus === 'Verified' ? C.greenDim : domainStatus === 'Checking...' ? C.amberDim : C.surface3,
                      color: domainStatus === 'Verified' ? C.primary : domainStatus === 'Checking...' ? C.amber : C.textSecondary,
                    }}
                  >
                    {domainStatus}
                  </span>
                </div>
                <div>
                  <button
                    style={{ ...btn.ghost, fontSize: '12px' }}
                    onClick={() => setDnsExpanded(!dnsExpanded)}
                  >
                    {dnsExpanded ? '▼' : '▶'} DNS instructions
                  </button>
                  {dnsExpanded && (
                    <div style={{ marginTop: S[2], padding: S[4], backgroundColor: C.surface2, border: `1px solid ${C.border}`, borderRadius: R.input, fontFamily: F.mono, fontSize: '12px', color: C.textSecondary }}>
                      Add a CNAME record: <strong style={{ color: C.textPrimary }}>{config.domain}</strong> → <strong style={{ color: C.primary }}>cname.nexara.io</strong>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Section 3: Email */}
            <section>
              <h2 style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>Email</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
                <div>
                  <label style={labelStyle}>From email address</label>
                  <input
                    type="email"
                    value={config.emailFrom}
                    onChange={(e) => update('emailFrom', e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email signature</label>
                  <textarea
                    value={config.emailSignature}
                    onChange={(e) => update('emailSignature', e.target.value)}
                    rows={4}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>
                <button style={{ ...btn.secondary, fontSize: '13px', alignSelf: 'flex-start' }} onClick={() => toast.success('Test email sent')}>
                  Send test email
                </button>
              </div>
            </section>

            {/* Section 4: Client Portal */}
            <section>
              <h2 style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>Client portal customization</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
                <div>
                  <label style={labelStyle}>Client portal title</label>
                  <input
                    type="text"
                    value={config.clientPortalTitle}
                    onChange={(e) => update('clientPortalTitle', e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Report header</label>
                  <input type="text" value={config.reportHeader} onChange={(e) => update('reportHeader', e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Report footer</label>
                  <input type="text" value={config.reportFooter} onChange={(e) => update('reportFooter', e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Powered by badge</label>
                  <div style={{ display: 'flex', gap: S[4], alignItems: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: S[2], fontFamily: F.body, fontSize: '13px', color: C.textPrimary, cursor: 'pointer' }}>
                      <input type="radio" name="poweredBy" checked={config.poweredByVisible} onChange={() => update('poweredByVisible', true)} />
                      Show "Powered by NEXARA"
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: S[2], fontFamily: F.body, fontSize: '13px', color: C.textPrimary, cursor: 'pointer' }}>
                      <input type="radio" name="poweredBy" checked={!config.poweredByVisible} onChange={() => update('poweredByVisible', false)} />
                      Hide badge
                    </label>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5: Mobile App */}
            <section>
              <h2 style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>Mobile app</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: S[3], fontFamily: F.body, fontSize: '13px', color: C.textPrimary, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={config.mobileApp.enabled}
                    onChange={(e) => updateNested('mobileApp', 'enabled', e.target.checked)}
                  />
                  Enable white-label mobile app
                </label>
                {config.mobileApp.enabled && (
                  <>
                    <div>
                      <label style={labelStyle}>App name</label>
                      <input type="text" value={config.mobileApp.appName} onChange={(e) => updateNested('mobileApp', 'appName', e.target.value)} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>App Store ID</label>
                      <input type="text" value={config.mobileApp.appStoreId} onChange={(e) => updateNested('mobileApp', 'appStoreId', e.target.value)} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Google Play ID</label>
                      <input type="text" value={config.mobileApp.googlePlayId} onChange={(e) => updateNested('mobileApp', 'googlePlayId', e.target.value)} style={inputStyle} />
                    </div>
                  </>
                )}
                <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, margin: 0 }}>
                  White-label mobile app requires a one-time setup fee ($2,000) and App Store review.
                </p>
              </div>
            </section>

            <button
              style={{ ...btn.primary, width: '100%', padding: S[4], fontSize: '14px' }}
              onClick={() => toast.success('White-label config saved')}
            >
              Save
            </button>
          </div>
        </div>

        {/* Preview panel */}
        <div
          style={{
            width: 340,
            flexShrink: 0,
            position: 'sticky',
            top: S[6],
            backgroundColor: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: R.card,
            padding: S[5],
            display: 'flex',
            flexDirection: 'column',
            gap: S[5],
          }}
        >
          <div style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted, textTransform: 'uppercase' }}>Preview</div>
          <div
            style={{
              width: '100%',
              minHeight: 180,
              backgroundColor: C.surface2,
              borderRadius: R.md,
              border: `1px solid ${C.border}`,
              padding: S[4],
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: S[3], marginBottom: S[4] }}>
              <div style={{ width: 32, height: 32, borderRadius: R.md, backgroundColor: config.primaryColor }} />
              <span style={{ fontFamily: F.display, fontSize: '14px', fontWeight: 700, color: C.textPrimary }}>{config.brandName}</span>
            </div>
            <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>Dashboard</div>
            <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary }}>Campaigns</div>
            <div style={{ fontFamily: F.body, fontSize: '12px', color: C.primary }}>Ask {config.ariaName}</div>
          </div>
          <div
            style={{
              border: `2px solid ${C.border}`,
              borderRadius: 12,
              width: 120,
              height: 200,
              margin: '0 auto',
              padding: S[2],
              backgroundColor: C.surface2,
            }}
          >
            <div style={{ fontFamily: F.body, fontSize: '9px', color: C.textMuted, textAlign: 'center' }}>App preview</div>
            <div style={{ width: '100%', height: 24, borderRadius: 4, backgroundColor: config.primaryColor, marginTop: S[2] }} />
            <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textPrimary, marginTop: S[3], textAlign: 'center' }}>{config.mobileApp.enabled && config.mobileApp.appName ? config.mobileApp.appName : 'Your App'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
