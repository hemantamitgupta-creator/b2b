# B2B Surgical Instruments Catalogue & Quotation Platform

A modern, production-minded B2B surgical instruments catalogue and lead-generation platform built for surgical equipment manufacturers, hospitals, clinical networks, and surgical distributors.

---

## 1. Key Capabilities & Architectural Highlights

- **Server-Rendered Catalogue & Fast SSR:** Public pages (`/`, `/products`, `/products/[slug]`) stream pre-rendered HTML with optimized Next.js Image delivery, preventing layout shifts and eliminating unnecessary client-side fetch waterfalls.
- **Dynamic Technical Specifications:** Flexible engineering parameters (e.g. *Working Length*, *Jaw Design*, *Shaft Diameter*, *Dielectric Breakdown*, *Material Grade*) dynamically managed by administrators without rigid schema locks.
- **Multi-Image Storage Management:** Clinical photograph uploads to Supabase Storage with client MIME validation, file-size limits (5MB), primary image selection, and manual ordering.
- **Hardened Zero-Trust Security:** Strict PostgreSQL Row Level Security (RLS) on all application tables and Storage objects. Public queries only return published products in active categories. Direct unauthorized write/delete attempts are rejected at the database level.
- **Administrator Role & Safe Bootstrap:** Admin routes and Server Actions verify identity server-side via `requireAdmin()`. Self-promotion is structurally prevented in RLS policies.
- **B2B Quotation Experience:** Dedicated "Get Best Quote" gateway with institutional quotation desk guidance, anticipating future mobile SMS OTP workflows.

---

## 2. Technology Stack

- **Framework:** Next.js 16 (App Router with Turbopack)
- **Frontend & UI:** React 19, TypeScript (strict mode), Tailwind CSS v4, Lucide Icons
- **Database & Storage:** Supabase PostgreSQL, Supabase Storage (`product-images`), Supabase Auth
- **Server Authentication:** `@supabase/ssr` (asynchronous Next.js cookie handling)
- **Validation:** Zod v4 (server and client schema enforcement)

---

## 3. Prerequisites & Installation

### Required Software
- **Node.js:** v18+ (tested on Node.js v25.1.0)
- **npm:** v9+ (tested on npm 11.8.0)
- **A Supabase Project:** Cloud instance ([supabase.com](https://supabase.com)) or local CLI instance.

### Installation Steps
```bash
# Clone or navigate to the repository directory
cd "c:\Users\HEMANT GUPTA\Documents\B2B"

# Install all dependencies
npm install
```

---

## 4. Environment Configuration

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Open `.env.local` and configure your Supabase project keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-publishable-key
   ```
   > **Security Note:** Never add your `SUPABASE_SERVICE_ROLE_KEY` to client-side files or prefix it with `NEXT_PUBLIC_`. The application runs securely using the public publishable key governed by Row Level Security.

---

## 5. Database Setup & SQL Migrations

The complete database schema, constraints, indexes, triggers, and Row Level Security policies are version-controlled in `supabase/migrations/20261016000000_initial_schema.sql`.

### Option A: Via Supabase Web Dashboard (Recommended)
1. Open your Supabase Project Dashboard.
2. In the left navigation, click **SQL Editor**.
3. Click **New Query**, paste the entire contents of [`supabase/migrations/20261016000000_initial_schema.sql`](file:///c:/Users/HEMANT%20GUPTA/Documents/B2B/supabase/migrations/20261016000000_initial_schema.sql), and click **Run**.
4. (Optional) To populate realistic surgical categories and demonstration instruments, paste and execute [`supabase/seed.sql`](file:///c:/Users/HEMANT%20GUPTA/Documents/B2B/supabase/seed.sql).

### Option B: Via Supabase CLI
```bash
supabase db push
```

---

## 6. Initial Administrator Bootstrap Procedure

For security, self-service administrator signup is intentionally disabled. Normal signups receive the safe default role `'customer'` and cannot elevate themselves.

Follow these steps to establish your initial administrator:

1. **Create the Auth User in Supabase Dashboard:**
   - Go to **Authentication** -> **Users** -> **Add User** -> **Create user**.
   - Enter your administrator email (e.g. `admin@kraftsurgicals.in`) and a secure password.
   - Check **Auto Confirm User** so no email confirmation is required.

2. **Promote the User to Administrator:**
   - Go to the **SQL Editor** in Supabase and run:
     ```sql
     -- Promote user to 'admin' by email
     UPDATE public.profiles
     SET role = 'admin'
     WHERE email = 'admin@kraftsurgicals.in';
     ```
   - Verify the promotion:
     ```sql
     SELECT id, email, role, full_name FROM public.profiles WHERE role = 'admin';
     ```

3. **Log in to the Admin Portal:**
   - Navigate to `http://localhost:3000/admin/login` and sign in with the promoted credentials.

---

## 7. Running the Platform Locally

Start the local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser:
- Public Homepage: `http://localhost:3000/`
- Surgical Instruments Catalogue: `http://localhost:3000/products`
- Admin Console: `http://localhost:3000/admin/products`
- Admin Categories: `http://localhost:3000/admin/categories`

---

## 8. End-to-End Workflow Walkthrough

1. **Sign In as Administrator:**
   - Visit `/admin/login` and log in with your admin credentials.
2. **Create a Surgical Category:**
   - Navigate to `/admin/categories`.
   - Click **New Category**, enter "Laparoscopic Instruments", slug "laparoscopic-instruments", and click **Create Category**.
3. **Create a Surgical Instrument with Specifications & Images:**
   - Navigate to `/admin/products/new`.
   - Enter the product name, select your category, and write an overview.
   - Upload high-resolution photos in the **Product Images** section; mark one as primary.
   - In **Technical Specifications**, click **Add Parameter** and enter engineering values (e.g., `Shaft Diameter: 5.0 mm`, `Working Length: 330 mm`).
4. **Publish or Save as Draft:**
   - Click **Save as Draft** to keep the instrument private, or **Publish to Catalogue** to make it immediately visible.
   - Notice: The system strictly blocks publishing unless at least one image is uploaded.
5. **Verify as Public Anonymous Visitor:**
   - Open an Incognito window and visit `/products`.
   - Observe your published product card with optimized responsive image, category badge, and name.
   - Click the card to open `/products/[slug]`. Verify the interactive image gallery and engineering specifications table.
   - Click **Get Best Quote** to view the institutional quotation gateway modal.
   - Try accessing a draft product's slug: the system returns a 404 response without exposing private data.

---

## 9. Quality & Validation Checks

The repository includes a complete validation suite:

```bash
# Run unit tests (Zod validation, publication rules, slug generation, storage limits)
npm test

# Run TypeScript strict type-check
npm run type-check

# Run ESLint check
npm run lint

# Run production build
npm run build
```

---

## 10. Documentation Directory

- [`docs/architecture.md`](file:///c:/Users/HEMANT%20GUPTA/Documents/B2B/docs/architecture.md): Request flow, component boundaries, and security layers.
- [`docs/database-schema.md`](file:///c:/Users/HEMANT%20GUPTA/Documents/B2B/docs/database-schema.md): Schema tables, relational integrity, constraints, and `is_admin()` design.
- [`docs/security-test-plan.md`](file:///c:/Users/HEMANT%20GUPTA/Documents/B2B/docs/security-test-plan.md): Step-by-step verification across Anonymous, Customer, and Admin personas.
- [`docs/future-roadmap.md`](file:///c:/Users/HEMANT%20GUPTA/Documents/B2B/docs/future-roadmap.md): Architectural specifications for SMS OTP verification, quotation submissions, and seller alerts.

---

## 11. Known Limitations & Roadmap Context

1. **SMS OTP Gateway:** In Milestone 1, the "Get Best Quote" button opens an institutional quotation guidance modal. Direct SMS OTP delivery is architected in [`docs/future-roadmap.md`](file:///c:/Users/HEMANT%20GUPTA/Documents/B2B/docs/future-roadmap.md) and will be implemented once the client selects an SMS provider.
2. **Image CDN:** Images are served directly via Supabase Storage with Next.js image optimization. Cloudinary is not used in this milestone.
#   b 2 b  
 #   b 2 b  
 