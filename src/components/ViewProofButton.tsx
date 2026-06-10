"use client";

import { useState } from "react";
import Image from "next/image";

interface ViewProofButtonProps {
  clientName: string;
  jobDescription: string;
  signaturePhotoUrl: string | null;
  deliveryPhotoUrl: string | null;
  signedAt: Date | null;
}

export function ViewProofButton({
  clientName,
  jobDescription,
  signaturePhotoUrl,
  deliveryPhotoUrl,
  signedAt,
}: ViewProofButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex h-12 w-12 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-600/10 text-indigo-400 transition-colors hover:bg-indigo-600 hover:text-white"
        title="View delivery proof and client signature"
        aria-label="View delivery proof and client signature"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md px-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Background Glow Container (strictly clipped to prevent scrollbar triggering) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
              <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />
              <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />
            </div>

            <div className="relative">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-6">
                <div>
                  <h2 className="text-xl font-black text-white">
                    Delivery Proof
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Client:{" "}
                    <span className="text-slate-200 font-semibold">
                      {clientName}
                    </span>
                    {signedAt && (
                      <>
                        {" • "}
                        <span>
                          Signed: {new Date(signedAt).toLocaleString()}
                        </span>
                      </>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-white transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Job Description
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/50 rounded-xl p-3 border border-slate-900">
                  {jobDescription}
                </p>
              </div>

              {/* Images Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Delivery Photo */}
                <div className="flex flex-col">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                    <span>📸</span> Rider Photo
                  </h4>
                  <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900 flex items-center justify-center">
                    {deliveryPhotoUrl ? (
                      <Image
                        src={deliveryPhotoUrl}
                        alt="Proof of Delivery Photo"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-6 text-center">
                        <span className="text-2xl mb-2">📭</span>
                        <span className="text-xs text-slate-500 font-semibold">
                          No rider photo uploaded
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Signature Photo */}
                <div className="flex flex-col">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                    <span>✍️</span> Client Signature
                  </h4>
                  <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl border border-slate-800 bg-white flex items-center justify-center p-4">
                    {signaturePhotoUrl ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={signaturePhotoUrl}
                          alt="Client Signature"
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">
                        No Signature Image
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 px-6 py-2.5 text-sm font-semibold text-white transition-colors"
                >
                  Close Proof
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
