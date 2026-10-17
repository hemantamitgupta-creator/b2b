"use client";

import React from "react";
import { Star, StarHalf } from "lucide-react";

export function ReviewsSection() {
  return (
    <section className="bg-slate-50 py-12 sm:py-16 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Ratings & Reviews
          </h2>
          <span className="text-xs font-bold text-[#006061] hover:underline cursor-pointer">
            View All 147 Reviews ›
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs">
          {/* Column 1: Rating summary */}
          <div className="md:col-span-3 text-center sm:text-left space-y-2 border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-6">
            <div className="flex items-baseline justify-center sm:justify-start gap-1">
              <span className="text-5xl font-black text-slate-900 tracking-tight">4.4</span>
              <span className="text-base font-semibold text-slate-400">/ 5</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-400">
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <StarHalf className="w-5 h-5 fill-current" />
            </div>
            <p className="text-xs text-slate-500 font-semibold">147 Verified Buyer Ratings</p>
          </div>

          {/* Column 2: Rating breakdown */}
          <div className="md:col-span-5 space-y-2 text-xs">
            {/* 5 star */}
            <div className="flex items-center gap-2">
              <span className="w-12 text-slate-600 font-medium shrink-0">5 Star</span>
              <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#16A34A] rounded-full" style={{ width: "67%" }} />
              </div>
              <span className="w-10 text-right text-slate-400 font-mono">(67%)</span>
            </div>

            {/* 4 star */}
            <div className="flex items-center gap-2">
              <span className="w-12 text-slate-600 font-medium shrink-0">4 Star</span>
              <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#22C55E] rounded-full" style={{ width: "14%" }} />
              </div>
              <span className="w-10 text-right text-slate-400 font-mono">(14%)</span>
            </div>

            {/* 3 star */}
            <div className="flex items-center gap-2">
              <span className="w-12 text-slate-600 font-medium shrink-0">3 Star</span>
              <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#EAB308] rounded-full" style={{ width: "4%" }} />
              </div>
              <span className="w-10 text-right text-slate-400 font-mono">(4%)</span>
            </div>

            {/* 2 star */}
            <div className="flex items-center gap-2">
              <span className="w-12 text-slate-600 font-medium shrink-0">2 Star</span>
              <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#F97316] rounded-full" style={{ width: "1%" }} />
              </div>
              <span className="w-10 text-right text-slate-400 font-mono">(1%)</span>
            </div>

            {/* 1 star */}
            <div className="flex items-center gap-2">
              <span className="w-12 text-slate-600 font-medium shrink-0">1 Star</span>
              <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-300 rounded-full" style={{ width: "14%" }} />
              </div>
              <span className="w-10 text-right text-slate-400 font-mono">(14%)</span>
            </div>
          </div>

          {/* Column 3: User Satisfaction circular gauges */}
          <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-6 text-center">
            <span className="text-xs font-bold text-slate-900 block mb-3 uppercase tracking-wider">
              User Satisfaction
            </span>
            <div className="flex items-center justify-center gap-4 sm:gap-6">
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full border-4 border-emerald-500 flex items-center justify-center font-extrabold text-sm text-slate-900">
                  87%
                </div>
                <span className="text-[10px] text-slate-500 font-medium mt-1">Quality</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full border-4 border-teal-600 flex items-center justify-center font-extrabold text-sm text-slate-900">
                  95%
                </div>
                <span className="text-[10px] text-slate-500 font-medium mt-1">Response</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full border-4 border-[#006061] flex items-center justify-center font-extrabold text-sm text-slate-900">
                  100%
                </div>
                <span className="text-[10px] text-slate-500 font-medium mt-1">Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
