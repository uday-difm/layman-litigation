"use client";

import { useState } from "react";
import Link from "next/link";

// const fallbackCategoriesCol1 = [
//   { name: "Business Law", href: "/category/business-law" },
//   { name: "Civil Litigation", href: "/category/civil-litigation" },
//   { name: "Corporate", href: "/category/corporate" },
//   { name: "Cybersecurity Law", href: "/category/cybersecurity-law" },
//   { name: "Election Law", href: "/category/election-law" },
//   { name: "Employment", href: "/category/employment" },
//   { name: "Environmental Law", href: "/category/environmental-law" },
//   { name: "General Practice", href: "/category/general-practice" },
//   { name: "Immigration", href: "/category/immigration" },
//   { name: "Intellectual Property", href: "/category/intellectual-property" },
// ];

// const fallbackCategoriesCol2 = [
//   { name: "Layman Litigation", href: "/category/layman-litigation" },
//   { name: "Mass Tort", href: "/category/mass-tort" },
//   { name: "Media Law", href: "/category/media-law" },
//   { name: "Medical Malpractice", href: "/category/medical-malpractice" },
//   { name: "Personal Injury", href: "/category/personal-injury" },
//   { name: "Political Law", href: "/category/political-law" },
//   { name: "Social Security Disability", href: "/category/social-security-disability" },
//   { name: "Tax", href: "/category/tax" },
//   { name: "Technology Law", href: "/category/technology-law" },
//   { name: "Trade Law", href: "/category/trade-law" },
// ];

// const quickLinks = [
//   { name: "Home", href: "/" },
//   { name: "About us", href: "/about" },
//   { name: "Contact Us", href: "/contact" },
//   { name: "Privacy & Policy", href: "/privacy-policy" },
//   { name: "Other Links", href: "/other" },
// ];

export default function Footer({
  config = null,
  categories = [],
  navigation = {},
  contactDetails = null,
  siteName = "Layman Litigation",
}) {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterMsg, setNewsletterMsg] = useState(null);

  async function handleNewsletterSubmit(e) {
    e.preventDefault();
    setNewsletterLoading(true);
    setNewsletterMsg(null);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_CMS_BASE_URL || "http://localhost:3000";
      const res = await fetch(`${baseUrl}/api/forms/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteId: process.env.NEXT_PUBLIC_SITE_ID || "layman_litigation",
          name: "Newsletter Subscriber",
          email: newsletterEmail,
          message: "Subscribe to newsletter from footer",
          _hp: "",
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setNewsletterMsg({ type: "error", text: json.error || "Subscription failed" });
        return;
      }
      setNewsletterMsg({
        type: "success",
        text: "Subscribed successfully!",
      });
      setNewsletterEmail("");
    } catch (err) {
      setNewsletterMsg({ type: "error", text: "Network error" });
    } finally {
      setNewsletterLoading(false);
    }
  }

  const hasValidConfig =
    config &&
    typeof config === "object" &&
    config.layout === "4-columns" &&
    Array.isArray(config.columns) &&
    config.columns.length === 4;

  // Split categories for double column layout if available
  let categoriesCol1 = [];
  let categoriesCol2 = [];

  if (categories && categories.length > 0) {
    const half = Math.ceil(categories.length / 2);
    categoriesCol1 = categories.slice(0, half).map((c) => ({
      name: c.name,
      href: `/category/${c.slug}`,
    }));
    categoriesCol2 = categories.slice(half).map((c) => ({
      name: c.name,
      href: `/category/${c.slug}`,
    }));
  }

  const copyrightText =
    config?.copyright ||
    `Copyright © ${new Date().getFullYear()} ${siteName}. All rights reserved.`;

  return (
    <footer className="bg-[#212121] text-gray-300">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-8 py-12">
        {hasValidConfig ? (
          /* Dynamic Backend Rendered Grid */
          <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
            {config.columns.map((col, index) => {
              if (col.type === "logo_desc") {
                return (
                  <div key={index}>
                    <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-[#d9b04f]">
                      {col.title || "About Us"}
                    </h3>
                    {col.logoUrl && (
                      <img
                        src={col.logoUrl}
                        alt="Logo"
                        className="mb-4 h-6 w-auto opacity-80"
                      />
                    )}
                    <p className="text-sm leading-relaxed text-gray-400">
                      {col.description}
                    </p>
                  </div>
                );
              }

              if (col.type === "links") {
                const links =
                  col.sourceType === "navigation"
                    ? (navigation[col.menuType || "footer"] || [])
                    : (col.items || []);
                return (
                  <div key={index}>
                    <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-[#d9b04f]">
                      {col.title}
                    </h3>
                    <ul className="space-y-2">
                      {links.map((link, idx) => (
                        <li key={link.label || `col-link-${idx}`}>
                          <Link
                            href={link.url || link.href || "#"}
                            className="text-sm text-gray-400 transition-colors hover:text-[#d9b04f]"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              }

              if (col.type === "contact") {
                // Dynamically fetch from global contactDetails if set, otherwise fallback to column configuration
                const dynamicAddress = contactDetails?.addresses?.[0]
                  ? [
                      contactDetails.addresses[0].line1,
                      contactDetails.addresses[0].line2,
                      `${contactDetails.addresses[0].city}, ${contactDetails.addresses[0].state} ${contactDetails.addresses[0].postalCode}`
                    ].filter(Boolean).join(", ")
                  : col.address;

                const dynamicPhone = contactDetails?.phones?.[0]?.number || col.phone;
                const dynamicEmail = contactDetails?.emails?.[0]?.address || col.email;

                return (
                  <div key={index}>
                    <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-[#d9b04f]">
                      {col.title}
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                      {dynamicAddress && <li>Address: {dynamicAddress}</li>}
                      {dynamicPhone && (
                        <li>
                          Phone:{" "}
                          <a
                            href={`tel:${dynamicPhone}`}
                            className="hover:text-[#d9b04f] transition"
                          >
                            {dynamicPhone}
                          </a>
                        </li>
                      )}
                      {dynamicEmail && (
                        <li>
                          Email:{" "}
                          <a
                            href={`mailto:${dynamicEmail}`}
                            className="hover:text-[#d9b04f] transition"
                          >
                            {dynamicEmail}
                          </a>
                        </li>
                      )}
                    </ul>
                  </div>
                );
              }

              if (col.type === "newsletter") {
                return (
                  <div key={index}>
                    <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-[#d9b04f]">
                      {col.title}
                    </h3>
                    <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                      Subscribe to our newsletter for the latest updates.
                    </p>
                    <form onSubmit={handleNewsletterSubmit} className="flex max-w-sm rounded-lg overflow-hidden border border-gray-700 bg-neutral-950/40 p-1">
                      <input
                        type="email"
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        placeholder={col.newsletterPlaceholder || "Email Address"}
                        className="w-full bg-transparent px-3 py-1.5 text-xs text-white focus:outline-hidden"
                        required
                        disabled={newsletterLoading}
                      />
                      <button
                        type="submit"
                        disabled={newsletterLoading}
                        className="bg-[#d9b04f] text-[#1b1b1b] font-bold px-4 py-1.5 text-xs hover:bg-[#c49d41] transition rounded cursor-pointer"
                      >
                        {newsletterLoading ? "Joining..." : (col.newsletterButtonText || "Join")}
                      </button>
                    </form>
                    {newsletterMsg && (
                      <p className={`mt-2 text-xs font-semibold ${newsletterMsg.type === "error" ? "text-red-500" : "text-green-500"}`}>
                        {newsletterMsg.text}
                      </p>
                    )}
                  </div>
                );
              }

              return null;
            })}
          </div>
        ) : (
          /* Fallback styled layout (Hybrid with dynamic categories & settings) */
          <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
            {/* Categories */}
            {(categoriesCol1.length > 0 || categoriesCol2.length > 0) && (
              <div className="md:col-span-2">
                <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-[#d9b04f]">
                  Categories
                </h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                  <ul className="space-y-2">
                    {categoriesCol1.map((cat) => (
                      <li key={cat.name}>
                        <Link
                          href={cat.href}
                          className="text-sm text-gray-400 transition-colors hover:text-[#d9b04f]"
                        >
                          {cat.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <ul className="space-y-2">
                    {categoriesCol2.map((cat) => (
                      <li key={cat.name}>
                        <Link
                          href={cat.href}
                          className="text-sm text-gray-400 transition-colors hover:text-[#d9b04f]"
                        >
                          {cat.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Quick Links / Navigation fallback */}
            <div>
              <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-[#d9b04f]">
                Quick Links
              </h3>
              <ul className="space-y-2">
                {(navigation.main || navigation.footer || []).map((link, idx) => (
                  <li key={link.label || link.name || `fallback-link-${idx}`}>
                    <Link
                      href={link.url || link.href || "#"}
                      className="text-sm text-gray-400 transition-colors hover:text-[#d9b04f]"
                    >
                      {link.label || link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Dynamic Contact details fallback */}
            <div>
              <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-[#d9b04f]">
                Contact Info
              </h3>
              <ul className="space-y-2 text-sm text-gray-400">
                {contactDetails?.addresses?.[0] && (
                  <li>
                    Address: {
                      [
                        contactDetails.addresses[0].line1,
                        contactDetails.addresses[0].line2,
                        `${contactDetails.addresses[0].city}, ${contactDetails.addresses[0].state} ${contactDetails.addresses[0].postalCode}`
                      ].filter(Boolean).join(", ")
                    }
                  </li>
                )}
                {contactDetails?.phones?.[0]?.number && (
                  <li>
                    Phone:{" "}
                    <a
                      href={`tel:${contactDetails.phones[0].number}`}
                      className="hover:text-[#d9b04f] transition"
                    >
                      {contactDetails.phones[0].number}
                    </a>
                  </li>
                )}
                {contactDetails?.emails?.[0]?.address && (
                  <li>
                    Email:{" "}
                    <a
                      href={`mailto:${contactDetails.emails[0].address}`}
                      className="hover:text-[#d9b04f] transition"
                    >
                      {contactDetails.emails[0].address}
                    </a>
                  </li>
                )}
              </ul>
            </div>

            {/* About / Branding */}
            <div>
              <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-[#d9b04f]">
                {siteName}
              </h3>
              <p className="text-sm leading-relaxed text-gray-400">
                © {new Date().getFullYear()}{" "}
                <span className="italic text-[#d9b04f]">{siteName}</span>{" "}
                – The House For All Legal Info. For the People, By the Law Lovers.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
          <p className="text-xs text-gray-500">{copyrightText}</p>
        </div>
      </div>
    </footer>
  );
}