import React from "react";
import Link from "next/link";
import { getPublishedProducts } from "@/services/products";
import { getActiveCategories } from "@/services/categories";
import { ProductCard } from "@/components/catalogue/ProductCard";
import { CategoryCircleStrip } from "@/components/catalogue/CategoryCircleStrip";
import { HeroFeaturedShowcase } from "@/components/catalogue/HeroFeaturedShowcase";
import { CompanyOverviewSection } from "@/components/catalogue/CompanyOverviewSection";
import { ReviewsSection } from "@/components/catalogue/ReviewsSection";
import { QuickEnquirySection } from "@/components/catalogue/QuickEnquirySection";
import { FALLBACK_CATEGORIES, FALLBACK_PRODUCTS } from "@/lib/constants/fallbackData";
import { ArrowRight, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [dbCategories, { products: dbProducts }] = await Promise.all([
    getActiveCategories(),
    getPublishedProducts({ limit: 24 }),
  ]);

  const categories = dbCategories.length >= 3 ? dbCategories : FALLBACK_CATEGORIES;
  const products = dbProducts.length > 0 ? dbProducts : FALLBACK_PRODUCTS;

  // Group products into category slices matching Kraft Surgicals homepage showcase
  const laparoscopicProducts = products.filter(
    (p) =>
      p.category?.slug === "laparoscopic-instruments" ||
      p.category_id === "b59b0516-648f-4042-a3b6-0fe40e219066"
  );

  const surgicalProducts = products.filter(
    (p) =>
      p.category?.slug === "surgical-instrument" ||
      p.category?.slug === "surgical-equipment" ||
      p.category?.slug === "laparoscopy-instruments" ||
      p.category_id === "a69411e8-bf25-43ad-a0e3-847a229d5510" ||
      p.category_id === "1da2da04-a9c7-4c68-addf-48b5f9ab1b1e" ||
      p.category_id === "63a46b5c-f4d9-4f9e-846e-9871dae4e8a5"
  );

  const urologyAndGynProducts = products.filter(
    (p) =>
      p.category?.slug === "urology-instruments" ||
      p.category?.slug === "gynaecology-and-obstetrics" ||
      p.category?.slug === "orthopedic-and-trauma" ||
      p.category?.slug === "cardiovascular-and-thoracic" ||
      p.category_id === "bf978098-e7c2-4287-83c4-65e930a0e158" ||
      p.category_id === "e464b032-7277-4d7c-9ec6-0655b02b4b66" ||
      p.category_id === "7eab670a-3e94-4fda-977e-41dd6ad167dd" ||
      p.category_id === "7e1d26c8-9284-44a0-905f-b4ee3298399e"
  );

  return (
    <div className="bg-[#f0f2f5] space-y-0">
      {/* 1. Circular Category Strip Bar */}
      <CategoryCircleStrip />

      {/* 2. Hero Featured Showcase (3 Highlight Cards) */}
      <HeroFeaturedShowcase />

      {/* 3. Our Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Our Products
          </h2>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-bold text-[#006061] hover:underline flex items-center gap-1"
          >
            <span>View All categories</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Block 1: Laparoscopic Instruments */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              Laparoscopic Instruments
            </h3>
            <Link
              href="/products?category=laparoscopic-instruments"
              className="text-xs font-bold text-[#006061] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {(laparoscopicProducts.length > 0 ? laparoscopicProducts : products.slice(0, 5)).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Category Block 2: Surgical Equipment & Devices */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              Surgical Instrument & Equipment
            </h3>
            <Link
              href="/products?category=surgical-equipment"
              className="text-xs font-bold text-[#006061] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {(surgicalProducts.length > 0 ? surgicalProducts : products.slice(5, 10)).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Category Block 3: Urology & Specialty Surgery */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              Urology & Specialty Surgery Instruments
            </h3>
            <Link
              href="/products?category=urology-instruments"
              className="text-xs font-bold text-[#006061] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {(urologyAndGynProducts.length > 0 ? urologyAndGynProducts : products.slice(0, 5)).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* View All Catalogue CTA Strip */}
        <div className="text-center pt-4">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#006061] hover:bg-[#004d4e] text-white font-bold text-xs uppercase tracking-wider rounded-md shadow-sm transition-colors"
          >
            <span>Explore Complete Surgical Instruments Catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 4. Company Overview & Capability Cards */}
      <CompanyOverviewSection />

      {/* 5. Ratings & Reviews Section */}
      <ReviewsSection />

      {/* 6. Quick Enquiry & Contact Details */}
      <QuickEnquirySection />
    </div>
  );
}
