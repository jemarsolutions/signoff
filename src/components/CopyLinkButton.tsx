"use client";

import { useState } from "react";

export function CopyLinkButton({ jobId }: { jobId: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    // Construct the absolute URL
    const url = `${window.location.origin}/dashboard/jobs/${jobId}`;
    
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all border w-full sm:w-auto ${
        copied
          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
          : "bg-slate-800/50 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white"
      }`}
      title="Copy Link for Driver"
    >
      {copied ? (
        <>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy Link
        </>
      )}
    </button>
  );
}
