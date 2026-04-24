/**
 * JARVISIUS Background Service Worker
 * Handles tab control, URL opening, message routing between content + side panel
 */

const API_BASE = 'http://localhost:3000/api/jarvis';

// Open side panel when extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id });
});

// Set up side panel behavior
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

// Listen for messages from content script and side panel
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message, sender).then(sendResponse);
  return true; // Keep message channel open for async response
});

async function handleMessage(message, sender) {
  switch (message.type) {
    case 'TAB_OPEN': {
      const tab = await chrome.tabs.create({ url: message.url });
      await apiPost({ action: 'tab', tabAction: 'open', tabId: tab.id, url: message.url, title: message.url });
      return { success: true, tabId: tab.id };
    }

    case 'TAB_SWITCH': {
      const tabs = await chrome.tabs.query({});
      if (message.tabIndex >= 0 && message.tabIndex < tabs.length) {
        await chrome.tabs.update(tabs[message.tabIndex].id, { active: true });
        await apiPost({ action: 'tab', tabAction: 'switch', tabId: tabs[message.tabIndex].id, title: tabs[message.tabIndex].title });
        return { success: true };
      }
      return { success: false, error: 'Tab index out of range' };
    }

    case 'TAB_CLOSE': {
      if (sender.tab) {
        await chrome.tabs.remove(sender.tab.id);
        await apiPost({ action: 'tab', tabAction: 'close', tabId: sender.tab.id });
        return { success: true };
      }
      const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (activeTab) {
        await chrome.tabs.remove(activeTab.id);
        await apiPost({ action: 'tab', tabAction: 'close', tabId: activeTab.id });
      }
      return { success: true };
    }

    case 'TAB_LIST': {
      const tabs = await chrome.tabs.query({ currentWindow: true });
      return { success: true, tabs: tabs.map((t, i) => ({ index: i, id: t.id, title: t.title, url: t.url, active: t.active })) };
    }

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
          }),
        });
        return { success: true, context: result.result };
      } catch {
        return { success: true, context: { url: tab.url, title: tab.title, selectedText: '' } };
      }
    }

    case 'CAPTURE_PAGE': {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) return { success: false, error: 'No active tab' };
      const result = await apiPost({ action: 'capture', url: tab.url, title: tab.title, selectedText: message.selectedText || '' });
      return { success: true, result };
    }

    case 'SCREENSHOT': {
      const dataUrl = await chrome.tabs.captureVisibleTab(null, { format: 'png' });
      const result = await apiPost({
        action: 'document',
        title: 'Screenshot ' + new Date().toISOString().split('T')[0],
        type: 'screenshot',
        content: dataUrl,
        source: 'extension-screenshot',
      });
      return { success: true, result, screenshot: dataUrl };
    }

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
