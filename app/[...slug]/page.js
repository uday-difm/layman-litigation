// app/[...slug]/page.js
import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CMSClient } from "@yourcompany/global-backend-next";
import ContactFormSection from "@/components/ContactFormSection";
import { RichTextRenderer } from "@yourcompany/global-backend-next/components";
export const dynamic = "force-dynamic";

const cms = new CMSClient({
  baseUrl: process.env.NEXT_PUBLIC_CMS_BASE_URL || "http://localhost:3000",
  siteId: process.env.NEXT_PUBLIC_SITE_ID || "layman_litigation",
});

// SafeImage helper to support Next.js Image caching or fallback <img>
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

// Simple client-safe markdown-to-HTML parser function
function renderMarkdown(markdownText) {
  if (!markdownText) return "";

  let html = markdownText
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // 1. Code blocks: ```lang ... ```
  html = html.replace(/```([\s\S]*?)```/g, (match, p1) => {
    return `<pre class="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs my-6 overflow-x-auto"><code>${p1.trim()}</code></pre>`;
  });

  // 2. Headings
  html = html.replace(
    /^# (.*?)$/gm,
    '<h1 class="text-3xl font-extrabold text-slate-900 mt-8 mb-4">$1</h1>',
  );
  html = html.replace(
    /^## (.*?)$/gm,
    '<h2 class="text-2xl font-extrabold text-slate-900 mt-8 mb-4">$1</h2>',
  );
  html = html.replace(
    /^### (.*?)$/gm,
    '<h3 class="text-xl font-bold text-slate-900 mt-6 mb-3">$1</h3>',
  );
  html = html.replace(
    /^#### (.*?)$/gm,
    '<h4 class="text-lg font-bold text-slate-900 mt-4 mb-2">$1</h4>',
  );

  // 3. Blockquotes
  html = html.replace(
    /^&gt; (.*?)$/gm,
    '<blockquote class="border-l-4 border-indigo-500 pl-4 py-1 italic text-slate-650 my-6 bg-slate-50 rounded-r-lg">$1</blockquote>',
  );

  // 4. Unordered Lists
  html = html.replace(
    /^(?:\*|-)\s+(.*?)$/gm,
    '<li class="list-disc ml-6 mb-2">$1</li>',
  );

  // 5. Ordered Lists
  html = html.replace(
    /^(\d+)\.\s+(.*?)$/gm,
    '<li class="list-decimal ml-6 mb-2">$2</li>',
  );

  // 6. Bold
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/__(.*?)__/g, "<strong>$1</strong>");

  // 7. Italic
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
  html = html.replace(/_(.*?)_/g, "<em>$1</em>");

  // 8. Inline Code
  html = html.replace(
    /`(.*?)`/g,
    '<code class="bg-slate-100 text-pink-600 px-1.5 py-0.5 rounded font-mono text-[0.9em]">$1</code>',
  );

  // 9. Images
  html = html.replace(
    /!\[(.*?)\]\((.*?)\)/g,
    '<img src="$2" alt="$1" class="my-8 rounded-xl max-w-full h-auto mx-auto shadow-md" />',
  );

  // 10. Links
  html = html.replace(
    /\[(.*?)\]\((.*?)\)/g,
    '<a href="$2" class="text-indigo-600 hover:text-indigo-800 underline font-semibold transition" target="_blank" rel="noopener noreferrer">$1</a>',
  );

  const blocks = html.split(/\n\n+/);
  const formattedBlocks = blocks.map((block) => {
    const trimmed = block.trim();
    if (!trimmed) return "";

    const isBlockTag = /^(<h[1-6]|<pre|<blockquote|<ul|<ol|<li|<img|<p)/i.test(
      trimmed,
    );
    if (isBlockTag) {
      return trimmed;
    }

    const paragraphs = trimmed.split("\n").join("<br />");
    return `<p class="text-slate-650 leading-relaxed mb-5">${paragraphs}</p>`;
  });

  let parsed = formattedBlocks.join("\n");

  // Group consecutive list items
  parsed = parsed.replace(/(<li class="list-disc.*<\/li>\n?)+/g, (match) => {
    return `<ul class="my-6 space-y-1">${match}</ul>`;
  });
  parsed = parsed.replace(/(<li class="list-decimal.*<\/li>\n?)+/g, (match) => {
    return `<ol class="my-6 space-y-1">${match}</ol>`;
  });

  return parsed;
}

// Reusable detailed blog post UI component
function BlogPostDetail({ post }) {
  const categories = post.categories || [];

  return (
    <article className="max-w-4xl mx-auto px-6 py-12">
      <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mb-6 uppercase tracking-wider">
        <Link href="/" className="hover:text-indigo-600 transition">
          Home
        </Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-indigo-600 transition">
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
              className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-100"
            >
              {c.name}
            </span>
          ))}
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center gap-3 pb-6 border-b border-slate-200">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center text-white font-extrabold shadow-sm">
            {post.author ? post.author.email.charAt(0).toUpperCase() : "A"}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">
              {post.author ? post.author.email.split("@")[0] : "Author"}
            </p>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">
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
        <div className="relative w-full aspect-[16/10] md:aspect-[21/9] rounded-2xl overflow-hidden shadow-sm mb-10 border border-slate-100">
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
        <p className="text-lg md:text-xl font-light text-slate-500 leading-relaxed mb-8 italic pl-4 border-l-4 border-slate-350">
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
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mb-8 uppercase tracking-wider">
          <Link href="/" className="hover:text-[#d9b04f] transition">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-600">{title || "Legal"}</span>
        </nav>

        <article className="prose prose-slate max-w-none">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            {title}
          </h1>
          {lastUpdated && (
            <p className="text-xs text-slate-400 mb-8 border-b pb-4">
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

// Section components
function HeroSection({ content }) {
  const bg = content?.bannerUrl || content?.backgroundUrl;
  const alignClass =
    content?.alignment === "left"
      ? "text-left justify-start"
      : content?.alignment === "right"
        ? "text-right justify-end"
        : "text-center justify-center";

  return (
    <section className="relative w-full min-h-[500px] flex items-center bg-slate-900 text-white overflow-hidden py-24">
      {bg && (
        <div className="absolute inset-0 z-0">
          <SafeImage
            src={bg}
            alt={content?.title || "Hero Banner"}
            fill
            style={{ objectFit: "cover" }}
            priority
          />
          <div className="absolute inset-0 bg-slate-950/60" />
        </div>
      )}
      <div
        className={`relative z-10 w-full max-w-7xl mx-auto px-6 flex ${alignClass}`}
      >
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            {content?.title}
          </h1>
          {content?.subtitle && (
            <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-2xl font-light">
              {content.subtitle}
            </p>
          )}
          <div className="flex flex-wrap gap-4 items-center justify-center lg:justify-start">
            {content?.primaryButton?.text && (
              <a
                href={content.primaryButton.url || "/"}
                className="px-6 py-3 bg-[#d9b04f] hover:bg-[#c49d41] text-[#1b1b1b] rounded-lg font-bold shadow transition-all hover:-translate-y-0.5"
              >
                {content.primaryButton.text}
              </a>
            )}
            {content?.secondaryButton?.text && (
              <a
                href={content.secondaryButton.url || "/"}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg font-semibold backdrop-blur-sm transition-all hover:-translate-y-0.5"
              >
                {content.secondaryButton.text}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function TextBlockSection({ content }) {
  const directionClass =
    content?.imagePosition === "left"
      ? "md:flex-row"
      : content?.imagePosition === "right"
        ? "md:flex-row-reverse"
        : "flex-col";

  return (
    <section className="py-16 bg-white text-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className={`flex flex-col gap-10 items-center ${directionClass}`}>
          {content?.imageUrl && (
            <div className="w-full md:w-1/2 relative h-[320px] rounded-xl overflow-hidden shadow-md">
              <SafeImage
                src={content.imageUrl}
                alt={content?.title || "Image Block"}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          )}
          <div
            className={
              content?.imageUrl ? "w-full md:w-1/2" : "w-full max-w-3xl mx-auto"
            }
          >
            {content?.title && (
              <h2 className="text-3xl font-extrabold text-[#1b1b1b] tracking-tight mb-4">
                {content.title}
              </h2>
            )}
            {content?.body &&
              (() => {
                const body = content.body;
                const isHtml =
                  typeof body === "string" && body.trim().startsWith("<");
                return (
                  <div
                    className="prose prose-slate max-w-none space-y-4"
                    dangerouslySetInnerHTML={{
                      __html: isHtml ? body : renderMarkdown(body),
                    }}
                  />
                );
              })()}
            {content?.cta?.text && (
              <div className="mt-8">
                <a
                  href={content.cta.url || "/"}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#1b1b1b] hover:bg-[#d9b04f] hover:text-[#1b1b1b] text-white rounded-lg font-bold shadow transition"
                >
                  {content.cta.text}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function formatPrice(price) {
  if (!price) return "Contact Us";
  const trimmed = String(price).trim();
  const isNumeric = !isNaN(trimmed) && !isNaN(parseFloat(trimmed));
  const hasCurrencySymbol = /[\$\€\£\¥\₹]/.test(trimmed);
  if (isNumeric && !hasCurrencySymbol) {
    return `$${trimmed}`;
  }
  return trimmed;
}

function ServicesSection({ content }) {
  const items = content?.items || [];
  return (
    <section className="py-16 bg-slate-50 text-slate-800 border-t border-b">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#1b1b1b]">
            Our Services
          </h2>
          <p className="text-slate-500 mt-2 text-sm">
            Professional services customized to help you grow your brand
            identity.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 p-6 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold text-[#1b1b1b] mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>
              <div className="border-t pt-4 flex items-center justify-between mt-4">
                <span className="font-mono text-sm font-bold text-[#d9b04f]">
                  {formatPrice(item.price)}
                </span>
                {item.ctaButtonText && (
                  <a
                    href={item.ctaButtonLink || "/"}
                    className="px-3 py-1.5 bg-[#1b1b1b] text-white hover:bg-[#d9b04f] hover:text-[#1b1b1b] rounded text-xs font-semibold"
                  >
                    {item.ctaButtonText}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamSection({ content }) {
  const items = content?.items || [];
  return (
    <section className="py-16 bg-white text-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#1b1b1b]">
            Meet Our Team
          </h2>
          <p className="text-slate-500 mt-2 text-sm">
            Our group of expert professionals and leaders.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {items.map((member) => (
            <div key={member.id} className="text-center group">
              <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden mb-4 border-2 border-slate-100 group-hover:border-[#d9b04f] transition duration-200">
                {member.photo ? (
                  <SafeImage
                    src={member.photo}
                    alt={member.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-400 font-bold text-3xl">
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>
              <h3 className="font-bold text-slate-900 text-base">
                {member.name}
              </h3>
              <p className="text-xs text-[#d9b04f] font-semibold mb-1">
                {member.role}
              </p>
              {member.bio && (
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto line-clamp-2 px-2">
                  {member.bio}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection({ content }) {
  const items = content?.items || [];
  return (
    <section className="py-16 bg-[#1b1b1b] text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Client Feedback
          </h2>
          <p className="text-slate-400 mt-2 text-sm">
            Hear directly what our global partners say about us.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-neutral-900/60 p-6 rounded-xl border border-neutral-800 backdrop-blur-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 mb-4 text-[#d9b04f] font-mono text-sm">
                  {Array.from({ length: item.rating || 5 }).map((_, idx) => (
                    <span key={idx}>★</span>
                  ))}
                </div>
                <p className="text-slate-350 text-xs italic leading-relaxed mb-6">
                  &ldquo;{item.content}&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 border-t border-neutral-800 pt-4">
                {item.clientImage ? (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden">
                    <SafeImage
                      src={item.clientImage}
                      alt={item.clientName}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-[10px] font-bold">
                    {item.clientName.charAt(0)}
                  </div>
                )}
                <span className="font-semibold text-xs text-white">
                  {item.clientName}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection({ content }) {
  const items = content?.items || [];
  return (
    <section className="py-16 bg-white text-slate-800">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#1b1b1b]">
            FAQ
          </h2>
          <p className="text-slate-500 mt-2 text-sm">
            Common questions and detailed answers.
          </p>
        </div>
        <div className="space-y-4">
          {items.map((faq) => (
            <div
              key={faq.id}
              className="border rounded-lg p-5 hover:bg-slate-50/50 transition"
            >
              <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-start gap-2">
                <span className="text-[#d9b04f]">Q.</span>
                {faq.question}
              </h3>
              <p className="text-slate-650 text-xs pl-6 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection({ content }) {
  return (
    <section className="py-12 bg-gradient-to-r from-[#1b1b1b] to-neutral-800 text-white border-t border-neutral-700">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          {content?.title || "Ready to scale up?"}
        </h2>
        {content?.subtitle && (
          <p className="text-sm text-slate-300 max-w-2xl mx-auto mb-6">
            {content.subtitle}
          </p>
        )}
        {content?.primaryButtonText && (
          <a
            href={content.primaryButtonUrl || "/"}
            className="px-6 py-2.5 bg-[#d9b04f] hover:bg-[#c49d41] text-[#1b1b1b] font-bold rounded shadow transition hover:-translate-y-0.5"
          >
            {content.primaryButtonText}
          </a>
        )}
      </div>
    </section>
  );
}

function BlogsSection({ content }) {
  const items = content?.items || [];
  return (
    <section className="py-16 bg-white text-slate-800 border-t border-b">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#1b1b1b]">
            {content?.title || "Latest Articles"}
          </h2>
          <p className="text-slate-500 mt-2 text-sm">
            {content?.description ||
              "Stay updated with our latest news and corporate insights."}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
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
                <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-[#d9b04f] transition truncate">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4 mt-1">
                    {post.excerpt}
                  </p>
                )}
                <div className="text-[10px] text-slate-400 font-semibold mt-4 pt-4 border-t flex justify-between">
                  <span>
                    By{" "}
                    {post.author ? post.author.email.split("@")[0] : "Author"}
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
      </div>
    </section>
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
      <div className="min-h-screen bg-slate-50 text-slate-950 pt-28">
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
    <div className="min-h-screen bg-slate-50 text-slate-950 flex flex-col justify-between">
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
