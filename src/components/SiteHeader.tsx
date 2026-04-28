import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Leistungen", href: "/#leistungen" },
  { label: "Für wen", href: "/#fuer-wen" },
  { label: "Preise", href: "/#preise" },
  { label: "Ablauf", href: "/#ablauf" },
  { label: "Referenzen", href: "/#referenzen" },
  { label: "Über mich", href: "/#ueber-mich" },
  { label: "Kontakt", href: "/#kontakt" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all ${
        scrolled
          ? "bg-background/85 backdrop-blur border-b border-border"
          : "bg-background/60 backdrop-blur-sm"
      }`}
    >
      <div className="container-page flex h-16 md:h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-lg bg-brand flex items-center justify-center text-brand-foreground font-bold">
            K
          </div>
          <div className="leading-tight">
            <div className="font-semibold text-brand">Korolov</div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">IT-Service</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {navItems.map((it) => (
            <a
              key={it.href}
              href={it.href}
              className="text-sm text-foreground/80 hover:text-accent-blue transition-colors"
            >
              {it.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <span className="hidden xl:inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Languages className="h-3.5 w-3.5" />
            DE · RU · UA
          </span>
          <Button asChild variant="brand" size="sm">
            <a href="/#kontakt">Kostenloses Erstgespräch</a>
          </Button>
        </div>

        <button
          className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-md border border-border"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menü öffnen"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container-page py-4 flex flex-col gap-1">
            {navItems.map((it) => (
              <a
                key={it.href}
                href={it.href}
                onClick={() => setOpen(false)}
                className="px-2 py-2.5 rounded-md text-sm hover:bg-section"
              >
                {it.label}
              </a>
            ))}
            <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground px-2">
              <Languages className="h-3.5 w-3.5" />
              Beratung auf Deutsch, Russisch & Ukrainisch
            </div>
            <Button asChild variant="brand" className="mt-3">
              <a href="/#kontakt" onClick={() => setOpen(false)}>
                Kostenloses Erstgespräch
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
