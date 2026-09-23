import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// The SVGs name only the generic families. resvg honors just the first family
// in a list and ignores its generic-family options, so swap in what the site's
// font stacks resolve to on this OS before rendering.
const FONTS = {
  darwin: { sans: 'Helvetica Neue', mono: 'Menlo' },
  win32: { sans: 'Arial', mono: 'Consolas' },
}[process.platform] ?? { sans: 'Liberation Sans', mono: 'Liberation Mono' };

function rasterize(svgPath, pngPath, width) {
  const svg = readFileSync(join(root, svgPath), 'utf8')
    .replaceAll('font-family="sans-serif"', `font-family="${FONTS.sans}"`)
    .replaceAll('font-family="monospace"', `font-family="${FONTS.mono}"`);
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    font: { loadSystemFonts: true, defaultFontFamily: FONTS.sans },
  });
  writeFileSync(join(root, pngPath), resvg.render().asPng());
  console.log(`wrote ${pngPath}`);
}

rasterize('public/og-image.svg', 'public/og-image.png', 1200);
rasterize('public/favicon.svg', 'public/apple-touch-icon.png', 180);
