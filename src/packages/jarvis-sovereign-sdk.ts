/**
 * @medina/jarvis-sovereign-sdk
 * Sovereign Intelligence Assistant — JARVISIUS SUVERANUS
 *
 * Combines: jarvisEngine (chat + notes + documents + tabs + capture + commands)
 *
 * Provides:
 * - Chat interface with command processing
 * - Sovereign note creation, search, pinning
 * - Document capture and management (PDF, screenshots, text)
 * - Browser tab action recording
 * - Page context capture
 * - Command logging and system state
 *
 * Terminal: /jarvis — JARVISIUS SUVERANUS
 * Latin: "Intellegentia quae servit, suverana est."
 *
 * Callable Functions (20):
 *   1.  COLLOQUIUM            — jarvisChat
 *   2.  CREARE NOTAM          — createNote
 *   3.  LEGERE NOTAS          — getNotes
 *   4.  LEGERE NOTAM          — getNote
 *   5.  RENOVARE NOTAM        — updateNote
 *   6.  DELERE NOTAM          — deleteNote
 *   7.  QUAERERE NOTAS        — searchNotes
 *   8.  CREARE DOCUMENTUM     — createDocument
 *   9.  LEGERE DOCUMENTA      — getDocuments
 *  10.  LEGERE DOCUMENTUM     — getDocument
 *  11.  DELERE DOCUMENTUM     — deleteDocument
 *  12.  SCRIBERE ACTIO TAB    — recordTabAction
 *  13.  LEGERE ACTIONES TAB   — getTabActions
 *  14.  CAPERE PAGINAM        — capturePageContext
 *  15.  STATUS JARVIS         — getJarvisState
 *  16.  LEGERE MANDATA        — getCommandLog
 *  17.  LEGERE HISTORIAM      — getChatHistory
 *  18.  TABULA INSTRUMENTI    — getJarvisDashboard
 *  19.  TYPUS ACTIONIS        — JarvisActionType (type)
 *  20.  STATUS TYPUS          — JarvisStatus (type)
 */

// ═══════════════════════════════════════════════════════════════════════════
// RE-EXPORTS — jarvisEngine
// ═══════════════════════════════════════════════════════════════════════════

export {
  // Types
  type JarvisActionType,
  type JarvisStatus,
  type JarvisCommand,
  type JarvisNote,
  type JarvisDocument,
  type JarvisTabAction,
  type JarvisPageContext,
  type JarvisState,
  type JarvisChatMessage,

  // ─── Chat ──────────────────────────────────────────────────────────
  jarvisChat,

  // ─── Notes ─────────────────────────────────────────────────────────
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
  searchNotes,

  // ─── Documents ─────────────────────────────────────────────────────
  createDocument,
  getDocuments,
  getDocument,
  deleteDocument,

  // ─── Tab Actions ───────────────────────────────────────────────────
  recordTabAction,
  getTabActions,

  // ─── Page Capture ──────────────────────────────────────────────────
  capturePageContext,

  // ─── State & Dashboard ─────────────────────────────────────────────
  getJarvisState,
  getCommandLog,
  getChatHistory,
  getJarvisDashboard,
} from '@/lib/jarvisEngine';

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

export const PHI = 1.618033988749895;
export const PHI_INVERSE = 0.618033988749895;
export const FREQ_432 = 432.0;

// ═══════════════════════════════════════════════════════════════════════════
// PACKAGE MANIFEST
// ═══════════════════════════════════════════════════════════════════════════

export const PACKAGE_MANIFEST = {
  name: '@medina/jarvis-sovereign-sdk',
  latinName: 'JARVISIUS SUVERANUS',
  version: '1.0.0',
  description:
    'Sovereign Intelligence Assistant — tab control, notes, documents, page capture, chat, commands',
  modules: ['chat', 'notes', 'documents', 'tabs', 'capture', 'commands'],
  callableFunctions: 20,
  terminal: '/jarvis',
  market: 'marketplace',
  capabilities: [
    'chat',
    'notes',
    'documents',
    'tab-control',
    'page-capture',
    'screenshot',
    'pdf-creation',
    'search',
    'command-processing',
    'voice-ready',
  ],
  exports: [
    'jarvisChat',
    'createNote',
    'getNotes',
    'getNote',
    'updateNote',
    'deleteNote',
    'searchNotes',
    'createDocument',
    'getDocuments',
    'getDocument',
    'deleteDocument',
    'recordTabAction',
    'getTabActions',
    'capturePageContext',
    'getJarvisState',
    'getCommandLog',
    'getChatHistory',
    'getJarvisDashboard',
    'JarvisActionType',
    'JarvisStatus',
  ],
  phiSignature: PHI,
};
