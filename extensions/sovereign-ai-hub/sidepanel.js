(function () {
  'use strict';

  // ========== State ==========
  let currentAI = null;
  let allAIs = [];
  let selectedDocType = null;

  // ========== DOM Refs ==========
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const statusDot     = $('#statusDot');
  const aiGrid        = $('#aiGrid');
  const aiSelector    = $('#aiSelector');
  const chatMessages  = $('#chatMessages');
  const chatInput     = $('#chatInput');
  const chatSendBtn   = $('#chatSendBtn');
  const docTemplates  = $('#docTemplates');
  const docTitle      = $('#docTitle');
  const docGenerateBtn = $('#docGenerateBtn');
  const docOutput     = $('#docOutput');
  const researchTopic = $('#researchTopic');
  const researchBtn   = $('#researchBtn');
  const researchSteps = $('#researchSteps');
  const wfList        = $('#wfList');
  const wfCreateBtn   = $('#wfCreateBtn');
  const promptList    = $('#promptList');
  const promptCreateBtn = $('#promptCreateBtn');

  // ========== Messaging ==========
  function msg(payload) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(payload, (response) => {
        resolve(response || { success: false, error: 'No response' });
      });
    });
  }

  // ========== Init ==========
  async function init() {
    setupTabs();
    await loadAIs();
    setupChat();
    setupDocs();
    setupResearch();
    setupWorkflows();
    setupPrompts();
    checkConnection();
    setInterval(checkConnection, 30000);
  }

  // ========== Connection ==========
  async function checkConnection() {
    const res = await msg({ type: 'PING' });
    if (res && res.success) {
      statusDot.classList.add('online');
      statusDot.title = 'Connected to NOVA OVO';
    } else {
      statusDot.classList.remove('online');
      statusDot.title = 'Disconnected';
    }
  }

  // ========== Tabs ==========
  function setupTabs() {
    $$('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.tab-btn').forEach(b => b.classList.remove('active'));
        $$('.panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        $(`#panel-${btn.dataset.tab}`).classList.add('active');
      });
    });
  }

  function switchToTab(tabName) {
    $$('.tab-btn').forEach(b => b.classList.remove('active'));
    $$('.panel').forEach(p => p.classList.remove('active'));
    $(`.tab-btn[data-tab="${tabName}"]`).classList.add('active');
    $(`#panel-${tabName}`).classList.add('active');
  }

  // ========== AIs Panel ==========
  async function loadAIs() {
    const res = await msg({ type: 'LIST_AIS' });
    if (!res || !res.success) return;
    allAIs = res.ais;
    renderAIGrid();
    populateAISelector();
  }

  function renderAIGrid() {
    aiGrid.innerHTML = allAIs.map(ai => `
      <div class="ai-card fade-in" data-ai="${ai.id}">
        <div class="ai-card-emoji">${ai.emoji}</div>
        <div class="ai-card-name">${ai.name}</div>
        <div class="ai-card-spec">${ai.specialty}</div>
      </div>
    `).join('');

    aiGrid.querySelectorAll('.ai-card').forEach(card => {
      card.addEventListener('click', () => {
        const aiId = card.dataset.ai;
        aiSelector.value = aiId;
        currentAI = aiId;
        switchToTab('chat');
        const ai = allAIs.find(a => a.id === aiId);
        addChatMessage('system', `Switched to ${ai.emoji} ${ai.name} — ${ai.specialty}`);
        chatInput.focus();
      });
    });
  }

  function populateAISelector() {
    aiSelector.innerHTML = allAIs.map(ai =>
      `<option value="${ai.id}">${ai.emoji} ${ai.name} — ${ai.specialty}</option>`
    ).join('');
    if (allAIs.length > 0) currentAI = allAIs[0].id;
    aiSelector.addEventListener('change', () => {
      currentAI = aiSelector.value;
      const ai = allAIs.find(a => a.id === currentAI);
      addChatMessage('system', `Switched to ${ai.emoji} ${ai.name}`);
    });
  }

  // ========== Chat ==========
  function setupChat() {
    chatSendBtn.addEventListener('click', sendChatMessage);
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendChatMessage();
      }
    });
  }

  async function sendChatMessage() {
    const text = chatInput.value.trim();
    if (!text || !currentAI) return;

    chatInput.value = '';
    addChatMessage('user', text, 'You');
    chatSendBtn.disabled = true;

    const ai = allAIs.find(a => a.id === currentAI);
    const thinkingId = addChatMessage('ai', `${ai.emoji} ${ai.name} is thinking…`, ai.name, true);

    let context = '';
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab && tab.url && !tab.url.startsWith('chrome')) {
        const results = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => document.title + '\n' + document.body.innerText.substring(0, 2000)
        });
        if (results && results[0]) context = results[0].result;
      }
    } catch {
      // No page context available
    }

    const res = await msg({ type: 'ROUTE_AI', aiId: currentAI, prompt: text, context });

    removeChatMessage(thinkingId);

    if (res && res.success) {
      addChatMessage('ai', res.response, `${res.emoji} ${res.ai}`);
    } else {
      addChatMessage('error', res ? res.error : 'Failed to get response');
    }
    chatSendBtn.disabled = false;
    chatInput.focus();
  }

  function addChatMessage(type, content, sender, isPulsing) {
    const id = 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const div = document.createElement('div');
    div.className = `msg ${type} fade-in${isPulsing ? ' pulse' : ''}`;
    div.id = id;

    if (sender && (type === 'user' || type === 'ai')) {
      div.innerHTML = `<div class="msg-sender">${escapeHTML(sender)}</div>${escapeHTML(content)}`;
    } else {
      div.textContent = content;
    }

    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return id;
  }

  function removeChatMessage(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  // ========== Docs ==========
  const DOC_TEMPLATE_META = [
    { type: 'report',   icon: '📊', label: 'Report' },
    { type: 'summary',  icon: '📝', label: 'Summary' },
    { type: 'analysis', icon: '🔍', label: 'Analysis' },
    { type: 'proposal', icon: '💼', label: 'Proposal' },
    { type: 'email',    icon: '✉️',  label: 'Email' },
    { type: 'brief',    icon: '📋', label: 'Brief' },
    { type: 'spec',     icon: '⚙️',  label: 'Spec' },
    { type: 'plan',     icon: '🗺️',  label: 'Plan' }
  ];

  function setupDocs() {
    docTemplates.innerHTML = DOC_TEMPLATE_META.map(t => `
      <div class="doc-tmpl-btn" data-type="${t.type}">
        <span class="doc-tmpl-icon">${t.icon}</span>${t.label}
      </div>
    `).join('');

    docTemplates.querySelectorAll('.doc-tmpl-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        docTemplates.querySelectorAll('.doc-tmpl-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedDocType = btn.dataset.type;
        docGenerateBtn.disabled = false;
      });
    });

    docGenerateBtn.addEventListener('click', generateDoc);
  }

  async function generateDoc() {
    const title = docTitle.value.trim();
    if (!selectedDocType) return;
    if (!title) { docOutput.textContent = 'Please enter a document title.'; return; }

    docGenerateBtn.disabled = true;
    docOutput.textContent = '⏳ Generating document…';

    let context = '';
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab && tab.url && !tab.url.startsWith('chrome')) {
        const results = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => document.title + '\n' + document.body.innerText.substring(0, 3000)
        });
        if (results && results[0]) context = results[0].result;
      }
    } catch {
      // No context
    }

    const res = await msg({ type: 'GENERATE_DOC', docType: selectedDocType, title, context });

    if (res && res.success) {
      docOutput.textContent = res.document.content;
    } else {
      docOutput.textContent = `❌ Error: ${res ? res.error : 'Failed to generate'}`;
    }
    docGenerateBtn.disabled = false;
  }

  // ========== Research ==========
  const RESEARCH_STEP_META = [
    { id: 'gather',     icon: '📡', label: 'Gathering Sources' },
    { id: 'analyze',    icon: '🔬', label: 'Analyzing Data' },
    { id: 'synthesize', icon: '🧬', label: 'Synthesizing Insights' },
    { id: 'conclude',   icon: '🎯', label: 'Drawing Conclusions' }
  ];

  function setupResearch() {
    researchBtn.addEventListener('click', runResearch);
    researchTopic.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') runResearch();
    });
  }

  async function runResearch() {
    const topic = researchTopic.value.trim();
    if (!topic) return;

    researchBtn.disabled = true;

    // Show steps with pending status
    researchSteps.innerHTML = RESEARCH_STEP_META.map(s => `
      <div class="research-step fade-in" id="rstep-${s.id}">
        <div class="step-header">
          <span class="step-icon">${s.icon}</span>
          <span class="step-label">${s.label}</span>
          <span class="step-status" id="rstatus-${s.id}">pending</span>
        </div>
        <div class="step-content" id="rcontent-${s.id}"></div>
      </div>
    `).join('');

    // Animate steps sequentially via background
    let context = '';
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab && tab.url && !tab.url.startsWith('chrome')) {
        const results = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => document.title + '\n' + document.body.innerText.substring(0, 2000)
        });
        if (results && results[0]) context = results[0].result;
      }
    } catch {
      // No context
    }

    // Set first step as active
    for (const s of RESEARCH_STEP_META) {
      const stepEl = $(`#rstep-${s.id}`);
      const statusEl = $(`#rstatus-${s.id}`);
      stepEl.classList.add('active');
      statusEl.textContent = 'running…';
      statusEl.className = 'step-status running';
    }

    const res = await msg({ type: 'RESEARCH', topic, context });

    if (res && res.success && res.report) {
      res.report.steps.forEach(step => {
        const stepEl = $(`#rstep-${step.id}`);
        const statusEl = $(`#rstatus-${step.id}`);
        const contentEl = $(`#rcontent-${step.id}`);

        stepEl.classList.remove('active');
        if (step.status === 'complete') {
          stepEl.classList.add('complete');
          statusEl.textContent = 'complete';
          statusEl.className = 'step-status complete';
          contentEl.textContent = step.response;
        } else {
          stepEl.classList.add('error');
          statusEl.textContent = 'error';
          statusEl.className = 'step-status error';
          contentEl.textContent = step.error || 'Unknown error';
        }
      });
    } else {
      researchSteps.innerHTML = `<div class="msg error fade-in">❌ Research failed: ${res ? res.error : 'Unknown error'}</div>`;
    }

    researchBtn.disabled = false;
  }

  // ========== Workflows ==========
  async function setupWorkflows() {
    wfCreateBtn.addEventListener('click', openWorkflowModal);
    $('#wfModalCancel').addEventListener('click', closeWorkflowModal);
    $('#wfModalSave').addEventListener('click', saveWorkflow);
    $('#wfModalAddStep').addEventListener('click', addWorkflowStepRow);
    await loadWorkflows();
  }

  async function loadWorkflows() {
    const data = await chrome.storage.local.get(['hub_workflows']);
    const workflows = data.hub_workflows || [];
    renderWorkflows(workflows);
  }

  function renderWorkflows(workflows) {
    if (workflows.length === 0) {
      wfList.innerHTML = `<div class="empty-state"><div class="empty-state-icon">⚡</div>No workflows yet. Create one to chain AI tasks together.</div>`;
      return;
    }

    wfList.innerHTML = workflows.map((wf, idx) => `
      <div class="wf-card fade-in">
        <div class="wf-card-header">
          <span class="wf-card-name">⚡ ${escapeHTML(wf.name)}</span>
          <div class="wf-card-actions">
            <button class="btn btn-sm" data-wf-run="${idx}">▶ Run</button>
            <button class="btn btn-sm btn-danger" data-wf-del="${idx}">✕</button>
          </div>
        </div>
        <div class="wf-step-list">
          ${wf.steps.map((s, i) => {
            const ai = allAIs.find(a => a.id === s.aiId);
            return `<div class="wf-step-item"><span class="wf-step-num">${i + 1}</span>${ai ? ai.emoji : '🤖'} ${escapeHTML(s.name)}</div>`;
          }).join('')}
        </div>
        <div class="wf-result" id="wf-result-${idx}" style="margin-top:8px;"></div>
      </div>
    `).join('');

    wfList.querySelectorAll('[data-wf-run]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const idx = parseInt(btn.dataset.wfRun);
        const data = await chrome.storage.local.get(['hub_workflows']);
        const wf = (data.hub_workflows || [])[idx];
        if (!wf) return;

        btn.disabled = true;
        btn.textContent = '⏳';
        const resultDiv = $(`#wf-result-${idx}`);
        resultDiv.innerHTML = '<span class="spinner"></span> Running workflow…';

        const res = await msg({ type: 'WORKFLOW_RUN', workflow: wf });

        if (res && res.success) {
          resultDiv.innerHTML = res.results.map(r =>
            `<div style="margin-top:4px; font-size:11px; color:${r.status === 'complete' ? 'var(--success)' : 'var(--error)'}">
              ${r.emoji || '🤖'} <strong>${escapeHTML(r.step)}</strong>: ${r.status === 'complete' ? escapeHTML((r.response || '').substring(0, 200)) + '…' : escapeHTML(r.error)}
            </div>`
          ).join('');
        } else {
          resultDiv.innerHTML = `<div style="color:var(--error); font-size:11px;">❌ ${escapeHTML(res ? res.error : 'Failed')}</div>`;
        }
        btn.disabled = false;
        btn.textContent = '▶ Run';
      });
    });

    wfList.querySelectorAll('[data-wf-del]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const idx = parseInt(btn.dataset.wfDel);
        const data = await chrome.storage.local.get(['hub_workflows']);
        const workflows = data.hub_workflows || [];
        workflows.splice(idx, 1);
        await chrome.storage.local.set({ hub_workflows: workflows });
        renderWorkflows(workflows);
      });
    });
  }

  function openWorkflowModal() {
    $('#wfModalName').value = '';
    $('#wfModalSteps').innerHTML = '';
    addWorkflowStepRow();
    $('#wfModal').classList.add('visible');
  }

  function closeWorkflowModal() {
    $('#wfModal').classList.remove('visible');
  }

  function addWorkflowStepRow() {
    const container = $('#wfModalSteps');
    const row = document.createElement('div');
    row.className = 'modal-step-row';
    row.innerHTML = `
      <input type="text" placeholder="Step name…" class="wf-step-name" style="flex:1">
      <select class="wf-step-ai" style="flex:1">
        ${allAIs.map(ai => `<option value="${ai.id}">${ai.emoji} ${ai.name}</option>`).join('')}
      </select>
      <input type="text" placeholder="Action/prompt…" class="wf-step-action" style="flex:2">
    `;
    container.appendChild(row);
  }

  async function saveWorkflow() {
    const name = $('#wfModalName').value.trim();
    if (!name) return;

    const steps = [];
    $('#wfModalSteps').querySelectorAll('.modal-step-row').forEach(row => {
      const stepName = row.querySelector('.wf-step-name').value.trim();
      const aiId = row.querySelector('.wf-step-ai').value;
      const action = row.querySelector('.wf-step-action').value.trim();
      if (stepName && action) {
        steps.push({ name: stepName, aiId, action });
      }
    });

    if (steps.length === 0) return;

    const workflow = { id: `wf_${Date.now()}`, name, steps, createdAt: new Date().toISOString() };
    const data = await chrome.storage.local.get(['hub_workflows']);
    const workflows = data.hub_workflows || [];
    workflows.unshift(workflow);
    await chrome.storage.local.set({ hub_workflows: workflows });

    closeWorkflowModal();
    renderWorkflows(workflows);
  }

  // ========== Prompts ==========
  async function setupPrompts() {
    promptCreateBtn.addEventListener('click', () => openPromptModal());
    $('#promptModalCancel').addEventListener('click', closePromptModal);
    $('#promptModalSave').addEventListener('click', savePrompt);
    $('#promptModalText').addEventListener('input', detectVariables);
    await loadPrompts();
  }

  async function loadPrompts() {
    const res = await msg({ type: 'PROMPT_LIBRARY', action: 'list' });
    if (res && res.success) renderPrompts(res.prompts);
  }

  function renderPrompts(prompts) {
    if (!prompts || prompts.length === 0) {
      promptList.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📚</div>No prompts saved. Create reusable prompt templates.</div>`;
      return;
    }

    promptList.innerHTML = prompts.map(p => `
      <div class="prompt-card fade-in">
        <div class="prompt-card-header">
          <span class="prompt-card-name">${escapeHTML(p.name)}</span>
          <span class="prompt-card-cat">${escapeHTML(p.category)}</span>
        </div>
        <div class="prompt-card-text">${escapeHTML(p.text)}</div>
        ${p.variables && p.variables.length ? `<div class="prompt-card-vars">Variables: ${p.variables.map(v => '{{' + v + '}}').join(', ')}</div>` : ''}
        <div class="prompt-card-actions">
          <button class="btn btn-sm btn-outline" data-prompt-copy="${p.id}">📋 Copy</button>
          <button class="btn btn-sm btn-outline" data-prompt-edit="${p.id}">✏️ Edit</button>
          <button class="btn btn-sm btn-danger" data-prompt-del="${p.id}">✕</button>
        </div>
      </div>
    `).join('');

    promptList.querySelectorAll('[data-prompt-copy]').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = prompts.find(x => x.id === btn.dataset.promptCopy);
        if (p) {
          navigator.clipboard.writeText(p.text).then(() => {
            btn.textContent = '✅ Copied';
            setTimeout(() => { btn.textContent = '📋 Copy'; }, 1500);
          });
        }
      });
    });

    promptList.querySelectorAll('[data-prompt-edit]').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = prompts.find(x => x.id === btn.dataset.promptEdit);
        if (p) openPromptModal(p);
      });
    });

    promptList.querySelectorAll('[data-prompt-del]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const res = await msg({ type: 'PROMPT_LIBRARY', action: 'delete', data: { id: btn.dataset.promptDel } });
        if (res && res.success) renderPrompts(res.prompts);
      });
    });
  }

  function openPromptModal(existing) {
    $('#promptModalTitle').textContent = existing ? 'Edit Prompt' : 'Create Prompt';
    $('#promptModalId').value = existing ? existing.id : '';
    $('#promptModalName').value = existing ? existing.name : '';
    $('#promptModalCategory').value = existing ? existing.category : '';
    $('#promptModalText').value = existing ? existing.text : '';
    detectVariables();
    $('#promptModal').classList.add('visible');
  }

  function closePromptModal() {
    $('#promptModal').classList.remove('visible');
  }

  function detectVariables() {
    const text = $('#promptModalText').value;
    const matches = text.match(/\{\{(\w+)\}\}/g);
    const vars = matches ? [...new Set(matches.map(m => m.replace(/\{\{|\}\}/g, '')))] : [];
    $('#promptModalVars').textContent = vars.length ? vars.join(', ') : 'none';
  }

  async function savePrompt() {
    const id = $('#promptModalId').value;
    const name = $('#promptModalName').value.trim();
    const category = $('#promptModalCategory').value.trim();
    const text = $('#promptModalText').value.trim();
    if (!name || !text) return;

    const matches = text.match(/\{\{(\w+)\}\}/g);
    const variables = matches ? [...new Set(matches.map(m => m.replace(/\{\{|\}\}/g, '')))] : [];

    const action = id ? 'update' : 'create';
    const data = { id, name, category: category || 'General', text, variables };
    const res = await msg({ type: 'PROMPT_LIBRARY', action, data });

    if (res && res.success) {
      closePromptModal();
      renderPrompts(res.prompts);
    }
  }

  // ========== Helpers ==========
  function escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ========== Boot ==========
  document.addEventListener('DOMContentLoaded', init);
})();
