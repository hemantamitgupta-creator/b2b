"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Category, ProductWithRelations } from "@/types";
import {
  ProductFormData,
  SpecificationFormData,
  ProductImageFormData,
  productSchema,
} from "@/lib/validations/product";
import { createProductAction, updateProductAction } from "@/app/actions/products";
import { slugify } from "@/lib/utils/slugify";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SpecificationsEditor } from "./SpecificationsEditor";
import { ImageUploader } from "./ImageUploader";
import { AlertCircle, CheckCircle2, Save, Send } from "lucide-react";

interface ProductFormProps {
  categories: Category[];
  initialProduct?: ProductWithRelations;
}

export function ProductForm({ categories, initialProduct }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(initialProduct?.name || "");
  const [slug, setSlug] = useState(initialProduct?.slug || "");
  const [autoSlug, setAutoSlug] = useState(!initialProduct);
  const [categoryId, setCategoryId] = useState(
    initialProduct?.category_id || (categories[0]?.id || "")
  );
  const [shortDescription, setShortDescription] = useState(
    initialProduct?.short_description || ""
  );
  const [description, setDescription] = useState(
    initialProduct?.description || ""
  );
  const [status, setStatus] = useState<"draft" | "published">(
    initialProduct?.status || "draft"
  );
  const [featured, setFeatured] = useState(initialProduct?.featured || false);

  const [specifications, setSpecifications] = useState<SpecificationFormData[]>(
    (initialProduct?.specifications || []).map((s, idx) => ({
      id: s.id,
      label: s.label,
      value: s.value,
      sort_order: s.sort_order ?? idx,
    }))
  );

  const [images, setImages] = useState<ProductImageFormData[]>(
    (initialProduct?.images || []).map((img, idx) => ({
      id: img.id,
      storage_path: img.storage_path,
      alt_text: img.alt_text || "",
      is_primary: img.is_primary ?? idx === 0,
      sort_order: img.sort_order ?? idx,
    }))
  );

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    if (autoSlug) {
      setSlug(slugify(val));
    }
  };

  const handleSubmit = (targetStatus: "draft" | "published") => {
    setErrorMessage(null);
    setFieldErrors({});
    setSuccessMessage(null);

    const formData: ProductFormData = {
      name,
      slug,
      category_id: categoryId,
      short_description: shortDescription || null,
      description: description || null,
      status: targetStatus,
      featured,
      specifications,
      images,
    };

    // Client-side Zod validation
    const validation = productSchema.safeParse(formData);
    if (!validation.success) {
      const flattened = validation.error.flatten();
      setFieldErrors(flattened.fieldErrors);
      setErrorMessage(
        flattened.formErrors[0] ||
          Object.values(flattened.fieldErrors)[0]?.[0] ||
          "Please check the product fields."
      );
      return;
    }

    startTransition(async () => {
      let res;
      if (initialProduct?.id) {
        res = await updateProductAction(initialProduct.id, formData);
      } else {
        res = await createProductAction(formData);
      }

      if (!res.success) {
        setErrorMessage(res.error || "Failed to save product.");
        if (res.fieldErrors) {
          setFieldErrors(res.fieldErrors);
        }
      } else {
        setSuccessMessage(
          targetStatus === "published"
            ? "Product successfully published to the live catalogue!"
            : "Product successfully saved as draft."
        );
        router.refresh();
        if (!initialProduct) {
          setTimeout(() => {
            router.push("/admin/products");
          }, 1200);
        }
      }
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(status);
      }}
      className="space-y-8"
    >
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-sm text-red-800">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Submission Error</span>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-sm text-emerald-800">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Operation Successful</span>
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      {/* Main Details Section */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-5">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          Basic Product Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Product Name"
            required
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Curved Metzenbaum Laparoscopic Scissors"
            error={fieldErrors.name?.[0]}
          />

          <div>
            <Input
              label="URL Slug"
              required
              value={slug}
              onChange={(e) => {
                setAutoSlug(false);
                setSlug(slugify(e.target.value));
              }}
              placeholder="e.g. curved-metzenbaum-scissors"
              error={fieldErrors.slug?.[0]}
              helperText="Unique identifier used in the catalogue URL"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Surgical Category <span className="text-red-500">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full min-h-[44px] px-3.5 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 cursor-pointer"
              required
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} {!cat.is_active ? "(Inactive)" : ""}
                </option>
              ))}
            </select>
            {fieldErrors.category_id?.[0] && (
              <p className="text-xs text-red-600 mt-1 font-medium">
                {fieldErrors.category_id[0]}
              </p>
            )}
          </div>

          <div className="flex items-center gap-6 pt-6">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-600 cursor-pointer"
              />
              <span className="text-xs font-semibold text-slate-800">
                Mark as Featured Product
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Short Summary / Overview
          </label>
          <textarea
            rows={2}
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="Brief instrument description shown on catalogue cards..."
            className="w-full px-3.5 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Detailed Clinical Description
          </label>
          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Comprehensive description of surgical utility, metallurgy, sterilization guidelines, and ergonomics..."
            className="w-full px-3.5 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006061]"
          />
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <ImageUploader
          productId={initialProduct?.id || "temp"}
          images={images}
          onChange={setImages}
        />
        {fieldErrors.images?.[0] && (
          <p className="text-xs text-red-600 font-medium mt-2">
            {fieldErrors.images[0]}
          </p>
        )}
      </div>

      {/* Dynamic Technical Specifications Section */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <SpecificationsEditor
          specifications={specifications}
          onChange={setSpecifications}
        />
      </div>

      {/* Publication Controls Bar */}
      <div className="sticky bottom-4 z-20 bg-slate-900 text-white p-4 rounded-xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-medium">Status:</span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
              status === "published"
                ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                : "bg-amber-950 text-amber-400 border border-amber-800"
            }`}
          >
            {status}
          </span>
          {initialProduct && (
            <span className="text-xs text-slate-500 hidden md:inline">
              ID: {initialProduct.id.slice(0, 8)}...
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            size="md"
            disabled={isPending}
            onClick={() => {
              setStatus("draft");
              handleSubmit("draft");
            }}
            className="flex-1 sm:flex-none border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
          >
            <Save className="w-4 h-4 mr-1.5" />
            <span>Save as Draft</span>
          </Button>

          <Button
            type="button"
            variant="primary"
            size="md"
            isLoading={isPending}
            onClick={() => {
              setStatus("published");
              handleSubmit("published");
            }}
            className="flex-1 sm:flex-none bg-[#006061] hover:bg-[#004d4e] text-white"
          >
            <Send className="w-4 h-4 mr-1.5" />
            <span>Publish to Catalogue</span>
          </Button>
        </div>
      </div>
    </form>
  );
}
