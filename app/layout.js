import { Inter } from "next/font/google";
import SdkHeader from "@/components/SdkHeader";
import SdkFooter from "@/components/SdkFooter";
import { GlobalAnalytics } from "@yourcompany/global-backend-next/components";
import ScrollToTop from "@/components/ScrolltoTop";
import { cms } from "@/lib/cms";
import VisitorTracker from "@/components/VisitorTracker";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import CtaWidgets from "@/components/CtaWidgets";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export async function generateMetadata() {
  try {
    const data = await cms.getGlobalSettings();
    const ws = data?.settings?.websiteSettings || {};
    const favicon = ws.favicon || ws.faviconUrl; // support both field names
    return {
      title: ws.title || "Layman Litigation",
      ...(favicon && {
        icons: { icon: favicon, shortcut: favicon },
      }),
    };
  } catch {
    return { title: "Layman Litigation" };
  }
}

export default async function RootLayout({ children }) {
  let headerLayout = {};
  let navigation = { items: [] };
  try {
    headerLayout = await cms.getHeaderLayout();
    navigation = await cms.getNavigation();
  } catch (e) {
    console.error("Failed to load header/navigation:", e);
  }

  let settings = null;
  try {
    const data = await cms.getGlobalSettings();
    settings = data.settings;
  } catch (e) {
    console.error("Failed to load global settings:", e);
  }
  // Maintenance mode check
  const maintenanceMode = settings?.websiteSettings?.maintenanceMode === true;

  // Fetch footer layout dynamically
  let footerSettings = null;
  try {
    const footerResponse = await cms.getFooterLayout();
    footerSettings = footerResponse.footer;
  } catch (e) {
    console.error("Failed to load footer layout:", e);
  }

  const siteName = settings?.websiteSettings?.title || "Layman Litigation";
  const logoUrl = settings?.websiteSettings?.logoUrl;

  if (maintenanceMode) {
    return (
      <html lang="en" className={`${inter.className} h-full antialiased`}>
        <head>
          <title>{siteName} - Maintenance</title>
          <meta name="robots" content="noindex, nofollow" />
        </head>
        <body className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-amber-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5h0"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-3">
              Under Maintenance
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              {settings.websiteSettings.maintenanceMessage ||
                "We are currently undergoing scheduled maintenance. Please check back shortly."}
            </p>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <head>
        <GlobalAnalytics settings={settings} />
      </head>
      <body className="min-h-full flex flex-col">
        <VisitorTracker />
        <SdkHeader
          logoUrl={logoUrl}
          siteName={siteName}
          headerSettings={headerLayout?.header || headerLayout} // ← unwrap .header
          navigationLinks={navigation?.items || []}
        />

        {children}
        <SdkFooter
          siteName={siteName}
          footerSettings={footerSettings}
          navigationLinks={navigation?.items || []}
        />
        <ScrollToTop />
        <CookieConsentBanner complianceSettings={settings?.compliance} />
        <CtaWidgets ctaConfig={settings?.ctaConfig} />
      </body>
    </html>
  );
}
