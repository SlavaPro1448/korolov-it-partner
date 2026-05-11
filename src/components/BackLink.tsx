import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

type BackLinkProps = {
  to?: string;
  label?: string;
  className?: string;
};

export function BackLink({
  to = "/",
  label = "Zurück zur Startseite",
  className,
}: BackLinkProps) {
  return (
    <Link
      to={to}
      aria-label={label}
      className={`group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-accent-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm ${className ?? ""}`}
    >
      <ArrowLeft
        className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
        aria-hidden="true"
      />
      <span>{label}</span>
    </Link>
  );
}
