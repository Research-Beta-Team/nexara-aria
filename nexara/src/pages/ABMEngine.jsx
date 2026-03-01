import { useState, useMemo, useEffect } from 'react';
import useToast from '../hooks/useToast';
import { C, F, R, S, btn, badge, sectionHeading } from '../tokens';
import { NAMED_ACCOUNTS, ABM_PIPELINE_TOTAL } from '../data/abm';
import AccountTierList from '../components/abm/AccountTierList';
import AccountHeatMap from '../components/abm/AccountHeatMap';
import BuyingCommitteeTimeline from '../components/abm/BuyingCommitteeTimeline';
import AccountPlaybook from '../components/abm/AccountPlaybook';

const TIERS = [
  { id: 1, label: 'Tier 1 — Enterprise', count: 3 },
  { id: 2, label: 'Tier 2 — Mid-Market', count: 4 },
  { id: 3, label: 'Tier 3 — SMB', count: 5 },
];

const ACCOUNT_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'stakeholders', label: 'Stakeholders' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'playbook', label: 'Playbook' },
  { id: 'content', label: 'Content' },
];

const STATUS_STYLE = {
  Active: { ...badge.base, ...badge.green },
  'At Risk': { ...badge.base, ...badge.amber },
  Stalled: { ...badge.base, ...badge.red },
  Won: { ...badge.base, backgroundColor: 'rgba(94,234,212,0.12)', color: C.secondary, border: `1px solid rgba(94,234,212,0.25)` },
  Lost: { ...badge.base, ...badge.muted },
};

function healthColor(score) {
  if (score >= 80) return C.primary;
  if (score >= 60) return C.amber;
  return C.red;
}

function formatDeal(value) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

function formatPipelineTotal(value) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  return `$${(value / 1000).toFixed(0)}K`;
}

// ── ARIA Icon ──────────────────────────────────
function AriaIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M7 1.5L13.2 12.8H.8L7 1.5z" stroke={C.primary} strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M3.6 9.2h6.8" stroke={C.primary} strokeWidth="1.3" strokeLinecap="round"/>
      <circle cx="7" cy="1.5" r="1.1" fill={C.primary}/>
      <circle cx=".8" cy="12.8" r="1.1" fill={C.primary}/>
      <circle cx="13.2" cy="12.8" r="1.1" fill={C.primary}/>
    </svg>
  );
}

export default function ABMEngine() {
  const [selectedTier, setSelectedTier] = useState(1);
  const [selectedAccountId, setSelectedAccountId] = useState(NAMED_ACCOUNTS[0]?.id || null);
  const [accountTab, setAccountTab] = useState('overview');
  const toast = useToast();

  const accountsByTier = useMemo(
    () => NAMED_ACCOUNTS.filter((a) => a.tier === selectedTier),
    [selectedTier]
  );
  const selectedAccount = useMemo(
    () => NAMED_ACCOUNTS.find((a) => a.id === selectedAccountId),
    [selectedAccountId]
  );

  // When tier changes, keep selection in that tier
  useEffect(() => {
    const inTier = accountsByTier.some((a) => a.id === selectedAccountId);
    if (!inTier && accountsByTier.length > 0) setSelectedAccountId(accountsByTier[0].id);
  }, [selectedTier, accountsByTier, selectedAccountId]);

  return (
    <div style={{ padding: S[6], display: 'flex', flexDirection: 'column', gap: S[5], height: '100%', minHeight: 0 }}>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: S[3] }}>
        <div>
          <h1 style={{ ...sectionHeading, fontSize: '22px', letterSpacing: '-0.02em', margin: 0 }}>
            ABM Engine
          </h1>
          <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
            {NAMED_ACCOUNTS.length} named accounts · {formatPipelineTotal(ABM_PIPELINE_TOTAL)} total pipeline
          </span>
        </div>
        <div style={{ display: 'flex', gap: S[2] }}>
          <button style={{ ...btn.secondary, fontSize: '13px' }} onClick={() => toast.info('Add account flow coming soon')}>
            Add account
          </button>
          <button style={{ ...btn.primary, fontSize: '13px' }} onClick={() => toast.success('Running ABM playbook…')}>
            Run ABM playbook
          </button>
        </div>
      </div>

      {/* Tier tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${C.border}` }}>
        {TIERS.map((t) => {
          const active = selectedTier === t.id;
          return (
            <button
              key={t.id}
              style={{
                fontFamily: F.body,
                fontSize: '13px',
                fontWeight: active ? 600 : 400,
                color: active ? C.primary : C.textSecondary,
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: active ? `2px solid ${C.primary}` : '2px solid transparent',
                padding: `${S[3]} ${S[4]}`,
                cursor: 'pointer',
              }}
              onClick={() => setSelectedTier(t.id)}
            >
              {t.label} ({t.count})
            </button>
          );
        })}
      </div>

      {/* Main layout: sidebar + content */}
      <div style={{ display: 'flex', gap: S[6], flex: 1, minHeight: 0 }}>
        <AccountTierList
          accounts={accountsByTier}
          selectedAccountId={selectedAccountId}
          onSelectAccount={setSelectedAccountId}
        />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {!selectedAccount ? (
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: F.body,
                fontSize: '14px',
                color: C.textMuted,
              }}
            >
              Select an account
            </div>
          ) : (
            <>
              {/* Account header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: S[6],
                  padding: S[5],
                  backgroundColor: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: R.card,
                  marginBottom: S[4],
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: S[4] }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      border: `3px solid ${healthColor(selectedAccount.healthScore)}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: F.mono,
                      fontSize: '18px',
                      fontWeight: 700,
                      color: healthColor(selectedAccount.healthScore),
                    }}
                  >
                    {selectedAccount.healthScore}
                  </div>
                  <div>
                    <h2 style={{ fontFamily: F.display, fontSize: '20px', fontWeight: 700, color: C.textPrimary, margin: '0 0 4px' }}>
                      {selectedAccount.name}
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: S[2], flexWrap: 'wrap' }}>
                      <span style={{ ...badge.base, ...badge.muted }}>{selectedAccount.industry}</span>
                      <span style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>{selectedAccount.employees} employees</span>
                      <span style={{ fontFamily: F.mono, fontSize: '13px', color: C.primary }}>{formatDeal(selectedAccount.estimatedDeal)}</span>
                      <span style={{ ...STATUS_STYLE[selectedAccount.status], fontSize: '11px' }}>{selectedAccount.status}</span>
                      <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>Last activity: {selectedAccount.lastActivity}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap', marginLeft: 'auto' }}>
                  <button style={{ ...btn.secondary, fontSize: '12px' }} onClick={() => toast.info('Send email flow coming soon')}>Send Email</button>
                  <button style={{ ...btn.secondary, fontSize: '12px' }} onClick={() => toast.info('Log activity flow coming soon')}>Log Activity</button>
                  <button style={{ ...btn.secondary, fontSize: '12px' }} onClick={() => toast.success('Running playbook…')}>Run Playbook</button>
                  <button style={{ ...btn.ghost, fontSize: '12px' }} onClick={() => toast.info('Opening CRM…')}>View in CRM</button>
                </div>
              </div>

              {/* Account tabs */}
              <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${C.border}`, marginBottom: S[4] }}>
                {ACCOUNT_TABS.map((tab) => {
                  const active = accountTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      style={{
                        fontFamily: F.body,
                        fontSize: '13px',
                        fontWeight: active ? 600 : 400,
                        color: active ? C.primary : C.textSecondary,
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderBottom: active ? `2px solid ${C.primary}` : '2px solid transparent',
                        padding: `${S[2]} ${S[4]}`,
                        cursor: 'pointer',
                      }}
                      onClick={() => setAccountTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab content */}
              {accountTab === 'overview' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S[6] }}>
                  <div
                    style={{
                      padding: S[5],
                      backgroundColor: C.surface,
                      border: `1px solid ${C.border}`,
                      borderRadius: R.card,
                    }}
                  >
                    <h3 style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[3] }}>
                      Account intel
                    </h3>
                    <dl style={{ margin: 0, fontFamily: F.body, fontSize: '13px' }}>
                      <div style={{ marginBottom: S[2] }}>
                        <dt style={{ color: C.textMuted, marginBottom: 2 }}>HQ</dt>
                        <dd style={{ color: C.textPrimary, margin: 0 }}>{selectedAccount.hq}</dd>
                      </div>
                      <div style={{ marginBottom: S[2] }}>
                        <dt style={{ color: C.textMuted, marginBottom: 2 }}>Website</dt>
                        <dd style={{ margin: 0 }}><a href={selectedAccount.website} target="_blank" rel="noopener noreferrer" style={{ color: C.secondary }}>{selectedAccount.website?.replace(/^https?:\/\//, '')}</a></dd>
                      </div>
                      <div style={{ marginBottom: S[2] }}>
                        <dt style={{ color: C.textMuted, marginBottom: 2 }}>Funding</dt>
                        <dd style={{ color: C.textPrimary, margin: 0 }}>{selectedAccount.funding}</dd>
                      </div>
                      <div>
                        <dt style={{ color: C.textMuted, marginBottom: 2 }}>Tech stack detected</dt>
                        <dd style={{ margin: 0, display: 'flex', flexWrap: 'wrap', gap: S[1] }}>
                          {(selectedAccount.techStack || []).map((t, i) => (
                            <span key={i} style={{ ...badge.base, ...badge.muted, fontSize: '10px' }}>{t}</span>
                          ))}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <div
                    style={{
                      padding: S[5],
                      backgroundColor: 'rgba(61,220,132,0.06)',
                      border: '1px solid rgba(61,220,132,0.2)',
                      borderLeft: `3px solid ${C.primary}`,
                      borderRadius: R.card,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: S[2], marginBottom: S[3] }}>
                      <AriaIcon size={18} />
                      <span style={{ fontFamily: F.mono, fontSize: '11px', fontWeight: 700, color: C.primary, textTransform: 'uppercase' }}>ARIA recommends</span>
                    </div>
                    <p style={{ fontFamily: F.body, fontSize: '14px', color: C.textPrimary, margin: '0 0 16px', lineHeight: 1.5 }}>
                      {selectedAccount.ariaRecommendation}
                    </p>
                    <button style={{ ...btn.primary, fontSize: '13px' }} onClick={() => toast.success('Recommendation executed')}>
                      Execute Recommendation
                    </button>
                  </div>
                </div>
              )}

              {accountTab === 'stakeholders' && (
                <AccountHeatMap account={selectedAccount} toast={toast} />
              )}

              {accountTab === 'timeline' && (
                <BuyingCommitteeTimeline account={selectedAccount} toast={toast} />
              )}

              {accountTab === 'playbook' && (
                <AccountPlaybook account={selectedAccount} toast={toast} />
              )}

              {accountTab === 'content' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
                  {selectedAccount.contentAssets?.map((asset) => (
                    <div
                      key={asset.id}
                      style={{
                        padding: S[5],
                        backgroundColor: C.surface,
                        border: `1px solid ${C.border}`,
                        borderRadius: R.card,
                      }}
                    >
                      <h3 style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary, margin: '0 0 8px' }}>
                        {asset.name}
                      </h3>
                      {asset.type === 'one_pager' && (
                        <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: '0 0 12px' }}>
                          Custom for {asset.companyName}. Use case: {asset.useCase}. Logo placeholder included.
                        </p>
                      )}
                      {asset.type === 'roi_calculator' && (
                        <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: '0 0 12px' }}>
                          Pre-filled: {asset.prefill}
                        </p>
                      )}
                      {asset.type === 'reference_customer' && (
                        <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: '0 0 12px' }}>
                          {asset.story}
                        </p>
                      )}
                      <div style={{ display: 'flex', gap: S[2], flexWrap: 'wrap' }}>
                        {(selectedAccount.stakeholders || []).slice(0, 3).map((s) => (
                          <button
                            key={s.id}
                            style={{ ...btn.secondary, fontSize: '12px' }}
                            onClick={() => toast.success(`Sent to ${s.name}`)}
                          >
                            Send to {s.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
