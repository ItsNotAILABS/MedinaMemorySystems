/* NOVA OVO Page Intelligence — Options Page Script */

(function () {
  'use strict';

  const defaults = {
    apiHost: 'http://localhost:3000',
    autoAnalyze: false,
    highlightColor: '#10b981',
    defaultMemoryType: 'semantic',
    defaultTags: '',
  };

  /* ── Init ──────────────────────────────────────────────── */

  document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    bindEvents();
  });

  /* ── Load Settings ─────────────────────────────────────── */

  function loadSettings() {
    chrome.storage.sync.get(
      ['apiHost', 'autoAnalyze', 'highlightColor', 'defaultMemoryType', 'defaultTags'],
      (result) => {
        document.getElementById('api-host').value = result.apiHost || defaults.apiHost;
        document.getElementById('auto-analyze').checked =
          result.autoAnalyze !== undefined ? result.autoAnalyze : defaults.autoAnalyze;
        const color = result.highlightColor || defaults.highlightColor;
        document.getElementById('highlight-color').value = color;
        document.getElementById('color-hex').textContent = color;
        document.getElementById('default-memory-type').value =
          result.defaultMemoryType || defaults.defaultMemoryType;
        document.getElementById('default-tags').value = result.defaultTags || defaults.defaultTags;

        updatePresetActive(color);
      }
    );
  }

  /* ── Bind Events ───────────────────────────────────────── */

  function bindEvents() {
    // Save button
    document.getElementById('btn-save').addEventListener('click', saveAllSettings);

    // Test connection
    document.getElementById('btn-test').addEventListener('click', testConnection);

    // Color picker
    const colorInput = document.getElementById('highlight-color');
    colorInput.addEventListener('input', () => {
      document.getElementById('color-hex').textContent = colorInput.value;
      updatePresetActive(colorInput.value);
    });

    // Preset colors
    document.querySelectorAll('.color-preset').forEach((btn) => {
      btn.addEventListener('click', () => {
        const color = btn.dataset.color;
        colorInput.value = color;
        document.getElementById('color-hex').textContent = color;
        updatePresetActive(color);
      });
    });

    // Export settings
    document.getElementById('btn-export').addEventListener('click', exportSettings);

    // Import settings
    document.getElementById('btn-import').addEventListener('click', () => {
      document.getElementById('file-import').click();
    });
    document.getElementById('file-import').addEventListener('change', importSettings);

    // Clear history
    document.getElementById('btn-clear-history').addEventListener('click', () => {
      if (confirm('Clear all analysis history? This cannot be undone.')) {
        chrome.storage.local.remove('nova_analysis_history', () => {
          showSaveStatus('Analysis history cleared');
        });
      }
    });

    // Clear highlights
    document.getElementById('btn-clear-highlights').addEventListener('click', () => {
      if (confirm('Clear all saved highlights from all pages? This cannot be undone.')) {
        chrome.storage.local.get(null, (items) => {
          const keys = Object.keys(items).filter((k) => k.startsWith('nova_highlights_'));
          if (keys.length > 0) {
            chrome.storage.local.remove(keys, () => {
              showSaveStatus('All highlights cleared');
            });
          } else {
            showSaveStatus('No highlights to clear');
          }
        });
      }
    });
  }

  /* ── Save Settings ─────────────────────────────────────── */

  function saveAllSettings() {
    const settings = {
      apiHost: document.getElementById('api-host').value.replace(/\/+$/, ''),
      autoAnalyze: document.getElementById('auto-analyze').checked,
      highlightColor: document.getElementById('highlight-color').value,
      defaultMemoryType: document.getElementById('default-memory-type').value,
      defaultTags: document.getElementById('default-tags').value.trim(),
    };

    chrome.storage.sync.set(settings, () => {
      showSaveStatus('✅ Settings saved successfully');
    });
  }

  /* ── Test Connection ───────────────────────────────────── */

  function testConnection() {
    const resultEl = document.getElementById('test-result');
    resultEl.textContent = 'Testing…';
    resultEl.className = 'test-result';

    const host = document.getElementById('api-host').value.replace(/\/+$/, '');

    chrome.runtime.sendMessage({ type: 'NOVA_TEST_CONNECTION', apiHost: host }, (response) => {
      if (response && response.success) {
        resultEl.textContent = '✅ Connected successfully';
        resultEl.className = 'test-result test-result--success';
      } else {
        resultEl.textContent = '❌ ' + ((response && response.error) || 'Connection failed');
        resultEl.className = 'test-result test-result--error';
      }
    });
  }

  /* ── Export / Import ───────────────────────────────────── */

  function exportSettings() {
    chrome.storage.sync.get(null, (syncData) => {
      chrome.storage.local.get(null, (localData) => {
        const exportData = {
          version: '1.0.0',
          timestamp: Date.now(),
          sync: syncData,
          local: localData,
        };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
          type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'nova-ovo-settings.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showSaveStatus('Settings exported');
      });
    });
  }

  function importSettings(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data.sync && !data.local) {
          showSaveStatus('Invalid settings file', true);
          return;
        }

        if (data.sync) {
          chrome.storage.sync.set(data.sync, () => {
            if (data.local) {
              chrome.storage.local.set(data.local, () => {
                loadSettings();
                showSaveStatus('Settings imported successfully');
              });
            } else {
              loadSettings();
              showSaveStatus('Settings imported successfully');
            }
          });
        } else if (data.local) {
          chrome.storage.local.set(data.local, () => {
            loadSettings();
            showSaveStatus('Settings imported successfully');
          });
        }
      } catch {
        showSaveStatus('Failed to parse settings file', true);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }

  /* ── Helpers ───────────────────────────────────────────── */

  function updatePresetActive(activeColor) {
    document.querySelectorAll('.color-preset').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.color === activeColor);
    });
  }

  function showSaveStatus(text, isError) {
    const el = document.getElementById('save-status');
    el.textContent = text;
    el.className = 'save-status' + (isError ? '' : ' save-status--success');
    el.style.opacity = '1';
    setTimeout(() => {
      el.style.opacity = '0';
    }, 3000);
  }
})();
