/**
 * Small stroke icons for command-mode sidebars (currentColor, 18×18).
 */
const base = { width: 18, height: 18, viewBox: '0 0 18 18', fill: 'none' };

export function IconDashboard() {
  return (
    <svg {...base}>
      <rect x="1.5" y="1.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="10.5" y="1.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="1.5" y="10.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="10.5" y="10.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function IconContent() {
  return (
    <svg {...base}>
      <rect x="3" y="1.5" width="12" height="15" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 6h6M6 9h6M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconClipboard() {
  return (
    <svg {...base}>
      <path d="M6 2.5h6l1 2.5h3v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3.5 16V5h3l1-2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M6 8h6M6 11h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function IconCheckCircle() {
  return (
    <svg {...base}>
      <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 9l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconKnowledge() {
  return (
    <svg {...base}>
      <path d="M9 2c-3 0-5.5 1.5-5.5 4.5 0 2 1.5 3.5 3.5 4v3l2-1.5 2 1.5v-3c2-.5 3.5-2 3.5-4C14.5 3.5 12 2 9 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7 7.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconSettings() {
  return (
    <svg {...base}>
      <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 2v1.5M9 14.5V16M2 9h1.5M14.5 9H16M3.93 3.93l1.06 1.06M13.01 13.01l1.06 1.06M3.93 14.07l1.06-1.06M13.01 4.99l1.06-1.06" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconCampaign() {
  return (
    <svg {...base}>
      <path d="M2 9h14M2 9l4-4M2 9l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 4v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconChart() {
  return (
    <svg {...base}>
      <path d="M2 14h14M5 14V9m4 5V6m4 8V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconAgents() {
  return (
    <svg {...base}>
      <circle cx="9" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2.5 15.5c0-3.314 2.91-6 6.5-6s6.5 2.686 6.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="14" cy="5" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function IconWorkflow() {
  return (
    <svg {...base}>
      <circle cx="4.5" cy="9" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="13.5" cy="5" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="13.5" cy="13" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6.2 8.2l4.6-2.4M6.2 9.8l4.6 2.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function IconEscalation() {
  return (
    <svg {...base}>
      <path d="M9 2L16 14H2L9 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 7v3M9 12v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconBrain() {
  return (
    <svg {...base}>
      <path d="M9 3.5a3 3 0 0 1 3 2.8c0 .4.1.8.3 1.1a2.5 2.5 0 0 1-.2 4.8 2.8 2.8 0 0 1-5.6-.2 2.5 2.5 0 0 1 .1-5.2A3 3 0 0 1 9 3.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7 14.5h4M9 12v2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function IconReport() {
  return (
    <svg {...base}>
      <rect x="3" y="2" width="12" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 6h6M6 9h4M6 12h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
