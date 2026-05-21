import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DemoAnimation } from "@/components/DemoAnimation";

export const metadata = {
  title: "SignOff — Instant Proof of Delivery",
  description:
    "Capture signatures, verify deliveries with photos, and store tamper-proof records. The high-performance Proof-of-Delivery SaaS for modern logistics teams.",
};

const features = [
  {
    icon: "✍️",
    title: "Digital Signatures",
    desc: "Clients sign directly on any smartphone. No apps to install — works entirely in the browser.",
    color: "from-indigo-500/10 to-indigo-600/5 border-indigo-500/20",
    iconBg: "bg-indigo-500/10 text-indigo-400",
  },
  {
    icon: "📸",
    title: "Delivery Photo Proof",
    desc: "Drivers capture a timestamped photo at the point of delivery — stored securely in the cloud.",
    color: "from-violet-500/10 to-violet-600/5 border-violet-500/20",
    iconBg: "bg-violet-500/10 text-violet-400",
  },
  {
    icon: "🔗",
    title: "Shareable Job Links",
    desc: "Each delivery gets a unique, unguessable URL. Share via WhatsApp, SMS, or email — instantly.",
    color: "from-sky-500/10 to-sky-600/5 border-sky-500/20",
    iconBg: "bg-sky-500/10 text-sky-400",
  },
  {
    icon: "🔒",
    title: "Tamper-Proof Records",
    desc: "Every sign-off is timestamped and locked. Your evidence is secure when disputes arise.",
    color: "from-emerald-500/10 to-emerald-600/5 border-emerald-500/20",
    iconBg: "bg-emerald-500/10 text-emerald-400",
  },
  {
    icon: "🎨",
    title: "Custom Branding",
    desc: "Premium users can white-label the entire sign-off experience with their own logo and name.",
    color: "from-pink-500/10 to-pink-600/5 border-pink-500/20",
    iconBg: "bg-pink-500/10 text-pink-400",
  },
  {
    icon: "⚡",
    title: "Real-Time Dashboard",
    desc: "Track all pending and completed deliveries in one place. Never lose a record again.",
    color: "from-amber-500/10 to-amber-600/5 border-amber-500/20",
    iconBg: "bg-amber-500/10 text-amber-400",
  },
];

const steps = [
  {
    num: "01",
    title: "Create a Job",
    desc: "Add your client's name, email, and delivery details from your dashboard in seconds.",
  },
  {
    num: "02",
    title: "Share the Link",
    desc: "Copy the unique job link and send it to your driver via any messaging app.",
  },
  {
    num: "03",
    title: "Driver Delivers & Photos",
    desc: "The driver opens the link and uploads a photo of the delivered package.",
  },
  {
    num: "04",
    title: "Client Signs Off",
    desc: "The recipient draws their signature on their phone — no account needed.",
  },
];

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="relative min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_120%_80%_at_50%_-10%,#1e1b4b_0%,#020617_60%)]" />
      <div className="fixed top-0 left-1/4 -z-10 h-150 w-150 rounded-full bg-indigo-600/10 blur-[120px]" />
      <div className="fixed top-0 right-1/4 -z-10 h-125 w-125 rounded-full bg-violet-600/10 blur-[100px]" />

      {/* ── NAVBAR ── */}
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

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a
              href="#how-it-works"
              className="hover:text-white transition-colors"
            >
              How It Works
            </a>
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#demo" className="hover:text-white transition-colors">
              Demo
            </a>
            <a href="#pricing" className="hover:text-white transition-colors">
              Pricing
            </a>
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

      {/* ── HERO ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-20 lg:pt-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left */}
          <div className="flex flex-col gap-4 text-center lg:text-left">
            <div className="inline-flex self-center lg:self-start items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
              <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Proof of Delivery, Simplified
            </div>

            <h1 className="text-5xl sm:text-5xl font-black tracking-tight text-white leading-[1.08]">
              Sign-offs in{" "}
              <span className="bg-linear-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                seconds.
              </span>
              <br />
              Disputes in{" "}
              <span className="bg-linear-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                never.
              </span>
            </h1>

            <p className="text-base text-slate-400 leading-relaxed max-w-md mx-auto lg:mx-0">
              The mobile-first Proof-of-Delivery SaaS for logistics teams.
              Capture signatures, snap delivery photos, and store tamper-proof
              records — all from a shareable link.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                href={session?.user ? "/dashboard" : "/auth/signin"}
                className="inline-flex h-12 items-center justify-center rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 px-7 text-sm font-bold text-white shadow-xl shadow-indigo-600/25 hover:from-indigo-500 hover:to-violet-500 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {session?.user
                  ? "Go to Dashboard →"
                  : "Start Free — No Credit Card"}
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/50 px-7 text-sm font-semibold text-slate-300 hover:bg-slate-900 hover:text-white transition-all group"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 group-hover:bg-indigo-500/20 transition-colors">
                  <svg
                    className="h-3.5 w-3.5 text-indigo-400"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                Watch Demo
              </a>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-5 justify-center lg:justify-start pt-3 border-t border-slate-900/60">
              <div className="flex -space-x-2 shrink-0">
                {[
                  "bg-indigo-500",
                  "bg-violet-500",
                  "bg-pink-500",
                  "bg-emerald-500",
                ].map((c, i) => (
                  <div
                    key={i}
                    className={`h-8 w-8 rounded-full ${c} border-2 border-slate-950 flex items-center justify-center text-xs font-bold text-white`}
                  >
                    {["A", "B", "C", "D"][i]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5 text-amber-400 text-sm">
                  {"★★★★★"}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Loved by 500+ logistics teams
                </p>
              </div>
            </div>
          </div>

          {/* Right: Demo Animation */}
          <div className="relative">
            <div className="absolute -inset-6 rounded-[40px] bg-linear-to-r from-indigo-500/15 via-violet-500/15 to-pink-500/15 blur-3xl pointer-events-none" />
            <div className="relative max-w-75 mx-auto lg:max-w-[320px]">
              <DemoAnimation />
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 border-t border-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block rounded-full bg-violet-500/10 border border-violet-500/20 px-4 py-1 text-xs font-semibold text-violet-400 mb-4">
              HOW IT WORKS
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
              From order to proof in{" "}
              <span className="bg-linear-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                4 steps
              </span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              No training needed. No app installs. Works on every device.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div
                key={i}
                className="relative rounded-2xl border border-slate-800 bg-slate-900/40 p-6 hover:border-slate-700 transition-colors group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-4xl font-black text-slate-800 group-hover:text-slate-700 transition-colors font-mono select-none">
                    {s.num}
                  </span>
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-10 right-0 translate-x-1/2 z-10">
                      <svg
                        className="h-4 w-4 text-slate-700"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 border-t border-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block rounded-full bg-indigo-500/10 border border-indigo-500/20 px-4 py-1 text-xs font-semibold text-indigo-400 mb-4">
              FEATURES
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
              Everything you need.{" "}
              <span className="bg-linear-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                Nothing you don&apos;t.
              </span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Built for speed, built for the field. No bloat, no complexity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className={`rounded-2xl border bg-linear-to-br p-6 hover:scale-[1.01] transition-transform ${f.color}`}
              >
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl text-2xl mb-4 ${f.iconBg}`}
                >
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 border-t border-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-1 text-xs font-semibold text-emerald-400 mb-4">
              PRICING
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Start free. Upgrade when you need more. Cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8">
              <div className="mb-6">
                <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                  Free
                </span>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-5xl font-black text-white">$0</span>
                  <span className="text-slate-500">/mo</span>
                </div>
                <p className="text-slate-400 text-sm mt-2">
                  Perfect for solo operators getting started.
                </p>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Up to 5 delivery jobs",
                  "Digital signature capture",
                  "Delivery photo proof",
                  "Shareable job links",
                  "Powered by SignOff branding",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-slate-300"
                  >
                    <svg
                      className="h-5 w-5 text-emerald-500 shrink-0 mt-px"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/signin"
                className="block w-full h-12 rounded-xl border border-slate-700 bg-slate-800 font-bold text-white text-sm text-center leading-12 hover:bg-slate-700 transition-colors"
              >
                Get Started Free
              </Link>
            </div>

            {/* Premium */}
            <div className="relative rounded-2xl border border-indigo-500/40 bg-linear-to-br from-indigo-950/60 to-violet-950/40 p-8 shadow-xl shadow-indigo-500/10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-indigo-500 to-violet-500 px-4 py-1 text-xs font-bold text-white shadow-lg">
                  👑 MOST POPULAR
                </span>
              </div>
              <div className="mb-6">
                <span className="text-sm font-semibold text-indigo-300 uppercase tracking-wider">
                  Premium
                </span>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-5xl font-black text-white">$15</span>
                  <span className="text-slate-400">/mo</span>
                </div>
                <p className="text-slate-400 text-sm mt-2">
                  For growing logistics teams with real volume.
                </p>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Unlimited delivery jobs",
                  "Everything in Free",
                  "Custom company branding",
                  "White-label sign-off pages",
                  "Custom logo upload",
                  "Remove SignOff watermark",
                  "Priority support",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-slate-200"
                  >
                    <svg
                      className="h-5 w-5 text-indigo-400 shrink-0 mt-px"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/signin"
                className="block w-full h-12 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 font-bold text-white text-sm text-center leading-12 hover:from-indigo-500 hover:to-violet-500 transition-all shadow-lg"
              >
                Upgrade to Premium →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 border-t border-slate-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-3xl border border-indigo-500/20 bg-linear-to-br from-indigo-950/60 to-violet-950/40 p-12 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Ready to eliminate delivery disputes?
              </h2>
              <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                Join hundreds of logistics operators who use SignOff to protect
                their business, one delivery at a time.
              </p>
              <Link
                href="/auth/signin"
                className="inline-flex h-14 items-center justify-center rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 px-10 text-base font-bold text-white shadow-xl shadow-indigo-600/25 hover:from-indigo-500 hover:to-violet-500 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Get Started Free — No Credit Card Required
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
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
              <a
                href="#how-it-works"
                className="hover:text-white transition-colors"
              >
                How It Works
              </a>
              <a
                href="#features"
                className="hover:text-white transition-colors"
              >
                Features
              </a>
              <a href="#pricing" className="hover:text-white transition-colors">
                Pricing
              </a>
              <Link
                href="/auth/signin"
                className="hover:text-white transition-colors"
              >
                Sign In
              </Link>
            </nav>
            <p className="text-xs text-slate-600">
              © {new Date().getFullYear()} SignOff. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
