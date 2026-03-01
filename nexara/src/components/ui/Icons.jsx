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

export function IconLock({ color = 'currentColor', width = size, height = size }) {
  return (
    <svg width={width} height={height} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <rect x="3" y="8" width="12" height="8" rx="1.5" stroke={color} strokeWidth={stroke}/>
      <path d="M5 8V5a4 4 0 018 0v3" stroke={color} strokeWidth={stroke} strokeLinecap="round"/>
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
