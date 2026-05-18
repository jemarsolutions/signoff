"use client";

import { useState, useEffect } from "react";

const steps = [
  { id: 0, label: "Dashboard", sublabel: "Owner manages all deliveries" },
  { id: 1, label: "Create a Job", sublabel: "Fill in client & delivery details" },
  { id: 2, label: "Driver Uploads Photo", sublabel: "Proof-of-delivery captured" },
  { id: 3, label: "Client Signs", sublabel: "Signature drawn on their phone" },
  { id: 4, label: "Delivery Confirmed", sublabel: "Tamper-proof record stored" },
];

export function DemoAnimation() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [signProgress, setSignProgress] = useState(0);
  const [typed, setTyped] = useState("");
  const clientName = "Acme Corporation";

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setStep((s) => (s + 1) % steps.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Typing animation for step 1
  useEffect(() => {
    if (step !== 1) { setTyped(""); return; }
    let i = 0;
    const t = setInterval(() => {
      i++;
      setTyped(clientName.slice(0, i));
      if (i >= clientName.length) clearInterval(t);
    }, 60);
    return () => clearInterval(t);
  }, [step]);

  // Signature draw animation for step 3
  useEffect(() => {
    if (step !== 3) { setSignProgress(0); return; }
    const t = setInterval(() => setSignProgress((p) => Math.min(p + 3, 100)), 40);
    return () => clearInterval(t);
  }, [step]);

  return (
    <div className="rounded-[28px] border border-slate-700/60 bg-slate-900 shadow-2xl shadow-black/40 overflow-hidden">
      {/* Phone notch bar */}
      <div className="flex items-center justify-between bg-slate-950 px-5 pt-3 pb-2">
        <span className="text-[10px] font-semibold text-slate-500">9:41</span>
        <div className="h-3 w-16 rounded-full bg-slate-800 mx-auto" />
        <div className="flex gap-1 items-center">
          <svg className="h-3 w-3 text-slate-500" fill="currentColor" viewBox="0 0 24 24"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>
          <svg className="h-3 w-3 text-slate-500" fill="currentColor" viewBox="0 0 24 24"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/></svg>
        </div>
      </div>

      {/* App header */}
      <div className="flex items-center gap-2.5 px-4 py-3 bg-slate-950 border-b border-slate-800/60">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 text-white text-sm font-bold shrink-0">✓</span>
        <span className="font-black text-white text-sm tracking-tight">SignOff</span>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5">LIVE</span>
          <div className="h-7 w-7 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white">J</div>
        </div>
      </div>

      {/* Screen content */}
      <div className="relative overflow-hidden bg-slate-950" style={{ minHeight: 360 }}>

        {/* ── STEP 0: Dashboard ── */}
        <div className={`absolute inset-0 p-4 transition-all duration-500 ${step === 0 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"}`}>
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-3">Your Deliveries</p>
          <div className="space-y-2">
            {[
              { name: "Acme Corp", status: "pending", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
              { name: "GlobalTech Ltd", status: "completed", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
              { name: "Nexus Warehousing", status: "completed", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
            ].map((job) => (
              <div key={job.name} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5">
                <div>
                  <p className="text-xs font-semibold text-white">{job.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Delivery job</p>
                </div>
                <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 border ${job.color}`}>{job.status.toUpperCase()}</span>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-2.5 text-xs font-bold text-white">+ Create New Job</button>
        </div>

        {/* ── STEP 1: Create Job ── */}
        <div className={`absolute inset-0 p-4 transition-all duration-500 ${step === 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"}`}>
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-3">New Delivery Job</p>
          <div className="space-y-2.5">
            <div>
              <label className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Client Name</label>
              <div className="mt-1 rounded-lg border border-indigo-500/50 bg-slate-800/60 px-3 py-2 flex items-center gap-1">
                <span className="text-xs text-white">{typed}</span>
                <span className="h-3.5 w-0.5 bg-indigo-400 animate-pulse" />
              </div>
            </div>
            <div>
              <label className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Client Email</label>
              <div className="mt-1 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2">
                <span className="text-xs text-slate-400">ops@acme.com</span>
              </div>
            </div>
            <div>
              <label className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Job Description</label>
              <div className="mt-1 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2">
                <span className="text-xs text-slate-400">12x Server Racks, Warehouse B Gate 4</span>
              </div>
            </div>
            <button className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-2.5 text-xs font-bold text-white mt-1">
              Create Job & Share Link →
            </button>
          </div>
        </div>

        {/* ── STEP 2: Driver Photo ── */}
        <div className={`absolute inset-0 p-4 transition-all duration-500 ${step === 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"}`}>
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Step 1 of 2</p>
          <p className="text-sm font-bold text-white mb-3">Upload Delivery Photo</p>
          {/* Fake photo */}
          <div className="rounded-xl overflow-hidden mb-3 relative bg-slate-800" style={{ height: 160 }}>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-5xl mb-2">📦</div>
              <p className="text-[10px] text-slate-400">Package at Warehouse B, Gate 4</p>
            </div>
            {/* Photo overlay chrome */}
            <div className="absolute top-2 left-2 bg-black/50 rounded-md px-2 py-0.5 flex items-center gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[9px] text-white font-bold">LIVE</span>
            </div>
            <div className="absolute bottom-2 right-2 bg-emerald-500 rounded-full h-6 w-6 flex items-center justify-center shadow-lg">
              <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
          </div>
          <button className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white">Photo Confirmed ✓ — Next Step →</button>
        </div>

        {/* ── STEP 3: Signature ── */}
        <div className={`absolute inset-0 p-4 transition-all duration-500 ${step === 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"}`}>
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Step 2 of 2</p>
          <p className="text-sm font-bold text-white mb-3">Client Signature</p>
          <div className="rounded-xl bg-white p-3 mb-3 relative" style={{ height: 130 }}>
            <p className="text-[9px] text-slate-400 mb-1">Sign in the box below</p>
            <svg viewBox="0 0 220 80" className="w-full" style={{ height: 80 }}>
              <path
                d="M15,55 C25,25 40,20 55,45 C65,60 75,65 90,40 C105,18 115,15 130,38 C142,56 152,60 165,38 C175,22 185,18 200,35"
                fill="none"
                stroke="#4f46e5"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="400"
                strokeDashoffset={400 - (signProgress / 100) * 400}
                style={{ transition: "stroke-dashoffset 0.05s linear" }}
              />
            </svg>
            {signProgress === 0 && (
              <p className="absolute inset-0 flex items-center justify-center text-[11px] text-slate-300 italic">Draw your signature here</p>
            )}
          </div>
          <button className={`w-full rounded-xl py-2.5 text-xs font-bold text-white transition-all duration-300 ${signProgress > 70 ? "bg-emerald-600 shadow-lg shadow-emerald-500/25" : "bg-slate-700"}`}>
            {signProgress > 70 ? "✓ Confirm Signature" : "Signing in progress..."}
          </button>
        </div>

        {/* ── STEP 4: Done ── */}
        <div className={`absolute inset-0 p-4 transition-all duration-500 ${step === 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"}`}>
          <div className="flex flex-col items-center justify-center text-center pt-6">
            <div className="h-16 w-16 rounded-full bg-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-500/30 mb-4 ring-4 ring-emerald-500/20">
              <svg className="h-9 w-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-base font-black text-white mb-1">Delivery Confirmed!</h3>
            <p className="text-[11px] text-slate-400 mb-5">Signed by John D. · Just now</p>
            <div className="w-full rounded-xl bg-slate-900 border border-slate-800 p-3 text-left space-y-2">
              {[["Job", "#2948 — Acme Corp"], ["Status", "✅ Completed"], ["Photo", "Stored securely"], ["Signed", "Just now"]].map(([l, v]) => (
                <div key={l} className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-500">{l}</span>
                  <span className="text-[10px] font-semibold text-white">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Step dots */}
      <div className="flex items-center justify-center gap-1.5 bg-slate-950 py-3 border-t border-slate-800/60">
        {steps.map((s) => (
          <button
            key={s.id}
            onClick={() => { setStep(s.id); setIsPlaying(false); }}
            title={s.label}
            className={`rounded-full transition-all duration-300 ${step === s.id ? "w-6 h-1.5 bg-indigo-500" : "w-1.5 h-1.5 bg-slate-700 hover:bg-slate-500"}`}
          />
        ))}
      </div>

      {/* Caption */}
      <div className="bg-slate-900/50 px-4 py-2.5 text-center border-t border-slate-800/40">
        <p className="text-[11px] font-bold text-white">{steps[step].label}</p>
        <p className="text-[10px] text-slate-500 mt-0.5">{steps[step].sublabel}</p>
      </div>
    </div>
  );
}
