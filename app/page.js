// app/page.js
import React from "react";
import { notFound } from "next/navigation";
import { cms } from "@/lib/cms";
import ContactFormSection from "@/components/ContactFormSection";
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

const FALLBACK_SECTIONS = [
  {
    id: "hero-1",
    type: "HERO",
    isVisible: true,
    content: {
      title: "Legal Clarity for Everyone",
      subtitle: "Expert legal guidance explained in plain language.",
      primaryButton: { text: "Free Consultation", url: "/contact" },
      secondaryButton: { text: "Learn More", url: "/about" },
    },
  },
  {
    id: "about-1",
    type: "TEXT_BLOCK",
    isVisible: true,
    content: {
      title: "Who We Are",
      body: "<p>Layman Litigation was founded with a simple mission: make the law accessible and understandable for everyone.</p>",
      imagePosition: "left",
    },
  },
  { id: "services-1", type: "SERVICES", isVisible: true, content: {} },
  { id: "team-1", type: "TEAM", isVisible: true, content: {} },
  { id: "testimonials-1", type: "TESTIMONIALS", isVisible: true, content: {} },
  { id: "faq-1", type: "FAQ", isVisible: true, content: {} },
  {
    id: "cta-1",
    type: "CTA",
    isVisible: true,
    content: {
      title: "Ready to Get Started?",
      subtitle: "Schedule a free consultation with our experienced legal team.",
      primaryButtonText: "Contact Us",
      primaryButtonUrl: "/contact",
    },
  },
];

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
export default async function HomePage({ searchParams }) {
  // In Next.js 15+ searchParams is a Promise — must be awaited.
  const sp = await searchParams;
  const preview = sp?.preview === "true";

  let pageData = null;
  let latestPosts = [];
  let page = null;
  let sections = null;
  let cmsFailed = false;

  try {
    pageData = await cms.getPage("", preview);
    // Fetch latest blog posts for the blog section
    const postsData = await cms.getPosts();
    latestPosts = (postsData.posts || []).slice(0, 3);
    page = pageData?.page;
    sections = pageData?.sections;
  } catch (err) {
    console.error("Error loading CMS page:", err);
    cmsFailed = true;
  }

  // If CMS succeeded but page is invalid (unpublished and not preview), fallback
  if (!cmsFailed && (!page || (!preview && page.status !== "PUBLISHED"))) {
    cmsFailed = true;
  }

  // Use fallback sections if CMS failed
  if (cmsFailed) {
    sections = FALLBACK_SECTIONS;
    page = { title: "Home" };
  }

  if (!sections) {
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
        {pageData?.jsonLd && (
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
                    content={{ ...s.content, items: latestPosts }}
                  />
                );
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
    </div>
  );
}
