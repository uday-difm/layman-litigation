export const dynamic = "force-dynamic";

export async function GET() {
  const cmsBaseUrl = process.env.NEXT_PUBLIC_CMS_BASE_URL || "http://localhost:3000";
  const siteId = process.env.NEXT_PUBLIC_SITE_ID || "layman_litigation";

  try {
    const res = await fetch(`${cmsBaseUrl}/api/seo/robots?siteId=${encodeURIComponent(siteId)}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch robots.txt: status ${res.status}`);
    }

    const text = await res.text();
    return new Response(text, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Error in robots.txt proxy route:", error);
    // Standard robots.txt fallback if backend/CMS is unreachable
    return new Response("User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /dashboard/\n", {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }
}
