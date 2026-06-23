// app/sitemap.js
import { CMSClient } from "@yourcompany/global-backend-next";

const cms = new CMSClient({
  baseUrl: process.env.NEXT_PUBLIC_CMS_BASE_URL || "http://localhost:3000",
  siteId: process.env.NEXT_PUBLIC_SITE_ID || "layman_litigation",
});

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
