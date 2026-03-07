/**
 * Native brand colors and logo config for LinkedIn, Facebook (Meta), WhatsApp.
 * Use these throughout the app for channel badges, icons, and pills.
 * @see https://brand.linkedin.com | https://about.meta.com/brand | WhatsApp brand
 */

/** Native brand hex colors */
export const CHANNEL_COLORS = {
  LinkedIn: '#0A66C2',
  Facebook: '#1877F2',
  Meta: '#1877F2',
  WhatsApp: '#25D366',
  Instagram: '#E4405F',
};

/** Content type / ad type → brand color */
export const TYPE_COLORS = {
  'LinkedIn Ad': CHANNEL_COLORS.LinkedIn,
  'Meta Ad': CHANNEL_COLORS.Facebook,
  LinkedIn: CHANNEL_COLORS.LinkedIn,
  Facebook: CHANNEL_COLORS.Facebook,
  Meta: CHANNEL_COLORS.Meta,
  WhatsApp: CHANNEL_COLORS.WhatsApp,
};

/** For pills/badges: color + light background */
export function getChannelStyle(channelOrType) {
  const color = TYPE_COLORS[channelOrType] || CHANNEL_COLORS[channelOrType] || null;
  if (!color) return null;
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return {
    color,
    backgroundColor: `rgba(${r},${g},${b},0.15)`,
    border: `1px solid rgba(${r},${g},${b},0.35)`,
  };
}
