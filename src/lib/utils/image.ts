const BUCKET_NAME = "product-images";

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const PRODUCT_SLUG_IMAGES: Record<string, string> = {
  "4k-ultra-hd-endoscope-camera-icg": "/images/kraft/4k-icg-camera.jpg",
  "bariatric-curved-metzenbaum-laparoscopic-scissors": "/images/kraft/general-scissors.jpg",
  "maryland-dissecting-laparoscopic-grasper": "/images/kraft/karl-storz-forceps.jpg",
  "electrosurgical-co2-insufflator-40l": "/images/kraft/co2-insufflator.jpg",
  "digital-cautery-machine-with-vessel-sealer": "/images/kraft/cautery-vessel-sealer.jpg",
  "ultra-hd-surgical-camera-system": "/images/kraft/ultra-hd-surgical-camera.jpg",
  "stille-luer-double-action-bone-rongeur": "/images/kraft/ent-instruments.jpg",
  "debakey-atraumatic-peripheral-vascular-clamp": "/images/kraft/bipolar-forceps.jpg",
  "castroviejo-micro-needle-holder-tc": "/images/kraft/general-scissors.jpg",
  "sukhadia-uterine-manipulator-complete-set": "/images/kraft/uterine-manipulator.jpg",
  "ball-loops-urology-electrode": "/images/kraft/ball-loops.jpg",
  "fibre-optic-laryngoscope-set": "/images/kraft/fibre-optic-laryngoscope.jpg",
  "ethicon-har36-harmonic-ace": "/images/kraft/ethicon-har36.jpg",
  "cystoscope-sheath-urology": "/images/kraft/cystoscope-sheath.jpg",
  "arthroscopy-sheath-scope": "/images/kraft/arthroscopy-sheath.jpg",
  "video-endo-trainer": "/images/kraft/video-endo-trainer.jpg",
  "cv-190-plus-flexible-olympus-evis-exera": "/images/kraft/olympus-cv190.jpg",
  "olympus-cv-180-endoscopy-sytem": "/images/kraft/olympus-cv180.jpg",
  "medical-led-light-source": "/images/kraft/led-light-source.jpg",
};

/**
 * Returns a secure public URL for a given storage path in Supabase Storage.
 * If the path is already a full URL (e.g. from seed placeholders), returns it directly.
 * Otherwise, resolves against the trusted Supabase Storage URL.
 */
export function getProductImageUrl(storagePath: string | null | undefined, slug?: string): string {
  if (slug && PRODUCT_SLUG_IMAGES[slug] && (!storagePath || storagePath === "/placeholder-instrument.svg")) {
    return PRODUCT_SLUG_IMAGES[slug];
  }

  if (!storagePath) {
    return "/placeholder-instrument.svg";
  }

  if (storagePath.startsWith("http://") || storagePath.startsWith("https://") || storagePath.startsWith("/")) {
    return storagePath;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl || supabaseUrl.includes("placeholder")) {
    return "/placeholder-instrument.svg";
  }

  const cleanBase = supabaseUrl.replace(/\/$/, "");
  return `${cleanBase}/storage/v1/object/public/${BUCKET_NAME}/${storagePath}`;
}

/**
 * Validates file MIME type and file size.
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported file type: ${file.type || "unknown"}. Only JPEG, PNG, and WebP are permitted.`,
    };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds the 5MB limit (${(file.size / (1024 * 1024)).toFixed(2)}MB).`,
    };
  }

  return { valid: true };
}
