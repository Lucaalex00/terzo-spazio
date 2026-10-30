import Link from "next/link";
import { site } from "@/lib/site";

/**
 * Footer with legal links, areas served (good for local SEO context) and the
 * author credit linking to the creator's GitHub.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-black/5 bg-white/60 backdrop-blur">
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
          <div>
            <p className="font-display text-lg font-semibold text-neutral-900">{site.name}</p>
            <p className="mt-1 max-w-sm text-sm text-neutral-600">{site.tagline}</p>
            <p className="mt-2 text-sm text-neutral-500">Zona: {site.areasServed.join(" · ")}</p>
          </div>
          <nav aria-label="Link legali" className="flex flex-col gap-2 text-sm text-neutral-600">
            <Link href="/privacy" className="transition hover:text-neutral-900">
              Privacy Policy
            </Link>
            <Link href="/cookie-policy" className="transition hover:text-neutral-900">
              Cookie Policy
            </Link>
            <a href="#contatti" className="transition hover:text-neutral-900">
              Contatti
            </a>
          </nav>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-black/5 pt-6 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. Tutti i diritti riservati.
          </p>
          <p>
            Sito creato da{" "}
            <a
              href={site.author.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 transition hover:text-neutral-900"
            >
              {site.author.name}
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
