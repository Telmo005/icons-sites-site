import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getSignedInUserEmail } from "@/lib/auth";

export default async function WelcomePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const userEmail = await getSignedInUserEmail();
  const isIconPurchase = params.type === "icons";

  return (
    <div className="flex flex-1 flex-col font-sans">
      <SiteHeader userEmail={userEmail} />
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-2xl">
          🎉
        </span>
        <h1 className="mt-4 text-3xl font-bold">Compra confirmada!</h1>

        {isIconPurchase ? (
          <>
            <p className="mt-3 max-w-md text-muted">
              Enviámos o link de download para o seu email. Não chegou? Crie
              uma conta com o <strong>mesmo email usado na compra</strong> —
              o download fica sempre disponível em &ldquo;A minha
              conta&rdquo;, mesmo sem o email.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-transform hover:scale-105"
            >
              Criar conta / entrar
            </Link>
          </>
        ) : (
          <p className="mt-3 max-w-md text-muted">
            A sua subscrição está ativa. Enviámos os detalhes para o seu
            email.
          </p>
        )}

        <Link href="/" className="mt-6 text-sm font-semibold text-accent underline">
          Voltar à página inicial
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
