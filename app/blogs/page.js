import Link from "next/link";
import { notFound } from "next/navigation";
import { cms } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function BlogPage({ searchParams }) {
  // Check if this page is published in the CMS
  try {
    await cms.getPage("blogs");
  } catch (err) {
    if (err.message === "Page not found or is not published") {
      return notFound();
    }
  }

  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);

  let allPosts = [];
  try {
    const postsResponse = await cms.getPosts();
    allPosts = postsResponse.posts || [];
  } catch (err) {
    console.error("Failed to fetch posts in BlogPage:", err);
  }

  const POSTS_PER_PAGE = 6;
  const totalPosts = allPosts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE) || 1;
  const currentPage = Math.max(1, Math.min(page, totalPages));

  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = allPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  return (
    <div className="min-h-screen bg-[#f5f5f5] pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-8 pt-8">
        {/* Clean Breadcrumb */}
        <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-6">
          <Link href="/" className="hover:text-[#d9b04f] transition">Home</Link>
          <span>/</span>
          <span className="text-slate-650">Blog</span>
        </nav>
      </div>

      <div className="mx-auto max-w-7xl px-8 py-12">
        {/* Page Header */}
        <div className="mb-12 border-b border-gray-200 pb-8">
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded bg-[#d9b04f]/25 text-[#1b1b1b]">
            Articles
          </span>
          <h1 className="mt-4 text-4xl font-extrabold text-[#1b1b1b] tracking-tight">
            Our Insights
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-500 leading-relaxed">
            Stay informed with our latest news, case analyses, and employment law updates.
          </p>
          <div className="mt-6 text-sm text-gray-400">
            Showing {startIndex + 1}-{Math.min(startIndex + POSTS_PER_PAGE, totalPosts)} of {totalPosts} articles
          </div>
        </div>

        {/* Posts Grid */}
        {paginatedPosts.length > 0 ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedPosts.map((post) => {
                const dateToDisplay = post.publishedAt || post.createdAt;
                const accentColor = "#d9b04f";

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
                            background: `linear-gradient(135deg, ${accentColor}90 0%, #1b1b1b 100%)`,
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
                          <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-[#d9b04f] transition line-clamp-2 leading-snug">
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2 border-t border-gray-200 pt-8">
                {/* Prev Button */}
                {currentPage > 1 ? (
                  <Link
                    href={`/blogs?page=${currentPage - 1}`}
                    className="px-4 py-2 border rounded-lg text-sm font-semibold bg-white text-gray-700 hover:bg-gray-50 hover:text-black transition"
                  >
                    Previous
                  </Link>
                ) : (
                  <span className="px-4 py-2 border rounded-lg text-sm font-semibold bg-gray-50 text-gray-400 cursor-not-allowed">
                    Previous
                  </span>
                )}

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, index) => {
                  const pNum = index + 1;
                  const isCurrent = pNum === currentPage;
                  return isCurrent ? (
                    <span
                      key={pNum}
                      className="px-4 py-2 rounded-lg text-sm font-bold bg-[#1b1b1b] text-white"
                    >
                      {pNum}
                    </span>
                  ) : (
                    <Link
                      key={pNum}
                      href={`/blogs?page=${pNum}`}
                      className="px-4 py-2 border rounded-lg text-sm font-semibold bg-white text-gray-700 hover:bg-gray-50 hover:text-black transition"
                    >
                      {pNum}
                    </Link>
                  );
                })}

                {/* Next Button */}
                {currentPage < totalPages ? (
                  <Link
                    href={`/blogs?page=${currentPage + 1}`}
                    className="px-4 py-2 border rounded-lg text-sm font-semibold bg-white text-gray-700 hover:bg-gray-50 hover:text-black transition"
                  >
                    Next
                  </Link>
                ) : (
                  <span className="px-4 py-2 border rounded-lg text-sm font-semibold bg-gray-50 text-gray-400 cursor-not-allowed">
                    Next
                  </span>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 text-gray-400 text-2xl">
              📝
            </div>
            <h3 className="mt-4 text-lg font-bold text-gray-800">
              No Blog Posts Found
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
              We haven&apos;t published any articles yet. Please check back later!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
