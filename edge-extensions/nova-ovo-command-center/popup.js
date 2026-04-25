/* NOVA OVO Command Center — Popup Controller */

(function () {
  "use strict";

  // --- State ---
  let connected = false;
  let kernelRunning = false;
  let commandHistory = [];
  let historyIndex = -1;
  let autocompleteIndex = -1;
  let refreshTimer = null;

  const KNOWN_COMMANDS = [
    "/help",
    "/status",
    "/boot",
    "/shutdown",
    "/memory",
    "/memory list",
    "/memory stats",
    "/govern",
    "/govern stats",
    "/govern gates",
    "/govern audit",
    "/models",
    "/agents",
    "/export",
    "/sync",
    "/health",
    "/clear",
    "/tabs",
    "/version",
  ];

  // --- DOM refs ---
  const $ = (id) => document.getElementById(id);

  const statusDot = $("statusDot");
  const versionTag = $("versionTag");
  const settingsBtn = $("settingsBtn");
  const healthStatus = $("healthStatus");
  const totalMemories = $("totalMemories");
  const activeProposals = $("activeProposals");
  const memoryBreakdown = $("memoryBreakdown");
  const gatesRow = $("gatesRow");
  const modelList = $("modelList");
  const heartbeat = $("heartbeat");
  const kernelBtn = $("kernelBtn");
  const tierSelect = $("tierSelect");
  const newTabBtn = $("newTabBtn");
  const refreshTabsBtn = $("refreshTabsBtn");
  const tabList = $("tabList");
  const agentsList = $("agentsList");
  const activityFeed = $("activityFeed");
  const commandInput = $("commandInput");
  const commandSendBtn = $("commandSendBtn");
  const commandOutput = $("commandOutput");
  const autocompleteList = $("autocompleteList");
  const overlay = $("overlay");
  const overlayTitle = $("overlayTitle");
  const overlayBody = $("overlayBody");
  const overlayClose = $("overlayClose");

  // --- Messaging helper ---
  function sendMessage(msg) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(msg, (resp) => {
        resolve(resp || { error: "No response" });
      });
    });
  }

  function api(endpoint, body) {
    const msg = { type: "api-request", endpoint };
    if (body) msg.body = body;
    else msg.method = "GET";
    return sendMessage(msg);
  }

  // --- Section collapse/expand ---
  document.querySelectorAll(".section-header").forEach((hdr) => {
    hdr.addEventListener("click", () => {
      const section = hdr.closest(".section");
      section.classList.toggle("collapsed");
    });
  });

  // --- Settings button ---
  settingsBtn.addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
  });

  // --- Overlay ---
  overlayClose.addEventListener("click", closeOverlay);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeOverlay();
  });

  function openOverlay(title, html) {
    overlayTitle.textContent = title;
    overlayBody.innerHTML = html;
    overlay.classList.add("visible");
  }

  function closeOverlay() {
    overlay.classList.remove("visible");
  }

  // --- Data fetching ---
  async function refreshAll() {
    await Promise.allSettled([
      refreshHealth(),
      refreshMemory(),
      refreshGovernance(),
      refreshModels(),
      refreshAGIState(),
      refreshTabs(),
      refreshActivity(),
    ]);
    heartbeat.textContent = `Last check: ${new Date().toLocaleTimeString()}`;
  }

  async function refreshHealth() {
    try {
      const res = await sendMessage({ type: "health-check" });
      connected = res.connected;
      updateConnectionStatus(res.connected, res.status);
      if (res.data) {
        healthStatus.textContent =
          res.status === "ok" ? "✓" : res.status === "degraded" ? "!" : "✗";
        healthStatus.style.color =
          res.status === "ok"
            ? "var(--green)"
            : res.status === "degraded"
              ? "var(--yellow)"
              : "var(--red)";
        if (res.data.version) {
          versionTag.textContent = `v${res.data.version}`;
        }
      }
    } catch {
      connected = false;
      updateConnectionStatus(false, "error");
    }
  }

  function updateConnectionStatus(isConnected, status) {
    statusDot.className = "status-dot";
    if (isConnected && status === "ok") {
      statusDot.classList.add("connected");
      statusDot.title = "Connected";
    } else if (isConnected && status === "degraded") {
      statusDot.classList.add("degraded");
      statusDot.title = "Degraded";
    } else {
      statusDot.classList.add("disconnected");
      statusDot.title = "Disconnected";
    }
  }

  async function refreshMemory() {
    try {
      const stats = await api("/api/memory?action=stats");
      if (stats && !stats.error) {
        totalMemories.textContent = stats.total ?? stats.count ?? "0";

        const types = stats.types || stats.breakdown || {};
        if (Object.keys(types).length > 0) {
          memoryBreakdown.innerHTML = Object.entries(types)
            .map(
              ([k, v]) =>
                `<span class="memory-type-tag">${escapeHtml(k)}: ${v}</span>`
            )
            .join("");
        } else {
          memoryBreakdown.innerHTML =
            '<span class="memory-type-tag">No data</span>';
        }
      }
    } catch {
      totalMemories.textContent = "—";
      memoryBreakdown.innerHTML =
        '<span class="memory-type-tag">Unavailable</span>';
    }
  }

  async function refreshGovernance() {
    try {
      const [stats, gates] = await Promise.allSettled([
        api("/api/govern?action=stats"),
        api("/api/govern?action=gates"),
      ]);

      if (stats.status === "fulfilled" && stats.value && !stats.value.error) {
        activeProposals.textContent =
          stats.value.activeProposals ?? stats.value.proposals ?? "0";
      } else {
        activeProposals.textContent = "—";
      }

      if (gates.status === "fulfilled" && gates.value && !gates.value.error) {
        const gateData = gates.value.gates || gates.value;
        const gateNames = ["A", "B", "C"];
        gatesRow.innerHTML = gateNames
          .map((name) => {
            const g = gateData[name] || gateData[name.toLowerCase()] || {};
            const isOpen = g.status === "open" || g.open === true;
            return `<div class="gate-indicator"><span class="gate-dot ${isOpen ? "open" : "closed"}"></span> Gate ${name}</div>`;
          })
          .join("");
      }
    } catch {
      activeProposals.textContent = "—";
    }
  }

  async function refreshModels() {
    try {
      const res = await api("/api/model?action=list");
      if (res && !res.error) {
        const models = res.models || res.data || [];
        if (Array.isArray(models) && models.length > 0) {
          modelList.innerHTML = models
            .map(
              (m) =>
                `<span class="model-tag">${escapeHtml(typeof m === "string" ? m : m.name || m.id || "unknown")}</span>`
            )
            .join("");
        } else {
          modelList.innerHTML = '<span class="model-tag">No models</span>';
        }
      }
    } catch {
      modelList.innerHTML = '<span class="model-tag">Unavailable</span>';
    }
  }

  async function refreshAGIState() {
    try {
      const res = await api("/api/agi", { action: "get-state" });
      if (res && !res.error) {
        kernelRunning = res.running || res.state === "running";
        updateKernelButton();

        if (res.tier) {
          tierSelect.value = res.tier;
        }

        if (res.agents && Array.isArray(res.agents) && res.agents.length > 0) {
          agentsList.innerHTML = res.agents
            .map(
              (a) => `
            <div class="agent-item">
              <span class="agent-status-dot ${a.status || "idle"}"></span>
              <span>${escapeHtml(a.name || a.id || "Agent")}</span>
            </div>`
            )
            .join("");
        } else {
          agentsList.innerHTML =
            '<div class="empty-state">No agents deployed</div>';
        }
      }
    } catch {
      kernelRunning = false;
      updateKernelButton();
    }
  }

  function updateKernelButton() {
    if (kernelRunning) {
      kernelBtn.textContent = "🔴 Shutdown Kernel";
      kernelBtn.className = "btn danger";
    } else {
      kernelBtn.textContent = "⚡ Boot Kernel";
      kernelBtn.className = "btn primary";
    }
  }

  async function refreshTabs() {
    try {
      const res = await api("/api/desktop", { action: "list-tabs" });
      if (res && !res.error && res.tabs && res.tabs.length > 0) {
        tabList.innerHTML = res.tabs
          .map(
            (t) => `
          <div class="tab-item" data-tab-id="${escapeHtml(String(t.id || ""))}">
            <span class="tab-item-title">${escapeHtml(t.title || t.url || "Untitled")}</span>
            <button class="tab-close" data-tab-id="${escapeHtml(String(t.id || ""))}" title="Close tab">✕</button>
          </div>`
          )
          .join("");

        tabList.querySelectorAll(".tab-close").forEach((btn) => {
          btn.addEventListener("click", async (e) => {
            e.stopPropagation();
            await api("/api/desktop", {
              action: "close-tab",
              tabId: btn.dataset.tabId,
            });
            refreshTabs();
          });
        });
      } else {
        tabList.innerHTML = '<div class="empty-state">No tabs open</div>';
      }
    } catch {
      tabList.innerHTML = '<div class="empty-state">No tabs open</div>';
    }
  }

  async function refreshActivity() {
    try {
      const res = await api("/api/govern?action=audit&limit=10");
      if (res && !res.error) {
        const items = res.entries || res.events || res.data || [];
        if (Array.isArray(items) && items.length > 0) {
          activityFeed.innerHTML = items
            .map((item) => {
              const icon = getActivityIcon(item.type || item.action || "");
              const text =
                item.message ||
                item.description ||
                item.action ||
                "Activity";
              const time = item.timestamp
                ? formatTimestamp(item.timestamp)
                : "";
              return `
              <div class="activity-item">
                <span class="activity-icon">${icon}</span>
                <div class="activity-body">
                  <div class="activity-text">${escapeHtml(text)}</div>
                  ${time ? `<div class="activity-time">${time}</div>` : ""}
                </div>
              </div>`;
            })
            .join("");
        } else {
          activityFeed.innerHTML =
            '<div class="empty-state">No recent activity</div>';
        }
      }
    } catch {
      activityFeed.innerHTML =
        '<div class="empty-state">No recent activity</div>';
    }
  }

  function getActivityIcon(type) {
    const map = {
      governance: "⚖️",
      memory: "🧠",
      agent: "🤖",
      deploy: "🚀",
      chat: "💬",
      gate: "🔒",
      export: "📤",
      sync: "🔄",
      boot: "⚡",
      shutdown: "🔴",
      decision: "⚖️",
      store: "🧠",
    };
    const key = String(type).toLowerCase();
    for (const [k, v] of Object.entries(map)) {
      if (key.includes(k)) return v;
    }
    return "📋";
  }

  function formatTimestamp(ts) {
    try {
      const d = new Date(ts);
      if (isNaN(d.getTime())) return ts;
      const now = new Date();
      const diffMs = now - d;
      const diffSec = Math.floor(diffMs / 1000);
      if (diffSec < 60) return `${diffSec}s ago`;
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHr = Math.floor(diffMin / 60);
      if (diffHr < 24) return `${diffHr}h ago`;
      return d.toLocaleDateString();
    } catch {
      return ts;
    }
  }

  // --- Kernel control ---
  kernelBtn.addEventListener("click", async () => {
    kernelBtn.disabled = true;
    try {
      if (kernelRunning) {
        await api("/api/agi", { action: "shutdown-kernel" });
        kernelRunning = false;
      } else {
        await api("/api/agi", {
          action: "boot-kernel",
          tier: tierSelect.value,
        });
        kernelRunning = true;
      }
      updateKernelButton();
    } catch {
      appendOutput("Kernel operation failed.");
    } finally {
      kernelBtn.disabled = false;
    }
  });

  // --- Tab controls ---
  newTabBtn.addEventListener("click", async () => {
    const config = await sendMessage({ type: "get-config" });
    const baseUrl = config.apiHost || "http://localhost:3000";
    await api("/api/desktop", {
      action: "open-tab",
      url: baseUrl,
    });
    refreshTabs();
  });

  refreshTabsBtn.addEventListener("click", () => {
    refreshTabs();
  });

  // --- Quick Actions ---
  document.querySelectorAll(".action-btn").forEach((btn) => {
    btn.addEventListener("click", () => handleAction(btn.dataset.action));
  });

  async function handleAction(action) {
    const config = await sendMessage({ type: "get-config" });
    const baseUrl = config.apiHost || "http://localhost:3000";

    switch (action) {
      case "chat":
        sendMessage({ type: "open-tab", url: baseUrl });
        break;

      case "memory":
        sendMessage({ type: "open-tab", url: `${baseUrl}?view=memory` });
        break;

      case "govern":
        sendMessage({ type: "open-tab", url: `${baseUrl}?view=governance` });
        break;

      case "stats":
        await showStatsOverlay();
        break;

      case "gates":
        await showGatesOverlay();
        break;

      case "agents":
        await showAgentsOverlay();
        break;

      case "export":
        await doExport();
        break;

      case "sync":
        await doSync();
        break;

      case "health":
        await refreshHealth();
        appendOutput("Health check complete.");
        break;
    }
  }

  async function showStatsOverlay() {
    let html = '<div style="display:flex;flex-direction:column;gap:10px;">';
    try {
      const [memRes, govRes, modRes] = await Promise.allSettled([
        api("/api/memory?action=stats"),
        api("/api/govern?action=stats"),
        api("/api/model?action=list"),
      ]);

      html += "<h3 style='color:var(--accent);font-size:12px;'>Memory Stats</h3>";
      html += `<pre style="font-size:11px;color:var(--text-secondary);white-space:pre-wrap;">${JSON.stringify(memRes.status === "fulfilled" ? memRes.value : { error: "unavailable" }, null, 2)}</pre>`;

      html += "<h3 style='color:var(--accent);font-size:12px;margin-top:10px;'>Governance Stats</h3>";
      html += `<pre style="font-size:11px;color:var(--text-secondary);white-space:pre-wrap;">${JSON.stringify(govRes.status === "fulfilled" ? govRes.value : { error: "unavailable" }, null, 2)}</pre>`;

      html += "<h3 style='color:var(--accent);font-size:12px;margin-top:10px;'>Models</h3>";
      html += `<pre style="font-size:11px;color:var(--text-secondary);white-space:pre-wrap;">${JSON.stringify(modRes.status === "fulfilled" ? modRes.value : { error: "unavailable" }, null, 2)}</pre>`;
    } catch {
      html += '<p style="color:var(--red);">Failed to load stats.</p>';
    }
    html += "</div>";
    openOverlay("System Statistics", html);
  }

  async function showGatesOverlay() {
    let html = "";
    try {
      const res = await api("/api/govern?action=gates");
      const gateData = res.gates || res;
      html = `<pre style="font-size:11px;color:var(--text-secondary);white-space:pre-wrap;">${JSON.stringify(gateData, null, 2)}</pre>`;
    } catch {
      html = '<p style="color:var(--red);">Failed to load gate status.</p>';
    }
    openOverlay("Gate Enforcement Status", html);
  }

  async function showAgentsOverlay() {
    let html = "";
    try {
      const res = await api("/api/agi", { action: "get-state" });
      const agents = res.agents || [];
      if (agents.length > 0) {
        html = agents
          .map(
            (a) => `
          <div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--border);font-size:12px;">
            <span class="agent-status-dot ${a.status || "idle"}" style="width:8px;height:8px;"></span>
            <strong style="color:var(--text-primary);">${escapeHtml(a.name || a.id || "Agent")}</strong>
            <span style="color:var(--text-muted);margin-left:auto;">${escapeHtml(a.status || "unknown")}</span>
          </div>`
          )
          .join("");
      } else {
        html =
          '<div class="empty-state">No agents currently deployed.</div>';
      }
    } catch {
      html = '<p style="color:var(--red);">Failed to load agent data.</p>';
    }
    openOverlay("Agent Deployment Panel", html);
  }

  async function doExport() {
    try {
      const res = await api("/api/export", { action: "export" });
      appendOutput(
        `Export: ${res.message || res.status || JSON.stringify(res)}`
      );
    } catch {
      appendOutput("Export failed.");
    }
  }

  async function doSync() {
    try {
      const res = await api("/api/sync", { action: "sync" });
      appendOutput(
        `Sync: ${res.message || res.status || JSON.stringify(res)}`
      );
    } catch {
      appendOutput("Sync failed.");
    }
  }

  // --- Command Input ---
  commandInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      executeCommand();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      navigateHistory(-1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      navigateHistory(1);
    } else if (e.key === "Tab") {
      e.preventDefault();
      applyAutocomplete();
    } else if (e.key === "Escape") {
      hideAutocomplete();
    }
  });

  commandInput.addEventListener("input", () => {
    showAutocomplete(commandInput.value);
  });

  commandSendBtn.addEventListener("click", () => {
    executeCommand();
  });

  async function executeCommand() {
    const raw = commandInput.value.trim();
    if (!raw) return;

    commandHistory.push(raw);
    if (commandHistory.length > 50) commandHistory.shift();
    historyIndex = commandHistory.length;
    commandInput.value = "";
    hideAutocomplete();

    appendOutput(`> ${raw}`);

    const cmd = raw.startsWith("/") ? raw : `/${raw}`;

    switch (cmd.split(" ")[0]) {
      case "/help":
        appendOutput(
          "Available: /status /boot /shutdown /memory /govern /models /agents /export /sync /health /clear /tabs /version"
        );
        return;

      case "/clear":
        commandOutput.textContent = "";
        commandOutput.classList.remove("visible");
        return;

      case "/status":
        await refreshHealth();
        appendOutput(`Status: ${connected ? "Connected" : "Disconnected"}`);
        return;

      case "/version":
        appendOutput(`Version: ${versionTag.textContent}`);
        return;

      case "/boot":
        kernelBtn.click();
        return;

      case "/shutdown":
        if (kernelRunning) kernelBtn.click();
        else appendOutput("Kernel is not running.");
        return;

      case "/health":
        await refreshAll();
        appendOutput("Health check refreshed.");
        return;

      case "/tabs":
        await refreshTabs();
        appendOutput("Tabs refreshed.");
        return;

      case "/export":
        await doExport();
        return;

      case "/sync":
        await doSync();
        return;

      default:
        break;
    }

    try {
      const res = await api("/api/chat", { message: raw });
      const text = res.reply || res.message || res.response || JSON.stringify(res);
      appendOutput(text);
    } catch {
      appendOutput("Command failed.");
    }
  }

  function navigateHistory(direction) {
    if (commandHistory.length === 0) return;
    historyIndex += direction;
    if (historyIndex < 0) historyIndex = 0;
    if (historyIndex >= commandHistory.length) {
      historyIndex = commandHistory.length;
      commandInput.value = "";
      return;
    }
    commandInput.value = commandHistory[historyIndex];
  }

  function showAutocomplete(value) {
    if (!value || !value.startsWith("/")) {
      hideAutocomplete();
      return;
    }
    const matches = KNOWN_COMMANDS.filter((c) =>
      c.startsWith(value.toLowerCase())
    );
    if (matches.length === 0 || (matches.length === 1 && matches[0] === value)) {
      hideAutocomplete();
      return;
    }
    autocompleteIndex = -1;
    autocompleteList.innerHTML = matches
      .map((m) => `<div class="autocomplete-item">${escapeHtml(m)}</div>`)
      .join("");
    autocompleteList.classList.add("visible");

    autocompleteList.querySelectorAll(".autocomplete-item").forEach((item) => {
      item.addEventListener("click", () => {
        commandInput.value = item.textContent;
        hideAutocomplete();
        commandInput.focus();
      });
    });
  }

  function hideAutocomplete() {
    autocompleteList.classList.remove("visible");
    autocompleteIndex = -1;
  }

  function applyAutocomplete() {
    const items = autocompleteList.querySelectorAll(".autocomplete-item");
    if (items.length > 0) {
      const active = autocompleteList.querySelector(".autocomplete-item.active");
      if (active) {
        commandInput.value = active.textContent;
      } else {
        commandInput.value = items[0].textContent;
      }
      hideAutocomplete();
    }
  }

  function appendOutput(text) {
    commandOutput.classList.add("visible");
    commandOutput.textContent += text + "\n";
    commandOutput.scrollTop = commandOutput.scrollHeight;
  }

  // --- Utilities ---
  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // --- Init ---
  refreshAll();
  refreshTimer = setInterval(refreshAll, 10000);

  window.addEventListener("unload", () => {
    if (refreshTimer) clearInterval(refreshTimer);
  });
})();
