# NEXARA — Usage Analytics & Costing (Non-Technical Guide)

**Audience:** Customers, CS, Founders, anyone who wants to understand “how much am I using?” and “what does it cost?” in plain language.

---

## 1. What Is “Usage” in NEXARA?

**Usage** = how much you use the **AI (ARIA)** and AI-powered features.

- Each time you **ask ARIA a question**, **generate content**, **run a report**, or use an **AI-assisted action** (e.g. “draft this email”, “suggest next steps”), that counts as **usage**.
- We measure this in **credits**. Think of credits like **minutes on a phone plan**: your plan includes a set number each month; if you use more, you can buy more (top-up).

**We do not charge extra** for normal use of the app (viewing dashboards, editing campaigns, inviting team members). Extra cost is only when you use **AI / ARIA** beyond your included credits.

---

## 2. What You See: Usage Analytics (Simple View)

In NEXARA you can see:

| What you see | What it means |
|--------------|----------------|
| **Credits used this month** | How many credits you’ve used so far (e.g. 3,200 of 5,000). |
| **Credits remaining** | How many you have left before you need a top-up (e.g. 1,800). |
| **Top actions** | Which actions used the most credits (e.g. “Generate content”, “Ask ARIA”, “Weekly brief”). |
| **Usage by week** | A simple chart: more bars = more usage that week. |
| **Rollover** | On some plans, unused credits can roll to next month (up to a cap). |

You don’t need to know how the system works behind the scenes. You only need: **how much I used** and **how much I have left**.

**Cost of ARIA in words (for reference):** If you want to think in “words in” and “words out”: input costs about **$0.004 per 1,000 words**, output about **$0.02 per 1,000 words** (underlying model cost). In the app you still see and pay in **credits**; see `docs/ARIA_COST_PER_WORD.md` for the full breakdown and examples.

---

## 3. How Usage Becomes Cost (For You)

Your **monthly plan** includes a **number of credits** every month. As long as you stay within that number, your cost is **just your plan price**.

| Plan | Price (monthly, annual) | Credits included each month |
|------|--------------------------|-----------------------------|
| **Starter** | $149/mo (annual) | 5,000 |
| **Growth** | $499/mo (annual) | 25,000 |
| **Scale** | $1,499/mo (annual) | 100,000 |
| **Agency** | $3,999/mo (annual) | 500,000 |

- **If you use fewer credits than included:** You only pay your plan. Any unused credits may roll over to the next month (depending on your plan).
- **If you use more than included:** You need a **top-up**. You buy extra credits in blocks (e.g. per 1,000 credits). The price per 1,000 depends on your plan (roughly **$8–12 per 1,000 credits**).

**Example (Starter):**  
You have 5,000 credits included. This month you use 6,200. You need 1,200 extra. You buy 1,000 for $12 (or 2,000 if you want a buffer). So this month you pay: **plan ($149) + top-up ($12) = $161**.

---

## 4. Rough Cost per Action (So You Can Picture It)

So you can plan, here are **approximate** credit costs per action (these can be refined by product):

| Action | Approx. credits | What it means for cost |
|--------|-----------------|-------------------------|
| Ask ARIA a short question | 1–5 | Very low (e.g. 1–5 of your 5,000). |
| Generate one email or short post | 10–30 | Low. |
| Generate a full content piece or report | 30–80 | Medium. |
| Run “weekly brief” or heavy analysis | 50–150 | Higher; a few of these use a noticeable chunk. |
| Create a campaign with ARIA (full flow) | 50–200 | One full flow might use 50–200 credits. |

So: **light use** (a few questions and one or two content pieces per week) might be **a few hundred credits per month**. **Heavy use** (many reports, lots of content generation, many campaigns with ARIA) can be **thousands per month**. Your **usage analytics** in NEXARA will show you the real numbers.

---

## 5. When Do You Pay More?

- **You only pay more than your plan** when you **go over** your included credits and **buy a top-up**.
- You can set **alerts** (e.g. “Notify me at 80% of my credits”) so you’re not surprised.
- If you often need top-ups, consider **upgrading your plan**: higher plans include more credits and sometimes a **lower price per 1,000** on top-ups.

---

## 6. Summary: Usage Analytics & Costing at a Glance

| Question | Answer (non-technical) |
|----------|-------------------------|
| What is usage? | Use of AI/ARIA: questions, content generation, reports, AI-assisted actions. |
| How do I see it? | In NEXARA: “Credits used”, “Credits remaining”, “Top actions”, and optional usage chart. |
| What does it cost me? | Your plan price covers included credits. Extra credits = top-up (about $8–12 per 1,000, depending on plan). |
| How do I control cost? | Watch usage in the app; set alerts; upgrade the plan if you often need more credits. |
| Do I need to understand “tokens” or “API”? | No. You only need “credits used” and “credits remaining.” |

---

## 7. For Your Team (Talking to Customers)

- **“How much did we use?”** → Show them **Credits used this month** and **Credits remaining**.
- **“Why did we run out?”** → Show **Top actions** (e.g. “Generate content” and “Weekly brief” used the most).
- **“What will we pay?”** → Plan price + (extra blocks of 1,000 credits × price per 1,000) if they went over.
- **“How do we use less?”** → Use ARIA for shorter, focused tasks; generate content in batches; use non-AI features where possible.

This document is for **understanding and communication**. Exact credit rules and top-up prices are in your plan and in the product.
