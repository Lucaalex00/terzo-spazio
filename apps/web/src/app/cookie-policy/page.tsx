import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { ConsentControls } from "@/components/ConsentControls/ConsentControls";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: `Informativa cookie di ${site.name}.`,
  robots: { index: false, follow: true },
};

export default function CookiePolicyPage() {
  return (
    <article className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
      <Link href="/" className="text-sm text-neutral-500 underline underline-offset-2">
        ← Torna al sito
      </Link>
      <h1 className="mt-6 font-display text-3xl text-neutral-900">Cookie Policy</h1>
      <p className="mt-2 text-sm text-neutral-500">
        Ultimo aggiornamento: {new Date().toLocaleDateString("it-IT")}
      </p>

      <div className="mt-8 space-y-6 text-neutral-700">
        <section>
          <h2 className="font-display text-xl text-neutral-900">Cosa sono i cookie</h2>
          <p>
            I cookie sono piccoli file memorizzati sul tuo dispositivo. Usiamo solo lo stretto
            necessario e, <strong>solo con il tuo consenso</strong>, cookie di statistica.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-neutral-900">Cookie tecnici (necessari)</h2>
          <p>
            Servono al funzionamento del sito e a ricordare la tua scelta sui cookie. Non richiedono
            consenso e non vengono usati per profilazione.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-neutral-900">Cookie di statistica</h2>
          <p>
            Usiamo <strong>Google Analytics 4</strong> per capire in forma aggregata come viene
            usato il sito. Questi cookie vengono installati{" "}
            <strong>solo dopo il tuo consenso</strong> e non prima. Puoi cambiare idea quando vuoi
            qui sotto.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-neutral-900">Le tue preferenze</h2>
          <ConsentControls />
        </section>

        <p className="text-sm text-neutral-500">
          Per maggiori dettagli sul trattamento dei dati consulta la{" "}
          <Link href="/privacy" className="underline underline-offset-2">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </article>
  );
}
