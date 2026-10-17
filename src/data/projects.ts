// Eigene Projekte (KI, Apps, Bots) — Grundlage für die KI-Sektion der Startseite,
// die Übersicht /projekte und die Detailseiten /projekte/<slug>.
// Detailseiten sind (wie alle Landing-Pages) deutschsprachig; Kacheln auf der
// Startseite sind in allen drei Sprachen lokalisiert.
// Alle Screens in den Mockups zeigen erfundene Beispieldaten — keine echten Kundendaten.

import type { Locale } from "@/i18n";

export type Localized = Record<Locale, string>;

export type ProjectCategory = "ki" | "app" | "bot";

export type ProjectVisualKind =
  "jarvis" | "call" | "translate-call" | "subtitles" | "budget" | "bot" | "report";

export type ProjectDetail = {
  seo: { title: string; description: string };
  h1: string;
  lede: string;
  facts: Array<{ label: string; value: string }>;
  featuresTitle: string;
  features: Array<{ title: string; text: string }>;
  sections: Array<{ title: string; paragraphs?: string[]; bullets?: string[] }>;
  comparison?: {
    title: string;
    subtitle?: string;
    columns: string[];
    rows: Array<{ label: string; values: string[] }>;
    note?: string;
  };
  stack: Array<{ layer: string; items: string }>;
  forYou: { title: string; text: string; cta: string; topic: string };
  faq?: Array<{ question: string; answer: string }>;
  related: Array<{ label: string; to: string }>;
};

export type Project = {
  slug: string;
  name: string;
  categories: ProjectCategory[];
  kind: Localized;
  status: Localized;
  tagline: Localized;
  summary: Localized;
  tags: string[];
  visual: ProjectVisualKind;
  detail: ProjectDetail;
};

export const PROJECT_CATEGORY_LABEL: Record<ProjectCategory, Localized> = {
  ki: { de: "KI-Systeme", ru: "ИИ-системы", uk: "ШІ-системи" },
  app: { de: "Apps", ru: "Приложения", uk: "Застосунки" },
  bot: { de: "Bots & Automatisierung", ru: "Боты и автоматизация", uk: "Боти й автоматизація" },
};

const KIND_OWN: Localized = {
  de: "Eigenes Produkt",
  ru: "Собственный продукт",
  uk: "Власний продукт",
};
const KIND_INTERNAL: Localized = {
  de: "Eigener Einsatz",
  ru: "Используется в работе",
  uk: "Використовується в роботі",
};

export const projects: Project[] = [
  {
    slug: "jarvis",
    name: "Jarvis",
    categories: ["ki", "app"],
    kind: {
      de: "Eigenes KI-System",
      ru: "Собственная ИИ-система",
      uk: "Власна ШІ-система",
    },
    status: {
      de: "Täglich im Einsatz",
      ru: "Работает каждый день",
      uk: "Працює щодня",
    },
    tagline: {
      de: "KI-Assistent mit Gedächtnis — für Kalender, E-Mail, Rechnungen und den eigenen Mac.",
      ru: "ИИ-ассистент с памятью: календарь, почта, счета и управление Mac.",
      uk: "ШІ-асистент із пам’яттю: календар, пошта, рахунки та керування Mac.",
    },
    summary: {
      de: "Kein Chatbot von der Stange: ein eigener Assistent auf eigenem Server in Deutschland, der sich erinnert, Werkzeuge bedient und über Telegram, iPhone, Mac und Sprachanruf erreichbar ist.",
      ru: "Не очередной чат-бот, а собственный ассистент на своём сервере в Германии: помнит контекст, работает с инструментами и доступен в Telegram, на iPhone, Mac и голосом.",
      uk: "Не черговий чат-бот, а власний асистент на своєму сервері в Німеччині: пам’ятає контекст, працює з інструментами й доступний у Telegram, на iPhone, Mac і голосом.",
    },
    tags: ["Claude", "pgvector", "Telegram", "SwiftUI", "macOS"],
    visual: "jarvis",
    detail: {
      seo: {
        title: "Jarvis – eigener KI-Assistent mit Gedächtnis | Korolov IT-Service",
        description:
          "Jarvis: KI-Assistent mit Langzeitgedächtnis, Kalender, E-Mail, Stundenerfassung und Rechnungsentwürfen – auf eigenem Server in Deutschland. Projekt aus Leverkusen.",
      },
      h1: "Jarvis: ein KI-Assistent, der sich erinnert und mitarbeitet",
      lede: "Jarvis ist mein eigener KI-Assistent – entwickelt, betrieben und täglich genutzt in meinem Unternehmen. Er kennt Termine, Kunden und Abläufe, bedient echte Werkzeuge und fragt nach, bevor er etwas Wichtiges tut.",
      facts: [
        { label: "Typ", value: "Eigenes KI-System" },
        { label: "Kanäle", value: "Telegram · iPhone · Mac · Sprache" },
        { label: "Betrieb", value: "Eigener Server in Deutschland" },
        { label: "Status", value: "Täglich im Einsatz" },
      ],
      featuresTitle: "Was Jarvis kann",
      features: [
        {
          title: "Langzeitgedächtnis",
          text: "Jarvis merkt sich Fakten, Entscheidungen und Personen aus Gesprächen und findet sie per semantischer Suche wieder – ohne dass man alles neu erklären muss.",
        },
        {
          title: "Kalender, Aufgaben, E-Mail",
          text: "Termine im iCloud-Kalender anlegen, Aufgaben verwalten, Postfach durchsuchen und Antworten vorbereiten – aus einem Gespräch heraus.",
        },
        {
          title: "Stunden & Rechnungsentwürfe",
          text: "Arbeitszeiten pro Kunde erfassen und auf Zuruf einen Rechnungsentwurf als PDF erstellen – zur Prüfung, nicht automatisch versendet.",
        },
        {
          title: "Mac und Browser steuern",
          text: "Auf dem Mac öffnet Jarvis Programme, findet Dateien und erledigt Schritte im Browser. Riskante Aktionen bestätigt der Mensch per Knopfdruck oder Face ID.",
        },
        {
          title: "Sprachanruf & Telefonate im Auftrag",
          text: "Per Sprachanruf aus der App mit Jarvis sprechen – und auf Wunsch ruft er Dritte an, erledigt ein klar umrissenes Anliegen und liefert danach eine Zusammenfassung. Vorher zeigt er, wen er anruft und was er sagt.",
        },
        {
          title: "Kosten unter Kontrolle",
          text: "Jeder KI-Aufruf wird mit Kosten protokolliert, mit Tageslimit und Anzeige auf iPhone und Mac. Einfache Aufgaben laufen über günstigere Modelle.",
        },
      ],
      sections: [
        {
          title: "Was ihn von ChatGPT, Siri & Co. unterscheidet",
          bullets: [
            "Eigene Infrastruktur statt Abo: Gedächtnis und Daten liegen auf einem eigenen Server in Deutschland; die KI-Modelle sind per Schnittstelle angebunden und austauschbar.",
            "Echte Werkzeuge statt nur Text: Kalender, E-Mail, Dateien, Stundenzettel und Rechnungen werden tatsächlich bearbeitet.",
            "Ein Gedächtnis über alle Kanäle: Was im Telegram-Chat besprochen wurde, weiß Jarvis auch im Sprachanruf und auf dem Mac.",
            "Mensch behält die Kontrolle: Senden und Löschen nur per Button, Bezahlen nur per Face ID / Touch ID und mit Limits.",
            "Auf ein Unternehmen zugeschnitten: neue Werkzeuge für eigene Abläufe lassen sich gezielt ergänzen.",
          ],
        },
        {
          title: "Ehrlich gesagt",
          paragraphs: [
            "Große Anbieter haben Vorteile bei Modellqualität, Ökosystem und Support rund um die Uhr. Jarvis nutzt selbst führende Sprachmodelle (Claude) – der Unterschied liegt nicht im Modell, sondern darin, was darum herum gebaut ist: Gedächtnis, Werkzeuge, Kanäle und Kontrolle, passend zu einem konkreten Unternehmen.",
          ],
        },
      ],
      comparison: {
        title: "Jarvis im Vergleich",
        subtitle:
          "Stand: Oktober 2026 – Funktionen für Nutzer in Deutschland laut öffentlich verfügbaren Angaben der Anbieter.",
        columns: ["Jarvis", "ChatGPT", "Siri / Apple Intelligence", "Gemini", "Copilot"],
        rows: [
          {
            label: "Langzeitgedächtnis zu Person und Firma",
            values: ["✓", "✓", "teilweise", "✓", "✓"],
          },
          {
            label: "E-Mail, Kalender und Dateien in einem Assistenten",
            values: ["✓", "teilweise", "teilweise", "teilweise¹", "teilweise¹"],
          },
          {
            label: "Steuerung des eigenen Mac",
            values: ["✓", "teilweise", "teilweise", "–", "–"],
          },
          {
            label: "Telefonate mit Dritten im Auftrag",
            values: ["✓", "–", "–", "–²", "–"],
          },
          {
            label: "Zeiterfassung mit Rechnung als PDF",
            values: ["✓", "–", "–", "–", "–"],
          },
          {
            label: "Daten auf eigenem Server in Deutschland",
            values: ["✓³", "–", "–", "–", "–"],
          },
          {
            label: "Eigene Werkzeuge für die Firma ergänzbar",
            values: ["✓", "teilweise", "–", "teilweise", "teilweise"],
          },
        ],
        note: "¹ Innerhalb des jeweiligen Ökosystems (Google- bzw. Microsoft-Dienste). ² In einzelnen Ländern bietet Google Anrufe bei Unternehmen an. ³ Gedächtnis und Daten auf eigenem Server; die Sprachverarbeitung erfolgt über KI-Anbieter (u. a. Anthropic) per API. Die großen Anbieter bieten dafür u. a. größere Ökosysteme, höhere Verfügbarkeit und schnellere Sprachdialoge. Alle Marken gehören ihren jeweiligen Inhabern.",
      },
      stack: [
        { layer: "Server", items: "Python, aiogram, PostgreSQL + pgvector, Docker, Caddy" },
        { layer: "KI", items: "Claude (Sonnet/Haiku), Whisper, Embeddings, Text-to-Speech" },
        { layer: "Apps", items: "SwiftUI (iPhone), Swift/AppKit (Mac, Menüleiste), Widgets" },
        { layer: "Sprache", items: "ElevenLabs Agents, Twilio für Telefonate im Auftrag" },
        { layer: "Anbindungen", items: "iCloud CalDAV/CardDAV, Gmail, APNs, MCP-Schnittstellen" },
        { layer: "Betrieb", items: "Docker auf eigenem Server in Deutschland, tägliche Backups" },
      ],
      forYou: {
        title: "Ein KI-Assistent nach Maß für Ihr Unternehmen",
        text: "Dieselbe Technik setze ich für Selbstständige und kleine Firmen ein: ein Assistent, der Ihre Termine, Anfragen und Unterlagen kennt, Routinearbeit vorbereitet und Ihnen die Entscheidung lässt – mit transparenten Kosten und Daten in Deutschland, wo immer möglich.",
        cta: "KI-Assistent besprechen",
        topic: "KI-Assistent (Jarvis)",
      },
      faq: [
        {
          question: "Kann ich Jarvis kaufen?",
          answer:
            "Jarvis ist mein persönliches System. Für Ihr Unternehmen baue ich einen eigenen Assistenten auf derselben Grundlage – mit Ihren Werkzeugen, Ihren Abläufen und Ihren Daten.",
        },
        {
          question: "Welche Daten sieht die KI?",
          answer:
            "Nur das, was für eine Aufgabe nötig ist. Welche Systeme angebunden werden, legen wir gemeinsam fest. Gedächtnis und Verlauf liegen auf einem Server in Deutschland; für die Sprachverarbeitung werden KI-Dienste per Schnittstelle genutzt – welche Anbieter und wie die Auftragsverarbeitung geregelt ist, klären wir je Projekt.",
        },
        {
          question: "Was kostet so ein Assistent im Betrieb?",
          answer:
            "Das hängt von Nutzung und Modellwahl ab. Jeder Aufruf wird mit Kosten protokolliert und es gibt Tageslimits – so bleiben die laufenden Kosten planbar.",
        },
        {
          question: "Handelt die KI eigenmächtig?",
          answer:
            "Nein. Lesen und Vorbereiten ja – Senden, Löschen oder Bezahlen nur nach ausdrücklicher Bestätigung per Button bzw. Face ID / Touch ID.",
        },
      ],
      related: [
        {
          label: "KI-Automatisierung für kleine Unternehmen",
          to: "/ki-automatisierung-kleine-unternehmen",
        },
        { label: "KI-Telefonassistent", to: "/ki-telefonassistent-leverkusen" },
        { label: "App-Entwicklung", to: "/app-entwicklung-leverkusen" },
      ],
    },
  },
  {
    slug: "ki-dolmetscher",
    name: "KI-Dolmetscher fürs Telefon",
    categories: ["ki", "app"],
    kind: KIND_OWN,
    status: { de: "In Erprobung", ru: "В тестировании", uk: "У тестуванні" },
    tagline: {
      de: "Telefonate live übersetzen: Russisch ↔ Deutsch, mit eigener iPhone-App.",
      ru: "Перевод телефонных звонков вживую: русский ↔ немецкий, своё приложение для iPhone.",
      uk: "Переклад телефонних дзвінків наживо: російська ↔ німецька, власний застосунок для iPhone.",
    },
    summary: {
      de: "Sie sprechen Russisch, Ihr Gesprächspartner hört Deutsch – und umgekehrt. Mit Warteschleifen-Funktion und Hinweis an das Gegenüber, dass eine KI übersetzt.",
      ru: "Вы говорите по-русски, собеседник слышит немецкий — и наоборот. Умеет ждать на линии за вас и предупреждает собеседника, что переводит ИИ.",
      uk: "Ви говорите російською, співрозмовник чує німецьку — і навпаки. Вміє чекати на лінії за вас і попереджає співрозмовника, що перекладає ШІ.",
    },
    tags: ["Echtzeit-KI", "Twilio", "CallKit", "SwiftUI"],
    visual: "translate-call",
    detail: {
      seo: {
        title: "KI-Dolmetscher fürs Telefon: Russisch ↔ Deutsch live",
        description:
          "Eigenes Projekt aus Leverkusen: Telefonate in Echtzeit übersetzen (Russisch ↔ Deutsch), iPhone-App mit CallKit, Warteschleifen-Funktion, ohne Aufzeichnung.",
      },
      h1: "KI-Dolmetscher: Telefonate live übersetzen – Russisch ↔ Deutsch",
      lede: "Ein Anruf beim Amt, bei der Versicherung oder beim Vermieter – und die Sprache ist die Hürde. Mein KI-Dolmetscher übersetzt das Gespräch in beide Richtungen in Echtzeit, direkt aus einer eigenen iPhone-App.",
      facts: [
        { label: "Typ", value: "Eigenes Produkt" },
        { label: "Sprachen", value: "Russisch ↔ Deutsch" },
        { label: "Plattform", value: "iPhone-App + Server" },
        { label: "Status", value: "In Erprobung" },
      ],
      featuresTitle: "Was der Dolmetscher kann",
      features: [
        {
          title: "Übersetzung in beide Richtungen",
          text: "Sie sprechen Russisch, das Gegenüber hört Deutsch – seine Antwort hören Sie auf Russisch. Mit wenigen Sekunden Verzögerung.",
        },
        {
          title: "Transparent für das Gegenüber",
          text: "Zu Beginn erfährt der Gesprächspartner kurz, dass eine KI übersetzt. Danach signalisiert ein Ton, dass gesprochen werden kann.",
        },
        {
          title: "Wartet in der Warteschleife",
          text: "Die App hält die Leitung und ruft Sie, sobald ein Mensch abnimmt – keine halbe Stunde mehr mit Wartemusik.",
        },
        {
          title: "Tippen statt sprechen",
          text: "Sätze und Schnellphrasen eintippen – sie werden übersetzt und dem Gesprächspartner vorgelesen (in Erprobung).",
        },
        {
          title: "Eingehende Anrufe in der App",
          text: "Dank CallKit und VoIP-Push klingeln auch eingehende Anrufe direkt in der App – wie ein normales Telefonat.",
        },
        {
          title: "Keine Aufzeichnung",
          text: "Audio und Text des Gesprächs werden nicht gespeichert. Kosten werden vor dem Anruf angezeigt; Sonder- und Auslandsnummern sind gesperrt.",
        },
      ],
      sections: [
        {
          title: "Wichtig zu wissen",
          bullets: [
            "Der KI-Dolmetscher ersetzt keine vereidigte Übersetzung – für Gericht, Behördentermine mit Urkunden oder medizinische Aufklärung ist er nicht gedacht.",
            "Maschinelle Übersetzung kann Fehler machen; bei wichtigen Details lohnt sich eine Rückfrage im Gespräch.",
            "Das Projekt ist ein eigenes Produkt in der Erprobung und wird derzeit nicht als Dienstleistung verkauft.",
          ],
        },
      ],
      stack: [
        { layer: "Telefonie", items: "Twilio Voice & Media Streams, zwei Gesprächsleitungen" },
        { layer: "KI", items: "Echtzeit-Sprach-zu-Sprach-Übersetzung, Text-to-Speech" },
        { layer: "Server", items: "Node.js, WebSockets, Docker auf eigenem Server" },
        { layer: "iPhone", items: "SwiftUI, Twilio Voice SDK, CallKit, PushKit, Keychain" },
      ],
      forYou: {
        title: "Echtzeit-Sprach-KI für Ihr Unternehmen",
        text: "Die Technik dahinter – Telefonie, Sprach-KI in Echtzeit und eine native iPhone-App – setze ich auch für eigene Anwendungsfälle ein: mehrsprachige Hotlines, Telefonassistenten oder interne Werkzeuge.",
        cta: "Projekt besprechen",
        topic: "Sprach-KI / Telefonie",
      },
      faq: [
        {
          question: "Kann ich den Dolmetscher schon nutzen?",
          answer:
            "Er befindet sich in der Erprobung. Wenn Sie Interesse haben, schreiben Sie mir – ich melde mich, sobald ein Test für weitere Nutzer möglich ist.",
        },
        {
          question: "Weiß mein Gesprächspartner, dass eine KI übersetzt?",
          answer:
            "Ja. Zu Beginn wird er kurz informiert. Das ist fair, und nach dem EU AI Act müssen Menschen erfahren, wenn sie mit einer KI sprechen.",
        },
      ],
      related: [
        { label: "KI-Telefonassistent", to: "/ki-telefonassistent-leverkusen" },
        { label: "App-Entwicklung", to: "/app-entwicklung-leverkusen" },
        { label: "Live-Übersetzer für Veranstaltungen", to: "/projekte/live-uebersetzer" },
      ],
    },
  },
  {
    slug: "live-uebersetzer",
    name: "Live-Übersetzer für Veranstaltungen",
    categories: ["ki"],
    kind: KIND_OWN,
    status: { de: "Im Praxistest", ru: "Тест в зале", uk: "Тест у залі" },
    tagline: {
      de: "Vorträge simultan übersetzt – als Untertitel und Stimme auf dem eigenen Handy.",
      ru: "Синхронный перевод выступлений — субтитры и голос на телефоне слушателя.",
      uk: "Синхронний переклад виступів — субтитри та голос на телефоні слухача.",
    },
    summary: {
      de: "Zuhörer öffnen einen Link, wählen ihre Sprache und lesen oder hören die Übersetzung mit 1,5–3 Sekunden Verzögerung – ohne Dolmetscherkabine.",
      ru: "Слушатели открывают ссылку, выбирают язык и читают или слушают перевод с задержкой 1,5–3 секунды — без кабины переводчика.",
      uk: "Слухачі відкривають посилання, обирають мову й читають або слухають переклад із затримкою 1,5–3 секунди — без кабіни перекладача.",
    },
    tags: ["Speech-to-Text", "Realtime", "WebSockets", "TTS"],
    visual: "subtitles",
    detail: {
      seo: {
        title: "Live-Übersetzer für Veranstaltungen – Untertitel aufs Handy",
        description:
          "KI-Simultanübersetzung Russisch ↔ Deutsch für Gottesdienste, Vereine und Veranstaltungen: Untertitel und Sprachausgabe auf dem Smartphone der Zuhörer.",
      },
      h1: "Live-Übersetzer: Vorträge simultan übersetzt – direkt aufs Handy",
      lede: "Bei mehrsprachigen Veranstaltungen versteht oft nur ein Teil des Publikums den Redner. Mein Live-Übersetzer bringt die Übersetzung als Untertitel und Stimme auf das Smartphone jedes Zuhörers.",
      facts: [
        { label: "Typ", value: "Eigenes Produkt" },
        { label: "Sprachen", value: "Russisch ↔ Deutsch" },
        { label: "Verzögerung", value: "ca. 1,5–3 Sekunden" },
        { label: "Status", value: "Im Praxistest" },
      ],
      featuresTitle: "So funktioniert es",
      features: [
        {
          title: "Link öffnen, Sprache wählen",
          text: "Keine App-Installation: Zuhörer scannen einen QR-Code, wählen Russisch oder Deutsch und sind dabei.",
        },
        {
          title: "Untertitel und Stimme",
          text: "Die Übersetzung erscheint als fortlaufender Text und kann zusätzlich vorgelesen werden – auch mit gesperrtem iPhone-Bildschirm.",
        },
        {
          title: "Ton vom Mikrofon oder Stream",
          text: "Das Audio kommt direkt vom Mikrofon am Laptop oder aus einem bestehenden Livestream des Saals.",
        },
        {
          title: "Saubere Sätze statt Wortfetzen",
          text: "Abgerissene Satzteile werden zusammengeführt, einzelne Füllwörter nicht isoliert übersetzt – das liest sich ruhiger.",
        },
        {
          title: "Geringe Betriebskosten",
          text: "Eine dreistündige Veranstaltung kostet an KI-Gebühren nur wenige Euro.",
        },
        {
          title: "Keine Aufzeichnung",
          text: "Audio wird nur zur Übersetzung verarbeitet und nicht gespeichert.",
        },
      ],
      sections: [
        {
          title: "Für wen das interessant ist",
          bullets: [
            "Gemeinden und Vereine mit russisch- und deutschsprachigen Mitgliedern",
            "Infoabende, Schulungen und Versammlungen mit gemischtem Publikum",
            "Veranstalter, für die eine Dolmetscherkabine zu aufwendig ist",
          ],
        },
      ],
      stack: [
        { layer: "Spracherkennung", items: "Streaming-Speech-to-Text mit Sprechpausen-Erkennung" },
        { layer: "Übersetzung", items: "Sprachmodell mit Kontext der letzten Sätze" },
        { layer: "Ausgabe", items: "WebSockets, Web Audio, Text-to-Speech" },
        { layer: "Betrieb", items: "Node.js auf eigenem Server, ffmpeg für Stream-Eingang" },
      ],
      forYou: {
        title: "Mehrsprachige Veranstaltung geplant?",
        text: "Wenn Ihr Verein, Ihre Gemeinde oder Ihr Unternehmen Veranstaltungen mit gemischtem Publikum hat, sprechen wir gerne über einen Test.",
        cta: "Test anfragen",
        topic: "Live-Übersetzer",
      },
      related: [
        { label: "KI-Dolmetscher fürs Telefon", to: "/projekte/ki-dolmetscher" },
        { label: "KI-Automatisierung", to: "/ki-automatisierung-kleine-unternehmen" },
      ],
    },
  },
  {
    slug: "ki-telefonassistent",
    name: "KI-Telefonassistent",
    categories: ["ki"],
    kind: KIND_INTERNAL,
    status: {
      de: "Testbetrieb in der eigenen Firma",
      ru: "Тест в своей фирме",
      uk: "Тест у власній фірмі",
    },
    tagline: {
      de: "Nimmt Anrufe an, wenn niemand kann – auf Deutsch, Russisch und Ukrainisch.",
      ru: "Принимает звонки, когда никто не может, — на немецком, русском и украинском.",
      uk: "Приймає дзвінки, коли ніхто не може, — німецькою, російською та українською.",
    },
    summary: {
      de: "Beantwortet Fragen zu Leistungen und Preisen, nimmt Rückrufwünsche auf, schätzt die Dringlichkeit ein und schickt eine Zusammenfassung.",
      ru: "Отвечает на вопросы об услугах и ценах, записывает обратный звонок, оценивает срочность и присылает сводку.",
      uk: "Відповідає на питання про послуги й ціни, записує зворотний дзвінок, оцінює терміновість і надсилає підсумок.",
    },
    tags: ["Voice-KI", "ElevenLabs", "Twilio", "Webhook"],
    visual: "call",
    detail: {
      seo: {
        title: "KI-Telefonassistent – Praxisbeispiel aus Leverkusen",
        description:
          "Wie ein KI-Telefonassistent Anrufe annimmt, Fragen beantwortet und Rückrufe notiert – eingerichtet für die eigene Firma. DE, RU, UK. Mit KI-Hinweis und ohne Aufzeichnung.",
      },
      h1: "KI-Telefonassistent: kein Anruf geht mehr verloren",
      lede: "Wer allein arbeitet, kann nicht immer ans Telefon gehen. Mein KI-Telefonassistent übernimmt dann: Er stellt sich als KI vor, beantwortet häufige Fragen und notiert, wer worum zurückgerufen werden möchte.",
      facts: [
        { label: "Typ", value: "Eigener Einsatz" },
        { label: "Sprachen", value: "Deutsch · Russisch · Ukrainisch" },
        { label: "Aufzeichnung", value: "Keine Audiospeicherung" },
        { label: "Status", value: "Testbetrieb" },
      ],
      featuresTitle: "Was der Assistent übernimmt",
      features: [
        {
          title: "Stellt sich als KI vor",
          text: "Gleich im ersten Satz erfährt der Anrufer, dass er mit einem KI-Assistenten spricht – so verlangt es der EU AI Act.",
        },
        {
          title: "Beantwortet häufige Fragen",
          text: "Leistungen, Preise, Ablauf, Erreichbarkeit – auf Basis einer Wissensdatenbank, die aus den Inhalten der Website gepflegt wird.",
        },
        {
          title: "Nimmt Rückrufwünsche auf",
          text: "Name, Telefonnummer, Anliegen und gewünschter Zeitraum werden strukturiert erfasst.",
        },
        {
          title: "Erkennt Dringendes",
          text: "Der Assistent schätzt ein, ob ein Anliegen eilig ist, und markiert es in der Zusammenfassung entsprechend.",
        },
        {
          title: "Spricht die Sprache des Anrufers",
          text: "Deutsch, Russisch oder Ukrainisch – je nachdem, wie der Anrufer beginnt.",
        },
        {
          title: "Zusammenfassung sofort",
          text: "Nach dem Anruf kommt die Zusammenfassung per Webhook an – z. B. als E-Mail oder Telegram-Nachricht.",
        },
      ],
      sections: [
        {
          title: "Datenschutz und Grenzen",
          bullets: [
            "Keine Speicherung der Audioaufnahme; verarbeitet wird nur, was für den Rückruf nötig ist.",
            "Auftragsverarbeitungsverträge mit den eingesetzten Diensten (Telefonie und Sprach-KI).",
            "Der Assistent gibt keine rechtliche, medizinische oder steuerliche Beratung – er nimmt Anliegen auf und leitet sie weiter.",
          ],
        },
      ],
      stack: [
        { layer: "Sprach-KI", items: "ElevenLabs Agents (Sprachmodell + Stimme)" },
        { layer: "Telefonie", items: "Twilio, deutsche Rufnummer" },
        { layer: "Wissen", items: "Wissensdatenbank aus den Website-Inhalten, DE/RU/UK" },
        { layer: "Auswertung", items: "Webhook (Vercel), Zusammenfassung per E-Mail" },
      ],
      forYou: {
        title: "Ihr eigener KI-Telefonassistent",
        text: "Für Handwerksbetriebe, Praxen, Kanzleien und Hausverwaltungen richte ich einen Assistenten mit Ihrem Wissen, Ihren Öffnungszeiten und Ihren Regeln ein – inklusive Datenschutzhinweis für Anrufer.",
        cta: "KI-Telefonassistent anfragen",
        topic: "KI-Telefonassistent",
      },
      related: [
        { label: "KI-Telefonassistent für Ihr Unternehmen", to: "/ki-telefonassistent-leverkusen" },
        { label: "KI-Chatbot für die Website", to: "/chatbot-fuer-unternehmen" },
      ],
    },
  },
  {
    slug: "grosch",
    name: "Grosch",
    categories: ["app", "ki"],
    kind: KIND_OWN,
    status: {
      de: "Beta-Test (TestFlight)",
      ru: "Бета-тест (TestFlight)",
      uk: "Бета-тест (TestFlight)",
    },
    tagline: {
      de: "iPhone-App fürs Haushaltsbudget: Kontoauszüge rein, Überblick raus – mit KI-Assistent.",
      ru: "Приложение для iPhone для бюджета: загрузил выписку — получил обзор, с ИИ-помощником.",
      uk: "Застосунок для iPhone для бюджету: завантажив виписку — отримав огляд, з ШІ-помічником.",
    },
    summary: {
      de: "Liest Kontoauszüge deutscher Banken, sortiert Ausgaben automatisch und beantwortet Fragen zu den eigenen Finanzen. Budget zu zweit, Ende-zu-Ende-verschlüsselt.",
      ru: "Читает выписки немецких банков, сам раскладывает траты по категориям и отвечает на вопросы о финансах. Общий бюджет на двоих со сквозным шифрованием.",
      uk: "Читає виписки німецьких банків, сам розкладає витрати за категоріями й відповідає на питання про фінанси. Спільний бюджет на двох із наскрізним шифруванням.",
    },
    tags: ["SwiftUI", "SwiftData", "FastAPI", "Claude"],
    visual: "budget",
    detail: {
      seo: {
        title: "Grosch – iPhone-App für das Haushaltsbudget mit KI",
        description:
          "Eigene iOS-App aus Leverkusen: Kontoauszüge deutscher Banken automatisch auswerten, Budget zu zweit, KI-Assistent. SwiftUI und eigener Server in Deutschland.",
      },
      h1: "Grosch: Haushaltsbudget mit KI – als native iPhone-App",
      lede: "Grosch ist meine eigene iPhone-App für das Haushaltsbudget. Sie liest Kontoauszüge, sortiert jede Ausgabe ein und beantwortet Fragen wie „Wie viel haben wir im September für Lebensmittel ausgegeben?“.",
      facts: [
        { label: "Typ", value: "Eigenes Produkt" },
        { label: "Plattform", value: "iPhone (iOS 18+)" },
        { label: "Sprachen", value: "Deutsch · Russisch · Ukrainisch" },
        { label: "Status", value: "Beta-Test über TestFlight" },
      ],
      featuresTitle: "Was die App kann",
      features: [
        {
          title: "Kontoauszüge deutscher Banken",
          text: "PDF-Auszüge sowie CSV- und CAMT-Dateien u. a. von Sparkasse, N26, DKB, ING, Volksbank, Commerzbank, comdirect und Revolut – mit Prüfung, dass der Saldo auf den Cent stimmt.",
        },
        {
          title: "Automatische Kategorien",
          text: "Jede Buchung landet in der passenden Kategorie; Diagramme zeigen, wohin das Geld fließt.",
        },
        {
          title: "KI-Assistent",
          text: "Fragen zu den eigenen Ausgaben in normaler Sprache stellen. Die KI läuft über einen eigenen Server mit Nutzungslimits pro Person.",
        },
        {
          title: "Budget zu zweit",
          text: "Ein gemeinsames Budget auf zwei iPhones – Ende-zu-Ende-verschlüsselt, der Server sieht nur verschlüsselte Daten. Einladung per Link.",
        },
        {
          title: "Schnell erfasst",
          text: "Ausgaben per Sprache eintragen, Widget auf dem Home-Bildschirm, Siri-Kurzbefehle und Schutz per Face ID.",
        },
        {
          title: "Kosten für KI im Griff",
          text: "Die KI läuft über einen eigenen Server mit monatlichem Kontingent pro Person – Schlüssel liegen nie auf dem Telefon.",
        },
      ],
      sections: [
        {
          title: "Was das Projekt zeigt",
          bullets: [
            "Eine native iOS-App vom ersten Entwurf bis zur Einreichung bei Apple",
            "Eigenes Backend mit Benutzerkonten, Sign in with Apple und Nutzungskontingenten",
            "Sicherer Umgang mit sensiblen Daten: Schlüssel nur auf dem Server, nicht im Telefon",
            "Über 40 automatisierte Tests für Server und Auszugs-Parser",
          ],
        },
      ],
      stack: [
        { layer: "App", items: "Swift 6, SwiftUI, SwiftData, WidgetKit, Siri-Kurzbefehle" },
        { layer: "Server", items: "Python, FastAPI, SQLite, Docker, Caddy" },
        { layer: "KI", items: "Claude API über eigenen Proxy mit Kostenlimits" },
        { layer: "Sicherheit", items: "Sign in with Apple, AES-GCM, Face ID" },
      ],
      forYou: {
        title: "Ihre eigene App – von der Idee bis zum App Store",
        text: "Ob Kunden-App, internes Werkzeug oder App für Ihren Verein: Ich entwickle native iPhone- und Android-Apps mit eigenem Server, Login und Push-Nachrichten – bis zur Einreichung im App Store.",
        cta: "App-Projekt besprechen",
        topic: "App-Entwicklung",
      },
      related: [
        { label: "App-Entwicklung in Leverkusen", to: "/app-entwicklung-leverkusen" },
        { label: "KI-Automatisierung", to: "/ki-automatisierung-kleine-unternehmen" },
      ],
    },
  },
  {
    slug: "website-check",
    name: "Automatischer Website-Check",
    categories: ["ki", "bot"],
    kind: KIND_INTERNAL,
    status: { de: "Eigenes Werkzeug", ru: "Свой инструмент", uk: "Власний інструмент" },
    tagline: {
      de: "Prüft Tempo, SEO, Impressum, Datenschutz und E-Mail-Sicherheit – Ergebnis als PDF.",
      ru: "Проверяет скорость, SEO, Impressum, Datenschutz и безопасность почты — отчёт в PDF.",
      uk: "Перевіряє швидкість, SEO, Impressum, Datenschutz і безпеку пошти — звіт у PDF.",
    },
    summary: {
      de: "Ein eigenes Analyse-Werkzeug, das Websites kleiner Unternehmen technisch durchleuchtet und einen verständlichen Bericht mit konkreten Empfehlungen erstellt.",
      ru: "Собственный инструмент анализа: проверяет сайты малого бизнеса и готовит понятный отчёт с конкретными рекомендациями.",
      uk: "Власний інструмент аналізу: перевіряє сайти малого бізнесу й готує зрозумілий звіт із конкретними рекомендаціями.",
    },
    tags: ["Python", "Playwright", "PageSpeed", "PDF"],
    visual: "report",
    detail: {
      seo: {
        title: "Website-Check: Tempo, SEO & Datenschutz als PDF-Bericht",
        description:
          "Automatischer Website-Check aus Leverkusen: Ladezeit, SEO, Impressum, Datenschutz, E-Mail-Sicherheit (SPF/DMARC) und Google-Profil – verständlicher PDF-Bericht.",
      },
      h1: "Website-Check: was Ihre Website Kunden kostet – schwarz auf weiß",
      lede: "Ich habe ein eigenes Werkzeug entwickelt, das Websites kleiner Unternehmen automatisch prüft. Heraus kommt ein verständlicher PDF-Bericht: was gut ist, was fehlt und was sich mit wenig Aufwand verbessern lässt.",
      facts: [
        { label: "Typ", value: "Eigenes Werkzeug" },
        { label: "Ergebnis", value: "PDF-Bericht, Deutsch" },
        { label: "Prüfbereiche", value: "Tempo · SEO · Recht · E-Mail" },
        { label: "Prüfung", value: "Jeder Bericht wird von mir gesichtet" },
      ],
      featuresTitle: "Was geprüft wird",
      features: [
        {
          title: "Ladezeit & Mobilansicht",
          text: "Messwerte von Google PageSpeed für Smartphone und Desktop, verständlich eingeordnet.",
        },
        {
          title: "SEO-Grundlagen",
          text: "Seitentitel, Beschreibungen, Überschriften, strukturierte Daten und Sitemap.",
        },
        {
          title: "Impressum & Datenschutz",
          text: "Technische Hinweise auf fehlende Pflichtseiten, externe Schriftarten oder Tracking ohne Einwilligung – keine Rechtsberatung.",
        },
        {
          title: "E-Mail-Sicherheit",
          text: "Sind SPF und DMARC gesetzt? Ohne sie landen Ihre E-Mails schneller im Spam.",
        },
        {
          title: "Google-Unternehmensprofil",
          text: "Bewertungen, Kategorien und Vollständigkeit im Vergleich zu Mitbewerbern vor Ort.",
        },
        {
          title: "Konkrete Empfehlungen",
          text: "Priorisiert nach Wirkung und Aufwand – damit klar ist, was sich zuerst lohnt.",
        },
      ],
      sections: [
        {
          title: "Fair und datensparsam",
          paragraphs: [
            "Das Werkzeug prüft nur öffentlich sichtbare Informationen. Es versendet nichts automatisch – jeder Bericht wird von mir persönlich durchgesehen, bevor er Sie erreicht.",
          ],
        },
      ],
      stack: [
        { layer: "Analyse", items: "Python, Playwright, BeautifulSoup, PageSpeed Insights API" },
        { layer: "Netz", items: "DNS-over-HTTPS (SPF/DMARC), Google Places API" },
        { layer: "Bericht", items: "KI-gestützte Texte, Jinja2, WeasyPrint (PDF)" },
      ],
      forYou: {
        title: "Website-Check für Ihr Unternehmen",
        text: "Schicken Sie mir die Adresse Ihrer Website – Sie erhalten den Bericht als PDF und eine kurze Einschätzung, was sich wirklich lohnt. Unverbindlich.",
        cta: "Website-Check anfragen",
        topic: "Website-Check",
      },
      related: [
        { label: "Webdesign Leverkusen", to: "/webdesign-leverkusen" },
        { label: "Website-Wartung", to: "/website-wartung-leverkusen" },
        { label: "KI-Automatisierung", to: "/ki-automatisierung-kleine-unternehmen" },
      ],
    },
  },
  {
    slug: "anfrage-bot",
    name: "Anfrage-Bot für Telegram & WhatsApp",
    categories: ["bot"],
    kind: KIND_INTERNAL,
    status: { de: "Im Einsatz", ru: "В работе", uk: "У роботі" },
    tagline: {
      de: "Nimmt Anfragen im Messenger entgegen – mit Einwilligung, Löschfrist und Meldung per E-Mail.",
      ru: "Принимает заявки в мессенджере — с согласием, сроком удаления и уведомлением на почту.",
      uk: "Приймає заявки в месенджері — зі згодою, строком видалення та сповіщенням на пошту.",
    },
    summary: {
      de: "Ein Bot, der Interessenten durch einen kurzen Fragebogen führt (Deutsch oder Russisch) und die Anfrage sauber an das Postfach übergibt.",
      ru: "Бот проводит клиента по короткой анкете (на немецком или русском) и аккуратно передаёт заявку на почту.",
      uk: "Бот проводить клієнта короткою анкетою (німецькою або російською) й акуратно передає заявку на пошту.",
    },
    tags: ["aiogram", "WhatsApp Cloud API", "SQLite", "DSGVO"],
    visual: "bot",
    detail: {
      seo: {
        title: "Anfrage-Bot für Telegram & WhatsApp – Praxisbeispiel",
        description:
          "Messenger-Bot für Kundenanfragen: Fragebogen auf Deutsch und Russisch, DSGVO-Einwilligung, automatische Löschung nach 180 Tagen, Meldung per E-Mail und Telegram.",
      },
      h1: "Anfrage-Bot: Kundenanfragen direkt im Messenger",
      lede: "Viele Kunden schreiben lieber eine Nachricht, als ein Formular auszufüllen. Mein Anfrage-Bot nimmt Anfragen in Telegram und WhatsApp entgegen – strukturiert, mit Einwilligung und automatischer Löschfrist.",
      facts: [
        { label: "Typ", value: "Eigener Einsatz" },
        { label: "Kanäle", value: "Telegram · WhatsApp" },
        { label: "Sprachen", value: "Deutsch · Russisch" },
        { label: "Löschfrist", value: "automatisch nach 180 Tagen" },
      ],
      featuresTitle: "Was der Bot kann",
      features: [
        {
          title: "Geführter Fragebogen",
          text: "Branche, Wunsch, Kontaktdaten – Schritt für Schritt mit Antwort-Buttons statt langer Formulare.",
        },
        {
          title: "Einwilligung mit Version",
          text: "Die Datenschutz-Einwilligung wird mit der jeweiligen Textversion gespeichert.",
        },
        {
          title: "Daten auf Knopfdruck löschen",
          text: "Mit einem Befehl löschen Nutzer ihre Daten selbst; ältere Anfragen werden automatisch entfernt.",
        },
        {
          title: "Meldung an das Team",
          text: "Jede neue Anfrage kommt per E-Mail und zusätzlich als Telegram-Nachricht an – mit erneutem Versuch, falls der Versand scheitert.",
        },
        {
          title: "Schutz vor Spam",
          text: "Ratenbegrenzung pro Nutzer verhindert, dass der Bot mit Anfragen überflutet wird.",
        },
        {
          title: "Eigener Server",
          text: "Läuft auf einem Server in Deutschland, nicht in einer fremden Baukasten-Plattform.",
        },
      ],
      sections: [],
      stack: [
        { layer: "Bot", items: "Python, aiogram 3, WhatsApp Cloud API" },
        { layer: "Daten", items: "SQLite mit automatischer Löschung" },
        { layer: "Versand", items: "E-Mail-API mit Wiederholungen, Telegram-Benachrichtigung" },
        { layer: "Betrieb", items: "Docker auf eigenem Server in Deutschland" },
      ],
      forYou: {
        title: "Ein Bot für Ihre Anfragen, Termine oder Abläufe",
        text: "Ob Terminanfragen, Schadensmeldungen, Bestellungen oder interne Abläufe im Team: Ich baue Telegram- und WhatsApp-Bots, die zu Ihren Prozessen passen.",
        cta: "Bot-Projekt besprechen",
        topic: "Telegram-/WhatsApp-Bot",
      },
      related: [
        { label: "Telegram-Bot erstellen lassen", to: "/telegram-bot-erstellen-lassen" },
        { label: "KI-Chatbot für Unternehmen", to: "/chatbot-fuer-unternehmen" },
      ],
    },
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
