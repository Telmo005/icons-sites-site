import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

// Deliberately sync/no-auth-lookup: a not-found boundary that reads cookies
// can force the whole app into dynamic rendering in Next's App Router.
export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col font-sans">
      <SiteHeader />
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <span className="text-sm font-semibold text-accent">Erro 404</span>
        <h1 className="mt-2 text-3xl font-bold">Esta página não existe</h1>
        <p className="mt-3 max-w-md text-muted">
          O link pode estar desatualizado ou a página foi movida. Aqui estão
          alguns sítios para onde pode ir:
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-transform hover:scale-105"
          >
            Voltar à página inicial
          </Link>
          <Link
            href="/pricing"
            className="rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold transition-colors hover:bg-border/40"
          >
            Ver planos
          </Link>
          <Link
            href="/contacto"
            className="rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold transition-colors hover:bg-border/40"
          >
            Contacto
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
