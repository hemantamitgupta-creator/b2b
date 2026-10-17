const https = require('https');
const fs = require('fs');
const path = require('path');

https.get('https://www.kraftsurgicals.in/', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Extract product cards from HTML
    // Search for img src and product names/prices
    const imgMatches = [...data.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)];
    const images = imgMatches.map(m => m[1]).filter(s => s.includes('imimg.com'));
    
    // Save unique image URLs
    const uniqueImages = [...new Set(images)];
    console.log('Total unique product images found:', uniqueImages.length);
    fs.writeFileSync(path.join(__dirname, 'kraft_images.json'), JSON.stringify(uniqueImages, null, 2));
    console.log('Saved to scripts/kraft_images.json');
  });
});
