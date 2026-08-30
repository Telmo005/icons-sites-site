import Link from "next/link";

export default function WelcomePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 text-center font-sans dark:bg-black">
      <h1 className="text-3xl font-bold">Bem-vindo! 🎉</h1>
      <p className="mt-3 max-w-md text-zinc-600 dark:text-zinc-400">
        A sua subscrição foi confirmada. Enviámos os detalhes para o seu email.
      </p>
      <Link href="/" className="mt-8 text-sm font-medium underline">
        Voltar à página inicial
      </Link>
    </div>
  );
}
