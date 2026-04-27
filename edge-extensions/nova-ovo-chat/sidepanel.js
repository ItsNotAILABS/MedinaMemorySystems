'use strict';

(function () {
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  // State
  let chatHistory = [];
  let isLoading = false;
  let currentPanel = 'chat'; // 'chat' | 'settings' | 'memory'

  // DOM refs
  const connectionDot = $('#connection-dot');
  const messagesContainer = $('#messages');
  const welcomeMessage = $('#welcome-message');
  const chatInput = $('#chat-input');
  const btnSend = $('#btn-send');
  const btnSettings = $('#btn-settings');
  const btnCloseSettings = $('#btn-close-settings');
  const settingsPanel = $('#settings-panel');
  const inputApiHost = $('#input-api-host');
  const btnSaveHost = $('#btn-save-host');
  const btnTestConnection = $('#btn-test-connection');
  const connectionTestResult = $('#connection-test-result');
  const btnClearHistory = $('#btn-clear-history');
  const btnMemory = $('#btn-memory');
  const btnCloseMemory = $('#btn-close-memory');
  const memoryPanel = $('#memory-panel');
  const inputMemoryContent = $('#input-memory-content');
  const selectMemoryType = $('#select-memory-type');
  const inputMemoryTags = $('#input-memory-tags');
  const btnStoreMemory = $('#btn-store-memory');
  const btnRefreshMemories = $('#btn-refresh-memories');
  const memoryList = $('#memory-list');
  const statusText = $('#status-text');

  // ── Initialization ──
  async function init() {
    await loadChatHistory();
    await loadSettings();
    checkConnection();
    renderMessages();
    setupEventListeners();
    autoResizeInput();
  }

  async function loadSettings() {
    try {
      const result = await chrome.storage.sync.get('apiHost');
      if (result.apiHost) {
        inputApiHost.value = result.apiHost;
      } else {
        inputApiHost.value = 'http://localhost:3000';
      }
    } catch {
      inputApiHost.value = 'http://localhost:3000';
    }
  }

  async function loadChatHistory() {
    try {
      const result = await chrome.storage.local.get('chatHistory');
      chatHistory = result.chatHistory || [];
    } catch {
      chatHistory = [];
    }
  }

  async function saveChatHistory() {
    try {
      await chrome.storage.local.set({ chatHistory });
    } catch (err) {
      console.warn('Failed to save chat history:', err);
    }
  }

  async function checkConnection() {
    setConnectionStatus('checking');
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'CHECK_CONNECTION',
      });
      if (response?.status === 'connected') {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('disconnected');
      }
    } catch {
      setConnectionStatus('disconnected');
    }
  }

  function setConnectionStatus(status) {
    connectionDot.className = 'status-dot ' + status;
    const labels = {
      connected: 'Connected',
      disconnected: 'Disconnected',
      checking: 'Checking...',
    };
    connectionDot.title = labels[status] || status;
  }

  // ── Event Listeners ──
  function setupEventListeners() {
    btnSend.addEventListener('click', sendMessage);

    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    chatInput.addEventListener('input', autoResizeInput);

    btnSettings.addEventListener('click', () => togglePanel('settings'));
    btnCloseSettings.addEventListener('click', () => togglePanel('chat'));

    btnMemory.addEventListener('click', () => togglePanel('memory'));
    btnCloseMemory.addEventListener('click', () => togglePanel('chat'));

    btnSaveHost.addEventListener('click', saveApiHost);
    btnTestConnection.addEventListener('click', testConnection);
    btnClearHistory.addEventListener('click', clearHistory);

    btnStoreMemory.addEventListener('click', storeMemory);
    btnRefreshMemories.addEventListener('click', loadMemories);
  }

  function autoResizeInput() {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
  }

  function togglePanel(panel) {
    currentPanel = panel;
    settingsPanel.classList.toggle('hidden', panel !== 'settings');
    memoryPanel.classList.toggle('hidden', panel !== 'memory');

    if (panel === 'memory') {
      loadMemories();
    }
  }

  // ── Settings ──
  async function saveApiHost() {
    const host = inputApiHost.value.trim();
    if (!host) return;

    btnSaveHost.disabled = true;
    btnSaveHost.textContent = 'Saving...';

    try {
      const response = await chrome.runtime.sendMessage({
        type: 'SET_API_HOST',
        host,
      });
      if (response?.success) {
        showTestResult('success', 'API host saved: ' + host);
        setConnectionStatus(response.status || 'disconnected');
      } else {
        showTestResult('error', response?.error || 'Failed to save');
      }
    } catch (err) {
      showTestResult('error', err.message);
    } finally {
      btnSaveHost.disabled = false;
      btnSaveHost.textContent = 'Save';
    }
  }

  async function testConnection() {
    const host = inputApiHost.value.trim();
    if (!host) return;

    btnTestConnection.disabled = true;
    btnTestConnection.textContent = 'Testing...';

    try {
      const response = await chrome.runtime.sendMessage({
        type: 'TEST_CONNECTION',
        host,
      });
      if (response?.connected) {
        showTestResult('success', `Connected (status ${response.status})`);
        setConnectionStatus('connected');
      } else {
        showTestResult(
          'error',
          response?.error || 'Connection failed — is the server running?'
        );
        setConnectionStatus('disconnected');
      }
    } catch (err) {
      showTestResult('error', err.message);
      setConnectionStatus('disconnected');
    } finally {
      btnTestConnection.disabled = false;
      btnTestConnection.textContent = 'Test Connection';
    }
  }

  function showTestResult(type, message) {
    connectionTestResult.className = 'test-result ' + type;
    connectionTestResult.textContent = message;
  }

  async function clearHistory() {
    if (
      !confirm(
        'Clear all chat history? This cannot be undone.'
      )
    ) {
      return;
    }
    chatHistory = [];
    await saveChatHistory();
    renderMessages();
    togglePanel('chat');
  }

  // ── Memory ──
  async function loadMemories() {
    memoryList.innerHTML =
      '<div class="empty-state-small">Loading memories...</div>';
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'MEMORY_LIST',
        limit: 20,
      });

      if (response?.success && response.data) {
        const memories = response.data.memories || response.data || [];
        if (Array.isArray(memories) && memories.length > 0) {
          memoryList.innerHTML = memories.map(renderMemoryItem).join('');
        } else {
          memoryList.innerHTML =
            '<div class="empty-state-small">No memories stored yet.</div>';
        }
      } else {
        memoryList.innerHTML =
          '<div class="empty-state-small">Could not load memories. ' +
          (response?.error || '') +
          '</div>';
      }
    } catch (err) {
      memoryList.innerHTML =
        '<div class="empty-state-small">Error: ' +
        escapeHtml(err.message) +
        '</div>';
    }
  }

  function renderMemoryItem(mem) {
    const content = escapeHtml(
      typeof mem === 'string' ? mem : mem.content || JSON.stringify(mem)
    );
    const type = mem.type || 'unknown';
    const tags = mem.tags || [];
    const tagsHtml = tags
      .map((t) => `<span class="memory-tag">${escapeHtml(t)}</span>`)
      .join('');

    return `
      <div class="memory-item">
        <div class="memory-content">${content}</div>
        <div class="memory-meta">
          <span>${type}</span>
          ${tagsHtml}
        </div>
      </div>
    `;
  }

  async function storeMemory() {
    const content = inputMemoryContent.value.trim();
    if (!content) return;

    const memoryType = selectMemoryType.value;
    const tags = inputMemoryTags.value
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    btnStoreMemory.disabled = true;
    btnStoreMemory.textContent = 'Storing...';

    try {
      const response = await chrome.runtime.sendMessage({
        type: 'MEMORY_STORE',
        content,
        memoryType,
        tags,
      });

      if (response?.success) {
        inputMemoryContent.value = '';
        inputMemoryTags.value = '';
        addSystemMessage('Memory stored successfully.');
        loadMemories();
      } else {
        addSystemMessage('Failed to store memory: ' + (response?.error || ''));
      }
    } catch (err) {
      addSystemMessage('Error storing memory: ' + err.message);
    } finally {
      btnStoreMemory.disabled = false;
      btnStoreMemory.textContent = 'Store Memory';
    }
  }

  // ── Chat ──
  async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text || isLoading) return;

    // Handle commands
    if (text.startsWith('/')) {
      await handleCommand(text);
      chatInput.value = '';
      autoResizeInput();
      return;
    }

    // Hide welcome
    if (welcomeMessage) {
      welcomeMessage.style.display = 'none';
    }

    // Add user message
    const userMsg = {
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    chatHistory.push(userMsg);
    appendMessage(userMsg);

    chatInput.value = '';
    autoResizeInput();
    scrollToBottom();
    setLoading(true);

    try {
      const response = await chrome.runtime.sendMessage({
        type: 'CHAT',
        content: text,
      });

      if (response?.success && response.data) {
        const assistantMsg = {
          role: 'assistant',
          content:
            response.data.content ||
            response.data.message ||
            JSON.stringify(response.data),
          modelUsed: response.data.modelUsed || null,
          processingTime: response.data.processingTime || null,
          timestamp: response.data.timestamp || Date.now(),
        };
        chatHistory.push(assistantMsg);
        appendMessage(assistantMsg);
        setConnectionStatus('connected');

        const parts = [];
        if (assistantMsg.modelUsed) parts.push('Model: ' + assistantMsg.modelUsed);
        if (assistantMsg.processingTime)
          parts.push(assistantMsg.processingTime + 'ms');
        if (parts.length) {
          statusText.textContent = parts.join(' · ');
        }
      } else {
        const errorMsg = {
          role: 'error',
          content: response?.error || 'No response from server.',
          timestamp: Date.now(),
          retryText: text,
        };
        chatHistory.push(errorMsg);
        appendMessage(errorMsg);
      }
    } catch (err) {
      const errorMsg = {
        role: 'error',
        content: 'Connection error: ' + err.message,
        timestamp: Date.now(),
        retryText: text,
      };
      chatHistory.push(errorMsg);
      appendMessage(errorMsg);
      setConnectionStatus('disconnected');
    } finally {
      setLoading(false);
      saveChatHistory();
      scrollToBottom();
    }
  }

  async function handleCommand(text) {
    const parts = text.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    if (welcomeMessage) welcomeMessage.style.display = 'none';

    switch (cmd) {
      case '/help':
        addSystemMessage(
          'Available commands:\n' +
            '/help — Show this help message\n' +
            '/memory — Open memory panel\n' +
            '/store <text> — Store a memory\n' +
            '/govern — View governance status\n' +
            '/context — Get current page context\n' +
            '/clear — Clear chat history\n' +
            '/status — Check connection status\n' +
            '/connect — Connect extension to API'
        );
        break;

      case '/memory':
        togglePanel('memory');
        break;

      case '/store':
        if (!args) {
          addSystemMessage('Usage: /store <content to remember>');
        } else {
          try {
            const response = await chrome.runtime.sendMessage({
              type: 'MEMORY_STORE',
              content: args,
              memoryType: 'semantic',
              tags: ['chat-command'],
            });
            if (response?.success) {
              addSystemMessage('Memory stored: "' + args + '"');
            } else {
              addSystemMessage('Failed: ' + (response?.error || 'unknown error'));
            }
          } catch (err) {
            addSystemMessage('Error: ' + err.message);
          }
        }
        break;

      case '/govern':
        try {
          const response = await chrome.runtime.sendMessage({
            type: 'GOVERN',
            action: 'status',
          });
          if (response?.success) {
            addSystemMessage(
              'Governance status:\n' +
                JSON.stringify(response.data, null, 2)
            );
          } else {
            addSystemMessage('Failed: ' + (response?.error || 'unknown'));
          }
        } catch (err) {
          addSystemMessage('Error: ' + err.message);
        }
        break;

      case '/context':
        try {
          const response = await chrome.runtime.sendMessage({
            type: 'GET_PAGE_CONTEXT',
          });
          if (response?.context) {
            const ctx = response.context;
            addSystemMessage(
              'Page context:\n' +
                `Title: ${ctx.title}\n` +
                `URL: ${ctx.url}\n` +
                (ctx.selectedText
                  ? `Selected: "${ctx.selectedText}"\n`
                  : '') +
                (ctx.metaDescription
                  ? `Description: ${ctx.metaDescription}\n`
                  : '')
            );
          } else {
            addSystemMessage('No page context available.');
          }
        } catch (err) {
          addSystemMessage('Error getting context: ' + err.message);
        }
        break;

      case '/clear':
        chatHistory = [];
        await saveChatHistory();
        renderMessages();
        break;

      case '/status':
        await checkConnection();
        addSystemMessage(
          'Connection: ' + connectionDot.title + '\nHost: ' + inputApiHost.value
        );
        break;

      case '/connect':
        try {
          const response = await chrome.runtime.sendMessage({
            type: 'EXTENSION_ACTION',
            action: 'connect',
          });
          if (response?.success) {
            addSystemMessage('Connected to NOVA OVO API.');
            setConnectionStatus('connected');
          } else {
            addSystemMessage('Failed to connect: ' + (response?.error || ''));
            setConnectionStatus('disconnected');
          }
        } catch (err) {
          addSystemMessage('Connection error: ' + err.message);
          setConnectionStatus('disconnected');
        }
        break;

      default:
        addSystemMessage('Unknown command: ' + cmd + '. Type /help for options.');
    }
  }

  function addSystemMessage(content) {
    const msg = { role: 'system', content, timestamp: Date.now() };
    chatHistory.push(msg);
    appendMessage(msg);
    saveChatHistory();
    scrollToBottom();
  }

  // ── Rendering ──
  function renderMessages() {
    messagesContainer.innerHTML = '';
    if (chatHistory.length === 0) {
      messagesContainer.appendChild(createWelcomeElement());
      return;
    }

    if (welcomeMessage && welcomeMessage.parentNode) {
      welcomeMessage.style.display = 'none';
    }

    chatHistory.forEach((msg) => appendMessage(msg, false));
    scrollToBottom();
  }

  function createWelcomeElement() {
    const div = document.createElement('div');
    div.id = 'welcome-message';
    div.className = 'welcome-message';
    div.innerHTML = `
      <div class="welcome-icon">
        <img src="icons/icon128.png" alt="NOVA OVO" width="64" height="64">
      </div>
      <h2>Welcome to NOVA OVO</h2>
      <p>Sovereign AI chat powered by multi-model intelligence.</p>
      <div class="welcome-features">
        <div class="feature"><strong>Chat</strong> — Converse with ORO/Nova AI</div>
        <div class="feature"><strong>Memory</strong> — Store and recall knowledge</div>
        <div class="feature"><strong>Commands</strong> — Type /help for options</div>
        <div class="feature"><strong>Context</strong> — Understands your current page</div>
      </div>
      <p class="welcome-hint">Type a message below to get started.</p>
    `;
    return div;
  }

  function appendMessage(msg, animate = true) {
    const el = document.createElement('div');
    el.className = 'message ' + msg.role;
    if (!animate) el.style.animation = 'none';

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.innerHTML = renderMarkdown(msg.content);
    el.appendChild(bubble);

    // Meta info
    const meta = document.createElement('div');
    meta.className = 'message-meta';

    const timeStr = formatTime(msg.timestamp);
    meta.innerHTML = `<span>${timeStr}</span>`;

    if (msg.modelUsed) {
      meta.innerHTML += `<span>${escapeHtml(msg.modelUsed)}</span>`;
    }
    if (msg.processingTime) {
      meta.innerHTML += `<span>${msg.processingTime}ms</span>`;
    }
    el.appendChild(meta);

    // Error retry
    if (msg.role === 'error' && msg.retryText) {
      const actions = document.createElement('div');
      actions.className = 'error-actions';
      const retryBtn = document.createElement('button');
      retryBtn.className = 'btn-retry';
      retryBtn.textContent = 'Retry';
      retryBtn.addEventListener('click', () => {
        // Remove error message
        const idx = chatHistory.indexOf(msg);
        if (idx > -1) chatHistory.splice(idx, 1);
        el.remove();
        chatInput.value = msg.retryText;
        sendMessage();
      });
      actions.appendChild(retryBtn);
      el.appendChild(actions);
    }

    messagesContainer.appendChild(el);
  }

  function setLoading(loading) {
    isLoading = loading;
    btnSend.disabled = loading;

    const existingLoader = messagesContainer.querySelector('.loading-indicator');
    if (loading && !existingLoader) {
      const loader = document.createElement('div');
      loader.className = 'loading-indicator';
      loader.innerHTML = `
        <div class="loading-dots">
          <span></span><span></span><span></span>
        </div>
      `;
      messagesContainer.appendChild(loader);
      scrollToBottom();
    } else if (!loading && existingLoader) {
      existingLoader.remove();
    }

    statusText.textContent = loading ? 'Processing...' : 'Ready';
  }

  function scrollToBottom() {
    requestAnimationFrame(() => {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
  }

  // ── Markdown Rendering ──
  function renderMarkdown(text) {
    if (!text) return '';
    let html = escapeHtml(text);

    // Code blocks (``` ... ```)
    html = html.replace(
      /```(\w*)\n([\s\S]*?)```/g,
      (_, lang, code) =>
        `<pre><code class="language-${lang || 'text'}">${code.trim()}</code></pre>`
    );

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Blockquotes
    html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');

    // Unordered lists
    html = html.replace(/^[-*] (.+)$/gm, '<li>$1</li>');
    html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');

    // Ordered lists
    html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

    // Paragraphs — replace double newlines
    html = html.replace(/\n\n/g, '</p><p>');
    // Single newlines become <br>
    html = html.replace(/\n/g, '<br>');

    // Wrap in paragraph if not already structured
    if (
      !html.startsWith('<p>') &&
      !html.startsWith('<pre>') &&
      !html.startsWith('<ul>') &&
      !html.startsWith('<ol>') &&
      !html.startsWith('<blockquote>')
    ) {
      html = '<p>' + html + '</p>';
    }

    return html;
  }

  // ── Utilities ──
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function formatTime(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // ── Start ──
  init();
})();
