'use strict';

(function () {
  const HIGHLIGHT_CLASS = 'nova-ovo-highlight';

  function extractPageContext() {
    const title = document.title || '';
    const url = window.location.href;
    const selectedText = window.getSelection()?.toString()?.trim() || '';

    const metaDesc =
      document.querySelector('meta[name="description"]')?.content ||
      document.querySelector('meta[property="og:description"]')?.content ||
      '';

    const metaKeywords =
      document.querySelector('meta[name="keywords"]')?.content || '';

    const h1 = document.querySelector('h1')?.textContent?.trim() || '';

    const canonicalUrl =
      document.querySelector('link[rel="canonical"]')?.href || url;

    return {
      title,
      url,
      canonicalUrl,
      selectedText,
      metaDescription: metaDesc,
      metaKeywords,
      h1,
      timestamp: Date.now(),
    };
  }

  function highlightText(text) {
    clearHighlights();
    if (!text || text.length < 3) return false;

    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null
    );
    const matches = [];
    let node;

    while ((node = walker.nextNode())) {
      if (node.nodeValue && node.nodeValue.includes(text)) {
        matches.push(node);
      }
    }

    for (const textNode of matches) {
      const parts = textNode.nodeValue.split(text);
      if (parts.length < 2) continue;

      const fragment = document.createDocumentFragment();
      parts.forEach((part, index) => {
        fragment.appendChild(document.createTextNode(part));
        if (index < parts.length - 1) {
          const mark = document.createElement('mark');
          mark.className = HIGHLIGHT_CLASS;
          mark.textContent = text;
          fragment.appendChild(mark);
        }
      });
      textNode.parentNode.replaceChild(fragment, textNode);
    }

    const firstHighlight = document.querySelector(`.${HIGHLIGHT_CLASS}`);
    if (firstHighlight) {
      firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return true;
    }
    return false;
  }

  function clearHighlights() {
    const marks = document.querySelectorAll(`.${HIGHLIGHT_CLASS}`);
    marks.forEach((mark) => {
      const parent = mark.parentNode;
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
      parent.normalize();
    });
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
      case 'EXTRACT_CONTEXT':
        sendResponse(extractPageContext());
        break;

      case 'HIGHLIGHT_TEXT':
        sendResponse({ success: highlightText(message.text) });
        break;

      case 'CLEAR_HIGHLIGHTS':
        clearHighlights();
        sendResponse({ success: true });
        break;

      default:
        sendResponse({ error: 'Unknown message type' });
    }
    return false;
  });
})();
