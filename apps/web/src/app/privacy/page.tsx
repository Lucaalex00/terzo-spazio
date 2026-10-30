import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Informativa privacy di ${site.name}.`,
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
      <Link href="/" className="text-sm text-neutral-500 underline underline-offset-2">
        ← Torna al sito
      </Link>
      <h1 className="mt-6 font-display text-3xl text-neutral-900">Privacy Policy</h1>
      <p className="mt-2 text-sm text-neutral-500">
        Ultimo aggiornamento: {new Date().toLocaleDateString("it-IT")}
      </p>

      <div className="prose-sm mt-8 space-y-6 text-neutral-700">
        <section>
          <h2 className="font-display text-xl text-neutral-900">Titolare del trattamento</h2>
          <p>
            Titolare del trattamento è {site.owner} ({site.name}). Per esercitare i tuoi diritti o
            per qualsiasi richiesta puoi usare i contatti indicati sul sito.
            {/* TODO: inserire ragione sociale, P.IVA, indirizzo ed email del titolare. */}
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-neutral-900">Quali dati trattiamo</h2>
          <p>
            Questo sito è prevalentemente informativo e <strong>non richiede registrazione</strong>.
            Non raccogliamo dati personali tramite moduli salvati sui nostri server.
          </p>
          <ul className="list-disc pl-5">
            <li>
              <strong>Contatto / prenotazione:</strong> il pulsante di prenotazione ti porta su
              WhatsApp (o sull&apos;app di prenotazione esterna di Giulia) con un messaggio già
              pronto. In quel momento stai comunicando direttamente con Giulia tramite quei servizi,
              secondo le relative informative privacy.
            </li>
            <li>
              <strong>Dati di navigazione / statistiche:</strong> solo se acconsenti, usiamo Google
              Analytics per statistiche aggregate sull&apos;uso del sito (vedi la{" "}
              <Link href="/cookie-policy" className="underline underline-offset-2">
                Cookie Policy
              </Link>
              ).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl text-neutral-900">Finalità e base giuridica</h2>
          <p>
            Le statistiche vengono trattate sulla base del tuo <strong>consenso</strong> (art.
            6(1)(a) GDPR), revocabile in ogni momento. I contatti che avvii tu stesso tramite
            WhatsApp o app esterne hanno come base l&apos;esecuzione di misure precontrattuali su
            tua richiesta.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-neutral-900">Servizi di terze parti</h2>
          <p>
            Usiamo, con il tuo consenso, <strong>Google Analytics</strong> (Google Ireland Ltd.). Il
            contatto rapido usa <strong>WhatsApp</strong> (Meta). Questi fornitori trattano i dati
            secondo le proprie informative; ti invitiamo a consultarle.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-neutral-900">I tuoi diritti</h2>
          <p>
            Hai diritto di accesso, rettifica, cancellazione, limitazione, opposizione e portabilità
            dei dati, oltre al diritto di revocare il consenso e di proporre reclamo al Garante per
            la protezione dei dati personali.
          </p>
        </section>
      </div>
    </article>
  );
}
