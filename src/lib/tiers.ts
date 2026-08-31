export interface Tier {
  name: "Starter" | "Pro" | "Advanced";
  description: string;
  features: string[];
  /** Real Paddle Price IDs (format "pri_..."), copied from Catalog > Products in the Paddle dashboard. */
  priceId: { month: string; year: string };
}

// Price IDs point at real products/prices created in the Paddle LIVE
// account (via the API). Name, copy, features are safe to edit freely — but
// see the open TODO below before real customers start paying for "Advanced".
export const tiers: Tier[] = [
  {
    name: "Starter",
    description: "Para quem está a começar.",
    features: ["1 projeto", "Suporte por email", "Atualizações da comunidade"],
    priceId: {
      month: "pri_01m1cg1pahm87hfkqch9ry02qy", // $15.00/mês
      year: "pri_01m1cg1ppn88hnwvqtc9g8rypr", // $150.00/ano
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
      month: "pri_01m1cg1pzb1t8c05wwwek21y34", // $39.00/mês
      year: "pri_01m1cg1q893mrhn51w43dxnzym", // $390.00/ano
    },
  },
  {
    name: "Advanced",
    // TODO: "SSO", "SLA dedicado" and "Gestor de conta dedicado" are not
    // real features of the icon customizer tool at /app — this is the same
    // false-advertising risk flagged in PADDLE-REVIEW.md #1. Rewrite before
    // real customers pay for this tier expecting them.
    description: "Para organizações com necessidades avançadas.",
    features: [
      "Tudo do Pro",
      "SSO e permissões avançadas",
      "SLA dedicado",
      "Gestor de conta dedicado",
    ],
    priceId: {
      month: "pri_01m1cg1qh8epg2ar6g3wa5ab3v", // $99.00/mês
      year: "pri_01m1cg1qt5g17t1q71z3r571g2", // $990.00/ano
    },
  },
];
