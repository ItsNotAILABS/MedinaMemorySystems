// MERIDIAN AI Toolkit — Background Service Worker
// Sovereign Developer Tools by Alfredo Medina Hernandez

chrome.action.onClicked.addListener(async (tab) => {
  try {
    await chrome.sidePanel.open({ tabId: tab.id });
  } catch (err) {
    console.error('[MERIDIAN] Failed to open side panel:', err);
  }
});

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || !message.type) return false;
  handleMessage(message, sender).then(sendResponse).catch((err) => {
    console.error('[MERIDIAN] Message handler error:', err);
    sendResponse({ error: err.message });
  });
  return true;
});

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function executeInTab(tabId, func, args) {
  const results = await chrome.scripting.executeScript({
    target: { tabId },
    func,
    args: args || [],
  });
  return results[0]?.result;
}

async function handleMessage(message) {
  switch (message.type) {
    case 'ANALYZE_PAGE':
      return analyzePage();
    case 'EXTRACT_CODE':
      return extractCode();
    case 'EXTRACT_COLORS':
      return extractColors();
    case 'EXTRACT_FONTS':
      return extractFonts();
    case 'CSS_INSPECT':
      return cssInspect(message.selector);
    case 'PERF_CHECK':
      return perfCheck();
    case 'A11Y_SCAN':
      return a11yScan();
    case 'EXTRACT_META':
      return extractMeta();
    case 'FORMAT_JSON':
      return formatJSON(message.input);
    case 'REGEX_TEST':
      return regexTest(message.pattern, message.flags, message.input);
    default:
      return { error: `Unknown message type: ${message.type}` };
  }
}

// ─── ANALYZE PAGE ────────────────────────────────────────────────────────────

async function analyzePage() {
  const tab = await getActiveTab();
  if (!tab) return { error: 'No active tab found' };

  const result = await executeInTab(tab.id, () => {
    const text = document.body?.innerText || '';
    const words = text.split(/\s+/).filter((w) => w.length > 0);
    const headings = {};
    for (let i = 1; i <= 6; i++) {
      const els = document.querySelectorAll(`h${i}`);
      if (els.length > 0) headings[`h${i}`] = els.length;
    }

    const metaTags = [];
    document.querySelectorAll('meta').forEach((m) => {
      const name = m.getAttribute('name') || m.getAttribute('property') || m.getAttribute('http-equiv');
      const content = m.getAttribute('content');
      if (name && content) metaTags.push({ name, content });
    });

    const forms = document.querySelectorAll('form');
    const formData = [];
    forms.forEach((f) => {
      const inputs = f.querySelectorAll('input, select, textarea');
      formData.push({
        action: f.action || '(none)',
        method: (f.method || 'GET').toUpperCase(),
        inputs: inputs.length,
      });
    });

    return {
      url: location.href,
      title: document.title,
      language: document.documentElement.lang || '(not set)',
      charset: document.characterSet,
      wordCount: words.length,
      charCount: text.length,
      readingTime: Math.max(1, Math.ceil(words.length / 238)) + ' min',
      links: {
        total: document.querySelectorAll('a[href]').length,
        external: document.querySelectorAll('a[href^="http"]').length,
        internal: document.querySelectorAll('a:not([href^="http"])').length,
      },
      images: {
        total: document.querySelectorAll('img').length,
        withAlt: document.querySelectorAll('img[alt]:not([alt=""])').length,
        withoutAlt: document.querySelectorAll('img:not([alt]), img[alt=""]').length,
      },
      scripts: document.querySelectorAll('script').length,
      styles: document.querySelectorAll('link[rel="stylesheet"]').length +
        document.querySelectorAll('style').length,
      headings,
      metaTags: metaTags.slice(0, 30),
      forms: formData,
    };
  });

  return result || { error: 'Could not analyze page' };
}

// ─── EXTRACT CODE ────────────────────────────────────────────────────────────

async function extractCode() {
  const tab = await getActiveTab();
  if (!tab) return { error: 'No active tab found' };

  const result = await executeInTab(tab.id, () => {
    const blocks = [];
    document.querySelectorAll('pre, code').forEach((el) => {
      const tag = el.tagName.toLowerCase();
      const text = el.textContent.trim();
      if (!text || text.length < 2) return;
      if (tag === 'code' && el.parentElement?.tagName.toLowerCase() === 'pre') return;

      let language = '';
      const classes = el.className.split(/\s+/);
      for (const cls of classes) {
        if (cls.startsWith('language-') || cls.startsWith('lang-')) {
          language = cls.replace(/^(language-|lang-)/, '');
          break;
        }
        if (cls.startsWith('hljs-')) continue;
        if (['javascript', 'python', 'java', 'html', 'css', 'typescript', 'json',
          'bash', 'shell', 'sql', 'ruby', 'go', 'rust', 'cpp', 'c', 'php',
          'swift', 'kotlin', 'scala', 'yaml', 'xml', 'markdown'].includes(cls)) {
          language = cls;
          break;
        }
      }

      blocks.push({
        tag,
        language: language || 'unknown',
        text: text.substring(0, 5000),
        length: text.length,
      });
    });

    return { count: blocks.length, blocks };
  });

  return result || { error: 'Could not extract code' };
}

// ─── EXTRACT COLORS ──────────────────────────────────────────────────────────

async function extractColors() {
  const tab = await getActiveTab();
  if (!tab) return { error: 'No active tab found' };

  const result = await executeInTab(tab.id, () => {
    const colorSet = new Set();
    const sampleElements = document.querySelectorAll('*');
    const limit = Math.min(sampleElements.length, 500);

    for (let i = 0; i < limit; i++) {
      const el = sampleElements[i];
      const style = window.getComputedStyle(el);
      const props = ['color', 'backgroundColor', 'borderColor', 'borderTopColor',
        'borderRightColor', 'borderBottomColor', 'borderLeftColor', 'outlineColor',
        'boxShadow', 'textDecorationColor'];

      for (const prop of props) {
        const val = style.getPropertyValue(prop);
        if (val && val !== 'rgba(0, 0, 0, 0)' && val !== 'transparent' && val !== 'none') {
          const rgbMatches = val.match(/rgba?\([^)]+\)/g);
          if (rgbMatches) rgbMatches.forEach((c) => colorSet.add(c));
        }
      }
    }

    const colors = [...colorSet].map((c) => {
      const nums = c.match(/[\d.]+/g)?.map(Number) || [];
      let hex = '#';
      for (let i = 0; i < 3 && i < nums.length; i++) {
        hex += Math.round(nums[i]).toString(16).padStart(2, '0');
      }
      return { rgb: c, hex: hex.toUpperCase() };
    });

    colors.sort((a, b) => a.hex.localeCompare(b.hex));
    return { count: colors.length, colors };
  });

  return result || { error: 'Could not extract colors' };
}

// ─── EXTRACT FONTS ───────────────────────────────────────────────────────────

async function extractFonts() {
  const tab = await getActiveTab();
  if (!tab) return { error: 'No active tab found' };

  const result = await executeInTab(tab.id, () => {
    const fontMap = {};
    const sampleElements = document.querySelectorAll('*');
    const limit = Math.min(sampleElements.length, 500);

    for (let i = 0; i < limit; i++) {
      const style = window.getComputedStyle(sampleElements[i]);
      const family = style.fontFamily;
      const size = style.fontSize;
      const weight = style.fontWeight;

      if (family) {
        const primary = family.split(',')[0].trim().replace(/['"]/g, '');
        if (!fontMap[primary]) {
          fontMap[primary] = { family: primary, sizes: new Set(), weights: new Set(), count: 0 };
        }
        fontMap[primary].sizes.add(size);
        fontMap[primary].weights.add(weight);
        fontMap[primary].count++;
      }
    }

    const fonts = Object.values(fontMap).map((f) => ({
      family: f.family,
      sizes: [...f.sizes].sort(),
      weights: [...f.weights].sort(),
      usageCount: f.count,
    }));

    fonts.sort((a, b) => b.usageCount - a.usageCount);
    return { count: fonts.length, fonts };
  });

  return result || { error: 'Could not extract fonts' };
}

// ─── CSS INSPECT ─────────────────────────────────────────────────────────────

async function cssInspect(selector) {
  const tab = await getActiveTab();
  if (!tab) return { error: 'No active tab found' };

  const result = await executeInTab(tab.id, (sel) => {
    const el = sel ? document.querySelector(sel) : document.body;
    if (!el) return { error: `Element not found: ${sel}` };

    const style = window.getComputedStyle(el);
    const importantProps = [
      'display', 'position', 'width', 'height', 'margin', 'padding',
      'color', 'backgroundColor', 'fontSize', 'fontFamily', 'fontWeight',
      'lineHeight', 'letterSpacing', 'textAlign', 'textDecoration',
      'border', 'borderRadius', 'boxShadow', 'overflow', 'opacity',
      'zIndex', 'flexDirection', 'justifyContent', 'alignItems',
      'gridTemplateColumns', 'gridTemplateRows', 'gap',
      'transform', 'transition', 'animation',
    ];

    const computed = {};
    for (const prop of importantProps) {
      const val = style.getPropertyValue(prop.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase()));
      if (val && val !== 'none' && val !== 'normal' && val !== 'auto' && val !== '0px') {
        computed[prop] = val;
      }
    }

    const rect = el.getBoundingClientRect();
    return {
      selector: sel || 'body',
      tagName: el.tagName.toLowerCase(),
      id: el.id || null,
      classes: [...el.classList],
      dimensions: {
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        top: Math.round(rect.top),
        left: Math.round(rect.left),
      },
      computed,
    };
  }, [selector || null]);

  return result || { error: 'Could not inspect CSS' };
}

// ─── PERF CHECK ──────────────────────────────────────────────────────────────

async function perfCheck() {
  const tab = await getActiveTab();
  if (!tab) return { error: 'No active tab found' };

  const result = await executeInTab(tab.id, () => {
    const perf = performance.getEntriesByType('navigation')[0] || {};
    const paint = performance.getEntriesByType('paint');
    const resources = performance.getEntriesByType('resource');

    const paintMap = {};
    paint.forEach((p) => { paintMap[p.name] = Math.round(p.startTime); });

    const resourcesByType = {};
    resources.forEach((r) => {
      const type = r.initiatorType || 'other';
      if (!resourcesByType[type]) resourcesByType[type] = { count: 0, totalSize: 0, totalDuration: 0 };
      resourcesByType[type].count++;
      resourcesByType[type].totalSize += r.transferSize || 0;
      resourcesByType[type].totalDuration += r.duration || 0;
    });

    for (const key of Object.keys(resourcesByType)) {
      resourcesByType[key].totalSize = Math.round(resourcesByType[key].totalSize / 1024) + ' KB';
      resourcesByType[key].totalDuration = Math.round(resourcesByType[key].totalDuration) + ' ms';
    }

    return {
      timing: {
        dnsLookup: Math.round((perf.domainLookupEnd || 0) - (perf.domainLookupStart || 0)) + ' ms',
        tcpConnect: Math.round((perf.connectEnd || 0) - (perf.connectStart || 0)) + ' ms',
        ttfb: Math.round(perf.responseStart || 0) + ' ms',
        domContentLoaded: Math.round(perf.domContentLoadedEventEnd || 0) + ' ms',
        domComplete: Math.round(perf.domComplete || 0) + ' ms',
        fullLoad: Math.round(perf.loadEventEnd || 0) + ' ms',
        domInteractive: Math.round(perf.domInteractive || 0) + ' ms',
      },
      paint: paintMap,
      resources: {
        totalCount: resources.length,
        byType: resourcesByType,
      },
      memory: performance.memory ? {
        usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / (1024 * 1024)) + ' MB',
        totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / (1024 * 1024)) + ' MB',
      } : null,
      domNodes: document.querySelectorAll('*').length,
    };
  });

  return result || { error: 'Could not check performance' };
}

// ─── A11Y SCAN ───────────────────────────────────────────────────────────────

async function a11yScan() {
  const tab = await getActiveTab();
  if (!tab) return { error: 'No active tab found' };

  const result = await executeInTab(tab.id, () => {
    const issues = [];

    // Missing alt text
    document.querySelectorAll('img:not([alt]), img[alt=""]').forEach((img) => {
      issues.push({
        type: 'error',
        category: 'Images',
        message: 'Image missing alt text',
        element: img.outerHTML.substring(0, 150),
        selector: img.src ? `img[src="${img.src.substring(0, 80)}"]` : 'img',
      });
    });

    // Empty buttons
    document.querySelectorAll('button').forEach((btn) => {
      if (!btn.textContent.trim() && !btn.getAttribute('aria-label') && !btn.querySelector('img, svg')) {
        issues.push({
          type: 'error',
          category: 'Buttons',
          message: 'Empty button without accessible name',
          element: btn.outerHTML.substring(0, 150),
        });
      }
    });

    // Empty links
    document.querySelectorAll('a[href]').forEach((a) => {
      if (!a.textContent.trim() && !a.getAttribute('aria-label') && !a.querySelector('img, svg')) {
        issues.push({
          type: 'error',
          category: 'Links',
          message: 'Empty link without accessible name',
          element: a.outerHTML.substring(0, 150),
        });
      }
    });

    // Missing form labels
    document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), select, textarea').forEach((input) => {
      const id = input.id;
      const hasLabel = id && document.querySelector(`label[for="${id}"]`);
      const hasAriaLabel = input.getAttribute('aria-label') || input.getAttribute('aria-labelledby');
      const hasTitle = input.getAttribute('title');
      const parentLabel = input.closest('label');

      if (!hasLabel && !hasAriaLabel && !hasTitle && !parentLabel) {
        issues.push({
          type: 'error',
          category: 'Forms',
          message: 'Form input missing associated label',
          element: input.outerHTML.substring(0, 150),
        });
      }
    });

    // Missing document language
    if (!document.documentElement.lang) {
      issues.push({
        type: 'warning',
        category: 'Document',
        message: 'Missing document language attribute (<html lang="...">)',
      });
    }

    // Missing page title
    if (!document.title.trim()) {
      issues.push({
        type: 'warning',
        category: 'Document',
        message: 'Page has no title',
      });
    }

    // Missing h1
    if (!document.querySelector('h1')) {
      issues.push({
        type: 'warning',
        category: 'Headings',
        message: 'Page missing main heading (h1)',
      });
    }

    // Skipped heading levels
    const headingLevels = [];
    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => {
      headingLevels.push(parseInt(h.tagName[1]));
    });
    for (let i = 1; i < headingLevels.length; i++) {
      if (headingLevels[i] - headingLevels[i - 1] > 1) {
        issues.push({
          type: 'warning',
          category: 'Headings',
          message: `Heading level skipped: h${headingLevels[i - 1]} → h${headingLevels[i]}`,
        });
      }
    }

    // Low contrast hints (check text against background)
    const sampleEls = document.querySelectorAll('p, span, a, li, td, th, label, h1, h2, h3, h4, h5, h6');
    let lowContrastCount = 0;
    const limit = Math.min(sampleEls.length, 200);
    for (let i = 0; i < limit; i++) {
      const el = sampleEls[i];
      const style = window.getComputedStyle(el);
      const color = style.color;
      const bg = style.backgroundColor;
      if (color && bg && bg !== 'rgba(0, 0, 0, 0)') {
        const parse = (c) => (c.match(/[\d.]+/g) || []).map(Number);
        const fg = parse(color);
        const bgc = parse(bg);
        if (fg.length >= 3 && bgc.length >= 3) {
          const lum = (r, g, b) => {
            const [rs, gs, bs] = [r, g, b].map((c) => {
              c = c / 255;
              return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
            });
            return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
          };
          const l1 = lum(fg[0], fg[1], fg[2]);
          const l2 = lum(bgc[0], bgc[1], bgc[2]);
          const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
          if (ratio < 3) {
            lowContrastCount++;
          }
        }
      }
    }
    if (lowContrastCount > 0) {
      issues.push({
        type: 'warning',
        category: 'Contrast',
        message: `${lowContrastCount} element(s) may have low contrast (ratio < 3:1)`,
      });
    }

    // ARIA roles check
    const ariaEls = document.querySelectorAll('[role]');
    const roles = {};
    ariaEls.forEach((el) => {
      const role = el.getAttribute('role');
      roles[role] = (roles[role] || 0) + 1;
    });

    // Tabindex misuse
    document.querySelectorAll('[tabindex]').forEach((el) => {
      const val = parseInt(el.getAttribute('tabindex'));
      if (val > 0) {
        issues.push({
          type: 'warning',
          category: 'Focus',
          message: `Positive tabindex (${val}) can disrupt navigation order`,
          element: el.outerHTML.substring(0, 100),
        });
      }
    });

    const summary = {
      errors: issues.filter((i) => i.type === 'error').length,
      warnings: issues.filter((i) => i.type === 'warning').length,
    };

    return {
      summary,
      issues,
      ariaRoles: roles,
      totalElements: document.querySelectorAll('*').length,
    };
  });

  return result || { error: 'Could not scan accessibility' };
}

// ─── EXTRACT META ────────────────────────────────────────────────────────────

async function extractMeta() {
  const tab = await getActiveTab();
  if (!tab) return { error: 'No active tab found' };

  const result = await executeInTab(tab.id, () => {
    const standard = [];
    const openGraph = [];
    const twitterCards = [];
    const other = [];

    document.querySelectorAll('meta').forEach((m) => {
      const name = m.getAttribute('name');
      const property = m.getAttribute('property');
      const httpEquiv = m.getAttribute('http-equiv');
      const content = m.getAttribute('content');
      const charset = m.getAttribute('charset');

      if (charset) {
        standard.push({ name: 'charset', content: charset });
        return;
      }
      if (!content) return;

      if (property && property.startsWith('og:')) {
        openGraph.push({ property, content });
      } else if (name && name.startsWith('twitter:')) {
        twitterCards.push({ name, content });
      } else if (property && property.startsWith('twitter:')) {
        twitterCards.push({ name: property, content });
      } else if (name) {
        standard.push({ name, content });
      } else if (httpEquiv) {
        standard.push({ name: `http-equiv:${httpEquiv}`, content });
      } else if (property) {
        other.push({ property, content });
      }
    });

    // Structured data
    const structuredData = [];
    document.querySelectorAll('script[type="application/ld+json"]').forEach((s) => {
      try {
        const data = JSON.parse(s.textContent);
        structuredData.push(data);
      } catch {
        structuredData.push({ error: 'Invalid JSON-LD', raw: s.textContent.substring(0, 200) });
      }
    });

    // Canonical & alternate links
    const canonical = document.querySelector('link[rel="canonical"]')?.href || null;
    const alternates = [];
    document.querySelectorAll('link[rel="alternate"]').forEach((l) => {
      alternates.push({
        hreflang: l.hreflang || null,
        type: l.type || null,
        href: l.href,
      });
    });

    return {
      title: document.title,
      standard,
      openGraph,
      twitterCards,
      other,
      structuredData,
      canonical,
      alternates,
    };
  });

  return result || { error: 'Could not extract meta' };
}

// ─── FORMAT JSON ─────────────────────────────────────────────────────────────

async function formatJSON(input) {
  if (!input || typeof input !== 'string') {
    return { error: 'No JSON input provided' };
  }
  try {
    const parsed = JSON.parse(input);
    return {
      formatted: JSON.stringify(parsed, null, 2),
      valid: true,
      type: Array.isArray(parsed) ? 'array' : typeof parsed,
      keys: typeof parsed === 'object' && parsed !== null ? Object.keys(parsed).length : 0,
    };
  } catch (err) {
    const match = err.message.match(/position (\d+)/);
    return {
      error: err.message,
      valid: false,
      position: match ? parseInt(match[1]) : null,
    };
  }
}

// ─── REGEX TEST ──────────────────────────────────────────────────────────────

async function regexTest(pattern, flags, input) {
  if (!pattern) return { error: 'No regex pattern provided' };
  if (!input) return { error: 'No test input provided' };

  try {
    const regex = new RegExp(pattern, flags || 'g');
    const matches = [];
    let match;

    if (flags && flags.includes('g')) {
      while ((match = regex.exec(input)) !== null) {
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.slice(1),
        });
        if (matches.length >= 100) break;
      }
    } else {
      match = regex.exec(input);
      if (match) {
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.slice(1),
        });
      }
    }

    return {
      valid: true,
      pattern,
      flags: flags || '',
      matchCount: matches.length,
      matches,
    };
  } catch (err) {
    return { error: err.message, valid: false };
  }
}
