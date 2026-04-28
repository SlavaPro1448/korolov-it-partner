import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

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
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Korolov IT-Service | Websites & IT-Support in Leverkusen" },
      {
        name: "description",
        content:
          "Korolov IT-Service unterstützt kleine Unternehmen in Leverkusen, Köln und NRW bei Websites, E-Mail, Hosting, IT-Support und digitaler Organisation.",
      },
      { name: "theme-color", content: "#0F2742" },
      { property: "og:site_name", content: "Korolov IT-Service" },
      { property: "og:locale", content: "de_DE" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Korolov IT-Service | Websites & IT-Support in Leverkusen" },
      { name: "twitter:title", content: "Korolov IT-Service | Websites & IT-Support in Leverkusen" },
      { name: "description", content: "Korolov IT-Service offers comprehensive website creation, IT support, and digital solutions for small businesses." },
      { property: "og:description", content: "Korolov IT-Service offers comprehensive website creation, IT support, and digital solutions for small businesses." },
      { name: "twitter:description", content: "Korolov IT-Service offers comprehensive website creation, IT support, and digital solutions for small businesses." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/67d8d01e-0917-4a59-82f5-64087957bb1f/id-preview-20882890--3e887d69-db79-44f1-9766-b2e284c2c8e2.lovable.app-1777413100973.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/67d8d01e-0917-4a59-82f5-64087957bb1f/id-preview-20882890--3e887d69-db79-44f1-9766-b2e284c2c8e2.lovable.app-1777413100973.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.bunny.net" },
      {
        rel: "stylesheet",
        href: "https://fonts.bunny.net/css?family=inter:400,500,600,700,800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
