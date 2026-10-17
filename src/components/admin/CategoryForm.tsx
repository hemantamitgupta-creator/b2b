"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Category } from "@/types";
import { CategoryFormData, categorySchema } from "@/lib/validations/category";
import {
  createCategoryAction,
  updateCategoryAction,
} from "@/app/actions/categories";
import { slugify } from "@/lib/utils/slugify";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface CategoryFormProps {
  initialCategory?: Category | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CategoryForm({
  initialCategory,
  onSuccess,
  onCancel,
}: CategoryFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(initialCategory?.name || "");
  const [slug, setSlug] = useState(initialCategory?.slug || "");
  const [autoSlug, setAutoSlug] = useState(!initialCategory);
  const [description, setDescription] = useState(
    initialCategory?.description || ""
  );
  const [isActive, setIsActive] = useState(
    initialCategory !== undefined && initialCategory !== null
      ? initialCategory.is_active
      : true
  );
  const [sortOrder, setSortOrder] = useState(initialCategory?.sort_order ?? 0);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    if (autoSlug) {
      setSlug(slugify(val));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});
    setSuccessMessage(null);

    const formData: CategoryFormData = {
      name,
      slug,
      description: description || null,
      is_active: isActive,
      sort_order: Number(sortOrder) || 0,
    };

    const validation = categorySchema.safeParse(formData);
    if (!validation.success) {
      const flattened = validation.error.flatten();
      setFieldErrors(flattened.fieldErrors);
      setErrorMessage("Please fix the validation errors.");
      return;
    }

    startTransition(async () => {
      let res;
      if (initialCategory?.id) {
        res = await updateCategoryAction(initialCategory.id, formData);
      } else {
        res = await createCategoryAction(formData);
      }

      if (!res.success) {
        setErrorMessage(res.error || "Failed to save category.");
        if (res.fieldErrors) {
          setFieldErrors(res.fieldErrors);
        }
      } else {
        setSuccessMessage(
          initialCategory
            ? "Category updated successfully."
            : "Category created successfully."
        );
        router.refresh();
        if (onSuccess) {
          setTimeout(onSuccess, 800);
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-xs text-red-800">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      <Input
        label="Category Name"
        required
        value={name}
        onChange={(e) => handleNameChange(e.target.value)}
        placeholder="e.g. Laparoscopic Instruments"
        error={fieldErrors.name?.[0]}
      />

      <Input
        label="URL Slug"
        required
        value={slug}
        onChange={(e) => {
          setAutoSlug(false);
          setSlug(slugify(e.target.value));
        }}
        placeholder="e.g. laparoscopic-instruments"
        error={fieldErrors.slug?.[0]}
        helperText="Used in public category URL paths (/products?category=...)"
      />

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
          Description
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief clinical description of this instrument category..."
          className="w-full px-3.5 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006061]"
        />
        {fieldErrors.description?.[0] && (
          <p className="text-xs text-red-600 mt-1">{fieldErrors.description[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Display Order
          </label>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className="w-full min-h-[44px] px-3.5 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006061]"
          />
        </div>

        <div className="flex items-center gap-2 pt-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 text-[#006061] rounded border-slate-300 focus:ring-[#006061] cursor-pointer"
            />
            <span className="text-xs font-semibold text-slate-800">
              Active in Navigation
            </span>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isPending}
        >
          {initialCategory ? "Update Category" : "Create Category"}
        </Button>
      </div>
    </form>
  );
}
