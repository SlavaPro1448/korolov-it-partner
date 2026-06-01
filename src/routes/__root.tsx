import { Outlet, Link, createRootRoute, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function getSkipLinkLabel(pathname: string): string {
  if (pathname.startsWith("/ru")) return "Перейти к содержимому";
  if (pathname.startsWith("/uk") || pathname.startsWith("/ua")) return "Перейти до вмісту";
  return "Zum Inhalt springen";
}

function getLangAttr(pathname: string): string {
  if (pathname.startsWith("/ru")) return "ru";
  if (pathname.startsWith("/uk") || pathname.startsWith("/ua")) return "uk";
  return "de";
}

function RootComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = getLangAttr(pathname);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedY = sessionStorage.getItem("__lang_scrollY");
    if (savedY) {
      sessionStorage.removeItem("__lang_scrollY");
      const y = parseInt(savedY, 10);
      requestAnimationFrame(() => {
        window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior });
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const selector = [
      "main section",
      "main article header",
      "main article > a:first-of-type",
      "main article .space-y-10 > p:last-child",
      "main [data-reveal]",
    ].join(", ");

    const targets = document.querySelectorAll<HTMLElement>(selector);

    // Phase 1: batch reads (no DOM writes yet → no forced reflow)
    const innerHeight = window.innerHeight;
    const aboveFold = new WeakSet<HTMLElement>();
    if (!reduce) {
      targets.forEach((el) => {
        if (el.getBoundingClientRect().top < innerHeight * 0.9) {
          aboveFold.add(el);
        }
      });
    }

    // Phase 2: batch writes (and observe what's left)
    const io = reduce
      ? null
      : new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("reveal-visible");
                io?.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.08, rootMargin: "0px 0px -80px 0px" },
        );

    targets.forEach((el) => {
      if (!el.classList.contains("reveal")) {
        el.classList.add("reveal", "reveal-up");
      }
      if (reduce || aboveFold.has(el)) {
        el.classList.add("reveal-visible");
      } else {
        io?.observe(el);
      }
    });

    return () => io?.disconnect();
  }, [pathname]);

  return (
    <>
      <a href="#main" className="skip-link">
        {getSkipLinkLabel(pathname)}
      </a>
      <Outlet />
    </>
  );
}
