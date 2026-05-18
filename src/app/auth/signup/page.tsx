"use client";

import { useActionState } from "react";
import { registerUser } from "@/app/actions/register";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";

interface RegisterState {
  error?: string;
  success?: boolean;
}

const initialState: RegisterState = {};

export default function SignUpPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(registerUser, initialState);

  useEffect(() => {
    if (state?.success) {
      alert("Registration successful! Please sign in with your email and password.");
      router.push("/auth/signin");
    }
  }, [state, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 font-sans text-slate-100 relative overflow-hidden">
      {/* Background radial gradients */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_120%_at_50%_10px,#020617_40%,#1e1b4b_80%,#311042_100%)]" />
      <div className="absolute top-1/4 left-1/4 -z-10 h-96 w-96 rounded-full bg-indigo-500/10 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-96 w-96 rounded-full bg-violet-500/10 blur-[120px]" />

      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex justify-center mb-6">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 font-bold text-white shadow-lg shadow-indigo-500/30 text-xl">
              ✓
            </span>
          </Link>
          <h1 className="text-2xl font-black text-white">Create your account</h1>
          <p className="mt-2 text-sm text-slate-400">Get started with secure proof of delivery.</p>
        </div>

        {state?.error && (
          <div className="mb-6 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-center">
            <p className="text-xs font-semibold text-rose-400">{state.error}</p>
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Full Name
            </label>
            <div className="mt-1.5">
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="John Doe"
                className="block w-full rounded-xl border-0 bg-slate-950 py-3 px-4 text-white shadow-sm ring-1 ring-inset ring-slate-800 placeholder:text-slate-600 focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-all text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Email Address
            </label>
            <div className="mt-1.5">
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@company.com"
                className="block w-full rounded-xl border-0 bg-slate-950 py-3 px-4 text-white shadow-sm ring-1 ring-inset ring-slate-800 placeholder:text-slate-600 focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-all text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Password
            </label>
            <div className="mt-1.5">
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="block w-full rounded-xl border-0 bg-slate-950 py-3 px-4 text-white shadow-sm ring-1 ring-inset ring-slate-800 placeholder:text-slate-600 focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-all text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center rounded-xl bg-indigo-600 py-3.5 px-4 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 disabled:opacity-70 transition-all mt-6"
          >
            {isPending ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link href="/auth/signin" className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
