import Link from "next/link";
import { LEGAL_ENTITY } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-muted sm:flex-row">
        <div className="flex items-center gap-2 font-medium text-foreground">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent text-xs font-bold text-accent-foreground">
            I
          </span>
          IconStack
        </div>
        <span>© {new Date().getFullYear()} IconStack. Todos os direitos reservados.</span>
        <nav className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/pricing" className="transition-colors hover:text-foreground">
            Planos
          </Link>
          <Link href="/termos" className="transition-colors hover:text-foreground">
            Termos
          </Link>
          <Link href="/privacidade" className="transition-colors hover:text-foreground">
            Privacidade
          </Link>
          <Link href="/reembolsos" className="transition-colors hover:text-foreground">
            Reembolsos
          </Link>
          <Link href="/contacto" className="transition-colors hover:text-foreground">
            Contacto
          </Link>
        </nav>
      </div>
      <div className="mx-auto max-w-5xl px-6 pb-8 text-center text-xs text-muted sm:text-left">
        IconStack é uma marca de {LEGAL_ENTITY.name} ({LEGAL_ENTITY.country}).
      </div>
    </footer>
  );
}
