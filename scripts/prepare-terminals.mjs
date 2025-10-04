/**
 * Prepare terminal themes:
 * - Ghostty
 */

import fs from 'node:fs';
import stripJsonComments from 'strip-json-comments';
import { templateFromFile } from 'smpltmpl';

const DARK_PALETTE = `dark/palette.json`;
const DARK_ANSI_PALETTE = `dark/ansi.json`;

function readJsonFile(file) {
  return JSON.parse(stripJsonComments(fs.readFileSync(file, 'utf8')));
}

const darkPalette = readJsonFile(DARK_PALETTE);
const darkAnsiPaletteRaw = readJsonFile(DARK_ANSI_PALETTE);

// Convert color names to HEX values
const darkAnsiPalette = Object.fromEntries(
  Object.entries(darkAnsiPaletteRaw).map(([key, colorName]) => {
    if (darkPalette[colorName] === undefined) {
      console.error(`⛔️ Color not found in the dark palette: ${colorName}`);
    }
    return [key, darkPalette[colorName]];
  }),
);

const darkDpAnsiPalette = Object.fromEntries(
  Object.entries(darkAnsiPaletteRaw).map(([key, colorName]) => {
    const paletteColorName = colorName
      .replace('gray', 'purple')
      .replace(/^brightYellow$/, 'brightYellowPurple')
      .replace(/^brightYellowLight$/, 'brightYellowLightPurple');
    if (darkPalette[paletteColorName] === undefined) {
      console.error(
        `⛔️ Color not found in the dark palette: ${paletteColorName}`,
      );
    }
    return [key, darkPalette[paletteColorName]];
  }),
);

// ------------ 8< -- 8< ------------

// Create Ghostty themes

console.log();
console.log('[TERMINAL] Preparing Ghostty themes… 🌚');

const ghosttyDarkTheme = templateFromFile(
  'themes/Ghostty/ghostty.template.ini',
  {
    name: 'Dark',
    ...darkAnsiPalette,
    iconForeground: darkPalette.purple0a,
    iconBackground: darkPalette.gray04,
  },
);
fs.writeFileSync('themes/Ghostty/Squirrelsong Dark', ghosttyDarkTheme);

const ghosttyDarkDpTheme = templateFromFile(
  'themes/Ghostty/ghostty.template.ini',
  {
    name: 'Dark Deep Purple',
    ...darkDpAnsiPalette,
    iconForeground: darkPalette.purple0a,
    iconBackground: darkPalette.purple05,
  },
);
fs.writeFileSync(
  'themes/Ghostty/Squirrelsong Dark Deep Purple',
  ghosttyDarkDpTheme,
);
