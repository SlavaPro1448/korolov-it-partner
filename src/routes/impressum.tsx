import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/impressum")({
  head: () => ({
    meta: [
      { title: "Impressum | Korolov IT-Service" },
      { name: "description", content: "Impressum von Korolov IT-Service." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ImpressumPage,
});

function ImpressumPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="container-page py-16 md:py-24 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-brand">Impressum</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Hinweis: Dies ist ein Platzhalter. Bitte ergänzen Sie die rechtlich erforderlichen Angaben gemäß § 52 TMG.
        </p>

        {/* TODO: Echte Anbieterkennzeichnung einsetzen (Name, Anschrift, Kontakt, USt-ID falls zutreffend, etc.) */}
        <section className="mt-10 space-y-6 text-sm leading-relaxed text-foreground/90">
          <div>
            <h2 className="font-semibold text-brand mb-1">Anbieter</h2>
            <p>
              Korolov IT-Service<br />
              Viacheslav Korolov<br />
              [Straße und Hausnummer]<br />
              [PLZ] Leverkusen<br />
              Deutschland
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-brand mb-1">Kontakt</h2>
            <p>
              Telefon: +49 …<br />
              E-Mail: info@korolov-it-service.de
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-brand mb-1">Umsatzsteuer-ID</h2>
            <p>[USt-IdNr. gemäß § 27 a UStG, falls vorhanden]</p>
          </div>
          <div>
            <h2 className="font-semibold text-brand mb-1">Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
            <p>Viacheslav Korolov, Anschrift wie oben</p>
          </div>
          <div>
            <h2 className="font-semibold text-brand mb-1">Streitschlichtung</h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
              <a className="text-accent-blue underline" href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noreferrer">
                https://ec.europa.eu/consumers/odr/
              </a>
              . Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
