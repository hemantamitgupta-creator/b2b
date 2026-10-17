import { describe, it } from "node:test";
import assert from "node:assert/strict";

// Import validation logic to test
import { categorySchema } from "../src/lib/validations/category.ts";
import { productSchema, specificationSchema } from "../src/lib/validations/product.ts";
import { slugify } from "../src/lib/utils/slugify.ts";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE_BYTES } from "../src/lib/utils/image.ts";

describe("1. Slug Generation & Sanitization", () => {
  it("converts product names with spaces and special characters to URL-safe slugs", () => {
    assert.equal(
      slugify("Bariatric Curved Metzenbaum Laparoscopic Scissors (5mm)"),
      "bariatric-curved-metzenbaum-laparoscopic-scissors-5mm"
    );
    assert.equal(
      slugify("Castroviejo Micro Needle Holder - TC"),
      "castroviejo-micro-needle-holder-tc"
    );
    assert.equal(
      slugify("  Specialized Instrument & Forceps!  "),
      "specialized-instrument-forceps"
    );
  });
});

describe("2. Category Schema Validation", () => {
  it("accepts valid category input", () => {
    const valid = categorySchema.safeParse({
      name: "Laparoscopic Instruments",
      slug: "laparoscopic-instruments",
      description: "Precision endoscopic surgical graspers and trocars.",
      is_active: true,
      sort_order: 1,
    });
    assert.equal(valid.success, true);
  });

  it("rejects uppercase and invalid characters in category slugs", () => {
    const invalid = categorySchema.safeParse({
      name: "Laparoscopic Instruments",
      slug: "Laparoscopic_Instruments",
      is_active: true,
      sort_order: 1,
    });
    assert.equal(invalid.success, false);
    if (!invalid.success) {
      assert.ok(invalid.error.flatten().fieldErrors.slug);
    }
  });

  it("rejects empty category name", () => {
    const invalid = categorySchema.safeParse({
      name: "   ",
      slug: "empty-name",
      is_active: true,
    });
    assert.equal(invalid.success, false);
  });
});

describe("3. Product Schema & Business Rules Validation", () => {
  const sampleCategoryId = "a1111111-1111-4111-8111-111111111111";

  it("allows saving a draft product without images", () => {
    const draft = productSchema.safeParse({
      name: "Prototype Laparoscopic Instrument",
      slug: "prototype-laparoscopic-instrument",
      category_id: sampleCategoryId,
      status: "draft",
      featured: false,
      specifications: [],
      images: [],
    });
    assert.equal(draft.success, true);
  });

  it("CRITICAL RULE: Rejects publishing when product has 0 images", () => {
    const publishAttemptWithoutImages = productSchema.safeParse({
      name: "Unimaged Surgical Instrument",
      slug: "unimaged-surgical-instrument",
      category_id: sampleCategoryId,
      status: "published", // Attempting to publish
      featured: false,
      specifications: [],
      images: [], // No images provided
    });

    assert.equal(publishAttemptWithoutImages.success, false);
    if (!publishAttemptWithoutImages.success) {
      const fieldErrors = publishAttemptWithoutImages.error.flatten().fieldErrors;
      assert.ok(fieldErrors.images);
      assert.match(
        fieldErrors.images[0],
        /Publishing requires at least one product image/i
      );
    }
  });

  it("allows publishing when valid images are provided", () => {
    const published = productSchema.safeParse({
      name: "Certified Laparoscopic Scissors",
      slug: "certified-laparoscopic-scissors",
      category_id: sampleCategoryId,
      status: "published",
      featured: true,
      specifications: [
        { label: "Working Length", value: "330 mm", sort_order: 1 },
      ],
      images: [
        {
          storage_path: "prod-123/main.jpg",
          alt_text: "Scissors main view",
          is_primary: true,
          sort_order: 0,
        },
      ],
    });
    assert.equal(published.success, true);
  });

  it("rejects invalid category UUID", () => {
    const invalid = productSchema.safeParse({
      name: "Instrument with invalid category",
      slug: "instrument-invalid-cat",
      category_id: "not-a-uuid",
      status: "draft",
      images: [],
    });
    assert.equal(invalid.success, false);
  });
});

describe("4. Dynamic Technical Specifications Validation", () => {
  it("accepts valid specification key-value pairs", () => {
    const valid = specificationSchema.safeParse({
      label: "Shaft Diameter",
      value: "5.0 mm",
      sort_order: 1,
    });
    assert.equal(valid.success, true);
  });

  it("rejects empty specification labels or values", () => {
    const emptyLabel = specificationSchema.safeParse({
      label: "  ",
      value: "5.0 mm",
    });
    assert.equal(emptyLabel.success, false);

    const emptyValue = specificationSchema.safeParse({
      label: "Jaw Design",
      value: "  ",
    });
    assert.equal(emptyValue.success, false);
  });
});

describe("5. Storage Asset Constraints", () => {
  it("enforces permitted MIME types: JPEG, PNG, WebP only", () => {
    assert.deepEqual(ALLOWED_IMAGE_TYPES, [
      "image/jpeg",
      "image/png",
      "image/webp",
    ]);
  });

  it("enforces maximum file size limit of 5MB", () => {
    assert.equal(MAX_IMAGE_SIZE_BYTES, 5 * 1024 * 1024);
  });
});
