// app/page.js
import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { cms } from "@/lib/cms";
import ContactFormSection from "@/components/ContactFormSection";

export const dynamic = "force-dynamic";

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

  const renderedBody = renderMarkdown(content?.body);

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
            {content?.body && (
              <div
                className="prose prose-slate max-w-none space-y-4"
                dangerouslySetInnerHTML={{ __html: renderedBody }}
              />
            )}
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
                <p className="text-xs text-slate-505 leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>
              <div className="border-t pt-4 flex items-center justify-between mt-4">
                <span className="font-mono text-sm font-bold text-[#d9b04f]">
                  {item.price || "Contact Us"}
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

// Next.js Dynamic Metadata Generation for root homepage
export async function generateMetadata() {
  try {
    const { seo } = await cms.getPage("");
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

// Main Dynamic Catch-All Page Component for root homepage
export default async function HomePage() {
  let pageData = null;
  try {
    pageData = await cms.getPage("");
  } catch (err) {
    console.error("Error loading CMS page:", err);
    return notFound();
  }

  const { page, sections } = pageData;

  if (!page || page.status !== "PUBLISHED") {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 pt-28 flex flex-col justify-between">
      {/* JSON-LD Schema Markup Injection */}
      {pageData.jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(pageData.jsonLd) }}
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
              return <BlogsSection key={s.id} content={s.content} />;
            if (type === "CONTACT_FORM") {
              return (
                <ContactFormSection
                  key={s.id}
                  siteId={cms.siteId}
                  content={s.content}
                  recaptchaSiteKey={null}
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
  );
}
