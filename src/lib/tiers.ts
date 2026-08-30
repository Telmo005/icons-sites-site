export interface Tier {
  name: "Starter" | "Pro" | "Advanced";
  description: string;
  features: string[];
  /** Real Paddle Price IDs (format "pri_..."), copied from Catalog > Products in the Paddle dashboard. */
  priceId: { month: string; year: string };
}

// Price IDs point at real products/prices created in the Paddle SANDBOX
// account (via the API, since no products existed yet). Re-create these in
// your LIVE account and swap the IDs before going to production — sandbox
// and live are separate catalogs. Name, copy, features are safe to edit freely.
export const tiers: Tier[] = [
  {
    name: "Starter",
    description: "Para quem está a começar.",
    features: ["1 projeto", "Suporte por email", "Atualizações da comunidade"],
    priceId: {
      month: "pri_01m18a4p7vwv7ha0jr3m91z7mf", // €15.00/mês
      year: "pri_01m18a4pshvqaxdnca0w4g1nkj", // €150.00/ano
    },
  },
  {
    name: "Pro",
    description: "Para equipas pequenas em crescimento.",
    features: [
      "Projetos ilimitados",
      "Suporte prioritário",
      "Integrações avançadas",
      "Acesso antecipado a novidades",
    ],
    priceId: {
      month: "pri_01m18a4qf0d44wrr9jwjszs18j", // €39.00/mês
      year: "pri_01m18a4qsamdtw6tvcc2xj2gwj", // €390.00/ano
    },
  },
  {
    name: "Advanced",
    description: "Para organizações com necessidades avançadas.",
    features: [
      "Tudo do Pro",
      "SSO e permissões avançadas",
      "SLA dedicado",
      "Gestor de conta dedicado",
    ],
    priceId: {
      month: "pri_01m18a4rgqkpex84m72d543evs", // €99.00/mês
      year: "pri_01m18a4rzfrtk9ze835wj0dd65", // €990.00/ano
    },
  },
];
