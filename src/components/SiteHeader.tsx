import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function SiteHeader() {
  const session = await getServerSession(authOptions);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-tr from-indigo-500 to-violet-500 font-bold text-white shadow-lg shadow-indigo-500/20 text-lg">
            ✓
          </span>
          <span className="text-xl font-black tracking-tight bg-linear-to-r from-white to-indigo-300 bg-clip-text text-transparent">
            SignOff
          </span>
        </Link>

        {/* Nav links — use absolute hrefs so they work from any page */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <Link href="/#how-it-works" className="hover:text-white transition-colors">
            How It Works
          </Link>
          <Link href="/#features" className="hover:text-white transition-colors">
            Features
          </Link>
          <Link href="/#demo" className="hover:text-white transition-colors">
            Demo
          </Link>
          <Link href="/#pricing" className="hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="/blog" className="hover:text-white transition-colors">
            Blog
          </Link>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          {session?.user ? (
            <>
              <Link
                href="/api/auth/signout"
                className="text-sm font-medium text-slate-400 hover:text-rose-400 transition-colors hidden sm:block"
              >
                Sign Out
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-9 items-center justify-center rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-500 transition-all hover:scale-[1.02] shadow-md active:scale-[0.98]"
              >
                Dashboard →
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors hidden sm:block"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signin"
                className="inline-flex h-9 items-center justify-center rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-500 transition-all hover:scale-[1.02] shadow-md active:scale-[0.98]"
              >
                Get Started Free
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
