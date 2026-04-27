/**
 * JARVISIUS v2.0 Content Script
 * Floating action button (FAB) on every page with expanded quick actions
 * Captures page context, selected text, and provides instant tools
 */

(function() {
  'use strict';
  if (document.getElementById('jarvis-fab')) return;

  const fab = document.createElement('div');
  fab.id = 'jarvis-fab';
  fab.innerHTML = `
    <div id="jarvis-fab-btn" title="JARVISIUS v2 — Click to open (Ctrl+Shift+J)">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="13" stroke="#00d4ff" stroke-width="1.5" fill="rgba(10,10,15,0.9)"/>
        <circle cx="14" cy="14" r="5" fill="#00d4ff" opacity="0.8"/>
        <circle cx="14" cy="14" r="8" stroke="#00d4ff" stroke-width="0.5" opacity="0.4"/>
        <line x1="14" y1="1" x2="14" y2="5" stroke="#00d4ff" stroke-width="1" opacity="0.6"/>
        <line x1="14" y1="23" x2="14" y2="27" stroke="#00d4ff" stroke-width="1" opacity="0.6"/>
        <line x1="1" y1="14" x2="5" y2="14" stroke="#00d4ff" stroke-width="1" opacity="0.6"/>
        <line x1="23" y1="14" x2="27" y2="14" stroke="#00d4ff" stroke-width="1" opacity="0.6"/>
      </svg>
    </div>
    <div id="jarvis-quick-actions" style="display:none;">
      <button data-action="capture" title="Capture Page">📄</button>
      <button data-action="screenshot" title="Screenshot">📸</button>
      <button data-action="note" title="Quick Note from Selection">📝</button>
      <button data-action="bookmark" title="Bookmark This Page">🔖</button>
      <button data-action="read" title="Read Aloud">🔊</button>
      <button data-action="dark" title="Dark Mode">🌙</button>
      <button data-action="reader" title="Reading Mode">📖</button>
      <button data-action="panel" title="Open JARVIS Panel">💬</button>
    </div>
  `;
  document.body.appendChild(fab);

  const fabBtn = document.getElementById('jarvis-fab-btn');
  const quickActions = document.getElementById('jarvis-quick-actions');
  let isOpen = false;

  fabBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    isOpen = !isOpen;
    quickActions.style.display = isOpen ? 'flex' : 'none';
    fabBtn.style.transform = isOpen ? 'rotate(45deg)' : 'rotate(0deg)';
  });

  document.addEventListener('click', () => {
    if (isOpen) { isOpen = false; quickActions.style.display = 'none'; fabBtn.style.transform = 'rotate(0deg)'; }
  });

  quickActions.addEventListener('click', async (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    e.stopPropagation();
    const action = btn.dataset.action;
    const selectedText = window.getSelection()?.toString() || '';

    switch (action) {
      case 'capture':
        chrome.runtime.sendMessage({ type: 'CAPTURE_PAGE', selectedText });
        showToast('Page captured ✓');
        break;
      case 'screenshot':
        chrome.runtime.sendMessage({ type: 'SCREENSHOT' });
        showToast('Screenshot taken ✓');
        break;
      case 'note':
        chrome.runtime.sendMessage({
          type: 'API_POST',
          body: { action: 'note', title: document.title || 'Quick Note', content: selectedText || `Note from: ${window.location.href}`, tags: ['quick', 'extension'], source: 'extension' },
        });
        showToast(selectedText ? 'Selection saved as note ✓' : 'Note saved ✓');
        break;
      case 'bookmark':
        chrome.runtime.sendMessage({ type: 'BOOKMARK_ADD' });
        showToast('Bookmarked ✓');
        break;
      case 'read':
        if (selectedText) { chrome.runtime.sendMessage({ type: 'TTS_SPEAK', text: selectedText }); showToast('🔊 Reading selection...'); }
        else { chrome.runtime.sendMessage({ type: 'TTS_READ_PAGE' }); showToast('🔊 Reading page...'); }
        break;
      case 'dark':
        chrome.runtime.sendMessage({ type: 'DARK_MODE' });
        showToast('🌙 Dark mode toggled');
        break;
      case 'reader':
        chrome.runtime.sendMessage({ type: 'READING_MODE' });
        showToast('📖 Reading mode toggled');
        break;
      case 'panel':
        chrome.runtime.sendMessage({ type: 'OPEN_PANEL' });
        break;
    }

    isOpen = false;
    quickActions.style.display = 'none';
    fabBtn.style.transform = 'rotate(0deg)';
  });

  // Draggable FAB
  let isDragging = false, dragStartX, dragStartY, fabStartX, fabStartY;
  fabBtn.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    isDragging = false;
    dragStartX = e.clientX; dragStartY = e.clientY;
    const rect = fab.getBoundingClientRect();
    fabStartX = rect.left; fabStartY = rect.top;
    const onMove = (ev) => {
      const dx = ev.clientX - dragStartX, dy = ev.clientY - dragStartY;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        isDragging = true;
        fab.style.right = 'auto'; fab.style.bottom = 'auto';
        fab.style.left = (fabStartX + dx) + 'px';
        fab.style.top = (fabStartY + dy) + 'px';
      }
    };
    const onUp = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });
  fabBtn.addEventListener('click', (e) => { if (isDragging) { e.stopPropagation(); isDragging = false; } });

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'jarvis-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('jarvis-toast-show'), 10);
    setTimeout(() => { toast.classList.remove('jarvis-toast-show'); setTimeout(() => toast.remove(), 300); }, 2000);
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'TOAST') showToast(message.text);
  });
})();
