/* Generate responsive variants from public/gallery/gaon.jpg, gaon2.jpg … gaon10.jpg
   Output to public/gallery/opt/{width}/<name>.webp and .jpg
   Usage: npm run gen:images
*/
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, 'public', 'gallery');
const OUT_DIR = path.join(SRC_DIR, 'opt');
const WIDTHS = [320, 640, 960, 1280];

async function ensureDir(p) { await fs.mkdir(p, { recursive: true }); }

async function listInputs() {
  const names = ['gaon', ...Array.from({length: 9}, (_,i) => `gaon${i+2}`)];
  const files = [];
  for (const n of names) {
    for (const ext of ['jpg', 'jpeg', 'png']) {
      const fp = path.join(SRC_DIR, `${n}.${ext}`);
      try { await fs.access(fp); files.push({ key: n, file: fp }); break; } catch {}
    }
  }
  return files;
}

async function processOne({ key, file }) {
  for (const w of WIDTHS) {
    const outDir = path.join(OUT_DIR, String(w));
    await ensureDir(outDir);

    const img = sharp(file).rotate().resize({ width: w, withoutEnlargement: true });

    // webp
    await img.clone().webp({ quality: 68 }).toFile(path.join(outDir, `${key}.webp`));
    // jpg
    await img.clone().jpeg({ quality: 74, progressive: true, mozjpeg: true }).toFile(path.join(outDir, `${key}.jpg`));
  }
  console.log('✓', path.basename(file));
}

(async () => {
  await ensureDir(OUT_DIR);
  const inputs = await listInputs();
  if (inputs.length === 0) {
    console.warn('No source images found in public/gallery. Drop gaon.jpg, gaon2.jpg… and rerun.');
    return;
  }
  await Promise.all(inputs.map(processOne));
  console.log('Done.');
})();
