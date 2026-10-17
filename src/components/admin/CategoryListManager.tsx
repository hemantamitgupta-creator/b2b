"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Category } from "@/types";
import {
  toggleCategoryActiveAction,
  deleteCategoryAction,
} from "@/app/actions/categories";
import { CategoryForm } from "./CategoryForm";
import { Modal } from "@/components/ui/Modal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { Badge } from "@/components/ui/Badge";
import { Plus, Edit, Trash2, CheckCircle, EyeOff, AlertCircle } from "lucide-react";

interface CategoryListManagerProps {
  categories: Category[];
}

export function CategoryListManager({ categories }: CategoryListManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleToggleActive = (cat: Category) => {
    setErrorMessage(null);
    startTransition(async () => {
      const res = await toggleCategoryActiveAction(cat.id, !cat.is_active);
      if (!res.success) {
        setErrorMessage(res.error || "Failed to update category status.");
      } else {
        router.refresh();
      }
    });
  };

  const handleConfirmDelete = () => {
    if (!categoryToDelete) return;
    setErrorMessage(null);

    startTransition(async () => {
      const res = await deleteCategoryAction(categoryToDelete.id);
      if (!res.success) {
        setErrorMessage(res.error || "Failed to delete category.");
      } else {
        setCategoryToDelete(null);
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Surgical Categories ({categories.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage instrument classifications and public catalogue disciplines.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-[#006061] text-white hover:bg-[#004d4e] transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {errorMessage && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-800">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {categories.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-dashed border-slate-300">
          <p className="text-sm text-slate-500 mb-4">
            No surgical categories exist yet. Create your first category to group surgical instruments.
          </p>
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg bg-[#006061] text-white hover:bg-[#004d4e] transition-colors cursor-pointer"
          >
            Create Category
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Order</th>
                  <th className="py-3.5 px-4">Category Name</th>
                  <th className="py-3.5 px-4">Slug</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-slate-400">
                      #{cat.sort_order}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">
                        {cat.name}
                      </span>
                      {cat.description && (
                        <span className="text-xs text-slate-500 line-clamp-1">
                          {cat.description}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-500">
                      /{cat.slug}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(cat)}
                        disabled={isPending}
                        className="cursor-pointer group flex items-center gap-1.5"
                        title="Click to toggle active / inactive status"
                      >
                        <Badge
                          variant={cat.is_active ? "published" : "inactive"}
                          className="group-hover:opacity-80 transition-opacity"
                        >
                          {cat.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(cat)}
                          disabled={isPending}
                          className="p-1.5 text-slate-400 hover:text-[#006061] hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                          title={cat.is_active ? "Deactivate Category" : "Activate Category"}
                        >
                          {cat.is_active ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingCategory(cat)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit Category"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setCategoryToDelete(cat)}
                          disabled={isPending}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Category Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create Surgical Category"
        description="Add a new discipline to group surgical instruments."
      >
        <CategoryForm
          onSuccess={() => setIsCreateOpen(false)}
          onCancel={() => setIsCreateOpen(false)}
        />
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        isOpen={Boolean(editingCategory)}
        onClose={() => setEditingCategory(null)}
        title="Edit Surgical Category"
        description="Modify category information, URL slug, or ordering."
      >
        {editingCategory && (
          <CategoryForm
            initialCategory={editingCategory}
            onSuccess={() => setEditingCategory(null)}
            onCancel={() => setEditingCategory(null)}
          />
        )}
      </Modal>

      {/* Delete Category Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(categoryToDelete)}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete '${categoryToDelete?.name}'? If products belong to this category, the deletion will be rejected for database integrity. In that case, deactivate the category instead.`}
        isLoading={isPending}
      />
    </div>
  );
}
