"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ProductImage } from "@/types";
import { getProductImageUrl } from "@/lib/utils/image";

interface ProductGalleryProps {
  images?: ProductImage[];
  productName: string;
  slug?: string;
}

export function ProductGallery({ images = [], productName, slug }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // If no images exist, show fallback
  if (images.length === 0) {
    const fallbackUrl = getProductImageUrl(null, slug);
    return (
      <div className="relative w-full aspect-4/3 bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <Image
          src={fallbackUrl}
          alt={productName}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain p-6"
        />
      </div>
    );
  }

  const activeImage = images[selectedIndex] || images[0];
  const activeImageUrl = getProductImageUrl(activeImage.storage_path, slug);
  const activeImageAlt = activeImage.alt_text || `${productName} image ${selectedIndex + 1}`;

  return (
    <div className="space-y-4">
      {/* Primary Display Stage */}
      <div className="relative w-full aspect-4/3 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex items-center justify-center">
        <Image
          src={activeImageUrl}
          alt={activeImageAlt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain p-6 transition-all duration-300"
        />
        {activeImage.is_primary && (
          <span className="absolute top-4 left-4 text-[11px] font-bold uppercase tracking-wider bg-slate-900/80 text-white px-2.5 py-1 rounded-md backdrop-blur-xs">
            Primary View
          </span>
        )}
      </div>

      {/* Thumbnail Selector (if multiple images exist) */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {images.map((img, idx) => {
            const thumbUrl = getProductImageUrl(img.storage_path);
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={img.id || idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`relative w-20 h-20 rounded-xl overflow-hidden bg-white border-2 transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? "border-[#006061] ring-2 ring-[#006061]/30 shadow-xs"
                    : "border-slate-200 hover:border-slate-300 opacity-80 hover:opacity-100"
                }`}
                aria-label={`View image ${idx + 1}`}
              >
                <Image
                  src={thumbUrl}
                  alt={img.alt_text || `${productName} thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-contain p-1.5"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
