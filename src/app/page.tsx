import Link from "next/link";
import { iconPacks, resolvePriceId } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { HeroIconCluster } from "@/components/HeroIconCluster";
import { getSignedInUserEmail } from "@/lib/auth";

const trustPoints = [
  { label: "Download instantâneo", detail: "Disponível assim que o pagamento é confirmado" },
  { label: "Licença comercial incluída", detail: "Use nos seus projetos sem custos extra" },
  { label: "Pagamento seguro", detail: "Processado pela Paddle.com" },
  { label: "Suporte por email", detail: "Resposta em menos de 24h úteis" },
];

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

const trendingSearches = ["coração", "carrinho", "casa", "definições", "utilizador", "seta"];

export default async function Home() {
  const userEmail = await getSignedInUserEmail();

  return (
    <div className="flex flex-1 flex-col font-sans">
      <SiteHeader userEmail={userEmail} />

      <section className="border-b border-border bg-orange-50/60 px-6 py-16 text-center sm:py-20">
        <h1 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          O ícone certo para o teu projeto
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-lg text-muted">
          Pesquise entre o nosso catálogo de ícones vetoriais, ou subscreva
          para acesso contínuo.
        </p>

        <form
          action="/icones"
          method="get"
          className="mx-auto mt-8 flex max-w-xl items-center rounded-full border border-border bg-surface p-1.5 shadow-sm"
        >
          <input
            type="search"
            name="q"
            placeholder="Pesquisar ícones (ex: coração, casa, seta…)"
            className="w-full bg-transparent px-4 py-2.5 text-sm focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-105"
          >
            Pesquisar
          </button>
        </form>

        <div className="mx-auto mt-5 flex max-w-xl flex-wrap items-center justify-center gap-2 text-sm">
          <span className="text-muted">Populares:</span>
          {trendingSearches.map((term) => (
            <Link
              key={term}
              href={`/icones?q=${encodeURIComponent(term)}`}
              className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium transition-colors hover:bg-accent/10 hover:text-accent"
            >
              {term}
            </Link>
          ))}
        </div>

        <div className="mt-10">
          <HeroIconCluster />
        </div>
      </section>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16 sm:py-24">
        <section className="grid gap-6 rounded-2xl border border-border bg-surface p-8 sm:grid-cols-4 sm:p-10">
          {trustPoints.map((point) => (
            <div key={point.label}>
              <p className="text-sm font-semibold">{point.label}</p>
              <p className="mt-1 text-xs text-muted">{point.detail}</p>
            </div>
          ))}
        </section>

        <section id="icones" className="mt-24 scroll-mt-24">
          <h2 className="text-2xl font-semibold">Pacotes de ícones</h2>
          <p className="mt-1 text-muted">
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

        <section className="relative mt-24 overflow-hidden rounded-2xl border border-border bg-surface p-10 text-center sm:p-14">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent" />
          <div className="relative">
            <h2 className="text-2xl font-semibold">Também temos uma ferramenta SaaS</h2>
            <p className="mx-auto mt-2 max-w-xl text-muted">
              Acesso contínuo por subscrição, com planos Starter, Pro e Advanced.
            </p>
            <Link
              href="/pricing"
              className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-transform hover:scale-105"
            >
              Ver planos
            </Link>
          </div>
        </section>

        <section className="mx-auto mt-24 max-w-2xl">
          <h2 className="text-2xl font-semibold">Perguntas frequentes</h2>
          <div className="mt-6 flex flex-col divide-y divide-border rounded-2xl border border-border bg-surface">
            {faqs.map((faq) => (
              <details key={faq.question} className="group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between font-medium marker:content-none">
                  {faq.question}
                  <span className="ml-4 text-accent transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-2 text-sm text-muted">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
