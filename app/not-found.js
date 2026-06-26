import Link from "next/link";
import { cms } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function NotFound() {
  let custom404 = {
    enabled: true,
    title: "Page Not Found",
    description: "Oops! The page you are looking for does not exist.",
    buttonText: "Go Home",
    buttonLink: "/",
    redirectOn404: false,
    redirectUrl: "/",
    redirectDelay: 5,
  };

  try {
    const settings = await cms.getSettings();
    if (settings?.websiteSettings?.custom404) {
      custom404 = { ...custom404, ...settings.websiteSettings.custom404 };
    }
  } catch (e) {
    console.error("Failed to load custom 404 settings:", e);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="max-w-lg text-center space-y-6">
        <div className="text-8xl font-black text-slate-200">404</div>

        <h1 className="text-3xl font-bold text-slate-900">
          {custom404.title}
        </h1>

        <p className="text-slate-500 text-lg leading-relaxed">
          {custom404.description}
        </p>

        {custom404.enabled && (
          <Link
            href={custom404.buttonLink || "/"}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition shadow-sm"
          >
            {custom404.buttonText || "Go Home"}
          </Link>
        )}

        <div className="pt-4">
          <Link
            href="/"
            className="text-sm text-slate-400 hover:text-slate-600 transition"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
