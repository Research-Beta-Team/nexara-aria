// Mock extraction result for Freya Moment onboarding (no API calls in prototype)

export const ARIA_READING_STATES = [
  { text: 'Reading your document...', endMs: 1000 },
  { text: 'Extracting campaign objectives...', endMs: 1800 },
  { text: 'Identifying target audience...', endMs: 2400 },
  { text: 'Detecting channels and budget signals...', endMs: 2900 },
  { text: 'Building your campaign...', endMs: 3000 },
];

export const MOCK_EXTRACTION_RESULT = {
  confidence: 87,
  processing_time: 2.1,
  extracted_fields: [
    { id: 'campaign_name', label: 'Campaign Name', value: 'CFO Vietnam Q1 — Textile Manufacturing', confidence: 94, source: 'Document title + objectives section' },
    { id: 'goal', label: 'Campaign Goal', value: 'Generate 30 demos from CFO-level contacts', confidence: 91, source: 'Section 1: "we need 30 qualified demo calls per month"' },
    { id: 'target_title', label: 'Target Title', value: 'CFO, Finance Director, Head of Finance', confidence: 89, source: 'ICP section: "decision-maker is typically CFO or Finance lead"' },
    { id: 'target_industry', label: 'Target Industry', value: 'Textile Manufacturing, Garment Export', confidence: 96, source: 'Repeated 11 times throughout document' },
    { id: 'geography', label: 'Geography', value: 'Vietnam, Bangladesh, India', confidence: 88, source: 'Market focus section + mentioned 8 times' },
    { id: 'budget', label: 'Monthly Budget', value: '$5,000', confidence: 82, source: 'Budget section: "$5,000 per month for 3 months"' },
    { id: 'timeline', label: 'Timeline', value: '12 weeks starting Q1 2026', confidence: 90, source: 'Project plan section' },
    { id: 'channels', label: 'Channels', value: ['email', 'linkedin', 'meta'], confidence: 76, source: 'Recommended channels table' },
  ],
  unknown_fields: [
    { id: 'ad_creative_direction', label: 'Ad creative direction' },
    { id: 'email_sequence_tone', label: 'Email sequence tone' },
  ],
  aria_commentary: [
    "Detected 'demo calls from CFOs' as your primary goal — setting target to 30 demos/month",
    "Vietnam mentioned 8 times in document — setting as primary geography",
    "Budget of '$5,000' found in section 3 — confirmed monthly allocation",
    "LinkedIn and Email both mentioned in recommended channels section",
    "Meta Ads detected from '$2,000 paid media budget' reference",
    "12-week timeline confirmed from project plan table",
  ],
};
