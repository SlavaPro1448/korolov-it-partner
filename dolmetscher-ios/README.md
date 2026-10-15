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

## Серверная часть (`server/`)

`api.mjs` — новые JSON-маршруты (ключ: `Authorization: Bearer <CALL_KEY>` или `?key=`):

- `GET /api/account` — баланс Twilio, цена плеча к владельцу, Media Streams, оценка OpenAI, разрешённые страны;
- `GET /api/rates?country=DE` — мобильный/стационарный/входящий: цена минуты и сколько минут хватит;
- `GET /api/quote?number=+49…` — цена для конкретного номера (самый длинный префикс, правило «из ЕЭЗ» важнее «ALL»);
- `GET /api/countries` — список стран Twilio (кэш 6 ч);
- `GET /api/calls` — последние звонки через переводчика (оба плеча склеены: собеседник, время, длительность, цена).

`server.mjs` — копия серверного файла с подключением маршрутов и двумя новыми переменными:
`MEDIA_STREAM_RATE` (по умолчанию 0.0044 $/мин за плечо) и `OPENAI_RATE_PER_MIN` (0.068 $/мин, оба направления).

Минута переведённого звонка на стороне Twilio = плечо к владельцу (0.042, мобильный E-Plus из ЕЭЗ)
+ плечо к собеседнику (DE: 0.0283 стационарный / 0.042 мобильный) + 2 × 0.0044 Media Streams.
Перевод OpenAI списывается с отдельного счёта и в минуты по балансу Twilio не входит.

Деплой: скопировать оба файла в `/opt/bots/dolmetscher/src/src/` и выполнить
`cd /opt/bots/dolmetscher && docker compose build && docker compose up -d`.

## Что iOS не даёт

Системный журнал звонков iPhone приложениям недоступен (CallKit не отдаёт историю), поэтому
вкладка «Последние» показывает звонки, прошедшие через переводчика (из Twilio), а имена к ним
подставляются из контактов на самом телефоне.
