/*
  main.js · Avian Website 2026 ("Field Notes")
  Purpose: progressive-enhancement behavior for the single page.
  Key contents: theme toggle (shared avian-theme key), nav frost-on-scroll, IntersectionObserver scroll
                reveals + signature gold tick, active-section nav tracking, mobile contents sheet (open/close +
                focus trap), accessible anchor focus.
  Related: index.html, styles.css. No dependencies, no build step.
*/
(function () {
  'use strict';

  var THEME_KEY = 'avian-theme';
  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------------
     Theme toggle — persists to the shared avian-theme key; updates all toggles
     --------------------------------------------------------------------- */
  function currentTheme() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }
  function syncToggleLabels() {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.setAttribute('aria-label', 'Switch to ' + next + ' theme');
    });
    var meta = currentTheme() === 'dark' ? '#0B1B2B' : '#FBF8F3';
    var tc = document.querySelector('meta[name="theme-color"]:not([media])');
    if (tc) tc.setAttribute('content', meta);
  }
  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
    syncToggleLabels();
  }
  document.querySelectorAll('.theme-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
    });
  });
  syncToggleLabels();

  /* ---------------------------------------------------------------------
     Nav frost-on-scroll (rAF-throttled passive listener)
     --------------------------------------------------------------------- */
  var nav = document.getElementById('nav');
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      nav.classList.toggle('is-scrolled', window.scrollY > 32);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------------------------------------------------------------
     Scroll reveals — fade-up, staggered per group; fires once then unobserves.
     Also flips the per-section .is-revealed (drives the 03 gold tick + index rules).
     --------------------------------------------------------------------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-revealed'); });
    document.querySelectorAll('.note, .section').forEach(function (el) { el.classList.add('is-revealed'); });
  } else {
    // Stagger reveals within a shared parent for a typeset cadence.
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var siblings = el.parentElement ? el.parentElement.querySelectorAll(':scope > .reveal') : [el];
        var idx = Array.prototype.indexOf.call(siblings, el);
        el.style.transitionDelay = Math.min(idx, 6) * 60 + 'ms';
        el.classList.add('is-revealed');
        obs.unobserve(el);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });

    // Section-level flag for the gold tick (note) + any per-section motion.
    var sectionObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.35 });
    document.querySelectorAll('.note').forEach(function (el) { sectionObserver.observe(el); });
  }

  /* ---------------------------------------------------------------------
     Active section tracking — highlights the matching nav index number
     --------------------------------------------------------------------- */
  var navNums = Array.prototype.slice.call(document.querySelectorAll('.nav__num'));
  var sectionById = {};
  navNums.forEach(function (a) {
    var id = a.getAttribute('data-section');
    var sec = document.getElementById(id);
    if (sec) sectionById[id] = a;
  });
  if ('IntersectionObserver' in window) {
    var activeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        navNums.forEach(function (a) {
          var on = a.getAttribute('data-section') === id;
          a.classList.toggle('is-active', on);
          if (on) { a.setAttribute('aria-current', 'true'); } else { a.removeAttribute('aria-current'); }
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    Object.keys(sectionById).forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) activeObserver.observe(sec);
    });
  }

  /* ---------------------------------------------------------------------
     Accessible anchor focus — jumping to a section focuses its heading
     --------------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href').slice(1);
      if (!id) return;
      var target = document.getElementById(id);
      if (!target) return;
      // let smooth-scroll happen, then move focus without an extra jump
      window.setTimeout(function () {
        // "back to top" (#top = <body>) shouldn't hunt for a heading — focus the body itself.
        var heading = (target === document.body) ? target : (target.querySelector('h1, h2') || target);
        heading.setAttribute('tabindex', '-1');
        heading.focus({ preventScroll: true });
      }, reduceMotion ? 0 : 420);
    });
  });

  /* ---------------------------------------------------------------------
     Mobile contents sheet — open/close, focus trap, Esc, backdrop
     --------------------------------------------------------------------- */
  var menuBtn = document.querySelector('.nav__menu');
  var sheet = document.getElementById('menu-sheet');
  var lastFocused = null;

  function focusables() {
    return Array.prototype.slice.call(
      sheet.querySelectorAll('a[href], button:not([disabled])')
    ).filter(function (el) { return el.offsetParent !== null; });
  }
  function openSheet() {
    lastFocused = document.activeElement;
    sheet.hidden = false;
    // next frame so the transition runs
    requestAnimationFrame(function () { sheet.classList.add('is-open'); });
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    var f = focusables();
    if (f.length) f[0].focus();
    document.addEventListener('keydown', onKeydown);
  }
  function closeSheet() {
    sheet.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKeydown);
    var done = function () {
      sheet.hidden = true;
      sheet.removeEventListener('transitionend', done);
    };
    if (reduceMotion) { sheet.hidden = true; } else { sheet.addEventListener('transitionend', done); }
    if (lastFocused) lastFocused.focus();
  }
  function onKeydown(e) {
    if (e.key === 'Escape') { closeSheet(); return; }
    if (e.key !== 'Tab') return;
    var f = focusables();
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  if (menuBtn && sheet) {
    menuBtn.addEventListener('click', function () {
      if (sheet.hidden) openSheet(); else closeSheet();
    });
    sheet.querySelectorAll('[data-sheet-close]').forEach(function (el) {
      el.addEventListener('click', closeSheet);
    });
  }
})();
