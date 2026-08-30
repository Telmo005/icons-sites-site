import type { Product } from "@/lib/products";
import { CheckoutButton } from "@/components/CheckoutButton";

export function ProductCard({
  product,
  priceId,
}: {
  product: Product;
  priceId: string | undefined;
}) {
  return (
    <div
      className={`flex flex-col rounded-2xl border p-6 ${
        product.highlighted
          ? "border-foreground shadow-lg"
          : "border-black/10 dark:border-white/15"
      }`}
    >
      {product.highlighted && (
        <span className="mb-3 w-fit rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background">
          Mais popular
        </span>
      )}
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        {product.description}
      </p>
      <p className="mt-4 text-3xl font-bold">{product.price}</p>
      <ul className="mt-4 flex flex-1 flex-col gap-2 text-sm text-zinc-600 dark:text-zinc-400">
        {product.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <span aria-hidden>✓</span>
            {feature}
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <CheckoutButton
          priceId={priceId}
          label={product.type === "subscription" ? "Subscrever" : "Comprar agora"}
        />
      </div>
    </div>
  );
}
