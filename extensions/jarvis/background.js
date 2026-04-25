/**
 * JARVISIUS v2.0 Background Service Worker
 * Full sovereign AI assistant — tabs, notes, docs, bookmarks, history,
 * TTS, timers, calculations, reading mode, page analysis, and more.
 * By Alfredo Medina Hernandez | Medina Tech | Dallas TX
 */

const API_BASE = 'http://localhost:3000/api/jarvis';

// ═══════════════════════════════════════════════════════════════════════
// INIT — Side panel + context menus + keyboard shortcuts
// ═══════════════════════════════════════════════════════════════════════

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id });
});

// Context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({ id: 'jarvis-note', title: 'JARVIS: Save as Note', contexts: ['selection'] });
  chrome.contextMenus.create({ id: 'jarvis-capture', title: 'JARVIS: Capture Page', contexts: ['page'] });
  chrome.contextMenus.create({ id: 'jarvis-bookmark', title: 'JARVIS: Bookmark This', contexts: ['page'] });
  chrome.contextMenus.create({ id: 'jarvis-read', title: 'JARVIS: Read Aloud', contexts: ['selection'] });
  chrome.contextMenus.create({ id: 'jarvis-screenshot', title: 'JARVIS: Screenshot', contexts: ['page'] });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  switch (info.menuItemId) {
    case 'jarvis-note':
      await apiPost({ action: 'note', title: tab.title || 'Quick Note', content: info.selectionText || '', tags: ['context-menu'], source: 'extension' });
      notify('Note saved ✓');
      break;
    case 'jarvis-capture':
      await apiPost({ action: 'capture', url: tab.url, title: tab.title, selectedText: info.selectionText || '' });
      notify('Page captured ✓');
      break;
    case 'jarvis-bookmark':
      await chrome.bookmarks.create({ title: tab.title, url: tab.url });
      await apiPost({ action: 'note', title: `Bookmark: ${tab.title}`, content: tab.url, tags: ['bookmark'], source: 'extension' });
      notify('Bookmarked ✓');
      break;
    case 'jarvis-read':
      if (info.selectionText) chrome.tts.speak(info.selectionText, { rate: 1.0 });
      break;
    case 'jarvis-screenshot':
      await handleMessage({ type: 'SCREENSHOT' }, { tab });
      notify('Screenshot captured ✓');
      break;
  }
});

// Keyboard shortcuts
chrome.commands.onCommand.addListener(async (command) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (command === 'quick-note') {
    try {
      const [result] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => window.getSelection()?.toString() || '',
      });
      const text = result?.result || '';
      await apiPost({ action: 'note', title: tab.title || 'Quick Note', content: text || `From: ${tab.url}`, tags: ['keyboard-shortcut'], source: 'extension' });
      notify('Quick note saved ✓');
    } catch { /* ignore */ }
  } else if (command === 'quick-capture') {
    await apiPost({ action: 'capture', url: tab.url, title: tab.title, selectedText: '' });
    notify('Page captured ✓');
  }
});

// ═══════════════════════════════════════════════════════════════════════
// IN-MEMORY STATE (persists through service worker lifecycle)
// ═══════════════════════════════════════════════════════════════════════

const timers = new Map();
const clipboardHistory = [];

// ═══════════════════════════════════════════════════════════════════════
// MESSAGE HANDLER
// ═══════════════════════════════════════════════════════════════════════

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message, sender).then(sendResponse);
  return true;
});

async function handleMessage(message, sender) {
  switch (message.type) {
    // ─── TAB CONTROL ─────────────────────────────────────────────────
    case 'TAB_OPEN': {
      const tab = await chrome.tabs.create({ url: message.url });
      await apiPost({ action: 'tab', tabAction: 'open', tabId: tab.id, url: message.url, title: message.url });
      return { success: true, tabId: tab.id };
    }
    case 'TAB_SWITCH': {
      const tabs = await chrome.tabs.query({ currentWindow: true });
      if (message.tabIndex >= 0 && message.tabIndex < tabs.length) {
        await chrome.tabs.update(tabs[message.tabIndex].id, { active: true });
        await chrome.windows.update(tabs[message.tabIndex].windowId, { focused: true });
        await apiPost({ action: 'tab', tabAction: 'switch', tabId: tabs[message.tabIndex].id, title: tabs[message.tabIndex].title });
        return { success: true };
      }
      return { success: false, error: 'Tab index out of range' };
    }
    case 'TAB_CLOSE': {
      if (message.tabIndex !== undefined) {
        const tabs = await chrome.tabs.query({ currentWindow: true });
        if (message.tabIndex >= 0 && message.tabIndex < tabs.length) {
          await chrome.tabs.remove(tabs[message.tabIndex].id);
          return { success: true };
        }
      }
      if (sender.tab) {
        await chrome.tabs.remove(sender.tab.id);
        return { success: true };
      }
      const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (activeTab) await chrome.tabs.remove(activeTab.id);
      return { success: true };
    }
    case 'TAB_LIST': {
      const tabs = await chrome.tabs.query({ currentWindow: true });
      return { success: true, tabs: tabs.map((t, i) => ({ index: i, id: t.id, title: t.title, url: t.url, active: t.active, favIconUrl: t.favIconUrl })) };
    }
    case 'TAB_DUPLICATE': {
      const [act] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (act) { const nt = await chrome.tabs.duplicate(act.id); return { success: true, tabId: nt.id }; }
      return { success: false, error: 'No active tab' };
    }
    case 'TAB_PIN': {
      const [act] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (act) { await chrome.tabs.update(act.id, { pinned: !act.pinned }); return { success: true, pinned: !act.pinned }; }
      return { success: false };
    }
    case 'TAB_MUTE': {
      const [act] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (act) { await chrome.tabs.update(act.id, { muted: !act.mutedInfo?.muted }); return { success: true }; }
      return { success: false };
    }
    case 'TAB_MOVE_LEFT': {
      const [act] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (act && act.index > 0) { await chrome.tabs.move(act.id, { index: act.index - 1 }); return { success: true }; }
      return { success: false };
    }
    case 'TAB_MOVE_RIGHT': {
      const [act] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (act) { await chrome.tabs.move(act.id, { index: act.index + 1 }); return { success: true }; }
      return { success: false };
    }
    case 'TAB_RELOAD': {
      const [act] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (act) { await chrome.tabs.reload(act.id); return { success: true }; }
      return { success: false };
    }

    // ─── PAGE CONTEXT ────────────────────────────────────────────────
    case 'GET_PAGE_CONTEXT': {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) return { success: false, error: 'No active tab' };
      try {
        const [result] = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => ({
            url: window.location.href,
            title: document.title,
            selectedText: window.getSelection()?.toString() || '',
            metaDescription: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
            h1: document.querySelector('h1')?.textContent || '',
            wordCount: document.body?.innerText?.split(/\s+/).length || 0,
            links: document.querySelectorAll('a[href]').length,
            images: document.querySelectorAll('img').length,
          }),
        });
        return { success: true, context: result.result };
      } catch {
        return { success: true, context: { url: tab.url, title: tab.title, selectedText: '' } };
      }
    }

    // ─── CAPTURE + SCREENSHOT ────────────────────────────────────────
    case 'CAPTURE_PAGE': {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) return { success: false, error: 'No active tab' };
      const result = await apiPost({ action: 'capture', url: tab.url, title: tab.title, selectedText: message.selectedText || '' });
      return { success: true, result };
    }
    case 'SCREENSHOT': {
      try {
        const dataUrl = await chrome.tabs.captureVisibleTab(null, { format: 'png' });
        const result = await apiPost({
          action: 'document',
          title: 'Screenshot ' + new Date().toISOString().replace('T', ' ').slice(0, 19),
          type: 'screenshot',
          content: dataUrl,
          source: 'extension-screenshot',
        });
        return { success: true, result, screenshot: dataUrl };
      } catch (e) {
        return { success: false, error: String(e) };
      }
    }

    // ─── BOOKMARKS ───────────────────────────────────────────────────
    case 'BOOKMARK_ADD': {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) return { success: false };
      const bm = await chrome.bookmarks.create({ title: message.title || tab.title, url: message.url || tab.url });
      await apiPost({ action: 'note', title: `🔖 ${bm.title}`, content: bm.url, tags: ['bookmark'], source: 'extension' });
      return { success: true, bookmark: bm };
    }
    case 'BOOKMARK_LIST': {
      const tree = await chrome.bookmarks.getTree();
      const flat = [];
      function walk(nodes) { for (const n of nodes) { if (n.url) flat.push({ id: n.id, title: n.title, url: n.url, dateAdded: n.dateAdded }); if (n.children) walk(n.children); } }
      walk(tree);
      return { success: true, bookmarks: flat.slice(-50).reverse() };
    }
    case 'BOOKMARK_SEARCH': {
      const results = await chrome.bookmarks.search(message.query || '');
      return { success: true, bookmarks: results.slice(0, 30) };
    }

    // ─── HISTORY ─────────────────────────────────────────────────────
    case 'HISTORY_SEARCH': {
      const results = await chrome.history.search({ text: message.query || '', maxResults: message.limit || 30 });
      return { success: true, history: results };
    }
    case 'HISTORY_RECENT': {
      const results = await chrome.history.search({ text: '', maxResults: 30, startTime: Date.now() - 86400000 });
      return { success: true, history: results };
    }

    // ─── TTS (Text-to-Speech) ────────────────────────────────────────
    case 'TTS_SPEAK': {
      chrome.tts.speak(message.text || '', {
        rate: message.rate || 1.0,
        pitch: message.pitch || 1.0,
        volume: message.volume || 1.0,
        lang: message.lang || 'en-US',
        onEvent: (event) => { if (event.type === 'end' || event.type === 'error') { /* done */ } },
      });
      return { success: true };
    }
    case 'TTS_STOP': {
      chrome.tts.stop();
      return { success: true };
    }
    case 'TTS_READ_PAGE': {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) return { success: false };
      try {
        const [result] = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            const article = document.querySelector('article') || document.querySelector('main') || document.body;
            return article.innerText.slice(0, 5000);
          },
        });
        chrome.tts.speak(result.result || '', { rate: message.rate || 1.0 });
        return { success: true };
      } catch {
        return { success: false, error: 'Cannot access page' };
      }
    }

    // ─── TIMERS / ALARMS ─────────────────────────────────────────────
    case 'TIMER_SET': {
      const name = message.name || `timer-${Date.now()}`;
      const minutes = message.minutes || 1;
      await chrome.alarms.create(name, { delayInMinutes: minutes });
      timers.set(name, { minutes, setAt: Date.now(), label: message.label || name });
      return { success: true, name, minutes };
    }
    case 'TIMER_LIST': {
      const alarms = await chrome.alarms.getAll();
      return { success: true, timers: alarms.map(a => ({ name: a.name, scheduledTime: a.scheduledTime, label: timers.get(a.name)?.label || a.name })) };
    }
    case 'TIMER_CLEAR': {
      if (message.name) { await chrome.alarms.clear(message.name); timers.delete(message.name); }
      else { await chrome.alarms.clearAll(); timers.clear(); }
      return { success: true };
    }

    // ─── CLIPBOARD HISTORY ───────────────────────────────────────────
    case 'CLIP_SAVE': {
      clipboardHistory.unshift({ text: message.text, timestamp: Date.now() });
      if (clipboardHistory.length > 50) clipboardHistory.pop();
      return { success: true };
    }
    case 'CLIP_LIST': {
      return { success: true, clipboard: clipboardHistory.slice(0, 20) };
    }

    // ─── PAGE ANALYSIS ──────────────────────────────────────────────
    case 'ANALYZE_PAGE': {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) return { success: false };
      try {
        const [result] = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            const text = document.body?.innerText || '';
            const words = text.split(/\s+/).filter(Boolean);
            const headings = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).map(h => ({ tag: h.tagName, text: h.textContent?.slice(0, 80) }));
            const links = document.querySelectorAll('a[href]').length;
            const images = document.querySelectorAll('img').length;
            const scripts = document.querySelectorAll('script').length;
            const styles = document.querySelectorAll('link[rel="stylesheet"]').length;
            const meta = {};
            document.querySelectorAll('meta[name],meta[property]').forEach(m => {
              meta[m.getAttribute('name') || m.getAttribute('property')] = m.getAttribute('content')?.slice(0, 200);
            });
            const forms = document.querySelectorAll('form').length;
            const inputs = document.querySelectorAll('input,textarea,select').length;
            return {
              url: location.href, title: document.title,
              wordCount: words.length, charCount: text.length,
              readingTime: Math.ceil(words.length / 200) + ' min',
              headings, links, images, scripts, styles, forms, inputs, meta,
              language: document.documentElement.lang || 'unknown',
              hasViewport: !!document.querySelector('meta[name="viewport"]'),
            };
          },
        });
        return { success: true, analysis: result.result };
      } catch (e) {
        return { success: false, error: String(e) };
      }
    }

    // ─── EXTRACT PAGE CONTENT ────────────────────────────────────────
    case 'EXTRACT_TEXT': {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) return { success: false };
      try {
        const [result] = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            const article = document.querySelector('article') || document.querySelector('[role="main"]') || document.querySelector('main') || document.body;
            return { text: article.innerText.slice(0, 10000), title: document.title, url: location.href };
          },
        });
        return { success: true, ...result.result };
      } catch {
        return { success: false };
      }
    }
    case 'EXTRACT_LINKS': {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) return { success: false };
      try {
        const [result] = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => Array.from(document.querySelectorAll('a[href]')).map(a => ({ href: a.href, text: a.textContent?.trim().slice(0, 80) })).slice(0, 100),
        });
        return { success: true, links: result.result };
      } catch {
        return { success: false };
      }
    }
    case 'EXTRACT_IMAGES': {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) return { success: false };
      try {
        const [result] = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => Array.from(document.querySelectorAll('img[src]')).map(i => ({ src: i.src, alt: i.alt, width: i.naturalWidth, height: i.naturalHeight })).slice(0, 50),
        });
        return { success: true, images: result.result };
      } catch {
        return { success: false };
      }
    }

    // ─── HIGHLIGHT TEXT ON PAGE ───────────────────────────────────────
    case 'HIGHLIGHT': {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) return { success: false };
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (query) => {
          const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
          while (walk.nextNode()) {
            const node = walk.currentNode;
            if (node.textContent && node.textContent.toLowerCase().includes(query.toLowerCase())) {
              const span = document.createElement('mark');
              span.style.background = 'rgba(0,212,255,0.3)';
              span.style.padding = '2px';
              const parent = node.parentNode;
              const parts = node.textContent.split(new RegExp(`(${query})`, 'gi'));
              const frag = document.createDocumentFragment();
              parts.forEach(part => {
                if (part.toLowerCase() === query.toLowerCase()) {
                  const m = span.cloneNode();
                  m.textContent = part;
                  frag.appendChild(m);
                } else {
                  frag.appendChild(document.createTextNode(part));
                }
              });
              parent.replaceChild(frag, node);
            }
          }
        },
        args: [message.query],
      });
      return { success: true };
    }

    // ─── ZOOM CONTROL ────────────────────────────────────────────────
    case 'ZOOM': {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) return { success: false };
      const current = await chrome.tabs.getZoom(tab.id);
      const level = message.level || (message.direction === 'in' ? current + 0.1 : message.direction === 'out' ? current - 0.1 : 1.0);
      await chrome.tabs.setZoom(tab.id, Math.max(0.25, Math.min(5.0, level)));
      return { success: true, zoom: level };
    }

    // ─── DARK MODE TOGGLE ────────────────────────────────────────────
    case 'DARK_MODE': {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) return { success: false };
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          let style = document.getElementById('jarvis-dark-mode');
          if (style) { style.remove(); return false; }
          style = document.createElement('style');
          style.id = 'jarvis-dark-mode';
          style.textContent = 'html { filter: invert(0.9) hue-rotate(180deg); } img, video, canvas, svg { filter: invert(1) hue-rotate(-180deg); }';
          document.head.appendChild(style);
          return true;
        },
      });
      return { success: true };
    }

    // ─── READING MODE ────────────────────────────────────────────────
    case 'READING_MODE': {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) return { success: false };
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          let overlay = document.getElementById('jarvis-reader');
          if (overlay) { overlay.remove(); return; }
          const article = document.querySelector('article') || document.querySelector('[role="main"]') || document.querySelector('main') || document.body;
          const text = article.innerHTML;
          overlay = document.createElement('div');
          overlay.id = 'jarvis-reader';
          overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:999999;background:#1a1a2e;color:#e0e0e0;overflow-y:auto;padding:40px;font-family:Georgia,serif;font-size:18px;line-height:1.8;';
          overlay.innerHTML = `<div style="max-width:680px;margin:0 auto;"><button onclick="this.parentElement.parentElement.remove()" style="position:fixed;top:20px;right:20px;background:#00d4ff;color:#0a0a0f;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;font-size:14px;">✕ Close</button><h1 style="color:#00d4ff;margin-bottom:20px;">${document.title}</h1>${text}</div>`;
          document.body.appendChild(overlay);
        },
      });
      return { success: true };
    }

    // ─── NOTIFICATIONS ───────────────────────────────────────────────
    case 'NOTIFY': {
      notify(message.text, message.title);
      return { success: true };
    }

    // ─── API PROXYING ────────────────────────────────────────────────
    case 'API_POST': {
      const result = await apiPost(message.body);
      return { success: true, result };
    }
    case 'API_GET': {
      const result = await apiGet(message.action, message.params);
      return { success: true, result };
    }

    default:
      return { success: false, error: `Unknown message type: ${message.type}` };
  }
}

// ═══════════════════════════════════════════════════════════════════════
// ALARMS (Timer completion)
// ═══════════════════════════════════════════════════════════════════════

chrome.alarms.onAlarm.addListener((alarm) => {
  const info = timers.get(alarm.name);
  const label = info?.label || alarm.name;
  notify(`⏰ Timer "${label}" is done!`, 'JARVISIUS Timer');
  timers.delete(alarm.name);
});

// ═══════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════

function notify(message, title) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/jarvis-128.png',
    title: title || 'JARVISIUS',
    message: message,
  });
}

async function apiPost(body) {
  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return await res.json();
  } catch (e) {
    console.error('JARVIS API error:', e);
    return { error: String(e) };
  }
}

async function apiGet(action, params = {}) {
  try {
    const url = new URL(API_BASE);
    url.searchParams.set('action', action);
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, String(v));
    }
    const res = await fetch(url.toString());
    return await res.json();
  } catch (e) {
    console.error('JARVIS API error:', e);
    return { error: String(e) };
  }
}
