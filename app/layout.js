
import Header from "@/components/Header";
import "./globals.css";

import { Inter } from 'next/font/google';
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrolltoTop";

const inter = Inter({
  subsets: ['latin'],
});

export const metadata = {
  title: "Layman Litigation",

};



export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"><Header />{children}
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
