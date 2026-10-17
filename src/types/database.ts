export type UserRole = "customer" | "admin";
export type ProductStatus = "draft" | "published";

export interface Profile {
  id: string;
  role: UserRole;
  email: string | null;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  status: ProductStatus;
  featured: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  storage_path: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface ProductSpecification {
  id: string;
  product_id: string;
  label: string;
  value: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductWithRelations extends Product {
  category?: Category;
  images?: ProductImage[];
  specifications?: ProductSpecification[];
}

export interface CategoryWithCount extends Category {
  product_count?: number;
}
