/**
 * 𓂀 JARVISIUS — Sovereign Intelligence Assistant Engine 𓂀
 *
 * The permanent JARVIS sovereign engine that stores every note, command,
 * PDF, and tab action — forever, attributed to Alfredo.
 *
 * Three faces:
 *   EXTENSION — Chrome/Edge side panel (slides out like Copilot)
 *   ENGINE    — This file: in-memory sovereign store + action processor
 *   DASHBOARD — JarvisPanel.tsx in MERIDIAN
 *
 * Attribution: Alfredo Medina Hernandez | Medina Tech | Dallas, TX
 */

import { sovereignId } from './sovereign-id';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type JarvisActionType =
  | 'chat'
  | 'note'
  | 'command'
  | 'tab-switch'
  | 'tab-open'
  | 'tab-close'
  | 'open-url'
  | 'create-pdf'
  | 'screenshot'
  | 'capture-text'
  | 'search'
  | 'system';

export type JarvisStatus = 'active' | 'idle' | 'processing' | 'error';

export interface JarvisCommand {
  id: string;
  type: JarvisActionType;
  input: string;
  output: string;
  timestamp: string;
  attribution: string;
  metadata: Record<string, unknown>;
  success: boolean;
  processingMs: number;
}

export interface JarvisNote {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  attribution: string;
  source: 'extension' | 'dashboard' | 'voice' | 'auto';
  pinned: boolean;
}

export interface JarvisDocument {
  id: string;
  title: string;
  type: 'pdf' | 'text' | 'markdown' | 'html' | 'screenshot';
  content: string;
  size: number;
  createdAt: string;
  attribution: string;
  source: string;
  url?: string;
  thumbnail?: string;
}

export interface JarvisTabAction {
  id: string;
  action: 'open' | 'close' | 'switch' | 'refresh' | 'navigate';
  tabId?: number;
  url?: string;
  title?: string;
  timestamp: string;
  attribution: string;
}

export interface JarvisPageContext {
  url: string;
  title: string;
  selectedText: string;
  favicon?: string;
  screenshot?: string;
}

export interface JarvisState {
  status: JarvisStatus;
  totalCommands: number;
  totalNotes: number;
  totalDocuments: number;
  totalTabActions: number;
  uptime: number;
  lastActivity: string;
  version: string;
}

export interface JarvisChatMessage {
  id: string;
  role: 'user' | 'jarvis' | 'system';
  content: string;
  timestamp: string;
  actionType?: JarvisActionType;
  metadata?: Record<string, unknown>;
}

// ═══════════════════════════════════════════════════════════════════════════
// SOVEREIGN STORE — Everything persists, everything is attributed
// ═══════════════════════════════════════════════════════════════════════════

const ATTRIBUTION = 'Alfredo Medina Hernandez';
const JARVIS_VERSION = '1.0.0';
const startTime = Date.now();

const commandLog: JarvisCommand[] = [];
const notes: JarvisNote[] = [];
const documents: JarvisDocument[] = [];
const tabActions: JarvisTabAction[] = [];
const chatHistory: JarvisChatMessage[] = [];

// ═══════════════════════════════════════════════════════════════════════════
// CORE ACTIONS
// ═══════════════════════════════════════════════════════════════════════════

function logCommand(
  type: JarvisActionType,
  input: string,
  output: string,
  success: boolean,
  startMs: number,
  metadata: Record<string, unknown> = {},
): JarvisCommand {
  const cmd: JarvisCommand = {
    id: sovereignId(),
    type,
    input,
    output,
    timestamp: new Date().toISOString(),
    attribution: ATTRIBUTION,
    metadata,
    success,
    processingMs: Date.now() - startMs,
  };
  commandLog.push(cmd);
  return cmd;
}

// ─── Chat ────────────────────────────────────────────────────────────────

export function jarvisChat(message: string): JarvisChatMessage {
  const start = Date.now();

  // Store user message
  const userMsg: JarvisChatMessage = {
    id: sovereignId(),
    role: 'user',
    content: message,
    timestamp: new Date().toISOString(),
  };
  chatHistory.push(userMsg);

  // Check for commands
  if (message.startsWith('/')) {
    const result = processCommand(message);
    const jarvisMsg: JarvisChatMessage = {
      id: sovereignId(),
      role: 'jarvis',
      content: result.output,
      timestamp: new Date().toISOString(),
      actionType: result.type,
      metadata: result.metadata,
    };
    chatHistory.push(jarvisMsg);
    return jarvisMsg;
  }

  // Standard chat response
  const response = generateResponse(message);
  const jarvisMsg: JarvisChatMessage = {
    id: sovereignId(),
    role: 'jarvis',
    content: response,
    timestamp: new Date().toISOString(),
    actionType: 'chat',
  };
  chatHistory.push(jarvisMsg);
  logCommand('chat', message, response, true, start);
  return jarvisMsg;
}

function generateResponse(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes('status') || lower.includes('how are you')) {
    const state = getJarvisState();
    return `JARVISIUS online. ${state.totalCommands} commands processed, ${state.totalNotes} notes stored, ${state.totalDocuments} documents captured. All systems nominal, sir.`;
  }

  if (lower.includes('help') || lower.includes('what can you do')) {
    return `Sir, I can:\n• /open <url> — Open any URL in a new tab\n• /tab <number> — Switch to a specific tab\n• /close — Close current tab\n• /note <title> | <content> — Create a note\n• /pdf <title> — Capture current page as document\n• /screenshot — Capture current page screenshot\n• /search <query> — Search the web\n• /notes — List all notes\n• /docs — List all documents\n• /status — System status\n• Or just chat with me naturally.`;
  }

  if (lower.includes('notes') || lower.includes('list notes')) {
    const allNotes = getNotes();
    if (allNotes.length === 0) return 'No notes yet, sir. Create one with /note <title> | <content>';
    return `${allNotes.length} notes:\n${allNotes.slice(0, 10).map(n => `• ${n.title} (${n.createdAt.split('T')[0]})`).join('\n')}`;
  }

  return `Understood, sir. "${message}" — I've logged this. What action would you like me to take?`;
}

// ─── Command Processing ──────────────────────────────────────────────────

function processCommand(input: string): JarvisCommand {
  const start = Date.now();
  const parts = input.slice(1).split(' ');
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1).join(' ');

  switch (cmd) {
    case 'open': {
      let url = args.trim();
      if (!url.startsWith('http')) url = `https://${url}`;
      const tabAction = recordTabAction('open', undefined, url, `Opening: ${url}`);
      return logCommand('open-url', input, `Opening ${url} in new tab.`, true, start, { url, tabActionId: tabAction.id });
    }

    case 'tab': {
      const tabId = parseInt(args.trim(), 10);
      if (isNaN(tabId)) return logCommand('tab-switch', input, 'Invalid tab number, sir.', false, start);
      recordTabAction('switch', tabId, undefined, `Switching to tab ${tabId}`);
      return logCommand('tab-switch', input, `Switching to tab ${tabId}.`, true, start, { tabId });
    }

    case 'close': {
      recordTabAction('close', undefined, undefined, 'Closing current tab');
      return logCommand('tab-close', input, 'Closing current tab.', true, start);
    }

    case 'note': {
      const noteParts = args.split('|').map(s => s.trim());
      const title = noteParts[0] || 'Untitled Note';
      const content = noteParts[1] || noteParts[0] || '';
      const note = createNote(title, content, ['jarvis', 'command'], 'extension');
      return logCommand('note', input, `Note created: "${note.title}" (${note.id})`, true, start, { noteId: note.id });
    }

    case 'pdf':
    case 'doc': {
      const docTitle = args.trim() || 'Captured Document';
      const doc = createDocument(docTitle, 'pdf', 'Document captured via JARVIS command', 'jarvis-command');
      return logCommand('create-pdf', input, `Document created: "${doc.title}" (${doc.id})`, true, start, { documentId: doc.id });
    }

    case 'screenshot': {
      const doc = createDocument('Screenshot ' + new Date().toISOString().split('T')[0], 'screenshot', 'Screenshot captured via JARVIS', 'jarvis-screenshot');
      return logCommand('screenshot', input, `Screenshot captured (${doc.id})`, true, start, { documentId: doc.id });
    }

    case 'search': {
      const query = args.trim();
      if (!query) return logCommand('search', input, 'What would you like me to search for, sir?', false, start);
      const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      recordTabAction('open', undefined, url, `Searching: ${query}`);
      return logCommand('search', input, `Searching for "${query}"...`, true, start, { query, url });
    }

    case 'notes': {
      const allNotes = getNotes();
      const list = allNotes.length === 0
        ? 'No notes yet, sir.'
        : allNotes.slice(0, 20).map(n => `• ${n.title} ${n.pinned ? '📌' : ''}`).join('\n');
      return logCommand('command', input, `${allNotes.length} notes:\n${list}`, true, start);
    }

    case 'docs': {
      const allDocs = getDocuments();
      const list = allDocs.length === 0
        ? 'No documents yet, sir.'
        : allDocs.slice(0, 20).map(d => `• ${d.title} (${d.type})`).join('\n');
      return logCommand('command', input, `${allDocs.length} documents:\n${list}`, true, start);
    }

    case 'status': {
      const state = getJarvisState();
      return logCommand('system', input,
        `JARVISIUS v${JARVIS_VERSION}\nStatus: ${state.status}\nCommands: ${state.totalCommands}\nNotes: ${state.totalNotes}\nDocuments: ${state.totalDocuments}\nTab Actions: ${state.totalTabActions}\nUptime: ${Math.floor(state.uptime / 1000)}s`,
        true, start);
    }

    case 'clear': {
      chatHistory.length = 0;
      return logCommand('system', input, 'Chat history cleared, sir.', true, start);
    }

    default:
      return logCommand('command', input, `Unknown command: /${cmd}. Type /help for available commands.`, false, start);
  }
}

// ─── Notes ───────────────────────────────────────────────────────────────

export function createNote(title: string, content: string, tags: string[] = [], source: JarvisNote['source'] = 'dashboard'): JarvisNote {
  const note: JarvisNote = {
    id: sovereignId(),
    title,
    content,
    tags,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    attribution: ATTRIBUTION,
    source,
    pinned: false,
  };
  notes.push(note);
  return note;
}

export function getNotes(limit = 100): JarvisNote[] {
  return [...notes].reverse().slice(0, limit);
}

export function getNote(id: string): JarvisNote | undefined {
  return notes.find(n => n.id === id);
}

export function updateNote(id: string, updates: Partial<Pick<JarvisNote, 'title' | 'content' | 'tags' | 'pinned'>>): JarvisNote | undefined {
  const note = notes.find(n => n.id === id);
  if (!note) return undefined;
  if (updates.title !== undefined) note.title = updates.title;
  if (updates.content !== undefined) note.content = updates.content;
  if (updates.tags !== undefined) note.tags = updates.tags;
  if (updates.pinned !== undefined) note.pinned = updates.pinned;
  note.updatedAt = new Date().toISOString();
  return note;
}

export function deleteNote(id: string): boolean {
  const idx = notes.findIndex(n => n.id === id);
  if (idx === -1) return false;
  notes.splice(idx, 1);
  return true;
}

export function searchNotes(query: string): JarvisNote[] {
  const q = query.toLowerCase();
  return notes.filter(n =>
    n.title.toLowerCase().includes(q) ||
    n.content.toLowerCase().includes(q) ||
    n.tags.some(t => t.toLowerCase().includes(q))
  );
}

// ─── Documents ───────────────────────────────────────────────────────────

export function createDocument(title: string, type: JarvisDocument['type'], content: string, source: string, url?: string): JarvisDocument {
  const doc: JarvisDocument = {
    id: sovereignId(),
    title,
    type,
    content,
    size: content.length,
    createdAt: new Date().toISOString(),
    attribution: ATTRIBUTION,
    source,
    url,
  };
  documents.push(doc);
  return doc;
}

export function getDocuments(limit = 100): JarvisDocument[] {
  return [...documents].reverse().slice(0, limit);
}

export function getDocument(id: string): JarvisDocument | undefined {
  return documents.find(d => d.id === id);
}

export function deleteDocument(id: string): boolean {
  const idx = documents.findIndex(d => d.id === id);
  if (idx === -1) return false;
  documents.splice(idx, 1);
  return true;
}

// ─── Tab Actions ─────────────────────────────────────────────────────────

export function recordTabAction(action: JarvisTabAction['action'], tabId?: number, url?: string, title?: string): JarvisTabAction {
  const ta: JarvisTabAction = {
    id: sovereignId(),
    action,
    tabId,
    url,
    title,
    timestamp: new Date().toISOString(),
    attribution: ATTRIBUTION,
  };
  tabActions.push(ta);
  return ta;
}

export function getTabActions(limit = 50): JarvisTabAction[] {
  return [...tabActions].reverse().slice(0, limit);
}

// ─── Page Context ────────────────────────────────────────────────────────

export function capturePageContext(context: JarvisPageContext): JarvisCommand {
  const start = Date.now();
  const doc = createDocument(
    context.title || 'Captured Page',
    'html',
    `URL: ${context.url}\nTitle: ${context.title}\nSelected: ${context.selectedText}`,
    'extension-capture',
    context.url,
  );
  return logCommand('capture-text', context.url, `Captured page: ${context.title}`, true, start, { documentId: doc.id, context });
}

// ─── State ───────────────────────────────────────────────────────────────

export function getJarvisState(): JarvisState {
  return {
    status: 'active',
    totalCommands: commandLog.length,
    totalNotes: notes.length,
    totalDocuments: documents.length,
    totalTabActions: tabActions.length,
    uptime: Date.now() - startTime,
    lastActivity: commandLog.length > 0 ? commandLog[commandLog.length - 1].timestamp : new Date().toISOString(),
    version: JARVIS_VERSION,
  };
}

export function getCommandLog(limit = 50): JarvisCommand[] {
  return [...commandLog].reverse().slice(0, limit);
}

export function getChatHistory(limit = 100): JarvisChatMessage[] {
  return [...chatHistory].slice(-limit);
}

// ─── Full Dashboard Data ─────────────────────────────────────────────────

export function getJarvisDashboard(): {
  state: JarvisState;
  recentCommands: JarvisCommand[];
  recentNotes: JarvisNote[];
  recentDocuments: JarvisDocument[];
  recentTabActions: JarvisTabAction[];
  chatHistory: JarvisChatMessage[];
} {
  return {
    state: getJarvisState(),
    recentCommands: getCommandLog(20),
    recentNotes: getNotes(20),
    recentDocuments: getDocuments(20),
    recentTabActions: getTabActions(20),
    chatHistory: getChatHistory(50),
  };
}
