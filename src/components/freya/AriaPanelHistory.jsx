import { useState, useEffect } from 'react';
import { C, F, R, S, T } from '../../tokens';
import useStore from '../../store/useStore';

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const diffDays = Math.floor((now - d) / 86400000);
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function AriaPanelHistory({
  onSelectChat,
  onNewChat,
  onClose,
}) {
  const folders = useStore((s) => s.freyaFolders) || [];
  const chats = useStore((s) => s.freyaChats) || [];
  const currentChatId = useStore((s) => s.freyaCurrentChatId);
  const addFreyaFolder = useStore((s) => s.addFreyaFolder);
  const removeFreyaChat = useStore((s) => s.removeFreyaChat);
  const moveFreyaChatToFolder = useStore((s) => s.moveFreyaChatToFolder);
  const addToast = useStore((s) => s.addToast);

  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [menuChatId, setMenuChatId] = useState(null);

  useEffect(() => {
    if (!menuChatId) return;
    const close = () => setMenuChatId(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [menuChatId]);

  const chatsByFolder = (folderId) =>
    chats.filter((c) => (folderId == null ? !c.folderId : c.folderId === folderId));

  const handleAddFolder = () => {
    const name = newFolderName.trim() || 'New folder';
    addFreyaFolder(name);
    setNewFolderName('');
    setShowNewFolder(false);
    addToast({ message: `Folder "${name}" created`, type: 'success' });
  };

  const handleRemoveChat = (e, chatId) => {
    e.stopPropagation();
    setMenuChatId(null);
    removeFreyaChat(chatId);
    if (currentChatId === chatId) onNewChat();
    addToast({ message: 'Chat removed', type: 'info' });
  };

  const handleMoveToFolder = (chatId, folderId) => {
    moveFreyaChatToFolder(chatId, folderId);
    setMenuChatId(null);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: C.surface2,
        borderRight: `1px solid ${C.border}`,
      }}
    >
      <div style={{ padding: S[3], borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: F.display, fontSize: '13px', fontWeight: 700, color: C.textPrimary }}>History & projects</span>
        <button
          type="button"
          onClick={onClose}
          style={{ width: '24px', height: '24px', border: 'none', background: 'transparent', color: C.textSecondary, cursor: 'pointer', borderRadius: R.button, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="Close"
        >
          <svg width="12" height="12" viewBox="0 0 14 14"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: S[2], scrollbarWidth: 'thin' }}>
        <button
          type="button"
          onClick={onNewChat}
          style={{
            width: '100%',
            padding: '8px 10px',
            marginBottom: S[2],
            backgroundColor: C.primary,
            color: C.textInverse,
            border: 'none',
            borderRadius: R.button,
            fontFamily: F.body,
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 2v10M3 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          New chat
        </button>

        {/* Project folders */}
        <div style={{ marginBottom: S[3] }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S[1] }}>
            <span style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Project folders</span>
            {!showNewFolder ? (
              <button
                type="button"
                onClick={() => setShowNewFolder(true)}
                style={{ padding: '2px 6px', background: 'transparent', border: 'none', color: C.primary, fontFamily: F.body, fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
              >
                + Add
              </button>
            ) : null}
          </div>
          {showNewFolder && (
            <div style={{ display: 'flex', gap: '6px', marginBottom: S[2] }}>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddFolder(); }}
                placeholder="Folder name"
                style={{ flex: 1, backgroundColor: C.bg, border: `1px solid ${C.border}`, borderRadius: R.input, padding: '6px 8px', fontFamily: F.body, fontSize: '12px', color: C.textPrimary, outline: 'none' }}
              />
              <button type="button" onClick={handleAddFolder} style={{ padding: '6px 10px', backgroundColor: C.primary, color: C.textInverse, border: 'none', borderRadius: R.button, fontFamily: F.body, fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>Add</button>
              <button type="button" onClick={() => { setShowNewFolder(false); setNewFolderName(''); }} style={{ padding: '6px 10px', backgroundColor: C.surface3, color: C.textSecondary, border: 'none', borderRadius: R.button, fontFamily: F.body, fontSize: '11px', cursor: 'pointer' }}>Cancel</button>
            </div>
          )}
          {folders.map((folder) => (
            <div key={folder.id} style={{ marginBottom: S[2] }}>
              <div style={{ fontFamily: F.body, fontSize: '12px', fontWeight: 600, color: C.textSecondary, padding: '4px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="12" height="12" viewBox="0 0 16 16"><path d="M2 3h5l2 2h5v8H2V3Z" fill="none" stroke="currentColor" strokeWidth="1.2"/></svg>
                {folder.name}
              </div>
              {chatsByFolder(folder.id).length === 0 ? (
                <div style={{ fontFamily: F.body, fontSize: '11px', color: C.textMuted, paddingLeft: '18px', paddingTop: '2px' }}>No chats</div>
              ) : (
                <div style={{ paddingLeft: '4px' }}>
                  {chatsByFolder(folder.id).map((chat) => (
                    <ChatRow
                      key={chat.id}
                      chat={chat}
                      isActive={chat.id === currentChatId}
                      onSelect={() => onSelectChat(chat.id)}
                      onRemove={(e) => handleRemoveChat(e, chat.id)}
                      showMenu={menuChatId === chat.id}
                      onToggleMenu={() => setMenuChatId(menuChatId === chat.id ? null : chat.id)}
                      onMoveToFolder={(folderId) => handleMoveToFolder(chat.id, folderId)}
                      folders={folders}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Chats without folder */}
        {chatsByFolder(null).length > 0 && (
          <div>
            <div style={{ fontFamily: F.mono, fontSize: '10px', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: S[1] }}>Recent chats</div>
            {chatsByFolder(null).map((chat) => (
              <ChatRow
                key={chat.id}
                chat={chat}
                isActive={chat.id === currentChatId}
                onSelect={() => onSelectChat(chat.id)}
                onRemove={(e) => handleRemoveChat(e, chat.id)}
                showMenu={menuChatId === chat.id}
                onToggleMenu={() => setMenuChatId(menuChatId === chat.id ? null : chat.id)}
                onMoveToFolder={(folderId) => handleMoveToFolder(chat.id, folderId)}
                folders={folders}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ChatRow({ chat, isActive, onSelect, onRemove, showMenu, onToggleMenu, onMoveToFolder, folders }) {
  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={onSelect}
        onContextMenu={(e) => { e.preventDefault(); onToggleMenu(); }}
        style={{
          width: '100%',
          padding: '6px 8px 6px 24px',
          textAlign: 'left',
          backgroundColor: isActive ? C.primaryGlow : 'transparent',
          border: 'none',
          borderRadius: R.sm,
          cursor: 'pointer',
          borderLeft: isActive ? `3px solid ${C.primary}` : '3px solid transparent',
          transition: T.color,
        }}
      >
        <div style={{ fontFamily: F.body, fontSize: '12px', color: C.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{chat.title}</div>
        <div style={{ fontFamily: F.mono, fontSize: '10px', color: C.textMuted, marginTop: '2px' }}>{formatDate(chat.updatedAt)}</div>
      </button>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onToggleMenu(); }}
        style={{ position: 'absolute', top: '6px', right: '4px', width: '20px', height: '20px', border: 'none', background: 'transparent', color: C.textMuted, cursor: 'pointer', borderRadius: R.sm, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <svg width="12" height="12" viewBox="0 0 14 14"><circle cx="7" cy="3" r="1.2" fill="currentColor"/><circle cx="7" cy="7" r="1.2" fill="currentColor"/><circle cx="7" cy="11" r="1.2" fill="currentColor"/></svg>
      </button>
      {showMenu && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            top: '100%',
            left: '8px',
            right: '8px',
            marginTop: '2px',
            backgroundColor: C.surface3,
            border: `1px solid ${C.border}`,
            borderRadius: R.md,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            zIndex: 10,
            padding: '4px 0',
          }}
        >
          <button type="button" onClick={onRemove} style={{ width: '100%', padding: '6px 10px', textAlign: 'left', border: 'none', background: 'transparent', color: C.red, fontFamily: F.body, fontSize: '11px', cursor: 'pointer' }}>Remove chat</button>
          {folders.length > 0 && (
            <>
              <div style={{ borderTop: `1px solid ${C.border}`, margin: '4px 0' }}/>
              <div style={{ padding: '4px 8px', fontFamily: F.mono, fontSize: '9px', color: C.textMuted, textTransform: 'uppercase' }}>Move to folder</div>
              {folders.map((f) => (
                <button key={f.id} type="button" onClick={() => onMoveToFolder(f.id)} style={{ width: '100%', padding: '6px 10px', textAlign: 'left', border: 'none', background: 'transparent', color: C.textPrimary, fontFamily: F.body, fontSize: '11px', cursor: 'pointer' }}>{f.name}</button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
