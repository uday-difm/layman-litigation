"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";

// ─── Token maps ────────────────────────────────────────────────────────────────
const PADDING_MAP = { small: "py-2", medium: "py-4", large: "py-7" };
const SHADOW_MAP = { none: "", small: "shadow-sm", medium: "shadow-md" };

export default function Header({
  config = {},
  navigation = [],
  categories = [],
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);

  // Normalise data shape coming from the API
  const hdr = config.header ?? config ?? {};
  const navItems = Array.isArray(navigation?.items)
    ? navigation.items
    : Array.isArray(navigation)
      ? navigation
      : [];

  const {
    // Identity
    logoUrl = "",
    logoText = "MySite",
    logoType = "text",
    logoWidth = 120,
    logoHeight = 32,
    // Layout
    layout = "logo-left",
    paddingY = "medium",
    // Behaviour
    sticky = true,
    transparent = false,
    borderBottom = true,
    shadowSize = "small",
    // Navigation / CTA
    ctaText = "Get Started",
    ctaLink = "/contact",
    // Announcement
    announcementBar = {},
    // Mobile
    mobileMenu = {},
  } = hdr;

  const showMobileToggle = mobileMenu.enabled !== false;
  const mobileLayout = mobileMenu.layout ?? "drawer";
  const mobileLogo = mobileMenu.logoAlign ?? "left";

  // ─── Derived classes ──────────────────────────────────────────────────────────
  const headerBg = transparent ? "bg-transparent" : "bg-[var(--ll-cream)]/95 backdrop-blur-md";
  const paddingClass = PADDING_MAP[paddingY] ?? PADDING_MAP.medium;
  const shadowClass = SHADOW_MAP[shadowSize] ?? "";
  const stickyClass = sticky ? "sticky top-0 z-50" : "";
  const borderClass = borderBottom ? "border-b border-[var(--ll-stone)]" : "";

  // ─── Logo element (shared desktop + mobile) ───────────────────────────────────
  const LogoEl = () =>
    logoType === "image" && logoUrl ? (
      <Image
        src={logoUrl}
        alt={logoText}
        width={logoWidth}
        height={logoHeight}
        style={{ height: "auto" }}
        priority
      />
    ) : (
      <span className="font-black text-xl tracking-[-0.02em] text-[var(--ll-ink)]">{logoText}</span>
    );

  // ─── Desktop nav links ────────────────────────────────────────────────────────
  const DesktopNav = () => (
    <nav className="hidden md:flex items-center gap-8">
      {navItems.map((item, idx) => (
        <Link
          key={item.id || `desktop-nav-${idx}`}
          href={item.url}
          className="text-sm font-medium text-[var(--ll-slate-text)] hover:text-[var(--ll-gold)] transition-colors duration-200"
        >
          {item.label}
        </Link>
      ))}
      {categories?.length > 0 && (
        <div className="relative group py-2">
          <button className="flex items-center gap-1.5 text-sm font-medium text-[var(--ll-slate-text)] hover:text-[var(--ll-gold)] transition-colors duration-200 focus:outline-none cursor-pointer after:content-[''] after:block after:h-px after:bg-[var(--ll-gold)] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200">
            Categories
            <ChevronDown
              size={14}
              className="text-gray-400 group-hover:text-black transition duration-200"
            />
          </button>
          <div className="absolute left-0 mt-2 w-56 bg-[var(--ll-cream)] border border-[var(--ll-stone)] rounded-[var(--ll-radius-md)] shadow-[var(--ll-shadow-lift)] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 translate-y-1 group-hover:translate-y-0 z-50 p-2">
            {categories.map((cat, idx) => (
              <Link
                key={cat.id || cat.slug || `desktop-cat-${idx}`}
                href={`/category/${cat.slug}`}
                className="block text-sm text-[var(--ll-slate-text)] hover:text-[var(--ll-gold)] hover:bg-[var(--ll-mist)] rounded-[var(--ll-radius-sm)] px-4 py-2.5 transition-all duration-150"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );

  // ─── CTA Button ───────────────────────────────────────────────────────────────
  const CtaBtn = ({ className = "" }) =>
    ctaText ? (
      <Link
        href={ctaLink}
        className={`px-5 py-2.5 rounded-[var(--ll-radius-sm)] bg-[var(--ll-gold)] hover:bg-[var(--ll-gold-dark)] text-[var(--ll-ink)] font-bold text-sm tracking-wide transition-all duration-200 hover:-translate-y-px ${className}`}
      >
        {ctaText}
      </Link>
    ) : null;

  // ─── Inner row — varies per layout preset ─────────────────────────────────────
  const renderInner = () => {
    switch (layout) {
      // Logo Center, Nav Left, CTA Right
      case "logo-center":
        return (
          <div className={`flex items-center justify-between ${paddingClass}`}>
            <DesktopNav />
            <Link href="/" className="absolute left-1/2 -translate-x-1/2">
              <LogoEl />
            </Link>
            <div className="hidden md:flex">
              <CtaBtn />
            </div>
            {showMobileToggle && <MobileToggle />}
          </div>
        );

      // Split Header — Nav Left | Logo Center | Nav Right
      case "logo-split": {
        const half = Math.ceil(navItems.length / 2);
        const left = navItems.slice(0, half);
        const right = navItems.slice(half);
        return (
          <div className={`flex items-center justify-between ${paddingClass}`}>
            <nav className="hidden md:flex items-center gap-8">
              {left.map((item, idx) => (
                <Link
                  key={item.id || `split-left-${idx}`}
                  href={item.url}
                  className="text-sm font-medium text-[var(--ll-slate-text)] hover:text-[var(--ll-gold)] transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <Link href="/" className="absolute left-1/2 -translate-x-1/2">
              <LogoEl />
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              {right.map((item, idx) => (
                <Link
                  key={item.id || `split-right-${idx}`}
                  href={item.url}
                  className="text-sm font-medium text-[var(--ll-slate-text)] hover:text-[var(--ll-gold)] transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ))}
              <CtaBtn />
            </nav>
            {showMobileToggle && <MobileToggle />}
          </div>
        );
      }

      // Logo Right, Nav Left, CTA Center
      case "logo-right":
        return (
          <div className={`flex items-center justify-between ${paddingClass}`}>
            <DesktopNav />
            <div className="hidden md:flex">
              <CtaBtn />
            </div>
            <Link href="/">
              <LogoEl />
            </Link>
            {showMobileToggle && <MobileToggle />}
          </div>
        );

      // Stacked Centered — Logo top row, Nav + CTA bottom row
      case "stacked":
        return (
          <div className={`flex flex-col items-center gap-2 ${paddingClass}`}>
            <Link href="/">
              <LogoEl />
            </Link>
            <div className="flex items-center gap-8">
              <DesktopNav />
              <CtaBtn />
            </div>
          </div>
        );

      // Default: logo-left — Logo Left, Nav Center, CTA Right
      default:
        return (
          <div className={`flex items-center justify-between ${paddingClass}`}>
            <Link href="/">
              <LogoEl />
            </Link>
            <DesktopNav />
            <div className="hidden md:flex items-center gap-4">
              <CtaBtn />
            </div>
            {showMobileToggle && <MobileToggle />}
          </div>
        );
    }
  };

  // ─── Mobile toggle button ─────────────────────────────────────────────────────
  const MobileToggle = () => (
    <button onClick={() => setMobileOpen((o) => !o)} className="md:hidden p-1 text-[var(--ll-ink)] hover:text-[var(--ll-gold)] transition-colors">
      {mobileOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  );

  // ─── Mobile panel — drawer or dropdown ───────────────────────────────────────
  const MobilePanel = () => {
    if (!mobileOpen || !showMobileToggle) return null;

    const panelBase =
      mobileLayout === "drawer"
        ? "fixed inset-y-0 left-0 w-72 bg-[var(--ll-cream)] border-r border-[var(--ll-stone)] z-[60] flex flex-col overflow-y-auto"
        : "absolute top-full left-0 w-full bg-white border-t shadow-md z-50";

    return (
      <div className={panelBase}>
        {/* Mobile header row inside drawer */}
        {mobileLayout === "drawer" && (
          <div
            className={`flex items-center ${mobileLogo === "center" ? "justify-center" : "justify-between"} p-5 border-b`}
          >
            <Link href="/" onClick={() => setMobileOpen(false)}>
              <LogoEl />
            </Link>
            {mobileLogo !== "center" && (
              <button onClick={() => setMobileOpen(false)} className="p-1">
                <X size={20} />
              </button>
            )}
          </div>
        )}

        <nav className="flex flex-col p-4 gap-1">
          {navItems.map((item, idx) => (
            <Link
              key={item.id || `mobile-nav-${idx}`}
              href={item.url}
              className="py-3.5 border-b border-[var(--ll-stone)] text-sm font-medium text-[var(--ll-slate-text)] hover:text-[var(--ll-gold)] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          {/* Mobile Categories collapsible */}
          {categories?.length > 0 && (
            <div className="border-b py-3">
              <button
                onClick={() => setMobileCategoriesOpen((o) => !o)}
                className="flex w-full items-center justify-between text-sm font-medium text-gray-700"
              >
                Categories
                <ChevronDown
                  size={16}
                  className={`text-gray-400 transition-transform duration-200 ${mobileCategoriesOpen ? "rotate-180" : ""}`}
                />
              </button>
              {mobileCategoriesOpen && (
                <div className="mt-2 ml-4 flex flex-col gap-1 border-l-2 border-gray-100 pl-4">
                  {categories.map((cat, idx) => (
                    <Link
                      key={cat.id || cat.slug || `mobile-cat-${idx}`}
                      href={`/category/${cat.slug}`}
                      className="py-2 text-sm text-gray-600 hover:text-black"
                      onClick={() => setMobileOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          <CtaBtn className="mt-4 text-center" />
        </nav>
      </div>
    );
  };

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Announcement Bar */}
      {announcementBar?.enabled && (
        <div
          className="text-center py-2 text-sm font-medium font-medium text-sm"
          style={{
            backgroundColor: announcementBar.bgColor ?? "#2563eb",
            color: announcementBar.textColor ?? "#ffffff",
          }}
        >
          {announcementBar.link ? (
            <Link href={announcementBar.link}>{announcementBar.text}</Link>
          ) : (
            <span>{announcementBar.text}</span>
          )}
        </div>
      )}

      {/* Header */}
      <header
        className={`relative ${headerBg} ${stickyClass} ${borderClass} ${shadowClass}`}
      >
        <div className="max-w-7xl mx-auto px-6">{renderInner()}</div>

        {/* Mobile panel — rendered inside <header> so sticky context works */}
        <MobilePanel />
      </header>

      {/* Drawer backdrop */}
      {mobileOpen && mobileLayout === "drawer" && (
        <div
          className="fixed inset-0 bg-[var(--ll-ink)]/50 z-[55] md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}

// export default function Header({ config = {}, navigation = [], categories = [] }) {
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
//   console.log("Config: ", config.header, "Navigation: ", navigation.items);
//   navigation = navigation.items;
//   const {
//     logoUrl,
//     logoText,
//     logoType,
//     ctaText,
//     ctaLink,
//     sticky,
//     borderBottom,
//     announcementBar,
//     shadowSize,
//   } = config.header;

//   return (
//     <>
//       {/* Announcement Bar */}
//       {announcementBar?.enabled && (
//         <div
//           className="text-center py-2 text-sm font-medium"
//           style={{
//             backgroundColor: announcementBar.bgColor,
//             color: announcementBar.textColor,
//           }}
//         >
//           <Link href={announcementBar.link}>{announcementBar.text}</Link>
//         </div>
//       )}

//       {/* Header */}
//       <header
//         className={`
//           bg-white
//           ${sticky ? "sticky top-0 z-50" : ""}
//           ${borderBottom ? "border-b border-gray-200" : ""}
//           ${shadowSize === "small" ? "shadow-sm" : ""}
//         `}
//       >
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="flex items-center justify-between h-20">
//             {/* Logo */}
//             <Link href="/" className="flex items-center">
//               {logoType === "image" && logoUrl ? (
//                 <Image
//                   src={logoUrl}
//                   alt={logoText}
//                   width={120}
//                   height={24}
//                   priority
//                 />
//               ) : (
//                 <span className="font-bold text-xl">{logoText}</span>
//               )}
//             </Link>

//             {/* Desktop Menu */}
//             <nav className="hidden md:flex items-center gap-8">
//               {navigation.map((item) => (
//                 <Link
//                   key={item.id}
//                   href={item.url}
//                   className="text-sm font-medium text-[var(--ll-slate-text)] hover:text-[var(--ll-gold)] transition-colors duration-200"
//                 >
//                   {item.label}
//                 </Link>
//               ))}

//               {/* Categories Dropdown */}
//               {categories && categories.length > 0 && (
//                 <div className="relative group py-2">
//                   <button className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-black transition focus:outline-hidden cursor-pointer">
//                     Categories
//                     <ChevronDown size={14} className="text-gray-400 group-hover:text-black transition duration-200" />
//                   </button>
//                   {/* Dropdown Menu */}
//                   <div className="absolute left-0 mt-2 w-56 rounded-xl bg-white border border-gray-150 shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 z-50 p-2">
//                     {categories.map((cat) => (
//                       <Link
//                         key={cat.id}
//                         href={`/category/${cat.slug}`}
//                         className="block text-sm text-[var(--ll-slate-text)] hover:text-[var(--ll-gold)] hover:bg-[var(--ll-mist)] rounded-[var(--ll-radius-sm)] px-4 py-2.5 transition-all duration-150"
//                       >
//                         {cat.name}
//                       </Link>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </nav>

//             {/* CTA */}
//             <div className="hidden md:flex">
//               <Link
//                 href={ctaLink}
//                 className="px-5 py-2.5 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition"
//               >
//                 {ctaText}
//               </Link>
//             </div>

//             {/* Mobile Toggle */}
//             <button
//               onClick={() => setMobileOpen(!mobileOpen)}
//               className="md:hidden"
//             >
//               {mobileOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Drawer */}
//         {mobileOpen && (
//           <div className="md:hidden border-t bg-white absolute w-full">
//             <nav className="flex flex-col p-4">
//               {navigation.map((item) => (
//                 <Link
//                   key={item.id}
//                   href={item.url}
//                   className="py-3 border-b text-sm font-medium"
//                   onClick={() => setMobileOpen(false)}
//                 >
//                   {item.label}
//                 </Link>
//               ))}

//               {/* Mobile Categories Collapsible */}
//               {categories && categories.length > 0 && (
//                 <div className="border-b py-3">
//                   <button
//                     onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
//                     className="flex w-full items-center justify-between text-sm font-medium text-gray-700"
//                   >
//                     Categories
//                     <ChevronDown
//                       size={16}
//                       className={`text-gray-400 transition-transform duration-200 ${mobileCategoriesOpen ? "rotate-180" : ""
//                         }`}
//                     />
//                   </button>
//                   {mobileCategoriesOpen && (
//                     <div className="mt-2 ml-4 flex flex-col gap-1 border-l-2 border-gray-100 pl-4">
//                       {categories.map((cat) => (
//                         <Link
//                           key={cat.id}
//                           href={`/category/${cat.slug}`}
//                           className="py-2 text-sm text-gray-600 hover:text-black"
//                           onClick={() => setMobileOpen(false)}
//                         >
//                           {cat.name}
//                         </Link>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}

//               <Link
//                 href={ctaLink}
//                 className="mt-4 px-4 py-3 rounded-lg bg-black text-white text-center"
//                 onClick={() => setMobileOpen(false)}
//               >
//                 {ctaText}
//               </Link>
//             </nav>
//           </div>
//         )}
//       </header>
//     </>
//   );
// }
