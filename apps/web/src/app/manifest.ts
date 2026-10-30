import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/** Web app manifest: lets visitors add the site to their phone's home screen. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.shortName,
    description: site.description,
    lang: "it",
    start_url: "/",
    display: "standalone",
    background_color: "#07060b",
    theme_color: "#07060b",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/brand/icon-192.png", type: "image/png", sizes: "192x192" },
      { src: "/brand/icon-512.png", type: "image/png", sizes: "512x512" },
      { src: "/brand/icon-512.png", type: "image/png", sizes: "512x512", purpose: "maskable" },
    ],
  };
}
