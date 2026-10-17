import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { getPublishedProducts } from "@/services/products";
import { getActiveCategories } from "@/services/categories";
import { ProductCard } from "@/components/catalogue/ProductCard";
import { ProductFilters } from "@/components/catalogue/ProductFilters";
import { CategoryCircleStrip } from "@/components/catalogue/CategoryCircleStrip";
import { QuickEnquirySection } from "@/components/catalogue/QuickEnquirySection";
import { Stethoscope, ChevronRight, Phone } from "lucide-react";
import { FALLBACK_CATEGORIES, FALLBACK_PRODUCTS } from "@/lib/constants/fallbackData";

export const metadata: Metadata = {
  title: "Our Products | Kraft Surgicals Private Limited",
  description:
    "Explore our complete range of certified precision surgical instruments, 4K camera systems, vessel sealers, and laparoscopic equipment.",
};

export const dynamic = "force-dynamic";

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams.category || "";
  const currentSearch = resolvedParams.search || "";

  const [dbCategories, { products: dbProducts, total: dbTotal }] = await Promise.all([
    getActiveCategories(),
    getPublishedProducts({
      categorySlug: currentCategory || undefined,
      search: currentSearch || undefined,
      limit: 48,
    }),
  ]);

  const categories = dbCategories.length >= 3 ? dbCategories : FALLBACK_CATEGORIES;
  
  // Use DB products if available; otherwise use fallback filtered by category and search
  let products = dbProducts;
  if (products.length === 0 && dbTotal === 0) {
    products = FALLBACK_PRODUCTS.filter((p) => {
      let matchesCategory = true;
      let matchesSearch = true;

      if (currentCategory) {
        matchesCategory = p.category?.slug === currentCategory;
      }

      if (currentSearch) {
        const query = currentSearch.toLowerCase();
        matchesSearch =
          p.name.toLowerCase().includes(query) ||
          (p.short_description?.toLowerCase().includes(query) ?? false);
      }

      return matchesCategory && matchesSearch;
    });
  }

  const total = dbTotal > 0 ? dbTotal : products.length;
  const activeCategoryObj = categories.find((c) => c.slug === currentCategory);

  return (
    <div className="bg-[#f0f2f5] min-h-screen">
      {/* 1. Category Circle Strip */}
      <CategoryCircleStrip activeSlug={currentCategory} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Link href="/" className="hover:text-[#006061] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/products" className="hover:text-[#006061] transition-colors">
            Our Products
          </Link>
          {activeCategoryObj && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[#006061] font-bold">{activeCategoryObj.name}</span>
            </>
          )}
        </nav>

        {/* Page Title & Clinical Context Banner */}
        <div className="bg-white p-5 sm:p-6 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {activeCategoryObj ? activeCategoryObj.name : "Our Products"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              {activeCategoryObj?.description ||
                "Exporter & Manufacturer of Laparoscopic Instruments, Surgical Instrument & Laparoscopy Instruments offered by Kraft Surgicals Private Limited, Mumbai, Maharashtra, India."}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <a
              href="tel:+917942788235"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-teal-50 border border-teal-200 text-[#006061] font-bold text-xs hover:bg-[#006061] hover:text-white transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Call 07942788235</span>
            </a>
          </div>
        </div>

        {/* Filters & Search Control */}
        <ProductFilters
          categories={categories}
          currentCategory={currentCategory}
          currentSearch={currentSearch}
        />

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            Showing <strong className="text-slate-800">{products.length}</strong> of{" "}
            <strong className="text-slate-800">{total}</strong> products
            {currentSearch ? ` matching "${currentSearch}"` : ""}
            {activeCategoryObj ? ` in ${activeCategoryObj.name}` : ""}
          </span>
          <span className="font-semibold text-[#006061]">
            Direct Manufacturer Pricing · TrustSeal Verified
          </span>
        </div>

        {/* Product Cards Grid: 5 columns on large desktop matching Kraft Surgicals */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Stethoscope className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              No Instruments Found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn&apos;t find instruments matching your criteria. Try adjusting your search query or selecting another discipline.
            </p>
            <Link
              href="/products"
              className="inline-block px-5 py-2 rounded-md bg-[#006061] text-white text-xs font-bold hover:bg-[#004d4e]"
            >
              Reset Filters
            </Link>
          </div>
        )}
      </div>

      {/* Quick Enquiry at bottom */}
      <QuickEnquirySection />
    </div>
  );
}
