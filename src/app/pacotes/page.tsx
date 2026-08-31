import { iconPacks, resolvePriceId } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getSignedInUserEmail } from "@/lib/auth";

export const metadata = {
  title: "Pacotes de ícones",
  description: "Compre um pacote de ícones vetoriais — pagamento único, download imediato.",
};

export default async function PacotesPage() {
  const userEmail = await getSignedInUserEmail();

  return (
    <div className="flex flex-1 flex-col font-sans">
      <SiteHeader userEmail={userEmail} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Pacotes de ícones</h1>
        <p className="mt-2 text-muted">
          Pagamento único. Download imediato após a compra — sem subscrição.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {iconPacks.map((product) => (
            <ProductCard key={product.id} product={product} priceId={resolvePriceId(product)} />
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
