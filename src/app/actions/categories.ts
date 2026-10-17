"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/session";
import { categorySchema, CategoryFormData } from "@/lib/validations/category";
import { revalidatePath } from "next/cache";

export interface CategoryActionResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function createCategoryAction(
  data: CategoryFormData
): Promise<CategoryActionResult> {
  try {
    await requireAdmin();

    const validated = categorySchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: "Validation failed. Please verify the category information.",
        fieldErrors: validated.error.flatten().fieldErrors,
      };
    }

    const supabase = await createClient();

    // Check slug uniqueness
    const { data: existing } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", validated.data.slug)
      .maybeSingle();

    if (existing) {
      return {
        success: false,
        error: `A category with the slug '${validated.data.slug}' already exists.`,
      };
    }

    const { error: insertError } = await supabase
      .from("categories")
      .insert({
        name: validated.data.name,
        slug: validated.data.slug,
        description: validated.data.description || null,
        is_active: validated.data.is_active,
        sort_order: validated.data.sort_order,
      });

    if (insertError) {
      console.error("Create category error:", insertError.message);
      return { success: false, error: insertError.message };
    }

    revalidatePath("/admin/categories");
    revalidatePath("/products");
    revalidatePath("/");

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create category.";
    return { success: false, error: message };
  }
}

export async function updateCategoryAction(
  id: string,
  data: CategoryFormData
): Promise<CategoryActionResult> {
  try {
    await requireAdmin();

    const validated = categorySchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: "Validation failed. Please check form fields.",
        fieldErrors: validated.error.flatten().fieldErrors,
      };
    }

    const supabase = await createClient();

    // Check slug uniqueness across other categories
    const { data: existing } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", validated.data.slug)
      .neq("id", id)
      .maybeSingle();

    if (existing) {
      return {
        success: false,
        error: `A category with the slug '${validated.data.slug}' already exists.`,
      };
    }

    const { error: updateError } = await supabase
      .from("categories")
      .update({
        name: validated.data.name,
        slug: validated.data.slug,
        description: validated.data.description || null,
        is_active: validated.data.is_active,
        sort_order: validated.data.sort_order,
      })
      .eq("id", id);

    if (updateError) {
      console.error("Update category error:", updateError.message);
      return { success: false, error: updateError.message };
    }

    revalidatePath("/admin/categories");
    revalidatePath("/products");
    revalidatePath("/");

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update category.";
    return { success: false, error: message };
  }
}

export async function toggleCategoryActiveAction(
  id: string,
  is_active: boolean
): Promise<CategoryActionResult> {
  try {
    await requireAdmin();

    const supabase = await createClient();
    const { error } = await supabase
      .from("categories")
      .update({ is_active })
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/categories");
    revalidatePath("/products");
    revalidatePath("/");

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to toggle category status.";
    return { success: false, error: message };
  }
}

export async function deleteCategoryAction(
  id: string
): Promise<CategoryActionResult> {
  try {
    await requireAdmin();

    const supabase = await createClient();

    // Check if category has associated products
    const { count, error: countError } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("category_id", id);

    if (countError) {
      return { success: false, error: countError.message };
    }

    if (count && count > 0) {
      return {
        success: false,
        error: `Cannot delete category: it is referenced by ${count} product(s). Please deactivate the category or reassign the products first.`,
      };
    }

    const { error: deleteError } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return { success: false, error: deleteError.message };
    }

    revalidatePath("/admin/categories");
    revalidatePath("/products");
    revalidatePath("/");

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete category.";
    return { success: false, error: message };
  }
}
