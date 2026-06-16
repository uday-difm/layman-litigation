import Link from "next/link";
import { publications } from "@/data/publications";
// const publications = [
//     {
//         month: "June 2026",
//         title: "Understanding Mass Tort Litigation",
//         subtitle: "A comprehensive guide to class action lawsuits",
//         issue: "Issue #24",
//         gradient: "from-[#1a1a2e] via-[#16213e] to-[#0f3460]",
//         accent: "#d9b04f",
//     },
//     {
//         month: "May 2026",
//         title: "Cybersecurity Law & Digital Privacy",
//         subtitle: "Protecting assets in the digital age",
//         issue: "Issue #23",
//         gradient: "from-[#2d132c] via-[#3e1f47] to-[#4a2159]",
//         accent: "#e8a87c",
//     },
//     {
//         month: "April 2026",
//         title: "Corporate Governance Reforms",
//         subtitle: "New regulations shaping boardroom decisions",
//         issue: "Issue #22",
//         gradient: "from-[#0c2233] via-[#0d3b4f] to-[#145369]",
//         accent: "#85cdca",
//     },
//     {
//         month: "March 2026",
//         title: "Employment Law Updates",
//         subtitle: "Workplace rights and remote work policies",
//         issue: "Issue #21",
//         gradient: "from-[#1b1b1b] via-[#2c2c2c] to-[#3d3d3d]",
//         accent: "#d9b04f",
//     },
//     {
//         month: "February 2026",
//         title: "Intellectual Property in the AI Era",
//         subtitle: "Who owns machine-generated content?",
//         issue: "Issue #20",
//         gradient: "from-[#0b0b2b] via-[#1a1a4e] to-[#2b2b6e]",
//         accent: "#c9a0dc",
//     },
//     {
//         month: "January 2026",
//         title: "Environmental Law & Climate Policy",
//         subtitle: "Legal frameworks for sustainability",
//         issue: "Issue #19",
//         gradient: "from-[#0d3320] via-[#145a32] to-[#1e8449]",
//         accent: "#abebc6",
//     },
//     {
//         month: "December 2025",
//         title: "Year in Review: Landmark Cases",
//         subtitle: "The cases that defined the year",
//         issue: "Issue #18",
//         gradient: "from-[#3b0a0a] via-[#5c1a1a] to-[#7b2323]",
//         accent: "#f5b7b1",
//     },
//     {
//         month: "November 2025",
//         title: "Immigration Law Changes",
//         subtitle: "Navigating new visa regulations",
//         issue: "Issue #17",
//         gradient: "from-[#1c1c3c] via-[#2d2d5e] to-[#3e3e7e]",
//         accent: "#aed6f1",
//     },
//     {
//         month: "October 2025",
//         title: "Medical Malpractice Trends",
//         subtitle: "Evolving standards of care in healthcare",
//         issue: "Issue #16",
//         gradient: "from-[#2c1810] via-[#4a2c1a] to-[#6b3e24]",
//         accent: "#f0c27f",
//     },
// ];

export default function PublicationsPage() {
    return (
        <div className="min-h-screen bg-[#f5f5f5] pt-40">
            {/* Breadcrumb */}
            <div className="bg-[#d9b04f]">
                <div className="mx-auto flex max-w-7xl items-center gap-3 px-8 py-3">
                    <Link
                        href="/"
                        className="text-sm font-bold uppercase text-white hover:text-[#1b1b1b] transition-colors"
                    >
                        Home
                    </Link>
                    <span className="text-white/60">›</span>
                    <span className="text-sm font-bold uppercase text-white/80">
                        Publications
                    </span>
                </div>
            </div>

            {/* Intro */}
            <div className="mx-auto max-w-7xl px-8 pt-10 pb-4">
                <h1 className="text-2xl font-light text-gray-600">
                    Layman Litigation publishes{" "}
                    <span className="font-semibold text-[#1b1b1b]">
                        monthly Periodicals
                    </span>
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">
                    Stay informed with our curated legal insights, case analyses,
                    and industry commentary — delivered every month.
                </p>
            </div>

            {/* Publications Grid */}
            <div className="mx-auto max-w-7xl px-8 py-10">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                    {publications.map((pub) => (
                        <article key={pub.issue} className="group">
                            {/* Month Label */}
                            <h2 className="mb-4 text-xl font-semibold text-[#1b1b1b]">
                                {pub.month}
                            </h2>

                            {/* Magazine Cover Card */}
                            <Link href={`./publications/${pub.slug}`} className="block">
                                <div
                                    className={`relative aspect-[3/4] overflow-hidden rounded-lg bg-gradient-to-br ${pub.gradient} shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1`}
                                >
                                    {/* Decorative elements */}
                                    <div className="absolute inset-0 opacity-10">
                                        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20" />
                                        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10" />
                                    </div>

                                    {/* Content */}
                                    <div className="relative flex h-full flex-col justify-between p-6">
                                        {/* Top */}
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <span
                                                    className="rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest"
                                                    style={{
                                                        backgroundColor: pub.accent,
                                                        color: "#1b1b1b",
                                                    }}
                                                >
                                                    {pub.issue}
                                                </span>
                                                <span className="text-[10px] tracking-wider text-white/50">
                                                    ISSN 3066-5000
                                                </span>
                                            </div>

                                            <div className="mt-6">
                                                <p
                                                    className="text-xs font-bold uppercase tracking-[0.2em]"
                                                    style={{ color: pub.accent }}
                                                >
                                                    Layman Litigation
                                                </p>
                                                <div
                                                    className="mt-1 h-[2px] w-10"
                                                    style={{ backgroundColor: pub.accent }}
                                                />
                                            </div>
                                        </div>

                                        {/* Center — Title */}
                                        <div className="my-auto">
                                            <h3 className="text-xl font-bold leading-tight text-white">
                                                {pub.title}
                                            </h3>
                                            <p className="mt-2 text-sm leading-relaxed text-white/60">
                                                {pub.subtitle}
                                            </p>
                                        </div>

                                        {/* Bottom */}
                                        <div className="flex items-end justify-between">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-white/40">
                                                    {pub.month}
                                                </p>
                                            </div>
                                            <div
                                                className="flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110"
                                                style={{ backgroundColor: pub.accent }}
                                            >
                                                <span className="text-xs font-bold text-[#1b1b1b]">
                                                    →
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </article>
                    ))}
                </div>
            </div>
        </div >
    );
}
