export const CATEGORIES: Record<string, string[]> = {
  Interface: [
    "home",
    "settings",
    "user",
    "users",
    "menu",
    "grid",
    "list",
    "filter",
    "search",
    "arrow-up",
    "arrow-down",
    "arrow-left",
    "arrow-right",
    "eye",
  ],
  Comunicação: ["bell", "mail", "chat", "phone", "share", "link"],
  Ações: ["check", "close", "plus", "minus", "edit", "trash", "download", "upload", "refresh", "copy"],
  Multimédia: ["play", "pause", "stop", "image", "camera", "video", "volume", "music"],
  Comércio: ["cart", "tag", "credit-card", "dollar", "percent", "chart"],
  Organização: ["folder", "file", "clock", "calendar"],
  Diversos: [
    "heart",
    "star",
    "flag",
    "bookmark",
    "lock",
    "unlock",
    "shield",
    "sun",
    "moon",
    "wifi",
    "cloud",
    "map-pin",
    "info",
    "warning",
  ],
};

export function categoryOf(iconName: string): string {
  for (const [category, names] of Object.entries(CATEGORIES)) {
    if (names.includes(iconName)) return category;
  }
  return "Diversos";
}
