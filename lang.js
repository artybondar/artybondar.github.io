/* EN/RU switcher for artybondar.github.io — one file, no dependencies.
   Подключение: <script src="lang.js" defer></script> перед </body> в index.html */
(() => {
  'use strict';

  const STORE = 'ab-lang';
  const nav = document.getElementById('nav');
  const menuBtn = document.getElementById('menuBtn');
  if (!nav || !menuBtn) return;

  // [selector, ru] — ru: строка (для одного элемента) или массив (по порядку найденных элементов)
  const T = [
    ['.nav-links a', ['О себе', 'Навыки', 'Опыт', 'Блог', 'Контакты']],
    ['#mobileNav a', ['О себе', 'Навыки', 'Опыт', 'Блог', 'Контакты']],

    ['.hero-tag', '// Fullstack-разработчик'],
    ['.hero-sub p', '18+ лет создаю цифровые продукты в вебе, банках и фитнес-индустрии. От аккуратных интерфейсов до масштабируемых бэкендов.'],
    ['.hero-cta span:first-child', 'Связаться'],
    ['.hero-scroll', 'Вниз'],

    ['#about .section-label', '// 001 — Обо мне'],
    ['#about .section-title', 'Кто <em>я</em>'],
    ['.about-quote', '«Три вещи не возвращаются — время, слово и возможность. Поэтому: не трать время зря, выбирай слова, не упускай шанс.»<cite>— Конфуций</cite>'],
    ['.stat-label', ['Лет опыта', 'Отрасли', 'Любопытство']],
    ['.about-text p', [
      'Я <strong>увлечённый fullstack-разработчик</strong>, которому интересно всё новое и современное. Более 18 лет опыта в IT, веб-разработке, банковской сфере и фитнес-индустрии.',
      'Следую стандартам PSR и предпочитаю <strong>MVC-архитектуру</strong> (фреймворки Yii и Laravel), но подбираю подход под реальные потребности проекта.',
      'Держу руку на пульсе: ежедневно читаю IT- и веб-сообщества, в том числе Хабр, и всегда слежу за новым.'
    ]],
    ['.hobby-tag', ['✈ Путешествия', '🏋 Фитнес', '🏊 Плавание', '⛷ Лыжи', '🚴 Велоспорт', '🏉 Регби', '🎸 Рок-музыка', '💻 Open Source']],

    ['#skills .section-label', '// 002 — Навыки'],
    ['#skills .section-title', 'Что я <em>создаю</em>'],
    ['.skill-card h3', ['Фронтенд', 'Бэкенд', 'Данные и инфраструктура', 'Архитектура', 'CMS и инструменты', 'Софт-скиллы']],
    ['.skill-card:last-child .skill-tag', ['Командная работа', 'Менторинг', 'Agile', 'Code Review', 'Решение проблем']],

    ['#experience .section-label', '// 003 — Опыт'],
    ['#experience .section-title', 'Где я <em>работал</em>'],
    ['.exp-date', ['2013 — Сейчас', '2012 — 2013', '2011 — 2012', '2008 — 2011']],
    ['.exp-company', ['Веб / IT', 'Фитнес-индустрия', 'Банковский сектор', 'Фриланс / агентство']],
    ['.exp-role', ['Senior Fullstack-разработчик', 'Веб-разработчик', 'Fullstack-разработчик', 'Junior веб-разработчик']],
    ['.exp-desc', [
      'Руковожу разработкой сложных веб-приложений. Создаю масштабируемые REST API, проектирую фронтенд-системы на современных JS-фреймворках, менторю джунов.',
      'Разрабатывал и поддерживал платформы управления фитнес-клубами. Делал клубные порталы, системы записи и CMS-сайты для маркетинга. Вёл продукт на всех этапах: от дизайна до деплоя.',
      'Разрабатывал внутренние банковские порталы и клиентские веб-продукты. Работал в средах с повышенной безопасностью, с системами целостности данных и сложной бизнес-логикой на PHP / Yii2.',
      'Начинал карьеру с клиентских сайтов, лендингов и PHP-модулей на заказ. Освоил основы чистого кода, систем контроля версий и работы в срок.'
    ]],

    ['#contact .section-label', '// 004 — Контакты'],
    ['.contact-big', 'Давайте<br/><em>работать</em><br/>вместе.'],

    ['footer p:first-child', '© 2026 <span class="accent">Arty Bondar</span>. Сделано с вниманием к деталям.'],
    ['footer a', 'Наверх']
  ];

  const META = [
    ['meta[name="description"]', 'content', 'Arty Bondar — fullstack-разработчик с опытом 18+ лет. PHP, JavaScript, React, Vue.js, Yii2, Laravel. Открыт для проектов.'],
    ['meta[property="og:title"]', 'content', 'Arty Bondar — Fullstack-разработчик | 18+ лет опыта'],
    ['meta[property="og:description"]', 'content', 'Fullstack-разработчик с опытом 18+ лет. PHP, JavaScript, React, Vue.js, Yii2, Laravel.'],
    ['meta[name="twitter:title"]', 'content', 'Arty Bondar — Fullstack-разработчик | 18+ лет опыта'],
    ['meta[name="twitter:description"]', 'content', 'Fullstack-разработчик с опытом 18+ лет. PHP, JavaScript, React, Vue.js, Yii2, Laravel.']
  ];
  const TITLE_RU = 'Arty Bondar — Fullstack-разработчик | 18+ лет опыта';
  const TITLE_EN = document.title;

  // --- UI: кнопка EN / RU ---
  const style = document.createElement('style');
  style.textContent = `
    .nav-right{display:flex;align-items:center;gap:16px}
    .lang-btn{background:none;border:1px solid var(--border);color:var(--muted);font-family:var(--font-mono);
      font-size:12px;letter-spacing:.12em;padding:7px 12px;cursor:pointer;display:inline-flex;gap:8px;transition:border-color .2s}
    .lang-btn:hover{border-color:var(--accent)}
    .lang-btn span{transition:color .2s}
    .lang-btn span.on{color:var(--accent)}
    .lang-btn span+span::before{content:'/';color:#444;margin-right:8px}`;
  document.head.appendChild(style);

  const btn = document.createElement('button');
  btn.className = 'lang-btn';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Language / Язык');
  btn.innerHTML = '<span data-l="en">EN</span><span data-l="ru">RU</span>';

  const right = document.createElement('div');
  right.className = 'nav-right';
  nav.appendChild(right);
  right.append(btn, menuBtn);

  // --- Логика ---
  function apply(lang) {
    const ru = lang === 'ru';

    T.forEach(([sel, val]) => {
      document.querySelectorAll(sel).forEach((el, i) => {
        if (el.dataset.en === undefined) el.dataset.en = el.innerHTML;
        const t = Array.isArray(val) ? val[i] : val;
        el.innerHTML = ru && t !== undefined ? t : el.dataset.en;
      });
    });

    META.forEach(([sel, attr, val]) => {
      const el = document.querySelector(sel);
      if (!el) return;
      if (el.dataset.en === undefined) el.dataset.en = el.getAttribute(attr) || '';
      el.setAttribute(attr, ru ? val : el.dataset.en);
    });

    document.title = ru ? TITLE_RU : TITLE_EN;
    document.documentElement.lang = lang;
    btn.querySelectorAll('span').forEach(s => s.classList.toggle('on', s.dataset.l === lang));
  }

  function initial() {
    const q = new URLSearchParams(location.search).get('lang');
    if (q === 'ru' || q === 'en') return q;
    try {
      const s = localStorage.getItem(STORE);
      if (s === 'ru' || s === 'en') return s;
    } catch (e) { /* storage недоступен */ }
    return (navigator.language || '').toLowerCase().startsWith('ru') ? 'ru' : 'en';
  }

  let current = initial();
  apply(current);

  btn.addEventListener('click', () => {
    current = current === 'ru' ? 'en' : 'ru';
    apply(current);
    try { localStorage.setItem(STORE, current); } catch (e) { /* ignore */ }
  });
})();
