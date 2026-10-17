"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProductWithRelations } from "@/types";
import { getProductImageUrl } from "@/lib/utils/image";
import { QuoteModal } from "@/components/products/QuoteModal";
import { Sparkles } from "lucide-react";

interface ProductCardProps {
  product: ProductWithRelations;
}

const INDICATIVE_PRICES: Record<string, string> = {
  "4k-ultra-hd-endoscope-camera-icg": "₹ 10,50,000/Piece",
  "bariatric-curved-metzenbaum-laparoscopic-scissors": "₹ 6,500/Piece",
  "maryland-dissecting-laparoscopic-grasper": "₹ 4,500/Piece",
  "electrosurgical-co2-insufflator-40l": "₹ 2,85,000/Piece",
  "digital-cautery-machine-with-vessel-sealer": "₹ 3,50,000/Piece",
  "ultra-hd-surgical-camera-system": "₹ 6,50,000/Piece",
  "stille-luer-double-action-bone-rongeur": "₹ 8,200/Piece",
  "debakey-atraumatic-peripheral-vascular-clamp": "₹ 5,800/Piece",
  "castroviejo-micro-needle-holder-tc": "₹ 4,200/Piece",
  "sukhadia-uterine-manipulator-complete-set": "₹ 18,500/Set",
  "ball-loops-urology-electrode": "₹ 1,500/Piece",
  "fibre-optic-laryngoscope-set": "₹ 9,500/Set",
};

export function ProductCard({ product }: ProductCardProps) {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  const primaryImage =
    product.images?.find((img) => img.is_primary) || product.images?.[0];

  const imageUrl = getProductImageUrl(primaryImage?.storage_path, product.slug);
  const imageAlt = primaryImage?.alt_text || product.name;

  const displayPrice =
    INDICATIVE_PRICES[product.slug] || "Wholesale Quote on Request";

  // Take up to 3 top specifications
  const specs = product.specifications && product.specifications.length > 0
    ? product.specifications.slice(0, 3)
    : [
        { label: "Grade", value: "AISI 420 Martensitic Steel" },
        { label: "Sterilization", value: "Autoclavable Steam" },
        { label: "Standard", value: "CE / ISO 13485:2016" },
      ];

  return (
    <>
      <article className="group flex flex-col bg-white rounded-lg border border-slate-200 hover:border-[#006061] hover:shadow-lg transition-all duration-200 p-4 justify-between h-full">
        {/* Product Image Stage */}
        <div className="space-y-3">
          <Link
            href={`/products/${product.slug}`}
            className="relative block w-full aspect-square bg-slate-50 rounded-md overflow-hidden border border-slate-100"
          >
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
              className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            {product.featured && (
              <div className="absolute top-2 left-2">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#006061] text-white shadow-xs">
                  <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                  Featured
                </span>
              </div>
            )}
          </Link>

          {/* Product Title */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#006061] transition-colors line-clamp-2 leading-snug min-h-[38px]">
              <Link href={`/products/${product.slug}`}>{product.name}</Link>
            </h3>

            {/* Price Row */}
            <div className="mt-1 text-sm font-extrabold text-[#006061]">
              {displayPrice}
            </div>
          </div>

          {/* Specifications List */}
          <ul className="text-[11px] text-slate-600 space-y-1 border-t border-slate-100 pt-2 min-h-[58px]">
            {specs.map((spec, i) => (
              <li key={i} className="line-clamp-1">
                <span className="text-slate-400 font-medium">{spec.label}:</span>{" "}
                <span className="font-semibold text-slate-700">{spec.value}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Button */}
        <div className="pt-3">
          <button
            type="button"
            onClick={() => setQuoteModalOpen(true)}
            className="w-full py-2.5 px-3 bg-[#006061] hover:bg-[#004d4e] text-white font-bold text-xs rounded-md shadow-xs transition-colors cursor-pointer text-center tracking-wide"
          >
            Get Quote
          </button>
        </div>
      </article>

      {quoteModalOpen && (
        <QuoteModal
          isOpen={quoteModalOpen}
          onClose={() => setQuoteModalOpen(false)}
          productName={product.name}
          initialPrice={displayPrice}
        />
      )}
    </>
  );
}
