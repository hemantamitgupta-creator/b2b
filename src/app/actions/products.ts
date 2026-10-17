"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/session";
import { productSchema, ProductFormData } from "@/lib/validations/product";
import { revalidatePath } from "next/cache";

export interface ProductActionResult {
  success: boolean;
  productId?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function createProductAction(
  data: ProductFormData
): Promise<ProductActionResult> {
  try {
    const auth = await requireAdmin();

    const validated = productSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: "Product validation failed. Please review your inputs.",
        fieldErrors: validated.error.flatten().fieldErrors,
      };
    }

    const {
      name,
      slug,
      category_id,
      short_description,
      description,
      status,
      featured,
      specifications,
      images,
    } = validated.data;

    const supabase = await createClient();

    // Verify slug uniqueness
    const { data: existingSlug } = await supabase
      .from("products")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (existingSlug) {
      return {
        success: false,
        error: `A product with the slug '${slug}' already exists. Please choose a unique name or slug.`,
      };
    }

    // 1. Insert product row
    const { data: product, error: insertError } = await supabase
      .from("products")
      .insert({
        name,
        slug,
        category_id,
        short_description: short_description || null,
        description: description || null,
        status,
        featured,
        created_by: auth.user?.id || null,
      })
      .select("id")
      .single();

    if (insertError || !product) {
      console.error("Create product DB error:", insertError?.message);
      return {
        success: false,
        error: insertError?.message || "Failed to create product record.",
      };
    }

    const productId = product.id;

    // 2. Insert specifications if provided
    if (specifications && specifications.length > 0) {
      const specsToInsert = specifications.map((spec, index) => ({
        product_id: productId,
        label: spec.label.trim(),
        value: spec.value.trim(),
        sort_order: spec.sort_order ?? index,
      }));

      const { error: specError } = await supabase
        .from("product_specifications")
        .insert(specsToInsert);

      if (specError) {
        console.error("Error inserting specifications:", specError.message);
      }
    }

    // 3. Insert images if provided
    if (images && images.length > 0) {
      const imagesToInsert = images.map((img, index) => ({
        product_id: productId,
        storage_path: img.storage_path,
        alt_text: img.alt_text || name,
        sort_order: img.sort_order ?? index,
        is_primary: img.is_primary || index === 0, // Ensure at least the first is primary
      }));

      const { error: imgError } = await supabase
        .from("product_images")
        .insert(imagesToInsert);

      if (imgError) {
        console.error("Error inserting product images:", imgError.message);
      }
    }

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");

    return { success: true, productId };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create product.";
    return { success: false, error: message };
  }
}

export async function updateProductAction(
  id: string,
  data: ProductFormData
): Promise<ProductActionResult> {
  try {
    await requireAdmin();

    const validated = productSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: "Product validation failed. Please review your inputs.",
        fieldErrors: validated.error.flatten().fieldErrors,
      };
    }

    const {
      name,
      slug,
      category_id,
      short_description,
      description,
      status,
      featured,
      specifications,
      images,
    } = validated.data;

    const supabase = await createClient();

    // Verify slug uniqueness against other products
    const { data: existingSlug } = await supabase
      .from("products")
      .select("id")
      .eq("slug", slug)
      .neq("id", id)
      .maybeSingle();

    if (existingSlug) {
      return {
        success: false,
        error: `A product with the slug '${slug}' already exists. Please choose a unique name or slug.`,
      };
    }

    // 1. Update product base record
    const { error: updateError } = await supabase
      .from("products")
      .update({
        name,
        slug,
        category_id,
        short_description: short_description || null,
        description: description || null,
        status,
        featured,
      })
      .eq("id", id);

    if (updateError) {
      console.error("Update product DB error:", updateError.message);
      return { success: false, error: updateError.message };
    }

    // 2. Replace specifications
    await supabase.from("product_specifications").delete().eq("product_id", id);
    if (specifications && specifications.length > 0) {
      const specsToInsert = specifications.map((spec, index) => ({
        product_id: id,
        label: spec.label.trim(),
        value: spec.value.trim(),
        sort_order: spec.sort_order ?? index,
      }));

      await supabase.from("product_specifications").insert(specsToInsert);
    }

    // 3. Update images
    // For images: find which old images were deleted to clean up Storage
    const { data: currentImages } = await supabase
      .from("product_images")
      .select("id, storage_path")
      .eq("product_id", id);

    const keptStoragePaths = new Set(images.map((img) => img.storage_path));
    const orphanedPaths = (currentImages || [])
      .map((img) => img.storage_path)
      .filter((p) => !keptStoragePaths.has(p) && !p.startsWith("http") && !p.startsWith("demo/"));

    // Clean up orphaned files in Supabase Storage
    if (orphanedPaths.length > 0) {
      try {
        await supabase.storage.from("product-images").remove(orphanedPaths);
      } catch (storageErr) {
        console.warn("Storage cleanup error on product update:", storageErr);
      }
    }

    // Replace product_images rows
    await supabase.from("product_images").delete().eq("product_id", id);
    if (images && images.length > 0) {
      const imagesToInsert = images.map((img, index) => ({
        product_id: id,
        storage_path: img.storage_path,
        alt_text: img.alt_text || name,
        sort_order: img.sort_order ?? index,
        is_primary: img.is_primary ?? index === 0,
      }));

      await supabase.from("product_images").insert(imagesToInsert);
    }

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}/edit`);
    revalidatePath("/products");
    revalidatePath(`/products/${slug}`);
    revalidatePath("/");

    return { success: true, productId: id };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update product.";
    return { success: false, error: message };
  }
}

export async function toggleProductStatusAction(
  id: string,
  newStatus: "draft" | "published"
): Promise<ProductActionResult> {
  try {
    await requireAdmin();

    const supabase = await createClient();

    // If publishing, ensure the product has at least one valid image
    if (newStatus === "published") {
      const { count: imageCount } = await supabase
        .from("product_images")
        .select("id", { count: "exact", head: true })
        .eq("product_id", id);

      if (!imageCount || imageCount === 0) {
        return {
          success: false,
          error: "Cannot publish product: at least one product image is required before publishing.",
        };
      }
    }

    const { data: updated, error } = await supabase
      .from("products")
      .update({ status: newStatus })
      .eq("id", id)
      .select("slug")
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/products");
    revalidatePath("/products");
    if (updated?.slug) {
      revalidatePath(`/products/${updated.slug}`);
    }
    revalidatePath("/");

    return { success: true, productId: id };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to change product status.";
    return { success: false, error: message };
  }
}

export async function deleteProductAction(
  id: string
): Promise<ProductActionResult> {
  try {
    await requireAdmin();

    const supabase = await createClient();

    // 1. Fetch images to clean up storage objects
    const { data: images } = await supabase
      .from("product_images")
      .select("storage_path")
      .eq("product_id", id);

    const storagePathsToRemove = (images || [])
      .map((img) => img.storage_path)
      .filter((p) => !p.startsWith("http") && !p.startsWith("demo/"));

    // 2. Fetch product slug for cache revalidation
    const { data: product } = await supabase
      .from("products")
      .select("slug")
      .eq("id", id)
      .single();

    // 3. Delete product row (CASCADE deletes specifications & product_images)
    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return { success: false, error: deleteError.message };
    }

    // 4. Remove storage objects
    if (storagePathsToRemove.length > 0) {
      try {
        await supabase.storage.from("product-images").remove(storagePathsToRemove);
      } catch (storageErr) {
        console.warn("Could not remove storage files for deleted product:", storageErr);
      }
    }

    revalidatePath("/admin/products");
    revalidatePath("/products");
    if (product?.slug) {
      revalidatePath(`/products/${product.slug}`);
    }
    revalidatePath("/");

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete product.";
    return { success: false, error: message };
  }
}
