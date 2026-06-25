// app/sitemap.js
import { cms } from "@/lib/cms";

export default async function sitemap() {
  const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";
  try {
    const sitemapItems = await cms.getSitemap(domain);

    return sitemapItems.map((item) => ({
      url: item.url,
      lastModified: new Date(item.lastModified),
    }));
  } catch (e) {
    console.error("Failed to generate dynamic sitemap:", e);
    return [
      {
        url: `${domain}/`,
        lastModified: new Date(),
      },
    ];
  }
}
