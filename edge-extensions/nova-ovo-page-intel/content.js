/* NOVA OVO Page Intelligence — Content Script */

(function () {
  'use strict';

  if (window.__novaOvoPageIntelLoaded) return;
  window.__novaOvoPageIntelLoaded = true;

  const HIGHLIGHT_STORAGE_KEY = 'nova_highlights';
  let highlights = [];
  let highlightColor = '#10b981';

  /* ── Load Settings ─────────────────────────────────────── */

  chrome.storage.sync.get(['highlightColor'], (result) => {
    if (result.highlightColor) highlightColor = result.highlightColor;
  });

  /* ── DOM Injection ─────────────────────────────────────── */

  function injectUI() {
    // Floating Action Button
    if (!document.getElementById('nova-fab')) {
      const fab = document.createElement('button');
      fab.id = 'nova-fab';
      fab.textContent = 'N';
      fab.title = 'NOVA OVO Page Intelligence';
      fab.addEventListener('click', () => {
        chrome.runtime.sendMessage({ type: 'NOVA_OPEN_POPUP' });
      });
      document.body.appendChild(fab);
    }

    // Selection Tooltip
    if (!document.getElementById('nova-selection-tooltip')) {
      const tooltip = document.createElement('div');
      tooltip.id = 'nova-selection-tooltip';
      tooltip.innerHTML = `
        <button id="nova-tooltip-save">💾 Save Memory</button>
        <button id="nova-tooltip-highlight">🖍️ Highlight</button>
        <button id="nova-tooltip-analyze">🔍 Analyze</button>
      `;
      document.body.appendChild(tooltip);

      document.getElementById('nova-tooltip-save').addEventListener('click', () => {
        saveSelectionToMemory();
        hideTooltip();
      });
      document.getElementById('nova-tooltip-highlight').addEventListener('click', () => {
        highlightSelection();
        hideTooltip();
      });
      document.getElementById('nova-tooltip-analyze').addEventListener('click', () => {
        analyzeSelection();
        hideTooltip();
      });
    }

    // Toast Notification
    if (!document.getElementById('nova-toast')) {
      const toast = document.createElement('div');
      toast.id = 'nova-toast';
      toast.innerHTML = '<div class="nova-toast-title"></div><div class="nova-toast-body"></div>';
      document.body.appendChild(toast);
    }

    // Analysis Overlay
    if (!document.getElementById('nova-analysis-overlay')) {
      const overlay = document.createElement('div');
      overlay.id = 'nova-analysis-overlay';
      overlay.innerHTML = `
        <div class="nova-overlay-header">
          <span class="nova-overlay-title">NOVA OVO Analysis</span>
          <button class="nova-overlay-close">✕</button>
        </div>
        <div class="nova-overlay-body"></div>
      `;
      document.body.appendChild(overlay);

      overlay.querySelector('.nova-overlay-close').addEventListener('click', () => {
        overlay.classList.remove('nova-overlay--visible');
      });
    }
  }

  /* ── Selection Detection ───────────────────────────────── */

  let tooltipTimeout = null;

  document.addEventListener('mouseup', (e) => {
    if (e.target.closest('#nova-selection-tooltip')) return;

    clearTimeout(tooltipTimeout);
    tooltipTimeout = setTimeout(() => {
      const selection = window.getSelection();
      const text = selection ? selection.toString().trim() : '';

      if (text.length > 3) {
        showTooltip(e.clientX, e.clientY);
      } else {
        hideTooltip();
      }
    }, 200);
  });

  document.addEventListener('mousedown', (e) => {
    if (!e.target.closest('#nova-selection-tooltip')) {
      hideTooltip();
    }
  });

  function showTooltip(x, y) {
    const tooltip = document.getElementById('nova-selection-tooltip');
    if (!tooltip) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let posX = x + 8;
    let posY = y - 50;
    if (posX + 280 > vw) posX = vw - 290;
    if (posY < 10) posY = y + 20;
    if (posY + 40 > vh) posY = vh - 50;

    tooltip.style.left = posX + 'px';
    tooltip.style.top = posY + 'px';
    tooltip.classList.add('nova-tooltip--visible');
  }

  function hideTooltip() {
    const tooltip = document.getElementById('nova-selection-tooltip');
    if (tooltip) tooltip.classList.remove('nova-tooltip--visible');
  }

  /* ── Toast Notifications ───────────────────────────────── */

  function showToast(title, body, isError) {
    const toast = document.getElementById('nova-toast');
    if (!toast) return;
    toast.querySelector('.nova-toast-title').textContent = title;
    toast.querySelector('.nova-toast-body').textContent = body;
    toast.classList.toggle('nova-toast--error', !!isError);
    toast.classList.add('nova-toast--visible');
    setTimeout(() => toast.classList.remove('nova-toast--visible'), 4000);
  }

  /* ── Analysis Overlay ──────────────────────────────────── */

  function showAnalysisOverlay(text) {
    const overlay = document.getElementById('nova-analysis-overlay');
    if (!overlay) return;
    overlay.querySelector('.nova-overlay-body').textContent = text;
    overlay.classList.add('nova-overlay--visible');
  }

  /* ── Highlight Functionality ───────────────────────────── */

  function highlightSelection() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const text = selection.toString().trim();
    if (!text) return;

    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.className = 'nova-highlight';
    span.style.backgroundColor = hexToRgba(highlightColor, 0.3);
    span.style.borderBottomColor = highlightColor;
    span.dataset.novaHighlight = 'true';
    span.dataset.timestamp = Date.now().toString();

    try {
      range.surroundContents(span);
    } catch {
      // Range spans multiple elements; wrap extracted contents instead
      const fragment = range.extractContents();
      span.appendChild(fragment);
      range.insertNode(span);
    }

    selection.removeAllRanges();

    const entry = {
      text,
      timestamp: Date.now(),
      url: window.location.href,
      color: highlightColor,
    };
    highlights.push(entry);
    saveHighlights();
    showToast('NOVA OVO', 'Passage highlighted');
  }

  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function getHighlightStorageKey() {
    const utf8Bytes = new TextEncoder().encode(window.location.href);
    let binary = '';
    utf8Bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return HIGHLIGHT_STORAGE_KEY + '_' + btoa(binary).slice(0, 60);
  }

  function saveHighlights() {
    const storageKey = getHighlightStorageKey();
    chrome.storage.local.set({ [storageKey]: highlights });
  }

  function loadHighlights() {
    const storageKey = getHighlightStorageKey();
    chrome.storage.local.get([storageKey], (result) => {
      if (result[storageKey]) {
        highlights = result[storageKey];
      }
    });
  }

  /* ── Save Selection to Memory ──────────────────────────── */

  function saveSelectionToMemory() {
    const selection = window.getSelection();
    const text = selection ? selection.toString().trim() : '';
    if (!text) return;

    chrome.runtime.sendMessage(
      {
        type: 'NOVA_API_REQUEST',
        endpoint: '/api/memory',
        method: 'POST',
        body: {
          action: 'store',
          content: text,
          type: 'semantic',
          tags: ['page-capture', 'selection', extractDomain()],
        },
      },
      (response) => {
        if (response && response.success) {
          chrome.runtime.sendMessage({ type: 'NOVA_INCREMENT_MEMORY' });
          showToast('NOVA OVO', 'Selection saved to Memory Temple');
        } else {
          showToast('Error', (response && response.error) || 'Failed to save', true);
        }
      }
    );
  }

  /* ── Analyze Selection ─────────────────────────────────── */

  function analyzeSelection() {
    const selection = window.getSelection();
    const text = selection ? selection.toString().trim() : '';
    if (!text) return;

    showToast('NOVA OVO', 'Analyzing selection...');

    chrome.runtime.sendMessage(
      {
        type: 'NOVA_API_REQUEST',
        endpoint: '/api/chat',
        method: 'POST',
        body: {
          message: `Analyze the following text. Provide: reading level, main topics, sentiment, key entities, and a brief summary.\n\n"${text}"`,
          useConsensus: false,
        },
      },
      (response) => {
        if (response && response.success) {
          const msg =
            response.data.response ||
            response.data.message ||
            JSON.stringify(response.data, null, 2);
          showAnalysisOverlay(msg);
        } else {
          showToast('Error', (response && response.error) || 'Analysis failed', true);
        }
      }
    );
  }

  /* ── Content Extraction ────────────────────────────────── */

  function extractPageContent() {
    const title = document.title || '';
    const url = window.location.href;
    const domain = extractDomain();

    // Full text
    const bodyClone = document.body.cloneNode(true);
    const removeTags = bodyClone.querySelectorAll(
      'script, style, noscript, iframe, #nova-fab, #nova-selection-tooltip, #nova-toast, #nova-analysis-overlay'
    );
    removeTags.forEach((el) => el.remove());
    const text = bodyClone.innerText || bodyClone.textContent || '';

    // Headings
    const headings = [];
    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
      headings.push({
        level: parseInt(h.tagName.charAt(1)),
        text: h.textContent.trim().substring(0, 200),
      });
    });

    // Links
    const links = [];
    document.querySelectorAll('a[href]').forEach((a) => {
      const href = a.href;
      if (href && !href.startsWith('javascript:')) {
        links.push({
          text: a.textContent.trim().substring(0, 100),
          href: href.substring(0, 500),
        });
      }
    });

    // Images
    const images = [];
    document.querySelectorAll('img[src]').forEach((img) => {
      images.push({
        src: img.src.substring(0, 500),
        alt: (img.alt || '').substring(0, 200),
      });
    });

    // Meta tags
    const metaTags = {};
    document.querySelectorAll('meta[name], meta[property]').forEach((meta) => {
      const key = meta.getAttribute('name') || meta.getAttribute('property');
      const val = meta.getAttribute('content');
      if (key && val) metaTags[key] = val.substring(0, 500);
    });

    // Selected text
    const selection = window.getSelection();
    const selectedText = selection ? selection.toString().trim() : '';

    // Word count
    const words = text.split(/\s+/).filter((w) => w.length > 0);
    const wordCount = words.length;
    const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 250));

    return {
      title,
      url,
      domain,
      text,
      headings,
      links,
      images,
      metaTags,
      selectedText,
      wordCount,
      readingTimeMinutes,
      linkCount: links.length,
      imageCount: images.length,
    };
  }

  function extractDomain() {
    try {
      return new URL(window.location.href).hostname;
    } catch {
      return window.location.hostname;
    }
  }

  /* ── Message Listeners ─────────────────────────────────── */

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'NOVA_GET_PAGE_CONTENT') {
      sendResponse(extractPageContent());
      return false;
    }

    if (message.type === 'NOVA_GET_SELECTED_TEXT') {
      const selection = window.getSelection();
      sendResponse({ text: selection ? selection.toString().trim() : '' });
      return false;
    }

    if (message.type === 'NOVA_HIGHLIGHT_TEXT') {
      highlightSelection();
      sendResponse({ success: true });
      return false;
    }

    if (message.type === 'NOVA_GET_HIGHLIGHTS') {
      sendResponse({ highlights });
      return false;
    }

    if (message.type === 'NOVA_CLEAR_HIGHLIGHTS') {
      document.querySelectorAll('[data-nova-highlight]').forEach((el) => {
        const parent = el.parentNode;
        while (el.firstChild) parent.insertBefore(el.firstChild, el);
        parent.removeChild(el);
      });
      highlights = [];
      saveHighlights();
      sendResponse({ success: true });
      return false;
    }

    if (message.type === 'NOVA_SCROLL_TO_HIGHLIGHT') {
      const index = message.index;
      const els = document.querySelectorAll('[data-nova-highlight]');
      if (els[index]) {
        els[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
        els[index].style.transition = 'outline 0.3s ease';
        els[index].style.outline = '2px solid #10b981';
        setTimeout(() => {
          els[index].style.outline = 'none';
        }, 2000);
      }
      sendResponse({ success: true });
      return false;
    }

    if (message.type === 'NOVA_SET_HIGHLIGHT_COLOR') {
      highlightColor = message.color;
      sendResponse({ success: true });
      return false;
    }

    if (message.type === 'NOVA_ANALYSIS_RESULT') {
      const msg =
        message.data.response || message.data.message || JSON.stringify(message.data, null, 2);
      showAnalysisOverlay(msg);
      return false;
    }

    if (message.type === 'NOVA_SAVE_SUCCESS') {
      showToast('NOVA OVO', message.message || 'Saved successfully');
      return false;
    }

    if (message.type === 'NOVA_ERROR') {
      showToast('Error', message.error || 'An error occurred', true);
      return false;
    }
  });

  /* ── Init ──────────────────────────────────────────────── */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      injectUI();
      loadHighlights();
    });
  } else {
    injectUI();
    loadHighlights();
  }
})();
