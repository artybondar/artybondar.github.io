# Женский путь — Мария Воинкова

Статический лендинг: `index.html`, `style.css`, `script.js`, `robots.txt`, `sitemap.xml`, `images/`. Без зависимостей и сборки.

## Перед публикацией — 3 вещи, которые надо заменить

1. **Домен.** Сейчас во всех мета-тегах (`index.html`), `robots.txt` и `sitemap.xml` стоит заглушка `https://zhenskiyput.github.io/`. Замени на свой реальный адрес после деплоя (find/replace по всем трём файлам).
2. **Яндекс.Метрика.** Зарегистрируй счётчик на [metrika.yandex.ru](https://metrika.yandex.ru) — замени `00000000` в `index.html` (в скрипте счётчика и в `<noscript>` строкой ниже).
3. **OG-картинка.** `images/og-image.png` (1200×630) — превью при шеринге в VK/Telegram. Исходник — `images/og-source.svg`.

## SEO, что уже сделано

- `<title>` и `<meta description>` под запросы аудитории («женский путь», «мария воинкова», «практики для женщин»).
- Open Graph + Twitter Card для превью в соцсетях.
- JSON-LD (schema.org/Person) со ссылками на VK, Telegram, YouTube.
- `robots.txt` и `sitemap.xml`.

## Деплой на GitHub Pages

1. Создай репозиторий и залей туда все файлы.
2. Settings → Pages → Source: `Deploy from a branch`, ветка `main`, папка `/root`.
3. Через минуту страница будет доступна по адресу
   `https://<username>.github.io/<repo>/`.

## Фото

В `images/` сейчас лежат абстрактные SVG-заглушки в цветах сайта — портрет и 6 карточек галереи. Чтобы поставить настоящие фото, просто замени файлы, сохранив имена (`portrait.jpg`, `gallery-1.jpg` … `gallery-6.jpg`) и поправь расширения в `index.html`, либо подставь свои имена файлов напрямую в атрибуты `src`.

Скачать фото напрямую из VK, Telegram или YouTube автоматически не вышло: страница VK недоступна для парсинга, у YouTube-канала нет открытого RSS, а превью Telegram отдаёт только аватар канала по временной ссылке, которая может перестать работать.

## Локальный просмотр

Открой `index.html` в браузере, либо из папки:

```bash
python3 -m http.server 8000
```

и зайди на `http://localhost:8000`.

