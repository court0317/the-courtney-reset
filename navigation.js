
(() => {
  'use strict';

  const VALID_PAGES = new Set(['today', 'workout', 'meals', 'shop', 'progress', 'garden', 'settings', 'aquarium', 'week']);

  function showPage(pageId, updateHash = true) {
    if (!VALID_PAGES.has(pageId) || !document.getElementById(pageId)) {
      pageId = 'today';
    }

    document.querySelectorAll('.page').forEach(page => {
      const active = page.id === pageId;
      page.classList.toggle('active', active);
      page.hidden = !active;
      page.setAttribute('aria-hidden', String(!active));
    });

    document.querySelectorAll('nav .nav[data-go]').forEach(button => {
      const active = button.dataset.go === pageId;
      button.classList.toggle('active', active);
      button.setAttribute('aria-current', active ? 'page' : 'false');
    });

    document.body.dataset.activePage = pageId;

    if (updateHash) {
      try {
        history.replaceState(null, '', `#${pageId}`);
      } catch (_) {}
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.dispatchEvent(new CustomEvent('rooted:pagechange', { detail: { pageId } }));
  }

  function requestedPage() {
    const hash = location.hash.replace('#', '');
    return VALID_PAGES.has(hash) ? hash : 'today';
  }

  // Capture phase makes navigation reliable even if another click handler throws.
  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-go], [data-focus-go]');
    if (!trigger) return;

    const pageId = trigger.dataset.go || trigger.dataset.focusGo;
    if (!VALID_PAGES.has(pageId)) return;

    event.preventDefault();
    event.stopPropagation();
    showPage(pageId);
  }, true);

  window.addEventListener('hashchange', () => showPage(requestedPage(), false));

  window.RootedNavigation = { showPage };

  const start = () => showPage(requestedPage(), false);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
