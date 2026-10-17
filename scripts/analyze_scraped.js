const fs = require('fs');
const path = 'C:\\Users\\HEMANT GUPTA\\.gemini\\antigravity-ide\\brain\\2799050f-16a4-455e-9d4f-15d293a4ed0e\\.system_generated\\steps\\321\\content.md';
const content = fs.readFileSync(path, 'utf8');

console.log('File size in chars:', content.length);

// Look at sections
const lines = content.split('\n');
console.log('Total lines:', lines.length);

// Let's print out what HTML tags and headings exist
const headings = content.match(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi) || [];
console.log('\n--- HEADINGS ---');
headings.forEach(h => console.log(h.replace(/<[^>]+>/g, '').trim()));

// Let's find banners and hero sections
const bannerMatches = content.match(/class="[^"]*(?:banner|slider|carousel|hero|product|category|featured)[^"]*"/gi) || [];
console.log('\n--- KEY WRAPPER CLASSES ---');
console.log(Array.from(new Set(bannerMatches)).slice(0, 25));
