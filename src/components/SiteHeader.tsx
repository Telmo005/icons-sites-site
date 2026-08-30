import Link from "next/link";

export function SiteHeader({ userEmail }: { userEmail?: string }) {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-lg font-semibold">
          IconStack
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/#icones" className="hover:underline">
            Ícones
          </Link>
          <Link href="/pricing" className="hover:underline">
            Planos
          </Link>
          {userEmail ? (
            <Link href="/account" className="hover:underline">
              {userEmail}
            </Link>
          ) : (
            <Link href="/login" className="hover:underline">
              Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
