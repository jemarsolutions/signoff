import Link from "next/link";
import { getSortedPostsData } from "@/lib/blog";

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

      {/* Header (Simplified) */}
      <header className="sticky top-0 z-50 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-tr from-indigo-500 to-violet-500 font-bold text-white shadow-lg shadow-indigo-500/20 text-lg">
              ✓
            </span>
            <span className="text-xl font-black tracking-tight bg-linear-to-r from-white to-indigo-300 bg-clip-text text-transparent">
              SignOff
            </span>
          </Link>
          <Link href="/" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Blog Listing */}
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-white mb-4">The SignOff Blog</h1>
          <p className="text-slate-400">Logistics insights, product updates, and industry tips.</p>
        </div>

        <div className="space-y-8">
          {allPostsData.map(({ slug, title, date, excerpt }) => (
            <article key={slug} className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-6 hover:border-slate-700 transition-colors">
              <Link href={`/blog/${slug}`} className="block">
                <time className="text-xs font-semibold text-indigo-400 tracking-wider uppercase mb-2 block">
                  {new Date(date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">
                  {title}
                </h2>
                <p className="text-slate-400 leading-relaxed mb-4">
                  {excerpt}
                </p>
                <span className="text-sm font-semibold text-indigo-400 group-hover:text-indigo-300 flex items-center gap-1">
                  Read article <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </Link>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
