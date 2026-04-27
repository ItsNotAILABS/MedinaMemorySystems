/* NOVA OVO Page Intelligence — Popup Script */

(function () {
  'use strict';

  /* ── State ─────────────────────────────────────────────── */

  let currentTab = null;
  let pageContent = null;
  let analysisHistory = [];
  let settings = {
    apiHost: 'http://localhost:3000',
    autoAnalyze: false,
    highlightColor: '#10b981',
  };

  /* ── Init ──────────────────────────────────────────────── */

  document.addEventListener('DOMContentLoaded', async () => {
    await loadSettings();
    initTabs();
    initSettingsPanel();
    initAnalysisTab();
    initMemoryTab();
    initHighlightsTab();
    initHistoryTab();
    await loadCurrentTab();
    checkConnection();
    loadMemoryBadge();
    loadAnalysisHistory();
  });

  /* ── Settings ──────────────────────────────────────────── */

  async function loadSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(['apiHost', 'autoAnalyze', 'highlightColor'], (result) => {
        if (result.apiHost) settings.apiHost = result.apiHost;
        if (result.autoAnalyze !== undefined) settings.autoAnalyze = result.autoAnalyze;
        if (result.highlightColor) settings.highlightColor = result.highlightColor;
        resolve();
      });
    });
  }

  function saveSettings() {
    chrome.storage.sync.set({
      apiHost: settings.apiHost,
      autoAnalyze: settings.autoAnalyze,
      highlightColor: settings.highlightColor,
    });
  }

  /* ── Tab Navigation ────────────────────────────────────── */

  function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        tabBtns.forEach((b) => b.classList.remove('tab-btn--active'));
        btn.classList.add('tab-btn--active');

        document.querySelectorAll('.tab-panel').forEach((panel) => {
          panel.classList.remove('tab-panel--active');
        });
        const target = document.getElementById('panel-' + tabName);
        if (target) target.classList.add('tab-panel--active');

        if (tabName === 'highlights') refreshHighlights();
        if (tabName === 'history') renderHistory();
      });
    });
  }

  /* ── Settings Panel ────────────────────────────────────── */

  function initSettingsPanel() {
    const panel = document.getElementById('settings-panel');
    const btnOpen = document.getElementById('btn-settings');
    const btnClose = document.getElementById('btn-close-settings');
    const apiHostInput = document.getElementById('api-host');
    const autoAnalyzeToggle = document.getElementById('auto-analyze');
    const highlightColorInput = document.getElementById('highlight-color');
    const highlightColorHex = document.getElementById('highlight-color-hex');
    const btnTest = document.getElementById('btn-test-connection');
    const btnSave = document.getElementById('btn-save-settings');
    const testResult = document.getElementById('connection-test-result');

    apiHostInput.value = settings.apiHost;
    autoAnalyzeToggle.checked = settings.autoAnalyze;
    highlightColorInput.value = settings.highlightColor;
    highlightColorHex.textContent = settings.highlightColor;

    btnOpen.addEventListener('click', () => {
      panel.classList.remove('settings-panel--hidden');
    });

    btnClose.addEventListener('click', () => {
      panel.classList.add('settings-panel--hidden');
    });

    highlightColorInput.addEventListener('input', () => {
      highlightColorHex.textContent = highlightColorInput.value;
    });

    btnTest.addEventListener('click', async () => {
      testResult.textContent = 'Testing…';
      testResult.className = 'connection-test-result';
      const host = apiHostInput.value.replace(/\/+$/, '');

      chrome.runtime.sendMessage(
        { type: 'NOVA_TEST_CONNECTION', apiHost: host },
        (response) => {
          if (response && response.success) {
            testResult.textContent = '✅ Connected successfully';
            testResult.className = 'connection-test-result connection-test-result--success';
          } else {
            testResult.textContent = '❌ ' + ((response && response.error) || 'Connection failed');
            testResult.className = 'connection-test-result connection-test-result--error';
          }
        }
      );
    });

    btnSave.addEventListener('click', () => {
      settings.apiHost = apiHostInput.value.replace(/\/+$/, '');
      settings.autoAnalyze = autoAnalyzeToggle.checked;
      settings.highlightColor = highlightColorInput.value;
      saveSettings();

      // Update content script highlight color
      if (currentTab && currentTab.id) {
        chrome.tabs.sendMessage(currentTab.id, {
          type: 'NOVA_SET_HIGHLIGHT_COLOR',
          color: settings.highlightColor,
        });
      }

      panel.classList.add('settings-panel--hidden');
      checkConnection();
    });
  }

  /* ── Connection Check ──────────────────────────────────── */

  function checkConnection() {
    chrome.runtime.sendMessage(
      { type: 'NOVA_TEST_CONNECTION', apiHost: settings.apiHost },
      (response) => {
        const bar = document.getElementById('connection-bar');
        const dot = document.getElementById('connection-dot');
        const text = document.getElementById('connection-text');

        bar.className = 'connection-bar';
        if (response && response.success) {
          bar.classList.add('connection-bar--connected');
          text.textContent = 'Connected to NOVA OVO';
        } else {
          bar.classList.add('connection-bar--disconnected');
          text.textContent = 'Disconnected — check settings';
        }
      }
    );
  }

  /* ── Load Current Tab ──────────────────────────────────── */

  async function loadCurrentTab() {
    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs || tabs.length === 0) {
          resolve();
          return;
        }
        currentTab = tabs[0];
        document.getElementById('page-title').textContent = currentTab.title || 'Untitled';
        document.getElementById('page-url').textContent = currentTab.url || '';
        try {
          const domain = new URL(currentTab.url).hostname;
          document.getElementById('page-domain').textContent = domain;
        } catch {
          document.getElementById('page-domain').textContent = '';
        }

        // Get page content from content script
        chrome.tabs.sendMessage(currentTab.id, { type: 'NOVA_GET_PAGE_CONTENT' }, (response) => {
          if (chrome.runtime.lastError) {
            resolve();
            return;
          }
          if (response) {
            pageContent = response;
            document.getElementById('stat-words').textContent = formatNumber(response.wordCount);
            document.getElementById('stat-readtime').textContent = response.readingTimeMinutes + 'm';
            document.getElementById('stat-links').textContent = formatNumber(response.linkCount);
            document.getElementById('stat-images').textContent = formatNumber(response.imageCount);

            // Meta tags
            renderMetaTags(response.metaTags);
          }
          resolve();
        });
      });
    });
  }

  function renderMetaTags(metaTags) {
    const body = document.getElementById('meta-body');
    const countEl = document.getElementById('meta-count');
    const toggleBtn = document.getElementById('meta-toggle');

    const keys = Object.keys(metaTags || {});
    countEl.textContent = keys.length;

    if (keys.length === 0) {
      body.innerHTML = '<p style="font-size:11px;color:#475569;padding:8px 0;">No meta tags found</p>';
    } else {
      body.innerHTML = keys
        .map(
          (key) =>
            `<div class="meta-tag"><span class="meta-key">${escapeHtml(key)}</span><span class="meta-value">${escapeHtml(metaTags[key])}</span></div>`
        )
        .join('');
    }

    toggleBtn.addEventListener('click', () => {
      const collapsed = body.classList.toggle('card-body--collapsed');
      toggleBtn.textContent = '';
      toggleBtn.innerHTML = `${collapsed ? '▶' : '▼'} Meta Tags <span class="count-badge">${keys.length}</span>`;
    });
  }

  /* ── Analysis Tab ──────────────────────────────────────── */

  function initAnalysisTab() {
    const btnAnalyze = document.getElementById('btn-analyze');
    const btnCopy = document.getElementById('btn-copy-analysis');
    const btnRetry = document.getElementById('btn-retry-analysis');

    btnAnalyze.addEventListener('click', () => runAnalysis());
    btnRetry.addEventListener('click', () => runAnalysis());
    btnCopy.addEventListener('click', () => {
      const content = document.getElementById('analysis-content').textContent;
      navigator.clipboard.writeText(content);
      btnCopy.textContent = '✅';
      setTimeout(() => (btnCopy.textContent = '📋'), 1500);
    });
  }

  async function runAnalysis() {
    if (!pageContent) {
      showAnalysisError('No page content available. Make sure you are on a web page.');
      return;
    }

    hideEl('analysis-result');
    hideEl('analysis-error');
    showEl('analysis-loading');
    document.getElementById('btn-analyze').disabled = true;

    const truncatedText = pageContent.text.substring(0, 8000);
    const prompt = `Analyze the following webpage content in detail. Provide:
1. **Reading Level**: Approximate grade level
2. **Main Topics**: List of key topics covered
3. **Sentiment**: Overall tone/sentiment
4. **Key Entities**: Important people, organizations, concepts mentioned
5. **Summary**: A 2-3 sentence summary

Title: ${pageContent.title}
URL: ${pageContent.url}
Word Count: ${pageContent.wordCount}

Content:
${truncatedText}`;

    chrome.runtime.sendMessage(
      {
        type: 'NOVA_API_REQUEST',
        endpoint: '/api/chat',
        method: 'POST',
        body: { message: prompt, useConsensus: false },
      },
      (response) => {
        document.getElementById('btn-analyze').disabled = false;
        hideEl('analysis-loading');

        if (response && response.success) {
          const result =
            response.data.response || response.data.message || JSON.stringify(response.data, null, 2);
          document.getElementById('analysis-content').textContent = result;
          showEl('analysis-result');
          hideEl('analysis-error');

          // Add to history
          addToHistory(pageContent.title, pageContent.url, result);
        } else {
          showAnalysisError((response && response.error) || 'Analysis failed. Check your connection.');
        }
      }
    );
  }

  function showAnalysisError(msg) {
    hideEl('analysis-loading');
    hideEl('analysis-result');
    document.getElementById('analysis-error-msg').textContent = msg;
    showEl('analysis-error');
  }

  /* ── Memory Tab ────────────────────────────────────────── */

  function initMemoryTab() {
    const btnSaveManual = document.getElementById('btn-save-manual');
    const btnCaptureSelection = document.getElementById('btn-capture-selection');
    const btnCapturePage = document.getElementById('btn-capture-page');
    const btnRefresh = document.getElementById('btn-refresh-captures');

    btnSaveManual.addEventListener('click', () => {
      const text = document.getElementById('memory-text').value.trim();
      if (!text) return;
      const type = document.getElementById('memory-type').value;
      const tagsRaw = document.getElementById('memory-tags').value;
      const tags = tagsRaw
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
      saveMemory(text, type, tags.length > 0 ? tags : ['manual']);
    });

    btnCaptureSelection.addEventListener('click', () => {
      if (!currentTab) return;
      chrome.tabs.sendMessage(currentTab.id, { type: 'NOVA_GET_SELECTED_TEXT' }, (response) => {
        if (chrome.runtime.lastError || !response || !response.text) {
          showMemoryError('No text selected on the page');
          return;
        }
        const type = document.getElementById('memory-type').value;
        saveMemory(response.text, type, ['selection', 'page-capture']);
      });
    });

    btnCapturePage.addEventListener('click', () => {
      if (!pageContent || !pageContent.text) {
        showMemoryError('No page content available');
        return;
      }
      const type = document.getElementById('memory-type').value;
      const content = `[Page: ${pageContent.title}]\n[URL: ${pageContent.url}]\n\n${pageContent.text.substring(0, 10000)}`;
      saveMemory(content, type, ['full-page', pageContent.domain]);
    });

    btnRefresh.addEventListener('click', () => loadRecentCaptures());
    loadRecentCaptures();
  }

  function saveMemory(content, type, tags) {
    hideEl('memory-save-success');
    hideEl('memory-save-error');
    showEl('memory-save-loading');

    chrome.runtime.sendMessage(
      {
        type: 'NOVA_API_REQUEST',
        endpoint: '/api/memory',
        method: 'POST',
        body: { action: 'store', content, type, tags },
      },
      (response) => {
        hideEl('memory-save-loading');

        if (response && response.success) {
          showEl('memory-save-success');
          setTimeout(() => hideEl('memory-save-success'), 3000);
          document.getElementById('memory-text').value = '';

          chrome.runtime.sendMessage({ type: 'NOVA_INCREMENT_MEMORY' }, (r) => {
            if (r) updateBadge(r.count);
          });

          loadRecentCaptures();
        } else {
          showMemoryError((response && response.error) || 'Failed to save memory');
        }
      }
    );
  }

  function showMemoryError(msg) {
    hideEl('memory-save-loading');
    hideEl('memory-save-success');
    document.getElementById('memory-error-msg').textContent = msg;
    showEl('memory-save-error');
    setTimeout(() => hideEl('memory-save-error'), 5000);
  }

  function loadRecentCaptures() {
    const container = document.getElementById('recent-captures');

    chrome.runtime.sendMessage(
      {
        type: 'NOVA_API_REQUEST',
        endpoint: '/api/memory',
        method: 'GET',
        queryParams: { action: 'list', limit: '20' },
      },
      (response) => {
        if (response && response.success && response.data) {
          const memories = response.data.memories || response.data.data || [];
          if (Array.isArray(memories) && memories.length > 0) {
            container.innerHTML = memories
              .slice(0, 20)
              .map((m) => {
                const text = m.content || m.text || '';
                const tags = m.tags || [];
                const time = m.timestamp ? formatTime(m.timestamp) : '';
                return `<div class="capture-item">
                  <div class="capture-text">${escapeHtml(text.substring(0, 150))}</div>
                  <div class="capture-meta">
                    <div class="capture-tags">${tags.map((t) => `<span class="capture-tag">${escapeHtml(t)}</span>`).join('')}</div>
                    <span>${time}</span>
                  </div>
                </div>`;
              })
              .join('');
          } else {
            container.innerHTML = `<div class="empty-state">
              <p class="empty-icon">📭</p>
              <p>No memories captured yet</p>
              <p class="empty-hint">Use the form above or select text on any page</p>
            </div>`;
          }
        }
      }
    );
  }

  /* ── Highlights Tab ────────────────────────────────────── */

  function initHighlightsTab() {
    document.getElementById('btn-export-highlights').addEventListener('click', exportHighlights);
    document.getElementById('btn-clear-highlights').addEventListener('click', clearHighlights);
  }

  function refreshHighlights() {
    if (!currentTab) return;
    chrome.tabs.sendMessage(currentTab.id, { type: 'NOVA_GET_HIGHLIGHTS' }, (response) => {
      if (chrome.runtime.lastError) return;
      const container = document.getElementById('highlights-list');
      const highlights = (response && response.highlights) || [];

      if (highlights.length === 0) {
        container.innerHTML = `<div class="empty-state">
          <p class="empty-icon">🖍️</p>
          <p>No highlights on this page</p>
          <p class="empty-hint">Select text on the page and click "Highlight"</p>
        </div>`;
        return;
      }

      container.innerHTML = highlights
        .map(
          (h, i) =>
            `<div class="highlight-item" data-index="${i}">
            <div class="highlight-text">"${escapeHtml(h.text.substring(0, 200))}"</div>
            <div class="highlight-meta">${formatTime(h.timestamp)}</div>
          </div>`
        )
        .join('');

      container.querySelectorAll('.highlight-item').forEach((item) => {
        item.addEventListener('click', () => {
          const index = parseInt(item.dataset.index);
          chrome.tabs.sendMessage(currentTab.id, { type: 'NOVA_SCROLL_TO_HIGHLIGHT', index });
        });
      });
    });
  }

  function exportHighlights() {
    if (!currentTab) return;
    chrome.tabs.sendMessage(currentTab.id, { type: 'NOVA_GET_HIGHLIGHTS' }, (response) => {
      if (chrome.runtime.lastError) return;
      const highlights = (response && response.highlights) || [];
      if (highlights.length === 0) return;

      let md = `# Highlights — ${pageContent ? pageContent.title : 'Page'}\n`;
      md += `URL: ${pageContent ? pageContent.url : ''}\n\n`;
      highlights.forEach((h, i) => {
        md += `## Highlight ${i + 1}\n`;
        md += `> ${h.text}\n\n`;
        md += `*Captured: ${formatTime(h.timestamp)}*\n\n---\n\n`;
      });

      downloadText(md, 'nova-highlights.md');
    });
  }

  function clearHighlights() {
    if (!currentTab) return;
    chrome.tabs.sendMessage(currentTab.id, { type: 'NOVA_CLEAR_HIGHLIGHTS' }, () => {
      refreshHighlights();
    });
  }

  /* ── History Tab ───────────────────────────────────────── */

  function initHistoryTab() {
    document.getElementById('btn-export-history').addEventListener('click', exportHistory);
  }

  function loadAnalysisHistory() {
    chrome.storage.local.get(['nova_analysis_history'], (result) => {
      if (result.nova_analysis_history) {
        analysisHistory = result.nova_analysis_history;
      }
    });
  }

  function addToHistory(title, url, analysis) {
    const entry = { title, url, analysis, timestamp: Date.now() };
    analysisHistory.unshift(entry);
    if (analysisHistory.length > 50) analysisHistory = analysisHistory.slice(0, 50);
    chrome.storage.local.set({ nova_analysis_history: analysisHistory });
  }

  function renderHistory() {
    const container = document.getElementById('history-list');

    if (analysisHistory.length === 0) {
      container.innerHTML = `<div class="empty-state">
        <p class="empty-icon">📜</p>
        <p>No pages analyzed yet</p>
        <p class="empty-hint">Analyze a page to see it here</p>
      </div>`;
      return;
    }

    container.innerHTML = analysisHistory
      .map(
        (h, i) =>
          `<div class="history-item" data-index="${i}">
          <div class="history-title">${escapeHtml(h.title)}</div>
          <div class="history-url">${escapeHtml(h.url)}</div>
          <div class="history-time">${formatTime(h.timestamp)}</div>
        </div>`
      )
      .join('');

    container.querySelectorAll('.history-item').forEach((item) => {
      item.addEventListener('click', () => {
        const index = parseInt(item.dataset.index);
        const entry = analysisHistory[index];
        if (!entry) return;

        // Switch to analysis tab and show result
        document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('tab-btn--active'));
        document.querySelector('[data-tab="analysis"]').classList.add('tab-btn--active');
        document.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('tab-panel--active'));
        document.getElementById('panel-analysis').classList.add('tab-panel--active');

        document.getElementById('analysis-content').textContent = entry.analysis;
        showEl('analysis-result');
        hideEl('analysis-error');
        hideEl('analysis-loading');
      });
    });
  }

  function exportHistory() {
    if (analysisHistory.length === 0) return;

    let md = '# NOVA OVO Analysis History\n\n';
    analysisHistory.forEach((h, i) => {
      md += `## ${i + 1}. ${h.title}\n`;
      md += `URL: ${h.url}\n`;
      md += `Analyzed: ${formatTime(h.timestamp)}\n\n`;
      md += `### Analysis\n${h.analysis}\n\n---\n\n`;
    });

    downloadText(md, 'nova-history.md');
  }

  /* ── Badge ─────────────────────────────────────────────── */

  function loadMemoryBadge() {
    chrome.runtime.sendMessage({ type: 'NOVA_GET_MEMORY_COUNT' }, (response) => {
      if (response) updateBadge(response.count);
    });
  }

  function updateBadge(count) {
    const badge = document.getElementById('memory-badge');
    badge.textContent = count || 0;
  }

  /* ── Utilities ─────────────────────────────────────────── */

  function showEl(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove(
      'loading-state--hidden',
      'error-state--hidden',
      'success-state--hidden',
      'result-area--hidden'
    );
  }

  function hideEl(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const classes = el.classList;
    if (classes.contains('loading-state')) classes.add('loading-state--hidden');
    else if (classes.contains('error-state')) classes.add('error-state--hidden');
    else if (classes.contains('success-state')) classes.add('success-state--hidden');
    else if (classes.contains('result-area')) classes.add('result-area--hidden');
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  function formatNumber(n) {
    if (n === undefined || n === null) return '—';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
    return String(n);
  }

  function formatTime(timestamp) {
    if (!timestamp) return '';
    const d = new Date(timestamp);
    const now = new Date();
    const diff = now - d;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
    if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';

    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function downloadText(content, filename) {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
})();
