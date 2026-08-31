import { ICON_NAMES } from "@/lib/icons";

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
  /** Names from src/lib/icons.ts shown as a preview grid on the product card. */
  previewIcons: string[];
  /** Total icons actually included in the pack (previewIcons is just a sample of this). */
  totalIcons: number;
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

/** The exact icon names bundled in the Essencial pack (see scripts used to
 * build icon-packs/icons-essencial.zip) — Pro and Completo both include the
 * full ICON_NAMES catalog from src/lib/icons.ts (Lucide, ISC license). */
export const ESSENCIAL_ICON_NAMES = [
  "home",
  "search",
  "user",
  "mail",
  "check",
  "x",
  "plus",
  "minus",
  "edit",
  "trash",
  "download",
  "star",
  "heart",
  "calendar",
  "clock",
  "folder",
  "file",
  "settings",
  "bell",
  "shopping-cart",
  "phone",
  "map-pin",
  "lock",
  "image",
  "share",
];

/** Which of our icon packs include a given icon, for catalog detail views. */
export function packsIncluding(iconName: string): Product[] {
  return iconPacks.filter(
    (pack) => pack.id === "icons-essencial" ? ESSENCIAL_ICON_NAMES.includes(iconName) : true
  );
}

export const iconPacks: Product[] = [
  {
    id: "icons-essencial",
    name: "Pacote Essencial",
    description: `${ESSENCIAL_ICON_NAMES.length} ícones vetoriais essenciais para começar qualquer projeto.`,
    price: "$9",
    features: [`${ESSENCIAL_ICON_NAMES.length} ícones SVG`, "Estilo outline", "Licença uso comercial"],
    type: "one_time",
    priceIdEnvVar: "PADDLE_PRICE_ICONS_ESSENCIAL",
    previewIcons: ["home", "search", "heart", "star", "mail", "calendar", "folder", "settings"],
    totalIcons: ESSENCIAL_ICON_NAMES.length,
  },
  {
    id: "icons-pro",
    name: "Pacote Pro",
    description: `${ICON_NAMES.length} ícones vetoriais, prontos para produção.`,
    price: "$24",
    features: [
      `${ICON_NAMES.length} ícones SVG`,
      "Estilo outline consistente",
      "Licença uso comercial",
    ],
    type: "one_time",
    priceIdEnvVar: "PADDLE_PRICE_ICONS_PRO",
    highlighted: true,
    previewIcons: ["home", "search", "shopping-cart", "credit-card", "bar-chart", "camera", "music", "share"],
    totalIcons: ICON_NAMES.length,
  },
  {
    id: "icons-completo",
    name: "Pacote Completo",
    description: "Todo o catálogo de ícones, incluindo lançamentos futuros.",
    price: "$49",
    features: [
      `${ICON_NAMES.length} ícones SVG (todo o catálogo atual)`,
      "Estilo outline consistente",
      "Licença uso comercial",
      "Atualizações vitalícias incluídas",
    ],
    type: "one_time",
    priceIdEnvVar: "PADDLE_PRICE_ICONS_COMPLETO",
    previewIcons: ["home", "search", "shopping-cart", "tag", "bar-chart", "wifi", "video", "shield", "sun", "moon"],
    totalIcons: ICON_NAMES.length,
  },
];
