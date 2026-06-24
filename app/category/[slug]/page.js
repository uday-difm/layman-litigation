import Link from "next/link";
import { notFound } from "next/navigation";
import { cms } from "@/lib/cms";

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

  // Retrieve posts to filter by category
  let allPosts = [];
  try {
    const postsResponse = await cms.getPosts();
    allPosts = postsResponse.posts || [];
  } catch (err) {
    console.error("Failed to fetch posts in CategoryPage:", err);
  }

  // Filter posts matching this category slug
  const filteredPosts = allPosts.filter((post) =>
    post.categories && post.categories.some((cat) => cat.slug === slug)
  );

  // Extract all active categories dynamically for the sidebar
  const categoriesMap = new Map();
  allPosts.forEach((post) => {
    if (post.categories) {
      post.categories.forEach((cat) => {
        categoriesMap.set(cat.slug, cat);
      });
    }
  });
  const allActiveCategories = Array.from(categoriesMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // Find the category record to verify if it exists
  const activeCategory = allActiveCategories.find((cat) => cat.slug === slug);

  // If the category does not exist in our active database, verify if it is in hardcoded list
  const categoryInfo = categoriesConfig[slug] || (activeCategory ? {
    name: activeCategory.name,
    description: `Expert articles and insights on ${activeCategory.name}.`,
    accentColor: "#d9b04f"
  } : null);

  if (!categoryInfo && !activeCategory) {
    notFound();
  }

  const categoryName = categoryInfo?.name || activeCategory?.name;
  const categoryDesc = categoryInfo?.description || `Expert articles and insights on ${categoryName}.`;
  const categoryAccent = categoryInfo?.accentColor || "#d9b04f";

  return (
    <div className="min-h-screen bg-[#f5f5f5] pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-8 pt-8">
        {/* Clean Breadcrumb */}
        <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-6">
          <Link href="/" className="hover:text-[#d9b04f] transition">Home</Link>
          <span>/</span>
          <span className="text-slate-650" style={{ color: categoryAccent }}>{categoryName}</span>
        </nav>
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
                  backgroundColor: `${categoryAccent}25`,
                  color: "#1b1b1b",
                }}
              >
                Category
              </span>
              <h1 className="mt-4 text-4xl font-extrabold text-[#1b1b1b] tracking-tight">
                {categoryName}
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-gray-500 leading-relaxed">
                {categoryDesc}
              </p>
              <div className="mt-6 text-sm text-gray-400">
                {filteredPosts.length === 1
                  ? "1 article available"
                  : `${filteredPosts.length} articles available`}
              </div>
            </div>

            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredPosts.map((post) => {
                  const dateToDisplay = post.publishedAt || post.createdAt;
                  return (
                    <article
                      key={post.id}
                      className="group flex flex-col justify-between bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-250 overflow-hidden"
                    >
                      <div>
                        {post.featuredImage ? (
                          <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100">
                            <img
                              src={post.featuredImage.secureUrl || post.featuredImage.url}
                              alt={post.title}
                              className="object-cover w-full h-full group-hover:scale-102 transition duration-300"
                            />
                          </div>
                        ) : (
                          <div
                            className="relative w-full aspect-[16/10] flex items-center justify-center text-white p-6 overflow-hidden"
                            style={{
                              background: `linear-gradient(135deg, ${categoryAccent}90 0%, #1b1b1b 100%)`,
                            }}
                          >
                            <span className="font-bold text-lg text-center opacity-90 leading-tight">
                              {post.title}
                            </span>
                          </div>
                        )}
                        <div className="p-6">
                          <div className="flex gap-2 mb-3 flex-wrap">
                            {(post.categories || []).map((c) => (
                              <span
                                key={c.id}
                                className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600"
                              >
                                {c.name}
                              </span>
                            ))}
                          </div>
                          <Link href={`/blog/${post.slug}`}>
                            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#d9b04f] transition line-clamp-2 leading-snug">
                              {post.title}
                            </h3>
                          </Link>
                          {post.excerpt && (
                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4">
                              {post.excerpt}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="p-6 pt-0 border-t border-slate-50 mt-4 flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                        <span>
                          By {post.author ? post.author.email.split("@")[0] : "Author"}
                        </span>
                        <span>
                          {new Date(dateToDisplay).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              /* High-end Empty State */
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-xs">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 text-gray-400 text-2xl">
                  📝
                </div>
                <h3 className="mt-4 text-lg font-bold text-gray-800">
                  No Active Articles
                </h3>
                <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
                  We are currently writing and reviewing legal articles for{" "}
                  <strong>{categoryName}</strong>. Check back soon!
                </p>
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
                {allActiveCategories
                  .filter((cat) => cat.slug !== slug)
                  .map((cat) => {
                    const cfg = categoriesConfig[cat.slug] || { accentColor: "#d9b04f" };
                    return (
                      <li key={cat.id}>
                        <Link
                          href={`/category/${cat.slug}`}
                          className="group flex items-center justify-between text-sm text-gray-600 hover:text-[#1b1b1b] transition-colors"
                        >
                          <span className="font-medium">{cat.name}</span>
                          <span
                            className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ color: cfg.accentColor }}
                          >
                            →
                          </span>
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
