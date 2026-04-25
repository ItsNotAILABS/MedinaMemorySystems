'use strict';

(function () {
  const $ = (sel) => document.querySelector(sel);

  const inputApiHost = $('#input-api-host');
  const btnSave = $('#btn-save');
  const btnTest = $('#btn-test');
  const btnClear = $('#btn-clear');
  const statusMessage = $('#status-message');
  const versionNumber = $('#version-number');

  async function init() {
    const manifest = chrome.runtime.getManifest();
    versionNumber.textContent = manifest.version;

    const result = await chrome.storage.sync.get('apiHost');
    if (result.apiHost) {
      inputApiHost.value = result.apiHost;
    }

    btnSave.addEventListener('click', saveSettings);
    btnTest.addEventListener('click', testConnection);
    btnClear.addEventListener('click', clearHistory);
  }

  async function saveSettings() {
    const host = inputApiHost.value.trim();
    if (!host) {
      showStatus('error', 'Please enter a valid URL.');
      return;
    }

    try {
      new URL(host);
    } catch {
      showStatus('error', 'Invalid URL format.');
      return;
    }

    btnSave.disabled = true;
    btnSave.textContent = 'Saving...';

    try {
      const response = await chrome.runtime.sendMessage({
        type: 'SET_API_HOST',
        host,
      });
      if (response?.success) {
        showStatus('success', 'Settings saved. Status: ' + response.status);
      } else {
        showStatus('error', response?.error || 'Failed to save settings.');
      }
    } catch (err) {
      showStatus('error', 'Error: ' + err.message);
    } finally {
      btnSave.disabled = false;
      btnSave.textContent = 'Save Settings';
    }
  }

  async function testConnection() {
    const host = inputApiHost.value.trim();
    if (!host) {
      showStatus('error', 'Please enter a URL to test.');
      return;
    }

    btnTest.disabled = true;
    btnTest.textContent = 'Testing...';

    try {
      const response = await chrome.runtime.sendMessage({
        type: 'TEST_CONNECTION',
        host,
      });
      if (response?.connected) {
        showStatus(
          'success',
          'Connection successful! Server responded with status ' +
            response.status +
            '.'
        );
      } else {
        showStatus(
          'error',
          'Connection failed: ' +
            (response?.error || 'Server not reachable. Is it running?')
        );
      }
    } catch (err) {
      showStatus('error', 'Error: ' + err.message);
    } finally {
      btnTest.disabled = false;
      btnTest.textContent = 'Test Connection';
    }
  }

  async function clearHistory() {
    if (
      !confirm(
        'Are you sure you want to clear all chat history? This cannot be undone.'
      )
    ) {
      return;
    }

    try {
      await chrome.storage.local.remove('chatHistory');
      showStatus('success', 'Chat history cleared.');
    } catch (err) {
      showStatus('error', 'Error: ' + err.message);
    }
  }

  function showStatus(type, message) {
    statusMessage.className = 'status-message ' + type;
    statusMessage.textContent = message;

    clearTimeout(showStatus._timer);
    showStatus._timer = setTimeout(() => {
      statusMessage.classList.add('hidden');
    }, 6000);
  }

  init();
})();
