"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { ProductImageFormData } from "@/lib/validations/product";
import { getProductImageUrl, validateImageFile } from "@/lib/utils/image";
import { UploadCloud, Trash2, Star, ArrowUp, ArrowDown, AlertCircle } from "lucide-react";

interface ImageUploaderProps {
  productId?: string;
  images: ProductImageFormData[];
  onChange: (images: ProductImageFormData[]) => void;
}

export function ImageUploader({
  productId = "temp",
  images,
  onChange,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError(null);
    setIsUploading(true);

    try {
      const supabase = createClient();
      const newImages: ProductImageFormData[] = [...images];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // 1. Validate file format and size
        const validation = validateImageFile(file);
        if (!validation.valid) {
          setUploadError(validation.error || "Invalid file selected.");
          continue;
        }

        // 2. Generate organized storage path: <productId>/<random-id>.<ext>
        const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const cleanName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const storagePath = `${productId}/${cleanName}`;

        // 3. Upload to Supabase Storage bucket 'product-images'
        const { error: uploadErr } = await supabase.storage
          .from("product-images")
          .upload(storagePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadErr) {
          console.error("Storage upload error:", uploadErr.message);
          setUploadError(
            `Failed to upload '${file.name}': ${uploadErr.message}. Ensure you are signed in as an administrator.`
          );
          continue;
        }

        // Add uploaded image to state
        newImages.push({
          storage_path: storagePath,
          alt_text: file.name.replace(/\.[^/.]+$/, ""),
          is_primary: newImages.length === 0, // Set primary if first image
          sort_order: newImages.length,
        });
      }

      onChange(newImages);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unexpected upload error";
      setUploadError(msg);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSetPrimary = (index: number) => {
    const updated = images.map((img, i) => ({
      ...img,
      is_primary: i === index,
    }));
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    const wasPrimary = images[index]?.is_primary;
    const updated = images.filter((_, i) => i !== index);

    // If removed image was primary and other images remain, make the first one primary
    if (wasPrimary && updated.length > 0) {
      updated[0].is_primary = true;
    }

    const reindexed = updated.map((img, i) => ({ ...img, sort_order: i }));
    onChange(reindexed);
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === images.length - 1)
    ) {
      return;
    }

    const target = direction === "up" ? index - 1 : index + 1;
    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;

    const reindexed = updated.map((img, i) => ({ ...img, sort_order: i }));
    onChange(reindexed);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900">
            Product Images & Gallery
          </h4>
          <p className="text-xs text-slate-500">
            Upload high-resolution clinical photographs. Formats: JPEG, PNG, WebP (Max 5MB each).
          </p>
        </div>
      </div>

      {uploadError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Upload Drop Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
          isUploading
            ? "border-sky-400 bg-sky-50/50"
            : "border-slate-300 hover:border-sky-600 hover:bg-slate-50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
        <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
        <p className="text-xs font-semibold text-slate-700">
          {isUploading ? "Uploading images to Supabase Storage..." : "Click or drag images to upload"}
        </p>
        <p className="text-[11px] text-slate-400 mt-1">
          At least one image is required before publishing.
        </p>
      </div>

      {/* Image Gallery Cards */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
          {images.map((img, idx) => {
            const previewUrl = getProductImageUrl(img.storage_path);
            return (
              <div
                key={img.storage_path || idx}
                className={`relative rounded-xl border overflow-hidden bg-white shadow-xs group ${
                  img.is_primary
                    ? "border-sky-600 ring-2 ring-sky-600/30"
                    : "border-slate-200"
                }`}
              >
                <div className="relative aspect-square w-full bg-slate-50">
                  <Image
                    src={previewUrl}
                    alt={img.alt_text || `Product image ${idx + 1}`}
                    fill
                    sizes="160px"
                    className="object-contain p-2"
                  />
                  {img.is_primary && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-sky-700 text-white text-[10px] font-bold rounded-md uppercase tracking-wider shadow-xs">
                      Primary
                    </span>
                  )}
                </div>

                <div className="p-2 border-t border-slate-100 flex items-center justify-between bg-white text-xs">
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(idx)}
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold cursor-pointer ${
                      img.is_primary
                        ? "text-sky-700 font-bold"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${
                        img.is_primary
                          ? "fill-sky-700 text-sky-700"
                          : "text-slate-400"
                      }`}
                    />
                    <span>{img.is_primary ? "Primary" : "Set Primary"}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, "up")}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                      aria-label="Move image left"
                    >
                      <ArrowUp className="w-3.5 h-3.5 rotate-[-90deg]" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === images.length - 1}
                      onClick={() => handleMove(idx, "down")}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                      aria-label="Move image right"
                    >
                      <ArrowDown className="w-3.5 h-3.5 rotate-[-90deg]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(idx)}
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md cursor-pointer ml-1"
                      aria-label="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
