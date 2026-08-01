// ---------- hero fog reveal (follows pointer, reveals crossed-out clichés) ----------
(function () {
  const hero = document.getElementById('hero');
  const sharp = document.getElementById('fogSharp');
  if (!hero || !sharp) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;

  if (prefersReduced) return;

  const RADIUS = isTouch ? 90 : 130;

  function setSpot(x, y) {
    sharp.style.clipPath = `circle(${RADIUS}px at ${x}px ${y}px)`;
  }

  if (!isTouch) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      setSpot(e.clientX - rect.left, e.clientY - rect.top);
    });
    hero.addEventListener('mouseleave', () => {
      sharp.style.clipPath = 'circle(0px at 50% 50%)';
    });
  } else {
    hero.addEventListener('touchmove', (e) => {
      const t = e.touches[0];
      if (!t) return;
      const rect = hero.getBoundingClientRect();
      setSpot(t.clientX - rect.left, t.clientY - rect.top);
    }, { passive: true });
  }
})();

// ---------- flip cards ----------
document.querySelectorAll('.flip-card').forEach((card) => {
  card.addEventListener('click', () => {
    card.classList.toggle('is-flipped');
  });
});

// ---------- scroll reveal for principles ----------
(function () {
  const items = document.querySelectorAll('.principles-list li');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('is-visible'), i * 70);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  items.forEach((el) => observer.observe(el));
})();
