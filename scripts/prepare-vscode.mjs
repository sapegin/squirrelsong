/**
 * Prepare VS Code extensions:
 * 1. Create Dark theme
 * 2. Create Dark Deep Purple theme
 * 3. Create Light with dark terminal theme
 * 4. Create Light with dark deep purple terminal theme
 */

import fs from 'node:fs';
import stripJsonComments from 'strip-json-comments';

const LIGHT_DIR = 'themes/VSCode/SquirrelsongLight';
const DARK_DIR = 'themes/VSCode/SquirrelsongDark';
const BASE_LIGHT = `${LIGHT_DIR}/SquirrelsongLight.color-theme.json`;
const GENERATED_DARK = `${DARK_DIR}/SquirrelsongDark.color-theme.json`;
const GENERATED_DP_DARK = `${DARK_DIR}/SquirrelsongDeepPurpleDark.color-theme.json`;
const LIGHT_PALETTE = `light/palette.json`;
const DARK_PALETTE = `dark/palette.json`;
const DARK_ANSI_PALETTE = `dark/ansi.json`;

function readJsonFile(file) {
  return JSON.parse(stripJsonComments(fs.readFileSync(file, 'utf8')));
}

function writeJsonFile(file, json) {
  return fs.writeFileSync(file, JSON.stringify(json, undefined, '  '));
}

const lightPalette = readJsonFile(LIGHT_PALETTE);
const darkPalette = readJsonFile(DARK_PALETTE);
const darkAnsiPalette = readJsonFile(DARK_ANSI_PALETTE);

const baseLightText = fs.readFileSync(BASE_LIGHT, 'utf8');
const baseLight = readJsonFile(BASE_LIGHT);

// ------------ 8< -- 8< ------------

// Create Dark themes based on the light one

console.log();
console.log('[VSCODE] Preparing dark theme… 🌚');

const LIGHT_TO_DARK = {
  gray00: 'gray0f', // Unused in light palette
  gray01: 'gray0f', // Unused in light palette
  gray02: 'gray0f', // Unused in light palette
  gray03: 'gray0f', // Unused in light palette
  gray04: 'gray09',
  gray05: 'gray09',
  gray06: 'gray08',
  gray07: 'gray08',
  gray08: 'gray07',
  gray09: 'gray07',
  gray0a: 'gray06',
  gray0b: 'gray06',
  gray0c: 'gray05',
  gray0d: 'gray05',
  gray0e: 'gray04',
  gray0f: 'gray03',
  white: 'gray02',
  brightPinkLight: 'brightPinkDark',
  brightPinkLighter: 'brightPinkDark', // ??
  brightYellowLight: 'brightYellowDark',
  brightYellowLighter: 'brightYellowDark', // ??
};
const LIGHT_TO_DARK_HEX = {
  '#ffffff': '#000000',
  '#000000': '#ffffff',
};

const darkText = baseLightText.replaceAll(/#[0-9a-f]{6}/gi, (hexColor) => {
  // Find the color name in light palette that matches this HEX value
  for (const [colorName, lightHex] of Object.entries(lightPalette)) {
    if (lightHex.toLowerCase() === hexColor.toLowerCase()) {
      if (LIGHT_TO_DARK[colorName]) {
        return darkPalette[LIGHT_TO_DARK[colorName]];
      }
      if (darkPalette[colorName]) {
        return darkPalette[colorName];
      } else {
        console.error(
          `⛔️ Matching dark color not found for light color ${colorName} (${hexColor})`,
        );
        return hexColor;
      }
    }
  }

  // Try custom mapping
  if (LIGHT_TO_DARK_HEX[hexColor]) {
    return LIGHT_TO_DARK_HEX[hexColor];
  }

  // Color is missing in the palette, return the original color
  console.error(`⛔️ Color not found in light palette: ${hexColor}`);
  return hexColor;
});

// Parse the updated text as JSON
const darkJson = JSON.parse(stripJsonComments(darkText));

// Update metadata
darkJson.name = 'Squirrelsong Dark';
darkJson.type = 'dark';

// Update terminal colors using ANSI palette (gray)
for (const [key] of Object.entries(darkJson.colors)) {
  if (key.startsWith('terminal.')) {
    // Extract color name from key (e.g., 'terminal.ansiBrightBlack' -> 'brightBlack')
    const colorKey = key.replace('terminal.ansi', '').replace('terminal.', '');
    const ansiColorName = colorKey.charAt(0).toLowerCase() + colorKey.slice(1);

    if (darkAnsiPalette[ansiColorName]) {
      const paletteColorName = darkAnsiPalette[ansiColorName];
      if (darkPalette[paletteColorName]) {
        darkJson.colors[key] = darkPalette[paletteColorName];
      } else {
        console.error(
          `⛔️ Color not found in the dark palette: ${paletteColorName}`,
        );
      }
    }
  }
}

// Save the file
writeJsonFile(GENERATED_DARK, darkJson);

const darkDpText = darkText.replaceAll(/#[0-9a-f]{6}/gi, (hexColor) => {
  // Find the color name in dark palette that matches this HEX value
  for (const [colorName, darkHex] of Object.entries(darkPalette)) {
    if (
      darkHex.toLowerCase() === hexColor.toLowerCase() &&
      colorName.startsWith('gray')
    ) {
      const purpleColorName = colorName.replace('gray', 'purple');
      if (darkPalette[purpleColorName]) {
        return darkPalette[purpleColorName];
      }
    }
  }
  return hexColor;
});

// Parse the updated text as JSON
const darkDpJson = JSON.parse(stripJsonComments(darkDpText));

// Update metadata
darkJson.name = 'Squirrelsong Dark Deep Purple';
darkJson.type = 'dark';

// Update terminal colors using ANSI palette (purple)
for (const [key] of Object.entries(darkJson.colors)) {
  if (key.startsWith('terminal.')) {
    // Extract color name from key (e.g., 'terminal.ansiBrightBlack' -> 'brightBlack')
    const colorKey = key.replace('terminal.ansi', '').replace('terminal.', '');
    const ansiColorName = colorKey.charAt(0).toLowerCase() + colorKey.slice(1);

    if (darkAnsiPalette[ansiColorName]) {
      const paletteColorName = darkAnsiPalette[ansiColorName].replace(
        'gray',
        'purple',
      );
      if (darkPalette[paletteColorName]) {
        darkJson.colors[key] = darkPalette[paletteColorName];
      } else {
        console.error(
          `⛔️ Color not found in the dark palette: ${paletteColorName}`,
        );
      }
    }
  }
}

// Save the file
writeJsonFile(GENERATED_DP_DARK, darkDpJson);

// ------------ 8< -- 8< ------------

// Create Light with dark terminal themes

console.log();
console.log('[VSCODE] Preparing light themes with dark terminal… 🌗');

const lightWithDarkTerminal = {
  ...baseLight,
  name: 'Squirrelsong Light (Dark Terminal)',
  colors: { ...baseLight.colors },
};

const darkColors = Object.entries(darkJson.colors);
const darkTerminalColors = darkColors.filter(([key]) =>
  key.startsWith('terminal'),
);

for (const [key, color] of darkTerminalColors) {
  lightWithDarkTerminal.colors[key] = color;
}

writeJsonFile(
  `${LIGHT_DIR}/SquirrelsongLightDarkTerminal.color-theme.json`,
  lightWithDarkTerminal,
);

const lightWithDpDarkTerminal = {
  ...baseLight,
  name: 'Squirrelsong Light (Dark Deep Purple Terminal)',
  colors: { ...baseLight.colors },
};

const darkDpColors = Object.entries(darkDpJson.colors);
const darkDpTerminalColors = darkDpColors.filter(([key]) =>
  key.startsWith('terminal'),
);

for (const [key, color] of darkDpTerminalColors) {
  lightWithDpDarkTerminal.colors[key] = color;
}

writeJsonFile(
  `${LIGHT_DIR}/SquirrelsongLightDarkDeepPurpleTerminal.color-theme.json`,
  lightWithDpDarkTerminal,
);

// ------------ 8< -- 8< ------------

console.log('[VSCODE] Done 🦜');
