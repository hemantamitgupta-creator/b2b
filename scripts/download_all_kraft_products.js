const fs = require('fs');
const https = require('https');
const path = require('path');

const dir = path.join(process.cwd(), 'public', 'images', 'kraft');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const products = [
  {
    "slug": "ethicon-har36-harmonic-ace",
    "name": "Ethicon Har36 Harmonic Ace",
    "price": "₹ 35,000/Piece",
    "imageFileName": "ethicon-har36.jpg",
    "imageSrc": "https://5.imimg.com/data5/SELLER/Default/2026/2/585496172/AC/BM/KN/3716699/product-jpeg-2-250x250.jpg",
    "specifications": [
      "Shaft length: 36 cm",
      "Jaw type: Curved shear",
      "Compatibility: Ethicon Gen 11"
    ],
    "category": "laparoscopic-instruments"
  },
  {
    "slug": "cystoscope-sheath-urology",
    "name": "Cystoscope Sheath Urology",
    "price": "₹ 8,500/Piece",
    "imageFileName": "cystoscope-sheath.jpg",
    "imageSrc": "https://5.imimg.com/data5/PE/RD/BZ/SELLER-3716699/cystoscope-accessories-250x250.jpg",
    "specifications": [
      "Material: Stainless Steel",
      "Length: 30 mm",
      "Usage/Application: Urology Surgery"
    ],
    "category": "urology-instruments"
  },
  {
    "slug": "arthroscopy-sheath-scope",
    "name": "Arthroscopy Sheath & Scope",
    "price": "₹ 7,000/Piece",
    "imageFileName": "arthroscopy-sheath.jpg",
    "imageSrc": "https://5.imimg.com/data5/SELLER/Default/2025/1/478474599/WJ/UC/NA/3716699/arthroscopy-sheath-scope-250x250.jpg",
    "specifications": [
      "Size: 2.7 mm",
      "Usage/Application: Hospital",
      "Material: Stainless Steel"
    ],
    "category": "surgical-equipment"
  },
  {
    "slug": "video-endo-trainer",
    "name": "Video Endo Trainer",
    "price": "₹ 20,000/Piece",
    "imageFileName": "video-endo-trainer.jpg",
    "imageSrc": "https://5.imimg.com/data5/SELLER/Default/2025/1/478399231/IZ/CE/MD/3716699/whatsapp-image-2024-12-31-at-2-47-05-pm-250x250.jpeg",
    "specifications": [
      "Type: Torso Trainer",
      "Usage/Application: Hospital Training",
      "Material: High-Grade Polymer & SS"
    ],
    "category": "laparoscopic-instruments"
  },
  {
    "slug": "cv-190-plus-flexible-olympus-evis-exera",
    "name": "CV-190 Plus Flexible Olympus Evis Exera",
    "price": "₹ 35,00,000/Set",
    "imageFileName": "olympus-cv190.jpg",
    "imageSrc": "https://5.imimg.com/data5/SELLER/Default/2023/10/350050199/IQ/FH/EK/3716699/olympus-190-system-colonoscope-gastroscope-250x250.jpeg",
    "specifications": [
      "Type: Advanced Endoscopy",
      "Usage/Application: Hospital OT",
      "Categories: Colonoscopes & Gastroscopes"
    ],
    "category": "surgical-equipment"
  },
  {
    "slug": "olympus-cv-180-endoscopy-sytem",
    "name": "Olympus Cv 180 Endoscopy System",
    "price": "₹ 19,50,000/Piece",
    "imageFileName": "olympus-cv180.jpg",
    "imageSrc": "https://5.imimg.com/data5/SELLER/Default/2023/10/350041851/LJ/UJ/UZ/3716699/olympus-cv-180-system-250x250.jpeg",
    "specifications": [
      "Model Name: CV-180 EVIS EXERA II",
      "Brand: Olympus Medical",
      "Output: High Definition Y/C & RGB"
    ],
    "category": "surgical-equipment"
  },
  {
    "slug": "4k-ultra-hd-endoscope-camera-icg",
    "name": "4K Ultra HD Endoscope Camera ICG",
    "price": "₹ 10,50,000/Piece",
    "imageFileName": "4k-icg-camera.jpg",
    "imageSrc": "https://5.imimg.com/data5/SELLER/Default/2025/12/564853133/ZM/PM/KD/3716699/make-250x250.jpg",
    "specifications": [
      "Camera type: 4K UHD with ICG Mode",
      "Sensor type: Sony 1/1.8\" CMOS",
      "Brand: KRAFT SURGICALS"
    ],
    "category": "laparoscopic-instruments"
  },
  {
    "slug": "4k-digital-laparoscopic-camera-unit",
    "name": "4K Digital Laparoscopic Camera Unit",
    "price": "₹ 8,00,000/Piece",
    "imageFileName": "4k-digital-camera.png",
    "imageSrc": "https://5.imimg.com/data5/SELLER/Default/2026/7/629885489/GH/GU/BL/3716699/gemini-generated-image-hju5c0hju5c0hju5-250x250.png",
    "specifications": [
      "Resolution: 3840 x 2160 UHD",
      "Output Port: Dual HDMI 2.0 & 12G-SDI",
      "Control: Waterproof Camera Head"
    ],
    "category": "laparoscopic-instruments"
  },
  {
    "slug": "ball-loops-urology",
    "name": "Ball Loops Urology Resectoscope",
    "price": "₹ 1,500/Piece",
    "imageFileName": "ball-loops.jpg",
    "imageSrc": "https://5.imimg.com/data5/SELLER/Default/2025/8/533380986/SB/BZ/WT/3716699/whatsapp-imag-e-2024-12-06-at-5-250x250.jpg",
    "specifications": [
      "Electrode Type: Monopolar Coagulation",
      "Loop Type: 3mm / 5mm Ball",
      "Wire Material: Tungsten Alloy"
    ],
    "category": "urology-instruments"
  },
  {
    "slug": "ultra-hd-surgical-camera-system",
    "name": "Ultra HD Surgical Camera System",
    "price": "₹ 3,50,000/Piece",
    "imageFileName": "ultra-hd-surgical-camera.jpg",
    "imageSrc": "https://5.imimg.com/data5/SELLER/Default/2026/7/630062308/AB/ZQ/EG/3716699/whatsapp-image-2026-07-17-at-2-39-20-pm-250x250.jpeg",
    "specifications": [
      "Camera type: Full HD 60fps",
      "Sensor type: 1/2.8\" Progressive CMOS",
      "Brand: Kraft Surgicals"
    ],
    "category": "laparoscopic-instruments"
  },
  {
    "slug": "ent-surgery-instruments",
    "name": "ENT Surgery Precision Instruments",
    "price": "₹ 2,000/Piece",
    "imageFileName": "ent-instruments.jpg",
    "imageSrc": "https://5.imimg.com/data5/SELLER/Default/2025/1/482279436/XL/IY/FO/3716699/ent-surgery-instruments-250x250.jpg",
    "specifications": [
      "Instrument Grade: Premium Surgical Grade",
      "Material: AISI 420 Martensitic SS",
      "Finish: Non-Reflective Satin"
    ],
    "category": "surgical-instrument"
  },
  {
    "slug": "fibre-optic-laryngoscope",
    "name": "Fibre Optic Laryngoscope Set",
    "price": "₹ 25,000/Piece",
    "imageFileName": "fibre-optic-laryngoscope.jpg",
    "imageSrc": "https://5.imimg.com/data5/SELLER/Default/2021/11/TD/HU/KO/3716699/fibre-optic-laryngoscope-250x250.jpg",
    "specifications": [
      "Blade Type: Curved Macintosh / Miller",
      "Light Source: Green System Integrated Fiber",
      "Sterilization: Autoclavable up to 134°C"
    ],
    "category": "surgical-instrument"
  },
  {
    "slug": "bipolar-bayonet-forceps",
    "name": "Bipolar Bayonet Micro Forceps",
    "price": "₹ 2,000/Piece",
    "imageFileName": "bipolar-forceps.jpg",
    "imageSrc": "https://5.imimg.com/data5/SELLER/Default/2021/11/KU/PQ/OA/3716699/laparoscopy-bipolar-forceps-250x250.jpg",
    "specifications": [
      "Tip Size: 0.5 mm - 1.0 mm",
      "Coating: Non-Stick Silver Alloy Tips",
      "Connection: European / US 2-Pin Plug"
    ],
    "category": "surgical-instrument"
  },
  {
    "slug": "medical-led-light-source",
    "name": "Medical LED Light Source 100W",
    "price": "₹ 35,000/Piece",
    "imageFileName": "led-light-source.jpg",
    "imageSrc": "https://5.imimg.com/data5/SELLER/Default/2020/10/XF/ZN/MW/3716699/medical-led-light-source-250x250.jpg",
    "specifications": [
      "Color Temperature: 5700K - 6500K Daylight",
      "Lamp Lifespan: > 50,000 Hours",
      "Optical Port: Storz / Olympus Adaptable"
    ],
    "category": "surgical-equipment"
  },
  {
    "slug": "cautery-machine-with-vessel-sealer",
    "name": "Cautery Machine With Vessel Sealer 400W",
    "price": "₹ 1,80,000/Piece",
    "imageFileName": "cautery-vessel-sealer.jpg",
    "imageSrc": "https://5.imimg.com/data5/SELLER/Default/2024/9/452434273/JJ/YP/DY/3716699/20220723-210313-photoroom-1-250x250.jpg",
    "specifications": [
      "Output: 400W Monopolar + 150W Bipolar",
      "Vessel Sealing: Up to 7mm vessels with auto-cut",
      "Model: KSPL-VSL6545"
    ],
    "category": "surgical-equipment"
  },
  {
    "slug": "4-mm-stainless-steel-hysteroscope",
    "name": "4 mm Stainless Steel Hysteroscope",
    "price": "₹ 48,000/Set",
    "imageFileName": "hysteroscope-scope.jpg",
    "imageSrc": "https://5.imimg.com/data5/SELLER/Default/2025/1/483223589/AD/IC/WK/3716699/4-mm-stainless-steel-hysteroscope-250x250.jpeg",
    "specifications": [
      "Direction of View: 30° / 12°",
      "Outer Diameter: 4.0 mm Rod Lens System",
      "Sheath: Continuous Flow Diagnostic Sheath"
    ],
    "category": "urology-instruments"
  },
  {
    "slug": "karl-storz-type-forceps",
    "name": "Karl Storz Type ClickLine Grasper",
    "price": "₹ 15,000/Piece",
    "imageFileName": "karl-storz-forceps.jpg",
    "imageSrc": "https://5.imimg.com/data5/SELLER/Default/2021/11/QJ/UD/QH/3716699/karl-storz-type-forceps-250x250.jpg",
    "specifications": [
      "Diameter: 5 mm x 33 cm",
      "Rotation: 360° Finger Ring Indexing",
      "Disassembly: 3-Piece Autoclavable"
    ],
    "category": "laparoscopic-instruments"
  },
  {
    "slug": "laparoscopy-monopolar-cable",
    "name": "Laparoscopy Monopolar HF Cable",
    "price": "₹ 1,200/Piece",
    "imageFileName": "monopolar-cable.jpg",
    "imageSrc": "https://5.imimg.com/data5/SELLER/Default/2025/1/481103667/UJ/MH/YC/3716699/laparoscopy-monopolar-cable-250x250.jpg",
    "specifications": [
      "Length: 3.0 Meters High Flexibility",
      "Insulation: Medical Grade Heat-Resistant Silicone",
      "Connector: 4 mm Pin / Standard Generator"
    ],
    "category": "laparoscopic-instruments"
  },
  {
    "slug": "imported-bissinger-power-grip-forcep",
    "name": "Imported Bissinger Power Grip Forcep",
    "price": "₹ 35,000/Piece",
    "imageFileName": "bissinger-forcep.jpg",
    "imageSrc": "https://5.imimg.com/data5/SELLER/Default/2023/8/336854868/VS/SX/SY/3716699/bissinger-power-grip-forcep-250x250.jpeg",
    "specifications": [
      "Jaw Type: Power Grip Fenestrated",
      "Shaft: 5 mm Fully Insulated Shaft",
      "Action: Double Action Atraumatic"
    ],
    "category": "laparoscopic-instruments"
  },
  {
    "slug": "electrosurgical-equipment-co2-insufflator",
    "name": "Digital 40L High Flow CO2 Insufflator",
    "price": "₹ 85,000/Piece",
    "imageFileName": "co2-insufflator.jpg",
    "imageSrc": "https://5.imimg.com/data5/SELLER/Default/2022/2/CB/YQ/WO/3716699/343aa7db-164a-4156-abaf-72bb6a3128da-250x250.jpg",
    "specifications": [
      "Gas Flow: 0 - 40 Liters/Minute",
      "Pressure Range: 0 - 30 mmHg Precision Sensor",
      "Gas Warming: Integrated Gas Heater Unit"
    ],
    "category": "surgical-equipment"
  },
  {
    "slug": "general-surgical-instruments",
    "name": "General Surgery Mayo & Metzenbaum Scissors",
    "price": "₹ 2,000/Piece",
    "imageFileName": "general-scissors.jpg",
    "imageSrc": "https://5.imimg.com/data5/SELLER/Default/2021/11/WP/AM/CG/3716699/general-instruments-250x250.jpg",
    "specifications": [
      "Type: Metzenbaum Curved Dissecting Scissors",
      "Blades: Tungsten Carbide (TC) Inlays Gold Rings",
      "Steel: German Grade Stainless Steel"
    ],
    "category": "surgical-instrument"
  },
  {
    "slug": "sukhadia-uterine-manipulator",
    "name": "Sukhadia Uterine Manipulator System",
    "price": "₹ 5,000/Piece",
    "imageFileName": "uterine-manipulator.jpg",
    "imageSrc": "https://5.imimg.com/data5/SELLER/Default/2024/11/464392618/YU/KR/FD/3716699/img-20241009-115906-250x250.jpg",
    "specifications": [
      "Components: Multiple Sized Cervical Cups & Rods",
      "Sterilization: Fully Autoclavable SS Construction",
      "Application: Total Laparoscopic Hysterectomy (TLH)"
    ],
    "category": "surgical-instrument"
  }
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error('Status ' + res.statusCode));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', reject);
  });
}

(async () => {
  for (const p of products) {
    const dest = path.join(dir, p.imageFileName);
    try {
      await download(p.imageSrc, dest);
      console.log('Downloaded:', p.imageFileName);
    } catch (e) {
      console.error('Failed:', p.imageFileName, e.message);
    }
  }
  
  // Save products metadata
  fs.writeFileSync(path.join(__dirname, 'kraft_products_data.json'), JSON.stringify(products, null, 2));
  console.log('Saved product data to scripts/kraft_products_data.json');
})();
