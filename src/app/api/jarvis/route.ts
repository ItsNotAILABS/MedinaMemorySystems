/**
 * 𓂀 JARVISIUS API — /api/jarvis 𓂀
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  jarvisChat,
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
  searchNotes,
  createDocument,
  getDocuments,
  getDocument,
  deleteDocument,
  recordTabAction,
  getTabActions,
  capturePageContext,
  getJarvisState,
  getCommandLog,
  getChatHistory,
  getJarvisDashboard,
} from '@/lib/jarvisEngine';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(req: NextRequest) {
  const action = req.nextUrl.searchParams.get('action') || 'dashboard';
  try {
    switch (action) {
      case 'dashboard':
        return NextResponse.json(getJarvisDashboard(), { headers: CORS_HEADERS });
      case 'state':
        return NextResponse.json(getJarvisState(), { headers: CORS_HEADERS });
      case 'notes':
        return NextResponse.json(getNotes(parseInt(req.nextUrl.searchParams.get('limit') || '100', 10)), { headers: CORS_HEADERS });
      case 'note': {
        const id = req.nextUrl.searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Note ID required' }, { status: 400, headers: CORS_HEADERS });
        const note = getNote(id);
        if (!note) return NextResponse.json({ error: 'Note not found' }, { status: 404, headers: CORS_HEADERS });
        return NextResponse.json(note, { headers: CORS_HEADERS });
      }
      case 'documents':
        return NextResponse.json(getDocuments(parseInt(req.nextUrl.searchParams.get('limit') || '100', 10)), { headers: CORS_HEADERS });
      case 'document': {
        const id = req.nextUrl.searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Document ID required' }, { status: 400, headers: CORS_HEADERS });
        const doc = getDocument(id);
        if (!doc) return NextResponse.json({ error: 'Document not found' }, { status: 404, headers: CORS_HEADERS });
        return NextResponse.json(doc, { headers: CORS_HEADERS });
      }
      case 'commands':
        return NextResponse.json(getCommandLog(parseInt(req.nextUrl.searchParams.get('limit') || '50', 10)), { headers: CORS_HEADERS });
      case 'tabs':
        return NextResponse.json(getTabActions(), { headers: CORS_HEADERS });
      case 'chat':
        return NextResponse.json(getChatHistory(), { headers: CORS_HEADERS });
      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400, headers: CORS_HEADERS });
    }
  } catch (error) {
    return NextResponse.json({ error: 'JARVIS error', details: String(error) }, { status: 500, headers: CORS_HEADERS });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;
    switch (action) {
      case 'chat': {
        const { message } = body;
        if (!message?.trim()) return NextResponse.json({ error: 'Message required' }, { status: 400, headers: CORS_HEADERS });
        return NextResponse.json(jarvisChat(message), { headers: CORS_HEADERS });
      }
      case 'note': {
        const { title, content, tags = [], source = 'dashboard' } = body;
        if (!title?.trim()) return NextResponse.json({ error: 'Title required' }, { status: 400, headers: CORS_HEADERS });
        return NextResponse.json(createNote(title, content || '', tags, source), { headers: CORS_HEADERS });
      }
      case 'note-update': {
        const { id, ...updates } = body;
        if (!id) return NextResponse.json({ error: 'Note ID required' }, { status: 400, headers: CORS_HEADERS });
        const note = updateNote(id, updates);
        if (!note) return NextResponse.json({ error: 'Note not found' }, { status: 404, headers: CORS_HEADERS });
        return NextResponse.json(note, { headers: CORS_HEADERS });
      }
      case 'note-delete': {
        const { id } = body;
        if (!id) return NextResponse.json({ error: 'Note ID required' }, { status: 400, headers: CORS_HEADERS });
        return NextResponse.json({ deleted: deleteNote(id) }, { headers: CORS_HEADERS });
      }
      case 'document': {
        const { title, type = 'text', content = '', source = 'dashboard', url } = body;
        if (!title?.trim()) return NextResponse.json({ error: 'Title required' }, { status: 400, headers: CORS_HEADERS });
        return NextResponse.json(createDocument(title, type, content, source, url), { headers: CORS_HEADERS });
      }
      case 'document-delete': {
        const { id } = body;
        if (!id) return NextResponse.json({ error: 'Document ID required' }, { status: 400, headers: CORS_HEADERS });
        return NextResponse.json({ deleted: deleteDocument(id) }, { headers: CORS_HEADERS });
      }
      case 'tab': {
        const { tabAction, tabId, url, title } = body;
        if (!tabAction) return NextResponse.json({ error: 'Tab action required' }, { status: 400, headers: CORS_HEADERS });
        return NextResponse.json(recordTabAction(tabAction, tabId, url, title), { headers: CORS_HEADERS });
      }
      case 'capture': {
        const { url, title, selectedText } = body;
        if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400, headers: CORS_HEADERS });
        return NextResponse.json(capturePageContext({ url, title: title || '', selectedText: selectedText || '' }), { headers: CORS_HEADERS });
      }
      case 'search-notes': {
        const { query } = body;
        if (!query?.trim()) return NextResponse.json({ error: 'Query required' }, { status: 400, headers: CORS_HEADERS });
        return NextResponse.json(searchNotes(query), { headers: CORS_HEADERS });
      }
      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400, headers: CORS_HEADERS });
    }
  } catch (error) {
    return NextResponse.json({ error: 'JARVIS error', details: String(error) }, { status: 500, headers: CORS_HEADERS });
  }
}
