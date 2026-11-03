import Link from "next/link";
import { site } from "@/lib/site";
import { addressLine, mapsUrl } from "@/content/business";
import { phoneDisplay, phoneHref } from "@/lib/whatsapp";
import { Logo } from "@/components/Logo/Logo";

/**
 * Footer with the brand mark, address and contacts, areas served (local SEO
 * context), legal links, the business's legal identity (VAT number is
 * mandatory on an Italian business website) and the author credit.
 */
export function Footer() {
  const year = new Date().getFullYear();
  const phone = phoneDisplay();

  return (
    <footer className="mt-20 border-t border-white/10 bg-[#0c0812]/60 backdrop-blur">
      <div className="mx-auto max-w-5xl px-5 pb-28 pt-10 sm:px-8 md:pb-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div>
            <Logo size={40} />
            <p className="mt-3 max-w-sm text-sm text-white/70">{site.tagline}</p>
            <address className="mt-4 space-y-1 text-sm not-italic text-white/70">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block transition hover:text-white"
              >
                {addressLine}
              </a>
              {phone && (
                <a href={phoneHref()} className="block tabular-nums transition hover:text-white">
                  {phone}
                </a>
              )}
            </address>
            <p className="mt-3 text-sm text-white/55">Zona: {site.areasServed.join(" · ")}</p>
          </div>
          <nav aria-label="Link legali" className="flex flex-col gap-2 text-sm text-white/70">
            <Link href="/privacy" className="transition hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/cookie-policy" className="transition hover:text-white">
              Cookie Policy
            </Link>
            <Link href="/#contatti" className="transition hover:text-white">
              Contatti
            </Link>
          </nav>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.legal.name} — {site.legal.form} — P.IVA {site.legal.vatNumber}
          </p>
          <p>
            Sito creato da{" "}
            <a
              href={site.author.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 transition hover:text-white"
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
