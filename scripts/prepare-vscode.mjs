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
const GENERATED_DP_DARK = `${DARK_DIR}/SquirrelsongDarkDeepPurple.color-theme.json`;
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

const darkText = baseLightText.replaceAll(/#[0-9a-f]{6}/gi, (hexColor) => {
  // Find the color name in light palette that matches this HEX value
  for (const [colorName, lightHex] of Object.entries(lightPalette)) {
    if (lightHex.toLowerCase() === hexColor.toLowerCase()) {
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

  // Color is missing in the palette, return the original color
  console.error(`⛔️ Color not found in light palette: ${hexColor}`);
  return hexColor;
});

// Parse the updated text as JSON
const darkJson = JSON.parse(stripJsonComments(darkText));

// Update metadata
darkJson.name = 'Squirrelsong Dark';
darkJson.type = 'dark';

// Custom colors
darkJson.colors['terminal.inactiveSelectionBackground'] =
  darkJson.colors['editor.inactiveSelectionBackground'];
darkJson.colors['terminal.selectionBackground'] =
  darkJson.colors['editor.selectionBackground'];
darkJson.colors['textLink.foreground'] = darkPalette.blue;
darkJson.colors['textLink.activeForeground'] = darkPalette.blueContrast;

// Update terminal colors using ANSI palette (gray)
for (const [key] of Object.entries(darkJson.colors)) {
  if (key.startsWith('terminal.')) {
    // Extract color name from key (e.g., 'terminal.ansiBrightBlack' -> 'brightBlack')
    const colorKey = key.replace('terminal.ansi', '').replace('terminal.', '');
    const ansiColorName = colorKey.charAt(0).toLowerCase() + colorKey.slice(1);

    console.log(
      '👉',
      colorKey,
      '→',
      ansiColorName,
      darkAnsiPalette[ansiColorName] ? '✅' : '❌',
    );

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

console.log();
console.log('[VSCODE] Preparing dark deep purple theme… 🌚');

const darkDpText = darkText.replaceAll(/#[0-9a-f]{6}/gi, (hexColor) => {
  // Find the color name in dark palette that matches this HEX value
  for (const [colorName, darkHex] of Object.entries(darkPalette)) {
    if (
      darkHex.toLowerCase() === hexColor.toLowerCase() &&
      (colorName.startsWith('gray') || colorName.startsWith('brightYellow'))
    ) {
      const purpleColorName = colorName
        .replace('gray', 'purple')
        .replace(/^brightYellow$/, 'brightYellowPurple')
        .replace(/^brightYellowDim$/, 'brightYellowDimPurple');
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
darkDpJson.name = 'Squirrelsong Dark Deep Purple';
darkDpJson.type = 'dark';

// Custom colors
darkDpJson.colors['terminal.inactiveSelectionBackground'] =
  darkDpJson.colors['editor.inactiveSelectionBackground'];
darkDpJson.colors['terminal.selectionBackground'] =
  darkDpJson.colors['editor.selectionBackground'];
darkDpJson.colors['textLink.foreground'] = darkPalette.blue;
darkDpJson.colors['textLink.activeForeground'] = darkPalette.blueContrast;

// Update terminal colors using ANSI palette (purple)
for (const [key] of Object.entries(darkDpJson.colors)) {
  if (key.startsWith('terminal.')) {
    // Extract color name from key (e.g., 'terminal.ansiBrightBlack' -> 'brightBlack')
    const colorKey = key.replace('terminal.ansi', '').replace('terminal.', '');
    const ansiColorName = colorKey.charAt(0).toLowerCase() + colorKey.slice(1);

    if (darkAnsiPalette[ansiColorName]) {
      const paletteColorName = darkAnsiPalette[ansiColorName]
        .replace('gray', 'purple')
        .replace(/^brightYellow$/, 'brightYellowPurple')
        .replace(/^brightYellowDim$/, 'brightYellowDimPurple');
      console.log(
        '👉',
        colorKey,
        '→',
        paletteColorName,
        darkPalette[paletteColorName] ? '✅' : '❌',
      );

      if (darkPalette[paletteColorName]) {
        darkDpJson.colors[key] = darkPalette[paletteColorName];
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
