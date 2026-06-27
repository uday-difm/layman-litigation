export const dynamic = "force-dynamic";

export async function GET() {
  const cmsBaseUrl = process.env.NEXT_PUBLIC_CMS_BASE_URL || "http://localhost:3000";
  const siteId = process.env.NEXT_PUBLIC_SITE_ID || "layman_litigation";
  
  try {
    const res = await fetch(`${cmsBaseUrl}/api/seo/llm-txt?siteId=${encodeURIComponent(siteId)}`, {
      cache: "no-store",
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch llm.txt: status ${res.status}`);
    }
    
    const text = await res.text();
    return new Response(text, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Error in llm.txt proxy route:", error);
    return new Response("# AI Crawling Instructions (CMS Offline)", {
      status: 500,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }
}
