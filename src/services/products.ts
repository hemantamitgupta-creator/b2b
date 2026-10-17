import { createClient } from "@/lib/supabase/server";
import { ProductWithRelations } from "@/types";

export interface GetProductsOptions {
  categorySlug?: string;
  search?: string;
  featuredOnly?: boolean;
  limit?: number;
  offset?: number;
}

/**
 * Public query: Fetch published products with joined category and images.
 * Only returns products with status='published' and an active category.
 * Bounded with pagination.
 */
export async function getPublishedProducts(
  options: GetProductsOptions = {}
): Promise<{ products: ProductWithRelations[]; total: number }> {
  const { categorySlug, search, featuredOnly, limit = 24, offset = 0 } = options;

  try {
    const supabase = await createClient();

    let query = supabase
      .from("products")
      .select(
        `
        id,
        category_id,
        name,
        slug,
        short_description,
        description,
        status,
        featured,
        created_at,
        updated_at,
        category:categories!inner (
          id,
          name,
          slug,
          is_active
        ),
        images:product_images (
          id,
          storage_path,
          alt_text,
          sort_order,
          is_primary
        )
      `,
        { count: "exact" }
      )
      .eq("status", "published")
      .eq("category.is_active", true);

    if (featuredOnly) {
      query = query.eq("featured", true);
    }

    if (categorySlug) {
      query = query.eq("category.slug", categorySlug);
    }

    if (search && search.trim().length > 0) {
      query = query.ilike("name", `%${search.trim()}%`);
    }

    query = query
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, count, error } = await query;

    if (error) {
      console.error("getPublishedProducts query error:", error.message);
      return { products: [], total: 0 };
    }

    // Sort images for each product so primary image is first
    const products = (data as unknown as ProductWithRelations[]).map((p) => {
      const sortedImages = (p.images || []).sort((a, b) => {
        if (a.is_primary && !b.is_primary) return -1;
        if (!a.is_primary && b.is_primary) return 1;
        return a.sort_order - b.sort_order;
      });
      return { ...p, images: sortedImages };
    });

    return {
      products,
      total: count || 0,
    };
  } catch (error) {
    console.error("getPublishedProducts exception:", error);
    return { products: [], total: 0 };
  }
}

/**
 * Public query: Fetch a single published product by slug with images and specifications.
 * Enforces status='published' and category.is_active=true.
 */
export async function getPublishedProductBySlug(
  slug: string
): Promise<ProductWithRelations | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select(
        `
        id,
        category_id,
        name,
        slug,
        short_description,
        description,
        status,
        featured,
        created_at,
        updated_at,
        category:categories!inner (
          id,
          name,
          slug,
          is_active
        ),
        images:product_images (
          id,
          product_id,
          storage_path,
          alt_text,
          sort_order,
          is_primary,
          created_at
        ),
        specifications:product_specifications (
          id,
          product_id,
          label,
          value,
          sort_order,
          created_at,
          updated_at
        )
      `
      )
      .eq("slug", slug)
      .eq("status", "published")
      .eq("category.is_active", true)
      .single();

    if (error || !data) {
      return null;
    }

    const product = data as unknown as ProductWithRelations;

    // Sort images (primary first, then sort_order)
    if (product.images) {
      product.images.sort((a, b) => {
        if (a.is_primary && !b.is_primary) return -1;
        if (!a.is_primary && b.is_primary) return 1;
        return a.sort_order - b.sort_order;
      });
    }

    // Sort specifications by sort_order
    if (product.specifications) {
      product.specifications.sort((a, b) => a.sort_order - b.sort_order);
    }

    return product;
  } catch (error) {
    console.error("getPublishedProductBySlug exception:", error);
    return null;
  }
}

/**
 * Public query: Fetch related products in the same category.
 */
export async function getRelatedProducts(
  categoryId: string,
  excludeProductId: string,
  limit = 4
): Promise<ProductWithRelations[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select(
        `
        id,
        category_id,
        name,
        slug,
        short_description,
        status,
        featured,
        images:product_images (
          id,
          storage_path,
          alt_text,
          is_primary,
          sort_order
        )
      `
      )
      .eq("status", "published")
      .eq("category_id", categoryId)
      .neq("id", excludeProductId)
      .limit(limit);

    if (error || !data) {
      return [];
    }

    return data as unknown as ProductWithRelations[];
  } catch {
    return [];
  }
}

/**
 * Admin query: Fetch all products with category and images for dashboard management.
 */
export async function getAllProductsAdmin(): Promise<ProductWithRelations[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select(
        `
        id,
        category_id,
        name,
        slug,
        short_description,
        description,
        status,
        featured,
        created_at,
        updated_at,
        category:categories (
          id,
          name,
          slug,
          is_active
        ),
        images:product_images (
          id,
          storage_path,
          alt_text,
          sort_order,
          is_primary
        )
      `
      )
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("getAllProductsAdmin error:", error.message);
      return [];
    }

    return (data as unknown as ProductWithRelations[]) || [];
  } catch (error) {
    console.error("getAllProductsAdmin exception:", error);
    return [];
  }
}

/**
 * Admin query: Fetch full product details by ID for the admin editor.
 */
export async function getProductByIdAdmin(
  id: string
): Promise<ProductWithRelations | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select(
        `
        id,
        category_id,
        name,
        slug,
        short_description,
        description,
        status,
        featured,
        created_at,
        updated_at,
        category:categories (
          id,
          name,
          slug
        ),
        images:product_images (
          id,
          product_id,
          storage_path,
          alt_text,
          sort_order,
          is_primary
        ),
        specifications:product_specifications (
          id,
          product_id,
          label,
          value,
          sort_order
        )
      `
      )
      .eq("id", id)
      .single();

    if (error || !data) {
      return null;
    }

    const product = data as unknown as ProductWithRelations;
    if (product.images) {
      product.images.sort((a, b) => a.sort_order - b.sort_order);
    }
    if (product.specifications) {
      product.specifications.sort((a, b) => a.sort_order - b.sort_order);
    }

    return product;
  } catch {
    return null;
  }
}
