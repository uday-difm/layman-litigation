import Link from "next/link";
import { notFound } from "next/navigation";
import { publications } from "@/data/publications";

const categoriesConfig = {
  "business-law": {
    name: "Business Law",
    description: "Analyzing commercial contracts, corporate structure, mergers and acquisitions, and regulatory compliance for modern enterprises.",
    accentColor: "#d9b04f", // Gold
  },
  "civil-litigation": {
    name: "Civil Litigation",
    description: "Deep-dives into civil disputes, trial strategies, procedural rule updates, and landmark court decisions.",
    accentColor: "#e8a87c", // Coral
  },
  "corporate": {
    name: "Corporate",
    description: "Insights on corporate governance, shareholder relations, regulatory compliance, and boardroom accountability.",
    accentColor: "#85cdca", // Teal
  },
  "cybersecurity-law": {
    name: "Cybersecurity Law",
    description: "Navigating digital privacy frameworks, data breach liabilities, state regulations, and corporate security mandates.",
    accentColor: "#c9a0dc", // Lavender
  },
  "election-law": {
    name: "Election Law",
    description: "Analyzing campaign finance rules, voting rights, electoral redistricting, and legislative changes.",
    accentColor: "#abebc6", // Mint
  },
  "employment": {
    name: "Employment",
    description: "Updates on workplace rights, remote work models, gig economy classification, and NLRB rulings.",
    accentColor: "#d9b04f", // Gold
  },
  "environmental-law": {
    name: "Environmental Law",
    description: "Legal frameworks for sustainability, climate litigation, emission caps, and environmental impact assessments.",
    accentColor: "#abebc6", // Mint
  },
  "general-practice": {
    name: "General Practice",
    description: "Broad legal insights, comprehensive practice updates, and cross-disciplinary analyses for practitioners.",
    accentColor: "#aed6f1", // Soft Blue
  },
  "immigration": {
    name: "Immigration",
    description: "Navigating visa processing, compliance standards, employment-based pathways, and international borders.",
    accentColor: "#aed6f1", // Soft Blue
  },
  "intellectual-property": {
    name: "Intellectual Property",
    description: "Safeguarding patents, trademarks, and copyright ownership in an era of rapid technological and AI disruption.",
    accentColor: "#c9a0dc", // Lavender
  },
  "layman-litigation": {
    name: "Layman Litigation",
    description: "Demystifying complex legal procedures, court actions, and constitutional law for non-lawyers.",
    accentColor: "#d9b04f", // Gold
  },
  "mass-tort": {
    name: "Mass Tort",
    description: "Analyzing class actions, product liability claims, multi-district litigation (MDL), and consumer group victories.",
    accentColor: "#d9b04f", // Gold
  },
  "media-law": {
    name: "Media Law",
    description: "Insights into free speech, defamation, copyright protection, digital publishing, and entertainment contracts.",
    accentColor: "#e8a87c", // Coral
  },
  "medical-malpractice": {
    name: "Medical Malpractice",
    description: "Telemedicine standards, electronic health record liabilities, informed consent, and clinical standards of care.",
    accentColor: "#f5b7b1", // Rose
  },
  "personal-injury": {
    name: "Personal Injury",
    description: "Seeking justice and fair compensation for physical injuries, motor vehicle accidents, and product failures.",
    accentColor: "#f0c27f", // Warm Amber
  },
  "political-law": {
    name: "Political Law",
    description: "Analyzing lobbying compliance, government ethics, regulatory hearings, and the intersection of law and governance.",
    accentColor: "#85cdca", // Teal
  },
  "social-security-disability": {
    name: "Social Security Disability",
    description: "Guiding claimants and advocates through the intricacies of SSDI, SSI, and federal benefits appeals.",
    accentColor: "#aed6f1", // Soft Blue
  },
  "tax": {
    name: "Tax",
    description: "Deciphering tax codes, corporate shelters, international treaty compliance, and IRS regulatory shifts.",
    accentColor: "#85cdca", // Teal
  },
  "technology-law": {
    name: "Technology Law",
    description: "The legal frontier of artificial intelligence, blockchain regulation, algorithm bias, and smart contracts.",
    accentColor: "#c9a0dc", // Lavender
  },
  "trade-law": {
    name: "Trade Law",
    description: "Navigating international tariffs, trade disputes, global supply chains, and export-import compliance.",
    accentColor: "#f0c27f", // Warm Amber
  },
};


export default async function CategoryPage({ params }) {
  const { slug } = await params;

  // Verify if the requested category is valid
  const categoryInfo = categoriesConfig[slug];
  if (!categoryInfo) {
    notFound();
  }

  // Filter publications matching this category
  const filteredPublications = publications.filter(
    (pub) => pub.category === slug,
  );

  return (
    <div className="min-h-screen bg-[#f5f5f5] pt-40 pb-20">
      {/* Dynamic Brand Breadcrumb */}
      <div className="bg-[#1b1b1b] border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-8 py-3">
          <Link
            href="/"
            className="text-sm font-bold uppercase text-white hover:text-[#d9b04f] transition-colors"
          >
            Home
          </Link>
          <span className="text-white/40">›</span>
          <Link
            href="/publications"
            className="text-sm font-bold uppercase text-white/80 hover:text-[#d9b04f] transition-colors"
          >
            Publications
          </Link>
          <span className="text-white/40">›</span>
          <span
            className="text-sm font-bold uppercase"
            style={{ color: categoryInfo.accentColor }}
          >
            {categoryInfo.name}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-3">
            {/* Category Header */}
            <div className="mb-12 border-b border-gray-200 pb-8">
              <span
                className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded"
                style={{
                  backgroundColor: `${categoryInfo.accentColor}25`,
                  color: "#1b1b1b",
                }}
              >
                Category
              </span>
              <h1 className="mt-4 text-4xl font-extrabold text-[#1b1b1b] tracking-tight">
                {categoryInfo.name}
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-gray-500 leading-relaxed">
                {categoryInfo.description}
              </p>
              <div className="mt-6 text-sm text-gray-400">
                {filteredPublications.length === 1
                  ? "1 publication available"
                  : `${filteredPublications.length} publications available`}
              </div>
            </div>

       
            {filteredPublications.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredPublications.map((pub) => (
                  <article key={pub.issue} className="group">
                    <h2 className="mb-3 text-lg font-semibold text-[#1b1b1b]">
                      {pub.month}
                    </h2>
                    <Link href={`/publications/${pub.slug}`} className="block">
                      <div
                        className={`relative aspect-3/4 overflow-hidden rounded-lg bg-linear-to-br ${pub.gradient} shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1`}
                      >
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20" />
                          <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10" />
                        </div>
                        <div className="relative flex h-full flex-col justify-between p-6">
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
                          <div className="my-auto">
                            <h3 className="text-xl font-bold leading-tight text-white">
                              {pub.title}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-white/60">
                              {pub.subtitle}
                            </p>
                          </div>
                          <div className="flex items-end justify-between">
                            <p className="text-[10px] uppercase tracking-wider text-white/40">
                              {pub.month}
                            </p>
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
            ) : (
              /* High-end Empty State */
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-xs">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 text-gray-400">
                  📚
                </div>
                <h3 className="mt-4 text-lg font-bold text-gray-800">
                  No Current Issues
                </h3>
                <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
                  We are currently curating authoritative publications for our
                  **{categoryInfo.name}** issue. Check back soon!
                </p>
                <div className="mt-6 flex justify-center gap-4">
                  <Link
                    href="/publications"
                    className="rounded-md bg-[#1b1b1b] px-4 py-2 text-xs font-bold uppercase text-white hover:bg-[#d9b04f] transition-colors"
                  >
                    View All Issues
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR FOR DEEP NAVIGATION */}
          <div className="space-y-8">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-3">
                Other Categories
              </h3>
              <ul className="mt-4 space-y-3">
                {Object.entries(categoriesConfig)
                  .filter(([key]) => key !== slug)
                  .map(([key, value]) => (
                    <li key={key}>
                      <Link
                        href={`/category/${key}`}
                        className="group flex items-center justify-between text-sm text-gray-600 hover:text-[#1b1b1b] transition-colors"
                      >
                        <span className="font-medium">{value.name}</span>
                        <span
                          className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: value.accentColor }}
                        >
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
