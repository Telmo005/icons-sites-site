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
    description: "150 ícones vetoriais para começar qualquer projeto.",
    price: "€9",
    features: ["150 ícones SVG", "Estilo outline", "Licença uso comercial"],
    type: "one_time",
    priceIdEnvVar: "PADDLE_PRICE_ICONS_ESSENCIAL",
  },
  {
    id: "icons-pro",
    name: "Pacote Pro",
    description: "600 ícones em vários estilos, prontos para produção.",
    price: "€24",
    features: [
      "600 ícones SVG",
      "Estilos outline e solid",
      "Licença uso comercial",
      "Atualizações gratuitas",
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
      "1500+ ícones SVG",
      "Todos os estilos",
      "Licença uso comercial",
      "Atualizações vitalícias",
    ],
    type: "one_time",
    priceIdEnvVar: "PADDLE_PRICE_ICONS_COMPLETO",
  },
];
