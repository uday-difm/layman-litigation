
import Header from "@/components/Header";
import "./globals.css";

import { Inter } from 'next/font/google';
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrolltoTop";
import { CMSClient } from "@yourcompany/global-backend-next";
import { GlobalAnalytics, Header as SDKHeader, Footer as SDKFooter } from "@yourcompany/global-backend-next/components";

const inter = Inter({
  subsets: ['latin'],
});

export const metadata = {
  title: "Layman Litigation",
};

const cms = new CMSClient({
  baseUrl: process.env.NEXT_PUBLIC_CMS_BASE_URL || "http://localhost:3000",
  siteId: process.env.NEXT_PUBLIC_SITE_ID || "layman_litigation"
});

export default async function RootLayout({ children }) {
  let settings = null;
  try {
    const data = await cms.getGlobalSettings();
    settings = data.settings;
  } catch (e) {
    console.error("Failed to load global settings:", e);
  }

  const siteName = settings?.websiteSettings?.title || "Layman Litigation";
  const logoUrl = settings?.websiteSettings?.logoUrl;
  const navigationLinks = settings?.navigation?.links || [];

  return (
    <html
      lang="en"
      className={`${inter.className} h-full antialiased`}
    >
      <head>
        <GlobalAnalytics settings={settings} />
      </head>
      <body className="min-h-full flex flex-col">
        {settings ? (
          <SDKHeader
            logoUrl={logoUrl}
            siteName={siteName}
            headerSettings={settings.header}
            navigationLinks={navigationLinks}
          />
        ) : (
          <Header />
        )}
        {children}
        {settings ? (
          <SDKFooter
            siteName={siteName}
            footerSettings={settings.footer}
            navigationLinks={navigationLinks}
          />
        ) : (
          <Footer />
        )}
        <ScrollToTop />
      </body>
    </html>
  );
}
