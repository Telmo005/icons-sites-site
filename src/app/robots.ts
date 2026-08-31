import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/account", "/app", "/welcome", "/auth"],
    },
    sitemap: "https://icons-and-saas.vercel.app/sitemap.xml",
  };
}
