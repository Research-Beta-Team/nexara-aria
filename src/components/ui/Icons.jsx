/**
 * Theme-aligned SVG icons (stroke/fill use currentColor or passed color).
 */
import { C } from '../../tokens';

const size = 18;
const stroke = 1.5;

export function IconWarning({ color = C.amber, width = size, height = size }) {
  return (
    <svg width={width} height={height} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <path d="M9 2L16 14H2L9 2Z" stroke={color} strokeWidth={stroke} strokeLinejoin="round"/>
      <path d="M9 7v3M9 12v.5" stroke={color} strokeWidth={stroke} strokeLinecap="round"/>
    </svg>
  );
}

export function IconDocument({ color = 'currentColor', width = size, height = size }) {
  return (
    <svg width={width} height={height} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <path d="M4 2h7l4 4v10H4V2Z" stroke={color} strokeWidth={stroke} strokeLinejoin="round"/>
      <path d="M11 2v4h4" stroke={color} strokeWidth={stroke} strokeLinejoin="round"/>
      <path d="M6 8h6M6 11h4" stroke={color} strokeWidth={stroke} strokeLinecap="round"/>
    </svg>
  );
}

export function IconCalendar({ color = 'currentColor', width = size, height = size }) {
  return (
    <svg width={width} height={height} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <rect x="2" y="3" width="14" height="13" rx="1.5" stroke={color} strokeWidth={stroke}/>
      <path d="M2 7h14M6 1v4M12 1v4" stroke={color} strokeWidth={stroke} strokeLinecap="round"/>
    </svg>
  );
}

export function IconTarget({ color = 'currentColor', width = size, height = size }) {
  return (
    <svg width={width} height={height} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="9" cy="9" r="6" stroke={color} strokeWidth={stroke}/>
      <circle cx="9" cy="9" r="3.5" stroke={color} strokeWidth={stroke}/>
      <circle cx="9" cy="9" r="1" fill={color}/>
    </svg>
  );
}

export function IconCrown({ color = 'currentColor', width = size, height = size }) {
  return (
    <svg width={width} height={height} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <path d="M2 13V6l4 3 4-5 4 5 4-3v7H2Z" stroke={color} strokeWidth={stroke} strokeLinejoin="round"/>
      <path d="M9 4L6 9l3-2 3 2L9 4Z" stroke={color} strokeWidth={stroke} strokeLinejoin="round"/>
    </svg>
  );
}

export function IconCompass({ color = 'currentColor', width = size, height = size }) {
  return (
    <svg width={width} height={height} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="9" cy="9" r="6" stroke={color} strokeWidth={stroke}/>
      <path d="M12.5 5.5l-4 8 3-4-4-1 5-3Z" stroke={color} strokeWidth={stroke} strokeLinejoin="round"/>
    </svg>
  );
}

export function IconHandshake({ color = 'currentColor', width = size, height = size }) {
  return (
    <svg width={width} height={height} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <path d="M6 8L3 11v3h4l2-2 2 2h4v-3l-3-3M9 6V4l3-2 3 2v2" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 6L6 9l3 3 3-3-3-3Z" stroke={color} strokeWidth={stroke} strokeLinejoin="round"/>
    </svg>
  );
}

export function IconPen({ color = 'currentColor', width = size, height = size }) {
  return (
    <svg width={width} height={height} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <path d="M11 3l4 4-9 9H2v-4l9-9Z" stroke={color} strokeWidth={stroke} strokeLinejoin="round"/>
      <path d="M8 6l4 4" stroke={color} strokeWidth={stroke} strokeLinecap="round"/>
    </svg>
  );
}

export function IconSend({ color = 'currentColor', width = size, height = size }) {
  return (
    <svg width={width} height={height} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <path d="M2 9l14-7-7 14-2-7-5-0Z" stroke={color} strokeWidth={stroke} strokeLinejoin="round"/>
    </svg>
  );
}

export function IconChart({ color = 'currentColor', width = size, height = size }) {
  return (
    <svg width={width} height={height} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <path d="M3 14h12M5 14V9m4 5V6m4 8V3" stroke={color} strokeWidth={stroke} strokeLinecap="round"/>
    </svg>
  );
}

export function IconEye({ color = 'currentColor', width = size, height = size }) {
  return (
    <svg width={width} height={height} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <path d="M9 4C5 4 2 9 2 9s3 5 7 5 7-5 7-5-3-5-7-5Z" stroke={color} strokeWidth={stroke} strokeLinejoin="round"/>
      <circle cx="9" cy="9" r="2.5" stroke={color} strokeWidth={stroke}/>
    </svg>
  );
}

export function IconRocket({ color = 'currentColor', w = size }) {
  return (
    <svg width={w} height={w} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <path d="M9 2l2 6 5 1-4 6H6L2 9l5-1L9 2Z" stroke={color} strokeWidth={stroke} strokeLinejoin="round"/>
      <path d="M9 11v5" stroke={color} strokeWidth={stroke} strokeLinecap="round"/>
    </svg>
  );
}

export function IconFactory({ color = 'currentColor', w = size }) {
  return (
    <svg width={w} height={w} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <path d="M4 16V8l5-4 5 4v8M2 16h14" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 12h2M10 12h2M6 8h2M10 8h2" stroke={color} strokeWidth={stroke} strokeLinecap="round"/>
    </svg>
  );
}

export function IconBriefcase({ color = 'currentColor', w = size }) {
  return (
    <svg width={w} height={w} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <rect x="2" y="5" width="14" height="11" rx="1" stroke={color} strokeWidth={stroke}/>
      <path d="M6 5V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1M9 9v3M6 12h6" stroke={color} strokeWidth={stroke} strokeLinecap="round"/>
    </svg>
  );
}

export function IconCart({ color = 'currentColor', w = size }) {
  return (
    <svg width={w} height={w} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <path d="M2 2h2l2 8h10l2-5H6" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="7" cy="15" r="1.5" stroke={color} strokeWidth={stroke}/>
      <circle cx="15" cy="15" r="1.5" stroke={color} strokeWidth={stroke}/>
    </svg>
  );
}

export function IconBuilding({ color = 'currentColor', w = size }) {
  return (
    <svg width={w} height={w} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <path d="M3 16V6l6-4 6 4v10M3 16h12" stroke={color} strokeWidth={stroke} strokeLinejoin="round"/>
      <path d="M7 10h2M9 13h2M11 10h2M7 7h4" stroke={color} strokeWidth={stroke} strokeLinecap="round"/>
    </svg>
  );
}

export function IconZap({ color = 'currentColor', w = size }) {
  return (
    <svg width={w} height={w} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <path d="M10 2L4 10h4l-2 6 6-8H8l2-6Z" stroke={color} strokeWidth={stroke} strokeLinejoin="round"/>
    </svg>
  );
}

export function IconGlobe({ color = 'currentColor', w = size }) {
  return (
    <svg width={w} height={w} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="9" cy="9" r="6" stroke={color} strokeWidth={stroke}/>
      <path d="M2 9h14M9 2a10 10 0 0 1 0 14M9 2a10 10 0 0 0 0 14" stroke={color} strokeWidth={stroke} strokeLinecap="round"/>
    </svg>
  );
}

export function IconRefresh({ color = 'currentColor', w = size }) {
  return (
    <svg width={w} height={w} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <path d="M15 9a6 6 0 0 0-9-5M3 9a6 6 0 0 1 9 5M3 3v4h4M15 15v-4h-4" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconClipboard({ color = 'currentColor', w = size }) {
  return (
    <svg width={w} height={w} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <path d="M6 3H5a1.5 1.5 0 0 0-1.5 1.5v10A1.5 1.5 0 0 0 5 16h8a1.5 1.5 0 0 0 1.5-1.5v-10A1.5 1.5 0 0 0 13 3h-1" stroke={color} strokeWidth={stroke} strokeLinejoin="round"/>
      <rect x="6" y="2" width="6" height="3" rx="1" stroke={color} strokeWidth={stroke}/>
      <path d="M6 8h6M6 11h4" stroke={color} strokeWidth={stroke} strokeLinecap="round"/>
    </svg>
  );
}

export function IconTrendUp({ color = 'currentColor', w = size }) {
  return (
    <svg width={w} height={w} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <path d="M2 14l4-5 3 2 5-7 2 2" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconLabel({ color = 'currentColor', w = size }) {
  return (
    <svg width={w} height={w} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <path d="M3 10l5-5 6 6-5 5-6-6Z" stroke={color} strokeWidth={stroke} strokeLinejoin="round"/>
      <path d="M8 5h4v4" stroke={color} strokeWidth={stroke} strokeLinecap="round"/>
    </svg>
  );
}

export function IconInbox({ color = 'currentColor', w = size }) {
  return (
    <svg width={w} height={w} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <path d="M2 6h14l-2 6H4L2 6Z" stroke={color} strokeWidth={stroke} strokeLinejoin="round"/>
      <path d="M2 6l3-3h8l3 3" stroke={color} strokeWidth={stroke} strokeLinejoin="round"/>
    </svg>
  );
}

export function IconMonitor({ color = 'currentColor', w = size }) {
  return (
    <svg width={w} height={w} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <rect x="1" y="2" width="16" height="11" rx="1" stroke={color} strokeWidth={stroke}/>
      <path d="M6 16h6M9 13v3" stroke={color} strokeWidth={stroke} strokeLinecap="round"/>
    </svg>
  );
}

export function IconLink({ color = 'currentColor', w = size }) {
  return (
    <svg width={w} height={w} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <path d="M8 10l2-2M10 8l2 2M6 12a3 3 0 0 1 0-4l2-2a3 3 0 0 1 4 4M12 6a3 3 0 0 1 4 4l-2 2a3 3 0 0 1-4-4" stroke={color} strokeWidth={stroke} strokeLinecap="round"/>
    </svg>
  );
}

export function IconMessage({ color = 'currentColor', w = size }) {
  return (
    <svg width={w} height={w} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <path d="M2 4h14v9H5l-3 3V4Z" stroke={color} strokeWidth={stroke} strokeLinejoin="round"/>
    </svg>
  );
}

export function IconSearch({ color = 'currentColor', w = size }) {
  return (
    <svg width={w} height={w} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="4" stroke={color} strokeWidth={stroke}/>
      <path d="M12 12l4 4" stroke={color} strokeWidth={stroke} strokeLinecap="round"/>
    </svg>
  );
}

export function IconMegaphone({ color = 'currentColor', w = size }) {
  return (
    <svg width={w} height={w} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <path d="M4 6l8-3v12l-8-3V6Z" stroke={color} strokeWidth={stroke} strokeLinejoin="round"/>
      <path d="M12 6a4 4 0 0 1 0 6" stroke={color} strokeWidth={stroke} strokeLinecap="round"/>
    </svg>
  );
}

export function IconRobot({ color = 'currentColor', w = size }) {
  return (
    <svg width={w} height={w} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <rect x="3" y="6" width="12" height="9" rx="1.5" stroke={color} strokeWidth={stroke}/>
      <path d="M6 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1M6 11h2M10 11h2M7 14h4" stroke={color} strokeWidth={stroke} strokeLinecap="round"/>
      <circle cx="7" cy="9" r="1" fill={color}/>
      <circle cx="11" cy="9" r="1" fill={color}/>
    </svg>
  );
}

export function IconDatabase({ color = 'currentColor', w = size }) {
  return (
    <svg width={w} height={w} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <ellipse cx="9" cy="4" rx="5" ry="2" stroke={color} strokeWidth={stroke}/>
      <path d="M4 4v10c0 1.1 2.2 2 5 2s5-.9 5-2V4" stroke={color} strokeWidth={stroke}/>
      <path d="M4 9c0 1.1 2.2 2 5 2s5-.9 5-2" stroke={color} strokeWidth={stroke}/>
    </svg>
  );
}

export function IconCard({ color = 'currentColor', w = size }) {
  return (
    <svg width={w} height={w} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <rect x="2" y="4" width="14" height="10" rx="1" stroke={color} strokeWidth={stroke}/>
      <path d="M2 8h14" stroke={color} strokeWidth={stroke} strokeLinecap="round"/>
    </svg>
  );
}

export function IconFlask({ color = 'currentColor', w = size }) {
  return (
    <svg width={w} height={w} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <path d="M6 2h6v5l4 8H2l4-8V2Z" stroke={color} strokeWidth={stroke} strokeLinejoin="round"/>
      <path d="M6 7h6" stroke={color} strokeWidth={stroke} strokeLinecap="round"/>
    </svg>
  );
}

export function IconHeart({ color = 'currentColor', w = size }) {
  return (
    <svg width={w} height={w} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <path d="M9 15.5S2 11.5 2 6.5A4 4 0 0 1 9 4a4 4 0 0 1 7 2.5C16 11.5 9 15.5 9 15.5Z" stroke={color} strokeWidth={stroke} strokeLinejoin="round"/>
    </svg>
  );
}

export function IconGitBranch({ color = 'currentColor', w = size }) {
  return (
    <svg width={w} height={w} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <path d="M4 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4ZM4 16a2 2 0 1 1 0-4 2 2 0 0 1 0 4ZM14 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" stroke={color} strokeWidth={stroke}/>
      <path d="M4 8v4M14 6c-2-1-4-1-6 0v4c2 1 4 1 6 0" stroke={color} strokeWidth={stroke} strokeLinecap="round"/>
    </svg>
  );
}

export function IconMic({ color = 'currentColor', w = size }) {
  return (
    <svg width={w} height={w} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <path d="M9 12a3 3 0 0 0 3-3V4a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Z" stroke={color} strokeWidth={stroke} strokeLinejoin="round"/>
      <path d="M4 8v1a5 5 0 0 0 10 0V8M9 12v4M7 16h4" stroke={color} strokeWidth={stroke} strokeLinecap="round"/>
    </svg>
  );
}

export function IconCheck({ color = 'currentColor', width = size, height = size }) {
  return (
    <svg width={width} height={height} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <path d="M3 9l4 4 8-8" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconClock({ color = 'currentColor', width = size, height = size }) {
  return (
    <svg width={width} height={height} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="9" cy="9" r="6" stroke={color} strokeWidth={stroke}/>
      <path d="M9 5v4l2.5 2.5" stroke={color} strokeWidth={stroke} strokeLinecap="round"/>
    </svg>
  );
}

export function IconPhone({ color = 'currentColor', width = size, height = size }) {
  return (
    <svg width={width} height={height} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <path d="M15 12.5v2a1.5 1.5 0 01-1.5 1.5 14 14 0 01-10-5 14 14 0 01-5-10A1.5 1.5 0 014 3h2a1.5 1.5 0 011.5 1.3 9.6 9.6 0 005.3 5.3A1.5 1.5 0 0112 8.5z" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/** Native brand logos — use with CHANNEL_COLORS from config/channelBrands.js */
export function IconLinkedIn({ color = '#0A66C2', width = 24, height = 24 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

export function IconFacebook({ color = '#1877F2', width = 24, height = 24 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

export function IconWhatsApp({ color = '#25D366', width = 24, height = 24 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.387.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

export function IconInstagram({ color = '#E4405F', width = 24, height = 24 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.766 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C8.333.014 8.741 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}

export function IconLock({ color = 'currentColor', width = size, height = size }) {
  return (
    <svg width={width} height={height} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <rect x="3" y="8" width="12" height="8" rx="1.5" stroke={color} strokeWidth={stroke}/>
      <path d="M5 8V5a4 4 0 018 0v3" stroke={color} strokeWidth={stroke} strokeLinecap="round"/>
    </svg>
  );
}

export function IconClose({ color = 'currentColor', width = size, height = size }) {
  return (
    <svg width={width} height={height} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <path d="M4 4l10 10M14 4L4 14" stroke={color} strokeWidth={stroke} strokeLinecap="round"/>
    </svg>
  );
}

export function IconTrash({ color = 'currentColor', width = size, height = size }) {
  return (
    <svg width={width} height={height} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <path d="M3 5h12M6 5V4a1 1 0 011-1h4a1 1 0 011 1v1M7 8v5M9 8v5M11 8v5M5 5l1 10a1 1 0 001 1h6a1 1 0 001-1L15 5" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconStar({ color = 'currentColor', width = size, height = size, filled = false }) {
  return (
    <svg width={width} height={height} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <path d="M9 2l2.2 4.5 4.9.7-3.5 3.4.8 4.9L9 13.2l-4.4 2.3.8-4.9L2 7.2l4.9-.7L9 2z" stroke={color} strokeWidth={stroke} strokeLinejoin="round" fill={filled ? color : 'none'}/>
    </svg>
  );
}

export function IconBell({ color = 'currentColor', width = size, height = size }) {
  return (
    <svg width={width} height={height} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <path d="M9 3a4 4 0 014 4v2a4 4 0 002 3.5H3a4 4 0 002-3.5V7a4 4 0 014-4z" stroke={color} strokeWidth={stroke} strokeLinejoin="round"/>
      <path d="M7 15a2 2 0 004 0" stroke={color} strokeWidth={stroke} strokeLinecap="round"/>
    </svg>
  );
}

export function IconUsers({ color = 'currentColor', width = size, height = size }) {
  return (
    <svg width={width} height={height} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="6" cy="5" r="2.5" stroke={color} strokeWidth={stroke}/>
      <path d="M2 15c0-2.2 1.8-4 4-4s4 1.8 4 4M12 6a2.5 2.5 0 11 0 5 2.5 2.5 0 010-5z" stroke={color} strokeWidth={stroke} strokeLinecap="round"/>
      <path d="M16 15c0-1.7-1-3.2-2.4-3.9" stroke={color} strokeWidth={stroke} strokeLinecap="round"/>
    </svg>
  );
}

export function IconLightbulb({ color = 'currentColor', width = size, height = size }) {
  return (
    <svg width={width} height={height} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <path d="M9 2a5 5 0 013.5 8.5v2H5.5v-2A5 5 0 019 2z" stroke={color} strokeWidth={stroke} strokeLinejoin="round"/>
      <path d="M7 14h4M8 16h2" stroke={color} strokeWidth={stroke} strokeLinecap="round"/>
    </svg>
  );
}

export function IconCircleEmpty({ color = 'currentColor', width = size, height = size }) {
  return (
    <svg width={width} height={height} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="9" cy="9" r="6" stroke={color} strokeWidth={stroke}/>
    </svg>
  );
}

export const FEATURE_ICON_MAP = {
  competitiveIntel:      IconTarget,
  intentSignals:          IconCompass,
  abmEngine:              IconTarget,
  ariaVoice:              IconMic,
  predictiveForecasting:  IconTrendUp,
  whiteLabel:             IconLabel,
  apiAccess:              IconZap,
  customAgents:           IconRobot,
  dataWarehouseSync:      IconDatabase,
  crossClientAnalytics:   IconChart,
  subBilling:             IconCard,
  advancedAnalytics:      IconFlask,
  unifiedInbox:           IconInbox,
  clientPortal:           IconMonitor,
  ganttPlan:              IconCalendar,
  pipelineManager:        IconGitBranch,
  customerSuccess:        IconHeart,
  linkedinOutreach:       IconLink,
  whatsappOutreach:       IconMessage,
  googleAdsManagement:    IconSearch,
  linkedinAdsManagement:  IconMegaphone,
  outcomeBilling:         IconClipboard,
};

export const PLAYBOOK_ICON_MAP = {
  rocket:    IconRocket,
  factory:   IconFactory,
  briefcase: IconBriefcase,
  cart:      IconCart,
  building:  IconBuilding,
  zap:       IconZap,
  globe:     IconGlobe,
  refresh:   IconRefresh,
};

/** Notification type → Icon component for filter pills / lists */
export const NOTIF_TYPE_ICON_MAP = {
  escalation:     IconWarning,
  intent_alert:    IconZap,
  agent_complete:  IconCheck,
  reply_received:  IconMessage,
  approval_due:    IconClock,
  demo_booked:     IconCalendar,
  report_ready:    IconDocument,
  budget_alert:    IconCard,
};
