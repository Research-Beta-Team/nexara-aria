// ── Unified Inbox mock data ───────────────────
// 8 conversations across LinkedIn, Facebook, WhatsApp, Email

const CONVERSATIONS = [
  {
    id: 'c1',
    channel: 'LinkedIn',
    contact: 'Helen Tan',
    company: 'Dragon Capital',
    avatar: 'HT',
    role: 'CFO',
    lastMessage: "Thanks for reaching out! I'd love to learn more — can we set up a call?",
    time: '2:34 PM',
    status: 'unread',
    classification: 'Hot Lead',
    icpScore: 92,
    stage: 'SQL',
    ariaClassification: {
      intent: 'Meeting Request',
      confidence: 94,
      reasoning: 'Contact expressed strong buying intent and explicitly requested a demo call. High-value prospect at a Series B fund.',
    },
    ariaSuggestion: `Hi Helen,

Great to hear from you! I'd be happy to walk you through how we've helped other CFOs at growth-stage firms reduce overhead by 34%.

Are you available for a 20-minute call this Thursday at 2pm or Friday at 10am?

Looking forward to connecting.

Best,
James`,
    touchpoints: [
      { id: 'tp1', label: 'T1', type: 'LinkedIn Connect', sent: 'Feb 15', opened: true },
      { id: 'tp2', label: 'T2', type: 'LinkedIn DM',     sent: 'Feb 18', opened: true },
      { id: 'tp3', label: 'T3', type: 'LinkedIn DM',     sent: 'Feb 22', opened: true },
    ],
    messages: [
      { id: 'm1', from: 'outbound', author: 'James D. (via ARIA)', time: 'Feb 15 · 9:00 AM', body: "Hi Helen, I noticed Dragon Capital's recent expansion into Southeast Asia. We've helped 3 similar firms reduce overhead costs by an average of 34%. Would love to share how — open to a quick chat?", channel: 'LinkedIn' },
      { id: 'm2', from: 'inbound',  author: 'Helen Tan',           time: 'Feb 15 · 2:30 PM', body: "Hi James, thanks for connecting! We're actually in the middle of reviewing our cost structure for Q2. What kind of solutions do you offer?", channel: 'LinkedIn' },
      { id: 'm3', from: 'outbound', author: 'James D. (via ARIA)', time: 'Feb 18 · 9:00 AM', body: "Great timing! We specialize in AI-powered operational intelligence for finance teams. Our platform typically saves CFOs 8-12 hours per week on reporting and surfaces savings opportunities automatically. Happy to send a case study?", channel: 'LinkedIn' },
      { id: 'm4', from: 'inbound',  author: 'Helen Tan',           time: 'Feb 22 · 11:15 AM', body: "Thanks for reaching out! I'd love to learn more — particularly interested in the reporting automation angle. Can we set up a call?", channel: 'LinkedIn' },
    ],
  },

  {
    id: 'c2',
    channel: 'Email',
    contact: 'Marcus Vo',
    company: 'SEA Corp',
    avatar: 'MV',
    role: 'Head of Finance',
    lastMessage: "I've looked at the proposal and have a few questions around pricing and timeline.",
    time: '11:42 AM',
    status: 'unread',
    classification: 'Interested',
    icpScore: 78,
    stage: 'MQL',
    ariaClassification: {
      intent: 'Question',
      confidence: 87,
      reasoning: 'Contact asking clarifying questions about pricing structure and implementation timeline. Budget qualified — needs specific answers to move to SQL.',
    },
    ariaSuggestion: `Hi Marcus,

Thanks for reviewing the proposal! Happy to clarify.

1. Pricing is seat-based — I'll send a tailored quote by tomorrow.
2. Implementation typically takes 2-3 weeks including data integration and team onboarding.
3. Yes, we integrate with NetSuite — done this for 8+ clients in the region.

Would a 30-minute call this week work to walk through your questions live?

Best,
James`,
    touchpoints: [
      { id: 'tp1', label: 'T1', type: 'Intro Email',  sent: 'Feb 10', opened: true  },
      { id: 'tp2', label: 'T2', type: 'Follow-up',    sent: 'Feb 14', opened: true  },
      { id: 'tp3', label: 'T3', type: 'Case Study',   sent: 'Feb 18', opened: true  },
      { id: 'tp4', label: 'T4', type: 'Proposal',     sent: 'Feb 21', opened: true  },
    ],
    messages: [
      { id: 'm1', from: 'outbound', author: 'ARIA (Email Sequencer)', time: 'Feb 10 · 8:00 AM', body: "Subject: Quick question about SEA Corp's Q2 planning\n\nHi Marcus, I came across SEA Corp's recent expansion announcement and thought our platform could be timely for your team...", channel: 'Email' },
      { id: 'm2', from: 'outbound', author: 'ARIA (Email Sequencer)', time: 'Feb 14 · 8:00 AM', body: "Subject: CFO Cost Reduction Playbook for Growth-Stage Firms\n\nHi Marcus, sharing the playbook I mentioned — 400+ CFOs contributed their top operational savings strategies.", channel: 'Email' },
      { id: 'm3', from: 'inbound',  author: 'Marcus Vo',              time: 'Feb 16 · 3:00 PM', body: "Hi, thanks for the playbook — some really useful ideas. We're evaluating a few tools in this space. Could you send over pricing information?", channel: 'Email' },
      { id: 'm4', from: 'outbound', author: 'James D.',               time: 'Feb 18 · 9:00 AM', body: "Hi Marcus, great to hear from you! Attaching our case study from a similar company in the region. Happy to walk through custom pricing on a call.", channel: 'Email' },
      { id: 'm5', from: 'outbound', author: 'James D.',               time: 'Feb 21 · 10:00 AM', body: "Hi Marcus, following up with the proposal we discussed. Let me know if you have any questions!", channel: 'Email' },
      { id: 'm6', from: 'inbound',  author: 'Marcus Vo',              time: 'Feb 22 · 11:42 AM', body: "I've looked at the proposal and have a few questions — mainly around pricing structure, implementation timeline, and whether you integrate with NetSuite.", channel: 'Email' },
    ],
  },

  {
    id: 'c3',
    channel: 'LinkedIn',
    contact: 'Sarah Kim',
    company: 'Vinhomes JSC',
    avatar: 'SK',
    role: 'VP Finance',
    lastMessage: "Thanks for the info, we're not looking at this right now.",
    time: 'Yesterday',
    status: 'read',
    classification: 'Not Interested',
    icpScore: 71,
    stage: 'IQL',
    ariaClassification: {
      intent: 'Not Interested',
      confidence: 96,
      reasoning: "Contact explicitly declined — timing objection, not a budget or fit issue. Post-Series B integration is cited. Queue a 6-month re-engage sequence.",
    },
    ariaSuggestion: `Hi Sarah,

Totally understand — timing is everything. I'll circle back in Q3 when things may have shifted.

In the meantime, I'll send over our quarterly CFO benchmarking report — no strings attached, just useful data for your planning.

Thanks for your time!

Best,
James`,
    touchpoints: [
      { id: 'tp1', label: 'T1', type: 'LinkedIn Connect', sent: 'Feb 12', opened: true },
      { id: 'tp2', label: 'T2', type: 'LinkedIn DM',      sent: 'Feb 17', opened: true },
    ],
    messages: [
      { id: 'm1', from: 'outbound', author: 'ARIA (via James)', time: 'Feb 12 · 9:00 AM', body: "Hi Sarah, congratulations on the Series B! We help finance VPs like yourself automate operational reporting and surface budget optimization opportunities...", channel: 'LinkedIn' },
      { id: 'm2', from: 'outbound', author: 'ARIA (via James)', time: 'Feb 17 · 9:00 AM', body: "Hi Sarah, following up — wanted to share a quick win from a recent client in real estate finance who saved 14 hours per week on consolidation.", channel: 'LinkedIn' },
      { id: 'm3', from: 'inbound',  author: 'Sarah Kim',        time: 'Feb 21 · 2:15 PM', body: "Thanks for the info, we're not looking at this right now. Our team is heads-down on the post-Series B integration for the next 6 months.", channel: 'LinkedIn' },
    ],
  },

  {
    id: 'c4',
    channel: 'WhatsApp',
    contact: 'Linh Nguyen',
    company: 'Acme VN',
    avatar: 'LN',
    role: 'CFO',
    lastMessage: 'Can we move the demo to Thursday? Something came up on Wednesday.',
    time: '10:05 AM',
    status: 'unread',
    classification: 'Meeting Request',
    icpScore: 88,
    stage: 'SQL',
    ariaClassification: {
      intent: 'Reschedule',
      confidence: 99,
      reasoning: 'Contact requesting to reschedule a confirmed meeting. High-priority SQL — respond quickly to avoid losing momentum.',
    },
    ariaSuggestion: `Hi Linh! Of course, no problem at all.

Thursday works great — I have availability at 10am, 2pm, or 4pm. Which works best for you?

Looking forward to it!`,
    touchpoints: [
      { id: 'tp1', label: 'T1', type: 'Intro Email',    sent: 'Feb 8',  opened: true },
      { id: 'tp2', label: 'T2', type: 'Follow-up',      sent: 'Feb 12', opened: true },
      { id: 'tp3', label: 'T3', type: 'Demo Confirmed', sent: 'Feb 16', opened: true },
    ],
    messages: [
      { id: 'm1', from: 'outbound', author: 'James D.', time: 'Feb 20 · 9:00 AM', body: "Hi Linh! Just confirming our Wednesday 3pm demo — I'll send the Zoom link shortly. Looking forward to showing you the platform.", channel: 'WhatsApp' },
      { id: 'm2', from: 'inbound',  author: 'Linh Nguyen', time: 'Feb 20 · 9:30 AM', body: 'Great, looking forward to it!', channel: 'WhatsApp' },
      { id: 'm3', from: 'inbound',  author: 'Linh Nguyen', time: 'Feb 22 · 10:05 AM', body: "Hi James — can we move the demo to Thursday? Something came up on Wednesday that I can't reschedule.", channel: 'WhatsApp' },
    ],
  },

  {
    id: 'c5',
    channel: 'Facebook',
    contact: 'David Chen',
    company: 'Pacific Ventures',
    avatar: 'DC',
    role: 'CEO',
    lastMessage: 'Saw your ad — what makes you different from Anaplan?',
    time: '9:18 AM',
    status: 'unread',
    classification: 'Interested',
    icpScore: 65,
    stage: 'IQL',
    ariaClassification: {
      intent: 'Competitor Comparison',
      confidence: 91,
      reasoning: 'Inbound from Facebook ad — asking for competitive differentiation vs Anaplan. High intent signal. Needs objection handling script.',
    },
    ariaSuggestion: `Hi David, great question!

The main differences from Anaplan:

1. Setup time: We're live in 2-3 weeks vs 3-6 months for Anaplan
2. AI-first: We proactively surface insights rather than just modeling scenarios
3. Pricing: 70% lower TCO for companies under 500 seats

Anaplan is great for large enterprise, but for growth-stage companies you're often paying for complexity you don't need.

Would love to show you a 15-minute demo — does this week work?`,
    touchpoints: [
      { id: 'tp1', label: 'Ad', type: 'Facebook Ad Click', sent: 'Feb 22', opened: true },
    ],
    messages: [
      { id: 'm1', from: 'inbound', author: 'David Chen', time: 'Feb 22 · 9:18 AM', body: "Saw your ad about AI for finance teams — what makes you different from Anaplan? We looked at them last year and it felt overly complex for our size.", channel: 'Facebook' },
    ],
  },

  {
    id: 'c6',
    channel: 'Email',
    contact: 'Priya Mehta',
    company: 'TechBridge SG',
    avatar: 'PM',
    role: 'Finance Director',
    lastMessage: 'Out of office until March 3. For urgent matters please contact...',
    time: 'Feb 20',
    status: 'read',
    classification: 'Out of Office',
    icpScore: 74,
    stage: 'MQL',
    ariaClassification: {
      intent: 'Out of Office',
      confidence: 99,
      reasoning: 'Auto-reply detected. Contact returns March 3. ARIA has queued a follow-up email for March 4 at 8am.',
    },
    ariaSuggestion: `Hi Priya,

Welcome back! Hope you had a great time off.

I'd still love to connect about how we've helped Finance Directors at companies like TechBridge save 10+ hours per week on reporting.

Would a quick 20-minute intro call work in your first week back?

Best,
James`,
    touchpoints: [
      { id: 'tp1', label: 'T1', type: 'Intro Email', sent: 'Feb 15', opened: false },
      { id: 'tp2', label: 'T2', type: 'Follow-up',   sent: 'Feb 19', opened: true  },
    ],
    messages: [
      { id: 'm1', from: 'outbound', author: 'ARIA (Email Sequencer)', time: 'Feb 19 · 8:00 AM', body: "Hi Priya, hope Q1 is off to a strong start! We work with Finance Directors at SaaS companies in the region to automate reporting and surface cost savings...", channel: 'Email' },
      { id: 'm2', from: 'inbound',  author: 'Auto-Reply',             time: 'Feb 19 · 8:02 AM', body: "Out of office until March 3. For urgent matters please contact my colleague at ops@techbridge.sg. I will respond to all emails upon my return.", channel: 'Email' },
    ],
  },

  {
    id: 'c7',
    channel: 'WhatsApp',
    contact: 'Alex Tran',
    company: 'VNPT Digital',
    avatar: 'AT',
    role: 'CFO',
    lastMessage: "The ROI numbers look compelling. Can you send the full deck?",
    time: 'Feb 21',
    status: 'replied',
    classification: 'Hot Lead',
    icpScore: 83,
    stage: 'SQL',
    ariaClassification: {
      intent: 'Content Request',
      confidence: 89,
      reasoning: 'Contact requesting sales deck after reviewing ROI summary — strong buying signal. Recommend moving to Opportunity stage and involving Solutions team.',
    },
    ariaSuggestion: `Hi Alex,

Sending the deck over now! It includes the ROI breakdown, implementation timeline, and 3 case studies from telco/digital companies in the region.

I've also flagged you as a priority — our Head of Solutions can join a call if you'd like a deeper technical walkthrough.

When are you free this week or next?`,
    touchpoints: [
      { id: 'tp1', label: 'T1', type: 'WhatsApp Intro', sent: 'Feb 14', opened: true },
      { id: 'tp2', label: 'T2', type: 'ROI Summary',    sent: 'Feb 18', opened: true },
      { id: 'tp3', label: 'T3', type: 'Follow-up',      sent: 'Feb 21', opened: true },
    ],
    messages: [
      { id: 'm1', from: 'outbound', author: 'James D.',  time: 'Feb 14 · 9:00 AM',  body: "Hi Alex! We help telco finance teams automate the reporting that usually takes your analysts 2 days a week. Mind if I share a quick overview?", channel: 'WhatsApp' },
      { id: 'm2', from: 'inbound',  author: 'Alex Tran', time: 'Feb 14 · 11:00 AM', body: 'Sure, go ahead.', channel: 'WhatsApp' },
      { id: 'm3', from: 'outbound', author: 'James D.',  time: 'Feb 18 · 9:00 AM',  body: "[ROI Summary - VNPT Digital Profile.pdf]\n\nHi Alex, quick summary of what we'd expect for a company your size — roughly $280K saved annually in analyst time alone.", channel: 'WhatsApp' },
      { id: 'm4', from: 'inbound',  author: 'Alex Tran', time: 'Feb 21 · 3:15 PM',  body: "The ROI numbers look compelling. Can you send the full deck? I'd like to share with my team before we decide whether to move forward.", channel: 'WhatsApp' },
      { id: 'm5', from: 'outbound', author: 'James D. (via ARIA)', time: 'Feb 21 · 3:22 PM', body: "Sending it now! Deck includes 3 telco case studies and a custom ROI model. Let me know when your team has had a chance to review.", channel: 'WhatsApp' },
    ],
  },

  {
    id: 'c8',
    channel: 'Facebook',
    contact: 'Mai Thi Lan',
    company: 'Indochina Holdings',
    avatar: 'ML',
    role: 'Head of Finance',
    lastMessage: "This sounds interesting, but I'm concerned about the budget.",
    time: 'Feb 19',
    status: 'replied',
    classification: 'Interested',
    icpScore: 69,
    stage: 'MQL',
    ariaClassification: {
      intent: 'Interested',
      confidence: 82,
      reasoning: 'Contact showing moderate interest with a budget objection. Nurture with ROI framing and pilot offer to overcome barrier.',
    },
    ariaSuggestion: `Hi Mai,

Totally understand the budget concern — let me address that directly.

We offer a phased implementation starting at $2,500/month, and most clients see ROI within 60 days. We also offer a 30-day free pilot so there's zero risk to evaluate.

Would a pilot work for your situation? Happy to walk through the numbers on a quick call.`,
    touchpoints: [
      { id: 'tp1', label: 'Ad', type: 'Facebook Ad',    sent: 'Feb 16', opened: true },
      { id: 'tp2', label: 'DM', type: 'Messenger DM',   sent: 'Feb 18', opened: true },
    ],
    messages: [
      { id: 'm1', from: 'outbound', author: 'ARIA (Facebook)', time: 'Feb 18 · 10:00 AM', body: "Hi Mai! Thanks for engaging with our ad. We help finance leaders like yourself automate reporting and surface insights automatically. Would you like to see a quick demo?", channel: 'Facebook' },
      { id: 'm2', from: 'inbound',  author: 'Mai Thi Lan',     time: 'Feb 19 · 9:00 AM',  body: "This sounds interesting, but I'm concerned about the budget. We're a mid-sized holding company and tools like this tend to be expensive. What's the pricing like?", channel: 'Facebook' },
      { id: 'm3', from: 'outbound', author: 'James D.',         time: 'Feb 19 · 11:00 AM', body: "Hi Mai! Great question — our pricing is designed to be ROI-positive from day one. Let me share a quick breakdown...", channel: 'Facebook' },
    ],
  },
];

export default CONVERSATIONS;
