import { createClient } from "@/lib/supabase/server";
import { Category } from "@/types";

/**
 * Public query: Fetch active categories for navigation and catalogue filters.
 * Returns only active categories ordered by sort_order.
 */
export async function getActiveCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug, description, is_active, sort_order, created_at, updated_at")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      console.error("getActiveCategories error:", error.message);
      return [];
    }

    return (data as Category[]) || [];
  } catch (error) {
    console.error("getActiveCategories exception:", error);
    return [];
  }
}

/**
 * Public query: Fetch a single active category by its URL slug.
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug, description, is_active, sort_order, created_at, updated_at")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error || !data) {
      return null;
    }

    return data as Category;
  } catch {
    return null;
  }
}

/**
 * Admin query: Fetch all categories (active & inactive) for management.
 */
export async function getAllCategoriesAdmin(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      console.error("getAllCategoriesAdmin error:", error.message);
      return [];
    }

    return (data as Category[]) || [];
  } catch (error) {
    console.error("getAllCategoriesAdmin exception:", error);
    return [];
  }
}

/**
 * Admin query: Fetch category by ID.
 */
export async function getCategoryByIdAdmin(id: string): Promise<Category | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return null;
    }

    return data as Category;
  } catch {
    return null;
  }
}
