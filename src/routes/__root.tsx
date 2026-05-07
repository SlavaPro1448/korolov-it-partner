import { Outlet, Link, createRootRoute } from "@tanstack/react-router";
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
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
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

function RootComponent() {
  // Restore scroll position after language switch
  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedY = sessionStorage.getItem("__lang_scrollY");
    if (savedY) {
      sessionStorage.removeItem("__lang_scrollY");
      const y = parseInt(savedY, 10);
      // Wait for layout to settle, then scroll
      requestAnimationFrame(() => {
        window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior });
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const targets = document.querySelectorAll<HTMLElement>(
      "main section, section, [data-reveal]",
    );

    targets.forEach((el) => {
      if (!el.classList.contains("reveal")) {
        el.classList.add("reveal", "reveal-up");
      }
    });

    if (reduce) {
      targets.forEach((el) => el.classList.add("reveal-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -80px 0px" },
    );

    targets.forEach((el) => {
      const rect = el.getBoundingClientRect();
      // Already in view on initial load → reveal immediately (e.g. hero)
      if (rect.top < window.innerHeight * 0.9) {
        el.classList.add("reveal-visible");
      } else {
        io.observe(el);
      }
    });

    return () => io.disconnect();
  }, []);

  return <Outlet />;
}
