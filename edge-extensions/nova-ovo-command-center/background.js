/* NOVA OVO Command Center — Background Service Worker */

const DEFAULT_CONFIG = {
  apiHost: "http://localhost:3000",
  healthCheckInterval: 0.5,
  notificationsEnabled: true,
  autoBoot: false,
  theme: "dark",
};

let lastStatus = null;

async function getConfig() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(DEFAULT_CONFIG, (cfg) => resolve(cfg));
  });
}

async function apiRequest(endpoint, options = {}) {
  const config = await getConfig();
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${config.apiHost}${endpoint}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const resp = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeout);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return await resp.json();
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

async function checkHealth() {
  try {
    const data = await apiRequest("/api/health");
    const status = data.status === "ok" ? "ok" : "degraded";
    updateBadge(status);
    if (lastStatus !== null && lastStatus !== status) {
      await notifyStatusChange(status);
    }
    lastStatus = status;
    return { connected: true, status, data };
  } catch {
    updateBadge("error");
    if (lastStatus !== null && lastStatus !== "error") {
      await notifyStatusChange("error");
    }
    lastStatus = "error";
    return { connected: false, status: "error", data: null };
  }
}

function updateBadge(status) {
  const map = {
    ok: { text: "✓", color: "#22c55e" },
    degraded: { text: "!", color: "#f59e0b" },
    error: { text: "✗", color: "#ef4444" },
  };
  const info = map[status] || map.error;
  chrome.action.setBadgeText({ text: info.text });
  chrome.action.setBadgeBackgroundColor({ color: info.color });
}

async function notifyStatusChange(status) {
  const config = await getConfig();
  if (!config.notificationsEnabled) return;
  const titles = {
    ok: "NOVA OVO — System Online",
    degraded: "NOVA OVO — System Degraded",
    error: "NOVA OVO — System Offline",
  };
  const messages = {
    ok: "All systems operational. Platform is connected and healthy.",
    degraded: "Platform is responding but reporting degraded status.",
    error: "Cannot reach the NOVA OVO platform. Check if the server is running.",
  };
  chrome.notifications.create(`status-${Date.now()}`, {
    type: "basic",
    iconUrl: "icons/icon128.png",
    title: titles[status] || "NOVA OVO — Status Change",
    message: messages[status] || "System status has changed.",
  });
}

chrome.alarms.create("health-check", { periodInMinutes: 0.5 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "health-check") {
    checkHealth();
  }
});

chrome.runtime.onInstalled.addListener(async () => {
  const config = await getConfig();
  const interval = config.healthCheckInterval || 0.5;
  chrome.alarms.create("health-check", { periodInMinutes: interval });
  checkHealth();
});

chrome.runtime.onStartup.addListener(async () => {
  const config = await getConfig();
  if (config.autoBoot) {
    try {
      await apiRequest("/api/agi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "boot-kernel", tier: "assistant" }),
      });
    } catch {
      // Kernel boot failed silently on startup
    }
  }
  checkHealth();
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  handleMessage(message).then(sendResponse).catch((err) => {
    sendResponse({ error: err.message });
  });
  return true;
});

async function handleMessage(message) {
  switch (message.type) {
    case "health-check":
      return checkHealth();

    case "api-request": {
      const opts = { method: message.method || "GET" };
      if (message.body) {
        opts.method = "POST";
        opts.headers = { "Content-Type": "application/json" };
        opts.body = JSON.stringify(message.body);
      }
      return apiRequest(message.endpoint, opts);
    }

    case "get-config":
      return getConfig();

    case "save-config": {
      return new Promise((resolve) => {
        chrome.storage.sync.set(message.config, () => {
          if (message.config.healthCheckInterval) {
            chrome.alarms.create("health-check", {
              periodInMinutes: message.config.healthCheckInterval,
            });
          }
          resolve({ success: true });
        });
      });
    }

    case "open-tab": {
      const tab = await chrome.tabs.create({ url: message.url });
      return { success: true, tabId: tab.id };
    }

    default:
      return { error: "Unknown message type" };
  }
}
