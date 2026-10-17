import type { LandingContent } from "./landing";

// SEO-Landingpages zu KI, Bots und Apps (DE). Preise bewusst ohne Zahlen:
// Umfang hängt stark vom Projekt ab → Festpreis nach Erstgespräch.
// Kleinunternehmer gemäß § 19 UStG – nirgends „netto“ verwenden.

const PRICE_NOTE_KI =
  "Die Einrichtung wird einmalig zum vorher vereinbarten Festpreis abgerechnet. Laufende Kosten für KI-Dienste, Telefonie oder Server fallen je nach Nutzung an und werden transparent nach Verbrauch ausgewiesen – ohne Aufschlag im Kleingedruckten. Gemäß § 19 UStG ohne Umsatzsteuer.";

export const kiTelefonassistentLeverkusen: LandingContent = {
  path: "/ki-telefonassistent-leverkusen",
  eyebrow: "KI-Telefonassistent Leverkusen",
  h1: "KI-Telefonassistent für kleine Unternehmen in Leverkusen",
  lede: "Ein KI-Telefonassistent nimmt Anrufe rund um die Uhr an, beantwortet häufige Fragen, notiert Rückrufwünsche und schickt Ihnen eine Zusammenfassung per E-Mail oder Telegram – für Handwerksbetriebe, Praxen, Kanzleien und Hausverwaltungen.",
  intro: [
    "In kleinen Betrieben klingelt das Telefon immer dann, wenn gerade niemand rangehen kann: auf der Baustelle, während einer Behandlung, im Mandantengespräch oder bei der Wohnungsbesichtigung. Jeder verpasste Anruf ist eine Anfrage, die vielleicht beim nächsten Anbieter landet – und Rückrufe auf Verdacht kosten Zeit.",
    "Ein KI-Telefonassistent schließt diese Lücke. Er meldet sich mit Ihrem Firmennamen, sagt von Anfang an offen, dass hier eine KI spricht, beantwortet Standardfragen zu Öffnungszeiten, Leistungen oder Zuständigkeiten und nimmt Name, Telefonnummer und Anliegen auf. Dringende Fälle – etwa ein Wasserschaden bei einer Hausverwaltung – kann er als „eilig“ markieren und sofort weitermelden. Auf Wunsch spricht er neben Deutsch auch Russisch und Ukrainisch.",
    "Ich betreibe einen solchen Assistenten im Testbetrieb auf einer eigenen Telefonlinie (technisch umgesetzt mit ElevenLabs und Twilio) – ich nutze ihn also selbst. Sie bekommen also keine Theorie aus dem Prospekt, sondern ein Setup, das im eigenen Alltag erprobt ist, inklusive der Fallstricke bei Sprachqualität, Gesprächsführung und Datenschutz.",
  ],
  benefitsTitle: "Was ein KI-Telefonassistent für Ihren Betrieb leistet",
  benefits: [
    {
      title: "Erreichbar, auch wenn Sie es nicht sind",
      text: "Abends, am Wochenende oder während Sie beim Kunden sind: Anrufer erreichen immer jemanden, der zuhört, das Anliegen aufnimmt und einen Rückruf zusagt.",
    },
    {
      title: "Weniger Unterbrechungen im Alltag",
      text: "Wiederkehrende Fragen beantwortet der Assistent selbst. Sie erhalten nur noch eine strukturierte Zusammenfassung und rufen gezielt zurück – statt ständig ans Telefon zu müssen.",
    },
    {
      title: "Transparent und datenschutzbewusst",
      text: "Klarer KI-Hinweis zu Gesprächsbeginn, keine heimliche Aufzeichnung, Auftragsverarbeitungsverträge mit allen Dienstleistern – so, wie es Ihre Anrufer erwarten dürfen.",
    },
  ],
  includedTitle: "Was bei der Einrichtung enthalten ist",
  includedSubtitle: "Vom Gesprächsleitfaden bis zur rechtlichen Einordnung – alles aus einer Hand.",
  included: [
    {
      title: "Gesprächsleitfaden & Wissensbasis",
      text: "Gemeinsam legen wir fest, welche Fragen der Assistent beantworten darf, welche Informationen er abfragt und wann er an Sie übergibt. Grundlage sind Ihre echten Leistungen, Zeiten und Zuständigkeiten.",
    },
    {
      title: "Rufnummer & Weiterleitung",
      text: "Anbindung an eine eigene Rufnummer oder als Weiterleitung, wenn Sie nicht abnehmen, besetzt sind oder außerhalb der Geschäftszeiten – Ihre bestehende Nummer bleibt erhalten.",
    },
    {
      title: "Zusammenfassung per E-Mail oder Telegram",
      text: "Nach jedem Anruf erhalten Sie Name, Rückrufnummer, Anliegen und Dringlichkeit kompakt aufbereitet. Eilige Fälle werden hervorgehoben und sofort zugestellt.",
    },
    {
      title: "KI-Hinweis nach EU AI Act",
      text: "Der Assistent teilt mit dem ersten Satz mit, dass Anrufer mit einer KI sprechen – entsprechend der Transparenzpflicht aus Art. 50 der KI-Verordnung (EU AI Act).",
    },
    {
      title: "Keine Aufzeichnung ohne Einwilligung",
      text: "Gespräche werden standardmäßig nicht aufgezeichnet; gespeichert wird nur die Zusammenfassung. Eine Aufzeichnung ist nur mit ausdrücklicher Einwilligung möglich (§ 201 StGB).",
    },
    {
      title: "AVV & Datenschutzinformation",
      text: "Auftragsverarbeitungsverträge mit allen beteiligten Dienstleistern, eine Liste der Unterauftragsverarbeiter (u. a. Twilio, ElevenLabs) und eine Datenschutzinformation für Anrufer zum Einbinden auf Ihrer Website.",
    },
  ],
  price: {
    label: "KI-Telefonassistent",
    value: "Festpreis",
    suffix: "nach Erstgespräch",
    note: PRICE_NOTE_KI,
  },
  stepsTitle: "So kommt Ihr KI-Telefonassistent ans Telefon",
  steps: [
    {
      title: "Kostenloses Erstgespräch",
      text: "Wir klären, welche Anrufe typisch sind, was der Assistent übernehmen soll und wo die Grenzen liegen – telefonisch, per Video oder vor Ort in Leverkusen.",
    },
    {
      title: "Leitfaden & Festpreis-Angebot",
      text: "Sie erhalten einen Gesprächsleitfaden zum Durchsehen und ein Angebot mit Festpreis für die Einrichtung sowie einer Schätzung der laufenden Kosten.",
    },
    {
      title: "Einrichtung & Testanrufe",
      text: "Ich richte Stimme, Rufnummer und Benachrichtigungen ein. Sie rufen selbst an, testen schwierige Fälle, und wir schärfen nach, bis die Gespräche passen.",
    },
    {
      title: "Livegang & Feinschliff",
      text: "Der Assistent geht live. In den ersten Wochen werten wir die Zusammenfassungen aus und passen Antworten an. Auf Wunsch betreue ich das System dauerhaft.",
    },
  ],
  faqTitle: "Häufige Fragen zum KI-Telefonassistenten",
  faq: [
    {
      question: "Merken Anrufer, dass sie mit einer KI sprechen?",
      answer:
        "Ja, und das ist gewollt. Der Assistent sagt gleich zu Beginn, dass hier eine KI spricht. Das verlangt Art. 50 der KI-Verordnung (EU AI Act), und es schafft Vertrauen: Anrufer wissen, woran sie sind, und können jederzeit um einen Rückruf durch einen Menschen bitten.",
    },
    {
      question: "Werden die Gespräche aufgezeichnet?",
      answer:
        "Standardmäßig nicht. Gespeichert wird nur die schriftliche Zusammenfassung mit den Angaben, die der Anrufer selbst nennt. Das unbefugte Aufnehmen des nichtöffentlich gesprochenen Wortes ist nach § 201 StGB strafbar – eine Aufzeichnung richten wir deshalb nur ein, wenn Anrufer vorher ausdrücklich einwilligen.",
    },
    {
      question: "Ist der Assistent auch für Anwaltskanzleien geeignet?",
      answer:
        "Ja, mit klaren Grenzen. Er nimmt Kontaktdaten und das Anliegen in groben Zügen auf, vergibt Rückruftermine und beantwortet organisatorische Fragen. Rechtliche Auskünfte gibt er ausdrücklich nicht. Die Verschwiegenheitspflicht (§ 203 StGB) berücksichtigen wir bei der Auswahl der Dienstleister, der Gestaltung der Verträge und der Frage, welche Daten überhaupt abgefragt werden.",
    },
    {
      question: "Welche Dienstleister sind beteiligt und wo liegen die Daten?",
      answer:
        "Für Telefonie und Sprachverarbeitung kommen spezialisierte Anbieter wie Twilio und ElevenLabs zum Einsatz. Mit allen beteiligten Diensten werden Auftragsverarbeitungsverträge geschlossen; Sie erhalten eine Liste der Unterauftragsverarbeiter und eine Datenschutzinformation für Anrufer. Die Zusammenfassungen speichere ich, wo möglich, auf Servern in Deutschland.",
    },
    {
      question: "Spricht der Assistent auch andere Sprachen?",
      answer:
        "Ja. Neben Deutsch kann er Gespräche auf Russisch und Ukrainisch führen und erkennt die Sprache des Anrufers. Die Zusammenfassung erhalten Sie trotzdem auf Deutsch. Gerade in Leverkusen und Köln, wo viele Kunden Russisch oder Ukrainisch sprechen, senkt das die Hemmschwelle, überhaupt anzurufen. Weitere Sprachen sind technisch möglich und werden im Erstgespräch besprochen.",
    },
    {
      question: "Was kostet ein KI-Telefonassistent?",
      answer:
        "Die Einrichtung bekommen Sie nach dem Erstgespräch zum Festpreis angeboten. Dazu kommen laufende Kosten für Telefonie und KI-Sprachdienste, die von der Zahl und Länge der Anrufe abhängen. Für die Einschätzung genügt eine grobe Angabe, wie viele Anrufe pro Woche bei Ihnen eingehen. Diese weise ich transparent nach Verbrauch aus, damit Sie jederzeit sehen, wofür Sie bezahlen.",
    },
  ],
  ctaTitle: "Keine Anrufe mehr verpassen?",
  ctaText:
    "Beschreiben Sie kurz, welche Anrufe bei Ihnen typischerweise eingehen. Sie erhalten eine ehrliche Einschätzung, ob sich ein KI-Telefonassistent für Ihren Betrieb lohnt – unverbindlich und kostenlos.",
  relatedTitle: "Passende Leistungen & Projekte",
  related: [
    { label: "Projekt: KI-Telefonassistent im Einsatz", to: "/projekte/ki-telefonassistent" },
    { label: "Projekt: KI-Dolmetscher für Telefonate", to: "/projekte/ki-dolmetscher" },
    { label: "Projekt: Live-Übersetzer", to: "/projekte/live-uebersetzer" },
    { label: "KI-Chatbot für Ihre Website", to: "/chatbot-fuer-unternehmen" },
    {
      label: "KI-Automatisierung für kleine Unternehmen",
      to: "/ki-automatisierung-kleine-unternehmen",
    },
    { label: "Telegram-Bot erstellen lassen", to: "/telegram-bot-erstellen-lassen" },
    { label: "Website für Handwerker", to: "/website-fuer-handwerker-leverkusen" },
    { label: "Website für Anwaltskanzleien", to: "/website-fuer-anwaltskanzlei-leverkusen" },
    { label: "Website für Hausverwaltungen", to: "/website-fuer-hausverwaltung-leverkusen" },
  ],
  breadcrumbName: "KI-Telefonassistent Leverkusen",
  serviceType: "KI-Telefonassistent",
  formTopic: "KI-Telefonassistent",
  seo: {
    title: "KI-Telefonassistent Leverkusen – Anrufe 24/7 | Korolov IT",
    description:
      "KI-Telefonassistent für Handwerker, Praxen, Kanzleien und Hausverwaltungen in Leverkusen: Anrufe 24/7, Rückrufnotiz, Zusammenfassung per E-Mail.",
    keywords:
      "KI-Telefonassistent Leverkusen, KI Telefonassistent kleine Unternehmen, KI Anrufbeantworter, Telefonassistent KI Handwerker, KI Telefonzentrale, Voicebot Leverkusen",
  },
};

export const kiAutomatisierungKleineUnternehmen: LandingContent = {
  path: "/ki-automatisierung-kleine-unternehmen",
  eyebrow: "KI-Automatisierung",
  h1: "KI-Automatisierung für kleine Unternehmen – praktisch statt Hype",
  lede: "E-Mails vorsortieren, PDFs und Rechnungen auslesen, Stunden erfassen, Berichte erstellen: Ich automatisiere wiederkehrende Büroarbeit mit KI – so, dass Sie die Kontrolle behalten und jede Entscheidung selbst freigeben.",
  intro: [
    "Über KI wird viel versprochen. Im Alltag eines kleinen Betriebs zählt etwas anderes: Wie viele Stunden pro Woche gehen für Aufgaben drauf, die sich ständig wiederholen? Posteingang sortieren, Rechnungen abtippen, Kontoauszüge durchsehen, Stundenzettel in Rechnungen übertragen, Monatsberichte zusammenstellen. Genau dort setzt sinnvolle Automatisierung an.",
    "Mein Grundsatz lautet: KI bereitet vor – Sie prüfen und geben frei. Die KI schreibt den Antwortentwurf, aber Sie klicken auf „Senden“. Sie liest die Rechnung aus, aber die Buchung bestätigen Sie. So sparen Sie Zeit, ohne dass ein Programm eigenmächtig mit Kunden, Geld oder vertraulichen Daten hantiert.",
    "Viele dieser Werkzeuge setze ich in meinem eigenen Betrieb ein – etwa einen persönlichen KI-Assistenten mit Zugriff auf Kalender, E-Mail und Dokumente (intern „Jarvis“ genannt) oder einen automatischen Website-Check, der Prüfberichte als PDF erzeugt. Sie profitieren also von Lösungen, die nicht nur in der Demo funktionieren.",
  ],
  benefitsTitle: "Warum KI-Automatisierung mit Korolov IT-Service",
  benefits: [
    {
      title: "Konkreter Nutzen statt Spielerei",
      text: "Wir starten mit einer Aufgabe, die Sie heute nachweislich Zeit kostet, und messen, ob die Automatisierung wirklich entlastet. Erst dann geht es weiter.",
    },
    {
      title: "Sie behalten die Kontrolle",
      text: "Nichts wird ohne Ihre Freigabe verschickt, gebucht oder gelöscht. Jeder Schritt ist nachvollziehbar, und Sie können die Automatisierung jederzeit anhalten.",
    },
    {
      title: "Daten & Kosten im Blick",
      text: "Daten verarbeite ich, wo möglich, auf Servern in Deutschland. Für KI-Schnittstellen setze ich Ausgabelimits, damit die laufenden Kosten planbar bleiben.",
    },
  ],
  includedTitle: "Beispiele aus der Praxis",
  includedSubtitle: "Typische Abläufe, die sich in kleinen Unternehmen automatisieren lassen.",
  included: [
    {
      title: "Posteingang sortieren & Antworten vorbereiten",
      text: "Eingehende E-Mails werden nach Anfrage, Rechnung, Termin oder Werbung sortiert. Für Standardanfragen liegt ein Antwortentwurf bereit, den Sie nur noch prüfen und absenden.",
    },
    {
      title: "PDFs, Rechnungen & Kontoauszüge auslesen",
      text: "Rechnungsbeträge, Fälligkeiten, Lieferanten oder Buchungen aus Kontoauszügen werden automatisch erfasst und in eine Tabelle oder Ihr Buchhaltungsprogramm übertragen.",
    },
    {
      title: "Stunden erfassen & Rechnungsentwürfe",
      text: "Arbeitszeiten werden per Nachricht oder Formular erfasst, Kunden zugeordnet und am Monatsende als Rechnungsentwurf aufbereitet – zum Prüfen, nicht zum Blindversand.",
    },
    {
      title: "Berichte auf Knopfdruck",
      text: "Wiederkehrende Auswertungen – Umsätze, offene Posten, Anfragen pro Monat – entstehen automatisch aus Ihren vorhandenen Daten und landen als PDF oder E-Mail bei Ihnen.",
    },
    {
      title: "Persönlicher KI-Assistent",
      text: "Ein Assistent nach dem Vorbild meines eigenen „Jarvis“: Er kennt Ihren Kalender, Ihre E-Mails und Dokumente, beantwortet Fragen dazu und erinnert an Fristen – mit klar begrenzten Rechten.",
    },
    {
      title: "Automatischer Website-Check",
      text: "Websites werden regelmäßig auf Ladezeit, Erreichbarkeit, SSL, Impressum und technische Fehler geprüft; das Ergebnis kommt als verständlicher PDF-Bericht.",
    },
  ],
  price: {
    label: "KI-Automatisierung",
    value: "Festpreis",
    suffix: "nach Erstgespräch",
    note: PRICE_NOTE_KI,
  },
  stepsTitle: "So gehen wir vor",
  steps: [
    {
      title: "Abläufe aufnehmen",
      text: "Im kostenlosen Erstgespräch schauen wir, welche Aufgaben sich wiederholen, wie viel Zeit sie kosten und welche Daten dabei im Spiel sind.",
    },
    {
      title: "Pilot mit einer Aufgabe",
      text: "Wir wählen den Ablauf mit dem größten Nutzen. Sie erhalten ein Festpreis-Angebot für die Umsetzung und eine Schätzung der laufenden KI-Kosten.",
    },
    {
      title: "Umsetzung & Test mit echten Fällen",
      text: "Ich baue die Automatisierung, wir testen sie mit echten, aber unkritischen Beispielen und justieren nach, bis die Ergebnisse zuverlässig passen.",
    },
    {
      title: "Einführung & Ausbau",
      text: "Nach einer kurzen Einweisung läuft die Lösung im Alltag. Funktioniert sie, kommen weitere Abläufe dazu – Schritt für Schritt, ohne großes Umstellungsprojekt.",
    },
  ],
  faqTitle: "Häufige Fragen zur KI-Automatisierung",
  faq: [
    {
      question: "Lohnt sich KI-Automatisierung auch für sehr kleine Betriebe?",
      answer:
        "Oft gerade dort. Wer keine Bürokraft hat, erledigt Verwaltung nebenbei – abends oder am Wochenende. Schon eine einzelne Automatisierung, etwa für Posteingang oder Rechnungserfassung, kann spürbar entlasten. Im Erstgespräch schätzen wir ehrlich ein, ob sich der Aufwand für Ihren Fall rechnet. Manchmal ist die Antwort auch: Hier genügt eine einfache Regel im Mailprogramm oder eine bessere Vorlage – dann sage ich Ihnen das, statt ein KI-Projekt zu verkaufen.",
    },
    {
      question: "Entscheidet die KI dann selbstständig?",
      answer:
        "Nein. Die KI bereitet vor, Sie prüfen und geben frei. E-Mails werden als Entwurf abgelegt, Rechnungen als Vorschlag erfasst. Automatisch ausgeführt wird nur, was Sie ausdrücklich so festgelegt haben und was kein Risiko birgt – etwa das Sortieren in Ordner.",
    },
    {
      question: "Was passiert mit meinen Daten?",
      answer:
        "Ich verarbeite Daten, wo möglich, auf Servern in Deutschland und wähle KI-Dienste mit Auftragsverarbeitungsvertrag. Wir legen gemeinsam fest, welche Daten überhaupt an einen KI-Dienst gehen dürfen. Besonders sensible Inhalte können ausgeschlossen oder vorher anonymisiert werden.",
    },
    {
      question: "Mit welchen Programmen funktioniert das?",
      answer:
        "Mit vielen gängigen Werkzeugen: E-Mail-Postfächern (z. B. Microsoft 365, Google Workspace, IMAP), Google Sheets und Excel, Cloud-Speichern, Kalendern sowie Programmen mit Schnittstelle. Ob Ihr konkretes System angebunden werden kann, prüfe ich vorab. Wo keine Schnittstelle existiert, finden sich oft Umwege über Export-Dateien oder E-Mail-Weiterleitungen. Bestehende Programme müssen Sie in der Regel nicht wechseln – die Automatisierung ergänzt, was bereits da ist.",
    },
    {
      question: "Wie bleiben die laufenden Kosten im Rahmen?",
      answer:
        "KI-Dienste rechnen nach Verbrauch ab. Ich setze feste Ausgabelimits, wähle für einfache Aufgaben günstige Modelle und weise die Kosten transparent aus. So sehen Sie jeden Monat, was die Automatisierung kostet und was sie an Zeit spart.",
    },
    {
      question: "Was passiert, wenn etwas nicht funktioniert?",
      answer:
        "Jede Automatisierung meldet Fehler, statt sie zu verschlucken. Sie erhalten dann eine Nachricht, und der betroffene Vorgang bleibt liegen, bis er geprüft ist. Auf Wunsch übernehme ich die laufende Betreuung und passe Abläufe an, wenn sich Programme oder Anforderungen ändern. Die Wartung beginnt bei 40 € im Monat.",
    },
  ],
  ctaTitle: "Welche Aufgabe kostet Sie die meiste Zeit?",
  ctaText:
    "Nennen Sie mir einen Ablauf, der Sie regelmäßig aufhält. Sie erhalten eine ehrliche Einschätzung, ob und wie er sich sinnvoll mit KI automatisieren lässt – unverbindlich und kostenlos.",
  relatedTitle: "Passende Leistungen & Projekte",
  related: [
    { label: "Projekt: KI-Assistent Jarvis", to: "/projekte/jarvis" },
    { label: "Projekt: Automatischer Website-Check", to: "/projekte/website-check" },
    { label: "Projekt: Anfrage-Bot", to: "/projekte/anfrage-bot" },
    { label: "Telegram-Bot erstellen lassen", to: "/telegram-bot-erstellen-lassen" },
    { label: "KI-Chatbot für Ihre Website", to: "/chatbot-fuer-unternehmen" },
    { label: "KI-Telefonassistent", to: "/ki-telefonassistent-leverkusen" },
    { label: "App-Entwicklung", to: "/app-entwicklung-leverkusen" },
    { label: "IT-Beratung in Leverkusen", to: "/it-beratung-leverkusen" },
  ],
  breadcrumbName: "KI-Automatisierung",
  serviceType: "KI-Automatisierung",
  formTopic: "KI-Automatisierung",
  seo: {
    title: "KI-Automatisierung für kleine Unternehmen | Korolov IT",
    description:
      "KI-Automatisierung für kleine Unternehmen: E-Mails vorsortieren, Rechnungen auslesen, Berichte erstellen. KI bereitet vor – Sie geben frei. Leverkusen.",
    keywords:
      "KI-Automatisierung kleine Unternehmen, KI im Büro, Prozesse automatisieren KI, KI Rechnungen auslesen, E-Mail Automatisierung KI, KI-Assistent Unternehmen, KI Beratung Leverkusen",
  },
};

export const appEntwicklungLeverkusen: LandingContent = {
  path: "/app-entwicklung-leverkusen",
  eyebrow: "App-Entwicklung Leverkusen",
  h1: "App-Entwicklung in Leverkusen: iOS- und Android-Apps für Unternehmen und Vereine",
  lede: "Native Apps für iPhone und Android – mit eigenem Backend, Push-Benachrichtigungen, Anmeldung über Apple oder Google und Veröffentlichung im App Store. Entwickelt in Leverkusen, mit einem Ansprechpartner von der Idee bis zum Update.",
  intro: [
    "Eine eigene App lohnt sich, wenn Ihre Nutzer regelmäßig etwas tun sollen: Termine buchen, Neuigkeiten erhalten, Daten erfassen, Inhalte abrufen oder einen Dienst im Abo nutzen. Für Unternehmen und Vereine ist die Hürde oft weniger die Idee als die Umsetzung: zwei Plattformen, Server, Datenschutz, App-Store-Regeln.",
    "Ich entwickle Apps nativ – mit SwiftUI für iOS und Kotlin mit Jetpack Compose für Android. Native Apps fühlen sich auf dem jeweiligen Gerät vertraut an, nutzen Funktionen wie Push, Kamera oder Telefonie vollständig und bleiben langfristig gut wartbar. Dazu gehört ein eigenes Backend, zum Beispiel mit FastAPI oder Node.js und einer PostgreSQL-Datenbank.",
    "Wie das in der Praxis aussieht, zeigen eigene Projekte: „Grosch“, eine Budget-App mit KI, die Kontoauszüge deutscher Banken ausliest und per Abo funktioniert – derzeit im Beta-Test über TestFlight –, und eine iOS-App für den KI-Dolmetscher, die Telefonate mit CallKit und VoIP-Push direkt in der App annimmt.",
  ],
  benefitsTitle: "Warum App-Entwicklung mit Korolov IT-Service",
  benefits: [
    {
      title: "Nativ statt Kompromiss",
      text: "SwiftUI und Jetpack Compose sorgen für flüssige Bedienung und vollen Zugriff auf Gerätefunktionen – ohne die Einschränkungen mancher Baukasten-Lösungen.",
    },
    {
      title: "App, Server & Store aus einer Hand",
      text: "Sie bekommen nicht nur die App, sondern auch Backend, Datenbank, Push-Dienst und die Veröffentlichung im App Store und bei Google Play.",
    },
    {
      title: "Aus eigener Erfahrung",
      text: "Abos mit StoreKit, Anmeldung über Apple, VoIP-Push oder TestFlight-Betas kenne ich aus eigenen Apps – inklusive der Prüfprozesse von Apple und Google.",
    },
  ],
  includedTitle: "Was bei der App-Entwicklung enthalten ist",
  includedSubtitle: "Von der ersten Skizze bis zur App im Store – und darüber hinaus.",
  included: [
    {
      title: "iOS-App mit SwiftUI",
      text: "Moderne iPhone- und iPad-App mit nativer Bedienung, Dunkelmodus, Barrierefreiheit-Grundlagen und Unterstützung aktueller iOS-Versionen.",
    },
    {
      title: "Android-App mit Kotlin & Jetpack Compose",
      text: "Die Android-Version mit denselben Funktionen, angepasst an die Bedienlogik von Android – auf Wunsch zuerst eine Plattform, die zweite später.",
    },
    {
      title: "Eigenes Backend & Datenbank",
      text: "Server mit FastAPI oder Node.js und PostgreSQL, gehostet nach Möglichkeit in Deutschland – für Benutzerkonten, Inhalte, Abos und Schnittstellen.",
    },
    {
      title: "Push, Anmeldung & Abos",
      text: "Push-Benachrichtigungen, Anmeldung mit Apple oder Google sowie In-App-Abos über StoreKit und Google Play Billing.",
    },
    {
      title: "TestFlight & Veröffentlichung",
      text: "Beta-Tests mit echten Nutzern über TestFlight, dann Einreichung im App Store und bei Google Play – inklusive Store-Texten, Screenshots und Prüfprozess.",
    },
    {
      title: "Datenschutz in der App",
      text: "Kontolöschung direkt in der App, Einwilligungen nur dort, wo nötig, Datenschutzangaben für die Stores und eine Datenschutzerklärung für die App.",
    },
  ],
  price: {
    label: "App-Entwicklung",
    value: "Festpreis",
    suffix: "nach Erstgespräch",
    note: "Nach dem Erstgespräch erhalten Sie ein Festpreis-Angebot für den vereinbarten Funktionsumfang, auf Wunsch in Etappen (z. B. erst iOS, dann Android). Laufende Kosten für Server, Apple-Entwicklerkonto oder KI-Dienste weise ich transparent nach Verbrauch aus. Gemäß § 19 UStG ohne Umsatzsteuer.",
  },
  stepsTitle: "So entsteht Ihre App",
  steps: [
    {
      title: "Idee & Erstgespräch",
      text: "Wir klären Zielgruppe, Kernfunktionen und Plattformen und trennen, was für die erste Version wirklich nötig ist – kostenlos und unverbindlich.",
    },
    {
      title: "Konzept, Klickentwurf & Angebot",
      text: "Sie erhalten einen Entwurf der wichtigsten Bildschirme und ein Festpreis-Angebot mit klar beschriebenem Umfang.",
    },
    {
      title: "Entwicklung & Beta-Test",
      text: "Ich entwickle App und Backend in Etappen. Über TestFlight probieren Sie und ausgewählte Nutzer frühe Versionen auf dem eigenen Gerät aus.",
    },
    {
      title: "Store-Veröffentlichung & Updates",
      text: "Nach Ihrer Freigabe reiche ich die App bei Apple und Google ein. Danach kümmere ich mich auf Wunsch um Updates und neue Betriebssystem-Versionen.",
    },
  ],
  faqTitle: "Häufige Fragen zur App-Entwicklung",
  faq: [
    {
      question: "Warum native Apps und nicht eine Lösung für beide Plattformen?",
      answer:
        "Plattformübergreifende Frameworks können sinnvoll sein. Native Entwicklung mit SwiftUI und Jetpack Compose bietet aber die beste Integration in das jeweilige System – etwa bei Push, CallKit, Widgets oder Abos – und hängt nicht von einem zusätzlichen Framework ab. Für viele Projekte starten wir mit einer Plattform und ergänzen die zweite später.",
    },
    {
      question: "Wie lange dauert die Entwicklung einer App?",
      answer:
        "Das hängt stark vom Umfang ab. Eine überschaubare erste Version mit wenigen Kernfunktionen ist deutlich schneller fertig als eine App mit Abos, Benutzerverwaltung und vielen Schnittstellen. Hinzu kommt die Prüfung durch Apple und Google, die meist wenige Tage dauert, bei Rückfragen aber auch länger. Einen realistischen Zeitplan mit Zwischenständen erhalten Sie zusammen mit dem Angebot.",
    },
    {
      question: "Übernehmen Sie auch die Veröffentlichung im App Store?",
      answer:
        "Ja. Ich bereite Store-Texte, Screenshots und Datenschutzangaben vor, reiche die App bei Apple und Google ein und begleite den Prüfprozess. Das Entwicklerkonto läuft dabei auf Ihr Unternehmen bzw. Ihren Verein, damit die App Ihnen gehört.",
    },
    {
      question: "Wie wird Datenschutz in der App umgesetzt?",
      answer:
        "Datenschutzorientiert von Anfang an: nur die Daten erheben, die gebraucht werden, Kontolöschung direkt in der App (das verlangen Apple und Google), Einwilligungen für Analyse oder Push nur mit Zustimmung und ein Backend, das nach Möglichkeit in Deutschland läuft.",
    },
    {
      question: "Entwickeln Sie auch Apps für Vereine?",
      answer:
        "Ja. Vereine haben oft ähnliche Anforderungen wie Unternehmen: Termine, Neuigkeiten per Push, Mitgliederbereiche, Anmeldungen. Gerade hier lohnt es sich, den Umfang klar zu begrenzen und mit einer schlanken ersten Version zu starten. Oft zeigt sich erst im Alltag, welche Funktionen die Mitglieder wirklich nutzen – die nächste Ausbaustufe planen wir dann auf Basis dieser Erfahrung.",
    },
    {
      question: "Was passiert nach dem Launch?",
      answer:
        "Apps brauchen Pflege: Jedes Jahr erscheinen neue iOS- und Android-Versionen, Stores ändern ihre Regeln, Nutzer wünschen sich Verbesserungen. Auf Wunsch übernehme ich Updates, Server-Betrieb und Weiterentwicklung – nach Aufwand oder im Rahmen einer laufenden Betreuung. Den Quellcode erhalten Sie in jedem Fall, damit Sie nicht von einer einzelnen Person abhängig sind.",
    },
  ],
  ctaTitle: "Sie haben eine App-Idee?",
  ctaText:
    "Beschreiben Sie kurz, was Ihre App können soll und für wen sie gedacht ist. Sie erhalten eine ehrliche Einschätzung zu Umfang, Plattformen und sinnvollen ersten Schritten – unverbindlich und kostenlos.",
  relatedTitle: "Projekte & passende Leistungen",
  related: [
    { label: "Projekt: Budget-App Grosch", to: "/projekte/grosch" },
    { label: "Projekt: KI-Dolmetscher (iOS-App)", to: "/projekte/ki-dolmetscher" },
    { label: "Projekt: Live-Übersetzer", to: "/projekte/live-uebersetzer" },
    { label: "Telegram-Bot erstellen lassen", to: "/telegram-bot-erstellen-lassen" },
    {
      label: "KI-Automatisierung für kleine Unternehmen",
      to: "/ki-automatisierung-kleine-unternehmen",
    },
    { label: "Webdesign Leverkusen", to: "/webdesign-leverkusen" },
    { label: "IT-Beratung in Leverkusen", to: "/it-beratung-leverkusen" },
  ],
  breadcrumbName: "App-Entwicklung Leverkusen",
  serviceType: "App-Entwicklung",
  formTopic: "App-Entwicklung",
  seo: {
    title: "App-Entwicklung Leverkusen – iOS & Android | Korolov IT",
    description:
      "App-Entwicklung in Leverkusen: native iOS- und Android-Apps mit SwiftUI und Kotlin, eigenem Backend, Push, Abos und App-Store-Veröffentlichung.",
    keywords:
      "App-Entwicklung Leverkusen, App entwickeln lassen, iOS App entwickeln lassen, Android App Entwicklung, App für Verein, SwiftUI Entwickler, App Entwickler NRW",
  },
};

export const telegramBotErstellenLassen: LandingContent = {
  path: "/telegram-bot-erstellen-lassen",
  eyebrow: "Telegram- & WhatsApp-Bots",
  h1: "Telegram-Bot erstellen lassen – für Anfragen, Termine und interne Abläufe",
  lede: "Bots für Telegram und WhatsApp, die Anfragen entgegennehmen, Sprachnachrichten verstehen, Belege erfassen oder Fotos aus dem Team einsammeln – betrieben auf einem eigenen Server in Deutschland.",
  intro: [
    "Ihre Kunden und Mitarbeiter haben Telegram oder WhatsApp ohnehin auf dem Handy. Ein Bot nutzt genau diesen Kanal: Statt ein Formular auszufüllen oder eine App zu installieren, schreibt man einfach eine Nachricht, schickt ein Foto oder spricht eine Sprachnachricht ein – und der Bot kümmert sich um den Rest.",
    "Ich entwickle Bots für konkrete Aufgaben: Anfragen strukturiert aufnehmen, Termine vorbereiten, Belege erfassen, Fotos von der Baustelle sammeln oder interne Abläufe anstoßen. Die Daten landen dort, wo Sie sie brauchen – in Google Sheets, in Ihrem Postfach, in der Cloud oder in Ihrem CRM. Neben Telegram setze ich auf Wunsch auch WhatsApp-Bots über die offizielle WhatsApp Cloud API um.",
    "Eigene Bots laufen bei mir im täglichen Einsatz, darunter ein Anfrage-Bot mit DSGVO-Einwilligung und automatischer Löschung nach 180 Tagen. Kunden, die lieber auf Russisch oder Ukrainisch kommunizieren, betreue ich in ihrer Muttersprache – und auch der Bot kann mehrsprachig antworten.",
  ],
  benefitsTitle: "Warum ein Bot von Korolov IT-Service",
  benefits: [
    {
      title: "Dort, wo Ihre Nutzer schon sind",
      text: "Keine neue App, kein Login: Telegram und WhatsApp sind auf fast jedem Smartphone installiert. Das senkt die Hürde für Kunden und Team.",
    },
    {
      title: "Eigener Server in Deutschland",
      text: "Ihr Bot läuft auf einem eigenen VPS in Deutschland statt auf einer undurchsichtigen Baukasten-Plattform. Sie wissen, wo Ihre Daten liegen.",
    },
    {
      title: "Datenschutz eingebaut",
      text: "Einwilligung vor der ersten Datenerfassung, Löschfristen, die sich automatisch umsetzen, und nur die Daten, die für den Zweck wirklich nötig sind.",
    },
  ],
  includedTitle: "Beispiele für Bots aus der Praxis",
  includedSubtitle: "Vom Kundenkontakt bis zum internen Werkzeug.",
  included: [
    {
      title: "Anfrage-Bot mit Einwilligung",
      text: "Der Bot fragt Name, Anliegen und Rückrufwunsch ab, holt vorher die DSGVO-Einwilligung ein, leitet die Anfrage an Sie weiter und löscht die Daten automatisch nach 180 Tagen.",
    },
    {
      title: "Sprachnachrichten verstehen",
      text: "Sprachnachrichten werden per Spracherkennung (Whisper) in Text umgewandelt und weiterverarbeitet – praktisch für alle, die lieber sprechen als tippen.",
    },
    {
      title: "Ausgaben & Belege erfassen",
      text: "Foto vom Kassenbon schicken, der Bot liest Betrag, Datum und Händler aus und trägt alles in Google Sheets ein – ideal für Ausgaben unterwegs.",
    },
    {
      title: "Fotos & Medien aus dem Team",
      text: "Mitarbeiter schicken Baustellenfotos oder Dokumente an den Bot, der sie geordnet nach Projekt und Datum in Ihrem Cloud-Speicher ablegt.",
    },
    {
      title: "Termine & Erinnerungen",
      text: "Terminwünsche aufnehmen, Bestätigungen verschicken und rechtzeitig erinnern – abgestimmt auf Ihren Kalender und Ihre Abläufe.",
    },
    {
      title: "Anbindung an Sheets, E-Mail & CRM",
      text: "Der Bot schreibt in Google Sheets, verschickt E-Mails, legt Kontakte im CRM an oder stößt andere Automatisierungen an.",
    },
  ],
  price: {
    label: "Telegram- oder WhatsApp-Bot",
    value: "Festpreis",
    suffix: "nach Erstgespräch",
    note: PRICE_NOTE_KI,
  },
  stepsTitle: "So entsteht Ihr Bot",
  steps: [
    {
      title: "Aufgabe klären",
      text: "Im kostenlosen Erstgespräch legen wir fest, was der Bot tun soll, wer ihn nutzt und wohin die Daten fließen – auf Deutsch, Russisch oder Ukrainisch.",
    },
    {
      title: "Ablauf & Festpreis-Angebot",
      text: "Sie erhalten eine kurze Beschreibung des Gesprächsablaufs und ein Angebot mit Festpreis sowie einer Schätzung der laufenden Kosten.",
    },
    {
      title: "Entwicklung & Test",
      text: "Ich entwickle den Bot und stelle ihn Ihnen zum Ausprobieren bereit. Sie testen im echten Messenger, wir passen Texte und Abläufe an.",
    },
    {
      title: "Livegang & Betrieb",
      text: "Der Bot läuft auf einem Server in Deutschland. Auf Wunsch übernehme ich Überwachung, Updates und Erweiterungen – Wartung ab 40 € im Monat.",
    },
  ],
  faqTitle: "Häufige Fragen zu Telegram- und WhatsApp-Bots",
  faq: [
    {
      question: "Telegram oder WhatsApp – was ist besser?",
      answer:
        "Das hängt von Ihren Nutzern ab. Telegram-Bots sind schnell umgesetzt, flexibel und kostenlos im Betrieb. WhatsApp ist in Deutschland weiter verbreitet, erfordert aber ein Unternehmenskonto über die WhatsApp Cloud API und kann je nach Nachrichtenart Gebühren verursachen. Oft ist ein Bot für beide Kanäle sinnvoll: Die Logik im Hintergrund wird einmal entwickelt und an beide Messenger angebunden. Für rein interne Werkzeuge im Team reicht meist Telegram.",
    },
    {
      question: "Wo laufen die Bots und wo liegen die Daten?",
      answer:
        "Ihr Bot läuft auf einem eigenen virtuellen Server in Deutschland. Die Nachrichten selbst werden über die Infrastruktur von Telegram bzw. Meta übermittelt – darauf weise ich in der Datenschutzinformation hin. Gespeichert wird nur, was für den Zweck nötig ist, mit festen Löschfristen.",
    },
    {
      question: "Wie wird der Datenschutz bei einem Anfrage-Bot umgesetzt?",
      answer:
        "Bevor der Bot personenbezogene Daten abfragt, holt er die Einwilligung ein und verlinkt die Datenschutzinformation. Anfragen werden nach einer festgelegten Frist automatisch gelöscht, bei meinem eigenen Anfrage-Bot nach 180 Tagen. Nutzer können ihre Daten jederzeit löschen lassen.",
    },
    {
      question: "Kann der Bot Sprachnachrichten verstehen?",
      answer:
        "Ja. Sprachnachrichten werden mit Spracherkennung (Whisper) in Text umgewandelt. So kann der Bot auch gesprochene Anfragen, Notizen oder Aufträge verarbeiten. Die Erkennung funktioniert auf Deutsch, Russisch, Ukrainisch und vielen weiteren Sprachen.",
    },
    {
      question: "Brauche ich dafür technisches Wissen?",
      answer:
        "Nein. Sie nutzen den Bot wie einen normalen Chat. Einrichtung, Server, Updates und Fehlerbehebung übernehme ich. Sie erhalten eine kurze Einweisung und einen festen Ansprechpartner, falls etwas angepasst werden soll. Neue Fragen, geänderte Texte oder ein zusätzliches Ziel wie ein weiteres Tabellenblatt lassen sich meist ohne großen Aufwand nachrüsten.",
    },
    {
      question: "Was kostet ein Telegram-Bot?",
      answer:
        "Die Entwicklung bekommen Sie nach dem Erstgespräch zum Festpreis angeboten – je nach Umfang vom einfachen Formular-Bot bis zur Anbindung an mehrere Systeme. Laufende Kosten für Server, Spracherkennung oder KI-Dienste weise ich transparent nach Verbrauch aus.",
    },
  ],
  ctaTitle: "Welche Aufgabe soll Ihr Bot übernehmen?",
  ctaText:
    "Beschreiben Sie kurz Ihre Idee – ob Kundenanfragen, Belege oder Fotos aus dem Team. Sie erhalten eine ehrliche Einschätzung und ein klares Angebot. Gern auch auf Russisch oder Ukrainisch.",
  relatedTitle: "Passende Leistungen & Projekte",
  related: [
    { label: "Projekt: Anfrage-Bot", to: "/projekte/anfrage-bot" },
    { label: "Projekt: KI-Assistent Jarvis", to: "/projekte/jarvis" },
    { label: "KI-Chatbot für Ihre Website", to: "/chatbot-fuer-unternehmen" },
    {
      label: "KI-Automatisierung für kleine Unternehmen",
      to: "/ki-automatisierung-kleine-unternehmen",
    },
    { label: "KI-Telefonassistent", to: "/ki-telefonassistent-leverkusen" },
    { label: "App-Entwicklung", to: "/app-entwicklung-leverkusen" },
    { label: "Webdesign Leverkusen", to: "/webdesign-leverkusen" },
    { label: "IT-Beratung in Leverkusen", to: "/it-beratung-leverkusen" },
  ],
  breadcrumbName: "Telegram-Bot erstellen lassen",
  serviceType: "Chatbot-Entwicklung",
  formTopic: "Telegram-/WhatsApp-Bot",
  seo: {
    title: "Telegram-Bot erstellen lassen – auch WhatsApp | Korolov IT",
    description:
      "Telegram- und WhatsApp-Bots für Anfragen, Termine, Belege und Teamabläufe – mit Sprachnachrichten, Google Sheets und eigenem Server in Deutschland.",
    keywords:
      "Telegram-Bot erstellen lassen, Telegram Bot Entwickler, WhatsApp Bot erstellen, WhatsApp Cloud API, Bot für Unternehmen, Chatbot Telegram, Bot Entwicklung Leverkusen",
  },
};

export const chatbotFuerUnternehmen: LandingContent = {
  path: "/chatbot-fuer-unternehmen",
  eyebrow: "KI-Chatbot für Unternehmen",
  h1: "KI-Chatbot für Ihre Website – mit Ihren eigenen Inhalten",
  lede: "Ein KI-Chatbot, der Besucherfragen auf Basis Ihrer eigenen Inhalte beantwortet, klar als KI-Assistent gekennzeichnet ist und Anfragen an Sie übergibt, wenn ein Mensch gefragt ist.",
  intro: [
    "Viele Besucher haben eine konkrete Frage: Bieten Sie das an? Was brauche ich für einen Termin? Wie läuft die Zusammenarbeit ab? Die Antwort steht oft irgendwo auf Ihrer Website – aber kaum jemand sucht sie. Ein gut eingerichteter Chatbot beantwortet solche Fragen sofort, auch abends und am Wochenende – und entlastet Sie von E-Mails, die immer wieder dieselben Punkte betreffen.",
    "Entscheidend ist, woher die Antworten kommen. Ich richte Chatbots so ein, dass sie sich auf Ihre eigene Wissensbasis stützen: Website-Texte, Leistungsbeschreibungen, FAQ, Preislisten oder interne Hinweise, die Sie freigeben. Fragen außerhalb dieses Rahmens beantwortet der Bot nicht auf gut Glück, sondern sagt offen, dass er es nicht weiß, und bietet den Kontakt zu Ihnen an.",
    "Vor der ersten Frage ist der Chat sichtbar als „KI-Assistent“ gekennzeichnet. Besucher wissen also, dass sie mit einer KI schreiben – so verlangt es die Transparenzpflicht der KI-Verordnung (EU AI Act), und so entsteht Vertrauen statt Enttäuschung.",
  ],
  benefitsTitle: "Was ein KI-Chatbot für Ihre Website leistet",
  benefits: [
    {
      title: "Antworten aus Ihren Inhalten",
      text: "Der Chatbot greift auf Ihre freigegebenen Texte und Dokumente zurück, nicht auf allgemeines Internetwissen. So bleiben die Antworten bei Ihren tatsächlichen Leistungen.",
    },
    {
      title: "Übergabe an einen Menschen",
      text: "Will ein Besucher ein Angebot, einen Termin oder hat ein komplexes Anliegen, nimmt der Bot die Kontaktdaten auf und leitet die Anfrage an Sie weiter.",
    },
    {
      title: "Transparent & datenschutzbewusst",
      text: "Klare Kennzeichnung als KI-Assistent, datensparsame Speicherung, Auftragsverarbeitungsverträge mit den eingesetzten Diensten und eine passende Datenschutzinformation.",
    },
  ],
  includedTitle: "Was bei der Einrichtung enthalten ist",
  includedSubtitle: "Vom Wissensstand bis zur Einbindung auf Ihrer Website.",
  included: [
    {
      title: "Aufbau der Wissensbasis",
      text: "Ich bereite Ihre Website-Texte, FAQ, PDFs und weitere freigegebene Inhalte so auf, dass der Chatbot gezielt darauf zugreifen kann.",
    },
    {
      title: "Begrenzung auf Ihre Daten",
      text: "Der Bot wird angewiesen, nur auf Basis Ihrer Inhalte zu antworten. Fehlt eine Information, sagt er das, statt etwas zu erfinden.",
    },
    {
      title: "Kennzeichnung als KI-Assistent",
      text: "Schon vor der ersten Nachricht ist klar sichtbar, dass hier ein KI-Assistent antwortet – mit Hinweis auf die Datenschutzinformation.",
    },
    {
      title: "Anfrage-Übergabe",
      text: "Kontaktwünsche werden mit Einwilligung erfasst und per E-Mail oder Telegram an Sie weitergeleitet – inklusive kurzer Zusammenfassung des Chats.",
    },
    {
      title: "Einbindung in Ihre Website",
      text: "Das Chat-Fenster passt sich Ihrem Design an und funktioniert auf Smartphone und Desktop, ohne die Ladezeit Ihrer Seite spürbar zu belasten.",
    },
    {
      title: "Auswertung & Nachschärfen",
      text: "Sie sehen, welche Fragen gestellt werden – ohne dass Besucher dafür identifiziert werden müssen. Daraus ergänzen wir die Wissensbasis – und erkennen oft auch Lücken auf der Website selbst.",
    },
  ],
  price: {
    label: "KI-Chatbot",
    value: "Festpreis",
    suffix: "nach Erstgespräch",
    note: PRICE_NOTE_KI,
  },
  stepsTitle: "So kommt der Chatbot auf Ihre Website",
  steps: [
    {
      title: "Erstgespräch & Inhalte sichten",
      text: "Wir klären, welche Fragen der Chatbot beantworten soll und welche Inhalte dafür vorhanden sind – kostenlos und unverbindlich.",
    },
    {
      title: "Konzept & Festpreis-Angebot",
      text: "Sie erhalten ein Konzept mit Themen, Grenzen und Übergaberegeln sowie ein Festpreis-Angebot und eine Schätzung der laufenden Kosten.",
    },
    {
      title: "Einrichtung & Testphase",
      text: "Ich baue Wissensbasis und Chat-Fenster auf. Sie stellen dem Bot vorab kritische Fragen, wir schärfen nach, bis die Antworten passen.",
    },
    {
      title: "Livegang & Pflege",
      text: "Der Chatbot geht online. Ändern sich Leistungen oder Preise, wird die Wissensbasis angepasst – auf Wunsch im Rahmen der Wartung ab 40 € im Monat.",
    },
  ],
  faqTitle: "Häufige Fragen zum KI-Chatbot",
  faq: [
    {
      question: "Erfindet der Chatbot keine Antworten?",
      answer:
        "Der Chatbot ist so eingerichtet, dass er nur auf Basis Ihrer freigegebenen Inhalte antwortet und bei fehlenden Informationen offen sagt, dass er es nicht weiß. Ganz ausschließen lassen sich Fehler bei KI-Systemen nie – deshalb testen wir vor dem Livegang gezielt, werten Gespräche aus und verweisen bei verbindlichen Fragen wie Preisen oder Fristen auf den persönlichen Kontakt.",
    },
    {
      question: "Muss der Chatbot als KI gekennzeichnet sein?",
      answer:
        "Ja. Nach Art. 50 der KI-Verordnung (EU AI Act) müssen Menschen erfahren, dass sie mit einem KI-System interagieren. Der Chat ist deshalb schon vor der ersten Frage als „KI-Assistent“ gekennzeichnet.",
    },
    {
      question: "Wie steht es um den Datenschutz?",
      answer:
        "Ich setze auf datensparsame Lösungen: Chats werden nur so lange gespeichert wie nötig, personenbezogene Daten nur mit Einwilligung erfasst. Mit den eingesetzten KI-Diensten werden Auftragsverarbeitungsverträge geschlossen, und Sie erhalten eine passende Ergänzung für Ihre Datenschutzerklärung.",
    },
    {
      question: "Welche Inhalte kann der Chatbot nutzen?",
      answer:
        "Alles, was Sie freigeben: Website-Texte, FAQ, Leistungs- und Preisübersichten, PDFs, Öffnungszeiten oder interne Hinweise für Standardfragen. Vertrauliche Unterlagen gehören nicht in die Wissensbasis eines öffentlichen Chatbots – das klären wir gemeinsam. Für Kanzleien und Hausverwaltungen gilt das besonders: Der Bot beantwortet organisatorische Fragen, gibt aber keine Rechtsauskünfte und keine Auskünfte zu einzelnen Mandaten oder Objekten.",
    },
    {
      question: "Funktioniert der Chatbot auf jeder Website?",
      answer:
        "In den meisten Fällen ja, ob WordPress, ein Baukasten oder eine individuell entwickelte Seite. Das Chat-Fenster wird mit wenigen Zeilen eingebunden und lädt erst, wenn es gebraucht wird. Ob Ihr System Besonderheiten hat, prüfe ich vorab. Auf Wunsch kann derselbe Assistent auch in Telegram oder WhatsApp antworten.",
    },
    {
      question: "Was kostet ein KI-Chatbot?",
      answer:
        "Die Einrichtung erhalten Sie nach dem Erstgespräch zum Festpreis. Laufende Kosten für den KI-Dienst hängen von der Zahl der Gespräche ab und werden transparent nach Verbrauch ausgewiesen. Mit Ausgabelimits bleiben sie planbar, und Sie sehen monatlich, wie viele Gespräche geführt wurden.",
    },
  ],
  ctaTitle: "Soll Ihre Website Fragen selbst beantworten?",
  ctaText:
    "Schildern Sie kurz, welche Fragen Ihre Kunden am häufigsten stellen. Sie erhalten eine ehrliche Einschätzung, ob sich ein KI-Chatbot für Ihre Website lohnt – unverbindlich und kostenlos.",
  relatedTitle: "Passende Leistungen & Projekte",
  related: [
    { label: "Projekt: KI-Assistent Jarvis", to: "/projekte/jarvis" },
    { label: "Projekt: Anfrage-Bot", to: "/projekte/anfrage-bot" },
    { label: "Telegram-Bot erstellen lassen", to: "/telegram-bot-erstellen-lassen" },
    { label: "KI-Telefonassistent", to: "/ki-telefonassistent-leverkusen" },
    {
      label: "KI-Automatisierung für kleine Unternehmen",
      to: "/ki-automatisierung-kleine-unternehmen",
    },
    { label: "Webdesign Leverkusen", to: "/webdesign-leverkusen" },
    { label: "Website für Anwaltskanzleien", to: "/website-fuer-anwaltskanzlei-leverkusen" },
    { label: "Website für Hausverwaltungen", to: "/website-fuer-hausverwaltung-leverkusen" },
    { label: "IT-Beratung in Leverkusen", to: "/it-beratung-leverkusen" },
  ],
  breadcrumbName: "KI-Chatbot für Unternehmen",
  serviceType: "Chatbot-Entwicklung",
  formTopic: "KI-Chatbot für die Website",
  seo: {
    title: "KI-Chatbot für Unternehmen – mit eigenen Inhalten | Korolov IT",
    description:
      "KI-Chatbot für Ihre Website: beantwortet Fragen aus Ihren eigenen Inhalten, klar als KI gekennzeichnet, übergibt Anfragen an Sie. Leverkusen & NRW.",
    keywords:
      "KI-Chatbot für Unternehmen, Chatbot für Website, Chatbot erstellen lassen, KI Chatbot eigene Daten, Website Chatbot DSGVO, Chatbot Leverkusen",
  },
};
