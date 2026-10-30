import type { Metadata } from "next";
import { Geist, Marcellus } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { ConsentProvider } from "@/components/ConsentProvider/ConsentProvider";
import { CookieConsent } from "@/components/CookieConsent/CookieConsent";
import { Analytics } from "@/components/Analytics/Analytics";
import { ChakraBackground } from "@/components/ChakraBackground/ChakraBackground";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { WhatsAppFab } from "@/components/WhatsAppFab/WhatsAppFab";
import { JsonLd } from "@/components/JsonLd/JsonLd";
import { MotionProvider } from "@/components/MotionProvider/MotionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const marcellus = Marcellus({
  weight: "400",
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Estetista a ${site.areasServed.join(", ")}`,
    template: `%s — ${site.shortName}`,
  },
  description: site.description,
  keywords: [
    "Giulia Bordino",
    "estetista",
    "estetista Canelli",
    "estetista Costigliole d'Asti",
    "estetista Asti",
    "centro estetico",
    "benessere",
    "trattamenti viso",
    "massaggi",
  ],
  authors: [{ name: site.owner }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: site.url,
    siteName: site.name,
    title: site.name,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="it" className={`${geistSans.variable} ${marcellus.variable} h-full antialiased`}>
      <body className="relative min-h-full">
        <JsonLd />
        <MotionProvider>
          <ConsentProvider>
            <ChakraBackground />
            <Header />
            <main>{children}</main>
            <Footer />
            <WhatsAppFab />
            <CookieConsent />
            <Analytics />
          </ConsentProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
