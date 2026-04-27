'use strict';

const DEFAULT_API_HOST = 'http://localhost:3000';
let apiHost = DEFAULT_API_HOST;
let connectionStatus = 'disconnected';

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    await chrome.storage.sync.set({ apiHost: DEFAULT_API_HOST });
  }
  const stored = await chrome.storage.sync.get('apiHost');
  apiHost = stored.apiHost || DEFAULT_API_HOST;
});

chrome.storage.sync.get('apiHost', (result) => {
  apiHost = result.apiHost || DEFAULT_API_HOST;
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.apiHost) {
    apiHost = changes.apiHost.newValue || DEFAULT_API_HOST;
    connectionStatus = 'disconnected';
  }
});

chrome.action.onClicked.addListener(async (tab) => {
  try {
    await chrome.sidePanel.open({ tabId: tab.id });
  } catch (err) {
    console.warn('Side panel open failed, may already be open:', err.message);
  }
});

async function checkConnection() {
  try {
    const response = await fetch(`${apiHost}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: '', useConsensus: false }),
      signal: AbortSignal.timeout(5000),
    });
    connectionStatus = response.ok || response.status < 500 ? 'connected' : 'error';
  } catch {
    connectionStatus = 'disconnected';
  }
  return connectionStatus;
}

async function proxyApiCall(endpoint, method, body) {
  const url = new URL(endpoint, apiHost);
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(30000),
  };
  if (method === 'POST' && body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url.toString(), options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `API returned ${response.status}`);
  }

  connectionStatus = 'connected';
  return data;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message, sender).then(sendResponse).catch((err) => {
    sendResponse({ error: err.message || 'Unknown error' });
  });
  return true;
});

async function handleMessage(message, sender) {
  switch (message.type) {
    case 'CHAT': {
      const data = await proxyApiCall('/api/chat', 'POST', {
        message: message.content,
        useConsensus: message.useConsensus || false,
      });
      return { success: true, data };
    }

    case 'MEMORY_LIST': {
      const limit = message.limit || 20;
      const data = await proxyApiCall(
        `/api/memory?action=list&limit=${limit}`,
        'GET'
      );
      return { success: true, data };
    }

    case 'MEMORY_STORE': {
      const data = await proxyApiCall('/api/memory', 'POST', {
        action: 'store',
        content: message.content,
        type: message.memoryType || 'semantic',
        tags: message.tags || [],
      });
      return { success: true, data };
    }

    case 'GOVERN': {
      const data = await proxyApiCall('/api/govern', 'POST', {
        action: message.action || 'status',
      });
      return { success: true, data };
    }

    case 'EXTENSION_ACTION': {
      const data = await proxyApiCall('/api/extension', 'POST', {
        action: message.action,
        ...(message.panel ? { panel: message.panel } : {}),
      });
      return { success: true, data };
    }

    case 'CHECK_CONNECTION': {
      const status = await checkConnection();
      return { success: true, status, apiHost };
    }

    case 'GET_STATUS': {
      return { success: true, status: connectionStatus, apiHost };
    }

    case 'SET_API_HOST': {
      const newHost = message.host.replace(/\/+$/, '');
      await chrome.storage.sync.set({ apiHost: newHost });
      apiHost = newHost;
      connectionStatus = 'disconnected';
      const status = await checkConnection();
      return { success: true, status, apiHost: newHost };
    }

    case 'GET_PAGE_CONTEXT': {
      try {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });
        if (!tab?.id) return { success: true, context: null };
        const response = await chrome.tabs.sendMessage(tab.id, {
          type: 'EXTRACT_CONTEXT',
        });
        return { success: true, context: response };
      } catch {
        return { success: true, context: null };
      }
    }

    case 'TEST_CONNECTION': {
      try {
        const host = message.host
          ? message.host.replace(/\/+$/, '')
          : apiHost;
        const response = await fetch(`${host}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: 'ping', useConsensus: false }),
          signal: AbortSignal.timeout(5000),
        });
        return {
          success: true,
          connected: response.ok || response.status < 500,
          status: response.status,
        };
      } catch (err) {
        return { success: false, connected: false, error: err.message };
      }
    }

    default:
      return { error: `Unknown message type: ${message.type}` };
  }
}
