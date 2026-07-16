/* Academic portfolio — original JS, v2 (July 2026).
   Handles: theme (light/dark/automatic), scrollspy nav highlighting,
   mobile nav, search overlay, the citation modal, and the Selected-work
   horizontal scroller.

   Changes from v1 (all marked with "CHANGED" / "ADDED"):
   1. Every module is guarded, so interior pages (work/*.html) can load this
      same file without the elements the homepage has.
   2. localStorage access is wrapped in try/catch (private windows, file://,
      sandboxed previews).
   3. Cite modal: per-publication BibTeX via data-cite, focus returns to the
      button that opened it, clipboard call is guarded.
   4. NEW: prev/next controls + edge state for the Selected-work scroller. */

(function () {
  'use strict';

  /* CHANGED: safe storage helpers */
  function storeGet(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function storeSet(key, val) { try { localStorage.setItem(key, val); } catch (e) {} }

  /* ---------------- Theme: light / dark / automatic ---------------- */

  var THEME_KEY = 'site-theme';
  var themeToggle = document.getElementById('theme-toggle');
  var themeDropdown = document.getElementById('theme-dropdown');
  var mediaDark = window.matchMedia('(prefers-color-scheme: dark)');

  function storedTheme() {
    return storeGet(THEME_KEY) || 'auto';
  }

  function applyTheme(choice) {
    var dark = choice === 'dark' || (choice === 'auto' && mediaDark.matches);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    if (themeDropdown) {
      themeDropdown.querySelectorAll('button').forEach(function (btn) {
        btn.classList.toggle('selected', btn.dataset.themeChoice === choice);
      });
    }
  }

  applyTheme(storedTheme());
  mediaDark.addEventListener('change', function () { applyTheme(storedTheme()); });

  if (themeToggle && themeDropdown) {   /* CHANGED: guard */
    themeToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      themeDropdown.hidden = !themeDropdown.hidden;
    });

    themeDropdown.addEventListener('click', function (e) {
      var choice = e.target.dataset.themeChoice;
      if (!choice) return;
      storeSet(THEME_KEY, choice);
      applyTheme(choice);
      themeDropdown.hidden = true;
    });

    document.addEventListener('click', function () { themeDropdown.hidden = true; });
  }

  /* ---------------- Mobile nav ---------------- */

  var navToggle = document.getElementById('nav-toggle');
  var navbarNav = document.getElementById('navbar-nav');

  if (navToggle && navbarNav) {   /* CHANGED: guard */
    navToggle.addEventListener('click', function () {
      var open = navbarNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    navbarNav.addEventListener('click', function (e) {
      if (e.target.classList.contains('nav-link')) {
        navbarNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------------- Scrollspy: highlight active section ---------------- */

  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  var sections = navLinks
    .map(function (link) {
      var hash = link.getAttribute('href');
      return hash && hash.charAt(0) === '#' ? document.querySelector(hash) : null;
    })
    .filter(Boolean);

  function setActive(id) {
    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + id);
    });
  }

  if (sections.length) {   /* CHANGED: guard (interior pages have no anchor sections) */
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ---------------- Search overlay ---------------- */

  var searchOverlay = document.getElementById('search-overlay');
  var searchOpen = document.getElementById('search-open');
  var searchClose = document.getElementById('search-close');

  if (searchOverlay && searchOpen && searchClose) {   /* CHANGED: guard */
    searchOpen.addEventListener('click', function () {
      searchOverlay.hidden = false;
      searchOverlay.querySelector('.search-input').focus();
    });
    searchClose.addEventListener('click', function () { searchOverlay.hidden = true; });
  }

  /* ---------------- Cite modal ---------------- */

  var citeModal = document.getElementById('cite-modal');
  var citeClose = document.getElementById('cite-close');
  var citeCopy = document.getElementById('cite-copy');
  var citeText = document.getElementById('cite-text');
  var citeLastFocus = null;   /* ADDED: return focus to the opener on close */

  /* ADDED: per-publication BibTeX, keyed by the button's data-cite value.
     Add entries here as publications gain Cite buttons. */
  var CITES = {
    'elsevier-urban': [
      '@incollection{karmarkar_powering_2023,',
      '  author    = {Karmarkar, Radha and Rajput, Aman Singh and Nair, Vivin R.},',
      '  title     = {Powering data-driven decision-making for the development of urban economies in India},',
      '  booktitle = {Artificial Intelligence and Machine Learning in Smart City Planning},',
      '  editor    = {Basetti, Vedik and Shiva, Chandan Kumar and Ungarala, Mohan Rao and Rangarajan, Shriram S.},',
      '  publisher = {Elsevier},',
      '  year      = {2023},',
      '  pages     = {45--70},',
      '  isbn      = {9780323995030},',
      '  doi       = {10.1016/B978-0-323-99503-0.00005-3}',
      '}'
    ].join('\n')
  };

  if (citeModal && citeClose && citeCopy && citeText) {   /* CHANGED: guard */
    document.querySelectorAll('.js-cite').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.dataset.cite;                 /* ADDED */
        if (key && CITES[key]) citeText.textContent = CITES[key];
        citeLastFocus = btn;                        /* ADDED */
        citeModal.hidden = false;
        citeClose.focus();                          /* ADDED */
      });
    });

    function closeCite() {                          /* ADDED: shared close with focus return */
      citeModal.hidden = true;
      if (citeLastFocus) citeLastFocus.focus();
    }

    citeClose.addEventListener('click', closeCite);
    citeModal.addEventListener('click', function (e) {
      if (e.target === citeModal) closeCite();
    });
    citeCopy.addEventListener('click', function () {
      function done() {
        citeCopy.textContent = 'Copied!';
        setTimeout(function () { citeCopy.textContent = 'Copy'; }, 1500);
      }
      /* CHANGED: clipboard API may be unavailable on http/file — degrade gracefully */
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(citeText.textContent).then(done, done);
      } else {
        done();
      }
    });
  }

  /* ---------------- Escape closes overlays ---------------- */

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (searchOverlay) searchOverlay.hidden = true;   /* CHANGED: guards */
      if (citeModal && !citeModal.hidden) {
        citeModal.hidden = true;
        if (citeLastFocus) citeLastFocus.focus();
      }
      if (themeDropdown) themeDropdown.hidden = true;
    }
  });

  /* ---------------- ADDED: Selected-work scroller controls ---------------- */

  var scroller = document.getElementById('work-scroller');
  var workPrev = document.getElementById('work-prev');
  var workNext = document.getElementById('work-next');

  if (scroller && workPrev && workNext) {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function cardStep() {
      var card = scroller.querySelector('.work-card');
      if (!card) return scroller.clientWidth;
      var gap = parseFloat(getComputedStyle(scroller).columnGap || getComputedStyle(scroller).gap) || 0;
      return card.getBoundingClientRect().width + gap;
    }

    function scrollByCards(dir) {
      scroller.scrollBy({
        left: dir * cardStep(),
        behavior: reduceMotion.matches ? 'auto' : 'smooth'
      });
    }

    function updateEdges() {
      var max = scroller.scrollWidth - scroller.clientWidth;
      workPrev.disabled = scroller.scrollLeft <= 2;
      workNext.disabled = scroller.scrollLeft >= max - 2;
    }

    workPrev.addEventListener('click', function () { scrollByCards(-1); });
    workNext.addEventListener('click', function () { scrollByCards(1); });
    scroller.addEventListener('scroll', updateEdges, { passive: true });
    window.addEventListener('resize', updateEdges);
    updateEdges();
  }
})();
