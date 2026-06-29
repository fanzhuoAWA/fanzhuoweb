import { getCollection } from "astro:content";
import { USER_SITE } from "@config";

const STATIC_ROUTES = [
  "",
  "about",
  "blog",
  "blog/archives",
  "blog/categories",
  "blog/tags",
  "blog/search",
  "friend",
  "fcircle",
  "shuoshuo",
  "project",
];

export async function GET(context: { site: URL }) {
  const base = context.site?.origin || USER_SITE;

  const posts = await getCollection("blog");
  const filtered = import.meta.env.PROD
    ? posts.filter((p) => !p.data.draft)
    : posts;

  const urls = [
    ...STATIC_ROUTES.map((r) => `${base}/${r}`.replace(/\/+$/, "")),
    ...filtered.map((p) => `${base}/blog/${p.slug}/`),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((loc) => `  <url><loc>${loc}</loc></url>`).join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
