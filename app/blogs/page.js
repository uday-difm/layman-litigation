// app/blogs/page.js — Blog listing page (takes priority over catch-all)
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CMSClient } from "@yourcompany/global-backend-next";
export const dynamic = "force-dynamic";

const cms = new CMSClient({
  baseUrl: process.env.NEXT_PUBLIC_CMS_BASE_URL || "http://localhost:3000",
  siteId: process.env.NEXT_PUBLIC_SITE_ID || "layman_litigation",
});

function SafeImage({ src, alt, ...props }) {
  if (!src) return null;
  const isLocal =
    src.startsWith("/") || src.startsWith(".") || src.startsWith("..");
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
        style={{
          position: "absolute",
          height: "100%",
          width: "100%",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          ...style,
        }}
        {...rest}
      />
    );
  }
  return <img src={src} alt={alt} style={style} {...rest} />;
}

export const metadata = {
  title: "Legal Blog & Insights | Layman Litigation",
  description:
    "Stay informed with our latest legal articles covering civil litigation, criminal defense, family law, business law, and real estate law.",
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
    // Graceful fallback — show empty state
    posts = [];
    totalPosts = 0;
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
    <div className="min-h-screen bg-[var(--ll-mist)] text-[var(--ll-ink)]">
      {/* Header */}
      <div className="relative pt-28 pb-16 bg-[var(--ll-ink)] text-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{background:"radial-gradient(ellipse at 30% 60%, rgba(201,168,76,0.1) 0%, transparent 65%)"}} />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <span className="ll-eyebrow block mb-4">Legal Blog & Insights</span>
          <h1 className="text-4xl md:text-6xl font-black tracking-[-0.03em] text-white mb-4">
            Legal Blog & Insights
          </h1>
          <p className="text-white/60 text-base md:text-lg max-w-2xl font-light">
            Expert legal analysis, guides, and updates written by our attorneys
            to help you understand the law.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Main content */}
          <div className="lg:col-span-3">
            {paginatedPosts.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-lg font-semibold text-slate-500">
                  No posts yet
                </h3>
                <p className="text-sm text-slate-400 mt-2">
                  Check back soon for new articles.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {paginatedPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blogs/${post.slug}`}
                    className="group block bg-[var(--ll-cream)] rounded-[var(--ll-radius-md)] shadow-[var(--ll-shadow-card)] hover:shadow-[var(--ll-shadow-lift)] border border-[var(--ll-stone)] transition-all duration-300 overflow-hidden"
                  >
                    {post.featuredImage && (
                      <div className="relative w-full aspect-[16/10]">
                        <SafeImage
                          src={
                            post.featuredImage.secureUrl ||
                            post.featuredImage.url
                          }
                          alt={post.title}
                          fill
                          style={{ objectFit: "cover" }}
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex gap-2 mb-2 flex-wrap">
                        {(post.categories || []).map((c) => (
                          <span
                            key={c.id}
                            className="inline-flex px-2.5 py-1 rounded-full bg-[var(--ll-gold-light)] text-[var(--ll-gold-dark)] text-[9px] font-bold uppercase tracking-wider border border-[var(--ll-gold)]/15"
                          >
                            {c.name}
                          </span>
                        ))}
                      </div>
                      <h2 className="font-bold text-[var(--ll-ink)] text-sm leading-snug mb-2 group-hover:text-[var(--ll-gold)] transition-colors duration-200">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-[var(--ll-slate-text)] text-sm leading-relaxed line-clamp-3 mb-4">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="text-[var(--ll-light-text)] text-xs pt-4 mt-4 border-t border-[var(--ll-stone)] flex justify-between">
                        <span>
                          By{" "}
                          {post.author
                            ? post.author.email.split("@")[0]
                            : "Author"}
                        </span>
                        <span>
                          {new Date(
                            post.publishedAt || post.createdAt,
                          ).toLocaleDateString("en-US", {
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
                    className="px-4 py-2 rounded-[var(--ll-radius-sm)] bg-[var(--ll-cream)] border border-[var(--ll-stone)] hover:border-[var(--ll-gold)]/40 text-[var(--ll-slate-text)] text-sm font-semibold transition"
                  >
                    Previous
                  </Link>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
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
                  ),
                )}
                {pageNum < totalPages && (
                  <Link
                    href={`/blogs?page=${pageNum + 1}`}
                    className="px-4 py-2 rounded-[var(--ll-radius-sm)] bg-[var(--ll-cream)] border border-[var(--ll-stone)] hover:border-[var(--ll-gold)]/40 text-[var(--ll-slate-text)] text-sm font-semibold transition"
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
            <div className="bg-[var(--ll-cream)] rounded-[var(--ll-radius-md)] shadow-[var(--ll-shadow-card)] border border-[var(--ll-stone)] p-6 mb-6">
              <h3 className="ll-eyebrow mb-4 block">
                Categories
              </h3>
              <div className="space-y-2">
                {Object.entries(categories)
                  .sort(([, a], [, b]) => b - a)
                  .map(([name, count]) => (
                    <div key={name} className="flex justify-between text-sm">
                      <span className="text-slate-700 font-medium">{name}</span>
                      <span className="text-xs bg-[var(--ll-stone)] text-[var(--ll-slate-text)] px-2 py-0.5 rounded-full">
                        {count}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Recent posts */}
            <div className="bg-[var(--ll-cream)] rounded-[var(--ll-radius-md)] shadow-[var(--ll-shadow-card)] border border-[var(--ll-stone)] p-6">
              <h3 className="ll-eyebrow mb-4 block">
                Recent Posts
              </h3>
              <div className="space-y-4">
                {posts.slice(0, 5).map((post) => (
                  <Link
                    key={post.id}
                    href={`/blogs/${post.slug}`}
                    className="block group"
                  >
                    <h4 className="text-sm font-semibold text-slate-700 group-hover:text-[var(--ll-gold)] transition-colors duration-200 line-clamp-2">
                      {post.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(
                        post.publishedAt || post.createdAt,
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact CTA */}
            <div className="bg-[var(--ll-ink)] rounded-[var(--ll-radius-md)] p-6 text-white border border-white/5 mt-6">
              <h3 className="text-base font-bold mb-2">Need Legal Help?</h3>
              <p className="text-sm text-slate-300 mb-4">
                Schedule a free consultation with our experienced legal team.
              </p>
              <Link
                href="/contact"
                className="px-7 py-3.5 rounded-[var(--ll-radius-sm)] bg-[var(--ll-gold)] hover:bg-[var(--ll-gold-dark)] text-[var(--ll-ink)] font-bold text-sm tracking-wide shadow-sm transition-all duration-200 hover:-translate-y-px active:translate-y-0 inline-block"
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
