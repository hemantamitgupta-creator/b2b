"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ProductWithRelations } from "@/types";
import { getProductImageUrl } from "@/lib/utils/image";
import {
  toggleProductStatusAction,
  deleteProductAction,
} from "@/app/actions/products";
import { Badge } from "@/components/ui/Badge";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import {
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle,
  EyeOff,
  AlertCircle,
} from "lucide-react";

interface ProductListTableProps {
  products: ProductWithRelations[];
}

export function ProductListTable({ products }: ProductListTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [productToDelete, setProductToDelete] = useState<ProductWithRelations | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleToggleStatus = (product: ProductWithRelations) => {
    setErrorMessage(null);
    const newStatus = product.status === "published" ? "draft" : "published";

    startTransition(async () => {
      const res = await toggleProductStatusAction(product.id, newStatus);
      if (!res.success) {
        setErrorMessage(res.error || "Failed to update product status.");
      } else {
        router.refresh();
      }
    });
  };

  const handleConfirmDelete = () => {
    if (!productToDelete) return;
    setErrorMessage(null);

    startTransition(async () => {
      const res = await deleteProductAction(productToDelete.id);
      if (!res.success) {
        setErrorMessage(res.error || "Failed to delete product.");
      } else {
        setProductToDelete(null);
        router.refresh();
      }
    });
  };

  if (products.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-xl border border-dashed border-slate-300">
        <p className="text-sm text-slate-500 mb-4">
          No instruments found in the catalogue. Create your first product to get started.
        </p>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg bg-[#006061] text-white hover:bg-[#004d4e] transition-colors shadow-xs"
        >
          Create First Instrument
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-xs text-red-800">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Instrument</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Updated</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => {
                const primaryImage =
                  product.images?.find((img) => img.is_primary) ||
                  product.images?.[0];
                const imageUrl = getProductImageUrl(primaryImage?.storage_path);

                return (
                  <tr key={product.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                          <Image
                            src={imageUrl}
                            alt={product.name}
                            fill
                            sizes="48px"
                            className="object-contain p-1"
                          />
                        </div>
                        <div>
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="font-bold text-slate-900 hover:text-[#006061] transition-colors block line-clamp-1"
                          >
                            {product.name}
                          </Link>
                          <span className="text-[11px] text-slate-400 font-mono">
                            /{product.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {product.category ? (
                        <Badge variant="category">{product.category.name}</Badge>
                      ) : (
                        <span className="text-xs text-slate-400 italic">None</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(product)}
                        disabled={isPending}
                        className="cursor-pointer group flex items-center gap-1.5"
                        title="Click to toggle published / draft state"
                      >
                        <Badge
                          variant={product.status === "published" ? "published" : "draft"}
                          className="group-hover:opacity-80 transition-opacity"
                        >
                          {product.status}
                        </Badge>
                      </button>
                    </td>

                    <td className="py-3 px-4 text-xs text-slate-500">
                      {new Date(product.updated_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {product.status === "published" && (
                          <Link
                            href={`/products/${product.slug}`}
                            target="_blank"
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="View Public Page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}

                        <button
                          type="button"
                          onClick={() => handleToggleStatus(product)}
                          disabled={isPending}
                          className="p-1.5 text-slate-400 hover:text-[#006061] hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                          title={
                            product.status === "published"
                              ? "Unpublish (Move to Draft)"
                              : "Publish to Catalogue"
                          }
                        >
                          {product.status === "published" ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                          )}
                        </button>

                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit Instrument"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => setProductToDelete(product)}
                          disabled={isPending}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={Boolean(productToDelete)}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Surgical Instrument"
        message={`Are you sure you want to permanently delete '${productToDelete?.name}'? All associated specification records and uploaded images will be removed.`}
        isLoading={isPending}
      />
    </div>
  );
}
