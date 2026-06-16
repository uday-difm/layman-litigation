"use client";

import Link from "next/link";
import { ChevronUp } from "lucide-react";

const categoriesCol1 = [
    { name: "Business Law", href: "/category/business-law" },
    { name: "Civil Litigation", href: "/category/civil-litigation" },
    { name: "Corporate", href: "/category/corporate" },
    { name: "Cybersecurity Law", href: "/category/cybersecurity-law" },
    { name: "Election Law", href: "/category/election-law" },
    { name: "Employment", href: "/category/employment" },
    { name: "Environmental Law", href: "/category/environmental-law" },
    { name: "General Practice", href: "/category/general-practice" },
    { name: "Immigration", href: "/category/immigration" },
    { name: "Intellectual Property", href: "/category/intellectual-property" },
];

const categoriesCol2 = [
    { name: "Layman Litigation", href: "/category/layman-litigation" },
    { name: "Mass Tort", href: "/category/mass-tort" },
    { name: "Media Law", href: "/category/media-law" },
    { name: "Medical Malpractice", href: "/category/medical-malpractice" },
    { name: "Personal Injury", href: "/category/personal-injury" },
    { name: "Political Law", href: "/category/political-law" },
    { name: "Social Security Disability", href: "/category/social-security-disability" },
    { name: "Tax", href: "/category/tax" },
    { name: "Technology Law", href: "/category/technology-law" },
    { name: "Trade Law", href: "/category/trade-law" },
];

const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
    { name: "Privacy & Policy", href: "/privacy-policy" },
    { name: "Other Links", href: "/other" },
];

export default function Footer() {

    return (
        <footer className="bg-[#212121] text-gray-300">
            {/* Main Footer Content */}
            <div className="mx-auto max-w-7xl px-8 py-12">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
                    {/* Categories */}
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

                    {/* Quick Links */}
                    <div>
                        <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-[#d9b04f]">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-400 transition-colors hover:text-[#d9b04f]"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* About / Branding */}
                    <div>
                        <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-[#d9b04f]">
                            Layman Litigation
                        </h3>
                        <p className="text-sm leading-relaxed text-gray-400">
                            © 2025{" "}
                            <span className="italic text-[#d9b04f]">
                                Layman Litigation
                            </span>{" "}
                            – The House For All Legal Info. For the People, By the
                            Law Lovers.
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-700">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
                    <p className="text-xs text-gray-500">
                        Copyright © 2026{" "}
                        <span className="text-[#d9b04f] font-semibold">Do It For Me LLC</span>.
                        For the People, By the Lawyers.
                    </p>

                </div>
            </div>
        </footer >
    );
}