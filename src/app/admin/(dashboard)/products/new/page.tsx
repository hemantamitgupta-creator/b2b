import React from "react";
import Link from "next/link";
import { getAllCategoriesAdmin } from "@/services/categories";
import { ProductForm } from "@/components/admin/ProductForm";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await getAllCategoriesAdmin();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Products</span>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Create New Surgical Instrument
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Specify instrument parameters, upload clinical photos, and define technical specifications.
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="p-8 bg-amber-50 border border-amber-200 rounded-xl text-center space-y-3">
          <p className="text-sm font-semibold text-amber-900">
            You must create at least one category before adding a surgical instrument.
          </p>
          <Link
            href="/admin/categories"
            className="inline-flex items-center px-4 py-2 text-xs font-bold rounded-lg bg-amber-700 text-white hover:bg-amber-800 transition-colors"
          >
            Create Category First
          </Link>
        </div>
      ) : (
        <ProductForm categories={categories} />
      )}
    </div>
  );
}
