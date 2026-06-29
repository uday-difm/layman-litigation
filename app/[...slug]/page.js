// app/[...slug]/page.js
import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CMSClient } from "@yourcompany/global-backend-next";
import ContactFormSection from "@/components/ContactFormSection";
import { RichTextRenderer } from "@yourcompany/global-backend-next/components";
import {
  HeroSection,
  TextBlockSection,
  ServicesSection,
  TeamSection,
  TestimonialsSection,
  FaqSection,
  CtaSection,
  BlogsSection,
  SafeImage,
  renderMarkdown,
} from "@/lib/sections";
export const dynamic = "force-dynamic";

const cms = new CMSClient({
  baseUrl: process.env.NEXT_PUBLIC_CMS_BASE_URL || "http://localhost:3000",
  siteId: process.env.NEXT_PUBLIC_SITE_ID || "layman_litigation",
});

// Reusable detailed blog post UI component
function BlogPostDetail({ post }) {
  const categories = post.categories || [];

  return (
    <article className="max-w-3xl mx-auto px-[var(--ll-content-x)] py-14">
      <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[var(--ll-light-text)] mb-6">
        <Link href="/" className="hover:text-[var(--ll-gold)] transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-[var(--ll-gold)] transition-colors">
          Blog
        </Link>
        <span>/</span>
        <span className="text-slate-600 truncate max-w-xs">{post.title}</span>
      </nav>

      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {categories.map((c) => (
            <span
              key={c.id}
              className="inline-flex px-2.5 py-1 rounded-full bg-[var(--ll-gold-light)] text-[var(--ll-gold-dark)] text-[9px] font-bold uppercase tracking-wider border border-[var(--ll-gold)]/15"
            >
              {c.name}
            </span>
          ))}
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-[var(--ll-ink)] mb-6 leading-[1.1]">
          {post.title}
        </h1>
        <div className="flex items-center gap-3 pb-6 border-b border-slate-200">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--ll-gold)] to-[var(--ll-gold-dark)] flex items-center justify-center text-[var(--ll-ink)] font-extrabold shadow-sm">
            {post.author ? post.author.email.charAt(0).toUpperCase() : "A"}
          </div>
          <div>
            <p className="text-xs font-bold text-[var(--ll-ink)]">
              {post.author ? post.author.email.split("@")[0] : "Author"}
            </p>
            <p className="text-[10px] text-[var(--ll-light-text)] font-medium mt-0.5">
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
            </p>
          </div>
        </div>
      </header>

      {post.featuredImage && (
        <div className="relative w-full aspect-[16/10] md:aspect-[21/9] rounded-[var(--ll-radius-lg)] overflow-hidden shadow-[var(--ll-shadow-lift)] mb-12 border border-[var(--ll-stone)]">
          <SafeImage
            src={post.featuredImage.secureUrl || post.featuredImage.url}
            alt={post.title}
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
      )}

      {post.excerpt && (
        <p className="text-base md:text-lg font-light leading-relaxed mb-10 text-[var(--ll-slate-text)] border-l-4 border-[var(--ll-gold)] italic pl-4">
          {post.excerpt}
        </p>
      )}

      {post.content &&
      typeof post.content === "string" &&
      post.content.startsWith("<") ? (
        <div
          className="prose prose-slate max-w-none text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      ) : (
        <RichTextRenderer content={post.content} />
      )}
    </article>
  );
}

function LegalPageDetail({ legalPage }) {
  const page = legalPage?.legalPage || legalPage?.page || legalPage;
  if (!page) return null;

  const title = page.title || "";
  const content = page.content || "";
  const contentJson = page.contentJson || null;
  const lastUpdated = page.updatedAt || page.lastUpdated;

  return (
    <div className="min-h-screen bg-[var(--ll-mist)] pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mb-8 uppercase tracking-wider">
          <Link href="/" className="hover:text-[var(--ll-gold)] transition">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-600">{title || "Legal"}</span>
        </nav>

        <article className="prose prose-slate max-w-none">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--ll-ink)] mb-4">
            {title}
          </h1>
          {lastUpdated && (
            <p className="text-xs text-[var(--ll-light-text)] mb-8 border-b border-[var(--ll-stone)] pb-4">
              Last updated:{" "}
              {new Date(lastUpdated).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}

          {contentJson ? (
            <RichTextRenderer content={contentJson} />
          ) : content?.startsWith("<") ? (
            <div
              className="text-sm text-slate-700 leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <div className="text-sm text-slate-700 leading-relaxed space-y-4 whitespace-pre-line">
              {content}
            </div>
          )}
        </article>
      </div>
    </div>
  );
}

// Next.js Dynamic Metadata Generation
export async function generateMetadata({ params }) {
  const p = await params;
  if (p?.slug?.[0] === "api") {
    return {};
  }
  const slug = p.slug.join("/");
  console.log("Slug:", slug);
  // Determine if it is a blog detail page
  const isBlog =
    p.slug.length === 2 && (p.slug[0] === "blogs" || p.slug[0] === "blog");

  if (isBlog) {
    try {
      const postSlug = p.slug[1];
      const postsResponse = await cms.getPosts();
      const posts = postsResponse.posts || [];
      const post = posts.find((x) => x.slug === postSlug);
      if (post) {
        const title = post.seoTitle || post.title;
        const desc = post.seoDescription || post.excerpt || "";
        return {
          title,
          description: desc,
        };
      }
    } catch (e) {
      console.error(e);
    }
    return {};
  }

  try {
    const { seo } = await cms.getPage(slug);
    if (!seo) return {};
    return {
      title: seo.title,
      description: seo.description,
      alternates: {
        canonical: seo.canonical,
      },
      openGraph: {
        title: seo.title,
        description: seo.description,
        images: seo.ogImage ? [{ url: seo.ogImage }] : [],
      },
    };
  } catch (e) {
    return {};
  }
}

// Main Dynamic Catch-All Page Component
export default async function CatchAllPage({ params, searchParams }) {
  const p = await params;
  if (p?.slug?.[0] === "api") {
    return notFound();
  }

  const lastSegment = p.slug[p.slug.length - 1] || "";
  if (
    /\.(svg|png|jpg|jpeg|ico|css|js|woff|woff2|ttf|otf|map|json)$/i.test(
      lastSegment,
    )
  ) {
    return notFound();
  }
  const slug = p.slug.join("/");

  // In Next.js 15+ searchParams is a Promise — must be awaited.
  const sp = await searchParams;
  const preview = sp?.preview === "true";

  // Detect detailed blog post path, e.g. /blog/[slug] or /blogs/[slug]
  const isBlogPath =
    p.slug.length === 2 && (p.slug[0] === "blogs" || p.slug[0] === "blog");

  // Detect legal page path, e.g. /legal/privacy, /legal/terms
  const isLegalPath = slug.startsWith("legal/") && slug.split("/").length === 2;

  // Detect category page path, e.g. /category/[slug]
  const isCategoryPath = p.slug.length === 2 && p.slug[0] === "category";

  if (isLegalPath) {
    const legalType = slug.split("/")[1];
    try {
      const legalPage = await cms.getLegalPage(legalType);
      // Render legal page - return early with the legal content
      return <LegalPageDetail legalPage={legalPage} />;
    } catch (err) {
      console.error("Error loading legal page:", err);
      return notFound();
    }
  }

  if (isCategoryPath) {
    const categorySlug = p.slug[1];
    try {
      const postsResponse = await cms.getPosts();
      const allPosts = postsResponse.posts || [];
      const filteredPosts = allPosts.filter((post) =>
        (post.categories || []).some(
          (c) =>
            c.slug === categorySlug ||
            c.name?.toLowerCase().replace(/\s+/g, "-") === categorySlug,
        ),
      );

      const categoryName =
        filteredPosts.length > 0
          ? filteredPosts[0].categories.find(
              (c) =>
                c.slug === categorySlug ||
                c.name?.toLowerCase().replace(/\s+/g, "-") === categorySlug,
            )?.name ||
            categorySlug
              .replace(/-/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase())
          : categorySlug
              .replace(/-/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase());

      return (
        <div className="min-h-screen bg-[var(--ll-mist)] text-[var(--ll-ink)]">
          {/* Header */}
          <div className="pt-28 pb-12 bg-[var(--ll-ink)] text-white relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" style={{background:"radial-gradient(ellipse at 30% 60%, rgba(201,168,76,0.1) 0%, transparent 65%)"}} />
            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <h1 className="text-4xl md:text-6xl font-black tracking-[-0.03em] text-white mb-4">
                {categoryName}
              </h1>
              <p className="text-white/60 text-base md:text-lg max-w-2xl font-light">
                Articles and insights in the {categoryName} category.
              </p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-12">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-lg font-semibold text-slate-500">
                  No posts in this category yet
                </h3>
                <p className="text-sm text-slate-400 mt-2">
                  Check back soon for new articles.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blogs/${post.slug}`}
                    className="group block bg-[var(--ll-cream)] rounded-[var(--ll-radius-md)] shadow-[var(--ll-shadow-card)] hover:shadow-[var(--ll-shadow-lift)] border border-[var(--ll-stone)] transition-all duration-300 overflow-hidden"
                  >
                    {post.featuredImage && (
                      <div className="relative w-full aspect-[16/10]">
                        <Image
                          src={
                            post.featuredImage.secureUrl ||
                            post.featuredImage.url
                          }
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
                            className="inline-flex px-2.5 py-1 rounded-full bg-[var(--ll-gold-light)] text-[var(--ll-gold-dark)] text-[9px] font-bold uppercase tracking-wider border border-[var(--ll-gold)]/15"
                          >
                            {c.name}
                          </span>
                        ))}
                      </div>
                      <h2 className="font-bold text-[var(--ll-ink)] text-sm leading-snug mb-2 group-hover:text-[var(--ll-gold)] transition-colors duration-200 line-clamp-2">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-[var(--ll-slate-text)] text-sm leading-relaxed line-clamp-3 mb-4">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="text-xs text-[var(--ll-light-text)] font-semibold">
                        {new Date(
                          post.publishedAt || post.createdAt,
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    } catch (err) {
      console.error("Error loading category posts:", err);
      return notFound();
    }
  }

  if (isBlogPath) {
    let post = null;
    try {
      const postSlug = p.slug[1];
      // Try published posts first
      const postsResponse = await cms.getPosts();
      const posts = postsResponse.posts || [];
      post = posts.find((x) => x.slug === postSlug);

      // If not found and previewing, try fetching draft directly via the API
      if (!post && preview) {
        try {
          const singlePostRes = await fetch(
            `${cms.baseUrl}/api/posts/${postSlug}?siteId=${cms.siteId}&preview=true`,
            { cache: "no-store" },
          );
          if (singlePostRes.ok) {
            const data = await singlePostRes.json();
            post = data.post || data.data || null;
          }
        } catch (e) {
          console.error("Failed to fetch draft post for preview:", e);
        }
      }
    } catch (err) {
      console.error("Error loading blog details:", err);
      return notFound();
    }

    if (!post) {
      return notFound();
    }

    return (
      <div className="min-h-screen bg-[var(--ll-mist)] text-[var(--ll-ink)] pt-28">
        {preview && (
          <div className="bg-amber-500 text-white text-center py-1.5 text-[10px] font-bold uppercase tracking-wider sticky top-0 z-50 shadow-sm">
            ⚡ Preview Mode &mdash; Viewing Draft Post
          </div>
        )}
        <BlogPostDetail post={post} />
      </div>
    );
  }

  let pageData = null;
  let pagePosts = [];
  try {
    pageData = await cms.getPage(slug, preview);
    // Fetch posts for any BLOGS sections on this page
    const postsRes = await cms.getPosts();
    pagePosts = (postsRes.posts || []).slice(0, 3);
  } catch (err) {
    console.error("Error loading CMS page:", err);
    return notFound();
  }

  const { page, sections } = pageData;

  if (!page || (!preview && page.status !== "PUBLISHED")) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--ll-mist)] text-[var(--ll-ink)] flex flex-col justify-between">
      {preview && (
        <div className="bg-amber-500 text-white text-center py-1.5 text-[10px] font-bold uppercase tracking-wider sticky top-0 z-50 shadow-sm">
          ⚡ Preview Mode &mdash; Viewing Draft Layout
        </div>
      )}

      <div className="pt-28">
        {/* JSON-LD Schema Markup Injection */}
        {pageData.jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(pageData.jsonLd),
            }}
          />
        )}

        {/* Main Content Area */}
        <main className="grow">
          {sections
            .filter((s) => s.isVisible !== false)
            .map((s) => {
              const type = String(s.type || "").toUpperCase();
              if (type === "HERO")
                return <HeroSection key={s.id} content={s.content} />;
              if (type === "TEXT_BLOCK")
                return <TextBlockSection key={s.id} content={s.content} />;
              if (type === "SERVICES")
                return <ServicesSection key={s.id} content={s.content} />;
              if (type === "TEAM")
                return <TeamSection key={s.id} content={s.content} />;
              if (type === "TESTIMONIALS")
                return <TestimonialsSection key={s.id} content={s.content} />;
              if (type === "FAQ")
                return <FaqSection key={s.id} content={s.content} />;
              if (type === "CTA")
                return <CtaSection key={s.id} content={s.content} />;
              if (type === "BLOGS")
                return (
                  <BlogsSection
                    key={s.id}
                    content={{ ...s.content, items: pagePosts }}
                  />
                );
              if (type === "CONTACT_FORM") {
                return (
                  <ContactFormSection
                    key={s.id}
                    siteId={cms.siteId}
                    content={s.content}
                    recaptchaSiteKey={null} // reCAPTCHA loaded dynamically if configured by settings
                  />
                );
              }

              return (
                <section key={s.id} className="py-8 max-w-7xl mx-auto px-6">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Fallback: {s.type} Section
                  </span>
                  <pre className="p-4 bg-white border rounded text-xs font-mono overflow-auto">
                    {JSON.stringify(s.content, null, 2)}
                  </pre>
                </section>
              );
            })}
        </main>
      </div>
    </div>
  );
}
