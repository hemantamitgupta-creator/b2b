import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductByIdAdmin } from "@/services/products";
import { getAllCategoriesAdmin } from "@/services/categories";
import { ProductForm } from "@/components/admin/ProductForm";
import { ArrowLeft } from "lucide-react";

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    getProductByIdAdmin(id),
    getAllCategoriesAdmin(),
  ]);

  if (!product) {
    notFound();
  }

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
          Edit Surgical Instrument
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Update specifications, reorder images, or toggle published status for:{" "}
          <strong className="text-slate-700">{product.name}</strong>
        </p>
      </div>

      <ProductForm categories={categories} initialProduct={product} />
    </div>
  );
}
