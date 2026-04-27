// MERIDIAN AI Toolkit — Side Panel Controller
// Sovereign Developer Tools by Alfredo Medina Hernandez

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initAnalyze();
  initCode();
  initColors();
  initPerf();
  initA11y();
  initUtils();
});

// ═══════════════════════════════════════════════════════════════════════════
// TAB SWITCHING
// ═══════════════════════════════════════════════════════════════════════════

function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabBtns.forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.panel').forEach((p) => p.classList.remove('active'));
      btn.classList.add('active');
      const panelId = 'panel-' + btn.dataset.tab;
      document.getElementById(panelId)?.classList.add('active');
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

async function sendMessage(msg) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(msg, (response) => {
      resolve(response || { error: 'No response from background' });
    });
  });
}

function setLoading(btn, loading) {
  if (loading) {
    btn.disabled = true;
    btn._originalText = btn.innerHTML;
    btn.innerHTML = '<span class="spinner"></span> Working...';
  } else {
    btn.disabled = false;
    btn.innerHTML = btn._originalText || btn.innerHTML;
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).catch(() => {});
}

function makeCopyBtn(text) {
  const btn = document.createElement('button');
  btn.className = 'copy-btn';
  btn.textContent = '📋 Copy';
  btn.addEventListener('click', () => {
    copyToClipboard(text);
    btn.textContent = '✅ Copied';
    setTimeout(() => { btn.textContent = '📋 Copy'; }, 1500);
  });
  return btn;
}

function renderDetailRows(obj, container) {
  for (const [key, val] of Object.entries(obj)) {
    if (val === null || val === undefined) continue;
    const row = document.createElement('div');
    row.className = 'detail-row';
    if (typeof val === 'object' && !Array.isArray(val)) {
      row.innerHTML = `<span class="detail-key">${escapeHtml(key)}</span><span class="detail-val">${escapeHtml(JSON.stringify(val))}</span>`;
    } else {
      row.innerHTML = `<span class="detail-key">${escapeHtml(key)}</span><span class="detail-val">${escapeHtml(String(val))}</span>`;
    }
    container.appendChild(row);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ANALYZE PAGE
// ═══════════════════════════════════════════════════════════════════════════

function initAnalyze() {
  const btn = document.getElementById('btn-analyze');
  const results = document.getElementById('analyze-results');

  btn.addEventListener('click', async () => {
    setLoading(btn, true);
    const data = await sendMessage({ type: 'ANALYZE_PAGE' });
    setLoading(btn, false);

    if (data.error) {
      results.innerHTML = `<div class="results"><div class="results-body" style="color:var(--error)">⚠️ ${escapeHtml(data.error)}</div></div>`;
      return;
    }

    let html = `
      <div class="results">
        <div class="results-header">📊 Page Statistics</div>
        <div class="results-body">
          <div class="stat-grid">
            <div class="stat-card"><div class="stat-value">${data.wordCount}</div><div class="stat-label">Words</div></div>
            <div class="stat-card"><div class="stat-value">${escapeHtml(data.readingTime)}</div><div class="stat-label">Reading Time</div></div>
            <div class="stat-card"><div class="stat-value">${data.links?.total || 0}</div><div class="stat-label">Links</div></div>
            <div class="stat-card"><div class="stat-value">${data.images?.total || 0}</div><div class="stat-label">Images</div></div>
            <div class="stat-card"><div class="stat-value">${data.scripts}</div><div class="stat-label">Scripts</div></div>
            <div class="stat-card"><div class="stat-value">${data.styles}</div><div class="stat-label">Stylesheets</div></div>
          </div>
        </div>
      </div>

      <div class="results" style="margin-top:8px">
        <div class="results-header">🔗 Page Details</div>
        <div class="results-body">`;

    const details = {
      'Title': data.title,
      'URL': data.url,
      'Language': data.language,
      'Charset': data.charset,
      'Characters': data.charCount,
      'External Links': data.links?.external,
      'Internal Links': data.links?.internal,
      'Images with Alt': data.images?.withAlt,
      'Images without Alt': data.images?.withoutAlt,
    };
    for (const [k, v] of Object.entries(details)) {
      html += `<div class="detail-row"><span class="detail-key">${k}</span><span class="detail-val">${escapeHtml(String(v))}</span></div>`;
    }
    html += '</div></div>';

    if (data.headings && Object.keys(data.headings).length > 0) {
      html += `<div class="results" style="margin-top:8px"><div class="results-header">📑 Headings</div><div class="results-body">`;
      for (const [tag, count] of Object.entries(data.headings)) {
        html += `<div class="detail-row"><span class="detail-key">${tag.toUpperCase()}</span><span class="detail-val">${count}</span></div>`;
      }
      html += '</div></div>';
    }

    if (data.forms && data.forms.length > 0) {
      html += `<div class="results" style="margin-top:8px"><div class="results-header">📝 Forms (${data.forms.length})</div><div class="results-body">`;
      data.forms.forEach((f, i) => {
        html += `<div class="issue-item"><div class="issue-category">Form ${i + 1}</div>`;
        html += `<div class="issue-message">Method: ${escapeHtml(f.method)} | Inputs: ${f.inputs}</div>`;
        html += `<div class="issue-element">${escapeHtml(f.action)}</div></div>`;
      });
      html += '</div></div>';
    }

    results.innerHTML = html;
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// CODE EXTRACTOR
// ═══════════════════════════════════════════════════════════════════════════

function initCode() {
  const btn = document.getElementById('btn-extract-code');
  const results = document.getElementById('code-results');

  btn.addEventListener('click', async () => {
    setLoading(btn, true);
    const data = await sendMessage({ type: 'EXTRACT_CODE' });
    setLoading(btn, false);

    if (data.error) {
      results.innerHTML = `<div class="results"><div class="results-body" style="color:var(--error)">⚠️ ${escapeHtml(data.error)}</div></div>`;
      return;
    }

    if (data.count === 0) {
      results.innerHTML = '<div class="empty-state"><div class="empty-icon">💻</div><div class="empty-text">No code blocks found on this page</div></div>';
      return;
    }

    let html = `<div class="results"><div class="results-header">Found ${data.count} code block(s)</div><div class="results-body">`;
    data.blocks.forEach((block, i) => {
      html += `<div style="margin-bottom: 12px;">`;
      html += `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">`;
      html += `<span class="badge badge-info">${escapeHtml(block.language)}</span>`;
      html += `<span style="font-size: 10px; color: var(--text-muted)">&lt;${block.tag}&gt; · ${block.length} chars</span>`;
      html += `</div>`;
      html += `<div class="code-block" id="code-block-${i}">${escapeHtml(block.text)}</div>`;
      html += `</div>`;
    });
    html += '</div></div>';

    results.innerHTML = html;

    // Add copy buttons after DOM is updated
    data.blocks.forEach((block, i) => {
      const codeEl = document.getElementById(`code-block-${i}`);
      if (codeEl) {
        const copyBtn = makeCopyBtn(block.text);
        codeEl.parentElement.querySelector('div')?.appendChild(copyBtn);
      }
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// COLORS, FONTS, CSS INSPECT
// ═══════════════════════════════════════════════════════════════════════════

function initColors() {
  const btnColors = document.getElementById('btn-extract-colors');
  const btnFonts = document.getElementById('btn-extract-fonts');
  const btnCssInspect = document.getElementById('btn-css-inspect');
  const btnCssGo = document.getElementById('btn-css-go');
  const selectorRow = document.getElementById('css-selector-row');
  const selectorInput = document.getElementById('css-selector');
  const results = document.getElementById('colors-results');

  btnColors.addEventListener('click', async () => {
    setLoading(btnColors, true);
    const data = await sendMessage({ type: 'EXTRACT_COLORS' });
    setLoading(btnColors, false);

    if (data.error) {
      results.innerHTML = `<div class="results"><div class="results-body" style="color:var(--error)">⚠️ ${escapeHtml(data.error)}</div></div>`;
      return;
    }

    let html = `<div class="results"><div class="results-header">🎨 ${data.count} Color(s) Found</div><div class="results-body" style="display: flex; flex-wrap: wrap;">`;
    data.colors.forEach((c) => {
      html += `<div class="color-swatch" data-color="${escapeHtml(c.hex)}" title="Click to copy ${c.hex}">`;
      html += `<div class="swatch" style="background:${escapeHtml(c.rgb)}"></div>`;
      html += `<span>${escapeHtml(c.hex)}</span>`;
      html += `</div>`;
    });
    html += '</div></div>';
    results.innerHTML = html;

    results.querySelectorAll('.color-swatch').forEach((el) => {
      el.addEventListener('click', () => {
        copyToClipboard(el.dataset.color);
        const span = el.querySelector('span');
        const orig = span.textContent;
        span.textContent = '✅ Copied';
        setTimeout(() => { span.textContent = orig; }, 1200);
      });
    });
  });

  btnFonts.addEventListener('click', async () => {
    setLoading(btnFonts, true);
    const data = await sendMessage({ type: 'EXTRACT_FONTS' });
    setLoading(btnFonts, false);

    if (data.error) {
      results.innerHTML = `<div class="results"><div class="results-body" style="color:var(--error)">⚠️ ${escapeHtml(data.error)}</div></div>`;
      return;
    }

    let html = `<div class="results"><div class="results-header">🔤 ${data.count} Font(s) Found</div><div class="results-body">`;
    data.fonts.forEach((f) => {
      html += `<div class="font-item">`;
      html += `<div class="font-name" style="font-family: '${escapeHtml(f.family)}', sans-serif;">${escapeHtml(f.family)}</div>`;
      html += `<div class="font-detail">Sizes: ${f.sizes.join(', ')} · Weights: ${f.weights.join(', ')} · Used ${f.usageCount}×</div>`;
      html += `</div>`;
    });
    html += '</div></div>';
    results.innerHTML = html;
  });

  btnCssInspect.addEventListener('click', () => {
    const isVisible = selectorRow.style.display !== 'none';
    selectorRow.style.display = isVisible ? 'none' : 'flex';
    if (!isVisible) selectorInput.focus();
  });

  const runCssInspect = async () => {
    const selector = selectorInput.value.trim();
    setLoading(btnCssGo, true);
    const data = await sendMessage({ type: 'CSS_INSPECT', selector });
    setLoading(btnCssGo, false);

    if (data.error) {
      results.innerHTML = `<div class="results"><div class="results-body" style="color:var(--error)">⚠️ ${escapeHtml(data.error)}</div></div>`;
      return;
    }

    let html = `<div class="results"><div class="results-header">🔍 CSS: ${escapeHtml(data.tagName)}${data.id ? '#' + escapeHtml(data.id) : ''}${data.classes.length ? '.' + data.classes.map(escapeHtml).join('.') : ''}</div><div class="results-body">`;
    html += `<div class="detail-row"><span class="detail-key">Dimensions</span><span class="detail-val">${data.dimensions.width}×${data.dimensions.height}px</span></div>`;
    html += `<div class="detail-row"><span class="detail-key">Position</span><span class="detail-val">top: ${data.dimensions.top}, left: ${data.dimensions.left}</span></div>`;

    for (const [prop, val] of Object.entries(data.computed || {})) {
      html += `<div class="detail-row"><span class="detail-key">${escapeHtml(prop)}</span><span class="detail-val">${escapeHtml(val)}</span></div>`;
    }
    html += '</div></div>';
    results.innerHTML = html;
  };

  btnCssGo.addEventListener('click', runCssInspect);
  selectorInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') runCssInspect(); });
}

// ═══════════════════════════════════════════════════════════════════════════
// PERFORMANCE
// ═══════════════════════════════════════════════════════════════════════════

function initPerf() {
  const btn = document.getElementById('btn-perf');
  const results = document.getElementById('perf-results');

  btn.addEventListener('click', async () => {
    setLoading(btn, true);
    const data = await sendMessage({ type: 'PERF_CHECK' });
    setLoading(btn, false);

    if (data.error) {
      results.innerHTML = `<div class="results"><div class="results-body" style="color:var(--error)">⚠️ ${escapeHtml(data.error)}</div></div>`;
      return;
    }

    const perfClass = (ms) => {
      const num = parseInt(ms);
      if (num < 1000) return 'perf-good';
      if (num < 3000) return 'perf-ok';
      return 'perf-bad';
    };

    const perfWidth = (ms) => {
      const num = parseInt(ms);
      return Math.min(100, (num / 5000) * 100);
    };

    let html = `<div class="results"><div class="results-header">⏱️ Timing</div><div class="results-body">`;
    for (const [key, val] of Object.entries(data.timing || {})) {
      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
      html += `<div style="margin-bottom: 8px;">`;
      html += `<div class="detail-row"><span class="detail-key">${escapeHtml(label)}</span><span class="detail-val">${escapeHtml(val)}</span></div>`;
      html += `<div class="perf-bar"><div class="perf-bar-fill ${perfClass(val)}" style="width: ${perfWidth(val)}%"></div></div>`;
      html += `</div>`;
    }
    html += '</div></div>';

    if (data.paint && Object.keys(data.paint).length > 0) {
      html += `<div class="results" style="margin-top:8px"><div class="results-header">🎨 Paint Timing</div><div class="results-body">`;
      for (const [k, v] of Object.entries(data.paint)) {
        html += `<div class="detail-row"><span class="detail-key">${escapeHtml(k)}</span><span class="detail-val">${v} ms</span></div>`;
      }
      html += '</div></div>';
    }

    html += `<div class="results" style="margin-top:8px"><div class="results-header">📦 Resources (${data.resources?.totalCount || 0})</div><div class="results-body">`;
    for (const [type, info] of Object.entries(data.resources?.byType || {})) {
      html += `<div class="detail-row"><span class="detail-key">${escapeHtml(type)}</span><span class="detail-val">${info.count} files · ${info.totalSize} · ${info.totalDuration}</span></div>`;
    }
    html += `<div class="detail-row"><span class="detail-key">DOM Nodes</span><span class="detail-val">${data.domNodes}</span></div>`;
    if (data.memory) {
      html += `<div class="detail-row"><span class="detail-key">JS Heap Used</span><span class="detail-val">${data.memory.usedJSHeapSize}</span></div>`;
      html += `<div class="detail-row"><span class="detail-key">JS Heap Total</span><span class="detail-val">${data.memory.totalJSHeapSize}</span></div>`;
    }
    html += '</div></div>';

    results.innerHTML = html;
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// ACCESSIBILITY
// ═══════════════════════════════════════════════════════════════════════════

function initA11y() {
  const btn = document.getElementById('btn-a11y');
  const results = document.getElementById('a11y-results');

  btn.addEventListener('click', async () => {
    setLoading(btn, true);
    const data = await sendMessage({ type: 'A11Y_SCAN' });
    setLoading(btn, false);

    if (data.error) {
      results.innerHTML = `<div class="results"><div class="results-body" style="color:var(--error)">⚠️ ${escapeHtml(data.error)}</div></div>`;
      return;
    }

    const { summary, issues, ariaRoles } = data;
    const total = summary.errors + summary.warnings;

    let html = `<div class="results"><div class="results-header">♿ Accessibility Report</div><div class="results-body">`;
    html += `<div class="stat-grid">`;
    html += `<div class="stat-card"><div class="stat-value" style="color: ${summary.errors > 0 ? 'var(--error)' : 'var(--success)'}">${summary.errors}</div><div class="stat-label">Errors</div></div>`;
    html += `<div class="stat-card"><div class="stat-value" style="color: ${summary.warnings > 0 ? 'var(--warning)' : 'var(--success)'}">${summary.warnings}</div><div class="stat-label">Warnings</div></div>`;
    html += `</div>`;

    if (total === 0) {
      html += `<div style="text-align:center; padding: 16px; color: var(--success); font-weight: 600;">✅ No issues found!</div>`;
    }
    html += '</div></div>';

    if (issues.length > 0) {
      html += `<div class="results" style="margin-top:8px"><div class="results-header">Issues (${issues.length})</div><div class="results-body">`;
      issues.forEach((issue) => {
        html += `<div class="issue-item ${issue.type}">`;
        html += `<div style="display:flex; gap:6px; align-items:center;">`;
        html += `<span class="badge badge-${issue.type}">${issue.type}</span>`;
        html += `<span class="issue-category">${escapeHtml(issue.category)}</span>`;
        html += `</div>`;
        html += `<div class="issue-message">${escapeHtml(issue.message)}</div>`;
        if (issue.element) {
          html += `<div class="issue-element">${escapeHtml(issue.element)}</div>`;
        }
        html += `</div>`;
      });
      html += '</div></div>';
    }

    if (ariaRoles && Object.keys(ariaRoles).length > 0) {
      html += `<div class="results" style="margin-top:8px"><div class="results-header">🏷️ ARIA Roles</div><div class="results-body">`;
      for (const [role, count] of Object.entries(ariaRoles)) {
        html += `<div class="detail-row"><span class="detail-key">${escapeHtml(role)}</span><span class="detail-val">${count}</span></div>`;
      }
      html += '</div></div>';
    }

    html += `<div class="results" style="margin-top:8px"><div class="results-body"><div class="detail-row"><span class="detail-key">Total Elements</span><span class="detail-val">${data.totalElements}</span></div></div></div>`;

    results.innerHTML = html;
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILS: JSON, Regex, Text Transform, Meta
// ═══════════════════════════════════════════════════════════════════════════

function initUtils() {
  initJsonFormatter();
  initRegexTester();
  initTextTransformer();
  initMetaExtractor();
}

function initJsonFormatter() {
  const btn = document.getElementById('btn-format-json');
  const input = document.getElementById('json-input');
  const results = document.getElementById('json-results');

  btn.addEventListener('click', async () => {
    const raw = input.value.trim();
    if (!raw) {
      results.innerHTML = `<div class="results"><div class="results-body" style="color:var(--text-muted)">Paste some JSON above first</div></div>`;
      return;
    }

    const data = await sendMessage({ type: 'FORMAT_JSON', input: raw });

    if (data.valid) {
      let html = `<div class="results"><div class="results-header"><span>✅ Valid JSON (${data.type}, ${data.keys} key${data.keys !== 1 ? 's' : ''})</span></div>`;
      html += `<div class="results-body"><div class="code-block" id="json-output">${escapeHtml(data.formatted)}</div></div></div>`;
      results.innerHTML = html;

      const codeBlock = document.getElementById('json-output');
      if (codeBlock) {
        const copyBtn = makeCopyBtn(data.formatted);
        codeBlock.parentElement.insertBefore(copyBtn, codeBlock);
      }
    } else {
      results.innerHTML = `<div class="results"><div class="results-header" style="color:var(--error)">❌ Invalid JSON</div><div class="results-body" style="color:var(--error)">${escapeHtml(data.error)}${data.position !== null ? ` (at position ${data.position})` : ''}</div></div>`;
    }
  });
}

function initRegexTester() {
  const btn = document.getElementById('btn-test-regex');
  const patternInput = document.getElementById('regex-pattern');
  const flagsInput = document.getElementById('regex-flags');
  const testInput = document.getElementById('regex-input');
  const results = document.getElementById('regex-results');

  btn.addEventListener('click', async () => {
    const pattern = patternInput.value;
    const flags = flagsInput.value.trim();
    const input = testInput.value;

    if (!pattern) {
      results.innerHTML = `<div class="results"><div class="results-body" style="color:var(--text-muted)">Enter a regex pattern first</div></div>`;
      return;
    }

    const data = await sendMessage({ type: 'REGEX_TEST', pattern, flags, input });

    if (!data.valid) {
      results.innerHTML = `<div class="results"><div class="results-header" style="color:var(--error)">❌ Invalid Regex</div><div class="results-body" style="color:var(--error)">${escapeHtml(data.error)}</div></div>`;
      return;
    }

    let html = `<div class="results"><div class="results-header">${data.matchCount > 0 ? '✅' : '❌'} ${data.matchCount} Match${data.matchCount !== 1 ? 'es' : ''}</div><div class="results-body">`;

    if (data.matchCount === 0) {
      html += `<div style="color:var(--text-muted)">No matches found</div>`;
    } else {
      data.matches.forEach((m, i) => {
        html += `<div class="issue-item">`;
        html += `<div class="issue-category">Match ${i + 1} (index ${m.index})</div>`;
        html += `<div class="issue-message" style="font-family: monospace; font-size: 12px;">${escapeHtml(m.match)}</div>`;
        if (m.groups.length > 0) {
          html += `<div class="issue-element">Groups: ${m.groups.map((g, j) => `$${j + 1}="${escapeHtml(g || '')}"`).join(', ')}</div>`;
        }
        html += `</div>`;
      });
    }
    html += '</div></div>';
    results.innerHTML = html;
  });
}

function initTextTransformer() {
  const input = document.getElementById('transform-input');
  const results = document.getElementById('transform-results');
  const buttons = document.querySelectorAll('.transform-btn');

  const transforms = {
    upper: (t) => ({ label: 'UPPERCASE', result: t.toUpperCase() }),
    lower: (t) => ({ label: 'lowercase', result: t.toLowerCase() }),
    title: (t) => ({
      label: 'Title Case',
      result: t.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase()),
    }),
    reverse: (t) => ({ label: 'Reversed', result: [...t].reverse().join('') }),
    slug: (t) => ({
      label: 'slug-case',
      result: t.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, ''),
    }),
    camel: (t) => ({
      label: 'camelCase',
      result: t.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()),
    }),
    snake: (t) => ({
      label: 'snake_case',
      result: t.toLowerCase().trim().replace(/[^\w\s]/g, '').replace(/\s+/g, '_'),
    }),
    chars: (t) => ({ label: 'Character Count', result: String(t.length), isCount: true }),
    words: (t) => ({ label: 'Word Count', result: String(t.split(/\s+/).filter((w) => w.length > 0).length), isCount: true }),
    lines: (t) => ({ label: 'Line Count', result: String(t.split('\n').length), isCount: true }),
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const text = input.value;
      if (!text) {
        results.innerHTML = `<div class="results"><div class="results-body" style="color:var(--text-muted)">Enter some text above first</div></div>`;
        return;
      }

      const key = btn.dataset.transform;
      const fn = transforms[key];
      if (!fn) return;

      const { label, result, isCount } = fn(text);

      if (isCount) {
        results.innerHTML = `<div class="results"><div class="results-header">${escapeHtml(label)}</div><div class="results-body"><div class="stat-card" style="margin:0"><div class="stat-value">${escapeHtml(result)}</div><div class="stat-label">${escapeHtml(label)}</div></div></div></div>`;
      } else {
        let html = `<div class="results"><div class="results-header"><span>${escapeHtml(label)}</span></div><div class="results-body">`;
        html += `<div class="code-block" id="transform-output">${escapeHtml(result)}</div>`;
        html += `</div></div>`;
        results.innerHTML = html;

        const outputEl = document.getElementById('transform-output');
        if (outputEl) {
          const copyBtn = makeCopyBtn(result);
          outputEl.parentElement.insertBefore(copyBtn, outputEl);
        }
      }
    });
  });
}

function initMetaExtractor() {
  const btn = document.getElementById('btn-extract-meta');
  const results = document.getElementById('meta-results');

  btn.addEventListener('click', async () => {
    setLoading(btn, true);
    const data = await sendMessage({ type: 'EXTRACT_META' });
    setLoading(btn, false);

    if (data.error) {
      results.innerHTML = `<div class="results"><div class="results-body" style="color:var(--error)">⚠️ ${escapeHtml(data.error)}</div></div>`;
      return;
    }

    let html = '';

    if (data.title) {
      html += `<div class="results" style="margin-top:8px"><div class="results-header">📄 Title</div><div class="results-body"><div class="detail-row"><span class="detail-val" style="max-width:100%">${escapeHtml(data.title)}</span></div></div></div>`;
    }

    if (data.canonical) {
      html += `<div class="results" style="margin-top:8px"><div class="results-header">🔗 Canonical</div><div class="results-body"><div class="detail-row"><span class="detail-val" style="max-width:100%">${escapeHtml(data.canonical)}</span></div></div></div>`;
    }

    const sections = [
      { key: 'standard', title: '📋 Standard Meta', nameKey: 'name' },
      { key: 'openGraph', title: '📘 Open Graph', nameKey: 'property' },
      { key: 'twitterCards', title: '🐦 Twitter Cards', nameKey: 'name' },
      { key: 'other', title: '📎 Other Meta', nameKey: 'property' },
    ];

    sections.forEach((sec) => {
      const items = data[sec.key];
      if (items && items.length > 0) {
        html += `<div class="results" style="margin-top:8px"><div class="results-header">${sec.title} (${items.length})</div><div class="results-body">`;
        items.forEach((m) => {
          const name = m[sec.nameKey] || m.name || m.property || '';
          html += `<div class="detail-row"><span class="detail-key">${escapeHtml(name)}</span><span class="detail-val">${escapeHtml(m.content || '')}</span></div>`;
        });
        html += '</div></div>';
      }
    });

    if (data.structuredData && data.structuredData.length > 0) {
      html += `<div class="results" style="margin-top:8px"><div class="results-header">🗂️ Structured Data (JSON-LD)</div><div class="results-body">`;
      data.structuredData.forEach((sd) => {
        html += `<div class="code-block">${escapeHtml(JSON.stringify(sd, null, 2))}</div>`;
      });
      html += '</div></div>';
    }

    if (data.alternates && data.alternates.length > 0) {
      html += `<div class="results" style="margin-top:8px"><div class="results-header">🌐 Alternate Links (${data.alternates.length})</div><div class="results-body">`;
      data.alternates.forEach((a) => {
        html += `<div class="detail-row"><span class="detail-key">${escapeHtml(a.hreflang || a.type || 'alternate')}</span><span class="detail-val">${escapeHtml(a.href)}</span></div>`;
      });
      html += '</div></div>';
    }

    if (!html) {
      html = '<div class="empty-state"><div class="empty-icon">🏷️</div><div class="empty-text">No meta tags found</div></div>';
    }

    results.innerHTML = html;
  });
}
