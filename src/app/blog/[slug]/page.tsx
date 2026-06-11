import Link from "next/link";
import { getPostData, getSortedPostsData } from "@/lib/blog";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  try {
    const postData = await getPostData(resolvedParams.slug);
    return {
      title: postData.title,
      description: postData.excerpt,
    };
  } catch (e) {
    return {
      title: "Blog Post Not Found",
    };
  }
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let postData;
  try {
    postData = await getPostData(resolvedParams.slug);
  } catch (e) {
    notFound();
  }

  return (
    <div className="relative min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_120%_80%_at_50%_-10%,#1e1b4b_0%,#020617_60%)]" />
      <div className="fixed top-0 left-1/4 -z-10 h-150 w-150 rounded-full bg-indigo-600/10 blur-[120px]" />
      <div className="fixed top-0 right-1/4 -z-10 h-125 w-125 rounded-full bg-violet-600/10 blur-[100px]" />

      {/* Navbar */}
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
          <Link href="/blog" className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1">
            ← Back to Blog
          </Link>
        </div>
      </header>

      {/* Article Layout — wide container with centered prose */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-start">

          {/* Main Content */}
          <article>
            <header className="mb-10 pb-8 border-b border-slate-800">
              {/* Breadcrumb */}
              <div className="text-xs text-slate-500 mb-4 flex items-center gap-2">
                <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
                <span>/</span>
                <Link href="/blog" className="hover:text-slate-300 transition-colors">Blog</Link>
                <span>/</span>
                <span className="text-slate-400 truncate max-w-xs">{postData.title}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-6">
                {postData.title}
              </h1>

              {/* Author */}
              <div className="flex items-center gap-4 text-slate-400 text-sm">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-linear-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-base">
                    {postData.author.charAt(0)}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-200 block">{postData.author}</span>
                    {postData.role && (
                      <span className="text-xs text-indigo-400">{postData.role}</span>
                    )}
                  </div>
                </div>
                <span className="text-slate-700">•</span>
                <time className="text-slate-400">
                  {new Date(postData.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
            </header>

            {/* Article Body */}
            <div
              className="prose prose-invert prose-indigo max-w-none prose-headings:font-bold prose-headings:text-white prose-a:text-indigo-400 hover:prose-a:text-indigo-300 prose-strong:text-white prose-li:text-slate-300 prose-p:text-slate-300 prose-p:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: postData.content }}
            />
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block sticky top-24 space-y-6">
            {/* About the Author */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">About the Author</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 rounded-full bg-linear-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {postData.author.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-white">{postData.author}</p>
                  {postData.role && <p className="text-xs text-indigo-400">{postData.role}</p>}
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Building SignOff to eliminate delivery disputes for logistics teams across the Philippines and beyond.
              </p>
            </div>

            {/* CTA Card */}
            <div className="rounded-2xl border border-indigo-500/30 bg-linear-to-br from-indigo-950/60 to-violet-950/40 p-6 text-center">
              <h3 className="text-base font-bold text-white mb-2">Try SignOff Free</h3>
              <p className="text-xs text-slate-400 mb-4">Capture signatures and delivery photos. No credit card required.</p>
              <Link
                href="/auth/signin"
                className="block w-full py-2.5 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 text-sm font-bold text-white hover:from-indigo-500 hover:to-violet-500 transition-all text-center"
              >
                Get Started Free →
              </Link>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 mt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-tr from-indigo-500 to-violet-500 font-bold text-white text-sm">✓</span>
            <span className="font-black text-white">SignOff</span>
          </Link>
          <p className="text-xs text-slate-600">© {new Date().getFullYear()} SignOff. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
