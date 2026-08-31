import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SUPPORT_EMAIL } from "@/lib/site-config";
import { getSignedInUserEmail } from "@/lib/auth";
import { submitContact } from "./actions";

export const metadata = {
  title: "Contacto",
  description: "Fale connosco sobre pacotes de ícones, planos SaaS, ou qualquer outra questão.",
};

export default async function ContactoPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const params = await searchParams;
  const userEmail = await getSignedInUserEmail();

  return (
    <div className="flex flex-1 flex-col font-sans">
      <SiteHeader userEmail={userEmail} />
      <main className="mx-auto w-full max-w-lg flex-1 px-6 py-16">
        <h1 className="text-3xl font-bold">Contacto</h1>
        <p className="mt-2 text-muted">
          Dúvidas sobre um pacote, uma subscrição, ou qualquer outra coisa?
          Escreva-nos para{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="font-medium text-accent underline">
            {SUPPORT_EMAIL}
          </a>{" "}
          ou use o formulário abaixo.
        </p>

        {params.sent && (
          <div className="mt-6 rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
            Mensagem enviada. Respondemos assim que possível.
          </div>
        )}
        {params.error && (
          <div className="mt-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
            Não foi possível enviar a mensagem. Tente novamente ou use o email
            acima diretamente.
          </div>
        )}

        <form action={submitContact} className="mt-8 flex flex-col gap-3">
          <input
            type="text"
            name="name"
            required
            placeholder="O seu nome"
            className="rounded-lg border border-border bg-surface px-4 py-3 text-sm focus:border-accent focus:outline-none"
          />
          <input
            type="email"
            name="email"
            required
            placeholder="O seu email"
            className="rounded-lg border border-border bg-surface px-4 py-3 text-sm focus:border-accent focus:outline-none"
          />
          <textarea
            name="message"
            required
            rows={5}
            placeholder="Como podemos ajudar?"
            className="rounded-lg border border-border bg-surface px-4 py-3 text-sm focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-transform hover:scale-105"
          >
            Enviar mensagem
          </button>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}
