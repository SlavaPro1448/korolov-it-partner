import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { COMPANY, formatLegalDate } from "@/config/legal";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/structured-data";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/widerruf")({
  head: () => ({
    meta: buildSeoMeta({
      title: "Widerrufsbelehrung | Korolov IT-Service",
      description: "Widerrufsbelehrung für Verbraucher gemäß § 312g BGB.",
      path: "/widerruf",
      locale: "de",
    }),
  }),
  component: WiderrufPage,
});

function WiderrufPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Startseite", item: "https://korolov-it-service.de/" },
          {
            name: "Widerrufsbelehrung",
            item: "https://korolov-it-service.de/widerruf",
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
            <h1 className="mt-3 text-3xl md:text-4xl font-bold text-brand">Widerrufsbelehrung</h1>
            <p className="mt-3 text-sm text-muted-foreground">Für Verbraucher gemäß § 312g BGB</p>
          </header>

          <div className="space-y-10 text-foreground/90 leading-relaxed">
            <section className="rounded-lg border border-border bg-section p-5">
              <p className="text-sm">
                <strong>Hinweis:</strong> Die folgende Widerrufsbelehrung gilt ausschließlich für{" "}
                <strong>Verbraucher im Sinne von § 13 BGB</strong>, d. h. natürliche Personen, die
                ein Rechtsgeschäft zu überwiegend privaten Zwecken abschließen. Für Unternehmer (§
                14 BGB) besteht kein gesetzliches Widerrufsrecht.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-brand mb-3">Widerrufsrecht</h2>
              <p>
                Sie haben das Recht, binnen <strong>vierzehn Tagen</strong> ohne Angabe von Gründen
                diesen Vertrag zu widerrufen.
              </p>
              <p className="mt-3">
                Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.
              </p>
              <p className="mt-3">Um Ihr Widerrufsrecht auszuüben, müssen Sie mich</p>
              <address className="not-italic mt-4 mb-4 rounded-lg border border-border bg-section p-4 space-y-0.5">
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
              <p>
                mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder
                eine E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie
                können dafür das untenstehende Muster-Widerrufsformular verwenden, das jedoch nicht
                vorgeschrieben ist.
              </p>
              <p className="mt-3">
                Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die
                Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-brand mb-3">Folgen des Widerrufs</h2>
              <p>
                Wenn Sie diesen Vertrag widerrufen, habe ich Ihnen alle Zahlungen, die ich von Ihnen
                erhalten habe, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen
                Kosten, die sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von
                mir angebotene, günstigste Standardlieferung gewählt haben), unverzüglich und
                spätestens binnen <strong>vierzehn Tagen</strong> ab dem Tag zurückzuzahlen, an dem
                die Mitteilung über Ihren Widerruf dieses Vertrags bei mir eingegangen ist.
              </p>
              <p className="mt-3">
                Für diese Rückzahlung verwende ich dasselbe Zahlungsmittel, das Sie bei der
                ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde
                ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser
                Rückzahlung Entgelte berechnet.
              </p>
              <p className="mt-3">
                Haben Sie verlangt, dass die Dienstleistungen während der Widerrufsfrist beginnen
                sollen, so haben Sie mir einen angemessenen Betrag zu zahlen, der dem Anteil der bis
                zu dem Zeitpunkt, zu dem Sie mich von der Ausübung des Widerrufsrechts hinsichtlich
                dieses Vertrags unterrichten, bereits erbrachten Dienstleistungen im Vergleich zum
                Gesamtumfang der im Vertrag vorgesehenen Dienstleistungen entspricht.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-brand mb-3">
                Erlöschen des Widerrufsrechts
              </h2>
              <p>
                Das Widerrufsrecht erlischt bei einem Vertrag zur Erbringung von Dienstleistungen
                auch, wenn ich die Dienstleistung vollständig erbracht habe und mit der Ausführung
                der Dienstleistung erst begonnen habe, nachdem Sie dazu Ihre ausdrückliche
                Zustimmung gegeben und gleichzeitig Ihre Kenntnis davon bestätigt haben, dass Sie
                Ihr Widerrufsrecht bei vollständiger Vertragserfüllung durch mich verlieren (§ 356
                Abs. 4 BGB).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-brand mb-3">Muster-Widerrufsformular</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Wenn Sie den Vertrag widerrufen wollen, können Sie dieses Formular ausfüllen und
                zurücksenden.
              </p>
              <div className="rounded-lg border border-border bg-section p-6 text-sm space-y-3">
                <p>An:</p>
                <address className="not-italic">
                  <p>{COMPANY.legalName}</p>
                  <p>{COMPANY.tradeName}</p>
                  <p>{COMPANY.street}</p>
                  <p>
                    {COMPANY.zip} {COMPANY.city}
                  </p>
                  <p>E-Mail: {COMPANY.email}</p>
                </address>
                <hr className="border-border my-4" />
                <p>
                  Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über
                  die Erbringung der folgenden Dienstleistung:
                </p>
                <p className="text-muted-foreground">___________________________________________</p>
                <p>Bestellt am (*)/erhalten am (*):</p>
                <p className="text-muted-foreground">___________________________________________</p>
                <p>Name des/der Verbraucher(s):</p>
                <p className="text-muted-foreground">___________________________________________</p>
                <p>Anschrift des/der Verbraucher(s):</p>
                <p className="text-muted-foreground">___________________________________________</p>
                <p>Datum, Unterschrift des/der Verbraucher(s):</p>
                <p className="text-muted-foreground">___________________________________________</p>
                <p className="pt-3 text-xs text-muted-foreground">(*) Unzutreffendes streichen.</p>
              </div>
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
