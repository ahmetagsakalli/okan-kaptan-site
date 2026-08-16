import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://okankaptan.com";
const routes = [
  { path: "", priority: 1 },
  { path: "/galeri", priority: 0.86 },
  { path: "/hakkimizda", priority: 0.82 },
  { path: "/turlar", priority: 0.9 },
  { path: "/turlar/yaz", priority: 0.86 },
  { path: "/turlar/kis", priority: 0.86 },
  { path: "/rota", priority: 0.82 },
  { path: "/teknemiz", priority: 0.82 },
  { path: "/kvkk", priority: 0.35 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => {
    const url = `${siteUrl}${route.path}`;

    return {
      url,
      lastModified: new Date("2026-08-13"),
      changeFrequency: "weekly",
      priority: route.priority,
      alternates: {
        languages: {
          tr: url,
        },
      },
    };
  });
}
