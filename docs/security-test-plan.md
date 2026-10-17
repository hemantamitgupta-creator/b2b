# Security Verification & Test Plan

## 1. Objectives & Threat Model
Security is enforced at the database (PostgreSQL Row Level Security) and server runtime (Next.js Server Actions with role verification). Hiding a button in the frontend is not security. Direct API and SQL requests must be firmly rejected.

This test plan defines verification procedures across three principal personas:
1. **Anonymous Visitor (Unauthenticated)**
2. **Authenticated Non-Admin User (Customer Role)**
3. **Authorized Administrator (Admin Role)**

---

## 2. Test Matrix & Verification Scenarios

| Test Case | Actor | Action Under Test | Expected Result | Policy / Code Enforcing |
|---|---|---|---|---|
| **SEC-01** | Anonymous Visitor | Query `/products` catalogue | Sees only `status = 'published'` and active categories. | RLS `products_public_select` |
| **SEC-02** | Anonymous Visitor | Access `/products/[slug]` of a **draft** product directly | Returns HTTP 404 (Not Found). No draft metadata or image links leaked. | RLS + `getPublishedProductBySlug` + `notFound()` |
| **SEC-03** | Anonymous Visitor | Access `/products/[slug]` of a product in an **inactive** category | Returns HTTP 404. | RLS `products_public_select` |
| **SEC-04** | Anonymous Visitor | Direct SQL / PostgREST INSERT into `products` or `categories` | REJECTED: HTTP 401/403 or RLS empty response. | RLS `products_admin_insert` |
| **SEC-05** | Anonymous Visitor | Direct upload to Supabase Storage bucket `product-images` | REJECTED: HTTP 403 Forbidden. | Storage Policy `Admin Upload Product Images` |
| **SEC-06** | Authenticated Non-Admin | Navigate to `/admin/products` or `/admin/categories` | Redirected to `/admin/login` (Server-side session check). | `/admin/(dashboard)/layout.tsx` |
| **SEC-07** | Authenticated Non-Admin | Invoke Server Action `createProductAction` or `deleteProductAction` directly | Throws `"Forbidden: Administrator privileges required"`. Action returns `{ success: false }`. | `requireAdmin()` in `src/lib/auth/session.ts` |
| **SEC-08** | Authenticated Non-Admin | Attempt to alter profile role to `'admin'` via SQL UPDATE | REJECTED: RLS `WITH CHECK` condition prevents self-promotion. | RLS `profiles_update_own` |
| **SEC-09** | Authenticated Non-Admin | Delete another product's image from `storage.objects` | REJECTED: HTTP 403 Forbidden. | Storage Policy `Admin Delete Product Images` |
| **SEC-10** | Authorized Admin | Create, edit, toggle draft/publish, and delete products | ALLOWED. Successfully persists to PostgreSQL and triggers path revalidation. | RLS admin policies + `requireAdmin()` |
| **SEC-11** | Authorized Admin | Attempt to publish a product without any images | REJECTED by Zod validation with error `"Publishing requires at least one product image."` | `productSchema.superRefine()` |
| **SEC-12** | Authorized Admin | Upload clinical instrument photos (JPEG, PNG, WebP < 5MB) | ALLOWED. Stored in organized path `<product-id>/<uuid>.<ext>`. | Storage Policy `Admin Upload Product Images` |

---

## 3. Practical Step-by-Step Verification Procedures

### Scenario A: Anonymous Visitor Draft Inspection Attempt
1. Ensure the seed data is loaded (`supabase/seed.sql`).
2. Notice seed product `p6666666-6666-6666-6666-666666666666` has slug `prototype-articulating-endoscopic-needle-driver` and `status = 'draft'`.
3. Open a browser in Incognito / Private mode without logging in.
4. Navigate directly to `http://localhost:3000/products/prototype-articulating-endoscopic-needle-driver`.
5. **Expected Outcome:** The page renders the custom 404 page ("Instrument Not Found"). The browser network tab reveals an HTTP 404 status. No draft instrument name, description, or image URLs are present in HTML source.

### Scenario B: Unauthorized Image Upload to Supabase Storage
1. In the browser developer console (as an anonymous user or non-admin):
   ```javascript
   const { createClient } = await import('@supabase/supabase-js');
   const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_ANON_KEY');
   const fakeFile = new Blob(['malicious payload'], { type: 'image/png' });
   const { data, error } = await supabase.storage
     .from('product-images')
     .upload('hacked/test.png', fakeFile);
   console.log('Result:', { data, error });
   ```
2. **Expected Outcome:** `error` is returned with status 400/403: `"new row violates row-level security policy for table objects"`. The upload is blocked at the database level.

### Scenario C: Role Self-Promotion Attempt
1. Create a standard customer user through Supabase Auth (or test with a non-admin session).
2. Execute a direct UPDATE to elevate the role:
   ```javascript
   const { data, error } = await supabase
     .from('profiles')
     .update({ role: 'admin' })
     .eq('id', (await supabase.auth.getUser()).data.user.id);
   console.log('Result:', { data, error });
   ```
3. **Expected Outcome:** The query fails or the row is unmodified because `profiles_update_own` checks:
   `role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid()) OR public.is_admin()`

### Scenario D: Publishing Validation Enforcement
1. Log in as an administrator at `/admin/login`.
2. Navigate to `/admin/products/new`.
3. Fill in product name and category, but do not upload any images.
4. Click "Publish to Catalogue".
5. **Expected Outcome:** The form rejects submission and displays:
   `"Publishing requires at least one product image."`
   The product cannot be published in an incomplete state.
