import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import useToast from '../hooks/useToast';
import { C, F, R, S, cardStyle, btn, badge, flex } from '../tokens';
import { getSocialCampaignById } from '../data/social';
import EditPostModal from '../components/social/EditPostModal';

function moveItem(arr, fromIndex, direction) {
  const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
  if (toIndex < 0 || toIndex >= arr.length) return arr;
  const next = [...arr];
  const [removed] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, removed);
  return next.map((p, i) => ({ ...p, order: i }));
}

export default function SocialCampaignDetail() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const socialCampaigns = useStore((s) => s.socialCampaigns);
  const setSocialCampaignPosts = useStore((s) => s.setSocialCampaignPosts);
  const updateSocialPost = useStore((s) => s.updateSocialPost);

  const [editingPost, setEditingPost] = useState(null);

  const campaign = getSocialCampaignById(socialCampaigns, campaignId);
  const posts = campaign?.posts?.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) ?? [];

  const handleMove = (index, direction) => {
    const next = moveItem(posts, index, direction);
    setSocialCampaignPosts(campaignId, next);
    toast.info(`Post moved ${direction}`);
  };

  const handleSaveEdit = (updatedPost) => {
    updateSocialPost(campaignId, updatedPost.id, { text: updatedPost.text, channel: updatedPost.channel });
    setEditingPost(null);
  };

  if (!campaign) {
    return (
      <div style={{ padding: S[6] }}>
        <p style={{ fontFamily: F.body, color: C.textSecondary }}>Campaign not found.</p>
        <button style={{ ...btn.secondary, marginTop: S[3] }} onClick={() => navigate('/social')}>Back to Social</button>
      </div>
    );
  }

  return (
    <div style={{ padding: S[6], display: 'flex', flexDirection: 'column', gap: S[5], minHeight: '100%' }}>
      <div style={{ ...flex.rowBetween, flexWrap: 'wrap', gap: S[3] }}>
        <div>
          <button style={{ ...btn.ghost, fontSize: '12px', marginBottom: S[2] }} onClick={() => navigate('/social')}>← Back to Social</button>
          <h1 style={{ fontFamily: F.display, fontSize: '22px', fontWeight: 800, color: C.textPrimary, margin: '0 0 4px' }}>
            {campaign.name}
          </h1>
          <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary }}>
            {posts.length} posts · Edit content or reorder using the controls below
          </p>
        </div>
        <span style={{ ...badge.base, ...badge.muted }}>{campaign.status}</span>
      </div>

      <div style={cardStyle}>
        <div style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[4] }}>
          Posts (drag order with up/down)
        </div>
        {posts.length === 0 ? (
          <div style={{ padding: S[5], textAlign: 'center', backgroundColor: C.surface2, borderRadius: R.md, border: `1px dashed ${C.border}` }}>
            <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textMuted }}>No posts in this campaign yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[2] }}>
            {posts.map((post, index) => (
              <div
                key={post.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: S[3],
                  padding: S[4],
                  backgroundColor: C.surface2,
                  border: `1px solid ${C.border}`,
                  borderRadius: R.md,
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: S[1], flexShrink: 0 }}>
                  <button
                    style={{ ...btn.icon, padding: S[1] }}
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    title="Move up"
                    aria-label="Move up"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 11V3M3 7l4-4 4 4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button
                    style={{ ...btn.icon, padding: S[1] }}
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === posts.length - 1}
                    title="Move down"
                    aria-label="Move down"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 3v8M3 7l4 4 4-4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: S[2], marginBottom: S[2] }}>
                    <span style={{ ...badge.base, ...badge.muted, fontFamily: F.mono, fontSize: '10px' }}>{post.channel}</span>
                    <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>#{index + 1}</span>
                    {post.status && (
                      <span style={{
                        ...badge.base,
                        ...(post.status === 'published' ? badge.green : badge.muted),
                        fontSize: '10px',
                      }}>
                        {post.status}
                      </span>
                    )}
                  </div>
                  <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textPrimary, margin: 0, lineHeight: 1.5 }}>
                    {post.text}
                  </p>
                  {(post.reach != null || post.scheduledAt) && (
                    <div style={{ display: 'flex', gap: S[4], marginTop: S[2], fontFamily: F.mono, fontSize: '11px', color: C.textMuted }}>
                      {post.reach != null && <span>{post.reach.toLocaleString()} reach</span>}
                      {post.likes != null && <span>{post.likes} likes</span>}
                      {post.comments != null && <span>{post.comments} comments</span>}
                      {post.scheduledAt && <span>Scheduled: {new Date(post.scheduledAt).toLocaleString()}</span>}
                    </div>
                  )}
                </div>
                <button
                  style={{ ...btn.secondary, fontSize: '12px', flexShrink: 0 }}
                  onClick={() => setEditingPost(post)}
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingPost && (
        <EditPostModal
          post={editingPost}
          onSave={handleSaveEdit}
          onClose={() => setEditingPost(null)}
        />
      )}
    </div>
  );
}
