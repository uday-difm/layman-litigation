"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, ChevronDown, User } from "lucide-react";
import { useStickyHeader } from "@/hooks/useStickyHeader";

export default function Header() {
    const isSticky = useStickyHeader();

    return (
        <header
            className={`fixed top-0 z-50 w-full bg-[#1b1b1b] transition-all duration-300 ${isSticky ? "shadow-lg" : ""
                }`}
        >
            {/* TOP ROW */}
            <div
                className={`overflow-hidden transition-all duration-300 ${isSticky
                    ? "max-h-0 opacity-0"
                    : "max-h-[160px] opacity-100"
                    }`}
            >
                <div className="mx-auto grid max-w-7xl grid-cols-3 items-center px-8 py-5">
                    {/* Date */}
                    <div className="text-sm text-white">
                        Tuesday, June 16, 2026
                    </div>

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
                    <div className="flex justify-end">
                        <button className="flex items-center gap-2 text-sm font-semibold text-white">
                            <User size={18} />
                            DIFMSITANSHU
                            <ChevronDown size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* NAVIGATION */}
            <div
                className={`mx-auto flex max-w-7xl items-center transition-all duration-300 ${isSticky ? "h-16 px-6" : "h-20 px-8"
                    }`}
            >
                {/* Sticky Logo */}
                <div
                    className={`overflow-hidden transition-all duration-300 ${isSticky
                        ? "mr-10 w-[240px] opacity-100"
                        : "w-0 opacity-0"
                        }`}
                >
                    <Image
                        src="/Final-Logo-Retina.png"
                        alt="Layman Litigation"
                        width={240}
                        height={55}
                        className="h-auto w-full object-contain"
                    />
                </div>

                {/* Menu */}
                <nav className="flex flex-wrap gap-8">
                    <Link
                        href="/"
                        className="text-sm font-bold uppercase text-white hover:text-[#d9b04f]"
                    >
                        Home
                    </Link>

                    <Link
                        href="/mass-tort"
                        className="text-sm font-bold uppercase text-white hover:text-[#d9b04f]"
                    >
                        Mass Tort
                    </Link>

                    <Link
                        href="/intellectual-property"
                        className="text-sm font-bold uppercase text-white hover:text-[#d9b04f]"
                    >
                        Intellectual Property
                    </Link>

                    <Link
                        href="/personal-injury"
                        className="text-sm font-bold uppercase text-white hover:text-[#d9b04f]"
                    >
                        Personal Injury
                    </Link>

                    <Link
                        href="/corporate"
                        className="text-sm font-bold uppercase text-white hover:text-[#d9b04f]"
                    >
                        Corporate
                    </Link>

                    <Link
                        href="/other"
                        className="flex items-center gap-1 text-sm font-bold uppercase text-white hover:text-[#d9b04f]"
                    >
                        Other
                        <ChevronDown size={14} />
                    </Link>

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
                <div className="ml-auto">
                    {isSticky ? (
                        <button className="text-white">
                            <Search size={18} />
                        </button>
                    ) : (
                        <div className="flex h-10 w-64 items-center rounded bg-[#333333]">
                            <input
                                placeholder="Search..."
                                className="flex-1 bg-transparent px-4 text-sm text-white placeholder:text-gray-400 outline-none"
                            />
                            <Search
                                className="mr-3 text-white"
                                size={18}
                            />
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}