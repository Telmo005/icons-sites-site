import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-6 py-8 text-sm text-muted">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
        <span>© {new Date().getFullYear()} IconStack. Todos os direitos reservados.</span>
        <nav className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/pricing" className="hover:underline">
            Planos
          </Link>
          <Link href="/termos" className="hover:underline">
            Termos de Serviço
          </Link>
          <Link href="/privacidade" className="hover:underline">
            Privacidade
          </Link>
          <Link href="/reembolsos" className="hover:underline">
            Reembolsos
          </Link>
        </nav>
      </div>
    </footer>
  );
}
