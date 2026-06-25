// app/robots.js
import { cms } from "@/lib/cms";

export default async function robots() {
  const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

  try {
    const robotsTxt = await cms.getRobotsTxt();
    if (robotsTxt) {
      return {
        rules: [],
        sitemap: `${domain}/sitemap.xml`,
      };
    }
  } catch (e) {
    console.error("Failed to fetch robots.txt from CMS:", e);
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${domain}/sitemap.xml`,
  };
}
