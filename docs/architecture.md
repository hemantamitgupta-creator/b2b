# System Architecture & Technical Design

## 1. Executive Summary
This platform is a specialized **B2B Surgical Instruments Catalogue & Quotation Platform** modeled for medical equipment manufacturers, hospitals, clinical networks, and surgical distributors. Unlike conventional consumer e-commerce stores, it facilitates institutional bulk enquiries, tender specifications, and customized instrument fabrication rather than retail cart checkout.

---

## 2. Component Boundaries & Responsibilities

```
+---------------------------------------------------------------------------------+
|                                 WEB BROWSER                                     |
|  Public Visitor / Buyer:               Administrator:                           |
|  - Server-Rendered Catalogue           - Protected Console (/admin/products)   |
|  - Dynamic Product Details & Specs     - Multi-Image Storage Uploader           |
|  - Responsive Product Image Gallery    - Dynamic Specifications Editor          |
|  - "Get Best Quote" Modal Gateway      - Category Management & Slugs            |
+---------------------------------------------------------------------------------+
                                      |
                            HTTP / Cookies / HTTPS
                                      v
+---------------------------------------------------------------------------------+
|                       NEXT.JS APP ROUTER (SERVER RUNTIME)                       |
|                                                                                 |
|  [Server Components]                                                            |
|  - /app/(public)/page.tsx          -> Server-rendered homepage & highlights     |
|  - /app/(public)/products/page.tsx -> Filtered catalogue with bounded queries   |
|  - /app/(public)/products/[slug]   -> Complete specs & SEO metadata             |
|                                                                                 |
|  [Server Actions & Services]                                                    |
|  - /app/actions/products.ts        -> Server-side Zod validation & mutations    |
|  - /app/actions/categories.ts      -> Foreign-key safe category management      |
|  - /app/actions/auth.ts            -> Administrator credentials verification    |
|  - /lib/auth/session.ts            -> requireAdmin() server authorization       |
|                                                                                 |
|  [Next.js Image Optimization]                                                   |
|  - next/image remotePatterns       -> On-demand sizing & responsive format      |
+---------------------------------------------------------------------------------+
                                      |
                      Supabase Client (anon key + cookies)
                                      v
+---------------------------------------------------------------------------------+
|                            SUPABASE / POSTGRESQL                                |
|                                                                                 |
|  [PostgreSQL Schema & Triggers]                                                 |
|  - profiles, categories, products, product_images, product_specifications       |
|  - handle_updated_at() & on_auth_user_created trigger (safe 'customer' role)    |
|                                                                                 |
|  [Row Level Security & Functions]                                               |
|  - public.is_admin() (SECURITY DEFINER with strict SET search_path = public)    |
|  - Selective SELECT policies: Public sees only published items & active cats    |
|  - Strict INSERT/UPDATE/DELETE policies: restricted to verified administrators  |
|                                                                                 |
|  [Supabase Storage]                                                             |
|  - Bucket 'product-images' (Public read; admin-only write/delete)               |
+---------------------------------------------------------------------------------+
```

---

## 3. Request Flow & Data Retrieval

### A. Public Visitor Browsing (Server-Side Rendering)
1. **Initial Hit (`/products/[slug]`):**
   - Next.js Server Component executes `getPublishedProductBySlug(slug)`.
   - The query executes against Supabase PostgreSQL using the public client.
   - Database Row Level Security (RLS) ensures only products with `status = 'published'` and an active parent category are returned.
   - Specifications and images are joined efficiently in a single database request.
   - HTML is streamed to the browser with complete metadata and zero client-side layout shift.
2. **Draft / Inactive Protection:**
   - If the requested slug is a draft or belongs to an inactive category, the database query returns null.
   - The Server Component calls Next.js `notFound()`, rendering a clinical 404 screen without leaking draft IDs or administrative metadata.

### B. Administrative Mutation Workflow
1. **Authentication:**
   - Administrator signs in at `/admin/login` using email and password.
   - `loginAction` verifies credentials with Supabase Auth, checks `profiles.role === 'admin'`, and establishes secure HTTP-only cookies via `@supabase/ssr`.
2. **Authorization Boundary:**
   - Client layout (`/admin/(dashboard)/layout.tsx`) validates the session server-side using `getCurrentAuth()`.
   - Every mutation in Server Actions (`createProductAction`, `updateProductAction`, `toggleProductStatusAction`, `deleteProductAction`) independently invokes `requireAdmin()`.
   - The database RLS policy independently validates `public.is_admin()` during SQL execution.
3. **Storage Asset Flow:**
   - Admin selects images; browser client validates MIME type (JPEG, PNG, WebP) and size (< 5MB).
   - Images upload directly to bucket `product-images` at path `<productId>/<timestamp>-<rand>.<ext>`.
   - Storage RLS validates the admin session on every upload.
4. **Cache Invalidation:**
   - Upon successful database mutation, `revalidatePath` selectively refreshes affected public pages (`/`, `/products`, `/products/[slug]`).

---

## 4. Security Boundaries

| Layer | Responsibility | Mechanism |
|---|---|---|
| **Network & Secrets** | Protect privileged infrastructure keys | Service-role keys are omitted from client code; only anon publishable keys are exposed. |
| **Authentication** | Establish identity | Supabase Auth with secure cookie management (`@supabase/ssr`). |
| **Server Actions** | Verify application role & sanitize data | Independent `requireAdmin()` check and Zod schema parsing before database calls. |
| **Database RLS** | Enforce zero-trust data access | Hardened PostgreSQL RLS on all 5 application tables and `storage.objects`. |
| **Storage Policies** | Control public assets | Public SELECT on `product-images`; admin-only INSERT, UPDATE, DELETE. |
