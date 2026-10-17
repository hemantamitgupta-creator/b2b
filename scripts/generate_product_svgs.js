const fs = require('fs');
const path = require('path');
const targetDir = path.join(__dirname, '..', 'public', 'images');

function wrapProductSvg(title, specSubtitle, artPath) {
  return `<svg width="450" height="340" viewBox="0 0 450 340" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="450" height="340" fill="#FFFFFF" />
    <rect x="12" y="12" width="426" height="316" rx="10" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.5" />
    <g transform="translate(45, 30)">
      ${artPath}
    </g>
    <!-- Brand badge -->
    <rect x="25" y="270" width="400" height="42" rx="6" fill="#F1F5F9" />
    <text x="38" y="295" fill="#006061" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="800">${title}</text>
    <text x="38" y="306" fill="#64748B" font-family="system-ui, -apple-system, sans-serif" font-size="9.5" font-weight="600">${specSubtitle}</text>
    <text x="410" y="295" text-anchor="end" fill="#0D9488" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="800">KRAFT SURGICALS</text>
  </svg>`;
}

const productSvgs = {
  "prod-camera-4k.svg": wrapProductSvg("4K ULTRA HD ENDOSCOPE CAMERA ICG", "NIR / ICG Dual Spectrum · 3840 x 2160 UHD", `
    <!-- 4K Endoscope Camera Console -->
    <rect x="10" y="20" width="340" height="190" rx="12" fill="#006061" stroke="#042F2E" stroke-width="2" />
    <rect x="25" y="35" width="220" height="150" rx="6" fill="#042F2E" />
    <!-- 4K Display graphics -->
    <circle cx="135" cy="110" r="45" fill="#0D9488" />
    <circle cx="135" cy="110" r="25" fill="#5EEAD4" />
    <text x="135" y="115" text-anchor="middle" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="bold">4K ICG</text>
    <!-- Ports on right -->
    <rect x="260" y="45" width="75" height="18" rx="4" fill="#1E293B" />
    <text x="297" y="58" text-anchor="middle" fill="#5EEAD4" font-family="system-ui, sans-serif" font-size="9" font-weight="bold">ELITE 4K</text>
    <circle cx="280" cy="95" r="14" fill="#0D9488" stroke="#134E4A" stroke-width="2" />
    <circle cx="280" cy="95" r="6" fill="#FDE047" />
    <circle cx="280" cy="140" r="10" fill="#334155" />
    <circle cx="310" cy="140" r="10" fill="#334155" />
  `),
  "prod-scissors.svg": wrapProductSvg("BARIATRIC CURVED METZENBAUM SCISSORS", "430 mm Length · Tungsten Carbide Jaws · 360° Rotating", `
    <!-- Scissors -->
    <g stroke="#006061" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <!-- Ergonomic Ring Handle -->
      <circle cx="40" cy="160" r="22" stroke="#006061" stroke-width="4" fill="#F0FDFA" />
      <circle cx="40" cy="80" r="22" stroke="#006061" stroke-width="4" fill="#F0FDFA" />
      <path d="M55 145 L90 120 L55 95" stroke-width="4" />
      <!-- Rotating knob -->
      <circle cx="95" cy="120" r="14" fill="#0D9488" stroke="#006061" stroke-width="2" />
      <!-- Long 430mm shaft -->
      <line x1="110" y1="120" x2="310" y2="120" stroke="#64748B" stroke-width="6" />
      <line x1="110" y1="120" x2="310" y2="120" stroke="#CBD5E1" stroke-width="2" />
      <!-- TC Curved Blades -->
      <path d="M310 118 Q335 110 348 95" stroke="#CA8A04" stroke-width="4" fill="none" />
      <path d="M310 122 Q335 130 348 145" stroke="#CA8A04" stroke-width="4" fill="none" />
      <!-- Monopolar Pin -->
      <rect x="70" y="65" width="8" height="15" rx="2" fill="#EAB308" stroke="#CA8A04" />
    </g>
  `),
  "prod-grasper.svg": wrapProductSvg("MARYLAND DISSECTING LAPAROSCOPIC GRASPER", "5mm Shaft · Curved Cross-Serrated Jaws · 10kV Insulated", `
    <g stroke="#006061" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="40" cy="150" r="20" stroke="#006061" stroke-width="3.5" fill="#F0FDFA" />
      <circle cx="40" cy="80" r="20" stroke="#006061" stroke-width="3.5" fill="#F0FDFA" />
      <path d="M55 135 L90 115 L55 95" stroke-width="3.5" />
      <circle cx="95" cy="115" r="12" fill="#0D9488" />
      <line x1="108" y1="115" x2="305" y2="115" stroke="#334155" stroke-width="6" />
      <!-- Cross-serrated Maryland Jaws -->
      <path d="M305 114 Q325 106 345 100" stroke="#006061" stroke-width="4" fill="none" />
      <path d="M305 116 Q325 124 345 130" stroke="#006061" stroke-width="4" fill="none" />
    </g>
  `),
  "prod-insufflator.svg": wrapProductSvg("ELECTROSURGICAL CO2 INSUFFLATOR 40L", "Integrated Gas Pre-Heating 37°C · 40 L/min Flow", `
    <rect x="15" y="25" width="330" height="180" rx="10" fill="#1E293B" stroke="#006061" stroke-width="2.5" />
    <rect x="30" y="45" width="140" height="85" rx="6" fill="#0F172A" />
    <text x="100" y="85" text-anchor="middle" fill="#22C55E" font-family="monospace" font-size="28" font-weight="900">40.0</text>
    <text x="100" y="110" text-anchor="middle" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="11">FLOW L/MIN</text>
    <rect x="185" y="45" width="140" height="85" rx="6" fill="#0F172A" />
    <text x="255" y="85" text-anchor="middle" fill="#38BDF8" font-family="monospace" font-size="28" font-weight="900">14.0</text>
    <text x="255" y="110" text-anchor="middle" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="11">PRESSURE mmHg</text>
    <!-- Gas Outlet Port -->
    <circle cx="100" cy="170" r="16" fill="#006061" stroke="#5EEAD4" stroke-width="2" />
    <circle cx="100" cy="170" r="7" fill="#FDE047" />
    <rect x="175" y="160" width="130" height="20" rx="4" fill="#334155" />
    <text x="240" y="174" text-anchor="middle" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="10" font-weight="bold">HEATING: 37°C ACTIVE</text>
  `),
  "prod-cautery.svg": wrapProductSvg("DIGITAL CAUTERY MACHINE WITH VESSEL SEALER (400W)", "Bipolar Vessel Sealing 7mm · Bi-TUR Saline Mode · 400 Watts", `
    <rect x="15" y="20" width="330" height="190" rx="12" fill="#0F172A" stroke="#475569" stroke-width="2" />
    <!-- Cut display -->
    <rect x="30" y="40" width="90" height="60" rx="4" fill="#1E293B" />
    <text x="75" y="75" text-anchor="middle" fill="#FBBF24" font-family="monospace" font-size="22" font-weight="bold">400</text>
    <text x="75" y="92" text-anchor="middle" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="9">PURE CUT (W)</text>
    <!-- Coag display -->
    <rect x="135" y="40" width="90" height="60" rx="4" fill="#1E293B" />
    <text x="180" y="75" text-anchor="middle" fill="#38BDF8" font-family="monospace" font-size="22" font-weight="bold">150</text>
    <text x="180" y="92" text-anchor="middle" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="9">COAG (W)</text>
    <!-- Sealer display -->
    <rect x="240" y="40" width="90" height="60" rx="4" fill="#1E293B" />
    <text x="285" y="75" text-anchor="middle" fill="#4ADE80" font-family="monospace" font-size="20" font-weight="bold">FUSION</text>
    <text x="285" y="92" text-anchor="middle" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="9">7mm VESSEL</text>
    <!-- Monopolar & Bipolar sockets -->
    <circle cx="60" cy="150" r="12" fill="#EAB308" />
    <circle cx="110" cy="150" r="12" fill="#3B82F6" />
    <circle cx="180" cy="150" r="12" fill="#006061" />
    <circle cx="230" cy="150" r="12" fill="#006061" />
    <rect x="270" y="138" width="50" height="25" rx="4" fill="#14B8A6" />
    <text x="295" y="154" text-anchor="middle" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="9" font-weight="bold">START</text>
  `),
  "prod-rongeur.svg": wrapProductSvg("STILLE-LUER DOUBLE-ACTION BONE RONGEUR", "Compound Lever Spring Action · 6x15mm Curved Scoop · 220mm Length", `
    <g stroke="#006061" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <!-- Double Action compound linkages -->
      <path d="M40 70 L90 100 L160 100 L250 90 L310 90" stroke-width="4.5" />
      <path d="M40 150 L90 120 L160 120 L250 130 L310 130" stroke-width="4.5" />
      <!-- Pivot joints -->
      <circle cx="90" cy="110" r="6" fill="#0D9488" />
      <circle cx="160" cy="110" r="6" fill="#0D9488" />
      <circle cx="250" cy="110" r="6" fill="#0D9488" />
      <!-- Leaf Springs -->
      <path d="M60 90 Q100 110 60 130" stroke="#CA8A04" stroke-width="2.5" fill="none" />
      <!-- Heavy Jaw scoop -->
      <path d="M310 90 C335 90 345 100 345 110 C345 120 335 130 310 130 Z" fill="#CBD5E1" stroke="#006061" stroke-width="3" />
    </g>
  `),
  "prod-debakey.svg": wrapProductSvg("DEBAKEY ATRAUMATIC VASCULAR CLAMP", "60° Angled Jaws · Atraumatic Longitudinal Teeth · 195mm Length", `
    <g stroke="#006061" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
      <!-- Finger Rings -->
      <circle cx="45" cy="70" r="18" fill="#F8FAFC" />
      <circle cx="45" cy="150" r="18" fill="#F8FAFC" />
      <!-- Ratchet lock -->
      <rect x="55" y="100" width="15" height="20" rx="2" fill="#E2E8F0" stroke="#006061" stroke-width="2" />
      <!-- Shanks crossing at box lock -->
      <path d="M60 80 L140 110" />
      <path d="M60 140 L140 110" />
      <circle cx="140" cy="110" r="7" fill="#0D9488" />
      <!-- Angled 60 deg DeBakey jaws with teeth -->
      <path d="M140 110 L240 110 L290 70" stroke-width="4" />
      <path d="M140 110 L240 110 L290 80" stroke-width="4" />
      <line x1="245" y1="75" x2="285" y2="75" stroke="#CA8A04" stroke-width="2" stroke-dasharray="2 2" />
    </g>
  `),
  "prod-castroviejo.svg": wrapProductSvg("CASTROVIEJO MICRO NEEDLE HOLDER TC", "Tungsten Carbide Pyramidal Inserts · Spring Action · 140/180mm", `
    <g stroke="#006061" stroke-width="3" stroke-linecap="round">
      <path d="M35 110 Q70 65 140 75 L280 100" stroke-width="4" />
      <path d="M35 110 Q70 155 140 145 L280 120" stroke-width="4" />
      <!-- Cross link leaf spring -->
      <path d="M70 90 Q100 110 70 130" stroke="#EAB308" stroke-width="3" fill="none" />
      <!-- Gold plated ring markers -->
      <rect x="150" y="70" width="20" height="10" rx="3" fill="#FDE047" stroke="#CA8A04" />
      <rect x="150" y="140" width="20" height="10" rx="3" fill="#FDE047" stroke="#CA8A04" />
      <!-- TC micro jaws -->
      <rect x="280" y="103" width="35" height="14" rx="2" fill="#EAB308" stroke="#CA8A04" stroke-width="2" />
    </g>
  `),
  "prod-manipulator.svg": wrapProductSvg("SUKHADIA UTERINE MANIPULATOR COMPLETE SET", "Interchangeable Ceramic Colpotomy Cups · Luer Lock Dye Port", `
    <g stroke="#006061" stroke-width="3" stroke-linecap="round">
      <line x1="25" y1="110" x2="260" y2="110" stroke="#64748B" stroke-width="8" />
      <!-- Articulating Locking Handle -->
      <path d="M30 110 L30 160 L75 160" stroke-width="6" />
      <circle cx="30" cy="110" r="10" fill="#0D9488" />
      <!-- Ceramic colpotomy cup -->
      <path d="M260 90 C280 90 290 100 290 110 C290 120 280 130 260 130 Z" fill="#F8FAFC" stroke="#006061" stroke-width="3" />
      <!-- Intrauterine Tip -->
      <line x1="290" y1="110" x2="330" y2="105" stroke="#006061" stroke-width="4" />
      <!-- Luer Port -->
      <rect x="80" y="95" width="14" height="30" rx="3" fill="#0D9488" />
    </g>
  `),
  "prod-urology-loop.svg": wrapProductSvg("BALL LOOPS UROLOGY RESECTOSCOPE ELECTRODE", "24 Fr / 26 Fr Compatible · 3.0mm & 5.0mm Roller · Monopolar Coagulation", `
    <g stroke="#006061" stroke-width="3" stroke-linecap="round">
      <line x1="30" y1="110" x2="280" y2="110" stroke="#CA8A04" stroke-width="5" />
      <!-- Golden active roller ball -->
      <circle cx="300" cy="110" r="14" fill="#FACC15" stroke="#CA8A04" stroke-width="3" />
      <!-- Insulator Sleeve -->
      <rect x="70" y="103" width="170" height="14" rx="4" fill="#006061" />
      <!-- Proximal electrical contact plug -->
      <rect x="30" y="102" width="40" height="16" rx="2" fill="#334155" stroke="#CBD5E1" />
    </g>
  `),
  "prod-laryngoscope.svg": wrapProductSvg("FIBRE OPTIC LARYNGOSCOPE WITH 4 MACINTOSH BLADES", "Cool Daylight LED Illumination · ISO 7376-3 · Macintosh #1, #2, #3, #4", `
    <!-- Knurled Battery Handle -->
    <rect x="30" y="90" width="140" height="40" rx="8" fill="#475569" stroke="#006061" stroke-width="3" />
    <line x1="45" y1="90" x2="45" y2="130" stroke="#94A3B8" stroke-dasharray="2 2" stroke-width="2" />
    <line x1="70" y1="90" x2="70" y2="130" stroke="#94A3B8" stroke-dasharray="2 2" stroke-width="2" />
    <line x1="95" y1="90" x2="95" y2="130" stroke="#94A3B8" stroke-dasharray="2 2" stroke-width="2" />
    <line x1="120" y1="90" x2="120" y2="130" stroke="#94A3B8" stroke-dasharray="2 2" stroke-width="2" />
    <!-- Green System Ring Indicator -->
    <circle cx="170" cy="110" r="8" fill="#22C55E" />
    <!-- Curved Macintosh Blade -->
    <path d="M170 110 C210 110 270 90 320 60 C325 55 330 50 335 45" stroke="#CBD5E1" stroke-width="12" stroke-linecap="round" fill="none" />
    <path d="M170 110 C210 110 270 90 320 60 C325 55 330 50 335 45" stroke="#006061" stroke-width="2" fill="none" />
    <!-- Fibre optic green beam -->
    <circle cx="330" cy="50" r="5" fill="#4ADE80" />
  `),
  "prod-camera-uhd.svg": wrapProductSvg("ULTRA HD SURGICAL CAMERA SYSTEM", "CMOS Sensor · DVI / HDMI / 12G-SDI · Multi-Specialty ENT & Laparoscopy", `
    <rect x="15" y="25" width="330" height="180" rx="10" fill="#006061" stroke="#042F2E" stroke-width="2" />
    <rect x="35" y="45" width="180" height="140" rx="6" fill="#042F2E" />
    <text x="125" y="115" text-anchor="middle" fill="#5EEAD4" font-family="system-ui, sans-serif" font-size="20" font-weight="900">UHD MEDICAL</text>
    <text x="125" y="135" text-anchor="middle" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="10">60 FPS AUTO BALANCE</text>
    <circle cx="265" cy="70" r="14" fill="#0D9488" stroke="#5EEAD4" stroke-width="2" />
    <rect x="235" y="110" width="60" height="18" rx="4" fill="#1E293B" />
    <text x="265" y="122" text-anchor="middle" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="9" font-weight="bold">SDI OUT</text>
    <circle cx="250" cy="155" r="8" fill="#FDE047" />
    <circle cx="280" cy="155" r="8" fill="#22C55E" />
  `)
};

for (const [filename, svg] of Object.entries(productSvgs)) {
  fs.writeFileSync(path.join(targetDir, filename), svg);
}

console.log('Generated all 12 product SVGs successfully!');
