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

export default async function Home() {
  const userEmail = await getSignedInUserEmail();

  return (
    <div className="flex flex-1 flex-col font-sans">
      <SiteHeader userEmail={userEmail} />

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16 sm:py-24">
        <section className="grid items-center gap-12 sm:grid-cols-2">
          <div>
            <span className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
              Novo · Planos SaaS Starter, Pro e Advanced
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
              Ícones <span className="text-accent">premium</span>, prontos a
              usar em minutos.
            </h1>
            <p className="mt-4 max-w-lg text-lg text-muted">
              Compre pacotes de ícones vetoriais para os seus projetos, ou
              subscreva a nossa plataforma SaaS para acesso contínuo a novas
              funcionalidades.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#icones"
                className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-transform hover:scale-105"
              >
                Ver pacotes de ícones
              </a>
              <Link
                href="/pricing"
                className="rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold transition-colors hover:bg-border/40"
              >
                Ver planos SaaS
              </Link>
            </div>
          </div>
          <HeroIconCluster />
        </section>

        <section className="mt-20 grid gap-6 rounded-2xl border border-border bg-surface p-8 sm:grid-cols-4 sm:p-10">
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
