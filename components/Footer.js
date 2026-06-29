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
    <footer className="bg-[var(--ll-ink)] text-[var(--ll-slate-text)]">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-8 py-12">
        {hasValidConfig ? (
          /* Dynamic Backend Rendered Grid */
          <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
            {config.columns.map((col, index) => {
              if (col.type === "logo_desc") {
                return (
                  <div key={index}>
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--ll-gold)] mb-5">
                      {col.title || "About Us"}
                    </h3>
                    {col.logoUrl && (
                      <img
                        src={col.logoUrl}
                        alt="Logo"
                        className="mb-4 h-6 w-auto opacity-80" style={{filter:"brightness(0.9) sepia(0.1)"}}
                      />
                    )}
                    <p className="text-sm text-[var(--ll-slate-text)] leading-relaxed">
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
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--ll-gold)] mb-5">
                      {col.title}
                    </h3>
                    <ul className="space-y-2">
                      {links.map((link, idx) => (
                        <li key={link.label || `col-link-${idx}`}>
                          <Link
                            href={link.url || link.href || "#"}
                            className="text-sm text-[var(--ll-slate-text)] hover:text-[var(--ll-gold)] transition-colors duration-150"
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
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--ll-gold)] mb-5">
                      {col.title}
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                      {dynamicAddress && <li><span className="text-[var(--ll-gold)] font-semibold">Address: </span>{dynamicAddress}</li>}
                      {dynamicPhone && (
                        <li>
                          <span className="text-[var(--ll-gold)] font-semibold">Phone: </span>
                          <a
                            href={`tel:${dynamicPhone}`}
                            className="hover:text-[var(--ll-gold)] transition"
                          >
                            {dynamicPhone}
                          </a>
                        </li>
                      )}
                      {dynamicEmail && (
                        <li>
                          <span className="text-[var(--ll-gold)] font-semibold">Email: </span>
                          <a
                            href={`mailto:${dynamicEmail}`}
                            className="hover:text-[var(--ll-gold)] transition"
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
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--ll-gold)] mb-5">
                      {col.title}
                    </h3>
                    <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                      Subscribe to our newsletter for the latest updates.
                    </p>
                    <form onSubmit={handleNewsletterSubmit} className="flex rounded-[var(--ll-radius-sm)] overflow-hidden border border-white/10 bg-white/5 p-1 focus-within:border-[var(--ll-gold)]/40 transition-colors">
                      <input
                        type="email"
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        placeholder={col.newsletterPlaceholder || "Email Address"}
                        className="bg-transparent px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none"
                        required
                        disabled={newsletterLoading}
                      />
                      <button
                        type="submit"
                        disabled={newsletterLoading}
                        className="bg-[var(--ll-gold)] hover:bg-[var(--ll-gold-dark)] text-[var(--ll-ink)] font-bold px-4 py-2 text-xs rounded-[4px] transition-colors cursor-pointer"
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
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--ll-gold)] mb-5">
                  Categories
                </h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                  <ul className="space-y-2">
                    {categoriesCol1.map((cat) => (
                      <li key={cat.name}>
                        <Link
                          href={cat.href}
                          className="text-sm text-[var(--ll-slate-text)] hover:text-[var(--ll-gold)] transition-colors duration-150"
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
                          className="text-sm text-[var(--ll-slate-text)] hover:text-[var(--ll-gold)] transition-colors duration-150"
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
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--ll-gold)] mb-5">
                Quick Links
              </h3>
              <ul className="space-y-2">
                {(navigation.main || navigation.footer || []).map((link, idx) => (
                  <li key={link.label || link.name || `fallback-link-${idx}`}>
                    <Link
                      href={link.url || link.href || "#"}
                      className="text-sm text-[var(--ll-slate-text)] hover:text-[var(--ll-gold)] transition-colors duration-150"
                    >
                      {link.label || link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Dynamic Contact details fallback */}
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--ll-gold)] mb-5">
                Contact Info
              </h3>
              <ul className="space-y-2 text-sm text-gray-400">
                {contactDetails?.addresses?.[0] && (
                  <li>
                    <span className="text-[var(--ll-gold)] font-semibold">Address: </span>{
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
                      className="hover:text-[var(--ll-gold)] transition"
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
                      className="hover:text-[var(--ll-gold)] transition"
                    >
                      {contactDetails.emails[0].address}
                    </a>
                  </li>
                )}
              </ul>
            </div>

            {/* About / Branding */}
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--ll-gold)] mb-5">
                {siteName}
              </h3>
              <p className="text-sm text-[var(--ll-slate-text)] leading-relaxed">
                © {new Date().getFullYear()}{" "}
                <span className="italic text-[#d9b04f]">{siteName}</span>{" "}
                – The House For All Legal Info. For the People, By the Law Lovers.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/8">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
          <p className="text-xs text-[var(--ll-light-text)]">{copyrightText}</p>
        </div>
      </div>
    </footer>
  );
}