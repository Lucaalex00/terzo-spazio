import { CHAKRAS, CHAKRA_BY_SECTION } from "@/lib/chakras";
import { site } from "@/lib/site";
import { services } from "@/content/services";
import { news } from "@/content/news";
import { courses } from "@/content/courses";
import { openingHours, closures } from "@/content/business";
import { Section } from "@/components/Section/Section";
import { BookingBridge } from "@/components/BookingBridge/BookingBridge";
import { bookingHref } from "@/lib/whatsapp";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Home() {
  return (
    <>
      {/* 1 — Benvenuto (Root) */}
      <Section chakra={CHAKRA_BY_SECTION.benvenuto}>
        <p className="font-display text-4xl leading-tight text-neutral-900 sm:text-5xl">
          {site.name}
        </p>
        <p className="mt-4 max-w-prose text-lg text-neutral-700">{site.tagline}</p>
        <p className="mt-4 max-w-prose text-neutral-600">
          Un luogo di cura a {site.areasServed.join(", ")}: trattamenti su misura, ascolto e un
          ritmo lento. Scorri per scoprire i servizi, il percorso di {site.owner} e i corsi — e
          quando vuoi, prenota in un tocco.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#contatti"
            className="rounded-full px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
            style={{ backgroundColor: "var(--accent)" }}
          >
            Prenota il tuo momento
          </a>
          <a
            href="#servizi"
            className="rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-white"
          >
            Scopri i servizi
          </a>
        </div>
      </Section>

      {/* 2 — Servizi (Sacral) */}
      <Section chakra={CHAKRA_BY_SECTION.servizi}>
        <ul className="grid gap-4 sm:grid-cols-2">
          {services.map((s) => (
            <li
              key={s.slug}
              className="flex flex-col rounded-2xl border border-black/5 bg-white/80 p-5 shadow-sm backdrop-blur"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-xl text-neutral-900">
                  <span className="mr-2" aria-hidden>
                    {s.icon}
                  </span>
                  {s.name}
                </h3>
                {s.duration && (
                  <span className="whitespace-nowrap text-xs text-neutral-500">{s.duration}</span>
                )}
              </div>
              <p className="mt-2 flex-1 text-sm text-neutral-600">{s.summary}</p>
              <div className="mt-4 flex items-center justify-between">
                {s.price && <span className="text-sm font-medium text-neutral-800">{s.price}</span>}
                <a
                  href={bookingHref(s.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto text-sm font-semibold transition hover:opacity-80"
                  style={{ color: "var(--accent)" }}
                >
                  Prenota →
                </a>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* 3 — Percorso & News (Solar) */}
      <Section chakra={CHAKRA_BY_SECTION.percorso}>
        <ol className="relative space-y-6 border-l border-neutral-200 pl-6">
          {news.map((post) => (
            <li key={post.slug} className="relative">
              <span
                className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full"
                style={{ backgroundColor: "var(--accent)" }}
                aria-hidden
              />
              <time className="text-xs uppercase tracking-wide text-neutral-500">
                {formatDate(post.date)}
              </time>
              <h3 className="mt-1 font-display text-xl text-neutral-900">{post.title}</h3>
              <p className="mt-1 text-sm text-neutral-600">{post.excerpt}</p>
              {post.body?.map((p, i) => (
                <p key={i} className="mt-2 text-sm text-neutral-600">
                  {p}
                </p>
              ))}
            </li>
          ))}
        </ol>
      </Section>

      {/* 4 — Corsi (Heart) */}
      <Section chakra={CHAKRA_BY_SECTION.corsi}>
        <ul className="grid gap-4 sm:grid-cols-2">
          {courses.map((c) => (
            <li
              key={c.slug}
              className="rounded-2xl border border-black/5 bg-white/80 p-5 shadow-sm backdrop-blur"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-xl text-neutral-900">{c.title}</h3>
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{
                    backgroundColor: c.open
                      ? "color-mix(in srgb, var(--accent) 15%, white)"
                      : "#f3f4f6",
                    color: c.open ? "var(--accent)" : "#6b7280",
                  }}
                >
                  {c.open ? "Attivo" : "In arrivo"}
                </span>
              </div>
              <p className="mt-2 text-sm text-neutral-600">{c.summary}</p>
              {c.when && <p className="mt-3 text-xs text-neutral-500">{c.when}</p>}
            </li>
          ))}
        </ul>
      </Section>

      {/* 5 — Contatti & Prenota (Throat) */}
      <Section chakra={CHAKRA_BY_SECTION.contatti}>
        <div className="grid gap-8 md:grid-cols-2">
          <BookingBridge />
          <div className="rounded-2xl border border-black/5 bg-white/80 p-5 shadow-sm backdrop-blur">
            <h3 className="font-display text-lg text-neutral-900">Orari</h3>
            <ul className="mt-3 space-y-1 text-sm">
              {openingHours.map((d) => (
                <li key={d.day} className="flex justify-between">
                  <span className="text-neutral-700">{d.day}</span>
                  <span
                    className={
                      d.hours.toLowerCase() === "chiuso" ? "text-neutral-400" : "text-neutral-800"
                    }
                  >
                    {d.hours}
                  </span>
                </li>
              ))}
            </ul>

            {closures.length > 0 && (
              <>
                <h4 className="mt-5 text-sm font-semibold text-neutral-800">Giorni di chiusura</h4>
                <ul className="mt-2 space-y-1 text-sm text-neutral-600">
                  {closures.map((c) => (
                    <li key={c.date}>
                      {formatDate(c.date)}
                      {c.note ? ` — ${c.note}` : ""}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {Object.values(site.social).some(Boolean) && (
              <div className="mt-5 flex flex-wrap gap-3 text-sm">
                {site.social.instagram && (
                  <a
                    href={site.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2"
                    style={{ color: "var(--accent)" }}
                  >
                    Instagram
                  </a>
                )}
                {site.social.facebook && (
                  <a
                    href={site.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2"
                    style={{ color: "var(--accent)" }}
                  >
                    Facebook
                  </a>
                )}
                {site.social.tiktok && (
                  <a
                    href={site.social.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2"
                    style={{ color: "var(--accent)" }}
                  >
                    TikTok
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Keep a reference to all chakras for future nav generation. */}
      <span className="sr-only">{CHAKRAS.map((c) => c.label).join(", ")}</span>
    </>
  );
}
