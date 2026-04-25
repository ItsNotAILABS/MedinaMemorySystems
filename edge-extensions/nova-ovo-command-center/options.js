/* NOVA OVO Command Center — Options Controller */

(function () {
  "use strict";

  const DEFAULT_CONFIG = {
    apiHost: "http://localhost:3000",
    healthCheckInterval: 0.5,
    notificationsEnabled: true,
    autoBoot: false,
    theme: "dark",
  };

  const apiHostInput = document.getElementById("apiHost");
  const healthCheckSelect = document.getElementById("healthCheckInterval");
  const notificationsCheckbox = document.getElementById("notificationsEnabled");
  const autoBootCheckbox = document.getElementById("autoBoot");
  const themeSelect = document.getElementById("theme");
  const saveBtn = document.getElementById("saveBtn");
  const saveStatus = document.getElementById("saveStatus");
  const form = document.getElementById("settingsForm");

  function loadSettings() {
    chrome.storage.sync.get(DEFAULT_CONFIG, (cfg) => {
      apiHostInput.value = cfg.apiHost || DEFAULT_CONFIG.apiHost;
      healthCheckSelect.value = String(
        cfg.healthCheckInterval || DEFAULT_CONFIG.healthCheckInterval
      );
      notificationsCheckbox.checked =
        cfg.notificationsEnabled !== undefined
          ? cfg.notificationsEnabled
          : DEFAULT_CONFIG.notificationsEnabled;
      autoBootCheckbox.checked = cfg.autoBoot || DEFAULT_CONFIG.autoBoot;
      themeSelect.value = cfg.theme || DEFAULT_CONFIG.theme;
    });
  }

  function saveSettings(e) {
    e.preventDefault();

    const config = {
      apiHost: apiHostInput.value.replace(/\/+$/, "") || DEFAULT_CONFIG.apiHost,
      healthCheckInterval: parseFloat(healthCheckSelect.value) || 0.5,
      notificationsEnabled: notificationsCheckbox.checked,
      autoBoot: autoBootCheckbox.checked,
      theme: themeSelect.value,
    };

    chrome.runtime.sendMessage(
      { type: "save-config", config },
      (resp) => {
        if (resp && resp.success) {
          showSaveStatus("✓ Settings saved");
        } else {
          showSaveStatus("✗ Failed to save");
        }
      }
    );
  }

  function showSaveStatus(text) {
    saveStatus.textContent = text;
    saveStatus.classList.add("visible");
    setTimeout(() => {
      saveStatus.classList.remove("visible");
    }, 2500);
  }

  form.addEventListener("submit", saveSettings);
  loadSettings();
})();
