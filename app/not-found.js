// app/not-found.js — Custom 404 page driven by CMS settings with fallback
import Link from "next/link";
import { cms } from "@/lib/cms";
import ClientRedirect from "./ClientRedirect";

export const dynamic = "force-dynamic";

export default async function NotFoundPage() {
  let custom404 = null;

  try {
    const data = await cms.getGlobalSettings();
    custom404 = data?.settings?.websiteSettings?.custom404 || null;
  } catch (e) {
    console.error("Failed to load custom 404 settings:", e);
  }

  const enabled = custom404?.enabled !== false;
  const title = custom404?.title || "Page Not Found";
  const description =
    custom404?.description ||
    "Oops! The page you are looking for does not exist.";
  const buttonText = custom404?.buttonText || "Go Home";
  const buttonLink = custom404?.buttonLink || "/";
  const redirectOn404 = custom404?.redirectOn404 ?? false;
  const redirectUrl = custom404?.redirectUrl || "/";
  const redirectDelay = custom404?.redirectDelay ?? 5;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="text-center max-w-lg mx-auto py-20">
        {/* 404 Graphic */}
        <div className="text-8xl font-extrabold text-[#d9b04f] mb-6 opacity-80">
          404
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
          {title}
        </h1>

        <p className="text-sm text-slate-500 leading-relaxed mb-8 max-w-md mx-auto">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={buttonLink}
            className="px-6 py-3 bg-[#d9b04f] hover:bg-[#c49d41] text-[#1b1b1b] rounded-lg font-bold shadow transition hover:-translate-y-0.5"
          >
            {buttonText}
          </Link>

          <Link
            href="/"
            className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-semibold transition hover:-translate-y-0.5"
          >
            Back to Home
          </Link>
        </div>

        {/* Auto-redirect when enabled */}
        {redirectOn404 && (
          <ClientRedirect url={redirectUrl} delay={redirectDelay} />
        )}
      </div>
    </div>
  );
}
