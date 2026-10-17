import React from "react";
import { ProductWithRelations } from "@/types";
import { ProductCard } from "./ProductCard";
import { PackageOpen } from "lucide-react";
import Link from "next/link";

interface ProductGridProps {
  products: ProductWithRelations[];
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  emptyMessage = "No published surgical instruments match your selected criteria.",
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white rounded-xl border border-dashed border-slate-300">
        <PackageOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800 mb-1">
          No Instruments Found
        </h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
          {emptyMessage}
        </p>
        <Link
          href="/products"
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg bg-sky-700 text-white hover:bg-sky-800 transition-colors"
        >
          View Full Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
