// app/blogs/page.js — Blog listing page (takes priority over catch-all)
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CMSClient } from "@yourcompany/global-backend-next";
export const dynamic = "force-dynamic";

const cms = new CMSClient({
  baseUrl: process.env.NEXT_PUBLIC_CMS_BASE_URL || "http://localhost:3000",
  siteId: process.env.NEXT_PUBLIC_SITE_ID || "layman_litigation",
});

function SafeImage({ src, alt, ...props }) {
  if (!src) return null;
  const isLocal = src.startsWith("/") || src.startsWith(".") || src.startsWith("..");
  const isCloudinary = src.includes("res.cloudinary.com");
  if (isLocal || isCloudinary) {
    return <Image src={src} alt={alt} {...props} />;
  }
  const { fill, style, ...rest } = props;
  if (fill) {
    return (
      <img
        src={src}
        alt={alt}
        style={{ position: "absolute", height: "100%", width: "100%", left: 0, top: 0, right: 0, bottom: 0, ...style }}
        {...rest}
      />
    );
  }
  return <img src={src} alt={alt} style={style} {...rest} />;
}

export const metadata = {
  title: "Legal Blog & Insights | Layman Litigation",
  description: "Stay informed with our latest legal articles covering civil litigation, criminal defense, family law, business law, and real estate law.",
};

export default async function BlogListingPage({ searchParams }) {
  const sp = await searchParams;
  const pageNum = parseInt(sp?.page || "1", 10);
  const perPage = 9;

  let posts = [];
  let totalPosts = 0;

  try {
    const data = await cms.getPosts();
    posts = data.posts || [];
    totalPosts = posts.length;
  } catch (err) {
    console.error("Failed to fetch blog posts:", err);
    return notFound();
  }

  // Pagination
  const totalPages = Math.ceil(totalPosts / perPage);
  const startIdx = (pageNum - 1) * perPage;
  const paginatedPosts = posts.slice(startIdx, startIdx + perPage);

  // Group by category for sidebar
  const categories = {};
  posts.forEach((p) => {
    (p.categories || []).forEach((c) => {
      categories[c.name] = (categories[c.name] || 0) + 1;
    });
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      {/* Header */}
      <div className="pt-28 pb-12 bg-gradient-to-br from-[#1e3a5f] to-[#2a4a7f] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Legal Blog & Insights
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl">
            Expert legal analysis, guides, and updates written by our attorneys to help you understand the law.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Main content */}
          <div className="lg:col-span-3">
            {paginatedPosts.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-lg font-semibold text-slate-500">No posts yet</h3>
                <p className="text-sm text-slate-400 mt-2">Check back soon for new articles.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {paginatedPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blogs/${post.slug}`}
                    className="group block bg-white rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 overflow-hidden"
                  >
                    {post.featuredImage && (
                      <div className="relative w-full aspect-[16/10]">
                        <SafeImage
                          src={post.featuredImage.secureUrl || post.featuredImage.url}
                          alt={post.title}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex gap-2 mb-2 flex-wrap">
                        {(post.categories || []).map((c) => (
                          <span
                            key={c.id}
                            className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-650"
                          >
                            {c.name}
                          </span>
                        ))}
                      </div>
                      <h2 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#c9a84c] transition">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 mb-4">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="text-xs text-slate-400 font-semibold mt-4 pt-4 border-t flex justify-between">
                        <span>
                          By {post.author ? post.author.email.split("@")[0] : "Author"}
                        </span>
                        <span>
                          {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-12">
                {pageNum > 1 && (
                  <Link
                    href={`/blogs?page=${pageNum - 1}`}
                    className="px-4 py-2 rounded-lg bg-white border text-sm font-semibold hover:bg-slate-50 transition"
                  >
                    Previous
                  </Link>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={`/blogs?page=${p}`}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                      p === pageNum
                        ? "bg-[#1e3a5f] text-white"
                        : "bg-white border hover:bg-slate-50"
                    }`}
                  >
                    {p}
                  </Link>
                ))}
                {pageNum < totalPages && (
                  <Link
                    href={`/blogs?page=${pageNum + 1}`}
                    className="px-4 py-2 rounded-lg bg-white border text-sm font-semibold hover:bg-slate-50 transition"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            {/* Categories */}
            <div className="bg-white rounded-xl border p-6 mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Categories
              </h3>
              <div className="space-y-2">
                {Object.entries(categories)
                  .sort(([, a], [, b]) => b - a)
                  .map(([name, count]) => (
                    <div key={name} className="flex justify-between text-sm">
                      <span className="text-slate-700 font-medium">{name}</span>
                      <span className="text-slate-400 text-xs bg-slate-100 px-2 py-0.5 rounded-full">
                        {count}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Recent posts */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Recent Posts
              </h3>
              <div className="space-y-4">
                {posts.slice(0, 5).map((post) => (
                  <Link
                    key={post.id}
                    href={`/blogs/${post.slug}`}
                    className="block group"
                  >
                    <h4 className="text-sm font-semibold text-slate-700 group-hover:text-[#c9a84c] transition line-clamp-2">
                      {post.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact CTA */}
            <div className="bg-[#1e3a5f] rounded-xl p-6 text-white mt-6">
              <h3 className="text-base font-bold mb-2">Need Legal Help?</h3>
              <p className="text-sm text-slate-300 mb-4">
                Schedule a free consultation with our experienced legal team.
              </p>
              <Link
                href="/contact"
                className="inline-block px-4 py-2 bg-[#c9a84c] text-white rounded-lg text-sm font-bold hover:bg-[#b8973a] transition"
              >
                Contact Us
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
