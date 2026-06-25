// app/sitemap.js
import { cms } from "@/lib/cms";

export default async function sitemap() {
  const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";
  const now = new Date().toISOString();

  try {
    // 1. Static routes the frontend knows about
    const staticRoutes = [
      { url: `${domain}/`, lastModified: now },
      { url: `${domain}/blogs`, lastModified: now },
    ];

    // 2. Dynamic content from backend (pages, posts, legal pages)
    const cmsItems = await cms.getSitemap(domain);

    // 3. Combine and deduplicate by URL
    const allUrls = new Map();
    for (const item of [...staticRoutes, ...cmsItems]) {
      const finalUrl = item.url.startsWith("http")
        ? item.url
        : `${domain}${item.url.startsWith("/") ? "" : "/"}${item.url}`;
      // Only add if we haven't seen this URL (static routes take priority)
      if (!allUrls.has(finalUrl)) {
        allUrls.set(finalUrl, item.lastModified || now);
      }
    }

    return Array.from(allUrls.entries()).map(([url, lastModified]) => ({
      url,
      lastModified,
    }));
  } catch (e) {
    console.error("Failed to generate sitemap:", e);
    return [{ url: `${domain}/`, lastModified: now }];
  }
}
