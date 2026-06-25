import Header from "@/components/Header";
import "./globals.css";

import { Inter } from "next/font/google";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrolltoTop";
import { cms } from "@/lib/cms";
import { GlobalAnalytics } from "@yourcompany/global-backend-next/components";
import VisitorTracker from "@/components/VisitorTracker";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import CtaWidgets from "@/components/CtaWidgets";

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
  const headerLayout = await cms.getHeaderLayout();
  const navigation = await cms.getNavigation();
  let footerNavigation = null;
  try {
    footerNavigation = await cms.getNavigation("footer");
  } catch (e) {
    console.error("Failed to load footer navigation:", e);
  }
  const navigationMenus = {
    main: navigation?.items || [],
    footer: footerNavigation?.items || [],
  };
  let settings = null;
  try {
    const data = await cms.getGlobalSettings();
    settings = data.settings;
  } catch (e) {
    console.error("Failed to load global settings:", e);
  }

  // Fetch posts dynamically to extract active categories
  let categories = [];
  try {
    const postsResponse = await cms.getPosts();
    const posts = postsResponse.posts || [];
    const categoriesMap = new Map();
    posts.forEach((post) => {
      if (post.categories) {
        post.categories.forEach((cat) => {
          categoriesMap.set(cat.slug, cat);
        });
      }
    });
    categories = Array.from(categoriesMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  } catch (e) {
    console.error("Failed to load categories in layout:", e);
  }

  // Fetch footer layout dynamically
  let footerConfig = null;
  try {
    const footerResponse = await cms.getFooterLayout();
    footerConfig = footerResponse.footer;
  } catch (e) {
    console.error("Failed to load footer layout:", e);
  }

  const siteName = settings?.websiteSettings?.title || "Layman Litigation";
  const logoUrl = settings?.websiteSettings?.logoUrl;
  const navigationLinks = settings?.navigation?.links || [];
  console.log(settings?.compliance);
  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <head>
        <GlobalAnalytics settings={settings} />
      </head>
      <body className="min-h-full flex flex-col">
        <VisitorTracker />
        <Header
          config={headerLayout}
          navigation={navigation}
          categories={categories}
        />
        {children}
        <Footer
          config={footerConfig}
          categories={categories}
          navigation={navigationMenus}
          contactDetails={settings?.contactDetails}
          siteName={siteName}
        />
        <ScrollToTop />
        <CookieConsentBanner complianceSettings={settings?.compliance} />
        <CtaWidgets ctaConfig={settings?.ctaConfig} />
      </body>
    </html>
  );
}
