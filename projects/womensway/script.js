// =============================================
// 1. МОБИЛЬНОЕ МЕНЮ
// =============================================
(function () {
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');
  if (!navToggle || !primaryNav) return;

  navToggle.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  primaryNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      primaryNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.site-header')) {
      primaryNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
})();

// =============================================
// 2. ШАПКА — ФОН ПРИ СКРОЛЛЕ
// =============================================
(function () {
  const header = document.getElementById('siteHeader');
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// =============================================
// 3. REVEAL-ON-SCROLL
// =============================================
(function () {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    items.forEach((el) => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
  );

  items.forEach((el) => observer.observe(el));
})();

// =============================================
// 4. ПАРАЛЛАКС ФОНОВЫХ ИЗОБРАЖЕНИЙ
// =============================================
(function () {
  const layers = document.querySelectorAll('.parallax');
  if (!layers.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  let ticking = false;

  function update() {
    ticking = false;
    layers.forEach((layer) => {
      const speed = parseFloat(layer.dataset.speed || '0.3');
      const rect = layer.parentElement.getBoundingClientRect();
      const offset = rect.top * speed;
      layer.style.transform = `translate3d(0, ${offset}px, 0)`;
    });
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
})();

// =============================================
// 5. МЫШЬ-ПАРАЛЛАКС ДЛЯ ДЕКОРАТИВНЫХ ORB В ХИРО
// =============================================
(function () {
  const orbs = document.querySelectorAll('.orb');
  const hero = document.querySelector('.hero');
  if (!orbs.length || !hero) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    orbs.forEach((orb) => {
      const speed = parseFloat(orb.dataset.parallax || '0.05') * 100;
      orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
  });
})();

// =============================================
// 6. ЛАЙТБОКС ДЛЯ ЛЕНТЫ ФОТО «АТМОСФЕРА УСПЕХА»
// =============================================
(function () {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('lightboxClose');
  const items = document.querySelectorAll('.film-item');
  if (!lightbox || !lightboxImg || !items.length) return;

  function open(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.setAttribute('hidden', '');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  items.forEach((item) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      open(item.dataset.full, img ? img.alt : '');
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.hasAttribute('hidden')) close();
  });
})();
