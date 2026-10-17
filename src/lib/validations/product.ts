import { z } from "zod";

export const specificationSchema = z.object({
  id: z.string().optional(),
  label: z
    .string()
    .trim()
    .min(1, "Specification label is required")
    .max(100, "Specification label cannot exceed 100 characters"),
  value: z
    .string()
    .trim()
    .min(1, "Specification value is required")
    .max(255, "Specification value cannot exceed 255 characters"),
  sort_order: z.coerce.number().int().default(0),
});

export const productImageSchema = z.object({
  id: z.string().optional(),
  storage_path: z.string().min(1, "Storage path is required"),
  alt_text: z.string().max(255).optional().nullable(),
  is_primary: z.boolean().default(false),
  sort_order: z.coerce.number().int().default(0),
});

export const productSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Product name must be at least 2 characters")
      .max(200, "Product name cannot exceed 200 characters"),
    slug: z
      .string()
      .min(2, "Slug must be at least 2 characters")
      .max(220, "Slug cannot exceed 220 characters")
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
    category_id: z.string().uuid("Please select a valid category"),
    short_description: z.string().max(500, "Short description cannot exceed 500 characters").optional().nullable(),
    description: z.string().max(10000, "Description cannot exceed 10,000 characters").optional().nullable(),
    status: z.enum(["draft", "published"]).default("draft"),
    featured: z.boolean().default(false),
    specifications: z.array(specificationSchema).default([]),
    images: z.array(productImageSchema).default([]),
  })
  .superRefine((data, ctx) => {
    // Publishing rule: A published product MUST have at least one product image
    if (data.status === "published" && (!data.images || data.images.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Publishing requires at least one product image.",
        path: ["images"],
      });
    }
  });

export type ProductFormData = z.infer<typeof productSchema>;
export type SpecificationFormData = z.infer<typeof specificationSchema>;
export type ProductImageFormData = z.infer<typeof productImageSchema>;
