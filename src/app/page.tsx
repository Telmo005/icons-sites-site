import Link from "next/link";
import { iconPacks, resolvePriceId } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getSignedInUserEmail } from "@/lib/auth";

const faqs = [
  {
    question: "Como recebo os ícones depois de comprar?",
    answer:
      "Assim que o pagamento é confirmado, enviamos um email com o link de download. Se tiver conta (ou criar uma com o mesmo email da compra), o pacote fica sempre disponível para descarregar novamente em \"A minha conta\".",
  },
  {
    question: "Posso usar os ícones em projetos comerciais?",
    answer:
      "Sim — todos os pacotes incluem licença de uso comercial. Não pode revender os ficheiros isolados como se fossem um produto próprio. Detalhes completos nos Termos de Serviço.",
  },
  {
    question: "Como funciona o cancelamento da subscrição SaaS?",
    answer:
      "Pode cancelar a qualquer momento em \"A minha conta\" — o acesso mantém-se até ao fim do período já pago, sem cobranças futuras.",
  },
  {
    question: "O pagamento é seguro?",
    answer:
      "Sim. Todos os pagamentos são processados pela Paddle.com, que trata da cobrança, faturação e conformidade fiscal — os dados do seu cartão nunca passam pelos nossos servidores.",
  },
];

export default async function Home() {
  const userEmail = await getSignedInUserEmail();

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-black">
      <SiteHeader userEmail={userEmail} />

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
        <section className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Ícones prontos a usar. Uma plataforma para crescer.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Compre pacotes de ícones vetoriais para os seus projetos, ou
            subscreva a nossa plataforma SaaS para acesso contínuo a novas
            funcionalidades.
          </p>
        </section>

        <section id="icones" className="mt-20">
          <h2 className="text-2xl font-semibold">Pacotes de ícones</h2>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            Pagamento único. Download imediato após a compra.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {iconPacks.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                priceId={resolvePriceId(product)}
              />
            ))}
          </div>
        </section>

        <section className="mt-24 rounded-2xl border border-border p-10 text-center">
          <h2 className="text-2xl font-semibold">Também temos uma ferramenta SaaS</h2>
          <p className="mx-auto mt-2 max-w-xl text-zinc-600 dark:text-zinc-400">
            Acesso contínuo por subscrição, com planos Starter, Pro e Advanced.
          </p>
          <Link
            href="/pricing"
            className="mt-6 inline-block rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Ver planos
          </Link>
        </section>

        <section className="mx-auto mt-24 max-w-2xl">
          <h2 className="text-2xl font-semibold">Perguntas frequentes</h2>
          <div className="mt-6 flex flex-col divide-y divide-border rounded-2xl border border-border">
            {faqs.map((faq) => (
              <details key={faq.question} className="group p-5">
                <summary className="cursor-pointer list-none font-medium marker:content-none">
                  {faq.question}
                </summary>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
