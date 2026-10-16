# Переводчик — iOS-приложение к Dolmetscher

Нативная замена веб-странице `/call`: клавиатура, контакты iPhone, история звонков и тарифы
по балансу Twilio. Сервер — тот же `dolmetscher` на VPS (`ssh scribe`, `/opt/bots/dolmetscher`).

## Сборка

```bash
brew install xcodegen          # один раз
xcodegen generate              # создаёт Dolmetscher.xcodeproj (в git не хранится)
open Dolmetscher.xcodeproj     # или xcodebuild … -allowProvisioningUpdates
```

`Secrets.xcconfig` (в `.gitignore`) задаёт `DOLMETSCHER_URL` и `DOLMETSCHER_KEY` (= `CALL_KEY`
из `dolmetscher.env`); значения попадают в Info.plist и служат умолчанием. В приложении их можно
поменять в настройках (шестерёнка на клавиатуре); ключ хранится в Keychain.

Поставить на iPhone по кабелю:

```bash
xcodebuild -project Dolmetscher.xcodeproj -scheme Dolmetscher -destination 'id=<UDID>' -derivedDataPath build -allowProvisioningUpdates build
xcrun devicectl device install app --device <UDID> build/Build/Products/Debug-iphoneos/Dolmetscher.app
```

## Серверная часть

Сервер лежит в [interpreter/](../interpreter/README.md) (на VPS — `/opt/bots/dolmetscher/src`).
Для приложения там `src/api.mjs`, ключ `Authorization: Bearer <CALL_KEY>`:

- `GET /api/account` — баланс Twilio, сколько минут осталось на типичный звонок, цены составляющих;
- `GET /api/rates?country=DE` — мобильный/стационарный/входящий: цена минуты и запас минут;
- `GET /api/quote?number=0163…` — цена на конкретный номер и можно ли его набрать (до звонка);
- `GET /api/countries` — список стран Twilio (кэш 6 ч);
- `GET /api/calls` — звонки через переводчика: оба плеча вместе, цена Twilio, Media Streams, оценка OpenAI;
- `POST /call` — звонок (сервер звонит вам, потом собеседнику);
- `WS /live-ws` — живой текст разговора; текст текущего разговора держится в памяти до его конца.

Минута переведённого звонка на стороне Twilio = плечо к владельцу (0.042, мобильный E-Plus из ЕЭЗ)
+ плечо к собеседнику (DE: 0.0283 стационарный / 0.042 мобильный) + 2 × 0.0044 Media Streams.
Перевод OpenAI (≈0.068 $/мин, `OPENAI_RATE_PER_MIN`) списывается с отдельного счёта.

Деплой: `scp interpreter/src/*.mjs scribe:/opt/bots/dolmetscher/src/src/`, затем на сервере
`cd /opt/bots/dolmetscher && docker compose build && docker compose up -d`. Тесты: `cd interpreter && npm test`.

После добавления нового .swift-файла нужно заново выполнить `xcodegen generate`.

## Что iOS не даёт

Системный журнал звонков iPhone приложениям недоступен (CallKit не отдаёт историю), поэтому
вкладка «Последние» показывает звонки, прошедшие через переводчика (из Twilio), а имена к ним
подставляются из контактов на самом телефоне.
