import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { SettingsForm } from "@/components/SettingsForm";

export const metadata = {
  title: "Settings | SignOff",
};

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/api/auth/signin");

  const userId = (session.user as any).id;
  const isPremium = (session.user as any).isPremium;

  // Fetch current user settings
  const result = await db.query(`SELECT business_name, image, company_logo FROM users WHERE id = $1`, [userId]);
  const user = result.rows[0];

  async function updateSettingsAction(formData: FormData) {
    "use server";
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized");
    
    const avatarUrl = formData.get("avatarUrl") as string;
    
    // Safety check - verify premium status on backend for branding fields
    if (!(session.user as any).isPremium) {
      // Free users can only update avatar
      await db.query(
        `UPDATE users SET image = $1 WHERE id = $2`,
        [avatarUrl || null, (session.user as any).id]
      );
    } else {
      // Premium users can update everything
      const businessName = formData.get("businessName") as string;
      const logoUrl = formData.get("logoUrl") as string;
      
      await db.query(
        `UPDATE users SET business_name = $1, company_logo = $2, image = $3 WHERE id = $4`,
        [businessName || null, logoUrl || null, avatarUrl || null, (session.user as any).id]
      );
    }
    
    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");
    // Also revalidate all jobs for this user, but in Next.js app router we can't easily revalidate dynamic segments by id without tracking them, so we just let standard caching rules apply.
  }

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100">
      <header className="sticky top-0 z-40 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8 gap-4">
          <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <span className="text-lg font-bold tracking-tight text-white">
            Settings & Branding
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8 shadow-xl">
          <div className="mb-8 border-b border-slate-800 pb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">⚙️</span> Account Settings
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Manage your personal profile and white-label branding settings.
            </p>
          </div>

          <SettingsForm 
            initialBusinessName={user.business_name || ""}
            initialLogoUrl={user.company_logo || ""}
            initialAvatarUrl={user.image || ""}
            isPremium={isPremium}
            updateSettingsAction={updateSettingsAction}
          />
        </div>
      </main>
    </div>
  );
}
