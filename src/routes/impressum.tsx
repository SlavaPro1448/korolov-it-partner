import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { COMPANY, formatLegalDate } from "@/config/legal";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, organizationSchema } from "@/lib/structured-data";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/impressum")({
  head: () => ({
    meta: buildSeoMeta({
      title: "Impressum | Korolov IT-Service",
      description: "Impressum von Korolov IT-Service — Angaben gemäß § 5 TMG.",
      path: "/impressum",
      locale: "de",
    }),
  }),
  component: ImpressumPage,
});

function ImpressumPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <JsonLd data={organizationSchema("de")} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Startseite", item: "https://korolov-it-service.de/" },
          { name: "Impressum", item: "https://korolov-it-service.de/impressum" },
        ])}
      />
      <SiteHeader />
      <main id="main" tabIndex={-1} className="flex-1 flex flex-col focus:outline-none">
        <article className="container-page py-16 md:py-24 max-w-3xl">
          <header className="mb-12">
            <p className="text-sm font-medium text-accent-blue uppercase tracking-wider">
              Rechtliches
            </p>
            <h1 className="mt-3 text-3xl md:text-4xl font-bold text-brand">Impressum</h1>
            <p className="mt-3 text-sm text-muted-foreground">Angaben gemäß § 5 TMG</p>
          </header>

          <div className="space-y-10 text-foreground/90 leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-brand mb-3">Anbieter</h2>
              <address className="not-italic space-y-0.5 text-base">
                <p>{COMPANY.legalName}</p>
                <p>{COMPANY.tradeName}</p>
                <p className="pt-2">{COMPANY.street}</p>
                <p>
                  {COMPANY.zip} {COMPANY.city}
                </p>
                <p>{COMPANY.country}</p>
              </address>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-brand mb-3">Kontakt</h2>
              <dl className="space-y-2 text-base">
                <div className="flex flex-col sm:flex-row sm:gap-3">
                  <dt className="text-muted-foreground sm:w-28 shrink-0">Telefon:</dt>
                  <dd>
                    <a href={COMPANY.phoneHref} className="text-accent-blue hover:underline">
                      {COMPANY.phoneDisplay}
                    </a>
                  </dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-3">
                  <dt className="text-muted-foreground sm:w-28 shrink-0">E-Mail:</dt>
                  <dd>
                    <a
                      href={`mailto:${COMPANY.email}`}
                      className="text-accent-blue hover:underline"
                    >
                      {COMPANY.email}
                    </a>
                  </dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:gap-3">
                  <dt className="text-muted-foreground sm:w-28 shrink-0">Internet:</dt>
                  <dd>{COMPANY.website.replace("https://", "")}</dd>
                </div>
              </dl>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-brand mb-3">Tätigkeit</h2>
              <p>{COMPANY.activity}</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-brand mb-3">Umsatzsteuer</h2>
              <p>{COMPANY.taxStatus}. Es wird daher keine Umsatzsteuer ausgewiesen.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-brand mb-3">
                Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
              </h2>
              <address className="not-italic space-y-0.5">
                <p>{COMPANY.responsibleForContent}</p>
                <p>{COMPANY.street}</p>
                <p>
                  {COMPANY.zip} {COMPANY.city}
                </p>
              </address>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-brand mb-3">
                Berufsbezeichnung und berufsrechtliche Regelungen
              </h2>
              <p>
                Berufsbezeichnung: IT-Dienstleister / Webentwickler
                <br />
                Verliehen in: {COMPANY.country}
              </p>
              <p className="mt-3">
                Es bestehen keine berufsrechtlichen Regelungen oder Kammerzugehörigkeiten, die für
                die ausgeübte Tätigkeit einschlägig sind.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-brand mb-3">EU-Streitschlichtung</h2>
              <p>
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS)
                bereit:{" "}
                <a
                  href="https://ec.europa.eu/consumers/odr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-blue hover:underline break-all"
                >
                  https://ec.europa.eu/consumers/odr/
                </a>
                .
              </p>
              <p className="mt-3">Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-brand mb-3">
                Verbraucherstreitbeilegung / Universalschlichtungsstelle
              </h2>
              <p>
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-brand mb-3">Haftung für Inhalte</h2>
              <p>
                Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen
                Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir
                als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
                Informationen zu überwachen oder nach Umständen zu forschen, die auf eine
                rechtswidrige Tätigkeit hinweisen.
              </p>
              <p className="mt-3">
                Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den
                allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist
                jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich.
                Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte
                umgehend entfernen.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-brand mb-3">Haftung für Links</h2>
              <p>
                Unser Angebot enthält gegebenenfalls Links zu externen Websites Dritter, auf deren
                Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch
                keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der
                jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
              </p>
              <p className="mt-3">
                Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche
                Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung
                nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist
                jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei
                Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-brand mb-3">Urheberrecht</h2>
              <p>
                Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
                unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung,
                Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes
                bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
              </p>
              <p className="mt-3">
                Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen
                Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt
                wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte
                Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine
                Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden
                Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte
                umgehend entfernen.
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
