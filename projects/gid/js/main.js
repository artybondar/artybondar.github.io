(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- Load sequence ---------- */
  const start = () => requestAnimationFrame(() => root.classList.add('is-loaded'));
  const heroImg = document.querySelector('[data-hero-mouse] img');
  if (heroImg && !heroImg.complete) { heroImg.addEventListener('load', start, { once: true }); setTimeout(start, 2500); }
  else setTimeout(start, 250);

  /* ---------- Smooth scroll (Lenis) ---------- */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ duration: 1.25, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length < 2 && id !== '#') return;
      const target = id === '#' ? document.body : document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      closeMenu();
      const svc = a.dataset.service;
      if (svc) { const r = document.querySelector(`input[name="service"][value="${svc}"]`); if (r) r.checked = true; }
      if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.6 });
      else target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  /* ---------- Header state ---------- */
  const header = document.querySelector('.site-header');
  let lastY = 0;
  const onScroll = y => {
    header.classList.toggle('scrolled', y > window.innerHeight * 0.85);
    header.classList.toggle('hidden-up', y > lastY && y > window.innerHeight);
    lastY = y;
  };

  /* ---------- Parallax ---------- */
  const heroPar = document.querySelector('[data-hero-parallax]');
  const heroContent = document.querySelector('[data-hero-content]');
  const parEls = [...document.querySelectorAll('[data-parallax]')];
  const tick = () => {
    const y = window.scrollY, vh = window.innerHeight;
    onScroll(y);
    if (reduce) return;
    if (y < vh * 1.2 && root.classList.contains('is-loaded')) {
      heroPar.style.transform = `translate3d(0, ${y * 0.35}px, 0) scale(${1.08 + y / vh * 0.08})`;
      heroContent.style.transform = `translate3d(0, ${y * 0.18}px, 0)`;
      heroContent.style.opacity = String(Math.max(0, 1 - y / (vh * 0.75)));
    }
    parEls.forEach(el => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const p = (r.top + r.height / 2 - vh / 2) / vh;
      el.style.transform = `translate3d(0, ${p * parseFloat(el.dataset.parallax) * 10}%, 0)`;
    });
  };
  if (lenis) lenis.on('scroll', tick); else addEventListener('scroll', tick, { passive: true });
  // After the reveal finishes, hand transform control to parallax
  setTimeout(() => { if (heroPar) heroPar.style.transition = 'none'; tick(); }, 3000);

  /* Hero mouse drift */
  const heroMouse = document.querySelector('[data-hero-mouse]');
  if (fine && !reduce && heroMouse) {
    let tx = 0, ty = 0, cx = 0, cy = 0;
    addEventListener('mousemove', e => { tx = (e.clientX / innerWidth - 0.5) * -24; ty = (e.clientY / innerHeight - 0.5) * -16; });
    const loop = () => { cx += (tx - cx) * 0.05; cy += (ty - cy) * 0.05; heroMouse.style.translate = `${cx}px ${cy}px`; requestAnimationFrame(loop); };
    loop();
  }

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const t = en.target._revealTarget || en.target;
      t.classList.add('in'); io.unobserve(en.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  // clip-path hides the element from IntersectionObserver, so watch its wrapper instead
  document.querySelectorAll('.reveal-img').forEach(el => { const w = el.parentElement; w._revealTarget = el; io.observe(w); });

  /* Counters */
  const cio = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target, end = +el.dataset.count, t0 = performance.now(), dur = 1800;
      const step = t => { const p = Math.min(1, (t - t0) / dur); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step); cio.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

  /* ---------- Custom cursor ---------- */
  if (fine) {
    root.classList.add('has-cursor');
    const dot = document.querySelector('.cursor-dot'), ring = document.querySelector('.cursor-ring'), label = ring.querySelector('span');
    let mx = -100, my = -100, rx = -100, ry = -100, shown = false;
    addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      if (!shown) { shown = true; rx = mx; ry = my; dot.classList.remove('is-hidden'); ring.classList.remove('is-hidden'); }
    });
    document.addEventListener('mouseleave', () => { dot.classList.add('is-hidden'); ring.classList.add('is-hidden'); shown = false; });
    addEventListener('mousedown', () => ring.classList.add('is-down'));
    addEventListener('mouseup', () => ring.classList.remove('is-down'));
    const follow = () => { rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16; ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`; requestAnimationFrame(follow); };
    follow();
    document.addEventListener('mouseover', e => {
      const view = e.target.closest('[data-cursor="view"]');
      const link = e.target.closest('a, button, label, summary, input, textarea');
      ring.classList.toggle('is-view', !!view);
      ring.classList.toggle('is-link', !view && !!link);
      dot.classList.toggle('is-hidden', !!view);
      if (view) label.textContent = view.dataset.cursorLabel || 'Смотреть';
    });
  }

  /* ---------- Theme toggle ---------- */
  const toggle = document.querySelector('[data-theme-toggle]');
  const sun = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  const moon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  const setIcon = () => { const d = root.dataset.theme === 'dark'; toggle.innerHTML = d ? sun : moon; toggle.setAttribute('aria-label', d ? 'Светлая тема' : 'Тёмная тема'); };
  setIcon();
  toggle.addEventListener('click', () => { root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark'; setIcon(); });

  /* ---------- Mobile menu ---------- */
  const menu = document.getElementById('mobile-menu');
  const openBtn = document.querySelector('[data-menu-open]');
  function closeMenu() { if (!menu.classList.contains('open')) return; menu.classList.remove('open'); menu.setAttribute('aria-hidden', 'true'); openBtn.setAttribute('aria-expanded', 'false'); lenis && lenis.start(); }
  openBtn.addEventListener('click', () => { menu.classList.add('open'); menu.setAttribute('aria-hidden', 'false'); openBtn.setAttribute('aria-expanded', 'true'); lenis && lenis.stop(); });
  document.querySelector('[data-menu-close]').addEventListener('click', closeMenu);
  addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  /* ---------- Form ---------- */
  const form = document.getElementById('contact-form'), status = document.getElementById('form-status');
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.name.value.trim() || !form.contact.value.trim()) { status.textContent = 'Пожалуйста, укажите имя и контакт.'; status.className = 'text-sm text-blush'; return; }
    status.textContent = 'Спасибо! Я свяжусь с вами в течение дня.'; status.className = 'text-sm text-bg';
    form.reset(); form.querySelector('input[value="languages"]').checked = true;
  });
})();
