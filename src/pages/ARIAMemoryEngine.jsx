/**
 * ARIA Memory Engine — manage four memory namespaces and test ARIA's recall.
 * Session 1: Persistent memory for brand, audience, campaigns, performance.
 */
import { useState } from 'react';
import useStore from '../store/useStore';
import useToast from '../hooks/useToast';
import { C, F, S } from '../tokens';
import { MEMORY_NAMESPACES } from '../data/memoryMock';
import MemoryHealthScore from '../components/memory/MemoryHealthScore';
import MemoryNamespaceCard from '../components/memory/MemoryNamespaceCard';
import AddMemoryModal from '../components/memory/AddMemoryModal';
import ARIAMemoryChat from '../components/memory/ARIAMemoryChat';

export default function ARIAMemoryEngine() {
  const toast = useToast();
  const ariaMemory = useStore((s) => s.ariaMemory);
  const addMemoryEntry = useStore((s) => s.addMemoryEntry);
  const deleteMemoryEntry = useStore((s) => s.deleteMemoryEntry);
  const updateMemoryEntry = useStore((s) => s.updateMemoryEntry);

  const [modalOpen, setModalOpen] = useState(false);
  const [addNamespace, setAddNamespace] = useState('brand');
  const [editingEntry, setEditingEntry] = useState(null); // { namespaceKey, entry } or null

  const handleAdd = (namespaceKey) => {
    setAddNamespace(namespaceKey);
    setEditingEntry(null);
    setModalOpen(true);
  };

  const handleSave = (namespaceKey, entry) => {
    addMemoryEntry(namespaceKey, entry);
    toast.success('ARIA will use this in all future responses');
    setModalOpen(false);
  };

  const handleEdit = (namespaceKey, entry) => {
    setEditingEntry({ namespaceKey, entry });
    setAddNamespace(namespaceKey);
    setModalOpen(true);
  };

  const handleUpdate = (namespaceKey, id, content) => {
    updateMemoryEntry(namespaceKey, id, content);
    toast.success('Memory updated');
    setModalOpen(false);
    setEditingEntry(null);
  };

  const handleDelete = (namespaceKey, id) => {
    deleteMemoryEntry(namespaceKey, id);
    toast.success('Memory entry removed');
  };

  return (
    <div
      style={{
        minHeight: '100%',
        backgroundColor: C.bg,
        padding: S[6],
        display: 'flex',
        flexDirection: 'column',
        gap: S[6],
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: S[4] }}>
        <div>
          <h1 style={{ fontFamily: F.display, fontSize: '28px', fontWeight: 700, color: C.textPrimary, margin: 0 }}>
            ARIA Memory
          </h1>
          <p style={{ fontFamily: F.body, fontSize: '14px', color: C.textSecondary, margin: `${S[2]} 0 0` }}>
            Everything ARIA knows about your brand, audience, and campaigns
          </p>
        </div>
        <MemoryHealthScore ariaMemory={ariaMemory} />
      </div>

      {/* 2×2 grid of namespace cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: S[5],
        }}
      >
        {MEMORY_NAMESPACES.map((ns) => (
          <MemoryNamespaceCard
            key={ns.id}
            namespaceKey={ns.id}
            entries={ariaMemory?.[ns.id]}
            onAdd={handleAdd}
            onEdit={(entry) => handleEdit(ns.id, entry)}
            onDelete={(id) => handleDelete(ns.id, id)}
          />
        ))}
      </div>

      {/* Test ARIA's Memory — collapsible */}
      <ARIAMemoryChat ariaMemory={ariaMemory} />

      {/* Add Memory Modal */}
      <AddMemoryModal
        open={modalOpen}
        initialNamespace={addNamespace}
        editEntry={editingEntry}
        onClose={() => { setModalOpen(false); setEditingEntry(null); }}
        onSave={handleSave}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
