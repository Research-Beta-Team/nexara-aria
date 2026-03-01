import { useState, useMemo } from 'react';
import { C, F, R, S, btn } from '../tokens';
import useToast from '../hooks/useToast';
import EscalationCard from '../components/escalation/EscalationCard';
import EscalationFilterBar from '../components/escalation/FilterBar';
import BulkActionBar from '../components/escalation/BulkActionBar';

/* ─── Mock data ───────────────────────────────────────────── */
const INIT_ACTIVE = [
  {
    id: 'e1',
    title: 'Campaign budget 92% consumed — 19 days remaining',
    severity: 'High',
    agentType: 'Budget Guardian',
    campaign: 'Acme VN CFO Q2',
    client: 'Acme VN',
    confidence: 87,
    timing: 'Respond within 4 hrs',
    status: 'pending',
    situation: 'The Acme VN CFO Q2 campaign has consumed $7,820 of its $8,500 budget. At the current burn rate ($410/day), the budget will be exhausted by Feb 20 — 19 days before the campaign end date of March 10.',
    recommendation: 'Approve a $2,000 budget top-up to maintain campaign momentum. Alternatively, pause LinkedIn ads (highest CPL at $68) and reallocate spend to email outreach.',
    reasoning: `Budget analysis (last 14 days):\n• LinkedIn Ads: $3,200 spent, 12 MQLs, CPL $267\n• Email Outreach: $1,800 spent, 8 MQLs, CPL $225\n• Content Promotion: $1,600 spent, 4 MQLs, CPL $400\n\nProjection without intervention:\n→ LinkedIn ads pause on Feb 20 (budget zero)\n→ 4-6 MQLs lost in final campaign phase\n→ Target of 15 MQLs at risk (currently 24/15 — exceeding target)\n\nRecommended action: Top-up $2,000 for LinkedIn only.`,
  },
  {
    id: 'e2',
    title: 'Prospect responded with removal request and legal threat',
    severity: 'High',
    agentType: 'Reply Handler',
    campaign: 'Acme VN CFO Q2',
    client: 'Acme VN',
    confidence: 99,
    timing: 'Immediate action required',
    status: 'pending',
    situation: 'CFO Nguyen Minh Duc at Dragon Capital responded to touch-3 email with: "Remove me from your list immediately. If I receive another email I will report this to my legal team." Dragon Capital is a top-tier prospect (lead score 94).',
    recommendation: 'Immediately suppress Nguyen Minh Duc and all Dragon Capital contacts from outreach. Send a one-time apology email from account owner. Do not remove from CRM — flag as "Do Not Contact" with date and reason.',
    reasoning: `Compliance risk assessment: CRITICAL\n\n• Legal threat received — immediate suppression mandatory\n• Vietnam Personal Data Protection Decree (PDPD) Article 11: opt-out must be honored within 24 hours\n• Dragon Capital has 3 other active contacts in pipeline — suppression should be targeted to this individual only unless company-wide opt-out is explicitly stated\n\nRecommended template:\nSubject: Removing you from our list — apology\n"Hi [name], I've removed you from all NEXARA communications immediately. I apologize for the inconvenience..."`,
  },
  {
    id: 'e3',
    title: 'A/B test result statistically inconclusive after 12 days',
    severity: 'Medium',
    agentType: 'Ad Composer',
    campaign: 'APAC Brand Awareness',
    client: 'SEA Corp',
    confidence: 71,
    timing: 'Respond within 48 hrs',
    status: 'pending',
    situation: 'LinkedIn ad variant A ("10× Campaign Velocity") has 2.4% CTR vs variant B ("Let ARIA Execute") at 2.1% CTR. After 4,200 impressions each, the difference is not statistically significant at 95% confidence (p=0.18). Campaign needs a winner to scale budget.',
    recommendation: 'Run a third variant C combining elements of both ("10× velocity, executed by ARIA") for 3 more days. If no winner by Day 15, default to variant A as frontrunner and scale by 40%.',
    reasoning: `Statistical analysis:\n• Variant A: 101 clicks / 4,200 impressions = 2.405% CTR\n• Variant B: 88 clicks / 4,200 impressions = 2.095% CTR\n• Required significance: p < 0.05 | Current p-value: 0.18\n• Minimum detectable effect at 80% power: 0.5% CTR\n\nOptions ranked by expected outcome:\n1. Variant C (hybrid) — highest upside, 3-day delay\n2. Default to A — conservative, low regret decision\n3. Extend test — requires 2,400 more impressions, 5-day delay`,
  },
  {
    id: 'e4',
    title: 'Prospect replied requesting demo — outside reply handler scope',
    severity: 'Medium',
    agentType: 'Reply Handler',
    campaign: 'SEA Demand Gen',
    client: 'SEA Corp',
    confidence: 85,
    timing: 'Respond within 24 hrs',
    status: 'pending',
    situation: 'Helen Tan, VP People at SEA Tech (lead score 88) replied to touch-2: "This looks interesting. Can someone from your team reach out for a demo?" This is a qualified inbound signal. ARIA\'s reply handler is configured for objection handling only, not demo booking.',
    recommendation: 'Approve ARIA to send a demo scheduling email with Calendly link. Alternatively, assign to human AE for personal outreach within 2 hours.',
    reasoning: `Lead qualification:\n• Helen Tan, VP People, SEA Tech\n• Company: 800 employees, $45M revenue, Series C\n• Lead score: 88 (threshold for demo: 70)\n• Engagement: opened 3/3 emails, clicked product link twice\n\nSLA risk: Demo intent replies should be followed up within 2 hours for optimal conversion. Current time since reply: 47 minutes.\n\nARIA can handle scheduling if approved — estimated booking probability 62% based on historical data.`,
  },
  {
    id: 'e5',
    title: 'Content approval pending 72 hrs — blocking email sequence',
    severity: 'Medium',
    agentType: 'Email Sequencer',
    campaign: 'Acme VN CFO Q2',
    client: 'Acme VN',
    confidence: 78,
    timing: 'Respond within 24 hrs',
    status: 'pending',
    situation: 'Email touch-4 "CFO Case Study" has been in "Pending Approval" status for 72 hours. This is blocking the email sequence from advancing for 47 prospects who are due for touch-4. Without approval, the sequence will fall behind cadence.',
    recommendation: 'Approve touch-4 email as-is (brand score 91, no compliance issues detected). Or, send a reminder to the approver. ARIA can auto-approve if no response in 24 hours if you grant standing approval for brand score >85.',
    reasoning: `Content review:\n• Brand score: 91/100 ✓\n• Compliance check: passed ✓\n• Spam score: 2.1/10 (low) ✓\n• Personalization tokens: validated ✓\n\nImpact of continued delay:\n• 47 prospects overdue for touch-4\n• Average sequence completion drops 18% per day of delay\n• Estimated MQL loss: 2–3 if not sent by tomorrow`,
  },
  {
    id: 'e6',
    title: 'Weekly performance report ready — exceeds KPI targets',
    severity: 'Low',
    agentType: 'Insight Engine',
    campaign: 'All Campaigns',
    client: 'All Clients',
    confidence: 96,
    timing: 'No urgency',
    status: 'pending',
    situation: 'Weekly performance digest for W7 2025 is ready. All 3 active campaigns are tracking above target. Acme VN CFO Q2: 24 MQLs vs 15 target (160%). APAC Brand: 34% branded search growth vs 40% target (85%). SEA Demand Gen: 8 SQLs vs 10 target (80%).',
    recommendation: 'Approve and deliver to all campaign stakeholders. ARIA will send via the standard client digest email template.',
    reasoning: `Digest contents:\n• Executive summary: 3 campaigns, all green\n• Highlight: Acme VN CFO Q2 exceeding MQL target by 60%\n• Watch: SEA Demand Gen SQL rate trailing — recommend ICP refinement\n• Budget: $31,200 of $42,000 total budget consumed (74%)\n\nDelivery list: 4 client contacts + 2 internal stakeholders`,
  },
];

const INIT_RESOLVED = [
  {
    id: 'r1',
    title: 'LinkedIn ad spend cap reached — pause or increase?',
    severity: 'High',
    agentType: 'Budget Guardian',
    campaign: 'APAC Brand Awareness',
    client: 'SEA Corp',
    confidence: 82,
    timing: 'Resolved',
    status: 'approved',
    resolvedAt: 'Feb 10 · 2:14 PM',
    situation: 'LinkedIn spend cap of $4,000 reached.',
    recommendation: 'Increase cap by $1,500.',
    reasoning: 'ROAS trending positive.',
  },
  {
    id: 'r2',
    title: 'Competitor ad copy detected — update messaging?',
    severity: 'Medium',
    agentType: 'Brand Enforcer',
    campaign: 'APAC Brand Awareness',
    client: 'SEA Corp',
    confidence: 74,
    timing: 'Resolved',
    status: 'denied',
    resolvedAt: 'Feb 8 · 11:42 AM',
    situation: 'Competitor "VeloGTM" launched similar messaging.',
    recommendation: 'Update headline copy to differentiate.',
    reasoning: 'Brand differentiation analysis shows 67% message overlap.',
  },
  {
    id: 'r3',
    title: 'ICP model update — new firmographic signals identified',
    severity: 'Low',
    agentType: 'ICP Analyzer',
    campaign: 'Acme VN CFO Q2',
    client: 'Acme VN',
    confidence: 88,
    timing: 'Resolved',
    status: 'approved',
    resolvedAt: 'Feb 6 · 9:05 AM',
    situation: 'Manufacturing firms with recent ERP RFPs show 3× conversion rate.',
    recommendation: 'Add "recent ERP RFP" as a positive ICP signal.',
    reasoning: '14-day data analysis: 6/8 converted leads triggered this signal.',
  },
];

/* ─── Main page ───────────────────────────────────────────── */
export default function Escalations() {
  const toast = useToast();

  const [active, setActive]       = useState(INIT_ACTIVE);
  const [resolved, setResolved]   = useState(INIT_RESOLVED);
  const [tab, setTab]             = useState('active');   // 'active' | 'history'
  const [selected, setSelected]   = useState(new Set());
  const [filters, setFilters]     = useState({ severity: null, agentType: null, status: null, client: null });

  /* Filter logic */
  const allEscalations = tab === 'active' ? active : resolved;

  const filtered = useMemo(() => allEscalations.filter((e) => {
    if (filters.severity  && e.severity  !== filters.severity)  return false;
    if (filters.agentType && e.agentType !== filters.agentType) return false;
    if (filters.status    && e.status    !== filters.status.toLowerCase()) return false;
    return true;
  }), [allEscalations, filters]);

  /* Selection helpers */
  const toggleSelect = (id) => setSelected((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const clearSelection = () => setSelected(new Set());

  /* Single approve/deny */
  const handleApprove = (id) => {
    const item = active.find((e) => e.id === id);
    setActive((prev) => prev.filter((e) => e.id !== id));
    if (item) setResolved((prev) => [...prev, { ...item, status: 'approved', resolvedAt: 'Just now' }]);
    toast.success(`Escalation approved`);
    setSelected((prev) => { const n = new Set(prev); n.delete(id); return n; });
  };

  const handleDeny = (id) => {
    const item = active.find((e) => e.id === id);
    setActive((prev) => prev.filter((e) => e.id !== id));
    if (item) setResolved((prev) => [...prev, { ...item, status: 'denied', resolvedAt: 'Just now' }]);
    toast.info(`Escalation denied`);
    setSelected((prev) => { const n = new Set(prev); n.delete(id); return n; });
  };

  const handleSendAdvisor = (esc) => {
    toast.success(`Thread created in Query Manager: "${esc.title}"`);
  };

  /* Bulk actions */
  const handleApproveAll = () => {
    const ids = [...selected];
    ids.forEach((id) => {
      const item = active.find((e) => e.id === id);
      if (item) {
        setActive((prev) => prev.filter((e) => e.id !== id));
        setResolved((prev) => [...prev, { ...item, status: 'approved', resolvedAt: 'Just now' }]);
      }
    });
    toast.success(`${ids.length} escalation${ids.length > 1 ? 's' : ''} approved`);
    clearSelection();
  };

  const handleDenyAll = () => {
    const ids = [...selected];
    ids.forEach((id) => {
      const item = active.find((e) => e.id === id);
      if (item) {
        setActive((prev) => prev.filter((e) => e.id !== id));
        setResolved((prev) => [...prev, { ...item, status: 'denied', resolvedAt: 'Just now' }]);
      }
    });
    toast.info(`${ids.length} escalation${ids.length > 1 ? 's' : ''} denied`);
    clearSelection();
  };

  const handleBulkAdvisor = () => {
    toast.success(`${selected.size} escalation${selected.size > 1 ? 's' : ''} sent to Advisor`);
    clearSelection();
  };

  const updateFilters = (patch) => setFilters((prev) => ({ ...prev, ...patch }));

  const highCount   = active.filter((e) => e.severity === 'High').length;
  const medCount    = active.filter((e) => e.severity === 'Medium').length;

  return (
    <>
      <style>{`
        @keyframes escFade { from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div style={{ minHeight: '100vh', backgroundColor: C.bg, padding: `${S[6]} ${S[6]} ${S[8]}` }}>

        {/* Page header */}
        <div style={{ marginBottom: S[5] }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '24px', fontWeight: 800, color: C.textPrimary, margin: 0, letterSpacing: '-0.03em' }}>
                Escalation Queue
              </h1>
              <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textSecondary, margin: `${S[1]} 0 0` }}>
                ARIA is requesting human decisions on {active.length} item{active.length !== 1 ? 's' : ''}.
                {highCount > 0 && <span style={{ color: '#EF4444' }}> {highCount} high severity.</span>}
                {medCount > 0 && <span style={{ color: C.amber }}> {medCount} medium.</span>}
              </p>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: S[4] }}>
              {[
                { label: 'Pending',  value: active.length,   color: C.amber },
                { label: 'Resolved', value: resolved.length, color: C.primary },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: F.mono, fontSize: '22px', fontWeight: 800, color }}>{value}</div>
                  <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${C.border}`, marginBottom: S[5] }}>
          {[
            { id: 'active',  label: `Active (${active.length})` },
            { id: 'history', label: `History (${resolved.length})` },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => { setTab(id); clearSelection(); }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: F.body, fontSize: '13px', fontWeight: tab === id ? 700 : 400,
                color: tab === id ? C.textPrimary : C.textMuted,
                padding: `${S[3]} ${S[5]}`,
                borderBottom: `2px solid ${tab === id ? C.primary : 'transparent'}`,
                transition: 'all 0.15s ease',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Filter bar */}
        <div style={{ marginBottom: S[4] }}>
          <EscalationFilterBar
            escalations={allEscalations}
            filters={filters}
            onChange={updateFilters}
          />
        </div>

        {/* Card list */}
        {filtered.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: `${S[16]} 0`, gap: S[3] }}>
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <circle cx="22" cy="22" r="19" stroke={C.textMuted} strokeWidth="1.5"/>
              <path d="M22 14v8M22 25v2" stroke={C.textMuted} strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <div style={{ fontFamily: F.body, fontSize: '14px', color: C.textMuted }}>
              {tab === 'active' ? 'No pending escalations — ARIA is running autonomously' : 'No resolved escalations yet'}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: S[4], animation: 'escFade 0.2s ease' }}>
            {filtered.map((esc) => (
              <EscalationCard
                key={esc.id}
                escalation={esc}
                selected={selected.has(esc.id)}
                onSelect={toggleSelect}
                onApprove={handleApprove}
                onDeny={handleDeny}
                onSendAdvisor={handleSendAdvisor}
                resolved={tab === 'history'}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <BulkActionBar
          count={selected.size}
          onApproveAll={handleApproveAll}
          onDenyAll={handleDenyAll}
          onSendAdvisor={handleBulkAdvisor}
          onClear={clearSelection}
        />
      )}
    </>
  );
}
