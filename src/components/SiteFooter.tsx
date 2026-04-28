import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";

export function SiteFooter() {
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
            Websites, IT-Support und digitale Lösungen für kleine Unternehmen.
          </p>
        </div>

        <div>
          <div className="text-sm font-semibold mb-3">Kontakt</div>
          <ul className="space-y-2 text-sm text-white/70">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> info@korolov-it-service.de</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +49 …</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Leverkusen, NRW</li>
          </ul>
        </div>

        <div>
          <div className="text-sm font-semibold mb-3">Rechtliches</div>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/impressum" className="hover:text-white transition-colors">Impressum</Link></li>
            <li><Link to="/datenschutz" className="hover:text-white transition-colors">Datenschutz</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page py-5 text-xs text-white/50 flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
          <div>© {year} Korolov IT-Service. Alle Rechte vorbehalten.</div>
          <div>Beratung auf Deutsch, Russisch und Ukrainisch möglich.</div>
        </div>
      </div>
    </footer>
  );
}
