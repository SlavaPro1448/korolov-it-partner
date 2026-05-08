import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { COMPANY, formatLegalDate } from "@/config/legal";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/structured-data";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/datenschutz")({
  head: () => ({
    meta: buildSeoMeta({
      title: "Datenschutzerklärung | Korolov IT-Service",
      description: "Datenschutzerklärung von Korolov IT-Service nach DSGVO und BDSG.",
      path: "/datenschutz",
      locale: "de",
    }),
  }),
  component: DatenschutzPage,
});

function DatenschutzPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Startseite", item: "https://korolov-it-service.de/" },
          {
            name: "Datenschutz",
            item: "https://korolov-it-service.de/datenschutz",
          },
        ])}
      />
      <SiteHeader />
      <main id="main" tabIndex={-1} className="flex-1 flex flex-col focus:outline-none">
        <article className="container-page py-16 md:py-24 max-w-3xl">
          <header className="mb-12">
            <p className="text-sm font-medium text-accent-blue uppercase tracking-wider">
              Rechtliches
            </p>
            <h1 className="mt-3 text-3xl md:text-4xl font-bold text-brand">Datenschutzerklärung</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Informationen über die Verarbeitung personenbezogener Daten gemäß Art. 13 DSGVO
            </p>
          </header>

          <div className="space-y-10 text-foreground/90 leading-relaxed">
            <section>
              <p>
                Der Schutz Ihrer persönlichen Daten ist mir ein wichtiges Anliegen. Im Folgenden
                informiere ich Sie ausführlich über den Umgang mit Ihren Daten beim Besuch dieser
                Website. Die Verarbeitung Ihrer Daten erfolgt ausschließlich im Rahmen der
                gesetzlichen Vorschriften, insbesondere der Datenschutz-Grundverordnung (DSGVO) und
                des Bundesdatenschutzgesetzes (BDSG).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-brand mb-3">1. Verantwortlicher</h2>
              <p>
                Verantwortlicher im Sinne der Datenschutz-Grundverordnung und anderer nationaler
                Datenschutzgesetze sowie sonstiger datenschutzrechtlicher Bestimmungen ist:
              </p>
              <address className="not-italic mt-4 space-y-0.5">
                <p>{COMPANY.legalName}</p>
                <p>{COMPANY.tradeName}</p>
                <p>{COMPANY.street}</p>
                <p>
                  {COMPANY.zip} {COMPANY.city}
                </p>
                <p>{COMPANY.country}</p>
                <p className="pt-2">
                  E-Mail:{" "}
                  <a href={`mailto:${COMPANY.email}`} className="text-accent-blue hover:underline">
                    {COMPANY.email}
                  </a>
                </p>
                <p>
                  Telefon:{" "}
                  <a href={COMPANY.phoneHref} className="text-accent-blue hover:underline">
                    {COMPANY.phoneDisplay}
                  </a>
                </p>
              </address>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-brand mb-3">
                2. Allgemeine Hinweise zur Datenverarbeitung
              </h2>
              <h3 className="font-semibold text-brand mt-4 mb-2">Umfang der Verarbeitung</h3>
              <p>
                Personenbezogene Daten werden nur erhoben und verarbeitet, soweit dies für die
                Bereitstellung einer funktionsfähigen Website sowie für die Erbringung meiner
                Leistungen erforderlich ist. Eine Verarbeitung erfolgt nur mit Ihrer Einwilligung
                oder auf einer anderen gesetzlichen Grundlage.
              </p>
              <h3 className="font-semibold text-brand mt-5 mb-2">Rechtsgrundlagen</h3>
              <p>
                Soweit ich für Verarbeitungsvorgänge eine Einwilligung der betroffenen Person
                einhole, dient Art. 6 Abs. 1 lit. a DSGVO als Rechtsgrundlage. Bei der Verarbeitung
                zur Erfüllung eines Vertrags oder zur Durchführung vorvertraglicher Maßnahmen dient
                Art. 6 Abs. 1 lit. b DSGVO als Rechtsgrundlage. Soweit die Verarbeitung zur Wahrung
                eines berechtigten Interesses erforderlich ist, dient Art. 6 Abs. 1 lit. f DSGVO als
                Rechtsgrundlage.
              </p>
              <h3 className="font-semibold text-brand mt-5 mb-2">Speicherdauer</h3>
              <p>
                Personenbezogene Daten werden gelöscht, sobald der Zweck der Speicherung entfällt.
                Eine Speicherung kann darüber hinaus erfolgen, wenn dies durch den europäischen oder
                nationalen Gesetzgeber vorgesehen wurde — insbesondere zur Erfüllung steuer- und
                handelsrechtlicher Aufbewahrungspflichten (in der Regel 6 bis 10 Jahre).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-brand mb-3">
                3. Bereitstellung der Website (Hosting und Server-Logfiles)
              </h2>
              <p>
                Diese Website wird gehostet bei <strong>{COMPANY.hosting.provider}</strong>,{" "}
                {COMPANY.hosting.address}. Beim Aufruf der Website werden durch den Hosting-Anbieter
                automatisch Informationen erfasst und in sogenannten Server-Logfiles gespeichert.
                Erfasst werden:
              </p>
              <ul className="mt-3 space-y-1 list-disc pl-6">
                <li>IP-Adresse des anfragenden Geräts</li>
                <li>Datum und Uhrzeit des Zugriffs</li>
                <li>Name und URL der abgerufenen Datei</li>
                <li>Übertragene Datenmenge</li>
                <li>Meldung, ob der Abruf erfolgreich war</li>
                <li>Erkennungsdaten des verwendeten Browsers und Betriebssystems</li>
                <li>Referrer-URL (zuvor besuchte Seite)</li>
              </ul>
              <p className="mt-4">
                Diese Daten werden zum Zweck der technischen Bereitstellung, Sicherheit und
                Stabilität der Website verarbeitet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO
                (berechtigtes Interesse an einer fehlerfreien und sicheren Bereitstellung der
                Website). Die Server-Logs werden in der Regel nach 14 Tagen automatisch gelöscht,
                sofern keine sicherheitsrelevanten Vorfälle eine längere Speicherung erfordern.
              </p>
              <p className="mt-3">
                Mit dem Hosting-Anbieter wurde ein Vertrag zur Auftragsverarbeitung gemäß Art. 28
                DSGVO geschlossen. Weitere Informationen finden Sie in der Datenschutzerklärung von
                IONOS:{" "}
                <a
                  href={COMPANY.hosting.privacyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-blue hover:underline break-all"
                >
                  {COMPANY.hosting.privacyUrl}
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-brand mb-3">4. Cookies</h2>
              <p>
                Diese Website verwendet derzeit <strong>keine Cookies</strong>, die nicht technisch
                notwendig sind. Es werden keine Tracking-Cookies, keine Marketing-Cookies und keine
                Cookies von Drittanbietern eingesetzt.
              </p>
              <p className="mt-3">
                Sollten in Zukunft Cookies eingesetzt werden, die einer Einwilligung bedürfen, wird
                Ihre Zustimmung über ein Cookie-Banner eingeholt. Sie können Ihre Einwilligung
                jederzeit für die Zukunft widerrufen.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-brand mb-3">5. Kontaktaufnahme</h2>
              <h3 className="font-semibold text-brand mt-4 mb-2">Kontaktformular</h3>
              {/*
              ВАЖНО: Этот раздел описывает текущее состояние (formsubmit.co).
              При переходе на собственный Python-backend замените содержимое
              этого подраздела.
            */}
              <p>
                Wenn Sie das Kontaktformular auf dieser Website nutzen, werden die von Ihnen
                eingegebenen Daten (Name, E-Mail-Adresse, ggf. Telefonnummer, Firmenname und Inhalt
                der Nachricht) zur Bearbeitung Ihrer Anfrage verarbeitet.
              </p>
              <p className="mt-3">
                Die technische Übermittlung der Formulardaten erfolgt derzeit über den Dienst{" "}
                <strong>{COMPANY.formProcessor.provider}</strong>. Der Anbieter hat seinen Sitz in
                den {COMPANY.formProcessor.country}. Die Übermittlung in ein Drittland erfolgt auf
                Grundlage von Standardvertragsklauseln nach Art. 46 Abs. 2 lit. c DSGVO. Weitere
                Informationen finden Sie in der Datenschutzerklärung des Anbieters:{" "}
                <a
                  href={COMPANY.formProcessor.privacyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-blue hover:underline break-all"
                >
                  {COMPANY.formProcessor.privacyUrl}
                </a>
              </p>
              <p className="mt-3">
                Rechtsgrundlage der Verarbeitung ist Art. 6 Abs. 1 lit. b DSGVO (Durchführung
                vorvertraglicher Maßnahmen) bzw. Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse
                an der Beantwortung Ihrer Anfrage). Die Daten werden gelöscht, sobald Ihre Anfrage
                abschließend bearbeitet ist und keine gesetzlichen Aufbewahrungspflichten
                entgegenstehen.
              </p>

              <h3 className="font-semibold text-brand mt-5 mb-2">E-Mail, Telefon und WhatsApp</h3>
              <p>
                Wenn Sie mich per E-Mail, Telefon oder über WhatsApp kontaktieren, werden Ihre
                Angaben zur Bearbeitung der Anfrage und für den Fall von Anschlussfragen
                gespeichert. Diese Daten gebe ich nicht ohne Ihre Einwilligung weiter. Die
                Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO bzw. lit. f DSGVO.
              </p>
              <p className="mt-3">
                Bitte beachten Sie: Bei der Kommunikation per WhatsApp werden Daten an die Meta
                Platforms Ireland Limited übertragen. Wenn Sie diesen Datenfluss vermeiden möchten,
                nutzen Sie bitte E-Mail oder das Kontaktformular.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-brand mb-3">6. E-Mail-Verarbeitung</h2>
              <p>
                Für die geschäftliche E-Mail-Adresse <em>{COMPANY.email}</em> nutze ich die
                Mail-Dienste von <strong>{COMPANY.mailProvider.provider}</strong>. Beim Versand und
                Empfang von E-Mails werden technische Daten (z. B. Absender, Empfänger, Zeitpunkt,
                Betreff, IP-Adressen) verarbeitet. Mit dem Anbieter besteht ein Vertrag zur
                Auftragsverarbeitung gemäß Art. 28 DSGVO.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-brand mb-3">
                7. Schriftarten (Bunny Fonts)
              </h2>
              <p>
                Diese Website nutzt für die einheitliche Darstellung von Schriften{" "}
                <strong>{COMPANY.fontProvider.provider}</strong>, einen datenschutzfreundlichen
                Schriftendienst mit Sitz in {COMPANY.fontProvider.country} (EU). Beim Aufruf der
                Website wird die Schriftart vom Server des Anbieters geladen. Dabei wird die
                IP-Adresse Ihres Endgeräts an den Anbieter übertragen.
              </p>
              <p className="mt-3">
                Bunny Fonts protokolliert nach eigenen Angaben{" "}
                <strong>keine personenbezogenen Daten</strong>, setzt keine Cookies und übermittelt
                keine Daten in Drittländer. Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1
                lit. f DSGVO (berechtigtes Interesse an einer einheitlichen und schnellen
                Darstellung der Website).
              </p>
              <p className="mt-3">
                Datenschutzerklärung des Anbieters:{" "}
                <a
                  href={COMPANY.fontProvider.privacyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-blue hover:underline break-all"
                >
                  {COMPANY.fontProvider.privacyUrl}
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-brand mb-3">
                8. Ihre Rechte als betroffene Person
              </h2>
              <p>
                Sie haben gegenüber dem Verantwortlichen folgende Rechte hinsichtlich der Sie
                betreffenden personenbezogenen Daten:
              </p>
              <ul className="mt-3 space-y-2 list-disc pl-6">
                <li>
                  <strong>Recht auf Auskunft</strong> (Art. 15 DSGVO) — Information darüber, welche
                  Daten ich über Sie verarbeite
                </li>
                <li>
                  <strong>Recht auf Berichtigung</strong> (Art. 16 DSGVO) — Korrektur unrichtiger
                  oder unvollständiger Daten
                </li>
                <li>
                  <strong>Recht auf Löschung</strong> (Art. 17 DSGVO) — Löschung Ihrer Daten, sofern
                  keine Aufbewahrungspflichten entgegenstehen
                </li>
                <li>
                  <strong>Recht auf Einschränkung der Verarbeitung</strong> (Art. 18 DSGVO)
                </li>
                <li>
                  <strong>Recht auf Datenübertragbarkeit</strong> (Art. 20 DSGVO)
                </li>
                <li>
                  <strong>Widerspruchsrecht</strong> (Art. 21 DSGVO) — gegen eine Verarbeitung auf
                  Grundlage berechtigter Interessen
                </li>
                <li>
                  <strong>Widerruf einer Einwilligung</strong> (Art. 7 Abs. 3 DSGVO) — mit Wirkung
                  für die Zukunft
                </li>
              </ul>
              <p className="mt-4">
                Zur Ausübung Ihrer Rechte genügt eine formlose Mitteilung an die oben genannte
                E-Mail-Adresse oder Postanschrift.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-brand mb-3">
                9. Beschwerderecht bei einer Aufsichtsbehörde
              </h2>
              <p>
                Sie haben das Recht, sich über die Verarbeitung Ihrer personenbezogenen Daten bei
                einer Aufsichtsbehörde zu beschweren (Art. 77 DSGVO). Zuständig für {COMPANY.city}{" "}
                ist:
              </p>
              <address className="not-italic mt-3 space-y-0.5">
                <p>
                  <strong>
                    Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen
                  </strong>
                </p>
                <p>Kavalleriestraße 2-4</p>
                <p>40213 Düsseldorf</p>
                <p>Telefon: 0211/38424-0</p>
                <p>
                  E-Mail:{" "}
                  <a
                    href="mailto:poststelle@ldi.nrw.de"
                    className="text-accent-blue hover:underline"
                  >
                    poststelle@ldi.nrw.de
                  </a>
                </p>
                <p>
                  Web:{" "}
                  <a
                    href="https://www.ldi.nrw.de"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-blue hover:underline"
                  >
                    www.ldi.nrw.de
                  </a>
                </p>
              </address>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-brand mb-3">
                10. SSL- bzw. TLS-Verschlüsselung
              </h2>
              <p>
                Diese Website nutzt aus Sicherheitsgründen und zum Schutz der Übertragung
                vertraulicher Inhalte eine SSL-/ TLS-Verschlüsselung. Eine verschlüsselte Verbindung
                erkennen Sie daran, dass die Adresszeile des Browsers von &quot;http://&quot; auf
                &quot;https://&quot; wechselt und am Schloss-Symbol in Ihrer Browserzeile.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-brand mb-3">
                11. Aktualität und Änderung dieser Datenschutzerklärung
              </h2>
              <p>
                Diese Datenschutzerklärung ist aktuell gültig und hat den Stand vom{" "}
                <strong>{formatLegalDate(COMPANY.lastUpdated)}</strong>.
              </p>
              <p className="mt-3">
                Durch die Weiterentwicklung der Website oder aufgrund geänderter gesetzlicher bzw.
                behördlicher Vorgaben kann es notwendig werden, diese Datenschutzerklärung
                anzupassen. Die jeweils aktuelle Datenschutzerklärung kann jederzeit auf dieser
                Seite abgerufen werden.
              </p>
            </section>

            <p className="pt-8 text-sm text-muted-foreground border-t border-border">
              Stand: {formatLegalDate(COMPANY.lastUpdated)}
            </p>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
