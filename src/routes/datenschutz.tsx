import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { COMPANY_DETAILS } from "@/config/legal";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/datenschutz")({
  head: () => ({
    meta: buildSeoMeta({
      title: "Datenschutz | Korolov IT-Service",
      description: "Datenschutzerklärung von Korolov IT-Service.",
      path: "/datenschutz",
      locale: "de",
      noindex: true,
    }),
  }),
  component: DatenschutzPage,
});

function DatenschutzPage() {
  const lastUpdated = "07.05.2026";

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="container-page py-16 md:py-24 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-brand">Datenschutzerklärung</h1>
        <p className="mt-3 text-sm text-muted-foreground">Stand: {lastUpdated}</p>

        {/* TODO: текст должен быть сгенерирован через eRecht24/Datenschutz-Generator.de и проверен юристом */}
        <section className="mt-10 space-y-6 text-sm leading-relaxed text-foreground/90">
          <div>
            <h2 className="font-semibold text-brand mb-1">1. Verantwortlicher</h2>
            <p>
              {COMPANY_DETAILS.fullName}
              <br />
              {COMPANY_DETAILS.street}, {COMPANY_DETAILS.zip} {COMPANY_DETAILS.city}, {COMPANY_DETAILS.country}
              <br />
              E-Mail: {COMPANY_DETAILS.email}
              <br />
              Telefon: {COMPANY_DETAILS.phone}
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-brand mb-1">2. Hosting</h2>
            <p>
              Diese Website wird bei IONOS gehostet. Der Anbieter verarbeitet personenbezogene Daten im Rahmen
              der Bereitstellung und Sicherheit der Website auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-brand mb-1">3. Server-Logs</h2>
            <p>
              Beim Aufruf dieser Website werden automatisch Server-Log-Dateien erfasst (z. B. IP-Adresse,
              Datum/Uhrzeit, aufgerufene Seite, User-Agent, Referrer). Die Verarbeitung erfolgt zur
              Sicherstellung des technischen Betriebs und der IT-Sicherheit (Art. 6 Abs. 1 lit. f DSGVO).
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-brand mb-1">4. Kontaktformular</h2>
            <p>
              Bei Nutzung des Kontaktformulars werden die eingegebenen Daten zur Bearbeitung Ihrer Anfrage
              verarbeitet (Art. 6 Abs. 1 lit. b und/oder lit. f DSGVO). Für den Versand wird formsubmit.co als
              Auftragsverarbeiter eingesetzt. Weitere Informationen:
              {" "}
              <a className="text-accent-blue underline" href="https://formsubmit.co/privacy.pdf" target="_blank" rel="noreferrer">
                https://formsubmit.co/privacy.pdf
              </a>
              .
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-brand mb-1">5. Cookies</h2>
            <p>Diese Website verwendet keine Cookies, die nicht technisch notwendig sind.</p>
          </div>
          <div>
            <h2 className="font-semibold text-brand mb-1">6. Schriftarten</h2>
            <p>
              Diese Website verwendet Bunny Fonts. Der Dienst gilt als DSGVO-konform; es erfolgt keine
              Uebermittlung personenbezogener Daten in die USA.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-brand mb-1">7. Betroffenenrechte (Art. 15-21 DSGVO)</h2>
            <p>
              Sie haben das Recht auf Auskunft, Berichtigung, Loeschung, Einschraenkung der Verarbeitung,
              Datenuebertragbarkeit sowie Widerspruch gegen die Verarbeitung Ihrer Daten. Zudem besteht ein
              Beschwerderecht bei einer Datenschutz-Aufsichtsbehoerde.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
