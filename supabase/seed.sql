-- ==============================================================================
-- KRAFT SURGICALS PRIVATE LIMITED - B2B SURGICAL CATALOGUE SEED DATA
-- Fully RFC 4122 UUID compliant seed for PostgreSQL & Supabase
-- ==============================================================================

-- 0. Clean up previous test and mock records to ensure idempotent execution
DELETE FROM public.product_specifications WHERE product_id IN (
  'c17b07df-8125-4418-bea3-dba59ce98cfc',
  'a5e4ce53-a5cc-4a77-a5f5-63031fc08461',
  'cba73a71-7247-4edd-8f78-3a00b0468e0a',
  '8292989d-5eb6-4b0e-804e-033f6e8112ff',
  '86636896-9e44-40a3-90b9-3ce685bcf591',
  'a0c92dba-8d99-4bb3-84a0-a92fdc364832',
  'd3922e73-5452-49cb-8c84-55ccf9c6836e',
  'f6b0d093-1893-4ee9-81c5-83aa4c1d8257',
  'c9d5398d-31ab-4b96-878a-f6c20d257f68',
  'b503e778-16e3-4d1a-9069-f681202a2ac7',
  '1941284e-cf4f-4b21-915a-a368920ad90d',
  '571e2e31-8aef-4594-8878-af37366e0d9b'
);

DELETE FROM public.product_images WHERE product_id IN (
  'c17b07df-8125-4418-bea3-dba59ce98cfc',
  'a5e4ce53-a5cc-4a77-a5f5-63031fc08461',
  'cba73a71-7247-4edd-8f78-3a00b0468e0a',
  '8292989d-5eb6-4b0e-804e-033f6e8112ff',
  '86636896-9e44-40a3-90b9-3ce685bcf591',
  'a0c92dba-8d99-4bb3-84a0-a92fdc364832',
  'd3922e73-5452-49cb-8c84-55ccf9c6836e',
  'f6b0d093-1893-4ee9-81c5-83aa4c1d8257',
  'c9d5398d-31ab-4b96-878a-f6c20d257f68',
  'b503e778-16e3-4d1a-9069-f681202a2ac7',
  '1941284e-cf4f-4b21-915a-a368920ad90d',
  '571e2e31-8aef-4594-8878-af37366e0d9b'
);

-- Remove previous products with identical slugs if present under old test IDs
DELETE FROM public.products WHERE slug IN (
  '4k-ultra-hd-endoscope-camera-icg',
  'bariatric-curved-metzenbaum-laparoscopic-scissors',
  'maryland-dissecting-laparoscopic-grasper',
  'electrosurgical-co2-insufflator-40l',
  'digital-cautery-machine-with-vessel-sealer',
  'ultra-hd-surgical-camera-system',
  'stille-luer-double-action-bone-rongeur',
  'debakey-atraumatic-peripheral-vascular-clamp',
  'castroviejo-micro-needle-holder-tc',
  'sukhadia-uterine-manipulator-complete-set',
  'ball-loops-urology-electrode',
  'fibre-optic-laryngoscope-set'
);

-- Clean up any existing categories by slug (safely removes any previous mock entries)
DELETE FROM public.categories WHERE slug IN (
  'laparoscopic-instruments',
  'surgical-instrument',
  'laparoscopy-instruments',
  'surgical-equipment',
  'urology-instruments',
  'gynaecology-and-obstetrics',
  'orthopedic-and-trauma',
  'cardiovascular-and-thoracic',
  'sfws',
  'test-category'
);

-- 1. Insert Official Kraft Surgicals Categories
INSERT INTO public.categories (id, name, slug, description, is_active, sort_order)
VALUES
  (
    'b59b0516-648f-4042-a3b6-0fe40e219066',
    'Laparoscopic Instruments',
    'laparoscopic-instruments',
    'Minimally invasive 4K endoscope cameras, rotating graspers, curved Metzenbaum scissors, dissectors, trocars, and needle holders designed for operating theatre precision.',
    true,
    1
  ),
  (
    'a69411e8-bf25-43ad-a0e3-847a229d5510',
    'Surgical Instrument',
    'surgical-instrument',
    'Operating theatre essentials, Ultra HD surgical cameras, ENT surgery sets, fibre optic laryngoscopes, and bipolar bayonet forceps.',
    true,
    2
  ),
  (
    '63a46b5c-f4d9-4f9e-846e-9871dae4e8a5',
    'Laparoscopy Instruments',
    'laparoscopy-instruments',
    'Advanced electrosurgical vessel sealers, Karl Storz type rotating forceps, autoclavable monopolar cables, and stainless steel hysteroscopes.',
    true,
    3
  ),
  (
    '1da2da04-a9c7-4c68-addf-48b5f9ab1b1e',
    'Surgical Equipment',
    'surgical-equipment',
    'Electrosurgical CO2 insufflators, medical grade LED light sources, surgical monitors, and endoscopy camera towers.',
    true,
    4
  ),
  (
    'bf978098-e7c2-4287-83c4-65e930a0e158',
    'Urology Instruments & Equipments',
    'urology-instruments',
    'Ball loops urology electrodes, cystoscope sheaths, nephroscopes, TURP working elements, and resectoscope instruments.',
    true,
    5
  ),
  (
    'e464b032-7277-4d7c-9ec6-0655b02b4b66',
    'Gynaecology & Obstetrics',
    'gynaecology-and-obstetrics',
    'Sukhadia uterine manipulators, Mangeshkar manipulators, uterine tenaculum forceps, and colpotomizers for clinical safety.',
    true,
    6
  ),
  (
    '7eab670a-3e94-4fda-977e-41dd6ad167dd',
    'Orthopedic & Trauma',
    'orthopedic-and-trauma',
    'Compound-action bone rongeurs, osteotomes, bone reamers, and retractors crafted from medical-grade surgical alloy.',
    true,
    7
  ),
  (
    '7e1d26c8-9284-44a0-905f-b4ee3298399e',
    'Cardiovascular & Thoracic',
    'cardiovascular-and-thoracic',
    'Atraumatic DeBakey vascular clamps, micro-scissors, and coronary dilators for delicate cardio-thoracic interventions.',
    true,
    8
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order;

-- 2. Insert Official Products
INSERT INTO public.products (id, category_id, name, slug, short_description, description, status, featured)
VALUES
  -- 1. 4K Camera
  (
    'c17b07df-8125-4418-bea3-dba59ce98cfc',
    'b59b0516-648f-4042-a3b6-0fe40e219066',
    '4K Ultra HD Endoscope Camera ICG',
    '4k-ultra-hd-endoscope-camera-icg',
    'Next-generation 4K Ultra HD surgical camera unit with Indocyanine Green (ICG) fluorescence imaging mode.',
    'Engineered for advanced laparoscopic and endoscopic surgery. Features 3840x2160 resolution sensor with high color fidelity and depth perception. Near-infrared (NIR) ICG fluorescence visualization enables real-time intraoperative perfusion assessment and lymphatic mapping. Fully compatible with standard laparoscopes and C-mount medical optics.',
    'published',
    true
  ),
  -- 2. Metzenbaum Scissors
  (
    'a5e4ce53-a5cc-4a77-a5f5-63031fc08461',
    'b59b0516-648f-4042-a3b6-0fe40e219066',
    'Bariatric Curved Metzenbaum Laparoscopic Scissors',
    'bariatric-curved-metzenbaum-laparoscopic-scissors',
    'Precision insulated 360-degree rotating shaft with tungsten carbide cutting edges for delicate tissue dissection.',
    'Crafted from surgical-grade AISI 420 martensitic steel with micro-bonded tungsten carbide scissor inserts. Delivers enduring blade sharpness through repeated steam autoclave cycles. The 360-degree fingertip rotation knob and monopolar HF electrosurgical post allow comfortable single-handed adjustment.',
    'published',
    true
  ),
  -- 3. Maryland Grasper
  (
    'cba73a71-7247-4edd-8f78-3a00b0468e0a',
    'b59b0516-648f-4042-a3b6-0fe40e219066',
    'Maryland Dissecting Laparoscopic Grasper (5mm)',
    'maryland-dissecting-laparoscopic-grasper',
    'Ergonomic monopolar electrocautery compatible dissector with cross-serrated curved jaws.',
    'A staple instrument for laparoscopic abdominal and pelvic surgery. The tapered curved tip allows atraumatic dissection and secure tissue grasping. Fitted with high-voltage dielectric insulation tested to 10 kV for safe electrosurgical coagulation.',
    'published',
    true
  ),
  -- 4. CO2 Insufflator
  (
    '8292989d-5eb6-4b0e-804e-033f6e8112ff',
    '1da2da04-a9c7-4c68-addf-48b5f9ab1b1e',
    'Electrosurgical CO2 Insufflator 40L',
    'electrosurgical-co2-insufflator-40l',
    'High-flow laparoscopic insufflation unit with integrated inline gas heating and automatic pressure compensation.',
    'Features a responsive flow delivery system reaching 40 liters per minute with micro-processor controlled abdominal pressure monitoring. The integrated heating element ensures gas reaches 37°C to prevent patient hypothermia and scope fogging during elongated procedures.',
    'published',
    true
  ),
  -- 5. Cautery & Vessel Sealer
  (
    '86636896-9e44-40a3-90b9-3ce685bcf591',
    '63a46b5c-f4d9-4f9e-846e-9871dae4e8a5',
    'Digital Cautery Machine With Vessel Sealer (400W)',
    'digital-cautery-machine-with-vessel-sealer',
    'Advanced 400W microprocessor electrosurgical unit with integrated vessel fusion system for up to 7mm vessels.',
    'Combines high-frequency monopolar cut/coag, bipolar precision sealing, and advanced vessel sealing algorithms. Delivers tissue feedback impedance monitoring at 200,000 checks per second for minimal thermal spread and rapid hemostasis.',
    'published',
    true
  ),
  -- 6. Ultra HD Camera System
  (
    'a0c92dba-8d99-4bb3-84a0-a92fdc364832',
    'a69411e8-bf25-43ad-a0e3-847a229d5510',
    'Ultra HD Surgical Camera System',
    'ultra-hd-surgical-camera-system',
    'Full HD / UHD CMOS medical camera console with digital zoom, freeze frame, and customizable white balance presets.',
    'Engineered for multi-specialty surgical suites (ENT, Arthroscopy, Laparoscopy, and Cystoscopy). High signal-to-noise ratio ensures clear surgical field visualization even in deep anatomical cavities. Features multiple video outputs including DVI, HDMI, and SDI.',
    'published',
    false
  ),
  -- 7. Bone Rongeur
  (
    'd3922e73-5452-49cb-8c84-55ccf9c6836e',
    '7eab670a-3e94-4fda-977e-41dd6ad167dd',
    'Stille-Luer Double-Action Bone Rongeur',
    'stille-luer-double-action-bone-rongeur',
    'Compound-action orthopedic bone cutter forged from tempered German surgical steel.',
    'Provides multiplied biting power with minimal hand strain during spinal and joint surgery. The curved scoop jaws feature induction-hardened cutting edges designed for cleanly excising dense cortical and cancellous bone structures.',
    'published',
    false
  ),
  -- 8. DeBakey Vascular Clamp
  (
    'f6b0d093-1893-4ee9-81c5-83aa4c1d8257',
    '7e1d26c8-9284-44a0-905f-b4ee3298399e',
    'DeBakey Atraumatic Peripheral Vascular Clamp',
    'debakey-atraumatic-peripheral-vascular-clamp',
    'Cardiovascular occlusion clamp with precision DeBakey atraumatic longitudinal serrations.',
    'Manufactured for temporary vessel occlusion without endothelial intima damage. Features satin micro-blasted finish to eliminate harsh reflections under surgical theatre LED lights. Precision multi-stop box lock ratchet provides calibrated clamping pressure.',
    'published',
    false
  ),
  -- 9. Castroviejo Micro Needle Holder
  (
    'c9d5398d-31ab-4b96-878a-f6c20d257f68',
    '7e1d26c8-9284-44a0-905f-b4ee3298399e',
    'Castroviejo Micro Needle Holder with Tungsten Carbide',
    'castroviejo-micro-needle-holder-tc',
    'Delicate spring-action micro needle driver with gold-plated rings and fine pyramid-toothed TC inserts.',
    'Designed for delicate cardiovascular anastomosis, ophthalmic, and plastic reconstructive procedures. Holds 5-0 through 8-0 microsurgical sutures securely without twisting or slippage.',
    'published',
    false
  ),
  -- 10. Sukhadia Uterine Manipulator
  (
    'b503e778-16e3-4d1a-9069-f681202a2ac7',
    'e464b032-7277-4d7c-9ec6-0655b02b4b66',
    'Sukhadia Uterine Manipulator Complete Set',
    'sukhadia-uterine-manipulator-complete-set',
    'Total laparoscopic hysterectomy (TLH) manipulator set with interchangeable ceramic colpotomy cups.',
    'Essential gynaecological assembly allowing optimal anteversion, retroversion, and lateral displacement of the uterus. Features chromopertubation cannula and ceramic bevelled delineation cup for safe bladder dissection and circular vaginal incision.',
    'published',
    false
  ),
  -- 11. Ball Loops Urology Electrode
  (
    '1941284e-cf4f-4b21-915a-a368920ad90d',
    'bf978098-e7c2-4287-83c4-65e930a0e158',
    'Ball Loops Urology Resectoscope Electrode (24 Fr)',
    'ball-loops-urology-electrode',
    'Precision coagulation roller ball electrode for transurethral resection of the prostate (TURP).',
    'Designed for rapid hemostasis and electro-vaporization in urological resectoscopes. Compatible with 24 Fr / 26 Fr working elements from Karl Storz and Olympus systems. High dielectric insulation ensures concentrated current delivery.',
    'published',
    false
  ),
  -- 12. Fibre Optic Laryngoscope
  (
    '571e2e31-8aef-4594-8878-af37366e0d9b',
    'a69411e8-bf25-43ad-a0e3-847a229d5510',
    'Fibre Optic Laryngoscope with 4 Macintosh Blades',
    'fibre-optic-laryngoscope-set',
    'High-intensity green-system LED fibre optic laryngoscope set in stainless steel carry case.',
    'Features seamless integrated fibre optic light bundle with cool daylight LED illumination. Autoclavable stainless steel blades (sizes 1, 2, 3, 4) conform to ISO 7376-3 specifications with anti-glare satin finish.',
    'published',
    false
  )
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured;

-- 3. Insert Product Images
INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order, is_primary)
VALUES
  ('a8ea5936-29b5-44a3-858c-6bafaac652cd', 'c17b07df-8125-4418-bea3-dba59ce98cfc', '/images/prod-camera-4k.svg', '4K Ultra HD Endoscope Camera ICG profile', 0, true),
  ('7f169978-bd12-4665-8f5d-4dc354d10aec', 'a5e4ce53-a5cc-4a77-a5f5-63031fc08461', '/images/prod-scissors.svg', 'Bariatric Curved Metzenbaum Laparoscopic Scissors', 0, true),
  ('6ab78e7f-df2c-411c-b05d-bfabea30c320', 'cba73a71-7247-4edd-8f78-3a00b0468e0a', '/images/prod-grasper.svg', 'Maryland Dissecting Laparoscopic Grasper (5mm)', 0, true),
  ('a027b1af-2e97-4d41-886a-9c4fba93de78', '8292989d-5eb6-4b0e-804e-033f6e8112ff', '/images/prod-insufflator.svg', 'Electrosurgical CO2 Insufflator 40L', 0, true),
  ('a6a0c17f-2e9c-4cd7-a24d-6ccf0ce18fa1', '86636896-9e44-40a3-90b9-3ce685bcf591', '/images/prod-cautery.svg', 'Digital Cautery Machine With Vessel Sealer (400W)', 0, true),
  ('ebda7a5d-6bd0-4ca6-b9b9-5f29cd9ae722', 'a0c92dba-8d99-4bb3-84a0-a92fdc364832', '/images/prod-camera-uhd.svg', 'Ultra HD Surgical Camera System', 0, true),
  ('4c66e6be-14c4-4a5f-99fd-97b5f8e2a197', 'd3922e73-5452-49cb-8c84-55ccf9c6836e', '/images/prod-rongeur.svg', 'Stille-Luer Double-Action Bone Rongeur', 0, true),
  ('6d79c9d5-27bd-4be6-bf1b-1afa993db339', 'f6b0d093-1893-4ee9-81c5-83aa4c1d8257', '/images/prod-debakey.svg', 'DeBakey Atraumatic Peripheral Vascular Clamp', 0, true),
  ('9ad22f8a-a167-43a9-9ed8-812ab7eff7a3', 'c9d5398d-31ab-4b96-878a-f6c20d257f68', '/images/prod-castroviejo.svg', 'Castroviejo Micro Needle Holder with Tungsten Carbide', 0, true),
  ('f03ec7e5-4414-49c3-a0e1-7c8711b6a895', 'b503e778-16e3-4d1a-9069-f681202a2ac7', '/images/prod-manipulator.svg', 'Sukhadia Uterine Manipulator Complete Set', 0, true),
  ('b51ae99f-fc9d-4252-90f9-56d9f7facceb', '1941284e-cf4f-4b21-915a-a368920ad90d', '/images/prod-urology-loop.svg', 'Ball Loops Urology Resectoscope Electrode', 0, true),
  ('706706a7-0457-48d3-9ac8-660f1594f24b', '571e2e31-8aef-4594-8878-af37366e0d9b', '/images/prod-laryngoscope.svg', 'Fibre Optic Laryngoscope with 4 Macintosh Blades', 0, true)
ON CONFLICT (id) DO UPDATE SET
  product_id = EXCLUDED.product_id,
  storage_path = EXCLUDED.storage_path,
  alt_text = EXCLUDED.alt_text,
  sort_order = EXCLUDED.sort_order,
  is_primary = EXCLUDED.is_primary;

-- 4. Dynamic Technical Specifications
INSERT INTO public.product_specifications (product_id, label, value, sort_order)
VALUES
  -- 4K Camera Specs
  ('c17b07df-8125-4418-bea3-dba59ce98cfc', 'Resolution', '3840 x 2160 pixels (Native 4K UHD)', 1),
  ('c17b07df-8125-4418-bea3-dba59ce98cfc', 'Fluorescence Mode', 'NIR / ICG Dual Spectrum Visualization', 2),
  ('c17b07df-8125-4418-bea3-dba59ce98cfc', 'Signal Outputs', '12G-SDI, HDMI 2.0, DVI-D, DisplayPort', 3),
  ('c17b07df-8125-4418-bea3-dba59ce98cfc', 'Waterproof Rating', 'IPX8 Soakable Camera Head', 4),
  ('c17b07df-8125-4418-bea3-dba59ce98cfc', 'Certification', 'CE Mark / ISO 13485:2016 Compliant', 5),

  -- Metzenbaum Scissors Specs
  ('a5e4ce53-a5cc-4a77-a5f5-63031fc08461', 'Shaft Diameter', '5.0 mm', 1),
  ('a5e4ce53-a5cc-4a77-a5f5-63031fc08461', 'Working Length', '430 mm (Bariatric extended)', 2),
  ('a5e4ce53-a5cc-4a77-a5f5-63031fc08461', 'Jaw Design', 'Curved Metzenbaum, TC Inserted', 3),
  ('a5e4ce53-a5cc-4a77-a5f5-63031fc08461', 'Rotation', '360° Continuous Finger Knob', 4),
  ('a5e4ce53-a5cc-4a77-a5f5-63031fc08461', 'Dielectric Coating', 'Tested to 10,000 V HF Breakdown', 5),
  ('a5e4ce53-a5cc-4a77-a5f5-63031fc08461', 'Material Grade', 'AISI 420 Martensitic Stainless Steel', 6),
  ('a5e4ce53-a5cc-4a77-a5f5-63031fc08461', 'Sterilization', 'Autoclavable up to 134°C / 273°F (Steam)', 7),

  -- Maryland Grasper Specs
  ('cba73a71-7247-4edd-8f78-3a00b0468e0a', 'Shaft Diameter', '5.0 mm', 1),
  ('cba73a71-7247-4edd-8f78-3a00b0468e0a', 'Working Length', '330 mm (Standard Laparoscopic)', 2),
  ('cba73a71-7247-4edd-8f78-3a00b0468e0a', 'Jaw Action', 'Double-action cross-serrated curved tips', 3),
  ('cba73a71-7247-4edd-8f78-3a00b0468e0a', 'Cautery Port', '4mm standard male banana electrosurgical post', 4),
  ('cba73a71-7247-4edd-8f78-3a00b0468e0a', 'Handle Type', 'Ergonomic light-touch handle without ratchet', 5),

  -- CO2 Insufflator Specs
  ('8292989d-5eb6-4b0e-804e-033f6e8112ff', 'Max Gas Flow', '40 Liters / Minute', 1),
  ('8292989d-5eb6-4b0e-804e-033f6e8112ff', 'Pressure Range', '1 - 30 mmHg (Adjustable)', 2),
  ('8292989d-5eb6-4b0e-804e-033f6e8112ff', 'Gas Pre-Heating', 'Integrated constant 37°C Heating Element', 3),
  ('8292989d-5eb6-4b0e-804e-033f6e8112ff', 'Safety Relief', 'High-speed automatic safety vent valve', 4),

  -- Cautery & Vessel Sealer Specs
  ('86636896-9e44-40a3-90b9-3ce685bcf591', 'Max Output Power', '400 Watts at 300 Ohms', 1),
  ('86636896-9e44-40a3-90b9-3ce685bcf591', 'Vessel Fusion', 'Seals up to 7mm lumen vessels', 2),
  ('86636896-9e44-40a3-90b9-3ce685bcf591', 'TURP Compatibility', 'Bi-TUR Saline Resection Mode Supported', 3),
  ('86636896-9e44-40a3-90b9-3ce685bcf591', 'Programs', '100 User Programmable Memory Presets', 4),

  -- Bone Rongeur Specs
  ('d3922e73-5452-49cb-8c84-55ccf9c6836e', 'Instrument Length', '220 mm (8.75 in)', 1),
  ('d3922e73-5452-49cb-8c84-55ccf9c6836e', 'Bite Size', '6.0 mm x 15.0 mm Curved Scoop', 2),
  ('d3922e73-5452-49cb-8c84-55ccf9c6836e', 'Action Mechanism', 'Compound Double Action Lever with Leaf Spring', 3),
  ('d3922e73-5452-49cb-8c84-55ccf9c6836e', 'Surface Finish', 'Satin Anti-Glare Micro-Bead', 4),

  -- Vascular Clamp Specs
  ('f6b0d093-1893-4ee9-81c5-83aa4c1d8257', 'Overall Length', '195 mm', 1),
  ('f6b0d093-1893-4ee9-81c5-83aa4c1d8257', 'Jaw Curvature', '60° Angled DeBakey Non-Traumatic', 2),
  ('f6b0d093-1893-4ee9-81c5-83aa4c1d8257', 'Serration Type', '1 x 2 longitudinal interlocking atraumatic teeth', 3),
  ('f6b0d093-1893-4ee9-81c5-83aa4c1d8257', 'Ratchet Teeth', '5-position graduated lock', 4),

  -- Sukhadia Manipulator Specs
  ('b503e778-16e3-4d1a-9069-f681202a2ac7', 'Cup Sizes', '32mm, 35mm, 40mm Ceramic Colpotomy Rings', 1),
  ('b503e778-16e3-4d1a-9069-f681202a2ac7', 'Cannula Type', 'Stainless Steel with Luer Lock Dye Port', 2),
  ('b503e778-16e3-4d1a-9069-f681202a2ac7', 'Articulation', 'Multi-axis rotational locking handle', 3),

  -- Urology Ball Loops Specs
  ('1941284e-cf4f-4b21-915a-a368920ad90d', 'Shaft Gauge', '24 Fr / 26 Fr Resectoscope Sheaths', 1),
  ('1941284e-cf4f-4b21-915a-a368920ad90d', 'Ball Diameter', '3.0 mm & 5.0 mm Coagulation Roller', 2),
  ('1941284e-cf4f-4b21-915a-a368920ad90d', 'Connector', 'Active standard high-frequency plug', 3),

  -- Laryngoscope Specs
  ('571e2e31-8aef-4594-8878-af37366e0d9b', 'Blade Sizes', 'Macintosh #1, #2, #3, #4 included', 1),
  ('571e2e31-8aef-4594-8878-af37366e0d9b', 'Light Transmission', 'Integrated Green System Quartz Fiber Bundle', 2),
  ('571e2e31-8aef-4594-8878-af37366e0d9b', 'Handle Battery', 'Type C / 2.5V or Rechargeable Lithium', 3);
