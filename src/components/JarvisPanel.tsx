'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { cls } from '@/lib/sovereign-cls';
import type {
  JarvisChatMessage,
  JarvisCommand,
  JarvisNote,
  JarvisDocument,
  JarvisState,
} from '@/lib/jarvisEngine';

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

type Tab = 'chat' | 'commands' | 'notes' | 'docs' | 'setup';

const TABS: { id: Tab; label: string }[] = [
  { id: 'chat', label: 'Chat' },
  { id: 'commands', label: 'Commands' },
  { id: 'notes', label: 'Notes' },
  { id: 'docs', label: 'Docs' },
  { id: 'setup', label: 'Setup' },
];

const ACTION_COLORS: Record<string, string> = {
  chat: '#00d4ff',
  note: '#8b5cf6',
  command: '#f59e0b',
  'tab-switch': '#3b82f6',
  'tab-open': '#10b981',
  'tab-close': '#ef4444',
  'open-url': '#3b82f6',
  'create-pdf': '#ec4899',
  screenshot: '#06b6d4',
  'capture-text': '#a78bfa',
  search: '#f97316',
  system: '#6b7280',
};

const DOC_ICONS: Record<string, string> = {
  pdf: '📄',
  text: '📝',
  markdown: '📋',
  html: '🌐',
  screenshot: '📸',
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function JarvisPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [state, setState] = useState<JarvisState | null>(null);
  const [connected, setConnected] = useState(false);

  // Chat
  const [messages, setMessages] = useState<JarvisChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Commands
  const [commands, setCommands] = useState<JarvisCommand[]>([]);

  // Notes
  const [notes, setNotes] = useState<JarvisNote[]>([]);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteSearch, setNoteSearch] = useState('');

  // Documents
  const [documents, setDocuments] = useState<JarvisDocument[]>([]);

  // ─── Data Fetching ──────────────────────────────────────────────────

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await fetch('/api/jarvis?action=dashboard');
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setState(data.state);
      setMessages(data.chatHistory ?? []);
      setCommands(data.recentCommands ?? []);
      setNotes(data.recentNotes ?? []);
      setDocuments(data.recentDocuments ?? []);
      setConnected(true);
    } catch {
      setConnected(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
    const iv = setInterval(fetchDashboard, 5000);
    return () => clearInterval(iv);
  }, [fetchDashboard]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ─── Chat ───────────────────────────────────────────────────────────

  const sendMessage = useCallback(async () => {
    const text = chatInput.trim();
    if (!text || sending) return;
    setSending(true);
    setChatInput('');
    try {
      const res = await fetch('/api/jarvis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'chat', message: text }),
      });
      if (res.ok) await fetchDashboard();
    } finally {
      setSending(false);
    }
  }, [chatInput, sending, fetchDashboard]);

  // ─── Notes Actions ──────────────────────────────────────────────────

  const createNote = useCallback(async () => {
    if (!noteTitle.trim()) return;
    await fetch('/api/jarvis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'createNote',
        title: noteTitle.trim(),
        content: noteContent.trim(),
      }),
    });
    setNoteTitle('');
    setNoteContent('');
    fetchDashboard();
  }, [noteTitle, noteContent, fetchDashboard]);

  const togglePin = useCallback(
    async (id: string, pinned: boolean) => {
      await fetch('/api/jarvis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateNote', id, pinned: !pinned }),
      });
      fetchDashboard();
    },
    [fetchDashboard],
  );

  const removeNote = useCallback(
    async (id: string) => {
      await fetch('/api/jarvis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deleteNote', id }),
      });
      fetchDashboard();
    },
    [fetchDashboard],
  );

  // ─── Filtered Notes ─────────────────────────────────────────────────

  const filteredNotes = noteSearch
    ? notes.filter(
        (n) =>
          n.title.toLowerCase().includes(noteSearch.toLowerCase()) ||
          n.content.toLowerCase().includes(noteSearch.toLowerCase()),
      )
    : notes;

  // ─── Render ─────────────────────────────────────────────────────────

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ background: '#0a0a0f', color: '#e0e0e0' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold tracking-wider" style={{ color: '#00d4ff' }}>
            𓂀 JARVISIUS
          </span>
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: connected ? '#10b981' : '#ef4444' }}
          />
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {connected ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
          v{state?.version ?? '1.0.0'}
        </span>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 px-3 py-2"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={cls(
              'px-3 py-1.5 rounded text-xs font-medium transition-colors',
              activeTab === t.id ? 'text-white' : 'hover:text-white',
            )}
            style={{
              background: activeTab === t.id ? 'rgba(0,212,255,0.15)' : 'transparent',
              color: activeTab === t.id ? '#00d4ff' : 'rgba(255,255,255,0.5)',
              border:
                activeTab === t.id
                  ? '1px solid rgba(0,212,255,0.3)'
                  : '1px solid transparent',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'chat' && (
          <ChatTab
            messages={messages}
            chatInput={chatInput}
            setChatInput={setChatInput}
            sendMessage={sendMessage}
            sending={sending}
            chatEndRef={chatEndRef}
          />
        )}
        {activeTab === 'commands' && <CommandsTab commands={commands} />}
        {activeTab === 'notes' && (
          <NotesTab
            notes={filteredNotes}
            noteTitle={noteTitle}
            setNoteTitle={setNoteTitle}
            noteContent={noteContent}
            setNoteContent={setNoteContent}
            noteSearch={noteSearch}
            setNoteSearch={setNoteSearch}
            createNote={createNote}
            togglePin={togglePin}
            removeNote={removeNote}
          />
        )}
        {activeTab === 'docs' && <DocsTab documents={documents} />}
        {activeTab === 'setup' && <SetupTab />}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

// ─── Chat Tab ─────────────────────────────────────────────────────────────

function ChatTab({
  messages,
  chatInput,
  setChatInput,
  sendMessage,
  sending,
  chatEndRef,
}: {
  messages: JarvisChatMessage[];
  chatInput: string;
  setChatInput: (v: string) => void;
  sendMessage: () => void;
  sending: boolean;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-12" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <p className="text-lg mb-1">𓂀 JARVISIUS Ready</p>
            <p className="text-xs">Type a message or command (e.g. /help)</p>
          </div>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={cls('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}
          >
            <div
              className="max-w-[80%] rounded-lg px-3 py-2 text-sm"
              style={{
                background:
                  m.role === 'user' ? 'rgba(0,212,255,0.12)' : 'rgba(255,255,255,0.04)',
                border:
                  m.role === 'user'
                    ? '1px solid rgba(0,212,255,0.2)'
                    : '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <p className="text-xs font-medium mb-1" style={{ color: m.role === 'user' ? '#00d4ff' : '#8b5cf6' }}>
                {m.role === 'user' ? 'You' : 'JARVIS'}
              </p>
              <p className="whitespace-pre-wrap" style={{ color: '#e0e0e0' }}>
                {m.content}
              </p>
              <p className="text-right mt-1" style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px' }}>
                {new Date(m.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={chatEndRef as React.RefObject<HTMLDivElement>} />
      </div>

      <div
        className="flex gap-2 p-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Message JARVIS or type /help..."
          className="flex-1 rounded px-3 py-2 text-sm outline-none"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#e0e0e0',
          }}
        />
        <button
          onClick={sendMessage}
          disabled={sending || !chatInput.trim()}
          className="rounded px-4 py-2 text-sm font-medium transition-opacity"
          style={{
            background: 'rgba(0,212,255,0.2)',
            border: '1px solid rgba(0,212,255,0.3)',
            color: '#00d4ff',
            opacity: sending || !chatInput.trim() ? 0.4 : 1,
          }}
        >
          {sending ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

// ─── Commands Tab ─────────────────────────────────────────────────────────

function CommandsTab({ commands }: { commands: JarvisCommand[] }) {
  return (
    <div className="p-4 space-y-2">
      <h3 className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
        Recent Commands
      </h3>
      {commands.length === 0 && (
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
          No commands yet
        </p>
      )}
      {commands.map((cmd) => (
        <div
          key={cmd.id}
          className="flex items-start gap-3 rounded-lg px-3 py-2"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <span className="mt-0.5 text-sm">{cmd.success ? '✅' : '❌'}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-medium px-1.5 py-0.5 rounded"
                style={{
                  background: `${ACTION_COLORS[cmd.type] ?? '#6b7280'}20`,
                  color: ACTION_COLORS[cmd.type] ?? '#6b7280',
                }}
              >
                {cmd.type}
              </span>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
                {new Date(cmd.timestamp).toLocaleTimeString()}
              </span>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
                {cmd.processingMs}ms
              </span>
            </div>
            <p className="text-sm mt-1 truncate" style={{ color: '#e0e0e0' }}>
              {cmd.input}
            </p>
            <p className="text-xs mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {cmd.output}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Notes Tab ────────────────────────────────────────────────────────────

function NotesTab({
  notes,
  noteTitle,
  setNoteTitle,
  noteContent,
  setNoteContent,
  noteSearch,
  setNoteSearch,
  createNote,
  togglePin,
  removeNote,
}: {
  notes: JarvisNote[];
  noteTitle: string;
  setNoteTitle: (v: string) => void;
  noteContent: string;
  setNoteContent: (v: string) => void;
  noteSearch: string;
  setNoteSearch: (v: string) => void;
  createNote: () => void;
  togglePin: (id: string, pinned: boolean) => void;
  removeNote: (id: string) => void;
}) {
  return (
    <div className="p-4 space-y-4">
      {/* Create note form */}
      <div
        className="rounded-lg p-3 space-y-2"
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <input
          type="text"
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
          placeholder="Note title"
          className="w-full rounded px-3 py-1.5 text-sm outline-none"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#e0e0e0',
          }}
        />
        <textarea
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          placeholder="Note content..."
          rows={3}
          className="w-full rounded px-3 py-1.5 text-sm outline-none resize-none"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#e0e0e0',
          }}
        />
        <button
          onClick={createNote}
          disabled={!noteTitle.trim()}
          className="rounded px-3 py-1.5 text-xs font-medium transition-opacity"
          style={{
            background: 'rgba(139,92,246,0.2)',
            border: '1px solid rgba(139,92,246,0.3)',
            color: '#8b5cf6',
            opacity: !noteTitle.trim() ? 0.4 : 1,
          }}
        >
          Create Note
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        value={noteSearch}
        onChange={(e) => setNoteSearch(e.target.value)}
        placeholder="Search notes..."
        className="w-full rounded px-3 py-1.5 text-sm outline-none"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: '#e0e0e0',
        }}
      />

      {/* Notes list */}
      <div className="space-y-2">
        {notes.length === 0 && (
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
            No notes found
          </p>
        )}
        {notes.map((note) => (
          <div
            key={note.id}
            className="rounded-lg px-3 py-2"
            style={{
              background: note.pinned ? 'rgba(139,92,246,0.06)' : 'rgba(255,255,255,0.02)',
              border: note.pinned
                ? '1px solid rgba(139,92,246,0.15)'
                : '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium" style={{ color: '#e0e0e0' }}>
                {note.pinned && '📌 '}
                {note.title}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => togglePin(note.id, note.pinned)}
                  className="text-xs px-1.5 py-0.5 rounded hover:opacity-80"
                  style={{ color: note.pinned ? '#8b5cf6' : 'rgba(255,255,255,0.3)' }}
                >
                  {note.pinned ? 'Unpin' : 'Pin'}
                </button>
                <button
                  onClick={() => removeNote(note.id)}
                  className="text-xs px-1.5 py-0.5 rounded hover:opacity-80"
                  style={{ color: '#ef4444' }}
                >
                  Delete
                </button>
              </div>
            </div>
            <p
              className="text-xs mt-1 line-clamp-2"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              {note.content}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px' }}>
                {new Date(note.createdAt).toLocaleDateString()}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '10px' }}>
                {note.source}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Docs Tab ─────────────────────────────────────────────────────────────

function DocsTab({ documents }: { documents: JarvisDocument[] }) {
  return (
    <div className="p-4 space-y-2">
      <h3 className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
        Captured Documents
      </h3>
      {documents.length === 0 && (
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
          No documents yet
        </p>
      )}
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-start gap-3 rounded-lg px-3 py-2"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <span className="text-lg mt-0.5">{DOC_ICONS[doc.type] ?? '📄'}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: '#e0e0e0' }}>
              {doc.title}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className="text-xs px-1.5 py-0.5 rounded"
                style={{
                  background: 'rgba(0,212,255,0.1)',
                  color: '#00d4ff',
                }}
              >
                {doc.type}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '10px' }}>
                {doc.size} chars
              </span>
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px' }}>
                {new Date(doc.createdAt).toLocaleDateString()}
              </span>
            </div>
            {doc.url && (
              <p className="text-xs mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {doc.url}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Setup Tab ────────────────────────────────────────────────────────────

function SetupTab() {
  const steps = [
    { num: 1, text: 'Clone or download the extensions/jarvis/ directory from this project.' },
    { num: 2, text: 'Open chrome://extensions (Chrome) or edge://extensions (Edge).' },
    { num: 3, text: 'Enable "Developer mode" in the top-right corner.' },
    { num: 4, text: 'Click "Load unpacked" and select the extensions/jarvis/ folder.' },
    { num: 5, text: 'The JARVIS icon will appear in your toolbar — click it to open the side panel.' },
    { num: 6, text: 'JARVIS connects to your running MERIDIAN instance automatically.' },
  ];

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-1" style={{ color: '#00d4ff' }}>
          Chrome / Edge Extension Setup
        </h3>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Install the JARVISIUS browser extension for tab control, page capture, and side-panel chat.
        </p>
      </div>

      <div className="space-y-2">
        {steps.map((s) => (
          <div
            key={s.num}
            className="flex items-start gap-3 rounded-lg px-3 py-2"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <span
              className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: 'rgba(0,212,255,0.15)', color: '#00d4ff' }}
            >
              {s.num}
            </span>
            <p className="text-sm" style={{ color: '#e0e0e0' }}>
              {s.text}
            </p>
          </div>
        ))}
      </div>

      <div
        className="rounded-lg p-3"
        style={{
          background: 'rgba(139,92,246,0.06)',
          border: '1px solid rgba(139,92,246,0.15)',
        }}
      >
        <p className="text-xs" style={{ color: '#8b5cf6' }}>
          Extension source:{' '}
          <code
            className="px-1 py-0.5 rounded"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            extensions/jarvis/
          </code>
        </p>
      </div>
    </div>
  );
}
