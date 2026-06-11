import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-900 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-tr from-indigo-500 to-violet-500 font-bold text-white text-sm">
              ✓
            </span>
            <span className="font-black text-white">SignOff</span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            <Link href="/#how-it-works" className="hover:text-white transition-colors">
              How It Works
            </Link>
            <Link href="/#features" className="hover:text-white transition-colors">
              Features
            </Link>
            <Link href="/#pricing" className="hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/blog" className="hover:text-white transition-colors">
              Blog
            </Link>
            <Link href="/auth/signin" className="hover:text-white transition-colors">
              Sign In
            </Link>
          </nav>
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} SignOff. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
