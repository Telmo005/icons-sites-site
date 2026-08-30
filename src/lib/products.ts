export type Product = {
  id: string;
  name: string;
  description: string;
  price: string;
  features: string[];
  type: "one_time" | "subscription";
  interval?: "month" | "year";
  /** Env var name holding the real Paddle Price ID (set after creating the price in the Paddle dashboard). */
  priceIdEnvVar: string;
  highlighted?: boolean;
};

/** Resolves a product's real Paddle Price ID from its env var, at server-render time. */
export function resolvePriceId(product: Product): string | undefined {
  return process.env[product.priceIdEnvVar];
}

/** Reverse lookup used by the webhook when a transaction has no customData
 * (e.g. an older client, or a purchase made another way). */
export function findIconPackByPriceId(priceId: string): Product | undefined {
  return iconPacks.find((product) => resolvePriceId(product) === priceId);
}

export const iconPacks: Product[] = [
  {
    id: "icons-essencial",
    name: "Pacote Essencial",
    description: "20 ícones vetoriais essenciais para começar qualquer projeto.",
    price: "€9",
    features: ["20 ícones SVG", "Estilo outline", "Licença uso comercial"],
    type: "one_time",
    priceIdEnvVar: "PADDLE_PRICE_ICONS_ESSENCIAL",
  },
  {
    id: "icons-pro",
    name: "Pacote Pro",
    description: "62 ícones vetoriais, prontos para produção.",
    price: "€24",
    features: [
      "62 ícones SVG",
      "Estilo outline consistente",
      "Licença uso comercial",
    ],
    type: "one_time",
    priceIdEnvVar: "PADDLE_PRICE_ICONS_PRO",
    highlighted: true,
  },
  {
    id: "icons-completo",
    name: "Pacote Completo",
    description: "Todo o catálogo de ícones, incluindo lançamentos futuros.",
    price: "€49",
    features: [
      "62 ícones SVG (todo o catálogo atual)",
      "Estilo outline consistente",
      "Licença uso comercial",
      "Atualizações vitalícias incluídas",
    ],
    type: "one_time",
    priceIdEnvVar: "PADDLE_PRICE_ICONS_COMPLETO",
  },
];
