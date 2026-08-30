import { iconPacks, saasPlans, resolvePriceId } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-black">
      <header className="border-b border-black/10 dark:border-white/15">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <span className="text-lg font-semibold">IconStack</span>
          <nav className="flex gap-6 text-sm">
            <a href="#icones" className="hover:underline">
              Ícones
            </a>
            <a href="#saas" className="hover:underline">
              SaaS
            </a>
            <a href="/pricing" className="hover:underline">
              Planos
            </a>
            <a href="/account" className="hover:underline">
              Conta
            </a>
          </nav>
        </div>
      </header>

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

        <section id="saas" className="mt-24">
          <h2 className="text-2xl font-semibold">Plano SaaS</h2>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            Subscrição recorrente com acesso total à plataforma.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {saasPlans.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                priceId={resolvePriceId(product)}
              />
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-black/10 px-6 py-8 text-center text-sm text-zinc-500 dark:border-white/15">
        © {new Date().getFullYear()} IconStack. Todos os direitos reservados.
      </footer>
    </div>
  );
}
