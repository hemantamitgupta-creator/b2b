# Future Roadmap & Architectural Specifications

This document specifies the technical design, security controls, and provider integration boundaries for future milestones. These workflows have been intentionally architected to integrate cleanly into the existing catalogue foundation without refactoring or breaking existing contracts.

---

## Phase A: Mobile Phone Verification via SMS OTP

### 1. Business & UX Objective
When a prospective hospital buyer or surgical distributor clicks **"Get Best Quote"** on an instrument page, the system verifies their phone number before granting access to institutional volume pricing or tender submission.

### 2. Provider Integration Boundary
The OTP provider interface will be abstracted behind an adapter pattern so the business can switch between SMS providers (e.g. Twilio, MSG91, AWS SNS) without altering application code:

```typescript
// Proposed Interface: src/lib/sms/types.ts
export interface SmsOtpProvider {
  sendOtp(phoneNumber: string, otp: string): Promise<{ success: boolean; messageId?: string; error?: string }>;
}
```

### 3. Verification Protocol & Abuse Protections
- **No Client Fakes:** OTP generation and validation occur exclusively on the server. The plain-text OTP is never transmitted to the browser.
- **Hashing & Expiry:** Generated OTPs are hashed using SHA-256 with a salt before storage in PostgreSQL (`otp_verifications` table) with a 5-minute TTL (`expires_at`).
- **Rate-Limiting & Throttling:**
  - Max 3 OTP requests per phone number per 15-minute window.
  - Max 5 failed submission attempts before locking the verification challenge.
  - IP-based rate limiting via Next.js Middleware / Upstash Redis.
- **Non-Account Verification:** Phone verification confirms prospective buyer authenticity without forcing them to register a traditional customer account or password.

---

## Phase B: Quotation Request Submission

### 1. Database Schema Additions

```sql
CREATE TABLE public.quotation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_phone TEXT NOT NULL,
  organization_type TEXT CHECK (organization_type IN ('hospital', 'distributor', 'clinic', 'oem', 'individual')),
  organization_name TEXT,
  estimated_quantity INTEGER NOT NULL CHECK (estimated_quantity > 0),
  custom_specifications TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'quoted', 'declined')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.quotation_requests ENABLE ROW LEVEL SECURITY;

-- Security Rule: Prospective buyers can only insert their own quote; NEVER read others' enquiries.
CREATE POLICY "Public insert quotation request"
  ON public.quotation_requests FOR INSERT
  WITH CHECK (true);

-- Security Rule: Only verified administrators can view and process quotations.
CREATE POLICY "Admin view quotation requests"
  ON public.quotation_requests FOR SELECT
  USING (public.is_admin());
```

### 2. Submission Security & Integrity
- **Double-Click Idempotency:** Client disables submit button and creates an idempotency key to prevent accidental duplicate submissions.
- **Data Privacy:** Public visitors have ZERO SELECT permissions on `quotation_requests`. One customer can never view another hospital's procurement inquiries.

---

## Phase C: Automated Seller Notifications

### 1. Real-Time Multi-Channel Alerts
Upon successful quotation creation:
1. **Transactional Email:** Sent to the sales desk (`procurement@kraftsurgicals.in`) via Resend or AWS SES with full instrument specifications, requested quantity, and verified phone number.
2. **WhatsApp Business Integration:**
   - Webhook trigger to the WhatsApp Cloud API (Meta for Business) sending an approved template notification to the on-duty sales manager.
3. **Failure Isolation:** Notification delivery failures are queued in a retry table (`notification_jobs`) and logged; a failure in email delivery does NOT rollback or lose the saved customer quotation.

---

## Phase D: Enquiry & Lead Management Dashboard

### 1. Admin Features (`/admin/quotations`)
- Real-time tabular view of inbound quotation requests with status badges (`Pending`, `Quoted`, `Follow-up`).
- Filter by surgical discipline, date range, and organization type.
- Export to CSV / Excel for ERP integration.
- Direct quick-actions: "Call Buyer" (tel link), "Generate Official PDF Quotation", and "Assign Sales Rep".
