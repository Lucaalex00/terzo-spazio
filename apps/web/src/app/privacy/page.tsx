import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { addressLine } from "@/content/business";
import { phoneDisplay } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Informativa privacy di ${site.name}.`,
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  const phone = phoneDisplay();
  return (
    <div className="px-4 pb-16 pt-28">
      <article className="glass-dark mx-auto max-w-2xl rounded-3xl px-6 py-10 sm:px-10">
        <Link href="/" className="text-sm text-white/55 underline underline-offset-2">
          ← Torna al sito
        </Link>
        <h1 className="mt-6 font-display text-3xl text-white">Privacy Policy</h1>
        <p className="mt-2 text-sm text-white/55">
          Ultimo aggiornamento: {new Date().toLocaleDateString("it-IT")}
        </p>

        <div className="prose-sm mt-8 space-y-6 text-white/80">
          <section>
            <h2 className="font-display text-xl text-white">Titolare del trattamento</h2>
            <p>
              Titolare del trattamento è <strong>{site.legal.name}</strong> ({site.legal.form},
              P.IVA {site.legal.vatNumber}), che opera come {site.name}, con sede in {addressLine}.
            </p>
            <p className="mt-2">
              Per esercitare i tuoi diritti o per qualsiasi richiesta puoi scrivere su WhatsApp o
              chiamare{phone ? ` il numero ${phone}` : " ai contatti indicati sul sito"}.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-white">Quali dati trattiamo</h2>
            <p>
              Questo sito è prevalentemente informativo e{" "}
              <strong>non richiede registrazione</strong>. Non raccogliamo dati personali tramite
              moduli salvati sui nostri server.
            </p>
            <ul className="list-disc pl-5">
              <li>
                <strong>Contatto / prenotazione:</strong> il pulsante di prenotazione ti porta su
                WhatsApp con un messaggio già pronto. In quel momento stai comunicando direttamente
                con Giulia tramite WhatsApp, secondo la relativa informativa privacy.
              </li>
              <li>
                <strong>Dati di navigazione / statistiche:</strong> solo se acconsenti, usiamo
                Google Analytics per statistiche aggregate sull&apos;uso del sito (vedi la{" "}
                <Link href="/cookie-policy" className="underline underline-offset-2">
                  Cookie Policy
                </Link>
                ).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-white">Finalità e base giuridica</h2>
            <p>
              Le statistiche vengono trattate sulla base del tuo <strong>consenso</strong> (art.
              6(1)(a) GDPR), revocabile in ogni momento. I contatti che avvii tu stesso tramite
              WhatsApp hanno come base l&apos;esecuzione di misure precontrattuali su tua richiesta.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-white">Servizi di terze parti</h2>
            <p>
              Usiamo, con il tuo consenso, <strong>Google Analytics</strong> (Google Ireland Ltd.).
              Il contatto rapido usa <strong>WhatsApp</strong> (Meta). Questi fornitori trattano i
              dati secondo le proprie informative; ti invitiamo a consultarle.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-white">I tuoi diritti</h2>
            <p>
              Hai diritto di accesso, rettifica, cancellazione, limitazione, opposizione e
              portabilità dei dati, oltre al diritto di revocare il consenso e di proporre reclamo
              al Garante per la protezione dei dati personali.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
