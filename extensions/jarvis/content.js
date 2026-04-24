/**
 * JARVISIUS Content Script
 * Injects floating action button (FAB) on every page
 * Captures page context and selected text
 */

(function() {
  'use strict';

  // Avoid double injection
  if (document.getElementById('jarvis-fab')) return;

  // Create FAB
  const fab = document.createElement('div');
  fab.id = 'jarvis-fab';
  fab.innerHTML = `
    <div id="jarvis-fab-btn" title="JARVISIUS — Click to open">
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
      <button data-action="note" title="Quick Note">📝</button>
      <button data-action="panel" title="Open Panel">💬</button>
    </div>
  `;
  document.body.appendChild(fab);

  // FAB click — toggle quick actions
  const fabBtn = document.getElementById('jarvis-fab-btn');
  const quickActions = document.getElementById('jarvis-quick-actions');
  let isOpen = false;

  fabBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    isOpen = !isOpen;
    quickActions.style.display = isOpen ? 'flex' : 'none';
    fabBtn.style.transform = isOpen ? 'rotate(45deg)' : 'rotate(0deg)';
  });

  // Close on click outside
  document.addEventListener('click', () => {
    if (isOpen) {
      isOpen = false;
      quickActions.style.display = 'none';
      fabBtn.style.transform = 'rotate(0deg)';
    }
  });

  // Quick action handlers
  quickActions.addEventListener('click', async (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    e.stopPropagation();
    const action = btn.dataset.action;

    switch (action) {
      case 'capture': {
        const selectedText = window.getSelection()?.toString() || '';
        chrome.runtime.sendMessage({
          type: 'CAPTURE_PAGE',
          selectedText,
        });
        showToast('Page captured ✓');
        break;
      }
      case 'screenshot': {
        chrome.runtime.sendMessage({ type: 'SCREENSHOT' });
        showToast('Screenshot taken ✓');
        break;
      }
      case 'note': {
        const selectedText = window.getSelection()?.toString() || '';
        const title = document.title || 'Quick Note';
        chrome.runtime.sendMessage({
          type: 'API_POST',
          body: {
            action: 'note',
            title: title,
            content: selectedText || `Note from: ${window.location.href}`,
            tags: ['quick', 'extension'],
            source: 'extension',
          },
        });
        showToast('Note saved ✓');
        break;
      }
      case 'panel': {
        chrome.runtime.sendMessage({ type: 'OPEN_PANEL' });
        break;
      }
    }

    // Close quick actions after click
    isOpen = false;
    quickActions.style.display = 'none';
    fabBtn.style.transform = 'rotate(0deg)';
  });

  // Toast notification
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'jarvis-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('jarvis-toast-show'), 10);
    setTimeout(() => {
      toast.classList.remove('jarvis-toast-show');
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }

  // Listen for messages from background
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'TOAST') {
      showToast(message.text);
    }
  });
})();
