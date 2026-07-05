import sharp from 'sharp';
import fs from 'fs';

async function optimize() {
  const images = [
    'i-shape-stage.png',
    'i-motion-stage.png',
    'i-model-stage.png',
    'ems-stand-stage.png'
  ];

  for (const img of images) {
    console.log(`Optimizing ${img}...`);
    const inputPath = `public/${img}`;
    const outputPath = `public/${img.replace('.png', '.webp')}`;
    
    await sharp(inputPath)
      .webp({ quality: 80, effort: 6 })
      .toFile(outputPath);
      
    const oldSize = fs.statSync(inputPath).size / 1024;
    const newSize = fs.statSync(outputPath).size / 1024;
    console.log(`Done: ${oldSize.toFixed(2)} KB -> ${newSize.toFixed(2)} KB`);
  }
}

optimize().catch(console.error);
