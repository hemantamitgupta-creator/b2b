"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { QuoteModal } from "@/components/products/QuoteModal";

export function HeroFeaturedShowcase() {
  const [quoteItem, setQuoteItem] = useState<{ name: string; price: string } | null>(null);

  return (
    <section className="bg-[#f0f2f5] py-6 sm:py-8 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Featured Card 1: Ethicon Har36 */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs hover:shadow-md transition-shadow p-4 flex flex-col justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="relative w-full aspect-square bg-slate-50 rounded-md overflow-hidden border border-slate-100 flex items-center justify-center">
                <Image
                  src="/images/kraft/hero-harmonic.jpg"
                  alt="Ethicon Har36 Harmonic Ace"
                  fill
                  className="object-cover p-1 hover:scale-105 transition-transform"
                />
              </div>

              <div className="space-y-1.5">
                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  Ethicon Har36 Harmonic Ace
                </h3>
                <div className="text-[#006061] font-extrabold text-base">
                  ₹ 35,000<span className="text-xs font-normal text-slate-500">/Piece</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-1 pt-1">
                  <li><span className="text-slate-400">Shaft length:</span> 36 cm</li>
                  <li><span className="text-slate-400">Jaw type:</span> Curved shear</li>
                  <li><span className="text-slate-400">Compatibility:</span> Ethicon Gen 11</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setQuoteItem({ name: "Ethicon Har36 Harmonic Ace", price: "₹ 35,000/Piece" })}
              className="mt-4 w-full py-2.5 px-4 bg-[#006061] hover:bg-[#004d4e] text-white font-bold text-xs rounded-md shadow-xs transition-colors cursor-pointer text-center"
            >
              Get Quote
            </button>
          </div>

          {/* Featured Card 2: Cystoscope Sheath */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs hover:shadow-md transition-shadow p-4 flex flex-col justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="relative w-full aspect-square bg-slate-50 rounded-md overflow-hidden border border-slate-100 flex items-center justify-center">
                <Image
                  src="/images/kraft/hero-cystoscope.jpg"
                  alt="Cystoscope Sheath Urology"
                  fill
                  className="object-cover p-1 hover:scale-105 transition-transform"
                />
              </div>

              <div className="space-y-1.5">
                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  Cystoscope Sheath Urology
                </h3>
                <div className="text-[#006061] font-extrabold text-base">
                  ₹ 8,500<span className="text-xs font-normal text-slate-500">/Piece</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-1 pt-1">
                  <li><span className="text-slate-400">Material:</span> Stainless Steel</li>
                  <li><span className="text-slate-400">Length:</span> 30 mm</li>
                  <li><span className="text-slate-400">Usage:</span> Urology Surgery</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setQuoteItem({ name: "Cystoscope Sheath Urology", price: "₹ 8,500/Piece" })}
              className="mt-4 w-full py-2.5 px-4 bg-[#006061] hover:bg-[#004d4e] text-white font-bold text-xs rounded-md shadow-xs transition-colors cursor-pointer text-center"
            >
              Get Quote
            </button>
          </div>

          {/* Featured Card 3: View Complete Range of Products Banner */}
          <Link
            href="/products"
            className="group relative rounded-lg overflow-hidden min-h-[220px] p-6 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-lg transition-all border border-slate-700 bg-gradient-to-br from-slate-900 via-[#1E293B] to-[#004D4E]"
          >
            <div className="absolute inset-0 bg-radial from-teal-500/20 via-transparent to-transparent opacity-50" />
            
            <div className="relative z-10 space-y-3">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto text-teal-300 group-hover:scale-110 transition-transform">
                <ArrowRight className="w-6 h-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                View Complete Range Of Products
              </h3>
              <p className="text-xs text-slate-300 max-w-xs mx-auto">
                Discover over 120+ precision surgical & laparoscopic instruments certified for operating theatres.
              </p>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-300 group-hover:text-white pt-2">
                <span>Explore Full Catalogue</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </div>

      {quoteItem && (
        <QuoteModal
          isOpen={!!quoteItem}
          onClose={() => setQuoteItem(null)}
          productName={quoteItem.name}
          initialPrice={quoteItem.price}
        />
      )}
    </section>
  );
}
