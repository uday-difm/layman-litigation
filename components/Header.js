"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";

export default function Header({ config = {}, navigation = [], categories = [] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  console.log("Config: ", config.header, "Navigation: ", navigation.items);
  navigation = navigation.items;
  const {
    logoUrl,
    logoText,
    logoType,
    ctaText,
    ctaLink,
    sticky,
    borderBottom,
    announcementBar,
    shadowSize,
  } = config.header;

  return (
    <>
      {/* Announcement Bar */}
      {announcementBar?.enabled && (
        <div
          className="text-center py-2 text-sm font-medium"
          style={{
            backgroundColor: announcementBar.bgColor,
            color: announcementBar.textColor,
          }}
        >
          <Link href={announcementBar.link}>{announcementBar.text}</Link>
        </div>
      )}

      {/* Header */}
      <header
        className={`
          bg-white
          ${sticky ? "sticky top-0 z-50" : ""}
          ${borderBottom ? "border-b border-gray-200" : ""}
          ${shadowSize === "small" ? "shadow-sm" : ""}
        `}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              {logoType === "image" && logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={logoText}
                  width={120}
                  height={24}
                  priority
                />
              ) : (
                <span className="font-bold text-xl">{logoText}</span>
              )}
            </Link>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.id}
                  href={item.url}
                  className="text-sm font-medium text-gray-700 hover:text-black transition"
                >
                  {item.label}
                </Link>
              ))}

              {/* Categories Dropdown */}
              {categories && categories.length > 0 && (
                <div className="relative group py-2">
                  <button className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-black transition focus:outline-hidden cursor-pointer">
                    Categories
                    <ChevronDown size={14} className="text-gray-400 group-hover:text-black transition duration-200" />
                  </button>
                  {/* Dropdown Menu */}
                  <div className="absolute left-0 mt-2 w-56 rounded-xl bg-white border border-gray-150 shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 z-50 p-2">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/category/${cat.slug}`}
                        className="block rounded-lg px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </nav>

            {/* CTA */}
            <div className="hidden md:flex">
              <Link
                href={ctaLink}
                className="px-5 py-2.5 rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition"
              >
                {ctaText}
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t bg-white">
            <nav className="flex flex-col p-4">
              {navigation.map((item) => (
                <Link
                  key={item.id}
                  href={item.url}
                  className="py-3 border-b text-sm font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {/* Mobile Categories Collapsible */}
              {categories && categories.length > 0 && (
                <div className="border-b py-3">
                  <button
                    onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                    className="flex w-full items-center justify-between text-sm font-medium text-gray-700"
                  >
                    Categories
                    <ChevronDown
                      size={16}
                      className={`text-gray-400 transition-transform duration-200 ${mobileCategoriesOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                  {mobileCategoriesOpen && (
                    <div className="mt-2 ml-4 flex flex-col gap-1 border-l-2 border-gray-100 pl-4">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
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

              <Link
                href={ctaLink}
                className="mt-4 px-4 py-3 rounded-lg bg-black text-white text-center"
                onClick={() => setMobileOpen(false)}
              >
                {ctaText}
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
