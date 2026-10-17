"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { loginAction, AuthActionResult } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Lock, ShieldCheck, ArrowLeft, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState<AuthActionResult | null, FormData>(
    loginAction,
    null
  );

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
          <div className="w-10 h-10 rounded-xl bg-[#006061] flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:bg-[#004d4e] transition-colors">
            KS
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            KRAFT SURGICALS
          </span>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Administrator Portal
        </h1>
        <p className="mt-1.5 text-xs text-slate-400">
          Sign in to manage surgical catalogue, categories, and technical specifications.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-slate-900 py-8 px-6 sm:px-8 shadow-2xl rounded-2xl border border-slate-800 space-y-6">
          {state && !state.success && (
            <div className="p-3.5 bg-red-950/80 border border-red-800 rounded-xl flex items-start gap-2.5 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{state.error}</span>
            </div>
          )}

          <form action={formAction} className="space-y-4">
            <Input
              label="Admin Email Address"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="admin@kraftsurgicals.in"
              className="bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:bg-slate-800 focus:border-[#006061]"
            />

            <Input
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••••••"
              className="bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:bg-slate-800 focus:border-[#006061]"
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isPending}
                className="w-full bg-[#006061] hover:bg-[#004d4e] text-white font-bold shadow-md cursor-pointer"
              >
                <Lock className="w-4 h-4 mr-2" />
                <span>Sign In to Console</span>
              </Button>
            </div>
          </form>

          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>Role-Based Access Control (RBAC)</span>
            </div>
            <p>
              Access is restricted to authorized personnel. Non-admin accounts and unauthenticated visitors cannot access administrative routes or perform mutations.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Catalogue</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
