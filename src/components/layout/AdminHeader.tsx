"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";
import { ExternalLink, LogOut, ShieldCheck, User } from "lucide-react";

interface AdminHeaderProps {
  userEmail?: string;
}

export function AdminHeader({ userEmail }: AdminHeaderProps) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/admin/products" className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#006061] flex items-center justify-center font-bold text-sm text-white">
                KS
              </span>
              <span className="font-bold tracking-tight text-base sm:text-lg">
                Kraft Surgicals Admin Console
              </span>
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              Authorized Administrator
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="hidden md:flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Live Catalogue</span>
            </Link>

            <div className="flex items-center gap-2 text-xs text-slate-300 border-l border-slate-800 pl-4">
              <User className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline max-w-[160px] truncate">
                {userEmail || "Admin User"}
              </span>
            </div>

            <button
              onClick={handleLogout}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-300 hover:text-white hover:bg-red-950/60 border border-red-900/50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isPending ? "Signing out..." : "Sign Out"}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
