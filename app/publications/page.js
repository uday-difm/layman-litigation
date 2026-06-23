import Link from "next/link";
import { publications } from "@/data/publications";

export default function PublicationsPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f5] pt-40">
      {/* Breadcrumb */}
      <div className="bg-[#d9b04f]">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-8 py-3">
          <Link
            href="/"
            className="text-sm font-bold uppercase text-white hover:text-[#1b1b1b] transition-colors"
          >
            Home
          </Link>
          <span className="text-white/60">›</span>
          <span className="text-sm font-bold uppercase text-white/80">
            Publications
          </span>
        </div>
      </div>

      {/* Intro */}
      <div className="mx-auto max-w-7xl px-8 pt-10 pb-4">
        <h1 className="text-2xl font-light text-gray-600">
          Layman Litigation publishes{" "}
          <span className="font-semibold text-[#1b1b1b]">
            monthly Periodicals
          </span>
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">
          Stay informed with our curated legal insights, case analyses, and
          industry commentary — delivered every month.
        </p>
      </div>

      {/* Publications Grid */}
      <div className="mx-auto max-w-7xl px-8 py-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {publications.map((pub) => (
            <article key={pub.issue} className="group">
              {/* Month Label */}
              <h2 className="mb-4 text-xl font-semibold text-[#1b1b1b]">
                {pub.month}
              </h2>

              {/* Magazine Cover Card */}
              <Link href={`./publications/${pub.slug}`} className="block">
                <div
                  className={`relative aspect-3/4 overflow-hidden rounded-lg bg-linear-to-br ${pub.gradient} shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1`}
                >
                  {/* Decorative elements */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20" />
                    <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10" />
                  </div>

                  {/* Content */}
                  <div className="relative flex h-full flex-col justify-between p-6">
                    {/* Top */}
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

                    {/* Center — Title */}
                    <div className="my-auto">
                      <h3 className="text-xl font-bold leading-tight text-white">
                        {pub.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/60">
                        {pub.subtitle}
                      </p>
                    </div>

                    {/* Bottom */}
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-white/40">
                          {pub.month}
                        </p>
                      </div>
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
      </div>
    </div>
  );
}
