import Link from "next/link";

export function SiteHeader({ userEmail }: { userEmail?: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-sm font-bold text-accent-foreground">
            I
          </span>
          IconStack
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-muted">
          <Link href="/icones" className="transition-colors hover:text-foreground">
            Ícones
          </Link>
          <Link href="/pricing" className="transition-colors hover:text-foreground">
            Planos
          </Link>
          {userEmail ? (
            <Link
              href="/account"
              className="rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background transition-transform hover:scale-105"
            >
              {userEmail}
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground transition-transform hover:scale-105"
            >
              Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
