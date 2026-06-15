/* Avian Technology — interactions */

// Current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Dark / light theme toggle (initial theme is set in <head> before paint)
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('avian-theme', next); } catch (e) {}
    themeToggle.setAttribute('aria-label', next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  });
}

// Sticky nav background on scroll
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Mobile menu
const toggle = document.getElementById('navToggle');
const links = document.getElementById('navLinks');
toggle.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
});
links.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  })
);

// Scroll-reveal with stagger
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const siblings = [...entry.target.parentElement.children].filter((c) =>
          c.classList.contains('reveal')
        );
        const i = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${Math.min(i, 6) * 80}ms`;
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealEls.forEach((el) => io.observe(el));

// Animated stat counters
const stats = document.querySelectorAll('.stat__num');
const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      statObserver.unobserve(el);
    });
  },
  { threshold: 0.5 }
);
stats.forEach((s) => statObserver.observe(s));

// Work / showcase filter tabs
const workFilter = document.querySelector('.work-filter');
if (workFilter) {
  const cards = [...document.querySelectorAll('#workGrid .work__card')];
  const empty = document.getElementById('workEmpty');
  const btns = [...workFilter.querySelectorAll('.work-filter__btn')];

  workFilter.addEventListener('click', (e) => {
    const btn = e.target.closest('.work-filter__btn');
    if (!btn) return;

    btns.forEach((b) => {
      const active = b === btn;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-selected', String(active));
    });

    const f = btn.dataset.filter;
    let shown = 0;
    cards.forEach((card) => {
      const match = f === 'all' || (card.dataset.cat || '').includes(f);
      card.classList.toggle('is-hidden', !match);
      card.classList.remove('is-shown');
      if (match) {
        shown++;
        // retrigger entrance animation
        void card.offsetWidth;
        card.classList.add('is-shown');
      }
    });
    if (empty) empty.hidden = shown > 0;
  });
}

// Contact form (front-end demo — no backend yet)
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!name || !validEmail || !message) {
    note.textContent = 'Please fill in all fields with a valid email.';
    note.className = 'form__note err';
    return;
  }
  note.textContent = `Thanks, ${name.split(' ')[0]}! Your message is ready to send.`;
  note.className = 'form__note ok';
  form.reset();
});
