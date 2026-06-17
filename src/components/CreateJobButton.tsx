"use client";

import { useState } from "react";
import Link from "next/link";
import { requestGCashUpgrade } from "@/app/actions/gcash";

interface CreateJobButtonProps {
  limitReached: boolean;
}

export function CreateJobButton({ limitReached }: CreateJobButtonProps) {
  const [showModal, setShowModal] = useState(false);

  // If they have room on the free tier (or are premium), just go to the create page
  if (!limitReached) {
    return (
      <Link
        href="/dashboard/create-job"
        className="inline-flex h-12 items-center justify-center rounded-xl bg-indigo-600 px-6 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        + Create New Job
      </Link>
    );
  }

  // If they hit the limit, show the premium upsell modal
  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex h-12 items-center justify-center rounded-xl bg-indigo-600 px-6 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        + Create New Job
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-rose-900/30 bg-slate-950 p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-rose-500/20 blur-3xl" />
            
            <div className="relative">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 mb-6 text-3xl ring-4 ring-rose-500/20">
                🔒
              </div>
              <h2 className="text-2xl font-black text-white mb-2 text-center">Free Tier Limit Reached</h2>
              <p className="text-slate-400 mb-8 text-center text-sm leading-relaxed">
                You've used all 5 free jobs on your account. Upgrade to the Premium tier to instantly unlock unlimited deliveries, priority support, and custom branding for your clients.
              </p>
              
              <div className="flex flex-col gap-3">
                <form action={requestGCashUpgrade} className="w-full">
                  <button type="submit" className="w-full h-12 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 font-bold text-white shadow-lg hover:from-indigo-400 hover:to-purple-500 transition-all">
                    Upgrade to Premium — ₱850/mo
                  </button>
                </form>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full h-12 rounded-xl border border-slate-700 bg-transparent font-semibold text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
