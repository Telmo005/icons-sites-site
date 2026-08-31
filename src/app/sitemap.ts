import type { MetadataRoute } from "next";

const BASE_URL = "https://icons-and-saas.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/icones", priority: 0.9 },
    { path: "/pacotes", priority: 0.9 },
    { path: "/pricing", priority: 0.9 },
    { path: "/login", priority: 0.5 },
    { path: "/contacto", priority: 0.5 },
    { path: "/termos", priority: 0.3 },
    { path: "/privacidade", priority: 0.3 },
    { path: "/reembolsos", priority: 0.3 },
  ];

  return pages.map(({ path, priority }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    priority,
  }));
}
