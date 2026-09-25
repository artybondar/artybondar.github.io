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
  const items = document.querySelectorAll('.film-item, .review-card');
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

// =============================================
// 7. МАСКА ДЛЯ ТЕЛЕФОНА
// =============================================
(function() {
  const phoneInput = document.getElementById('leadPhone');
  if (!phoneInput) return;

  function formatPhone(value) {
    let digits = value.replace(/\D/g, '');
    if (digits.length > 11) digits = digits.slice(0, 11);
    if (digits.length === 0) return '';
    
    let formatted = '+7';
    if (digits.length > 0) {
      if (digits[0] === '8' || digits[0] === '7') {
        digits = digits.slice(1);
      }
      if (digits.length > 0) {
        formatted += ' (';
        formatted += digits.slice(0, 3);
        if (digits.length > 3) {
          formatted += ') ';
          formatted += digits.slice(3, 6);
          if (digits.length > 6) {
            formatted += '-';
            formatted += digits.slice(6, 8);
            if (digits.length > 8) {
              formatted += '-';
              formatted += digits.slice(8, 10);
            }
          }
        }
      }
    }
    return formatted;
  }

  function handlePhoneInput(e) {
    const input = e.target;
    const cursorPos = input.selectionStart;
    const oldLength = input.value.length;
    const formatted = formatPhone(input.value);
    
    if (formatted !== input.value) {
      input.value = formatted;
      const newLength = formatted.length;
      const diff = newLength - oldLength;
      if (diff > 0) {
        input.setSelectionRange(cursorPos + diff, cursorPos + diff);
      }
    }
  }

  phoneInput.addEventListener('input', handlePhoneInput);
  
  phoneInput.addEventListener('focus', function() {
    if (this.value === '') {
      this.value = '+7 ';
    }
  });
  
  phoneInput.addEventListener('blur', function() {
    if (this.value === '+7 ' || this.value === '+7') {
      this.value = '';
    }
  });
})();

// =============================================
// 8. МОДАЛКА ЗАЯВКИ («Выберите свой путь»)
// =============================================
(function () {
  const overlay = document.getElementById('leadOverlay');
  const closeBtn = document.getElementById('leadClose');
  const form = document.getElementById('leadForm');
  const sourceField = document.getElementById('leadSource');
  const subtitle = document.getElementById('leadSubtitle');
  const nameInput = document.getElementById('leadName');
  const phoneInput = document.getElementById('leadPhone');
  const emailInput = document.getElementById('leadEmail');
  const nameError = document.getElementById('leadNameError');
  const phoneError = document.getElementById('leadPhoneError');
  const emailError = document.getElementById('leadEmailError');
  const consentInput = document.getElementById('leadConsent');
  const consentError = document.getElementById('leadConsentError');
  const newsletterInput = document.getElementById('leadNewsletter');
  const newsletterError = document.getElementById('leadNewsletterError');
  const honeypot = document.getElementById('leadHoneypot');
  const submitBtn = document.getElementById('leadSubmit');
  const statusEl = document.getElementById('leadStatus');
  const triggers = document.querySelectorAll('.solution-card-btn[data-source]');

  if (!overlay || !form || !triggers.length) return;

  let lastFocused = null;

  function openModal(sourceLabel) {
    lastFocused = document.activeElement;
    sourceField.value = sourceLabel || '';
    subtitle.textContent = sourceLabel
      ? `Путь: «${sourceLabel}»`
      : 'Я свяжусь с вами в ближайшее время';
    resetForm();
    overlay.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    setTimeout(() => nameInput.focus(), 50);
  }

  function closeModal() {
    overlay.setAttribute('hidden', '');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  function resetForm() {
    form.reset();
    nameInput.classList.remove('invalid');
    phoneInput.classList.remove('invalid');
    emailInput.classList.remove('invalid');
    consentInput.classList.remove('invalid');
    newsletterInput.classList.remove('invalid');
    nameError.textContent = '';
    phoneError.textContent = '';
    emailError.textContent = '';
    consentError.textContent = '';
    newsletterError.textContent = '';
    statusEl.textContent = '';
    statusEl.className = 'lead-status';
    submitBtn.disabled = false;
    submitBtn.textContent = 'Отправить';
  }

  triggers.forEach((btn) => {
    btn.addEventListener('click', () => openModal(btn.dataset.source));
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.hasAttribute('hidden')) closeModal();
  });

  function validateName(value) {
    const v = value.trim();
    if (v.length < 2) return 'Введите имя';
    if (!/^[A-Za-zА-Яа-яЁё\s\-']{2,60}$/.test(v)) return 'Только буквы, минимум 2 символа';
    return '';
  }

  function validatePhone(value) {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 0) return 'Введите номер телефона';
    if (digits.length < 11) return 'Введите полный номер телефона';
    if (digits.length > 11) return 'Слишком длинный номер';
    const firstDigit = digits[0];
    if (firstDigit !== '7' && firstDigit !== '8') {
      return 'Номер должен начинаться с 7 или 8';
    }
    return '';
  }

  function validateEmail(value) {
    const v = value.trim();
    if (v.length === 0) return 'Введите email';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Введите корректный email';
    return '';
  }

  function validateConsent() {
    if (!consentInput.checked) {
      return 'Примите условия оферты и дайте согласие на обработку данных';
    }
    return '';
  }

  function validateNewsletter() {
    if (!newsletterInput.checked) {
      return 'Необходимо согласие на получение рассылки';
    }
    return '';
  }

  nameInput.addEventListener('input', () => {
    const err = validateName(nameInput.value);
    nameInput.classList.toggle('invalid', !!err && nameInput.value.length > 0);
    nameError.textContent = '';
  });
  
  phoneInput.addEventListener('input', () => {
    const err = validatePhone(phoneInput.value);
    phoneInput.classList.toggle('invalid', !!err && phoneInput.value.length > 0);
    phoneError.textContent = '';
  });

  emailInput.addEventListener('input', () => {
    const err = validateEmail(emailInput.value);
    emailInput.classList.toggle('invalid', !!err && emailInput.value.length > 0);
    emailError.textContent = '';
  });

  consentInput.addEventListener('change', () => {
    consentInput.classList.remove('invalid');
    consentError.textContent = '';
  });

  newsletterInput.addEventListener('change', () => {
    newsletterInput.classList.remove('invalid');
    newsletterError.textContent = '';
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameErr = validateName(nameInput.value);
    const phoneErr = validatePhone(phoneInput.value);
    const emailErr = validateEmail(emailInput.value);
    const consentErr = validateConsent();
    const newsletterErr = validateNewsletter();

    nameError.textContent = nameErr;
    phoneError.textContent = phoneErr;
    emailError.textContent = emailErr;
    consentError.textContent = consentErr;
    newsletterError.textContent = newsletterErr;

    nameInput.classList.toggle('invalid', !!nameErr);
    phoneInput.classList.toggle('invalid', !!phoneErr);
    emailInput.classList.toggle('invalid', !!emailErr);
    consentInput.classList.toggle('invalid', !!consentErr);
    newsletterInput.classList.toggle('invalid', !!newsletterErr);

    if (nameErr || phoneErr || emailErr || consentErr || newsletterErr) {
      if (nameErr) nameInput.focus();
      else if (phoneErr) phoneInput.focus();
      else if (emailErr) emailInput.focus();
      else if (consentErr) consentInput.focus();
      else newsletterInput.focus();
      return;
    }

    // ловушка для ботов
    if (honeypot.value.trim() !== '') {
      statusEl.textContent = 'Спасибо! Я свяжусь с вами в ближайшее время';
      statusEl.className = 'lead-status success';
      setTimeout(closeModal, 1800);
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправляю…';
    statusEl.textContent = '';
    statusEl.className = 'lead-status';

    try {
      const formData = new FormData(form);
      const response = await fetch('send.php', {
        method: 'POST',
        body: formData,
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      });
      const data = await response.json().catch(() => ({ success: false }));

      if (response.ok && data.success) {
        statusEl.textContent = 'Спасибо! Я свяжусь с вами в ближайшее время';
        statusEl.className = 'lead-status success';
        submitBtn.textContent = 'Отправлено ✓';
        setTimeout(closeModal, 2000);
      } else {
        throw new Error((data && data.error) || 'send_failed');
      }
    } catch (err) {
      statusEl.textContent = 'Не получилось отправить. Попробуйте ещё раз или напишите в Telegram.';
      statusEl.className = 'lead-status error';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Отправить';
    }
  });
})();

// =============================================
// 9. COOKIE
// =============================================
(function () {
  const STORAGE_KEY = 'cookie_consent_v1';
  const banner = document.getElementById('cookieConsent');
  if (!banner) return;

  const acceptBtn = document.getElementById('cookieAccept');
  const declineBtn = document.getElementById('cookieDecline');

  // Проверяем, есть ли уже решение пользователя
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved) {
    // Если уже выбрано — применяем настройки и не показываем баннер
    applyConsent(saved);
  } else {
    // Показываем баннер с небольшой задержкой, чтобы не мешать загрузке
    banner.hidden = false;
    setTimeout(() => banner.classList.add('is-visible'), 800);
  }

  function applyConsent(value) {
    if (value === 'accepted') {
      // Здесь можно инициализировать Яндекс.Метрику и другие трекеры
      // Например, если метрика уже в HTML — она уже работает,
      // но можно добавить доп. согласия для рекламных целей
      window.__cookieConsent = 'accepted';
    } else if (value === 'essential') {
      // Только необходимые — блокируем аналитику
      window.__cookieConsent = 'essential';
      disableAnalytics();
    }
  }

  function disableAnalytics() {
    // Отключаем Яндекс.Метрику, если она уже инициализирована
    if (window.ym) {
      // Устанавливаем флаг запрета сбора данных
      try {
        window.ym(112294060, 'params', { 'cookie_consent': 'declined' });
      } catch (e) {}
    }
    // Блокируем дальнейшие вызовы ym
    window.ym = function () {};
  }

  function save(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {}
    applyConsent(value);
    banner.classList.remove('is-visible');
    setTimeout(() => { banner.hidden = true; }, 500);
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => save('accepted'));
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', () => save('essential'));
  }
})();