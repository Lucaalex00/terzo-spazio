import { site } from "@/lib/site";
import { address, openingHours } from "@/content/business";

/**
 * LocalBusiness (BeautySalon) structured data for local SEO. Helps search
 * engines connect the site to "estetista Canelli / Costigliole / Asti" queries.
 * Rendered as a server component in the root layout.
 */

/** schema.org expects English day names. */
const DAY_OF_WEEK: Record<string, string> = {
  Lunedì: "Monday",
  Martedì: "Tuesday",
  Mercoledì: "Wednesday",
  Giovedì: "Thursday",
  Venerdì: "Friday",
  Sabato: "Saturday",
  Domenica: "Sunday",
};

export function JsonLd() {
  const openingHoursSpecification = openingHours.flatMap((d) => {
    // "09:00 – 18:00" → opens 09:00, closes 18:00; "Chiuso" is skipped.
    const times = d.hours.match(/(\d{1,2}:\d{2})\s*[–-]\s*(\d{1,2}:\d{2})/);
    if (!times || !DAY_OF_WEEK[d.day]) return [];
    return [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${DAY_OF_WEEK[d.day]}`,
        opens: times[1],
        closes: times[2],
      },
    ];
  });

  const data = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: site.name,
    legalName: site.legal.name,
    vatID: `IT${site.legal.vatNumber}`,
    description: site.description,
    url: site.url,
    image: `${site.url}/brand/og.png`,
    logo: `${site.url}/brand/logo-light-bg.png`,
    areaServed: site.areasServed.map((name) => ({ "@type": "City", name })),
    founder: { "@type": "Person", name: site.owner },
    knowsLanguage: "it-IT",
    ...(site.whatsappNumber ? { telephone: `+${site.whatsappNumber.replace(/\D/g, "")}` } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: address.street,
      addressLocality: address.city,
      addressRegion: address.region,
      postalCode: address.postalCode,
      addressCountry: address.country,
    },
    ...(openingHoursSpecification.length ? { openingHoursSpecification } : {}),
    sameAs: Object.values(site.social).filter(Boolean),
  };

  return (
    <script
      type="application/ld+json"
      // Structured data is static, derived from our own config — safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
