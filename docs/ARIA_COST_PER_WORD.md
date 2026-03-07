# NEXARA — ARIA Cost per Word (Input & Output)

**Audience:** Customers, CS, Finance, anyone who wants to know "how much does ARIA cost per word?"

---

## 1. How ARIA Is Priced (In the App)

In NEXARA you pay with **credits**, not per word. Your plan includes a set number of credits each month; each ARIA action (question, content generation, report) uses some credits. So the **cost of using ARIA** for you = your plan price (which covers included credits) + any top-up if you go over.

This document answers: **what is the underlying cost in words?** — so you can reason in "words in" and "words out" instead of tokens.

---

## 2. Where the Cost Comes From

ARIA runs on **Claude** (Anthropic). Billing from the provider is **per token**, not per word. We use a standard conversion:

- **1 token ≈ 0.75 words** (for typical English text).

So 1,000 words ≈ about **1,333 tokens**.

---

## 3. Cost per Word (Input vs Output)

We use **Claude Sonnet 4** (e.g. `claude-sonnet-4-20250514`). Example Anthropic pricing (check [Anthropic pricing](https://www.anthropic.com/pricing) for current rates):

| | Per 1 million tokens | Per 1,000 words (≈1,333 tokens) |
|--|------------------------|----------------------------------|
| **Input** (what you send to ARIA)  | $3.00  | **≈ $0.004** |
| **Output** (what ARIA writes back) | $15.00 | **≈ $0.02**  |

So:

- **Input:** about **$0.004 per 1,000 words** (half a cent per 1,000 words).
- **Output:** about **$0.02 per 1,000 words** (2 cents per 1,000 words).

Output costs more than input because generating text is more compute-intensive.

---

## 4. Examples in Words

| Use case | Words in (approx) | Words out (approx) | Approx. cost (USD) |
|----------|--------------------|---------------------|---------------------|
| Short question ("What's our top channel?") | ~50 | ~100 | ~$0.002 |
| One email or short post | ~200 | ~150 | ~$0.004 |
| Long reply or content piece | ~500 | ~400 | ~$0.01 |
| Full report or weekly brief | ~1,500 | ~2,000 | ~$0.04 |
| Campaign creation with ARIA (full flow) | ~3,000+ | ~1,500+ | ~$0.08–0.15 |

These are **underlying API-style costs** for illustration. Your real experience is in **credits** (see [USAGE_ANALYTICS_AND_COSTING_NON_TECHNICAL.md](USAGE_ANALYTICS_AND_COSTING_NON_TECHNICAL.md)).

---

## 5. Quick Reference

| Question | Answer |
|----------|--------|
| **Cost of using ARIA (for me)?** | Your plan + credits. You don't pay per word in the app. |
| **Cost per 1,000 words INPUT?** | About **$0.004** (underlying model cost). |
| **Cost per 1,000 words OUTPUT?** | About **$0.02** (underlying model cost). |
| **Why "words" not "tokens"?** | Billing is per token; we use ~0.75 words per token so you can think in words. |
| **Where do these numbers come from?** | Anthropic's Claude Sonnet 4 pricing; confirm at [anthropic.com/pricing](https://www.anthropic.com/pricing). |

---

## 6. For Your Team (Talking to Customers)

- **"How much does ARIA cost?"** → "You pay with credits on your plan. In terms of the AI itself: input is about half a cent per 1,000 words, output about 2 cents per 1,000 words."
- **"So a 500-word question and 200-word answer?"** → "Roughly about one cent or less in underlying cost; in the app that's a small number of credits."
- **"Why is output more expensive?"** → "Generating text uses more compute than reading it, so the provider charges more for output tokens."

Exact credit rules and top-up prices are in the product and in [PRICING_AND_MARGINS.md](PRICING_AND_MARGINS.md).
