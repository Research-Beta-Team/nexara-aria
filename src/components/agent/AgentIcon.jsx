// Shared agent icon component — renders a themed SVG per iconType
// Usage: <AgentIcon type="prospector" size={24} color={C.primary} />

export default function AgentIcon({ type, size = 24, color = '#3DDC84' }) {
  const s = size;
  const props = { width: s, height: s, viewBox: "0 0 24 24", fill: "none" };

  switch (type) {
    case 'prospector':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="3.5" stroke={color} strokeWidth="1.5"/>
          <circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth="1.5"/>
          <path d="M12 1v3M12 20v3M1 12h3M20 12h3" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M12 8.5V12l2.5 2.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'email':
      return (
        <svg {...props}>
          <rect x="2" y="4" width="20" height="16" rx="2.5" stroke={color} strokeWidth="1.5"/>
          <path d="M2 8l8.5 5.5a3 3 0 003 0L22 8" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      );
    case 'reply':
      return (
        <svg {...props}>
          <path d="M9 17H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-7l-3 3z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M8 10h8M8 13.5h5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      );
    case 'adwriter':
      return (
        <svg {...props}>
          <path d="M12 20h9" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'content':
      return (
        <svg {...props}>
          <rect x="3" y="3" width="18" height="18" rx="2.5" stroke={color} strokeWidth="1.5"/>
          <path d="M7 8h10M7 12h10M7 16h6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      );
    case 'bidoptimizer':
      return (
        <svg {...props}>
          <polyline points="3,17 9,11 13,15 21,7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17 7h4v4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 20h18" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      );
    case 'icp':
      return (
        <svg {...props}>
          <circle cx="9" cy="7" r="3.5" stroke={color} strokeWidth="1.5"/>
          <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="18" cy="14" r="3" stroke={color} strokeWidth="1.5"/>
          <path d="M16.5 14l1 1 2-2" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'budget':
      return (
        <svg {...props}>
          <path d="M12 2L3 7v6c0 5 3.8 9.7 9 11 5.2-1.3 9-6 9-11V7L12 2z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M12 8v4M12 15v.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M9.5 10.5C9.5 9.1 10.6 8 12 8s2.5 1.1 2.5 2.5c0 2.5-2.5 3-2.5 3" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      );
    case 'brand':
      return (
        <svg {...props}>
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
      );
    case 'insight':
      return (
        <svg {...props}>
          <rect x="3" y="12" width="4" height="9" rx="1" stroke={color} strokeWidth="1.5"/>
          <rect x="10" y="7" width="4" height="14" rx="1" stroke={color} strokeWidth="1.5"/>
          <rect x="17" y="3" width="4" height="18" rx="1" stroke={color} strokeWidth="1.5"/>
          <path d="M3 5l4-2 4 4 4-3 4-2" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'escalation':
      return (
        <svg {...props}>
          <path d="M10.3 3.6L2 20h20L13.7 3.6a2 2 0 00-3.4 0z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M12 10v4M12 17v.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      );
    case 'kb':
      return (
        <svg {...props}>
          <ellipse cx="12" cy="6" rx="8" ry="3" stroke={color} strokeWidth="1.5"/>
          <path d="M4 6v4c0 1.66 3.58 3 8 3s8-1.34 8-3V6" stroke={color} strokeWidth="1.5"/>
          <path d="M4 10v4c0 1.66 3.58 3 8 3s8-1.34 8-3v-4" stroke={color} strokeWidth="1.5"/>
          <path d="M4 14v4c0 1.66 3.58 3 8 3s8-1.34 8-3v-4" stroke={color} strokeWidth="1.5"/>
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5"/>
          <circle cx="12" cy="12" r="3" fill={color}/>
        </svg>
      );
  }
}
