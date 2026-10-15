# korolov-it-partner — карта кода

## 1. Что это и для кого

Маркетинговый сайт **Korolov IT-Service** (домен `korolov-it-service.de`) — IT-услуги для
малого бизнеса в Leverkusen/Köln/NRW: создание сайтов, поддержка сайтов (Wartung),
почта/домен/хостинг, IT-поддержка, IT-консалтинг, «Digital Setup». Есть страница
референсов (кейсы) и юридические страницы (Impressum, Datenschutz, Widerruf).

Языки: **de** (основной, `/`), **ru** (`/ru`), **uk** (`/uk`, украинский). Старый `/ua`
редиректится на `/uk` (301, и в `vercel.json`, и в `public/_redirects`).

## 2. Стек

- **Фреймворк**: React 19 + TanStack Router/Start (файловый роутинг из `src/routes/`,
  `routeTree.gen.ts` генерируется плагином `@tanstack/router-plugin`, не редактировать руками).
- **Сборка**: Vite 7. `npm run build` = `vite build` + `node scripts/prerender.mjs`
  (постпроцесс: рендерит каждый роут headless-Chrome через `puppeteer-core` и кладёт
  статический HTML-снапшот в `dist/<route>.html` — чтобы краулеры без JS видели контент).
- **Стилизация/UI-кит**: Tailwind CSS v4 (`@tailwindcss/vite`) + **shadcn/ui** (`components.json`,
  стиль `new-york`, алиасы `@/components`, `@/lib`, `@/hooks`; ~46 компонентов в `src/components/ui`).
  Формы — `react-hook-form` + `zod` + `@hookform/resolvers`. Иконки — `lucide-react`.
- **Почта**: `nodemailer` (SMTP) или Resend HTTP API (переключение по наличию `RESEND_API_KEY`).
- **Хостинг/деплой**: **Vercel** (`vercel.json` — buildCommand, outputDirectory `dist`,
  редиректы `/ua→/uk`, rewrite `/api/contact.php→/api/contact` и SPA-fallback на `index.html`,
  security-headers, CSP). Контактная форма — Vercel Node serverless-функция `api/contact.mjs`
  (`export const config = { runtime: "nodejs" }`).
- Есть неиспользуемый хвост от других вариантов хостинга (см. раздел 8: подводные камни).

## 3. Структура

### Корень
- `index.html` — единственный HTML-шаблон SPA (`<div id="root">` + `src/main.tsx`), статичные
  OG/Twitter-теги на немецком (для крауле­ров без JS; SPA переопределяет их на клиенте по роуту).
- `vercel.json` — конфиг деплоя/редиректов/заголовков (описан выше).
- `vite.config.ts` — плагины: `tanstackRouter`, `react`, `tailwindcss`, `tsConfigPaths`,
  кастомный `viteContactApiPlugin()` (см. `server/viteContactPlugin.mjs`) — поднимает
  `/api/contact.php` прямо в `vite dev`, чтобы форма работала локально без Vercel CLI.
- `wrangler.toml`, deps `@cloudflare/vite-plugin` — **не используются** (см. п.8).
- `.Codex/launch.json` — конфиг для MCP Simulator/preview: `npm run dev` на порту 5173.

### `src/routes/` (файловый роутинг TanStack)
- `__root.tsx` — корневой layout.
- `index.tsx` — главная (de), `ru.tsx` / `uk.tsx` — локализованные главные (все три рендерят
  один и тот же `HomePage` с разным `locale`), `widerruf.tsx`/`datenschutz.tsx`/`impressum.tsx` —
  юридические.
- Немецкие SEO-лендинги (каждый — отдельная посадочная страница под свой поисковый запрос):
  `it-service-leverkusen.tsx`, `it-beratung-leverkusen.tsx`, `it-support-leverkusen.tsx`,
  `it-betreuung-kleine-unternehmen.tsx`, `webdesign-leverkusen.tsx`,
  `website-wartung-leverkusen.tsx`, `wartungsvertrag-it.tsx`,
  `website-fuer-anwaltskanzlei-leverkusen.tsx`, `website-fuer-handwerker-leverkusen.tsx`,
  `website-fuer-hausverwaltung-leverkusen.tsx`.
- `referenzen.tsx` — список кейсов; `referenzen_.wupperstahl.tsx`,
  `referenzen_.erbrecht-leverkusen.tsx`, `referenzen_.hausverwaltung-frank.tsx` — детальные
  страницы кейсов (`_.` в имени = вложенный путь `/referenzen/...` без общего layout-роута).

### `src/components/`
- `home/` — секции главной: `Hero`, `Problem`, `ForWhom`, `Services`, `Process`, `Pricing`,
  `About`, `FAQ`, `Contact` (форма, шлёт на `/api/contact.php`), `ServiceLinks`,
  `SectionHeading`; `HomePage.tsx` собирает их по порядку для de/ru/uk.
- `landing/` — по компоненту на каждый SEO-лендинг из `src/routes` + общие
  `ServiceLandingPage.tsx` (шаблон-обёртка) и `LandingContactForm.tsx` (форма лендингов, тоже
  шлёт на `/api/contact.php`).
- `legal/` — `ImpressumPage`, `DatenschutzPage`, `WiderrufPage`.
- `references/` — `CaseDetailPage.tsx` (общий шаблон кейса) + 3 конкретных кейса.
- `sections/ReferencesSection.tsx` — блок референсов, переиспользуемый на главной/лендингах.
- `seo/JsonLd.tsx` — вставка JSON-LD структурированных данных.
- `ui/` — shadcn-компоненты (примитивы Radix + Tailwind), не редактировать вручную без нужды.

### `src/lib`, `src/data`, `src/i18n`, `src/config`
- `lib/seo.ts` — `buildSeoMeta`, `buildCanonicalLink`, `buildHreflangLinks` (общая SEO-логика
  для всех роутов: title/description/canonical/hreflang/OG).
- `lib/structured-data.ts` — генераторы JSON-LD (Organization/LocalBusiness и т.п.).
- `lib/utils.ts` — обычный `cn()` и подобные хелперы shadcn.
- `data/landing.ts`, `data/cases.ts`, `data/testimonials.ts` — контентные данные для
  лендингов/кейсов/отзывов (не хардкод в JSX, а вынесенные объекты).
- `i18n/{de,ru,uk}.ts` + `index.ts` (`getDict(locale)`) — словари переводов, `types.ts` — типы
  `Locale`/`Dict`.
- `config/legal.ts` — реквизиты/тексты для юридических страниц.

### `api/` и `server/` (бэкенд контактной формы)
- `api/contact.mjs` — Vercel serverless-функция: парсит JSON-тело, вызывает
  `handleContact()`, отвечает `{ok, ...}`. Это единственный файл в `api/`.
- `server/contactHandler.mjs` — вся логика формы: валидация полей (имя/email/телефон/тема/
  сообщение/consent), rate-limit по IP (`CONTACT_RATE_LIMIT_PER_MIN`, дефолт 5/мин, in-memory
  Map — **не переживает** рестарт/несколько инстансов serverless), honeypot-поле `_honey`,
  выбор Resend или SMTP по `RESEND_API_KEY`, тексты писем на de/ru/uk, опциональное
  письмо-копия клиенту (`CONTACT_SEND_CLIENT_COPY=1`).
- `server/index.mjs` — альтернативный запуск: Express-сервер, раздаёт `dist/` статикой +
  тот же `/api/contact.php` (используется через `npm start`, для классического Node-хостинга,
  не для Vercel).
- `server/viteContactPlugin.mjs` (+ `.d.ts`) — тот же обработчик, но встроенный в
  `vite dev`/`vite preview` как middleware, чтобы форма работала локально.
- Форма шлёт на путь **`/api/contact.php`** (не `/api/contact`) — так исторически, `vercel.json`
  делает rewrite `/api/contact.php → /api/contact`; dev-плагин и Express слушают `.php`-путь
  напрямую.

## 4. Контент

- Тексты лендингов/секций — частично в самих `.tsx` (де-факто основной язык — немецкий),
  частично в `src/data/*.ts`; переводы главной — в `src/i18n/*.ts`.
- SEO: title/description/OG/Twitter — статика на немецком в `index.html` (для краулеров без
  JS) + динамика на клиенте через `buildSeoMeta` в каждом роуте; `public/sitemap.xml`,
  `public/robots.txt` — вручную поддерживаемые файлы.
- Юридические страницы: `datenschutz.tsx`/`impressum.tsx`/`widerruf.tsx` (роуты) +
  `src/components/legal/*` (контент) + `src/config/legal.ts` (реквизиты).
- Картинки/логотипы клиентов/кейсы — `public/images`, `public/client-logos`, `public/cases`,
  `public/projects/<slug>` (у `erbrecht-leverkusen` — целый статический под-сайт с
  `assets/img`, `assets/pdf`, `css`, `js`, отдельный от основного React-приложения).
- Шрифт Inter — `public/fonts` (`.woff2`), предзагружается в `index.html`.

## 5. Конфиг/секреты (только имена, см. `.env.example`)

`RESEND_API_KEY`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, `MAIL_TO`,
`MAIL_SUBJECT`, `CONTACT_SEND_CLIENT_COPY`, `CONTACT_RATE_LIMIT_PER_MIN`, `CONTACT_DEBUG`.
Реальные значения — в `.env` (в `.gitignore`, не коммитить). На Vercel эти же переменные
задаются в настройках проекта.

## 6. Как запускать/собирать/деплоить

- Пакетный менеджер — **bun** (`bunfig.toml` есть), но скрипты в `package.json` вызывают
  `npm`/`node`/`vite` напрямую — можно и `bun install` + `bun run dev`, и обычный `npm`.
- `npm run dev` — Vite dev-server (порт 5173, форма работает через `viteContactApiPlugin`).
- `npm run build` — прод-сборка: `vite build` → `dist/` → `scripts/prerender.mjs` дорендеривает
  список роутов из `ROUTES` в этом файле headless-Chrome (нужен локальный/CI Chrome, путь ищется
  автоматически или через `PUPPETEER_EXECUTABLE_PATH`) → `dist/<route>.html`.
- `npm run build:spa` — сборка без пререндера (просто `vite build`).
- `npm run preview` — превью собранного `dist/` через Vite.
- `npm start` — запуск `server/index.mjs` (Express, раздаёт `dist/` + `/api/contact.php`) —
  для не-Vercel хостинга.
- `npm run lint` / `npm run format` — ESLint / Prettier.
- `npm run test:mail` — `scripts/send-test-mail.mjs`, ручная проверка отправки письма.
- Деплой — через Vercel (git push в `main`/PR → авто-деплой, если репозиторий подключён к
  Vercel; иначе `vercel deploy`/`vercel --prod`). `vercel.json` уже настроен под этот проект.

## 7. Планы/TODO

Явного TODO/roadmap-файла в репозитории нет. Из кода видно активную работу над SEO-лендингами
(много узкоспециализированных страниц под конкретные запросы) и над мультиязычностью (de/ru/uk).
Открытых `TODO`/`FIXME`-комментариев в просмотренных файлах не встречено — если появятся,
искать через `grep -rn "TODO\|FIXME" src`.

## 8. Подводные камни

- **Форма шлёт на `/api/contact.php`**, а не `/api/contact` — не путать при рефакторинге;
  реальный обработчик — `api/contact.mjs` + `server/contactHandler.mjs`, `.php` — это только
  путь в rewrite-правилах (наследие миграции с PHP-хостинга).
- **Мёртвый PHP-бэкенд**: `public/api/contact.php` — старая реализация формы для классического
  Apache/PHP-хостинга; в проде не используется (`vercel.json` buildCommand явно делает
  `rm -f dist/api/*.php`), но файл всё ещё в репозитории и в `public/`.
- **Неиспользуемые артефакты хостинга**: `wrangler.toml` + зависимость `@cloudflare/vite-plugin`
  (плагин нигде не подключён в `vite.config.ts`) и `public/.htaccess` — хвосты от шаблона/других
  вариантов деплоя; реальный хостинг — Vercel. Перед тем как их трогать/удалять — уточнить у
  владельца, не используются ли они где-то ещё.
- **`public/_redirects`** (Netlify-формат) дублирует редирект `/ua→/uk`, который уже есть в
  `vercel.json` — тоже, вероятно, наследие, но безвредно на Vercel (файл просто игнорируется).
- **Rate-limit контактной формы — in-memory** (`Map` в `server/contactHandler.mjs`), на Vercel
  serverless это не защищает от спама надёжно: каждый холодный старт/инстанс — свой счётчик.
- **Пререндер требует Chrome** локально или в CI (`puppeteer-core`, без своего Chromium) — если
  сборка падает на этапе пререндера, первым делом проверять доступность Chrome/переменную
  `PUPPETEER_EXECUTABLE_PATH`.
- **Список роутов для пререндера жёстко захардкожен** в `scripts/prerender.mjs` (`ROUTES`) —
  при добавлении нового роута в `src/routes/` его нужно вручную дописать туда, иначе новая
  страница не получит статический HTML-снапшот для краулеров.
- **README отсутствует** — эта карта (`AGENTS.md`) сейчас единственная точка входа в проект,
  кроме самого кода.
