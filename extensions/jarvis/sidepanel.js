/**
 * JARVISIUS Side Panel JavaScript
 * Chat, notes, docs, tabs — all wired to the background service worker
 */

(function() {
  'use strict';

  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  const statusDot = document.getElementById('status-dot');

  // ─── Tab Switching ──────────────────────────────────────
  document.querySelectorAll('.tab-bar button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-bar button').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`panel-${btn.dataset.tab}`).classList.add('active');

      if (btn.dataset.tab === 'notes') loadNotes();
      if (btn.dataset.tab === 'docs') loadDocs();
      if (btn.dataset.tab === 'tabs') loadTabs();
    });
  });

  // ─── Chat ───────────────────────────────────────────────
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

    // Handle local tab commands first
    if (text.startsWith('/open ')) {
      const url = text.slice(6).trim();
      const fullUrl = url.startsWith('http') ? url : `https://${url}`;
      const result = await msg({ type: 'TAB_OPEN', url: fullUrl });
      addMessage('jarvis', result.success ? `Opening ${fullUrl}...` : `Error: ${result.error}`);
      return;
    }

    if (text.startsWith('/tab ')) {
      const idx = parseInt(text.slice(5).trim(), 10) - 1;
      const result = await msg({ type: 'TAB_SWITCH', tabIndex: idx });
      addMessage('jarvis', result.success ? `Switched to tab ${idx + 1}.` : `Error: ${result.error}`);
      return;
    }

    if (text === '/close') {
      const result = await msg({ type: 'TAB_CLOSE' });
      addMessage('jarvis', result.success ? 'Tab closed.' : `Error: ${result.error}`);
      return;
    }

    if (text === '/screenshot') {
      addMessage('jarvis', 'Capturing screenshot...');
      const result = await msg({ type: 'SCREENSHOT' });
      addMessage('jarvis', result.success ? 'Screenshot captured and saved.' : `Error: ${result.error}`);
      return;
    }

    // Send to API
    try {
      const result = await msg({ type: 'API_POST', body: { action: 'chat', message: text } });
      if (result.success && result.result) {
        addMessage('jarvis', result.result.content || JSON.stringify(result.result));
      } else {
        addMessage('jarvis', 'Connection issue. Retrying...');
      }
    } catch {
      addMessage('jarvis', 'Unable to reach MERIDIAN. Please ensure the server is running.');
      statusDot.classList.add('offline');
    }
  }

  sendBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  // ─── Notes ──────────────────────────────────────────────
  async function loadNotes() {
    const notesList = document.getElementById('notes-list');
    try {
      const result = await msg({ type: 'API_GET', action: 'notes' });
      const notes = result.result || [];
      if (notes.length === 0) {
        notesList.innerHTML = '<div class="empty-state">No notes yet. Use /note &lt;title&gt; | &lt;content&gt;</div>';
        return;
      }
      notesList.innerHTML = notes.map(n => `
        <div class="list-item" data-id="${n.id}">
          <div class="item-title">${n.pinned ? '<span class="item-pin">📌</span>' : ''}${escapeHtml(n.title)}</div>
          <div class="item-meta">${n.createdAt ? new Date(n.createdAt).toLocaleDateString() : ''} • ${(n.content || '').slice(0, 60)}</div>
        </div>
      `).join('');
    } catch {
      notesList.innerHTML = '<div class="empty-state">Unable to load notes</div>';
    }
  }

  // ─── Docs ───────────────────────────────────────────────
  async function loadDocs() {
    const docsList = document.getElementById('docs-list');
    try {
      const result = await msg({ type: 'API_GET', action: 'documents' });
      const docs = result.result || [];
      if (docs.length === 0) {
        docsList.innerHTML = '<div class="empty-state">No documents yet. Capture pages or create PDFs.</div>';
        return;
      }
      docsList.innerHTML = docs.map(d => `
        <div class="list-item" data-id="${d.id}">
          <div class="item-title">${typeIcon(d.type)} ${escapeHtml(d.title)}</div>
          <div class="item-meta">${d.createdAt ? new Date(d.createdAt).toLocaleDateString() : ''} • ${d.type} • ${formatSize(d.size)}</div>
        </div>
      `).join('');
    } catch {
      docsList.innerHTML = '<div class="empty-state">Unable to load documents</div>';
    }
  }

  // ─── Tabs ───────────────────────────────────────────────
  async function loadTabs() {
    const tabsList = document.getElementById('tabs-list');
    try {
      const result = await msg({ type: 'TAB_LIST' });
      const tabs = result.tabs || [];
      if (tabs.length === 0) {
        tabsList.innerHTML = '<div class="empty-state">No tabs found</div>';
        return;
      }
      tabsList.innerHTML = tabs.map(t => `
        <div class="list-item ${t.active ? 'active-tab' : ''}" data-tab-index="${t.index}" style="${t.active ? 'border-color: rgba(0,212,255,0.4);' : ''}">
          <div class="item-title">${t.active ? '▶ ' : ''}${escapeHtml(t.title || 'Untitled')}</div>
          <div class="item-meta">${escapeHtml((t.url || '').slice(0, 60))}</div>
        </div>
      `).join('');

      tabsList.querySelectorAll('.list-item').forEach(item => {
        item.addEventListener('click', async () => {
          const idx = parseInt(item.dataset.tabIndex, 10);
          await msg({ type: 'TAB_SWITCH', tabIndex: idx });
          loadTabs();
        });
      });
    } catch {
      tabsList.innerHTML = '<div class="empty-state">Unable to load tabs</div>';
    }
  }

  // ─── Quick Actions ──────────────────────────────────────
  document.getElementById('qa-screenshot').addEventListener('click', async () => {
    addMessage('system', 'Capturing screenshot...');
    const result = await msg({ type: 'SCREENSHOT' });
    addMessage('jarvis', result.success ? 'Screenshot saved.' : 'Screenshot failed.');
    switchToTab('chat');
  });

  document.getElementById('qa-capture').addEventListener('click', async () => {
    const result = await msg({ type: 'CAPTURE_PAGE' });
    addMessage('jarvis', result.success ? 'Page captured and saved.' : 'Capture failed.');
    switchToTab('chat');
  });

  document.getElementById('qa-note').addEventListener('click', () => {
    chatInput.value = '/note ';
    chatInput.focus();
    switchToTab('chat');
  });

  document.getElementById('qa-newtab').addEventListener('click', () => {
    chatInput.value = '/open ';
    chatInput.focus();
    switchToTab('chat');
  });

  function switchToTab(name) {
    document.querySelectorAll('.tab-bar button').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    const btn = document.querySelector(`.tab-bar button[data-tab="${name}"]`);
    if (btn) btn.classList.add('active');
    const panel = document.getElementById(`panel-${name}`);
    if (panel) panel.classList.add('active');
  }

  // ─── Helpers ────────────────────────────────────────────
  function msg(message) {
    return new Promise(resolve => {
      chrome.runtime.sendMessage(message, resolve);
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function typeIcon(type) {
    switch (type) {
      case 'pdf': return '📕';
      case 'screenshot': return '📸';
      case 'html': return '🌐';
      case 'markdown': return '📝';
      default: return '📄';
    }
  }

  function formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  // ─── Connection Check ──────────────────────────────────
  async function checkConnection() {
    try {
      const result = await msg({ type: 'API_GET', action: 'state' });
      statusDot.classList.toggle('offline', !result.success);
    } catch {
      statusDot.classList.add('offline');
    }
  }

  checkConnection();
  setInterval(checkConnection, 30000);

})();
