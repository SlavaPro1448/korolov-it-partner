import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/datenschutz")({
  head: () => ({
    meta: [
      { title: "Datenschutz | Korolov IT-Service" },
      { name: "description", content: "Datenschutzerklärung von Korolov IT-Service." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DatenschutzPage,
});

function DatenschutzPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="container-page py-16 md:py-24 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-brand">Datenschutzerklärung</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Hinweis: Dies ist ein Platzhalter. Bitte lassen Sie eine vollständige Datenschutzerklärung über
          einen spezialisierten Generator oder durch juristische Beratung erstellen und prüfen.
        </p>

        {/* TODO: Vollständige Datenschutzerklärung einsetzen (Verantwortlicher, Hosting, Server-Logs, Kontaktformular, Cookies, Rechte der Betroffenen, etc.) */}
        <section className="mt-10 space-y-6 text-sm leading-relaxed text-foreground/90">
          <div>
            <h2 className="font-semibold text-brand mb-1">1. Verantwortlicher</h2>
            <p>
              Korolov IT-Service, Viacheslav Korolov, [Anschrift], info@korolov-it-service.de
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-brand mb-1">2. Erhebung allgemeiner Informationen</h2>
            <p>
              Beim Aufruf dieser Website werden automatisch Informationen technischer Art erfasst (z. B. IP-Adresse, Browser, Zeitpunkt). [Details ergänzen.]
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-brand mb-1">3. Kontaktformular</h2>
            <p>
              Bei Nutzung des Kontaktformulars werden Ihre Angaben zur Bearbeitung der Anfrage verarbeitet. Rechtsgrundlage: Art. 6 Abs. 1 lit. b/f DSGVO. [Details ergänzen.]
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-brand mb-1">4. Ihre Rechte</h2>
            <p>
              Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerruf und Widerspruch sowie das Recht auf Beschwerde bei einer Aufsichtsbehörde.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
