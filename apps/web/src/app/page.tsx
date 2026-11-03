import { CHAKRA_BY_SECTION } from "@/lib/chakras";
import { site } from "@/lib/site";
import { services } from "@/content/services";
import { news } from "@/content/news";
import { courses } from "@/content/courses";
import { openingHours, closures, addressLine, mapsUrl } from "@/content/business";
import { Hero } from "@/components/Hero/Hero";
import { Section } from "@/components/Section/Section";
import { Reveal } from "@/components/Reveal/Reveal";
import { BookingBridge } from "@/components/BookingBridge/BookingBridge";
import { bookingHref, phoneDisplay, phoneHref } from "@/lib/whatsapp";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const socialLinks = [
  { label: "Instagram", href: site.social.instagram },
  { label: "Facebook", href: site.social.facebook },
  { label: "TikTok", href: site.social.tiktok },
].filter((s) => s.href);

export default function Home() {
  const phone = phoneDisplay();
  return (
    <>
      {/* 1 — Benvenuto (Muladhara) */}
      <Hero />

      {/* 2 — Servizi (Svadhisthana) */}
      <Section chakra={CHAKRA_BY_SECTION.servizi}>
        <ul className="grid gap-4 sm:grid-cols-2">
          {services.map((s, i) => (
            <Reveal as="li" key={s.slug} index={i} className="chakra-card flex flex-col p-6">
              <div className="flex items-baseline justify-between gap-4">
                <span
                  className="text-xs font-medium tabular-nums tracking-[0.25em]"
                  style={{ color: "var(--accent)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s.duration && (
                  <span className="text-[11px] uppercase tracking-[0.15em] text-white/55">
                    {s.duration}
                  </span>
                )}
              </div>
              <h3 className="mt-3 text-balance font-display text-2xl text-white">{s.name}</h3>
              <p className="mt-2 flex-1 text-pretty text-sm leading-relaxed text-white/70">
                {s.summary}
              </p>
              <div className="mt-5 flex items-center justify-between">
                {s.price && <span className="text-sm font-medium text-white/90">{s.price}</span>}
                <a
                  href={bookingHref(s.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-arrow ml-auto"
                >
                  Prenota
                </a>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* 3 — Percorso & News (Manipura) */}
      <Section chakra={CHAKRA_BY_SECTION.percorso}>
        <ol className="relative space-y-6 pl-8">
          <span
            aria-hidden
            className="absolute bottom-2 left-[7px] top-2 w-px"
            style={{ background: "linear-gradient(to bottom, var(--glow), transparent)" }}
          />
          {news.map((post, i) => (
            <Reveal as="li" key={post.slug} index={i} className="relative">
              <span
                aria-hidden
                className="absolute -left-8 top-2 h-[15px] w-[15px] rounded-full border-2 border-[#0c0812]"
                style={{ backgroundColor: "var(--glow)", boxShadow: "0 0 14px var(--glow)" }}
              />
              <div className="chakra-card p-6">
                <time
                  dateTime={post.date}
                  className="text-[11px] uppercase tracking-[0.2em]"
                  style={{ color: "var(--accent)" }}
                >
                  {formatDate(post.date)}
                </time>
                <h3 className="mt-2 text-balance font-display text-2xl text-white">{post.title}</h3>
                <p className="mt-2 text-pretty text-sm leading-relaxed text-white/70">
                  {post.excerpt}
                </p>
                {post.body?.map((p, j) => (
                  <p key={j} className="mt-2 text-pretty text-sm leading-relaxed text-white/70">
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* 4 — Corsi (Anahata) */}
      <Section chakra={CHAKRA_BY_SECTION.corsi}>
        <ul className="grid gap-4 sm:grid-cols-2">
          {courses.map((c, i) => (
            <Reveal as="li" key={c.slug} index={i} className="chakra-card p-6">
              <span
                className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.15em]"
                style={{
                  backgroundColor: c.open
                    ? "color-mix(in srgb, var(--glow) 22%, transparent)"
                    : "rgba(255,255,255,0.08)",
                  color: c.open ? "var(--accent)" : "rgba(255,255,255,0.6)",
                }}
              >
                <span
                  aria-hidden
                  className={`h-1.5 w-1.5 rounded-full ${c.open ? "chakra-blink" : ""}`}
                  style={{ backgroundColor: c.open ? "var(--glow)" : "rgba(255,255,255,0.4)" }}
                />
                {c.open ? "Iscrizioni aperte" : "In arrivo"}
              </span>
              <h3 className="mt-4 text-balance font-display text-2xl text-white">{c.title}</h3>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-white/70">{c.summary}</p>
              {c.when && (
                <p className="mt-4 text-[11px] uppercase tracking-[0.15em] text-white/55">
                  {c.when}
                </p>
              )}
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* 5 — Contatti & Prenota (Vishuddha) */}
      <Section chakra={CHAKRA_BY_SECTION.contatti}>
        <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <BookingBridge />
          </Reveal>
          <Reveal index={1} className="chakra-card p-6">
            <h3 className="font-display text-xl text-white">Dove siamo</h3>
            <address className="mt-3 space-y-2 text-sm not-italic text-white/80">
              <p>{addressLine}</p>
              <div className="flex flex-wrap gap-2">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost px-4 py-2 text-xs"
                >
                  Apri in Maps
                </a>
                {phone && (
                  <a href={phoneHref()} className="btn-ghost px-4 py-2 text-xs tabular-nums">
                    {phone}
                  </a>
                )}
              </div>
            </address>

            <h3 className="mt-8 font-display text-xl text-white">Orari</h3>
            <ul className="mt-4 divide-y divide-white/10 text-sm">
              {openingHours.map((d) => {
                const closed = d.hours.toLowerCase() === "chiuso";
                return (
                  <li key={d.day} className="flex justify-between py-2">
                    <span className="text-white/80">{d.day}</span>
                    <span className={closed ? "text-white/40" : "tabular-nums text-white"}>
                      {d.hours}
                    </span>
                  </li>
                );
              })}
            </ul>

            {closures.length > 0 && (
              <>
                <h4 className="mt-6 text-sm font-semibold text-white/90">Giorni di chiusura</h4>
                <ul className="mt-2 space-y-1 text-sm text-white/70">
                  {closures.map((c) => (
                    <li key={c.date}>
                      {formatDate(c.date)}
                      {c.note ? ` — ${c.note}` : ""}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {socialLinks.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost px-4 py-2 text-xs"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            )}
          </Reveal>
        </div>
      </Section>
    </>
  );
}
