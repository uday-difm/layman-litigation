// middleware.js
// Runs on every page request (Next.js Edge Runtime).
// Fetches redirect rules from the CMS backend and redirects matching paths.

import { NextResponse } from "next/server";

const CMS_ORIGIN = process.env.NEXT_PUBLIC_CMS_BASE_URL || "http://localhost:3000";
const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || "layman_litigation";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip internal Next.js routes, static files, and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|woff|woff2|ttf|otf|map)$/)
  ) {
    return NextResponse.next();
  }

  try {
    // Guard: skip redirect lookup if CMS is the same origin as this request
    // (prevents infinite loop when layman-litigation mistakenly runs on the same port as the backend)
    const requestOrigin = request.nextUrl.origin;
    if (CMS_ORIGIN === requestOrigin) {
      console.warn("[Middleware] CMS_ORIGIN matches current app origin — skipping redirect lookup to prevent loop.");
      return NextResponse.next();
    }

    // Look up an exact redirect rule for this source path
    const url = `${CMS_ORIGIN}/api/redirects?siteId=${encodeURIComponent(SITE_ID)}&source=${encodeURIComponent(pathname)}`;
    const res = await fetch(url, { cache: "no-store" });

    if (res.ok) {
      const data = await res.json();
      const rule = data?.redirect;

      if (rule && rule.target) {
        const destination = rule.target.startsWith("http")
          ? rule.target
          : new URL(rule.target, request.nextUrl.origin).toString();

        const statusCode = rule.type === 302 ? 302 : 301;
        return NextResponse.redirect(destination, { status: statusCode });
      }
    }
  } catch (err) {
    // If the CMS is unreachable, do not block the request - just continue
    console.error("[Middleware] Failed to fetch redirect rules:", err.message);
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except Next.js static assets
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
