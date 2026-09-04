// =============================================
// 1. МОБИЛЬНОЕ МЕНЮ
// =============================================
(function() {
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = primaryNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Закрываем меню при клике на ссылку
    primaryNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        primaryNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Закрываем меню при клике вне его
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.site-header')) {
        primaryNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
})();

// =============================================
// 2. PATH — АНИМАЦИЯ ДОРОЖКИ И МАРКЕР
// =============================================
(function() {
  const track = document.getElementById('pathTrack');
  const curve = document.getElementById('pathCurve');
  const marker = document.getElementById('pathMarker');
  if (!track || !curve || !marker) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const length = curve.getTotalLength();
  curve.style.strokeDasharray = length;

  if (prefersReduced) {
    curve.style.strokeDashoffset = 0;
    marker.style.top = '100%';
    return;
  }

  curve.style.strokeDashoffset = length;

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function update() {
    const rect = track.getBoundingClientRect();
    const vh = window.innerHeight;

    // progress: 0 когда верх трека на ~85% вьюпорта, 1 когда низ трека на ~15% вьюпорта
    const start = vh * 0.85;
    const end = vh * 0.15;
    const total = rect.height + (start - end);
    const traveled = start - rect.top;
    const progress = clamp(traveled / total, 0, 1);

    curve.style.strokeDashoffset = String(length * (1 - progress));
    marker.style.top = (progress * rect.height) + 'px';

    // Подсвечиваем активный шаг
    const pathStops = document.querySelectorAll('.path-stop');
    if (pathStops.length) {
      const activeIndex = Math.min(
        Math.floor(progress * pathStops.length),
        pathStops.length - 1
      );
      pathStops.forEach((stop, index) => {
        if (index === activeIndex) {
          stop.style.borderColor = 'var(--berry)';
          stop.style.boxShadow = '0 4px 20px rgba(156,79,99,0.12)';
        } else {
          stop.style.borderColor = 'var(--line)';
          stop.style.boxShadow = 'none';
        }
      });
    }
  }

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
})();

// =============================================
// 3. ГАЛЕРЕЯ — ЛАЙТБОКС
// =============================================
(function() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('lightboxClose');
  const items = document.querySelectorAll('.gallery-item');
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

  if (closeBtn) {
    closeBtn.addEventListener('click', close);
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.hasAttribute('hidden')) {
      close();
    }
  });
})();