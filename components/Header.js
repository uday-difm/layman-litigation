"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, ChevronDown, User } from "lucide-react";
import { useStickyHeader } from "@/hooks/useStickyHeader";
import { useState, useRef, useEffect } from "react";

const otherCategories = [
  { name: "Immigration", href: "/category/immigration" },
  { name: "Employment", href: "/category/employment" },
  { name: "Civil Litigation", href: "/category/civil-litigation" },
  { name: "General Practice", href: "/category/general-practice" },
  { name: "Medical Malpractice", href: "/category/medical-malpractice" },
  {
    name: "Social Security Disability",
    href: "/category/social-security-disability",
  },
  { name: "Tax", href: "/category/tax" },
];

export default function Header() {
  const user = "";
  const isSticky = useStickyHeader();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full bg-[#1b1b1b] transition-all duration-300 ${
        isSticky ? "shadow-lg" : ""
      }`}
    >
      {/* TOP ROW */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isSticky ? "max-h-0 opacity-0" : "max-h-40 opacity-100"
        }`}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-3 items-center px-8 py-5">
          {/* Date */}
          <div className="text-sm text-white">Tuesday, June 16, 2026</div>

          {/* Logo */}
          <div className="flex justify-center">
            <Image
              src="/assets/Final-Logo-Retina.png"
              alt="Layman Litigation"
              width={520}
              height={120}
              priority
              className="h-auto w-auto"
            />
          </div>

          {/* User */}
          {user && (
            <div className="flex justify-end">
              <button className="flex items-center gap-2 text-sm font-semibold text-white">
                <User size={18} />
                DIFMSITANSHU
                <ChevronDown size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* NAVIGATION */}
      <div
        className={`mx-auto flex max-w-7xl items-center transition-all duration-300 ${
          isSticky ? "py-10 px-6" : "py-5 px-8"
        }`}
      >
        {/* Sticky Logo */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isSticky ? "mr-10 w-60 opacity-100" : "w-0 opacity-0"
          }`}
        >
          <Image
            src="/assets/Final-Logo-Retina.png"
            alt="Layman Litigation"
            width={240}
            height={55}
            className="h-auto w-full object-contain"
          />
        </div>

        {/* Menu */}
        <nav className="flex flex-wrap items-center gap-8">
          <Link
            href="/"
            className="text-sm font-bold uppercase text-white hover:text-[#d9b04f]"
          >
            Home
          </Link>

          <Link
            href="/category/mass-tort"
            className="text-sm font-bold uppercase text-white hover:text-[#d9b04f]"
          >
            Mass Tort
          </Link>

          <Link
            href="/category/intellectual-property"
            className="text-sm font-bold uppercase text-white hover:text-[#d9b04f]"
          >
            Intellectual Property
          </Link>

          <Link
            href="/category/personal-injury"
            className="text-sm font-bold uppercase text-white hover:text-[#d9b04f]"
          >
            Personal Injury
          </Link>

          <Link
            href="/category/corporate"
            className="text-sm font-bold uppercase text-white hover:text-[#d9b04f]"
          >
            Corporate
          </Link>

          {/* Other — dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-1 text-sm font-bold uppercase text-white hover:text-[#d9b04f]"
            >
              Other
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 top-full mt-2 min-w-55 rounded bg-white py-2 shadow-lg">
                {otherCategories.map((cat) => (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    className="block px-5 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-[#d9b04f]"
                    onClick={() => setDropdownOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/publications"
            className="text-sm font-bold uppercase text-white hover:text-[#d9b04f]"
          >
            Publications
          </Link>

          <Link
            href="/contact"
            className="text-sm font-bold uppercase text-white hover:text-[#d9b04f]"
          >
            Contact Us
          </Link>
        </nav>

        {/* Search */}
        <div className="ml-auto flex items-center">
          {isSticky ? (
            <div className="flex items-center">
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  searchOpen ? "w-56 opacity-100" : "w-0 opacity-0"
                }`}
              >
                <div className="flex h-9 items-center rounded bg-[#333333]">
                  <input
                    ref={searchInputRef}
                    placeholder="Search..."
                    className="w-full bg-transparent px-4 text-sm text-white placeholder:text-gray-400 outline-none"
                  />
                </div>
              </div>
              <button
                className="ml-2 text-white transition-colors hover:text-[#d9b04f]"
                onClick={() => {
                  setSearchOpen((prev) => !prev);
                  if (!searchOpen) {
                    setTimeout(() => searchInputRef.current?.focus(), 310);
                  }
                }}
              >
                <Search size={18} />
              </button>
            </div>
          ) : (
            <div className="flex h-10 w-64 items-center rounded bg-[#333333]">
              <input
                placeholder="Search..."
                className="flex-1 bg-transparent px-4 text-sm text-white placeholder:text-gray-400 outline-none"
              />
              <Search className="mr-3 text-white" size={18} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
