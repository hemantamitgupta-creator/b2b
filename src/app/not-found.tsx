import React from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Stethoscope } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-slate-50">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-xs">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Error 404
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Instrument Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            The requested surgical instrument does not exist, has been unpublished, or is currently restricted to authorized personnel.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold bg-sky-700 text-white hover:bg-sky-800 transition-colors shadow-xs"
          >
            <Stethoscope className="w-4 h-4" />
            <span>Browse Catalogue</span>
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
