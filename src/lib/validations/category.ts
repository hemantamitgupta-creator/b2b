import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name cannot exceed 100 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(120, "Slug cannot exceed 120 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  description: z.string().max(1000, "Description cannot exceed 1000 characters").optional().nullable(),
  is_active: z.boolean().default(true),
  sort_order: z.coerce.number().int().default(0),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
