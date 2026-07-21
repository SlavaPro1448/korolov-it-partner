export type LandingContent = {
  path: string;
  eyebrow: string;
  h1: string;
  lede: string;
  intro: string[];
  benefitsTitle: string;
  benefits: Array<{ title: string; text: string }>;
  includedTitle: string;
  includedSubtitle: string;
  included: Array<{ title: string; text: string }>;
  price: { label: string; value: string; suffix: string; note: string };
  stepsTitle: string;
  steps: Array<{ title: string; text: string }>;
  faqTitle: string;
  faq: Array<{ question: string; answer: string }>;
  ctaTitle: string;
  ctaText: string;
  relatedTitle: string;
  related: Array<{ label: string; to: string }>;
  breadcrumbName: string;
  serviceType: string;
  // Anliegen-Wert für die kompakte Anfrage-Form (geht in den Betreff der Kontakt-E-Mail).
  formTopic: string;
  seo: { title: string; description: string; keywords: string };
};

export const webdesignLeverkusen: LandingContent = {
  path: "/webdesign-leverkusen",
  eyebrow: "Webdesign Leverkusen",
  h1: "Webdesign in Leverkusen: eine Website, die Kundenanfragen bringt",
  lede: "Professionelle Website für Selbstständige, Handwerker und kleine Unternehmen — modern, schnell, mobil optimiert und DSGVO-orientiert umgesetzt. Zum Festpreis, mit persönlichem Ansprechpartner vor Ort.",
  intro: [
    "Viele Unternehmenswebsites in Leverkusen und Umgebung sind technisch veraltet, laden langsam oder sind auf dem Smartphone kaum bedienbar. Potenzielle Kunden springen ab, bevor sie Ihre Leistungen überhaupt gesehen haben.",
    "Ich erstelle Websites, die das Gegenteil leisten: klare Struktur, schnelle Ladezeit, funktionierendes Kontaktformular und eine saubere technische Basis — inklusive Domain, SSL und geschäftlicher E-Mail. Ohne Agentur-Overhead, mit direktem Draht zu der Person, die Ihre Website tatsächlich baut.",
  ],
  benefitsTitle: "Warum Webdesign von Korolov IT-Service",
  benefits: [
    {
      title: "Nachweisbar schnell",
      text: "Diese Website erreicht 96–100 von 100 Punkten im Google-Lighthouse-Test — dieselbe Technik bekommen auch Ihre Projekte. Schnelle Seiten ranken besser und konvertieren mehr Besucher.",
    },
    {
      title: "Festpreis ohne Überraschungen",
      text: "Sie erhalten vor Projektstart ein klares Angebot mit Leistungsumfang und Preis. Keine versteckten Kosten, keine laufenden Pflichtgebühren.",
    },
    {
      title: "Persönlich & vor Ort",
      text: "Ein Ansprechpartner für alles: Design, Technik, Domain, E-Mail. Aus Leverkusen, erreichbar auch nach dem Launch — auf Deutsch, Russisch oder Ukrainisch.",
    },
  ],
  includedTitle: "Was bei einer Website enthalten ist",
  includedSubtitle: "Vom ersten Entwurf bis zum Livegang — alles aus einer Hand.",
  included: [
    {
      title: "Responsives Design",
      text: "Ihre Website funktioniert auf Smartphone, Tablet und Desktop gleichermaßen — dort, wo Ihre Kunden tatsächlich suchen.",
    },
    {
      title: "SEO-Grundlagen",
      text: "Saubere Seitenstruktur, Meta-Tags, Sitemap und strukturierte Daten, damit Google Ihre Seite versteht und lokal anzeigt.",
    },
    {
      title: "Kontaktformular & E-Mail",
      text: "Ein geprüftes Kontaktformular mit Spam-Schutz sowie geschäftliche E-Mail-Adressen auf Ihrer eigenen Domain.",
    },
    {
      title: "SSL & Hosting-Einrichtung",
      text: "Verschlüsselte Verbindung, zuverlässiges Hosting in Deutschland und korrekte Domain-Anbindung — komplett eingerichtet.",
    },
    {
      title: "Impressum & Datenschutz",
      text: "Impressums- und Datenschutzseiten werden technisch sauber eingebunden; Cookie-Banner nur dort, wo er wirklich nötig ist.",
    },
    {
      title: "Einweisung & Übergabe",
      text: "Nach dem Launch erhalten Sie eine verständliche Einweisung. Auf Wunsch übernehme ich die laufende Pflege.",
    },
  ],
  price: {
    label: "Website-Erstellung",
    value: "ab 890 €",
    suffix: "netto, einmalig",
    note: "1–3 Seiten inklusive Design, Kontaktformular, SSL und Basis-SEO. Größere Projekte mit individueller Struktur ab 1.500 € — Details unter Pakete & Preise.",
  },
  stepsTitle: "So entsteht Ihre Website",
  steps: [
    {
      title: "Kostenloses Erstgespräch",
      text: "Wir klären Ziel, Zielgruppe und Umfang — telefonisch, per Video oder vor Ort in Leverkusen.",
    },
    {
      title: "Konzept & Angebot",
      text: "Sie erhalten einen Strukturvorschlag und ein Festpreis-Angebot mit klarem Leistungsumfang.",
    },
    {
      title: "Design & Umsetzung",
      text: "Ich baue die Website, stimme Zwischenstände mit Ihnen ab und kümmere mich um Texteinbindung, Bilder und Technik.",
    },
    {
      title: "Launch & Betreuung",
      text: "Nach Freigabe geht die Seite live — inklusive Einweisung. Auf Wunsch folgt die monatliche Wartung.",
    },
  ],
  faqTitle: "Häufige Fragen zum Webdesign",
  faq: [
    {
      question: "Was kostet eine Website in Leverkusen?",
      answer:
        "Eine kompakte Unternehmenswebsite mit 1–3 Seiten beginnt bei 890 € netto, größere Auftritte mit individueller Seitenstruktur bei 1.500 € netto. Nach dem kostenlosen Erstgespräch erhalten Sie ein verbindliches Festpreis-Angebot.",
    },
    {
      question: "Wie lange dauert die Erstellung?",
      answer:
        "Eine einfache Website ist je nach Inhalt und Abstimmung meist innerhalb weniger Tage bis zwei Wochen online. Den genauen Zeitrahmen besprechen wir vor Projektstart.",
    },
    {
      question: "Kümmern Sie sich auch um Domain, Hosting und E-Mail?",
      answer:
        "Ja. Domain, Hosting in Deutschland, SSL-Zertifikat und geschäftliche E-Mail-Adressen richte ich komplett ein — Sie müssen sich um nichts Technisches kümmern.",
    },
    {
      question: "Ist die Website DSGVO-konform?",
      answer:
        "Die technische Umsetzung erfolgt DSGVO-orientiert: SSL, datensparsame Formulare, Impressums- und Datenschutzseiten sowie Cookie-Banner nur bei Bedarf. Rechtliche Inhalte können über spezialisierte Generatoren oder juristische Beratung ergänzt werden.",
    },
    {
      question: "Kann ich die Website später erweitern lassen?",
      answer:
        "Ja. Neue Seiten, zusätzliche Leistungen oder Änderungen setze ich auch nach dem Launch um — punktuell nach Aufwand oder im Rahmen der monatlichen Betreuung ab 79 €.",
    },
  ],
  ctaTitle: "Website-Projekt in Leverkusen starten?",
  ctaText:
    "Schildern Sie kurz Ihr Vorhaben — Sie erhalten eine ehrliche Einschätzung und ein klares Angebot. Unverbindlich und kostenlos.",
  relatedTitle: "Passende Leistungen",
  related: [
    { label: "Website-Wartung & Pflege", to: "/website-wartung-leverkusen" },
    { label: "IT-Support für kleine Unternehmen", to: "/it-support-leverkusen" },
    { label: "IT-Service in Leverkusen", to: "/it-service-leverkusen" },
  ],
  breadcrumbName: "Webdesign Leverkusen",
  serviceType: "Webdesign",
  formTopic: "Webdesign Leverkusen",
  seo: {
    title: "Webdesign Leverkusen – Website erstellen lassen ab 890 € | Korolov IT-Service",
    description:
      "Website erstellen lassen in Leverkusen: modern, schnell, mobil optimiert, DSGVO-orientiert. Festpreis ab 890 €, persönlicher Ansprechpartner, Beratung auf Deutsch, Russisch & Ukrainisch.",
    keywords:
      "Webdesign Leverkusen, Website erstellen lassen Leverkusen, Homepage erstellen Leverkusen, Webdesigner Leverkusen, Website für kleine Unternehmen",
  },
};

export const itSupportLeverkusen: LandingContent = {
  path: "/it-support-leverkusen",
  eyebrow: "IT-Support Leverkusen",
  h1: "IT-Support in Leverkusen für kleine Unternehmen",
  lede: "Computer, Netzwerk, E-Mail, Drucker, Cloud und Datensicherung — praktische Hilfe für Betriebe ohne eigene IT-Abteilung. Remote oder vor Ort, verständlich erklärt.",
  intro: [
    "Wenn die Technik streikt, steht in kleinen Unternehmen schnell der ganze Betrieb still: E-Mails kommen nicht an, der Drucker verweigert den Dienst, wichtige Dateien sind plötzlich unauffindbar. Große Systemhäuser rechnen sich für solche Betriebe selten — und der „IT-erfahrene Bekannte“ ist im entscheidenden Moment nicht erreichbar.",
    "Genau diese Lücke fülle ich: als fester technischer Ansprechpartner für kleine Unternehmen, Kanzleien, Praxen und Selbstständige in Leverkusen, Köln und Umgebung. Kein Ticket-System, keine Warteschleife — sondern jemand, der Ihr Setup kennt und Probleme löst, bevor sie teuer werden.",
  ],
  benefitsTitle: "Warum IT-Support von Korolov IT-Service",
  benefits: [
    {
      title: "Ein fester Ansprechpartner",
      text: "Sie sprechen immer mit derselben Person, die Ihre Systeme kennt — nicht mit einer anonymen Hotline. Das spart bei jedem Vorfall Erklärzeit.",
    },
    {
      title: "Remote & vor Ort in Leverkusen",
      text: "Vieles lässt sich per Fernwartung in Minuten lösen. Wenn nicht, bin ich schnell bei Ihnen — Leverkusen, Köln und NRW.",
    },
    {
      title: "Verständlich statt Fachchinesisch",
      text: "Sie erfahren in klaren Worten, was das Problem war und was dagegen getan wurde — auf Deutsch, Russisch oder Ukrainisch.",
    },
  ],
  includedTitle: "Typische Aufgaben im IT-Support",
  includedSubtitle: "Vom Einzelfall bis zur laufenden Betreuung.",
  included: [
    {
      title: "Computer & Arbeitsplätze",
      text: "Einrichtung, Fehlerbehebung und Beschleunigung von PCs und Laptops unter Windows und macOS.",
    },
    {
      title: "E-Mail & Kommunikation",
      text: "Geschäftliche Postfächer, Signaturen, Weiterleitungen, Spam-Probleme sowie SPF, DKIM und DMARC für zuverlässige Zustellung.",
    },
    {
      title: "Netzwerk & WLAN",
      text: "Router, WLAN-Abdeckung, Netzwerkdrucker und sichere Verbindungen im Büro — stabil eingerichtet.",
    },
    {
      title: "Datensicherung & Cloud",
      text: "Automatische Backups, Cloud-Speicher und geordnete Dateiablage, damit nichts verloren geht.",
    },
    {
      title: "Sicherheit & Updates",
      text: "Systemupdates, Virenschutz und grundlegende Absicherung der Arbeitsplätze gegen die häufigsten Risiken.",
    },
    {
      title: "Beratung bei Anschaffungen",
      text: "Ehrliche Empfehlung, welche Hardware oder Software sich für Ihren Betrieb wirklich lohnt — herstellerunabhängig.",
    },
  ],
  price: {
    label: "IT-Support",
    value: "nach Aufwand",
    suffix: "oder monatliche Betreuung ab 79 €",
    note: "Einzelne Einsätze werden transparent nach Aufwand abgerechnet. Für laufende Betreuung mit Updates, Backups und Prioritäts-Erreichbarkeit gibt es monatliche Pakete ab 79 € netto.",
  },
  stepsTitle: "So funktioniert die Zusammenarbeit",
  steps: [
    {
      title: "Kostenloses Erstgespräch",
      text: "Wir besprechen Ihre aktuelle IT-Situation: was läuft, was stört, was fehlt.",
    },
    {
      title: "Bestandsaufnahme",
      text: "Ich verschaffe mir einen Überblick über Geräte, Konten und kritische Abläufe — vor Ort oder remote.",
    },
    {
      title: "Klare Empfehlung",
      text: "Sie erhalten eine priorisierte Liste: was dringend ist, was warten kann und was es kostet.",
    },
    {
      title: "Umsetzung & Erreichbarkeit",
      text: "Ich setze die vereinbarten Punkte um und bleibe als fester Ansprechpartner erreichbar.",
    },
  ],
  faqTitle: "Häufige Fragen zum IT-Support",
  faq: [
    {
      question: "Für welche Unternehmensgröße lohnt sich der Support?",
      answer:
        "Mein Fokus sind Betriebe mit 1 bis etwa 15 Arbeitsplätzen ohne eigene IT-Abteilung: Selbstständige, Handwerksbetriebe, Kanzleien, Praxen, Hausverwaltungen und Büros in Leverkusen und Umgebung.",
    },
    {
      question: "Helfen Sie auch einmalig, ohne Vertrag?",
      answer:
        "Ja. Einzelne Einsätze — etwa ein E-Mail-Problem, ein neuer Arbeitsplatz oder eine Datenrettung — sind ohne laufenden Vertrag möglich und werden nach Aufwand abgerechnet.",
    },
    {
      question: "Wie schnell sind Sie erreichbar?",
      answer:
        "Kurzfristige Anfragen beantworte ich in der Regel am selben Werktag. Für Kunden mit monatlicher Betreuung gelten individuell vereinbarte Reaktionszeiten.",
    },
    {
      question: "Arbeiten Sie remote oder vor Ort?",
      answer:
        "Beides. Viele Probleme lassen sich per Fernwartung schnell lösen; für Netzwerk, Hardware und Einrichtungen komme ich zu Ihnen nach Leverkusen, Köln oder ins Umland.",
    },
    {
      question: "Können Sie auch unsere Website mitbetreuen?",
      answer:
        "Ja — Website, Domain, Hosting und E-Mail aus einer Hand ist sogar der Regelfall. So gibt es bei technischen Fragen keine Zuständigkeitslücken zwischen verschiedenen Dienstleistern.",
    },
  ],
  ctaTitle: "IT-Problem oder kein fester Ansprechpartner?",
  ctaText:
    "Beschreiben Sie kurz Ihre Situation — Sie erhalten eine ehrliche Einschätzung, was sinnvoll ist und was es kostet. Unverbindlich und kostenlos.",
  relatedTitle: "Passende Leistungen",
  related: [
    { label: "IT-Betreuung für kleine Unternehmen", to: "/it-betreuung-kleine-unternehmen" },
    { label: "Website-Wartung & Pflege", to: "/website-wartung-leverkusen" },
    { label: "IT-Service in Leverkusen", to: "/it-service-leverkusen" },
  ],
  breadcrumbName: "IT-Support Leverkusen",
  serviceType: "IT-Support",
  formTopic: "IT-Support Leverkusen",
  seo: {
    title: "IT-Support Leverkusen für kleine Unternehmen | Korolov IT-Service",
    description:
      "IT-Support in Leverkusen: Hilfe bei Computern, Netzwerk, E-Mail, Backups und Cloud für kleine Unternehmen ohne eigene IT. Remote oder vor Ort, fester Ansprechpartner, Beratung auf Deutsch, Russisch & Ukrainisch.",
    keywords:
      "IT-Support Leverkusen, IT-Hilfe Leverkusen, Computer Hilfe Leverkusen, EDV Support Leverkusen, IT-Notfall kleine Unternehmen",
  },
};

export const websiteWartungLeverkusen: LandingContent = {
  path: "/website-wartung-leverkusen",
  eyebrow: "Website-Wartung & Pflege",
  h1: "Website-Wartung: damit Ihre Seite sicher, aktuell und erreichbar bleibt",
  lede: "Updates, Backups, technische Prüfung und kleine Änderungen — laufende Betreuung ab 79 € im Monat. Für Unternehmen in Leverkusen, Köln und ganz NRW.",
  intro: [
    "Eine Website ist kein einmaliges Projekt. Ohne regelmäßige Updates entstehen Sicherheitslücken, Formulare gehen unbemerkt kaputt, Inhalte veralten — und im schlimmsten Fall ist die Seite tagelang offline, ohne dass es jemand merkt.",
    "Mit der laufenden Wartung übernehme ich genau diese Verantwortung: Ihre Website wird regelmäßig geprüft, gesichert und aktualisiert. Kleine Änderungen — neue Öffnungszeiten, ein zusätzliches Teammitglied, aktualisierte Preise — sind schnell umgesetzt, ohne dass Sie einen neuen Dienstleister suchen müssen.",
  ],
  benefitsTitle: "Warum laufende Wartung sinnvoll ist",
  benefits: [
    {
      title: "Ausfälle früh erkennen",
      text: "Regelmäßige technische Prüfung von Erreichbarkeit, SSL-Zertifikat und Kontaktformular — Probleme fallen auf, bevor Kunden sie bemerken.",
    },
    {
      title: "Backups, auf die Verlass ist",
      text: "Automatische Sicherungen Ihrer Website und Daten. Falls etwas schiefgeht, ist der letzte funktionierende Stand schnell wiederhergestellt.",
    },
    {
      title: "Änderungen ohne Umwege",
      text: "Neue Inhalte, Preise oder Fotos schicken Sie einfach per E-Mail oder WhatsApp — ich baue sie zeitnah ein.",
    },
  ],
  includedTitle: "Das umfasst die monatliche Betreuung",
  includedSubtitle: "Umfang und Reaktionszeiten werden individuell vereinbart.",
  included: [
    {
      title: "Software- & Sicherheitsupdates",
      text: "System, Komponenten und Abhängigkeiten werden aktuell gehalten — die wichtigste Maßnahme gegen gehackte Websites.",
    },
    {
      title: "Regelmäßige Backups",
      text: "Automatische Sicherungen mit geprüfter Wiederherstellbarkeit, damit kein Inhalt verloren geht.",
    },
    {
      title: "Funktionsprüfung",
      text: "Kontaktformular, Links, Ladezeit und mobile Darstellung werden regelmäßig kontrolliert.",
    },
    {
      title: "Kleine Änderungen",
      text: "Texte, Bilder, Öffnungszeiten oder neue Leistungen — kurze Anpassungen sind im Paket enthalten.",
    },
    {
      title: "Monitoring & SSL",
      text: "Erreichbarkeit und Zertifikatslaufzeiten im Blick, damit „Website down“ nicht erst der Kunde meldet.",
    },
    {
      title: "Technischer Ansprechpartner",
      text: "Bei Fragen zu Domain, E-Mail oder Hosting gibt es eine feste Anlaufstelle — mich.",
    },
  ],
  price: {
    label: "Monatliche Betreuung",
    value: "ab 79 €",
    suffix: "netto / Monat",
    note: "Auch für Websites, die nicht von mir erstellt wurden — nach einer kurzen technischen Bestandsaufnahme. Monatlich, fair und ohne lange Vertragsbindung.",
  },
  stepsTitle: "So starten wir",
  steps: [
    {
      title: "Bestandsaufnahme",
      text: "Ich prüfe den technischen Zustand Ihrer Website: Software-Stand, Backups, Sicherheit, Ladezeit.",
    },
    {
      title: "Ersteinrichtung",
      text: "Fehlende Grundlagen — Backups, Updates, Monitoring — werden einmalig sauber aufgesetzt.",
    },
    {
      title: "Laufende Betreuung",
      text: "Ab dann läuft die Wartung im Hintergrund; über Wichtiges werden Sie proaktiv informiert.",
    },
    {
      title: "Änderungen bei Bedarf",
      text: "Neue Inhalte oder kleine Erweiterungen melden Sie formlos — sie werden zeitnah umgesetzt.",
    },
  ],
  faqTitle: "Häufige Fragen zur Website-Wartung",
  faq: [
    {
      question: "Betreuen Sie auch Websites, die jemand anderes erstellt hat?",
      answer:
        "Ja. Nach einer kurzen technischen Bestandsaufnahme übernehme ich auch bestehende Websites — unabhängig davon, wer sie ursprünglich gebaut hat.",
    },
    {
      question: "Was passiert, wenn meine Website gehackt wurde oder offline ist?",
      answer:
        "Dann geht es zuerst um schnelle Wiederherstellung aus dem Backup und das Schließen der Lücke. Solche Notfälle übernehme ich auch für Neukunden — melden Sie sich einfach direkt.",
    },
    {
      question: "Wie viele Änderungen sind im Monatspaket enthalten?",
      answer:
        "Kleine Anpassungen wie Texte, Bilder oder Öffnungszeiten sind enthalten; der genaue Umfang wird individuell vereinbart. Größere Erweiterungen biete ich vorab transparent als Festpreis an.",
    },
    {
      question: "Gibt es eine Mindestvertragslaufzeit?",
      answer:
        "Nein, die Betreuung läuft monatlich und ist fair kündbar. Ich möchte, dass Sie wegen der Qualität bleiben — nicht wegen einer Vertragsklausel.",
    },
  ],
  ctaTitle: "Website abgeben, Kopf frei haben?",
  ctaText:
    "Schicken Sie mir den Link zu Ihrer Website — Sie erhalten eine kurze technische Einschätzung und ein passendes Wartungsangebot. Unverbindlich und kostenlos.",
  relatedTitle: "Passende Leistungen",
  related: [
    { label: "Webdesign in Leverkusen", to: "/webdesign-leverkusen" },
    { label: "IT-Wartungsvertrag", to: "/wartungsvertrag-it" },
    { label: "IT-Support für kleine Unternehmen", to: "/it-support-leverkusen" },
  ],
  breadcrumbName: "Website-Wartung",
  serviceType: "Website-Wartung",
  formTopic: "Website-Wartung & Pflege",
  seo: {
    title: "Website-Wartung & Pflege ab 79 €/Monat | Korolov IT-Service Leverkusen",
    description:
      "Website-Wartung in Leverkusen: Updates, Backups, Monitoring und kleine Änderungen ab 79 €/Monat. Auch für bestehende Websites — mit festem technischen Ansprechpartner.",
    keywords:
      "Website Wartung Leverkusen, Website Pflege, Homepage Wartung, Website Betreuung, Website Updates Backups",
  },
};

export const itServiceLeverkusen: LandingContent = {
  path: "/it-service-leverkusen",
  eyebrow: "IT-Service Leverkusen",
  h1: "IT-Service in Leverkusen: ein Ansprechpartner für Ihre gesamte IT",
  lede: "Website, E-Mail, Computer, Netzwerk und Datensicherung — alle IT-Leistungen für kleine Unternehmen aus einer Hand. Persönlich, verständlich und ohne Callcenter, in Leverkusen und Umgebung.",
  intro: [
    "In vielen kleinen Unternehmen ist die IT über Jahre gewachsen — und mit ihr die Zuständigkeiten: Die Website hat eine Agentur gebaut, die es nicht mehr gibt, die E-Mail läuft über einen Anbieter, dessen Zugangsdaten niemand findet, und wenn der Rechner streikt, hilft der Bekannte, der gerade Zeit hat. Solange alles funktioniert, fällt das nicht auf. Sobald etwas ausfällt, kostet die Suche nach dem Zuständigen mehr Zeit als die eigentliche Lösung.",
    "Als IT-Service für Leverkusen und Umgebung übernehme ich genau diese Verantwortung: eine Person, die Ihre gesamte IT kennt — von der Website über E-Mail und Arbeitsplätze bis zur Datensicherung. Sie rufen an, ich kümmere mich. Ohne Ticketsystem, ohne Warteschleife und ohne Fachchinesisch.",
  ],
  benefitsTitle: "Warum Korolov IT-Service",
  benefits: [
    {
      title: "Alles aus einer Hand",
      text: "Website, E-Mail, Computer, Netzwerk, Backups — keine Zuständigkeitslücken zwischen mehreren Dienstleistern, keine doppelten Wege bei Problemen.",
    },
    {
      title: "Persönlich statt Callcenter",
      text: "Sie sprechen immer direkt mit der Person, die Ihre IT betreut und Ihre Systeme kennt. Das spart Erklärzeit und verhindert Missverständnisse.",
    },
    {
      title: "Lokal in Leverkusen",
      text: "Kurze Wege in Leverkusen, Köln und dem Umland: Vieles löse ich per Fernwartung, für alles andere bin ich schnell vor Ort.",
    },
  ],
  includedTitle: "Leistungen im Überblick",
  includedSubtitle: "Sechs Bereiche — je nach Bedarf einzeln oder kombiniert.",
  included: [
    {
      title: "IT-Support bei Problemen",
      text: "Schnelle Hilfe, wenn Computer, E-Mail, Drucker oder Netzwerk nicht funktionieren — remote oder vor Ort, auch ohne Vertrag.",
    },
    {
      title: "Laufende IT-Betreuung",
      text: "Monatliche Betreuung mit Updates, Backups und Prioritäts-Erreichbarkeit — für Betriebe, die ihre IT dauerhaft in guten Händen wissen wollen.",
    },
    {
      title: "IT-Beratung",
      text: "Unabhängige Empfehlungen vor Anschaffungen und Umstellungen: Hardware, Software, Cloud und IT-Sicherheit — ohne Verkaufsinteresse.",
    },
    {
      title: "Webdesign & Websites",
      text: "Moderne, schnelle Unternehmenswebsites zum Festpreis — inklusive Domain, SSL, Kontaktformular und geschäftlicher E-Mail.",
    },
    {
      title: "IT-Wartungsvertrag",
      text: "Planbare IT-Kosten mit festen Reaktionszeiten: Updates, Monitoring und Datensicherung vertraglich geregelt, monatlich kündbar.",
    },
    {
      title: "Website-Wartung & Pflege",
      text: "Updates, Backups, Monitoring und kleine Änderungen für bestehende Websites — damit Ihre Seite sicher und erreichbar bleibt.",
    },
  ],
  price: {
    label: "Was kostet der IT-Service?",
    value: "Festpreis nach Erstgespräch",
    suffix: "einmalig oder monatlich",
    note: "Einzelne Einsätze rechne ich transparent nach Aufwand ab, laufende Betreuung gibt es ab 79 € netto im Monat, Websites ab 890 € netto zum Festpreis. Nach dem kostenlosen Erstgespräch erhalten Sie ein klares Angebot ohne versteckte Kosten.",
  },
  stepsTitle: "So starten wir",
  steps: [
    {
      title: "Kostenloses Erstgespräch",
      text: "Sie schildern, wo es hakt oder was Sie planen — telefonisch, per Video oder vor Ort in Leverkusen.",
    },
    {
      title: "Überblick verschaffen",
      text: "Ich sehe mir Ihre bestehende IT an: Website, E-Mail, Geräte, Datensicherung und Zugänge.",
    },
    {
      title: "Angebot mit Prioritäten",
      text: "Sie erhalten einen verständlichen Vorschlag: was dringend ist, was warten kann und was es jeweils kostet.",
    },
    {
      title: "Umsetzung & fester Kontakt",
      text: "Ich setze die vereinbarten Punkte um — und bleibe danach Ihr direkter Ansprechpartner für alles Weitere.",
    },
  ],
  faqTitle: "Häufige Fragen zum IT-Service",
  faq: [
    {
      question: "Welche Orte decken Sie ab?",
      answer:
        "Mein Einzugsgebiet umfasst Leverkusen, Köln, Leichlingen, Burscheid, Bergisch Gladbach, Monheim am Rhein und Langenfeld. Per Fernwartung betreue ich Kunden auch darüber hinaus in ganz Nordrhein-Westfalen.",
    },
    {
      question: "Was unterscheidet IT-Support, IT-Betreuung und IT-Beratung?",
      answer:
        "IT-Support ist die schnelle Hilfe im Einzelfall, wenn etwas nicht funktioniert. IT-Betreuung ist die laufende monatliche Versorgung Ihrer IT mit Updates, Backups und fester Erreichbarkeit. IT-Beratung ist eine punktuelle, unabhängige Entscheidungshilfe — etwa vor Anschaffungen oder einem Cloud-Umstieg. Alle drei Leistungen greifen bei Bedarf ineinander.",
    },
    {
      question: "Für wen ist der IT-Service gedacht?",
      answer:
        "Für Selbstständige und Betriebe mit etwa 1 bis 15 Arbeitsplätzen ohne eigene IT-Abteilung: Handwerksbetriebe, Kanzleien, Praxen, Hausverwaltungen und Büros. Für größere Strukturen mit eigener IT bin ich bewusst nicht der richtige Anbieter.",
    },
    {
      question: "Was kostet der IT-Service?",
      answer:
        "Das hängt vom Umfang ab: Einzeleinsätze nach Aufwand, laufende Betreuung ab 79 € netto monatlich, Websites ab 890 € netto einmalig. Im kostenlosen Erstgespräch klären wir den Bedarf — danach erhalten Sie ein Festpreis-Angebot.",
    },
    {
      question: "In welchen Sprachen arbeiten Sie?",
      answer:
        "Beratung und Support biete ich auf Deutsch, Russisch und Ukrainisch an — auch gemischt, wenn in Ihrem Team mehrere Sprachen gesprochen werden.",
    },
  ],
  ctaTitle: "Ein Ansprechpartner für Ihre IT — ab dem ersten Gespräch",
  ctaText:
    "Schildern Sie kurz Ihre Situation — Sie erhalten eine ehrliche Einschätzung und ein klares Angebot. Unverbindlich, kostenlos und ohne Fachchinesisch.",
  relatedTitle: "Leistungen im Detail",
  related: [
    { label: "IT-Betreuung für kleine Unternehmen", to: "/it-betreuung-kleine-unternehmen" },
    { label: "IT-Beratung in Leverkusen", to: "/it-beratung-leverkusen" },
    { label: "Webdesign in Leverkusen", to: "/webdesign-leverkusen" },
  ],
  breadcrumbName: "IT-Service Leverkusen",
  serviceType: "IT-Service",
  formTopic: "IT-Service Leverkusen",
  seo: {
    title: "IT-Service in Leverkusen – Leistungen, Preise & Ablauf",
    description:
      "IT-Service in Leverkusen: Support, Betreuung, Beratung, Webdesign und Wartung aus einer Hand. Fester Ansprechpartner für kleine Unternehmen, vor Ort & remote.",
    keywords:
      "IT-Service Leverkusen, IT-Dienstleister Leverkusen, EDV Service Leverkusen, IT-Firma Leverkusen, IT-Leistungen kleine Unternehmen",
  },
};

export const itBetreuungKleineUnternehmen: LandingContent = {
  path: "/it-betreuung-kleine-unternehmen",
  eyebrow: "IT-Betreuung für kleine Unternehmen",
  h1: "IT-Betreuung für kleine Unternehmen: Ihre IT läuft, Sie arbeiten",
  lede: "Laufende monatliche Betreuung statt Feuerwehr-Einsätzen: Updates, Datensicherung, Sicherheit und ein fester Ansprechpartner mit Prioritäts-Erreichbarkeit — für Betriebe ohne eigene IT-Abteilung.",
  intro: [
    "Die meisten IT-Ausfälle in kleinen Betrieben kündigen sich an: das seit Monaten fällige Update, die Datensicherung, die still aufgehört hat zu laufen, das Postfach, das langsam voll läuft. Bemerkt wird es erst, wenn nichts mehr geht — und dann ist die Behebung teurer als jede Vorsorge. Wer erst im Notfall jemanden sucht, zahlt doppelt: mit Geld und mit Stillstand.",
    "Laufende IT-Betreuung dreht dieses Prinzip um: Ich kümmere mich regelmäßig um Ihre Systeme, bevor Probleme entstehen — und wenn doch etwas klemmt, rufen Sie jemanden an, der Ihre IT bereits kennt. Kein Erklären bei null, keine Fremddiagnose, keine Wartezeit auf einen Techniker, der Ihr Setup zum ersten Mal sieht.",
  ],
  benefitsTitle: "Was laufende Betreuung Ihnen bringt",
  benefits: [
    {
      title: "Probleme vor dem Ausfall erkannt",
      text: "Updates, Backups und Sicherheitslage werden regelmäßig geprüft — die meisten Störungen werden behoben, bevor Sie sie überhaupt bemerken.",
    },
    {
      title: "Prioritäts-Erreichbarkeit",
      text: "Betreuungskunden werden zuerst bedient: feste Reaktionszeiten statt „ich schaue, wann ich Zeit finde“. Ihre Anfrage landet nicht in einer Warteschlange.",
    },
    {
      title: "Planbare Kosten",
      text: "Ein fester Monatsbetrag statt unkalkulierbarer Notfall-Rechnungen. Sie wissen vorab, was Ihre IT im Jahr kostet.",
    },
  ],
  includedTitle: "Leistungen im Überblick",
  includedSubtitle: "Der Umfang wird auf Ihren Betrieb zugeschnitten — typischerweise gehört dazu:",
  included: [
    {
      title: "Updates & Systempflege",
      text: "Betriebssysteme, Programme und Sicherheitsupdates werden regelmäßig eingespielt — kontrolliert, nicht irgendwann automatisch.",
    },
    {
      title: "Überwachte Datensicherung",
      text: "Backups laufen nicht nur, sie werden auch geprüft. Im Ernstfall zählt allein, ob sich Daten wiederherstellen lassen.",
    },
    {
      title: "Sicherheits-Basisschutz",
      text: "Virenschutz, sichere Passwörter, Zwei-Faktor-Anmeldung und regelmäßiger Blick auf verdächtige Aktivitäten.",
    },
    {
      title: "Hilfe im Alltag",
      text: "Fragen zu E-Mail, Drucker, Software oder einem neuen Gerät — kurze Wege per Telefon oder Fernwartung, ohne Ticketformular.",
    },
    {
      title: "Neue Arbeitsplätze & Mitarbeiterwechsel",
      text: "Neue Kollegen bekommen eingerichtete Geräte und Konten; ausscheidende werden sauber und sicher abgemeldet.",
    },
    {
      title: "Dokumentation & Überblick",
      text: "Geräte, Lizenzen und Zugänge werden dokumentiert. Ihr Betrieb hängt nicht mehr am Gedächtnis einer einzelnen Person.",
    },
  ],
  price: {
    label: "Was kostet die IT-Betreuung?",
    value: "ab 79 €",
    suffix: "netto pro Monat",
    note: "Der Preis richtet sich nach Zahl der Arbeitsplätze und dem vereinbarten Umfang. Nach dem kostenlosen Erstgespräch erhalten Sie ein festes Monatsangebot — ohne Mindestlaufzeit, monatlich kündbar.",
  },
  stepsTitle: "So beginnt die Betreuung",
  steps: [
    {
      title: "Erstgespräch",
      text: "Wir klären kostenlos, wie Ihre IT heute aufgestellt ist und wo die größten Risiken liegen.",
    },
    {
      title: "IT-Check zum Start",
      text: "Ich prüfe Geräte, Datensicherung, Konten und Sicherheit — Sie erhalten eine ehrliche Bestandsaufnahme.",
    },
    {
      title: "Betreuungsplan & Angebot",
      text: "Sie bekommen einen klaren Leistungsumfang mit festem Monatspreis, zugeschnitten auf Ihren Betrieb.",
    },
    {
      title: "Laufende Betreuung",
      text: "Ab dann gilt: Ich behalte Ihre IT im Blick, Sie konzentrieren sich auf Ihr Geschäft.",
    },
  ],
  faqTitle: "Häufige Fragen zur IT-Betreuung",
  faq: [
    {
      question: "Worin unterscheidet sich Betreuung von einmaliger IT-Hilfe?",
      answer:
        "Einmalige Hilfe (IT-Support) löst ein akutes Problem und endet dann. Betreuung ist dauerhaft: Systeme werden laufend gepflegt, Risiken früh erkannt, und bei Störungen erreichen Sie jemanden, der Ihre Umgebung bereits kennt und mit Priorität reagiert.",
    },
    {
      question: "Lohnt sich das schon ab zwei oder drei Arbeitsplätzen?",
      answer:
        "Ja — gerade dann. In kleinen Teams gibt es niemanden, der sich nebenbei um IT kümmert, und jeder Ausfall trifft sofort das Tagesgeschäft. Die Betreuung ist bewusst so kalkuliert, dass sie sich bereits für Betriebe ab zwei Arbeitsplätzen rechnet.",
    },
    {
      question: "Gibt es eine Vertragsbindung?",
      answer:
        "Nein. Die Betreuung ist monatlich kündbar und hat keine Mindestlaufzeit. Sie bleiben, weil die Leistung stimmt — nicht, weil ein Vertrag Sie hält.",
    },
    {
      question: "Betreuen Sie auch gemischte Umgebungen mit Windows und Mac?",
      answer:
        "Ja. Windows- und macOS-Arbeitsplätze, Microsoft-365- und Google-Konten sowie die üblichen Branchenanwendungen kleiner Betriebe — auch in Kombination.",
    },
    {
      question: "Sind Sie auch außerhalb von Leverkusen tätig?",
      answer:
        "Die laufende Betreuung erfolgt größtenteils per Fernwartung und funktioniert daher ortsunabhängig. Vor-Ort-Termine übernehme ich in Leverkusen, Köln, Leichlingen, Burscheid, Bergisch Gladbach, Monheim am Rhein und Langenfeld.",
    },
  ],
  ctaTitle: "Nie wieder IT-Feuerwehr spielen",
  ctaText:
    "Erzählen Sie kurz, wie Ihr Betrieb aufgestellt ist — Sie erhalten eine ehrliche Einschätzung und ein festes Monatsangebot. Kostenlos und unverbindlich.",
  relatedTitle: "Passende Leistungen",
  related: [
    { label: "IT-Wartungsvertrag", to: "/wartungsvertrag-it" },
    { label: "IT-Support in Leverkusen", to: "/it-support-leverkusen" },
    { label: "IT-Service in Leverkusen", to: "/it-service-leverkusen" },
  ],
  breadcrumbName: "IT-Betreuung für kleine Unternehmen",
  serviceType: "IT-Betreuung",
  formTopic: "IT-Betreuung kleine Unternehmen",
  seo: {
    title: "IT-Betreuung für kleine Unternehmen | ab 79 € mtl.",
    description:
      "Laufende IT-Betreuung für kleine Unternehmen ohne eigene IT: Updates, Backups, Sicherheit und schnelle Hilfe. Monatlich ab 79 €, fester Ansprechpartner.",
    keywords:
      "IT-Betreuung kleine Unternehmen, IT-Betreuung Mittelstand, laufende IT-Betreuung, Managed IT kleine Firma, IT-Betreuung monatlich",
  },
};

export const itBeratungLeverkusen: LandingContent = {
  path: "/it-beratung-leverkusen",
  eyebrow: "IT-Beratung Leverkusen",
  h1: "IT-Beratung in Leverkusen: ehrliche Empfehlungen statt Verkaufsgespräch",
  lede: "Unabhängige Beratung vor IT-Entscheidungen: Hardware, Software, Cloud, E-Mail und IT-Sicherheit — verständlich erklärt, mit klarer Empfehlung. Für Selbstständige und kleine Unternehmen.",
  intro: [
    "Vor fast jeder IT-Entscheidung steht dieselbe Unsicherheit: Reicht der günstigere Laptop? Cloud oder eigener Server? Welches Buchhaltungsprogramm passt — und was davon braucht man wirklich? Wer dann einen Verkäufer fragt, bekommt eine Verkaufsantwort. Und wer im Internet sucht, findet hundert Meinungen und keine Entscheidung.",
    "IT-Beratung heißt bei mir: Sie schildern Ihr Vorhaben, ich prüfe die Optionen und spreche eine klare, herstellerunabhängige Empfehlung aus — mit Begründung und ehrlichen Nachteilen. Ich verkaufe keine Hardware und erhalte keine Provisionen. Bezahlt wird die Beratung, nicht das Produkt.",
  ],
  benefitsTitle: "Warum IT-Beratung von Korolov IT-Service",
  benefits: [
    {
      title: "Herstellerunabhängig",
      text: "Keine Partnerverträge, keine Provisionen: Die Empfehlung richtet sich allein danach, was für Ihren Betrieb sinnvoll und wirtschaftlich ist.",
    },
    {
      title: "Entscheidung statt Optionsliste",
      text: "Sie erhalten keine zehnseitige Marktübersicht, sondern eine begründete Empfehlung: Das würde ich an Ihrer Stelle tun — und deshalb.",
    },
    {
      title: "Auf Augenhöhe erklärt",
      text: "Ohne Fachbegriffe-Gewitter, auf Deutsch, Russisch oder Ukrainisch. Sie verstehen am Ende selbst, warum die Lösung passt.",
    },
  ],
  includedTitle: "Leistungen im Überblick",
  includedSubtitle: "Typische Themen, zu denen ich berate:",
  included: [
    {
      title: "Anschaffungen & Ausstattung",
      text: "Laptops, PCs, Drucker, Telefonanlage: was für Ihre Aufgaben genügt und wo sich Mehrausgaben wirklich lohnen.",
    },
    {
      title: "Software-Auswahl",
      text: "Buchhaltung, Terminplanung, Dokumentenablage, Branchenlösungen — Vergleich und Empfehlung passend zu Ihren Abläufen.",
    },
    {
      title: "Cloud oder lokal",
      text: "Microsoft 365, Google Workspace oder eigene Infrastruktur: Kosten, Datenschutz und Alltagstauglichkeit nüchtern abgewogen.",
    },
    {
      title: "E-Mail & Domain aufräumen",
      text: "Professionelle Adressen auf eigener Domain, zuverlässige Zustellung, sauberer Umzug von Alt-Postfächern.",
    },
    {
      title: "IT-Sicherheits-Check",
      text: "Passwörter, Backups, Updates, Zugriffsrechte: wo Ihr Betrieb angreifbar ist und welche Maßnahmen zuerst zählen.",
    },
    {
      title: "Digitalisierung von Abläufen",
      text: "Papier- und Zettelprozesse durch einfache digitale Werkzeuge ersetzen — ohne Groß-Projekt und ohne Software-Zoo.",
    },
  ],
  price: {
    label: "Was kostet die IT-Beratung?",
    value: "Festpreis nach Erstgespräch",
    suffix: "Erstgespräch kostenlos",
    note: "Nach dem kostenlosen Erstgespräch nenne ich Ihnen einen Festpreis für die Beratung — abhängig von Thema und Umfang. Kleine Fragen sind oft schon im Erstgespräch beantwortet; das kostet Sie nichts.",
  },
  stepsTitle: "So läuft die Beratung ab",
  steps: [
    {
      title: "Kostenloses Erstgespräch",
      text: "Sie schildern Ihr Vorhaben oder Problem — telefonisch, per Video oder vor Ort in Leverkusen.",
    },
    {
      title: "Analyse",
      text: "Ich sehe mir Ihre Situation an, vergleiche die realistischen Optionen und prüfe Kosten und Folgen.",
    },
    {
      title: "Empfehlung mit Begründung",
      text: "Sie erhalten eine klare Empfehlung samt Alternativen, Preisen und ehrlichen Nachteilen — schriftlich zusammengefasst.",
    },
    {
      title: "Umsetzung auf Wunsch",
      text: "Entscheiden Sie sich für einen Weg, kann ich die Umsetzung direkt übernehmen — muss ich aber nicht: Die Beratung steht für sich.",
    },
  ],
  faqTitle: "Häufige Fragen zur IT-Beratung",
  faq: [
    {
      question: "Was ist der Unterschied zwischen IT-Beratung und IT-Betreuung?",
      answer:
        "IT-Beratung ist punktuell: Sie stehen vor einer Entscheidung, ich helfe Ihnen, die richtige zu treffen — danach ist der Auftrag abgeschlossen. IT-Betreuung ist dagegen ein laufendes Monatsmodell, bei dem ich Ihre Systeme dauerhaft pflege und überwache. Häufig führt eine Beratung später in eine Betreuung über — zwingend ist das nicht.",
    },
    {
      question: "Beraten Sie wirklich unabhängig?",
      answer:
        "Ja. Ich verkaufe keine Hardware, führe keine Produktpartnerschaften und erhalte keine Vermittlungsprovisionen. Sie bezahlen ausschließlich die Beratungsleistung — deshalb kann die Empfehlung auch lauten, nichts zu kaufen.",
    },
    {
      question: "Muss ich die Umsetzung bei Ihnen beauftragen?",
      answer:
        "Nein. Sie können die Empfehlung auch selbst oder mit einem anderen Dienstleister umsetzen. Die schriftliche Zusammenfassung ist bewusst so formuliert, dass Dritte damit arbeiten können.",
    },
    {
      question: "Kommen Sie auch in unseren Betrieb?",
      answer:
        "Ja — in Leverkusen, Köln, Leichlingen, Burscheid, Bergisch Gladbach, Monheim am Rhein und Langenfeld gerne vor Ort; vieles lässt sich alternativ per Video klären. Für einen Sicherheits-Check oder eine Bestandsaufnahme ist der Blick vor Ort meist am wertvollsten.",
    },
    {
      question: "Für welche Themen sind Sie nicht der Richtige?",
      answer:
        "Für Konzern-Projekte, SAP-Einführungen und große Individualsoftware-Ausschreibungen. Mein Fokus sind Selbstständige und Betriebe bis etwa 15 Arbeitsplätze mit alltagsnahen IT-Entscheidungen.",
    },
  ],
  ctaTitle: "Stehen Sie vor einer IT-Entscheidung?",
  ctaText:
    "Schildern Sie Ihr Vorhaben im kostenlosen Erstgespräch — oft reicht das schon für eine erste klare Richtung. Alles Weitere gibt es zum vereinbarten Festpreis.",
  relatedTitle: "Passende Leistungen",
  related: [
    { label: "IT-Betreuung für kleine Unternehmen", to: "/it-betreuung-kleine-unternehmen" },
    { label: "IT-Service in Leverkusen", to: "/it-service-leverkusen" },
    { label: "IT-Support in Leverkusen", to: "/it-support-leverkusen" },
  ],
  breadcrumbName: "IT-Beratung Leverkusen",
  serviceType: "IT-Beratung",
  formTopic: "IT-Beratung Leverkusen",
  seo: {
    title: "IT-Beratung Leverkusen – unabhängig & verständlich",
    description:
      "IT-Beratung in Leverkusen für kleine Unternehmen: ehrliche Empfehlungen zu Hardware, Software, Cloud und IT-Sicherheit. Unabhängig, Erstgespräch kostenlos.",
    keywords:
      "IT-Beratung Leverkusen, IT-Berater Leverkusen, EDV-Beratung, IT-Beratung kleine Unternehmen, unabhängige IT-Beratung",
  },
};

export const wartungsvertragIt: LandingContent = {
  path: "/wartungsvertrag-it",
  eyebrow: "IT-Wartungsvertrag",
  h1: "IT-Wartungsvertrag: planbare IT-Kosten statt teurer Notfälle",
  lede: "Klar geregelte Wartung für Ihre gesamte IT: definierter Leistungsumfang, feste Reaktionszeiten, fester Monatspreis — schriftlich vereinbart und monatlich kündbar.",
  intro: [
    "Ohne Wartungsvertrag ist IT-Hilfe Glückssache: Wenn etwas ausfällt, beginnt die Suche nach jemandem, der Zeit hat — zu dem Preis, den die Dringlichkeit eben kostet. Was gewartet wird und was nicht, ist nirgendwo festgehalten; ob die Datensicherung läuft, weiß niemand verbindlich. Für einen Betrieb, der täglich auf seine IT angewiesen ist, ist das ein stilles Risiko mit offenem Preisschild.",
    "Ein IT-Wartungsvertrag ersetzt dieses Prinzip Hoffnung durch klare Zusagen: Sie wissen schwarz auf weiß, welche Systeme in welchem Rhythmus gewartet werden, wie schnell ich im Störungsfall reagiere und was das im Monat kostet. Nicht mehr — auch nicht im Notfall.",
  ],
  benefitsTitle: "Was der Wartungsvertrag Ihnen sichert",
  benefits: [
    {
      title: "Feste Reaktionszeiten",
      text: "Im Störungsfall gilt die vereinbarte Frist — nicht „sobald wie möglich“. Vertragskunden haben Vorrang vor Einzelaufträgen.",
    },
    {
      title: "Definierter Leistungsumfang",
      text: "Was gewartet wird, steht im Vertrag: Systeme, Rhythmus, Umfang. Keine Grauzonen, keine Überraschungen auf der Rechnung.",
    },
    {
      title: "Monatlich kündbar",
      text: "Keine Mindestlaufzeit, keine Jahresbindung. Der Vertrag bindet mich an Zusagen — nicht Sie an mich.",
    },
  ],
  includedTitle: "Leistungen im Überblick",
  includedSubtitle: "Der Vertragsumfang wird auf Ihren Betrieb zugeschnitten — üblicherweise enthalten:",
  included: [
    {
      title: "Regelmäßige Wartungsläufe",
      text: "Updates für Betriebssysteme und Software, Prüfung der Systemzustände — in festem, dokumentiertem Rhythmus.",
    },
    {
      title: "Backup-Kontrolle mit Testwiederherstellung",
      text: "Die Datensicherung wird nicht nur eingerichtet, sondern regelmäßig auf Wiederherstellbarkeit geprüft.",
    },
    {
      title: "Monitoring kritischer Dienste",
      text: "Server, NAS, Website und E-Mail-Zustellung werden überwacht — Störungen fallen auf, bevor Kunden sie bemerken.",
    },
    {
      title: "Störungsbehebung mit Vorrang",
      text: "Probleme innerhalb des Vertragsumfangs werden in der vereinbarten Reaktionszeit angegangen — remote oder vor Ort.",
    },
    {
      title: "Sicherheitspflege",
      text: "Virenschutz, Firewall-Grundeinstellungen und Zugriffsrechte werden aktuell gehalten und regelmäßig überprüft.",
    },
    {
      title: "Wartungsprotokoll",
      text: "Nach jedem Wartungslauf erhalten Sie ein kurzes Protokoll: was geprüft, was aktualisiert, was auffällig war.",
    },
  ],
  price: {
    label: "Was kostet ein IT-Wartungsvertrag?",
    value: "ab 79 €",
    suffix: "netto pro Monat",
    note: "Der Monatspreis richtet sich nach Anzahl der Geräte und dem vereinbarten Umfang — vom Website-und-E-Mail-Paket bis zur kompletten Büro-IT. Nach dem kostenlosen Erstgespräch erhalten Sie ein schriftliches Festpreis-Angebot.",
  },
  stepsTitle: "So kommt der Vertrag zustande",
  steps: [
    {
      title: "Erstgespräch & Bestandsaufnahme",
      text: "Wir erfassen kostenlos, welche Systeme Ihr Betrieb nutzt und was davon vertraglich abgesichert werden soll.",
    },
    {
      title: "Vertragsentwurf",
      text: "Sie erhalten einen verständlichen Entwurf: Leistungen, Wartungsrhythmus, Reaktionszeiten und Monatspreis.",
    },
    {
      title: "Start der Wartung",
      text: "Nach Unterschrift bringe ich alle Systeme auf einen sauberen Stand — die Basis für jede weitere Wartung.",
    },
    {
      title: "Laufender Betrieb",
      text: "Ab dann läuft die Wartung im vereinbarten Rhythmus, mit Protokoll nach jedem Durchgang.",
    },
  ],
  faqTitle: "Häufige Fragen zum IT-Wartungsvertrag",
  faq: [
    {
      question: "Was ist der Unterschied zwischen IT-Wartungsvertrag und Website-Wartung?",
      answer:
        "Die Website-Wartung kümmert sich ausschließlich um Ihre Website: Updates, Backups und Erreichbarkeit der Seite. Der IT-Wartungsvertrag kann deutlich mehr abdecken — Arbeitsplätze, Server, Netzwerk, E-Mail und auf Wunsch auch die Website als Baustein. Wer nur eine Website betreiben lässt, ist mit der reinen Website-Wartung günstiger bedient.",
    },
    {
      question: "Welche Reaktionszeiten werden vereinbart?",
      answer:
        "Üblich ist eine Reaktion am selben Werktag, bei kritischen Ausfällen schneller. Die konkrete Frist legen wir gemeinsam fest und schreiben sie in den Vertrag — sie richtet sich danach, wie abhängig Ihr Betrieb von der jeweiligen Technik ist.",
    },
    {
      question: "Gibt es eine Mindestlaufzeit?",
      answer:
        "Nein. Der Wartungsvertrag ist monatlich kündbar. Lange Laufzeiten schützen in der Regel den Anbieter — ich möchte, dass Sie wegen der Leistung bleiben.",
    },
    {
      question: "Was passiert bei Problemen außerhalb des Vertragsumfangs?",
      answer:
        "Dann sage ich Ihnen das vorab offen und nenne den Aufwand. Vertragskunden zahlen dafür den regulären Stundensatz ohne Notfall-Zuschläge — und Vorrang bei der Terminvergabe gilt auch hier.",
    },
    {
      question: "Übernehmen Sie auch bestehende, von anderen eingerichtete IT?",
      answer:
        "Ja, das ist der Normalfall. Zum Start dokumentiere ich den Ist-Zustand und bringe die Systeme auf einen wartbaren Stand — danach übernehme ich die laufende Verantwortung, auch ohne dass Ihre IT je „bei mir gekauft“ wurde.",
    },
  ],
  ctaTitle: "Schluss mit IT auf Zuruf",
  ctaText:
    "Beschreiben Sie kurz Ihren Betrieb — Sie erhalten einen verständlichen Vertragsentwurf mit festem Monatspreis. Kostenlos, unverbindlich und ohne Kleingedrucktes.",
  relatedTitle: "Passende Leistungen",
  related: [
    { label: "Website-Wartung & Pflege", to: "/website-wartung-leverkusen" },
    { label: "IT-Betreuung für kleine Unternehmen", to: "/it-betreuung-kleine-unternehmen" },
    { label: "IT-Service in Leverkusen", to: "/it-service-leverkusen" },
  ],
  breadcrumbName: "IT-Wartungsvertrag",
  serviceType: "IT-Wartung",
  formTopic: "IT-Wartungsvertrag",
  seo: {
    title: "IT-Wartungsvertrag für kleine Unternehmen | ab 79 €",
    description:
      "IT-Wartungsvertrag zum fairen Monatspreis: Updates, Backups, Monitoring und feste Reaktionszeiten für kleine Unternehmen. Ab 79 € mtl., monatlich kündbar.",
    keywords:
      "Wartungsvertrag IT, IT-Wartungsvertrag, EDV Wartungsvertrag, Wartungsvertrag EDV kleine Unternehmen, IT-Wartung monatlich",
  },
};

export const landingPages: LandingContent[] = [
  webdesignLeverkusen,
  itSupportLeverkusen,
  websiteWartungLeverkusen,
  itServiceLeverkusen,
  itBetreuungKleineUnternehmen,
  itBeratungLeverkusen,
  wartungsvertragIt,
];
