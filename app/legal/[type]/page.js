// app/legal/[type]/page.js
import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CMSClient } from "@yourcompany/global-backend-next";
import { RichTextRenderer } from "@yourcompany/global-backend-next/components";

export const dynamic = "force-dynamic";

const cms = new CMSClient({
  baseUrl: process.env.NEXT_PUBLIC_CMS_BASE_URL || "http://localhost:3000",
  siteId: process.env.NEXT_PUBLIC_SITE_ID || "layman_litigation",
});

const LEGAL_TYPES = ["privacy", "terms", "cookies", "disclaimer", "refund"];

// Simple client-safe markdown-to-HTML parser function (matching CatchAll page)
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
  html = html.replace(/^# (.*?)$/gm, '<h1 class="text-3xl font-extrabold text-slate-900 mt-8 mb-4">$1</h1>');
  html = html.replace(/^## (.*?)$/gm, '<h2 class="text-2xl font-extrabold text-slate-900 mt-8 mb-4">$1</h2>');
  html = html.replace(/^### (.*?)$/gm, '<h3 class="text-xl font-bold text-slate-900 mt-6 mb-3">$1</h3>');
  html = html.replace(/^#### (.*?)$/gm, '<h4 class="text-lg font-bold text-slate-900 mt-4 mb-2">$1</h4>');

  // 3. Blockquotes
  html = html.replace(/^&gt; (.*?)$/gm, '<blockquote class="border-l-4 border-indigo-500 pl-4 py-1 italic text-slate-650 my-6 bg-slate-50 rounded-r-lg">$1</blockquote>');

  // 4. Unordered Lists
  html = html.replace(/^(?:\*|-)\s+(.*?)$/gm, '<li class="list-disc ml-6 mb-2">$1</li>');

  // 5. Ordered Lists
  html = html.replace(/^(\d+)\.\s+(.*?)$/gm, '<li class="list-decimal ml-6 mb-2">$2</li>');

  // 6. Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');

  // 7. Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.*?)_/g, '<em>$1</em>');

  // 8. Inline Code
  html = html.replace(/`(.*?)`/g, '<code class="bg-slate-100 text-pink-600 px-1.5 py-0.5 rounded font-mono text-[0.9em]">$1</code>');

  // 9. Images
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="my-8 rounded-xl max-w-full h-auto mx-auto shadow-md" />');

  // 10. Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-indigo-600 hover:text-indigo-800 underline font-semibold transition" target="_blank" rel="noopener noreferrer">$1</a>');

  const blocks = html.split(/\n\n+/);
  const formattedBlocks = blocks.map(block => {
    const trimmed = block.trim();
    if (!trimmed) return "";

    const isBlockTag = /^(<h[1-6]|<pre|<blockquote|<ul|<ol|<li|<img|<p)/i.test(trimmed);
    if (isBlockTag) {
      return trimmed;
    }

    const paragraphs = trimmed.split('\n').join('<br />');
    return `<p class="text-slate-650 leading-relaxed mb-5">${paragraphs}</p>`;
  });

  let parsed = formattedBlocks.join('\n');

  // Group consecutive list items
  parsed = parsed.replace(/(<li class="list-disc.*<\/li>\n?)+/g, (match) => {
    return `<ul class="my-6 space-y-1">${match}</ul>`;
  });
  parsed = parsed.replace(/(<li class="list-decimal.*<\/li>\n?)+/g, (match) => {
    return `<ol class="my-6 space-y-1">${match}</ol>`;
  });

  return parsed;
}

export async function generateMetadata({ params }) {
  const p = await params;
  const type = p.type;

  if (!LEGAL_TYPES.includes(type)) return {};

  try {
    const data = await cms.getLegalPage(type);
    if (data?.legalPage) {
      return {
        title: `${data.legalPage.title} | Layman Litigation`,
        description: `Read our official ${data.legalPage.title.toLowerCase()}.`,
      };
    }
  } catch (e) {
    console.error("Failed to generate metadata for legal page:", e);
  }
  return {};
}

export default async function LegalPage({ params }) {
  const p = await params;
  const type = p.type;

  if (!LEGAL_TYPES.includes(type)) {
    return notFound();
  }

  let data = null;
  try {
    data = await cms.getLegalPage(type);
  } catch (err) {
    console.error("Error loading legal page:", err);
    return notFound();
  }

  const legalPage = data?.legalPage;
  if (!legalPage) {
    return notFound();
  }

  const contentHtml = legalPage.contentJson ? "" : renderMarkdown(legalPage.content);

  return (
    <article className="max-w-4xl mx-auto px-6 py-32 flex-1">
      {/* Breadcrumbs Navigation */}
      <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mb-8 uppercase tracking-wider">
        <Link href="/" className="hover:text-[#d9b04f] transition">Home</Link>
        <span>/</span>
        <span className="text-slate-600 truncate max-w-xs">{legalPage.title}</span>
      </nav>

      <header className="mb-10 border-b border-slate-200 pb-6">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4 leading-tight">
          {legalPage.title}
        </h1>
        <p className="text-xs text-slate-400 font-mono">
          Last Updated: {new Date(legalPage.updatedAt || legalPage.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </header>

      {legalPage.contentJson ? (
        <RichTextRenderer content={legalPage.content} />
      ) : (
        <div
          className="blog-prose font-serif text-slate-700 leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      )}
    </article>
  );
}
