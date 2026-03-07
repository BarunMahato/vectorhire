"use client";

import { signIn } from "@/lib/auth-client";

import Link from "next/link";

export default function AuthPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-8 border border-slate-100">
        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200 mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L13 4V10L7 13L1 10V4L7 1Z" stroke="white" strokeWidth="1.5" fill="none"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome to VectorHire</h1>
          <p className="text-slate-500 mt-2">The future of autonomous job hunting</p>
        </div>

        <button
          onClick={async () => {
          await signIn.social({
            provider: "google",
            callbackURL: "/onboarding", 
          });
        }}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold py-4 px-6 rounded-2xl transition-all active:scale-[0.98]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-xs text-slate-400 mt-8 px-6 leading-relaxed">
          By continuing, you agree to VectorHire&apos;s 
          <Link href="#" className="underline hover:text-slate-600 ml-1">Terms of Service</Link> and 
          <Link href="#" className="underline hover:text-slate-600 ml-1">Privacy Policy</Link>.
        </p>
      </div>
    </main>
  );
}