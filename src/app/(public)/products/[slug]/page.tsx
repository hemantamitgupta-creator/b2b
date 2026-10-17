import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import {
  getPublishedProductBySlug,
  getRelatedProducts,
} from "@/services/products";
import { ProductGallery } from "@/components/products/ProductGallery";
import { SpecificationsTable } from "@/components/products/SpecificationsTable";
import { QuoteModalPlaceholder } from "@/components/products/QuoteModalPlaceholder";
import { ProductCard } from "@/components/catalogue/ProductCard";
import { CategoryCircleStrip } from "@/components/catalogue/CategoryCircleStrip";
import { QuickEnquirySection } from "@/components/catalogue/QuickEnquirySection";
import {
  ShieldCheck,
  Check,
  ChevronRight,
  Sparkles,
  Layers,
  FileCheck,
  Phone,
  Building,
} from "lucide-react";
import { ProductWithRelations } from "@/types";
import { FALLBACK_PRODUCTS } from "@/lib/constants/fallbackData";

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = "force-dynamic";

const FALLBACK_PRODUCTS_MAP: Record<string, ProductWithRelations> = Object.fromEntries(
  FALLBACK_PRODUCTS.map((p) => [p.slug, p])
);

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

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const dbProduct = await getPublishedProductBySlug(slug);
  const product = dbProduct || FALLBACK_PRODUCTS_MAP[slug];

  if (!product) {
    return {
      title: "Instrument Not Found | Kraft Surgicals",
      description: "The requested surgical instrument does not exist or is not available.",
    };
  }

  return {
    title: `${product.name} | Kraft Surgicals Mumbai`,
    description:
      product.short_description ||
      `Technical specifications and B2B quotation for ${product.name}. Certified surgical grade instrument from Kraft Surgicals.`,
    openGraph: {
      title: `${product.name} | Kraft Surgicals`,
      description:
        product.short_description ||
        `Hospital procurement details and specifications for ${product.name}.`,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const dbProduct = await getPublishedProductBySlug(slug);
  const product = dbProduct || FALLBACK_PRODUCTS_MAP[slug];

  if (!product) {
    notFound();
  }

  const relatedProducts = product.category_id && dbProduct
    ? await getRelatedProducts(product.category_id, product.id, 5)
    : Object.values(FALLBACK_PRODUCTS_MAP).filter((p) => p.slug !== product.slug).slice(0, 5);

  const displayPrice = INDICATIVE_PRICES[product.slug] || "Wholesale Quote on Request";

  return (
    <div className="bg-[#f0f2f5] min-h-screen">
      {/* 1. Category Circle Strip */}
      <CategoryCircleStrip activeSlug={product.category?.slug} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Link href="/" className="hover:text-[#006061] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/products" className="hover:text-[#006061] transition-colors">
            Our Products
          </Link>
          {product.category && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <Link
                href={`/products?category=${product.category.slug}`}
                className="hover:text-[#006061] transition-colors font-medium text-slate-700"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#006061] font-bold truncate max-w-xs sm:max-w-md">
            {product.name}
          </span>
        </nav>

        {/* Main Product Showcase Section */}
        <div className="bg-white p-6 sm:p-8 rounded-lg border border-slate-200 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Left: Product Image Gallery */}
            <div className="lg:col-span-6">
              <ProductGallery
                images={product.images}
                productName={product.name}
                slug={product.slug}
              />
            </div>

            {/* Right: Product Information & Quotation Call to Action */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  {product.category && (
                    <Link href={`/products?category=${product.category.slug}`}>
                      <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#006061] bg-teal-50 px-2.5 py-1 rounded border border-teal-200">
                        {product.category.name}
                      </span>
                    </Link>
                  )}
                  {product.featured && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold bg-[#006061] text-white">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      Featured
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    TrustSeal Verified
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 leading-tight">
                  {product.name}
                </h1>

                {/* Price Display */}
                <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block">
                      Price / Wholesale Rate
                    </span>
                    <span className="text-2xl font-black text-[#006061]">
                      {displayPrice}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">
                    Inclusive of Standard Hospital Packing
                  </span>
                </div>

                {product.short_description && (
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {product.short_description}
                  </p>
                )}

                {/* Quality & Metallurgy Badges */}
                <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#006061] shrink-0" />
                    <span>Autoclavable Steam Sterilization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#006061] shrink-0" />
                    <span>AISI 420 Martensitic Alloy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#006061] shrink-0" />
                    <span>Precision Calibrated Edge</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#006061] shrink-0" />
                    <span>ISO 13485:2016 Compliant</span>
                  </div>
                </div>
              </div>

              {/* Quotation & Procurement Box */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-[#006061] uppercase tracking-wider block">
                      Wholesale & Hospital Tender Supply
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      Direct Manufacturer Pricing
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-teal-50 text-[#006061] border border-teal-200">
                    83% Response Rate
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <QuoteModalPlaceholder productName={product.name} />
                  <a
                    href="tel:+917942788235"
                    className="inline-flex items-center justify-center min-h-[44px] px-5 py-2 text-xs font-bold rounded-md border border-slate-300 bg-white text-slate-800 hover:border-[#006061] hover:text-[#006061] transition-colors text-center gap-2"
                  >
                    <Phone className="w-4 h-4 text-[#006061]" />
                    <span>Call 07942788235</span>
                  </a>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                  <span>GSTIN: 27AAGCK0266P1Z3</span>
                  <span>Payment Protected via IndiaMART</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description & Technical Specifications Section */}
        <section id="specifications" className="bg-white p-6 sm:p-8 rounded-lg border border-slate-200 shadow-xs space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Detailed Clinical Description */}
            <div className="lg:col-span-5 space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <FileCheck className="w-5 h-5 text-[#006061]" />
                <span>Clinical Utility & Metallurgy</span>
              </h2>
              <div className="prose prose-sm text-slate-600 leading-relaxed space-y-3">
                {product.description ? (
                  product.description.split("\n\n").map((para, i) => (
                    <p key={i} className="text-xs sm:text-sm">
                      {para}
                    </p>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    Standard surgical instrument specifications apply. Contact our technical team for custom metallurgical reports.
                  </p>
                )}
              </div>
            </div>

            {/* Dynamic Specifications Table */}
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Layers className="w-5 h-5 text-[#006061]" />
                <span>Engineering & Technical Specifications</span>
              </h2>
              <SpecificationsTable specifications={product.specifications} />
            </div>
          </div>
        </section>

        {/* Related Instruments in Same Category */}
        {relatedProducts.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">
                Related {product.category?.name || "Surgical Instruments"}
              </h2>
              {product.category && (
                <Link
                  href={`/products?category=${product.category.slug}`}
                  className="text-xs font-bold text-[#006061] hover:underline flex items-center gap-1"
                >
                  <span>View All in {product.category.name}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Quick Enquiry Section at bottom */}
      <QuickEnquirySection />
    </div>
  );
}
