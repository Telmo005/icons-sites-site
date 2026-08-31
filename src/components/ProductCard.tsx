import Link from "next/link";
import type { Product } from "@/lib/products";
import { CheckoutButton } from "@/components/CheckoutButton";
import { Icon } from "@/components/Icon";

export function ProductCard({
  product,
  priceId,
}: {
  product: Product;
  priceId: string | undefined;
}) {
  const hasMore = product.totalIcons > product.previewIcons.length;
  const shownIcons = hasMore ? product.previewIcons.slice(0, -1) : product.previewIcons;
  const remaining = product.totalIcons - shownIcons.length;

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

      {product.previewIcons.length > 0 && (
        <>
          <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-4">
            {shownIcons.map((iconName) => (
              <div
                key={iconName}
                className="flex aspect-square items-center justify-center rounded-lg border border-border bg-background text-muted"
              >
                <Icon name={iconName} className="h-4 w-4" />
              </div>
            ))}
            {hasMore && (
              <Link
                href="/icones"
                className="flex aspect-square items-center justify-center rounded-lg border border-border bg-background text-xs font-semibold text-accent transition-colors hover:bg-accent/10"
              >
                +{remaining}
              </Link>
            )}
          </div>
          {hasMore && (
            <Link href="/icones" className="mt-2 inline-block text-xs text-accent underline">
              Ver os {product.totalIcons} ícones
            </Link>
          )}
        </>
      )}

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
