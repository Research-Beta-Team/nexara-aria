/**
 * Brief output: Header (badge, title, date, status); Strategic Overview, ChannelBudgetModel, KPIProjectionsCard, Messaging Framework, ContentChecklist; footer Approve / Save draft / Start over.
 */
import { C, F, R, S, btn } from '../../tokens';
import ChannelBudgetModel from './ChannelBudgetModel';
import KPIProjectionsCard from './KPIProjectionsCard';
import ContentChecklist from './ContentChecklist';

export default function BriefOutputDocument({
  brief,
  onApprove,
  onSaveDraft,
  onStartOver,
  onRecalculateBudget,
  onChecklistToggle,
  onChecklistGenerate,
}) {
  if (!brief) return null;
  const kpi = brief.kpiProjections || {};
  const msg = brief.messagingFramework || {};

  return (
    <div
      style={{
        maxWidth: 800,
        margin: '0 auto',
        padding: S[6],
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: R.card,
      }}
    >
      <header style={{ marginBottom: S[6], paddingBottom: S[4], borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S[3], marginBottom: S[2] }}>
          <span
            style={{
              fontFamily: F.mono,
              fontSize: '11px',
              fontWeight: 700,
              padding: `2px ${S[2]}`,
              borderRadius: R.pill,
              backgroundColor: C.primaryGlow,
              color: C.primary,
            }}
          >
            {brief.status || 'draft'}
          </span>
          <span style={{ fontFamily: F.body, fontSize: '12px', color: C.textMuted }}>
            {brief.createdAt ? new Date(brief.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' }) : ''}
          </span>
        </div>
        <h1 style={{ fontFamily: F.display, fontSize: '22px', fontWeight: 700, color: C.textPrimary, margin: 0 }}>
          {brief.title}
        </h1>
        {brief.goal && (
          <p style={{ fontFamily: F.body, fontSize: '14px', color: C.textSecondary, marginTop: S[2], marginBottom: 0 }}>
            {brief.goal}
          </p>
        )}
      </header>

      <section style={{ marginBottom: S[6] }}>
        <h2 style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary, margin: `0 0 ${S[3]} 0` }}>
          Strategic overview
        </h2>
        <p style={{ fontFamily: F.body, fontSize: '14px', lineHeight: 1.6, color: C.textPrimary }}>
          {brief.strategicOverview || '—'}
        </p>
      </section>

      <section style={{ marginBottom: S[6] }}>
        <ChannelBudgetModel channels={brief.channels || []} onRecalculate={onRecalculateBudget} />
      </section>

      <section style={{ marginBottom: S[6] }}>
        <KPIProjectionsCard
          mqls={kpi.mqls}
          pipeline={kpi.pipeline}
          cac={kpi.cac}
          confidencePct={kpi.confidencePct}
          basis={kpi.basis}
        />
      </section>

      <section style={{ marginBottom: S[6] }}>
        <h2 style={{ fontFamily: F.display, fontSize: '16px', fontWeight: 700, color: C.textPrimary, margin: `0 0 ${S[3]} 0` }}>
          Messaging framework
        </h2>
        <div style={{ padding: S[4], backgroundColor: C.surface2, borderRadius: R.card }}>
          {msg.headline && (
            <div style={{ fontFamily: F.body, fontSize: '14px', fontWeight: 600, color: C.primary, marginBottom: S[3] }}>
              {msg.headline}
            </div>
          )}
          {msg.valueProps?.length > 0 && (
            <ul style={{ margin: `0 0 ${S[3]} 0`, paddingLeft: S[5], color: C.textPrimary, fontSize: '13px' }}>
              {msg.valueProps.map((v, i) => (
                <li key={i}>{v}</li>
              ))}
            </ul>
          )}
          {msg.proofPoints?.length > 0 && (
            <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textSecondary, marginBottom: S[2] }}>
              Proof: {msg.proofPoints.join(' · ')}
            </div>
          )}
          {msg.cta && (
            <div style={{ fontFamily: F.body, fontSize: '13px', fontWeight: 600, color: C.textPrimary }}>
              CTA: {msg.cta}
            </div>
          )}
        </div>
      </section>

      <section style={{ marginBottom: S[6] }}>
        <ContentChecklist
          items={brief.contentChecklist || []}
          onToggle={onChecklistToggle}
          onGenerate={onChecklistGenerate}
        />
      </section>

      <footer style={{ display: 'flex', gap: S[3], flexWrap: 'wrap', paddingTop: S[4], borderTop: `1px solid ${C.border}` }}>
        <button type="button" onClick={onApprove} style={btn.primary}>
          Approve
        </button>
        <button type="button" onClick={onSaveDraft} style={btn.secondary}>
          Save draft
        </button>
        <button type="button" onClick={onStartOver} style={btn.ghost}>
          Start over
        </button>
      </footer>
    </div>
  );
}
