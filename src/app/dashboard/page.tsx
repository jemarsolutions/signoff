import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { redirect } from "next/navigation";
import { JobRow } from "@/components/JobRow";
import { UserMenu } from "@/components/UserMenu";
import { CreateJobButton } from "@/components/CreateJobButton";
import { requestGCashUpgrade } from "@/app/actions/gcash";
import { isAdminEmail } from "@/lib/admin";
import Link from "next/link";

export const metadata = {
  title: "Dashboard | SignOff",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const userId = (session.user as any).id;
  const premiumUntilString = (session.user as any).premiumUntil as string | null;
  const premiumUntil = premiumUntilString ? new Date(premiumUntilString) : null;
  const isPremium = premiumUntil ? premiumUntil > new Date() : (session.user as any).isPremium;
  const premiumDaysLeft = premiumUntil ? Math.max(0, Math.ceil((premiumUntil.getTime() - Date.now()) / 86400000)) : 0;
  const isRenewalWindow = premiumUntil ? premiumDaysLeft <= 7 : false;
  const isAdmin = isAdminEmail(session.user.email);
  const userName = session.user.name || session.user.email?.split("@")[0] || "User";

  // Fetch ONLY non-deleted jobs for the UI
  const result = await db.query(
    `SELECT * FROM jobs WHERE user_id = $1 AND is_deleted = false ORDER BY created_at DESC`,
    [userId]
  );
  
  const jobs = result.rows;
  const pendingJobs = jobs.filter((j) => j.status === "pending").length;
  const completedJobs = jobs.filter((j) => j.status === "completed").length;
  
  // Calculate historical total jobs (including deleted ones) to enforce the true 5-job limit
  const countResult = await db.query(`SELECT count(*) as count FROM jobs WHERE user_id = $1`, [userId]);
  const historicalTotalJobs = parseInt(countResult.rows[0].count);
  const limitReached = !isPremium && historicalTotalJobs >= 5;

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 shrink-0 transition-opacity hover:opacity-80">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-tr from-indigo-500 to-violet-500 font-bold text-white shadow-lg shadow-indigo-500/20 text-lg">
              ✓
            </span>
            <span className="text-xl font-black tracking-tight bg-linear-to-r from-white to-indigo-300 bg-clip-text text-transparent">
              SignOff
            </span>
          </Link>
          <div className="flex items-center gap-4">
            {isPremium ? (
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-indigo-500/10 to-purple-500/10 px-3 py-1 text-xs font-bold text-indigo-300 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                <span className="text-amber-400 text-[10px]">👑</span> Premium
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center rounded-full bg-pink-500/10 px-3 py-1 text-xs font-semibold text-pink-400 border border-pink-500/20">
                Free Plan
              </span>
            )}
            {isAdmin ? (
              <Link
                href="/dashboard/admin/gcash-requests"
                className="hidden sm:inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition"
              >
                Admin Review
              </Link>
            ) : null}
            <UserMenu 
              userName={userName} 
              userImage={session.user.image || null} 
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Welcome back, {userName}
            </h1>
            <p className="mt-2 text-base text-slate-400">
              Track your deliveries, manage field operations, and collect signatures.
            </p>
          </div>
          <CreateJobButton limitReached={limitReached} />
        </div>

        {/* Stats Grid */}
        <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-sm">
            <div className="text-sm font-semibold tracking-wider text-slate-500 uppercase">
              {isPremium ? "Total Jobs" : "Total Jobs (Free Tier)"}
            </div>
            <div className="mt-2 text-3xl font-black text-white">
              {isPremium ? jobs.length : `${historicalTotalJobs} / 5`}
            </div>
          </div>
          <div className="rounded-2xl border border-amber-900/30 bg-amber-900/10 p-6 shadow-sm">
            <div className="text-sm font-semibold tracking-wider text-amber-500/70 uppercase">Pending Delivery</div>
            <div className="mt-2 text-3xl font-black text-amber-400">{pendingJobs}</div>
          </div>
          <div className="rounded-2xl border border-emerald-900/30 bg-emerald-900/10 p-6 shadow-sm">
            <div className="text-sm font-semibold tracking-wider text-emerald-500/70 uppercase">Completed</div>
            <div className="mt-2 text-3xl font-black text-emerald-400">{completedJobs}</div>
          </div>
        </div>

        {isPremium && premiumUntil ? (
          <div className="mb-12 rounded-2xl border border-emerald-500/20 bg-emerald-900/10 p-6 shadow-xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300/80">Premium Status</p>
                <h2 className="mt-2 text-2xl font-black text-white">Premium active until {premiumUntil.toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" })}</h2>
                <p className="mt-2 text-sm text-emerald-200/80">
                  {premiumDaysLeft > 0 ? `${premiumDaysLeft} day${premiumDaysLeft === 1 ? "" : "s"} left` : "Expires today"}.
                </p>
              </div>
              {isRenewalWindow ? (
                <form action={requestGCashUpgrade} className="w-full sm:w-auto">
                  <button type="submit" className="inline-flex h-12 rounded-xl bg-white px-7 text-sm font-black text-indigo-950 shadow-lg hover:bg-indigo-50 transition-all w-full sm:w-auto">
                    Renew in advance
                  </button>
                </form>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="mb-12 overflow-hidden rounded-2xl bg-linear-to-r from-indigo-900/40 to-violet-900/40 border border-indigo-500/20 relative shadow-xl">
            <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-purple-600 opacity-20 blur-xl"></div>
            <div className="relative p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 backdrop-blur-sm">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🚀</span>
                  <h3 className="text-xl font-bold text-white">Upgrade to Premium</h3>
                  <span className="rounded-full bg-indigo-500/20 border border-indigo-400/30 px-2.5 py-0.5 text-xs font-bold text-indigo-300">
                    ₱850/mo
                  </span>
                </div>
                <p className="mt-2 text-sm text-indigo-200/90 max-w-2xl leading-relaxed">
                  You are currently on the free tier (limited to 5 jobs). Upgrade today to unlock:
                </p>
                <ul className="mt-3 flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm font-medium text-indigo-200/80">
                  <li className="flex items-center gap-2"><svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg> Unlimited Delivery Jobs</li>
                  <li className="flex items-center gap-2"><svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg> Custom Branding</li>
                  <li className="flex items-center gap-2"><svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg> Priority Support</li>
                </ul>
              </div>
              
              <form action={requestGCashUpgrade} className="w-full lg:w-auto">
                <button type="submit" className="whitespace-nowrap rounded-xl bg-white text-indigo-950 px-8 py-3.5 text-sm font-black shadow-lg hover:bg-indigo-50 hover:scale-[1.02] active:scale-[0.98] transition-all w-full lg:w-auto">
                  Subscribe Now
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Jobs List Section */}
        <div>
          <h2 className="mb-6 text-xl font-bold text-white border-b border-slate-800 pb-4">Recent Deliveries</h2>
          
          {jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/20 py-24 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 mb-4">
                <svg className="h-8 w-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">No jobs found</h3>
              <p className="mt-1 text-slate-400 mb-6">Get started by creating your first delivery task.</p>
              <Link
                href="/dashboard/create-job"
                className="inline-flex items-center justify-center rounded-xl bg-slate-800 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700 transition-colors"
              >
                Create Job
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {jobs.map((job) => (
                <JobRow key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
