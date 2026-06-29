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
    <div className="min-h-screen bg-[var(--ll-mist)] flex items-center justify-center px-6">
      <div className="bg-[var(--ll-cream)] rounded-[var(--ll-radius-lg)] p-12 md:p-16 shadow-[var(--ll-shadow-lift)] border border-[var(--ll-stone)] text-center max-w-lg mx-auto">
        {/* 404 Graphic */}
        <div className="text-8xl font-black text-[var(--ll-gold)] mb-4 opacity-90 tracking-[-0.05em] leading-none">
          404
        </div>

        <h1 className="text-3xl font-extrabold text-[var(--ll-ink)] mb-4">
          {title}
        </h1>

        <p className="text-[var(--ll-slate-text)] text-sm leading-relaxed mb-10">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={buttonLink}
            className="px-7 py-3.5 rounded-[var(--ll-radius-sm)] bg-[var(--ll-gold)] hover:bg-[var(--ll-gold-dark)] text-[var(--ll-ink)] font-bold text-sm tracking-wide shadow-sm transition-all duration-200 hover:-translate-y-px active:translate-y-0"
          >
            {buttonText}
          </Link>

          <Link
            href="/"
            className="px-7 py-3.5 rounded-[var(--ll-radius-sm)] border-2 border-[var(--ll-ink)] text-[var(--ll-ink)] font-bold text-sm tracking-wide hover:bg-[var(--ll-ink)] hover:text-white transition-all duration-200"
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
