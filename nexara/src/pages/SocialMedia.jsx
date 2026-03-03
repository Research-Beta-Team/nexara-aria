import { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import useToast from '../hooks/useToast';
import useStore from '../store/useStore';
import { C, F, R, S, cardStyle, btn, badge, flex } from '../tokens';
import {
  SOCIAL_METRICS,
  ENGAGEMENT_BY_DAY,
  CHANNEL_BREAKDOWN,
  RECENT_POSTS,
  RANGES,
} from '../data/social';
import ConnectAccountModal from '../components/social/ConnectAccountModal';
import DisconnectAccountModal from '../components/social/DisconnectAccountModal';

const CHANNEL_COLORS = {
  LinkedIn: C.primary,
  Meta: C.secondary,
  Instagram: C.amber,
};

function MetricCard({ label, value, sub, change }) {
  const isUp = change >= 0;
  const color = isUp ? C.primary : C.red;
  return (
    <div style={{ ...cardStyle, flex: 1, minWidth: '140px' }}>
      <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[2] }}>
        {label}
      </div>
      <div style={{ fontFamily: F.mono, fontSize: '22px', fontWeight: 700, color: C.textPrimary, lineHeight: 1 }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
        {sub && <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, marginLeft: '4px' }}>{sub}</span>}
      </div>
      {change != null && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: S[2] }}>
          <span style={{ fontFamily: F.mono, fontSize: '12px', fontWeight: 700, color }}>{isUp ? '+' : ''}{change}%</span>
          <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>vs prev</span>
        </div>
      )}
    </div>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      backgroundColor: C.surface2,
      border: `1px solid ${C.border}`,
      borderRadius: R.md,
      padding: `${S[2]} ${S[3]}`,
      fontFamily: F.body,
      fontSize: '12px',
      color: C.textPrimary,
    }}>
      <div style={{ color: C.textMuted, marginBottom: '4px' }}>{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ display: 'flex', gap: S[2] }}>
          <span style={{ color: p.color }}>{p.name}:</span>
          <span>{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</span>
        </div>
      ))}
    </div>
  );
}

// Only owner and founder can connect or remove social accounts.
const ADMIN_SOCIAL_ROLES = ['owner', 'founder'];

export default function SocialMedia() {
  const toast = useToast();
  const navigate = useNavigate();
  const [range, setRange] = useState('7d');
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [disconnectAccount, setDisconnectAccount] = useState(null);

  const currentRole = useStore((s) => s.currentRole);
  const connectedAccounts = useStore((s) => s.connectedAccounts);
  const removeConnectedAccount = useStore((s) => s.removeConnectedAccount);
  const socialCampaigns = useStore((s) => s.socialCampaigns);

  const canManageSocialAccounts = ADMIN_SOCIAL_ROLES.includes(currentRole);

  const handleDisconnect = (accountId) => {
    removeConnectedAccount(accountId);
    toast.warning('Account disconnected');
    setDisconnectAccount(null);
  };

  const m = SOCIAL_METRICS;

  return (
    <div style={{ padding: S[6], display: 'flex', flexDirection: 'column', gap: S[5], minHeight: '100%' }}>
      {/* Header */}
      <div style={{ ...flex.rowBetween, flexWrap: 'wrap', gap: S[3] }}>
        <div>
          <h1 style={{ fontFamily: F.display, fontSize: '22px', fontWeight: 800, color: C.textPrimary, margin: '0 0 4px' }}>
            Social Media
          </h1>
          <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
            Reach, engagement, and recent posts across connected accounts
          </p>
        </div>
        <div style={{ display: 'flex', gap: S[2] }}>
          {RANGES.map((r) => (
            <button
              key={r}
              style={{
                ...btn[r === range ? 'primary' : 'secondary'],
                fontSize: '12px',
                padding: `${S[2]} ${S[3]}`,
              }}
              onClick={() => setRange(r)}
            >
              {r}
            </button>
          ))}
          {canManageSocialAccounts && (
            <button style={{ ...btn.secondary, fontSize: '13px' }} onClick={() => setShowConnectModal(true)}>
              Connect account
            </button>
          )}
        </div>
      </div>

      {/* Connected accounts */}
      <div style={cardStyle}>
        <div style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[3] }}>
          Connected accounts
        </div>
        {!canManageSocialAccounts && (
          <p style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted, margin: '0 0 12px' }}>
            Only admins can connect or remove social accounts. Contact your admin to manage connections.
          </p>
        )}
        {connectedAccounts.length === 0 ? (
          <div style={{ padding: S[5], textAlign: 'center', backgroundColor: C.surface2, borderRadius: R.md, border: `1px dashed ${C.border}` }}>
            <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textMuted, margin: '0 0 12px' }}>No accounts connected. Connect LinkedIn, Meta, or Instagram to manage posts and see metrics.</p>
            {canManageSocialAccounts ? (
              <button style={btn.primary} onClick={() => setShowConnectModal(true)}>Connect your first account</button>
            ) : null}
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: S[3] }}>
            {connectedAccounts.map((acc) => (
              <div
                key={acc.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: S[3],
                  padding: S[3],
                  backgroundColor: C.surface2,
                  border: `1px solid ${C.border}`,
                  borderRadius: R.md,
                  minWidth: '200px',
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: R.full,
                  backgroundColor: C.surface3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: F.mono,
                  fontSize: '14px',
                  fontWeight: 700,
                  color: C.primary,
                }}>
                  {acc.platform.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary }}>{acc.name}</div>
                  <div style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>{acc.platform} · {acc.followers?.toLocaleString()} followers</div>
                </div>
                <span style={{ ...badge.base, ...badge.green, flexShrink: 0 }}>Connected</span>
                {canManageSocialAccounts && (
                  <button
                    style={{ ...btn.ghost, padding: S[1], fontSize: '11px', color: C.textMuted }}
                    onClick={() => setDisconnectAccount(acc)}
                    title="Disconnect"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* KPI row */}
      <div style={{ display: 'flex', gap: S[4], flexWrap: 'wrap' }}>
        <MetricCard label="Total reach" value={m.reach.value} sub={m.reach.unit} change={m.reach.change} />
        <MetricCard label="Engagement rate" value={m.engagement.value} sub="%" change={m.engagement.change} />
        <MetricCard label="Posts" value={m.postsCount.value} sub={`this ${range}`} change={m.postsCount.change} />
        <MetricCard label="Top post reach" value={m.topPostReach.value.toLocaleString()} />
      </div>

      {/* Chart */}
      <div style={cardStyle}>
        <div style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary, marginBottom: S[4] }}>
          Reach & engagement
        </div>
        <div style={{ height: '260px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ENGAGEMENT_BY_DAY} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="day" tick={{ fontFamily: F.mono, fontSize: 11, fill: C.textMuted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: F.mono, fontSize: 10, fill: C.textMuted }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="reach" fill={C.primary} radius={[R.sm, R.sm, 0, 0]} name="Reach" maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: S[5] }}>
        {/* Channel breakdown */}
        <div style={cardStyle}>
          <div style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary, marginBottom: S[4] }}>
            By channel
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[3] }}>
            {CHANNEL_BREAKDOWN.map((ch, i) => {
              const color = CHANNEL_COLORS[ch.channel] ?? C.primary;
              const maxReach = Math.max(...CHANNEL_BREAKDOWN.map((c) => c.reach));
              const pct = (ch.reach / maxReach) * 100;
              return (
                <div key={ch.channel}>
                  <div style={{ ...flex.rowBetween, marginBottom: S[1] }}>
                    <span style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary }}>{ch.channel}</span>
                    <span style={{ fontFamily: F.mono, fontSize: '12px', color: C.textMuted }}>{ch.reach.toLocaleString()} reach · {ch.posts} posts</span>
                  </div>
                  <div style={{ height: '8px', borderRadius: R.pill, backgroundColor: C.surface3, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', borderRadius: R.pill, backgroundColor: color, transition: 'width 0.3s ease' }} />
                  </div>
                  <div style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted, marginTop: '2px' }}>{ch.engagement}% engagement</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent posts */}
        <div style={cardStyle}>
          <div style={{ ...flex.rowBetween, marginBottom: S[4] }}>
            <span style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>Recent posts</span>
            <button style={{ ...btn.ghost, fontSize: '12px' }} onClick={() => socialCampaigns.length ? navigate(`/social/campaigns/${socialCampaigns[0].id}`) : toast.info('No campaigns yet')}>View all</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {RECENT_POSTS.map((post, i) => (
              <div
                key={post.id}
                style={{
                  padding: S[3],
                  borderBottom: i < RECENT_POSTS.length - 1 ? `1px solid ${C.border}` : 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                }}
                onClick={() => toast.info(`Post: ${post.text.slice(0, 40)}…`)}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: S[2] }}>
                  <span style={{ ...badge.base, ...badge.muted, fontFamily: F.mono, fontSize: '10px' }}>{post.channel}</span>
                  <span style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted }}>{post.time}</span>
                </div>
                <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary, margin: `${S[2]} 0`, lineHeight: 1.45 }}>
                  {post.text}
                </p>
                <div style={{ display: 'flex', gap: S[4], fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>
                  <span>{post.reach.toLocaleString()} reach</span>
                  <span>{post.likes} likes</span>
                  <span>{post.comments} comments</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Social campaigns */}
      <div style={cardStyle}>
        <div style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary, marginBottom: S[4] }}>
          Social campaigns
        </div>
        <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, marginBottom: S[4] }}>
          Manage posts by campaign: edit content, reorder, and view performance.
        </p>
        {socialCampaigns.length === 0 ? (
          <div style={{ padding: S[5], textAlign: 'center', backgroundColor: C.surface2, borderRadius: R.md, border: `1px dashed ${C.border}` }}>
            <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textMuted }}>No social campaigns yet. Create one from a campaign to add social posts here.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
            {socialCampaigns.map((camp) => (
              <div
                key={camp.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: S[3],
                  backgroundColor: C.surface2,
                  border: `1px solid ${C.border}`,
                  borderRadius: R.md,
                  cursor: 'pointer',
                  transition: 'border-color 0.15s ease, background-color 0.15s ease',
                }}
                onClick={() => navigate(`/social/campaigns/${camp.id}`)}
              >
                <div>
                  <div style={{ fontFamily: F.body, fontSize: '14px', fontWeight: 600, color: C.textPrimary }}>{camp.name}</div>
                  <div style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>{camp.posts?.length ?? 0} posts · {camp.channel}</div>
                </div>
                <span style={{ ...badge.base, ...badge.muted }}>{camp.status}</span>
                <span style={{ color: C.textMuted, fontFamily: F.body, fontSize: '12px' }}>View →</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showConnectModal && <ConnectAccountModal onClose={() => setShowConnectModal(false)} />}
      {disconnectAccount && (
        <DisconnectAccountModal
          account={disconnectAccount}
          onConfirm={handleDisconnect}
          onClose={() => setDisconnectAccount(null)}
        />
      )}
    </div>
  );
}
