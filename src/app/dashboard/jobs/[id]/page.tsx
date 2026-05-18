import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { SignOffFlow } from "@/components/SignOffFlow";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Field Sign-Off | SignOff",
};

export default async function JobSignOffPage({ params }: { params: Promise<{ id: string }> }) {
  // Next.js 15+ requires awaiting params
  const { id } = await params;

  // Fetch job details securely using the unguessable UUID
  const result = await db.query(
    `SELECT * FROM jobs WHERE id = $1`,
    [id]
  );
  
  const job = result.rows[0];
  
  if (!job) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center font-sans text-slate-100">
        <div className="rounded-full bg-red-500/10 p-4 mb-4 text-red-500">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-black mb-2">Job Not Found</h1>
        <p className="text-slate-400 mb-6 max-w-sm">This delivery might have been deleted, or the link is invalid.</p>
        <Link href="/" className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-md hover:bg-indigo-500">
          Return Home
        </Link>
      </div>
    );
  }

  // The inline Server Action that saves both photo and signature
  async function saveSignOff(photoUrl: string | null, signatureUrl: string) {
    "use server";
    
    // Check if the job was already completed to prevent overwrites
    const currentJobRes = await db.query(`SELECT status FROM jobs WHERE id = $1`, [id]);
    if (currentJobRes.rows[0]?.status === 'completed') {
      throw new Error("This delivery has already been signed off.");
    }

    // Update job status and store both URLs using just the unguessable UUID
    await db.query(
      `UPDATE jobs SET status = 'completed', delivery_photo_url = $1, signature_photo_url = $2, signed_at = current_timestamp WHERE id = $3`,
      [photoUrl, signatureUrl, id]
    );

    revalidatePath(`/dashboard/jobs/${id}`);
    revalidatePath("/dashboard");
  }

  const userResult = await db.query(
    `SELECT business_name, company_logo, is_premium FROM users WHERE id = $1`,
    [job.user_id]
  );
  const businessOwner = userResult.rows[0] || { is_premium: false };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 pb-12 sm:pb-0">
      {/* Mobile-friendly Top Navigation */}
      <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-900 bg-slate-950/80 px-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Delivery</span>
            <span className="text-sm font-semibold truncate max-w-[200px]">{job.client_name}</span>
          </div>
        </div>
        <div className="flex items-center">
          {job.status === 'completed' ? (
             <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-400">DONE</span>
          ) : (
             <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-400">PENDING</span>
          )}
        </div>
      </div>

      {/* Custom Branding Header */}
      {businessOwner.is_premium && (businessOwner.business_name || businessOwner.company_logo) ? (
        <div className="flex flex-col items-center justify-center py-8 gap-3 border-b border-slate-900 bg-slate-900/20 px-4">
          {businessOwner.company_logo && (
            <div className="relative h-16 w-48">
              <Image 
                src={businessOwner.company_logo} 
                alt={businessOwner.business_name || "Company Logo"} 
                fill 
                sizes="192px"
                className="object-contain drop-shadow-md" 
              />
            </div>
          )}
          {businessOwner.business_name && (
            <h1 className="text-2xl font-black text-white tracking-tight text-center">{businessOwner.business_name}</h1>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 gap-2 border-b border-slate-900 bg-slate-900/20">
           <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 font-bold text-white shadow-lg text-2xl">
              ✓
           </span>
           <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              SignOff
           </span>
        </div>
      )}

      <main className="mx-auto max-w-lg px-4 pt-8">
        {/* Job Details Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md shadow-xl mb-6">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Client Name</label>
              <div className="text-base font-semibold text-white">{job.client_name}</div>
            </div>
            <div>
              <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Client Email</label>
              <div className="text-sm font-medium text-slate-300">{job.client_email}</div>
            </div>
            <div>
              <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Task Description</label>
              <div className="text-sm leading-relaxed text-slate-300 mt-1 bg-slate-950 rounded-xl p-3 border border-slate-800">
                {job.job_description}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic State: Pending Signature vs Completed */}
        {job.status === 'completed' && job.signature_photo_url ? (
          <div className="rounded-2xl border border-emerald-900/30 bg-emerald-950/20 p-6 text-center shadow-inner space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 mb-2 shadow-lg shadow-emerald-500/20">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Delivery Completed</h2>
              <p className="text-sm text-slate-400">Signed on {new Date(job.signed_at).toLocaleString()}</p>
            </div>
            
            {job.delivery_photo_url && (
              <div className="bg-slate-900 rounded-xl overflow-hidden p-2 shadow-sm pointer-events-none border border-slate-800">
                <p className="text-xs text-slate-400 mb-2">Delivery Photo</p>
                <Image 
                  src={job.delivery_photo_url} 
                  alt="Delivery Photo" 
                  width={400} 
                  height={300}
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
            )}
            
            <div className="bg-white rounded-xl overflow-hidden p-2 shadow-sm pointer-events-none">
              <p className="text-xs text-slate-500 mb-1">Client Signature</p>
              <Image 
                src={job.signature_photo_url} 
                alt="Client Signature" 
                width={400} 
                height={200}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        ) : (
          <SignOffFlow jobId={id} onComplete={saveSignOff} />
        )}
      </main>

      {/* Powered by SignOff Watermark (Free Tier Only) */}
      {!businessOwner.is_premium && (
        <div className="mt-12 mb-8 flex justify-center opacity-40 hover:opacity-80 transition-opacity">
          <Link href="/" className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <span>Powered by</span>
            <span className="flex items-center gap-1 text-slate-300">
              <span className="flex h-4 w-4 items-center justify-center rounded bg-gradient-to-tr from-indigo-500 to-violet-500 text-[10px] text-white">✓</span>
              SignOff
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
