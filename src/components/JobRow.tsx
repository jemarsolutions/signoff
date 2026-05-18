import Link from "next/link";
import Image from "next/image";
import { db } from "@/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CopyLinkButton } from "@/components/CopyLinkButton";

interface JobRowProps {
  job: {
    id: string;
    client_name: string;
    client_email: string;
    job_description: string;
    status: "pending" | "completed";
    signature_photo_url: string | null;
    created_at: Date;
    signed_at: Date | null;
  };
}

export async function JobRow({ job }: JobRowProps) {
  const isCompleted = job.status === "completed";

  async function deleteJob() {
    "use server";
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized");
    
    // Perform a SOFT DELETE so the job is hidden from the dashboard,
    // but the backend still counts it toward their historical 5-job free tier limit.
    await db.query(
      `UPDATE jobs SET is_deleted = true WHERE id = $1 AND user_id = $2 AND status = 'completed'`, 
      [job.id, (session.user as any).id]
    );
    
    revalidatePath("/dashboard");
  }

  return (
    <div className="group relative flex flex-col justify-between gap-x-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-md transition-all hover:bg-slate-800/80 sm:flex-row sm:items-center overflow-hidden">
      <div className="flex-1">
        <div className="flex items-center gap-x-3">
          <h3 className="text-lg font-bold text-white">{job.client_name}</h3>
          {isCompleted ? (
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              Completed
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400 border border-amber-500/20">
              Pending
            </span>
          )}
        </div>
        <div className="mt-2 text-sm text-slate-400 line-clamp-2 max-w-2xl">
          {job.job_description}
        </div>
        <div className="mt-4 flex items-center gap-x-4 text-xs text-slate-500">
          <span className="font-medium">{job.client_email}</span>
          <span>&bull;</span>
          <span>Created {new Date(job.created_at).toLocaleDateString()}</span>
          {isCompleted && job.signed_at && (
            <>
              <span>&bull;</span>
              <span className="text-emerald-500/70">Signed {new Date(job.signed_at).toLocaleString()}</span>
            </>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-x-4 sm:mt-0 sm:flex-col sm:items-end gap-y-3">
        {isCompleted ? (
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-32 overflow-hidden rounded-lg border border-slate-700 bg-white/5 p-1">
              {job.signature_photo_url ? (
                <Image 
                  src={job.signature_photo_url} 
                  alt="Client Signature" 
                  fill 
                  className="object-contain p-1 invert" 
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-xs text-slate-500">No Image</span>
              )}
            </div>
            
            {/* Delete Button */}
            <form action={deleteJob}>
              <button 
                type="submit" 
                className="flex h-12 w-12 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-400 transition-colors hover:bg-rose-500 hover:text-white"
                title="Delete completed job"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <Link
              href={`/dashboard/jobs/${job.id}`}
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600/10 px-4 py-2 text-sm font-semibold text-indigo-400 border border-indigo-500/20 hover:bg-indigo-600/20 transition-colors w-full sm:w-auto"
            >
              Open View
            </Link>
            <CopyLinkButton jobId={job.id} />
          </div>
        )}
      </div>
    </div>
  );
}
