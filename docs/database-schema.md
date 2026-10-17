# Database Schema & Relational Design

## 1. Overview
The database is built on PostgreSQL via Supabase. All primary keys use UUIDs generated via `gen_random_uuid()` or `uuid-ossp`. Version control is maintained via SQL migrations under `supabase/migrations/20261016000000_initial_schema.sql`.

---

## 2. Entity Relationship Diagram (ERD)

```
       +-------------------------+
       |       auth.users        |
       +-------------------------+
                    | 1:1
                    v
       +-------------------------+
       |        profiles         |
       +-------------------------+
       | id (UUID, PK)           |
       | role ('customer'|'admin')
       | email, full_name        |
       +-------------------------+
                    |
                    | (referenced as created_by)
                    v
+-------------------+      1:N      +-----------------------------+
|    categories     |<------------->|          products           |
+-------------------+               +-----------------------------+
| id (UUID, PK)     |               | id (UUID, PK)               |
| name, slug (UQ)   |               | category_id (UUID, FK)      |
| description       |               | name, slug (UQ)             |
| is_active, order  |               | short_description, desc     |
+-------------------+               | status ('draft'|'published')|
                                    | featured (boolean)          |
                                    +-----------------------------+
                                      | 1:N                 | 1:N
                                      v                     v
                        +----------------------+ +-------------------------+
                        |    product_images    | | product_specifications  |
                        +----------------------+ +-------------------------+
                        | id (UUID, PK)        | | id (UUID, PK)           |
                        | product_id (FK)      | | product_id (FK)         |
                        | storage_path         | | label, value            |
                        | alt_text, is_primary | | sort_order              |
                        | sort_order           | +-------------------------+
                        +----------------------+
```

---

## 3. Table Definitions & Constraints

### A. `profiles`
Associates application roles with Supabase Auth users.
- `id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE`
- `role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin'))`
- `email TEXT`
- `full_name TEXT`
- `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`
- `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()`

**Triggers & Protections:**
- `on_auth_user_created`: Automatically inserts a profile on new auth signup, defaulting to `'customer'`. User-supplied metadata cannot influence the role.
- RLS Policy `profiles_update_own`: Prevents non-admins from self-promoting by checking that `role` remains identical to existing DB state unless caller is `is_admin()`.

### B. `categories`
Classifies surgical instruments (e.g., Laparoscopy, Orthopedics, Cardiovascular).
- `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- `name TEXT NOT NULL CHECK (length(trim(name)) > 0)`
- `slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')`
- `description TEXT`
- `is_active BOOLEAN NOT NULL DEFAULT true`
- `sort_order INTEGER NOT NULL DEFAULT 0`
- `created_at`, `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()`

**Indexes:**
- `idx_categories_slug` (UNIQUE)
- `idx_categories_is_active`
- `idx_categories_sort_order`

### C. `products`
The core surgical instrument catalogue entity.
- `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- `category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT`
- `name TEXT NOT NULL CHECK (length(trim(name)) > 0)`
- `slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')`
- `short_description TEXT`
- `description TEXT`
- `status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published'))`
- `featured BOOLEAN NOT NULL DEFAULT false`
- `created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL`
- `created_at`, `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()`

**Design Decisions:**
- **No Mandatory SKU:** Surgical B2B buyers search by clinical name and discipline; SKUs are not enforced.
- `ON DELETE RESTRICT` on `category_id`: Prevents cascading accidental deletion of products if a category is removed.
- **Indexes:** `idx_products_category`, `idx_products_slug`, `idx_products_status`, `idx_products_featured`, `idx_products_created_at`.

### D. `product_images`
Supports multiple clinical photographs per instrument.
- `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- `product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE`
- `storage_path TEXT NOT NULL CHECK (length(trim(storage_path)) > 0)`
- `alt_text TEXT`
- `sort_order INTEGER NOT NULL DEFAULT 0`
- `is_primary BOOLEAN NOT NULL DEFAULT false`
- `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`

**Design Decisions:**
- Stores relative object paths (e.g., `<product-id>/<uuid>.jpg`), not arbitrary client URLs.
- Cascades on product deletion. Associated Storage objects are cleaned up via Server Action routines.

### E. `product_specifications`
Dynamic engineering key-value parameters.
- `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- `product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE`
- `label TEXT NOT NULL CHECK (length(trim(label)) > 0)`
- `value TEXT NOT NULL CHECK (length(trim(value)) > 0)`
- `sort_order INTEGER NOT NULL DEFAULT 0`
- `created_at`, `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()`

---

## 4. Helper Function: `public.is_admin()`

```sql
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
```

### Security Hardening Rationale:
1. **`SECURITY DEFINER`**: Runs with elevated privileges so it can read `profiles.role` without exposing `profiles` write privileges to the caller.
2. **`SET search_path = public`**: Prevents search-path hijacking attacks where a malicious actor shadows built-in functions in a temporary schema.
3. **`STABLE`**: Lets the PostgreSQL query planner cache the result within a single query execution, optimizing performance across batch row checks.
4. **Execution Permissions**: `REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;` followed by explicit grant to `authenticated, anon;`.
