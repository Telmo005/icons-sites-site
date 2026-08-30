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

export const saasPlans: Product[] = [
  {
    id: "saas-mensal",
    name: "Plano Mensal",
    description: "Acesso completo à plataforma, sem compromisso.",
    price: "€15/mês",
    features: ["Acesso total à aplicação", "Suporte por email", "Cancele quando quiser"],
    type: "subscription",
    interval: "month",
    priceIdEnvVar: "PADDLE_PRICE_SAAS_MENSAL",
  },
  {
    id: "saas-anual",
    name: "Plano Anual",
    description: "O mesmo acesso, com 2 meses grátis.",
    price: "€150/ano",
    features: [
      "Acesso total à aplicação",
      "Suporte prioritário",
      "2 meses grátis face ao mensal",
    ],
    type: "subscription",
    interval: "year",
    priceIdEnvVar: "PADDLE_PRICE_SAAS_ANUAL",
    highlighted: true,
  },
];
