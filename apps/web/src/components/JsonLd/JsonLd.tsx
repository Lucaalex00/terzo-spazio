import { site } from "@/lib/site";
import { address, openingHours } from "@/content/business";

/**
 * LocalBusiness (BeautySalon) structured data for local SEO. Helps search
 * engines connect the site to "estetista Canelli / Costigliole / Asti" queries.
 * Rendered as a server component in the root layout.
 */
export function JsonLd() {
  const openingHoursSpecification = openingHours
    .filter((d) => d.hours.toLowerCase() !== "chiuso")
    .map((d) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: d.day,
      description: d.hours,
    }));

  const data = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: site.name,
    description: site.description,
    url: site.url,
    image: `${site.url}/og.png`,
    areaServed: site.areasServed.map((name) => ({ "@type": "City", name })),
    founder: { "@type": "Person", name: site.owner },
    knowsLanguage: "it-IT",
    ...(site.whatsappNumber ? { telephone: `+${site.whatsappNumber.replace(/\D/g, "")}` } : {}),
    ...(address.city
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: address.street || undefined,
            addressLocality: address.city,
            addressRegion: address.region || undefined,
            postalCode: address.postalCode || undefined,
            addressCountry: address.country,
          },
        }
      : {}),
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
