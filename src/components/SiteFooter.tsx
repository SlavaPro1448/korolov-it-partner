import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { COMPANY } from "@/config/legal";

type Locale = "de" | "ru" | "ua";

export function SiteFooter({ locale = "de" }: { locale?: Locale }) {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-brand text-brand-foreground mt-24">
      <div className="container-page py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center font-bold">K</div>
            <div>
              <div className="font-semibold">Korolov IT-Service</div>
              <div className="text-xs text-white/60 uppercase tracking-wider">Leverkusen · NRW</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-white/70 max-w-md">
            {locale === "de"
              ? "Websites, IT-Support und digitale Lösungen für kleine Unternehmen."
              : locale === "ru"
                ? "Сайты, IT-поддержка и цифровые решения для малого бизнеса."
                : "Сайти, IT-підтримка та цифрові рішення для малого бізнесу."}
          </p>
        </div>

        <div>
          <div className="text-sm font-semibold mb-3">
            {locale === "de" ? "Kontakt" : locale === "ru" ? "Контакты" : "Контакти"}
          </div>
          <ul className="space-y-2 text-sm text-white/70">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> info@korolov-it-service.de</li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> {COMPANY.phoneDisplay}
            </li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Leverkusen, NRW</li>
          </ul>
        </div>

        <div>
          <div className="text-sm font-semibold mb-3">
            {locale === "de" ? "Rechtliches" : locale === "ru" ? "Правовая информация" : "Правова інформація"}
          </div>
          <ul className="space-y-2 text-sm text-white/70">
            <li>
              <Link to="/impressum" className="hover:text-white transition-colors">
                {locale === "de" ? "Impressum" : locale === "ru" ? "Выходные данные" : "Вихідні дані"}
              </Link>
            </li>
            <li>
              <Link to="/datenschutz" className="hover:text-white transition-colors">
                {locale === "de" ? "Datenschutz" : locale === "ru" ? "Конфиденциальность" : "Конфіденційність"}
              </Link>
            </li>
            <li>
              <Link to="/widerruf" className="hover:text-white transition-colors">
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
        <div className="container-page py-5 text-xs text-white/50 flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
          <div>
            © {year} Korolov IT-Service.{" "}
            {locale === "de" ? "Alle Rechte vorbehalten." : locale === "ru" ? "Все права защищены." : "Усі права захищені."}
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
