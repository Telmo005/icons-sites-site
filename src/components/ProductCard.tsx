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
      className={`flex flex-col rounded-2xl border bg-surface p-6 shadow-sm transition-shadow hover:shadow-lg ${
        product.highlighted ? "border-accent shadow-accent/10" : "border-border"
      }`}
    >
      {product.highlighted && (
        <span className="mb-3 w-fit rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
          Mais popular
        </span>
      )}
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="mt-1 text-sm text-muted">{product.description}</p>
      <p className="mt-4 text-3xl font-bold">{product.price}</p>
      <ul className="mt-4 flex flex-1 flex-col gap-2 text-sm text-muted">
        {product.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <span aria-hidden className="text-accent">
              ✓
            </span>
            {feature}
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <CheckoutButton
          priceId={priceId}
          label={product.type === "subscription" ? "Subscrever" : "Comprar agora"}
          customData={product.type === "one_time" ? { packId: product.id } : undefined}
          className={
            product.highlighted
              ? "w-full rounded-full bg-accent px-5 py-3 text-center text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-transform hover:scale-105"
              : "w-full rounded-full bg-foreground px-5 py-3 text-center text-sm font-semibold text-background transition-transform hover:scale-105"
          }
        />
      </div>
    </div>
  );
}
