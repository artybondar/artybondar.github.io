// ---------- path draws itself + marker moves as you scroll ----------
(function () {
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

    // progress: 0 when track top hits ~80% of viewport, 1 when track bottom hits ~20% of viewport
    const start = vh * 0.85;
    const end = vh * 0.15;
    const total = rect.height + (start - end);
    const traveled = start - rect.top;
    const progress = clamp(traveled / total, 0, 1);

    curve.style.strokeDashoffset = String(length * (1 - progress));
    marker.style.top = (progress * rect.height) + 'px';
  }

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
})();

// ---------- gallery lightbox ----------
(function () {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('lightboxClose');
  const items = document.querySelectorAll('.gallery-item');
  if (!lightbox || !lightboxImg || !items.length) return;

  function open(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.hidden = true;
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  items.forEach((item) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      open(item.dataset.full, img ? img.alt : '');
    });
  });

  closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.hidden) close();
  });
})();
