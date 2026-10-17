-- ==============================================================================
-- B2B Surgical Instruments Catalogue & Quotation Platform
-- Initial Schema Migration: Tables, Constraints, Triggers, RLS, & Storage Policies
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Helper function to maintain updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- 3. PROFILES TABLE
-- Associates application roles with Supabase Auth users.
-- Role is constrained to 'customer' and 'admin'. Default role is 'customer'.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger to maintain profiles.updated_at
CREATE TRIGGER tr_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Safe SECURITY DEFINER helper to verify administrator identity
-- Configured with an explicit search_path to prevent search-path hijacking attacks.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;

-- Auto-create profile on auth.users creation (default role: 'customer' - never user-supplied!)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    'customer' -- Safe default: promotions must be done explicitly via trusted admin procedure
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop existing trigger if re-running
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies:
-- Users can view their own profile; admins can view all profiles
CREATE POLICY "profiles_select_own_or_admin"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

-- Users can update their own full_name, but CANNOT alter their own role
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND (
      -- If the user is not an admin, the role must remain unchanged
      role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid())
      OR public.is_admin()
    )
  );

-- Admins can update any profile (e.g. promoting users)
CREATE POLICY "profiles_admin_update"
  ON public.profiles FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 4. CATEGORIES TABLE
-- Represents surgical instrument classifications (e.g., Laparoscopy, Orthopedic, ENT)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (length(trim(name)) > 0),
  slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON public.categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON public.categories(sort_order);

CREATE TRIGGER tr_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Category Policies:
-- Public visitors can only view active categories
CREATE POLICY "categories_public_select"
  ON public.categories FOR SELECT
  USING (is_active = true);

-- Admins can view all categories (including inactive)
CREATE POLICY "categories_admin_select"
  ON public.categories FOR SELECT
  USING (public.is_admin());

-- Admin mutations
CREATE POLICY "categories_admin_insert"
  ON public.categories FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "categories_admin_update"
  ON public.categories FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "categories_admin_delete"
  ON public.categories FOR DELETE
  USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- 5. PRODUCTS TABLE
-- Surgical instruments with draft/published state. No mandatory SKU/product code.
-- ON DELETE RESTRICT prevents cascading deletion when products exist in a category.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  name TEXT NOT NULL CHECK (length(trim(name)) > 0),
  slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  short_description TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  featured BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);

CREATE TRIGGER tr_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Product Policies:
-- Public can view only published products in active categories
CREATE POLICY "products_public_select"
  ON public.products FOR SELECT
  USING (
    status = 'published' AND
    EXISTS (
      SELECT 1 FROM public.categories c
      WHERE c.id = products.category_id AND c.is_active = true
    )
  );

-- Admins can view all products
CREATE POLICY "products_admin_select"
  ON public.products FOR SELECT
  USING (public.is_admin());

-- Admin mutations
CREATE POLICY "products_admin_insert"
  ON public.products FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "products_admin_update"
  ON public.products FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "products_admin_delete"
  ON public.products FOR DELETE
  USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- 6. PRODUCT IMAGES TABLE
-- Multiple images per instrument with primary designation and sort order.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL CHECK (length(trim(storage_path)) > 0),
  alt_text TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_primary ON public.product_images(product_id, is_primary);
CREATE INDEX IF NOT EXISTS idx_product_images_sort ON public.product_images(product_id, sort_order);

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- Image Policies:
-- Public can only see images for published products in active categories
CREATE POLICY "product_images_public_select"
  ON public.product_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      JOIN public.categories c ON p.category_id = c.id
      WHERE p.id = product_images.product_id
        AND p.status = 'published'
        AND c.is_active = true
    )
  );

-- Admins can view all image metadata
CREATE POLICY "product_images_admin_select"
  ON public.product_images FOR SELECT
  USING (public.is_admin());

-- Admin mutations
CREATE POLICY "product_images_admin_insert"
  ON public.product_images FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "product_images_admin_update"
  ON public.product_images FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "product_images_admin_delete"
  ON public.product_images FOR DELETE
  USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- 7. PRODUCT SPECIFICATIONS TABLE
-- Flexible key-value technical specifications for surgical instruments.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_specifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  label TEXT NOT NULL CHECK (length(trim(label)) > 0),
  value TEXT NOT NULL CHECK (length(trim(value)) > 0),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_specs_product ON public.product_specifications(product_id);
CREATE INDEX IF NOT EXISTS idx_product_specs_sort ON public.product_specifications(product_id, sort_order);

CREATE TRIGGER tr_product_specifications_updated_at
  BEFORE UPDATE ON public.product_specifications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.product_specifications ENABLE ROW LEVEL SECURITY;

-- Specifications Policies:
-- Public can only view specs for published products in active categories
CREATE POLICY "product_specs_public_select"
  ON public.product_specifications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      JOIN public.categories c ON p.category_id = c.id
      WHERE p.id = product_specifications.product_id
        AND p.status = 'published'
        AND c.is_active = true
    )
  );

-- Admins can view all specs
CREATE POLICY "product_specs_admin_select"
  ON public.product_specifications FOR SELECT
  USING (public.is_admin());

-- Admin mutations
CREATE POLICY "product_specs_admin_insert"
  ON public.product_specifications FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "product_specs_admin_update"
  ON public.product_specifications FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "product_specs_admin_delete"
  ON public.product_specifications FOR DELETE
  USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- 8. STORAGE BUCKET & STORAGE RLS POLICIES
-- Bucket: 'product-images' (public read, admin write/delete)
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public can read assets from 'product-images'
CREATE POLICY "Public Read Product Images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Only verified administrators can upload to 'product-images'
CREATE POLICY "Admin Upload Product Images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

-- Only verified administrators can update assets in 'product-images'
CREATE POLICY "Admin Update Product Images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images' AND public.is_admin())
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

-- Only verified administrators can delete assets from 'product-images'
CREATE POLICY "Admin Delete Product Images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND public.is_admin());
