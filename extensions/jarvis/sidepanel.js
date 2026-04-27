/**
 * JARVISIUS v2.0 Side Panel — Full sovereign AI assistant
 * Chat, notes, docs, tabs, bookmarks, history, page analysis, TTS, timers, and more
 * By Alfredo Medina Hernandez | Medina Tech | Dallas TX
 */

(function() {
  'use strict';

  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  const statusDot = document.getElementById('status-dot');

  // ═══════════════════════════════════════════════════════════════════
  // TAB SWITCHING
  // ═══════════════════════════════════════════════════════════════════

  document.querySelectorAll('.tab-bar button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-bar button').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById(`panel-${btn.dataset.tab}`);
      if (panel) panel.classList.add('active');

      if (btn.dataset.tab === 'notes') loadNotes();
      if (btn.dataset.tab === 'docs') loadDocs();
      if (btn.dataset.tab === 'tabs') loadTabs();
      if (btn.dataset.tab === 'bookmarks') loadBookmarks();
      if (btn.dataset.tab === 'history') loadHistory();
      if (btn.dataset.tab === 'help') loadHelp();
    });
  });

  // ═══════════════════════════════════════════════════════════════════
  // CHAT + COMMAND PROCESSING
  // ═══════════════════════════════════════════════════════════════════

  const COMMANDS = {
    // Tab control
    '/open': { desc: 'Open URL in new tab', usage: '/open google.com', handler: async (args) => { const url = args.startsWith('http') ? args : `https://${args}`; await msg({ type: 'TAB_OPEN', url }); return `Opening ${url}...`; } },
    '/tab': { desc: 'Switch to tab #', usage: '/tab 3', handler: async (args) => { const r = await msg({ type: 'TAB_SWITCH', tabIndex: parseInt(args, 10) - 1 }); return r.success ? `Switched to tab ${args}.` : r.error; } },
    '/close': { desc: 'Close current or tab #', usage: '/close or /close 2', handler: async (args) => { const r = await msg({ type: 'TAB_CLOSE', tabIndex: args ? parseInt(args, 10) - 1 : undefined }); return r.success ? 'Tab closed.' : r.error; } },
    '/tabs': { desc: 'List all open tabs', usage: '/tabs', handler: async () => { const r = await msg({ type: 'TAB_LIST' }); return r.tabs.map((t, i) => `${t.active ? '▶' : '  '} ${i + 1}. ${t.title}`).join('\n'); } },
    '/dup': { desc: 'Duplicate current tab', usage: '/dup', handler: async () => { const r = await msg({ type: 'TAB_DUPLICATE' }); return r.success ? 'Tab duplicated.' : 'Failed.'; } },
    '/pin': { desc: 'Pin/unpin current tab', usage: '/pin', handler: async () => { const r = await msg({ type: 'TAB_PIN' }); return r.success ? (r.pinned ? 'Tab pinned.' : 'Tab unpinned.') : 'Failed.'; } },
    '/mute': { desc: 'Mute/unmute current tab', usage: '/mute', handler: async () => { const r = await msg({ type: 'TAB_MUTE' }); return r.success ? 'Tab mute toggled.' : 'Failed.'; } },
    '/reload': { desc: 'Reload current tab', usage: '/reload', handler: async () => { const r = await msg({ type: 'TAB_RELOAD' }); return r.success ? 'Reloading...' : 'Failed.'; } },
    '/movel': { desc: 'Move tab left', usage: '/movel', handler: async () => { await msg({ type: 'TAB_MOVE_LEFT' }); return 'Moved left.'; } },
    '/mover': { desc: 'Move tab right', usage: '/mover', handler: async () => { await msg({ type: 'TAB_MOVE_RIGHT' }); return 'Moved right.'; } },

    // Notes & capture
    '/note': { desc: 'Create a note', usage: '/note Title | Content here', handler: async (args) => { const [title, ...rest] = args.split('|'); const r = await msg({ type: 'API_POST', body: { action: 'note', title: title.trim(), content: rest.join('|').trim(), tags: ['jarvis'], source: 'extension' } }); return r.success ? `Note saved: "${title.trim()}"` : 'Failed.'; } },
    '/capture': { desc: 'Capture current page', usage: '/capture', handler: async () => { const r = await msg({ type: 'CAPTURE_PAGE' }); return r.success ? 'Page captured.' : 'Failed.'; } },
    '/screenshot': { desc: 'Take screenshot', usage: '/screenshot', handler: async () => { const r = await msg({ type: 'SCREENSHOT' }); return r.success ? 'Screenshot captured.' : 'Failed: ' + (r.error || ''); } },

    // Bookmarks
    '/bookmark': { desc: 'Bookmark current page', usage: '/bookmark', handler: async () => { const r = await msg({ type: 'BOOKMARK_ADD' }); return r.success ? 'Bookmarked ✓' : 'Failed.'; } },
    '/bmsearch': { desc: 'Search bookmarks', usage: '/bmsearch react', handler: async (args) => { const r = await msg({ type: 'BOOKMARK_SEARCH', query: args }); return r.bookmarks?.length ? r.bookmarks.slice(0, 10).map(b => `🔖 ${b.title}`).join('\n') : 'No bookmarks found.'; } },

    // History
    '/history': { desc: 'Recent history', usage: '/history or /history search term', handler: async (args) => { const r = args ? await msg({ type: 'HISTORY_SEARCH', query: args }) : await msg({ type: 'HISTORY_RECENT' }); return r.history?.slice(0, 10).map(h => `🕐 ${h.title}`).join('\n') || 'No history.'; } },

    // TTS
    '/read': { desc: 'Read page content aloud', usage: '/read', handler: async () => { const r = await msg({ type: 'TTS_READ_PAGE' }); return r.success ? '🔊 Reading page...' : 'Cannot read this page.'; } },
    '/say': { desc: 'Speak text aloud', usage: '/say Hello sir', handler: async (args) => { await msg({ type: 'TTS_SPEAK', text: args }); return `🔊 Speaking: "${args.slice(0, 40)}..."` ; } },
    '/stop': { desc: 'Stop speaking', usage: '/stop', handler: async () => { await msg({ type: 'TTS_STOP' }); return '🔇 Stopped.'; } },

    // Page tools
    '/analyze': { desc: 'Analyze current page', usage: '/analyze', handler: async () => { const r = await msg({ type: 'ANALYZE_PAGE' }); if (!r.success) return 'Cannot analyze this page.'; const a = r.analysis; return `📊 ${a.title}\n🔗 ${a.links} links | 🖼 ${a.images} images\n📝 ${a.wordCount} words (${a.readingTime})\n📜 ${a.scripts} scripts | 🎨 ${a.styles} styles\n📑 ${a.headings?.length || 0} headings | 📋 ${a.forms} forms`; } },
    '/extract': { desc: 'Extract page text', usage: '/extract', handler: async () => { const r = await msg({ type: 'EXTRACT_TEXT' }); return r.success ? r.text?.slice(0, 500) + '...' : 'Cannot extract.'; } },
    '/links': { desc: 'Extract all links', usage: '/links', handler: async () => { const r = await msg({ type: 'EXTRACT_LINKS' }); return r.links?.slice(0, 15).map(l => `🔗 ${l.text || l.href}`).join('\n') || 'No links.'; } },
    '/images': { desc: 'Extract all images', usage: '/images', handler: async () => { const r = await msg({ type: 'EXTRACT_IMAGES' }); return r.images?.slice(0, 10).map(i => `🖼 ${i.alt || 'image'} (${i.width}x${i.height})`).join('\n') || 'No images.'; } },
    '/highlight': { desc: 'Highlight text on page', usage: '/highlight search term', handler: async (args) => { await msg({ type: 'HIGHLIGHT', query: args }); return `Highlighted "${args}" on page.`; } },

    // Visual tools
    '/dark': { desc: 'Toggle dark mode on page', usage: '/dark', handler: async () => { await msg({ type: 'DARK_MODE' }); return '🌙 Dark mode toggled.'; } },
    '/zoom': { desc: 'Zoom in/out/reset', usage: '/zoom in | /zoom out | /zoom reset', handler: async (args) => { const dir = args.trim().toLowerCase(); await msg({ type: 'ZOOM', direction: dir === 'reset' ? undefined : dir, level: dir === 'reset' ? 1.0 : undefined }); return `🔍 Zoom ${dir || 'reset'}.`; } },
    '/reader': { desc: 'Toggle reading mode', usage: '/reader', handler: async () => { await msg({ type: 'READING_MODE' }); return '📖 Reading mode toggled.'; } },

    // Timers
    '/timer': { desc: 'Set a timer (minutes)', usage: '/timer 5 Break time', handler: async (args) => { const [min, ...rest] = args.split(' '); const r = await msg({ type: 'TIMER_SET', minutes: parseFloat(min), label: rest.join(' ') || `Timer ${min}m` }); return r.success ? `⏰ Timer set for ${min} minutes.` : 'Failed.'; } },
    '/timers': { desc: 'List active timers', usage: '/timers', handler: async () => { const r = await msg({ type: 'TIMER_LIST' }); return r.timers?.length ? r.timers.map(t => `⏰ ${t.label} — ${new Date(t.scheduledTime).toLocaleTimeString()}`).join('\n') : 'No active timers.'; } },
    '/cleartimers': { desc: 'Clear all timers', usage: '/cleartimers', handler: async () => { await msg({ type: 'TIMER_CLEAR' }); return 'All timers cleared.'; } },

    // Calculator
    '/calc': { desc: 'Calculate expression', usage: '/calc 2 + 2 * 3', handler: async (args) => { try { const safe = args.replace(/[^0-9+\-*/.()%\s]/g, ''); const result = Function('"use strict"; return (' + safe + ')')(); return `🧮 ${args} = ${result}`; } catch { return 'Invalid expression.'; } } },

    // Utility
    '/context': { desc: 'Get current page info', usage: '/context', handler: async () => { const r = await msg({ type: 'GET_PAGE_CONTEXT' }); const c = r.context; return `📍 ${c.title}\n🔗 ${c.url}\n${c.selectedText ? `📝 Selected: "${c.selectedText.slice(0, 100)}"` : '(no selection)'}`; } },
    '/search': { desc: 'Google search in new tab', usage: '/search quantum computing', handler: async (args) => { await msg({ type: 'TAB_OPEN', url: `https://www.google.com/search?q=${encodeURIComponent(args)}` }); return `🔍 Searching: "${args}"...`; } },
    '/copy': { desc: 'Copy text to clipboard', usage: '/copy some text', handler: async (args) => { try { await navigator.clipboard.writeText(args); await msg({ type: 'CLIP_SAVE', text: args }); return '📋 Copied to clipboard.'; } catch { return 'Clipboard access denied.'; } } },
    '/status': { desc: 'Check JARVIS status', usage: '/status', handler: async () => { const r = await msg({ type: 'API_GET', action: 'state' }); const s = r.result; return s ? `JARVISIUS ${s.version}\nStatus: ${s.status}\nCommands: ${s.totalCommands}\nNotes: ${s.totalNotes}\nDocs: ${s.totalDocuments}\nUptime: ${Math.floor(s.uptime / 1000)}s` : 'Cannot reach MERIDIAN.'; } },
    '/help': { desc: 'Show all commands', usage: '/help', handler: async () => { return Object.entries(COMMANDS).map(([cmd, info]) => `${cmd} — ${info.desc}`).join('\n'); } },
  };

  function addMessage(role, content) {
    const div = document.createElement('div');
    div.className = `msg ${role}`;
    div.textContent = content;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;
    addMessage('user', text);
    chatInput.value = '';

    // Check for commands
    const spaceIdx = text.indexOf(' ');
    const cmd = spaceIdx > 0 ? text.slice(0, spaceIdx).toLowerCase() : text.toLowerCase();
    const args = spaceIdx > 0 ? text.slice(spaceIdx + 1) : '';

    if (COMMANDS[cmd]) {
      try {
        const result = await COMMANDS[cmd].handler(args);
        addMessage('jarvis', result);
      } catch (e) {
        addMessage('error', `Error: ${e}`);
      }
      return;
    }

    // Not a command — send to MERIDIAN API as chat
    try {
      const result = await msg({ type: 'API_POST', body: { action: 'chat', message: text } });
      if (result.success && result.result) {
        addMessage('jarvis', result.result.content || JSON.stringify(result.result));
      } else {
        addMessage('jarvis', 'Unable to reach MERIDIAN. Try a /command instead.');
      }
    } catch {
      addMessage('jarvis', 'Connection error. MERIDIAN may be offline.');
      statusDot.classList.add('offline');
    }
  }

  sendBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });

  // ═══════════════════════════════════════════════════════════════════
  // NOTES PANEL
  // ═══════════════════════════════════════════════════════════════════

  async function loadNotes(filter) {
    const notesList = document.getElementById('notes-list');
    try {
      const result = filter
        ? await msg({ type: 'API_POST', body: { action: 'search-notes', query: filter } })
        : await msg({ type: 'API_GET', action: 'notes' });
      const notes = result.result || [];
      if (notes.length === 0) {
        notesList.innerHTML = '<div class="empty-state">No notes found. Use /note title | content</div>';
        return;
      }
      notesList.innerHTML = notes.map(n => `
        <div class="list-item" data-id="${n.id}">
          <div class="item-title">${n.pinned ? '<span class="item-pin">📌</span>' : ''}${esc(n.title)}</div>
          <div class="item-meta">${n.createdAt ? new Date(n.createdAt).toLocaleDateString() : ''} • ${(n.content || '').slice(0, 60)}</div>
        </div>
      `).join('');
    } catch {
      notesList.innerHTML = '<div class="empty-state">Unable to load notes</div>';
    }
  }

  const notesSearch = document.getElementById('notes-search');
  if (notesSearch) {
    let debounce;
    notesSearch.addEventListener('input', () => { clearTimeout(debounce); debounce = setTimeout(() => loadNotes(notesSearch.value), 300); });
  }

  // ═══════════════════════════════════════════════════════════════════
  // DOCS PANEL
  // ═══════════════════════════════════════════════════════════════════

  async function loadDocs() {
    const docsList = document.getElementById('docs-list');
    try {
      const result = await msg({ type: 'API_GET', action: 'documents' });
      const docs = result.result || [];
      if (docs.length === 0) {
        docsList.innerHTML = '<div class="empty-state">No documents yet. Capture pages or take screenshots.</div>';
        return;
      }
      docsList.innerHTML = docs.map(d => `
        <div class="list-item" data-id="${d.id}">
          <div class="item-title">${typeIcon(d.type)} ${esc(d.title)}</div>
          <div class="item-meta">${d.createdAt ? new Date(d.createdAt).toLocaleDateString() : ''} • ${d.type} • ${fmtSize(d.size)}</div>
        </div>
      `).join('');
    } catch {
      docsList.innerHTML = '<div class="empty-state">Unable to load documents</div>';
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // TABS PANEL
  // ═══════════════════════════════════════════════════════════════════

  async function loadTabs() {
    const tabsList = document.getElementById('tabs-list');
    try {
      const result = await msg({ type: 'TAB_LIST' });
      const tabs = result.tabs || [];
      if (tabs.length === 0) { tabsList.innerHTML = '<div class="empty-state">No tabs found</div>'; return; }
      tabsList.innerHTML = tabs.map(t => `
        <div class="list-item ${t.active ? 'active-tab' : ''}" data-tab-index="${t.index}">
          <div class="item-title">${t.active ? '▶ ' : ''}${esc(t.title || 'Untitled')}</div>
          <div class="item-meta">${esc((t.url || '').slice(0, 55))}</div>
        </div>
      `).join('');
      tabsList.querySelectorAll('.list-item').forEach(item => {
        item.addEventListener('click', async () => {
          await msg({ type: 'TAB_SWITCH', tabIndex: parseInt(item.dataset.tabIndex, 10) });
          loadTabs();
        });
      });
    } catch {
      tabsList.innerHTML = '<div class="empty-state">Unable to load tabs</div>';
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // BOOKMARKS PANEL
  // ═══════════════════════════════════════════════════════════════════

  async function loadBookmarks(query) {
    const list = document.getElementById('bookmarks-list');
    try {
      const result = query
        ? await msg({ type: 'BOOKMARK_SEARCH', query })
        : await msg({ type: 'BOOKMARK_LIST' });
      const bms = result.bookmarks || [];
      if (bms.length === 0) { list.innerHTML = '<div class="empty-state">No bookmarks found</div>'; return; }
      list.innerHTML = bms.map(b => `
        <div class="list-item" data-url="${esc(b.url || '')}">
          <div class="item-title">🔖 ${esc(b.title || 'Untitled')}</div>
          <div class="item-meta">${esc((b.url || '').slice(0, 55))}</div>
        </div>
      `).join('');
      list.querySelectorAll('.list-item').forEach(item => {
        item.addEventListener('click', () => {
          const url = item.dataset.url;
          if (url) msg({ type: 'TAB_OPEN', url });
        });
      });
    } catch {
      list.innerHTML = '<div class="empty-state">Unable to load bookmarks</div>';
    }
  }

  const bmSearch = document.getElementById('bm-search');
  if (bmSearch) {
    let debounce;
    bmSearch.addEventListener('input', () => { clearTimeout(debounce); debounce = setTimeout(() => loadBookmarks(bmSearch.value), 300); });
  }

  // ═══════════════════════════════════════════════════════════════════
  // HISTORY PANEL
  // ═══════════════════════════════════════════════════════════════════

  async function loadHistory(query) {
    const list = document.getElementById('history-list');
    try {
      const result = query
        ? await msg({ type: 'HISTORY_SEARCH', query })
        : await msg({ type: 'HISTORY_RECENT' });
      const items = result.history || [];
      if (items.length === 0) { list.innerHTML = '<div class="empty-state">No history found</div>'; return; }
      list.innerHTML = items.map(h => `
        <div class="list-item" data-url="${esc(h.url || '')}">
          <div class="item-title">🕐 ${esc(h.title || 'Untitled')}</div>
          <div class="item-meta">${h.lastVisitTime ? new Date(h.lastVisitTime).toLocaleString() : ''} • ${h.visitCount || 0} visits</div>
        </div>
      `).join('');
      list.querySelectorAll('.list-item').forEach(item => {
        item.addEventListener('click', () => {
          const url = item.dataset.url;
          if (url) msg({ type: 'TAB_OPEN', url });
        });
      });
    } catch {
      list.innerHTML = '<div class="empty-state">Unable to load history</div>';
    }
  }

  const histSearch = document.getElementById('history-search');
  if (histSearch) {
    let debounce;
    histSearch.addEventListener('input', () => { clearTimeout(debounce); debounce = setTimeout(() => loadHistory(histSearch.value), 300); });
  }

  // ═══════════════════════════════════════════════════════════════════
  // ANALYZE PANEL
  // ═══════════════════════════════════════════════════════════════════

  document.getElementById('analyze-btn')?.addEventListener('click', async () => {
    const grid = document.getElementById('analysis-grid');
    grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1">Analyzing...</div>';
    const r = await msg({ type: 'ANALYZE_PAGE' });
    if (!r.success) { grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1">Cannot analyze this page</div>'; return; }
    const a = r.analysis;
    grid.innerHTML = `
      <div class="stat-card full"><div class="stat-label">Page</div><div class="stat-value" style="font-size:13px;">${esc(a.title || '')}</div></div>
      <div class="stat-card"><div class="stat-label">Words</div><div class="stat-value">${a.wordCount}</div></div>
      <div class="stat-card"><div class="stat-label">Read Time</div><div class="stat-value">${a.readingTime}</div></div>
      <div class="stat-card"><div class="stat-label">Links</div><div class="stat-value">${a.links}</div></div>
      <div class="stat-card"><div class="stat-label">Images</div><div class="stat-value">${a.images}</div></div>
      <div class="stat-card"><div class="stat-label">Scripts</div><div class="stat-value">${a.scripts}</div></div>
      <div class="stat-card"><div class="stat-label">Styles</div><div class="stat-value">${a.styles}</div></div>
      <div class="stat-card"><div class="stat-label">Forms</div><div class="stat-value">${a.forms}</div></div>
      <div class="stat-card"><div class="stat-label">Inputs</div><div class="stat-value">${a.inputs}</div></div>
      <div class="stat-card"><div class="stat-label">Headings</div><div class="stat-value">${a.headings?.length || 0}</div></div>
      <div class="stat-card"><div class="stat-label">Language</div><div class="stat-value">${a.language}</div></div>
      ${a.headings?.length ? `<div class="stat-card full"><div class="stat-label">Headings</div><div style="font-size:11px;color:#aaa;margin-top:4px;">${a.headings.slice(0, 10).map(h => `${h.tag}: ${esc(h.text || '')}`).join('<br>')}</div></div>` : ''}
    `;
  });

  // ═══════════════════════════════════════════════════════════════════
  // HELP / COMMANDS PANEL
  // ═══════════════════════════════════════════════════════════════════

  function loadHelp() {
    const list = document.getElementById('cmd-list');
    const categories = {
      '🗂 Tab Control': ['/open', '/tab', '/tabs', '/close', '/dup', '/pin', '/mute', '/reload', '/movel', '/mover'],
      '📝 Notes & Capture': ['/note', '/capture', '/screenshot'],
      '🔖 Bookmarks': ['/bookmark', '/bmsearch'],
      '🕐 History': ['/history'],
      '🔊 Voice & TTS': ['/read', '/say', '/stop'],
      '🔬 Page Analysis': ['/analyze', '/extract', '/links', '/images', '/highlight', '/context'],
      '🎨 Visual Tools': ['/dark', '/zoom', '/reader'],
      '⏰ Timers': ['/timer', '/timers', '/cleartimers'],
      '🧮 Utility': ['/calc', '/search', '/copy', '/status', '/help'],
    };
    list.innerHTML = Object.entries(categories).map(([cat, cmds]) =>
      `<div style="color:#00d4ff;font-size:11px;font-weight:600;padding:8px 10px 4px;border-top:1px solid rgba(255,255,255,0.04);">${cat}</div>` +
      cmds.map(c => COMMANDS[c] ? `<div class="cmd-item"><code>${c}</code> <span style="color:#444">— ${COMMANDS[c].usage}</span><div class="cmd-desc">${COMMANDS[c].desc}</div></div>` : '').join('')
    ).join('');
  }

  // ═══════════════════════════════════════════════════════════════════
  // QUICK ACTIONS
  // ═══════════════════════════════════════════════════════════════════

  document.getElementById('qa-screenshot')?.addEventListener('click', async () => { addMessage('system', 'Capturing...'); const r = await msg({ type: 'SCREENSHOT' }); addMessage('jarvis', r.success ? 'Screenshot saved.' : 'Failed: ' + (r.error || '')); switchToTab('chat'); });
  document.getElementById('qa-capture')?.addEventListener('click', async () => { const r = await msg({ type: 'CAPTURE_PAGE' }); addMessage('jarvis', r.success ? 'Captured.' : 'Failed.'); switchToTab('chat'); });
  document.getElementById('qa-note')?.addEventListener('click', () => { chatInput.value = '/note '; chatInput.focus(); switchToTab('chat'); });
  document.getElementById('qa-bookmark')?.addEventListener('click', async () => { const r = await msg({ type: 'BOOKMARK_ADD' }); addMessage('jarvis', r.success ? 'Bookmarked ✓' : 'Failed.'); switchToTab('chat'); });
  document.getElementById('qa-read')?.addEventListener('click', async () => { const r = await msg({ type: 'TTS_READ_PAGE' }); addMessage('jarvis', r.success ? '🔊 Reading...' : 'Cannot read.'); switchToTab('chat'); });

  function switchToTab(name) {
    document.querySelectorAll('.tab-bar button').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    const btn = document.querySelector(`.tab-bar button[data-tab="${name}"]`);
    if (btn) btn.classList.add('active');
    const panel = document.getElementById(`panel-${name}`);
    if (panel) panel.classList.add('active');
  }

  // ═══════════════════════════════════════════════════════════════════
  // HELPERS
  // ═══════════════════════════════════════════════════════════════════

  function msg(message) { return new Promise(resolve => { chrome.runtime.sendMessage(message, resolve); }); }
  function esc(text) { const d = document.createElement('div'); d.textContent = text; return d.innerHTML; }
  function typeIcon(t) { return { pdf: '📕', screenshot: '📸', html: '🌐', markdown: '📝' }[t] || '📄'; }
  function fmtSize(b) { if (!b) return ''; if (b < 1024) return b + ' B'; if (b < 1048576) return (b / 1024).toFixed(1) + ' KB'; return (b / 1048576).toFixed(1) + ' MB'; }

  // ═══════════════════════════════════════════════════════════════════
  // CONNECTION CHECK
  // ═══════════════════════════════════════════════════════════════════

  async function checkConnection() {
    try {
      const r = await msg({ type: 'API_GET', action: 'state' });
      statusDot.classList.toggle('offline', !r.success);
    } catch { statusDot.classList.add('offline'); }
  }
  checkConnection();
  setInterval(checkConnection, 30000);

})();
