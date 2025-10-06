/**
 * Prepare terminal themes:
 * - Chrome
 * - Ghostty
 * - iTerm
 * - Sublime Text
 * - Warp
 * - WezTerm
 */

// TODO: Rename to something more generic as it's not just terminals

import fs from 'node:fs';
import stripJsonComments from 'strip-json-comments';
import { templateFromFile } from 'smpltmpl';
import { hexToRgb } from './util/hexToRgb.mjs';

function readJsonFile(file) {
  return JSON.parse(stripJsonComments(fs.readFileSync(file, 'utf8')));
}

const lightPalette = readJsonFile(`light/palette.json`);
// const lightAnsiPaletteRaw = readJsonFile(`light/ansi.json`);
const lightCodePaletteRaw = readJsonFile(`light/code.json`);
const lightUiPaletteRaw = readJsonFile(`light/ui.json`);

const darkPalette = readJsonFile(`dark/palette.json`);
const darkAnsiPaletteRaw = readJsonFile(`dark/ansi.json`);
const darkCodePaletteRaw = readJsonFile(`dark/code.json`);
const darkUiPaletteRaw = readJsonFile(`dark/ui.json`);

function toCamelCase(str) {
  return str.replaceAll(/[-_\s]+(.)?/g, (_, char) =>
    char ? char.toUpperCase() : '',
  );
}

function getDarkDpColorName(colorName) {
  return colorName
    .replace('gray', 'purple')
    .replace(/^brightYellow$/, 'brightYellowPurple')
    .replace(/^brightYellowDim$/, 'brightYellowDimPurple');
}

// Convert ANSI color names to HEX values

// const lightAnsiPalette = Object.fromEntries(
//   Object.entries(lightAnsiPaletteRaw).map(([key, colorName]) => {
//     if (lightPalette[colorName] === undefined) {
//       console.error(`⛔️ Color not found in the light palette: ${colorName}`);
//     }
//     return [key, lightPalette[colorName]];
//   }),
// );
const darkAnsiPalette = Object.fromEntries(
  Object.entries(darkAnsiPaletteRaw).map(([key, colorName]) => {
    if (darkPalette[colorName] === undefined) {
      console.error(`⛔️ Color not found in the dark palette: ${colorName}`);
    }
    return [key, darkPalette[colorName]];
  }),
);

// Convert HEX values to RGB

const lightRgbPalette = Object.fromEntries(
  Object.entries(lightPalette).map(([key, color]) => {
    return [key, hexToRgb(color).join(', ')];
  }),
);
const darkRgbPalette = Object.fromEntries(
  Object.entries(darkPalette).map(([key, color]) => {
    return [key, hexToRgb(color).join(', ')];
  }),
);

// Convert code color names to HEX values

const lightCodePalette = Object.fromEntries(
  Object.entries(lightCodePaletteRaw).map(([key, colorInfo]) => {
    const colorName = Array.isArray(colorInfo) ? colorInfo[0] : colorInfo;
    if (lightPalette[colorName] === undefined) {
      console.error(`⛔️ Color not found in the light palette: ${colorName}`);
    }
    return [toCamelCase(key), lightPalette[colorName]];
  }),
);
const darkCodePalette = Object.fromEntries(
  Object.entries(darkCodePaletteRaw).map(([key, colorInfo]) => {
    const colorName = Array.isArray(colorInfo) ? colorInfo[0] : colorInfo;
    if (darkPalette[colorName] === undefined) {
      console.error(`⛔️ Color not found in the dark palette: ${colorName}`);
    }
    return [toCamelCase(key), darkPalette[colorName]];
  }),
);

// Extract code styles

const lightCodeStyles = Object.fromEntries(
  Object.entries(lightCodePaletteRaw).map(([key, colorInfo]) => {
    const style = Array.isArray(colorInfo) ? colorInfo[1] : '';
    return [`${toCamelCase(key)}Style`, style];
  }),
);

const darkCodeStyles = Object.fromEntries(
  Object.entries(darkCodePaletteRaw).map(([key, colorInfo]) => {
    const style = Array.isArray(colorInfo) ? colorInfo[1] : '';
    return [`${toCamelCase(key)}Style`, style];
  }),
);

// Convert UI color names to HEX values

const lightUiPalette = Object.fromEntries(
  Object.entries(lightUiPaletteRaw).map(([key, colorInfo]) => {
    const colorName = Array.isArray(colorInfo) ? colorInfo[0] : colorInfo;
    if (lightPalette[colorName] === undefined) {
      console.error(`⛔️ Color not found in the light palette: ${colorName}`);
    }
    return [toCamelCase(key), lightPalette[colorName]];
  }),
);
const darkUiPalette = Object.fromEntries(
  Object.entries(darkUiPaletteRaw).map(([key, colorInfo]) => {
    const colorName = Array.isArray(colorInfo) ? colorInfo[0] : colorInfo;
    if (darkPalette[colorName] === undefined) {
      console.error(`⛔️ Color not found in the dark palette: ${colorName}`);
    }
    return [toCamelCase(key), darkPalette[colorName]];
  }),
);

// Create Dark Deep Purple palettes

const darkDpAnsiPalette = Object.fromEntries(
  Object.entries(darkAnsiPaletteRaw).map(([key, colorName]) => {
    const paletteColorName = getDarkDpColorName(colorName);
    if (darkPalette[paletteColorName] === undefined) {
      console.error(
        `⛔️ Color not found in the dark palette: ${paletteColorName}`,
      );
    }
    return [key, darkPalette[paletteColorName]];
  }),
);
const darkDpCodePalette = Object.fromEntries(
  Object.entries(darkCodePaletteRaw).map(([key, colorInfo]) => {
    const colorName = Array.isArray(colorInfo) ? colorInfo[0] : colorInfo;
    const paletteColorName = getDarkDpColorName(colorName);
    if (darkPalette[paletteColorName] === undefined) {
      console.error(
        `⛔️ Color not found in the dark palette: ${paletteColorName}`,
      );
    }
    return [toCamelCase(key), darkPalette[paletteColorName]];
  }),
);
const darkDpUiPalette = Object.fromEntries(
  Object.entries(darkUiPaletteRaw).map(([key, colorName]) => {
    const paletteColorName = getDarkDpColorName(colorName);
    if (darkPalette[paletteColorName] === undefined) {
      console.error(
        `⛔️ Color not found in the dark palette: ${paletteColorName}`,
      );
    }
    return [toCamelCase(key), darkPalette[paletteColorName]];
  }),
);

// ------------ 8< -- 8< ------------

console.log();
console.log('[TERMINAL] Preparing Chrome themes… 🌗');

const chromeLightManifest = 'themes/Chrome/extension-light/manifest.json';
const chromeLight = JSON.parse(fs.readFileSync(chromeLightManifest));
fs.writeFileSync(
  chromeLightManifest,
  templateFromFile('themes/Chrome/chrome-light.template.json', {
    version: chromeLight.version,
    ...lightRgbPalette,
  }),
);

const chromeDarkManifest = 'themes/Chrome/extension-dark/manifest.json';
const chromeDark = JSON.parse(fs.readFileSync(chromeDarkManifest));
fs.writeFileSync(
  chromeDarkManifest,
  templateFromFile('themes/Chrome/chrome-dark.template.json', {
    version: chromeDark.version,
    ...darkRgbPalette,
  }),
);

// ------------ 8< -- 8< ------------

console.log();
console.log('[TERMINAL] Preparing Ghostty themes… 🌚');

fs.writeFileSync(
  'themes/Ghostty/Squirrelsong Dark',
  templateFromFile('themes/Ghostty/ghostty.template.ini', {
    name: 'Dark',
    ...darkAnsiPalette,
    ...darkUiPalette,
    iconForeground: darkPalette.purple070,
    iconBackground: darkPalette.gray140,
  }),
);

fs.writeFileSync(
  'themes/Ghostty/Squirrelsong Dark Deep Purple',
  templateFromFile('themes/Ghostty/ghostty.template.ini', {
    name: 'Dark Deep Purple',
    ...darkDpAnsiPalette,
    ...darkDpUiPalette,
    iconForeground: darkPalette.purple070,
    iconBackground: darkPalette.purple140,
  }),
);

// ------------ 8< -- 8< ------------

console.log();
console.log('[TERMINAL] Preparing iTerm themes… 🌚');

const iTermDarkPalette = {};
for (const [colorName, hexColor] of Object.entries(darkAnsiPalette)) {
  const [r, g, b] = hexToRgb(hexColor);
  iTermDarkPalette[`${colorName}R`] = r / 255;
  iTermDarkPalette[`${colorName}G`] = g / 255;
  iTermDarkPalette[`${colorName}B`] = b / 255;
}
for (const [colorName, hexColor] of Object.entries(darkUiPalette)) {
  const [r, g, b] = hexToRgb(hexColor);
  iTermDarkPalette[`${colorName}R`] = r / 255;
  iTermDarkPalette[`${colorName}G`] = g / 255;
  iTermDarkPalette[`${colorName}B`] = b / 255;
}

fs.writeFileSync(
  'themes/iTerm2/Squirrelsong Dark.itermcolors',
  templateFromFile('themes/iTerm2/iterm.template.itermcolors', {
    ...iTermDarkPalette,
  }),
);

// ------------ 8< -- 8< ------------

console.log();
console.log('[TERMINAL] Preparing Sublime Text themes… 🌗');

fs.writeFileSync(
  'themes/Sublime Text/Squirrelsong Light/Squirrelsong Light.tmTheme',
  templateFromFile('themes/Sublime Text/textmate.template.tmTheme', {
    name: 'Light',
    semanticClass: 'theme.light.squirrelsong_light',
    uuid: '506f39ff-75a5-45af-ba44-452c5244fdb4',
    ...lightCodePalette,
    ...lightUiPalette,
    ...lightCodeStyles,
  }),
);

fs.writeFileSync(
  'themes/Sublime Text/Squirrelsong Dark/Squirrelsong Dark.tmTheme',
  templateFromFile('themes/Sublime Text/textmate.template.tmTheme', {
    name: 'Dark',
    semanticClass: 'theme.dark.squirrelsong_dark',
    uuid: '59024f0e-5ea0-4d89-96a7-98147144a79f',
    ...darkCodePalette,
    ...darkUiPalette,
    ...darkCodeStyles,
  }),
);

fs.writeFileSync(
  'themes/Sublime Text/Squirrelsong Dark Deep Purple/Squirrelsong Dark Deep Purple.tmTheme',
  templateFromFile('themes/Sublime Text/textmate.template.tmTheme', {
    name: 'Dark Deep Purple',
    semanticClass: 'theme.dark.squirrelsong_dark_dp',
    uuid: 'b5348c12-370a-4291-a2c6-7aee60eb66e9',
    ...darkDpCodePalette,
    ...darkDpUiPalette,
    ...darkCodeStyles,
  }),
);

// ------------ 8< -- 8< ------------

console.log();
console.log('[TERMINAL] Preparing Warp themes… 🌚');

fs.writeFileSync(
  'themes/Warp/squirrelsong_dark.yaml',
  templateFromFile('themes/Warp/warp.template.yaml', {
    name: 'Dark',
    ...darkPalette,
    ...darkAnsiPalette,
  }),
);

// ------------ 8< -- 8< ------------

console.log();
console.log('[TERMINAL] Preparing WezTerm themes… 🌚');

fs.writeFileSync(
  'themes/WezTerm/squirrelsong-dark.toml',
  templateFromFile('themes/WezTerm/wezterm.template.toml', {
    name: 'Dark',
    ...darkAnsiPalette,
    ...darkUiPalette,
  }),
);
