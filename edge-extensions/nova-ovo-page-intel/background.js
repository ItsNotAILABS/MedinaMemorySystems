/* NOVA OVO Page Intelligence — Background Service Worker */

const DEFAULT_API_HOST = 'http://localhost:3000';
let sessionMemoryCount = 0;

/* ── Context Menus ─────────────────────────────────────────── */

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'nova-analyze-selection',
    title: 'Analyze with NOVA OVO',
    contexts: ['selection'],
  });

  chrome.contextMenus.create({
    id: 'nova-save-selection',
    title: 'Save to Memory Temple',
    contexts: ['selection'],
  });

  chrome.contextMenus.create({
    id: 'nova-summarize-page',
    title: 'Summarize Page',
    contexts: ['page'],
  });

  chrome.storage.sync.get(['apiHost'], (result) => {
    if (!result.apiHost) {
      chrome.storage.sync.set({ apiHost: DEFAULT_API_HOST });
    }
  });

  updateBadge();
});

/* ── Context Menu Handler ──────────────────────────────────── */

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const apiHost = await getApiHost();

  if (info.menuItemId === 'nova-analyze-selection') {
    const text = info.selectionText;
    if (!text) return;
    try {
      const result = await apiRequest(apiHost, '/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: `Analyze the following text. Provide: reading level, main topics, sentiment, key entities, and a brief summary.\n\n"${text}"`,
          useConsensus: false,
        }),
      });
      chrome.tabs.sendMessage(tab.id, {
        type: 'NOVA_ANALYSIS_RESULT',
        data: result,
        sourceText: text,
      });
    } catch (err) {
      chrome.tabs.sendMessage(tab.id, {
        type: 'NOVA_ERROR',
        error: err.message,
      });
    }
  }

  if (info.menuItemId === 'nova-save-selection') {
    const text = info.selectionText;
    if (!text) return;
    try {
      await apiRequest(apiHost, '/api/memory', {
        method: 'POST',
        body: JSON.stringify({
          action: 'store',
          content: text,
          type: 'semantic',
          tags: ['page-capture', 'selection'],
        }),
      });
      sessionMemoryCount++;
      updateBadge();
      chrome.tabs.sendMessage(tab.id, {
        type: 'NOVA_SAVE_SUCCESS',
        message: 'Selection saved to Memory Temple',
      });
    } catch (err) {
      chrome.tabs.sendMessage(tab.id, {
        type: 'NOVA_ERROR',
        error: err.message,
      });
    }
  }

  if (info.menuItemId === 'nova-summarize-page') {
    chrome.tabs.sendMessage(tab.id, { type: 'NOVA_GET_PAGE_CONTENT' }, async (response) => {
      if (chrome.runtime.lastError || !response) return;
      try {
        const result = await apiRequest(apiHost, '/api/chat', {
          method: 'POST',
          body: JSON.stringify({
            message: `Summarize the following webpage content. Include key points, main topics, and overall purpose.\n\nTitle: ${response.title}\nURL: ${response.url}\n\n${response.text.substring(0, 8000)}`,
            useConsensus: false,
          }),
        });
        chrome.tabs.sendMessage(tab.id, {
          type: 'NOVA_ANALYSIS_RESULT',
          data: result,
          sourceText: 'Page Summary',
        });
      } catch (err) {
        chrome.tabs.sendMessage(tab.id, {
          type: 'NOVA_ERROR',
          error: err.message,
        });
      }
    });
  }
});

/* ── Message Handler (API Proxy) ───────────────────────────── */

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'NOVA_API_REQUEST') {
    handleApiProxy(message).then(sendResponse).catch((err) =>
      sendResponse({ error: err.message })
    );
    return true; // async
  }

  if (message.type === 'NOVA_INCREMENT_MEMORY') {
    sessionMemoryCount++;
    updateBadge();
    sendResponse({ count: sessionMemoryCount });
    return false;
  }

  if (message.type === 'NOVA_GET_MEMORY_COUNT') {
    sendResponse({ count: sessionMemoryCount });
    return false;
  }

  if (message.type === 'NOVA_TEST_CONNECTION') {
    testConnection(message.apiHost).then(sendResponse);
    return true;
  }
});

async function handleApiProxy(message) {
  const apiHost = await getApiHost();
  const { endpoint, method, body, queryParams } = message;

  let url = `${apiHost}${endpoint}`;
  if (queryParams) {
    const params = new URLSearchParams(queryParams);
    url += `?${params.toString()}`;
  }

  const options = {
    method: method || 'GET',
    headers: { 'Content-Type': 'application/json' },
  };

  if (body && method !== 'GET') {
    options.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  try {
    const resp = await fetch(url, options);
    if (!resp.ok) {
      throw new Error(`API responded with ${resp.status}: ${resp.statusText}`);
    }
    const data = await resp.json();
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function testConnection(host) {
  try {
    const resp = await fetch(`${host}/api/memory?action=stats`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (resp.ok) {
      return { success: true };
    }
    return { success: false, error: `Status ${resp.status}` };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/* ── Helpers ───────────────────────────────────────────────── */

async function getApiHost() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['apiHost'], (result) => {
      resolve(result.apiHost || DEFAULT_API_HOST);
    });
  });
}

async function apiRequest(host, endpoint, options = {}) {
  const url = `${host}${endpoint}`;
  const resp = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!resp.ok) {
    throw new Error(`API error ${resp.status}: ${resp.statusText}`);
  }
  return resp.json();
}

function updateBadge() {
  const text = sessionMemoryCount > 0 ? String(sessionMemoryCount) : '';
  chrome.action.setBadgeText({ text });
  chrome.action.setBadgeBackgroundColor({ color: '#10b981' });
}
