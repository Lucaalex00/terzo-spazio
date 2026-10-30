import Link from "next/link";
import { LogoMark } from "@/components/Logo/Logo";

/** 404: a calm dead end that points back to the journey. */
export default function NotFound() {
  return (
    <section className="flex min-h-[100svh] flex-col items-center justify-center px-5 text-center">
      <LogoMark size={96} />
      <p className="mt-8 text-xs uppercase tracking-[0.35em] text-white/60">Errore 404</p>
      <h1 className="drop-glow mt-3 font-display text-4xl text-white sm:text-5xl">
        Questa pagina non esiste
      </h1>
      <p className="text-glow mt-4 max-w-md text-pretty text-white/75">
        Forse il link è cambiato. Torna all&apos;inizio e riprendi il viaggio.
      </p>
      <Link href="/" className="btn-primary mt-8" style={{ ["--glow" as string]: "#e0433a" }}>
        Torna all&apos;inizio
      </Link>
    </section>
  );
}
