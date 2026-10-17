import React from "react";
import Link from "next/link";
import { getAllProductsAdmin } from "@/services/products";
import { ProductListTable } from "@/components/admin/ProductListTable";
import { Plus, Package } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getAllProductsAdmin();

  const publishedCount = products.filter((p) => p.status === "published").length;
  const draftCount = products.filter((p) => p.status === "draft").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Package className="w-4 h-4" />
            <span>Catalogue Administration</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Surgical Instruments ({products.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {publishedCount} Published · {draftCount} Drafts
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-sky-700 text-white hover:bg-sky-800 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Instrument</span>
        </Link>
      </div>

      <ProductListTable products={products} />
    </div>
  );
}
