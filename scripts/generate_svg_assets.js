const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'public', 'images');
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

// 1. Logo
const logoSvg = `<svg width="220" height="54" viewBox="0 0 220 54" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(4, 3)">
    <circle cx="24" cy="24" r="23" fill="#006061" />
    <circle cx="24" cy="24" r="20" stroke="#FFFFFF" stroke-width="1.5" stroke-dasharray="2 2" fill="none" />
    <!-- Stylized KS Caduceus Motif -->
    <path d="M24 10 V38" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" />
    <path d="M17 17 C21 15 27 15 31 17 C27 20 21 21 17 24 C21 26 27 26 31 28" stroke="#5EEAD4" stroke-width="2" stroke-linecap="round" fill="none" />
    <circle cx="24" cy="10" r="3" fill="#FDE047" />
  </g>
  <text x="60" y="27" fill="#006061" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="900" letter-spacing="-0.5">Kraft</text>
  <text x="108" y="27" fill="#1E293B" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="900" letter-spacing="-0.5">Surgicals</text>
  <text x="60" y="42" fill="#64748B" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="700" letter-spacing="1">SURGICAL INSTRUMENTS</text>
</svg>`;

// 2. IndiaMART TrustSeal Badge
const trustSealSvg = `<svg width="86" height="56" viewBox="0 0 86 56" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M43 2 L68 10 V26 C68 40 43 52 43 52 C43 52 18 40 18 26 V10 L43 2 Z" fill="#FBBF24" stroke="#D97706" stroke-width="1.5" />
  <path d="M43 5 L65 12 V25 C65 37 43 48 43 48 C43 48 21 37 21 25 V12 L43 5 Z" fill="#F59E0B" />
  <!-- Red Ribbon Banner -->
  <rect x="6" y="20" width="74" height="14" rx="3" fill="#DC2626" />
  <text x="43" y="29.5" text-anchor="middle" fill="#FFFFFF" font-family="system-ui, -apple-system, sans-serif" font-size="8.5" font-weight="900" letter-spacing="0.5">TRUST SEAL</text>
  <text x="43" y="44" text-anchor="middle" fill="#78350F" font-family="system-ui, -apple-system, sans-serif" font-size="7" font-weight="800">indiamart</text>
</svg>`;

// Helper for category circle SVGs
function createCategoryCircleSvg(title, iconPath, primaryColor = "#006061", accentColor = "#0D9488") {
  return `<svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="80" cy="80" r="76" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2" />
    <circle cx="80" cy="80" r="68" fill="#FFFFFF" />
    <g transform="translate(40, 40)">
      ${iconPath}
    </g>
    <circle cx="80" cy="80" r="70" stroke="${primaryColor}" stroke-width="2" stroke-opacity="0.2" fill="none" />
  </svg>`;
}

// Category Circle SVGs
const catIcons = {
  "cat-laparoscopic.svg": createCategoryCircleSvg("Laparoscopic", `
    <!-- 4K Camera Console & Optics -->
    <rect x="6" y="18" width="68" height="42" rx="6" fill="#006061" />
    <rect x="12" y="24" width="40" height="30" rx="3" fill="#042F2E" />
    <circle cx="32" cy="39" r="10" fill="#0D9488" />
    <circle cx="32" cy="39" r="5" fill="#5EEAD4" />
    <rect x="58" y="26" width="10" height="4" rx="2" fill="#FDE047" />
    <rect x="58" y="34" width="10" height="4" rx="2" fill="#5EEAD4" />
    <rect x="58" y="42" width="10" height="4" rx="2" fill="#CBD5E1" />
    <path d="M40 50 L66 66 L72 60" stroke="#0D9488" stroke-width="3" stroke-linecap="round" fill="none" />
  `),
  "cat-surgical.svg": createCategoryCircleSvg("Surgical", `
    <!-- Surgical Diathermy / Cautery -->
    <rect x="8" y="16" width="64" height="46" rx="5" fill="#1E293B" stroke="#475569" stroke-width="2" />
    <rect x="14" y="22" width="34" height="20" rx="2" fill="#0F172A" />
    <text x="31" y="36" fill="#38BDF8" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">400 W</text>
    <circle cx="58" cy="27" r="4" fill="#EAB308" />
    <circle cx="58" cy="39" r="4" fill="#3B82F6" />
    <rect x="16" y="48" width="12" height="6" rx="2" fill="#006061" />
    <rect x="34" y="48" width="12" height="6" rx="2" fill="#006061" />
    <rect x="52" y="48" width="12" height="6" rx="2" fill="#006061" />
  `),
  "cat-laparoscopy-inst.svg": createCategoryCircleSvg("Laparoscopy Instruments", `
    <!-- Crossed laparoscopic instruments -->
    <g stroke="#006061" stroke-width="3" stroke-linecap="round">
      <line x1="12" y1="68" x2="68" y2="12" />
      <line x1="12" y1="12" x2="68" y2="68" />
      <circle cx="12" cy="68" r="6" stroke="#006061" stroke-width="2.5" fill="#F0FDFA" />
      <circle cx="68" cy="68" r="6" stroke="#006061" stroke-width="2.5" fill="#F0FDFA" />
      <path d="M64 8 L72 16" />
      <path d="M8 64 L16 72" />
      <circle cx="40" cy="40" r="4" fill="#0D9488" stroke="none" />
    </g>
  `),
  "cat-equipment.svg": createCategoryCircleSvg("Surgical Equipment", `
    <!-- Equipment Tower Stack -->
    <rect x="14" y="10" width="52" height="16" rx="3" fill="#006061" />
    <circle cx="24" cy="18" r="3" fill="#5EEAD4" />
    <rect x="14" y="30" width="52" height="18" rx="3" fill="#1E293B" />
    <rect x="22" y="34" width="22" height="10" fill="#0F172A" rx="2" />
    <rect x="14" y="52" width="52" height="18" rx="3" fill="#334155" />
    <circle cx="24" cy="61" r="3" fill="#EAB308" />
    <circle cx="34" cy="61" r="3" fill="#22C55E" />
  `),
  "cat-medical.svg": createCategoryCircleSvg("Medical Equipment", `
    <!-- High-res Medical Monitor -->
    <rect x="10" y="12" width="60" height="42" rx="4" fill="#0F172A" stroke="#006061" stroke-width="2" />
    <rect x="14" y="16" width="52" height="34" fill="#042F2E" />
    <!-- Endoscopy screen display -->
    <circle cx="40" cy="33" r="11" fill="#006061" />
    <circle cx="40" cy="33" r="6" fill="#14B8A6" />
    <rect x="36" y="54" width="8" height="10" fill="#475569" />
    <rect x="26" y="64" width="28" height="4" rx="2" fill="#334155" />
  `),
  "cat-handset.svg": createCategoryCircleSvg("Hand Set", `
    <!-- Laparoscopic Set Array -->
    <g stroke="#006061" stroke-width="2.5" stroke-linecap="round">
      <line x1="20" y1="15" x2="20" y2="65" />
      <line x1="33" y1="10" x2="33" y2="68" />
      <line x1="47" y1="10" x2="47" y2="68" />
      <line x1="60" y1="15" x2="60" y2="65" />
      <!-- Handles -->
      <circle cx="20" cy="67" r="4" fill="#F0FDFA" />
      <circle cx="33" cy="70" r="4" fill="#F0FDFA" />
      <circle cx="47" cy="70" r="4" fill="#F0FDFA" />
      <circle cx="60" cy="67" r="4" fill="#F0FDFA" />
      <!-- Jaws -->
      <path d="M17 12 L20 15 L23 12" />
      <path d="M30 7 L33 10 L36 7" />
      <path d="M44 7 L47 10 L50 7" />
      <path d="M57 12 L60 15 L63 12" />
    </g>
  `),
  "cat-urology.svg": createCategoryCircleSvg("Urology", `
    <!-- Cystoscope Sheath & Stopcocks -->
    <g stroke="#006061" stroke-width="3" stroke-linecap="round">
      <line x1="12" y1="42" x2="68" y2="42" />
      <!-- Side Stopcocks -->
      <line x1="28" y1="42" x2="28" y2="22" />
      <circle cx="28" cy="20" r="4" fill="#F97316" stroke="#C2410C" stroke-width="1.5" />
      <line x1="44" y1="42" x2="44" y2="22" />
      <circle cx="44" cy="20" r="4" fill="#F97316" stroke="#C2410C" stroke-width="1.5" />
      <!-- Working Element Funnel -->
      <path d="M12 36 L12 48 L6 52 L6 32 Z" fill="#CBD5E1" stroke="#64748B" stroke-width="1.5" />
      <!-- Beveled tip -->
      <path d="M68 40 L74 42 L68 44" fill="#0D9488" />
    </g>
  `),
  "cat-forceps.svg": createCategoryCircleSvg("Medical Forceps", `
    <!-- Bipolar Bayonet Forceps -->
    <g stroke="#006061" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 62 L28 44 L56 44 L70 38" />
      <path d="M14 66 L28 48 L56 48 L70 42" />
      <rect x="8" y="58" width="8" height="12" rx="2" fill="#EAB308" stroke="#CA8A04" stroke-width="1" />
      <circle cx="69" cy="40" r="2" fill="#0D9488" stroke="none" />
    </g>
  `)
};

// 4. Featured Product SVGs
const featHarmonicSvg = `<svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#F8FAFC" />
  <rect x="15" y="15" width="370" height="270" rx="10" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" />
  <!-- Sterile Packing blister outline -->
  <rect x="35" y="35" width="330" height="230" rx="12" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="2" stroke-dasharray="4 4" />
  <g transform="translate(60, 75)">
    <!-- Pistol Grip Handle -->
    <rect x="20" y="80" width="35" height="55" rx="8" fill="#334155" />
    <rect x="25" y="90" width="25" height="20" rx="4" fill="#006061" />
    <path d="M35 50 L55 50 L55 80 L35 80 Z" fill="#64748B" />
    <!-- Rotating Knob -->
    <circle cx="55" cy="50" r="12" fill="#0D9488" stroke="#042F2E" stroke-width="2" />
    <!-- Long Insulated 36cm Shaft -->
    <rect x="55" y="47" width="190" height="6" rx="2" fill="#CBD5E1" stroke="#94A3B8" stroke-width="1" />
    <!-- Curved Shear Jaw Tip -->
    <path d="M245 46 Q260 45 268 40" stroke="#006061" stroke-width="3" stroke-linecap="round" fill="none" />
    <path d="M245 52 Q260 52 266 58" stroke="#475569" stroke-width="2.5" stroke-linecap="round" fill="none" />
    <!-- Brand badge -->
    <rect x="75" y="70" width="100" height="22" rx="4" fill="#FFFFFF" stroke="#E2E8F0" />
    <text x="125" y="85" text-anchor="middle" fill="#006061" font-family="system-ui, sans-serif" font-size="10" font-weight="bold">HARMONIC ACE</text>
  </g>
</svg>`;

const featCystoscopeSvg = `<svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#F8FAFC" />
  <rect x="15" y="15" width="370" height="270" rx="10" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" />
  <g transform="translate(45, 110)">
    <!-- Stainless steel Cystoscope Sheath -->
    <line x1="30" y1="50" x2="280" y2="50" stroke="#64748B" stroke-width="8" stroke-linecap="round" />
    <line x1="30" y1="50" x2="280" y2="50" stroke="#E2E8F0" stroke-width="3" stroke-linecap="round" />
    <!-- Stopcock valves with orange handles -->
    <line x1="70" y1="50" x2="70" y2="15" stroke="#475569" stroke-width="6" />
    <rect x="62" y="8" width="16" height="8" rx="2" fill="#EA580C" />
    <line x1="110" y1="50" x2="110" y2="15" stroke="#475569" stroke-width="6" />
    <rect x="102" y="8" width="16" height="8" rx="2" fill="#EA580C" />
    <!-- Proximal Lock Funnel -->
    <path d="M30 40 L30 60 L10 68 L10 32 Z" fill="#94A3B8" stroke="#475569" stroke-width="2" />
    <!-- Distal Bevel -->
    <path d="M280 46 L292 50 L280 54 Z" fill="#006061" />
  </g>
  <text x="200" y="240" text-anchor="middle" fill="#006061" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" letter-spacing="0.5">CYSTOSCOPE SHEATH 24 Fr / 30° BRIDGE</text>
</svg>`;

// Write all generated files
fs.writeFileSync(path.join(targetDir, 'logo-kraft.svg'), logoSvg);
fs.writeFileSync(path.join(targetDir, 'badge-trustseal.svg'), trustSealSvg);
fs.writeFileSync(path.join(targetDir, 'feat-harmonic.svg'), featHarmonicSvg);
fs.writeFileSync(path.join(targetDir, 'feat-cystoscope.svg'), featCystoscopeSvg);

for (const [filename, svg] of Object.entries(catIcons)) {
  fs.writeFileSync(path.join(targetDir, filename), svg);
}

console.log('Successfully generated all Kraft Surgicals SVG assets!');
