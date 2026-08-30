import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getSignedInUserEmail } from "@/lib/auth";

export default async function WelcomePage() {
  const userEmail = await getSignedInUserEmail();

  return (
    <div className="flex flex-1 flex-col font-sans">
      <SiteHeader userEmail={userEmail} />
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-2xl">
          🎉
        </span>
        <h1 className="mt-4 text-3xl font-bold">Bem-vindo!</h1>
        <p className="mt-3 max-w-md text-muted">
          A sua compra foi confirmada. Enviámos os detalhes para o seu email.
        </p>
        <Link href="/" className="mt-8 text-sm font-semibold text-accent underline">
          Voltar à página inicial
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
