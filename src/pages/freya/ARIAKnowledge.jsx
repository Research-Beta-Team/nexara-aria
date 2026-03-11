import { useState, useCallback } from 'react';
import { C, F, R, S, btn } from '../../tokens';
import useToast from '../../hooks/useToast';
import {
  KNOWLEDGE_DOCS,
  FREYA_BELIEFS,
  KNOWLEDGE_CATEGORIES,
  getCategoryLabel,
} from '../../data/freyaKnowledge';
import KnowledgeHealthBar from '../../components/freya/knowledge/KnowledgeHealthBar';
import KnowledgeDocCard from '../../components/freya/knowledge/KnowledgeDocCard';
import KnowledgeFactCard from '../../components/freya/knowledge/KnowledgeFactCard';
import ARIABeliefEditor from '../../components/freya/knowledge/ARIABeliefEditor';
import AddKnowledgeModal from '../../components/freya/knowledge/AddKnowledgeModal';

const initialBeliefs = () => ({
  brand: [...FREYA_BELIEFS.brand],
  icp: [...FREYA_BELIEFS.icp],
  communication: [...FREYA_BELIEFS.communication],
  campaign: [...FREYA_BELIEFS.campaign],
  competitor: [...FREYA_BELIEFS.competitor],
  product: [...FREYA_BELIEFS.product],
});

export default function ARIAKnowledge() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('documents');
  const [docs, setDocs] = useState(KNOWLEDGE_DOCS);
  const [beliefs, setBeliefs] = useState(initialBeliefs);
  const [modalOpen, setModalOpen] = useState(false);
  const [expanded, setExpanded] = useState(() => {
    const o = {};
    KNOWLEDGE_CATEGORIES.forEach((c) => { o[c.id] = (FREYA_BELIEFS[c.id]?.length ?? 0) > 0; });
    return o;
  });
  const [addingFactCategory, setAddingFactCategory] = useState(null);

  const handleAddMissing = useCallback(() => {
    setModalOpen(true);
  }, []);

  const handleDocumentAdded = useCallback((payload) => {
    const id = 'd' + Date.now();
    const uploadDate = new Date().toISOString().slice(0, 10);
    setDocs((prev) => [
      ...prev,
      {
        id,
        fileName: payload.fileName,
        category: payload.category,
        uploadDate,
        status: 'read',
        factsCount: payload.factsCount ?? 5,
        fileType: payload.fileType ?? 'pdf',
      },
    ]);
    toast.success(`Freya has learned from ${payload.fileName}. ${payload.factsCount ?? 5} facts extracted.`);
  }, [toast]);

  const handleFactAdded = useCallback((payload) => {
    const id = 'f' + Date.now();
    setBeliefs((prev) => ({
      ...prev,
      [payload.category]: [
        ...(prev[payload.category] ?? []),
        {
          id,
          text: payload.text,
          source: 'You',
          sourceType: payload.sourceType ?? 'user',
        },
      ],
    }));
    setAddingFactCategory(null);
    toast.success("Freya will remember this from now on.");
  }, []);

  const handleFactAddedInline = useCallback((categoryId, text) => {
    handleFactAdded({ category: categoryId, text, sourceType: 'user' });
  }, [handleFactAdded]);

  const handleEditFact = useCallback((categoryId, updatedFact) => {
    setBeliefs((prev) => ({
      ...prev,
      [categoryId]: (prev[categoryId] ?? []).map((f) =>
        f.id === updatedFact.id ? { ...f, text: updatedFact.text } : f
      ),
    }));
  }, []);

  const handleDeleteFact = useCallback((categoryId, fact) => {
    setBeliefs((prev) => ({
      ...prev,
      [categoryId]: (prev[categoryId] ?? []).filter((f) => f.id !== fact.id),
    }));
  }, []);

  const handleRemoveDoc = useCallback((doc) => {
    setDocs((prev) => prev.filter((d) => d.id !== doc.id));
    toast.info(`Removed ${doc.fileName}`);
  }, [toast]);

  const toggleExpanded = (categoryId) => {
    setExpanded((prev) => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  return (
    <div style={{ padding: S[6], maxWidth: 1200, margin: '0 auto' }}>
      <header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: S[4], marginBottom: S[6], flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: F.display, fontSize: '28px', fontWeight: 700, color: C.textPrimary, margin: 0 }}>
            Freya Knowledge Base
          </h1>
          <p style={{ fontFamily: F.body, fontSize: '14px', color: C.textMuted, margin: `${S[2]} 0 0 0`, maxWidth: 520 }}>
            Everything Freya knows about your business. Upload documents or write facts directly — Freya references this on every interaction.
          </p>
        </div>
        <button type="button" style={btn.primary} onClick={() => setModalOpen(true)}>
          + Add Knowledge
        </button>
      </header>

      <KnowledgeHealthBar onAddMissing={handleAddMissing} />

      <div style={{ marginBottom: S[4] }}>
        <div style={{ display: 'flex', gap: S[2], borderBottom: `1px solid ${C.border}` }}>
          <button
            type="button"
            onClick={() => setActiveTab('documents')}
            style={{
              ...btn.ghost,
              borderBottom: activeTab === 'documents' ? `2px solid ${C.primary}` : '2px solid transparent',
              color: activeTab === 'documents' ? C.primary : C.textSecondary,
              borderRadius: 0,
            }}
          >
            Documents
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('beliefs')}
            style={{
              ...btn.ghost,
              borderBottom: activeTab === 'beliefs' ? `2px solid ${C.primary}` : '2px solid transparent',
              color: activeTab === 'beliefs' ? C.primary : C.textSecondary,
              borderRadius: 0,
            }}
          >
            Freya's Beliefs
          </button>
        </div>
      </div>

      {activeTab === 'documents' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: S[4] }}>
          {docs.map((doc) => (
            <KnowledgeDocCard
              key={doc.id}
              doc={doc}
              onViewFacts={() => setActiveTab('beliefs')}
              onRemove={handleRemoveDoc}
            />
          ))}
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            style={{
              minHeight: 140,
              backgroundColor: 'transparent',
              border: `2px dashed ${C.border}`,
              borderRadius: R.card,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: S[2],
              color: C.textSecondary,
              fontFamily: F.body,
              fontSize: '14px',
              transition: 'border-color 0.2s ease, color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = C.primary;
              e.currentTarget.style.color = C.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = C.border;
              e.currentTarget.style.color = C.textSecondary;
            }}
          >
            <span style={{ fontSize: 28, lineHeight: 1 }}>+</span>
            Upload document
          </button>
        </div>
      )}

      {activeTab === 'beliefs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: S[4] }}>
          {KNOWLEDGE_CATEGORIES.map((cat) => {
            const facts = beliefs[cat.id] ?? [];
            const isExpanded = expanded[cat.id] !== false;
            const isAdding = addingFactCategory === cat.id;
            const hasContent = facts.length > 0 || isAdding;

            return (
              <div key={cat.id} style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: R.card, overflow: 'hidden' }}>
                <button
                  type="button"
                  onClick={() => toggleExpanded(cat.id)}
                  style={{
                    width: '100%',
                    padding: S[4],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: F.body,
                    fontSize: '15px',
                    fontWeight: 600,
                    color: C.textPrimary,
                    textAlign: 'left',
                  }}
                >
                  {getCategoryLabel(cat.id)}
                  <span style={{ fontFamily: F.mono, fontSize: '14px', color: C.textMuted }}>
                    {isExpanded ? '▼' : '▶'}
                  </span>
                </button>
                {isExpanded && (
                  <div style={{ padding: `0 ${S[4]} ${S[4]} ${S[4]}` }}>
                    {facts.length === 0 && !isAdding && (
                      <p style={{ fontFamily: F.body, fontSize: '13px', color: C.textMuted, margin: `0 0 ${S[3]} 0` }}>
                        No beliefs yet for this category.
                      </p>
                    )}
                    {facts.map((fact) => (
                      <div key={fact.id} style={{ marginBottom: S[2] }}>
                        <KnowledgeFactCard
                          fact={fact}
                          onEdit={(updated) => handleEditFact(cat.id, updated)}
                          onDelete={() => handleDeleteFact(cat.id, fact)}
                        />
                      </div>
                    ))}
                    {isAdding && (
                      <ARIABeliefEditor
                        categoryLabel={getCategoryLabel(cat.id)}
                        onSave={(text) => handleFactAddedInline(cat.id, text)}
                        onCancel={() => setAddingFactCategory(null)}
                      />
                    )}
                    {!isAdding && (
                      <button
                        type="button"
                        onClick={() => setAddingFactCategory(cat.id)}
                        style={{
                          ...btn.ghost,
                          color: C.secondary,
                          fontSize: '13px',
                          marginTop: S[2],
                          padding: 0,
                        }}
                      >
                        + Add a rule for Freya to follow
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <AddKnowledgeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onDocumentAdded={handleDocumentAdded}
        onFactAdded={handleFactAdded}
      />
    </div>
  );
}
