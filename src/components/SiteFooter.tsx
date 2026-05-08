import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, MessageCircle } from "lucide-react";
import { COMPANY } from "@/config/legal";

type Locale = "de" | "ru" | "ua";

const aria = {
  de: {
    contactHeading: "Kontakt",
    legalHeading: "Rechtliches",
    landmark: "Fußzeile",
    email: "E-Mail an Korolov IT-Service senden",
    phone: "Korolov IT-Service anrufen",
    whatsapp: "Korolov IT-Service über WhatsApp schreiben",
    impressum: "Impressum",
    datenschutz: "Datenschutz",
    widerruf: "Widerrufsbelehrung",
  },
  ru: {
    contactHeading: "Контакты",
    legalHeading: "Правовая информация",
    landmark: "Подвал сайта",
    email: "Отправить e-mail в Korolov IT-Service",
    phone: "Позвонить в Korolov IT-Service",
    whatsapp: "Написать в Korolov IT-Service через WhatsApp",
    impressum: "Выходные данные",
    datenschutz: "Конфиденциальность",
    widerruf: "Отзыв (потребители)",
  },
  ua: {
    contactHeading: "Контакти",
    legalHeading: "Правова інформація",
    landmark: "Підвал сайту",
    email: "Надіслати e-mail у Korolov IT-Service",
    phone: "Зателефонувати в Korolov IT-Service",
    whatsapp: "Написати в Korolov IT-Service через WhatsApp",
    impressum: "Вихідні дані",
    datenschutz: "Конфіденційність",
    widerruf: "Відкликання (споживачі)",
  },
} satisfies Record<Locale, Record<string, string>>;

export function SiteFooter({ locale = "de" }: { locale?: Locale }) {
  const year = new Date().getFullYear();
  const t = aria[locale];

  return (
    <footer className="bg-brand text-brand-foreground mt-24" aria-label={t.landmark}>
      <div className="container-page py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <div
              className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center font-bold"
              aria-hidden="true"
            >
              K
            </div>
            <div>
              <div className="font-semibold">Korolov IT-Service</div>
              <div className="text-xs text-white/80 uppercase tracking-wider">Leverkusen · NRW</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-white/85 max-w-md">
            {locale === "de"
              ? "Websites, IT-Support und digitale Lösungen für kleine Unternehmen."
              : locale === "ru"
                ? "Сайты, IT-поддержка и цифровые решения для малого бизнеса."
                : "Сайти, IT-підтримка та цифрові рішення для малого бізнесу."}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold mb-3">{t.contactHeading}</h2>
          <ul className="space-y-2 text-sm text-white/85">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" aria-hidden="true" />
              <a
                href={`mailto:${COMPANY.email}`}
                aria-label={t.email}
                className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue rounded-sm transition-colors"
              >
                {COMPANY.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4" aria-hidden="true" />
              <a
                href={COMPANY.phoneHref}
                aria-label={t.phone}
                className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue rounded-sm transition-colors"
              >
                {COMPANY.phoneDisplay}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              <a
                href={COMPANY.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t.whatsapp}
                className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue rounded-sm transition-colors"
              >
                WhatsApp
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              <span>Leverkusen, NRW</span>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold mb-3">{t.legalHeading}</h2>
          <ul className="space-y-2 text-sm text-white/85">
            <li>
              <Link
                to="/impressum"
                aria-label={t.impressum}
                className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue rounded-sm"
              >
                {t.impressum}
              </Link>
            </li>
            <li>
              <Link
                to="/datenschutz"
                aria-label={t.datenschutz}
                className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue rounded-sm"
              >
                {t.datenschutz}
              </Link>
            </li>
            <li>
              <Link
                to="/widerruf"
                aria-label={t.widerruf}
                className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue rounded-sm"
              >
                {locale === "de"
                  ? "Widerrufsbelehrung"
                  : locale === "ru"
                    ? "Отзыв (потребители)"
                    : "Відкликання (споживачі)"}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page py-5 text-xs text-white/70 flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
          <div>
            © {year} Korolov IT-Service.{" "}
            {locale === "de"
              ? "Alle Rechte vorbehalten."
              : locale === "ru"
                ? "Все права защищены."
                : "Усі права захищені."}
          </div>
          <div>
            {locale === "de"
              ? "Beratung auf Deutsch, Russisch und Ukrainisch möglich."
              : locale === "ru"
                ? "Консультации возможны на немецком, русском и украинском языках."
                : "Консультації можливі німецькою, російською та українською мовами."}
          </div>
        </div>
      </div>
    </footer>
  );
}
