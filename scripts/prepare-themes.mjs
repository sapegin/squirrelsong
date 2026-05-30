/**
 * Generate themes based on templates.
 */

import fs from 'node:fs';
import path from 'node:path';
import { stripJsonComments } from './util/stripJsonComments.mjs';
import { processTemplate, applyReadmeTemplate } from './util/template.mjs';
import { terminalLink } from './util/terminalLink.mjs';

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
  })
);
const darkAnsiPalette = Object.fromEntries(
  Object.entries(darkAnsiPaletteRaw).map(([key, colorName]) => {
    if (darkPalette[colorName] === undefined) {
      console.error(`⛔️ Color not found in the dark palette: ${colorName}`);
    }
    return [key, darkPalette[colorName]];
  })
);

// Convert code color names to HEX values

const lightCodePalette = Object.fromEntries(
  Object.entries(lightCodePaletteRaw).map(([key, colorInfo]) => {
    const colorName = Array.isArray(colorInfo) ? colorInfo[0] : colorInfo;
    if (lightPalette[colorName] === undefined) {
      console.error(`⛔️ Color not found in the light palette: ${colorName}`);
    }
    return [key, lightPalette[colorName]];
  })
);
const darkCodePalette = Object.fromEntries(
  Object.entries(darkCodePaletteRaw).map(([key, colorInfo]) => {
    const colorName = Array.isArray(colorInfo) ? colorInfo[0] : colorInfo;
    if (darkPalette[colorName] === undefined) {
      console.error(`⛔️ Color not found in the dark palette: ${colorName}`);
    }
    return [key, darkPalette[colorName]];
  })
);

// Extract code styles

const lightCodeStyles = Object.fromEntries(
  Object.entries(lightCodePaletteRaw).map(([key, colorInfo]) => {
    const style = Array.isArray(colorInfo) ? colorInfo[1] : '';
    return [`${key}Style`, style];
  })
);

const darkCodeStyles = Object.fromEntries(
  Object.entries(darkCodePaletteRaw).map(([key, colorInfo]) => {
    const style = Array.isArray(colorInfo) ? colorInfo[1] : '';
    return [`${key}Style`, style];
  })
);

// Convert UI color names to HEX values

const lightUiPalette = Object.fromEntries(
  Object.entries(lightUiPaletteRaw).map(([key, colorInfo]) => {
    const colorName = Array.isArray(colorInfo) ? colorInfo[0] : colorInfo;
    if (lightPalette[colorName] === undefined) {
      console.error(`⛔️ Color not found in the light palette: ${colorName}`);
    }
    return [key, lightPalette[colorName]];
  })
);
const darkUiPalette = Object.fromEntries(
  Object.entries(darkUiPaletteRaw).map(([key, colorInfo]) => {
    const colorName = Array.isArray(colorInfo) ? colorInfo[0] : colorInfo;
    if (darkPalette[colorName] === undefined) {
      console.error(`⛔️ Color not found in the dark palette: ${colorName}`);
    }
    return [key, darkPalette[colorName]];
  })
);

// Create Dark Deep Purple palettes

const darkDpPalette = Object.fromEntries(
  Object.entries(darkPalette).map(([colorName]) => {
    const paletteColorName = getDarkDpColorName(colorName);
    if (darkPalette[paletteColorName] === undefined) {
      console.error(
        `⛔️ Color not found in the dark palette: ${paletteColorName}`
      );
    }
    return [colorName, darkPalette[paletteColorName]];
  })
);
const darkDpAnsiPalette = Object.fromEntries(
  Object.entries(darkAnsiPaletteRaw).map(([key, colorName]) => {
    const paletteColorName = getDarkDpColorName(colorName);
    if (darkPalette[paletteColorName] === undefined) {
      console.error(
        `⛔️ Color not found in the dark palette: ${paletteColorName}`
      );
    }
    return [key, darkPalette[paletteColorName]];
  })
);
const darkDpCodePalette = Object.fromEntries(
  Object.entries(darkCodePaletteRaw).map(([key, colorInfo]) => {
    const colorName = Array.isArray(colorInfo) ? colorInfo[0] : colorInfo;
    const paletteColorName = getDarkDpColorName(colorName);
    if (darkPalette[paletteColorName] === undefined) {
      console.error(
        `⛔️ Color not found in the dark palette: ${paletteColorName}`
      );
    }
    return [key, darkPalette[paletteColorName]];
  })
);
const darkDpUiPalette = Object.fromEntries(
  Object.entries(darkUiPaletteRaw).map(([key, colorName]) => {
    const paletteColorName = getDarkDpColorName(colorName);
    if (darkPalette[paletteColorName] === undefined) {
      console.error(
        `⛔️ Color not found in the dark palette: ${paletteColorName}`
      );
    }
    return [key, darkPalette[paletteColorName]];
  })
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

const configs = fs.globSync('themes/*/config.json').toSorted();

for (const configFile of configs) {
  const folder = path.dirname(configFile);
  console.log(
    '👉',
    terminalLink(folder, `vscode://file//${path.resolve(configFile)}`)
  );
  const config = readJsonFile(configFile);

  if (Array.isArray(config.themes) === false) {
    console.error(`   🦀 The 'themes' array is missing`);
    continue;
  }

  // Find a template: any file that has `.template.` in its name
  const templateFile = fs.globSync(path.join(folder, '*.template.*'))[0];
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
        `   🦀 Scheme '${theme.scheme}' not found, possible values: ${Object.keys(schemes)}`
      );
      continue;
    }
    if (theme.mixin && mixins[theme.mixin] === undefined) {
      console.error(
        `   🦀 Mixin '${theme.mixin}' not found, possible values: ${Object.keys(mixins)}`
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
