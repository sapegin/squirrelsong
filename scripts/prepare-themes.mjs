/**
 * Generate themes based on templates:
 *
 * 1. Config-based templates.
 * 2. Custom templates, such as iTerm or Terminal.app.
 */

import fs from 'node:fs';
import path from 'node:path';
import stripJsonComments from 'strip-json-comments';
import terminalLink from 'terminal-link';
import { globSync } from 'glob';
import { processTemplate, applyReadmeTemplate } from './util/template.mjs';
import { hexToRgb } from './util/hexToRgb.mjs';

function readJsonFile(file) {
  return JSON.parse(stripJsonComments(fs.readFileSync(file, 'utf8')));
}

const lightPalette = readJsonFile(`light/palette.json`);
const lightAnsiPaletteRaw = readJsonFile(`light/ansi.json`);
const lightCodePaletteRaw = readJsonFile(`light/code.json`);
const lightUiPaletteRaw = readJsonFile(`light/ui.json`);

const darkPalette = readJsonFile(`dark/palette.json`);
const darkAnsiPaletteRaw = readJsonFile(`dark/ansi.json`);
const darkCodePaletteRaw = readJsonFile(`dark/code.json`);
const darkUiPaletteRaw = readJsonFile(`dark/ui.json`);

function getDarkDpColorName(colorName) {
  return colorName
    .replace('gray', 'purple')
    .replace(/^brightYellow$/, 'brightYellowPurple')
    .replace(/^brightYellowDim$/, 'brightYellowDimPurple');
}

// Convert ANSI color names to HEX values

const lightAnsiPalette = Object.fromEntries(
  Object.entries(lightAnsiPaletteRaw).map(([key, colorName]) => {
    if (lightPalette[colorName] === undefined) {
      console.error(`⛔️ Color not found in the light palette: ${colorName}`);
    }
    return [key, lightPalette[colorName]];
  }),
);
const darkAnsiPalette = Object.fromEntries(
  Object.entries(darkAnsiPaletteRaw).map(([key, colorName]) => {
    if (darkPalette[colorName] === undefined) {
      console.error(`⛔️ Color not found in the dark palette: ${colorName}`);
    }
    return [key, darkPalette[colorName]];
  }),
);

// Convert code color names to HEX values

const lightCodePalette = Object.fromEntries(
  Object.entries(lightCodePaletteRaw).map(([key, colorInfo]) => {
    const colorName = Array.isArray(colorInfo) ? colorInfo[0] : colorInfo;
    if (lightPalette[colorName] === undefined) {
      console.error(`⛔️ Color not found in the light palette: ${colorName}`);
    }
    return [key, lightPalette[colorName]];
  }),
);
const darkCodePalette = Object.fromEntries(
  Object.entries(darkCodePaletteRaw).map(([key, colorInfo]) => {
    const colorName = Array.isArray(colorInfo) ? colorInfo[0] : colorInfo;
    if (darkPalette[colorName] === undefined) {
      console.error(`⛔️ Color not found in the dark palette: ${colorName}`);
    }
    return [key, darkPalette[colorName]];
  }),
);

// Extract code styles

const lightCodeStyles = Object.fromEntries(
  Object.entries(lightCodePaletteRaw).map(([key, colorInfo]) => {
    const style = Array.isArray(colorInfo) ? colorInfo[1] : '';
    return [`${key}Style`, style];
  }),
);

const darkCodeStyles = Object.fromEntries(
  Object.entries(darkCodePaletteRaw).map(([key, colorInfo]) => {
    const style = Array.isArray(colorInfo) ? colorInfo[1] : '';
    return [`${key}Style`, style];
  }),
);

// Convert UI color names to HEX values

const lightUiPalette = Object.fromEntries(
  Object.entries(lightUiPaletteRaw).map(([key, colorInfo]) => {
    const colorName = Array.isArray(colorInfo) ? colorInfo[0] : colorInfo;
    if (lightPalette[colorName] === undefined) {
      console.error(`⛔️ Color not found in the light palette: ${colorName}`);
    }
    return [key, lightPalette[colorName]];
  }),
);
const darkUiPalette = Object.fromEntries(
  Object.entries(darkUiPaletteRaw).map(([key, colorInfo]) => {
    const colorName = Array.isArray(colorInfo) ? colorInfo[0] : colorInfo;
    if (darkPalette[colorName] === undefined) {
      console.error(`⛔️ Color not found in the dark palette: ${colorName}`);
    }
    return [key, darkPalette[colorName]];
  }),
);

// Create Dark Deep Purple palettes

const darkDpPalette = Object.fromEntries(
  Object.entries(darkPalette).map(([colorName]) => {
    const paletteColorName = getDarkDpColorName(colorName);
    if (darkPalette[paletteColorName] === undefined) {
      console.error(
        `⛔️ Color not found in the dark palette: ${paletteColorName}`,
      );
    }
    return [colorName, darkPalette[paletteColorName]];
  }),
);
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
    return [key, darkPalette[paletteColorName]];
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
    return [key, darkPalette[paletteColorName]];
  }),
);

// ------------ 8< -- 8< ------------

console.log();
console.log('[THEME] Preparing themes… 🌗');

const schemes = {
  light: {
    ...lightPalette,
    ...lightUiPalette,
    ...lightAnsiPalette,
    ...lightCodePalette,
    ...lightCodeStyles,
  },
  dark: {
    ...darkPalette,
    ...darkUiPalette,
    ...darkAnsiPalette,
    ...darkCodePalette,
    ...darkCodeStyles,
  },
  darkDp: {
    ...darkDpPalette,
    ...darkDpUiPalette,
    ...darkDpAnsiPalette,
    ...darkDpCodePalette,
    ...darkCodeStyles,
  },
};

const mixins = {
  terminalLight: {
    ...lightAnsiPalette,
    terminalBorder: lightUiPalette.border,
    terminalMatchBackground: lightUiPalette.matchBackground,
    terminalMatchBase: lightUiPalette.matchBase,
    terminalSelectionBase: lightUiPalette.selectionBase,
  },
  terminalDark: {
    ...darkAnsiPalette,
    terminalBorder: darkUiPalette.border,
    terminalMatchBackground: darkUiPalette.matchBackground,
    terminalMatchBase: darkUiPalette.matchBase,
    terminalSelectionBase: darkUiPalette.selectionBase,
  },
  terminalDarkDp: {
    ...darkDpAnsiPalette,
    terminalBorder: darkDpUiPalette.border,
    terminalMatchBackground: darkDpUiPalette.matchBackground,
    terminalMatchBase: darkDpUiPalette.matchBase,
    terminalSelectionBase: darkDpUiPalette.selectionBase,
  },
};

const sharedScheme = {};
for (const [key] of Object.entries(schemes.light)) {
  sharedScheme[`light:${key}`] = schemes.light[key];
  sharedScheme[`dark:${key}`] = schemes.dark[key];
  sharedScheme[`darkDp:${key}`] = schemes.darkDp[key];
}

const configs = globSync('themes/*/config.json').toSorted();

for (const configFile of configs) {
  const folder = path.dirname(configFile);
  console.log('👉', terminalLink(folder, `vscode://file//${configFile}`));
  const config = readJsonFile(configFile);

  if (Array.isArray(config.themes) === false) {
    console.error(`   🦀 The 'themes' array is missing`);
    continue;
  }

  // Find a template: any file that has `.template.` in its name
  const templateFile = globSync(path.join(folder, '*.template.*'))[0];
  if (
    templateFile === undefined &&
    config.themes.some((x) => x.file !== 'Readme.md')
  ) {
    console.error(`   🦀 Template file not found`);
    continue;
  }

  for (const theme of config.themes) {
    if (Array.isArray(config.themes) === false) {
      console.error(`   🦀 The 'file' field is missing`);
      continue;
    }
    console.log(`   ${theme.file}`);

    if (theme.scheme && schemes[theme.scheme] === undefined) {
      console.error(
        `   🦀 Scheme '${theme.scheme}' not found, possible values: ${Object.keys(schemes)}`,
      );
      continue;
    }
    if (theme.mixin && mixins[theme.mixin] === undefined) {
      console.error(
        `   🦀 Mixin '${theme.mixin}' not found, possible values: ${Object.keys(mixins)}`,
      );
      continue;
    }

    // Prepare the context: base palette + mixin + custom values
    const context = {
      ...(theme.scheme ? schemes[theme.scheme] : sharedScheme),
      ...(theme.mixin ? mixins[theme.mixin] : {}),
    };
    for (const [key, value] of Object.entries(theme.context ?? {})) {
      context[key] = context[value] ?? value;
    }

    const destFile = path.join(folder, theme.file);

    if (theme.file === 'Readme.md') {
      applyReadmeTemplate(destFile, theme.scheme ?? 'theme', context);
    } else {
      processTemplate(templateFile, destFile, context);
    }
  }
}

// ------------ 8< -- 8< ------------

console.log();
console.log('[THEME] Preparing iTerm themes… 🌚');

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

processTemplate(
  'themes/iTerm2/iterm.template.itermcolors',
  'themes/iTerm2/Squirrelsong Dark.itermcolors',
  {
    ...iTermDarkPalette,
  },
);

// ------------ 8< -- 8< ------------

console.log();
console.log('[THEME] Preparing Terminal.app themes… 🌚');

// We use the original binary base64 data string created by Terminal.app and
// patch the RGB float color values
const sampleBase64 = `
YnBsaXN0MDDUAQIDBAUGBwpYJHZlcnNpb25ZJGFyY2hpdmVyVCR0b3BYJG9iamVjdHMS
AAGGoF8QD05TS2V5ZWRBcmNoaXZlctEICVRyb290gAGjCwwTVSRudWxs0w0ODxARElVO
U1JHQlxOU0NvbG9yU3BhY2VWJGNsYXNzTxAnMC4yMDc4NDMxMzczIDAuMTY0NzA1ODgy
NCAwLjEyOTQxMTc2NDcAEAKAAtIUFRYXWiRjbGFzc25hbWVYJGNsYXNzZXNXTlNDb2xv
cqIWGFhOU09iamVjdAgRGiQpMjdJTFFTV11kand+qKqssbzFzdAAAAAAAAABAQAAAAAA
AAAZAAAAAAAAAAAAAAAAAAAA2Q==
`.trim();

function createNSKeyedArchiverColor(hexColor) {
  const [r, g, b] = hexToRgb(hexColor);

  // Decode the base64 template to a binary buffer
  const buffer = Buffer.from(sampleBase64, 'base64');

  // Convert RGB values to strings with 10 decimal places
  const rStr = (r / 255).toFixed(10);
  const gStr = (g / 255).toFixed(10);
  const bStr = (b / 255).toFixed(10);

  // Create the color string in the format `R G B`
  const colorString = `${rStr} ${gStr} ${bStr}`;

  // Find the color data in the buffer. The template contains a known RGB color
  // string, that we need to find this pattern and replace
  const templateColorString = '0.2078431373 0.1647058824 0.1294117647';
  const templateColorBytes = Buffer.from(templateColorString, 'ascii');
  const colorStringBytes = Buffer.from(colorString, 'ascii');

  // Find the position of the color string in the buffer
  const position = buffer.indexOf(templateColorBytes);

  if (position === -1) {
    throw new Error('Could not find color data in template');
  }

  // Create a new buffer with the updated color
  const newBuffer = Buffer.from(buffer);
  colorStringBytes.copy(newBuffer, position);

  // Encode back to base64 and format with proper line breaks
  const encoded = newBuffer.toString('base64');
  const formatted = encoded.match(/.{1,68}/g).join('\n\t');

  return formatted;
}

const terminalDarkColors = {};
for (const [colorName, hexColor] of Object.entries(darkAnsiPalette)) {
  terminalDarkColors[colorName] = createNSKeyedArchiverColor(hexColor);
}
for (const [colorName, hexColor] of Object.entries(darkUiPalette)) {
  terminalDarkColors[colorName] = createNSKeyedArchiverColor(hexColor);
}

const terminalDarkDpColors = {};
for (const [colorName, hexColor] of Object.entries(darkDpAnsiPalette)) {
  terminalDarkDpColors[colorName] = createNSKeyedArchiverColor(hexColor);
}
for (const [colorName, hexColor] of Object.entries(darkDpUiPalette)) {
  terminalDarkDpColors[colorName] = createNSKeyedArchiverColor(hexColor);
}

processTemplate(
  'themes/Terminal/terminal.template.terminal',
  'themes/Terminal/Squirrelsong Dark.terminal',
  {
    name: 'Dark',
    ...terminalDarkColors,
  },
);

processTemplate(
  'themes/Terminal/terminal.template.terminal',
  'themes/Terminal/Squirrelsong Dark Deep Purple.terminal',
  {
    name: 'Dark Deep Purple',
    ...terminalDarkDpColors,
  },
);
