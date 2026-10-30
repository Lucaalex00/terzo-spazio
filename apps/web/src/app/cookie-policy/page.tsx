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
    <div className="px-4 pb-16 pt-28">
      <article className="glass-dark mx-auto max-w-2xl rounded-3xl px-6 py-10 sm:px-10">
        <Link href="/" className="text-sm text-white/55 underline underline-offset-2">
          ← Torna al sito
        </Link>
        <h1 className="mt-6 font-display text-3xl text-white">Cookie Policy</h1>
        <p className="mt-2 text-sm text-white/55">
          Ultimo aggiornamento: {new Date().toLocaleDateString("it-IT")}
        </p>

        <div className="mt-8 space-y-6 text-white/80">
          <section>
            <h2 className="font-display text-xl text-white">Cosa sono i cookie</h2>
            <p>
              I cookie sono piccoli file memorizzati sul tuo dispositivo. Usiamo solo lo stretto
              necessario e, <strong>solo con il tuo consenso</strong>, cookie di statistica.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-white">Cookie tecnici (necessari)</h2>
            <p>
              Servono al funzionamento del sito e a ricordare la tua scelta sui cookie. Non
              richiedono consenso e non vengono usati per profilazione.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-white">Cookie di statistica</h2>
            <p>
              Usiamo <strong>Google Analytics 4</strong> per capire in forma aggregata come viene
              usato il sito. Questi cookie vengono installati{" "}
              <strong>solo dopo il tuo consenso</strong> e non prima. Puoi cambiare idea quando vuoi
              qui sotto.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-white">Le tue preferenze</h2>
            <ConsentControls />
          </section>

          <p className="text-sm text-white/55">
            Per maggiori dettagli sul trattamento dei dati consulta la{" "}
            <Link href="/privacy" className="underline underline-offset-2">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </article>
    </div>
  );
}
