"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { confirmGCashPayment } from "@/app/actions/gcash";

export function GCashUpgradeCard() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 text-center">
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="mx-auto mb-6 grid h-80 w-80 place-items-center overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 p-4 shadow-inner shadow-slate-900/40 sm:h-96 sm:w-96 transition hover:border-indigo-500"
      >
        <Image
          src="/gcash-qr.jpeg"
          alt="GCash QR Code"
          width={640}
          height={640}
          className="h-full w-full object-contain"
        />
      </button>

      <div className="space-y-4 text-left">
        <div>
          <h2 className="text-lg font-bold text-white">Payment Details</h2>
          <p className="text-slate-400">Amount: <span className="font-semibold text-white">₱850</span></p>
          <p className="text-slate-400">Payment method: <span className="font-semibold text-white">GCash QR</span></p>
        </div>
        <div className="rounded-2xl bg-slate-900/70 p-4 text-sm text-slate-300 border border-slate-800">
          <p className="font-semibold text-white mb-2">Next steps</p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Open GCash and scan the QR code above.</li>
            <li>Send exactly ₱850 with your name or email in the notes.</li>
            <li>Return to this page and click "I have paid".</li>
            <li>We will verify your payment and upgrade your account.</li>
          </ol>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/dashboard"
          className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 px-6 text-sm font-semibold text-white hover:bg-slate-700 transition-colors"
        >
          Back to Dashboard
        </Link>
        <form action={confirmGCashPayment} className="w-full sm:w-auto">
          <button
            type="submit"
            className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
          >
            I have paid
          </button>
        </form>
      </div>

      {showModal && (
        <dialog open className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <div className="relative w-full max-w-3xl rounded-3xl bg-slate-950 p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 rounded-full bg-slate-800 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700"
            >
              Close
            </button>
            <div className="mx-auto mt-4 h-[min(90vh,720px)] w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-inner shadow-slate-900/40">
              <Image
                src="/gcash-qr.jpeg"
                alt="GCash QR Code"
                width={1024}
                height={1024}
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
