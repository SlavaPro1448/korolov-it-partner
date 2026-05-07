import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { COMPANY_DETAILS } from "@/config/legal";

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
  const hasUstId = Boolean(COMPANY_DETAILS.ustId);
  const lastUpdated = "07.05.2026";

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="container-page py-16 md:py-24 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-brand">Impressum</h1>
        <p className="mt-3 text-sm text-muted-foreground">Stand: {lastUpdated}</p>

        <section className="mt-10 space-y-6 text-sm leading-relaxed text-foreground/90">
          <div>
            <h2 className="font-semibold text-brand mb-1">Anbieter</h2>
            <p>
              {COMPANY_DETAILS.fullName}
              <br />
              {COMPANY_DETAILS.legalForm}
              <br />
              {COMPANY_DETAILS.street}
              <br />
              {COMPANY_DETAILS.zip} {COMPANY_DETAILS.city}
              <br />
              {COMPANY_DETAILS.country}
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-brand mb-1">Kontakt</h2>
            <p>
              Telefon: {COMPANY_DETAILS.phone}
              <br />
              E-Mail: {COMPANY_DETAILS.email}
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-brand mb-1">USt-IdNr.</h2>
            <p>
              {hasUstId
                ? COMPANY_DETAILS.ustId
                : "Keine USt-IdNr. (Kleinunternehmerregelung gemäß § 19 UStG)."}
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-brand mb-1">Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
            <p>{COMPANY_DETAILS.responsibleForContent}, Anschrift wie oben</p>
          </div>
          <div>
            <h2 className="font-semibold text-brand mb-1">EU-Streitbeilegung</h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
              <a className="text-accent-blue underline" href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noreferrer">
                https://ec.europa.eu/consumers/odr/
              </a>
              .
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-brand mb-1">Verbraucherschlichtung</h2>
            <p>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
