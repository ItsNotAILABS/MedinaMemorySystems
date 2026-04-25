// MERIDIAN AI Toolkit — Content Script
// FAB positioned bottom-LEFT (JARVIS uses bottom-RIGHT)

(function () {
  'use strict';

  if (document.getElementById('meridian-toolkit-fab')) return;

  // ── FAB Button ───────────────────────────────────────────────────────────

  const fab = document.createElement('button');
  fab.id = 'meridian-toolkit-fab';
  fab.innerHTML = '🛠';
  fab.title = 'MERIDIAN Toolkit';
  document.body.appendChild(fab);

  // ── Quick Actions Menu ───────────────────────────────────────────────────

  const menu = document.createElement('div');
  menu.id = 'meridian-toolkit-menu';
  menu.innerHTML = `
    <button class="meridian-toolkit-action" data-action="analyze" title="Analyze Page">🔬</button>
    <button class="meridian-toolkit-action" data-action="code" title="Extract Code">💻</button>
    <button class="meridian-toolkit-action" data-action="a11y" title="A11y Scan">♿</button>
  `;
  document.body.appendChild(menu);

  let menuOpen = false;

  fab.addEventListener('click', (e) => {
    e.stopPropagation();
    menuOpen = !menuOpen;
    menu.classList.toggle('meridian-toolkit-menu-open', menuOpen);
    fab.classList.toggle('meridian-toolkit-fab-active', menuOpen);
  });

  document.addEventListener('click', () => {
    if (menuOpen) {
      menuOpen = false;
      menu.classList.remove('meridian-toolkit-menu-open');
      fab.classList.remove('meridian-toolkit-fab-active');
    }
  });

  menu.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // ── Quick Action Handlers ────────────────────────────────────────────────

  const actionMap = {
    analyze: 'ANALYZE_PAGE',
    code: 'EXTRACT_CODE',
    a11y: 'A11Y_SCAN',
  };

  const actionLabels = {
    analyze: 'Page Analysis',
    code: 'Code Extraction',
    a11y: 'Accessibility Scan',
  };

  menu.querySelectorAll('.meridian-toolkit-action').forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      const msgType = actionMap[action];
      if (!msgType) return;

      showToast(`Running ${actionLabels[action]}...`, 'info');

      chrome.runtime.sendMessage({ type: msgType }, (response) => {
        if (chrome.runtime.lastError) {
          showToast('Open the side panel for full results', 'info');
          return;
        }
        if (response && response.error) {
          showToast(`Error: ${response.error}`, 'error');
        } else {
          let summary = '';
          if (action === 'analyze' && response) {
            summary = `${response.wordCount} words · ${response.links?.total || 0} links · ${response.images?.total || 0} images`;
          } else if (action === 'code' && response) {
            summary = `Found ${response.count} code block(s)`;
          } else if (action === 'a11y' && response) {
            summary = `${response.summary?.errors || 0} errors · ${response.summary?.warnings || 0} warnings`;
          }
          showToast(`${actionLabels[action]}: ${summary}`, 'success');
        }

        menuOpen = false;
        menu.classList.remove('meridian-toolkit-menu-open');
        fab.classList.remove('meridian-toolkit-fab-active');
      });
    });
  });

  // ── Toast Notifications ──────────────────────────────────────────────────

  function showToast(message, type) {
    const existing = document.getElementById('meridian-toolkit-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'meridian-toolkit-toast';
    toast.className = `meridian-toolkit-toast meridian-toolkit-toast-${type || 'info'}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('meridian-toolkit-toast-show');
    });

    setTimeout(() => {
      toast.classList.remove('meridian-toolkit-toast-show');
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  // ── Draggable FAB ───────────────────────────────────────────────────────

  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let hasMoved = false;

  fab.addEventListener('mousedown', (e) => {
    isDragging = true;
    hasMoved = false;
    dragOffsetX = e.clientX - fab.getBoundingClientRect().left;
    dragOffsetY = e.clientY - fab.getBoundingClientRect().top;
    fab.style.transition = 'none';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    hasMoved = true;
    const x = e.clientX - dragOffsetX;
    const y = e.clientY - dragOffsetY;
    fab.style.left = x + 'px';
    fab.style.top = y + 'px';
    fab.style.right = 'auto';
    fab.style.bottom = 'auto';

    // Move menu with FAB
    menu.style.left = x + 'px';
    menu.style.top = (y - 10) + 'px';
    menu.style.right = 'auto';
    menu.style.bottom = 'auto';
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      fab.style.transition = '';
      if (hasMoved) {
        // Prevent click after drag
        setTimeout(() => { hasMoved = false; }, 10);
      }
    }
  });
})();
