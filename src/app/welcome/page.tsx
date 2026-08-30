import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getSignedInUserEmail } from "@/lib/auth";

export default async function WelcomePage() {
  const userEmail = await getSignedInUserEmail();

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-black">
      <SiteHeader userEmail={userEmail} />
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="text-3xl font-bold">Bem-vindo! 🎉</h1>
        <p className="mt-3 max-w-md text-zinc-600 dark:text-zinc-400">
          A sua compra foi confirmada. Enviámos os detalhes para o seu email.
        </p>
        <Link href="/" className="mt-8 text-sm font-medium underline">
          Voltar à página inicial
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
