/**
 * Freya assistant messages per onboarding step.
 * Used by OnboardingFreyaPanel for tier-based onboarding.
 */

export const FREYA_STEP_MESSAGES = {
  welcome: {
    message:
      "Hi, I'm Freya. I'll walk you through setup — takes about 2 minutes. Pick a plan that fits your team, then optionally connect your website or tools. You can skip any step and change things later in Settings.",
    chips: [
      { id: 'get_started', label: "Let's go" },
      { id: 'skip', label: 'Skip to dashboard' },
    ],
  },
  company: {
    message:
      "Tell me a bit about your team — solo, startup, or agency. I'll recommend the right plan and explain why.",
    chips: [
      { id: 'solo', label: 'Just me' },
      { id: 'startup', label: 'Small team' },
      { id: 'agency', label: 'Growing agency' },
      { id: 'enterprise', label: 'Enterprise' },
    ],
  },
  tier: {
    message:
      "Based on what you chose, I recommend the plan below. You can pick it or browse all plans — you can change later from Billing.",
    chips: [
      { id: 'choose_recommended', label: 'Choose recommended' },
      { id: 'see_all', label: 'See all plans' },
    ],
  },
  connections: {
    message:
      "These connections are optional. Add your website so I can use it for ICP and campaign context, or connect CRM and ads later from Settings.",
    chips: [
      { id: 'finish', label: 'Finish setup' },
      { id: 'skip_all', label: 'Skip all' },
    ],
  },
  done: {
    message:
      "You're all set. Head to the Dashboard or I can help you create your first campaign with a brief and ICP.",
    chips: [
      { id: 'dashboard', label: 'Go to Dashboard' },
      { id: 'first_campaign', label: 'Create campaign with Freya' },
    ],
  },
};

export function getFreyaMessage(stepId) {
  return FREYA_STEP_MESSAGES[stepId] ?? FREYA_STEP_MESSAGES.welcome;
}
