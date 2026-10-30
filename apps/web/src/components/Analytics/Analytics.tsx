"use client";

/**
 * Google Analytics 4, loaded ONLY after the visitor grants cookie consent and
 * only when a measurement id is configured. Uses the official Next.js helper
 * from @next/third-parties.
 */

import { GoogleAnalytics } from "@next/third-parties/google";
import { site } from "@/lib/site";
import { useConsent } from "@/components/ConsentProvider/ConsentProvider";

export function Analytics() {
  const { status, ready } = useConsent();
  const gaId = site.analytics.gaMeasurementId;

  if (!ready || status !== "granted" || !gaId) return null;

  return <GoogleAnalytics gaId={gaId} />;
}
