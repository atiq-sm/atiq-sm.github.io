import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function rasterize(svgPath, pngPath, width) {
  const svg = readFileSync(join(root, svgPath), 'utf8');
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    font: { loadSystemFonts: true, defaultFontFamily: 'Times New Roman' },
  });
  writeFileSync(join(root, pngPath), resvg.render().asPng());
  console.log(`wrote ${pngPath}`);
}

rasterize('public/og-image.svg', 'public/og-image.png', 1200);
rasterize('public/favicon.svg', 'public/apple-touch-icon.png', 180);
