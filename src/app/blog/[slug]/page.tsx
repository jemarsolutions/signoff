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
          <Link href="/blog" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
            ← Back to Blog
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <article>
          <header className="mb-12 pb-8 border-b border-slate-800">
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-6">
              {postData.title}
            </h1>
            <div className="flex items-center gap-4 text-slate-400 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-linear-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold">
                  {postData.author.charAt(0)}
                </div>
                <div>
                  <span className="font-medium text-slate-300 block">{postData.author}</span>
                  {postData.role && (
                    <span className="text-xs text-indigo-400">{postData.role}</span>
                  )}
                </div>
              </div>
              <span>•</span>
              <time>
                {new Date(postData.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
          </header>

          <div
            className="prose prose-invert prose-indigo max-w-none prose-headings:font-bold prose-a:text-indigo-400 hover:prose-a:text-indigo-300"
            dangerouslySetInnerHTML={{ __html: postData.content }}
          />
        </article>
      </main>
    </div>
  );
}
