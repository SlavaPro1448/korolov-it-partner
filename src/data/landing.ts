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
  ],
  breadcrumbName: "Webdesign Leverkusen",
  serviceType: "Webdesign",
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
    { label: "Webdesign in Leverkusen", to: "/webdesign-leverkusen" },
    { label: "Website-Wartung & Pflege", to: "/website-wartung-leverkusen" },
  ],
  breadcrumbName: "IT-Support Leverkusen",
  serviceType: "IT-Support",
  seo: {
    title: "IT-Support Leverkusen für kleine Unternehmen | Korolov IT-Service",
    description:
      "IT-Support in Leverkusen: Hilfe bei Computern, Netzwerk, E-Mail, Backups und Cloud für kleine Unternehmen ohne eigene IT. Remote oder vor Ort, fester Ansprechpartner, Beratung auf Deutsch, Russisch & Ukrainisch.",
    keywords:
      "IT-Support Leverkusen, IT-Service Leverkusen, IT-Betreuung kleine Unternehmen, EDV Service Leverkusen, IT-Dienstleister Leverkusen",
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
    { label: "IT-Support für kleine Unternehmen", to: "/it-support-leverkusen" },
  ],
  breadcrumbName: "Website-Wartung",
  serviceType: "Website-Wartung",
  seo: {
    title: "Website-Wartung & Pflege ab 79 €/Monat | Korolov IT-Service Leverkusen",
    description:
      "Website-Wartung in Leverkusen: Updates, Backups, Monitoring und kleine Änderungen ab 79 €/Monat. Auch für bestehende Websites — mit festem technischen Ansprechpartner.",
    keywords:
      "Website Wartung Leverkusen, Website Pflege, Homepage Wartung, Website Betreuung, Website Updates Backups",
  },
};

export const landingPages: LandingContent[] = [
  webdesignLeverkusen,
  itSupportLeverkusen,
  websiteWartungLeverkusen,
];
