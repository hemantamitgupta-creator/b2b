"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export interface CategoryCircleItem {
  name: string;
  slug: string;
  image: string;
}

export const CATEGORY_CIRCLES: CategoryCircleItem[] = [
  {
    name: "Laparoscopic Instruments",
    slug: "laparoscopic-instruments",
    image: "/images/kraft/cat-laparoscopic.jpg",
  },
  {
    name: "Surgical Instrument",
    slug: "surgical-instrument",
    image: "/images/kraft/cat-surgical.jpg",
  },
  {
    name: "Laparoscopy Instruments",
    slug: "laparoscopy-instruments",
    image: "/images/kraft/cat-laparoscopy-inst.jpg",
  },
  {
    name: "Surgical Equipment",
    slug: "surgical-equipment",
    image: "/images/kraft/cat-equipment.jpg",
  },
  {
    name: "Medical Equipment",
    slug: "surgical-equipment",
    image: "/images/kraft/cat-medical.jpg",
  },
  {
    name: "Laparoscopic Hand Set",
    slug: "laparoscopic-instruments",
    image: "/images/kraft/cat-handset.jpg",
  },
  {
    name: "Urology Instrument & Equipments",
    slug: "urology-instruments",
    image: "/images/kraft/cat-urology.jpg",
  },
  {
    name: "Medical Forceps",
    slug: "surgical-instrument",
    image: "/images/kraft/cat-forceps.jpg",
  },
];

interface CategoryCircleStripProps {
  activeSlug?: string;
}

export function CategoryCircleStrip({ activeSlug }: CategoryCircleStripProps) {
  return (
    <div className="w-full bg-white border-b border-slate-200 py-4 sm:py-5 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORY_CIRCLES.map((cat, idx) => {
            const isActive = activeSlug === cat.slug;
            return (
              <Link
                key={idx}
                href={`/products?category=${cat.slug}`}
                className="group flex flex-col items-center shrink-0 w-24 sm:w-28 text-center transition-transform hover:-translate-y-1"
              >
                {/* Authentic Kraft Circular Photo Container */}
                <div
                  className={`w-20 h-20 sm:w-22 sm:h-22 rounded-full p-1 flex items-center justify-center bg-white transition-all duration-200 ${
                    isActive
                      ? "border-2 border-[#006061] shadow-md bg-teal-50/30"
                      : "border border-slate-200 group-hover:border-[#006061] group-hover:shadow-md"
                  }`}
                >
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-50 flex items-center justify-center">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="96px"
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* Category Label */}
                <span
                  className={`mt-2 text-xs font-semibold leading-tight line-clamp-2 transition-colors ${
                    isActive
                      ? "text-[#006061] font-bold"
                      : "text-slate-700 group-hover:text-[#006061]"
                  }`}
                >
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
