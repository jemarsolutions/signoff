import Link from "next/link";
import { getSortedPostsData } from "@/lib/blog";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata = {
  title: "Blog",
  description: "Read the latest news, updates, and logistics tips from SignOff.",
};

export default function BlogIndex() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="relative min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_120%_80%_at_50%_-10%,#1e1b4b_0%,#020617_60%)]" />
      <div className="fixed top-0 left-1/4 -z-10 h-150 w-150 rounded-full bg-indigo-600/10 blur-[120px]" />
      <div className="fixed top-0 right-1/4 -z-10 h-125 w-125 rounded-full bg-violet-600/10 blur-[100px]" />

      {/* Navbar */}
      <SiteHeader />

      {/* Hero Banner */}
      <section className="border-b border-slate-900 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block rounded-full bg-indigo-500/10 border border-indigo-500/20 px-4 py-1 text-xs font-semibold text-indigo-400 mb-4">
            THE SIGNOFF BLOG
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Insights for{" "}
            <span className="bg-linear-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              Modern Logistics
            </span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            Tips, strategies, and product updates to help you run a more efficient, dispute-free delivery operation.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {allPostsData.length === 0 ? (
          <p className="text-center text-slate-500">No posts yet. Check back soon!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allPostsData.map(({ slug, title, date, excerpt, author }) => (
              <article
                key={slug}
                className="group flex flex-col rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-indigo-500/40 hover:bg-slate-900/70 transition-all duration-300 overflow-hidden"
              >
                {/* Card top accent */}
                <div className="h-1 w-full bg-linear-to-r from-indigo-500 via-violet-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex flex-col flex-1 p-6">
                  <time className="text-xs font-semibold text-indigo-400 tracking-wider uppercase mb-3 block">
                    {new Date(date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>

                  <h2 className="text-lg font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors leading-snug flex-1">
                    {title}
                  </h2>

                  <p className="text-sm text-slate-400 leading-relaxed mb-6 line-clamp-3">
                    {excerpt}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-linear-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                        {author.charAt(0)}
                      </div>
                      <span className="text-xs text-slate-400">{author}</span>
                    </div>
                    <Link
                      href={`/blog/${slug}`}
                      className="text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 flex items-center gap-1 transition-colors"
                    >
                      Read <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
