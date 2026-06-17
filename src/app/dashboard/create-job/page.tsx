import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SubmitButton } from "@/components/SubmitButton";
import { requestGCashUpgrade } from "@/app/actions/gcash";

export const metadata = {
  title: "Create Delivery Job | SignOff",
};

export default async function CreateJobPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const userId = (session.user as any).id;
  const isPremium = (session.user as any).isPremium;

  // Enforce Free Tier Limits (Max 5 Jobs)
  const jobCountRes = await db.query(`SELECT count(*) as count FROM jobs WHERE user_id = $1`, [userId]);
  const jobCount = parseInt(jobCountRes.rows[0].count);
  const limitReached = !isPremium && jobCount >= 5;

  // Inline Server Action for form submission
  async function createJob(formData: FormData) {
    "use server";
    
    // Ensure the session is still valid during the action execution
    const activeSession = await getServerSession(authOptions);
    if (!activeSession?.user) {
      throw new Error("Unauthorized");
    }

    const currentUserId = (activeSession.user as any).id;
    const currentIsPremium = (activeSession.user as any).isPremium;

    // Server-side strict limit check
    if (!currentIsPremium) {
      const currentCountRes = await db.query(`SELECT count(*) as count FROM jobs WHERE user_id = $1`, [currentUserId]);
      if (parseInt(currentCountRes.rows[0].count) >= 5) {
        throw new Error("Free tier limit reached. Please upgrade to premium.");
      }
    }

    const clientName = formData.get("clientName") as string;
    const clientEmail = formData.get("clientEmail") as string;
    const description = formData.get("description") as string;

    if (!clientName || !clientEmail || !description) return;

    // Insert into Neon Database
    await db.query(
      `INSERT INTO jobs (user_id, client_name, client_email, job_description)
       VALUES ($1, $2, $3, $4)`,
      [currentUserId, clientName, clientEmail, description]
    );

    // Refresh dashboard data and navigate back
    revalidatePath("/dashboard");
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12 sm:px-6 lg:px-8 font-sans text-slate-100">
      <div className="mx-auto max-w-lg">
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">New Job</h1>
            <p className="mt-2 text-sm text-slate-400">Dispatch a new delivery task and capture a signature.</p>
          </div>
          <Link
            href="/dashboard"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors border border-slate-800"
            aria-label="Back to Dashboard"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.182a.75.75 0 010-1.08l3.5-3.182a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>

        {/* Form Card or Limit Reached Banner */}
        {limitReached ? (
          <div className="overflow-hidden rounded-2xl border border-rose-900/30 bg-rose-950/20 p-8 text-center shadow-2xl backdrop-blur-md">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/20 mb-4 text-3xl">
              🔒
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Job Limit Reached</h2>
            <p className="text-slate-400 mb-6">
              You've reached the maximum of 5 free jobs allowed on the basic plan. 
              Upgrade to premium to unlock unlimited deliveries and advanced features.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row justify-center">
              <Link
                href="/dashboard"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 px-6 font-semibold text-white transition-colors hover:bg-slate-700"
              >
                Back to Dashboard
              </Link>
              
              <form action={requestGCashUpgrade}>
                <button type="submit" className="inline-flex h-11 w-full sm:w-auto items-center justify-center rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 px-6 font-bold text-white shadow-lg hover:from-indigo-400 hover:to-purple-500 transition-all">
                  Upgrade to Premium
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
            <form action={createJob} className="space-y-6">
              
              {/* Client Name */}
              <div>
                <label htmlFor="clientName" className="block text-sm font-semibold leading-6 text-slate-300">
                  Client Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="clientName"
                    id="clientName"
                    required
                    placeholder="e.g. Acme Corp"
                    className="block w-full rounded-xl border-0 bg-slate-950 py-3 px-4 text-white shadow-sm ring-1 ring-inset ring-slate-800 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 transition-all"
                  />
                </div>
              </div>

              {/* Client Email */}
              <div>
                <label htmlFor="clientEmail" className="block text-sm font-semibold leading-6 text-slate-300">
                  Client Email
                </label>
                <div className="mt-2">
                  <input
                    type="email"
                    name="clientEmail"
                    id="clientEmail"
                    required
                    placeholder="contact@acme.com"
                    className="block w-full rounded-xl border-0 bg-slate-950 py-3 px-4 text-white shadow-sm ring-1 ring-inset ring-slate-800 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 transition-all"
                  />
                </div>
              </div>

              {/* Job Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-semibold leading-6 text-slate-300">
                  Job Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    required
                    placeholder="Describe the items being delivered or tasks to be signed off..."
                    className="block w-full rounded-xl border-0 bg-slate-950 py-3 px-4 text-white shadow-sm ring-1 ring-inset ring-slate-800 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Submit Actions */}
              <div className="pt-4 flex items-center justify-end gap-x-4 border-t border-slate-800/60">
                <Link
                  href="/dashboard"
                  className="text-sm font-semibold leading-6 text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </Link>
                <SubmitButton label="Create & Dispatch" className="w-full sm:w-auto" />
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
