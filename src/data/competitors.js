// ─────────────────────────────────────────────
//  Competitive Intelligence — mock data
// ─────────────────────────────────────────────

export const COMPETITORS = [
  {
    id: 'apollo',
    name: 'Apollo.io',
    website: 'https://apollo.io',
    lastChecked: '2025-02-28',
    positioningStatement: 'Full-stack sales intelligence and engagement platform for outbound teams.',
    targetICP: 'SMB to mid-market sales teams doing high-volume outbound.',
    pricingModel: 'Freemium + tiered',
    estimatedPrice: '$49–$149/user/mo',
    strengths: [
      'Large contact database (250M+ contacts)',
      'Free tier attracts many signups',
      'Unified sequencing and dialer',
    ],
    weaknesses: [
      'Data freshness issues in some regions',
      'Support and onboarding can be slow',
      'Limited AI personalization',
    ],
    recentChanges: [
      { text: 'Changed pricing page', daysAgo: 3 },
      { text: 'New "Teams" plan launched', daysAgo: 12 },
      { text: 'Updated privacy policy', daysAgo: 21 },
    ],
    adCreatives: [
      {
        id: 'a1',
        format: 'Feed',
        copy: 'Stop buying lists. Apollo gives you 250M+ contacts with emails and phones. Start free.',
        firstSeen: '2025-02-20',
        angle: 'Free plan',
        ctrRange: '1.2–2.1%',
      },
      {
        id: 'a2',
        format: 'Carousel',
        copy: '3 steps to 2x your pipeline: 1) Find leads in Apollo 2) Enrich with intent 3) Sequence. Try free.',
        firstSeen: '2025-02-15',
        angle: 'Ease of Use',
        ctrRange: '0.8–1.5%',
      },
      {
        id: 'a3',
        format: 'Story',
        copy: 'Your reps are wasting time on bad data. Apollo = accurate emails & phones. Free to start.',
        firstSeen: '2025-02-10',
        angle: 'Data Quality',
        ctrRange: '1.0–1.8%',
      },
    ],
    g2Rating: 4.5,
    reviewCount: 5840,
    reviewThemes: {
      positive: [
        { theme: 'Easy to use', count: 892 },
        { theme: 'Great database size', count: 654 },
        { theme: 'Good value for money', count: 421 },
      ],
      negative: [
        { theme: 'Data accuracy issues', count: 312 },
        { theme: 'Support response time', count: 198 },
        { theme: 'Limited customization', count: 156 },
      ],
    },
    sampleReviews: [
      { quote: 'We had a lot of bounces and outdated emails. Support took days to respond.', rating: 3 },
      { quote: 'Great for volume but data quality in APAC is hit or miss. Ended up adding another enrichment tool.', rating: 4 },
      { quote: 'The free tier got us started but we outgrew it fast. Pricing gets steep.', rating: 4 },
    ],
    ourWinRate: 62,
    battleCard: {
      objectionHandlers: [
        { prospectSaid: 'We already use Apollo and it works fine.', youSay: 'Apollo is strong on volume. Where we win is accuracy and AI—we see 40% fewer bounces and our sequences get 2x reply rates because of intent-based personalization. Happy to show a side-by-side with your current data.' },
        { prospectSaid: 'Apollo has a free plan; why would we pay more?', youSay: 'Free plans cap you on credits and features. For teams doing serious outbound, our unified GTM stack replaces Apollo plus your sequencing tool—one platform, one price, and we don’t throttle on volume.' },
        { prospectSaid: 'Our team is used to Apollo.', youSay: 'We offer migration and onboarding so reps are productive in under a week. Most teams see higher reply rates in the first 30 days. We can run a pilot alongside Apollo so you compare with real data.' },
        { prospectSaid: 'Apollo has more contacts.', youSay: 'Volume matters less than fit. We focus on verified, intent-signaled contacts and deep firmographics so your sequences reach the right people. Fewer contacts, better outcomes.' },
        { prospectSaid: 'We need to see a demo first.', youSay: 'Absolutely. We’ll tailor the demo to your ICP and show exactly how we’d replace or complement Apollo—including win/loss data from teams who switched.' },
      ],
      ourAdvantages: [
        'Unified GTM OS: sequences, ads, and analytics in one place—no Apollo + separate sequencing tool.',
        'Higher data accuracy and deliverability; fewer bounces and blocks.',
        'AI-driven personalization and intent signals built in, not bolted on.',
      ],
      theirAdvantages: [
        'Larger contact database and strong brand recognition.',
        'Free tier for small teams and experimentation.',
      ],
      proofPoints: [
        { quote: 'We switched from Apollo and cut our bounce rate by half. Reply rates went up 2x in 60 days.', company: 'B2B SaaS, 45 reps' },
        { quote: 'NEXARA replaced Apollo and Outreach for us. One platform, one source of truth.', company: 'Agency, 12 users' },
      ],
    },
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    website: 'https://hubspot.com',
    lastChecked: '2025-02-27',
    positioningStatement: 'All-in-one CRM, marketing, sales, and service platform.',
    targetICP: 'Mid-market to enterprise; marketing-led growth teams.',
    pricingModel: 'Tiered (Free, Starter, Professional, Enterprise)',
    estimatedPrice: '$45–$1,600+/seat/mo',
    strengths: [
      'Full CRM and marketing automation',
      'Strong brand and ecosystem',
      'Good for inbound-led motion',
    ],
    weaknesses: [
      'Outbound/sequencing is not best-in-class',
      'Cost scales quickly at scale',
      'Complex setup for pure sales use cases',
    ],
    recentChanges: [
      { text: 'Sales Hub price increase', daysAgo: 5 },
      { text: 'New AI features in beta', daysAgo: 14 },
    ],
    adCreatives: [
      {
        id: 'h1',
        format: 'Feed',
        copy: 'Grow better with the platform that brings your marketing, sales, and service together. Start free.',
        firstSeen: '2025-02-22',
        angle: 'All-in-one',
        ctrRange: '0.9–1.6%',
      },
      {
        id: 'h2',
        format: 'Carousel',
        copy: 'From first touch to closed deal: one CRM, one source of truth. See why 200k+ companies choose HubSpot.',
        firstSeen: '2025-02-18',
        angle: 'Integrations',
        ctrRange: '0.7–1.3%',
      },
    ],
    g2Rating: 4.4,
    reviewCount: 13200,
    reviewThemes: {
      positive: [
        { theme: 'All-in-one platform', count: 2100 },
        { theme: 'Great for inbound', count: 1650 },
        { theme: 'Ecosystem and integrations', count: 980 },
      ],
      negative: [
        { theme: 'Expensive at scale', count: 720 },
        { theme: 'Outbound features lacking', count: 540 },
        { theme: 'Steep learning curve', count: 410 },
      ],
    },
    sampleReviews: [
      { quote: 'We use it for marketing and CRM but our sales team still uses another tool for outbound. Wish it was stronger there.', rating: 4 },
      { quote: 'Costs added up fast when we scaled. Great product but budget carefully.', rating: 3 },
    ],
    ourWinRate: 58,
    battleCard: {
      objectionHandlers: [
        { prospectSaid: 'We use HubSpot for everything already.', youSay: 'HubSpot excels at inbound and full-funnel CRM. For outbound and GTM execution, we’re built specifically for that—deeper sequencing, ad sync, and AI that’s tuned for sales teams. Many of our customers keep HubSpot as CRM and use NEXARA for execution.' },
        { prospectSaid: 'HubSpot has more features.', youSay: 'They have breadth; we have depth in GTM execution. If your priority is outbound performance, reply rates, and unified campaigns, we’re the specialist. We integrate with HubSpot so you keep your CRM.' },
        { prospectSaid: 'Our marketing team loves HubSpot.', youSay: 'No need to replace HubSpot for marketing. We integrate so sales and marketing share the same pipeline view. Sales gets best-in-class sequencing and ads; marketing keeps HubSpot. Best of both.' },
        { prospectSaid: 'Switching would be too disruptive.', youSay: 'We’re designed to sit alongside HubSpot—no big rip-and-replace. You can start with one team or use case and expand. We’ll show you a clear migration path.' },
      ],
      ourAdvantages: [
        'Purpose-built for outbound and GTM execution; HubSpot is broad, we’re deep in sequences and ads.',
        'Predictable pricing that doesn’t spike with seat count; better fit for sales-heavy teams.',
        'Native ad intelligence and competitive intel; HubSpot doesn’t focus here.',
      ],
      theirAdvantages: [
        'Industry-leading CRM and marketing automation for full-funnel teams.',
        'Massive ecosystem, app marketplace, and community.',
      ],
      proofPoints: [
        { quote: 'We kept HubSpot for CRM and added NEXARA for outbound. Reply rates and pipeline both up.', company: 'Mid-market SaaS' },
        { quote: 'HubSpot was overkill for our sales motion. NEXARA gave us exactly what we needed at half the cost.', company: 'Agency, 8 reps' },
      ],
    },
  },
  {
    id: 'clay',
    name: 'Clay',
    website: 'https://clay.com',
    lastChecked: '2025-02-28',
    positioningStatement: 'Data enrichment and personalization at scale with no-code workflows.',
    targetICP: 'Revenue teams that want flexible data pipelines and enrichment.',
    pricingModel: 'Usage-based (credits)',
    estimatedPrice: '$149–$800+/mo',
    strengths: [
      'Flexible data workflows and enrichment',
      'Strong for technical and power users',
      'Many data provider integrations',
    ],
    weaknesses: [
      'Steep learning curve for non-technical users',
      'Cost can spike with volume',
      'Not a full sequencing/outbound platform',
    ],
    recentChanges: [
      { text: 'New AI writing templates', daysAgo: 7 },
      { text: 'Credit packs updated', daysAgo: 18 },
    ],
    adCreatives: [
      {
        id: 'c1',
        format: 'Feed',
        copy: 'Stop manual research. Clay enriches and personalizes at scale. No code required. See how top teams use it.',
        firstSeen: '2025-02-19',
        angle: 'AI capability',
        ctrRange: '1.1–1.9%',
      },
      {
        id: 'c2',
        format: 'Feed',
        copy: 'Your data. 50+ integrations. One workflow. Clay turns spreadsheets into personalized outreach in minutes.',
        firstSeen: '2025-02-12',
        angle: 'Integrations',
        ctrRange: '0.9–1.6%',
      },
    ],
    g2Rating: 4.7,
    reviewCount: 1200,
    reviewThemes: {
      positive: [
        { theme: 'Powerful workflows', count: 380 },
        { theme: 'Data flexibility', count: 290 },
        { theme: 'Enrichment quality', count: 210 },
      ],
      negative: [
        { theme: 'Complex for beginners', count: 145 },
        { theme: 'Cost unpredictability', count: 98 },
        { theme: 'No built-in sequencing', count: 87 },
      ],
    },
    sampleReviews: [
      { quote: 'Incredibly powerful but our non-technical reps struggled. We had to build a lot of playbooks.', rating: 4 },
      { quote: 'Credit usage spiked unexpectedly. Great product but watch your usage.', rating: 3 },
    ],
    ourWinRate: 55,
    battleCard: {
      objectionHandlers: [
        { prospectSaid: 'Clay gives us total control over our data.', youSay: 'Clay is great for data workflows. We give you that control plus built-in sequencing, ads, and analytics—so you don’t need to pipe Clay into another tool. One platform for data and execution.' },
        { prospectSaid: 'We need Clay’s integrations.', youSay: 'We have deep integrations too, and we’re built for the full GTM flow. If you’re using Clay to feed a sequencer, we can replace both with a single workflow and better predictability on cost.' },
        { prospectSaid: 'Our team is technical; they love Clay.', youSay: 'Technical users love NEXARA’s flexibility as well. The difference is we also give you execution—sequences, ads, and AI—without stitching multiple tools. Same power, less complexity.' },
        { prospectSaid: 'Clay’s enrichment is best-in-class.', youSay: 'We agree they’re strong on enrichment. We focus on enrichment plus deliverability and execution. Our data quality and bounce rates are top tier, and you get sequencing and ads in one place.' },
      ],
      ourAdvantages: [
        'Full GTM execution: enrichment plus sequencing and ads in one platform; no Clay + sequencer stack.',
        'Predictable pricing; no surprise credit burns.',
        'Easier for non-technical users while still powerful for power users.',
      ],
      theirAdvantages: [
        'Unmatched flexibility for custom data workflows and 50+ providers.',
        'Strong adoption among technical and data-savvy teams.',
      ],
      proofPoints: [
        { quote: 'We moved from Clay + Outreach to just NEXARA. Fewer tools, same quality, better deliverability.', company: 'B2B, 25 reps' },
        { quote: 'Clay was powerful but we needed sequencing too. NEXARA did both and simplified our stack.', company: 'Startup, 6 reps' },
      ],
    },
  },
  {
    id: 'instantly',
    name: 'Instantly',
    website: 'https://instantly.ai',
    lastChecked: '2025-02-26',
    positioningStatement: 'Cold email scale and deliverability without the complexity.',
    targetICP: 'SMB and startups focused on cold email volume.',
    pricingModel: 'Tiered by leads/emails',
    estimatedPrice: '$30–$97+/mo',
    strengths: [
      'Simple cold email at scale',
      'Good deliverability focus',
      'Lower price point',
    ],
    weaknesses: [
      'Limited beyond email (no full GTM)',
      'Less AI and personalization',
      'Smaller feature set for enterprise',
    ],
    recentChanges: [
      { text: 'New warmup plan pricing', daysAgo: 4 },
      { text: 'LinkedIn integration beta', daysAgo: 11 },
    ],
    adCreatives: [
      {
        id: 'i1',
        format: 'Feed',
        copy: 'Send thousands of cold emails without burning your domain. Instantly handles warmup and deliverability. Start free.',
        firstSeen: '2025-02-21',
        angle: 'Price',
        ctrRange: '1.3–2.2%',
      },
      {
        id: 'i2',
        format: 'Story',
        copy: 'Your competitors are scaling cold email. You’re still sending manually. Instantly = scale + deliverability. Try free.',
        firstSeen: '2025-02-14',
        angle: 'Ease of Use',
        ctrRange: '1.0–1.7%',
      },
    ],
    g2Rating: 4.6,
    reviewCount: 2100,
    reviewThemes: {
      positive: [
        { theme: 'Easy to use', count: 520 },
        { theme: 'Good deliverability', count: 410 },
        { theme: 'Affordable', count: 380 },
      ],
      negative: [
        { theme: 'Limited to email only', count: 195 },
        { theme: 'Support could be better', count: 142 },
        { theme: 'Fewer advanced features', count: 98 },
      ],
    },
    sampleReviews: [
      { quote: 'Does one thing well — cold email. When we wanted LinkedIn and ads we had to add more tools.', rating: 4 },
      { quote: 'Support is slow. Product is simple and deliverability is solid.', rating: 3 },
    ],
    ourWinRate: 68,
    battleCard: {
      objectionHandlers: [
        { prospectSaid: 'Instantly is cheaper and we only need email.', youSay: 'If cold email is the only channel forever, Instantly can work. Most teams add LinkedIn, ads, and analytics—then they’re juggling multiple tools. We give you email plus the rest in one place at a predictable price.' },
        { prospectSaid: 'We’re happy with our deliverability on Instantly.', youSay: 'Deliverability is table stakes. Where we go further is full GTM: sequences, ads, and competitive intel in one platform. As you scale, one stack beats email-only plus other point tools.' },
        { prospectSaid: 'Instantly is simpler.', youSay: 'We’re built to be simple too—quick setup, clear UI. The difference is we grow with you: when you need multi-channel, AI, and reporting, it’s already there. No re-platforming later.' },
        { prospectSaid: 'We need to keep cost low.', youSay: 'Our pricing is designed for teams that outgrow email-only. You get more channels and capabilities without the cost of Instantly plus a sequencer plus an ad tool. We can show a TCO comparison.' },
      ],
      ourAdvantages: [
        'Full GTM OS: email, LinkedIn, ads, and analytics—not just cold email.',
        'AI and competitive intel built in; Instantly stays email-focused.',
        'One platform to scale; no adding tools as you grow.',
      ],
      theirAdvantages: [
        'Very low cost for email-only use cases.',
        'Simple positioning and fast time-to-value for pure cold email.',
      ],
      proofPoints: [
        { quote: 'We outgrew Instantly when we added LinkedIn and ads. NEXARA replaced three tools.', company: 'SMB SaaS' },
        { quote: 'Better deliverability and way more features than Instantly. Worth the step up.', company: 'Agency, 15 users' },
      ],
    },
  },
];

// Dimensions for radar chart (order matches data keys)
export const POSITIONING_DIMENSIONS = [
  'Data Quality',
  'Ease of Use',
  'AI Capability',
  'Price/Value',
  'Support',
  'Integrations',
];

// Keys used in score objects (camelCase for chart dataKeys)
export const POSITIONING_KEYS = [
  'dataQuality',
  'easeOfUse',
  'aiCapability',
  'priceValue',
  'support',
  'integrations',
];

// Scores 1–10 per dimension. Includes NEXARA + each competitor.
export const POSITIONING_SCORES = {
  nexara: {
    name: 'NEXARA',
    dataQuality: 9,
    easeOfUse: 7,
    aiCapability: 9,
    priceValue: 8,
    support: 8,
    integrations: 9,
  },
  apollo: {
    name: 'Apollo.io',
    dataQuality: 6,
    easeOfUse: 8,
    aiCapability: 5,
    priceValue: 7,
    support: 6,
    integrations: 7,
  },
  hubspot: {
    name: 'HubSpot',
    dataQuality: 7,
    easeOfUse: 6,
    aiCapability: 7,
    priceValue: 5,
    support: 8,
    integrations: 9,
  },
  clay: {
    name: 'Clay',
    dataQuality: 8,
    easeOfUse: 5,
    aiCapability: 8,
    priceValue: 6,
    support: 6,
    integrations: 9,
  },
  instantly: {
    name: 'Instantly',
    dataQuality: 7,
    easeOfUse: 8,
    aiCapability: 4,
    priceValue: 9,
    support: 5,
    integrations: 5,
  },
};
